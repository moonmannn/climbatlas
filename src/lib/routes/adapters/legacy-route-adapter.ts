import { parseRouteGrade } from "@/lib/routes/parse-route-grade";
import { normalizeLegacyRouteFacts } from "@/lib/routes/adapters/normalize-route-facts";
import { classifyRouteSourcePurpose } from "@/lib/routes/adapters/normalize-route-source";
import {
  dedupeNormalizedRouteSources,
  normalizeRouteSource
} from "@/lib/routes/adapters/normalize-route-source";
import type {
  LocalizedText,
  RouteHighlight,
  RouteSource
} from "@/types/destination";
import type {
  RouteCatalogEntry,
  RouteClimbingType,
  RouteEditorial,
  RouteGrade,
  RouteSourceProvider,
  RouteSourceRecord,
  RouteVerification
} from "@/types/route";

export function createRouteGrade(
  original: string,
  destinationId: string,
  climbingType: RouteClimbingType
): RouteGrade {
  const parsed = parseRouteGrade(original, destinationId, climbingType);

  return {
    ...parsed,
    system:
      parsed.detectedSystems.length === 0
        ? "unknown"
        : parsed.detectedSystems.length === 1
          ? parsed.detectedSystems[0]
          : "mixed",
    normalizedDifficulty: parsed.sortValue
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

function adaptSource(source: RouteSource): RouteSourceRecord {
  const record = {
    provider: sourceProvider(source),
    label: source.sourceLabel,
    sourceUrl: source.sourceUrl,
    checkedAt: source.lastChecked,
    sourceType: source.type,
    trustLevel: source.trustLevel,
    verifiedFields: [...source.verifies],
    notes: source.notes
  };
  return normalizeRouteSource({
    ...record,
    purpose: source.purpose ?? classifyRouteSourcePurpose(record)
  });
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
      "Legacy adapter preserves existing source claims. Verified status requires a later field-level review."
  };
}

function localizedValue(english: string | undefined, chinese?: string) {
  if (!english && !chinese) return undefined;
  return {
    ...(english ? { en: english } : {}),
    ...(chinese ? { zh: chinese } : {})
  } satisfies LocalizedText;
}

function localizedList(
  english: string[] | undefined,
  chinese?: string[]
) {
  const length = Math.max(english?.length ?? 0, chinese?.length ?? 0);

  return Array.from({ length }, (_, index) =>
    localizedValue(english?.[index], chinese?.[index])
  ).filter((value): value is LocalizedText => Boolean(value));
}

function adaptEditorial(route: RouteHighlight): RouteEditorial {
  const legacyStatus = route.status ?? "highlight";
  const localized = route.localizedContent;

  return {
    // Legacy highlight copy is retained for audits, but it is never published
    // until an explicit Route Experience overlay promotes the route.
    tier: "index",
    status: "needs-review",
    summary: localizedValue(route.summary, localized?.summary?.zh),
    whyItStandsOut: localizedValue(route.style, localized?.style?.zh),
    bestForText: localizedValue(route.bestFor, localized?.bestFor?.zh),
    thingsToConsider: localizedList(
      route.editorialTips,
      localized?.editorialTips?.zh
    ),
    practiceFocus: localizedList(
      route.practiceFocus,
      localized?.practiceFocus?.zh
    ),
    decisionHint: localizedValue(
      route.decisionHint,
      localized?.decisionHint?.zh
    ),
    personalityTags: [...(route.personalityTags ?? [])],
    historicalNotes: route.historicalNotes,
    notableAscents: route.notableAscents?.map((ascent) => ({
      climber: ascent.climber,
      note: ascent.note,
      sourceLabel: ascent.sourceLabel,
      sourceUrl: ascent.sourceUrl
    })),
    legacyStatus
  };
}

export function adaptLegacyRoute(
  destinationId: string,
  route: RouteHighlight
): RouteCatalogEntry {
  const sourceRecords = dedupeNormalizedRouteSources(route.sources.map(adaptSource));
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
  const facts = normalizeLegacyRouteFacts({ rawLength: route.length });

  return {
    kind: "route",
    ...shared,
    sectorName: route.sector?.trim() || undefined,
    climbingType,
    grade: createRouteGrade(route.grade?.trim() ?? "", destinationId, climbingType),
    lengthMeters: facts.lengthMeters,
    lengthFeet: facts.lengthFeet,
    lengthQualifier: facts.lengthQualifier,
    pitchCount: facts.pitchCount,
    pitchQualifier: facts.pitchQualifier,
    routeFormat: facts.routeFormat,
    style: {
      terrainTags: [],
      movementTags: [],
      physicalTags: []
    },
    experienceTags: [],
    editorial: adaptEditorial(route),
    media: route.images.map((image) => ({
      src: image.src,
      alt: image.alt,
      caption: image.caption,
      credit: image.credit,
      license: image.license,
      sourceUrl: image.sourceUrl,
      kind: image.imageType
    })),
    normalization: {
      adapter: "legacy-route",
      factConflicts: [],
      omittedLegacyFacts: facts.omittedLegacyFacts
    }
  };
}
