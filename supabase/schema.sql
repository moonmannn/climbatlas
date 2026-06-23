-- ClimbAtlas V3 personal route notebook schema.
-- Run this in the Supabase SQL editor for the project connected to ClimbAtlas.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  home_base text,
  experience_level text,
  preferred_styles text[] not null default '{}',
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists home_base text,
  add column if not exists experience_level text,
  add column if not exists preferred_styles text[] not null default '{}',
  add column if not exists bio text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_experience_level_check'
  ) then
    alter table public.profiles
      add constraint profiles_experience_level_check
      check (
        experience_level is null or
        experience_level in ('newer', 'intermediate', 'experienced', 'project-focused')
      );
  end if;
end $$;

create table if not exists public.saved_routes (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  route_id text not null,
  status text not null check (status in ('want-to-climb', 'climbed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, destination_slug, route_id)
);

create table if not exists public.route_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  route_id text not null,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, destination_slug, route_id)
);

alter table public.profiles enable row level security;
alter table public.saved_routes enable row level security;
alter table public.route_notes enable row level security;

create policy "profiles are private"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "saved routes are private"
  on public.saved_routes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "route notes are private"
  on public.route_notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.touch_updated_at();

drop trigger if exists touch_saved_routes_updated_at on public.saved_routes;
create trigger touch_saved_routes_updated_at
  before update on public.saved_routes
  for each row
  execute function public.touch_updated_at();

drop trigger if exists touch_route_notes_updated_at on public.route_notes;
create trigger touch_route_notes_updated_at
  before update on public.route_notes
  for each row
  execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, preferred_styles)
  values (new.id, new.email, '{}')
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
