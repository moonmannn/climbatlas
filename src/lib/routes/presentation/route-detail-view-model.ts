import {
  formatCheckedDate,
  formatClimbingType,
  formatGradeSystem
} from "@/lib/formatters";
import type {
  Destination,
  ExternalLinkStatus,
  ExternalResourceType,
  Locale,
  LocalizedText
} from "@/types/destination";
import type {
  GradeSystem,
  RouteMediaRecord,
  RouteRecord,
  RouteSourcePurpose,
  RouteSourceRecord
} from "@/types/route";

export type PublicSourceViewModel = {
  attribution?: string;
  checkedAtLabel?: string;
  label: string;
  license?: string;
  purpose: "route" | "access";
  url: string;
};

export type ExternalResourceViewModel = {
  description?: string;
  linkStatusLabel?: string;
  purpose: "route" | "access" | "supplemental";
  title: string;
  typeLabel: string;
  url: string;
};

export type PublicMediaViewModel = {
  alt: string;
  attribution: string;
  caption?: string;
  kind: RouteMediaRecord["kind"];
  license: string;
  sourceUrl: string;
  src: string;
};

export type RouteDetailViewModel = {
  identity: {
    id: string;
    slug: string;
    name: string;
    destinationName: string;
    destinationHref: string;
    areaName?: string;
    sectorName?: string;
  };
  facts: {
    originalGrade?: string;
    gradeSystemLabel?: string;
    equivalentGradeLabels?: string[];
    climbingTypeLabel: string;
    lengthLabel?: string;
    pitchesLabel?: string;
  };
  badges: {
    isPublishedPick: boolean;
    verificationLabel?: string;
  };
  routeSources: PublicSourceViewModel[];
  accessSources: PublicSourceViewModel[];
  externalResources: ExternalResourceViewModel[];
  publishedEditorial?: {
    summary?: string;
    whyItStandsOut?: string;
    bestFor?: string;
    decisionHint?: string;
    thingsToConsider?: string[];
    practiceFocus?: string[];
    personalityTags?: string[];
    historicalNote?: string;
    notableAscents?: Array<{
      climber: string;
      note?: string;
      sourceLabel: string;
      sourceUrl: string;
    }>;
  };
  media?: {
    routeImages: PublicMediaViewModel[];
    contextImages: PublicMediaViewModel[];
  };
};

export type RouteDetailBuildDiagnostics = {
  duplicateResourcesRemoved: number;
  duplicateSourcesRemoved: number;
  invalidMedia: Array<{ reason: string; src?: string }>;
};

export class RouteViewModelBuildError extends Error {
  constructor(
    public readonly code:
      | "route-id-missing"
      | "route-slug-missing"
      | "route-name-missing"
      | "destination-missing"
      | "destination-mismatch",
    message: string
  ) {
    super(message);
    this.name = "RouteViewModelBuildError";
  }
}

type BuildOptions = {
  locale: Locale;
  destination: Destination;
};

export function buildRouteDetailViewModel(
  route: RouteRecord,
  options: BuildOptions
): RouteDetailViewModel {
  return inspectRouteDetailViewModelBuild(route, options).viewModel;
}

export function countPublicRouteSources(route: RouteRecord) {
  return buildSources(route.sourceRecords, "en").sources.filter(
    (source) => source.purpose === "route"
  ).length;
}

export function inspectRouteDetailViewModelBuild(
  route: RouteRecord,
  { locale, destination }: BuildOptions
): {
  viewModel: RouteDetailViewModel;
  diagnostics: RouteDetailBuildDiagnostics;
} {
  assertIdentity(route, destination);

  const sourceResult = buildSources(route.sourceRecords, locale);
  const resourceResult = buildResources(
    route,
    locale,
    sourceResult.canonicalKeys
  );
  const mediaResult = buildMedia(route.media ?? []);
  const originalGrade = route.grade.original
    .replace(/\bmetadata\b/gi, "")
    .trim();
  const primarySystem = route.grade.primarySystem ??
    (route.grade.system !== "unknown" && route.grade.system !== "mixed"
      ? route.grade.system
      : undefined);
  const equivalentGradeLabels = Object.entries(
    route.grade.equivalentGrades ?? {}
  )
    .filter(
      (entry): entry is [GradeSystem, string] =>
        Boolean(entry[1]?.trim()) && entry[0] !== primarySystem
    )
    .map(
      ([system, grade]) =>
        `${formatGradeSystem(system, locale)}: ${grade.trim()}`
    );
  const isPublishedPick =
    route.editorial.tier === "pick" &&
    route.editorial.status === "published";
  const publishedEditorial = isPublishedPick
    ? buildPublishedEditorial(route, locale)
    : undefined;

  return {
    viewModel: {
      identity: {
        id: route.id.trim(),
        slug: route.slug.trim(),
        name: route.name.trim(),
        destinationName: destination.name.trim(),
        destinationHref: `/destinations/${destination.slug}`,
        areaName: cleanOptional(route.areaName),
        sectorName: cleanOptional(route.sectorName)
      },
      facts: {
        originalGrade: originalGrade || undefined,
        gradeSystemLabel:
          originalGrade && primarySystem
            ? formatGradeSystem(primarySystem, locale)
            : undefined,
        equivalentGradeLabels:
          equivalentGradeLabels.length > 0 ? equivalentGradeLabels : undefined,
        climbingTypeLabel: formatClimbingType(route.climbingType, locale),
        lengthLabel: cleanOptional(route.lengthOriginal),
        pitchesLabel:
          route.pitches === undefined
            ? undefined
            : locale === "zh"
              ? `${route.pitches} 段`
              : `${route.pitches} ${route.pitches === 1 ? "pitch" : "pitches"}`
      },
      badges: {
        isPublishedPick,
        verificationLabel: verificationLabel(route, locale)
      },
      routeSources: sourceResult.sources.filter(
        (source) => source.purpose === "route"
      ),
      accessSources: sourceResult.sources.filter(
        (source) => source.purpose === "access"
      ),
      externalResources: resourceResult.resources,
      publishedEditorial,
      media:
        mediaResult.routeImages.length || mediaResult.contextImages.length
          ? {
              routeImages: mediaResult.routeImages,
              contextImages: mediaResult.contextImages
            }
          : undefined
    },
    diagnostics: {
      duplicateResourcesRemoved: resourceResult.duplicatesRemoved,
      duplicateSourcesRemoved: sourceResult.duplicatesRemoved,
      invalidMedia: mediaResult.invalidMedia
    }
  };
}

function assertIdentity(route: RouteRecord, destination: Destination) {
  if (!route.id?.trim()) {
    throw new RouteViewModelBuildError("route-id-missing", "Route ID is required.");
  }
  if (!route.slug?.trim()) {
    throw new RouteViewModelBuildError(
      "route-slug-missing",
      `Route slug is required for ${route.destinationId}:${route.id}.`
    );
  }
  if (!route.name?.trim()) {
    throw new RouteViewModelBuildError(
      "route-name-missing",
      `Route name is required for ${route.destinationId}:${route.id}.`
    );
  }
  if (!route.destinationId?.trim() || !destination?.slug?.trim()) {
    throw new RouteViewModelBuildError(
      "destination-missing",
      `Destination association is required for route ${route.id}.`
    );
  }
  if (route.destinationId !== destination.slug) {
    throw new RouteViewModelBuildError(
      "destination-mismatch",
      `Route ${route.id} belongs to ${route.destinationId}, not ${destination.slug}.`
    );
  }
}

function cleanOptional(value: string | undefined) {
  return value?.trim() || undefined;
}

function localized(value: LocalizedText | undefined, locale: Locale) {
  return value?.[locale]?.trim() || value?.en?.trim() || value?.zh?.trim();
}

function localizedList(values: LocalizedText[] | undefined, locale: Locale) {
  const result = (values ?? [])
    .map((value) => localized(value, locale))
    .filter((value): value is string => Boolean(value));
  return result.length ? result : undefined;
}

function buildPublishedEditorial(route: RouteRecord, locale: Locale) {
  const editorial = route.editorial;
  const notableAscents = (editorial.notableAscents ?? []).map((ascent) => ({
    climber: ascent.climber,
    note: localized(ascent.note, locale),
    sourceLabel: ascent.sourceLabel,
    sourceUrl: ascent.sourceUrl
  }));

  return {
    summary: localized(editorial.summary, locale),
    whyItStandsOut: localized(editorial.whyItStandsOut, locale),
    bestFor: localized(editorial.bestForText, locale),
    decisionHint: localized(editorial.decisionHint, locale),
    thingsToConsider: localizedList(editorial.thingsToConsider, locale),
    practiceFocus: localizedList(editorial.practiceFocus, locale),
    personalityTags:
      editorial.personalityTags?.length ? editorial.personalityTags : undefined,
    historicalNote: localized(editorial.historicalNotes, locale),
    notableAscents: notableAscents.length ? notableAscents : undefined
  };
}

function inferSourcePurpose(source: RouteSourceRecord): RouteSourcePurpose {
  if (source.purpose) return source.purpose;
  const fields = source.verifiedFields.map((field) => field.toLowerCase());
  const hasRouteFact = fields.some((field) =>
    /(?:^|\b)(?:name|grade|length|type|sector|route|first ascent|history)(?:\b|$)/.test(
      field
    )
  );

  if (fields.some((field) => field.includes("image license"))) return "media";
  if (hasRouteFact) return "route";
  if (fields.some((field) => field.includes("access"))) return "access";
  if (fields.some((field) => /area|destination|local context/.test(field))) {
    return "area";
  }
  return source.sourceType === "official" ? "access" : "route";
}

export function canonicalizePublicUrl(value: string) {
  try {
    const url = new URL(value.trim());
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    url.hash = "";
    for (const key of Array.from(url.searchParams.keys())) {
      if (/^(?:utm_.+|fbclid|gclid)$/i.test(key)) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.trim().replace(/\/+$/, "").toLowerCase();
  }
}

function publicPurpose(purpose: RouteSourcePurpose): "route" | "access" {
  return purpose === "route" ? "route" : "access";
}

function sourceKey(source: RouteSourceRecord, purpose: "route" | "access") {
  return source.externalId
    ? `${purpose}:id:${source.provider}:${source.externalId}`
    : `${purpose}:url:${canonicalizePublicUrl(source.sourceUrl)}`;
}

function buildSources(sourceRecords: RouteSourceRecord[], locale: Locale) {
  const sourceMap = new Map<
    string,
    { priority: number; source: PublicSourceViewModel }
  >();
  let duplicatesRemoved = 0;

  for (const record of sourceRecords) {
    const inferredPurpose = inferSourcePurpose(record);
    if (inferredPurpose === "media") continue;
    const purpose = publicPurpose(inferredPurpose);
    const key = sourceKey(record, purpose);
    const priority = sourceDisplayPriority(record, inferredPurpose);
    const candidate = {
      attribution: cleanOptional(record.attribution),
      checkedAtLabel: record.checkedAt
        ? formatCheckedDate(record.checkedAt, locale)
        : undefined,
      label: record.label.trim(),
      license: cleanOptional(record.license),
      purpose,
      url: record.sourceUrl
    } satisfies PublicSourceViewModel;
    const existing = sourceMap.get(key);

    if (existing) {
      duplicatesRemoved += 1;
      if (priority > existing.priority) sourceMap.set(key, { priority, source: candidate });
    } else {
      sourceMap.set(key, { priority, source: candidate });
    }
  }

  const entries = Array.from(sourceMap.values()).sort(
    (first, second) =>
      second.priority - first.priority ||
      first.source.label.localeCompare(second.source.label)
  );

  return {
    sources: entries.map((entry) => entry.source),
    canonicalKeys: new Set(
      entries.map(
        ({ source }) =>
          `${source.purpose}:url:${canonicalizePublicUrl(source.url)}`
      )
    ),
    duplicatesRemoved
  };
}

function sourceDisplayPriority(
  source: RouteSourceRecord,
  purpose: RouteSourcePurpose
) {
  const purposePriority = { route: 400, access: 300, area: 200, media: 100 }[
    purpose
  ];
  const trustPriority = { high: 30, medium: 20, low: 10 }[source.trustLevel];
  return purposePriority + trustPriority;
}

function resourcePurpose(
  type: ExternalResourceType,
  status: ExternalLinkStatus | undefined
): ExternalResourceViewModel["purpose"] {
  if (status === "route-specific" || status === "guidebook-specific") {
    return "route";
  }
  if (status === "area-only" || type === "official") return "access";
  return "supplemental";
}

function buildResources(
  route: RouteRecord,
  locale: Locale,
  sourceKeys: ReadonlySet<string>
) {
  const resources = new Map<string, ExternalResourceViewModel>();
  let duplicatesRemoved = 0;

  for (const resource of route.externalResources) {
    if (resource.linkStatus === "needs-upgrade") continue;
    const purpose = resourcePurpose(resource.type, resource.linkStatus);
    const canonicalUrl = canonicalizePublicUrl(resource.url);
    const sourcePurpose = purpose === "access" ? "access" : "route";
    const sourceDuplicateKey = `${sourcePurpose}:url:${canonicalUrl}`;

    if (purpose !== "supplemental" && sourceKeys.has(sourceDuplicateKey)) {
      duplicatesRemoved += 1;
      continue;
    }

    const key = `${purpose}:${canonicalUrl}`;
    if (resources.has(key)) {
      duplicatesRemoved += 1;
      continue;
    }

    resources.set(key, {
      description: localized(resource.description, locale),
      linkStatusLabel: linkStatusLabel(resource.linkStatus, locale),
      purpose,
      title: resource.title,
      typeLabel: resourceTypeLabel(resource.type, locale),
      url: resource.url
    });
  }

  return { resources: Array.from(resources.values()), duplicatesRemoved };
}

function buildMedia(media: RouteMediaRecord[]) {
  const routeImages: PublicMediaViewModel[] = [];
  const contextImages: PublicMediaViewModel[] = [];
  const invalidMedia: RouteDetailBuildDiagnostics["invalidMedia"] = [];

  for (const image of media) {
    const missing = [
      ["src", image.src],
      ["alt", image.alt],
      ["credit", image.credit],
      ["license", image.license],
      ["sourceUrl", image.sourceUrl]
    ].filter(([, value]) => !value?.trim());

    if (missing.length > 0) {
      invalidMedia.push({
        src: image.src || undefined,
        reason: `Missing ${missing.map(([field]) => field).join(", ")}.`
      });
      continue;
    }

    const publicImage: PublicMediaViewModel = {
      alt: image.alt,
      attribution: image.credit,
      caption: cleanOptional(image.caption),
      kind: image.kind,
      license: image.license,
      sourceUrl: image.sourceUrl,
      src: image.src
    };

    if (image.kind === "route") routeImages.push(publicImage);
    else contextImages.push(publicImage);
  }

  return { routeImages, contextImages, invalidMedia };
}

function verificationLabel(route: RouteRecord, locale: Locale) {
  if (route.verification.status === "verified") {
    return locale === "zh" ? "已核验事实" : "Verified facts";
  }
  if (route.verification.status === "source-backed") {
    return locale === "zh" ? "有来源可查" : "Sources available";
  }
  return undefined;
}

function linkStatusLabel(
  status: ExternalLinkStatus | undefined,
  locale: Locale
) {
  if (status === "route-specific") {
    return locale === "zh" ? "精确线路页" : "Exact route page";
  }
  if (status === "guidebook-specific") {
    return locale === "zh" ? "路书资源" : "Guidebook resource";
  }
  if (status === "area-only") {
    return locale === "zh" ? "区域与访问资源" : "Area and access resource";
  }
  return undefined;
}

function resourceTypeLabel(type: ExternalResourceType, locale: Locale) {
  const labels: Record<ExternalResourceType, { en: string; zh: string }> = {
    official: { en: "Official resource", zh: "官方资源" },
    "history/article": { en: "Article", zh: "文章" },
    "route-database": { en: "Route database", zh: "线路数据库" },
    "guidebook/resource": { en: "Guidebook resource", zh: "路书资源" },
    "video/beta": { en: "External video", zh: "外部视频" }
  };
  return labels[type][locale];
}
