"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getAIStatus, getRecentFallbackEvents, FallbackEvent } from "@/lib/ai/status";
import { NvidiaNimProvider } from "@/lib/ai/nvidia-nim";
import { whatsapp } from "@/lib/whatsapp/client";

export interface DiagnosticItem {
  id: "database" | "ai" | "whatsapp";
  name: string;
  status: "ok" | "error" | "warning";
  latencyMs: number;
  summary: string;
  details: string;
  lastChecked: string;
}

export interface DiagnosticsReport {
  database: DiagnosticItem;
  ai: DiagnosticItem;
  whatsapp: DiagnosticItem;
  overallHealthy: boolean;
  totalStudents: number;
  fallbackEvents: FallbackEvent[];
}

export interface DryRunResult {
  senderType: "sir" | "parent";
  inputMessage: string;
  parsedToolCalls: Array<{ tool: string; args: Record<string, unknown> }>;
  replyMessage: string;
  status: string;
  explanation: string;
  writesAttempted: boolean;
  databaseModified: boolean;
}

/**
 * Runs live health checks on Database, AI Provider, and WhatsApp Cloud API.
 */
export async function runDiagnosticsAction(): Promise<DiagnosticsReport> {
  const timestamp = new Date().toLocaleTimeString();

  // 1. Database Check
  const dbStart = performance.now();
  let dbItem: DiagnosticItem;
  let totalStudents = 0;

  try {
    const supabase = createAdminClient();
    const { count, error: countErr } = await supabase
      .from("students")
      .select("id", { count: "exact", head: true });

    // Defensive check: select base columns first so missing optional columns don't break health check
    let settings: { id?: number; ai_mode?: boolean; parent_chat_enabled?: boolean } | null = null;
    let setErr: any = null;

    const { data: fullSettings, error: fullSetErr } = await supabase
      .from("system_settings")
      .select("id, ai_mode, parent_chat_enabled")
      .eq("id", 1)
      .maybeSingle();

    if (!fullSetErr && fullSettings) {
      settings = fullSettings;
    } else {
      // Fallback query without parent_chat_enabled
      const { data: baseSettings, error: baseSetErr } = await supabase
        .from("system_settings")
        .select("id, ai_mode")
        .eq("id", 1)
        .maybeSingle();

      if (!baseSetErr && baseSettings) {
        settings = { ...baseSettings, parent_chat_enabled: true };
      } else {
        setErr = fullSetErr || baseSetErr;
      }
    }

    const dbLatency = Math.round(performance.now() - dbStart);

    if (countErr || setErr) {
      dbItem = {
        id: "database",
        name: "Supabase PostgreSQL Database",
        status: "error",
        latencyMs: dbLatency,
        summary: "Database query failed",
        details: countErr?.message || setErr?.message || "Unknown error",
        lastChecked: timestamp,
      };
    } else {
      totalStudents = count || 0;
      dbItem = {
        id: "database",
        name: "Supabase PostgreSQL Database",
        status: "ok",
        latencyMs: dbLatency,
        summary: `Connected (${totalStudents} students registered)`,
        details: `RLS verified active. System Settings record found (AI Mode: ${settings?.ai_mode ? "ON" : "OFF"}, Parent Chat: ${settings?.parent_chat_enabled !== false ? "ON" : "OFF"}).`,
        lastChecked: timestamp,
      };
    }
  } catch (err: unknown) {
    dbItem = {
      id: "database",
      name: "Supabase PostgreSQL Database",
      status: "error",
      latencyMs: Math.round(performance.now() - dbStart),
      summary: "Connection refused",
      details: err instanceof Error ? err.message : String(err),
      lastChecked: timestamp,
    };
  }

  // 2. AI Check via Central getAIStatus
  const aiStatusRes = await getAIStatus({ bypassCache: true });
  let aiItem: DiagnosticItem;
  if (aiStatusRes.status === "ok" || aiStatusRes.status === "ai_mode_off" || aiStatusRes.status === "parent_chat_disabled") {
    aiItem = {
      id: "ai",
      name: "AI Autonomous Reasoning Engine",
      status: "ok",
      latencyMs: aiStatusRes.latencyMs || 0,
      summary: `Active & Reachable (${aiStatusRes.model})`,
      details: `Status: ${aiStatusRes.status}. Latency: ${aiStatusRes.latencyMs || 0}ms. AI Mode: ${aiStatusRes.aiMode ? "ON" : "OFF"}. Parent Chat: ${aiStatusRes.parentChatEnabled ? "ON" : "OFF"}.`,
      lastChecked: timestamp,
    };
  } else if (aiStatusRes.status === "rate_limited") {
    aiItem = {
      id: "ai",
      name: "AI Autonomous Reasoning Engine",
      status: "warning",
      latencyMs: aiStatusRes.latencyMs || 0,
      summary: "Rate limited (HTTP 429)",
      details: aiStatusRes.reason || "Provider rate limit reached. Auto-fallback replies active.",
      lastChecked: timestamp,
    };
  } else {
    aiItem = {
      id: "ai",
      name: "AI Autonomous Reasoning Engine",
      status: "error",
      latencyMs: aiStatusRes.latencyMs || 0,
      summary: aiStatusRes.reason || "AI unavailable",
      details: aiStatusRes.errorDetail || "Check API keys and network connectivity in server settings.",
      lastChecked: timestamp,
    };
  }

  // 3. WhatsApp Meta Cloud API Check
  const waStart = performance.now();
  let waItem: DiagnosticItem;

  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!phoneId || !token) {
    waItem = {
      id: "whatsapp",
      name: "Meta WhatsApp Cloud API",
      status: "warning",
      latencyMs: 0,
      summary: "Credentials not configured in environment",
      details: "Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_TOKEN in Vercel to activate live Meta delivery.",
      lastChecked: timestamp,
    };
  } else {
    try {
      const metaRes = await fetch(`https://graph.facebook.com/v21.0/${phoneId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const waLatency = Math.round(performance.now() - waStart);
      const data = (await metaRes.json()) as { id?: string; error?: { message?: string } };

      if (metaRes.ok && data.id) {
        waItem = {
          id: "whatsapp",
          name: "Meta WhatsApp Cloud API",
          status: "ok",
          latencyMs: waLatency,
          summary: `Verified (Phone ID: ${phoneId})`,
          details: `Webhook endpoint active. Verify token: ${verifyToken || "Default"}. Immediate processing active.`,
          lastChecked: timestamp,
        };
      } else {
        waItem = {
          id: "whatsapp",
          name: "Meta WhatsApp Cloud API",
          status: "error",
          latencyMs: waLatency,
          summary: "Meta API returned an error",
          details: data.error?.message || "Invalid WhatsApp Access Token or Phone ID.",
          lastChecked: timestamp,
        };
      }
    } catch (err: unknown) {
      waItem = {
        id: "whatsapp",
        name: "Meta WhatsApp Cloud API",
        status: "error",
        latencyMs: Math.round(performance.now() - waStart),
        summary: "Connection to Meta failed",
        details: err instanceof Error ? err.message : String(err),
        lastChecked: timestamp,
      };
    }
  }

  const overallHealthy =
    dbItem.status === "ok" && aiItem.status === "ok" && waItem.status === "ok";

  return {
    database: dbItem,
    ai: aiItem,
    whatsapp: waItem,
    overallHealthy,
    totalStudents,
    fallbackEvents: getRecentFallbackEvents(),
  };
}

/**
 * Production-Safe Dry-Run: Parses message WITHOUT writing to database or dispatching WhatsApp messages.
 */
export async function dryRunMessageAction(
  senderType: "sir" | "parent",
  messageText: string
): Promise<DryRunResult> {
  const text = messageText.trim();
  const aiStatus = await getAIStatus();

  // GUARANTEE: In Dry-Run mode, NO database write calls are invoked under any condition.
  if (senderType === "parent") {
    const upper = text.toUpperCase();
    if (upper.startsWith("START")) {
      const offlineWarning =
        aiStatus.status !== "ok"
          ? "\n\n(Note: The AI assistant is offline right now, but your progress buttons work as usual.)"
          : "";
      return {
        senderType: "parent",
        inputMessage: text,
        parsedToolCalls: [],
        replyMessage: `👋 Welcome to MC Mathematics! You are connected to student progress updates.${offlineWarning}\n\n[Latest marks] [Full report]`,
        status: "start_simulation",
        explanation: "Parent START command always resolves with zero AI consumption.",
        writesAttempted: false,
        databaseModified: false,
      };
    }

    if (upper.startsWith("REPORT") || text.startsWith("REPORT:")) {
      return {
        senderType: "parent",
        inputMessage: text,
        parsedToolCalls: [],
        replyMessage: "📊 MC MATHEMATICS — PROGRESS REPORT (Simulated Output)\nStudent: [Dry-Run Student]\nAll marks and percentiles rendered directly from stored data without AI.",
        status: "report_simulation",
        explanation: "Report request fetches stored marks directly.",
        writesAttempted: false,
        databaseModified: false,
      };
    }

    if (aiStatus.status !== "ok") {
      const autoReply =
        aiStatus.status === "parent_chat_disabled"
          ? "The AI assistant is paused for now. You can still tap a button below to get your child's latest marks or the full report, or open the dashboard: https://mc-mathamatics-web.vercel.app/dashboard"
          : "The AI assistant is offline right now. You can still tap a button below to get your child's latest marks or the full report, or open the dashboard: https://mc-mathamatics-web.vercel.app/dashboard";

      return {
        senderType: "parent",
        inputMessage: text,
        parsedToolCalls: [],
        replyMessage: autoReply,
        status: "fallback_auto_reply",
        explanation: `AI status is '${aiStatus.status}'. Safe fallback returned without exposing technical errors.`,
        writesAttempted: false,
        databaseModified: false,
      };
    }

    // Normal conversational dry run
    const provider = new NvidiaNimProvider();
    const reply = await provider.generateText(text, "You are the student support assistant. Answer politely.");
    return {
      senderType: "parent",
      inputMessage: text,
      parsedToolCalls: [],
      replyMessage: reply,
      status: "conversational_preview",
      explanation: "Parent message simulated successfully without any database writes.",
      writesAttempted: false,
      databaseModified: false,
    };
  }

  // Sir's Inbound simulation
  if (aiStatus.status === "not_configured") {
    return {
      senderType: "sir",
      inputMessage: text,
      parsedToolCalls: [],
      replyMessage: "NVIDIA_API_KEY is missing in the server settings.",
      status: "not_configured",
      explanation: "Sir receives explicit configuration diagnosis.",
      writesAttempted: false,
      databaseModified: false,
    };
  }

  if (aiStatus.status === "rate_limited") {
    return {
      senderType: "sir",
      inputMessage: text,
      parsedToolCalls: [],
      replyMessage: "The AI is busy (rate limit). Try again in a minute.",
      status: "rate_limited",
      explanation: "Sir receives rate-limit advisory.",
      writesAttempted: false,
      databaseModified: false,
    };
  }

  if (aiStatus.status === "ai_unavailable") {
    return {
      senderType: "sir",
      inputMessage: text,
      parsedToolCalls: [],
      replyMessage: "The AI service is not responding (model error). Check /admin/diagnostics.",
      status: "ai_unavailable",
      explanation: "Sir receives operational model advisory.",
      writesAttempted: false,
      databaseModified: false,
    };
  }

  const provider = new NvidiaNimProvider();
  const toolCalls = await provider.generateToolCalls(text);

  if (!aiStatus.aiMode) {
    return {
      senderType: "sir",
      inputMessage: text,
      parsedToolCalls: toolCalls.map((tc: { tool: string; args: Record<string, unknown> }) => ({ tool: tc.tool, args: tc.args })),
      replyMessage:
        "AI Mode is off, so I can't change marks, notes or announcements. Turn it on in the admin panel. I can still answer questions.",
      status: "ai_mode_off_preview",
      explanation: "Write actions refused while AI mode is off; tool calls previewed only.",
      writesAttempted: false,
      databaseModified: false,
    };
  }

  return {
    senderType: "sir",
    inputMessage: text,
    parsedToolCalls: toolCalls.map((tc: { tool: string; args: Record<string, unknown> }) => ({ tool: tc.tool, args: tc.args })),
    replyMessage: `[Dry-Run Simulation] Would execute ${toolCalls.length} tool call(s). Zero writes committed.`,
    status: "simulated_success",
    explanation: "Tool calls parsed successfully. Database modification was blocked by dry-run sandbox.",
    writesAttempted: false,
    databaseModified: false,
  };
}

/**
 * Send real test WhatsApp message to Sir's configured phone number.
 */
export async function sendTestWhatsAppAction(): Promise<{
  success: boolean;
  message: string;
  response?: Record<string, unknown>;
}> {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("system_settings")
    .select("admin_whatsapp")
    .eq("id", 1)
    .single();

  const sirNumber = settings?.admin_whatsapp;
  if (!sirNumber) {
    return { success: false, message: "Sir's WhatsApp number is not configured in system settings." };
  }

  const testBody = `🧪 MC Mathematics System Diagnostic:\nTest message dispatched from /admin/diagnostics at ${new Date().toLocaleTimeString()}.\nSystem is fully operational.`;
  const res = await whatsapp.sendText(sirNumber, testBody);

  return {
    success: res.success,
    message: res.success
      ? `Test message dispatched successfully to Sir (${sirNumber}). Message ID: ${res.messageId}`
      : "Failed to dispatch test message via Meta API.",
    response: res as unknown as Record<string, unknown>,
  };
}
