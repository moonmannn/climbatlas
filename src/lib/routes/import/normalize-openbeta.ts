import type {
  OpenBetaRawClimbType,
  OpenBetaRawGrade,
  OpenBetaRawRoute
} from "@/types/route-import";
import type {
  GradeSystem,
  RouteClimbingType,
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

function routeGrade(grades: OpenBetaRawGrade | null, climbingType: RouteClimbingType) {
  const available = gradeFields.filter(([field]) => grades?.[field]?.trim());
  if (available.length === 0) return undefined;

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

  return {
    original: grades?.[primaryField]?.trim() ?? "",
    system: primarySystem,
    detectedSystems: available.map(([, system]) => system),
    equivalentGrades
  };
}

export function normalizeOpenBetaRoute(
  raw: OpenBetaRawRoute,
  destinationId: string,
  checkedAt: string
): RouteRecord | undefined {
  const name = raw.name.trim();
  const climbingType = routeType(raw.type);
  const grade = routeGrade(raw.grades, climbingType);

  if (!name || name === "[Redacted]" || !raw.uuid || !grade) return undefined;

  const id = `openbeta-${raw.uuid.toLowerCase()}`;
  const sourceUrl = `https://openbeta.io/climbs/${raw.uuid}`;
  const lengthMeters = raw.length > 0 ? raw.length : undefined;

  return {
    kind: "route",
    id,
    slug: id,
    name,
    destinationId,
    areaId: raw.areaUuid,
    areaName: raw.pathTokens.at(-2),
    sectorId: raw.areaUuid,
    sectorName: raw.areaName,
    cragName: raw.areaName,
    climbingType,
    grade,
    lengthOriginal: lengthMeters ? `${lengthMeters} m` : undefined,
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
      {
        provider: "openbeta",
        label: "OpenBeta route metadata",
        sourceUrl,
        externalId: raw.uuid,
        attribution: "OpenBeta contributors",
        license: "CC0-1.0",
        importedAt: checkedAt,
        checkedAt,
        sourceType: "route-database-metadata",
        trustLevel: "medium",
        verifiedFields: [
          "name",
          "grade",
          "climbingType",
          "lengthMeters",
          "sectorName"
        ],
        notes: "Imported from OpenBeta metadata only; descriptions and user content are excluded."
      }
    ],
    verification: {
      status: "source-backed",
      checkedAt,
      notes: "OpenBeta CC0 metadata; not independently field-verified by ClimbAtlas."
    },
    externalResources: [
      {
        title: "OpenBeta route page",
        url: sourceUrl,
        type: "route-database",
        linkStatus: "route-specific",
        description: {
          en: "Open the exact route page on OpenBeta.",
          zh: "前往 OpenBeta 查看这条线路的独立页面。"
        }
      }
    ],
    createdAt: checkedAt,
    updatedAt: checkedAt
  };
}
