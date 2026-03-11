import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// ─── Input schemas ────────────────────────────────────────────────────────────

const createExpenseEntrySchema = z.object({
  taxpayerId: z.string().cuid(),
  taxYear: z.number().int().min(2020).max(2100),
  occurredAt: z.date(),
  description: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("NGN"),
  isBusinessExpense: z.boolean().default(true),
  shouldHaveVAT: z.boolean().default(false),
  vatPaidAmount: z.number().min(0).optional(),
  vatDocumented: z.boolean().default(false),
  taxReturnId: z.string().cuid().optional(),
});

const updateExpenseEntrySchema = createExpenseEntrySchema
  .omit({ taxpayerId: true })
  .partial()
  .extend({ id: z.string().cuid() });

const listExpenseSchema = z.object({
  taxpayerId: z.string().cuid(),
  taxYear: z.number().int().optional(),
  isBusinessExpense: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function requireTaxpayerAccess(
  db: Parameters<Parameters<typeof protectedProcedure.query>[0]>[0]["ctx"]["db"],
  taxpayerId: string,
  userId: string,
) {
  const membership = await db.taxpayerUser.findUnique({
    where: { userId_taxpayerId: { userId, taxpayerId } },
  });
  if (!membership) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
  }
  return membership;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const expenseRouter = createTRPCRouter({
  /** Paginated list of expense entries for a taxpayer. */
  list: protectedProcedure.input(listExpenseSchema).query(async ({ ctx, input }) => {
    await requireTaxpayerAccess(ctx.db, input.taxpayerId, ctx.session.user.id);

    const where = {
      taxpayerId: input.taxpayerId,
      ...(input.taxYear && { taxYear: input.taxYear }),
      ...(input.isBusinessExpense !== undefined && {
        isBusinessExpense: input.isBusinessExpense,
      }),
    };

    const [items, total] = await Promise.all([
      ctx.db.expenseEntry.findMany({
        where,
        orderBy: { occurredAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      ctx.db.expenseEntry.count({ where }),
    ]);

    return { items, total, page: input.page, pageSize: input.pageSize };
  }),

  /** Create a new expense entry. */
  create: protectedProcedure
    .input(createExpenseEntrySchema)
    .mutation(async ({ ctx, input }) => {
      await requireTaxpayerAccess(ctx.db, input.taxpayerId, ctx.session.user.id);
      const { amount, vatPaidAmount, ...rest } = input;
      return ctx.db.expenseEntry.create({
        data: {
          ...rest,
          amount,
          vatPaidAmount: vatPaidAmount ?? null,
        },
      });
    }),

  /** Update an existing expense entry. */
  update: protectedProcedure
    .input(updateExpenseEntrySchema)
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.db.expenseEntry.findUniqueOrThrow({
        where: { id: input.id },
      });
      await requireTaxpayerAccess(ctx.db, entry.taxpayerId, ctx.session.user.id);
      const { id, amount, vatPaidAmount, ...rest } = input;
      return ctx.db.expenseEntry.update({
        where: { id },
        data: {
          ...rest,
          ...(amount !== undefined && { amount }),
          ...(vatPaidAmount !== undefined && { vatPaidAmount }),
        },
      });
    }),

  /** Delete an expense entry. */
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.db.expenseEntry.findUniqueOrThrow({
        where: { id: input.id },
      });
      await requireTaxpayerAccess(ctx.db, entry.taxpayerId, ctx.session.user.id);
      return ctx.db.expenseEntry.delete({ where: { id: input.id } });
    }),
});
