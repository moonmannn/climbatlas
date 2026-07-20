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
  RouteFormat,
  RouteRecord,
  RouteSourcePurpose,
  RouteSourceRecord
} from "@/types/route";

export type PublicSourceViewModel = {
  attribution?: string;
  checkedAtLabel?: string;
  label: string;
  license?: string;
  purpose: Exclude<RouteSourcePurpose, "media" | "unknown">;
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
    routeFormatLabel?: string;
  };
  badges: {
    isPublishedPick: boolean;
    verificationLabel?: string;
  };
  routeSources: PublicSourceViewModel[];
  accessSources: PublicSourceViewModel[];
  contextSources: PublicSourceViewModel[];
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
  unknownSources: Array<{ label: string; url: string }>;
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
    (source) => source.purpose === "route-reference"
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
        lengthLabel: formatLength(route, locale),
        pitchesLabel: formatPitches(route, locale),
        routeFormatLabel: formatRouteFormat(
          route.routeFormat,
          route.climbingType,
          locale
        )
      },
      badges: {
        isPublishedPick,
        verificationLabel: verificationLabel(route, locale)
      },
      routeSources: sourceResult.sources.filter(
        (source) => source.purpose === "route-reference"
      ),
      accessSources: sourceResult.sources.filter(
        (source) => source.purpose === "access"
      ),
      contextSources: sourceResult.sources.filter(
        (source) =>
          source.purpose === "destination-context" ||
          source.purpose === "history"
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
      invalidMedia: mediaResult.invalidMedia,
      unknownSources: sourceResult.unknownSources
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

function factNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
    maximumFractionDigits: 1
  }).format(value);
}

function formatLength(route: RouteRecord, locale: Locale) {
  const values = [
    route.lengthMeters === undefined
      ? undefined
      : `${factNumber(route.lengthMeters, locale)} m`,
    route.lengthFeet === undefined
      ? undefined
      : `${factNumber(route.lengthFeet, locale)} ft`
  ].filter((value): value is string => Boolean(value));

  if (values.length === 0) return undefined;
  const prefix = route.lengthQualifier === "approximate"
    ? locale === "zh" ? "约 " : "about "
    : "";
  return `${prefix}${values.join(" · ")}`;
}

function formatPitches(route: RouteRecord, locale: Locale) {
  if (route.pitchCount === undefined) return undefined;
  const prefix = route.pitchQualifier === "approximate"
    ? locale === "zh" ? "约 " : "about "
    : "";
  return locale === "zh"
    ? `${prefix}${factNumber(route.pitchCount, locale)} 段`
    : `${prefix}${factNumber(route.pitchCount, locale)} ${route.pitchCount === 1 ? "pitch" : "pitches"}`;
}

function formatRouteFormat(
  routeFormat: RouteFormat | undefined,
  climbingType: RouteRecord["climbingType"],
  locale: Locale
) {
  if (!routeFormat) return undefined;
  if (
    (routeFormat === "boulder-problem" && climbingType === "boulder") ||
    (routeFormat === "multi-pitch" && climbingType === "multi-pitch") ||
    (routeFormat === "alpine-objective" && climbingType === "alpine")
  ) {
    return undefined;
  }

  const labels: Record<RouteFormat, { en: string; zh: string }> = {
    "boulder-problem": { en: "Boulder problem", zh: "抱石线路" },
    "single-pitch": { en: "Single pitch", zh: "单段线路" },
    "multi-pitch": { en: "Multi-pitch", zh: "多段线路" },
    "big-wall": { en: "Big wall", zh: "大岩壁线路" },
    "alpine-objective": { en: "Alpine objective", zh: "高山线路" }
  };
  return labels[routeFormat][locale];
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

function sourceKey(source: RouteSourceRecord, purpose: RouteSourcePurpose) {
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
  const unknownSources: Array<{ label: string; url: string }> = [];

  for (const record of sourceRecords) {
    if (record.purpose === "media") continue;
    if (record.purpose === "unknown") {
      unknownSources.push({ label: record.label, url: record.sourceUrl });
      continue;
    }
    const purpose = record.purpose;
    const key = sourceKey(record, purpose);
    const priority = sourceDisplayPriority(record, purpose);
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
    duplicatesRemoved,
    unknownSources
  };
}

function sourceDisplayPriority(
  source: RouteSourceRecord,
  purpose: RouteSourcePurpose
) {
  const purposePriority: Record<RouteSourcePurpose, number> = {
    "route-reference": 500,
    access: 400,
    "destination-context": 300,
    history: 200,
    media: 100,
    unknown: 0
  };
  const trustPriority = { high: 30, medium: 20, low: 10 }[source.trustLevel];
  return purposePriority[purpose] + trustPriority;
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
    const sourcePurpose =
      purpose === "access" ? "access" : "route-reference";
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
