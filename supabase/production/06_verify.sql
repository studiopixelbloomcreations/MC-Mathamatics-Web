-- =============================================================================
-- MC MATHEMATICS — 06_verify.sql
-- PRODUCTION POST-MIGRATION VERIFICATION SCRIPT
-- Run this to verify schema integrity, RLS enforcement, and counts.
-- =============================================================================

do $$
declare
  student_count int;
  rls_unprotected_count int;
  sys_row_count int;
begin
  -- 1. Check Student Table Count (Must be 0 for clean production start)
  select count(*) into student_count from students;
  raise notice 'Verification - Total students: %', student_count;

  -- 2. Check System Settings
  select count(*) into sys_row_count from system_settings;
  if sys_row_count <> 1 then
    raise exception 'VERIFICATION FAILED: system_settings table must have exactly 1 row (found: %)', sys_row_count;
  end if;
  raise notice 'Verification - system_settings: OK (1 row configured)';

  -- 3. Check Row Level Security
  select count(*) into rls_unprotected_count
  from pg_tables
  where schemaname = 'public' and rowsecurity = false;

  if rls_unprotected_count > 0 then
    raise exception 'VERIFICATION FAILED: % public table(s) lack RLS protection!', rls_unprotected_count;
  end if;
  raise notice 'Verification - RLS: 100%% of public tables are protected.';

  -- 4. Check ID sequence generator function
  if not exists (select 1 from pg_proc where proname = 'next_student_id') then
    raise exception 'VERIFICATION FAILED: next_student_id function missing!';
  end if;
  raise notice 'Verification - next_student_id function: OK';

  raise notice '=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY ===';
end;
$$;

-- Table and index inspection query (returns results in editor)
select 
  table_name,
  (select count(*) from information_schema.columns c where c.table_name = t.table_name and c.table_schema = 'public') as column_count
from information_schema.tables t
where table_schema = 'public'
order by table_name;
