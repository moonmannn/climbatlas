# Route Rendering Consistency: RC-0 through RC-3

Date: 2026-07-19

Status: parity validation passed. Public rendering has not been switched.

## RC-0 path audit

The repository currently has two input shapes and one canonical record shape:

| Input | Current volume | Adapter | Notes |
| --- | ---: | --- | --- |
| `Destination.routes / RouteHighlight` | 952 catalog entries | `legacy-route-adapter.ts` | 888 routes plus 64 area indexes. This bucket includes hand-authored highlights, generated metadata cards, Mountain Project-linked metadata, and Pick candidates because they currently share the same legacy shape. |
| OpenBeta review snapshot | 219 routes | `openbeta-route-adapter.ts` | The checked-in JSON is already canonical. Future raw imports pass through the adapter before snapshot generation. |
| `RouteRecord` | 1,107 routes | none | The only shape accepted by the new ViewModel builder. |

The current public route page still imports both `RouteHighlightCard` and
`RouteRecordCard`, reads `route.legacy`, and selects a branch at runtime. This
branch remains unchanged for RC-0 through RC-3 and is covered by a guard test.

The destination page already uses one public route collection and one route
explorer conversion path. Its remaining inconsistency risk is presentation and
filter behavior, scheduled for RC-5.

## RC-1 adapter and RouteRecord contract

The enforced flow is:

```text
source-specific shape -> source adapter -> RouteRecord
RouteRecord -> buildRouteDetailViewModel -> RouteDetailView (RC-4)
```

The legacy adapter now preserves normalized editorial fields, exact/context
media classification, source purpose, original grade, length, sector, and the
temporary legacy bridge. The bridge exists only so the unchanged production
page can keep rendering during comparison. The ViewModel builder is statically
checked not to import or inspect it.

The OpenBeta adapter accepts records without a grade and stores an unknown,
unparsed grade. Missing grade, system, sector, length, pitches, or media does
not fail ViewModel construction. Missing ID, slug, name, destination, or a
destination mismatch does fail validation.

`RouteRecord` now has normalized media, expanded editorial fields, optional
source purpose, adapter metadata, and an internal fact-conflict structure.
Conflict resolution selects the highest-priority source and records all
candidates. It never silently overwrites competing values.

## RC-2 RouteDetailViewModel contract

`buildRouteDetailViewModel(routeRecord, { locale, destination })` accepts only
`RouteRecord`. It produces:

- identity: route/destination identity and optional area/sector;
- facts: localized display labels with optional grade, length, and pitches;
- badges: public Pick and verification labels only;
- route sources and access sources as separate, deduplicated collections;
- filtered public external resources;
- published editorial only when the Pick status is published;
- exact route media and context media in separate arrays.

URL deduplication removes `www`, trailing slashes, fragments, and tracking
parameters. Dedupe keys include purpose, so an official route source and an
official access page are not merged merely because the institution is the
same. A destination-context image can never enter `routeImages`.

## RC-3 parity results

| Check | Result |
| --- | ---: |
| Public routes before migration | 1,107 |
| ViewModels built | 1,107 |
| Legacy route records compared | 888 |
| Canonical snapshot routes compared | 219 |
| Destinations with conserved counts | 20 / 20 |
| ViewModel construction failures | 0 |
| Missing sources | 0 |
| Invalid media | 0 |
| Duplicate source entries removed | 1 |
| Duplicate external resources removed | 294 |
| Unparseable or non-grade labels reported | 35 |
| Published editorial records | 0 |
| Facts-only public records | 1,107 |

Optional-field fixtures, critical identity failures, destination mismatch,
source-purpose dedupe, source-priority conflicts, media separation, and the
builder's legacy-field boundary all passed.

## Destination count conservation

| Destination | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Yosemite | 128 | 128 | 0 |
| Red River Gorge | 140 | 140 | 0 |
| Joshua Tree | 42 | 42 | 0 |
| Smith Rock | 109 | 109 | 0 |
| Squamish | 64 | 64 | 0 |
| El Potrero Chico | 40 | 40 | 0 |
| Fontainebleau | 56 | 56 | 0 |
| Chamonix | 40 | 40 | 0 |
| Ceuse | 40 | 40 | 0 |
| Kalymnos | 48 | 48 | 0 |
| Dolomites | 40 | 40 | 0 |
| Frankenjura | 40 | 40 | 0 |
| Siurana | 40 | 40 | 0 |
| Margalef | 40 | 40 | 0 |
| Yangshuo | 40 | 40 | 0 |
| Liming | 40 | 40 | 0 |
| Long Dong | 40 | 40 | 0 |
| Railay / Tonsai | 40 | 40 | 0 |
| Grampians | 40 | 40 | 0 |
| Rocklands | 40 | 40 | 0 |

## Failures and conflicts

ViewModel failures: none.

Two low-confidence duplicate candidates remain unresolved and were not merged:

1. `railay-tonsai-thailand:wee-s-present-wall-route-line-railay-tonsai` and
   `railay-tonsai-thailand:wee-present-wall-line-railay` conflict on original
   grade and original length wording.
2. `yosemite-usa:steck-salathe-route-sentinel-rock` and
   `yosemite-usa:steck-salathe-yosemite` conflict on original grade, sector,
   and original length wording.

Both require source-level editorial review. No value was selected across these
separate records. The complete machine-readable report, including all 35
unparseable grade records, is generated at
`docs/reports/route-rendering-consistency-rc3.json`.

## Public components expected to change in RC-4 and later

RC-4 is expected to introduce the single `RouteDetailView` and update the
route page. Only after Preview parity passes will `RouteHighlightCard`,
`RouteRecordCard`, and the route page's legacy branch be removed.

RC-5 will update `RouteIndex` and the destination route explorer. RC-6 will
update `DestinationDnaMatch` hydration behavior. None of those public
components changed in RC-0 through RC-3.
