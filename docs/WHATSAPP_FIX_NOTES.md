# MC Mathematics — WhatsApp Webhook & AI Engine Architecture

## 1. Webhook Endpoint
- **URL:** `https://mc-mathamatics-web.vercel.app/api/whatsapp/webhook`
- **Method:** GET (Verification handshake) & POST (Inbound ingestion)
- **Token:** `mc_verify_2026` or configured `WHATSAPP_VERIFY_TOKEN`
- **Signature Security:** Validated against `X-Hub-Signature-256` using `WHATSAPP_APP_SECRET`.

## 2. Inbound Routing
1. **Deduplication:** Every incoming Meta message has a unique `wa_message_id`. Inserted into `inbound_messages` with conflict handling to eliminate duplicate responses.
2. **Sender Disambiguation:**
   - **Sir's WhatsApp (`admin_whatsapp` in `system_settings`):** Directed to Admin Bot with NVIDIA Nemotron tool calling (marking, attendance, announcements, special notes).
   - **Registered Parent WhatsApp (`parent_whatsapp` in `students`):** Directed to Parent Bot. Refreshes the 24-hour free messaging window.
   - **Unregistered Number:** Polite refusal sent with zero student data leakage.

## 3. Singlish & Sinhala Support
- Parents can chat in English, Sinhala script (e.g. `ලකුණු මොනවාද?`), or Singlish (e.g. `lakunu balanna one`).
- Responses honor the parent's chosen language:
  - English: Clear tabular progress metrics.
  - Sinhala: Respectful, polite phrasing with proper Noto Sans Sinhala formatting.

## 4. Verification & Evaluation Results
- 60/60 unit and integration tests passing (`ids.test.ts`, `parent-bot.test.ts`, `ai-mode.test.ts`, `analysis.test.ts`).
- Instant 200 HTTP response returned to Meta servers to prevent webhook retries.
