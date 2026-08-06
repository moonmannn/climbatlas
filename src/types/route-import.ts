import type {
  RouteNormalizedHierarchy,
  RouteRecord,
  RouteSourceHierarchy
} from "@/types/route";

export type DestinationImportPathTuple = {
  country: string;
  stateProvince: string;
  region?: string;
  area?: string;
  crag?: string;
};

export type DestinationImportScope = {
  destinationSlug: string;
  acceptedPathTuples: DestinationImportPathTuple[];
  excludedPathTuples?: Array<
    Partial<Pick<DestinationImportPathTuple, "region" | "area" | "crag">>
  >;
  coordinateBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  coordinateUsage: "scope-validation-only";
  publishRouteCoordinates: false;
  scopeVersion: string;
};

export type RouteImportBatchManifest = {
  batchId: string;
  importerVersion: string;
  sourceProvider: "openbeta";
  sourceRelease: string;
  sourceAssetUrl: string;
  sourceSha256: string;
  sourceSchemaSha256: string;
  sourceCommitSha?: string;
  sourceRowCount: number;
  sourceCheckedAt: string;
  destinationScopes: DestinationImportScope[];
  destinationTargets: Record<
    string,
    { minimum: number; target: number; maximum: number }
  >;
};

export type OpenBetaLinkStatus =
  | "valid"
  | "redirected"
  | "broken"
  | "unverified";

export type OpenBetaSourceRecord = {
  externalId: string;
  sourceUrl: string;
  canonicalUrlCheckedAt: string;
  finalResolvedUrl?: string;
  linkStatus: OpenBetaLinkStatus;
};

export type RouteSourceIdentity = {
  provider: string;
  externalId: string;
};

export type RouteIdentityRecord = {
  canonicalRouteId: string;
  destinationSlug: string;
  sourceIdentities: RouteSourceIdentity[];
  slugAliases: string[];
  mergedRouteIds?: string[];
};

export type RouteImportScope = {
  destinationId: string;
  sourceAreaName: string;
  ancestors: string[];
  maxRoutes: number;
};

export type OpenBetaRawGrade = Partial<
  Record<"yds" | "french" | "font" | "vscale" | "uiaa" | "ewbank" | "wi", string>
>;

export type OpenBetaRawClimbType = Partial<
  Record<
    | "trad"
    | "sport"
    | "bouldering"
    | "deepwatersolo"
    | "alpine"
    | "snow"
    | "ice"
    | "mixed"
    | "aid"
    | "tr",
    boolean
  >
>;

export type OpenBetaRawRoute = {
  uuid: string;
  name: string;
  length: number;
  grades: OpenBetaRawGrade | null;
  type: OpenBetaRawClimbType;
  areaUuid?: string;
  areaName?: string;
  pathTokens: string[];
  sourceHierarchy?: RouteSourceHierarchy;
  normalizedHierarchy?: RouteNormalizedHierarchy;
  sourceRelease?: string;
  sourceUrl?: string;
  canonicalUrlCheckedAt?: string;
  finalResolvedUrl?: string;
  linkStatus?: OpenBetaLinkStatus;
};

export type RouteSourceSnapshot = {
  source: "openbeta";
  sourceUrl: string;
  license: "CC0-1.0";
  attribution: string;
  fetchedAt: string;
  scope: RouteImportScope;
  routes: OpenBetaRawRoute[];
};

export type RouteImportSnapshot = {
  schemaVersion: 1;
  source: "openbeta";
  sourceUrl: string;
  license: "CC0-1.0";
  attribution: string;
  generatedAt: string;
  publicationStatus: "review-snapshot";
  destinations: string[];
  routes: RouteRecord[];
};

export type RouteSourceMerge = {
  destinationSlug: string;
  canonicalRouteId: string;
  mergedRouteId: string;
  sourceRecords: RouteRecord["sourceRecords"];
  externalResources: RouteRecord["externalResources"];
};

export type RouteCoverageBatchImportSnapshot = {
  schemaVersion: 1;
  batchId: string;
  source: "openbeta";
  sourceRelease: string;
  sourceSha256: string;
  generatedAt: string;
  publicationStatus: "preview-catalog";
  destinations: string[];
  routes: RouteRecord[];
  sourceMerges: RouteSourceMerge[];
};

export type RouteImportSummary = {
  imported: number;
  updated: number;
  skippedUnchanged: number;
  potentialDuplicates: number;
  invalid: number;
  missingSource: number;
  failed: number;
};

export interface RouteSourceAdapter<TRawSnapshot> {
  sourceName: string;
  sourceUrl: string;
  license: string;
  fetch(scope: RouteImportScope): Promise<TRawSnapshot>;
}
