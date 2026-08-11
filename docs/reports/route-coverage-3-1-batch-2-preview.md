# Route Coverage 3.1 - Batch 2 Preview Report

## Status

Batch 2 is implemented and validated in the local Preview catalog. It has not
been pushed or deployed by this work.

- Destinations: **22 -> 24**
- Public routes: **1,468 -> 1,807**
- New Indexed Routes: **339**
- Published ClimbAtlas Picks: **40 -> 40**
- Unexplained removals: **0**

## Locked Source

| Field | Value |
| --- | --- |
| Provider | OpenBeta official Parquet export |
| Release | `v2026-08-02` |
| Source rows | `231865` |
| Source SHA-256 | `6a655481a39727beb568e6365b159d9bbf371fbc8d83985c505ef1dec3c8e728` |
| Schema SHA-256 | `ce457a5fe56d4ad69f17db5a12ca83f8982d4a289a11c34d6d2a7f23561783d8` |
| Source commit | `a5674424209294a69c5c86b247a78e3590927055` |
| Fixed source check date | `2026-08-10` |
| Importer | `rc3-parquet-importer/1.1.0` |

The source file, row count, file hash, and schema fingerprint all matched the
locked manifest. The full Parquet asset is not committed.

## Destination Results

| Destination | Before | Added | Preview total | In-scope candidates | Valid after normalization | Eligible new routes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Yosemite | 127 | 48 | 175 | 2,387 | 1,933 | 1,800 |
| Smith Rock | 109 | 51 | 160 | 1,234 | 1,161 | 1,062 |
| Red River Gorge | 140 | 40 | 180 | 2,674 | 2,635 | 2,494 |
| New River Gorge | 0 | 100 | 100 | 1,702 | 1,635 | 1,633 |
| Indian Creek | 0 | 100 | 100 | 1,501 | 1,370 | 1,370 |
| **Total** | **376** | **339** | **715** | **9,498** | **8,734** | **8,359** |

The planned final total was 1,807 and the validated Preview total is 1,807.
No lower-quality record was added to close a numerical gap.

## Selection Distribution

| Destination | Climbing types in the new selection | Grade systems | Difficulty bands |
| --- | --- | --- | --- |
| Yosemite | 23 boulder, 9 sport, 5 top-rope, 11 trad | 21 V Scale, 27 YDS | 17 intro, 15 intermediate, 10 advanced, 6 elite |
| Smith Rock | 15 boulder, 16 sport, 6 top-rope, 14 trad | 15 V Scale, 36 YDS | 14 intro, 15 intermediate, 15 advanced, 7 elite |
| Red River Gorge | 10 boulder, 28 sport, 1 top-rope, 1 trad | 10 V Scale, 30 YDS | 10 intro, 9 intermediate, 15 advanced, 6 elite |
| New River Gorge | 24 boulder, 40 sport, 5 top-rope, 31 trad | 24 V Scale, 76 YDS | 28 intro, 28 intermediate, 28 advanced, 16 elite |
| Indian Creek | 5 boulder, 6 sport, 1 top-rope, 88 trad | 5 V Scale, 95 YDS | 3 intro, 32 intermediate, 58 advanced, 7 elite |

All selected V Scale and YDS groups achieved a 100% grade parse rate. Original
grades remain the display facts; normalized grades are used only for filtering
and ordering.

## Scope Decisions

- Destination path tuples were the primary scope gate. Coordinates were used
  only for scope validation and route coordinates are not published.
- New River Gorge includes the source hierarchy under `New River Gorge, The`.
  The source path `South Side Crags (CLOSED)` was explicitly excluded, removing
  126 sibling rows from consideration.
- Indian Creek requires `USA / Utah / Southeast Utah / Indian Creek`. The scope
  excluded 1,703 other Southeast Utah rows rather than treating the surrounding
  region as part of the destination.
- Destination map coordinates are manually chosen coarse centers. They were not
  calculated from route coordinates.
- New River Gorge access links point to the National Park Service and New River
  Alliance of Climbers. Indian Creek points to the Bureau of Land Management.

## Identity, Links, And Cleanup

- Exact route link coverage: **100%**
- Source coverage: **100%**
- Broken selected exact links: **0**
- Source merges into existing canonical routes: **270**
- Quarantined identity conflicts: **79**
- Unresolved identity conflicts: **0**
- Rejected source candidates: **769**
- Public route removals: **0**
- Placeholder names selected: **0**
- Duplicate candidates after normalization: **0**

The browser review found six placeholder-like Indian Creek names that the
first exact-match rule had missed. The importer now rejects forms such as
`Unknown 2`, `Unknown Sport Route`, and `Unnamed 5.11`; deterministic eligible
candidates replaced them without changing the target count.

Running the same manifest again produced:

- imported: `0`
- updated: `0`
- removed: `0`
- semantic SHA-256:
  `7ce1aca49836811e0119ebcff5d44e8043415143ff6537ef02994010e84672bb`

## My Atlas Reference Audit

The release gate passed against a fresh, de-identified, read-only aggregate
query run against the Production Supabase project on August 11, 2026:

- Route references checked: **1**
- Orphaned references: **0**
- Alias migrations required: **0**
- Production query checked at: `2026-08-11T10:33:21.551629+00:00`

The query returned only `source_table`, `destination_slug`, `route_id`, and an
aggregate reference count. It did not read or store user identifiers, email
addresses, private note text, climbing-log notes, or DNA data. The sole current
reference resolves to the public canonical route
`yangshuo-china:spicy-noodle-yangshuo`.

## Validation Evidence

The following checks passed after the placeholder cleanup:

- Preview catalog: 24 destinations, 1,807 public routes, 339 new Index routes,
  270 source merges, 40 Picks.
- Route schema: 1,807 routes and 68 area indexes, 0 errors and 0 warnings.
- Public parity: 1,807 public routes, 952 imported routes, 40 Picks.
- Route audit: 0 validation errors, 0 warnings, 0 duplicate candidates.
- Route ViewModels: 1,807 built, 0 failures, 24 destination counts conserved.
- Experience layer: 40 Picks, 0 errors and 0 warnings.
- Grade validation: 1,807 catalog routes, 0 safely unparsed, 3 deliberately
  excluded from comparison.
- Public copy: 24 bilingual destination introductions checked.
- Private My Atlas validation: passed.
- TypeScript: passed with incremental output disabled.
- Production build: passed; 1,988 static pages generated.

Final build timing observed on this machine:

- Compile: 17.5 seconds
- TypeScript phase: 4.2 seconds
- Static generation: 15.4 seconds
- End-to-end build command: 85.4 seconds

The current Next.js build output does not report comparable per-route bundle
sizes, and no prior Batch 2 bundle snapshot exists. Bundle deltas are therefore
not claimed.

## Browser And No-JavaScript Checks

The rebuilt local Production server returned HTTP 200 for the homepage, both
new destination pages, and representative route pages from both destinations.

Real Chromium checks covered desktop and a 390 x 844 mobile viewport:

- no horizontal overflow;
- no browser console errors;
- Chinese switching updates `<html lang>` to `zh-CN`;
- multi-grade filters use separate accessible controls;
- selected grades survive refresh and are encoded in the URL;
- Back and Forward restore filter state;
- returning from a route page restores the filtered explorer;
- exact OpenBeta route URLs are present;
- no route coordinates or missing-value placeholders appear on sampled route
  pages;
- rejected placeholder route names do not appear in the rebuilt Indian Creek
  destination page.

Raw HTML checks confirmed that both new destination pages contain the stable
anonymous Climbing DNA CTA and Route Explorer without requiring JavaScript.

## Known Limitations

- New River Gorge and Indian Creek do not yet have editorially reviewed DNA
  destination profiles. The UI withholds a match percentage and keeps the safe
  CTA/state instead of inventing one. Existing profile coverage is 22 of 24
  destinations.
- New imported routes are single-source Indexed Routes, not ClimbAtlas Picks or
  manually cross-checked route guides.
- Destination artwork is explicitly labeled as original editorial illustration,
  not an exact destination or route photograph.
- A protected Preview deployment has not been completed in this local
  implementation pass.
- No rollback commit exists until the batch is intentionally committed before
  deployment.

## Versioned Evidence

Machine-readable reports are stored in
`docs/reports/route-coverage-3-batch-2/`. They include the candidate selection,
scope, identity, merge, conflict, rejection, removal, source-change, legacy
grade-marker, and My Atlas audit ledgers.
