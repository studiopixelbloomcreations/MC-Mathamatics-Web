import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { normalizeSriLankanPhone } from "@/lib/whatsapp/phone";
import { handleParentMessage } from "@/lib/whatsapp/parent-bot";
import crypto from "crypto";

/**
 * Meta Webhook Verification (GET)
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || "mc_maths_verify_token";

  if (mode === "subscribe" && token === expectedToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * Meta Webhook Inbound Ingestion (POST)
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256") || "";

  // 1. Verify X-Hub-Signature-256 if WHATSAPP_APP_SECRET is set
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (appSecret) {
    const hmac = crypto.createHmac("sha256", appSecret);
    const expected = `sha256=${hmac.update(rawBody).digest("hex")}`;
    if (signature !== expected) {
      console.warn("[Webhook] Invalid HMAC signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle status delivery updates (sent, delivered, read)
  const entry = payload?.entry?.[0];
  const changes = entry?.changes?.[0]?.value;

  if (changes?.statuses && Array.isArray(changes.statuses)) {
    const statusObj = changes.statuses[0];
    const waMessageId = statusObj.id;
    const deliveryStatus = statusObj.status; // delivered, read, failed

    const supabase = createAdminClient();
    await supabase
      .from("report_deliveries")
      .update({ status: deliveryStatus })
      .eq("wa_message_id", waMessageId);

    return NextResponse.json({ received: true });
  }

  // Handle inbound incoming message
  const message = changes?.messages?.[0];
  if (!message) {
    return NextResponse.json({ received: true });
  }

  const fromNumber = normalizeSriLankanPhone(message.from) || message.from;
  const waMessageId = message.id;
  const textBody =
    message.text?.body ||
    message.interactive?.button_reply?.id ||
    message.interactive?.list_reply?.id ||
    "";

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

  // 3. Routing: Sir's Number vs Parent Bot
  const { data: settings } = await supabase
    .from("system_settings")
    .select("ai_mode, admin_whatsapp")
    .eq("id", 1)
    .single();

  const adminNumber =
    normalizeSriLankanPhone(settings?.admin_whatsapp || "+94771234567") || "+94771234567";

  if (fromNumber === adminNumber) {
    // Sir's number -> Asynchronously trigger /api/ai/process
    const internalSecret = process.env.INTERNAL_PROCESS_SECRET || "internal_secret_key";
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";

    fetch(`${protocol}://${host}/api/ai/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": internalSecret,
      },
      body: JSON.stringify({ waMessageId }),
    }).catch((err) => console.error("[Webhook] Background process trigger failed:", err));
  } else {
    // Non-admin number -> Direct to Parent Bot
    handleParentMessage(fromNumber, textBody).catch((err) =>
      console.error("[Parent Bot execution error]", err)
    );
  }

  // Return HTTP 200 immediately to Meta
  return NextResponse.json({ received: true });
}
