# MC Mathematics — Channels & Telegram Integration Guide

This guide details how MC Mathematics communicates across channels (Telegram, WhatsApp Meta, wa.me).

---

## 1. Telegram Bot (Active Primary Channel)

Telegram provides 100% free, unlimited, instant 1-second messaging without Meta business verification or message template costs.

### How to Create Your Telegram Bot (Baby-Step Guide):
1. Open the Telegram app on your phone or desktop.
2. Search for `@BotFather` and click **Start**.
3. Type and send:
   ```text
   /newbot
   ```
4. Choose a name for your bot, e.g.:
   `MC Mathematics Bot`
5. Choose a username that ends in `bot`, e.g.:
   `mc_maths_bot` or `mc_mathematics_bot`
6. BotFather will reply with your **HTTP API Token**, which looks like:
   `7123456789:AAHq_xxxxxxxxx_xxxxxxxxxxxx`
   *(Copy this token!)*

### How to Find Your Telegram User ID (Sir's ID):
1. In Telegram, search for `@userinfobot` or `@raw_data_bot` and tap **Start**.
2. It will reply showing your numeric ID:
   `Id: 123456789`
3. Save this ID. Only this ID has permission to record marks, notes, announcements, or attendance!

### How to Connect the Bot to Vercel:
1. In your **Vercel Project Settings → Environment Variables**, add:
   - `TELEGRAM_BOT_TOKEN` = `<your bot token from BotFather>`
   - `TELEGRAM_WEBHOOK_SECRET` = `mc_telegram_secret_2026`
   - `ADMIN_TELEGRAM_ID` = `<your numeric user id>`
2. Redeploy or save.
3. Open a browser and register your Vercel webhook by visiting:
   ```text
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://mc-mathamatics-web.vercel.app/api/telegram/webhook&secret_token=mc_telegram_secret_2026
   ```
   Telegram will reply:
   `{"ok":true,"result":true,"description":"Webhook was set"}`

---

## 2. Using the Telegram Bot

### As Sir (Admin AI Mode & Chat):
- Send: `Hi` → Bot greets you and offers assistance.
- Send: `MCG10TP1001 Paper 14 marks 85` → Bot shows interactive inline buttons: `[1. Confirm & Save]` / `[2. Cancel]`. Tap `1` and marks are saved directly into the database!
- Send: `Announcement for Grade 10: Special revision class this Sunday.`

### As Parents:
- Send: `START MCG10TP1001` → Bot links the student and shows:
  - `[📄 Full Report]`
  - `[📈 Latest Marks]`
- Tapping either button immediately delivers the calculated marks and analytics in English or Sinhala without needing AI.

---

## 3. wa.me One-Tap Direct Sending

When sending reports to parents on WhatsApp without needing Meta API verification:
1. Go to `https://mc-mathamatics-web.vercel.app/admin/reports`.
2. In the **One-Tap Direct Sending (wa.me)** table, pick any student and click **Send via my WhatsApp**.
3. It will open WhatsApp on your device pre-filled with the student's complete analytical report formatted in their language.
4. Click Send!
