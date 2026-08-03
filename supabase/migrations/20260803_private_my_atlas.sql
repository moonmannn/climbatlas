-- ClimbAtlas private My Atlas V1.
-- Run this migration once on projects that already use supabase/schema.sql.

create table if not exists public.saved_destinations (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, destination_slug)
);

create table if not exists public.climbing_dna_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null,
  schema_version integer not null default 2 check (schema_version = 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.saved_destinations enable row level security;
alter table public.climbing_dna_profiles enable row level security;

drop policy if exists "saved destinations are private" on public.saved_destinations;
create policy "saved destinations are private"
  on public.saved_destinations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "climbing dna profiles are private" on public.climbing_dna_profiles;
create policy "climbing dna profiles are private"
  on public.climbing_dna_profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists touch_saved_destinations_updated_at on public.saved_destinations;
create trigger touch_saved_destinations_updated_at
  before update on public.saved_destinations
  for each row
  execute function public.touch_updated_at();

drop trigger if exists touch_climbing_dna_profiles_updated_at on public.climbing_dna_profiles;
create trigger touch_climbing_dna_profiles_updated_at
  before update on public.climbing_dna_profiles
  for each row
  execute function public.touch_updated_at();

create or replace function public.clear_my_atlas_data()
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  delete from public.route_notes where user_id = auth.uid();
  delete from public.saved_routes where user_id = auth.uid();
  delete from public.saved_destinations where user_id = auth.uid();
  delete from public.climbing_dna_profiles where user_id = auth.uid();

  update public.profiles
  set display_name = null,
      home_base = null,
      experience_level = null,
      preferred_styles = '{}',
      bio = null
  where id = auth.uid();
end;
$$;

revoke all on function public.clear_my_atlas_data() from public;
grant execute on function public.clear_my_atlas_data() to authenticated;
