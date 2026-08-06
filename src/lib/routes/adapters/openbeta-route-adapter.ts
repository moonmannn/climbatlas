import { parseRouteGrade } from "@/lib/routes/parse-route-grade";
import { normalizeRouteSource } from "@/lib/routes/adapters/normalize-route-source";
import type {
  OpenBetaRawClimbType,
  OpenBetaRawGrade,
  OpenBetaRawRoute
} from "@/types/route-import";
import type {
  GradeSystem,
  RouteClimbingType,
  RouteGrade,
  RouteRecord
} from "@/types/route";

const gradeFields: Array<[keyof OpenBetaRawGrade, GradeSystem]> = [
  ["yds", "yds"],
  ["vscale", "v-scale"],
  ["french", "french"],
  ["font", "font"],
  ["uiaa", "uiaa"],
  ["ewbank", "australian"],
  ["wi", "ice"]
];

function routeType(type: OpenBetaRawClimbType): RouteClimbingType {
  if (type.bouldering) return "boulder";
  if (type.sport) return "sport";
  if (type.trad) return "trad";
  if (type.alpine || type.snow) return "alpine";
  if (type.ice) return "ice";
  if (type.mixed) return "mixed";
  if (type.tr) return "top-rope";
  return "other";
}

function unknownGrade(): RouteGrade {
  return {
    original: "",
    comparisonStatus: "ambiguous",
    detectedSystems: [],
    filterBands: [],
    parseStatus: "unparsed",
    system: "unknown"
  };
}

function routeGrade(
  grades: OpenBetaRawGrade | null,
  climbingType: RouteClimbingType,
  destinationId: string
): RouteGrade {
  const available = gradeFields.filter(([field]) => grades?.[field]?.trim());
  if (available.length === 0) return unknownGrade();

  const preferredOrder =
    climbingType === "boulder"
      ? ["v-scale", "font", "yds", "french"]
      : ["yds", "french", "uiaa", "australian", "ice", "v-scale", "font"];
  const primary =
    preferredOrder
      .map((system) => available.find(([, candidate]) => candidate === system))
      .find(Boolean) ?? available[0];
  const [primaryField, primarySystem] = primary;
  const equivalentGrades = Object.fromEntries(
    available.map(([field, system]) => [system, grades?.[field]])
  );
  const original = grades?.[primaryField]?.trim() ?? "";
  const parsed = parseRouteGrade(original, destinationId, climbingType);

  return {
    ...parsed,
    system: primarySystem,
    detectedSystems: available.map(([, system]) => system),
    primarySystem,
    primaryDisplay: parsed.primaryDisplay ?? original,
    normalizedDifficulty: parsed.sortValue,
    equivalentGrades
  };
}

export function adaptOpenBetaRoute(
  raw: OpenBetaRawRoute,
  destinationId: string,
  checkedAt: string
): RouteRecord | undefined {
  const name = raw.name.trim();
  const climbingType = routeType(raw.type);

  if (!name || name === "[Redacted]" || !raw.uuid) return undefined;

  const grade = routeGrade(raw.grades, climbingType, destinationId);
  const id = `openbeta-${raw.uuid.toLowerCase()}`;
  const sourceUrl =
    raw.finalResolvedUrl ??
    raw.sourceUrl ??
    "https://github.com/OpenBeta/openbeta-graphql";
  const lengthMeters = raw.length > 0 ? raw.length : undefined;
  const normalizedHierarchy = raw.normalizedHierarchy;
  const sectorName = normalizedHierarchy
    ? normalizedHierarchy.sectorName
    : raw.areaName;
  const hasExactRouteLink = ["valid", "redirected"].includes(
    raw.linkStatus ?? "unverified"
  );
  const verifiedFields = [
    "name",
    "climbingType",
    ...(grade.original ? ["grade"] : []),
    ...(lengthMeters ? ["lengthMeters"] : []),
    ...(sectorName ? ["sectorName"] : [])
  ];

  return {
    kind: "route",
    id,
    slug: id,
    name,
    destinationId,
    areaId: normalizedHierarchy?.areaId ?? raw.areaUuid,
    areaName:
      normalizedHierarchy?.areaName ??
      raw.sourceHierarchy?.area ??
      raw.pathTokens.at(-2),
    sectorId: normalizedHierarchy ? normalizedHierarchy.sectorId : raw.areaUuid,
    sectorName,
    cragName:
      normalizedHierarchy?.cragName ?? raw.sourceHierarchy?.crag ?? raw.areaName,
    sourceHierarchy: raw.sourceHierarchy,
    normalizedHierarchy,
    climbingType,
    grade,
    lengthMeters,
    style: {
      terrainTags: [],
      movementTags: [],
      physicalTags: []
    },
    experienceTags: [],
    editorial: {
      tier: "index",
      status: "draft"
    },
    sourceRecords: [
      normalizeRouteSource({
        provider: "openbeta",
        label: "OpenBeta route metadata snapshot",
        sourceUrl,
        externalId: raw.uuid,
        sourceRelease: raw.sourceRelease,
        attribution: "OpenBeta contributors",
        license: "CC0-1.0",
        importedAt: checkedAt,
        checkedAt,
        sourceType: "route-database-metadata",
        trustLevel: "medium",
        verifiedFields,
        notes: "Imported from an OpenBeta metadata snapshot; descriptions and user content are excluded. The external ID preserves record-level provenance.",
        purpose: "route-reference"
      })
    ],
    verification: {
      status: "source-backed",
      checkedAt,
      notes: "OpenBeta CC0 metadata; not independently field-verified by ClimbAtlas."
    },
    externalResources: hasExactRouteLink
      ? [
          {
            title: "OpenBeta route page",
            url: sourceUrl,
            type: "route-database",
            linkStatus: "route-specific",
            description: {
              en: "Open the exact OpenBeta route page for current source information.",
              zh: "前往对应的 OpenBeta 线路页面查看当前来源信息。"
            }
          }
        ]
      : [],
    media: [],
    normalization: {
      adapter: "openbeta",
      factConflicts: []
    },
    createdAt: checkedAt,
    updatedAt: checkedAt
  };
}
