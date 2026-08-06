# Route Coverage 3.0 - Batch 1 RC3-1 / RC3-2 Report

Audit date: 2026-08-05

Status: **Dry-run pipeline, identity preview, and production My Atlas reference audit complete. Public catalog unchanged.**

## 1. Locked Source

| Field | Result |
| --- | --- |
| Provider | OpenBeta official Parquet Export |
| Release | `v2026-08-02` |
| Asset | `openbeta-climbs.parquet` |
| Asset size | 10,872,107 bytes |
| Asset SHA-256 | `6a655481a39727beb568e6365b159d9bbf371fbc8d83985c505ef1dec3c8e728` |
| Source rows | 231,865 |
| Source commit | `a5674424209294a69c5c86b247a78e3590927055` |
| Parquet schema SHA-256 | `ce457a5fe56d4ad69f17db5a12ca83f8982d4a289a11c34d6d2a7f23561783d8` |
| Snapshot, row count, schema match | yes / yes / yes |
| Data license | CC0, as stated by the official exporter |

The Parquet binary remains outside the repository. The importer reads only approved identity, grade, climbing type, hierarchy, and positive length columns. Description, safety, bolts, first-ascent narrative, coordinates, photos, comments, ratings, beta, and topo data are not read into `RouteRecord`.

Final manifest: `src/data/routes/manifests/route-coverage-3-batch-1.json`.

## 2. Scope Results

Path tuples are the inclusion authority. Coordinates are not used to admit records and are not published.

| Destination | Accepted source root | Rows in scope | Important sibling exclusions |
| --- | --- | ---: | --- |
| Joshua Tree | USA / California / Joshua Tree National Park | 6,451 | California desert siblings are outside the accepted root |
| Squamish | Canada / British Columbia / Squamish | 2,104 | Sea to Sky north/south and Vancouver: 1,213 rows |
| Bishop Area | USA / California / Sierra Eastside / Bishop Area | 2,969 | Mammoth, Lone Pine, June Lake, Lee Vining and other Sierra Eastside siblings: 2,764 rows |
| Red Rock Canyon | USA / Nevada / Southern Nevada / Red Rocks | 3,018 | Mt Charleston, Mt Potosi, Keyhole, La Madre, Valley of Fire and other Southern Nevada siblings: 1,335 rows |

Bishop preserves Buttermilk Country, Volcanic Tablelands, Owens River Gorge, Pine Creek Canyon, Druid Stones and other actual child crags as source hierarchy. Red Rock preserves Black Velvet, Calico, First Creek, Pine Creek, Mt. Wilson and other accepted Red Rocks child crags. The destination-specific mapper does not apply a global `OpenBeta crag -> ClimbAtlas sector` rule.

Machine-readable detail: `docs/reports/route-coverage-3-batch-1/scope-report.json`.

## 3. Candidate Selection

| Destination | Before | Selected new | Preview total | Valid after normalization | Existing duplicates | Conflict candidate records | Eligible new |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Joshua Tree | 42 | 108 | 150 | 6,305 | 21 | 102 | 6,178 |
| Squamish | 64 | 86 | 150 | 1,967 | 20 | 31 | 1,916 |
| Bishop Area | 0 | 100 | 100 | 2,847 | 0 | 144 | 2,703 |
| Red Rock Canyon | 0 | 100 | 100 | 2,913 | 0 | 53 | 2,860 |
| **Total** | **1,074 catalog baseline** | **394** | **1,468 catalog preview** |  | **41 proposed merges** | **330 candidate records** |  |

Selection is deterministic: destination-specific area/crag round-robin, then climbing type, grade system, difficulty band, and stable source UUID. Each destination covers intro, intermediate, advanced, and elite bands. Top-rope is capped at 10% of requested additions; Joshua Tree now selects 11 top-rope routes rather than allowing that source category to dominate.

Selected type distribution:

| Destination | Boulder | Sport | Trad | Top-rope | Alpine |
| --- | ---: | ---: | ---: | ---: | ---: |
| Joshua Tree | 25 | 42 | 30 | 11 | 0 |
| Squamish | 24 | 30 | 31 | 1 | 0 |
| Bishop Area | 37 | 21 | 35 | 7 | 0 |
| Red Rock Canyon | 8 | 34 | 48 | 10 | 0 |

All selected major YDS and V-scale groups have a 100% parse rate. Original grades remain preserved. No inferred movement, style, safety, protection, editorial, DNA, or quality content was created.

The source can mark one record with multiple climbing-type booleans, while the current canonical model has one primary type. Rather than silently choosing one, the batch rejects those ambiguous records. A direct source-to-preview audit confirms `0` multi-type rows among the 394 selected routes.

Machine-readable detail: `candidate-selection-report.json` and `rejection-ledger.json` in the batch report directory.

## 4. Exact Route Links

- Selected links checked: 394.
- Valid exact route pages: 386.
- Controlled canonical redirects: 8.
- Broken or unverified selected links: 0.
- Exact route link coverage: 100%.
- Area or search pages used as route links: 0.

Three otherwise eligible records failed exact-link validation and were rejected. Link outcomes use the Manifest's fixed `sourceCheckedAt`; current run time is kept only in audit reports.

## 5. Identity, Deduplication, And Conflicts

- Proposed source merges into existing canonical routes: 41 (Joshua Tree 21, Squamish 20).
- New preview route identities: 394.
- Total identity preview records: 435.
- Existing canonical IDs changed: 0.
- Proposed merged source IDs recorded: 41.
- New slug aliases required by the dry run: 0.
- Public removals: 0.
- Unresolved identity conflicts admitted to selection: 0.

There are 130 conflict groups in the source audit: 87 same-source duplicate-name groups and 43 source-to-existing identity conflicts. They are quarantined and excluded from selection; they are not auto-merged or silently overwritten. The 41 high-confidence merge proposals have compatible normalized name, grade, type, and locality, and only append an OpenBeta source identity in a future public import.

Machine-readable detail: `conflict-ledger.json`, `merge-ledger.json`, `route-identity-preview.json`, `source-change-ledger.json`, and `removal-ledger.json`.

## 6. Conversion And Rejection Ledger

- Route conversion failures: 0.
- Rejected before normalization: 510.
  - Missing or redacted route name: 38.
  - No supported climbing type: 6.
  - Multiple source climbing types that cannot be represented losslessly: 466.
- Rejected during exact-link validation: 3.
- ViewModel construction failures in the unchanged public catalog: 0 of 1,074.
- Existing catalog fact conflicts reported by the stabilization validator: 3; unchanged by this batch.

No failed conversion or conflict is silently skipped. Every rejected or quarantined ID is present in the machine-readable ledgers.

## 7. Idempotency

The final dry run was repeated with the same Manifest, source SHA, schema SHA, importer version, and scope versions:

- Imported: 0.
- Updated: 0.
- Removed: 0.
- Semantic snapshot SHA-256: `b43047bbd1a3549cc5c24b1f908d7f1110417afe97f4e0ef60bad2341b4eb087`.

The Parquet asset and full preview snapshot remain ignored and are not committed. The report directory contains the minimized selected-route facts and audit ledgers needed to reproduce the decision.

## 8. Destination Conservation

Only the dry-run preview changes counts. The public catalog remains at 20 destinations and 1,074 routes.

| Destination | Public before | Dry-run preview |
| --- | ---: | ---: |
| Yosemite | 127 | 127 |
| Red River Gorge | 140 | 140 |
| Joshua Tree | 42 | 150 |
| Smith Rock | 109 | 109 |
| Squamish | 64 | 150 |
| El Potrero Chico | 40 | 40 |
| Fontainebleau | 56 | 56 |
| Chamonix | 40 | 40 |
| Ceuse | 40 | 40 |
| Kalymnos | 48 | 48 |
| Dolomites | 40 | 40 |
| Frankenjura | 40 | 40 |
| Siurana | 40 | 40 |
| Margalef | 40 | 40 |
| Yangshuo | 40 | 40 |
| Liming | 31 | 31 |
| Long Dong | 40 | 40 |
| Railay / Tonsai | 38 | 38 |
| Grampians | 19 | 19 |
| Rocklands | 40 | 40 |
| Bishop Area | 0 | 100 |
| Red Rock Canyon | 0 | 100 |
| **Total** | **1,074** | **1,468** |

Published Picks remain exactly 40. No Route Experience record was added or changed.

## 9. My Atlas Reference Audit

Static identity audit completed:

- Existing public canonical routes: 1,074.
- Preview canonical routes: 394.
- Existing aliases: 9.
- Retired route parameters: 30.
- Area indexes: 68.
- The historical alias SQL does not cover `climbing_logs` and must not be reused as the RC3 migration.

The production audit was completed on 2026-08-06 through the signed-in Supabase SQL Editor using read-only aggregate queries. The evidence snapshot contains no user IDs, email addresses, note bodies, DNA data, or other private content.

| Production table | Route-reference rows | Distinct users |
| --- | ---: | ---: |
| `saved_routes` | 1 | 1 |
| `route_notes` | 0 | 0 |
| `climbing_logs` | 0 | 0 |

The one saved route reference resolves directly to a current public canonical route. Audit results:

- Alias migrations needed: 0.
- Area-index references: 0.
- Retired route references: 0.
- Orphaned route references: 0.
- Production My Atlas reference release gate: **pass**.

This was a route-reference integrity audit, not a two-user runtime RLS penetration test. Static RLS policy validation remains green; the two-user runtime isolation test remains part of RC3-4 Preview validation. No Supabase key was read, stored, or committed.

## 10. Validation Results

- RC3 dry run: passed.
- Source SHA, row count, and schema fingerprint: passed.
- Deterministic second-run semantic diff: passed, all zero.
- Public route parity: 1,074 routes, 40 Picks, passed.
- Route schema: 1,074 routes, 68 area indexes, 0 errors/warnings.
- ViewModels: 1,074 built, 0 failures.
- Route Experience: 40 Picks, 0 errors/warnings.
- Legacy cleanup: 0 duplicate candidates, 0 invalid public grades, 0 unknown-purpose sources.
- Private My Atlas static/RLS policy validation: passed.
- Production My Atlas route-reference integrity: 1 reference checked, 0 issues, passed.
- Grade parser: 1,074 catalog routes, passed.
- TypeScript: passed with `--incremental false`.
- Production build: passed; 1,142 static pages generated in 45.8 seconds on the final run.

## 11. Files Added Or Changed

- `src/data/routes/manifests/route-coverage-3-batch-1.json`
- `scripts/routes/route-coverage-3/shared.mjs`
- `scripts/routes/route-coverage-3/run-batch-dry-run.mjs`
- `scripts/routes/route-coverage-3/audit-my-atlas-references.mjs`
- `src/lib/routes/adapters/openbeta-route-adapter.ts`
- `src/types/route.ts`
- `src/types/route-import.ts`
- `package.json` and `package-lock.json` (`hyparquet` is a development-only importer dependency)
- `docs/reports/route-coverage-3-batch-1/*`

## 12. RC3-3 Expected Public Changes

RC3-3 may proceed after this completed reference audit and batch report are reviewed. Its expected public work is limited to:

1. Add Bishop Area and Red Rock Canyon destination records with reviewed centers, bilingual factual introductions, and current official/local access resources.
2. Convert the 394 selected preview records into the existing generated import catalog without creating OpenBeta-specific components.
3. Apply the 41 source-identity merges while preserving existing canonical route IDs and URLs.
4. Add any required alias migration across `saved_routes`, `route_notes`, and `climbing_logs` before switching the public catalog.
5. Reuse the existing public selector, Route Explorer summary, `RouteDetailViewModel`, and `RouteDetailView`.

Public React components should not need provider-specific branches. The likely touched presentation surfaces are the existing destination summary/Route Explorer data loader, global route search index, static route parameter generation, destination map summaries, and My Atlas route lookup. Full source records, coordinates, and Route Experience profiles must remain out of homepage and map client bundles.

## RC3-1 / RC3-2 Decision

The importer, scope pipeline, deterministic candidate selection, exact-link validation, identity preview, conflict quarantine, idempotency gate, and production My Atlas route-reference audit are ready for review. No public route data was imported. The production reference audit passed with zero aliases requiring migration and zero area-index, retired, or orphaned references.
