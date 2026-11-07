# MC Mathematics — Live Testing Guide

This guide gives you the fastest, simplest way to test the entire MC Mathematics platform with the **12 pre-configured fake students** across Grades 9, 10, and 11.

---

## 🚀 Fast Track (Under 2 Minutes)

1. **Start the local server:**
   ```bash
   npm run dev
   ```
2. **Open the Admin Diagnostics Console:**
   Go to [http://localhost:3000/admin/diagnostics](http://localhost:3000/admin/diagnostics)
3. **Verify the 3 Subsystem Status Badges:**
   - **Database**: Green tick (`WORKING`)
   - **Autonomous AI Engine**: Green tick (`WORKING` or instructions if key is needed)
   - **Meta WhatsApp Cloud API**: Green tick (`WORKING` or credentials reminder)
4. **Seed Fake Students with 1 Click:**
   - Tap the gold button: **"Seed 12 Fake Students"** on the Diagnostics page.
   - All 12 students, model papers, marks, attendance, and notes will be instantly populated.

---

## 🎓 1. Testing Student Login & Dashboard

Go to [http://localhost:3000/login](http://localhost:3000/login)

### Pick Any Student to Test:
| Grade | Student ID | Student Name | Stream | PIN | Parent WhatsApp | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Grade 9** | `MCG09TP1001` | Nethmi Wickramasinghe | Theory + Paper | `123456` | `+94776665544` | High scorer (82.5%) |
| **Grade 9** | `MCG09TP1002` | Tharindu Jayasundara | Theory + Paper | `123456` | `+94776665545` | Top ranker (93.0%) |
| **Grade 9** | `MCG09T1001` | Dinuka Bandara | Theory Only | `123456` | `+94776665546` | Needs focus (68.0%) |
| **Grade 9** | `MCG09T1002` | Rashmi Alwis | Theory Only | `123456` | `+94776665547` | Steady (77.5%) |
| **Grade 10** | `MCG10TP1001` | Kavindu Perera | Theory + Paper | `123456` | `+94779998877` | 88.5% on Paper 1 |
| **Grade 10** | `MCG10T1002` | Senuri Jayasinghe | Theory Only | `123456` | `+94778887766` | Sinhala locale pref |
| **Grade 10** | `MCG10TP1003` | Akila Dissanayake | Theory + Paper | `123456` | `+94778887767` | Island Top Ranker (98%) |
| **Grade 10** | `MCG10TP1004` | Oshadhi Senaratne | Theory + Paper | `123456` | `+94778887768` | Rapid improvement |
| **Grade 11** | `MCG11TP1001` | Dulitha Bandara | Theory + Paper | `123456` | `+94777776655` | 92% on O/L speed drill |
| **Grade 11** | `MCG11TP1002` | Hiruni Ranasinghe | Theory + Paper | `123456` | `+94777776656` | 87.5% on Paper 1 |
| **Grade 11** | `MCG11T1001` | Pathum Fernando | Theory Only | `123456` | `+94777776657` | Core foundation |
| **Grade 11** | `MCG11TP1003` | Sandunika Rajapaksha | Theory + Paper | `123456` | `+94777776658` | Strong geometry skills |

### What to Verify Inside Dashboard:
1. **Overview Page (`/dashboard`)**:
   - Check the **Score percentage**, **Attendance rate**, and **Streak badge**.
   - Check the **Longitudinal Telemetry Trend Chart** with thin gold line and class average curve.
   - Click **"Send me the report"** — it opens a WhatsApp link formatted with `REPORT <ID>`.
2. **Paper Results (`/dashboard/papers`)**:
   - View past model exam papers, section-by-section mark breakdowns.
3. **Special Notes (`/dashboard/special-notes`)**:
   - Inspect Sir's personalized handwritten diagnostic advice.
4. **Parental Controls (`/dashboard/parental-controls`)**:
   - Unlock with PIN `123456` $\rightarrow$ toggle lock status or schedule restricted study hours.

---

## 🛠️ 2. Testing the Admin Portal

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

1. **Overview**: View pulse counts for all 12 students, ongoing papers, and security audit logs.
2. **Diagnostics (`/admin/diagnostics`)**:
   - Confirm green ticks for Database, AI, and WhatsApp.
   - Test "Re-run Diagnostics" to see live round-trip latency in milliseconds.
3. **Mark Entry (`/admin/marks`)**:
   - Enter a test mark for any student to see immediate analysis recomputation.
4. **AI Mode Cockpit (`/admin/ai-mode`)**:
   - Toggle AI Mode between **ON** and **OFF**.
   - When ON, Sir can command the platform via WhatsApp natural language messages.

---

## ⚡ 3. Testing WhatsApp Inbound Webhook (Immediate Processing)

The webhook at `/api/whatsapp/webhook` processes messages immediately upon arrival.

### A. Simulating a Parent Message (Local Test)
Run this command in your terminal to simulate a parent sending `REPORT MCG10TP1001`:

```bash
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "id": "wam_test_001",
            "from": "94779998877",
            "type": "text",
            "text": { "body": "REPORT MCG10TP1001" }
          }]
        }
      }]
    }]
  }'
```

**Expected Response:**
```json
{ "received": true, "processedImmediately": true }
```
The rule-based parent bot verifies the sender phone (`+94779998877`), queries the student's latest results, and dispatches the WhatsApp report card immediately.

---

### B. Live Meta Webhook Setup
When deploying to Vercel or Cloudflare:
1. In the **Meta for Developers Console** $\rightarrow$ WhatsApp $\rightarrow$ Configuration:
   - **Callback URL**: `https://<YOUR-DOMAIN>/api/whatsapp/webhook`
   - **Verify Token**: `mc_maths_verify_token` (or whatever you set in `WHATSAPP_VERIFY_TOKEN`)
2. Subscribe to the `messages` webhook field.

---

## 📋 What You Need To Do Yourself

| Action Item | Where to do it | Description |
| :--- | :--- | :--- |
| **1. Set your Environment Secrets** | `.env.local` / Vercel Environment Variables | Ensure `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and `NVIDIA_NIM_API_KEY` (or `GEMINI_API_KEY`) are pasted. |
| **2. Run SQL Seed (if using clean Supabase)** | Supabase Dashboard $\rightarrow$ **SQL Editor** | Open [`supabase/seed.sql`](supabase/seed.sql) and click **Run**. This populates the 12 fake students, default passwords, papers, and marks. (Or click the gold button on `/admin/diagnostics`). |
| **3. Connect Meta Webhook** | Meta for Developers | Paste your deployment URL `https://your-domain.com/api/whatsapp/webhook` and verify token `mc_maths_verify_token`. |
| **4. Test with Sir's WhatsApp Number** | WhatsApp App | Set `ADMIN_WHATSAPP` to Sir's real number. Send `"Add mark Kavindu 85"` to verify the AI assistant. |
