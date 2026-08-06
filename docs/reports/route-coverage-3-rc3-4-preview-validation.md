# Route Coverage 3.0 - RC3-4 Preview Validation

Generated: 2026-08-06

## Preview Deployment

- Git branch: `codex/rc3-4-preview`
- Preview commit: `5f09931`
- Vercel environment: Preview
- Deployment state: success
- Preview URL: `https://climbatlas-lytcxuvig-moonmannns-projects.vercel.app`
- Production deployment changed: no

## Catalog Gates

- Destinations: 22
- Public routes: 1,468
- RC3 Batch 1 Indexed Routes: 394
- Source merges: 41
- Published Picks: 40
- ViewModel failures: 0
- Selected source coverage: 100%
- Selected exact-route link coverage: 100%
- Unresolved selected identity conflicts: 0
- Production My Atlas reference issues: 0

## Sample Validation

The deterministic sample contains 80 imported routes: 20 each from Joshua Tree, Squamish, Bishop Area, and Red Rock Canyon. Selection is balanced across available area/crag, climbing type, grade system, and difficulty band groups.

Every sampled Preview route passed these checks after navigation settled:

- Correct route name and canonical page identity
- Exact OpenBeta route source link present
- Indexed Route remains free of Pick experience content
- No imported route media
- No `Not provided` or `Information unavailable` placeholder rows
- No horizontal overflow

Two Joshua Tree/Squamish navigations and eight Bishop navigations initially exposed an empty in-progress document while the browser was changing pages. All passed on a settled retry; no repeatable route failure was found.

## Interaction Checks

- Grade options are independent semantic controls with individual accessible names.
- YDS multi-select preserved `5.8+` and `5.9` as separate values.
- URL result: `?gradeSystem=yds&grades=5.8%2B%2C5.9`.
- Refresh restored both selected grades.
- Browser Back restored the previous multi-select state.
- Browser Forward restored the later single-select state.
- Bishop search for `Regular Route` returned one result with one unique canonical URL.
- Ten merged OpenBeta route aliases redirected to the expected canonical routes.

## Language And Responsive Checks

- English mode sets `<html lang="en">`.
- Chinese mode sets `<html lang="zh-CN">`.
- Chinese climbing type and source labels rendered without internal enum leakage.
- Desktop destination and route pages had no horizontal overflow.
- Mobile destination and route pages were checked at a requested 390 x 844 viewport; the browser reported a 375 px content viewport and no horizontal overflow.
- Mobile search remained visible and route source links remained available.
- Browser console errors during the completed Preview checks: 0.

## My Atlas

- `/my-atlas` rendered successfully in Preview.
- No Supabase configuration warning was shown.
- The page exposed the expected sign-in/private account entry and had no horizontal overflow.
- The production read-only aggregate route-reference audit remains `pass`: one route reference checked, zero orphaned or retired references.

## No-JavaScript And Deployment Protection

- Local production build: 80 raw HTML route pages passed, plus 10 alias redirects.
- The same unauthenticated HTTP audit cannot inspect the protected Vercel Preview HTML because Vercel Deployment Protection redirects requests to `vercel.com/login` and returns the login document.
- An authenticated browser session loaded and checked the actual Preview application successfully.
- Preview protection was not weakened and no bypass secret or browser cookie was inspected.

This leaves one environment-specific limitation: the exact protected Preview URL did not receive an anonymous no-JavaScript HTML audit. The compiled artifact's server HTML was validated locally, while the deployed artifact was validated through the authenticated browser.

## Build And Validation

- RC3 Preview catalog validation: pass
- RC3-4 deterministic sample validation: pass
- Route schema validation: pass
- Public route parity: pass
- Route ViewModel validation: pass
- Route Experience validation: pass
- Grade parser validation: pass
- Copy validation: pass
- UI validation: pass
- Climbing DNA validation: pass
- Private My Atlas validation: pass
- TypeScript: pass
- Production build: pass
- Static pages generated: 1,579

## RC3-4 Status

RC3-4 is **conditionally passed** for product behavior and catalog integrity. Before RC3-5 Production release, choose one of these release-gate options:

1. Run the anonymous no-JavaScript check with an approved Vercel protection bypass token.
2. Temporarily expose a dedicated Preview deployment, run the check, then restore protection.
3. Explicitly accept the local raw-HTML validation plus authenticated deployed-browser validation as equivalent evidence for this batch.

Production must remain unchanged until this final gate is accepted.
