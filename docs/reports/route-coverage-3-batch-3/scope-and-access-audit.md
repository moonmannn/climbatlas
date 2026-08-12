# Route Coverage 3.2 - Batch 3 Scope And Access Audit
Checked: 2026-08-11

## Locked source

- Provider: OpenBeta Parquet export
- Release: `v2026-08-02`
- Source rows: `231865`
- Source SHA-256: `6a655481a39727beb568e6365b159d9bbf371fbc8d83985c505ef1dec3c8e728`
- Schema SHA-256: `ce457a5fe56d4ad69f17db5a12ca83f8982d4a289a11c34d6d2a7f23561783d8`
- Source commit: `a5674424209294a69c5c86b247a78e3590927055`

The importer verifies the file checksum, schema fingerprint and row count before selecting any route. Route coordinates are not read, stored or published.

## Hueco Tanks

The accepted OpenBeta path is `USA / Texas / Hueco Tanks`. The source snapshot contains four named mountain areas used for selection auditing:

- North Mountain
- East Mountain
- East Spur
- West Mountain

This release selects bouldering records only. Selection is stratified across the four mountain areas and across at least three V Scale bands. The public destination center is manually maintained and is not calculated from route coordinates.

Access links:

- [Texas Parks & Wildlife: Hueco Tanks State Park & Historic Site](https://tpwd.texas.gov/state-parks/hueco-tanks/)
- [Texas Parks & Wildlife: activities](https://tpwd.texas.gov/state-parks/hueco-tanks/activities)

These links remain the source for current visitor and access arrangements. Temporary rules are not copied into the destination introduction.

## The Gunks

The accepted root is `USA / New York / The Gunks`, limited to these exact source areas:

- The Trapps
- Near Trapps, The
- Trapps Bouldering
- Near Trapps Bouldering
- Peterskill
- Peterskill Bouldering
- Millbrook

The following source paths are not eligible for this release:

- Sky Top
- Giants Workshop
- Lost City
- `c. Moe (closure) to Harvest Moon`
- `b. Gelsa to Moe (closure)`
- Any path carrying an explicit private, restricted or closure marker discovered during selection

The release target is 70 trad, 20 boulder and no more than 10 top-rope records. YDS and V Scale are reported separately. The public destination center is manually maintained and is not calculated from route coordinates.

Access links:

- [Mohonk Preserve: activities](https://www.mohonkpreserve.org/visit/activities/)
- [New York State Parks: Minnewaska State Park Preserve](https://parks.ny.gov/parks/minnewaska)

Current land-manager resources must be checked before a visit. Temporary closures are not embedded in long-lived destination copy.

## Bishop Area and Red Rock Canyon

The existing Batch 1 scopes are reused without widening. Sixteen required source identities pass through the same scope, adapter, exact-link, grade, deduplication and identity checks as every other imported route.

`Prince of Darkness` is the only reviewed source-type conflict in the required set. OpenBeta marks both sport and trad. Its exact Mountain Project route page classifies it as trad, so the importer records the conflict and uses trad for the normalized record.

## Privacy and client payload

- Exact route coordinates are not imported.
- Homepage and map payloads receive destination summaries only.
- Route detail facts, full sources and experience profiles remain outside the homepage and map client bundle.
