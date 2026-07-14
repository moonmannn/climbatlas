import type { RouteImportSummary } from "@/types/route-import";
import type { RouteRecord } from "@/types/route";

const changingTimestampKeys = new Set([
  "checkedAt",
  "importedAt",
  "createdAt",
  "updatedAt"
]);

function comparable(value: unknown): string {
  return JSON.stringify(value, (key, nestedValue) =>
    changingTimestampKeys.has(key) ? undefined : nestedValue
  );
}

function externalId(route: RouteRecord) {
  return route.sourceRecords.find(
    (source) => source.provider === "openbeta" && source.externalId
  )?.externalId;
}

export function mergeImportedRoutes(
  previous: RouteRecord[],
  incoming: RouteRecord[],
  baseSummary: Omit<RouteImportSummary, "imported" | "updated" | "skippedUnchanged">
) {
  const previousByExternalId = new Map(
    previous
      .map((route) => [externalId(route), route] as const)
      .filter((item): item is [string, RouteRecord] => Boolean(item[0]))
  );
  const summary: RouteImportSummary = {
    imported: 0,
    updated: 0,
    skippedUnchanged: 0,
    ...baseSummary
  };
  const routes = incoming.map((route) => {
    const sourceId = externalId(route);
    const existing = sourceId ? previousByExternalId.get(sourceId) : undefined;

    if (!existing) {
      summary.imported += 1;
      return route;
    }

    if (comparable(existing) === comparable(route)) {
      summary.skippedUnchanged += 1;
      return existing;
    }

    summary.updated += 1;
    return {
      ...route,
      createdAt: existing.createdAt,
      sourceRecords: route.sourceRecords.map((source) => ({
        ...source,
        importedAt:
          existing.sourceRecords.find(
            (candidate) =>
              candidate.provider === source.provider &&
              candidate.externalId === source.externalId
          )?.importedAt ?? source.importedAt
      }))
    };
  });

  return { routes, summary };
}
