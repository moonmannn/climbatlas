import type { RouteRecord } from "@/types/route";

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
  areaUuid: string;
  areaName: string;
  pathTokens: string[];
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
