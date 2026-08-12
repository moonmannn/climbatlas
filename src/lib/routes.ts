import { destinations } from "@/data/destinations";
import { applyRouteCatalogCleanup } from "@/data/route-catalog-cleanup";
import openBetaPocSnapshot from "@/data/routes/imports/openbeta-poc.json";
import { routeCoverage3BatchSnapshot } from "@/data/routes/route-coverage-3-batch-1";
import { routeCoverage3Batch2Snapshot } from "@/data/routes/route-coverage-3-batch-2";
import { routeCoverage3Batch3Snapshot } from "@/data/routes/route-coverage-3-batch-3";
import { migrateLegacyRoute } from "@/lib/routes/migrate-legacy-route";
import { adaptCanonicalRouteRecord } from "@/lib/routes/adapters/canonical-route-adapter";
import {
  dedupeNormalizedRouteSources,
  normalizeRouteSource
} from "@/lib/routes/adapters/normalize-route-source";
import { routeExperienceByKey } from "@/data/route-experiences";
import { applyRouteExperience } from "@/lib/routes/apply-route-experience";
import type { Destination, RouteHighlight } from "@/types/destination";
import type { RouteImportSnapshot } from "@/types/route-import";
import {
  isRouteAreaIndex,
  isRouteRecord,
  type RouteAreaIndexRecord,
  type RouteCatalogEntry,
  type RouteRecord
} from "@/types/route";

export type RouteWithDestination = {
  destination: Destination;
  route: RouteHighlight;
};

export type RouteCatalogEntryWithDestination = {
  destination: Destination;
  entry: RouteCatalogEntry;
};

export type RouteRecordWithDestination = {
  destination: Destination;
  route: RouteRecord;
};

export type RouteAreaIndexWithDestination = {
  destination: Destination;
  areaIndex: RouteAreaIndexRecord;
};

let routeCatalogCache: RouteCatalogEntryWithDestination[] | undefined;
const excludedRouteCoverageBatch =
  process.env.CLIMBATLAS_EXCLUDE_ROUTE_COVERAGE_BATCH;
const activeRouteCoverageSnapshots = [
  routeCoverage3BatchSnapshot,
  routeCoverage3Batch2Snapshot,
  routeCoverage3Batch3Snapshot
].filter((snapshot) => snapshot.batchId !== excludedRouteCoverageBatch);
const importedOpenBetaRoutes = (
  openBetaPocSnapshot as unknown as RouteImportSnapshot
).routes;
const importedRoutes = [
  ...importedOpenBetaRoutes,
  ...activeRouteCoverageSnapshots.flatMap((snapshot) => snapshot.routes)
];
const routeCoverage3SourceMerges = new Map<string, Array<
  (typeof routeCoverage3BatchSnapshot.sourceMerges)[number]
>>();

for (const merge of activeRouteCoverageSnapshots.flatMap(
  (snapshot) => snapshot.sourceMerges
)) {
  const key = `${merge.destinationSlug}:${merge.canonicalRouteId}`;
  routeCoverage3SourceMerges.set(key, [
    ...(routeCoverage3SourceMerges.get(key) ?? []),
    merge
  ]);
}

function applyRouteCoverage3SourceMerge(route: RouteRecord): RouteRecord {
  const merges = routeCoverage3SourceMerges.get(
    `${route.destinationId}:${route.id}`
  );

  if (!merges) return route;

  const normalizedSources = [
    ...route.sourceRecords,
    ...merges.flatMap((merge) => merge.sourceRecords)
  ].map(normalizeRouteSource);
  const latestSourceByIdentity = new Map<string, (typeof normalizedSources)[number]>();
  const sourcesWithoutExternalIdentity = [];

  for (const source of normalizedSources) {
    if (!source.externalId) {
      sourcesWithoutExternalIdentity.push(source);
      continue;
    }

    const key = `${source.provider}:${source.externalId}:${source.purpose}`;
    const previous = latestSourceByIdentity.get(key);
    if (!previous || (source.checkedAt ?? "") >= (previous.checkedAt ?? "")) {
      latestSourceByIdentity.set(key, source);
    }
  }

  const externalResources = [
    ...route.externalResources,
    ...merges.flatMap((merge) => merge.externalResources)
  ].filter(
    (resource, index, resources) =>
      resources.findIndex(
        (candidate) =>
          candidate.url === resource.url && candidate.type === resource.type
      ) === index
  );

  return {
    ...route,
    sourceRecords: dedupeNormalizedRouteSources([
      ...sourcesWithoutExternalIdentity,
      ...Array.from(latestSourceByIdentity.values())
    ]),
    externalResources
  };
}

export function getAllRoutesWithDestinations(): RouteWithDestination[] {
  return destinations.flatMap((destination) =>
    (destination.routes ?? []).flatMap((route) => {
      const resolved = applyRouteCatalogCleanup(destination.slug, route);
      return resolved.route ? [{ destination, route: resolved.route }] : [];
    })
  );
}

export function findRouteWithDestination(
  destinationSlug: string,
  routeId: string
) {
  return getAllRoutesWithDestinations().find(
    (item) =>
      item.destination.slug === destinationSlug && item.route.id === routeId
  );
}

export function getAllRouteCatalogEntries(): RouteCatalogEntryWithDestination[] {
  if (!routeCatalogCache) {
    const legacyEntries = destinations.flatMap((destination) =>
      (destination.routes ?? []).flatMap((route) => {
        const resolved = applyRouteCatalogCleanup(destination.slug, route);
        if (!resolved.route) return [];

        const entry = migrateLegacyRoute(destination.slug, resolved.route);
        const mergedEntry = isRouteRecord(entry)
          ? applyRouteCoverage3SourceMerge(entry)
          : entry;
        const overlay = routeExperienceByKey.get(
          `${destination.slug}:${mergedEntry.id}`
        );
        return [{
          destination,
          entry: isRouteRecord(mergedEntry)
            ? applyRouteExperience(mergedEntry, overlay)
            : mergedEntry
        }];
      })
    );
    const destinationsById = new Map(
      destinations.map((destination) => [destination.slug, destination])
    );
    const missingImportedDestinations = importedRoutes.filter(
      (route) => !destinationsById.has(route.destinationId)
    );

    if (missingImportedDestinations.length > 0) {
      const routeKeys = missingImportedDestinations
        .map((route) => `${route.destinationId}:${route.id}`)
        .join(", ");
      throw new Error(
        `Imported routes reference missing destinations: ${routeKeys}`
      );
    }

    const importedEntries = importedRoutes.flatMap((snapshotRoute) => {
      const normalizedRoute = applyRouteCoverage3SourceMerge(
        adaptCanonicalRouteRecord(snapshotRoute)
      );
      const route = applyRouteExperience(
        normalizedRoute,
        routeExperienceByKey.get(
          `${normalizedRoute.destinationId}:${normalizedRoute.id}`
        )
      );
      const destination = destinationsById.get(route.destinationId);
      return destination ? [{ destination, entry: route }] : [];
    });

    routeCatalogCache = [...legacyEntries, ...importedEntries];
  }

  return routeCatalogCache;
}

export function getAllRouteRecordsWithDestinations(): RouteRecordWithDestination[] {
  return getAllRouteCatalogEntries()
    .filter(
      (item): item is RouteCatalogEntryWithDestination & { entry: RouteRecord } =>
        isRouteRecord(item.entry)
    )
    .map(({ destination, entry }) => ({ destination, route: entry }));
}

export function getAllAreaIndexesWithDestinations(): RouteAreaIndexWithDestination[] {
  return getAllRouteCatalogEntries()
    .filter(
      (
        item
      ): item is RouteCatalogEntryWithDestination & {
        entry: RouteAreaIndexRecord;
      } => isRouteAreaIndex(item.entry)
    )
    .map(({ destination, entry }) => ({ destination, areaIndex: entry }));
}

export function findRouteRecordWithDestination(
  destinationSlug: string,
  routeId: string
) {
  return getAllRouteRecordsWithDestinations().find(
    (item) =>
      item.destination.slug === destinationSlug && item.route.id === routeId
  );
}

export function findRouteCatalogEntryWithDestination(
  destinationSlug: string,
  routeId: string
) {
  return getAllRouteCatalogEntries().find(
    (item) =>
      item.destination.slug === destinationSlug && item.entry.id === routeId
  );
}
