# Destination photographs

Reviewed on 2026-10-29. The gallery contains **146 photographs for 26 destinations**: 24 destinations have at least five photographs; Liming has one and Rocklands has three.

| Destination | Photos |
| --- | ---: |
| Yosemite | 6 |
| Red River Gorge | 6 |
| Joshua Tree | 6 |
| Smith Rock | 6 |
| Squamish | 6 |
| El Potrero Chico | 6 |
| Hueco Tanks | 6 |
| The Gunks | 6 |
| Bishop Area | 6 |
| Red Rock Canyon | 6 |
| New River Gorge | 6 |
| Indian Creek | 6 |
| Fontainebleau | 5 |
| Chamonix | 5 |
| Ceuse | 6 |
| Kalymnos | 6 |
| Frankenjura | 6 |
| Siurana | 6 |
| Dolomites | 6 |
| Margalef | 6 |
| Yangshuo | 6 |
| Liming | 1 |
| Long Dong | 6 |
| Railay / Tonsai | 6 |
| Grampians | 6 |
| Rocklands | 3 |

## Sources and rights

All selected photographs come from individually reviewed Wikimedia Commons file pages. Permitted selections are CC BY, CC BY-SA, CC0 or declared public domain. Where a file offers several licenses, the selected license is recorded explicitly. No NC, ND or GFDL-only photographs were imported.

`destination-photo-provenance.json` records each original file page, original image URL, photographer, selected license and its link, location evidence, review date and the original Commons metadata. It also records the local file checksum and dimensions. The public data in `src/data/destination-photos.json` supplies bilingual descriptions and the same source and credit information to the website.

The local WebP files remain available under each photograph's recorded license or public-domain status. Resizing and conversion do not confer ownership on ClimbAtlas. The visible credits preserve the original work title, author, source link and selected license link, with a notice about resizing and conversion. CC BY-SA photographs and any adaptations of them retain the corresponding share-alike license; this does not change the license of unrelated website code.

The files are resized without changing the scene or burning in route annotations. Gallery thumbnails may crop the display area; the enlarged viewer shows the complete image. Photographs were visually checked in contact sheets. Near-duplicates, a close facial portrait and two poor-quality selections were removed or replaced.

These are destination photographs. A route name in an original file title is retained for attribution and does not attach the photograph to a ClimbAtlas route record. Historical scenes, ice climbing, via ferrata and training scenes retain their factual captions; photographs do not establish current access or conditions.

## Deliberate gaps

- **Liming:** one image of Lovers' Pillar, captioned as a Laojun Mountain landmark. The Commons title and Yunnan Laojun Mountain classification are cross-checked against the Liming Village landmarks in the source listed in the provenance record. There are no precise coordinates, so it is used as regional context. Broader Laojun Mountain photographs without sufficient evidence of a connection to Liming were excluded.
- **Rocklands:** three photographs with supporting Rocklands / South Africa titles, descriptions or classifications. Broad Cederberg scenery and unrelated places with the same name were not used to reach a target count.
- **Fontainebleau and Chamonix:** five photographs each after removing a close facial portrait and a near-duplicate respectively.
- **Margalef:** two rock/climbing scenes and four village/landscape scenes. Village views are captioned as village views.
- **Yangshuo:** the 1988 rice-field photograph has its year in both captions; it is not a representation of current development.

## Validation and regeneration

Run `npm run photos:validate` to check published gallery coverage, local image decoding, dimensions, checksums, bilingual fields and agreement with the provenance record.

To regenerate the public manifest or recover missing image files from the archived selections:

```powershell
node scripts/import-destination-photos.mjs docs/media/destination-photo-provenance.json
npm run photos:validate
```

Downloads use the official Commons original or thumbnail image URLs and may be rate limited. Existing optimized files are reused. The public gallery uses local files and does not depend on Commons availability at page-view time.

## Verification performed

- `photos:validate`, `typecheck`, `ui:validate`, `copy:validate` and the production build passed.
- All 26 destination pages and all 146 image URLs returned successfully from the production server.
- At 1440px and 390px viewport widths, the gallery loaded without broken images or horizontal overflow. Chinese captions and controls were checked.
- Opening a photograph, left/right navigation including wraparound, Escape dismissal and return of keyboard focus to the original thumbnail were checked in the browser. The one-photo Liming gallery was checked separately.
- No browser console errors were observed. QA screenshots are retained in `output/playwright/` (not committed).
