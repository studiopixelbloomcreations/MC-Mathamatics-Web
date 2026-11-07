# System Architecture & Technical Specifications

## 1. Topological Map & Host-Based Routing

The platform utilizes host-based middleware routing (`middleware.ts`):
- `mcmaths.lk`, `www.mcmaths.lk`: Public Landing Page, Registration (`/signup`), Student Portal (`/dashboard`), Design System (`/design-system`).
- `admin.mcmaths.lk`: Isolated Administrative Cockpit (`/admin`). In production, accessing `/admin` directly on the root domain returns a 404 block.

```
                    Internet Inbound
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      Root / WWW Host              Admin Host
      (Student Portal)          (Admin Cockpit)
             │                           │
   [Next.js App Router]        [Next.js App Router]
             │                           │
             └─────────────┬─────────────┘
                           ▼
          Supabase PostgreSQL (14 Tables, RLS)
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
Meta WhatsApp Cloud API            Cloudflare Cron Worker
(/api/whatsapp/webhook)             (/api/cron/process)
```

## 2. Row Level Security (RLS) Model

All 14 tables enforce Row Level Security:
- `students`: Students read only their own record; admin reads all.
- `papers`: Filtered by student grade and class type (`TP` / `T` / `both`).
- `marks`: Student reads only marks matching their `student_id`.
- `attendance`: Student reads only their attendance entries.
- `special_notes`: Student reads only notes directed to them.
- `announcements`: Filtered by target (`all`, `grade:N`, or student ID).
- `parental_settings`: Private to student/parent auth context.
- `system_settings`, `ai_actions`, `inbound_messages`, `login_log`: Strictly accessible by `is_admin()`.

## 3. Server-Side Parental Lock Enforcement

Unlike typical client-side hiding, MC Mathematics enforces the parental gate on the server before data serialization:
- If `locked: true`, scheduled bedtime lock is active, or temporary lock has not expired:
  - `getStudentDashboardData()` and `getStudentAnalysisData()` omit marks, papers, and attendance records from the JSON payload.
  - Returns `LockedScreen` requiring the 6-digit parent PIN.
