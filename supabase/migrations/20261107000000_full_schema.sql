-- =============================================================================
-- MC MATHEMATICS PLATFORM SCHEMA (Blueprint A7 + V2 Additions)
-- =============================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enums
create type class_type as enum ('T', 'TP');
create type paper_status as enum ('ongoing', 'finished');
create type att_status as enum ('present', 'absent', 'late', 'excused');
create type entry_source as enum ('manual', 'ai');

-- -----------------------------------------------------------------------------
-- 1. Atomic Unique-ID Counters & Sequence Generator
-- -----------------------------------------------------------------------------
create table if not exists id_counters (
  prefix text primary key,
  last_value int not null default 1000
);

create or replace function next_student_id(p_prefix text)
returns text
language plpgsql
security definer
as $$
declare
  v int;
begin
  insert into id_counters (prefix, last_value)
  values (p_prefix, 1001)
  on conflict (prefix)
  do update set last_value = id_counters.last_value + 1
  returning last_value into v;

  return p_prefix || v::text;
end;
$$;

-- -----------------------------------------------------------------------------
-- 2. Students (Linked to auth.users)
-- -----------------------------------------------------------------------------
create table students (
  id uuid primary key references auth.users(id) on delete cascade,
  unique_id text unique not null,                  -- e.g. MCG10TP1001
  full_name text not null,
  grade int not null check (grade between 6 and 13),
  age int check (age between 5 and 25),
  whereabouts text,
  class_type class_type not null,
  student_phone text,
  parent_whatsapp text not null,                   -- E.164 e.g. +94771234567
  parent_phone text,
  report_opt_in boolean default true,
  report_language text default 'en',
  active boolean default true,
  consent_given_at timestamptz default now(),
  -- V2 Additions for Free-First WhatsApp Engine
  parent_last_inbound_at timestamptz,              -- tracks the free 24-hr window
  parent_wa_verified boolean default false,
  report_pending boolean default false,
  created_at timestamptz default now()
);

create index idx_students_grade_type on students(grade, class_type);
create index idx_students_parent_wa on students(parent_whatsapp);
create index idx_students_unique_id on students(unique_id);

-- -----------------------------------------------------------------------------
-- 3. Papers
-- -----------------------------------------------------------------------------
create table papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  grade int not null check (grade between 6 and 13),
  class_type class_type,                           -- null = applies to both T and TP
  status paper_status not null default 'ongoing',
  paper_date date default current_date,
  due_at timestamptz,
  total_marks numeric not null default 100,
  sections jsonb default '[]'::jsonb,              -- e.g. [{"name":"Algebra","max":25}]
  file_path text,                                  -- Supabase Storage private bucket
  created_at timestamptz default now()
);

create index idx_papers_grade_status on papers(grade, status);

-- -----------------------------------------------------------------------------
-- 4. Marks
-- -----------------------------------------------------------------------------
create table marks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  paper_id uuid not null references papers(id) on delete cascade,
  marks numeric not null check (marks >= 0),
  section_marks jsonb default '{}'::jsonb,
  source entry_source not null default 'manual',
  entered_at timestamptz default now(),
  unique (student_id, paper_id)
);

create index idx_marks_student on marks(student_id);
create index idx_marks_paper on marks(paper_id);

-- -----------------------------------------------------------------------------
-- 5. Attendance
-- -----------------------------------------------------------------------------
create table attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  date date not null default current_date,
  session text not null default 'main',
  status att_status not null default 'present',
  source entry_source not null default 'manual',
  created_at timestamptz default now(),
  unique (student_id, date, session)
);

create index idx_attendance_student_date on attendance(student_id, date);

-- -----------------------------------------------------------------------------
-- 6. Announcements
-- -----------------------------------------------------------------------------
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Announcement',
  body text not null,
  target_grade int check (target_grade between 6 and 13), -- null = all grades
  target_student uuid references students(id) on delete cascade, -- null = class/grade wide
  pinned boolean not null default false,
  source entry_source not null default 'manual',
  created_at timestamptz default now()
);

create index idx_announcements_target on announcements(target_grade, target_student);

-- -----------------------------------------------------------------------------
-- 7. Special Notes (Private from Sir to Student & Parent)
-- -----------------------------------------------------------------------------
create table special_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  body text not null,
  is_read boolean not null default false,
  source entry_source not null default 'manual',
  created_at timestamptz default now()
);

create index idx_special_notes_student on special_notes(student_id);

-- -----------------------------------------------------------------------------
-- 8. Analyses (Deterministic metrics + AI narrative)
-- -----------------------------------------------------------------------------
create table analyses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  paper_id uuid references papers(id) on delete set null,
  metrics jsonb not null,                          -- computed numbers from /lib/analysis
  narrative jsonb,                                 -- AI-crafted explanations (EN / SI)
  created_at timestamptz default now()
);

create index idx_analyses_student on analyses(student_id);

-- -----------------------------------------------------------------------------
-- 9. Parental Settings & Controls
-- -----------------------------------------------------------------------------
create table parental_settings (
  student_id uuid primary key references students(id) on delete cascade,
  parent_pin_hash text,
  locked boolean not null default false,
  lock_until timestamptz,
  lock_schedule jsonb default '{"enabled": false, "start": "22:00", "end": "06:00"}'::jsonb,
  hide_results boolean not null default false,
  report_frequency text not null default 'every_paper',
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 10. Login Logs & Security Audit
-- -----------------------------------------------------------------------------
create table login_log (
  id bigserial primary key,
  user_id uuid,
  unique_id text,
  role text default 'student',
  success boolean not null,
  ip_hash text,
  user_agent text,
  created_at timestamptz default now()
);

create index idx_login_log_unique_id on login_log(unique_id, created_at desc);

-- -----------------------------------------------------------------------------
-- 11. System Settings & AI Mode Cockpit
-- -----------------------------------------------------------------------------
create table system_settings (
  id int primary key default 1 check (id = 1),
  ai_mode boolean not null default false,
  ai_confirm_required boolean not null default true,
  admin_whatsapp text not null default '+94771234567', -- Sir's verified number
  paid_templates_enabled boolean not null default false, -- OFF = zero message cost
  updated_at timestamptz default now()
);

-- Insert default row
insert into system_settings (id, ai_mode, ai_confirm_required, admin_whatsapp, paid_templates_enabled)
values (1, false, true, '+94771234567', false)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 12. Inbound Messages & AI Actions (Dedupe and Safety Audit)
-- -----------------------------------------------------------------------------
create table inbound_messages (
  wa_message_id text primary key,                  -- Dedupe key from Meta
  from_number text not null,
  body text,
  raw jsonb,
  status text not null default 'received',         -- received, processed, ignored
  received_at timestamptz default now()
);

create table ai_actions (
  id uuid primary key default gen_random_uuid(),
  wa_message_id text references inbound_messages(wa_message_id) on delete set null,
  raw_text text not null,
  tool_calls jsonb not null default '[]'::jsonb,
  result jsonb,
  status text not null default 'previewed',        -- previewed, confirmed, executed, cancelled, undone, failed
  undo_data jsonb,                                 -- snapshot to revert marks/notes
  created_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 13. Reports, Deliveries & Push Subscriptions
-- -----------------------------------------------------------------------------
create table report_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  source text not null default 'dashboard_button', -- dashboard_button, whatsapp_button, start, smart_send
  status text not null default 'sent',             -- sent, blocked_unregistered, failed
  created_at timestamptz default now()
);

create table report_deliveries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  analysis_id uuid references analyses(id) on delete set null,
  wa_message_id text,
  status text not null default 'sent',             -- sent, delivered, read, failed
  error text,
  created_at timestamptz default now()
);

create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 14. Forgot-PIN Requests (For Admin Review & WhatsApp OTP)
-- -----------------------------------------------------------------------------
create table pin_reset_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  unique_id text not null,
  status text not null default 'pending',          -- pending, resolved, expired
  ip_hash text,
  created_at timestamptz default now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on ALL tables
alter table students enable row level security;
alter table papers enable row level security;
alter table marks enable row level security;
alter table attendance enable row level security;
alter table announcements enable row level security;
alter table special_notes enable row level security;
alter table analyses enable row level security;
alter table parental_settings enable row level security;
alter table login_log enable row level security;
alter table system_settings enable row level security;
alter table inbound_messages enable row level security;
alter table ai_actions enable row level security;
alter table report_requests enable row level security;
alter table report_deliveries enable row level security;
alter table push_subscriptions enable row level security;
alter table pin_reset_requests enable row level security;

-- Helper function to check admin role
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- STUDENTS
create policy "Students can view their own profile"
  on students for select
  using (id = auth.uid() or is_admin());

create policy "Students can update limited profile fields"
  on students for update
  using (id = auth.uid() or is_admin());

create policy "Admins have full access to students"
  on students for all
  using (is_admin());

-- PAPERS
-- Students see only papers for their grade and matching class type
create policy "Students view papers for their grade and class type"
  on papers for select
  using (
    is_admin() or (
      exists (
        select 1 from students s
        where s.id = auth.uid()
          and s.grade = papers.grade
          and (papers.class_type is null or papers.class_type = s.class_type)
      )
    )
  );

create policy "Admins have full control over papers"
  on papers for all
  using (is_admin());

-- MARKS
create policy "Students view only their own marks"
  on marks for select
  using (student_id = auth.uid() or is_admin());

create policy "Only admin can write marks"
  on marks for all
  using (is_admin());

-- ATTENDANCE
create policy "Students view only their own attendance"
  on attendance for select
  using (student_id = auth.uid() or is_admin());

create policy "Only admin can record attendance"
  on attendance for all
  using (is_admin());

-- ANNOUNCEMENTS
create policy "Students view relevant announcements"
  on announcements for select
  using (
    is_admin() or (
      (target_grade is null and target_student is null) or
      (target_grade is not null and exists (
        select 1 from students s where s.id = auth.uid() and s.grade = announcements.target_grade
      )) or
      (target_student = auth.uid())
    )
  );

create policy "Only admin can manage announcements"
  on announcements for all
  using (is_admin());

-- SPECIAL NOTES
create policy "Students view only their private notes"
  on special_notes for select
  using (student_id = auth.uid() or is_admin());

create policy "Only admin can create special notes"
  on special_notes for all
  using (is_admin());

-- ANALYSES
create policy "Students view only their own analyses"
  on analyses for select
  using (student_id = auth.uid() or is_admin());

create policy "Only admin can create or update analyses"
  on analyses for all
  using (is_admin());

-- PARENTAL SETTINGS
create policy "Users view their own parental settings"
  on parental_settings for select
  using (student_id = auth.uid() or is_admin());

create policy "Admin or authorized parent updates parental settings"
  on parental_settings for all
  using (is_admin() or student_id = auth.uid());

-- PUSH SUBSCRIPTIONS
create policy "Students manage their own push subscriptions"
  on push_subscriptions for all
  using (student_id = auth.uid() or is_admin());

-- ADMIN-ONLY TABLES
create policy "Admin only on login_log"
  on login_log for all using (is_admin());

create policy "Admin only on system_settings"
  on system_settings for all using (is_admin());

create policy "Admin only on inbound_messages"
  on inbound_messages for all using (is_admin());

create policy "Admin only on ai_actions"
  on ai_actions for all using (is_admin());

create policy "Admin only on report_deliveries"
  on report_deliveries for all using (is_admin());

create policy "Admin only on report_requests"
  on report_requests for all using (is_admin());

create policy "Pin reset requests insert"
  on pin_reset_requests for insert with check (true);

create policy "Pin reset requests select/update for admin"
  on pin_reset_requests for select using (is_admin() or student_id = auth.uid());
