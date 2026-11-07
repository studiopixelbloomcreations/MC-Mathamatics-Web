# MC MATHEMATICS — E-Learning Platform Blueprint

> **Brand:** MC Mathematics — Malinga C Dissanayake, Kurunegala
> **Slogan:** *Maths is the question. MC is the answer.*
> **Stack:** Next.js + Supabase + Kimi (NVIDIA NIM) + WhatsApp Cloud API + Vercel + GitHub
> **Built with:** Antigravity

This file has three parts:

- **Part A**: Full product specification (what we are building, with upgrades)
- **Part B**: Setup guides (Supabase, NVIDIA NIM, WhatsApp on Sir's iPhone, domain + subdomain)
- **Part C**: Hosting options and the cheapest legit choice

> The Antigravity build prompts (master brief + every phase in its own copy-paste box) are in the separate file **MC-Mathematics-GOD-PROMPT.md**.
> **Version 2 changes:** "Send me the report" button, free-first WhatsApp parent reports, parent chat bot (no AI needed), hosting plan (Part C).

---

# PART A — PRODUCT SPECIFICATION

## A0. Upgrades I made to your idea (read this first)

| # | Your idea | Upgrade | Why |
|---|-----------|---------|-----|
| 1 | Login with unique ID only | **ID + 6-digit PIN** (chosen at sign-up). Browser/Chrome saves it like a normal username + password. | IDs are sequential (MCG10TP1001, 1002, 1003...). With ID-only login, anyone can type 1002 and read another child's marks and phone number. These are children's records, so this must be protected. |
| 2 | AI has "full control" | AI gets a **fixed set of safe tools** (update marks, add note, post announcement, mark attendance, run analysis, send parent report). It can never run raw SQL or touch auth/settings. Every action is logged. | LLMs misread messages. A restricted tool set + confirmation step means one bad message cannot wreck the database. |
| 3 | AI does the analysis | **Code calculates all numbers** (averages, rank, trends). The AI only writes the human-friendly explanation. | LLMs make arithmetic mistakes. Parents must never get a wrong mark or rank. |
| 4 | Sir sends marks on WhatsApp | Add a **confirm step**: AI replies "I understood: Kamal, Paper 12, 78/100. Reply 1 to confirm." (can be turned to auto later) | Prevents wrong marks going to a parent's phone. |
| 5 | Sir's WhatsApp talks to AI | Sir chats with a **dedicated MC Maths AI number** (a second number, not Sir's personal one). Only Sir's registered number is accepted. | WhatsApp's official API cannot take over a number already used in a personal WhatsApp app. Details in Part B. |
| 6 | Parent info system sends analysis to WhatsApp | **Free-first delivery.** Parent taps "Start WhatsApp reports" at sign-up, the system replies with the dashboard link and a "Get full report" button. A **"Send me the report"** button on the dashboard does the same any time. Paid template messages are **OFF by default**. | WhatsApp lets you reply free for 24 hours after the parent messages you. Messages you start yourself are billed per message (since July 2025). So we make the parent start the chat. |
| 7 | (not mentioned) | Sir attendance entry (manual + by WhatsApp), student photo-less privacy, topper comparison **anonymized** | Attendance page needs a data source. Showing other students' names is a privacy problem. |
| 8 | (not mentioned) | English + Sinhala ready (i18n), mobile-first performance | Most Sri Lankan students will use phones, often on mobile data. |
| 9 | Parent chat | The parent side of WhatsApp is a **simple rule-based bot (no AI model)**: it only understands START / REPORT / the buttons, and only answers the number registered at sign-up. | Cheaper, instant, cannot be tricked by a clever message, and cannot leak another child's data. |

---

## A1. Product overview

A premium e-learning and progress-tracking platform for MC Mathematics.

**Users**

1. **Students** (grades 6–13) — see papers, results, attendance, analysis, notes, announcements.
2. **Parents** — use the student's dashboard (parental controls) and receive WhatsApp progress reports.
3. **Admin (Sir Malinga)** — uploads papers, enters marks, posts announcements, controls AI Mode.

**Surfaces**

| Surface | URL | Purpose |
|---|---|---|
| Landing page | `mcmaths.lk` (example) | Marketing, trust, sign-up CTA |
| Sign-up | `/signup` | New student registration, ID generation |
| Login | `/login` | ID + PIN |
| Student dashboard | `/dashboard/*` | Everything for students and parents |
| Admin dashboard | `admin.mcmaths.lk` | Sir's control centre (separate subdomain) |
| WhatsApp webhook | `/api/whatsapp/webhook` | AI Mode entry point |

> Subdomains need a **custom domain**. `*.vercel.app` cannot give you `admin.` on a domain you don't own. For temporary testing use a path (`/admin`) and switch to the subdomain when the domain is connected. The code should support both (see Phase 1).

---

## A2. Design direction (research-backed)

I searched current 2026 design trend reports. What is clearly standard right now:

- **Bento grid layouts** for feature sections (used by Apple, Stripe, Linear, Notion, Vercel).
- **Scroll-driven storytelling**: content that reveals, transforms and fades in as you scroll. Native CSS `animation-timeline: scroll()` exists but Safari support is uneven, so use GSAP ScrollTrigger / Framer Motion as the main engine.
- **Dark mode as a first-class theme** (default dark, light toggle).
- **Oversized / kinetic typography** as the hero.
- **Purposeful micro-interactions** (not random animation).
- **Performance-first**: mobile is most traffic, and slow pages lose visitors. Reports also say 3D/WebGL-heavy sites and heavy personalization underdelivered, so we skip heavy 3D.
- Design tokens + a proper design system.

### Visual identity: "The Question and the Answer"

The slogan is the whole concept. Build the hero around it.

**Hero animation sequence**

1. Black/deep-navy screen with a faint animated math grid and a few slowly floating formulas (KaTeX, low opacity).
2. Giant kinetic text fades up word by word: **"Maths is the question."**
3. A large glowing **?** appears and pulses.
4. As the user scrolls (pinned section), the **?** morphs into the **MC** monogram and the line **"MC is the answer."** reveals in the accent color.
5. CTA buttons fade in: **Join the class** (primary) and **Student login** (ghost).

**Palette (design tokens)**

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#070A13` (ink navy) | `#F7F8FC` |
| `--surface` | `#0E1424` | `#FFFFFF` |
| `--surface-glass` | `rgba(255,255,255,0.05)` + blur | `rgba(255,255,255,0.7)` + blur |
| `--border` | `rgba(255,255,255,0.09)` | `rgba(10,15,40,0.08)` |
| `--text` | `#F2F4FA` | `#0B1020` |
| `--muted` | `#8B93A8` | `#5B6379` |
| `--accent` (the "Answer") | `#FFC857` warm gold | `#E6A100` |
| `--brand` (the "Question") | `#6C5CE7` electric violet | `#5B4BDB` |
| `--good / --warn / --bad` | `#2DD4A0 / #FFB020 / #FF5C7A` | same, slightly deeper |

**Typography:** `Geist` (UI) + `Instrument Serif` italic (accent words, big numbers) + `JetBrains Mono` (IDs, marks). Sinhala fallback: `Noto Sans Sinhala`. Load via `next/font` (no layout shift).

**Signature components**

- Glass cards with 1px gradient borders and cursor-following spotlight glow.
- Aurora / mesh gradient background (CSS only, GPU-cheap).
- Animated number counters (students taught, papers done, average improvement).
- Marquee of achievements / testimonials (placeholder content, Sir replaces it).
- Magnetic buttons, smooth hover states, skeleton loaders, page transitions.
- Smooth scrolling via **Lenis**.

**Motion rules**

- Every animation must have a purpose (reveal, guide attention, show change).
- Durations 300–700ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Animate only `transform` and `opacity` (smooth on cheap phones).
- Respect `prefers-reduced-motion` (turn off pinned/parallax effects).
- Mobile gets lighter versions of scroll effects.
- Performance budget: Lighthouse mobile ≥ 90, LCP < 2.5s, no layout shift.

**Landing page sections**

1. Sticky glass navbar (logo, links, Login, Join)
2. Hero (question → answer animation above)
3. Trust strip (counters + "Top maths teacher in Kurunegala")
4. "Meet Sir" section: photo area, story, achievements (placeholders)
5. Bento grid of platform features: Paper results, Smart analysis, Attendance, Parent WhatsApp reports, Announcements, Parental controls
6. "How it works" scroll-pinned 3-step timeline: Join → Learn & sit papers → See exactly where to improve
7. Live-looking analysis preview (animated radar + trend chart, demo data)
8. Classes by grade (cards for Grade 6–13)
9. Testimonials (marquee)
10. FAQ accordion
11. Final CTA band + footer (WhatsApp contact, address, social)

---

## A3. Sign-up and unique ID

**Sign-up fields**

| Field | Notes |
|---|---|
| Full name | required |
| Grade | dropdown 6–13 |
| Age | number, 5–25 |
| Whereabouts | town/area text |
| Student phone | optional |
| Parent WhatsApp number | **required** (reports go here). Validate Sri Lankan format, store E.164 (`+94...`) |
| Parent phone | optional if same as WhatsApp |
| Class type | **Theory + Paper (TP)** or **Theory only (T)** |
| Choose a 6-digit PIN | for login (upgrade A0-1) |
| Parent consent checkbox | "I agree to receive progress reports on WhatsApp and to my child's data being stored" |

**Unique ID format**

```
MC G{grade} {class_type} {serial}

MCG10TP1001  → MC · Grade 10 · Theory+Paper · serial 1001
MCG10T1001   → MC · Grade 10 · Theory only  · serial 1001
```

- Serial starts at **1001** and counts up **per prefix** (`MCG10TP`, `MCG10T`, ...). Assumption: your "1001" is a serial number. Tell me if it should mean something else.
- Generation must be **atomic in Postgres** (no duplicates if two students sign up at once).

**After sign-up screen**

- Big, beautiful ID card animation (ID in mono font, 48px+, gold glow).
- Buttons: **Copy ID**, **Download as image**, **Continue**.
- Warning text: "Write this down. You need it to log in."
- A hidden-but-real `<form>` with `autocomplete="username"` (ID) and `autocomplete="new-password"` (PIN) so Chrome/Safari offers to **save the credentials**. This is how "the browser remembers the key" works.
- **Start WhatsApp reports (free)** button: opens `https://wa.me/<AI_NUMBER>?text=START%20MCG10TP1001` (message pre-filled with the ID). The parent just presses send. Then:
  1. The system checks the sender's number matches the parent WhatsApp number given at sign-up.
  2. It replies (free, the 24-hour window is now open) with: a welcome, **the link to this student's dashboard**, and a button **"Get full analysis report"**.
  3. Tapping that button counts as the parent messaging us, which opens a fresh free window, and the full report arrives.

```
👋 Welcome to MC Mathematics!
You're now connected to Kamal's progress updates (MCG10TP1001).

📊 Open Kamal's dashboard:
https://mcmaths.lk/dashboard

Want the full analysis report?  Tap the button below 👇
[ 📄 Get full analysis report ]
```

**Login**

- Inputs: Student ID + PIN. IDs are case-insensitive; trim spaces.
- Correct → `/dashboard`. Unknown ID → friendly message + button to `/signup`. Wrong PIN → generic error. Lock for 15 min after 5 failures (rate limit).
- "Forgot PIN?" → request goes to Sir's admin panel / or WhatsApp OTP to the parent number.
- Every login is written to `login_log` (time, device, IP hash).

---

## A4. Student dashboard

Left sidebar on desktop, bottom tab bar on mobile. All pages load with staggered fade-in and skeleton loaders. Realtime updates (Supabase Realtime) so a new mark appears without refresh, with a subtle "New result" toast.

### 1. Main dashboard
- Greeting + ID chip + grade
- Bento cards: latest result (animated ring), overall average, class rank band, attendance %, next/ongoing paper, newest announcement, newest special note
- "Focus areas" top 3 weak topics with a one-line tip each
- **"Send me the report"** button (see A4-8)

### 2. Paper results
Three tabs (my interpretation, tell me if you meant something else):
- **Ongoing papers** — papers open for the student's grade right now (title, due date, download link, status)
- **Finished papers** — papers closed for the grade, with the student's mark if entered
- **Recently done** — the student's last 5 marked papers with mark, %, rank band, and change vs the previous paper (↑ ↓)

Paper detail drawer: marks, section breakdown (if entered), class average, topper score (anonymous), downloadable paper/marking scheme.

### 3. Attendance
- Month calendar heatmap (present / absent / late / excused)
- Table with date, session, status
- Attendance % ring and streak
- Alert style card if attendance dips under 75%

### 4. Analysis (the heart of the product)
The goal: **the student and parent see exactly where the student is weak, what to improve, and the downfalls.**

Charts (all animate on first view: lines draw, bars grow, radar expands):
1. **Trend line:** the student's % across all papers over time, with a dotted line for class average.
2. **Radar chart:** topic-wise strength, student vs class average vs topper.
3. **Comparison bars:** *this paper vs previous papers*, *student vs class average*, *student vs topper (1st in class)*.
4. **Rank movement:** percentile band over time (e.g. "Top 20%" → "Top 12%"). Show **bands**, not exact rank, by default.
5. **Topic heatmap:** topics × papers, color by score.
6. **Consistency & improvement score.**

Text insights (generated by AI from the computed numbers):
- Strengths, weaknesses, biggest drop, biggest improvement
- "What to do next" (3 concrete actions, topic-level)
- Predicted trajectory is optional and clearly labeled as an estimate

> **Topic-level analysis requires topic data.** When a paper is uploaded, Sir tags each paper with topics/sections and enters marks per section (e.g. Algebra 18/25, Geometry 10/25). If he only enters one total mark, the analysis falls back to total-score trends and class comparison only. The mark-entry form must make section marks easy (and optional).

Anonymization: the topper and class numbers are shown as scores only, never names.

### 5. Parental controls
Protected by a separate **parent PIN** (set on first visit).
- **Lock dashboard** (instant, or schedule e.g. weekdays 10pm–6am, or until a date)
- Hide/show results to the student (parent-only view)
- WhatsApp report preferences: on/off, frequency (after every paper / weekly), language (EN/සිං)
- View recent login activity of the student account
- Change student PIN / reset

### 6. Special notes
Feed of notes from Sir for this student (private to this student + parent). Newest first, with date and a "New" badge. Notes can be marked as read.

### 7. Announcements
Feed from admin. Targeting: **All**, **a grade**, or **an individual student**. Pinned announcements on top. Unread count badge in the sidebar.

### 8. The "Send me the report" button
Shown on the main dashboard and the Analysis page (and in Parental controls).
- Click → opens `https://wa.me/<AI_NUMBER>?text=REPORT%20MCG10TP1001` (pre-filled). The parent presses send in WhatsApp.
- The parent bot replies within seconds with the **full analysis report** (stored analysis, formatted as a WhatsApp message) plus the dashboard link. This reply is inside the 24-hour window, so it is **free**.
- Button states: "Send me the report" / "Report ready, tap to send" (when a new paper was analysed) / "Sent ✓ (time)".
- If the parent has not started WhatsApp reports yet, the button first shows a one-time explainer ("Tap send in WhatsApp to connect") and then works the same way.
- Optional free alert: a PWA **web push notification** ("New result for Kamal: tap to view") whenever new marks arrive. iPhone users must add the site to the Home Screen first.

---

## A5. Admin dashboard (`admin.` subdomain)

Auth: email + password via Supabase Auth, **plus 2FA (TOTP)**. Only users with `role = 'admin'`.

### Sections
1. **Overview:** students count, papers, latest activity, AI Mode state
2. **Paper upload:** title, **grade selector (6–13)**, class type (TP / T / both), paper date, status (ongoing/finished), total marks, topic/section list, PDF/image upload (Supabase Storage). Papers show **only to students of the selected grade** (and class type). Enforced by Row Level Security, not just UI.
3. **Mark entry:** choose grade → choose paper → choose **student from a searchable dropdown** (name + ID) → enter marks (+ optional section marks) → Save. The student's dashboard updates instantly (Realtime) and analysis is recomputed. Support bulk entry table for a whole class.
4. **Attendance entry:** pick date/session → tick present/absent/late for the class list.
5. **Announcements:** create, target (all/grade/student), pin, schedule, edit, delete.
6. **Special notes:** pick student → write note.
7. **Students:** searchable table, view profile, reset PIN, deactivate.
8. **Login log:** who logged in, when, device, IP hash, failed attempts. Filter by student/date/admin.
9. **AI Mode panel:** toggle, AI action history (every AI action with raw WhatsApp text, parsed JSON, result), undo button for recent AI actions.
10. **Parent reports:** delivery status of WhatsApp reports (sent / delivered / failed), resend.

### AI Mode toggle: exact behavior

When Sir flips **Turn on AI Mode**:
- Settings: `ai_mode = true`.
- All manual-edit screens (paper upload, mark entry, announcements, notes, attendance) become **read-only**. Enforced **server-side** too: manual write endpoints return `409 AI_MODE_ACTIVE`.
- The admin UI shows an AI Mode banner (animated pulsing dot).

When Sir tries to use any manual control while AI Mode is on, the page behind is **greyed out and blurred** and this modal appears:

```
┌─────────────────────────────────────────────┐
│  🤖  AI Mode is currently active             │
│                                             │
│  Manual control cannot be continued.        │
│  Enable manual control?                     │
│                                             │
│            [  No  ]     [  Yes  ]           │
└─────────────────────────────────────────────┘
```

- **Yes** → `ai_mode = false`, in-flight AI jobs finish or are cancelled, WhatsApp commands now reply "AI Mode is off. Turn it on in the admin panel to use WhatsApp control."
- **No** → modal closes, stays in AI Mode, page stays read-only.

Also show this modal right after turning AI Mode **on** the first time as a confirmation ("AI Mode is now active").

---

## A6. AI Mode: how it works

### Architecture

```
Sir's iPhone WhatsApp
        │  (message to the MC Maths AI number)
        ▼
Meta WhatsApp Cloud API ──webhook──► /api/whatsapp/webhook  (Vercel)
                                         │ 1. verify signature
                                         │ 2. sender == Sir's number?
                                         │ 3. ai_mode == true?
                                         │ 4. de-duplicate message id
                                         │ 5. save to inbound_messages, return 200 fast,
                                         │    then trigger /api/ai/process (secret header).
                                         │    A 1-minute cron also picks up anything unprocessed.
                                         ▼
                                  AI processor (queue-triggered background job, see below)
                                         │ Kimi via NVIDIA NIM
                                         │ → returns TOOL CALLS (structured JSON)
                                         ▼
                                  Validator (zod) + student lookup by unique ID
                                         │ → preview back to Sir: "Reply 1 to confirm"
                                         ▼
                                  Executor (server code, service role)
                                         │ writes marks / notes / announcements
                                         │ logs to ai_actions (audit)
                                         ▼
                              Analysis engine (pure code) ─► stores analysis JSON
                                         │
                                         ├──► Kimi writes the friendly explanation text
                                         ├──► Supabase Realtime → student dashboard updates live
                                         └──► Parent Report service → WhatsApp template → parent
```

### The AI's tools (the ONLY things it can do)

| Tool | Arguments |
|---|---|
| `record_marks` | `student_id`, `paper_ref`, `marks`, `section_marks?` |
| `add_special_note` | `student_id`, `text` |
| `post_announcement` | `text`, `target` (all / grade N / student_id), `pinned?` |
| `mark_attendance` | `date`, `session`, `present_ids[]`, `absent_ids[]`, `late_ids[]` |
| `run_analysis` | `student_id` |
| `send_parent_report` | `student_id` |
| `ask_clarification` | `question` (when the message is ambiguous) |

No other capability. No SQL. No deleting students. No changing settings.

### Message examples Sir can send

```
MCG10TP1001
Paper 12 marks 78/100
Note: Great improvement in algebra, needs to practice geometry proofs
```
```
Announcement for Grade 11: Extra class this Saturday 8am
```
```
Marks for Paper 14 (Grade 10 TP):
MCG10TP1001 - 82
MCG10TP1002 - 67
MCG10TP1003 - 91
```
Natural language works too. The AI extracts the data; the code validates it.

### Safety rules (must be implemented in code, not only in the prompt)

1. Accept messages **only** from Sir's whitelisted WhatsApp number(s).
2. Verify Meta's `X-Hub-Signature-256` on every webhook call.
3. Reject marks outside `0..total_marks`; reject unknown IDs; never "guess" an ID.
4. **Confirmation step** (default ON): preview and "Reply 1 to confirm / 2 to cancel". Option in settings to auto-confirm.
5. De-duplicate by WhatsApp message ID (Meta retries webhooks).
6. Everything logged in `ai_actions` (raw message, parsed tool calls, result, who confirmed). Undo available for 24h.
7. AI cannot edit anything when `ai_mode = false`.
8. AI output goes through the same validation as manual input.
9. Rate limit AI calls and cap token usage per day.
10. The AI's analysis text must only use numbers supplied by the analysis engine (pass numbers in, instruct "do not invent numbers", and verify digits in output against input).

### Analysis engine (code, deterministic)

For a student after each new mark:
- % score, class average, class median, topper score, standard deviation
- Percentile band (e.g. top 10%/20%/50%)
- Trend: last 3 vs previous 3 average, slope over all papers
- Section/topic averages vs class average vs topper
- Weakest 3 topics, biggest drop, biggest improvement
- Consistency (variance), attendance correlation note
- Output as JSON → stored in `analyses` → used by charts **and** by the AI to write the explanation.

### Parent Report system: free-first (connected to the AI)

**Goal:** parents get full analysis on WhatsApp at **no message cost**, by making sure the parent starts the chat (the 24-hour free window).

**Two separate WhatsApp "brains" on the one AI number**

| Sender | Handled by | Uses AI model? |
|---|---|---|
| Sir's number | AI Mode flow (A6 above) | Yes (Kimi, tools, confirmation) |
| Any other number (parents) | **Parent bot**, rule-based | **No** |

**Parent bot behavior**

| Parent sends / taps | Bot does |
|---|---|
| `START <ID>` (from the sign-up button) | Verify sender = registered parent number → mark verified + opted-in → reply with welcome, dashboard link, **[Get full analysis report]** button |
| `REPORT <ID>` (from the dashboard button) or taps **[Get full analysis report]** | Reply with the stored full analysis for that student + dashboard link |
| Anything else ("hi", "result?") | Short menu: "Reply REPORT for the latest report or STOP to pause messages" |
| `STOP` | Opt out, confirm; never message again until `START` |
| Number not registered / wrong ID | Polite refusal, **no student data revealed**, rate-limited |
| One number linked to several students (siblings) | Bot sends a list "Which student?" and replies for the one chosen |

**Report content (no AI call at request time):** the analysis engine output + the AI-written narrative stored earlier in `analyses`. The bot only formats it, so replies are instant and cost no AI tokens.

**When Sir adds new marks (AI Mode or manual):**
1. Analysis is recomputed and stored; the narrative is generated once.
2. Dashboard updates live (Realtime). Button changes to "Report ready".
3. **Smart send:** if this parent's free window is open (parent messaged in the last 24h), the report is sent automatically (free).
4. Otherwise: **do not send a paid message.** Mark `report_pending = true`, send the free web push (if enabled), and show the "Report ready" badge. The next time the parent taps the button, they get it.
5. Paid template push (`progress_report`) exists but is **OFF by default**. Sir can switch it on in settings (`paid_templates_enabled`) if he decides the cost is worth it, per parent opt-in.

Everything is logged in `report_deliveries` (sent / delivered / failed).

Report layout (WhatsApp text):

```
📘 MC Mathematics — Progress Report
Student: Kamal Perera (MCG10TP1001)
Paper 12: 78/100  (class avg 64, +9 vs last paper) 📈

✅ Strong: Algebra, Fractions
⚠️ Needs work: Geometry proofs, Trigonometry
👉 Next steps: 1) ... 2) ... 3) ...

Full analysis: https://mcmaths.lk/dashboard/analysis
— Sir Malinga C Dissanayake
```

---

## A7. Database schema (Supabase / Postgres)

```sql
-- Enums
create type class_type as enum ('T','TP');
create type paper_status as enum ('ongoing','finished');
create type att_status as enum ('present','absent','late','excused');
create type entry_source as enum ('manual','ai');

-- Atomic unique-ID counters
create table id_counters (
  prefix text primary key,
  last_value int not null default 1000
);

create or replace function next_student_id(p_prefix text) returns text
language plpgsql security definer as $$
declare v int;
begin
  insert into id_counters(prefix, last_value) values (p_prefix, 1001)
  on conflict (prefix) do update set last_value = id_counters.last_value + 1
  returning last_value into v;
  return p_prefix || v::text;
end $$;

-- Students (linked to auth.users)
create table students (
  id uuid primary key references auth.users(id) on delete cascade,
  unique_id text unique not null,           -- MCG10TP1001
  full_name text not null,
  grade int not null check (grade between 6 and 13),
  age int,
  whereabouts text,
  class_type class_type not null,
  student_phone text,
  parent_whatsapp text not null,            -- E.164
  parent_phone text,
  report_opt_in boolean default false,
  report_language text default 'en',
  active boolean default true,
  created_at timestamptz default now()
);

create table papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  grade int not null,
  class_type class_type,                    -- null = both
  status paper_status not null default 'ongoing',
  paper_date date,
  due_at timestamptz,
  total_marks numeric not null,
  sections jsonb default '[]',              -- [{name:'Algebra', max:25}, ...]
  file_path text,                           -- Supabase Storage
  created_at timestamptz default now()
);

create table marks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  paper_id uuid references papers(id) on delete cascade,
  marks numeric not null,
  section_marks jsonb,
  source entry_source not null default 'manual',
  entered_at timestamptz default now(),
  unique (student_id, paper_id)
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  date date not null,
  session text default 'main',
  status att_status not null,
  source entry_source default 'manual',
  unique (student_id, date, session)
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  target_grade int,                         -- null + null = everyone
  target_student uuid references students(id),
  pinned boolean default false,
  source entry_source default 'manual',
  created_at timestamptz default now()
);

create table special_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  body text not null,
  source entry_source default 'manual',
  created_at timestamptz default now()
);

create table analyses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  paper_id uuid references papers(id),
  metrics jsonb not null,                   -- engine output (numbers)
  narrative jsonb,                          -- AI text (en / si)
  created_at timestamptz default now()
);

create table parental_settings (
  student_id uuid primary key references students(id) on delete cascade,
  parent_pin_hash text,
  locked boolean default false,
  lock_until timestamptz,
  lock_schedule jsonb,
  hide_results boolean default false,
  report_frequency text default 'every_paper'
);

create table login_log (
  id bigserial primary key,
  user_id uuid, unique_id text, role text,
  success boolean, ip_hash text, user_agent text,
  created_at timestamptz default now()
);

create table system_settings (
  id int primary key default 1 check (id = 1),
  ai_mode boolean not null default false,
  ai_confirm_required boolean not null default true,
  admin_whatsapp text not null,             -- Sir's number, E.164
  updated_at timestamptz default now()
);

create table inbound_messages (
  wa_message_id text primary key,           -- dedupe key
  from_number text, body text, raw jsonb,
  status text default 'received',
  received_at timestamptz default now()
);

create table ai_actions (
  id uuid primary key default gen_random_uuid(),
  wa_message_id text references inbound_messages(wa_message_id),
  raw_text text, tool_calls jsonb, result jsonb,
  status text,                              -- previewed / confirmed / executed / cancelled / failed / undone
  undo_data jsonb,
  created_at timestamptz default now()
);

create table report_deliveries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  analysis_id uuid references analyses(id),
  wa_message_id text, status text, error text,
  created_at timestamptz default now()
);
```

```sql
-- Version 2 additions: free-first WhatsApp reports
alter table students
  add column parent_last_inbound_at timestamptz,   -- last time parent messaged us (24h free window)
  add column parent_wa_verified boolean default false,
  add column report_pending boolean default false;

alter table system_settings
  add column paid_templates_enabled boolean not null default false;  -- OFF = zero message cost

create table report_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  source text,                 -- 'dashboard_button' | 'whatsapp_button' | 'start' | 'smart_send'
  status text default 'sent',  -- sent / blocked_unregistered / failed
  created_at timestamptz default now()
);

create table push_subscriptions (  -- free web push (PWA)
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  endpoint text unique not null, p256dh text, auth text,
  created_at timestamptz default now()
);
```

**Row Level Security (mandatory, enable on every table)**
- `students`: a student reads/updates only their own row; admin reads all.
- `papers`: students read only where `grade = their grade` and (`class_type` is null or matches).
- `marks`, `attendance`, `special_notes`, `analyses`, `parental_settings`: student reads only `student_id = auth.uid()`; **no student write access** (except parental settings via parent-PIN-checked server action).
- `announcements`: students read where target is all, their grade, or them.
- `system_settings`, `ai_actions`, `inbound_messages`, `login_log`: admin only.
- All AI/WhatsApp writes use the **service role** key on the server only.
- Admin check: `(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'`.

---

## A8. Tech stack decisions

| Layer | Choice |
|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** |
| Styling | Tailwind CSS v4 + shadcn/ui + CSS variables for tokens |
| Animation | **GSAP + ScrollTrigger**, **Framer Motion** (UI), **Lenis** (smooth scroll) |
| Charts | **Recharts** (or visx) with custom animated styling |
| Math rendering | **KaTeX** |
| Forms/validation | React Hook Form + **zod** |
| Data | Supabase (Postgres, Auth, Storage, Realtime) via `@supabase/ssr` |
| AI | Kimi via **NVIDIA NIM** (OpenAI-compatible API) behind an adapter |
| Messaging | **WhatsApp Cloud API** (Meta) |
| Hosting | **Cloudflare (production, free plan allows commercial use)**; Vercel only for dev previews; GitHub for code |
| Admin subdomain | One codebase, host-based routing in `middleware.ts` |
| i18n | `next-intl` (English + Sinhala) |
| Testing | Vitest (analysis engine), Playwright (login, mark entry, AI mode modal) |

---

## A9. Security and privacy checklist

- [ ] PIN hashed (Supabase Auth handles it), 5-attempt lockout, rate limiting on login/signup
- [ ] RLS on all tables, tested with a second student account
- [ ] `SUPABASE_SERVICE_ROLE_KEY`, `NVIDIA_API_KEY`, `WHATSAPP_TOKEN` are **server-only env vars**, never `NEXT_PUBLIC_`
- [ ] Never commit `.env` to GitHub (`.gitignore` + secret scanning)
- [ ] Webhook signature verification
- [ ] Parent bot answers **only the registered parent number**; a wrong number never gets student data
- [ ] Parent bot is rule-based (no AI model), so it can't be talked into revealing anything
- [ ] Admin 2FA
- [ ] Phone numbers stored E.164; masked in UI (`+94 77 ••• 4567`)
- [ ] Parent consent checkbox stored with timestamp
- [ ] Data export/delete for a student on request (Sri Lanka's data protection law (PDPA No. 9 of 2022) covers this kind of personal data of minors; have Sir confirm requirements with a lawyer)
- [ ] Security headers + CSP via `next.config`
- [ ] Daily Supabase backups (enable PITR on a paid plan later)

---

# PART B — SETUP GUIDES

## B1. Supabase
1. Create a project at supabase.com (pick the region closest to Sri Lanka, e.g. Singapore).
2. Auth → Providers: enable **Email** (we use a synthetic email like `mcg10tp1001@students.mcmaths.lk` + PIN, so students never see an email). Turn **email confirmations OFF** for student accounts.
3. SQL Editor → paste the schema from A7, then add RLS policies.
4. Storage → create private bucket `papers`.
5. Copy `Project URL`, `anon key`, `service_role key` into `.env.local` (Part C env list).
6. Create Sir's admin user in Auth, then set `app_metadata.role = 'admin'` (SQL: `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = '...'`).

## B2. NVIDIA NIM (Kimi)
1. Go to **build.nvidia.com**, sign in, open the model catalog, find the Kimi model you want, and click **Get API Key**.
2. NIM exposes an **OpenAI-compatible** endpoint: base URL `https://integrate.api.nvidia.com/v1`.
3. Put the **exact model ID shown on the model's page** into `NVIDIA_MODEL` (I could not verify the name "Kimi 3.1 Pro" in my search, so copy whatever the catalog shows; never hard-code it).
4. Write an `AIProvider` interface so the model can be swapped by changing one env var.
5. Use **tool/function calling** with a JSON schema for the tools in A6. If the chosen model handles tools poorly, fall back to "reply with JSON only" + zod validation + one retry.
6. Free NIM keys are rate-limited and meant for development. Plan for fallback/retry and queueing. For real production load check NVIDIA's current terms.

## B3. WhatsApp for Sir's iPhone (step by step)

### The one thing to understand first
Sir **keeps using his normal WhatsApp on his iPhone**. The AI lives on a **separate business phone number**. Sir saves that number as a contact (e.g. "MC Maths AI") and chats with it like any person. Nothing special is installed on the iPhone.

Why a separate number? Meta's official Cloud API registers a number to the API. A number already active in a personal WhatsApp app can't simply be used for it. (Meta has a "coexistence" feature that lets the WhatsApp Business app and the API share a number, but availability depends on country and rules, so check in the Meta dashboard whether Sri Lanka is supported. The safe plan is a dedicated SIM.)

**Avoid** unofficial libraries (Baileys, whatsapp-web.js and similar) that automate a normal number. They can get the number banned.

### Setup
1. **Get a new SIM** (Dialog / Mobitel / Hutch) for the AI number. Keep it active (receives an SMS/call code once).
2. Create/log in to a **Meta Business account** at business.facebook.com (use Sir's Facebook account or a dedicated one).
3. Go to **developers.facebook.com** → My Apps → **Create App** → type **Business** → add the **WhatsApp** product.
4. Meta gives you a **free test number** and a temporary token. You can add **up to 5 verified recipient numbers**. Add **Sir's iPhone number** as a recipient. Use this for development.
5. Build the webhook (Part C Phase 7). In App → WhatsApp → Configuration:
   - Callback URL: `https://YOUR-DOMAIN/api/whatsapp/webhook`
   - Verify token: any secret string you choose (same as `WHATSAPP_VERIFY_TOKEN`)
   - Subscribe to the **`messages`** field.
   - While developing locally, expose your dev server with `cloudflared tunnel` or `ngrok` (Meta needs public HTTPS). On Vercel, use the deployment URL.
6. **Permanent token**: Business Settings → Users → **System Users** → create one → assign the app and WhatsApp permissions → generate a token that doesn't expire → `WHATSAPP_TOKEN`.
7. **Go live with the real number**: WhatsApp → API Setup → **Add phone number** → enter the new SIM's number → verify with the SMS/voice code → set the display name (e.g. "MC Mathematics"; Meta reviews it). Update `WHATSAPP_PHONE_NUMBER_ID`.
8. **Business verification** in Business Settings (needed to raise sending limits and keep the display name). Prepare business registration or documents.
9. **Message templates** are **optional** in the free-first design. Only create `progress_report` (Utility category) if Sir later switches on paid auto-send.
10. **Sir's phone**: open WhatsApp → New chat → paste the AI number → send "Hi". Done. Add the number to `system_settings.admin_whatsapp` (E.164 format, e.g. `+9477xxxxxxx`).

### Costs (as of the sources I found)
- API access is free. Since 1 July 2025, messages are billed **per message**, but **replies inside the 24-hour window after the user messages you are free.**
- Sir → AI chat, the AI's replies to Sir, the parent bot's welcome, and every report the parent asks for (START / REPORT / buttons) are all inside that window, so **no message cost**.
- The only paid case is a **business-started** message when no window is open (for example auto-pushing a report to a parent who hasn't messaged in 24h). That is why paid templates are OFF by default.
- Check Meta's pricing page before launch; prices and rules can change.

## B4. Domain + subdomain (Vercel steps for dev; production steps in Part C)

> Production hosting is recommended on Cloudflare (Part C). The idea is identical: add `admin.` as a second hostname on the same project and let `middleware.ts` route by host.

1. Push to GitHub, import the repo in Vercel, add all env vars (Production + Preview).
2. Buy a domain (e.g. `mcmaths.lk` via a .lk registrar like LK Domain Registry resellers, or a `.com`).
3. Vercel → Domains → add `mcmaths.lk`, `www.mcmaths.lk`, and `admin.mcmaths.lk` to the **same project**.
4. `middleware.ts` rewrites requests where `host` starts with `admin.` to the `/admin` route group and blocks `/admin` on the main host.
5. Cookies: scope auth cookies per host (do not share across subdomains) so the admin session is separate from student sessions.

## B5. Environment variables

```env
NEXT_PUBLIC_SITE_URL=https://mcmaths.lk
NEXT_PUBLIC_ADMIN_URL=https://admin.mcmaths.lk
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only
NVIDIA_API_KEY=                     # server only
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=                       # exact ID from build.nvidia.com
WHATSAPP_TOKEN=                     # server only
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=                # for signature verification
CRON_SECRET=
```

---

# PART C — HOSTING & COSTS

## C1. The honest truth about "one-time payment" hosting

- **Genuine lifetime hosting does not exist for an app like this.** A server costs money every month, and one payment cannot fund that forever. Lifetime deals are mostly WordPress/shared-hosting offers, many hide later charges (backups, IPs, "maintenance"), and several well-known "lifetime" providers have shut down or forced customers to migrate. This platform needs a Node.js runtime, a webhook and scheduled jobs, so a cheap "lifetime" shared host is also technically the wrong tool.
- **What is actually one-time (or close to it):** a **prepaid domain** (you can usually prepay several years in one go) and **free-plan hosting** that costs $0 per month.
- So the real goal is: **$0/month hosting that is legitimate, recognized and allowed for commercial use.**

## C2. Options compared (prices change, verify before paying)

| Option | Cost | Legit / recognized | Commercial use | Next.js fit | Verdict |
|---|---|---|---|---|---|
| **Cloudflare (Workers/Pages free plan)** | **$0** | Yes, one of the biggest networks in the world | **Allowed** | Good via the official OpenNext adapter (`@opennextjs/cloudflare`); a few Next features differ | ✅ **Recommended: cheapest legit** |
| Netlify free plan | $0 | Yes | Allowed | OK | Fallback. Monthly credits are limited and sites pause when they run out |
| Render free web service | $0 | Yes | Allowed | Works as a Node server | Fallback. Free services sleep when idle, so the first request is slow, bad for webhooks |
| Vercel Hobby (free) | $0 | Yes | **Not allowed** (non-commercial only) | Best | Use **only while building**. Sir's paid classes count as commercial |
| Vercel Pro | about $20/month per seat | Yes | Allowed | Best | Easiest, but about $240 a year |
| Prepaid multi-year VPS (e.g. Hostinger, Contabo style) | Pay several years upfront | Recognized brands | Allowed | Works, you manage it | Closest to "one-time", but **you** must run Node, SSL, updates and security. Not recommended for a non-sysadmin |
| "Lifetime hosting" deals | One payment | Mostly unknown brands | Unclear | Usually no Node | ❌ **Avoid** |

## C3. My pick: Cloudflare free plan + a prepaid domain

**Total recurring cost for hosting: $0.** The only things you pay are:

1. **Domain**, prepaid for as many years as you like (it can't be "lifetime"). Use a `.lk` domain from a registrar accredited by the LK Domain Registry (shows locally trusted) or a `.com`.
2. **WhatsApp**: one extra SIM for the AI number (about nothing after the SIM), and **no message fees** with the free-first design.
3. **Supabase**: the free tier is fine to build and test. Before real students use it, move to the paid plan (free projects pause after inactivity and have no proper backups). This is the one cost you should expect to pay eventually. I did not verify current Supabase prices, so check them.

**Setting it up (when the app is built):**

1. Create a free Cloudflare account and add your domain (or buy it there if your TLD is supported).
2. In the project add `@opennextjs/cloudflare` and `wrangler`; Antigravity does this in Phase 10 of the god prompt.
3. Connect the GitHub repo; every push to `main` deploys automatically.
4. Add custom domains: `mcmaths.lk`, `www.mcmaths.lk`, `admin.mcmaths.lk`.
5. Add all environment variables as secrets (never in the repo).
6. Cloudflare Cron Trigger (every minute) calls `/api/ai/process` to pick up unprocessed WhatsApp messages. Use `CRON_SECRET` to protect it.

**Free-plan limits to keep in mind:** the Workers free plan has a daily request limit (around 100,000 per day at the time of the sources I found). A single teacher's class is far below that. If you ever outgrow it, the paid Workers plan is only a few dollars a month.

**While building:** keep using Vercel Hobby for private preview links only. **Switch to Cloudflare before any real student signs up.**

## C4. Estimated running cost

| Item | Cost |
|---|---|
| Hosting (Cloudflare free) | $0 |
| WhatsApp messages (free-first) | $0 |
| AI (NVIDIA NIM free dev key) | $0 for now; check their terms and limits for production |
| Domain | small yearly fee, prepayable |
| New SIM for AI number | small one-time cost + keep it active |
| Supabase | $0 while building; plan to upgrade for real use |

## C5. Handy extras (optional, later)

- Free PWA install + web push notifications (already in the plan)
- Weekly summary that parents request with one tap
- Student leaderboard (opt-in, anonymized)
- Marking-scheme release scheduling
- Fee/payment tracking (separate module)
- Voice notes from Sir transcribed by the AI

---

*Built for MC Mathematics. Maths is the question. MC is the answer.*
