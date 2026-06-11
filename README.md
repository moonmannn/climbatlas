# ClimbAtlas

ClimbAtlas is a beginner-friendly MVP for exploring famous climbing destinations on an interactive world map.

## What this first version includes

- A full-screen world map on the homepage
- Clickable markers for famous climbing destinations
- Popup cards with basic destination information
- A simple destination detail page
- Filters for climbing type, rock type, season, and beginner-friendly areas
- Local TypeScript seed data instead of a database

## How to run locally

First install Node.js from the official website if your computer does not already have it:

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

## Beta launch checks

Before sharing the Beta link, run these commands:

```bash
npm run typecheck
npm run build
```

Then check the core flows locally:

- Homepage map opens and markers/region clusters work.
- Search works for examples like `Yosemite`, `The Nose`, and `花岗岩`.
- Route Finder finishes the quiz and links to route cards.
- Feedback page opens at `/feedback` and can generate a copyable feedback note.
- Destination pages open for all 20 destinations.
- The `EN / 中文` language toggle works.
- Mobile layout keeps the map, sidebar, and Explorer Board usable.

## Deploying the Beta on Vercel

The simplest first deployment path is Vercel:

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New Project** and import the repository.
3. Use the default Next.js settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: leave empty/default
4. Optional feedback setup:
   - Copy `.env.example` as a reference for the available feedback settings.
   - Leave `NEXT_PUBLIC_FEEDBACK_URL` blank to use the built-in `/feedback` page. This is the safest first option for users in China because it stays on your own domain.
   - Add `NEXT_PUBLIC_FEEDBACK_EMAIL` if you want the built-in feedback page to open an email draft.
   - Add `NEXT_PUBLIC_FEEDBACK_URL` only if you later want the feedback button to open an external form service instead.
5. Deploy, open the Vercel preview URL, and repeat the Beta launch checks above.

## What is intentionally not in V1 Beta

- No user registration or login yet.
- No Supabase database yet.
- No comments, ratings, or public user tips yet.
- No saved climbed routes, wishlist, or personal notes yet.

Those features are represented as placeholders so testers can react to the idea before the project takes on account, moderation, and database complexity.

## Important files

- `src/app/page.tsx` is the homepage.
- `src/components/HomeClient.tsx` controls the filter state and sends filtered data to the map.
- `src/components/MapView.tsx` renders the Leaflet map, markers, and popups.
- `src/components/FilterSidebar.tsx` renders the filter controls.
- `src/app/destinations/[slug]/page.tsx` renders each destination detail page.
- `src/data/destinations.ts` stores the local demo destination data.
- `src/types/destination.ts` defines the TypeScript shape of a destination.

## Beginner note

This version intentionally uses local data first. Later, the same destination fields can be moved into a Supabase PostgreSQL table when you are ready to add a backend.
