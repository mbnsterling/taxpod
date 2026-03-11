import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

import { db } from "~/server/db";
import { rateLimit } from "~/server/rate-limit";
import {
  buildResetPasswordEmail,
  sendEmail,
} from "~/server/email";

const forgotSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`forgot:${ip}`, { windowMs: 60_000, max: 10 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const json = await request.json().catch(() => null);

  const parsed = forgotSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Respond with generic message to avoid account enumeration.
    return NextResponse.json({ success: true });
  }

  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
  const resetPasswordTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await db.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken,
      resetPasswordTokenExpires,
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";

  const resetUrl = `${baseUrl}/reset-password?token=${resetPasswordToken}`;

  const { subject, html } = buildResetPasswordEmail({
    resetUrl,
    userEmail: email,
  });

  await sendEmail({
    to: email,
    subject,
    html,
  });

  return NextResponse.json({ success: true });
}

