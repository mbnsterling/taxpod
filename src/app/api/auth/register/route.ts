import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

import { db } from "~/server/db";
import { hashPassword } from "~/server/auth/password";
import { rateLimit } from "~/server/rate-limit";
import {
  buildVerificationEmail,
  sendEmail,
} from "~/server/email";

const registerSchema = z.object({
  email: z.string().email(),
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
  name: z.string().min(1).max(120),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`register:${ip}`, { windowMs: 60_000, max: 10 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const json = await request.json().catch(() => null);

  const parsed = registerSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { email, password, name } = parsed.data;

  const existing = await db.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      {
        error: "Email already in use",
        fieldErrors: { email: ["An account already exists for this email."] },
      },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(password);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";

  const verifyUrl = `${baseUrl}/verify?token=${verificationToken}`;

  await db.user.create({
    data: {
      email,
      name,
      passwordHash,
      emailVerified: null,
      verificationToken,
      verificationTokenExpires,
    },
  });

  const { subject, html } = buildVerificationEmail({
    verifyUrl,
    userEmail: email,
  });

  await sendEmail({
    to: email,
    subject,
    html,
  });

  return NextResponse.json(
    {
      success: true,
    },
    { status: 201 },
  );
}

