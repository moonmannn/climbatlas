import snapshot from "@/data/routes/imports/route-coverage-3-batch-3.json";
import type { RouteCoverageBatchImportSnapshot } from "@/types/route-import";

export const routeCoverage3Batch3Snapshot =
  snapshot as unknown as RouteCoverageBatchImportSnapshot;

export const routeCoverage3Batch3RouteAliases = Object.fromEntries(
  routeCoverage3Batch3Snapshot.sourceMerges
    .filter((merge) => merge.mergedRouteId !== merge.canonicalRouteId)
    .map((merge) => [
      `${merge.destinationSlug}:${merge.mergedRouteId}`,
      merge.canonicalRouteId
    ])
);
