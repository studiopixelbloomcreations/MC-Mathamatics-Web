# Production Launch Checklist

## 1. Supabase Dashboard
- [ ] Run migration `supabase/migrations/20261107000000_full_schema.sql` on production database.
- [ ] Verify 14 tables created and RLS is enabled on all tables.
- [ ] Create Sir's admin user in Supabase Authentication. Set custom claim `role: 'admin'`. Enable TOTP 2FA.
- [ ] Set `system_settings.admin_whatsapp` to Sir's verified Sri Lankan phone number (`+94...`).

## 2. Meta WhatsApp Cloud API Dashboard
- [ ] Create Meta Developer App and link WhatsApp Business Account.
- [ ] Add webhook URL: `https://mcmaths.lk/api/whatsapp/webhook`.
- [ ] Set Verify Token matching `WHATSAPP_VERIFY_TOKEN`.
- [ ] Subscribe to the `messages` event.
- [ ] Generate a Permanent System User Access Token and save to `WHATSAPP_ACCESS_TOKEN`.

## 3. Cloudflare Workers Dashboard
- [ ] Bind custom domains: `mcmaths.lk`, `www.mcmaths.lk`, `admin.mcmaths.lk`.
- [ ] Add Environment Secrets:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `INTERNAL_PROCESS_SECRET`
  - `WHATSAPP_PHONE_NUMBER_ID`
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_VERIFY_TOKEN`
  - `WHATSAPP_APP_SECRET`
  - `NVIDIA_NIM_API_KEY`
- [ ] Verify Cron Trigger (`* * * * *`) calling `/api/cron/process`.

## 4. Verification Tests
- [ ] Run health check: `https://mcmaths.lk/api/health`.
- [ ] Complete student registration and verify ID card generation.
- [ ] Send `START <ID>` from registered parent WhatsApp and verify welcome button.
- [ ] Trigger test mark entry and verify realtime update on student dashboard.
