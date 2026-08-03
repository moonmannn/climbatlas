-- ClimbAtlas My Atlas 1.1 private climbing journal.
-- Run after 20260803_private_my_atlas.sql on existing projects.

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

alter table public.climbing_logs enable row level security;

drop policy if exists "climbing logs are private" on public.climbing_logs;
create policy "climbing logs are private"
  on public.climbing_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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
