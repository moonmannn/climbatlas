import type { RouteHighlight, RouteSource } from "@/types/destination";
import type {
  GradeSystem,
  RouteCatalogEntry,
  RouteClimbingType,
  RouteEditorial,
  RouteGrade,
  RouteSourceProvider,
  RouteSourceRecord,
  RouteVerification
} from "@/types/route";

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function detectGradeSystems(
  original: string,
  destinationId: string,
  climbingType: RouteClimbingType
): GradeSystem[] {
  const systems: GradeSystem[] = [];

  if (/\b5\.\d{1,2}[abcd]?(?:[+-])?\b/i.test(original)) systems.push("yds");
  if (/\bV\d{1,2}(?:[+-])?\b/i.test(original)) systems.push("v-scale");
  if (/\bFont\s*[3-9][ABC](?:\+)?\b/.test(original)) systems.push("font");
  if (climbingType === "boulder" && /\b[3-9][ABC](?:\+)?\b/.test(original)) {
    systems.push("font");
  }
  if (climbingType !== "boulder" && /\b[3-9][abc](?:\+)?\b/.test(original)) {
    systems.push("french");
  }
  if (/\b(?:E\d\s*\d[abc]|HVS|VS|HS|V?Diff|Severe)\b/i.test(original)) {
    systems.push("british-trad");
  }
  if (/\b(?:F|PD|AD|D|TD|ED)(?:[+-])?\b/.test(original)) systems.push("alpine");
  if (/\b(?:A|C)[0-5]\b/.test(original)) systems.push("aid");
  if (/\b(?:WI|AI)\d(?:[+-])?\b/i.test(original)) systems.push("ice");
  if (/\bM\d(?:[+-])?\b/i.test(original)) systems.push("mixed");
  if (/\bUIAA\b/i.test(original)) systems.push("uiaa");
  if (
    destinationId === "grampians-australia" &&
    /^\d{1,2}(?:\s*[-/]\s*\d{1,2})?$/.test(original.trim())
  ) {
    systems.push("australian");
  }

  return unique(systems);
}

export function createRouteGrade(
  original: string,
  destinationId: string,
  climbingType: RouteClimbingType
): RouteGrade {
  const detectedSystems = detectGradeSystems(original, destinationId, climbingType);

  return {
    original,
    system:
      detectedSystems.length === 0
        ? "unknown"
        : detectedSystems.length === 1
          ? detectedSystems[0]
          : "mixed",
    detectedSystems
  };
}

function sourceProvider(source: RouteSource): RouteSourceProvider {
  let hostname = "";

  try {
    hostname = new URL(source.sourceUrl).hostname.toLowerCase();
  } catch {
    return "other";
  }

  if (hostname.includes("openbeta")) return "openbeta";
  if (hostname.includes("thecrag")) return "thecrag";
  if (hostname.includes("mountainproject")) return "mountain-project";
  if (hostname.includes("wikipedia") || hostname.includes("wikimedia")) {
    return "wikipedia";
  }
  if (source.type === "official") return "official-organization";
  if (source.type === "climbing-media") return "climbing-media";
  if (source.type === "community-or-blog") return "community";

  return "other";
}

function migrateSource(source: RouteSource): RouteSourceRecord {
  return {
    provider: sourceProvider(source),
    label: source.sourceLabel,
    sourceUrl: source.sourceUrl,
    checkedAt: source.lastChecked,
    sourceType: source.type,
    trustLevel: source.trustLevel,
    verifiedFields: [...source.verifies],
    notes: source.notes
  };
}

function latestCheckedAt(sources: RouteSourceRecord[]) {
  return sources
    .map((source) => source.checkedAt)
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);
}

function createVerification(sources: RouteSourceRecord[]): RouteVerification {
  if (sources.length === 0) {
    return {
      status: "unverified",
      notes: "Migrated without a source record; requires review."
    };
  }

  return {
    status: "source-backed",
    checkedAt: latestCheckedAt(sources),
    notes:
      "RC-1 migration preserves existing source claims. Verified status requires a later field-level review."
  };
}

function localizedValue(english: string, chinese?: string) {
  return chinese ? { en: english, zh: chinese } : { en: english };
}

function migrateEditorial(route: RouteHighlight): RouteEditorial {
  const legacyStatus = route.status ?? "highlight";
  const localized = route.localizedContent;

  return {
    tier: legacyStatus === "metadata" ? "index" : "pick",
    // Old highlight labels have not yet passed the Route Coverage review.
    status: "needs-review",
    summary: localizedValue(route.summary, localized?.summary?.zh),
    whyItStandsOut: localizedValue(route.style, localized?.style?.zh),
    bestForText: localizedValue(route.bestFor, localized?.bestFor?.zh),
    thingsToConsider: route.editorialTips.map((tip, index) =>
      localizedValue(tip, localized?.editorialTips?.zh?.[index])
    ),
    legacyStatus
  };
}

export function migrateLegacyRoute(
  destinationId: string,
  route: RouteHighlight
): RouteCatalogEntry {
  const sourceRecords = route.sources.map(migrateSource);
  const verification = createVerification(sourceRecords);
  const shared = {
    id: route.id,
    slug: route.id,
    name: route.name,
    destinationId,
    sourceRecords,
    verification,
    externalResources: [...(route.externalResources ?? [])],
    legacy: route
  };

  if (route.status === "metadata" && route.metadataKind === "area-index") {
    return {
      kind: "area-index",
      ...shared,
      areaName: route.sector ?? route.name,
      sectorName: route.sector
    };
  }

  const climbingType: RouteClimbingType = route.type;

  return {
    kind: "route",
    ...shared,
    sectorName: route.sector,
    climbingType,
    grade: createRouteGrade(route.grade, destinationId, climbingType),
    lengthOriginal: route.length,
    // RC-1 does not infer controlled facts from free-form descriptions.
    style: {
      terrainTags: [],
      movementTags: [],
      physicalTags: []
    },
    experienceTags: [],
    editorial: migrateEditorial(route)
  };
}
