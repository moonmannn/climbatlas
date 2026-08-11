import snapshot from "@/data/routes/imports/route-coverage-3-batch-2.json";
import type { RouteCoverageBatchImportSnapshot } from "@/types/route-import";

export const routeCoverage3Batch2Snapshot =
  snapshot as unknown as RouteCoverageBatchImportSnapshot;

export const routeCoverage3Batch2RouteAliases = Object.fromEntries(
  routeCoverage3Batch2Snapshot.sourceMerges
    .filter((merge) => merge.mergedRouteId !== merge.canonicalRouteId)
    .map((merge) => [
      `${merge.destinationSlug}:${merge.mergedRouteId}`,
      merge.canonicalRouteId
    ])
);
