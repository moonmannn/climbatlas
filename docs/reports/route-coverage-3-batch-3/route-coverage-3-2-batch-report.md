# Route Coverage 3.2 - Batch 3 Report

Date: 2026-08-11 / 2026-08-12 UTC

## Release Summary

- Status: released to GitHub `main` and Vercel Production; Production smoke passed.
- Preview commit: `c69da52 feat: preview route coverage batch three`.
- Preview URL: `https://climbatlas-rfe4ggon9-moonmannns-projects.vercel.app`.
- Application release commit: `f2f86b2 docs: finalize route coverage batch three`.
- Production rollback commit: `22e578e` (the stable Production baseline before this batch).
- Rollback tag: `rc3-2-pre-release-2026-08-12`.
- Destinations: **24 -> 26**.
- Public routes: **1,807 -> 2,023**.
- Imported Indexed Routes: **216**.
- Published Picks: **40 -> 64**.
- Unexplained removals: **0**.

The planned final total was 2,023 public routes, and the validated catalog
contains 2,023. No lower-quality route was added to close a numerical gap.

## Locked Source

| Field | Value |
| --- | --- |
| Provider | OpenBeta official Parquet export |
| Release | `v2026-08-02` |
| Source rows | `231865` |
| Source SHA-256 | `6a655481a39727beb568e6365b159d9bbf371fbc8d83985c505ef1dec3c8e728` |
| Schema SHA-256 | `ce457a5fe56d4ad69f17db5a12ca83f8982d4a289a11c34d6d2a7f23561783d8` |
| Source commit | `a5674424209294a69c5c86b247a78e3590927055` |
| Fixed source check date | `2026-08-11` |
| Importer | `rc3-parquet-importer/1.2.0` |

The source file, row count, file hash, and schema fingerprint all matched the
frozen manifest. The complete Parquet source is not committed.

## Destination Results

| Destination | Before | Added | Final | In-scope candidates | Valid after normalization | Eligible new routes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Hueco Tanks | 0 | 100 | 100 | 646 | 589 | 587 |
| The Gunks | 0 | 100 | 100 | 1,017 | 853 | 853 |
| Bishop Area | 100 | 8 | 108 | 2,969 | 1,325 | 1,162 |
| Red Rock Canyon | 100 | 8 | 108 | 3,018 | 1,355 | 1,306 |
| **Total** | **200** | **216** | **416** | **7,650** | **4,122** | **3,908** |

The 16 Bishop and Red Rock routes followed the same scope, normalization,
exact-link, Grade, deduplication, and identity pipeline as every other Indexed
Route. They were not inserted through a Pick-only bypass.

## Selection Distribution

| Destination | Climbing types | Grade systems | Difficulty bands |
| --- | --- | --- | --- |
| Hueco Tanks | 100 boulder | 100 V Scale | 25 intro, 25 intermediate, 29 advanced, 21 elite |
| The Gunks | 70 trad, 20 boulder, 10 top-rope | 80 YDS, 20 V Scale | 28 intro, 33 intermediate, 31 advanced, 8 elite |
| Bishop Area additions | 8 boulder | 8 V Scale | 1 intro, 2 intermediate, 3 advanced, 2 elite |
| Red Rock additions | 8 trad | 8 YDS | 4 intro, 3 intermediate, 1 advanced |

Hueco contributes 25 routes from each reviewed mountain area: East Mountain,
East Spur, North Mountain, and West Mountain. The Gunks selection covers The
Trapps, Near Trapps, Millbrook, Peterskill, and their reviewed bouldering
areas. All selected major Grade System groups achieved a 100% parse rate.

## Scope And Access

- Path tuples were the primary destination-scope gate. Coordinates were used
  only to detect anomalies, and route coordinates are not published.
- Hueco is limited to the reviewed Hueco Tanks hierarchy and links to Texas
  Parks and Wildlife for current access requirements.
- The Gunks includes The Trapps, Near Trapps, Trapps bouldering, Peterskill,
  Peterskill bouldering, and Millbrook. Sky Top, Giants Workshop, Lost City,
  and paths carrying reviewed closure markers were excluded.
- Bishop and Red Rock retained the Batch 1 destination boundaries. Mammoth,
  Lone Pine, June Lake, Lee Vining/Tioga, Mount Charleston, Mount Potosi,
  Keyhole, La Madre, and Valley of Fire remain outside their scopes.
- Destination centers remain manually reviewed coarse points. No route-level
  coordinates are exposed.
- Grampians, Liming, and Railay/Tonsai received a feasibility report only. No
  routes were imported and no theCrag scraper was created.

## Identity, Links, And Idempotency

- Selected source coverage: **100%**.
- Selected exact-route-link coverage: **100%**.
- Broken selected exact links: **0**.
- Same-ID source refresh merges: **3**.
- Quarantined conflicts recorded: **27**.
- Unresolved identity conflicts: **0**.
- Rejected candidates recorded: **3,528**.
- Public route removals: **0**.
- Unresolved duplicate candidates: **0**.
- Alias migrations required: **0**.

Running the same manifest again produced:

- imported: `0`
- updated: `0`
- removed: `0`
- semantic SHA-256:
  `52f9f29ce51ce0713afeff747d9e9f0be77e27b4fb48e60eab3509f6b5742f14`

The three merges refresh source identity on existing canonical routes. They do
not create redirect aliases or duplicate public pages. Existing ClimbAtlas IDs
and old URLs remain stable.

## ClimbAtlas Picks

- Existing published Picks retained: **40**.
- New published Picks: **24**.
- Final published Picks: **64**.
- Joshua Tree: 8 new Picks from existing routes.
- Bishop Area: 8 reviewed routes and 8 experience overlays.
- Red Rock Canyon: 8 reviewed routes and 8 experience overlays.

All Picks continue through `RouteRecord -> RouteDetailViewModel ->
RouteDetailView`. The new experience records contain bilingual evidence-backed
or explicitly editorial fields. No route photo, beta, topo, protection advice,
or user content was imported.

## Production My Atlas Reference Audit

A fresh, de-identified, read-only aggregate query was run against the
Production Supabase project at `2026-08-12T02:42:56.966979+00:00`.

| Table | Route-reference rows |
| --- | ---: |
| `saved_routes` | 1 |
| `route_notes` | 0 |
| `climbing_logs` | 0 |

The sole reference is `yangshuo-china:spicy-noodle-yangshuo`. The repository
audit resolved it directly to a current public canonical route:

- orphaned references: **0**
- retired references: **0**
- area-index references: **0**
- alias migrations needed: **0**
- release gate: **pass**

The query returned only table name, destination slug, route ID, and aggregate
count. It did not read or store user IDs, email addresses, private notes,
climbing-log notes, DNA answers, or other personal data. This is a route
reference integrity audit; it is not claimed as a new two-account runtime RLS
penetration test.

## Local Validation

The final local application checks passed before the hosted Preview commit:

- source SHA, source row count, and schema fingerprint matched;
- route schema: 2,023 public routes and 68 area indexes;
- public parity: 2,023 routes and 64 Picks;
- route conversion failures: 0;
- ViewModel builds: 2,023 successful, 0 failures;
- experience validation: 64 Picks, 0 errors and 0 warnings;
- cleanup, Grade, formatter, copy, DNA, score, UI, and private My Atlas
  validations passed;
- TypeScript passed with incremental output disabled;
- Production build passed and generated 2,206 static pages;
- local RC3.2 HTTP validator checked 56 Batch 3 route pages;
- local smoke checked 57 pages: homepage, supporting pages, all 26
  destinations, and one representative route per destination.

The latest complete build took 89.2 seconds on this machine: 18.6 seconds to
compile and 16.9 seconds for static generation. The Next.js output does not
provide comparable per-route bundle measurements, so homepage and explorer
bundle deltas are not claimed.

## Hosted Preview Evidence

Vercel deployment `5862012037` completed successfully for commit `c69da52`.
The Preview is protected by Vercel SSO, so anonymous HTTP requests correctly
redirect to the protection page. Validation was performed in the signed-in
in-app browser against the protected runtime.

Verified on the hosted Preview:

- homepage loaded with no browser console warnings or errors;
- Hueco Tanks and The Gunks each displayed 100 routes;
- Hueco exposed 100 boulder routes and separate accessible Grade controls;
- The Gunks exposed 70 trad, 20 boulder, and 10 top-rope records with separate
  YDS and V Scale selectors;
- selecting YDS `5.8+` and `5.9` produced
  `?gradeSystem=yds&grades=5.8%2B%2C5.9` and survived refresh;
- a sampled Hueco Indexed Route displayed Source-backed facts and one exact
  OpenBeta route source, without Pick experience sections;
- The Mandala displayed `V12- / V scale`, 2 sources, and the shared Pick
  experience sections, without an incorrect YDS grade;
- Chinese switching set `<html lang="zh-CN">` and did not expose internal
  source enums;
- the sampled Pick had no horizontal overflow at 390 x 844.

## Production Release Evidence

Commit `f2f86b2` was fast-forwarded to GitHub `main` and deployed successfully
to the existing Vercel Production project. The release is available at
`https://climbatlas.vercel.app/`. The Vercel deployment identifier is
`HGRX8DsBe45uhBRHLiZrsMdcbNkM`.

Production validation completed on `2026-08-12`:

- the Batch 3 validator checked 56 balanced route samples across Hueco Tanks,
  The Gunks, Bishop Area, and Red Rock Canyon;
- all 56 pages returned HTTP 200, contained the expected route name and exact
  source URL, and exposed none of the prohibited placeholder or internal copy;
- the full Production smoke test checked 57 pages: the homepage, supporting
  pages, all 26 destinations, and one representative route per destination;
- Hueco Tanks and The Gunks each displayed 100 routes in the live browser;
- the Gunks exposed separate semantic YDS and V Scale Grade groups;
- a Hueco Indexed Route remained facts-only and Source-backed;
- The Mandala displayed its V Scale facts and shared Pick experience layer
  without an incorrect YDS label;
- the sampled Production pages produced no horizontal overflow in the checked
  layout.

The first automated Production request encountered a transient network
`ECONNRESET`. The complete validator subsequently produced a 56/56 passing
report, and the independent Production smoke test passed 57/57 pages.

## Known Limitations

- Destination DNA profiles currently cover 24 of 26 destinations. New River
  Gorge and Indian Creek use the stable anonymous DNA CTA instead of an
  invented match profile.
- The new Hueco and Gunks routes are single-source Indexed Routes, not manually
  cross-checked route guides.
- Destination artwork is explicitly labeled as editorial art, not an exact
  destination or route photograph.
- No new runtime two-account RLS penetration test was created by this batch.

## Versioned Evidence

The frozen manifest, normalized import snapshot, Preview sample reports, scope
audit, access audit, feasibility report, and this Batch Report live under
`src/data/routes/` and `docs/reports/route-coverage-3-batch-3/`. The complete
Parquet source and temporary machine-generated output directory remain outside
Git.
