# ClimbAtlas site survey

`/feedback` contains the seven-question English/Chinese website experience survey.
The first six questions are required; the improvement comment is optional.
No sign-in, name or email is required. This is a convenience sample recruited
through social and community channels, not a representative population survey.

## Enable storage

Run `supabase/migrations/20261028_site_survey.sql` in the **existing ClimbAtlas
Supabase project** before deploying. The server uses the existing
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables; no new
service or service-role key is required.

`POST /api/survey` validates the version, six answer groups, bounded comment,
UUID and source context. Success is returned only after the database call
succeeds. A failed or timed-out submission keeps its answers and submission ID
for a safe retry. A repeat request with that ID does not create another row.
This prevents retry duplicates; it does not establish unique people or stop
intentional repeat participation.

The database exposes an insert-only function. Anonymous and signed-in visitors
cannot read, export, change or delete responses. Survey data is reviewed only
through the owner's Supabase dashboard. Existing account data is unaffected.

## Channel links

Use the same campaign and a different `utm_source` for each recruitment channel:

- `https://climbatlas.vercel.app/?utm_source=climbing-group&utm_medium=community&utm_campaign=site-test-v1`
- `https://climbatlas.vercel.app/?utm_source=classmates&utm_medium=community&utm_campaign=site-test-v1`
- `https://climbatlas.vercel.app/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=site-test-v1`
- `https://climbatlas.vercel.app/?utm_source=samplesize&utm_medium=community&utm_campaign=site-test-v1`

Only slug-style campaign labels (letters, digits, dot, dash, underscore; at most
64 characters) are accepted. The first entry path and explicit campaign labels
are kept in session storage while the visitor browses. A subsequent explicitly
tagged link replaces that session's campaign. No tags means `unattributed`, not
proof of a direct visit. If storage is blocked, submission still works but
attribution may be unavailable. Full URLs, referrers, IPs, quiz answers and
account IDs are not written into survey rows. Infrastructure providers may
maintain their usual access logs.

## Export and interpret

Open Table Editor > `site_survey_responses` in Supabase and export CSV. The
owner can also run this query in SQL Editor and export the query result:

```sql
select *
from public.site_survey_responses
where source <> 'deployment-check'
order by created_at;
```

Responses use stable language-independent codes defined in
`src/lib/siteSurvey.ts`. `fun = NULL` means the visitor could not evaluate it;
exclude these rows from the fun-rating denominator. `discovery = 'not-tried'`
and `'no-need'` are not unsuccessful discoveries. For a discovery measure,
report `yes / (yes + no)` with the actual count alongside the proportion.
Feature use is self-reported. Future return reasons measure intention, not
observed retention. Report respondents' climbing experience, recruitment
channel, collection dates, survey version, and valid sample count per question.

Deployment checks use `source=deployment-check`, `campaign=qa` and an explicit
test comment. Keep these records identifiable and exclude them from analysis.
No visitor-to-survey completion rate can be calculated from these responses
alone; this release does not add full visitor analytics.
