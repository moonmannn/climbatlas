import { findPotentialRouteDuplicates } from "@/lib/routes/deduplicate-routes";
import { validateRouteCatalog } from "@/lib/routes/validate-route";
import {
  isRouteAreaIndex,
  isRouteRecord,
  type RouteCatalogEntry,
  type RouteRecord
} from "@/types/route";

export type RouteAuditDestination = {
  destinationId: string;
  destinationName: string;
  entries: number;
  routes: number;
  areaIndexes: number;
  pickCandidates: number;
  indexedRoutes: number;
};

export type RouteFieldCompletion = {
  complete: number;
  total: number;
  percentage: number;
};

export type RouteAuditReport = {
  schemaVersion: "2.0-rc2";
  summary: {
    destinations: number;
    catalogEntries: number;
    routes: number;
    areaIndexes: number;
    pickCandidates: number;
    reviewedPicks: number;
    indexedRoutes: number;
  };
  destinations: RouteAuditDestination[];
  climbingTypes: Record<string, number>;
  gradeSystems: Record<string, number>;
  detectedGradeSystems: Record<string, number>;
  verificationStatuses: Record<string, number>;
  editorialStatuses: Record<string, number>;
  sourceProviders: Record<string, number>;
  sourceTrustLevels: Record<string, number>;
  externalLinkStatuses: Record<string, number>;
  fieldCompletion: Record<string, RouteFieldCompletion>;
  validation: {
    errors: number;
    warnings: number;
    info: number;
    byCode: Record<string, number>;
  };
  duplicateCandidates: ReturnType<typeof findPotentialRouteDuplicates>;
  recommendations: string[];
};

function countBy<T>(items: T[], key: (item: T) => string) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const value = key(item);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Object.fromEntries(
    Array.from(counts.entries()).sort(
      ([firstKey, firstCount], [secondKey, secondCount]) =>
        secondCount - firstCount || firstKey.localeCompare(secondKey)
    )
  );
}

function completion(complete: number, total: number): RouteFieldCompletion {
  return {
    complete,
    total,
    percentage: total === 0 ? 0 : Math.round((complete / total) * 1000) / 10
  };
}

function hasControlledStyle(route: RouteRecord) {
  return Boolean(
    route.style.wallAngle ||
      route.style.terrainTags.length ||
      route.style.movementTags.length ||
      route.style.physicalTags.length
  );
}

function hasSourceField(
  route: RouteRecord,
  field: "externalId" | "attribution" | "license" | "importedAt" | "checkedAt"
) {
  return route.sourceRecords.some((source) => Boolean(source[field]));
}

function buildFieldCompletion(routes: RouteRecord[]) {
  const total = routes.length;

  return {
    name: completion(routes.filter((route) => route.name.trim()).length, total),
    originalGrade: completion(
      routes.filter((route) => route.grade.original.trim()).length,
      total
    ),
    knownGradeSystem: completion(
      routes.filter((route) => route.grade.system !== "unknown").length,
      total
    ),
    destination: completion(
      routes.filter((route) => route.destinationId.trim()).length,
      total
    ),
    sector: completion(routes.filter((route) => route.sectorName?.trim()).length, total),
    climbingType: completion(
      routes.filter((route) => route.climbingType).length,
      total
    ),
    structuredLength: completion(
      routes.filter(
        (route) =>
          route.lengthMeters !== undefined || route.lengthFeet !== undefined
      ).length,
      total
    ),
    lengthMeters: completion(
      routes.filter((route) => route.lengthMeters !== undefined).length,
      total
    ),
    pitches: completion(
      routes.filter((route) => route.pitchCount !== undefined).length,
      total
    ),
    controlledStyle: completion(routes.filter(hasControlledStyle).length, total),
    experienceTags: completion(
      routes.filter((route) => route.experienceTags.length > 0).length,
      total
    ),
    source: completion(
      routes.filter((route) => route.sourceRecords.length > 0).length,
      total
    ),
    sourceUrl: completion(
      routes.filter((route) =>
        route.sourceRecords.some((source) => source.sourceUrl.trim())
      ).length,
      total
    ),
    externalId: completion(
      routes.filter((route) => hasSourceField(route, "externalId")).length,
      total
    ),
    attribution: completion(
      routes.filter((route) => hasSourceField(route, "attribution")).length,
      total
    ),
    license: completion(
      routes.filter((route) => hasSourceField(route, "license")).length,
      total
    ),
    importedAt: completion(
      routes.filter((route) => hasSourceField(route, "importedAt")).length,
      total
    ),
    checkedAt: completion(
      routes.filter((route) => hasSourceField(route, "checkedAt")).length,
      total
    ),
    dnaProfile: completion(routes.filter((route) => route.dnaProfile).length, total)
  };
}

function buildRecommendations(
  routes: RouteRecord[],
  duplicates: ReturnType<typeof findPotentialRouteDuplicates>
) {
  const recommendations: string[] = [];
  const unknownGrades = routes.filter((route) => route.grade.system === "unknown").length;
  const unreviewedPicks = routes.filter(
    (route) =>
      route.editorial.tier === "pick" && route.editorial.status === "needs-review"
  ).length;

  if (unreviewedPicks > 0) {
    recommendations.push(
      `Review ${unreviewedPicks} legacy highlight records before publishing them as ClimbAtlas Picks.`
    );
  }
  if (unknownGrades > 0) {
    recommendations.push(
      `Assign an explicit grade system to ${unknownGrades} routes; keep every original grade unchanged.`
    );
  }
  if (routes.every((route) => !hasControlledStyle(route))) {
    recommendations.push(
      "Controlled style coverage is 0%; add tags only from source-backed or reviewed editorial facts."
    );
  }
  if (routes.every((route) => !hasSourceField(route, "externalId"))) {
    recommendations.push(
      "No route has an external source ID; the import POC should establish provider + externalId identity."
    );
  }
  if (duplicates.length > 0) {
    recommendations.push(
      `Manually review ${duplicates.length} potential duplicate groups; do not auto-delete variants.`
    );
  }

  return recommendations;
}

export function buildRouteAuditReport(
  entries: RouteCatalogEntry[],
  destinationNames: ReadonlyMap<string, string>
): RouteAuditReport {
  const routes = entries.filter(isRouteRecord);
  const areaIndexes = entries.filter(isRouteAreaIndex);
  const destinationIds = new Set(destinationNames.keys());
  const validation = validateRouteCatalog(entries, destinationIds);
  const duplicateCandidates = findPotentialRouteDuplicates(routes);
  const sourceRecords = routes.flatMap((route) => route.sourceRecords);
  const externalResources = entries.flatMap((entry) => entry.externalResources);
  const destinations = Array.from(destinationNames.entries())
    .map<RouteAuditDestination>(([destinationId, destinationName]) => {
      const destinationEntries = entries.filter(
        (entry) => entry.destinationId === destinationId
      );
      const destinationRoutes = destinationEntries.filter(isRouteRecord);

      return {
        destinationId,
        destinationName,
        entries: destinationEntries.length,
        routes: destinationRoutes.length,
        areaIndexes: destinationEntries.filter(isRouteAreaIndex).length,
        pickCandidates: destinationRoutes.filter(
          (route) => route.editorial.tier === "pick"
        ).length,
        indexedRoutes: destinationRoutes.filter(
          (route) => route.editorial.tier === "index"
        ).length
      };
    })
    .sort(
      (first, second) =>
        second.routes - first.routes ||
        first.destinationName.localeCompare(second.destinationName)
    );

  return {
    schemaVersion: "2.0-rc2",
    summary: {
      destinations: destinationNames.size,
      catalogEntries: entries.length,
      routes: routes.length,
      areaIndexes: areaIndexes.length,
      pickCandidates: routes.filter((route) => route.editorial.tier === "pick")
        .length,
      reviewedPicks: routes.filter(
        (route) =>
          route.editorial.tier === "pick" &&
          ["reviewed", "published"].includes(route.editorial.status)
      ).length,
      indexedRoutes: routes.filter((route) => route.editorial.tier === "index")
        .length
    },
    destinations,
    climbingTypes: countBy(routes, (route) => route.climbingType),
    gradeSystems: countBy(routes, (route) => route.grade.system),
    detectedGradeSystems: countBy(
      routes.flatMap((route) =>
        route.grade.detectedSystems.length
          ? route.grade.detectedSystems
          : ["unknown"]
      ),
      (system) => system
    ),
    verificationStatuses: countBy(
      entries,
      (entry) => entry.verification.status
    ),
    editorialStatuses: countBy(
      routes,
      (route) => `${route.editorial.tier}:${route.editorial.status}`
    ),
    sourceProviders: countBy(sourceRecords, (source) => source.provider),
    sourceTrustLevels: countBy(sourceRecords, (source) => source.trustLevel),
    externalLinkStatuses: countBy(
      externalResources,
      (resource) => resource.linkStatus ?? "missing"
    ),
    fieldCompletion: buildFieldCompletion(routes),
    validation: {
      errors: validation.counts.error,
      warnings: validation.counts.warning,
      info: validation.counts.info,
      byCode: countBy(validation.issues, (issue) => issue.code)
    },
    duplicateCandidates,
    recommendations: buildRecommendations(routes, duplicateCandidates)
  };
}
