# Route Coverage 3.2 handoff — 2026-08-11

## Resume point (historical)

- Branch: `codex/rc3-4-preview`
- Stable Batch 2 commits already on the branch:
  - `f33d9cd feat: publish route coverage batch two`
  - `22e578e fix: hide internal source status from public copy`
- Batch 3 was subsequently committed as `c69da52` and pushed to
  `codex/rc3-4-preview`.
- The protected Vercel Preview and fresh Production My Atlas reference audit
  were completed after this handoff. See `route-coverage-3-2-batch-report.md`
  for current release evidence.

## Current catalog

- Destinations: `26`
- Public routes: `2,023`
- Published Picks: `64`
- Batch 3 Indexed Routes: `216`
  - Hueco Tanks: `100` boulder routes
  - The Gunks: `70` trad, `20` boulder, `10` top-rope routes
  - Bishop Area: `8` routes used by reviewed Picks
  - Red Rock Canyon: `8` routes used by reviewed Picks
- Source refresh merges: `3`
- New Picks: `24`, eight each for Joshua Tree, Bishop Area, and Red Rock Canyon

## Completed implementation

- Batch 3 manifest, destination scopes, access resources, feasibility report, deterministic candidate selection, import snapshot, conflict/rejection ledgers, and identity checks.
- Hueco Tanks and The Gunks destination records and route catalogs.
- Release configuration updated from 40 to 64 Picks without changing the original 40.
- Twenty-four bilingual Route Experience overlays use the shared `RouteRecord -> RouteDetailViewModel -> RouteDetailView` path.
- OpenBeta and canonical adapters now remove equivalent-grade values stored under the wrong grade-system field.
- Grade validator contains regression coverage for mismatched and valid multi-system equivalent grades.
- Public source-backed routes now display `Source-backed / 来自开放数据来源` through the shared ViewModel.
- RC3.2 HTTP validator now distinguishes same-ID source refreshes from real redirect aliases.

## Validation evidence

The following checks passed after the latest code changes:

- `npm.cmd run grades:validate`
- `npm.cmd run routes:validate-schema`
- `npm.cmd run routes:validate`
- `npm.cmd run routes:validate-public`
- `npm.cmd run routes:validate-cleanup`
- `npm.cmd run routes:validate-view-models -- --no-write`
- `npm.cmd run routes:validate-experience`
- `npm.cmd run routes:rc3-validate-preview -- --manifest src/data/routes/manifests/route-coverage-3-batch-3.json`
- `npm.cmd run formatters:validate`
- `npm.cmd run copy:validate`
- `npm.cmd run dna:validate`
- `npm.cmd run routes:dna-validate`
- `npm.cmd run scores:validate-public`
- `npm.cmd run atlas:validate`
- `npm.cmd run ui:validate`
- `npm.cmd run typecheck -- --incremental false`
- `npm.cmd run build`
- `npm.cmd run routes:rc3-validate-rc3-4 -- --manifest src/data/routes/manifests/route-coverage-3-batch-3.json --base-url http://127.0.0.1:3101 --report-name rc3-2-local-production.json`
- `npm.cmd run smoke:production -- --base-url http://127.0.0.1:3101`

Latest build generated `2,206` static pages successfully. The HTTP sample validator checked `56` Batch 3 route pages. The local deployment smoke checked `57` pages: the homepage, supporting pages, all `26` destinations, and one representative route per destination.

## Browser checks completed

- The Mandala displays only `V12- / V scale`; the incorrect YDS equivalent is gone.
- A normal Hueco Indexed Route does not display Pick experience sections.
- The Hueco route displays `Source-backed / 来自开放数据来源` and its exact OpenBeta route source.
- English/Chinese switching updates `<html lang>` correctly.
- The Gunks exposes separate YDS and V Scale radio groups.
- Selecting `5.8+` and `5.9` produces `?gradeSystem=yds&grades=5.8%2B%2C5.9` and survives refresh.
- Switching to V Scale clears the selected YDS grades and produces `?gradeSystem=v-scale`.
- The Mandala and The Gunks had no horizontal overflow at `390 x 844`.
- The temporary browser console connection errors were caused by the local test server reaching its configured timeout, not by application code.

## Original remaining work (completed after handoff)

1. Deploy a Vercel Preview for Batch 3 and repeat the protected Preview smoke checks.
2. Run a fresh production Supabase My Atlas reference audit with `--require-remote`; the current local gate uses the prior deidentified production snapshot.
3. Complete the final Route Coverage 3.2 Batch Report, including build timing, final ledgers, Preview evidence, production baseline, and rollback commit.
4. Inspect the complete diff, run `git diff --check`, verify no secrets or temporary files are staged, and rerun any validation affected by final documentation changes.
5. Create the rollback commit, push to GitHub, deploy the existing Vercel `climbatlas` project, and run production smoke tests.

## Important cautions

- Do not regenerate or replace the locked OpenBeta `v2026-08-02` source identity.
- Do not alter the 64-Pick release configuration or add new routes during release validation.
- Do not use destination images as exact route media.
- Do not commit `.env.local`, Supabase keys, `.next`, `node_modules`, or Playwright temporary files.
- A production release is blocked until the fresh Supabase audit and hosted Preview checks pass.

## Known non-blocking limitation

- Destination DNA validation currently covers `24` of `26` destinations. `new-river-gorge-usa` and `indian-creek-usa` use the safe anonymous DNA CTA because no reviewed destination profile exists. Do not invent profiles to remove this fallback; address them in a separate evidence-backed content pass.
