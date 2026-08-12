import {
  defineRouteExperience,
  defineRouteReference,
  editoriallyReviewed,
  sourceBacked,
  type RouteExperienceOverlay
} from "@/data/route-experiences/types";
import type { LocalizedText } from "@/types/destination";
import type {
  RouteChallengeDemand,
  RouteCruxPattern,
  RouteDifficultyShape,
  RouteIntensityLevel,
  RouteMovementTag,
  RouteTerrainTag,
  RouteWallAngle
} from "@/types/route";

const REVIEWED_AT = "2026-08-11";

type ReviewedPickInput = {
  destinationSlug: string;
  routeId: string;
  sourceLabel: string;
  sourceUrl: string;
  copy: {
    summary: LocalizedText;
    whyItStandsOut: LocalizedText;
    bestForText: LocalizedText;
    thingsToConsider: LocalizedText[];
  };
  profile: {
    wallAngle: RouteWallAngle;
    terrain: RouteTerrainTag[];
    movementTendency: RouteMovementTag[];
    difficultyShape: RouteDifficultyShape;
    primaryDemand: RouteChallengeDemand;
    secondaryDemand?: RouteChallengeDemand;
    cruxPattern?: RouteCruxPattern;
    sustainedness?: RouteIntensityLevel;
  };
};

/**
 * Builds a reviewed Pick with one consistent evidence boundary. Route shape is
 * source-backed; decision guidance remains explicitly editorial.
 */
export function defineReviewedPick({
  destinationSlug,
  routeId,
  sourceLabel,
  sourceUrl,
  copy,
  profile
}: ReviewedPickInput): RouteExperienceOverlay {
  const source = defineRouteReference({
    checkedAt: REVIEWED_AT,
    label: sourceLabel,
    provider: "mountain-project",
    sourceUrl,
    verifiedFields: [
      "name",
      "grade",
      "type",
      "length",
      "pitch-count",
      "route-character"
    ]
  });

  return defineRouteExperience({
    destinationSlug,
    routeId,
    sources: [source],
    editorial: copy,
    experience: {
      character: {
        wallAngle: sourceBacked(profile.wallAngle, source, REVIEWED_AT),
        terrain: sourceBacked(profile.terrain, source, REVIEWED_AT),
        movementTendency: editoriallyReviewed(
          profile.movementTendency,
          source,
          REVIEWED_AT
        ),
        difficultyShape: editoriallyReviewed(
          profile.difficultyShape,
          source,
          REVIEWED_AT
        )
      },
      challenge: {
        primaryDemand: editoriallyReviewed(
          profile.primaryDemand,
          source,
          REVIEWED_AT
        ),
        ...(profile.secondaryDemand
          ? {
              secondaryDemand: editoriallyReviewed(
                profile.secondaryDemand,
                source,
                REVIEWED_AT
              )
            }
          : {}),
        ...(profile.cruxPattern
          ? {
              cruxPattern: editoriallyReviewed(
                profile.cruxPattern,
                source,
                REVIEWED_AT
              )
            }
          : {}),
        ...(profile.sustainedness
          ? {
              sustainedness: editoriallyReviewed(
                profile.sustainedness,
                source,
                REVIEWED_AT
              )
            }
          : {})
      }
    }
  });
}
