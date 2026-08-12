import type { RouteExperienceOverlay } from "@/data/route-experiences/types";
import { bishopAreaRouteExperiences } from "@/data/route-experiences/bishop-area";
import { fontainebleauRouteExperiences } from "@/data/route-experiences/fontainebleau";
import { joshuaTreeRouteExperiences } from "@/data/route-experiences/joshua-tree";
import { kalymnosRouteExperiences } from "@/data/route-experiences/kalymnos";
import { redRockCanyonRouteExperiences } from "@/data/route-experiences/red-rock-canyon";
import { redRiverGorgeRouteExperiences } from "@/data/route-experiences/red-river-gorge";
import { squamishRouteExperiences } from "@/data/route-experiences/squamish";
import { yosemiteRouteExperiences } from "@/data/route-experiences/yosemite";

export const routeExperienceOverlays: RouteExperienceOverlay[] = [
  ...yosemiteRouteExperiences,
  ...redRiverGorgeRouteExperiences,
  ...squamishRouteExperiences,
  ...fontainebleauRouteExperiences,
  ...kalymnosRouteExperiences,
  ...joshuaTreeRouteExperiences,
  ...bishopAreaRouteExperiences,
  ...redRockCanyonRouteExperiences
];

export const routeExperienceByKey = new Map(
  routeExperienceOverlays.map((overlay) => [
    `${overlay.destinationSlug}:${overlay.routeId}`,
    overlay
  ])
);
