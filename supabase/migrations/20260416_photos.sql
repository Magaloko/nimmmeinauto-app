-- NimmMeinAuto – Photo upload support
-- Run this in the Supabase SQL editor (project scope).

------------------------------------------------------------
-- 1. Add photo_urls column to listings
------------------------------------------------------------
alter table public.listings
  add column if not exists photo_urls text[] default '{}'::text[];

comment on column public.listings.photo_urls is
  'Public URLs of uploaded listing photos in the listing-photos storage bucket.';

------------------------------------------------------------
-- 2. Create the storage bucket (idempotent)
------------------------------------------------------------
-- Prefer running this via Supabase Dashboard → Storage → New bucket
-- if you want to configure caching/transform settings through the UI.
-- The bucket must be PUBLIC so that the listing pages can display
-- photos without per-request signed URLs.

insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do update set public = excluded.public;

------------------------------------------------------------
-- 3. Storage policies
------------------------------------------------------------
-- Uploads and deletes happen through the /api/upload route which
-- uses the service role key, so they bypass RLS entirely. We only
-- need a SELECT policy so the public URLs actually return bytes.

drop policy if exists "listing photos are publicly readable"
  on storage.objects;

create policy "listing photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-photos');
