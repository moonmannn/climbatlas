import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const csvPath = path.join(projectRoot, "src", "data", "route-metadata.csv");
const outputPath = path.join(projectRoot, "src", "data", "generatedRouteMetadata.ts");

const requiredFields = [
  "destinationSlug",
  "routeId",
  "name",
  "grade",
  "type",
  "length",
  "sector",
  "sourceLabel",
  "sourceUrl",
  "externalTitle",
  "externalUrl",
  "externalType",
  "externalLinkStatus",
  "trustLevel",
  "recordKind",
  "publicationStatus",
  "notes"
];

const allowedTypes = new Set(["sport", "trad", "boulder", "multi-pitch"]);
const allowedExternalTypes = new Set([
  "official",
  "history/article",
  "route-database",
  "guidebook/resource",
  "video/beta"
]);
const allowedTrustLevels = new Set(["high", "medium", "low"]);
const allowedExternalLinkStatuses = new Set([
  "route-specific",
  "guidebook-specific",
  "area-only",
  "needs-upgrade"
]);
const allowedRecordKinds = new Set(["route", "area-index"]);
const allowedPublicationStatuses = new Set(["published", "hidden"]);

const knownAreaIndexRouteIds = new Set([
  "bas-cuvier-fontainebleau",
  "bronaugh-wall-red-river-gorge",
  "bulletheads-squamish",
  "chocolate-factory-red-river-gorge",
  "drive-by-crag-red-river-gorge",
  "ghost-kitchen-kalymnos",
  "grande-grotta-kalymnos",
  "motherlode-red-river-gorge",
  "odyssey-kalymnos",
  "pet-wall-squamish",
  "pocket-wall-kalymnos",
  "sikati-cave-kalymnos",
  "solar-collector-red-river-gorge",
  "spartacus-sector-kalymnos"
]);

const forbiddenPatterns = [
  /\bapproach\b/i,
  /\bdescent\b/i,
  /\bprotection\b/i,
  /\bgear\s*beta\b/i,
  /\bmove\s*sequence\b/i,
  /\btopo\b/i,
  /\brating\b/i,
  /\bcomments?\b/i
];

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (character === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current);
  return values;
}

function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  const headers = parseCsvLine(lines[0]);

  for (const field of requiredFields) {
    if (!headers.includes(field)) {
      throw new Error(`Missing required CSV column: ${field}`);
    }
  }

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex]?.trim() ?? "";
    });

    row.__line = index + 2;
    return row;
  });
}

function assertUrl(value, label, line) {
  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("URL must use http or https");
    }
  } catch {
    throw new Error(`Line ${line}: ${label} must be a valid URL`);
  }
}

function validateRows(rows) {
  const seenIds = new Set();

  for (const row of rows) {
    for (const field of requiredFields) {
      if (!row[field]) {
        throw new Error(`Line ${row.__line}: missing ${field}`);
      }
    }

    if (seenIds.has(row.routeId)) {
      throw new Error(`Line ${row.__line}: duplicate routeId ${row.routeId}`);
    }

    seenIds.add(row.routeId);

    if (!allowedTypes.has(row.type)) {
      throw new Error(`Line ${row.__line}: invalid type ${row.type}`);
    }

    if (!allowedExternalTypes.has(row.externalType)) {
      throw new Error(`Line ${row.__line}: invalid externalType ${row.externalType}`);
    }

    if (!allowedTrustLevels.has(row.trustLevel)) {
      throw new Error(`Line ${row.__line}: invalid trustLevel ${row.trustLevel}`);
    }

    if (!allowedExternalLinkStatuses.has(row.externalLinkStatus)) {
      throw new Error(
        `Line ${row.__line}: invalid externalLinkStatus ${row.externalLinkStatus}`
      );
    }

    if (!allowedRecordKinds.has(row.recordKind)) {
      throw new Error(`Line ${row.__line}: invalid recordKind ${row.recordKind}`);
    }

    if (!allowedPublicationStatuses.has(row.publicationStatus)) {
      throw new Error(
        `Line ${row.__line}: invalid publicationStatus ${row.publicationStatus}`
      );
    }

    if (row.duplicateOf && row.duplicateOf === row.routeId) {
      throw new Error(`Line ${row.__line}: duplicateOf cannot reference itself`);
    }

    if (
      row.recordKind === "area-index" &&
      row.externalLinkStatus !== "area-only"
    ) {
      throw new Error(
        `Line ${row.__line}: area-index records must use area-only links`
      );
    }

    if (
      row.publicationStatus === "published" &&
      row.externalLinkStatus === "needs-upgrade"
    ) {
      throw new Error(`Line ${row.__line}: needs-upgrade records must stay hidden`);
    }

    if (
      row.publicationStatus === "published" &&
      row.recordKind === "route" &&
      row.externalLinkStatus === "area-only"
    ) {
      throw new Error(
        `Line ${row.__line}: published routes need a route-specific or guidebook-specific link`
      );
    }

    if (
      row.publicationStatus === "published" &&
      row.recordKind === "route" &&
      row.trustLevel === "low"
    ) {
      throw new Error(`Line ${row.__line}: low-trust route records must stay hidden`);
    }

    assertUrl(row.sourceUrl, "sourceUrl", row.__line);
    assertUrl(row.externalUrl, "externalUrl", row.__line);

    const externalUrl = new URL(row.externalUrl);

    if (
      row.externalLinkStatus === "route-specific" &&
      externalUrl.hostname.includes("mountainproject.com") &&
      !externalUrl.pathname.startsWith("/route/")
    ) {
      throw new Error(
        `Line ${row.__line}: Mountain Project route-specific links must use /route/`
      );
    }

    if (
      row.externalLinkStatus === "area-only" &&
      externalUrl.hostname.includes("mountainproject.com") &&
      externalUrl.pathname.startsWith("/route/")
    ) {
      throw new Error(
        `Line ${row.__line}: Mountain Project /route/ links should not be marked area-only`
      );
    }

    for (const field of ["name", "grade", "length", "sector"]) {
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(row[field])) {
          throw new Error(
            `Line ${row.__line}: forbidden guidebook/beta term in ${field}`
          );
        }
      }
    }
  }
}

function summarizeRows(rows) {
  const publishedRows = rows.filter(
    (row) => row.publicationStatus === "published"
  );
  const statusCounts = publishedRows.reduce((counts, row) => {
    counts[row.externalLinkStatus] = (counts[row.externalLinkStatus] ?? 0) + 1;
    return counts;
  }, {});

  const areaOnlyRows = publishedRows.filter(
    (row) => row.externalLinkStatus === "area-only"
  );
  const retainedAreaIndexes = areaOnlyRows
    .filter(
      (row) =>
        knownAreaIndexRouteIds.has(row.routeId) ||
        row.length.toLowerCase().includes("sector index") ||
        row.notes.toLowerCase().includes("area or sector index")
    )
    .map((row) => `${row.destinationSlug}:${row.routeId}`);
  const singleRouteCandidates = areaOnlyRows
    .filter(
      (row) =>
        !knownAreaIndexRouteIds.has(row.routeId) &&
        !row.length.toLowerCase().includes("sector index") &&
        !row.notes.toLowerCase().includes("area or sector index")
    )
    .map((row) => `${row.destinationSlug}:${row.routeId}`);

  return { retainedAreaIndexes, singleRouteCandidates, statusCounts };
}

function toStringLiteral(value) {
  return JSON.stringify(value);
}

function buildRoute(row) {
  const externalDescription = {
    en: "External resource for current route research. ClimbAtlas does not copy beta, comments, ratings, or photos.",
    zh: "外部资料入口，用于查看最新线路信息。ClimbAtlas 不复制 beta、评论、评分或图片。"
  };

  return `    {
      id: ${toStringLiteral(row.routeId)},
      name: ${toStringLiteral(row.name)},
      grade: ${toStringLiteral(row.grade)},
      type: ${toStringLiteral(row.type)} as const,
      length: ${toStringLiteral(row.length)},
      sector: ${toStringLiteral(row.sector)},
      status: "metadata" as const,
      metadataKind: ${toStringLiteral(row.recordKind)} as const,
      style: ${toStringLiteral(`${row.type} metadata entry for ${row.sector}.`)},
      summary: ${toStringLiteral("Metadata-only route index entry with outbound sources. ClimbAtlas does not publish beta for this line.")},
      practiceFocus: ["source check", "route selection", "local update"],
      bestFor: "Climbers building a destination shortlist before opening current external resources.",
      personalityTags: ["Metadata index", "External links", "No beta"],
      decisionHint: "Use this entry to decide whether to research the route further in current external resources.",
      sources: [
        {
          sourceLabel: ${toStringLiteral(row.sourceLabel)},
          sourceUrl: ${toStringLiteral(row.sourceUrl)},
          lastChecked: ${toStringLiteral(new Date().toISOString().slice(0, 10))},
          type: "route-database-metadata" as const,
          trustLevel: ${toStringLiteral(row.trustLevel)} as const,
          verifies: ["name", "grade", "type", "sector"],
          notes: ${toStringLiteral(row.notes)}
        }
      ],
      images: [],
      editorialTips: [],
      externalResources: [
        {
          title: ${toStringLiteral(row.externalTitle)},
          url: ${toStringLiteral(row.externalUrl)},
          type: ${toStringLiteral(row.externalType)} as const,
          linkStatus: ${toStringLiteral(row.externalLinkStatus)} as const,
          description: {
            en: ${toStringLiteral(externalDescription.en)},
            zh: ${toStringLiteral(externalDescription.zh)}
          }
        }
      ],
      communityStatus: "coming-soon" as const
    }`;
}

function generate(rows) {
  const grouped = new Map();
  const publishedRows = rows.filter(
    (row) => row.publicationStatus === "published"
  );
  const aliasRows = rows.filter((row) => row.duplicateOf);

  for (const row of publishedRows) {
    if (!grouped.has(row.destinationSlug)) {
      grouped.set(row.destinationSlug, []);
    }

    grouped.get(row.destinationSlug).push(row);
  }

  const body = Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([destinationSlug, routeRows]) => {
      const routes = routeRows.map(buildRoute).join(",\n");

      return `  ${toStringLiteral(destinationSlug)}: [\n${routes}\n  ]`;
    })
    .join(",\n");

  const aliases = aliasRows
    .map(
      (row) =>
        `  ${toStringLiteral(`${row.destinationSlug}:${row.routeId}`)}: ${toStringLiteral(row.duplicateOf)}`
    )
    .join(",\n");

  return `import type { RouteHighlight } from "@/types/destination";

// This file is generated from src/data/route-metadata.csv.
// Run: node scripts/route-metadata.mjs
// Metadata routes are route index entries only; they must not contain copied beta.

export const metadataRoutesByDestination: Record<string, RouteHighlight[]> = {
${body}
};

export const metadataRouteAliases: Record<string, string> = {
${aliases}
};
`;
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
validateRows(rows);
fs.writeFileSync(outputPath, generate(rows));
const publishedCount = rows.filter(
  (row) => row.publicationStatus === "published"
).length;
console.log(
  `Generated ${publishedCount} published metadata entries; kept ${rows.length - publishedCount} hidden candidates in CSV.`
);

const { retainedAreaIndexes, singleRouteCandidates, statusCounts } = summarizeRows(rows);
console.log(
  `External link status: route-specific ${statusCounts["route-specific"] ?? 0}, ` +
    `guidebook-specific ${statusCounts["guidebook-specific"] ?? 0}, ` +
    `area-only ${statusCounts["area-only"] ?? 0}, ` +
    `needs-upgrade ${statusCounts["needs-upgrade"] ?? 0}.`
);

if (singleRouteCandidates.length > 0) {
  console.log("Area-only single-route candidates still needing exact-link review:");
  console.log(singleRouteCandidates.map((entry) => `- ${entry}`).join("\n"));
}

if (retainedAreaIndexes.length > 0) {
  console.log("Area/sector indexes intentionally retained as area-only:");
  console.log(retainedAreaIndexes.map((entry) => `- ${entry}`).join("\n"));
}
