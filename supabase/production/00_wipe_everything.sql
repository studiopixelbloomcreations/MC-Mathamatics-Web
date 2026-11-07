-- =============================================================================
-- MC MATHEMATICS — 00_wipe_everything.sql
-- COMPLETE DATABASE WIPE SCRIPT (PRODUCTION ONLY)
-- Safe-guarded by confirm_wipe variable: must be explicitly set to TRUE.
-- =============================================================================

do $$
declare
  confirm_wipe boolean := false; -- SET TO true TO EXECUTE
begin
  if not confirm_wipe then
    raise exception 'ABORTED: confirm_wipe must be set to true at the top of this script to run.';
  end if;

  raise notice 'Starting complete database wipe for MC Mathematics...';

  -- 1. Drop existing tables if they exist (with cascade)
  drop table if exists chat_messages cascade;
  drop table if exists chat_threads cascade;
  drop table if exists wa_sessions cascade;
  drop table if exists site_content cascade;
  drop table if exists pin_reset_requests cascade;
  drop table if exists push_subscriptions cascade;
  drop table if exists report_deliveries cascade;
  drop table if exists report_requests cascade;
  drop table if exists ai_actions cascade;
  drop table if exists inbound_messages cascade;
  drop table if exists system_settings cascade;
  drop table if exists login_log cascade;
  drop table if exists parental_settings cascade;
  drop table if exists analyses cascade;
  drop table if exists special_notes cascade;
  drop table if exists announcements cascade;
  drop table if exists attendance cascade;
  drop table if exists marks cascade;
  drop table if exists papers cascade;
  drop table if exists students cascade;
  drop table if exists id_counters cascade;

  -- 2. Drop existing custom types/enums
  drop type if exists class_type cascade;
  drop type if exists paper_status cascade;
  drop type if exists att_status cascade;
  drop type if exists entry_source cascade;

  -- 3. Drop custom functions
  drop function if exists next_student_id(text) cascade;
  drop function if exists is_admin() cascade;

  -- 4. Clean Supabase auth users (deletes all logins, students, admins)
  delete from auth.users;

  raise notice 'Complete database wipe successful. Ready for 01_schema.sql.';
end;
$$;
