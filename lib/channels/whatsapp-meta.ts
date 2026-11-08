// lib/channels/whatsapp-meta.ts
import { ChannelAdapter, ChannelSendOptions, ChannelSendResult, NormalizedInboundMessage } from "./types";
import { whatsapp } from "@/lib/whatsapp/client";
import { normalizeAnyPhone } from "@/lib/whatsapp/phone";
import crypto from "crypto";

export class WhatsAppMetaAdapter implements ChannelAdapter {
  readonly channel = "whatsapp_meta" as const;

  async verifyWebhook(req: Request, rawBody: string): Promise<boolean> {
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (!appSecret) return true;

    const signature = req.headers.get("x-hub-signature-256") || "";
    const expectedSig = `sha256=${crypto
      .createHmac("sha256", appSecret)
      .update(rawBody)
      .digest("hex")}`;

    return signature === expectedSig;
  }

  async parseInbound(rawBody: string): Promise<NormalizedInboundMessage | null> {
    try {
      const payload = JSON.parse(rawBody);
      const entry = (payload.entry as Array<{ changes: Array<{ value: Record<string, unknown> }> }>)?.[0];
      const value = entry?.changes?.[0]?.value;
      const message = (value?.messages as Array<Record<string, unknown>>)?.[0];

      if (!message) return null;

      const fromNumber = normalizeAnyPhone(String(message.from || ""));
      if (!fromNumber) return null;

      const waMessageId = String(message.id || "");
      const msgType = String(message.type || "text");

      const textBody =
        msgType === "text"
          ? String((message.text as Record<string, unknown>)?.body || "")
          : msgType === "interactive"
          ? String(
              ((message.interactive as Record<string, unknown>)?.button_reply as Record<string, unknown>)?.id || ""
            )
          : "";

      return {
        channel: "whatsapp_meta",
        senderId: fromNumber,
        text: textBody,
        messageId: waMessageId,
        replyTarget: fromNumber,
        raw: payload,
      };
    } catch {
      return null;
    }
  }

  async send(target: string, text: string, options?: ChannelSendOptions): Promise<ChannelSendResult> {
    if (options?.buttons && options.buttons.length > 0) {
      const res = await whatsapp.sendInteractiveButtons(target, text, options.buttons);
      return { success: res.success, messageId: res.messageId };
    }
    const res = await whatsapp.sendText(target, text);
    return { success: res.success, messageId: res.messageId };
  }
}

export const whatsappMetaAdapter = new WhatsAppMetaAdapter();
