# Operations Runbook: Troubleshooting & Emergency Procedures

## Emergency Procedure: AI Mode Disablement

If the AI makes an unexpected tool call or misinterprets messages:

1. **Step 1: Switch Off AI Mode**
   - Navigate to `https://admin.mcmaths.lk/admin/ai-mode`
   - Flip the **Turn on AI Mode** switch to **OFF**.
   - Immediate effect: Inbound WhatsApp messages from Sir will reply "AI Mode is off" and stop all automated execution.
2. **Step 2: Revert Recent Actions**
   - Locate the erroneous action in the **AI Action History** table.
   - Click the **"Undo Action"** button (available for 24 hours).
   - This automatically rolls back marks, announcements, or notes recorded in that transaction.
3. **Step 3: Resume Manual Control**
   - Manual web edit screens are now unlocked. Enter marks or post bulletins directly from the web portal.

---

## Webhook Queue & Background Processing

- Background tasks are processed via `POST /api/ai/process` with `x-internal-secret`.
- A Cloudflare Cron Trigger fires every 1 minute (`* * * * *`) hitting `/api/cron/process` to clean up any unprocessed messages.
- If webhooks fail to reach the server, check Meta App Dashboard $\rightarrow$ Webhooks $\rightarrow$ Error logs.
