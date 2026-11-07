import { NextRequest, NextResponse } from "next/server";
import { processPendingInboundMessages } from "@/lib/ai/processor";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  const expectedSecret = process.env.INTERNAL_PROCESS_SECRET || "internal_secret_key";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const processedCount = await processPendingInboundMessages();
  return NextResponse.json({ processed: processedCount });
}
