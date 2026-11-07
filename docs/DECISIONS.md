# Architecture & Technical Decisions

This document records key architectural and design choices made during development, as mandated by the MC Mathematics project blueprint.

## 1. Hosting & Runtime Strategy
- **Decision:** Target Cloudflare Workers via `@opennextjs/cloudflare` with Node.js compatibility enabled (`nodejs_compat`).
- **Rationale:** Free-tier commercial use permitted; lightning-fast global edge responses in Sri Lanka. Disallow Node-exclusive runtime APIs (such as runtime local filesystem operations, long-lived background in-memory timers) to guarantee edge compatibility.

## 2. Design System & Theming Tokens
- **Decision:** Dark-first design system with CSS custom property tokens for semantic colors (`--bg`, `--surface`, `--surface-glass`, `--border`, `--text`, `--muted`, `--accent`, `--brand`, `--good`, `--warn`, `--bad`).
- **Rationale:** Adheres to the 2026 design specification in Blueprint Part A2, offering an electric violet + warm gold signature palette with Lenis smooth scrolling and GPU-accelerated motion tokens.

## 3. Host-based Routing for Admin Portal
- **Decision:** Use Next.js `middleware.ts` to inspect the `Host` header. Requests matching `admin.*` are rewritten to the `/(admin)` route group, while direct access to `/admin` on the public domain is blocked in production.
- **Rationale:** Isolates the administrative cockpit on a separate subdomain while retaining a unified Next.js codebase.

## 4. Internationalization (i18n)
- **Decision:** Use `next-intl` supporting English (`en`) and Sinhala (`si`), with client cookies and header negotiation.
- **Rationale:** Ensures accessibility and usability for both English-medium and Sinhala-medium mathematics students in Sri Lanka.

## 5. Supabase Schema, RLS & Student Authentication
- **Decision:** Full schema migration deployed in `supabase/migrations/20261107000000_full_schema.sql` covering all 14 tables (including V2 additions: `parent_last_inbound_at`, `parent_wa_verified`, `report_pending`, `paid_templates_enabled`, `report_requests`, `push_subscriptions`), enums, indexes, and comprehensive RLS policies.
- **Atomic ID Generation:** Postgres function `next_student_id(p_prefix)` backed by table `id_counters` with atomic row-level upsert locking guarantees zero ID collision under parallel concurrent sign-ups.
- **Synthetic Email Auth:** Students log in with Student ID + 6-digit PIN. Under the hood, Supabase Auth authenticates against a synthetic email `${unique_id.toLowerCase()}@students.mcmaths.lk`.
- **Browser Credential Autofill:** Post-signup ID card screen embeds a credential form with `autocomplete="username"` and `autocomplete="new-password"` so browsers offer to save credentials natively.
- **Brute-Force Protection:** Rate limiting locks accounts for 15 minutes after 5 consecutive failed login attempts, tracked in `login_log`.
- **Free WhatsApp Activation:** Direct link to `https://wa.me/<AI_NUMBER>?text=START%20<ID>` invites the parent to initiate the chat, opening Meta's free 24-hour messaging window.

## 6. Student Dashboard & Parental Control Gate
- **Decision:** Built the full Student Dashboard (`/dashboard/*`) including Desktop Sidebar, Mobile Bottom Tab Bar, and dedicated sub-pages (`/papers`, `/attendance`, `/special-notes`, `/announcements`, `/parental-controls`).
- **Server-Side Parental Lock Enforcement:** When `parental_settings.locked` is active, scheduled (e.g. 22:00-06:00), or timed, the server halts evaluation and returns zero academic data (no marks, no papers, no attendance, no notes). The client renders `<LockedScreen>` requiring the 6-digit parent PIN to unlock.
- **Dynamic Report Button (A4-8):** Implemented `<SendReportButton>` with 3 dynamic states ("Send me the report" -> "Report ready, tap to send" when `report_pending` -> "Report Sent ✓ (time)"). Links to `https://wa.me/<AI_NUMBER>?text=REPORT%20<ID>` to ensure zero messaging costs.
- **Supabase Realtime:** Built `<RealtimeListener>` to listen to PostgreSQL changes on `marks`, `special_notes`, and `announcements`, popping live toasts and refreshing data without full reload.
- **PWA & Web Push:** Added `public/manifest.json` and service worker `public/sw.js` with background push handlers and `<PushNotificationToggle>` storing VAPID subscriptions in `push_subscriptions`.

## 7. Production Hardening & Live Go-Live
- **Decision:** Remove all mock fallbacks, synthetic test student generators, and dev-only routes (`/admin/ai-simulator`).
- **Real Aggregate Telemetry:** Stats counters and testimonials now bind to real database queries via `site_content` or are hidden when below statistical threshold.
- **WhatsApp Live Number Configuration:** Supports `+1 555 144 4070` as current Meta test line via `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_AI_NUMBER` without hardcoding in source code.
- **Legal Compliance:** Integrated full bilingual Privacy Policy (`/privacy`), Terms of Service (`/terms`), and Parental Consent flows complying with Sri Lanka's Personal Data Protection Act (PDPA No. 9 of 2022).
