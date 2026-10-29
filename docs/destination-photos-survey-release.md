# Destination photos and survey access — 2026-10-29

## Changes

- Added 146 reviewed destination photographs across all 26 destinations. Twenty-four destinations have five or six photographs; Liming has one and Rocklands has three. Per-image attribution, license links, bilingual captions and original source metadata are preserved. See `media/destination-photos.md` and `media/destination-photo-provenance.json`.
- Removed the four-photo display limit. Destination galleries provide a full-image viewer with keyboard navigation, Escape dismissal and focus restoration.
- Moved the homepage survey invitation directly below the header, with an immediately visible link to `/feedback` in English and Chinese. Added a highlighted survey entry to the desktop navigation and the mobile navigation menu. The footer link remains available.
- Allowed destination-card headings and facts to wrap at tablet widths, avoiding a horizontal overflow found during responsive checks.

## Validation

- Photograph validation: 146 unique local WebP files, matching dimensions/checksums and archived source/license information; 64.4 MiB total.
- Full production gate: all 20 checks passed, including 44 survey cases, TypeScript, the production build and HTTP smoke checks for 57 pages.
- External link audit: 1,540 reachable, 29 blocked by security checks, zero broken, invalid or unknown. All 29 blocked URLs were additionally opened in an independent real browser: each displayed a security challenge or blocking page, with no explicit 404/410. Their underlying content could not be verified. None of these pre-existing external links was changed by this release.
- Browser checks: survey invitation visible before scrolling in both languages at 320, 390, 768, 1,024 and 1,440 CSS pixels; survey button is at least 44px high. The mobile invitation opens the existing survey page. No survey response was submitted during validation.

## Release target

The existing `main` branch deploys automatically to Vercel Production at https://climbatlas.vercel.app/. This release uses that existing pipeline and existing environment configuration.
