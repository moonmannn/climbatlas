import snapshot from "@/data/routes/imports/route-coverage-3-batch-1.json";
import type { RouteCoverageBatchImportSnapshot } from "@/types/route-import";

export const routeCoverage3BatchSnapshot =
  snapshot as unknown as RouteCoverageBatchImportSnapshot;

export const routeCoverage3RouteAliases = Object.fromEntries(
  routeCoverage3BatchSnapshot.sourceMerges
    .filter((merge) => merge.mergedRouteId !== merge.canonicalRouteId)
    .map((merge) => [
      `${merge.destinationSlug}:${merge.mergedRouteId}`,
      merge.canonicalRouteId
    ])
);
