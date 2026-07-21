import { normalizeLegacyRouteFacts } from "@/lib/routes/adapters/normalize-route-facts";
import {
  dedupeNormalizedRouteSources,
  normalizeRouteSource
} from "@/lib/routes/adapters/normalize-route-source";
import { parseRouteGrade } from "@/lib/routes/parse-route-grade";
import type {
  RouteFactQualifier,
  RouteFormat,
  RouteRecord,
  RouteSourcePurpose,
  RouteSourceRecord
} from "@/types/route";

type SnapshotSourceRecord = Omit<RouteSourceRecord, "id" | "purpose"> & {
  id?: string;
  purpose?: RouteSourcePurpose | "route" | "area";
};

type CanonicalSnapshotRoute = Omit<
  RouteRecord,
  | "lengthMeters"
  | "lengthFeet"
  | "lengthQualifier"
  | "pitchCount"
  | "pitchQualifier"
  | "routeFormat"
  | "sourceRecords"
> & {
  lengthOriginal?: string;
  lengthMeters?: number;
  lengthFeet?: number;
  lengthQualifier?: RouteFactQualifier;
  pitches?: number;
  pitchCount?: number;
  pitchQualifier?: RouteFactQualifier;
  routeFormat?: RouteFormat;
  sourceRecords: SnapshotSourceRecord[];
};

export function adaptCanonicalRouteRecord(input: unknown): RouteRecord {
  const snapshot = input as CanonicalSnapshotRoute;
  const {
    lengthOriginal,
    lengthMeters,
    lengthFeet,
    lengthQualifier,
    pitches,
    pitchCount,
    pitchQualifier,
    routeFormat,
    sourceRecords,
    normalization,
    ...route
  } = snapshot;
  const facts = normalizeLegacyRouteFacts({
    rawLength: lengthOriginal,
    lengthMeters,
    lengthFeet,
    lengthQualifier,
    pitches,
    pitchCount,
    pitchQualifier,
    routeFormat
  });
  const parsedGrade = parseRouteGrade(
    route.grade.original,
    route.destinationId,
    route.climbingType
  );

  return {
    ...route,
    grade: {
      ...route.grade,
      ...parsedGrade,
      normalizedDifficulty: parsedGrade.sortValue
    },
    lengthMeters: facts.lengthMeters,
    lengthFeet: facts.lengthFeet,
    lengthQualifier: facts.lengthQualifier,
    pitchCount: facts.pitchCount,
    pitchQualifier: facts.pitchQualifier,
    routeFormat: facts.routeFormat,
    sourceRecords: dedupeNormalizedRouteSources(
      sourceRecords.map(normalizeRouteSource)
    ),
    normalization: {
      adapter: "canonical-snapshot",
      factConflicts: normalization?.factConflicts ?? [],
      omittedLegacyFacts: [
        ...(normalization?.omittedLegacyFacts ?? []),
        ...facts.omittedLegacyFacts
      ]
    }
  };
}
