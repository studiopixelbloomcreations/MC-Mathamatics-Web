# WhatsApp Cloud API Configuration Guide

## 1. Meta Developer Portal Setup

1. Create a Meta Business App with the **WhatsApp** product enabled.
2. In the WhatsApp API setup section, configure:
   - **Callback URL:** `https://mcmaths.lk/api/whatsapp/webhook`
   - **Verify Token:** Set to a secure token matching `WHATSAPP_VERIFY_TOKEN` in your environment variables.
3. Subscribe to the `messages` webhook event under **Webhook Fields**.

## 2. Environment Variables

Configure the following variables in `.env.local` or Cloudflare Workers Secrets:

```ini
WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_system_user_access_token
WHATSAPP_VERIFY_TOKEN=your_chosen_verify_token
WHATSAPP_APP_SECRET=your_meta_app_secret
INTERNAL_PROCESS_SECRET=secure_random_string_for_cron
```

## 3. Two Inbound Handlers on a Single Number

| Sender | Handled By | Uses AI Model? | Cost |
|---|---|---|---|
| Sir's Number (`+9477...`) | AI Mode Flow | Yes (NVIDIA NIM) | Zero Meta cost (incoming) |
| Any Other Number (Parents) | **Parent Bot** | **No (Rule-Based)** | **Zero Meta cost** (24h free window) |

## 4. Parent Bot Commands

- `START <ID>`: Verifies registered parent WhatsApp, links student, replies with welcome and dashboard link.
- `REPORT <ID>`: Formats and dispatches full progress report instantly inside free window.
- `PIN <ID>`: Dispatches PIN recovery instructions.
- `STOP`: Opts out of future notifications.
- Unregistered Number: Polite refusal revealing zero student data.
