# Route Rendering Consistency RC-7

Date: 2026-07-19

## Scope

RC-7 is a focused public-copy cleanup after the rendering migration. It does not rewrite all 20 destination introductions and does not change route facts, grades, sources, media, or outbound URLs.

## Changes

- Replaced the public workflow label `Source-backed` with `Sources available` / `有来源可查`.
- Replaced raw destination resource enums such as `history/article` with localized reader-facing labels.
- Renamed the destination suitability heading from the misleading `Approach` to `Experience fit` / `经验参考`.
- Localized route-media source links as `Image source` / `图片来源`.
- Revised the previously flagged Yosemite introduction so it starts with climbing character before explaining the comparison tools.
- Removed the previously flagged personification from the Red River Gorge history note and Fontainebleau atmosphere note.

## Safety Boundaries

- No new route claims, beta, access guidance, safety advice, protection details, ratings, or user opinions were added.
- Unknown route facts remain unavailable rather than inferred.
- Destination context images remain explicitly separate from exact route images.
- Internal values such as `needs-upgrade` and `source-backed` remain in the domain model where required, but are formatted before public display.

## Automated Guardrails

- Public UI validation rejects raw destination resource enums.
- Public UI validation rejects the old `Approach / 适合程度` suitability label.
- Public UI validation requires localized media-source links.
- Public copy validation rejects the retired public label `Source-backed`.

## Deferred Editorial Pass

Several destination introductions still explain the catalog before describing the climbing destination. A comprehensive bilingual rewrite remains a separate editorial pass so content changes are not confused with the rendering migration. Route-level expressive copy also remains subject to a later evidence and tone audit.

## Verification

- Public copy validation: passed.
- Production UI validation: passed.
- TypeScript validation: passed.
- Route ViewModel parity: 1,107 of 1,107 public routes built; 0 build failures.
- Destination route counts: conserved for all 20 destinations.
