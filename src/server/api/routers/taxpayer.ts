import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { TaxpayerType, UserTaxpayerRole } from "../../../../generated/prisma";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// ─── Input schemas ────────────────────────────────────────────────────────────

const createTaxpayerSchema = z.object({
  type: z.nativeEnum(TaxpayerType),
  displayName: z.string().min(1),
  tin: z.string().optional(),
  residentState: z.string().optional(),
  annualTurnover: z.number().positive().optional(),
  fixedAssetsValue: z.number().positive().optional(),
  hasVATRegistration: z.boolean().default(false),
  vatRegistrationDate: z.date().optional(),
  isMultinational: z.boolean().default(false),
});

const updateTaxpayerSchema = createTaxpayerSchema.partial().extend({
  id: z.string().cuid(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the taxpayer only if the requesting user has access to it. */
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

export const taxpayerRouter = createTRPCRouter({
  /** List all taxpayer profiles accessible by the current user. */
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.taxpayerUser.findMany({
      where: { userId: ctx.session.user.id },
      include: { taxpayer: true },
      orderBy: { createdAt: "asc" },
    });
  }),

  /** Get a single taxpayer profile (must be a member). */
  get: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      await requireTaxpayerAccess(ctx.db, input.id, ctx.session.user.id);
      return ctx.db.taxpayer.findUniqueOrThrow({ where: { id: input.id } });
    }),

  /** Create a new taxpayer profile and assign the creator as OWNER. */
  create: protectedProcedure
    .input(createTaxpayerSchema)
    .mutation(async ({ ctx, input }) => {
      const { annualTurnover, fixedAssetsValue, ...rest } = input;

      const isSmallEnterprise =
        annualTurnover !== undefined &&
        fixedAssetsValue !== undefined &&
        annualTurnover <= 100_000_000 &&
        fixedAssetsValue <= 250_000_000;

      return ctx.db.taxpayer.create({
        data: {
          ...rest,
          annualTurnover: annualTurnover ?? null,
          fixedAssetsValue: fixedAssetsValue ?? null,
          isSmallEnterprise,
          users: {
            create: {
              userId: ctx.session.user.id,
              role: UserTaxpayerRole.OWNER,
            },
          },
        },
      });
    }),

  /** Update a taxpayer profile (must be OWNER or ADMIN). */
  update: protectedProcedure
    .input(updateTaxpayerSchema)
    .mutation(async ({ ctx, input }) => {
      const membership = await requireTaxpayerAccess(
        ctx.db,
        input.id,
        ctx.session.user.id,
      );

      if (
        membership.role !== UserTaxpayerRole.OWNER &&
        membership.role !== UserTaxpayerRole.ADMIN
      ) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient role." });
      }

      const { id, annualTurnover, fixedAssetsValue, ...rest } = input;

      const isSmallEnterprise =
        annualTurnover !== undefined && fixedAssetsValue !== undefined
          ? annualTurnover <= 100_000_000 && fixedAssetsValue <= 250_000_000
          : undefined;

      return ctx.db.taxpayer.update({
        where: { id },
        data: {
          ...rest,
          ...(annualTurnover !== undefined && { annualTurnover }),
          ...(fixedAssetsValue !== undefined && { fixedAssetsValue }),
          ...(isSmallEnterprise !== undefined && { isSmallEnterprise }),
        },
      });
    }),

  /** Invite another user to a taxpayer profile. */
  addMember: protectedProcedure
    .input(
      z.object({
        taxpayerId: z.string().cuid(),
        email: z.string().email(),
        role: z.nativeEnum(UserTaxpayerRole),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const membership = await requireTaxpayerAccess(
        ctx.db,
        input.taxpayerId,
        ctx.session.user.id,
      );

      if (
        membership.role !== UserTaxpayerRole.OWNER &&
        membership.role !== UserTaxpayerRole.ADMIN
      ) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient role." });
      }

      const invitee = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (!invitee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user found with that email.",
        });
      }

      return ctx.db.taxpayerUser.create({
        data: {
          userId: invitee.id,
          taxpayerId: input.taxpayerId,
          role: input.role,
        },
      });
    }),
});
