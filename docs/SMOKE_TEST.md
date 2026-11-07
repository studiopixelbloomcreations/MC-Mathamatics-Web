# MC Mathematics — Production Smoke Test Script

Perform these verification checks immediately after deployment:

### 1. Web Application & Public Routes
- [ ] Visit `https://mc-mathamatics-web.vercel.app` (Loads smoothly, Satoshi typography active, Blue & White palette rendered).
- [ ] Toggle Language: Switch between English and සිංහල (URL switches `/en` <-> `/si`, natural Sinhala strings render without missing keys).
- [ ] Toggle Dark/Light Mode: Surface colors transition between pure architectural white/ice-blue and midnight navy obsidian.
- [ ] Check Privacy Policy (`/privacy`) and Terms of Service (`/terms`) links.

### 2. WhatsApp Inbound Webhook Handshake
- [ ] Send HTTP GET request to `https://mc-mathamatics-web.vercel.app/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test_123&hub.verify_token=mc_verify_2026`.
- [ ] Expected Response: HTTP 200 with body `test_123`.

### 3. Admin Panel & Diagnostics
- [ ] Log in at `https://mc-mathamatics-web.vercel.app/admin` using Sir's credentials.
- [ ] Visit `/admin/diagnostics`: Confirm green checks for Database, AI Configuration, and WhatsApp Setup.
- [ ] Visit `/admin/students`: Create first real student (Verify generated ID starts at `1001`, e.g. `MCG10TP1001`).

### 4. Parent WhatsApp Interaction (Live Number)
- [ ] From parent WhatsApp, send: `START MCG10TP1001`.
- [ ] Expected Response: Immediate interactive welcome message with student name and button to view report.
- [ ] Send: `REPORT`.
- [ ] Expected Response: Full analytical progress report delivered instantly within 24-hr free window.
