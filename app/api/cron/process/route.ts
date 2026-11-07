import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const internalSecret = process.env.INTERNAL_PROCESS_SECRET || "internal_secret_key";
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";

  try {
    const res = await fetch(`${protocol}://${host}/api/ai/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": internalSecret,
      },
    });

    const data = await res.json();
    return NextResponse.json({ cron: "success", result: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Cron trigger failed";
    return NextResponse.json({ cron: "error", message: errorMsg }, { status: 500 });
  }
}
