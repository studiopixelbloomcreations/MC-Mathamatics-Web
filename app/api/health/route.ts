import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("system_settings").select("id").limit(1);
    if (error) {
      dbStatus = `degraded: ${error.message}`;
    }
  } catch (err: unknown) {
    dbStatus = `error: ${err instanceof Error ? err.message : "connection failed"}`;
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json({
    status: dbStatus === "healthy" ? "ok" : "degraded",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.round(process.uptime()) : 0,
    database: dbStatus,
    latencyMs: responseTime,
    version: "2.0.0",
  });
}
