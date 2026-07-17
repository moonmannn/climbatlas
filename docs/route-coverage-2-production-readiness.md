# Route Coverage 2.0 - PP-7.1 Production Readiness

Date: 2026-07-17

> Historical PP-7.1 checkpoint. The current release decision is recorded in
> `docs/route-coverage-2-pp8-release-candidate.md`.

## Release decision

**Route Coverage 2.0 is ready for deployment.** The application build, public-data boundary, responsive layout, keyboard focus, production smoke checks, and live outbound-link gate pass. No published URL returns 404/410 and no published URL is syntactically invalid.

Eleven providers reject automated checks with HTTP 403 and still require periodic browser review. The private-account workflow also requires a real Supabase magic-link test before the account feature is described as fully production-verified.

## Catalog snapshot

- Public routes: 1,107
- Area indexes excluded from route counts: 64
- Legacy editorial Pick candidates: 800
- Reviewed or published Picks: 0
- Duplicate candidates requiring manual review: 2 low-confidence pairs
  - Railay / Tonsai: two Wee's Present Wall records
  - Yosemite: two Steck-Salathe records

Unreviewed editorial candidates remain hidden from public Pick labels. The duplicate pairs were not merged automatically.

## Automated checks

Passed:

- Route schema validation
- Route catalog validation
- Public route parity validation
- Read-only route audit
- Grade parser validation
- Public-copy and UTF-8 validation
- Climbing DNA data validation
- Route DNA validation
- Public score validation
- TypeScript typecheck
- Next.js production build: 1,142 static pages generated
- Production HTTP smoke: 45 pages checked
  - Homepage, Explore, Climbing DNA, Feedback, and My Atlas
  - All 20 destination pages
  - One representative route page for each destination

The route audit reports 1,552 non-blocking warnings. Most are expected because 800 legacy editorial candidates have not been reviewed and therefore are not published as ClimbAtlas Picks.

## Live link audit

Result: **passed with provider-blocked links disclosed**

- Unique public URLs: 256
- Reachable: 245
- Provider-blocked: 11
- Unknown: 0
- Broken (404/410): 0
- Invalid URL syntax: 0

PP-7.1 remediation:

- The 219 OpenBeta records retain their external IDs, attribution, and snapshot metadata, but no longer publish unavailable exact-route CTAs.
- OpenBeta provenance now links to the stable official API project repository rather than a nonexistent public route page.
- Four Yosemite exact-route links and 17 independent destination, context, and route-database links were replaced with verified pages.
- Validation now rejects the legacy `openbeta.io/climbs/` URL pattern if it reappears in a source or public resource.
- `thecrag.com`, `ukclimbing.com`, and UNESCO account for the 11 provider-blocked checks; these are not classified as broken.

Machine-readable report:

`output/pp7-1-route-links.json` in the PP-7.1 task workspace.

## Browser matrix

Checked against the local production build with Playwright:

- Desktop: 1440 x 900
- Mobile: 390 x 844
- Homepage visual hierarchy and artwork
- Mobile navigation open state
- Yosemite mobile Route Explorer disclosure
- Route search for `The Nose`: 1 result and correct route navigation
- Representative route detail page
- Keyboard Tab focus: visible focus ring on the primary header link
- Browser console: 0 errors, 0 warnings

No visible overlap was found in the checked desktop or mobile viewports.

## Bugs fixed during PP-7

1. Destination pages passed the full destination record into a client component. Next.js serialized unreviewed legacy route content into the public RSC payload even though it was not visibly rendered. The component now receives only the localized description fields it needs.
2. The DNA quiz progress line had no assistive-technology meaning. It now exposes a bilingual `progressbar` label and current/max values.
3. The route audit can now run without writing a fixed artifact (`--no-write`) or write to a caller-selected path (`--output`).
4. The link verifier now checks the full public catalog, distinguishes provider blocking from broken links, summarizes by host, and can write a JSON report.
5. A sequential production validation command and production HTTP smoke test were added.

## Remaining manual checks

1. Periodically review the 11 provider-blocked links in a normal browser because their hosts reject automated checks.
2. Test Supabase magic-link login, profile editing, saves, and private notes with a real Beta account before calling the account workflow production-ready.

## Recommended next release step

Deploy the PP-7.1 link remediation after reviewing the changed source URLs. Keep the link audit in the release gate so future provider changes cannot silently reintroduce broken public CTAs.
