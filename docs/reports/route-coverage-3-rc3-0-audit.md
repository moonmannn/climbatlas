# Route Coverage 3.0 - Batch 1 RC3-0 Audit

Audit date: 2026-08-05

Status: **RC3-0 complete with release blockers. No routes were imported and no public catalog data was changed.**

## 1. Current Baseline

The repository was recalculated from the public route selector instead of using the planning baseline.

| Metric | Planned baseline | Repository baseline | Difference |
| --- | ---: | ---: | ---: |
| Destinations | 20 | 20 | 0 |
| Public routes | 1,074 | 1,074 | 0 |
| Published Picks | 40 | 40 | 0 |
| Area indexes | not stated | 68 | audit only |
| Imported public routes | not stated | 219 | audit only |

The older 1,107-route number is not the current baseline. The reviewed legacy cleanup removed 33 public route-shaped records: 26 were hidden, 4 became area indexes, and 3 became aliases. The full removal ledger is in `docs/reports/legacy-route-index-cleanup.md`.

### Destination counts

| Destination | Public routes | Published Picks |
| --- | ---: | ---: |
| Yosemite | 127 | 8 |
| Red River Gorge | 140 | 8 |
| Joshua Tree | 42 | 0 |
| Smith Rock | 109 | 0 |
| Squamish | 64 | 8 |
| El Potrero Chico | 40 | 0 |
| Fontainebleau | 56 | 8 |
| Chamonix | 40 | 0 |
| Ceuse | 40 | 0 |
| Kalymnos | 48 | 8 |
| Dolomites | 40 | 0 |
| Frankenjura | 40 | 0 |
| Siurana | 40 | 0 |
| Margalef | 40 | 0 |
| Yangshuo | 40 | 0 |
| Liming | 31 | 0 |
| Long Dong | 40 | 0 |
| Railay / Tonsai | 38 | 0 |
| Grampians | 19 | 0 |
| Rocklands | 40 | 0 |

### Batch destination baseline

| Destination | Current | Minimum | Target | Maximum | Net to target |
| --- | ---: | ---: | ---: | ---: | ---: |
| Joshua Tree | 42 | 140 | 150 | 160 | +108 |
| Squamish | 64 | 140 | 150 | 160 | +86 |
| Bishop Area | 0 | 90 | 100 | 110 | +100 |
| Red Rock Canyon | 0 | 90 | 100 | 110 | +100 |

If every target passes the quality gates, the batch adds 394 routes and produces 1,468 public routes across 22 destinations. This is a planning result, not a release requirement.

Joshua Tree currently contains 38 trad and 4 boulder routes. Forty of its 42 routes lack a normalized sector and only 2 have an exact route external link. Squamish contains 38 trad, 22 multi-pitch, and 4 sport routes; 37 of 64 lack a normalized sector and 38 have an exact route external link. These gaps are inputs to candidate selection, not fields to guess during import.

## 2. OpenBeta Release Audit

Official source checked: `https://github.com/OpenBeta/parquet-exporter/releases/tag/v2026-08-02`

| Field | Result |
| --- | --- |
| Release | v2026-08-02 |
| Release accessible | yes |
| Release date | 2026-08-02 02:09 (GitHub release display) |
| Source commit | `a5674424209294a69c5c86b247a78e3590927055` |
| Reported row count | 231,865 |
| Reported Parquet size | 10.37 MB |
| Asset candidate URL | `https://github.com/OpenBeta/parquet-exporter/releases/download/v2026-08-02/openbeta-climbs.parquet` |
| Data license | CC0 / public domain, as stated by the official exporter README |
| Exporter code license | MIT |
| Schema fingerprint | `sha256:8c69c81b2c1d82f91e19f155fc5ce63976c6452b1238658bb4bada17f4d680d4` |
| Parquet SHA-256 | **pending** |

The locked schema exposes route ID, name, three grade columns, five climbing-type booleans, five hierarchy columns, coordinates, length, bolts, first ascent, safety, and description. The importer allowlist will read only the approved identity, grade, type, hierarchy, positive length, and source fields. Coordinates are audit-only. Bolts, first ascent, safety, and description must be discarded before normalization.

The current environment could verify the release page, source commit, row count, schema, and license, but could not download the binary release asset to calculate its SHA-256. The draft manifest therefore stores `sourceSha256: null`. RC3-1 must not run a publishable import until the asset is downloaded and hashed.

## 3. Batch Manifest Draft

Machine-readable draft: `docs/reports/route-coverage-3-batch-1-manifest.draft.json`

It is intentionally marked `draft-blocked`. A publishable manifest must replace the null asset hash, freeze the final accepted and excluded path tuples, and record the production My Atlas reference audit result.

## 4. Destination Scope Drafts

All scopes use path tuples as the primary inclusion rule. Coordinates may identify suspicious rows but may not admit a route. Exact route coordinates will not be published, and existing manually reviewed destination map centers remain unchanged.

The path values below are proposed roots. RC3-1 must enumerate the actual tuple values in the locked Parquet snapshot before any row is eligible.

### Joshua Tree

- Proposed root: `USA / California / Joshua Tree National Park`.
- Include only descendants of the confirmed Joshua Tree source root.
- Exclude sibling California desert destinations even when route names or nearby coordinates look similar.
- Do not infer a ClimbAtlas sector from the Parquet `crag` column. The five-level export may truncate deeper source hierarchy.

### Squamish

- Proposed root: `Canada / British Columbia / Squamish`.
- Include only approved descendants of the confirmed Squamish root.
- Exclude Vancouver, Whistler, Pemberton, and other British Columbia sibling regions unless a later product scope explicitly includes them.
- Preserve the source hierarchy, then apply a Squamish-specific product mapping.

### Bishop Area

- Proposed product identity: `bishop-area-usa`, display name `Bishop Area`.
- Proposed source root: `USA / California / Sierra Eastside / Bishop Area`; every token must be confirmed from the snapshot.
- Candidate child areas for manual scope review: Buttermilk Country, Volcanic Tablelands including Happy and Sad Boulders, Owens River Gorge, Pine Creek, and Druid Stones.
- Proposed exclusions: Mammoth, Alabama Hills, Whitney Portal, Rock Creek, Lee Vining, and other Eastern Sierra siblings unless the product boundary is explicitly changed.
- Report bouldering/V Scale and roped/YDS separately.
- Use Bishop Area Climbers Coalition and relevant land-management pages as access resources. Do not freeze temporary closures or sensitive coordinates into the destination introduction.

### Red Rock Canyon

- Proposed product identity: `red-rock-canyon-usa`, display name `Red Rock Canyon`.
- Proposed source root: `USA / Nevada / Southern Nevada / Red Rocks`; every token must be confirmed from the snapshot.
- Candidate child areas for manual scope review: Calico Hills, Black Velvet Canyon, Pine Creek, First Creek, and Mount Wilson.
- Proposed exclusions: Mt Charleston, Valley of Fire, and other Southern Nevada climbing areas outside the reviewed Red Rock product boundary.
- Scenic Drive location is an access consideration, not an inclusion rule.
- Use the current BLM Red Rock Canyon NCA page as the primary access resource. Time-sensitive reservation or closure text must remain behind freshness handling instead of being copied into long-lived content.

## 5. Candidate Count Estimate

These are feasibility estimates, not selected-route counts.

| Destination | Broad source pool | Needed for target | RC3-0 assessment |
| --- | ---: | ---: | --- |
| Joshua Tree | thousands | 108 | feasible; exact scope count pending |
| Squamish | many hundreds | 86 | feasible; exact scope count pending |
| Bishop Area | 2,969 | 100 | broad pre-scope pool only |
| Red Rock Canyon | 3,018 | 100 | broad pre-scope pool only |

The Bishop and Red Rock figures came from an earlier inspection of the same locked release and used broad hierarchy roots. They include records that may later fail scope, identity, grade, exact-link, or duplicate checks. RC3-1 must reproduce these counts from the hash-verified asset and generate the authoritative candidate report.

No selected count can be claimed in RC3-0. Exact-link coverage is also unknown until current canonical OpenBeta URLs are resolved for each candidate.

## 6. Route Identity And My Atlas Risk

Static repository audit:

- 9 route alias parameters exist.
- 30 retired route parameters exist.
- 7 aliases resolve to public routes.
- 2 retired wall-level aliases resolve to area indexes rather than routes. They must not become canonical user-route identities.
- The existing SQL alias migration covers 6 older aliases and updates `saved_routes` and `route_notes` only.
- That migration predates `climbing_logs`; existing log rows are not rewritten by it.
- The client providers resolve aliases when loading or writing, but this is not a substitute for a complete database migration and orphan audit.
- There is no standalone persisted `RouteIdentityRecord` registry yet; identity is spread between canonical route IDs, OpenBeta source records, generated metadata aliases, and cleanup aliases.

The worktree has `.env.example` but no `.env.local`, so production Supabase rows cannot be queried here. The following release gates remain unverified:

- orphaned references in `saved_routes`, `route_notes`, and `climbing_logs`;
- references to hidden or area-index records;
- two-user runtime RLS isolation against the deployed database.

RC3-2 must create an identity registry and an administrative audit/migration that covers all three user-route tables. Existing canonical IDs must remain stable. OpenBeta UUIDs are source identities only.

## 7. Validation Performed

All checks below ran against the unchanged catalog:

- `npm.cmd run routes:audit -- --no-write`: passed, 1,074 routes, 0 validation errors, 0 duplicate candidates.
- `npm.cmd run routes:validate-public`: passed, 1,074 public routes and 40 Picks.
- `npm.cmd run atlas:validate`: passed static private-data and RLS policy validation.
- `npm.cmd run routes:validate-cleanup -- --no-write`: passed.
- `npm.cmd run routes:validate-view-models -- --no-write`: 1,074 ViewModels, 0 failures.
- `npm.cmd run routes:validate-experience`: 40 Picks, 0 errors, 0 warnings.
- `npm.cmd run routes:validate-schema`: 1,074 route records, 68 area indexes, 0 errors.
- `npm.cmd run typecheck -- --incremental false`: passed.

These checks do not verify the missing Parquet asset hash or production Supabase rows.

## 8. Files Involved In Later Phases

Existing files likely to be reused or replaced:

- `scripts/routes/import-openbeta-poc.mjs`
- `scripts/routes/openbeta-source-adapter.mjs`
- `src/lib/routes/import/normalize-openbeta.ts`
- `src/lib/routes/adapters/openbeta-route-adapter.ts`
- `src/lib/routes/import/merge-route-import.ts`
- `src/lib/routes/deduplicate-routes.ts`
- `src/lib/routeAliases.ts`
- `src/types/route.ts`
- `src/data/routes/imports/`
- `src/data/routes/raw/`
- `supabase/migrations/20260710_merge_route_aliases.sql`
- `supabase/schema.sql`

Planned RC3 files, not created in this phase:

- a Parquet batch importer and manifest validator;
- destination scope definitions and hierarchy mappers;
- a canonical route identity registry;
- candidate, scope, conflict, merge, removal, and source-change report generators;
- a My Atlas route-reference audit and migration covering climbing logs.

## 9. Implementation Risks

1. The release asset hash is not yet verified, so the source snapshot is not publishable.
2. The five-column Parquet hierarchy can truncate deeper OpenBeta paths. Treating `crag` as a universal sector would misclassify routes.
3. Broad Bishop and Red Rock roots contain product-boundary ambiguity; string search or coordinates alone would leak sibling destinations into the catalog.
4. Current exact-link coverage cannot be assumed from an OpenBeta UUID. Every selected route must resolve to a valid canonical route URL.
5. Existing route aliases are not represented by one identity registry, and the historical SQL migration does not cover climbing logs.
6. Single-source records must remain `source-backed`, not `verified`.
7. Candidate selection can become biased toward one crag or elite grades unless area, climbing type, grade system, and difficulty-band quotas are explicit and deterministic.
8. Adding two destinations changes static page count and payload shape; route summaries must remain separate from full records.

## 10. RC3-1 Concrete Plan

1. Download the exact release asset outside the repository data tree, calculate SHA-256, verify row count, and compare the Parquet schema fingerprint with the Manifest.
2. Add a Parquet reader to the import script without committing the binary. Prefer an existing workspace/runtime capability; add a dependency only if no stable reader is available.
3. Implement an allowlist row parser that drops descriptions, safety, protection-related fields, first-ascent narrative, coordinates from output, and every other forbidden field before adapter normalization.
4. Implement versioned destination scopes. Enumerate every accepted and excluded source tuple from the locked snapshot and write the Scope Report.
5. Implement destination-specific hierarchy mappings. Preserve raw source hierarchy and produce optional product `areaId`, `sectorId`, and `cragName` without guessing.
6. Adapt eligible rows into the existing normalized `RouteRecord`. Do not create provider-specific UI or public data branches.
7. Validate original grades and produce separate discipline/system spread reports. Unparseable grades may remain visible as raw facts but cannot enter filters or ranges.
8. Resolve candidate OpenBeta URLs, store redirect outcomes, and exclude any row without a valid exact route URL from the publishable candidate pool.
9. Run identity normalization and read-only deduplication against the 1,074-route baseline. Report duplicates and conflicts without modifying the catalog.
10. Select candidates deterministically by coverage gaps, source hierarchy, climbing type, grade system, difficulty band, and stable canonical source ID.
11. Generate dry-run Candidate Selection, Scope, Conflict, and source-link reports. Re-run the same Manifest to prove semantic idempotency.
12. Stop before writing public catalog files. RC3-2 begins only after the dry-run reports and all remaining blockers are reviewed.

## RC3-0 Decision

The batch is feasible, but it is **not ready for import**. RC3-1 is blocked until the Parquet asset hash is verified. Bishop and Red Rock also require tuple-level boundary confirmation, and production My Atlas references require a database-side audit before any identity merge can be released.
