import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  TaxType,
  PeriodType,
  ReturnStatus,
  PaymentMethod,
  Prisma,
} from "../../../../generated/prisma";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// ─── Input schemas ────────────────────────────────────────────────────────────

const createTaxReturnSchema = z.object({
  taxpayerId: z.string().cuid(),
  taxType: z.nativeEnum(TaxType),
  periodType: z.nativeEnum(PeriodType),
  taxYear: z.number().int().min(2020).max(2100),
  periodStart: z.date(),
  periodEnd: z.date(),
});

const updateTaxReturnSchema = z.object({
  id: z.string().cuid(),
  status: z.nativeEnum(ReturnStatus).optional(),
  filedAt: z.date().optional(),
  reference: z.string().optional(),
  summaryJson: z.custom<Prisma.InputJsonValue>().optional(),
});

const listTaxReturnsSchema = z.object({
  taxpayerId: z.string().cuid(),
  taxType: z.nativeEnum(TaxType).optional(),
  taxYear: z.number().int().optional(),
  status: z.nativeEnum(ReturnStatus).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

const createPaymentSchema = z.object({
  taxReturnId: z.string().cuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("NGN"),
  method: z.nativeEnum(PaymentMethod),
  providerReference: z.string().optional(),
  metadata: z.custom<Prisma.InputJsonValue>().optional(),
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

export const filingRouter = createTRPCRouter({
  // ── Tax Returns ──────────────────────────────────────────────────────────────

  /** Paginated list of tax returns for a taxpayer. */
  listReturns: protectedProcedure
    .input(listTaxReturnsSchema)
    .query(async ({ ctx, input }) => {
      await requireTaxpayerAccess(ctx.db, input.taxpayerId, ctx.session.user.id);

      const where = {
        taxpayerId: input.taxpayerId,
        ...(input.taxType && { taxType: input.taxType }),
        ...(input.taxYear && { taxYear: input.taxYear }),
        ...(input.status && { status: input.status }),
      };

      const [items, total] = await Promise.all([
        ctx.db.taxReturn.findMany({
          where,
          orderBy: [{ taxYear: "desc" }, { periodStart: "desc" }],
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          include: { payments: true },
        }),
        ctx.db.taxReturn.count({ where }),
      ]);

      return { items, total, page: input.page, pageSize: input.pageSize };
    }),

  /** Get a single tax return with full details. */
  getReturn: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const taxReturn = await ctx.db.taxReturn.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          incomeEntries: true,
          expenseEntries: true,
          payments: true,
        },
      });
      await requireTaxpayerAccess(
        ctx.db,
        taxReturn.taxpayerId,
        ctx.session.user.id,
      );
      return taxReturn;
    }),

  /** Create a new tax return in DRAFT status. */
  createReturn: protectedProcedure
    .input(createTaxReturnSchema)
    .mutation(async ({ ctx, input }) => {
      await requireTaxpayerAccess(ctx.db, input.taxpayerId, ctx.session.user.id);
      return ctx.db.taxReturn.create({ data: input });
    }),

  /** Update status, reference, or computed summary of a tax return. */
  updateReturn: protectedProcedure
    .input(updateTaxReturnSchema)
    .mutation(async ({ ctx, input }) => {
      const taxReturn = await ctx.db.taxReturn.findUniqueOrThrow({
        where: { id: input.id },
      });
      await requireTaxpayerAccess(
        ctx.db,
        taxReturn.taxpayerId,
        ctx.session.user.id,
      );

      if (taxReturn.status === ReturnStatus.FILED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A filed return cannot be modified. Create an amendment instead.",
        });
      }

      const { id, ...data } = input;
      return ctx.db.taxReturn.update({ where: { id }, data });
    }),

  /** Mark a tax return as FILED and record the filing timestamp. */
  fileReturn: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const taxReturn = await ctx.db.taxReturn.findUniqueOrThrow({
        where: { id: input.id },
      });
      await requireTaxpayerAccess(
        ctx.db,
        taxReturn.taxpayerId,
        ctx.session.user.id,
      );

      if (taxReturn.status === ReturnStatus.FILED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Return has already been filed.",
        });
      }

      return ctx.db.taxReturn.update({
        where: { id: input.id },
        data: { status: ReturnStatus.FILED, filedAt: new Date() },
      });
    }),

  // ── Payments ─────────────────────────────────────────────────────────────────

  /** Record a payment against a tax return. */
  createPayment: protectedProcedure
    .input(createPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      const taxReturn = await ctx.db.taxReturn.findUniqueOrThrow({
        where: { id: input.taxReturnId },
      });
      await requireTaxpayerAccess(
        ctx.db,
        taxReturn.taxpayerId,
        ctx.session.user.id,
      );

      const { amount, metadata, ...rest } = input;
      return ctx.db.taxPayment.create({
        data: {
          ...rest,
          amount,
          ...(metadata !== undefined && { metadata }),
        },
      });
    }),

  /** List payments for a tax return. */
  listPayments: protectedProcedure
    .input(z.object({ taxReturnId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const taxReturn = await ctx.db.taxReturn.findUniqueOrThrow({
        where: { id: input.taxReturnId },
      });
      await requireTaxpayerAccess(
        ctx.db,
        taxReturn.taxpayerId,
        ctx.session.user.id,
      );
      return ctx.db.taxPayment.findMany({
        where: { taxReturnId: input.taxReturnId },
        orderBy: { createdAt: "desc" },
      });
    }),
});
