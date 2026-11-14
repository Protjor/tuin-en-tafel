-- Tuin & Tafel · databank opzetten
-- Plak dit volledig in Supabase → SQL Editor → New query, en klik op Run.
-- Je mag het gerust een tweede keer uitvoeren: niets wordt dubbel aangemaakt of gewist.

-- 1. Eén tabel voor alles: recepten, zaden en categorieën
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('recipes','seeds','categories')),
  data        jsonb not null default '{}'::jsonb,
  updated     timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);
create index if not exists items_kind_idx on public.items (kind);

-- 2. Alleen aangemelde gebruikers mogen lezen en schrijven
alter table public.items enable row level security;
drop policy if exists "aangemeld lezen"     on public.items;
drop policy if exists "aangemeld toevoegen" on public.items;
drop policy if exists "aangemeld wijzigen"  on public.items;
drop policy if exists "aangemeld wissen"    on public.items;
create policy "aangemeld lezen"     on public.items for select to authenticated using (true);
create policy "aangemeld toevoegen" on public.items for insert to authenticated with check (true);
create policy "aangemeld wijzigen"  on public.items for update to authenticated using (true) with check (true);
create policy "aangemeld wissen"    on public.items for delete to authenticated using (true);

-- Rechten voor de app (ook nodig als "Automatically expose new tables" uit staat)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.items to authenticated;
revoke all on public.items from anon;

-- 3. Live bijwerken tussen toestellen
do $$ begin
  alter publication supabase_realtime add table public.items;
exception when duplicate_object then null; end $$;

-- 4. Foto's: iedereen met de link mag ze zien (nodig om recepten met foto te delen), alleen aangemelde gebruikers uploaden
insert into storage.buckets (id, name, public) values ('fotos','fotos',true)
on conflict (id) do update set public = true;
drop policy if exists "fotos uploaden" on storage.objects;
drop policy if exists "fotos wijzigen" on storage.objects;
drop policy if exists "fotos wissen"   on storage.objects;
create policy "fotos uploaden" on storage.objects for insert to authenticated with check (bucket_id = 'fotos');
create policy "fotos wijzigen" on storage.objects for update to authenticated using (bucket_id = 'fotos');
create policy "fotos wissen"   on storage.objects for delete to authenticated using (bucket_id = 'fotos');

-- 5. Wakker houden: een dagelijkse automatische "ping" (zie .github/workflows/wakker-houden.yml)
--    Geeft enkel "true" terug, geen gegevens.
create or replace function public.ping() returns boolean
language sql security definer set search_path = public
as $$ select count(*) >= 0 from public.items $$;
revoke all on function public.ping() from public;
grant execute on function public.ping() to anon, authenticated;
