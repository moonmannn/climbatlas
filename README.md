# ClimbAtlas

ClimbAtlas is a climbing destination and route-choice MVP. It helps climbers first decide where to climb, then browse route highlights or metadata-only route indexes with clear outbound links to current external resources.

The project is still content-first, but V3 adds an optional private user notebook through Supabase. ClimbAtlas still does not copy guidebook text or route beta.

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
- Optional Supabase Auth for private saved routes and notes
- `/my-atlas` private notebook for `want to climb`, `climbed`, and personal notes
- Private profile fields for display name, home base, experience level, preferred styles, and bio
- Local TypeScript and CSV seed data for route content; Supabase only stores user actions

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
npm run routes:generate
```

The generator checks required fields, duplicate route IDs, publication status, route-versus-area classification, link-status consistency, and guardrails against accidentally storing guidebook-style beta. Rows marked `hidden` stay in the CSV for later research but are not generated into the public catalog.

Before publishing route-data changes, run the live link audit:

```bash
npm run routes:verify-links
```

The audit fails on published 404/410 links. A 401/403/429 is reported as blocked because some route sites reject automated checks; review those links manually in a browser.

## Supabase setup for V3

The site still works without Supabase, but login and saved routes require a Supabase project.

1. Create a Supabase project.
2. Open the Supabase SQL editor and run:

```bash
supabase/schema.sql
```

3. Copy the project URL and anon key into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. In Supabase Auth settings, add your local and deployed URLs as allowed redirect URLs:

```bash
http://localhost:3000
https://climbatlas.vercel.app
```

The database stores only user actions:

- private profile fields: display name, home base, experience level, preferred styles, bio
- saved route status: `want-to-climb` or `climbed`
- private route notes

It does not store copied route descriptions, beta, comments, ratings, or guidebook content.

### Supabase launch checklist

- In Supabase SQL editor, run `supabase/schema.sql`.
- For an existing V3 database, also run `supabase/migrations/20260710_merge_route_aliases.sql` once to migrate saved duplicate route IDs.
- In Supabase Auth settings, enable email magic link sign-in.
- Add these redirect URLs:
  - `http://localhost:3000`
  - `https://climbatlas.vercel.app`
- In local `.env.local`, add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- In Vercel Project Settings > Environment Variables, add the same two values.
- Redeploy after adding Vercel environment variables.
- Test login, profile editing, saved route status, and private notes with a real email.

## Beta launch checks

Before sharing the Beta link, run:

```bash
npm run routes:generate
npm run routes:verify-links
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
- `/my-atlas` opens.
- With Supabase configured, users can sign in, save a route, mark it climbed, and save a private note.
- Signed-in users can edit private profile fields on `/my-atlas`.
- Notes-only routes appear on `/my-atlas`.
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
5. Optional Supabase setup:
   - Add `NEXT_PUBLIC_SUPABASE_URL`.
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Run `supabase/schema.sql` in the Supabase SQL editor before testing saved routes.
6. Deploy, open the Vercel preview URL, and repeat the Beta launch checks above.

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

- No public comments or ratings
- No real community tips until there are real users and moderation rules

V3 adds private saved routes and notes, but public community features remain intentionally closed until moderation rules are clear.

## Important files

- `src/app/page.tsx` is the homepage entry.
- `src/components/HomeClient.tsx` manages homepage map, search, filters, and discovery panel state.
- `src/components/MapView.tsx` renders the Leaflet map, region clusters, markers, and popups.
- `src/app/destinations/[slug]/page.tsx` renders destination guide pages and route indexes.
- `src/app/destinations/[slug]/routes/[routeId]/page.tsx` renders independent route pages.
- `src/components/RouteIndex.tsx` renders the destination route directory.
- `src/components/RouteHighlightCard.tsx` renders full highlight routes.
- `src/components/RouteMetadataCard.tsx` renders metadata-only route pages.
- `src/components/UserRouteControls.tsx` renders saved-route and note controls.
- `src/components/MyAtlasClient.tsx` renders the private route notebook.
- `src/data/destinations.ts` stores destination data and highlight routes.
- `src/data/route-metadata.csv` stores metadata route rows.
- `scripts/route-metadata.mjs` validates and generates metadata route data.
- `scripts/verify-route-links.mjs` checks published source and external URLs for broken links.
- `src/lib/routeAliases.ts` keeps old duplicate route URLs and private saved data compatible.
- `supabase/migrations/20260710_merge_route_aliases.sql` merges legacy saved route IDs.
- `supabase/schema.sql` defines V3 user tables and private row-level security policies.
- `src/types/destination.ts` defines the TypeScript data model.

## Beginner note

This version intentionally keeps route content local. Supabase is only for accounts, saved-route status, and private notes.
