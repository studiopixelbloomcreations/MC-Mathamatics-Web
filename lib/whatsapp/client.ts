export interface WhatsAppButton {
  id: string;
  title: string;
}

export interface WhatsAppListRow {
  id: string;
  title: string;
  description?: string;
}

export interface WhatsAppListSection {
  title: string;
  rows: WhatsAppListRow[];
}

export class WhatsAppClient {
  private accessToken: string | undefined;
  private phoneNumberId: string | undefined;
  private apiVersion = "v21.0";

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  /**
   * Dispatches text message via Meta WhatsApp Cloud API.
   */
  async sendText(to: string, text: string): Promise<{ success: boolean; messageId?: string }> {
    if (!this.accessToken || !this.phoneNumberId) {
      console.log(`[WhatsApp Simulated SendText] -> ${to}: ${text}`);
      return { success: true, messageId: `sim_${Date.now()}` };
    }

    try {
      const res = await fetch(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "text",
            text: { preview_url: true, body: text },
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        console.error("[WhatsApp Cloud API error]", json);
        return { success: false };
      }
      return { success: true, messageId: json.messages?.[0]?.id };
    } catch (err) {
      console.error("[WhatsApp sendText error]", err);
      return { success: false };
    }
  }

  /**
   * Dispatches interactive reply buttons (up to 3 buttons).
   */
  async sendInteractiveButtons(
    to: string,
    bodyText: string,
    buttons: WhatsAppButton[]
  ): Promise<{ success: boolean; messageId?: string }> {
    if (!this.accessToken || !this.phoneNumberId) {
      console.log(
        `[WhatsApp Simulated Buttons] -> ${to}: ${bodyText} [${buttons.map((b) => b.title).join(" | ")}]`
      );
      return { success: true, messageId: `sim_btn_${Date.now()}` };
    }

    try {
      const res = await fetch(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "interactive",
            interactive: {
              type: "button",
              body: { text: bodyText },
              action: {
                buttons: buttons.slice(0, 3).map((b) => ({
                  type: "reply",
                  reply: { id: b.id, title: b.title.slice(0, 20) },
                })),
              },
            },
          }),
        }
      );

      const json = await res.json();
      return { success: res.ok, messageId: json.messages?.[0]?.id };
    } catch (err) {
      console.error("[WhatsApp sendInteractiveButtons error]", err);
      return { success: false };
    }
  }

  /**
   * Dispatches interactive list message (e.g. for sibling selection).
   */
  async sendList(
    to: string,
    bodyText: string,
    buttonText: string,
    sections: WhatsAppListSection[]
  ): Promise<{ success: boolean; messageId?: string }> {
    if (!this.accessToken || !this.phoneNumberId) {
      console.log(`[WhatsApp Simulated List] -> ${to}: ${bodyText}`);
      return { success: true, messageId: `sim_list_${Date.now()}` };
    }

    try {
      const res = await fetch(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "interactive",
            interactive: {
              type: "list",
              body: { text: bodyText },
              action: {
                button: buttonText.slice(0, 20),
                sections,
              },
            },
          }),
        }
      );

      const json = await res.json();
      return { success: res.ok, messageId: json.messages?.[0]?.id };
    } catch (err) {
      console.error("[WhatsApp sendList error]", err);
      return { success: false };
    }
  }

  /**
   * Marks message as read to acknowledge receipt.
   */
  async markRead(messageId: string): Promise<void> {
    if (!this.accessToken || !this.phoneNumberId) return;

    try {
      await fetch(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            status: "read",
            message_id: messageId,
          }),
        }
      );
    } catch {
      // Non-critical, ignore
    }
  }
}

export const whatsapp = new WhatsAppClient();
