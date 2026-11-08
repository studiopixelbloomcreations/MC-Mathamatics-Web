import { describe, expect, it } from "vitest";
import { TelegramAdapter } from "../lib/channels/telegram";

describe("Multi-Channel & Telegram Bot Adapter Tests", () => {
  const adapter = new TelegramAdapter("mock_bot_token");

  it("1. Parses normal Telegram incoming text message correctly", async () => {
    const rawPayload = JSON.stringify({
      update_id: 99887766,
      message: {
        message_id: 101,
        from: {
          id: 12345678,
          first_name: "Sir",
        },
        chat: {
          id: 12345678,
        },
        text: "MCG10TP1001 Paper 14 marks 85",
      },
    });

    const parsed = await adapter.parseInbound(rawPayload);
    expect(parsed).not.toBeNull();
    expect(parsed?.channel).toBe("telegram");
    expect(parsed?.senderId).toBe("12345678");
    expect(parsed?.replyTarget).toBe("12345678");
    expect(parsed?.text).toBe("MCG10TP1001 Paper 14 marks 85");
    expect(parsed?.messageId).toBe("99887766");
  });

  it("2. Parses inline callback query (button tap) correctly", async () => {
    const rawPayload = JSON.stringify({
      update_id: 99887767,
      callback_query: {
        id: "cb_123",
        from: {
          id: 12345678,
        },
        message: {
          chat: {
            id: 12345678,
          },
        },
        data: "1", // Confirm tap
      },
    });

    const parsed = await adapter.parseInbound(rawPayload);
    expect(parsed).not.toBeNull();
    expect(parsed?.channel).toBe("telegram");
    expect(parsed?.text).toBe("1");
    expect(parsed?.replyTarget).toBe("12345678");
  });

  it("3. Validates Telegram secret token strictly", async () => {
    process.env.TELEGRAM_WEBHOOK_SECRET = "super_secret_token_123";

    const validReq = new Request("https://example.com/api/telegram/webhook", {
      headers: { "x-telegram-bot-api-secret-token": "super_secret_token_123" },
    });
    const isValid = await adapter.verifyWebhook(validReq, "{}");
    expect(isValid).toBe(true);

    const invalidReq = new Request("https://example.com/api/telegram/webhook", {
      headers: { "x-telegram-bot-api-secret-token": "wrong_secret" },
    });
    const isInvalid = await adapter.verifyWebhook(invalidReq, "{}");
    expect(isInvalid).toBe(false);
  });

  it("4. Formats wa.me links correctly with encoded text and clean digits", () => {
    const parentNumber = "+94 77-123 4567";
    const reportText = "📈 Progress Report for MCG10TP1001: 85%";
    const phoneDigits = parentNumber.replace(/\D/g, "");
    const waUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(reportText)}`;

    expect(phoneDigits).toBe("94771234567");
    expect(waUrl).toBe("https://wa.me/94771234567?text=%F0%9F%93%88%20Progress%20Report%20for%20MCG10TP1001%3A%2085%25");
  });
});
