---
name: climbatlas-copy-review
description: Audit ClimbAtlas English and Chinese copy for factual responsibility, decision value, brand voice, localization parity, readability, and public-facing terminology. Use for copy reviews, pre-launch audits, page or component reviews, bilingual consistency checks, AI-phrasing checks, encoding checks, and source-versus-editorial boundary checks. Default to audit-only and do not rewrite or edit the full site unless explicitly instructed.
---

# ClimbAtlas Copy Review

Audit the requested scope and return actionable findings without silently changing production copy.

## Default behavior

- Work in audit-only mode unless the user explicitly asks for edits.
- Do not turn one page review into a site-wide rewrite.
- A suggested revision belongs in each finding, but it is a proposal rather than an automatic file change.
- Report encoding corruption as a blocking defect. Do not infer the intended text from damaged bytes unless a trusted duplicate exists.

## Workflow

1. Confirm the review scope from the request. Infer the smallest useful scope when it is obvious.
2. Read `../../../docs/content/brand-voice.md`, `../../../docs/content/content-patterns.md`, and `../../../docs/content/banned-patterns.md`.
3. Inspect the displayed copy together with nearby fields, source status, language pair, and UI context.
4. Distinguish style problems from factual-risk problems. Do not “improve” unsupported claims through smoother wording.
5. Compare English and Chinese for meaning, certainty, tone, terminology, omissions, and encoding integrity.
6. Consolidate repeated issues when one systemic finding is more useful than dozens of identical rows.
7. Return findings in the required structure. State clearly when no issues are found and identify any unreviewed surface.

## Issue categories

- unsupported factual claim
- excessive metaphor
- generic AI phrasing
- unclear user value
- repeated sentence structure
- internal terminology exposed
- ambiguous percentage or label
- English/Chinese mismatch
- overly long UI copy
- inconsistent terminology
- overly promotional language

Use the closest category. Mention encoding corruption explicitly in the explanation and classify it as `English/Chinese mismatch` or `inconsistent terminology` according to context.

## Report format

For every finding, provide:

- **Location:** file, component, page, field, or visible label.
- **Current copy:** quote the smallest useful excerpt.
- **Issue category:** one category from the list above.
- **Why it is a problem:** connect the issue to trust, comprehension, decision value, or localization.
- **Suggested revision:** provide a scoped revision or restoration instruction.
- **Confidence:** high, medium, or low.
- **Requires factual verification:** yes or no.

Lead with the highest-risk findings: unsupported claims and broken text before tone polish. End with a short pattern summary and the reviewed scope.

## Review boundaries

- Treat listed banned patterns as review triggers, not automatic failures.
- Do not claim a factual error merely because a source is not visible in the UI; check the data when available.
- Do not recommend adding atmosphere where the real problem is missing evidence.
- Do not expose raw internal statuses in the proposed public copy.
- Do not run a site-wide audit until the user explicitly approves that scope.
