# ClimbAtlas

ClimbAtlas is a climbing destination and route-choice MVP. It helps climbers first decide where to climb, then browse route highlights or metadata-only route indexes with clear outbound links to current external resources.

The project is intentionally frontend-first: no accounts, no database, no copied guidebook text, and no copied route beta.

## What this version includes

- Interactive Leaflet / OpenStreetMap atlas on the homepage
- Region clusters and destination markers for famous climbing areas
- A right-side destination discovery panel with featured destinations and stats
- Search and filters for destinations and routes
- Destination guide pages with local history, area atmosphere, first-visit tips, and reading links
- Route indexes on destination pages, with filters for route type, status, and sector
- Independent route pages at `/destinations/[slug]/routes/[routeId]`
- Two route content levels:
  - `highlight`: full ClimbAtlas original route notes, photos when licensed, practice focus, story/links, and community placeholder
  - `metadata`: lightweight route facts, source pack, link-quality labels, and outbound links only
- Link-quality labels for metadata routes:
  - `route-specific`: exact route page
  - `guidebook-specific`: guidebook or specific resource page
  - `area-only`: area fallback link
  - `needs-upgrade`: not ready yet
- Lightweight English / Chinese language switching
- Built-in feedback page at `/feedback`
- Local TypeScript and CSV seed data instead of Supabase for now

## How to run locally

First install Node.js if your computer does not already have it:

```bash
https://nodejs.org
```

Then open a terminal in this project folder and run:

```bash
npm install
npm run dev
```

Open the local website:

```bash
http://localhost:3000
```

On Windows, if a terminal says `npm` is not recognized right after installing Node.js, close that terminal and open a new one. The terminal needs to reload the updated PATH setting.

## Content workflow

Metadata route entries live in:

```bash
src/data/route-metadata.csv
```

After editing the CSV, regenerate the TypeScript data:

```bash
node scripts/route-metadata.mjs
```

The script checks required fields, duplicate route IDs, valid link statuses, and basic guardrails against accidentally storing guidebook-style beta.

## Beta launch checks

Before sharing the Beta link, run:

```bash
npm run typecheck
npm run build
```

Then check the core flows locally:

- Homepage map opens and region clusters / destination markers work.
- Search works for examples like `Yosemite`, `The Nose`, and `花岗岩`.
- Destination pages open for all 20 destinations.
- Route indexes filter by type, status, and sector.
- Metadata route pages show exact route links or area fallback labels clearly.
- Highlight route pages still show Overview, Photos, Practice, Story / Links, and Community sections.
- Route Finder works on destination pages and recommends highlight routes only.
- Feedback page opens at `/feedback`.
- The `EN / 中文` language toggle works.
- Mobile layout keeps the map, destination panel, search drawer, and route pages usable.

## Deploying on Vercel

The simplest deployment path is Vercel:

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New Project** and import the repository.
3. Use the default Next.js settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: leave empty/default
4. Optional feedback setup:
   - Copy `.env.example` as a reference for available feedback settings.
   - Leave `NEXT_PUBLIC_FEEDBACK_URL` blank to use the built-in `/feedback` page.
   - Add `NEXT_PUBLIC_FEEDBACK_EMAIL` if you want the feedback page to open an email draft.
   - Add `NEXT_PUBLIC_FEEDBACK_URL` only if you later want the feedback button to open an external form service.
5. Deploy, open the Vercel preview URL, and repeat the Beta launch checks above.

## Content boundaries

ClimbAtlas does not copy:

- route descriptions
- beta
- topos
- approach notes
- protection details
- descent notes
- user comments
- ratings
- guidebook text
- unlicensed photos

Metadata routes are meant to help users choose what to research next. Full route instructions belong in current external resources, local guidebooks, and official/local access information.

## What is intentionally not included yet

- No user registration or login
- No Supabase database
- No public comments or ratings
- No saved climbed routes, wishlist, or personal notes
- No real community tips until there are real users and moderation rules

Those features are represented as placeholders so testers can react to the idea before the project takes on account, moderation, and database complexity.

## Important files

- `src/app/page.tsx` is the homepage entry.
- `src/components/HomeClient.tsx` manages homepage map, search, filters, and discovery panel state.
- `src/components/MapView.tsx` renders the Leaflet map, region clusters, markers, and popups.
- `src/app/destinations/[slug]/page.tsx` renders destination guide pages and route indexes.
- `src/app/destinations/[slug]/routes/[routeId]/page.tsx` renders independent route pages.
- `src/components/RouteIndex.tsx` renders the destination route directory.
- `src/components/RouteHighlightCard.tsx` renders full highlight routes.
- `src/components/RouteMetadataCard.tsx` renders metadata-only route pages.
- `src/data/destinations.ts` stores destination data and highlight routes.
- `src/data/route-metadata.csv` stores metadata route rows.
- `scripts/route-metadata.mjs` validates and generates metadata route data.
- `src/types/destination.ts` defines the TypeScript data model.

## Beginner note

This version intentionally uses local data first. Later, the same destination, route, source, image, review, and saved-list concepts can move into Supabase when the product direction is clearer.
