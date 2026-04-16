-- NimmMeinAuto – Auth, Rollen, interner Chat
-- Idempotent ausführbar. Im Supabase SQL Editor (project scope) laufen lassen.
-- Reihenfolge beachten: zuerst Rollen + profiles, dann listing-Verknüpfung, dann Chat.

------------------------------------------------------------
-- 1. Rolle-Enum + profiles-Tabelle
------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('kunde', 'bewerter', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'kunde',
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'App-level Profil & Rolle pro auth.users-Account. 1:1 Relation, automatisch via Trigger befüllt.';

-- Automatisch profile-Zeile anlegen, wenn sich ein neuer User registriert.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at automatisch setzen
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Convenience-Funktion: aktuelle Rolle des Requesters
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

------------------------------------------------------------
-- 2. RLS auf profiles
------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "own profile readable" on public.profiles;
create policy "own profile readable"
  on public.profiles for select
  using (auth.uid() = id or public.current_user_role() = 'admin');

drop policy if exists "own profile updatable" on public.profiles;
create policy "own profile updatable"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));
-- Hinweis: die WITH CHECK verhindert, dass ein Kunde per Selbst-Update auf 'admin' springt.

drop policy if exists "admin manages profiles" on public.profiles;
create policy "admin manages profiles"
  on public.profiles for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

------------------------------------------------------------
-- 3. listings: optionale Verknüpfung mit auth.users
------------------------------------------------------------
alter table public.listings
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists listings_user_id_idx on public.listings(user_id);

-- Anonyme Einreichungen bleiben erlaubt (user_id NULL), eingeloggte bekommen die Verknüpfung.
-- Wir schalten RLS erst, wenn die /api-Routes komplett umgestellt sind. Bisher läuft
-- alles über den service-role key, der RLS ohnehin umgeht. Die RLS-Vorbereitung:

alter table public.listings enable row level security;

drop policy if exists "listings service role" on public.listings;
-- service_role bypasst RLS grundsätzlich — keine Policy nötig. Folgende Policies sind
-- für den Tag, an dem der Frontend-Client direkt lesen/schreiben soll.

drop policy if exists "own listings readable" on public.listings;
create policy "own listings readable"
  on public.listings for select
  using (
    user_id = auth.uid()
    or public.current_user_role() in ('bewerter', 'admin')
  );

drop policy if exists "admin manages listings" on public.listings;
create policy "admin manages listings"
  on public.listings for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "bewerter updates listings" on public.listings;
create policy "bewerter updates listings"
  on public.listings for update
  using (public.current_user_role() = 'bewerter')
  with check (public.current_user_role() = 'bewerter');

------------------------------------------------------------
-- 4. Chat: threads + messages (Kunde ↔ Admin-Team)
------------------------------------------------------------
create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  subject text,
  status text not null default 'open' check (status in ('open', 'closed')),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists threads_customer_id_idx on public.threads(customer_id);
create index if not exists threads_last_message_at_idx on public.threads(last_message_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_thread_id_idx on public.messages(thread_id, created_at);

-- last_message_at am Thread synchron halten
create or replace function public.touch_thread_on_message()
returns trigger language plpgsql as $$
begin
  update public.threads
     set last_message_at = new.created_at
   where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_thread on public.messages;
create trigger messages_touch_thread
  after insert on public.messages
  for each row execute function public.touch_thread_on_message();

------------------------------------------------------------
-- 5. RLS auf Chat
------------------------------------------------------------
alter table public.threads enable row level security;
alter table public.messages enable row level security;

-- Thread lesen: Kunde seinen eigenen, Admin alle.
drop policy if exists "thread readable" on public.threads;
create policy "thread readable"
  on public.threads for select
  using (
    customer_id = auth.uid()
    or public.current_user_role() = 'admin'
  );

-- Thread anlegen: Kunde für sich selbst, Admin für beliebige Kunden.
drop policy if exists "thread insertable" on public.threads;
create policy "thread insertable"
  on public.threads for insert
  with check (
    (customer_id = auth.uid() and auth.uid() is not null)
    or public.current_user_role() = 'admin'
  );

-- Thread schließen/öffnen: Kunde eigenen, Admin alle.
drop policy if exists "thread updatable" on public.threads;
create policy "thread updatable"
  on public.threads for update
  using (
    customer_id = auth.uid()
    or public.current_user_role() = 'admin'
  )
  with check (
    customer_id = auth.uid()
    or public.current_user_role() = 'admin'
  );

-- Messages lesen: wenn der User den zugehörigen Thread lesen darf.
drop policy if exists "message readable" on public.messages;
create policy "message readable"
  on public.messages for select
  using (
    exists (
      select 1 from public.threads t
       where t.id = messages.thread_id
         and (
           t.customer_id = auth.uid()
           or public.current_user_role() = 'admin'
         )
    )
  );

-- Messages schreiben: wenn der User den Thread sehen darf und sender_id = er selbst.
drop policy if exists "message insertable" on public.messages;
create policy "message insertable"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.threads t
       where t.id = thread_id
         and (
           t.customer_id = auth.uid()
           or public.current_user_role() = 'admin'
         )
    )
  );

-- read_at updaten erlaubt für alle Thread-Teilnehmer.
drop policy if exists "message updatable" on public.messages;
create policy "message updatable"
  on public.messages for update
  using (
    exists (
      select 1 from public.threads t
       where t.id = messages.thread_id
         and (
           t.customer_id = auth.uid()
           or public.current_user_role() = 'admin'
         )
    )
  );

------------------------------------------------------------
-- 6. Realtime aktivieren
------------------------------------------------------------
-- Supabase Realtime: Publication für messages + threads, damit der
-- Frontend-Client live auf INSERT hört.
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.threads;
exception when duplicate_object then null; end $$;

------------------------------------------------------------
-- 7. Admin-Bootstrap (MANUELL ausführen)
------------------------------------------------------------
-- Nach der ersten eigenen Registrierung diese Zeile mit deiner E-Mail laufen lassen,
-- um dich selbst zum Admin zu machen:
--
--   update public.profiles
--      set role = 'admin'
--    where id = (select id from auth.users where email = 'DEINE@MAIL.AT');
--
-- Bewerter-Accounts genauso, nur mit role = 'bewerter'.
