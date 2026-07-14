import type { ExternalLinkStatus } from "@/types/destination";
import type { RouteRecord } from "@/types/route";
import { buildRouteDnaSnapshot } from "@/lib/routes/route-dna";
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

function ydsDifficulty(grade: string) {
  const match = grade.match(/5\.(\d{1,2})([abcd])?([+-])?/i);
  if (!match) return undefined;

  const number = Number(match[1]);
  const letter = match[2]?.toLowerCase();
  const letterOffset = letter ? "abcd".indexOf(letter) / 4 : 0;
  const signOffset = match[3] === "+" ? 0.12 : match[3] === "-" ? -0.12 : 0;
  const rank = number + letterOffset + signOffset;
  const band: RouteDifficultyBand =
    number <= 8
      ? "intro"
      : number <= 10
        ? "intermediate"
        : number <= 12
          ? "advanced"
          : "elite";

  return { rank, band };
}

function vScaleDifficulty(grade: string) {
  const match = grade.match(/\bV(\d{1,2})(?:[-+]|-\d+)?\b/i);
  if (!match) return undefined;
  const rank = Number(match[1]);
  const band: RouteDifficultyBand =
    rank <= 2
      ? "intro"
      : rank <= 5
        ? "intermediate"
        : rank <= 9
          ? "advanced"
          : "elite";
  return { rank, band };
}

function frenchDifficulty(grade: string) {
  const match = grade.match(/\b([3-9])([abcABC])?(\+)?\b/);
  if (!match) return undefined;
  const number = Number(match[1]);
  const letterOffset = match[2]
    ? "abc".indexOf(match[2].toLowerCase()) / 3
    : 0;
  const rank = number + letterOffset + (match[3] ? 0.2 : 0);
  const band: RouteDifficultyBand =
    number <= 5
      ? "intro"
      : number === 6
        ? "intermediate"
        : number === 7
          ? "advanced"
          : "elite";
  return { rank, band };
}

function australianDifficulty(grade: string) {
  const match = grade.match(/\b(\d{1,2})\b/);
  if (!match) return undefined;
  const rank = Number(match[1]);
  const band: RouteDifficultyBand =
    rank <= 14
      ? "intro"
      : rank <= 20
        ? "intermediate"
        : rank <= 27
          ? "advanced"
          : "elite";
  return { rank, band };
}

export function getRouteDifficulty(route: RouteRecord) {
  const original = route.grade.original.replace(/\bmetadata\b/gi, "").trim();

  switch (route.grade.system) {
    case "yds":
      return ydsDifficulty(original);
    case "v-scale":
      return vScaleDifficulty(original);
    case "french":
    case "font":
      return frenchDifficulty(original);
    case "australian":
      return australianDifficulty(original);
    default:
      return undefined;
  }
}

function primaryLinkStatus(route: RouteRecord): ExternalLinkStatus | undefined {
  const statuses = route.externalResources
    .map((resource) => resource.linkStatus)
    .filter((status): status is ExternalLinkStatus => Boolean(status));

  return (
    ["route-specific", "guidebook-specific", "area-only", "needs-upgrade"] as const
  ).find((status) => statuses.includes(status));
}

function completenessScore(route: RouteRecord) {
  let points = 0;
  if (route.grade.original.trim()) points += 15;
  if (route.grade.system !== "unknown") points += 10;
  if (route.climbingType !== "other") points += 10;
  if (route.sectorName) points += 10;
  if (route.lengthOriginal) points += 10;
  if (route.sourceRecords.length > 0) points += 15;
  if (primaryLinkStatus(route) === "route-specific") points += 15;
  if (
    route.style.wallAngle ||
    route.style.terrainTags.length ||
    route.style.movementTags.length ||
    route.style.physicalTags.length
  ) {
    points += 10;
  }
  if (["reviewed", "published"].includes(route.editorial.status)) points += 5;
  return points;
}

export function toRouteExplorerItem(route: RouteRecord): RouteExplorerItem {
  const difficulty = getRouteDifficulty(route);
  const difficultyBand = difficulty?.band ?? "unknown";
  const styleTags = [
    route.style.wallAngle,
    ...route.style.terrainTags,
    ...route.style.movementTags,
    ...route.style.physicalTags
  ].filter(Boolean) as string[];

  return {
    id: route.id,
    name: route.name,
    destinationId: route.destinationId,
    grade: route.grade.original.replace(/\bmetadata\b/gi, "").trim(),
    gradeSystem: route.grade.system,
    difficultyBand,
    difficultyRank: difficulty?.rank,
    climbingType: route.climbingType,
    sectorName: route.sectorName,
    styleTags,
    editorialTier: route.editorial.tier,
    editorialStatus: route.editorial.status,
    summary: route.editorial.summary,
    sourceCount: route.sourceRecords.length,
    verificationStatus: route.verification.status,
    linkStatus: primaryLinkStatus(route),
    completenessScore: completenessScore(route),
    isImported: !route.legacy,
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
