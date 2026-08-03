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

create table if not exists public.climbing_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  route_id text not null,
  session_date date not null,
  result text not null check (result in ('completed', 'attempted')),
  completion_style text check (
    completion_style is null or
    completion_style in ('onsight', 'flash', 'redpoint', 'send', 'repeat', 'top-rope', 'unspecified')
  ),
  attempt_count integer check (attempt_count is null or attempt_count between 1 and 999),
  note text check (note is null or char_length(note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (result = 'completed' or completion_style is null)
);

create index if not exists climbing_logs_user_date_idx
  on public.climbing_logs (user_id, session_date desc, created_at desc);

create index if not exists climbing_logs_user_route_idx
  on public.climbing_logs (user_id, destination_slug, route_id);

alter table public.profiles enable row level security;
alter table public.saved_routes enable row level security;
alter table public.route_notes enable row level security;
alter table public.saved_destinations enable row level security;
alter table public.climbing_dna_profiles enable row level security;
alter table public.climbing_logs enable row level security;

drop policy if exists "profiles are private" on public.profiles;
create policy "profiles are private"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "saved routes are private" on public.saved_routes;
create policy "saved routes are private"
  on public.saved_routes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "route notes are private" on public.route_notes;
create policy "route notes are private"
  on public.route_notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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

drop policy if exists "climbing logs are private" on public.climbing_logs;
create policy "climbing logs are private"
  on public.climbing_logs
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

drop trigger if exists touch_climbing_logs_updated_at on public.climbing_logs;
create trigger touch_climbing_logs_updated_at
  before update on public.climbing_logs
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
  delete from public.climbing_logs where user_id = auth.uid();

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

create or replace function public.save_climbing_log(
  p_id uuid,
  p_destination_slug text,
  p_route_id text,
  p_session_date date,
  p_result text,
  p_completion_style text,
  p_attempt_count integer,
  p_note text
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  saved_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if nullif(trim(p_destination_slug), '') is null or nullif(trim(p_route_id), '') is null then
    raise exception 'Destination and route are required';
  end if;

  if p_session_date > current_date then
    raise exception 'Climbing log date cannot be in the future';
  end if;

  if p_id is null then
    insert into public.climbing_logs (
      user_id,
      destination_slug,
      route_id,
      session_date,
      result,
      completion_style,
      attempt_count,
      note
    ) values (
      auth.uid(),
      p_destination_slug,
      p_route_id,
      p_session_date,
      p_result,
      case when p_result = 'completed' then p_completion_style else null end,
      p_attempt_count,
      nullif(trim(p_note), '')
    )
    returning id into saved_id;
  else
    update public.climbing_logs
    set destination_slug = p_destination_slug,
        route_id = p_route_id,
        session_date = p_session_date,
        result = p_result,
        completion_style = case when p_result = 'completed' then p_completion_style else null end,
        attempt_count = p_attempt_count,
        note = nullif(trim(p_note), '')
    where id = p_id and user_id = auth.uid()
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Climbing log not found';
    end if;
  end if;

  if p_result = 'completed' then
    insert into public.saved_routes (user_id, destination_slug, route_id, status)
    values (auth.uid(), p_destination_slug, p_route_id, 'climbed')
    on conflict (user_id, destination_slug, route_id)
    do update set status = 'climbed', updated_at = now();
  end if;

  return saved_id;
end;
$$;

revoke all on function public.save_climbing_log(uuid, text, text, date, text, text, integer, text) from public;
grant execute on function public.save_climbing_log(uuid, text, text, date, text, text, integer, text) to authenticated;

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
