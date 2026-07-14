# RC-3 OpenBeta import proof of concept

## Scope

- Source: OpenBeta GraphQL API (`https://api.openbeta.io`)
- Destinations: Yosemite Valley, Red River Gorge, and Smith Rock
- Cap: 75 source records per destination, 225 raw records total
- Output: 219 review-snapshot routes after validation and duplicate quarantine

This POC proves the adapter, normalization, attribution, validation, duplicate
review, and idempotent merge flow. It does not publish imported routes in the
legacy route-card UI.

## Permission and attribution

Checked on 2026-07-14:

- The official API repository documents the production GraphQL endpoint:
  https://github.com/OpenBeta/openbeta-graphql
- The official exporter states that OpenBeta data is CC0:
  https://github.com/OpenBeta/parquet-exporter
- Attribution retained in every record: `OpenBeta contributors`
- License retained in every record: `CC0-1.0`

OpenBeta does not publish a numeric API rate limit in the documentation checked
for this POC. The adapter therefore runs sequentially, waits between pages,
limits each request, caps the number of pages, and uses a descriptive user agent.

## Imported fields

- Route UUID and exact OpenBeta route URL
- Name
- Available grade strings and systems
- Climbing type flags
- Length when the source provides a positive value
- Area, sector, and location hierarchy

The importer intentionally does not request or store descriptions, beta,
approach, descent, protection details, comments, ratings, first-ascent text,
photos, media, or ticks.

## Files and commands

- Raw minimal snapshots: `src/data/routes/raw/openbeta-poc/`
- Normalized review snapshot: `src/data/routes/imports/openbeta-poc.json`
- Local report: `outputs/openbeta-poc-import-report.json` (gitignored)

Refresh from the official API:

```powershell
npm.cmd run routes:import-openbeta-poc -- --refresh
```

Repeat from committed raw snapshots without network access:

```powershell
npm.cmd run routes:import-openbeta-poc
```

An unchanged second run must report zero imported and zero updated records.

## Review boundary

`publicationStatus` remains `review-snapshot`. Duplicate candidates are excluded
from the normalized snapshot and listed in the local report for human review.
Missing values remain missing; the importer never invents route facts.
