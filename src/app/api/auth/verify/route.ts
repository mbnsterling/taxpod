import { NextResponse } from "next/server";

import { db } from "~/server/db";

export async function POST(request: Request) {
  const { token } = (await request.json().catch(() => null)) ?? {};

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid token." },
      { status: 400 },
    );
  }

  const user = await db.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Verification link is invalid or has expired." },
      { status: 400 },
    );
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });

  return NextResponse.json({ success: true });
}

