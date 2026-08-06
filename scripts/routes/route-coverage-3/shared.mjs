import { createHash } from "node:crypto";
import { createReadStream, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  asyncBufferFromFile,
  parquetMetadataAsync,
  parquetReadObjects,
  parquetSchema
} from "hyparquet";

export const IMPORT_COLUMNS = [
  "climb_id",
  "climb_name",
  "grade_yds",
  "grade_vscale",
  "grade_french",
  "is_sport",
  "is_trad",
  "is_boulder",
  "is_alpine",
  "is_top_rope",
  "country",
  "state_province",
  "region",
  "area",
  "crag",
  "length_meters"
];

export const FORBIDDEN_PARQUET_COLUMNS = [
  "bolts_count",
  "first_ascent",
  "safety",
  "description",
  "latitude",
  "longitude"
];

export function readJson(filename) {
  return JSON.parse(readFileSync(filename, "utf8"));
}

export function writeJson(filename, value) {
  writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function sha256Text(value) {
  return createHash("sha256").update(value).digest("hex");
}

export async function sha256File(filename) {
  const hash = createHash("sha256");

  await new Promise((resolve, reject) => {
    const stream = createReadStream(filename);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", resolve);
  });

  return hash.digest("hex");
}

function canonicalSchema(schema) {
  return schema.children.map((child) => ({
    name: child.element.name,
    type: child.element.type,
    repetitionType: child.element.repetition_type,
    typeLength: child.element.type_length ?? null,
    convertedType: child.element.converted_type ?? null,
    logicalType: child.element.logical_type?.type ?? null
  }));
}

export async function inspectParquet(filename) {
  const file = await asyncBufferFromFile(filename);
  const metadata = await parquetMetadataAsync(file);
  const schema = parquetSchema(metadata);
  const canonical = canonicalSchema(schema);

  return {
    file,
    rowCount: Number(metadata.num_rows),
    schema: canonical,
    schemaSha256: sha256Text(JSON.stringify(canonical))
  };
}

export async function readImportRows(file) {
  return parquetReadObjects({ file, columns: IMPORT_COLUMNS });
}

export function cleanText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function numberOrUndefined(value) {
  if (typeof value === "bigint") {
    return value > 0n && value <= BigInt(Number.MAX_SAFE_INTEGER)
      ? Number(value)
      : undefined;
  }

  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

export function sourceHierarchy(row) {
  return {
    country: cleanText(row.country),
    stateProvince: cleanText(row.state_province),
    region: cleanText(row.region),
    area: cleanText(row.area),
    crag: cleanText(row.crag)
  };
}

function tupleMatches(hierarchy, tuple) {
  return Object.entries(tuple).every(([key, value]) => hierarchy[key] === value);
}

export function scopeMatch(row, scope) {
  const hierarchy = sourceHierarchy(row);
  const accepted = scope.acceptedPathTuples.some((tuple) =>
    tupleMatches(hierarchy, tuple)
  );
  const excluded = (scope.excludedPathTuples ?? []).some((tuple) =>
    tupleMatches(hierarchy, tuple)
  );

  return { accepted: accepted && !excluded, excluded, hierarchy };
}

export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function stableHierarchyId(destinationSlug, kind, value) {
  const slug = slugify(value);
  return slug ? `${destinationSlug}-${kind}-${slug}` : undefined;
}

export function mapDestinationHierarchy(destinationSlug, hierarchy) {
  const sourceArea = hierarchy.area;
  const sourceCrag = hierarchy.crag;

  if (["bishop-area-usa", "red-rock-canyon-usa"].includes(destinationSlug)) {
    return {
      destinationId: destinationSlug,
      areaId: sourceCrag
        ? stableHierarchyId(destinationSlug, "area", sourceCrag)
        : undefined,
      areaName: sourceCrag,
      cragName: sourceCrag
    };
  }

  return {
    destinationId: destinationSlug,
    areaId: sourceArea
      ? stableHierarchyId(destinationSlug, "area", sourceArea)
      : undefined,
    areaName: sourceArea,
    sectorId: sourceCrag
      ? stableHierarchyId(destinationSlug, "sector", sourceCrag)
      : undefined,
    sectorName: sourceCrag,
    cragName: sourceCrag
  };
}

export function openBetaRouteUrl(externalId, name) {
  return `https://openbeta.io/climb/${externalId}/${slugify(name) || "route"}`;
}

export function toRawOpenBetaRoute(row, scope, manifest, link) {
  const hierarchy = sourceHierarchy(row);
  const externalId = cleanText(row.climb_id)?.toLowerCase();
  const name = cleanText(row.climb_name);

  if (!externalId || !name) return undefined;

  return {
    uuid: externalId,
    name,
    length: numberOrUndefined(row.length_meters) ?? -1,
    grades: {
      yds: cleanText(row.grade_yds),
      vscale: cleanText(row.grade_vscale),
      french: cleanText(row.grade_french)
    },
    type: {
      sport: row.is_sport === true,
      trad: row.is_trad === true,
      bouldering: row.is_boulder === true,
      alpine: row.is_alpine === true,
      tr: row.is_top_rope === true
    },
    pathTokens: [
      hierarchy.country,
      hierarchy.stateProvince,
      hierarchy.region,
      hierarchy.area,
      hierarchy.crag
    ].filter(Boolean),
    areaName: hierarchy.crag,
    sourceHierarchy: hierarchy,
    normalizedHierarchy: mapDestinationHierarchy(
      scope.destinationSlug,
      hierarchy
    ),
    sourceRelease: manifest.sourceRelease,
    sourceUrl: link?.sourceUrl ?? openBetaRouteUrl(externalId, name),
    canonicalUrlCheckedAt: link?.canonicalUrlCheckedAt,
    finalResolvedUrl: link?.finalResolvedUrl,
    linkStatus: link?.linkStatus ?? "unverified"
  };
}

function redirectStatus(status) {
  return [301, 302, 303, 307, 308].includes(status);
}

async function fetchHead(url, timeoutMs) {
  return fetch(url, {
    method: "HEAD",
    redirect: "manual",
    headers: {
      "user-agent": "ClimbAtlas-RC3/1.0 (metadata link audit; thz923@qq.com)"
    },
    signal: AbortSignal.timeout(timeoutMs)
  });
}

async function inspectRouteLink(sourceUrl, checkedAt) {
  let currentUrl = sourceUrl;
  let redirected = false;

  for (let hop = 0; hop < 5; hop += 1) {
    const response = await fetchHead(currentUrl, 20_000);

    if (response.ok) {
      return {
        sourceUrl,
        canonicalUrlCheckedAt: checkedAt,
        finalResolvedUrl: currentUrl,
        linkStatus: redirected ? "redirected" : "valid",
        httpStatus: response.status
      };
    }

    if (redirectStatus(response.status)) {
      const location = response.headers.get("location");
      if (!location) break;
      currentUrl = new URL(location, currentUrl).toString();
      redirected = true;
      continue;
    }

    return {
      sourceUrl,
      canonicalUrlCheckedAt: checkedAt,
      finalResolvedUrl: currentUrl,
      linkStatus: response.status === 404 ? "broken" : "unverified",
      httpStatus: response.status
    };
  }

  return {
    sourceUrl,
    canonicalUrlCheckedAt: checkedAt,
    finalResolvedUrl: currentUrl,
    linkStatus: "unverified"
  };
}

async function inspectWithRetries(sourceUrl, checkedAt) {
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await inspectRouteLink(sourceUrl, checkedAt);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  return {
    sourceUrl,
    canonicalUrlCheckedAt: checkedAt,
    linkStatus: "unverified",
    error: lastError instanceof Error ? lastError.message : String(lastError)
  };
}

export async function validateRouteLinks(
  candidates,
  { cacheFile, checkedAt, concurrency = 8, onProgress }
) {
  const cache = existsSync(cacheFile) ? readJson(cacheFile) : {};
  const results = new Map();
  const pending = [];

  for (const candidate of candidates) {
    const externalId = candidate.raw.uuid;
    const sourceUrl = openBetaRouteUrl(externalId, candidate.raw.name);
    const cached = cache[externalId];

    if (
      cached?.sourceUrl === sourceUrl &&
      cached?.canonicalUrlCheckedAt === checkedAt
    ) {
      results.set(externalId, cached);
    } else {
      pending.push({ externalId, sourceUrl });
    }
  }

  let cursor = 0;
  let completed = 0;

  async function worker() {
    while (cursor < pending.length) {
      const item = pending[cursor];
      cursor += 1;
      const result = await inspectWithRetries(item.sourceUrl, checkedAt);
      cache[item.externalId] = result;
      results.set(item.externalId, result);
      completed += 1;

      if (completed % 25 === 0) {
        writeJson(cacheFile, cache);
        onProgress?.(completed, pending.length);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, pending.length || 1) }, () =>
      worker()
    )
  );
  writeJson(cacheFile, cache);

  return results;
}

export function semanticJson(value) {
  return JSON.stringify(value, (key, nested) => {
    if (["auditGeneratedAt", "runtimeMs"].includes(key)) return undefined;
    return nested;
  });
}

export function defaultParquetPath() {
  return path.join(
    process.env.TEMP ?? process.cwd(),
    "climbatlas-openbeta-v2026-08-02.parquet"
  );
}
