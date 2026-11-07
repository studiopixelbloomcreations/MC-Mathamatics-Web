# MC MATHEMATICS — GOD PROMPT FOR ANTIGRAVITY (v2)

Build prompts for the MC Mathematics e-learning platform. Every prompt is inside its own grey box so you can copy it with one click.

## How to use

1. Put **MC-Mathematics-Platform-Blueprint.md** in the project root (Antigravity can then read it). It is the source of truth.
2. Paste **G0 — Master Brief** first. Wait for the agent's 10-line summary.
3. Paste **Phase 1**. When it finishes, test it yourself, then paste **Phase 2**, and so on. Never paste two phases at once.
4. If the agent loses track or gets stuck, use **R1 (Resume)** or **R2 (Fix)** at the bottom.
5. After every phase run the app locally, click through it, and commit to GitHub (`git commit -m "phase N done"`).

---

## G0 — MASTER BRIEF (paste first, once)

```text
You are a senior full-stack engineer and a world-class product designer at an elite web studio.
Build a brand-new project from scratch: the "MC Mathematics" e-learning platform for maths teacher
Malinga C Dissanayake (Kurunegala, Sri Lanka). Slogan: "Maths is the question. MC is the answer."

The full specification is in MC-Mathematics-Platform-Blueprint.md in the project root. Read it fully
before writing code. Part A is the source of truth for features, data model, security, design and the
WhatsApp flows. Part C tells you the hosting target.

NON-NEGOTIABLE RULES
1. Stack: Next.js 15 App Router + TypeScript (strict), Tailwind v4, shadcn/ui, GSAP + ScrollTrigger,
   Framer Motion, Lenis, Recharts, KaTeX, React Hook Form + zod, Supabase (@supabase/ssr),
   next-intl (English + Sinhala), Vitest, Playwright.
2. Deployment target: Cloudflare (Workers via @opennextjs/cloudflare) for production, Vercel only for
   dev previews. Therefore write runtime-agnostic code: no reliance on Node-only APIs that break on
   Workers, no long-running in-process background work, no filesystem writes at runtime. Background work
   uses a database queue + a protected /api/ai/process endpoint triggered immediately and by a 1-minute cron.
3. Design must look like it was made by a top agency in 2026: dark-first design system with tokens,
   bento grids, glass cards, kinetic typography, scroll-driven storytelling, purposeful micro-interactions,
   Lenis smooth scroll (palette, fonts and hero concept in blueprint Part A2). Animate only transform and
   opacity, honour prefers-reduced-motion, lighter effects on mobile, Lighthouse mobile >= 90.
4. Security: RLS on every table; secrets only on the server; zod-validate every server input; rate-limit auth
   and webhooks; verify the WhatsApp webhook signature; never expose the service-role key to the client.
5. Login = Student ID + 6-digit PIN (NOT ID alone), using Supabase Auth with a synthetic email derived from the ID.
   Use correct autocomplete attributes so browsers offer to save the credentials.
6. AI NEVER writes raw SQL. It may only call the fixed tools listed in blueprint A6; every call is validated
   by zod and executed by server code. All numbers come from a deterministic analysis engine written in code;
   the AI only writes explanatory text from the numbers it is given.
7. AI Mode is enforced server-side. When ai_mode = true, manual write endpoints return 409 AI_MODE_ACTIVE and the
   admin UI shows the greyed-out modal exactly as specified in blueprint A5.
8. WhatsApp has TWO handlers on one number: Sir's number -> AI Mode (uses the AI model); every other number ->
   a RULE-BASED parent bot (NO AI model). The parent bot only answers the number registered at sign-up.
9. Message cost must be zero by default: parents start the chat (wa.me link with prefilled text), replies happen
   inside the 24-hour window. Paid template sending is built but OFF by default (system_settings.paid_templates_enabled).
10. Clean modular typed code. Folders: /app, /components, /lib (supabase, ai, whatsapp, analysis, ids, push),
    /features, /styles, /messages (i18n), /supabase (migrations, seed), /tests, /docs. No hard-coded secrets.
    Keep .env.example up to date.
11. After each phase: run typecheck + lint + tests, fix everything, then summarize what you built, list what
    needs MY manual action (for example clicks in Supabase or Meta dashboards), and STOP. Do not start the next
    phase until I paste it.
12. If something is ambiguous, choose the most sensible option, record it in /docs/DECISIONS.md, and continue.
    Ask at most 3 questions per phase.

Reply with the 10 phases in one line each, then wait for me to paste Phase 1.
```

---

## PHASE 1 — Foundation + Design System

```text
PHASE 1 — Foundation and design system.
1. Scaffold Next.js 15 + TypeScript strict + Tailwind v4 + shadcn/ui + eslint + prettier + Vitest + Playwright.
   Add @opennextjs/cloudflare + wrangler config now (so the project stays Cloudflare-compatible), and verify
   `npm run build` works.
2. Create the design tokens from blueprint Part A2 (CSS variables, dark default + light theme with a toggle),
   fonts via next/font (Geist, Instrument Serif, JetBrains Mono, Noto Sans Sinhala), and global motion tokens
   (easing cubic-bezier(0.22,1,0.36,1), durations 300-700ms).
3. Build the reusable UI kit: Button (with magnetic variant), GlassCard (gradient border + cursor spotlight),
   Input, PinInput (6 boxes, paste support), Combobox/Select (searchable), Modal, Toast, Tabs, Skeleton, Badge,
   StatCounter (animated number), AnimatedRing, Reveal wrapper (fade/slide on scroll), PageTransition.
4. Set up Lenis + GSAP ScrollTrigger provider with prefers-reduced-motion fallbacks.
5. middleware.ts with host-based routing: requests to hosts starting with `admin.` go to the /admin route group;
   block /admin on the main host in production; allow /admin in development.
6. next-intl (en, si) with a language switcher.
7. Create /docs/DECISIONS.md and .env.example (variables from blueprint Part B5, plus INTERNAL_PROCESS_SECRET).
Deliver a /design-system preview page that shows every component in dark and light.
```

## PHASE 2 — Landing Page

```text
PHASE 2 — Landing page (/).
Build every section listed in blueprint A2 "Landing page sections". Hero sequence:
 giant kinetic text "Maths is the question." -> glowing animated "?" -> on scroll (pinned section) the "?" morphs
 into the "MC" monogram and "MC is the answer." reveals in the gold accent -> CTAs fade in
 ("Join the class" primary, "Student login" ghost).
Include: faint animated math grid + KaTeX floating formulas, aurora gradient background, bento feature grid,
pinned 3-step "How it works" timeline, a live-looking animated analysis preview (demo data), grade cards (6-13),
testimonial marquee, FAQ accordion, final CTA band, footer. Mention the free WhatsApp progress reports in the
feature bento. Use placeholder content marked with TODO comments for Sir to replace (photo, achievements,
testimonials, contact details).
Mobile first; simplify pinned effects on small screens. Add SEO metadata, Open Graph image, JSON-LD
(EducationalOrganization / LocalBusiness), sitemap and robots.
Acceptance: Lighthouse mobile performance >= 90, zero layout shift, fully usable with reduced motion.
```

## PHASE 3 — Database, Auth, Sign-up, Login

```text
PHASE 3 — Supabase schema, auth, sign-up, login.
1. Write SQL migrations for the FULL schema in blueprint A7, including the Version 2 additions
   (parent_last_inbound_at, parent_wa_verified, report_pending, paid_templates_enabled, report_requests,
   push_subscriptions), the next_student_id() function, indexes, and ALL RLS policies (students, papers by
   grade/class_type, marks, attendance, notes, announcements by target, analyses, parental_settings, and
   admin-only tables). Add a seed script with demo students across grades 9-11, 3 papers, marks, attendance,
   announcements.
2. Sign-up page (/signup): fields and validation from blueprint A3 (Sri Lankan phone -> E.164), grade 6-13,
   class type toggle (Theory+Paper / Theory only), 6-digit PIN with confirmation, parent consent checkbox with
   timestamp. A server action creates the Supabase user (synthetic email), calls next_student_id(), inserts the
   student, creates parental_settings, writes login_log.
3. Post-signup "ID card" screen: huge animated ID (JetBrains Mono, gold glow), Copy ID, Download as image,
   Continue. Include the hidden credential form with autocomplete="username"/"new-password" so browsers offer to
   save the credentials. Add the "Start WhatsApp reports (free)" button that opens
   https://wa.me/<AI_NUMBER>?text=START%20<ID> (AI_NUMBER from env). Show a short explanation of what happens next.
4. Login page (/login): ID + PIN, case-insensitive ID, trim spaces. Unknown ID -> friendly message + link to /signup.
   Wrong PIN -> generic error. Rate limit + 15-minute lockout after 5 failures. Log every attempt to login_log.
   Success -> /dashboard.
5. Forgot-PIN: creates a request visible in the admin panel (WhatsApp OTP comes in Phase 8).
6. Tests: 50 parallel sign-ups produce 50 unique IDs; RLS test proving student A cannot read student B's data.
```

## PHASE 4 — Student Dashboard

```text
PHASE 4 — Student dashboard (/dashboard/*) per blueprint A4 sections 1-8, EXCEPT the charts (Phase 5).
Layout: sidebar on desktop, bottom tab bar on mobile, staggered fade-ins, skeleton loaders, Supabase Realtime
subscriptions so new marks/notes/announcements appear live with a toast.
Pages: Main dashboard (bento), Paper results (tabs Ongoing / Finished / Recently done using the definitions in
A4), Attendance (calendar heatmap + table + % ring), Special notes, Announcements (unread badges, pinned),
Parental controls (separate parent PIN, lock now / schedule / until date, hide results, report preferences,
recent login activity).
Implement the "Send me the report" button (blueprint A4-8) on the main dashboard, the Analysis page and Parental
controls: it opens https://wa.me/<AI_NUMBER>?text=REPORT%20<ID>; button states: default / "Report ready" when
students.report_pending is true / "Sent" with time after a report_requests row appears.
PWA: manifest, service worker, install prompt, and free web push (VAPID) with an opt-in toggle that stores
push_subscriptions. (The sending side comes in Phase 8.)
A locked dashboard shows a beautiful locked screen and requires the parent PIN; the lock must also block data
fetching on the server, not only the UI.
Students only see papers for their own grade and class type (enforced by RLS, verify with tests).
```

## PHASE 5 — Analysis Engine + Charts

```text
PHASE 5 — Analysis.
1. /lib/analysis: pure, fully unit-tested TypeScript functions for everything in blueprint A6 "Analysis engine":
   percent, class average/median/stddev, topper score, percentile band, trends (last 3 vs previous 3 and slope),
   section/topic averages vs class vs topper, weakest 3 topics, biggest drop/improvement, consistency.
   Edge cases: a single paper, missing section marks, tiny classes (hide comparisons if class < 5 students).
2. Store results in analyses.metrics. Recompute automatically after any mark change (server function used by both
   manual entry and AI Mode).
3. Analysis page (/dashboard/analysis) with animated charts: trend line vs class average, radar (student vs class
   vs topper), comparison bars (this paper vs previous papers, student vs class, student vs topper), percentile
   band movement, topic heatmap, consistency score. Charts animate on first view (line draws, bars grow, radar
   expands). Topper and class data are anonymous scores only.
4. Insights panel: strengths, weaknesses, biggest drop and improvement, "what to do next" (3 actions). Use
   rule-based text for now; the AI narrative is added in Phase 8.
5. Vitest coverage >= 90% on /lib/analysis.
```

## PHASE 6 — Admin Dashboard (manual mode)

```text
PHASE 6 — Admin dashboard on the admin subdomain.
Auth: Supabase email + password plus TOTP 2FA, role = admin only.
Build: Overview, Paper upload (grade selector 6-13, class type, status, total marks, sections list, file to a
private Storage bucket with signed URLs), Mark entry (grade -> paper -> searchable student dropdown -> marks +
optional section marks; plus a bulk class table) that triggers analysis recompute and live student update,
Attendance entry, Announcements (target all / grade / student, pin, schedule), Special notes, Students table
(reset PIN, deactivate), Login log with filters, Parent reports page (placeholder for now).
Every manual write endpoint must check system_settings.ai_mode and return 409 AI_MODE_ACTIVE when it is on.
Same premium design system.
Playwright tests: upload a Grade 10 paper -> a Grade 10 student sees it and a Grade 11 student does not; enter a
mark -> the student's dashboard updates live.
```

## PHASE 7 — AI Mode (toggle, modal, WhatsApp webhook for Sir)

```text
PHASE 7 — AI Mode.
1. Admin AI Mode panel: "Turn on AI Mode" toggle (system_settings.ai_mode), animated active banner, and the EXACT
   modal flow from blueprint A5 (page behind greyed and blurred; "AI Mode is currently active / Manual control
   cannot be continued. Enable manual control? [No] [Yes]"). Server-side 409 enforcement already exists from Phase 6;
   add tests.
2. /api/whatsapp/webhook:
   GET -> Meta verification with WHATSAPP_VERIFY_TOKEN.
   POST -> verify X-Hub-Signature-256 with WHATSAPP_APP_SECRET, ignore status callbacks (store them for delivery
   logs), de-duplicate by wa_message_id in inbound_messages, then ROUTE:
     - sender == system_settings.admin_whatsapp -> AI Mode flow below
     - any other sender -> parent bot (built in Phase 8; for now reply with a polite placeholder)
   Return 200 immediately; trigger POST /api/ai/process (protected by INTERNAL_PROCESS_SECRET) for background work and
   add a cron-callable endpoint that processes any unprocessed rows (for Cloudflare Cron Triggers).
3. /lib/ai: AIProvider interface + NvidiaNimProvider (OpenAI-compatible; base URL, key and model from env), tool
   schemas for the 7 tools in blueprint A6 with zod, one retry on invalid output, daily token cap.
4. AI Mode flow for Sir: if ai_mode = false reply "AI Mode is off. Turn it on in the admin panel to use WhatsApp
   control." and stop. Otherwise parse -> tool calls -> validate (known student IDs, marks within 0..total, grade
   and paper resolution; ambiguity -> ask_clarification) -> if ai_confirm_required send a preview and wait for
   "1" (confirm) / "2" (cancel) -> execute via server functions -> log to ai_actions with undo_data -> recompute
   analysis -> reply to Sir with a summary.
5. Admin "AI activity" page: actions with raw text, parsed JSON, status and an Undo button (24-hour window).
6. /lib/whatsapp: sendText, sendInteractiveButtons, sendList, markRead, with error handling and logging.
7. Dev-only simulator page (/admin/ai-simulator) to test messages without WhatsApp.
8. Tests: single student, multi-student list, announcement, ambiguous message, unknown ID, marks out of range,
   duplicate webhook delivery, message from a non-admin number never reaching the AI.
```

## PHASE 8 — AI Narrative + Free-First Parent Report System

```text
PHASE 8 — AI narratives and the free-first Parent Information System (blueprint A6 "Parent Report system").
1. After a mark is recorded, call the AI with ONLY the metrics JSON to produce a structured narrative (strengths,
   weaknesses, downfalls, 3 next steps) in English and Sinhala. Instruction: "Use only the numbers provided.
   Do not invent data." Verify every number in the output exists in the metrics; otherwise regenerate once, then
   fall back to the rule-based text. Store in analyses.narrative and show it on the Analysis page.
2. Parent bot (RULE-BASED, NO AI MODEL) for every non-admin sender:
   - Normalize the sender number to E.164 and compare with students.parent_whatsapp.
   - `START <ID>`: if the number matches, set parent_wa_verified = true, report_opt_in = true,
     parent_last_inbound_at = now; reply with a welcome, the link to that student's dashboard, and an interactive
     button "Get full analysis report" (button id REPORT:<student_uuid>).
   - `REPORT <ID>` or a tap on that button: update parent_last_inbound_at, log a report_requests row, and reply with
     the stored full analysis formatted as the report layout in blueprint A6 plus the dashboard link. No AI call at
     request time. Clear students.report_pending.
   - `STOP`: opt out and confirm. Anything else: short menu (REPORT / STOP).
   - Number not matching the registered parent number or unknown ID: polite refusal that reveals NO student data;
     rate-limit per sender; log as blocked_unregistered.
   - One number linked to several students: reply with an interactive list "Which student?" and send the chosen one.
   - Every inbound message from a parent updates parent_last_inbound_at (this tracks the free 24-hour window).
3. Smart send after new marks: if now - parent_last_inbound_at < 24h and report_opt_in, send the report
   automatically (free). Otherwise set report_pending = true and send a free web push (VAPID, to push_subscriptions)
   such as "New result for Kamal. Tap to view." Do NOT send a paid template unless
   system_settings.paid_templates_enabled = true AND the parent opted in; in that case use the approved template
   `progress_report`.
4. Admin Parent Reports page: delivery table (sent / delivered / failed / blocked), filters, resend (only when the window
   is open or paid templates are enabled), and a switch for paid_templates_enabled with a clear warning that it costs money.
5. Forgot-PIN by WhatsApp: parent sends `PIN <ID>` and receives a one-time code inside the free window (rate-limited);
   no template needed.
6. Mask phone numbers in all UIs. Report text must be short enough for WhatsApp and well formatted.
7. Tests: wrong number gets no data, sibling list flow, STOP respected, smart send only when the window is open,
   no paid message sent when paid_templates_enabled = false.
```

## PHASE 9 — Hardening: Performance, Accessibility, Security

```text
PHASE 9 — Hardening.
- Audit every page: Lighthouse mobile >= 90, fix LCP and CLS, lazy-load heavy animation code, optimize images
  (AVIF/WebP), fonts and bundle size.
- Accessibility WCAG 2.2 AA: contrast, focus rings, keyboard navigation, ARIA and text alternatives for charts,
  reduced motion.
- Security: CSP and security headers, rate limiting everywhere, input sanitization, confirm no secret leaks into the
  client bundle, and a full RLS test suite (student cannot read others, cannot write marks, grade filtering holds,
  locked dashboard blocks server data fetch, parent bot never leaks to an unregistered number).
- Error boundaries, empty states, branded 404/500 pages, skeletons everywhere.
- Add error monitoring (Sentry or equivalent that works on Cloudflare) and a /api/health endpoint.
- Playwright end-to-end: sign-up -> ID card -> login -> dashboard; admin AI Mode modal; webhook simulator for both
  Sir and a parent.
```

## PHASE 10 — Deployment on Cloudflare + Handover

```text
PHASE 10 — Deployment and handover (production target: Cloudflare, per blueprint Part C).
- Make `npm run build` and the OpenNext Cloudflare build succeed; fix any Workers-incompatible code. Configure
  wrangler (compatibility flags, secrets list, custom domains mcmaths.lk, www and admin.), a Cron Trigger every minute
  calling the protected processing endpoint, and GitHub-based deploys. Keep a Vercel preview config for private previews only.
- Production checklist: env vars/secrets, separate Supabase projects for dev and production, migrations, webhook
  URL to put in Meta, admin user creation with role claim and 2FA, preview vs production.
- GitHub Actions CI: typecheck, lint, test, build; branch protection notes.
- Docs in /docs: README.md, ARCHITECTURE.md, AI_MODE.md (message examples + troubleshooting), WHATSAPP_SETUP.md
  (from blueprint Part B3), ADMIN_GUIDE.md (plain language for Sir, with screenshot placeholders), RUNBOOK.md (what to do
  if the AI misbehaves: turn AI Mode off, undo actions, pause the WhatsApp number).
- Final launch checklist of manual steps with exact dashboard locations (Cloudflare, Supabase, Meta, domain registrar).
```

---

## R1 — RESUME prompt (if the agent loses context or a session restarts)

```text
Re-read MC-Mathematics-Platform-Blueprint.md and /docs/DECISIONS.md, and inspect the current codebase. Tell me in
10 lines: which phases are already complete, what is partly done, and what is missing or broken. Do not change
anything yet. Then wait for me to paste the next phase.
```

## R2 — FIX prompt (when something breaks)

```text
Something is wrong: <describe it, paste the error or screenshot>. First reproduce it, find the root cause (do not
guess), fix it with the smallest safe change, add or update a test that would have caught it, run typecheck + lint +
tests, and explain what the cause was in 3 lines. Do not refactor unrelated code.
```

## R3 — POLISH prompt (optional, after Phase 2 or 4 if the design feels flat)

```text
Do a design review of <page> as a senior art director. Compare it with top 2026 SaaS sites (bento layouts, oversized
typography, glass surfaces, purposeful motion). List the 8 biggest weaknesses, then fix them: spacing rhythm, type
scale, contrast, motion timing, empty/loading states. Keep animations on transform/opacity only and respect
prefers-reduced-motion. Show before/after notes.
```
