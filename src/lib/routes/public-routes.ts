import type {
  ExternalResourceType,
  ExternalLinkStatus,
  LocalizedText,
  SourceType
} from "@/types/destination";
import type {
  GradeSystem,
  RouteClimbingType,
  RouteStyleProfile,
  RouteRecord
} from "@/types/route";
import { parseRouteGrade } from "@/lib/routes/parse-route-grade";
import {
  getAllRouteRecordsWithDestinations,
  type RouteRecordWithDestination
} from "@/lib/routes";

export type PublicRouteFilter = {
  climbingType?: RouteClimbingType;
  destinationSlug?: string;
  gradeSystem?: GradeSystem;
};

export type PublicRouteSummary = {
  climbingType: RouteClimbingType;
  country: string;
  destinationName: string;
  destinationSlug: string;
  grade: string;
  id: string;
  name: string;
  searchText: string;
  sectorName?: string;
  summary?: LocalizedText;
};

export type PublicRouteSource = {
  attribution?: string;
  checkedAt?: string;
  label: string;
  license?: string;
  sourceUrl: string;
  role: "route" | "access";
};

export type PublicRouteResource = {
  linkStatus?: ExternalLinkStatus;
  title: string;
  type: ExternalResourceType;
  url: string;
};

export type PublicRouteFacts = {
  areaName?: string;
  climbingType: RouteClimbingType;
  externalResources: PublicRouteResource[];
  grade: {
    aidGrade?: string;
    commitmentGrade?: string;
    equivalentGrades?: Partial<Record<GradeSystem, string>>;
    original: string;
    primarySystem?: GradeSystem;
  };
  id: string;
  lengthOriginal?: string;
  name: string;
  sectorName?: string;
  sourceRecords: PublicRouteSource[];
  style: RouteStyleProfile;
};

let publicRouteCache: RouteRecordWithDestination[] | undefined;
let publicRouteSummaryCache: PublicRouteSummary[] | undefined;

/**
 * Public route visibility is based on sourced route facts, not editorial tier.
 * Editorial copy remains separately gated by its own publication status.
 */
export function isPublicRouteRecord(route: RouteRecord) {
  return (
    Boolean(route.id.trim()) &&
    Boolean(route.name.trim()) &&
    Boolean(route.destinationId.trim()) &&
    route.sourceRecords.length > 0 &&
    ["verified", "source-backed"].includes(route.verification.status)
  );
}

export function getPublicRouteRecords(): RouteRecordWithDestination[] {
  if (!publicRouteCache) {
    publicRouteCache = getAllRouteRecordsWithDestinations().filter(
      ({ destination, route }) =>
        route.destinationId === destination.slug && isPublicRouteRecord(route)
    );
  }

  return publicRouteCache;
}

export function getPublicRoutesForDestination(
  destinationSlug: string
): RouteRecordWithDestination[] {
  return getPublicRouteRecords().filter(
    ({ destination }) => destination.slug === destinationSlug
  );
}

export function getDestinationRouteCount(destinationSlug: string) {
  return getPublicRoutesForDestination(destinationSlug).length;
}

export function getFilteredRouteCount(filter: PublicRouteFilter = {}) {
  return getPublicRouteRecords().filter(({ destination, route }) => {
    const matchesDestination =
      !filter.destinationSlug || destination.slug === filter.destinationSlug;
    const matchesType =
      !filter.climbingType || route.climbingType === filter.climbingType;
    const matchesGradeSystem =
      !filter.gradeSystem ||
      parseRouteGrade(
        route.grade.original,
        route.destinationId,
        route.climbingType
      ).primarySystem === filter.gradeSystem;

    return matchesDestination && matchesType && matchesGradeSystem;
  }).length;
}

export function getPublishedPicksForDestination(destinationSlug: string) {
  return getPublicRoutesForDestination(destinationSlug).filter(
    ({ route }) => hasPublishedRouteEditorial(route)
  );
}

export function hasPublishedRouteEditorial(route: RouteRecord) {
  return (
    route.editorial.tier === "pick" &&
    route.editorial.status === "published"
  );
}

export function findPublicRouteWithDestination(
  destinationSlug: string,
  routeId: string
) {
  return getPublicRouteRecords().find(
    ({ destination, route }) =>
      destination.slug === destinationSlug && route.id === routeId
  );
}

export function getPublicRouteGrade(route: RouteRecord) {
  return route.grade.original.replace(/\bmetadata\b/gi, "").trim();
}

export function getPublicRouteSummaries(): PublicRouteSummary[] {
  if (!publicRouteSummaryCache) {
    publicRouteSummaryCache = getPublicRouteRecords().map(
      ({ destination, route }) => {
        const hasPublishedEditorial = hasPublishedRouteEditorial(route);

        return {
          climbingType: route.climbingType,
          country: destination.country,
          destinationName: destination.name,
          destinationSlug: destination.slug,
          grade: getPublicRouteGrade(route),
          id: route.id,
          name: route.name,
          searchText: buildPublicRouteSearchText(
            destination.name,
            route,
            hasPublishedEditorial
          ),
          sectorName: route.sectorName,
          summary: hasPublishedEditorial ? route.editorial.summary : undefined
        };
      }
    );
  }

  return publicRouteSummaryCache;
}

export function toPublicRouteFacts(route: RouteRecord): PublicRouteFacts {
  const parsedGrade = parseRouteGrade(
    route.grade.original,
    route.destinationId,
    route.climbingType
  );
  return {
    areaName: route.areaName,
    climbingType: route.climbingType,
    externalResources: route.externalResources
      .filter((resource) => resource.linkStatus !== "needs-upgrade")
      .map((resource) => ({
        linkStatus: resource.linkStatus,
        title: resource.title,
        type: resource.type,
        url: resource.url
      })),
    grade: {
      aidGrade: parsedGrade.aidGrade,
      commitmentGrade: parsedGrade.commitmentGrade,
      equivalentGrades: route.grade.equivalentGrades,
      original: getPublicRouteGrade(route),
      primarySystem: parsedGrade.primarySystem
    },
    id: route.id,
    lengthOriginal: route.lengthOriginal,
    name: route.name,
    sectorName: route.sectorName,
    sourceRecords: route.sourceRecords.map((source) => ({
      attribution: source.attribution,
      checkedAt: source.checkedAt,
      label: source.label,
      license: source.license,
      role: publicSourceRole(source.sourceType),
      sourceUrl: source.sourceUrl
    })),
    style: route.style
  };
}

function publicSourceRole(sourceType: SourceType): PublicRouteSource["role"] {
  return sourceType === "official" ? "access" : "route";
}

function buildPublicRouteSearchText(
  destinationName: string,
  route: RouteRecord,
  includeEditorial: boolean
) {
  const localizedFields = includeEditorial
    ? [
        route.editorial.summary,
        route.editorial.whyItStandsOut,
        route.editorial.bestForText
      ].flatMap(localizedTextValues)
    : [];
  const considerationFields = includeEditorial
    ? (route.editorial.thingsToConsider ?? []).flatMap(localizedTextValues)
    : [];
  const resourceFields = route.externalResources.flatMap((resource) => [
    resource.title,
    resource.description.en,
    resource.description.zh
  ]);

  return [
    route.name,
    destinationName,
    getPublicRouteGrade(route),
    route.grade.system,
    route.climbingType,
    route.areaName,
    route.sectorName,
    route.cragName,
    ...route.style.terrainTags,
    ...route.style.movementTags,
    ...route.style.physicalTags,
    ...localizedFields,
    ...considerationFields,
    ...route.sourceRecords.map((source) => source.label),
    ...resourceFields
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ");
}

function localizedTextValues(value?: LocalizedText) {
  return value ? [value.en, value.zh].filter(Boolean) : [];
}
