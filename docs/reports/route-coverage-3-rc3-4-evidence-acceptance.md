# RC3-4 Evidence Acceptance

Date: 2026-08-06

## Decision

RC3-4 accepts the following combined evidence in place of temporarily weakening Vercel Deployment Protection:

1. Raw HTML and redirects from the locally built production artifact.
2. Authenticated browser verification of the protected Vercel Preview deployment.

No Vercel protection bypass token was used. Preview protection was not changed, and browser cookies were not inspected or exported.

## Evidence A - Local Production Artifact

Machine report: `docs/reports/route-coverage-3-batch-1/rc3-4-local-html-validation.json`

SHA-256: `EAF5DE4BB88D6D9730AD2EC4EE8052214041C63676FEABCF16709DA6266D098F`

- Sampled Indexed Routes: 80
- HTTP 200 route pages: 80
- Route names present in raw HTML: 80
- Exact route source links present in raw HTML: 80
- Forbidden internal or placeholder copy findings: 0
- Canonical alias redirects checked: 10
- Correct alias redirects: 10

The sample contains 20 routes each from Joshua Tree, Squamish, Bishop Area, and Red Rock Canyon.

## Evidence B - Protected Vercel Preview

Machine report: `docs/reports/route-coverage-3-batch-1/rc3-4-protected-preview-browser.json`

SHA-256: `0C6501427BD5666E848635A55EF40C92EA124563B45AFDE2B04CA467A841DF91`

- Preview branch: `codex/rc3-4-preview`
- Preview application commit: `5f09931`
- Latest report commit before this evidence package: `95c5499`
- Protected route pages checked: 80
- Protected route pages passed: 80
- Exact OpenBeta route links found: 80
- Imported route images found: 0
- Pick experience content leaked into Indexed Routes: 0
- Placeholder fact rows found: 0
- Desktop horizontal overflow findings: 0
- Grade URL, refresh, Back and Forward behavior: pass
- English and Chinese language behavior: pass
- Search deduplication: pass
- Canonical alias redirects: 10 of 10
- Browser console errors: 0

The mobile check was performed against the `5f09931` Preview application deployment. The later `95c5499` commit changes only validation scripts and reports; it does not modify application runtime files.

## Deployment Protection Boundary

An unauthenticated request to the Vercel Preview is redirected to `vercel.com/login`. That response validates deployment protection, not ClimbAtlas HTML. The local raw-HTML evidence therefore covers server-rendered content, while the authenticated Preview evidence covers the deployed runtime, navigation and responsive behavior.

This evidence model does not claim that anonymous access to the protected Preview was tested. It records that the equivalent build artifact and the protected deployed application were tested separately without reducing security.

## Gate Result

RC3-4 release evidence: **accepted**.

- Catalog and identity gates: pass
- Local raw-HTML gate: pass
- Protected Preview browser gate: pass
- Production changed: no
- Vercel protection changed: no

RC3-5 may begin as a separate Production release decision.
