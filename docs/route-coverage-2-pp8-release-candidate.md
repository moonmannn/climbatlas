# Route Coverage 2.0 - PP-8 Release Candidate

Date: 2026-07-17

## Release decision

**The Route Coverage 2.0 release candidate is ready to commit and deploy.**

The catalog, public-data boundary, copy checks, TypeScript, production build, and HTTP smoke suite pass. The final live-link audit contains no broken, unknown, or invalid public URLs. Links that reject automated requests were reviewed in a normal browser before this decision.

The private account UI is release-ready for Beta use, but the complete magic-link workflow still needs one user-completed email test. This limitation does not block public route browsing.

## PP-8 changes

Manual browser review found three stale or incorrect resource links:

1. The former UKClimbing Kalymnos URL redirected to Dovestones Edge. It was replaced with the Kalymnos guidebook team's resource page.
2. The former theCrag Long Dong URL returned 404. It was replaced with the valid `longdong` area URL.
3. The former theCrag Railay URL returned 404. It was replaced with the valid Railay area URL under Krabi.

The replacement pages were reopened in a normal browser and their page titles and headings matched Kalymnos, Long Dong, and Railay respectively.

## Final validation

Passed:

- Route schema validation
- Route catalog validation
- Public route parity validation
- Read-only route audit
- Grade parser validation
- Public-copy and UTF-8 validation
- Climbing DNA data validation
- Route DNA validation
- Public score-label validation
- TypeScript typecheck
- Next.js production build
  - 1,142 static pages generated
- Production HTTP smoke
  - 45 pages checked
  - 20 destination pages
  - 20 representative route pages

Catalog snapshot:

- Catalog entries: 1,171
- Public routes: 1,107
- Imported public routes: 219
- Area indexes excluded from public route counts: 64
- Validation errors: 0
- Non-blocking editorial review warnings: 1,552

The warnings primarily identify legacy Pick candidates that have not been editorially reviewed. They remain hidden from public Pick labels.

## Final live-link audit

Result: **passed with provider blocking disclosed**

- Unique public URLs: 256
- Reachable by the automated checker: 246
- Provider-blocked: 10
- Unknown: 0
- Broken (404/410): 0
- Invalid URL syntax: 0

The 10 blocked URLs belong to hosts that reject automated requests: nine theCrag URLs and one UNESCO URL. They were checked in a normal browser during PP-8. The machine-readable report is written to `output/pp7-1-route-links.json` by the existing verifier configuration.

## Supabase account gate

Verified:

- Local `.env.local` contains an HTTPS Supabase project URL.
- The Supabase host format is valid.
- The configured public key uses the current publishable-key format.
- The deployed `/my-atlas` page opens successfully.
- The sign-in control opens the email magic-link form.
- Public browsing remains available while signed out.

Still manual:

- Send a magic link to a real Beta email address.
- Complete the redirect back to ClimbAtlas.
- Save one route as `Want to climb`.
- Change it to `Climbed`.
- Create, edit, and remove one private note.
- Sign out and confirm private data is no longer visible.

No email was submitted during PP-8, so this check remains intentionally user-controlled.

## Release commands

Run sequentially from the repository root:

```powershell
npm.cmd run production:validate
npm.cmd run routes:verify-links
git diff --check
```

After reviewing the diff:

```powershell
git add --all
git commit -m "chore: finalize route coverage release candidate"
git push origin main
```

Vercel should deploy from the connected `main` branch. After deployment, check `/`, `/explore`, one destination page, one route page, `/climbing-dna`, and `/my-atlas`.

## Rollback and monitoring

- Keep the previous Vercel deployment available for instant rollback.
- Re-run the live-link audit before each content release.
- Review provider-blocked links manually when their labels, destinations, or redirect behavior change.
- Do not promote legacy Pick candidates until they pass editorial review.
- Do not describe account workflows as fully verified until the real magic-link checklist passes.
