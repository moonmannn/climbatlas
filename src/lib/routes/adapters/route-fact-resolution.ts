import type {
  RouteFactConflict,
  RouteFactConflictCandidate,
  RouteFactField,
  RouteSourcePurpose,
  RouteSourceRecord
} from "@/types/route";

export type RouteFactCandidate<T extends string | number> = {
  field: RouteFactField;
  sourceKey: string;
  sourcePriority: number;
  value: T;
};

export type RouteFactResolution<T extends string | number> = {
  value: T;
  conflict?: RouteFactConflict;
};

const trustWeight = {
  high: 30,
  medium: 20,
  low: 10
} as const;

const purposeWeight: Record<RouteSourcePurpose, number> = {
  route: 400,
  access: 300,
  area: 200,
  media: 100
};

export function routeSourcePriority(
  source: RouteSourceRecord,
  purpose: RouteSourcePurpose
) {
  return purposeWeight[purpose] + trustWeight[source.trustLevel];
}

export function resolveRouteFactCandidates<T extends string | number>(
  candidates: RouteFactCandidate<T>[]
): RouteFactResolution<T> | undefined {
  if (candidates.length === 0) return undefined;

  const ordered = [...candidates].sort(
    (first, second) =>
      second.sourcePriority - first.sourcePriority ||
      first.sourceKey.localeCompare(second.sourceKey)
  );
  const selected = ordered[0];
  const distinctValues = new Set(ordered.map((candidate) => String(candidate.value)));

  if (distinctValues.size <= 1) {
    return { value: selected.value };
  }

  const publicCandidate = (
    candidate: RouteFactCandidate<T>
  ): RouteFactConflictCandidate => ({
    sourceKey: candidate.sourceKey,
    sourcePriority: candidate.sourcePriority,
    value: candidate.value
  });

  return {
    value: selected.value,
    conflict: {
      field: selected.field,
      selected: publicCandidate(selected),
      candidates: ordered.map(publicCandidate),
      resolution: "source-priority"
    }
  };
}
