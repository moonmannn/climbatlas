import type { RouteRecord } from "@/types/route";
import { buildRouteDnaSnapshot } from "@/lib/routes/route-dna";
import { parseRouteGrade } from "@/lib/routes/parse-route-grade";
import { hasPublishedRouteEditorial } from "@/lib/routes/public-routes";
import { countPublicRouteSources } from "@/lib/routes/presentation/route-detail-view-model";
import type {
  RouteDifficultyBand,
  RouteExplorerItem
} from "@/types/route-explorer";

const bandOrder: Record<RouteDifficultyBand, number> = {
  intro: 0,
  intermediate: 1,
  advanced: 2,
  elite: 3,
  unknown: 4
};

export function getRouteDifficulty(route: RouteRecord) {
  const parsed = parseRouteGrade(
    route.grade.original,
    route.destinationId,
    route.climbingType
  );
  if (parsed.sortValue === undefined || !parsed.filterBand) return undefined;
  return {
    rank: parsed.sortValue,
    band: parsed.filterBand,
    bands: parsed.filterBands,
    parsed
  };
}

export function toRouteExplorerItem(route: RouteRecord): RouteExplorerItem {
  const difficulty = getRouteDifficulty(route);
  const difficultyBand = difficulty?.band ?? "unknown";
  const parsedGrade = difficulty?.parsed ?? parseRouteGrade(
    route.grade.original,
    route.destinationId,
    route.climbingType
  );
  const styleTags = [
    route.style.wallAngle,
    ...route.style.terrainTags,
    ...route.style.movementTags,
    ...route.style.physicalTags
  ].filter(Boolean) as string[];
  const hasPublishedEditorial = hasPublishedRouteEditorial(route);

  return {
    id: route.id,
    name: route.name,
    destinationId: route.destinationId,
    grade: route.grade.original.replace(/\bmetadata\b/gi, "").trim(),
    gradeDisplay: parsedGrade.primaryDisplay ?? route.grade.original.replace(/\bmetadata\b/gi, "").trim(),
    gradeSystem: parsedGrade.primarySystem ?? route.grade.system,
    gradeParseStatus: parsedGrade.parseStatus,
    gradeRangeMin: parsedGrade.rangeMin,
    gradeRangeMax: parsedGrade.rangeMax,
    difficultyBand,
    difficultyBands: parsedGrade.filterBands,
    difficultyRank: difficulty?.rank,
    climbingType: route.climbingType,
    lengthOriginal: route.lengthOriginal,
    sectorName: route.sectorName,
    styleTags,
    isPublishedPick: hasPublishedEditorial,
    summary: hasPublishedEditorial ? route.editorial.summary : undefined,
    sourceCount: countPublicRouteSources(route),
    dnaSnapshot: buildRouteDnaSnapshot(route, difficultyBand)
  };
}

export function compareRouteDifficulty(
  first: RouteExplorerItem,
  second: RouteExplorerItem
) {
  return (
    bandOrder[first.difficultyBand] - bandOrder[second.difficultyBand] ||
    (first.difficultyRank ?? Number.POSITIVE_INFINITY) -
      (second.difficultyRank ?? Number.POSITIVE_INFINITY) ||
    first.name.localeCompare(second.name)
  );
}
