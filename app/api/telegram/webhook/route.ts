import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { telegramAdapter } from "@/lib/channels/telegram";
import { handleTelegramParentMessage } from "@/lib/channels/telegram-parent-bot";
import { processPendingInboundMessages } from "@/lib/ai/processor";

/**
 * Telegram Bot Webhook (POST /api/telegram/webhook)
 * Handles updates from Telegram Bot API with immediate in-process execution.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // 1. Secret verification
  const isValidSecret = await telegramAdapter.verifyWebhook(req, rawBody);
  if (!isValidSecret) {
    console.warn("[Telegram Webhook] Secret token validation failed");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse payload into normalized format
  const inbound = await telegramAdapter.parseInbound(rawBody);
  if (!inbound) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const supabase = createAdminClient();

  // 3. De-duplicate by update_id / messageId
  const { data: existing } = await supabase
    .from("inbound_messages")
    .select("wa_message_id")
    .eq("wa_message_id", inbound.messageId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, deduplicated: true });
  }

  // Record inbound message
  await supabase.from("inbound_messages").insert({
    wa_message_id: inbound.messageId,
    from_number: inbound.senderId,
    body: inbound.text,
    raw: {
      ...((inbound.raw as object) || {}),
      channel: "telegram",
      replyTarget: inbound.replyTarget,
    },
    status: "received",
  });

  // 4. Identify sender: Sir vs Parent
  const { data: settings } = await supabase
    .from("system_settings")
    .select("ai_mode, admin_telegram_id, admin_whatsapp")
    .eq("id", 1)
    .single();

  const adminTelegramId = (settings as any)?.admin_telegram_id || process.env.ADMIN_TELEGRAM_ID;
  const isSir = Boolean(adminTelegramId && String(inbound.senderId) === String(adminTelegramId));

  try {
    if (isSir) {
      // Sir's message -> Run AI Mode command or conversational chatbot immediately
      await processPendingInboundMessages("telegram");
    } else {
      // Parent interaction -> Run Telegram parent handler
      const parentResult = await handleTelegramParentMessage(inbound.replyTarget, inbound.text);
      if (!parentResult.handled) {
        await processPendingInboundMessages("telegram");
      }
    }
  } catch (err) {
    console.error("[Telegram Webhook] Error during processing:", err);
    try {
      await telegramAdapter.send(
        inbound.replyTarget,
        "We experienced a temporary processing delay. Sir's administrative team has been notified."
      );
    } catch {}
  }

  return NextResponse.json({ ok: true, processedImmediately: true });
}
