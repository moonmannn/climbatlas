# ClimbAtlas content import policy

ClimbAtlas helps climbers decide what route might fit their day. It is not a guidebook, topo, beta database, review site, or route-description archive.

## Allowed

- Route metadata: route name, grade, climbing type, broad length, destination, and broad sector or formation context.
- Source links: official pages, open encyclopedias, climbing media, route database pages, guidebook publisher pages, and local access organizations.
- Original ClimbAtlas writing: route style, decision hints, practice focus, and non-beta editorial tips.
- Open-license or explicitly permitted images, with visible credit, license, and source link.
- External links to route databases, guidebooks, videos, or local resources, as long as ClimbAtlas does not copy their content.

## Not allowed

- No copied route descriptions, beta, topo, approach, descent, pitch-by-pitch notes, protection details, or movement sequences.
- No copied user comments, ratings, tick notes, conditions reports, or forum posts.
- No scraped photos from Mountain Project, 27Crags, theCrag, OpenBeta, guidebooks, blogs, or social media.
- No fabricated user reviews, fake ratings, fake ascents, or fake community tips.
- No automated scraping. V2 content is manually selected and manually entered.

## Source trust levels

- `high`: official land manager, access organization, publisher, or primary institutional source.
- `medium`: open encyclopedia, climbing media, or route database metadata used only for facts like name, grade, type, and location.
- `low`: community/blog/source that is useful for discovery but not enough on its own.

Each published route should have at least two sources. If a route is useful but the evidence is weaker, mark the source notes honestly and keep the card conservative.

## Route card checklist

- The route name and grade are checked against at least two sources or clearly marked as needing stronger verification.
- ClimbAtlas summary, style, practice focus, decision hint, and editorial tips are original.
- External links point users away for detailed beta instead of copying it into ClimbAtlas.
- Images are empty or properly licensed with credit, license, and source URL.
- Community sections stay `coming-soon` until real accounts, submissions, and moderation exist.

## Metadata route import workflow

Use `src/data/route-metadata.csv` for large route-index expansion. Metadata rows are not full ClimbAtlas route highlights. They exist to help users discover lines and then leave ClimbAtlas for current route details.

Required CSV fields:

- `destinationSlug`
- `routeId`
- `name`
- `grade`
- `type`
- `length`
- `sector`
- `sourceLabel`
- `sourceUrl`
- `externalTitle`
- `externalUrl`
- `externalType`
- `trustLevel`
- `notes`

Run:

```bash
node scripts/route-metadata.mjs
```

The script validates the CSV and generates `src/data/generatedRouteMetadata.ts`.

## Metadata row rules

- Keep route facts short: name, grade, type, broad length, broad sector.
- Add at least one external source link; target two independent sources before treating the row as strong.
- Use route-database links as outbound references only.
- Do not paste route descriptions, approach notes, descent notes, protection notes, topo text, comments, ratings, or photo credits from route databases.
- If a row needs stronger confirmation, say that plainly in `notes`.
