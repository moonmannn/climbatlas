import { normalizeRouteSource } from "@/lib/routes/adapters/normalize-route-source";
import type {
  LocalizedText,
  SourceTrustLevel,
  SourceType
} from "@/types/destination";
import type {
  RouteEvidenceValue,
  RouteEditorial,
  RouteExperienceProfile,
  RouteMediaRecord,
  RouteSourceProvider,
  RouteSourceRecord
} from "@/types/route";

export const EXPERIENCE_REVIEW_DATE = "2026-07-21";

export type PublishedRouteEditorial = Pick<
  RouteEditorial,
  | "summary"
  | "whyItStandsOut"
  | "bestForText"
  | "thingsToConsider"
  | "practiceFocus"
  | "decisionHint"
  | "personalityTags"
> & {
  summary: LocalizedText;
  whyItStandsOut: LocalizedText;
  bestForText: LocalizedText;
  thingsToConsider: LocalizedText[];
};

export type RouteExperienceOverlay = {
  destinationSlug: string;
  routeId: string;
  editorial: PublishedRouteEditorial;
  experience: RouteExperienceProfile;
  sources: RouteSourceRecord[];
  media?: RouteMediaRecord[];
};

export type ExperienceSourceInput = Omit<RouteSourceRecord, "id"> & {
  id?: string;
};

export function defineExperienceSource(
  source: ExperienceSourceInput
): RouteSourceRecord {
  return normalizeRouteSource(source);
}

export function defineRouteReference({
  checkedAt = EXPERIENCE_REVIEW_DATE,
  label,
  provider,
  sourceType = "route-database-metadata",
  sourceUrl,
  trustLevel = "medium",
  verifiedFields = ["name", "grade", "type", "route-character"]
}: {
  checkedAt?: string;
  label: string;
  provider: RouteSourceProvider;
  sourceType?: SourceType;
  sourceUrl: string;
  trustLevel?: SourceTrustLevel;
  verifiedFields?: string[];
}) {
  return defineExperienceSource({
    provider,
    label,
    sourceUrl,
    checkedAt,
    sourceType,
    trustLevel,
    verifiedFields,
    purpose: "route-reference"
  });
}

export function defineRouteExperience(
  overlay: RouteExperienceOverlay
): RouteExperienceOverlay {
  return overlay;
}

export function sourceBacked<T>(
  value: T,
  sources: RouteSourceRecord | RouteSourceRecord[],
  checkedAt = EXPERIENCE_REVIEW_DATE
): RouteEvidenceValue<T> {
  const sourceList = Array.isArray(sources) ? sources : [sources];
  return {
    value,
    origin: "source",
    sourceIds: sourceList.map((source) => source.id),
    checkedAt
  };
}

export function editoriallyReviewed<T>(
  value: T,
  sources: RouteSourceRecord | RouteSourceRecord[],
  checkedAt = EXPERIENCE_REVIEW_DATE
): RouteEvidenceValue<T> {
  const sourceList = Array.isArray(sources) ? sources : [sources];
  return {
    value,
    origin: "editorial",
    sourceIds: sourceList.map((source) => source.id),
    checkedAt
  };
}
