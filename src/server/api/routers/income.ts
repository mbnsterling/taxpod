import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { IncomeType, SupplyCategory } from "../../../../generated/prisma";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// ─── Input schemas ────────────────────────────────────────────────────────────

const createIncomeEntrySchema = z.object({
  taxpayerId: z.string().cuid(),
  taxYear: z.number().int().min(2020).max(2100),
  occurredAt: z.date(),
  incomeType: z.nativeEnum(IncomeType),
  description: z.string().optional(),
  grossAmount: z.number().positive(),
  currency: z.string().length(3).default("NGN"),
  isVatable: z.boolean().default(false),
  vatCollectedAmount: z.number().min(0).optional(),
  supplyCategory: z.nativeEnum(SupplyCategory).default(SupplyCategory.STANDARD),
  taxReturnId: z.string().cuid().optional(),
});

const updateIncomeEntrySchema = createIncomeEntrySchema
  .omit({ taxpayerId: true })
  .partial()
  .extend({ id: z.string().cuid() });

const listIncomeSchema = z.object({
  taxpayerId: z.string().cuid(),
  taxYear: z.number().int().optional(),
  incomeType: z.nativeEnum(IncomeType).optional(),
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

export const incomeRouter = createTRPCRouter({
  /** Paginated list of income entries for a taxpayer. */
  list: protectedProcedure.input(listIncomeSchema).query(async ({ ctx, input }) => {
    await requireTaxpayerAccess(ctx.db, input.taxpayerId, ctx.session.user.id);

    const where = {
      taxpayerId: input.taxpayerId,
      ...(input.taxYear && { taxYear: input.taxYear }),
      ...(input.incomeType && { incomeType: input.incomeType }),
    };

    const [items, total] = await Promise.all([
      ctx.db.incomeEntry.findMany({
        where,
        orderBy: { occurredAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      ctx.db.incomeEntry.count({ where }),
    ]);

    return { items, total, page: input.page, pageSize: input.pageSize };
  }),

  /** Create a new income entry. */
  create: protectedProcedure
    .input(createIncomeEntrySchema)
    .mutation(async ({ ctx, input }) => {
      await requireTaxpayerAccess(ctx.db, input.taxpayerId, ctx.session.user.id);
      const { grossAmount, vatCollectedAmount, ...rest } = input;
      return ctx.db.incomeEntry.create({
        data: {
          ...rest,
          grossAmount,
          vatCollectedAmount: vatCollectedAmount ?? null,
        },
      });
    }),

  /** Update an existing income entry (ownership via taxpayer membership). */
  update: protectedProcedure
    .input(updateIncomeEntrySchema)
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.db.incomeEntry.findUniqueOrThrow({
        where: { id: input.id },
      });
      await requireTaxpayerAccess(ctx.db, entry.taxpayerId, ctx.session.user.id);
      const { id, grossAmount, vatCollectedAmount, ...rest } = input;
      return ctx.db.incomeEntry.update({
        where: { id },
        data: {
          ...rest,
          ...(grossAmount !== undefined && { grossAmount }),
          ...(vatCollectedAmount !== undefined && { vatCollectedAmount }),
        },
      });
    }),

  /** Delete an income entry. */
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.db.incomeEntry.findUniqueOrThrow({
        where: { id: input.id },
      });
      await requireTaxpayerAccess(ctx.db, entry.taxpayerId, ctx.session.user.id);
      return ctx.db.incomeEntry.delete({ where: { id: input.id } });
    }),
});
