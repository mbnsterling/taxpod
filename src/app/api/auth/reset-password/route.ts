import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "~/server/db";
import { hashPassword } from "~/server/auth/password";
import { rateLimit } from "~/server/rate-limit";

const resetSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character.",
    ),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`reset:${ip}`, { windowMs: 60_000, max: 10 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const json = await request.json().catch(() => null);

  const parsed = resetSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { token, password } = parsed.data;

  const user = await db.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  const newHash = await hashPassword(password);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newHash,
      resetPasswordToken: null,
      resetPasswordTokenExpires: null,
    },
  });

  // Note: if you later add a custom Session store, you should invalidate existing sessions here.

  return NextResponse.json({ success: true });
}

