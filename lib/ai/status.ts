import { createAdminClient } from "@/lib/supabase/server";

export type AIStatusValue =
  | "ok"
  | "ai_mode_off"
  | "parent_chat_disabled"
  | "ai_unavailable"
  | "rate_limited"
  | "not_configured";

export interface AIStatusResult {
  status: AIStatusValue;
  aiMode: boolean;
  parentChatEnabled: boolean;
  isWhatsAppConfigured: boolean;
  model: string;
  latencyMs?: number;
  reason?: string;
  errorDetail?: string;
  circuitBreakerOpen: boolean;
}

export interface FallbackEvent {
  timestamp: string;
  reason: string;
  maskedSender: string;
  status: AIStatusValue;
}

// In-memory state for circuit breaker, caching, fallback history, and throttle tracking
interface CircuitBreakerState {
  failureTimestamps: number[];
  trippedUntil: number; // timestamp until which circuit is open
}

const circuitBreaker: CircuitBreakerState = {
  failureTimestamps: [],
  trippedUntil: 0,
};

let cachedHealth: {
  result: { ok: boolean; latencyMs?: number; error?: string; status?: AIStatusValue };
  timestamp: number;
} | null = null;

// Throttling for Parent auto-reply: 30 minutes per parent phone
const parentAutoReplyThrottle = new Map<string, number>();

// Throttling for Sir's outage notice: at most once per hour
let lastSirOutageNoticeSentAt = 0;

// Last 20 fallback events
const recentFallbackEvents: FallbackEvent[] = [];

/**
 * Record a failure in the circuit breaker.
 * 3 failures within 60s -> opens for 2 minutes (120s).
 */
export function recordAIFailure(error: string, status: AIStatusValue = "ai_unavailable") {
  const now = Date.now();
  circuitBreaker.failureTimestamps.push(now);
  // Keep only failures in the last 60 seconds
  circuitBreaker.failureTimestamps = circuitBreaker.failureTimestamps.filter((t) => now - t <= 60000);

  if (circuitBreaker.failureTimestamps.length >= 3) {
    circuitBreaker.trippedUntil = now + 120000; // 2 minutes
    console.warn(`[AI Circuit Breaker] Tripped until ${new Date(circuitBreaker.trippedUntil).toISOString()} due to: ${error}`);
  }
}

/**
 * Record a success to help heal the circuit breaker once cooldown passes.
 */
export function recordAISuccess() {
  if (Date.now() > circuitBreaker.trippedUntil) {
    circuitBreaker.failureTimestamps = [];
    circuitBreaker.trippedUntil = 0;
  }
}

/**
 * Record a fallback reply event for the diagnostics audit trail (capped at 20).
 */
export function recordFallbackEvent(senderPhone: string, reason: string, status: AIStatusValue) {
  // Mask phone e.g. +94771234567 -> +9477****567
  const cleaned = senderPhone.trim();
  const masked =
    cleaned.length > 7
      ? `${cleaned.slice(0, 5)}****${cleaned.slice(-3)}`
      : `${cleaned.slice(0, 2)}****`;

  recentFallbackEvents.unshift({
    timestamp: new Date().toISOString(),
    reason,
    maskedSender: masked,
    status,
  });

  if (recentFallbackEvents.length > 20) {
    recentFallbackEvents.pop();
  }
}

export function getRecentFallbackEvents(): FallbackEvent[] {
  return [...recentFallbackEvents];
}

/**
 * Check if a parent auto-reply is throttled (30 minute window).
 * If not throttled, records current timestamp and returns false (i.e. ok to send).
 */
export function isParentAutoReplyThrottled(parentPhone: string): boolean {
  const now = Date.now();
  const lastSent = parentAutoReplyThrottle.get(parentPhone) || 0;
  if (now - lastSent < 30 * 60 * 1000) {
    return true;
  }
  parentAutoReplyThrottle.set(parentPhone, now);
  return false;
}

/**
 * Check if Sir outage notice should be sent (1 hour throttle).
 */
export function shouldSendSirOutageNotice(): boolean {
  const now = Date.now();
  if (now - lastSirOutageNoticeSentAt >= 60 * 60 * 1000) {
    lastSirOutageNoticeSentAt = now;
    return true;
  }
  return false;
}

/**
 * Reset test caches/state (for unit testing)
 */
export function _resetAIStatusState() {
  circuitBreaker.failureTimestamps = [];
  circuitBreaker.trippedUntil = 0;
  cachedHealth = null;
  parentAutoReplyThrottle.clear();
  lastSirOutageNoticeSentAt = 0;
  recentFallbackEvents.length = 0;
}

/**
 * Central AI Status Resolver.
 * Decides whether the AI is ok, ai_mode_off, parent_chat_disabled, ai_unavailable, rate_limited, or not_configured.
 */
export async function getAIStatus(options?: { bypassCache?: boolean }): Promise<AIStatusResult> {
  const apiKey = process.env.NVIDIA_API_KEY || process.env.NVIDIA_NIM_API_KEY || process.env.AI_API_KEY;
  const baseURL = process.env.NVIDIA_BASE_URL || process.env.AI_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const model = process.env.NVIDIA_MODEL || process.env.AI_MODEL || "nvidia/nemotron-3.5-bolt-e4b";

  const waToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const isWhatsAppConfigured = Boolean(waToken && waPhoneId);

  // 1. Check if AI keys are configured
  if (!apiKey || !baseURL || !model) {
    return {
      status: "not_configured",
      aiMode: false,
      parentChatEnabled: false,
      isWhatsAppConfigured,
      model: model || "none",
      reason: "Missing NVIDIA API Key, Base URL, or Model configuration",
      circuitBreakerOpen: false,
    };
  }

  // 2. Query system settings from Supabase
  let aiMode = false;
  let parentChatEnabled = true;
  try {
    const supabase = createAdminClient();
    const { data: fullSettings, error: fullErr } = await supabase
      .from("system_settings")
      .select("ai_mode, parent_chat_enabled")
      .eq("id", 1)
      .maybeSingle();

    if (!fullErr && fullSettings) {
      aiMode = Boolean(fullSettings.ai_mode);
      parentChatEnabled = fullSettings.parent_chat_enabled !== false;
    } else {
      const { data: baseSettings } = await supabase
        .from("system_settings")
        .select("ai_mode")
        .eq("id", 1)
        .maybeSingle();
      if (baseSettings) {
        aiMode = Boolean(baseSettings.ai_mode);
        parentChatEnabled = true;
      }
    }
  } catch (err: unknown) {
    console.error("[getAIStatus] Error fetching system_settings:", err);
  }

  // 3. Circuit breaker check
  const now = Date.now();
  const isCircuitOpen = now < circuitBreaker.trippedUntil;
  if (isCircuitOpen) {
    const remainingSec = Math.ceil((circuitBreaker.trippedUntil - now) / 1000);
    return {
      status: "ai_unavailable",
      aiMode,
      parentChatEnabled,
      isWhatsAppConfigured,
      model,
      reason: `Circuit breaker active (${remainingSec}s remaining)`,
      errorDetail: "AI service temporarily tripped due to repeated failures",
      circuitBreakerOpen: true,
    };
  }

  // 4. Cached health check call (60s TTL)
  if (!options?.bypassCache && cachedHealth && now - cachedHealth.timestamp < 60000) {
    const { ok, latencyMs, error, status } = cachedHealth.result;
    if (!ok) {
      return {
        status: status || "ai_unavailable",
        aiMode,
        parentChatEnabled,
        isWhatsAppConfigured,
        model,
        latencyMs,
        reason: error || "Health check failed",
        errorDetail: error,
        circuitBreakerOpen: false,
      };
    }

    // Health call succeeded: determine final operational status
    return resolveOperationalStatus(aiMode, parentChatEnabled, isWhatsAppConfigured, model, latencyMs);
  }

  // 5. Perform tiny test health call
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 2,
        temperature: 0.1,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const latency = Date.now() - start;

    if (res.status === 429) {
      recordAIFailure("Rate limit hit (429)", "rate_limited");
      cachedHealth = {
        result: { ok: false, latencyMs: latency, error: "HTTP 429 Rate Limited", status: "rate_limited" },
        timestamp: now,
      };
      return {
        status: "rate_limited",
        aiMode,
        parentChatEnabled,
        isWhatsAppConfigured,
        model,
        latencyMs: latency,
        reason: "NVIDIA NIM Rate limit reached",
        errorDetail: "HTTP 429",
        circuitBreakerOpen: false,
      };
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      recordAIFailure(`HTTP ${res.status}: ${errorText}`, "ai_unavailable");
      cachedHealth = {
        result: { ok: false, latencyMs: latency, error: `HTTP ${res.status}: ${errorText}`, status: "ai_unavailable" },
        timestamp: now,
      };
      return {
        status: "ai_unavailable",
        aiMode,
        parentChatEnabled,
        isWhatsAppConfigured,
        model,
        latencyMs: latency,
        reason: `Model provider returned error HTTP ${res.status}`,
        errorDetail: errorText.slice(0, 150),
        circuitBreakerOpen: false,
      };
    }

    // Success!
    recordAISuccess();
    cachedHealth = {
      result: { ok: true, latencyMs: latency },
      timestamp: now,
    };

    return resolveOperationalStatus(aiMode, parentChatEnabled, isWhatsAppConfigured, model, latency);
  } catch (err: unknown) {
    const latency = Date.now() - start;
    const errorMsg = err instanceof Error ? err.message : String(err);
    recordAIFailure(errorMsg, "ai_unavailable");
    cachedHealth = {
      result: { ok: false, latencyMs: latency, error: errorMsg, status: "ai_unavailable" },
      timestamp: now,
    };

    return {
      status: "ai_unavailable",
      aiMode,
      parentChatEnabled,
      isWhatsAppConfigured,
      model,
      latencyMs: latency,
      reason: "Could not reach AI provider (network or timeout)",
      errorDetail: errorMsg,
      circuitBreakerOpen: false,
    };
  }
}

function resolveOperationalStatus(
  aiMode: boolean,
  parentChatEnabled: boolean,
  isWhatsAppConfigured: boolean,
  model: string,
  latencyMs?: number
): AIStatusResult {
  if (!parentChatEnabled) {
    return {
      status: "parent_chat_disabled",
      aiMode,
      parentChatEnabled,
      isWhatsAppConfigured,
      model,
      latencyMs,
      reason: "Parent AI chat toggle is disabled",
      circuitBreakerOpen: false,
    };
  }

  if (!aiMode) {
    return {
      status: "ai_mode_off",
      aiMode,
      parentChatEnabled,
      isWhatsAppConfigured,
      model,
      latencyMs,
      reason: "Autonomous AI Mode is switched off",
      circuitBreakerOpen: false,
    };
  }

  return {
    status: "ok",
    aiMode,
    parentChatEnabled,
    isWhatsAppConfigured,
    model,
    latencyMs,
    circuitBreakerOpen: false,
  };
}
