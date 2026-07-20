# Route Rendering Consistency: RC-4 through RC-6

Date: 2026-07-19

RC-4 through RC-6 move the public route and destination experience onto the
normalized contracts validated in RC-0 through RC-3. This pass does not
rewrite the 20 destination guides and does not deploy production.

## RC-4: one public route detail path

Every public route page now follows one path:

```text
source adapter -> RouteRecord -> buildRouteDetailViewModel
               -> LocalizedRouteDetailView -> RouteDetailView
```

The route page builds English and Chinese ViewModels on the server. The client
selects the current locale, but receives no legacy route shape. The public
component cannot inspect `legacy`, OpenBeta, Mountain Project, or provider
specific fields.

`RouteHighlightCard` and `RouteRecordCard` were removed only after the parity
validator confirmed that all 1,107 routes build successfully and all 20
destination counts remain unchanged. `UserRouteControls` and the separate DNA
module remain outside the factual RouteDetail ViewModel.

The unified detail view:

- omits missing grade, sector, length, pitch, editorial, and media fields;
- uses localized grade-system and climbing-type labels;
- deduplicates route sources before displaying the source count;
- separates route sources, access information, and supplemental resources;
- renders editorial content only for published Picks;
- separates exact-route media from clearly labelled context media;
- never creates an empty photo section or substitutes destination scenery for
  a missing route photo.

## RC-5: destination explorer and grade filters

Destination difficulty summaries continue to use comparable normalized route
grades, grouped by grade system. A single represented grade is described as a
single indexed value rather than an artificial `X-X` range. Mixed, proposed,
aid, and unparseable labels do not silently enter another system's range.

The Route Explorer now supports one active grade system and multiple selected
grades within that system. Grade systems use native radio controls. Individual
grades use native checkboxes with independent accessible names. YDS families
with several indexed grades also provide shortcuts such as `5.10 all`.

The active type and grade selection is stored in the URL:

```text
?gradeSystem=yds&grades=5.10a,5.10b&type=trad
```

The URL can be refreshed, shared, and restored through browser navigation.
Switching grade systems clears grades from the previous system rather than
silently comparing unlike scales.

## RC-6: stable DNA empty state

The server and first hydrated client frame now render the same anonymous CTA.
The page does not wait behind a skeleton and never shows a default match
percentage. After hydration, a complete and valid local DNA profile enhances
the module with a real preference match. Missing, incomplete, old, or corrupt
data remains on the CTA state.

Match percentages remain preference alignment only. They do not describe
ability, safety, readiness, conditions, or guaranteed enjoyment.

## Migration results

| Check | Result |
| --- | ---: |
| Public routes before migration | 1,107 |
| ViewModels built | 1,107 |
| Destinations with conserved counts | 20 / 20 |
| ViewModel construction failures | 0 |
| Missing sources | 0 |
| Invalid media | 0 |
| Unparseable or non-grade labels reported | 35 |
| Unresolved duplicate candidates | 2 |
| Static pages generated | 1,142 / 1,142 |

No route was removed. The two unresolved duplicate candidates remain the
Railay / Tonsai Wee's Present Wall pair and the Yosemite Steck-Salathe pair.
They were not merged because their source facts conflict. The machine-readable
report is `docs/reports/route-rendering-consistency-rc6.json`.

## Browser verification

- Bishop's Terrace (legacy editorial source) and A Pizza View (OpenBeta source)
  render the same facts/source/access structure.
- The old `V3 starts with personal want-to-climb...` copy is absent.
- YDS `5.10a` and `5.10b` can be selected together with `Trad`; Yosemite
  returned five matching routes and wrote all three filters to the URL.
- Refresh restored the selected grades, climbing type, and result count.
- English and Chinese language switching hydrates normally.
- Corrupt DNA local storage produced the complete anonymous CTA and no percent.

## Deferred work

RC-7 editorial consistency and RC-8 Preview/production deployment are not part
of this pass. No production deployment was performed.
