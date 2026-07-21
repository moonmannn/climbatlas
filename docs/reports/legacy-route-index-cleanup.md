# Legacy Route Index Cleanup

Generated: 2026-07-21T10:53:56.678Z

The reviewed public baseline changed from **1107** to **1074** routes. All 33 removals are listed in the JSON migration ledger. Published Picks remain at **40**.

## Validation

- Duplicate candidates: 0
- Invalid public grades: 0
- Unknown-purpose sources: 0
- Invalid aliases: 0
- Unresolved reviewed area/route identities: 0
- Recorded source conflicts: 3

## Destination Counts

| Destination | Before | Removed | After | Delta |
| --- | ---: | ---: | ---: | ---: |
| Yosemite | 128 | 1 | 127 | -1 |
| Red River Gorge | 140 | 0 | 140 | 0 |
| Joshua Tree | 42 | 0 | 42 | 0 |
| Smith Rock | 109 | 0 | 109 | 0 |
| Squamish | 64 | 0 | 64 | 0 |
| El Potrero Chico | 40 | 0 | 40 | 0 |
| Fontainebleau | 56 | 0 | 56 | 0 |
| Chamonix | 40 | 0 | 40 | 0 |
| Ceuse | 40 | 0 | 40 | 0 |
| Kalymnos | 48 | 0 | 48 | 0 |
| Dolomites | 40 | 0 | 40 | 0 |
| Frankenjura | 40 | 0 | 40 | 0 |
| Siurana | 40 | 0 | 40 | 0 |
| Margalef | 40 | 0 | 40 | 0 |
| Yangshuo | 40 | 0 | 40 | 0 |
| Liming | 40 | 9 | 31 | -9 |
| Long Dong | 40 | 0 | 40 | 0 |
| Railay / Tonsai | 40 | 2 | 38 | -2 |
| Grampians | 40 | 21 | 19 | -21 |
| Rocklands | 40 | 0 | 40 | 0 |

## Removal Ledger

Every reduction from the previous public baseline appears below. Area indexes remain in the catalog but no longer render as routes. Aliases and hidden records no longer count as public routes.

| Route key | Action | Canonical route | Reason |
| --- | --- | --- | --- |
| `yosemite-usa:steck-salathe-yosemite` | alias | steck-salathe-route-sentinel-rock | Duplicate metadata record; the richer route record is canonical. |
| `railay-tonsai-thailand:wee-s-present-wall-route-line-railay-tonsai` | area-index | - | This is a cliff containing multiple routes, not one route. |
| `railay-tonsai-thailand:wee-present-wall-line-railay` | alias | wee-s-present-wall-route-line-railay-tonsai | Duplicate wall-level placeholder; resolve to the canonical area index. |
| `liming-china:the-guardian-liming` | area-index | - | This is a cliff containing multiple routes, not one route. |
| `liming-china:guardian-wall-route-line-liming` | alias | the-guardian-liming | Generic wall-line placeholder duplicates The Guardian area index. |
| `liming-china:dinner-wall-route-line-liming` | area-index | - | This is a crag containing multiple routes, not one route. |
| `liming-china:pine-crest-route-line-liming` | area-index | - | This is a crag containing multiple routes, not one route. |
| `liming-china:great-arch-route-line-liming` | hidden | - | The available Great Arch record belongs to Getu, not Liming. |
| `liming-china:kung-fu-fighter-liming` | hidden | - | No reliable single-route or clearly related guidebook record was found. |
| `liming-china:pillar-of-dreams-liming` | hidden | - | No reliable single-route or clearly related guidebook record was found. |
| `liming-china:climb-like-a-girl-liming` | hidden | - | No reliable single-route or clearly related guidebook record was found. |
| `liming-china:lightning-crack-liming` | hidden | - | No reliable single-route or clearly related guidebook record was found. |
| `grampians-australia:bundaleer-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:rosea-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:summerday-valley-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:gallery-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:kindergarten-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:citadel-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:fortress-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:red-rocks-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:victoria-range-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:andersens-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:stapylton-bouldering-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:northern-grampians-sport-line` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:sandstone-pocket-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:orange-wall-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:cave-traverse-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:sandbag-classic-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:halls-gap-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:hollow-mountain-warmup-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:taipan-project-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:watchtower-route-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:southern-sandstone-line-grampians` | hidden | - | Generic route-line placeholder without a verifiable single-route or exact area identity. |

## Area Indexes

| Former route key | Area name | Reason |
| --- | --- | --- |
| `railay-tonsai-thailand:wee-s-present-wall-route-line-railay-tonsai` | Wee's Present Wall | This is a cliff containing multiple routes, not one route. |
| `liming-china:the-guardian-liming` | The Guardian | This is a cliff containing multiple routes, not one route. |
| `liming-china:dinner-wall-route-line-liming` | Dinner Wall | This is a crag containing multiple routes, not one route. |
| `liming-china:pine-crest-route-line-liming` | Pinecrest Buttress | This is a crag containing multiple routes, not one route. |

## Aliases

| Former route key | Canonical route ID | Reason |
| --- | --- | --- |
| `yosemite-usa:steck-salathe-yosemite` | `steck-salathe-route-sentinel-rock` | Duplicate metadata record; the richer route record is canonical. |
| `railay-tonsai-thailand:wee-present-wall-line-railay` | `wee-s-present-wall-route-line-railay-tonsai` | Duplicate wall-level placeholder; resolve to the canonical area index. |
| `liming-china:guardian-wall-route-line-liming` | `the-guardian-liming` | Generic wall-line placeholder duplicates The Guardian area index. |

## Hidden Records

| Former route key | Reason |
| --- | --- |
| `liming-china:great-arch-route-line-liming` | The available Great Arch record belongs to Getu, not Liming. |
| `liming-china:kung-fu-fighter-liming` | No reliable single-route or clearly related guidebook record was found. |
| `liming-china:pillar-of-dreams-liming` | No reliable single-route or clearly related guidebook record was found. |
| `liming-china:climb-like-a-girl-liming` | No reliable single-route or clearly related guidebook record was found. |
| `liming-china:lightning-crack-liming` | No reliable single-route or clearly related guidebook record was found. |
| `grampians-australia:bundaleer-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:rosea-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:summerday-valley-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:gallery-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:kindergarten-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:citadel-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:fortress-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:red-rocks-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:victoria-range-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:andersens-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:stapylton-bouldering-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:northern-grampians-sport-line` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:sandstone-pocket-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:orange-wall-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:cave-traverse-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:sandbag-classic-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:halls-gap-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:hollow-mountain-warmup-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:taipan-project-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:watchtower-route-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |
| `grampians-australia:southern-sandstone-line-grampians` | Generic route-line placeholder without a verifiable single-route or exact area identity. |

## Fact Corrections

| Route key | Structured patch | Reason |
| --- | --- | --- |
| `squamish-canada:grand-wall-squamish` | grade=5.11a; length=9 pitches, about 300 m; sector=The Chief | Replace descriptive pseudo-grade and length with route-specific metadata. |
| `squamish-canada:banana-peel-squamish` | grade=5.7; length=8 pitches, about 250 m; sector=South Apron | Replace descriptive pseudo-grade and length with route-specific metadata. |
| `squamish-canada:split-pillar-squamish` | grade=5.10b; length=about 45 m; sector=The Grand Wall | Retain the named Grand Wall feature with source-backed grade and length. |
| `chamonix-france:midi-plan-traverse-chamonix` | grade=AD; length=about 200 m; sector=Aiguille du Midi | Replace descriptive pseudo-grade with a sourced IFAS grade. |
| `chamonix-france:gouter-route-mont-blanc` | grade=PD; length=(cleared); sector=Mont Blanc | Replace descriptive pseudo-grade with a sourced IFAS grade. |
| `chamonix-france:grands-mulets-route-mont-blanc` | grade=PD+; length=(cleared); sector=Mont Blanc | Replace descriptive pseudo-grade with the IFAS grade in the official Mont Blanc overview. |
| `chamonix-france:aiguilles-grises-route-mont-blanc` | grade=PD+; length=(cleared); sector=Mont Blanc | Replace descriptive pseudo-grade with the IFAS grade in the official Mont Blanc overview. |
| `chamonix-france:miage-bionnassay-mont-blanc-crossing` | grade=AD; length=(cleared); sector=Mont Blanc | Replace descriptive pseudo-grade with the IFAS grade in the official Mont Blanc overview. |
| `chamonix-france:mallory-porter-aiguille-du-midi` | grade=AD+; length=(cleared); sector=Aiguille du Midi | Replace descriptive pseudo-grade with a route-specific IFAS grade. |
| `chamonix-france:peuterey-integral-chamonix` | grade=ED1; length=(cleared); sector=Mont Blanc | Replace descriptive pseudo-grade with a route-specific IFAS grade. |
| `rocklands-south-africa:rubiks-cube-rocklands` | grade=6a+; type=sport; length=(cleared); sector=Cattle Rustler Sector | Verified as a sport route, not a boulder or sector. |
| `rocklands-south-africa:orange-plasma-rocklands` | grade=6b+; type=sport; length=(cleared); sector=Orange Plasma Wall | Verified as a sport route, not a boulder or sector. |
| `rocklands-south-africa:ceder-rouge-rocklands` | name=Cedar Rouge; grade=24 (SA) / 7a; type=sport; length=about 16 m; sector=Cedar Rouge Boulder | Verified as Cedar Rouge; retain the legacy ID for saved-route compatibility. |
| `rocklands-south-africa:cattle-rustler-rocklands` | grade=6b; type=sport; length=(cleared); sector=Cattle Rustler Sector | Verified as a named sport route inside Cattle Rustler Sector. |
| `liming-china:air-china-liming` | grade=5.13c/d; type=trad; length=about 25 m; sector=Pillars Area | Replace the generic concept source with an exact route record. |
| `liming-china:japanese-cowboy-liming` | grade=5.12c; type=trad; length=about 30 m; sector=Dinner Wall | Replace the generic concept source with an exact route record. |
| `liming-china:faraway-corner-liming` | grade=5.10+; type=trad; length=about 15 m; sector=Pillars Area | Replace the generic concept source with its exact sector route listing. |

## Source Changes

| Route key | Change | Source | Purpose | URL |
| --- | --- | --- | --- | --- |
| `yosemite-usa:steck-salathe-route-sentinel-rock` | append | Mountain Project: Steck-Salathe | route-reference | https://www.mountainproject.com/route/105862873/steck-salathe |
| `railay-tonsai-thailand:wee-s-present-wall-route-line-railay-tonsai` | replace | theCrag: Wee's Present Wall | destination-context | https://www.thecrag.com/en/climbing/thailand/krabi/area/15687769 |
| `squamish-canada:grand-wall-squamish` | replace | theCrag: The Grand Wall | route-reference | https://www.thecrag.com/en/climbing/canada/squamish/the-chief/route/14804989 |
| `squamish-canada:banana-peel-squamish` | replace | theCrag: Banana Peel | route-reference | https://www.thecrag.com/en/climbing/canada/squamish/the-chief/route/17558419 |
| `squamish-canada:split-pillar-squamish` | replace | theCrag: Grand Wall route listing | route-reference | https://www.thecrag.com/en/climbing/canada/squamish/the-chief/area/12719137 |
| `chamonix-france:midi-plan-traverse-chamonix` | replace | theCrag: Aiguille du Midi route listing | route-reference | https://www.thecrag.com/en/climbing/france/aiguille-du-midi |
| `chamonix-france:gouter-route-mont-blanc` | replace | theCrag: Goûter Route | route-reference | https://www.thecrag.com/fr/grimper/france/mont-blanc/route/15874969 |
| `chamonix-france:grands-mulets-route-mont-blanc` | replace | A concern for climbers: Mont Blanc routes | route-reference | https://guides-montagne.org/sites/default/files/mtblanc-en.pdf |
| `chamonix-france:aiguilles-grises-route-mont-blanc` | replace | A concern for climbers: Mont Blanc routes | route-reference | https://guides-montagne.org/sites/default/files/mtblanc-en.pdf |
| `chamonix-france:miage-bionnassay-mont-blanc-crossing` | replace | A concern for climbers: Mont Blanc routes | route-reference | https://guides-montagne.org/sites/default/files/mtblanc-en.pdf |
| `chamonix-france:mallory-porter-aiguille-du-midi` | replace | UKHillwalking: Mallory-Porter | route-reference | https://www.ukhillwalking.com/logbook/crags/aiguille_du_midi-1985/mallory-porter-123660 |
| `chamonix-france:peuterey-integral-chamonix` | replace | UKClimbing: Peutérey Integral | route-reference | https://www.ukclimbing.com/logbook/crags/mont_blanc-2000/peuterey_integral-54230 |
| `rocklands-south-africa:rubiks-cube-rocklands` | replace | 8a.nu: Rocklands sport route list | route-reference | https://www.8a.nu/areas/south-africa/rocklands/sportclimbing |
| `rocklands-south-africa:orange-plasma-rocklands` | replace | 8a.nu: Rocklands sport route list | route-reference | https://www.8a.nu/areas/south-africa/rocklands/sportclimbing |
| `rocklands-south-africa:ceder-rouge-rocklands` | replace | theCrag: Cedar Rouge | route-reference | https://www.thecrag.com/en/climbing/south-africa/rocklands/route/18551977 |
| `rocklands-south-africa:cattle-rustler-rocklands` | replace | 8a.nu: Rocklands sport route list | route-reference | https://www.8a.nu/areas/south-africa/rocklands/sportclimbing |
| `liming-china:air-china-liming` | replace | theCrag: Air China | route-reference | https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/route/1511897676 |
| `liming-china:japanese-cowboy-liming` | replace | theCrag: Japanese Cowboy | route-reference | https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/route/1512150342 |
| `liming-china:faraway-corner-liming` | replace | theCrag: Pillars Area route listing | route-reference | https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/area/790080789 |
| `liming-china:the-guardian-liming` | replace | theCrag: The Guardian cliff | destination-context | https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/area/7204681818 |
| `liming-china:dinner-wall-route-line-liming` | replace | theCrag: Dinner Wall | destination-context | https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/area/831401538 |
| `liming-china:pine-crest-route-line-liming` | replace | theCrag: Pinecrest Buttress | destination-context | https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/area/831401478 |
| `squamish-canada:dreamcatcher-squamish` | purpose override | Existing source | history | https://en.wikipedia.org/wiki/Sean_McColl |
| `margalef-spain:mejorando-imagen-margalef` | purpose override | Existing source | history | https://en.wikipedia.org/wiki/Ram%C3%B3n_Juli%C3%A1n |

## Recorded Fact Conflicts

Conflicts are resolved by documented source priority and remain visible here rather than being silently overwritten.

| Route key | Field | Selected value | Source candidates | Rationale |
| --- | --- | --- | --- | --- |
| `yosemite-usa:steck-salathe-route-sentinel-rock` | grade | V 5.10a/b | V 5.10a/b (Wikipedia: Steck-Salathé Route); 5.10- (Mountain Project: Steck-Salathe) | Preserve the richer canonical record and report the disagreement instead of overwriting it. |
| `chamonix-france:grands-mulets-route-mont-blanc` | grade | PD+ | PD+ (Official Mont Blanc route overview); F (theCrag: Mont Blanc area listing) | Prefer the official route overview and retain the disagreement in the migration report. |
| `liming-china:faraway-corner-liming` | grade | 5.10+ | 5.10+ (theCrag: Pillars Area route listing); 5.11a (Mountain Project: Liming area listing) | Prefer the exact sector listing and report the area-listing disagreement. |

The machine-readable companion remains available locally at `outputs/route-index-cleanup.json`.
