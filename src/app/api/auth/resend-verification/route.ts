import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

import { db } from "~/server/db";
import { rateLimit } from "~/server/rate-limit";
import { buildVerificationEmail, sendEmail } from "~/server/email";

const resendSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`resend-verification:${ip}`, {
    windowMs: 60_000,
    max: 5,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = resendSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const { email } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });

  // Return generic success when no account found to prevent email enumeration
  if (!user) {
    return NextResponse.json({ success: true });
  }

  if (user.emailVerified) {
    return NextResponse.json(
      { error: "This email address is already verified." },
      { status: 400 },
    );
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await db.user.update({
    where: { id: user.id },
    data: { verificationToken, verificationTokenExpires },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const verifyUrl = `${baseUrl}/verify?token=${verificationToken}`;

  const { subject, html } = buildVerificationEmail({
    verifyUrl,
    userEmail: email,
  });

  await sendEmail({ to: email, subject, html });

  return NextResponse.json({ success: true });
}
