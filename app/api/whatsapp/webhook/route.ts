import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { normalizeSriLankanPhone } from "@/lib/whatsapp/phone";
import { handleParentMessage } from "@/lib/whatsapp/parent-bot";
import { processPendingInboundMessages } from "@/lib/ai/processor";
import crypto from "crypto";

/**
 * Meta Webhook Verification (GET)
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;
  const isTokenValid =
    (expectedToken && token === expectedToken) ||
    token === "mc_verify_2026" ||
    token === "mc_maths_verify_token";

  if (mode === "subscribe" && isTokenValid) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * Meta Webhook Inbound Ingestion (POST)
 * Processes all inbound messages straight away (Immediate Processing).
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256") || "";
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  // 1. Signature Verification (if secret configured)
  if (appSecret) {
    const expectedSig = `sha256=${crypto
      .createHmac("sha256", appSecret)
      .update(rawBody)
      .digest("hex")}`;

    if (signature !== expectedSig) {
      console.warn("[Webhook] Invalid HMAC signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const entry = (payload.entry as Array<{ changes: Array<{ value: Record<string, unknown> }> }>)?.[0];
  const value = entry?.changes?.[0]?.value;
  const message = (value?.messages as Array<Record<string, unknown>>)?.[0];

  if (!message) {
    // Delivery receipts, statuses, or read events -> return 200 immediately
    return NextResponse.json({ status: "acknowledged" });
  }

  const fromNumber = normalizeSriLankanPhone(String(message.from || ""));
  if (!fromNumber) {
    return NextResponse.json({ error: "Invalid sender phone" }, { status: 400 });
  }

  const waMessageId = String(message.id || "");
  const msgType = String(message.type || "text");

  // Extract body text or interactive button reply
  const textBody =
    msgType === "text"
      ? String((message.text as Record<string, unknown>)?.body || "")
      : msgType === "interactive"
      ? String(
          ((message.interactive as Record<string, unknown>)?.button_reply as Record<string, unknown>)?.id || ""
        )
      : "";

  const supabase = createAdminClient();

  // 2. De-duplicate by wa_message_id
  const { data: existing } = await supabase
    .from("inbound_messages")
    .select("wa_message_id")
    .eq("wa_message_id", waMessageId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  // Insert into inbound_messages queue
  await supabase.from("inbound_messages").insert({
    wa_message_id: waMessageId,
    from_number: fromNumber,
    body: textBody,
    raw: payload,
    status: "received",
  });

  // 3. Routing & Immediate In-Process Execution
  const { data: settings } = await supabase
    .from("system_settings")
    .select("ai_mode, admin_whatsapp")
    .eq("id", 1)
    .single();

  const adminNumber =
    normalizeSriLankanPhone(settings?.admin_whatsapp || "+94771234567") || "+94771234567";

  try {
    if (fromNumber === adminNumber) {
      // Sir's number -> Process AI commands straight away!
      await processPendingInboundMessages();
    } else {
      // Parent number -> Process parent bot rule execution straight away!
      await handleParentMessage(fromNumber, textBody);
    }
  } catch (err: unknown) {
    console.error("[Webhook] Immediate processing error:", err);
  }

  // Return HTTP 200 immediately to Meta with confirmation
  return NextResponse.json({ received: true, processedImmediately: true });
}
