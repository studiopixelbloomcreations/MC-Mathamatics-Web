-- =============================================================================
-- MC MATHEMATICS — 01_schema.sql
-- COMPLETE PRODUCTION DDL WITH INDEXES & ATOMIC ID GENERATION
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
-- 7. Special Notes (Sir to Student & Parent)
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

-- -----------------------------------------------------------------------------
-- 12. Inbound Messages & AI Actions
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
-- 14. Forgot-PIN Requests
-- -----------------------------------------------------------------------------
create table pin_reset_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  unique_id text not null,
  status text not null default 'pending',          -- pending, resolved, expired
  ip_hash text,
  created_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 15. Site Content (Landing Page Admin CMS)
-- -----------------------------------------------------------------------------
create table site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 16. WhatsApp Sessions (Free-First 24-hr Parent/Admin Conversational State)
-- -----------------------------------------------------------------------------
create table wa_sessions (
  phone_number text primary key,                   -- E.164 normalized
  student_id uuid references students(id) on delete set null,
  unique_id text,
  role text not null default 'parent',             -- 'parent' | 'admin' | 'unknown'
  language text not null default 'en',             -- 'en' | 'si'
  last_interaction timestamptz default now(),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_wa_sessions_student on wa_sessions(student_id);

-- -----------------------------------------------------------------------------
-- 17. Chat Threads & Messages (Conversational AI History)
-- -----------------------------------------------------------------------------
create table chat_threads (
  id uuid primary key default gen_random_uuid(),
  channel text not null default 'whatsapp',        -- 'whatsapp' | 'web'
  user_phone text,
  student_id uuid references students(id) on delete cascade,
  role text not null default 'parent',             -- 'parent' | 'admin'
  created_at timestamptz default now()
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references chat_threads(id) on delete cascade,
  sender text not null check (sender in ('user', 'assistant', 'system')),
  message_text text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_chat_messages_thread on chat_messages(thread_id, created_at asc);
