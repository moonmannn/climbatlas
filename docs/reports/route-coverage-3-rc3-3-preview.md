# Route Coverage 3.0 - RC3-3 Preview Report

Generated: 2026-08-06

## Release State

- Phase: RC3-3 Public Import Preview
- Catalog status: local preview catalog
- Production deployed: no
- Source: OpenBeta Parquet Export `v2026-08-02`
- Source rows: 231,865
- Source SHA-256: `6a655481a39727beb568e6365b159d9bbf371fbc8d83985c505ef1dec3c8e728`
- Schema SHA-256: `ce457a5fe56d4ad69f17db5a12ca83f8982d4a289a11c34d6d2a7f23561783d8`
- Source commit: `a5674424209294a69c5c86b247a78e3590927055`

## Catalog Result

| Metric | Before RC3-3 | RC3-3 change | Preview result |
| --- | ---: | ---: | ---: |
| Destinations | 20 | +2 | 22 |
| Public routes | 1,074 | +394 | 1,468 |
| Published Picks | 40 | 0 | 40 |
| Area indexes | 68 | 0 | 68 |

The earlier legacy cleanup is a separate ledger: it changed 1,107 reviewed routes to 1,074 by accounting for 33 aliases, hidden records, or area-index conversions. RC3-3 then adds 394 Indexed Routes.

## Destination Counts

| Destination | Before | Imported | Source merges | Preview total |
| --- | ---: | ---: | ---: | ---: |
| Joshua Tree | 42 | 108 | 21 | 150 |
| Squamish | 64 | 86 | 20 | 150 |
| Bishop Area | 0 | 100 | 0 | 100 |
| Red Rock Canyon | 0 | 100 | 0 | 100 |

Source merges append an OpenBeta source identity and exact external resource to an existing canonical route. They do not change the public route count or canonical route ID.

## Scope And Selection

- Joshua Tree scope candidates: 6,451; normalized: 6,305; eligible new routes: 6,178; selected: 108.
- Squamish scope candidates: 2,104; normalized: 1,967; eligible new routes: 1,916; selected: 86.
- Bishop Area scope candidates: 2,969; normalized: 2,847; eligible new routes: 2,703; selected: 100.
- Red Rock Canyon scope candidates: 3,018; normalized: 2,913; eligible new routes: 2,860; selected: 100.
- Selection used destination path scope, then deterministic balancing by area/crag, climbing type, grade system, and difficulty band.
- Route coordinates are not published. Destination map centers remain manually reviewed.

All four selections include intro, intermediate, advanced, and elite bands in their main grade systems. The selected major grade-system parse rate is 100% for this batch.

## Identity And Sources

- New canonical Indexed Routes: 394
- Existing canonical routes receiving a source merge: 41
- Quarantined identity conflict groups: 130
- Unresolved selected identity conflicts: 0
- Broken selected exact links: 0
- Selected source coverage: 100%
- Selected exact-route link coverage: 100%
- New route media: 0
- New route experience profiles: 0
- New Published Picks: 0

The 130 quarantined groups are not public RC3-3 records. They remain in the conflict ledger for later human review.

## Identity Protection

- Existing canonical route IDs are unchanged.
- OpenBeta IDs are stored as source identities.
- The 41 merged OpenBeta route IDs resolve through aliases to existing canonical routes.
- Re-running the same Manifest produced `0 imported / 0 updated / 0 removed` semantic changes.
- Production My Atlas read-only aggregate audit: pass.
- Production route references checked: 1.
- Orphaned, retired, area-index, or alias-migration issues: 0.

The audit snapshot contains no user identifiers, private notes, or personal route content.

## UI Preview

- Bishop Area and Red Rock Canyon destination pages render through the existing Destination Route Explorer.
- New route pages render through the shared `RouteDetailViewModel` and `RouteDetailView`.
- Indexed Routes show facts, sources, and exact external links only.
- Indexed Routes do not show Pick editorial, route photos, inferred movement, beta, safety, or logistics claims.
- A merged OpenBeta alias returned a redirect to the existing canonical Joshua Tree route.
- Desktop and 390 x 844 mobile checks showed no horizontal overflow.
- Browser console errors during the sampled preview flow: 0.

## Validation

- RC3 preview catalog: pass
- Route schema: pass, 0 errors and 0 warnings
- Public route parity: pass, 1,468 routes
- Route ViewModels: 1,468 built, 0 failures
- Route Experience Layer: pass, 40 Picks unchanged
- Legacy cleanup ledger: pass
- Grade parser: pass
- Public copy: pass
- Production UI rules: pass
- Climbing DNA: pass, 22 destination profiles
- Private My Atlas: pass
- TypeScript: pass
- Production build: pass
- Static pages generated: 1,579
- Build elapsed: 47.8 seconds

The general route audit still reports 458 pre-existing migration-marker warnings in older catalog data. They are warnings rather than public conversion failures and are not introduced by the 394 RC3 routes.

## Machine Reports

Machine-readable reports are committed in `docs/reports/route-coverage-3-batch-1/`:

- `dry-run-summary.json`
- `candidate-selection-report.json`
- `scope-report.json`
- `conflict-ledger.json`
- `merge-ledger.json`
- `route-identity-preview.json`
- `rejection-ledger.json`
- `source-change-ledger.json`
- `removal-ledger.json`
- `my-atlas-reference-audit.json`

## Known Limits And RC3-4 Work

- This is a local preview catalog, not a Vercel Preview or Production deployment.
- The 130 quarantined identity groups remain excluded pending human review.
- The existing 458 migration-marker warnings remain legacy data debt.
- A two-account live Supabase RLS flow and broader Preview URL smoke sampling belong to RC3-4.
- RC3-4 should sample at least 20 imported routes per destination in English, Chinese, desktop, mobile, no-JavaScript, filter URL, refresh, and back/forward flows before Production approval.
