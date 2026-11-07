# MC Mathematics — Production Deployment & Handover Guide (Go-Live)

## 1. Production Facts & URLs
- **Main Production Web Application:** `https://mc-mathamatics-web.vercel.app`
- **Admin Management Panel:** `https://mc-mathamatics-web.vercel.app/admin`
- **Meta WhatsApp Inbound Webhook:** `https://mc-mathamatics-web.vercel.app/api/whatsapp/webhook`
- **Meta Verification Token:** `mc_verify_2026`
- **Official AI WhatsApp Number:** `+1 555 144 4070`

---

## 2. Environment Variables Checklist (Vercel Project Settings)
Add or update these variables under **Vercel Dashboard -> Settings -> Environment Variables** (Production & Preview):

| Variable | Description | Example / Required Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin | `https://mc-mathamatics-web.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://your-supabase-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anonymous Key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Server only) | `eyJhbGciOi...` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Formatted AI WhatsApp line | `+1 555 144 4070` |
| `NEXT_PUBLIC_AI_NUMBER` | Digits-only WhatsApp line | `15551444070` |
| `WHATSAPP_TOKEN` | Meta System User Permanent Access Token | `EAA...` |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta Phone Number ID | Your Meta Phone Number ID |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Meta WhatsApp Business Account ID | Your Meta WABA ID |
| `WHATSAPP_VERIFY_TOKEN` | Inbound verification secret | `mc_verify_2026` |
| `WHATSAPP_APP_SECRET` | Meta App Secret for HMAC signature | Found in Meta App Dashboard |
| `NVIDIA_NIM_API_KEY` | NVIDIA Nemotron-3.5-bolt LLM API key | `nvapi-...` |
| `NVIDIA_NIM_MODEL` | Production LLM model name | `nvidia/nemotron-3.5-bolt-e4b` |

---

## 3. Database Execution Steps
In your **Supabase Dashboard** -> **SQL Editor**, execute in order:
1. `supabase/production/00_wipe_everything.sql` (if wiping existing test data; set `confirm_wipe := true;`)
2. `supabase/production/01_schema.sql` (creates all tables, enums, indexes, atomic sequence generator)
3. `supabase/production/02_rls.sql` (locks down all public tables with strict Row-Level Security)
4. `supabase/production/03_storage.sql` (creates `papers` and `site-assets` buckets with storage RLS)
5. `supabase/production/04_realtime.sql` (configures live replication channels)
6. `supabase/production/05_settings_and_admin.sql` (configure Sir's email & WhatsApp, initialize ID counters at 1000)
7. `supabase/production/06_verify.sql` (verifies 100% integrity)

---

## 4. Meta WhatsApp Webhook Setup
1. In Meta App Dashboard -> **WhatsApp** -> **Configuration**:
2. Set **Callback URL**: `https://mc-mathamatics-web.vercel.app/api/whatsapp/webhook`
3. Set **Verify Token**: `mc_verify_2026`
4. Click **Verify and Save**.
5. Under **Webhook fields**, click **Manage** and subscribe to: `messages`.
