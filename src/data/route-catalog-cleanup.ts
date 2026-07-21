import type {
  ExternalResource,
  RouteHighlight,
  RouteSource
} from "@/types/destination";
import type { RouteSourcePurpose } from "@/types/route";

export type RouteCatalogCleanupAction =
  | "keep"
  | "alias"
  | "area-index"
  | "hidden";

type RoutePatch = Partial<
  Pick<
    RouteHighlight,
    "name" | "grade" | "type" | "length" | "sector" | "status" | "metadataKind"
  >
>;

export type RouteCatalogCleanupRule = {
  destinationSlug: string;
  routeId: string;
  action: RouteCatalogCleanupAction;
  reason: string;
  canonicalRouteId?: string;
  patch?: RoutePatch;
  replaceSources?: RouteSource[];
  appendSources?: RouteSource[];
  replaceExternalResources?: ExternalResource[];
  appendExternalResources?: ExternalResource[];
  sourcePurposeByUrl?: Record<string, RouteSourcePurpose>;
};

export type RouteCatalogCleanupConflict = {
  routeKey: string;
  field: string;
  selectedValue: string;
  candidates: Array<{ value: string; source: string }>;
  resolution: "source-priority";
  rationale: string;
};

type SourceSpec = {
  label: string;
  url: string;
  verifies: string[];
  linkStatus?: ExternalResource["linkStatus"];
  purpose?: RouteSourcePurpose;
  type?: RouteSource["type"];
  trustLevel?: RouteSource["trustLevel"];
  externalType?: ExternalResource["type"];
};

const checkedAt = "2026-07-21";

function toSource(spec: SourceSpec): RouteSource {
  return {
    sourceLabel: spec.label,
    sourceUrl: spec.url,
    lastChecked: checkedAt,
    type: spec.type ?? "route-database-metadata",
    trustLevel: spec.trustLevel ?? "medium",
    verifies: spec.verifies,
    notes:
      "Metadata reference only. ClimbAtlas does not copy route descriptions, beta, ratings, comments, or photos.",
    purpose: spec.purpose ?? "route-reference"
  };
}

function toResource(spec: SourceSpec): ExternalResource | undefined {
  if (!spec.linkStatus) return undefined;
  return {
    title: spec.label,
    url: spec.url,
    type: spec.externalType ?? "route-database",
    linkStatus: spec.linkStatus,
    description: {
      en: "Open this external resource for current details. ClimbAtlas only records traceable metadata here.",
      zh: "前往外部资料查看最新信息；ClimbAtlas 在此仅记录可追溯的基础数据。"
    }
  };
}

function resources(specs: SourceSpec[]) {
  return specs.map(toResource).filter((item): item is ExternalResource => Boolean(item));
}

function keep(
  destinationSlug: string,
  routeId: string,
  reason: string,
  patch: RoutePatch,
  specs: SourceSpec[]
): RouteCatalogCleanupRule {
  return {
    destinationSlug,
    routeId,
    action: "keep",
    reason,
    patch,
    replaceSources: specs.map(toSource),
    replaceExternalResources: resources(specs)
  };
}

function areaIndex(
  destinationSlug: string,
  routeId: string,
  name: string,
  sector: string,
  reason: string,
  spec: SourceSpec
): RouteCatalogCleanupRule {
  return {
    destinationSlug,
    routeId,
    action: "area-index",
    reason,
    patch: {
      name,
      grade: "",
      length: "",
      sector,
      status: "metadata",
      metadataKind: "area-index"
    },
    replaceSources: [toSource({ ...spec, purpose: "destination-context" })],
    replaceExternalResources: resources([{ ...spec, linkStatus: "area-only" }])
  };
}

function alias(
  destinationSlug: string,
  routeId: string,
  canonicalRouteId: string,
  reason: string
): RouteCatalogCleanupRule {
  return { destinationSlug, routeId, canonicalRouteId, action: "alias", reason };
}

function hidden(
  destinationSlug: string,
  routeId: string,
  reason: string
): RouteCatalogCleanupRule {
  return { destinationSlug, routeId, action: "hidden", reason };
}

const montBlancOverview: SourceSpec = {
  label: "A concern for climbers: Mont Blanc routes",
  url: "https://guides-montagne.org/sites/default/files/mtblanc-en.pdf",
  verifies: ["name", "grade"],
  linkStatus: "guidebook-specific",
  type: "official",
  trustLevel: "high",
  externalType: "official"
};

const rocklandsSportList: SourceSpec = {
  label: "8a.nu: Rocklands sport route list",
  url: "https://www.8a.nu/areas/south-africa/rocklands/sportclimbing",
  verifies: ["name", "grade", "type", "sector"],
  linkStatus: "area-only"
};

const grampiansPlaceholders = [
  "bundaleer-route-line-grampians",
  "rosea-route-line-grampians",
  "summerday-valley-line-grampians",
  "gallery-route-line-grampians",
  "kindergarten-route-line-grampians",
  "citadel-route-line-grampians",
  "fortress-route-line-grampians",
  "red-rocks-route-line-grampians",
  "victoria-range-line-grampians",
  "andersens-route-line-grampians",
  "stapylton-bouldering-line-grampians",
  "northern-grampians-sport-line",
  "sandstone-pocket-line-grampians",
  "orange-wall-line-grampians",
  "cave-traverse-line-grampians",
  "sandbag-classic-line-grampians",
  "halls-gap-route-line-grampians",
  "hollow-mountain-warmup-line-grampians",
  "taipan-project-line-grampians",
  "watchtower-route-line-grampians",
  "southern-sandstone-line-grampians"
] as const;

const unverifiedLimingRoutes = [
  "kung-fu-fighter-liming",
  "pillar-of-dreams-liming",
  "climb-like-a-girl-liming",
  "lightning-crack-liming"
] as const;

export const routeCatalogCleanupRules: RouteCatalogCleanupRule[] = [
  {
    destinationSlug: "yosemite-usa",
    routeId: "steck-salathe-route-sentinel-rock",
    action: "keep",
    reason: "Retain the richer canonical record and add its exact route database reference.",
    appendSources: [
      toSource({
        label: "Mountain Project: Steck-Salathe",
        url: "https://www.mountainproject.com/route/105862873/steck-salathe",
        verifies: ["name", "grade", "type", "sector"],
        linkStatus: "route-specific"
      })
    ],
    appendExternalResources: resources([
      {
        label: "Mountain Project: Steck-Salathe",
        url: "https://www.mountainproject.com/route/105862873/steck-salathe",
        verifies: ["name", "grade", "type", "sector"],
        linkStatus: "route-specific"
      }
    ])
  },
  alias(
    "yosemite-usa",
    "steck-salathe-yosemite",
    "steck-salathe-route-sentinel-rock",
    "Duplicate metadata record; the richer route record is canonical."
  ),
  areaIndex(
    "railay-tonsai-thailand",
    "wee-s-present-wall-route-line-railay-tonsai",
    "Wee's Present Wall",
    "Railay",
    "This is a cliff containing multiple routes, not one route.",
    {
      label: "theCrag: Wee's Present Wall",
      url: "https://www.thecrag.com/en/climbing/thailand/krabi/area/15687769",
      verifies: ["area identity", "climbing type"]
    }
  ),
  alias(
    "railay-tonsai-thailand",
    "wee-present-wall-line-railay",
    "wee-s-present-wall-route-line-railay-tonsai",
    "Duplicate wall-level placeholder; resolve to the canonical area index."
  ),
  keep(
    "squamish-canada",
    "grand-wall-squamish",
    "Replace descriptive pseudo-grade and length with route-specific metadata.",
    { grade: "5.11a", length: "9 pitches, about 300 m", sector: "The Chief" },
    [{
      label: "theCrag: The Grand Wall",
      url: "https://www.thecrag.com/en/climbing/canada/squamish/the-chief/route/14804989",
      verifies: ["name", "grade", "type", "length", "pitches", "sector"],
      linkStatus: "route-specific"
    }]
  ),
  keep(
    "squamish-canada",
    "banana-peel-squamish",
    "Replace descriptive pseudo-grade and length with route-specific metadata.",
    { grade: "5.7", length: "8 pitches, about 250 m", sector: "South Apron" },
    [{
      label: "theCrag: Banana Peel",
      url: "https://www.thecrag.com/en/climbing/canada/squamish/the-chief/route/17558419",
      verifies: ["name", "grade", "type", "length", "pitches", "sector"],
      linkStatus: "route-specific"
    }]
  ),
  keep(
    "squamish-canada",
    "split-pillar-squamish",
    "Retain the named Grand Wall feature with source-backed grade and length.",
    { grade: "5.10b", length: "about 45 m", sector: "The Grand Wall" },
    [{
      label: "theCrag: Grand Wall route listing",
      url: "https://www.thecrag.com/en/climbing/canada/squamish/the-chief/area/12719137",
      verifies: ["name", "grade", "length", "sector"],
      linkStatus: "area-only"
    }]
  ),
  keep(
    "chamonix-france",
    "midi-plan-traverse-chamonix",
    "Replace descriptive pseudo-grade with a sourced IFAS grade.",
    { grade: "AD", length: "about 200 m", sector: "Aiguille du Midi" },
    [{
      label: "theCrag: Aiguille du Midi route listing",
      url: "https://www.thecrag.com/en/climbing/france/aiguille-du-midi",
      verifies: ["name", "grade", "length", "sector"],
      linkStatus: "area-only"
    }]
  ),
  keep(
    "chamonix-france",
    "gouter-route-mont-blanc",
    "Replace descriptive pseudo-grade with a sourced IFAS grade.",
    { grade: "PD", length: "", sector: "Mont Blanc" },
    [{
      label: "theCrag: Goûter Route",
      url: "https://www.thecrag.com/fr/grimper/france/mont-blanc/route/15874969",
      verifies: ["name", "grade", "type", "sector"],
      linkStatus: "route-specific"
    }]
  ),
  ...[
    ["grands-mulets-route-mont-blanc", "PD+"],
    ["aiguilles-grises-route-mont-blanc", "PD+"],
    ["miage-bionnassay-mont-blanc-crossing", "AD"]
  ].map(([routeId, grade]) =>
    keep(
      "chamonix-france",
      routeId,
      "Replace descriptive pseudo-grade with the IFAS grade in the official Mont Blanc overview.",
      { grade, length: "", sector: "Mont Blanc" },
      [montBlancOverview]
    )
  ),
  keep(
    "chamonix-france",
    "mallory-porter-aiguille-du-midi",
    "Replace descriptive pseudo-grade with a route-specific IFAS grade.",
    { grade: "AD+", length: "", sector: "Aiguille du Midi" },
    [{
      label: "UKHillwalking: Mallory-Porter",
      url: "https://www.ukhillwalking.com/logbook/crags/aiguille_du_midi-1985/mallory-porter-123660",
      verifies: ["name", "grade", "sector"],
      linkStatus: "route-specific"
    }]
  ),
  keep(
    "chamonix-france",
    "peuterey-integral-chamonix",
    "Replace descriptive pseudo-grade with a route-specific IFAS grade.",
    { grade: "ED1", length: "", sector: "Mont Blanc" },
    [{
      label: "UKClimbing: Peutérey Integral",
      url: "https://www.ukclimbing.com/logbook/crags/mont_blanc-2000/peuterey_integral-54230",
      verifies: ["name", "grade", "sector"],
      linkStatus: "route-specific"
    }]
  ),
  keep(
    "rocklands-south-africa",
    "rubiks-cube-rocklands",
    "Verified as a sport route, not a boulder or sector.",
    { grade: "6a+", type: "sport", length: "", sector: "Cattle Rustler Sector" },
    [rocklandsSportList]
  ),
  keep(
    "rocklands-south-africa",
    "orange-plasma-rocklands",
    "Verified as a sport route, not a boulder or sector.",
    { grade: "6b+", type: "sport", length: "", sector: "Orange Plasma Wall" },
    [rocklandsSportList]
  ),
  keep(
    "rocklands-south-africa",
    "ceder-rouge-rocklands",
    "Verified as Cedar Rouge; retain the legacy ID for saved-route compatibility.",
    { name: "Cedar Rouge", grade: "24 (SA) / 7a", type: "sport", length: "about 16 m", sector: "Cedar Rouge Boulder" },
    [{
      label: "theCrag: Cedar Rouge",
      url: "https://www.thecrag.com/en/climbing/south-africa/rocklands/route/18551977",
      verifies: ["name", "grade", "type", "length", "sector"],
      linkStatus: "route-specific"
    }]
  ),
  keep(
    "rocklands-south-africa",
    "cattle-rustler-rocklands",
    "Verified as a named sport route inside Cattle Rustler Sector.",
    { grade: "6b", type: "sport", length: "", sector: "Cattle Rustler Sector" },
    [rocklandsSportList]
  ),
  keep(
    "liming-china",
    "air-china-liming",
    "Replace the generic concept source with an exact route record.",
    { grade: "5.13c/d", type: "trad", length: "about 25 m", sector: "Pillars Area" },
    [{
      label: "theCrag: Air China",
      url: "https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/route/1511897676",
      verifies: ["name", "grade", "type", "length", "sector"],
      linkStatus: "route-specific"
    }]
  ),
  keep(
    "liming-china",
    "japanese-cowboy-liming",
    "Replace the generic concept source with an exact route record.",
    { grade: "5.12c", type: "trad", length: "about 30 m", sector: "Dinner Wall" },
    [{
      label: "theCrag: Japanese Cowboy",
      url: "https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/route/1512150342",
      verifies: ["name", "grade", "type", "length", "sector"],
      linkStatus: "route-specific"
    }]
  ),
  keep(
    "liming-china",
    "faraway-corner-liming",
    "Replace the generic concept source with its exact sector route listing.",
    { grade: "5.10+", type: "trad", length: "about 15 m", sector: "Pillars Area" },
    [{
      label: "theCrag: Pillars Area route listing",
      url: "https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/area/790080789",
      verifies: ["name", "grade", "type", "length", "sector"],
      linkStatus: "area-only"
    }]
  ),
  areaIndex(
    "liming-china",
    "the-guardian-liming",
    "The Guardian",
    "Guardian Valley",
    "This is a cliff containing multiple routes, not one route.",
    {
      label: "theCrag: The Guardian cliff",
      url: "https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/area/7204681818",
      verifies: ["area identity", "climbing type"]
    }
  ),
  alias(
    "liming-china",
    "guardian-wall-route-line-liming",
    "the-guardian-liming",
    "Generic wall-line placeholder duplicates The Guardian area index."
  ),
  areaIndex(
    "liming-china",
    "dinner-wall-route-line-liming",
    "Dinner Wall",
    "Liming",
    "This is a crag containing multiple routes, not one route.",
    {
      label: "theCrag: Dinner Wall",
      url: "https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/area/831401538",
      verifies: ["area identity", "climbing type"]
    }
  ),
  areaIndex(
    "liming-china",
    "pine-crest-route-line-liming",
    "Pinecrest Buttress",
    "Liming",
    "This is a crag containing multiple routes, not one route.",
    {
      label: "theCrag: Pinecrest Buttress",
      url: "https://www.thecrag.com/en/climbing/china/yunnan/liming-laojunshan/area/831401478",
      verifies: ["area identity", "climbing type"]
    }
  ),
  hidden(
    "liming-china",
    "great-arch-route-line-liming",
    "The available Great Arch record belongs to Getu, not Liming."
  ),
  ...unverifiedLimingRoutes.map((routeId) =>
    hidden(
      "liming-china",
      routeId,
      "No reliable single-route or clearly related guidebook record was found."
    )
  ),
  {
    destinationSlug: "squamish-canada",
    routeId: "dreamcatcher-squamish",
    action: "keep",
    reason: "Classify the athlete biography as history rather than a route reference.",
    sourcePurposeByUrl: {
      "https://en.wikipedia.org/wiki/Sean_McColl": "history"
    }
  },
  {
    destinationSlug: "margalef-spain",
    routeId: "mejorando-imagen-margalef",
    action: "keep",
    reason: "Classify the athlete biography as history rather than a route reference.",
    sourcePurposeByUrl: {
      "https://en.wikipedia.org/wiki/Ram%C3%B3n_Juli%C3%A1n": "history"
    }
  },
  ...grampiansPlaceholders.map((routeId) =>
    hidden(
      "grampians-australia",
      routeId,
      "Generic route-line placeholder without a verifiable single-route or exact area identity."
    )
  )
];

export const routeCatalogCleanupConflicts: RouteCatalogCleanupConflict[] = [
  {
    routeKey: "yosemite-usa:steck-salathe-route-sentinel-rock",
    field: "grade",
    selectedValue: "V 5.10a/b",
    candidates: [
      { value: "V 5.10a/b", source: "Wikipedia: Steck-Salathé Route" },
      { value: "5.10-", source: "Mountain Project: Steck-Salathe" }
    ],
    resolution: "source-priority",
    rationale: "Preserve the richer canonical record and report the disagreement instead of overwriting it."
  },
  {
    routeKey: "chamonix-france:grands-mulets-route-mont-blanc",
    field: "grade",
    selectedValue: "PD+",
    candidates: [
      { value: "PD+", source: "Official Mont Blanc route overview" },
      { value: "F", source: "theCrag: Mont Blanc area listing" }
    ],
    resolution: "source-priority",
    rationale: "Prefer the official route overview and retain the disagreement in the migration report."
  },
  {
    routeKey: "liming-china:faraway-corner-liming",
    field: "grade",
    selectedValue: "5.10+",
    candidates: [
      { value: "5.10+", source: "theCrag: Pillars Area route listing" },
      { value: "5.11a", source: "Mountain Project: Liming area listing" }
    ],
    resolution: "source-priority",
    rationale: "Prefer the exact sector listing and report the area-listing disagreement."
  }
];

export const routeCatalogCleanupByKey = new Map(
  routeCatalogCleanupRules.map((rule) => [
    `${rule.destinationSlug}:${rule.routeId}`,
    rule
  ])
);

export const cleanupRouteAliases = Object.fromEntries(
  routeCatalogCleanupRules
    .filter(
      (rule): rule is RouteCatalogCleanupRule & { canonicalRouteId: string } =>
        rule.action === "alias" && Boolean(rule.canonicalRouteId)
    )
    .map((rule) => [
      `${rule.destinationSlug}:${rule.routeId}`,
      rule.canonicalRouteId
    ])
) as Record<string, string>;

export const cleanupRetiredRouteKeys = new Set(
  routeCatalogCleanupRules
    .filter((rule) => rule.action === "hidden" || rule.action === "area-index")
    .map((rule) => `${rule.destinationSlug}:${rule.routeId}`)
);

function dedupeResources(items: ExternalResource[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.url}::${item.type}::${item.linkStatus ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function applyRouteCatalogCleanup(
  destinationSlug: string,
  route: RouteHighlight
): {
  action: RouteCatalogCleanupAction;
  route?: RouteHighlight;
  rule?: RouteCatalogCleanupRule;
} {
  const rule = routeCatalogCleanupByKey.get(`${destinationSlug}:${route.id}`);
  if (!rule) return { action: "keep", route };
  if (rule.action === "hidden" || rule.action === "alias") {
    return { action: rule.action, rule };
  }

  const purposeByUrl = rule.sourcePurposeByUrl ?? {};
  const baseSources = rule.replaceSources ?? route.sources.map((source) => ({
    ...source,
    purpose: purposeByUrl[source.sourceUrl] ?? source.purpose
  }));
  const baseResources = rule.replaceExternalResources ?? route.externalResources ?? [];

  return {
    action: rule.action,
    rule,
    route: {
      ...route,
      ...(rule.patch ?? {}),
      sources: [...baseSources, ...(rule.appendSources ?? [])],
      externalResources: dedupeResources([
        ...baseResources,
        ...(rule.appendExternalResources ?? [])
      ])
    }
  };
}

export function getCleanupRetirementHref(
  destinationSlug: string,
  routeId: string
) {
  return cleanupRetiredRouteKeys.has(`${destinationSlug}:${routeId}`)
    ? `/destinations/${destinationSlug}#all-routes`
    : undefined;
}

export function getCleanupRetiredRouteParams() {
  return Array.from(cleanupRetiredRouteKeys, (key) => {
    const separatorIndex = key.indexOf(":");
    return {
      slug: key.slice(0, separatorIndex),
      routeId: key.slice(separatorIndex + 1)
    };
  });
}
