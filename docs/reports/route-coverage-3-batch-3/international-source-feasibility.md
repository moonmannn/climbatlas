# International Source Feasibility - Batch 3
Checked: 2026-08-11

This report covers Grampians, Liming and Railay / Tonsai only. It does not authorize an import.

## Snapshot coverage

The locked OpenBeta `v2026-08-02` export does not provide enough in-scope route coverage for a defensible release:

| Destination | Snapshot observation | Batch 3 decision |
| --- | --- | --- |
| Grampians | No usable Grampians route set in the locked Australian records | Do not import |
| Liming | No usable Liming route set in the locked Chinese records | Do not import |
| Railay / Tonsai | Only a very small Railay / Phra Nang set | Do not import |

## theCrag

theCrag may remain an outbound resource, but ClimbAtlas will not build an ingestion crawler in this batch. Before any future API import, the project must have:

1. API access agreed with the provider.
2. A field-by-field licensing and publisher-rights review.
3. A written rule for descriptions, photos and topos, all of which remain excluded by default.
4. A repeatable snapshot and deletion/change policy.

References:

- [theCrag API and extension information](https://www.thecrag.com/en/article/extend)
- [theCrag terms and usage policy](https://www.thecrag.com/en/terms)

## Outcome

The three destinations remain unchanged in Batch 3. No placeholder routes, inferred facts or low-quality area-page records will be added to meet a numeric target.
