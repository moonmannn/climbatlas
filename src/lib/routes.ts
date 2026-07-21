import { destinations } from "@/data/destinations";
import { applyRouteCatalogCleanup } from "@/data/route-catalog-cleanup";
import openBetaPocSnapshot from "@/data/routes/imports/openbeta-poc.json";
import { migrateLegacyRoute } from "@/lib/routes/migrate-legacy-route";
import { adaptCanonicalRouteRecord } from "@/lib/routes/adapters/canonical-route-adapter";
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
const importedOpenBetaRoutes = (
  openBetaPocSnapshot as unknown as RouteImportSnapshot
).routes;

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
        const overlay = routeExperienceByKey.get(
          `${destination.slug}:${entry.id}`
        );
        return [{
          destination,
          entry: isRouteRecord(entry)
            ? applyRouteExperience(entry, overlay)
            : entry
        }];
      })
    );
    const destinationsById = new Map(
      destinations.map((destination) => [destination.slug, destination])
    );
    const missingImportedDestinations = importedOpenBetaRoutes.filter(
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

    const importedEntries = importedOpenBetaRoutes.flatMap((snapshotRoute) => {
      const normalizedRoute = adaptCanonicalRouteRecord(snapshotRoute);
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
