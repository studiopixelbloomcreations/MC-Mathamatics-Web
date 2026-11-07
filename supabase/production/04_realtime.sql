-- =============================================================================
-- MC MATHEMATICS — 04_realtime.sql
-- SUPABASE REALTIME REPLICATION CONFIGURATION
-- =============================================================================

-- Ensure supabase_realtime publication exists
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end;
$$;

-- Add live tables to realtime publication
alter publication supabase_realtime add table marks;
alter publication supabase_realtime add table special_notes;
alter publication supabase_realtime add table announcements;
alter publication supabase_realtime add table attendance;
