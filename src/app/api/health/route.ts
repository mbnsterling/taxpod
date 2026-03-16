import { db } from "~/server/db";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", db: "connected" }, { status: 200 });
  } catch {
    return Response.json(
      { status: "error", db: "unreachable" },
      { status: 503 },
    );
  }
}
