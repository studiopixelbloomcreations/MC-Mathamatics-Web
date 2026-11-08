// lib/channels/telegram.ts
import { ChannelAdapter, ChannelSendOptions, ChannelSendResult, NormalizedInboundMessage } from "./types";

export class TelegramAdapter implements ChannelAdapter {
  readonly channel = "telegram" as const;
  private botToken: string | undefined;

  constructor(token?: string) {
    this.botToken = token || process.env.TELEGRAM_BOT_TOKEN;
  }

  async verifyWebhook(req: Request, _rawBody: string): Promise<boolean> {
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!expectedSecret) {
      // If secret token is not set, allow or warn (in production we recommend setting it)
      return true;
    }
    const headerSecret = req.headers.get("x-telegram-bot-api-secret-token");
    return headerSecret === expectedSecret;
  }

  async parseInbound(rawBody: string): Promise<NormalizedInboundMessage | null> {
    try {
      const payload = JSON.parse(rawBody);

      // Handle standard message or callback_query (inline keyboard tap)
      if (payload.callback_query) {
        const cq = payload.callback_query;
        const senderId = String(cq.from?.id || "");
        const chatId = String(cq.message?.chat?.id || senderId);
        const text = String(cq.data || "");
        const updateId = String(payload.update_id || `cq_${cq.id}`);

        return {
          channel: "telegram",
          senderId,
          text,
          messageId: updateId,
          replyTarget: chatId,
          raw: payload,
        };
      }

      if (payload.message) {
        const msg = payload.message;
        const senderId = String(msg.from?.id || "");
        const chatId = String(msg.chat?.id || senderId);
        const text = String(msg.text || "");
        const updateId = String(payload.update_id || `msg_${msg.message_id}`);

        return {
          channel: "telegram",
          senderId,
          text,
          messageId: updateId,
          replyTarget: chatId,
          raw: payload,
        };
      }

      return null;
    } catch (e) {
      console.error("[TelegramAdapter] parseInbound error:", e);
      return null;
    }
  }

  async send(target: string, text: string, options?: ChannelSendOptions): Promise<ChannelSendResult> {
    if (!this.botToken) {
      console.log(`[Telegram Simulated Send] -> ${target}: ${text}`);
      return { success: true, messageId: `sim_tg_${Date.now()}` };
    }

    try {
      const body: Record<string, unknown> = {
        chat_id: target,
        text,
      };

      if (options?.buttons && options.buttons.length > 0) {
        // Map to Telegram inline_keyboard
        body.reply_markup = {
          inline_keyboard: [
            options.buttons.map((btn) => ({
              text: btn.title,
              callback_data: btn.id,
            })),
          ],
        };
      }

      const res = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        console.error("[TelegramAdapter] Send error:", json);
        return { success: false, error: json.description || "Telegram API error" };
      }

      return { success: true, messageId: String(json.result?.message_id) };
    } catch (err: unknown) {
      console.error("[TelegramAdapter] Network error:", err);
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  /**
   * Helper to set Webhook URL on Telegram
   */
  async setWebhook(webhookUrl: string, secretToken?: string): Promise<{ ok: boolean; description?: string }> {
    if (!this.botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN is not configured");
    }

    const payload: Record<string, unknown> = {
      url: webhookUrl,
      allowed_updates: ["message", "callback_query"],
    };
    if (secretToken) {
      payload.secret_token = secretToken;
    }

    const res = await fetch(`https://api.telegram.org/bot${this.botToken}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  }
}

export const telegramAdapter = new TelegramAdapter();
