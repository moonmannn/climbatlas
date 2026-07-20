import type {
  ExternalResource,
  LocalizedText,
  RouteHighlight,
  RouteStatus,
  SourceTrustLevel,
  SourceType
} from "@/types/destination";

export const routeClimbingTypes = [
  "sport",
  "trad",
  "boulder",
  "top-rope",
  "multi-pitch",
  "alpine",
  "ice",
  "mixed",
  "other"
] as const;

export type RouteClimbingType = (typeof routeClimbingTypes)[number];

export const gradeSystems = [
  "yds",
  "french",
  "font",
  "v-scale",
  "british-trad",
  "uiaa",
  "australian",
  "alpine",
  "aid",
  "ice",
  "mixed",
  "unknown"
] as const;

export type GradeSystem = (typeof gradeSystems)[number];

export type RouteGradeParseStatus = "parsed" | "partial" | "unparsed";
export type RouteGradeFilterBand =
  | "intro"
  | "intermediate"
  | "advanced"
  | "elite"
  | "unknown";

export type ParsedRouteGrade = {
  original: string;
  detectedSystems: GradeSystem[];
  primarySystem?: GradeSystem;
  primaryDisplay?: string;
  rangeMin?: number;
  rangeMax?: number;
  sortValue?: number;
  filterBand?: RouteGradeFilterBand;
  filterBands: RouteGradeFilterBand[];
  aidGrade?: string;
  commitmentGrade?: string;
  parseStatus: RouteGradeParseStatus;
};

export type RouteGrade = ParsedRouteGrade & {
  // The source wording is never replaced by a conversion.
  system: GradeSystem;
  normalizedDifficulty?: number;
  equivalentGrades?: Partial<Record<GradeSystem, string>>;
};

export const routeWallAngles = ["slab", "vertical", "overhang", "roof"] as const;
export type RouteWallAngle = (typeof routeWallAngles)[number];

export const routeTerrainTags = [
  "crack",
  "face",
  "corner",
  "chimney",
  "arete"
] as const;
export type RouteTerrainTag = (typeof routeTerrainTags)[number];

export const routeMovementTags = ["technical", "compression", "stemming"] as const;
export type RouteMovementTag = (typeof routeMovementTags)[number];

export const routePhysicalTags = ["power", "endurance", "sustained"] as const;
export type RoutePhysicalTag = (typeof routePhysicalTags)[number];

export type RouteStyleProfile = {
  wallAngle?: RouteWallAngle;
  terrainTags: RouteTerrainTag[];
  movementTags: RouteMovementTag[];
  physicalTags: RoutePhysicalTag[];
};

export const routeExperienceTags = [
  "beginner-friendly",
  "first-outdoor-route",
  "classic",
  "local-favorite",
  "project",
  "high-commitment",
  "scenic",
  "short-approach",
  "long-approach",
  "crowded",
  "quiet"
] as const;
export type RouteExperienceTag = (typeof routeExperienceTags)[number];

export type AttributeOrigin = "source" | "editorial" | "inferred";

export type RouteSourceProvider =
  | "openbeta"
  | "thecrag"
  | "mountain-project"
  | "wikipedia"
  | "official-guide"
  | "official-organization"
  | "climbing-media"
  | "local-source"
  | "community"
  | "climbatlas"
  | "other";

export type RouteSourcePurpose = "route" | "access" | "area" | "media";

export type RouteSourceRecord = {
  provider: RouteSourceProvider;
  label: string;
  sourceUrl: string;
  externalId?: string;
  attribution?: string;
  license?: string;
  importedAt?: string;
  checkedAt?: string;
  sourceType: SourceType;
  trustLevel: SourceTrustLevel;
  verifiedFields: string[];
  notes?: string;
  /**
   * Internal classification used before a source reaches presentation code.
   * Older snapshots may omit it and are classified conservatively by adapters.
   */
  purpose?: RouteSourcePurpose;
};

export type RouteVerificationStatus =
  | "verified"
  | "source-backed"
  | "community-submitted"
  | "unverified";

export type RouteVerification = {
  status: RouteVerificationStatus;
  checkedAt?: string;
  notes?: string;
};

export type RouteEditorialTier = "index" | "pick";
export type RouteEditorialStatus = "needs-review" | "draft" | "reviewed" | "published";

export type RouteEditorial = {
  tier: RouteEditorialTier;
  status: RouteEditorialStatus;
  summary?: LocalizedText;
  whyItStandsOut?: LocalizedText;
  bestForText?: LocalizedText;
  thingsToConsider?: LocalizedText[];
  practiceFocus?: LocalizedText[];
  decisionHint?: LocalizedText;
  personalityTags?: string[];
  historicalNotes?: LocalizedText;
  notableAscents?: RouteEditorialNotableAscent[];
  legacyStatus?: RouteStatus;
};

export type RouteEditorialNotableAscent = {
  climber: string;
  note: LocalizedText;
  sourceLabel: string;
  sourceUrl: string;
};

export type RouteMediaRecord = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  license: string;
  sourceUrl: string;
  kind: "route" | "area-context" | "destination-context";
};

export type RouteFactField =
  | "name"
  | "originalGrade"
  | "gradeSystem"
  | "climbingType"
  | "sectorName"
  | "lengthOriginal"
  | "pitches";

export type RouteFactConflictCandidate = {
  sourceKey: string;
  sourcePriority: number;
  value: string | number;
};

export type RouteFactConflict = {
  field: RouteFactField;
  selected: RouteFactConflictCandidate;
  candidates: RouteFactConflictCandidate[];
  resolution: "source-priority";
};

export type RouteNormalizationMetadata = {
  adapter: "legacy-route" | "openbeta" | "canonical-snapshot";
  factConflicts: RouteFactConflict[];
};

export type RouteDnaDimension =
  | "exploration"
  | "performance"
  | "adventure"
  | "social"
  | "comfort"
  | "flow";

export type RouteDnaProfile = {
  values: Partial<Record<RouteDnaDimension, number>>;
  origin: AttributeOrigin;
  notes?: LocalizedText;
};

export type RouteRecord = {
  kind: "route";
  id: string;
  slug: string;
  name: string;
  destinationId: string;
  areaId?: string;
  sectorId?: string;
  areaName?: string;
  sectorName?: string;
  cragName?: string;
  climbingType: RouteClimbingType;
  grade: RouteGrade;
  lengthOriginal?: string;
  lengthMeters?: number;
  pitches?: number;
  style: RouteStyleProfile;
  experienceTags: RouteExperienceTag[];
  editorial: RouteEditorial;
  dnaProfile?: RouteDnaProfile;
  sourceRecords: RouteSourceRecord[];
  verification: RouteVerification;
  externalResources: ExternalResource[];
  media?: RouteMediaRecord[];
  normalization?: RouteNormalizationMetadata;
  createdAt?: string;
  updatedAt?: string;
  // Temporary bridge retained until the RC-4 public renderer cutover.
  // The ViewModel builder is forbidden from reading this field.
  legacy?: RouteHighlight;
};

export type RouteAreaIndexRecord = {
  kind: "area-index";
  id: string;
  slug: string;
  name: string;
  destinationId: string;
  areaName?: string;
  sectorName?: string;
  sourceRecords: RouteSourceRecord[];
  verification: RouteVerification;
  externalResources: ExternalResource[];
  legacy: RouteHighlight;
};

export type RouteCatalogEntry = RouteRecord | RouteAreaIndexRecord;

export function isRouteRecord(entry: RouteCatalogEntry): entry is RouteRecord {
  return entry.kind === "route";
}

export function isRouteAreaIndex(
  entry: RouteCatalogEntry
): entry is RouteAreaIndexRecord {
  return entry.kind === "area-index";
}
