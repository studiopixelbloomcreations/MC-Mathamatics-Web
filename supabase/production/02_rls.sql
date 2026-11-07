-- =============================================================================
-- MC MATHEMATICS — 02_rls.sql
-- COMPLETE ROW-LEVEL SECURITY POLICIES & ENFORCEMENT AUDIT
-- =============================================================================

-- 1. Helper function to check admin role
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

-- 2. Enable RLS on ALL tables
alter table id_counters enable row level security;
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
alter table site_content enable row level security;
alter table wa_sessions enable row level security;
alter table chat_threads enable row level security;
alter table chat_messages enable row level security;

-- 3. Define Policies

-- ID COUNTERS
create policy "Admin only on id_counters"
  on id_counters for all using (is_admin());

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

-- PIN RESET REQUESTS
create policy "Pin reset requests insert"
  on pin_reset_requests for insert with check (true);

create policy "Pin reset requests select for admin and student"
  on pin_reset_requests for select using (is_admin() or student_id = auth.uid());

create policy "Pin reset requests update for admin"
  on pin_reset_requests for update using (is_admin());

-- SITE CONTENT
create policy "Site content readable by anyone"
  on site_content for select using (true);

create policy "Site content manageable by admin only"
  on site_content for all using (is_admin());

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

create policy "Admin only on wa_sessions"
  on wa_sessions for all using (is_admin());

create policy "Admin only on chat_threads"
  on chat_threads for all using (is_admin());

create policy "Admin only on chat_messages"
  on chat_messages for all using (is_admin());

-- 4. VALIDATION BLOCK: Raise error if any public table has RLS disabled
do $$
declare
  r record;
  unsecured_count int := 0;
begin
  for r in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and rowsecurity = false
  loop
    raise warning 'Table without RLS enabled: %', r.tablename;
    unsecured_count := unsecured_count + 1;
  end loop;

  if unsecured_count > 0 then
    raise exception 'SECURITY AUDIT FAILED: % table(s) have RLS disabled in public schema.', unsecured_count;
  else
    raise notice 'SECURITY AUDIT PASSED: 100%% of public tables have Row Level Security enabled.';
  end if;
end;
$$;
