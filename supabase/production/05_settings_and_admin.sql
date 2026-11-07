-- =============================================================================
-- MC MATHEMATICS — 05_settings_and_admin.sql
-- PRODUCTION SETTINGS INITIALIZATION & ADMIN SETUP
-- (Fill in Sir's real email & WhatsApp number before executing)
-- =============================================================================

do $$
declare
  -- !!! REPLACE THESE PLACEHOLDERS BEFORE RUNNING IN PRODUCTION !!!
  sir_email text := 'admin@mcmathematics.com';       -- Sir's administrative login email
  sir_whatsapp text := '+94771234567';               -- Sir's personal verified WhatsApp (E.164)
  admin_user_id uuid;
begin
  if sir_whatsapp = '+94771234567' or sir_email = 'admin@mcmathematics.com' then
    raise notice 'WARNING: Using default placeholder values for Sir. Please edit sir_email and sir_whatsapp in this script.';
  end if;

  -- 1. Initialize id_counters for grades 6 to 13, class types T and TP (starts at 1000, next is 1001)
  insert into id_counters (prefix, last_value) values
    ('MCG6T', 1000), ('MCG6TP', 1000),
    ('MCG7T', 1000), ('MCG7TP', 1000),
    ('MCG8T', 1000), ('MCG8TP', 1000),
    ('MCG9T', 1000), ('MCG9TP', 1000),
    ('MCG10T', 1000), ('MCG10TP', 1000),
    ('MCG11T', 1000), ('MCG11TP', 1000),
    ('MCG12T', 1000), ('MCG12TP', 1000),
    ('MCG13T', 1000), ('MCG13TP', 1000)
  on conflict (prefix) do nothing;

  -- 2. Initialize single row in system_settings
  insert into system_settings (
    id,
    ai_mode,
    ai_confirm_required,
    admin_whatsapp,
    paid_templates_enabled,
    parent_chat_enabled
  ) values (
    1,
    false,            -- ai_mode starts false (manual mode safe default)
    true,             -- ai_confirm_required starts true
    sir_whatsapp,
    false,            -- paid_templates_enabled false (zero cost free-window default)
    true              -- parent_chat_enabled true (parents can talk to AI assistant)
  )
  on conflict (id) do update set
    admin_whatsapp = excluded.admin_whatsapp;

  -- 3. If an auth user with sir_email exists, grant admin role
  select id into admin_user_id from auth.users where email = sir_email limit 1;
  if admin_user_id is not null then
    update auth.users
    set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
    where id = admin_user_id;
    raise notice 'Admin role granted to existing auth user % (%)', sir_email, admin_user_id;
  else
    raise notice 'Auth user % not found yet. When Sir signs up or creates an account, execute: update auth.users set raw_app_meta_data = raw_app_meta_data || ''{"role": "admin"}''::jsonb where email = ''%'';', sir_email, sir_email;
  end if;

  raise notice 'Settings and ID sequences successfully initialized.';
end;
$$;
