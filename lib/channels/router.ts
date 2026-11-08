// lib/channels/router.ts
import { ChannelType, ChannelAdapter } from "./types";
import { telegramAdapter } from "./telegram";
import { whatsappMetaAdapter } from "./whatsapp-meta";

export function getChannelAdapter(channel: ChannelType): ChannelAdapter {
  switch (channel) {
    case "telegram":
      return telegramAdapter;
    case "whatsapp_meta":
      return whatsappMetaAdapter;
    default:
      return telegramAdapter;
  }
}
