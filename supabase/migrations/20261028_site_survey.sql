-- Seven-question site-value survey. Survey answers have no public read API.
-- Run once in the existing ClimbAtlas project's SQL editor before deploying.
begin;

create table if not exists public.site_survey_responses (
  submission_id uuid primary key,
  created_at timestamptz not null default now(),
  survey_version text not null check (survey_version = 'site-value-v1'),
  locale text not null check (locale in ('en', 'zh')),
  experience text not null check (experience in ('never', 'indoor', 'occasional-outdoor', 'frequent-outdoor')),
  features text[] not null check (
    cardinality(features) between 1 and 6 and
    features <@ array['home', 'dna', 'map', 'destination', 'route', 'my-atlas']::text[]
  ),
  clarity smallint not null check (clarity between 1 and 5),
  fun smallint check (fun between 1 and 5),
  discovery text not null check (discovery in ('yes', 'no', 'not-tried', 'no-need')),
  return_reasons text[] not null check (
    cardinality(return_reasons) between 1 and 6 and
    return_reasons <@ array['inspiration', 'compare-routes', 'preferences', 'journal', 'no-return', 'unsure']::text[] and
    (not (return_reasons && array['no-return', 'unsure']::text[]) or cardinality(return_reasons) = 1)
  ),
  improvement text not null default '' check (char_length(improvement) <= 1000),
  source text not null default 'unattributed' check (source ~ '^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$'),
  medium text check (medium ~ '^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$'),
  campaign text check (campaign ~ '^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$'),
  entry_path text not null check (
    char_length(entry_path) <= 200 and
    entry_path ~ '^/(explore|feedback|my-atlas|climbing-dna(/result)?|destinations/[a-z0-9-]+(/routes/[a-z0-9-]+)?)?$'
  )
);

alter table public.site_survey_responses enable row level security;
revoke all on public.site_survey_responses from public, anon, authenticated;

create or replace function public.submit_site_survey(
  p_submission_id uuid,
  p_version text,
  p_locale text,
  p_answers jsonb,
  p_context jsonb
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen_features text[];
  chosen_reasons text[];
begin
  if p_submission_id is null or
     p_version is distinct from 'site-value-v1' or
     p_locale is null or p_locale not in ('en', 'zh') or
     jsonb_typeof(p_answers) is distinct from 'object' or
     jsonb_typeof(p_context) is distinct from 'object' or
     jsonb_typeof(p_answers->'experience') is distinct from 'string' or
     jsonb_typeof(p_answers->'features') is distinct from 'array' or
     jsonb_typeof(p_answers->'clarity') is distinct from 'number' or
     not (p_answers ? 'fun') or
     jsonb_typeof(p_answers->'fun') not in ('number', 'null') or
     jsonb_typeof(p_answers->'discovery') is distinct from 'string' or
     jsonb_typeof(p_answers->'returnReasons') is distinct from 'array' or
     jsonb_typeof(p_answers->'improvement') is distinct from 'string' or
     octet_length(p_answers::text) > 10000 then
    raise exception 'Invalid survey answers' using errcode = '22023';
  end if;

  select array_agg(value) into chosen_features from jsonb_array_elements_text(p_answers->'features');
  select array_agg(value) into chosen_reasons from jsonb_array_elements_text(p_answers->'returnReasons');
  if chosen_features is null or chosen_reasons is null or
     array_position(chosen_features, null) is not null or array_position(chosen_reasons, null) is not null or
     cardinality(chosen_features) <> (select count(distinct item) from unnest(chosen_features) item) or
     cardinality(chosen_reasons) <> (select count(distinct item) from unnest(chosen_reasons) item) or
     (p_answers->>'clarity') !~ '^[1-5]$' or
     (p_answers->>'fun' is not null and (p_answers->>'fun') !~ '^[1-5]$') then
    raise exception 'Invalid survey choices' using errcode = '22023';
  end if;

  insert into public.site_survey_responses (
    submission_id, survey_version, locale, experience, features, clarity, fun,
    discovery, return_reasons, improvement, source, medium, campaign, entry_path
  ) values (
    p_submission_id, p_version, p_locale, p_answers->>'experience', chosen_features,
    (p_answers->>'clarity')::smallint, (p_answers->>'fun')::smallint,
    p_answers->>'discovery', chosen_reasons, btrim(p_answers->>'improvement'),
    p_context->>'source', p_context->>'medium', p_context->>'campaign', p_context->>'entryPath'
  ) on conflict (submission_id) do nothing;
end;
$$;

revoke all on function public.submit_site_survey(uuid, text, text, jsonb, jsonb) from public;
grant execute on function public.submit_site_survey(uuid, text, text, jsonb, jsonb) to anon, authenticated;

comment on table public.site_survey_responses is
  'Website experience survey; no name/email requested. Exclude source=deployment-check from respondent analysis.';

notify pgrst, 'reload schema';
commit;
