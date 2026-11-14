-- Tuin & Tafel · alleen beheerders mogen video's toevoegen of wijzigen
-- Plak in Supabase → SQL Editor → New query. Vervang JOUW-EMAIL door het e-mailadres van de beheerder en klik Run.
-- Veilig om opnieuw uit te voeren.

-- 1. Lijst van beheerders (niemand kan die lijst lezen of wijzigen via de app)
create table if not exists public.beheerders (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.beheerders enable row level security;
revoke all on public.beheerders from anon, authenticated;

insert into public.beheerders (user_id)
select id from auth.users where email = 'JOUW-EMAIL'
on conflict do nothing;

-- 2. Is de aangemelde gebruiker beheerder? (de app vraagt dit om de videoknop te tonen)
create or replace function public.is_beheerder() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.beheerders where user_id = auth.uid()) $$;
revoke all on function public.is_beheerder() from public;
grant execute on function public.is_beheerder() to authenticated;

-- 3. Wie geen beheerder is, kan de video van een recept niet wijzigen (de databank zet de oude terug)
create or replace function public.bewaak_video() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.kind = 'recipes' and not public.is_beheerder() then
    if tg_op = 'INSERT' then
      new.data := new.data - 'video' - 'videoPoster';
    else
      new.data := (new.data - 'video' - 'videoPoster')
        || jsonb_strip_nulls(jsonb_build_object('video', old.data->'video', 'videoPoster', old.data->'videoPoster'));
    end if;
  end if;
  return new;
end $$;
drop trigger if exists bewaak_video on public.items;
create trigger bewaak_video before insert or update on public.items
for each row execute function public.bewaak_video();

-- 4. Video-bestanden (map video/ in de bucket fotos) alleen door beheerders
drop policy if exists "fotos uploaden" on storage.objects;
drop policy if exists "fotos wijzigen" on storage.objects;
drop policy if exists "fotos wissen"   on storage.objects;
create policy "fotos uploaden" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and ((storage.foldername(name))[1] is distinct from 'video' or public.is_beheerder()));
create policy "fotos wijzigen" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and ((storage.foldername(name))[1] is distinct from 'video' or public.is_beheerder()));
create policy "fotos wissen" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and ((storage.foldername(name))[1] is distinct from 'video' or public.is_beheerder()));
