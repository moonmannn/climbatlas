import type { RouteExperienceOverlay } from "@/data/route-experiences/types";
import { fontainebleauRouteExperiences } from "@/data/route-experiences/fontainebleau";
import { kalymnosRouteExperiences } from "@/data/route-experiences/kalymnos";
import { redRiverGorgeRouteExperiences } from "@/data/route-experiences/red-river-gorge";
import { squamishRouteExperiences } from "@/data/route-experiences/squamish";
import { yosemiteRouteExperiences } from "@/data/route-experiences/yosemite";

export const routeExperienceOverlays: RouteExperienceOverlay[] = [
  ...yosemiteRouteExperiences,
  ...redRiverGorgeRouteExperiences,
  ...squamishRouteExperiences,
  ...fontainebleauRouteExperiences,
  ...kalymnosRouteExperiences
];

export const routeExperienceByKey = new Map(
  routeExperienceOverlays.map((overlay) => [
    `${overlay.destinationSlug}:${overlay.routeId}`,
    overlay
  ])
);
