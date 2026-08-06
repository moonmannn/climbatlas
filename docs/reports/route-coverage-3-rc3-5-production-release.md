# Route Coverage 3.0 - Batch 1 Production Release

Date: 2026-08-06

## Release Result

- Status: released to Production
- Production URL: `https://climbatlas.vercel.app`
- Release candidate commit: `7bc433d9ebc4443accdea06eb265eab2bfee2bb1`
- Production rollback commit: `e6c9d3dd2c57c413cc57061abcc47b2fab58a8b3`
- Rollback tag: `rc3-5-pre-release-2026-08-06`
- Destinations: 20 -> 22
- Public routes: 1,074 -> 1,468
- Published Picks: 40 -> 40

## Source Manifest

- Provider: OpenBeta
- Release: `v2026-08-02`
- Source commit: `a5674424209294a69c5c86b247a78e3590927055`
- Source rows: 231,865
- Source SHA-256: `6a655481a39727beb568e6365b159d9bbf371fbc8d83985c505ef1dec3c8e728`
- Schema SHA-256: `ce457a5fe56d4ad69f17db5a12ca83f8982d4a289a11c34d6d2a7f23561783d8`
- Source, row-count, and schema fingerprints matched the frozen manifest.

The full Parquet source is not committed. The repository contains the frozen
manifest, the normalized release snapshot, and the audit ledgers.

## Destination Results

| Destination | Before | Imported | After | Exact-link coverage | Major grade parse rate |
| --- | ---: | ---: | ---: | ---: | ---: |
| Joshua Tree | 42 | 108 | 150 | 100% | 100% |
| Squamish | 64 | 86 | 150 | 100% | 100% |
| Bishop Area | 0 | 100 | 100 | 100% | 100% |
| Red Rock Canyon | 0 | 100 | 100 | 100% | 100% |

The selected release covers introductory, intermediate, advanced, and elite
difficulty bands. Bishop keeps V Scale and YDS reporting separate. Route-level
coordinates are not published.

## Identity And Selection

- Candidates selected for release: 394
- Existing-route source merges: 41
- Quarantined conflicts reviewed: 130
- Unresolved identity conflicts: 0
- Rejected candidates: 513
- Duplicate candidates unresolved: 0
- Broken selected exact-route links: 0
- Selected source coverage: 100%
- Selected exact-route link coverage: 100%
- Route conversion failures: 0
- Idempotency rerun: imported 0, updated 0, removed 0
- Unexplained public-route removals: 0

OpenBeta external IDs remain source identities. Existing ClimbAtlas route IDs
stay canonical, and 41 duplicate source records were merged without creating
duplicate public routes.

## My Atlas And Access

- Production route-reference audit: pass
- Route references checked: 1
- Orphaned references: 0
- Retired references: 0
- Alias migrations needed: 0
- Static private-data and RLS policy validation: pass

The production reference audit used a read-only aggregate snapshot and did not
contain user identifiers or private notes. No Supabase schema or RLS policy was
changed by this batch. A repeatable two-account runtime RLS penetration test is
not present in the repository and is not claimed as completed by RC3-5.

## Validation

- RC3 Preview catalog validation: pass
- RC3-4 combined evidence gate: pass
- Route schema, catalog, public parity, ViewModel, experience, and cleanup: pass
- Grade parser and public formatter validation: pass
- UI, public copy, Climbing DNA, Route DNA, and score-label validation: pass
- Private My Atlas validation: pass
- TypeScript: pass
- Production build: pass
- Static pages generated: 1,579
- Local production smoke: 49 pages passed
- Deployed production smoke: 49 pages passed
- Protected Preview browser sample: 80 of 80 route pages passed
- Protected Preview alias sample: 10 of 10 redirects passed

The first deployed smoke attempt encountered a transport-level fetch failure
before receiving an HTTP response. Direct HTTP checks returned 200, and the
complete 49-page smoke suite passed on retry with a longer network timeout.

## Browser Evidence

Production browser checks confirmed:

- Bishop Area renders and exposes separate semantic Grade controls.
- YDS `5.8+` and `5.9` multi-select serializes to the expected URL.
- An imported Bishop route renders one exact OpenBeta route link.
- Indexed Routes do not expose Pick experience content or imported images.
- Chinese restores after hydration with `html lang="zh-CN"`.
- No horizontal overflow was found in the checked desktop pages.

Mobile evidence was collected against the protected Preview application at the
same runtime commit. The later evidence-only commits changed reports and
validation scripts, not application runtime files.

## Known Limitations

- The route audit reports 458 legacy-data warnings. They do not create invalid
  public grades, duplicate candidates, unknown-purpose public sources, or build
  failures, but they remain cleanup debt.
- The current Next.js build output does not provide per-route bundle sizes, so
  bundle deltas are not claimed in this report.
- A live two-account Supabase RLS isolation test still needs a dedicated,
  repeatable test harness and disposable test identities.

## Rollback

The pre-release Production state is preserved at commit
`e6c9d3dd2c57c413cc57061abcc47b2fab58a8b3` and tag
`rc3-5-pre-release-2026-08-06`. If a production regression is confirmed, restore
that commit through the normal Git/Vercel release flow rather than rewriting
published history.
