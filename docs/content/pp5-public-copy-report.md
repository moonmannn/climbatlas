# PP-5 Public Copy Report

Date: 2026-07-17

## Completed scope

- Added the approved English and Chinese terminology glossary.
- Replaced the retired Route Finder promise on the Explore page with Climbing
  DNA preference matching and Route Explorer language.
- Updated the Beta feedback form to describe the current Climbing DNA feature.
- Reframed generic route pages around recorded information, sources, and
  external resources instead of unreviewed route character or suitability.
- Rewrote all 20 destination introductions using catalog fields already present
  in the project: rock type, climbing types, grade systems, source trails, and
  available comparison tools.
- Added `npm.cmd run copy:validate` for active UI terminology, UTF-8 integrity,
  and destination-introduction review triggers.

## Publication boundary

Legacy route summaries, decision hints, practice directions, and editorial tips
remain in the data layer. They were not bulk-rewritten because their factual
support has not been reviewed route by route. The public selector exposes this
editorial content only when a route is a published ClimbAtlas Pick. At this
checkpoint there are no published picks, so unreviewed route prose falls back to
route information and sources.

## Deferred cleanup

`ExplorerBoard`, `RouteFinder`, and `RouteMetadataCard` are currently unmounted
legacy components. Their old terminology is excluded from the active UI copy
gate and can be removed with the confirmed dead JSX during PP-6. Keeping them
out of this change avoids mixing copy policy with structural cleanup.

## Editorial limits

- No route facts, history, safety guidance, access information, conditions,
  movement descriptions, or user opinions were added.
- DNA percentages remain preference matches, not ability or safety scores.
- Unknown information remains unavailable instead of being replaced with
  polished guesses.
