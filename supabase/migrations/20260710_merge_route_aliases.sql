-- Merge legacy duplicate route IDs into their canonical ClimbAtlas route IDs.
-- Run this once after deploying the route alias update.

create temporary table climbatlas_route_aliases (
  destination_slug text not null,
  legacy_route_id text not null,
  canonical_route_id text not null
);

insert into climbatlas_route_aliases
  (destination_slug, legacy_route_id, canonical_route_id)
values
  ('yosemite-usa', 'separate-reality-direct-yosemite', 'separate-reality'),
  ('yosemite-usa', 'reed-pinnacle-direct-yosemite', 'reeds-pinnacle-direct-yosemite'),
  ('yosemite-usa', 'central-pillar-frenzy-yosemite', 'central-pillar-of-frenzy-yosemite'),
  ('squamish-canada', 'angel-crest-squamish', 'angels-crest-squamish'),
  ('kalymnos-greece', 'priapos-kalymnos', 'priapios-kalymnos'),
  ('yosemite-usa', 'salathe-wall-yosemite', 'salathe-wall-el-capitan');

delete from public.saved_routes legacy
using climbatlas_route_aliases aliases,
      public.saved_routes canonical
where legacy.destination_slug = aliases.destination_slug
  and legacy.route_id = aliases.legacy_route_id
  and canonical.user_id = legacy.user_id
  and canonical.destination_slug = aliases.destination_slug
  and canonical.route_id = aliases.canonical_route_id;

update public.saved_routes saved
set route_id = aliases.canonical_route_id
from climbatlas_route_aliases aliases
where saved.destination_slug = aliases.destination_slug
  and saved.route_id = aliases.legacy_route_id;

delete from public.route_notes legacy
using climbatlas_route_aliases aliases,
      public.route_notes canonical
where legacy.destination_slug = aliases.destination_slug
  and legacy.route_id = aliases.legacy_route_id
  and canonical.user_id = legacy.user_id
  and canonical.destination_slug = aliases.destination_slug
  and canonical.route_id = aliases.canonical_route_id;

update public.route_notes note
set route_id = aliases.canonical_route_id
from climbatlas_route_aliases aliases
where note.destination_slug = aliases.destination_slug
  and note.route_id = aliases.legacy_route_id;
