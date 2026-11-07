-- =============================================================================
-- MC MATHEMATICS — 03_storage.sql
-- STORAGE BUCKETS SETUP & STORAGE ACCESS POLICIES
-- =============================================================================

-- 1. Create storage buckets (if not exists)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('papers', 'papers', false, 52428800, array['application/pdf', 'image/jpeg', 'image/png']),
  ('site-assets', 'site-assets', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Storage Policies for 'papers' (Private bucket)
drop policy if exists "Admin has full access to papers bucket" on storage.objects;
create policy "Admin has full access to papers bucket"
  on storage.objects
  for all
  using (bucket_id = 'papers' and (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)));

drop policy if exists "Authenticated students can view papers bucket" on storage.objects;
create policy "Authenticated students can view papers bucket"
  on storage.objects
  for select
  using (bucket_id = 'papers' and auth.role() = 'authenticated');

-- 3. Storage Policies for 'site-assets' (Public bucket)
drop policy if exists "Public read access to site-assets" on storage.objects;
create policy "Public read access to site-assets"
  on storage.objects
  for select
  using (bucket_id = 'site-assets');

drop policy if exists "Admin can upload and manage site-assets" on storage.objects;
create policy "Admin can upload and manage site-assets"
  on storage.objects
  for all
  using (bucket_id = 'site-assets' and (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)));
