// lib/channels/types.ts

export type ChannelType = "telegram" | "whatsapp_meta" | "whatsapp_twilio" | "in_app" | "shortcut";

export interface NormalizedInboundMessage {
  channel: ChannelType;
  senderId: string;       // Normalized phone (e.g. +9477...), Telegram Chat/User ID, or Admin UUID
  text: string;           // Clean text body or button ID payload
  messageId: string;      // Unique ID for deduplication (e.g., Telegram update_id, WhatsApp msg ID)
  replyTarget: string;    // Raw recipient address needed to reply back (e.g. Telegram chatId or phone)
  senderType?: "sir" | "parent" | "unknown";
  raw?: unknown;          // Original raw webhook payload
}

export interface ChannelSendOptions {
  buttons?: Array<{ id: string; title: string }>;
  replyToMessageId?: string;
  isMarkdown?: boolean;
}

export interface ChannelSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ChannelAdapter {
  readonly channel: ChannelType;
  send(target: string, text: string, options?: ChannelSendOptions): Promise<ChannelSendResult>;
  verifyWebhook(req: Request, rawBody: string): Promise<boolean>;
  parseInbound(rawBody: string, headers?: Headers): Promise<NormalizedInboundMessage | null>;
}
