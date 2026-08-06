import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { performance } from "node:perf_hooks";

import { loadRouteProject } from "../load-route-project.mjs";
import {
  defaultParquetPath,
  inspectParquet,
  readImportRows,
  readJson,
  scopeMatch,
  semanticJson,
  sha256File,
  sha256Text,
  sourceHierarchy,
  toRawOpenBetaRoute,
  validateRouteLinks,
  writeJson
} from "./shared.mjs";

const root = process.cwd();
const startedAt = performance.now();
const manifestPath = path.join(
  root,
  "src",
  "data",
  "routes",
  "manifests",
  "route-coverage-3-batch-1.json"
);
const manifest = readJson(manifestPath);
const parquetArgument = process.argv.indexOf("--parquet");
const parquetPath =
  parquetArgument >= 0
    ? path.resolve(root, process.argv[parquetArgument + 1])
    : defaultParquetPath();
const outputArgument = process.argv.indexOf("--output-dir");
const outputDirectory =
  outputArgument >= 0
    ? path.resolve(root, process.argv[outputArgument + 1])
    : path.join(root, "outputs", manifest.batchId);
const publishedSnapshotPath = path.join(
  root,
  "src",
  "data",
  "routes",
  "imports",
  `${manifest.batchId}.json`
);
const publishedSnapshot = existsSync(publishedSnapshotPath)
  ? readJson(publishedSnapshotPath)
  : { routes: [] };
const publishedBatchRouteKeys = new Set(
  (publishedSnapshot.routes ?? []).map(
    (route) => `${route.destinationId}:${route.id}`
  )
);

if (!existsSync(parquetPath)) {
  throw new Error(
    `Locked Parquet snapshot not found: ${parquetPath}. Pass --parquet <path>.`
  );
}

mkdirSync(outputDirectory, { recursive: true });

const {
  destinationsModule,
  routesModule,
  publicRoutesModule,
  openBetaNormalizationModule,
  deduplicationModule,
  routeAliasesModule
} = loadRouteProject(root);
const existingRoutes = routesModule
  .getAllRouteRecordsWithDestinations()
  .map(({ route }) => route)
  .filter(
    (route) =>
      !publishedBatchRouteKeys.has(`${route.destinationId}:${route.id}`)
  );
const existingPublicRoutes = publicRoutesModule
  .getPublicRouteRecords()
  .map(({ route }) => route)
  .filter(
    (route) =>
      !publishedBatchRouteKeys.has(`${route.destinationId}:${route.id}`)
  );
const existingPublicDestinationIds = new Set(
  existingPublicRoutes.map((route) => route.destinationId)
);
const existingByExternalId = new Map();
const existingByDestinationAndName = new Map();

for (const route of existingRoutes) {
  for (const source of route.sourceRecords) {
    if (source.provider === "openbeta" && source.externalId) {
      existingByExternalId.set(source.externalId.toLowerCase(), route);
    }
  }

  const key = `${route.destinationId}:${deduplicationModule.normalizeRouteName(
    route.name
  )}`;
  const matches = existingByDestinationAndName.get(key) ?? [];
  matches.push(route);
  existingByDestinationAndName.set(key, matches);
}

function valueCounts(values) {
  const counts = new Map();
  for (const value of values) {
    const key = value || "(missing)";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries(
    Array.from(counts.entries()).sort(
      ([first], [second]) => first.localeCompare(second)
    )
  );
}

function typePresent(row) {
  return supportedTypeCount(row) > 0;
}

function supportedTypeCount(row) {
  return [
    row.is_sport,
    row.is_trad,
    row.is_boulder,
    row.is_alpine,
    row.is_top_rope
  ].filter((value) => value === true).length;
}

function normalizedGradeValues(route) {
  return new Set(
    [route.grade.original, ...Object.values(route.grade.equivalentGrades ?? {})]
      .filter(Boolean)
      .map((value) =>
        String(value)
          .toLowerCase()
          .replace(/\s+/g, "")
      )
  );
}

function setIntersects(first, second) {
  return Array.from(first).some((value) => second.has(value));
}

function gradesCompatible(first, second) {
  const firstValues = normalizedGradeValues(first);
  const secondValues = normalizedGradeValues(second);
  if (setIntersects(firstValues, secondValues)) return true;

  return (
    first.grade.primarySystem &&
    first.grade.primarySystem === second.grade.primarySystem &&
    typeof first.grade.sortValue === "number" &&
    typeof second.grade.sortValue === "number" &&
    Math.abs(first.grade.sortValue - second.grade.sortValue) < 0.01
  );
}

function routeTypesCompatible(first, second) {
  if (first.climbingType === second.climbingType) return true;
  return (
    first.climbingType === "multi-pitch" || second.climbingType === "multi-pitch"
  );
}

function localitiesCompatible(first, second) {
  if (!first.sectorName || !second.sectorName) return true;
  return (
    deduplicationModule.normalizeRouteName(first.sectorName) ===
    deduplicationModule.normalizeRouteName(second.sectorName)
  );
}

function aliasesFor(destinationSlug, canonicalRouteId) {
  return routeAliasesModule
    .getRouteAliasParams()
    .filter(
      ({ slug, routeId }) =>
        slug === destinationSlug &&
        routeAliasesModule.resolveRouteId(slug, routeId) === canonicalRouteId
    )
    .map(({ routeId }) => routeId)
    .sort();
}

function sourceIdentities(route) {
  return route.sourceRecords
    .filter((source) => source.externalId)
    .map((source) => ({
      provider: source.provider,
      externalId: source.externalId
    }))
    .sort(
      (first, second) =>
        first.provider.localeCompare(second.provider) ||
        first.externalId.localeCompare(second.externalId)
    );
}

function duplicateResolution(candidate) {
  const externalMatch = existingByExternalId.get(candidate.raw.uuid);
  if (externalMatch) {
    return {
      action: "merge-existing",
      route: externalMatch,
      reason: "same OpenBeta external ID"
    };
  }

  const key = `${candidate.route.destinationId}:${deduplicationModule.normalizeRouteName(
    candidate.route.name
  )}`;
  const nameMatches = existingByDestinationAndName.get(key) ?? [];
  const compatible = nameMatches.filter(
    (route) =>
      gradesCompatible(candidate.route, route) &&
      routeTypesCompatible(candidate.route, route) &&
      localitiesCompatible(candidate.route, route)
  );

  if (compatible.length === 1) {
    return {
      action: "merge-existing",
      route: compatible[0],
      reason: "same normalized name with compatible grade, type, and locality"
    };
  }

  if (compatible.length > 1 || nameMatches.length > 0) {
    return {
      action: "quarantine",
      reason:
        compatible.length > 1
          ? "multiple existing canonical routes match the candidate"
          : "same normalized name conflicts with an existing route fact",
      candidates: nameMatches.map((route) => ({
        id: route.id,
        name: route.name,
        grade: route.grade.original,
        climbingType: route.climbingType,
        sectorName: route.sectorName
      }))
    };
  }

  return { action: "eligible" };
}

function duplicateSourceGroups(candidates) {
  const byIdentity = new Map();

  for (const candidate of candidates) {
    const hierarchy = candidate.raw.sourceHierarchy;
    const key = [
      candidate.route.destinationId,
      deduplicationModule.normalizeRouteName(candidate.route.name),
      hierarchy?.area ?? "",
      hierarchy?.crag ?? ""
    ].join(":");
    const group = byIdentity.get(key) ?? [];
    group.push(candidate);
    byIdentity.set(key, group);
  }

  return Array.from(byIdentity.values()).filter((group) => group.length > 1);
}

function interleaveGroups(groups) {
  const queues = Array.from(groups.values())
    .map((items) => items.slice().sort((a, b) => a.route.id.localeCompare(b.route.id)))
    .sort((first, second) => {
      const firstKey = first[0]?.selectionBucket ?? "";
      const secondKey = second[0]?.selectionBucket ?? "";
      return firstKey.localeCompare(secondKey);
    });
  const ordered = [];

  while (queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next) ordered.push(next);
    }
  }

  return ordered;
}

function balancedOrderWithinQualityTier(candidates, destinationSlug) {
  const byUnit = new Map();

  for (const candidate of candidates) {
    const hierarchy = candidate.raw.sourceHierarchy;
    const unit = ["bishop-area-usa", "red-rock-canyon-usa"].includes(
      destinationSlug
    )
      ? hierarchy?.crag ?? "(missing crag)"
      : hierarchy?.area ?? "(missing area)";
    const gradeSystem = candidate.route.grade.primarySystem ?? "unknown";
    const gradeBand = candidate.route.grade.filterBand ?? "unknown";
    candidate.selectionBucket = `${candidate.route.climbingType}:${gradeSystem}:${gradeBand}`;
    const groups = byUnit.get(unit) ?? new Map();
    const bucket = groups.get(candidate.selectionBucket) ?? [];
    bucket.push(candidate);
    groups.set(candidate.selectionBucket, bucket);
    byUnit.set(unit, groups);
  }

  const unitQueues = Array.from(byUnit.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([unit, groups]) => ({ unit, queue: interleaveGroups(groups) }));
  const ordered = [];

  while (unitQueues.some(({ queue }) => queue.length > 0)) {
    for (const unit of unitQueues) {
      const next = unit.queue.shift();
      if (next) ordered.push(next);
    }
  }

  return ordered;
}

function balancedOrder(candidates, destinationSlug) {
  const comparable = candidates.filter(
    (candidate) => candidate.route.grade.parseStatus !== "unparsed"
  );
  const unparsed = candidates.filter(
    (candidate) => candidate.route.grade.parseStatus === "unparsed"
  );

  return [
    ...balancedOrderWithinQualityTier(comparable, destinationSlug),
    ...balancedOrderWithinQualityTier(unparsed, destinationSlug)
  ];
}

function distribution(routes) {
  return {
    byArea: valueCounts(routes.map((route) => route.areaName)),
    byCrag: valueCounts(routes.map((route) => route.cragName)),
    byClimbingType: valueCounts(routes.map((route) => route.climbingType)),
    byGradeSystem: valueCounts(
      routes.map((route) => route.grade.primarySystem ?? "unknown")
    ),
    byDifficultyBand: valueCounts(
      routes.map((route) => route.grade.filterBand ?? "unknown")
    )
  };
}

function difficultySpread(routes) {
  const groups = new Map();

  for (const route of routes) {
    const discipline =
      route.climbingType === "boulder"
        ? "bouldering"
        : route.climbingType === "alpine"
          ? "alpine"
          : "roped";
    const gradeSystem = route.grade.primarySystem ?? "unknown";
    const key = `${discipline}:${gradeSystem}`;
    const group = groups.get(key) ?? {
      discipline,
      gradeSystem,
      routeCount: 0,
      parsed: 0,
      representedBands: new Set()
    };
    group.routeCount += 1;
    if (route.grade.parseStatus !== "unparsed") group.parsed += 1;
    for (const band of route.grade.filterBands) group.representedBands.add(band);
    groups.set(key, group);
  }

  return Array.from(groups.values())
    .map((group) => ({
      discipline: group.discipline,
      gradeSystem: group.gradeSystem,
      routeCount: group.routeCount,
      parseSuccessRate:
        group.routeCount === 0 ? 0 : group.parsed / group.routeCount,
      representedBands: Array.from(group.representedBands).sort()
    }))
    .sort(
      (first, second) =>
        first.discipline.localeCompare(second.discipline) ||
        first.gradeSystem.localeCompare(second.gradeSystem)
    );
}

function relatedScopeRows(rows, scope) {
  const accepted = scope.acceptedPathTuples[0];
  const parentKeys = accepted.area
    ? ["country", "stateProvince", "region"]
    : ["country", "stateProvince"];

  return rows.filter((row) => {
    const hierarchy = sourceHierarchy(row);
    return parentKeys.every((key) => hierarchy[key] === accepted[key]);
  });
}

function scopeExclusions(rows, scope) {
  const accepted = scope.acceptedPathTuples[0];
  const excluded = accepted.area
    ? relatedScopeRows(rows, scope).filter(
        (row) => !scopeMatch(row, scope).accepted
      )
    : rows.filter((row) => {
        const hierarchy = sourceHierarchy(row);
        if (
          hierarchy.country !== accepted.country ||
          hierarchy.stateProvince !== accepted.stateProvince
        ) {
          return false;
        }
        return (scope.excludedPathTuples ?? []).some((tuple) =>
          Object.entries(tuple).every(([key, value]) => hierarchy[key] === value)
        );
      });
  return {
    count: excluded.length,
    byRegion: valueCounts(excluded.map((row) => sourceHierarchy(row).region)),
    byArea: valueCounts(excluded.map((row) => sourceHierarchy(row).area))
  };
}

const fileSha256 = await sha256File(parquetPath);
if (fileSha256 !== manifest.sourceSha256) {
  throw new Error(
    `Source SHA mismatch: expected ${manifest.sourceSha256}, received ${fileSha256}.`
  );
}

const parquet = await inspectParquet(parquetPath);
if (parquet.rowCount !== manifest.sourceRowCount) {
  throw new Error(
    `Source row count mismatch: expected ${manifest.sourceRowCount}, received ${parquet.rowCount}.`
  );
}
if (parquet.schemaSha256 !== manifest.sourceSchemaSha256) {
  throw new Error(
    `Source schema mismatch: expected ${manifest.sourceSchemaSha256}, received ${parquet.schemaSha256}.`
  );
}

const rows = await readImportRows(parquet.file);
const rejectionLedger = [];
const conflictLedger = [];
const mergeLedger = [];
const mergeSourceRoutes = [];
const identityRecords = [];
const scopeReports = [];
const candidateReports = [];
const selectedRoutes = [];
const selectedLinks = [];
const currentCounts = Object.fromEntries(
  manifest.destinationScopes.map((scope) => [
    scope.destinationSlug,
    existingPublicRoutes.filter(
      (route) => route.destinationId === scope.destinationSlug
    ).length
  ])
);

for (const scope of manifest.destinationScopes) {
  const scopedRows = rows.filter((row) => scopeMatch(row, scope).accepted);
  const target = manifest.destinationTargets[scope.destinationSlug];
  const needed = Math.max(0, target.target - currentCounts[scope.destinationSlug]);
  const normalized = [];

  for (const row of scopedRows) {
    const externalId = typeof row.climb_id === "string" ? row.climb_id : undefined;
    const name = typeof row.climb_name === "string" ? row.climb_name.trim() : "";
    let reason;

    if (!externalId) reason = "missing OpenBeta route ID";
    else if (!name || name === "[Redacted]") reason = "missing or redacted route name";
    else if (!typePresent(row)) reason = "no supported climbing type in source row";
    else if (supportedTypeCount(row) > 1) {
      reason =
        "multiple source climbing types cannot be losslessly represented";
    }

    if (reason) {
      rejectionLedger.push({
        destinationSlug: scope.destinationSlug,
        externalId,
        name: name || undefined,
        stage: "before-normalization",
        reason
      });
      continue;
    }

    const raw = toRawOpenBetaRoute(row, scope, manifest);
    const route = raw
      ? openBetaNormalizationModule.normalizeOpenBetaRoute(
          raw,
          scope.destinationSlug,
          manifest.sourceCheckedAt
        )
      : undefined;

    if (!raw || !route) {
      rejectionLedger.push({
        destinationSlug: scope.destinationSlug,
        externalId,
        name,
        stage: "normalization",
        reason: "OpenBeta adapter rejected the row"
      });
      continue;
    }

    normalized.push({ row, raw, route });
  }

  const sourceDuplicateIds = new Set();
  for (const group of duplicateSourceGroups(normalized)) {
    for (const candidate of group) sourceDuplicateIds.add(candidate.raw.uuid);
    conflictLedger.push({
      destinationSlug: scope.destinationSlug,
      type: "same-source-identity-candidate",
      resolution: "quarantined-pending-review",
      unresolved: false,
      candidates: group.map((candidate) => ({
        externalId: candidate.raw.uuid,
        name: candidate.route.name,
        grade: candidate.route.grade.original,
        climbingType: candidate.route.climbingType,
        sourceHierarchy: candidate.raw.sourceHierarchy
      }))
    });
  }

  const eligible = [];
  let existingDuplicateCount = 0;
  let identityConflictCount = sourceDuplicateIds.size;

  for (const candidate of normalized) {
    if (sourceDuplicateIds.has(candidate.raw.uuid)) continue;
    const resolution = duplicateResolution(candidate);

    if (resolution.action === "eligible") {
      eligible.push(candidate);
      continue;
    }

    if (resolution.action === "merge-existing") {
      existingDuplicateCount += 1;
      const existing = resolution.route;
      mergeSourceRoutes.push({
        destinationSlug: scope.destinationSlug,
        canonicalRouteId: existing.id,
        sourceRoute: candidate.route
      });
      mergeLedger.push({
        destinationSlug: scope.destinationSlug,
        sourceExternalId: candidate.raw.uuid,
        sourceRouteId: candidate.route.id,
        canonicalRouteId: existing.id,
        reason: resolution.reason,
        action: "append-source-identity-on-public-import",
        publicCountDelta: 0
      });
      identityRecords.push({
        canonicalRouteId: existing.id,
        destinationSlug: existing.destinationId,
        sourceIdentities: [
          ...sourceIdentities(existing),
          { provider: "openbeta", externalId: candidate.raw.uuid }
        ].filter(
          (identity, index, values) =>
            values.findIndex(
              (candidateIdentity) =>
                candidateIdentity.provider === identity.provider &&
                candidateIdentity.externalId === identity.externalId
            ) === index
        ),
        slugAliases: aliasesFor(existing.destinationId, existing.id),
        mergedRouteIds: [candidate.route.id]
      });
      continue;
    }

    identityConflictCount += 1;
    conflictLedger.push({
      destinationSlug: scope.destinationSlug,
      type: "existing-route-identity-conflict",
      sourceExternalId: candidate.raw.uuid,
      sourceName: candidate.route.name,
      sourceGrade: candidate.route.grade.original,
      sourceHierarchy: candidate.raw.sourceHierarchy,
      existingCandidates: resolution.candidates,
      resolution: "quarantined-pending-review",
      unresolved: false,
      reason: resolution.reason
    });
  }

  const ordered = balancedOrder(eligible, scope.destinationSlug);
  const linkCacheFile = path.join(outputDirectory, "openbeta-link-cache.json");
  const selected = [];
  const checkedCandidates = [];
  let cursor = 0;
  const selectedTypeCounts = new Map();

  function typeWithinReleaseCap(route) {
    if (route.climbingType !== "top-rope") return true;
    const cap = Math.max(1, Math.ceil(needed * 0.1));
    return (selectedTypeCounts.get("top-rope") ?? 0) < cap;
  }

  while (selected.length < needed && cursor < ordered.length) {
    const remaining = needed - selected.length;
    const batch = ordered.slice(cursor, cursor + Math.max(remaining + 25, 50));
    cursor += batch.length;
    const links = await validateRouteLinks(batch, {
      cacheFile: linkCacheFile,
      checkedAt: manifest.sourceCheckedAt,
      concurrency: 8,
      onProgress: (complete, total) =>
        console.log(
          `${scope.destinationSlug}: checked ${complete}/${total} uncached links`
        )
    });

    for (const candidate of batch) {
      const link = links.get(candidate.raw.uuid);
      checkedCandidates.push({ candidate, link });
      if (!link || !["valid", "redirected"].includes(link.linkStatus)) continue;

      const raw = toRawOpenBetaRoute(candidate.row, scope, manifest, link);
      const route = openBetaNormalizationModule.normalizeOpenBetaRoute(
        raw,
        scope.destinationSlug,
        manifest.sourceCheckedAt
      );
      if (!route) continue;
      if (!typeWithinReleaseCap(route)) continue;
      selected.push({ route, link });
      selectedTypeCounts.set(
        route.climbingType,
        (selectedTypeCounts.get(route.climbingType) ?? 0) + 1
      );
      if (selected.length === needed) break;
    }
  }

  for (const { candidate, link } of checkedCandidates) {
    if (link && ["valid", "redirected"].includes(link.linkStatus)) continue;
    rejectionLedger.push({
      destinationSlug: scope.destinationSlug,
      externalId: candidate.raw.uuid,
      name: candidate.route.name,
      stage: "exact-link-validation",
      reason: `exact OpenBeta route link is ${link?.linkStatus ?? "missing"}`,
      sourceUrl: link?.sourceUrl,
      httpStatus: link?.httpStatus,
      error: link?.error
    });
  }

  const selectedRouteRecords = selected.map(({ route }) => route);
  selectedRoutes.push(...selectedRouteRecords);
  selectedLinks.push(...selected.map(({ link }) => link));
  identityRecords.push(
    ...selectedRouteRecords.map((route) => ({
      canonicalRouteId: route.id,
      destinationSlug: route.destinationId,
      sourceIdentities: sourceIdentities(route),
      slugAliases: []
    }))
  );

  const selectedIds = new Set(selectedRouteRecords.map((route) => route.id));
  const scopeReport = {
    destinationSlug: scope.destinationSlug,
    scopeVersion: scope.scopeVersion,
    acceptedPathTuples: scope.acceptedPathTuples,
    excludedPathTuples: scope.excludedPathTuples ?? [],
    totalRowsInScope: scopedRows.length,
    excludedSiblingRows: scopeExclusions(rows, scope),
    acceptedDistribution: {
      byArea: valueCounts(scopedRows.map((row) => sourceHierarchy(row).area)),
      byCrag: valueCounts(scopedRows.map((row) => sourceHierarchy(row).crag))
    },
    coordinateUsage: scope.coordinateUsage,
    publishRouteCoordinates: scope.publishRouteCoordinates
  };
  scopeReports.push(scopeReport);

  candidateReports.push({
    destinationSlug: scope.destinationSlug,
    existingPublicRoutes: currentCounts[scope.destinationSlug],
    targetPublicRoutes: target.target,
    requestedNewRoutes: needed,
    totalCandidatesInScope: scopedRows.length,
    rejectedBeforeNormalization: rejectionLedger.filter(
      (item) =>
        item.destinationSlug === scope.destinationSlug &&
        item.stage === "before-normalization"
    ).length,
    validAfterNormalization: normalized.length,
    existingDuplicates: existingDuplicateCount,
    identityConflicts: identityConflictCount,
    eligibleNewRoutes: eligible.length,
    selectedForPreview: selectedRouteRecords.length,
    eligibleButNotSelected: Math.max(0, eligible.length - selectedRouteRecords.length),
    targetReached: selectedRouteRecords.length === needed,
    exactRouteLinkCoverage:
      selectedRouteRecords.length === 0
        ? 0
        : selected.length / selectedRouteRecords.length,
    distribution: distribution(selectedRouteRecords),
    difficultySpread: difficultySpread(selectedRouteRecords),
    selectionReason:
      "Deterministic round-robin across destination-specific area/crag units, then climbing type, grade system, and difficulty band; stable route ID breaks ties.",
    selectedRoutes: selectedRouteRecords.map((route) => ({
      id: route.id,
      externalId: route.sourceRecords.find(
        (source) => source.provider === "openbeta"
      )?.externalId,
      name: route.name,
      grade: route.grade.original,
      gradeSystem: route.grade.primarySystem ?? "unknown",
      climbingType: route.climbingType,
      areaName: route.areaName,
      sectorName: route.sectorName,
      sourceUrl: route.sourceRecords[0]?.sourceUrl
    })),
    selectedSemanticIds: Array.from(selectedIds).sort()
  });
}

const previousSnapshotPath = path.join(
  outputDirectory,
  "preview-route-snapshot.json"
);
const previousSnapshot = existsSync(previousSnapshotPath)
  ? readJson(previousSnapshotPath)
  : undefined;
const previewSnapshot = {
  schemaVersion: 1,
  batchId: manifest.batchId,
  sourceRelease: manifest.sourceRelease,
  sourceSha256: manifest.sourceSha256,
  publicationStatus: "dry-run-preview",
  routes: selectedRoutes.sort(
    (first, second) =>
      first.destinationId.localeCompare(second.destinationId) ||
      first.id.localeCompare(second.id)
  )
};
const previousById = new Map(
  (previousSnapshot?.routes ?? []).map((route) => [
    `${route.destinationId}:${route.id}`,
    route
  ])
);
const nextById = new Map(
  previewSnapshot.routes.map((route) => [`${route.destinationId}:${route.id}`, route])
);
const idempotency = {
  comparedWithPreviousDryRun: Boolean(previousSnapshot),
  imported: Array.from(nextById.keys()).filter((key) => !previousById.has(key)).length,
  updated: Array.from(nextById.entries()).filter(
    ([key, route]) =>
      previousById.has(key) &&
      semanticJson(previousById.get(key)) !== semanticJson(route)
  ).length,
  removed: Array.from(previousById.keys()).filter((key) => !nextById.has(key)).length,
  semanticSha256: sha256Text(semanticJson(previewSnapshot))
};

writeJson(previousSnapshotPath, previewSnapshot);
writeJson(path.join(outputDirectory, "scope-report.json"), {
  batchId: manifest.batchId,
  reports: scopeReports
});
writeJson(path.join(outputDirectory, "candidate-selection-report.json"), {
  batchId: manifest.batchId,
  baselinePublicRoutes: existingPublicRoutes.length,
  reports: candidateReports
});
writeJson(path.join(outputDirectory, "conflict-ledger.json"), {
  batchId: manifest.batchId,
  unresolved: conflictLedger.filter((item) => item.unresolved).length,
  conflicts: conflictLedger
});
writeJson(path.join(outputDirectory, "merge-ledger.json"), {
  batchId: manifest.batchId,
  merges: mergeLedger
});
writeJson(path.join(outputDirectory, "merge-source-preview.json"), {
  batchId: manifest.batchId,
  sourceRelease: manifest.sourceRelease,
  merges: mergeSourceRoutes.sort(
    (first, second) =>
      first.destinationSlug.localeCompare(second.destinationSlug) ||
      first.canonicalRouteId.localeCompare(second.canonicalRouteId)
  )
});
writeJson(path.join(outputDirectory, "source-change-ledger.json"), {
  batchId: manifest.batchId,
  changes: mergeLedger.map((merge) => ({
    destinationSlug: merge.destinationSlug,
    canonicalRouteId: merge.canonicalRouteId,
    provider: "openbeta",
    externalId: merge.sourceExternalId,
    action: "append-source-identity-on-public-import",
    publicCountDelta: 0,
    status: "proposed"
  }))
});
writeJson(path.join(outputDirectory, "removal-ledger.json"), {
  batchId: manifest.batchId,
  removals: [],
  note: "RC3-1 and RC3-2 are dry-run phases and do not remove public routes."
});
writeJson(path.join(outputDirectory, "route-identity-preview.json"), {
  batchId: manifest.batchId,
  records: identityRecords.sort(
    (first, second) =>
      first.destinationSlug.localeCompare(second.destinationSlug) ||
      first.canonicalRouteId.localeCompare(second.canonicalRouteId)
  )
});
writeJson(path.join(outputDirectory, "rejection-ledger.json"), {
  batchId: manifest.batchId,
  rejected: rejectionLedger
});

const majorGradeFailures = candidateReports.flatMap((report) =>
  report.difficultySpread
    .filter(
      (spread) =>
        spread.gradeSystem !== "unknown" && spread.parseSuccessRate < 0.95
    )
    .map((spread) => ({ destinationSlug: report.destinationSlug, ...spread }))
);
const summary = {
  auditGeneratedAt: new Date().toISOString(),
  batchId: manifest.batchId,
  importerVersion: manifest.importerVersion,
  source: {
    release: manifest.sourceRelease,
    sha256: fileSha256,
    shaMatches: true,
    rowCount: parquet.rowCount,
    rowCountMatches: true,
    schemaSha256: parquet.schemaSha256,
    schemaMatches: true
  },
  baseline: {
    destinations: existingPublicDestinationIds.size,
    publicRoutes: existingPublicRoutes.length,
    publishedPicks: existingPublicRoutes.filter(
      publicRoutesModule.hasPublishedRouteEditorial
    ).length
  },
  preview: {
    selectedRoutes: selectedRoutes.length,
    projectedDestinations:
      existingPublicDestinationIds.size +
      manifest.destinationScopes.filter(
        (scope) => !existingPublicDestinationIds.has(scope.destinationSlug)
      ).length,
    projectedPublicRoutes: existingPublicRoutes.length + selectedRoutes.length,
    publishedPicks: existingPublicRoutes.filter(
      publicRoutesModule.hasPublishedRouteEditorial
    ).length,
    exactRouteLinkCoverage:
      selectedLinks.length === 0
        ? 0
        : selectedLinks.filter((link) =>
            ["valid", "redirected"].includes(link.linkStatus)
          ).length / selectedLinks.length
  },
  identity: {
    proposedMerges: mergeLedger.length,
    quarantinedConflicts: conflictLedger.length,
    unresolvedConflicts: conflictLedger.filter((item) => item.unresolved).length,
    identityRecords: identityRecords.length
  },
  qualityGates: {
    sourceSnapshotShaMatches: true,
    sourceRowCountMatches: true,
    schemaFingerprintMatches: true,
    routeConversionFailures: rejectionLedger.filter(
      (item) => item.stage === "normalization"
    ).length,
    unresolvedIdentityConflicts: conflictLedger.filter(
      (item) => item.unresolved
    ).length,
    brokenSelectedExactLinks: selectedLinks.filter(
      (link) => !["valid", "redirected"].includes(link.linkStatus)
    ).length,
    selectedSourceCoverage: selectedRoutes.filter(
      (route) => route.sourceRecords.length > 0
    ).length / Math.max(1, selectedRoutes.length),
    selectedExactRouteLinkCoverage:
      selectedLinks.length === 0
        ? 0
        : selectedLinks.filter((link) =>
            ["valid", "redirected"].includes(link.linkStatus)
          ).length / selectedLinks.length,
    majorGradeSystemFailures: majorGradeFailures,
    publishedPicksRemain40:
      existingPublicRoutes.filter(publicRoutesModule.hasPublishedRouteEditorial)
        .length === 40,
    destinationTargetsReached: candidateReports.every(
      (report) => report.targetReached
    ),
    productionMyAtlasReferenceAudit: "not-run"
  },
  idempotency,
  runtimeMs: Math.round(performance.now() - startedAt)
};
writeJson(path.join(outputDirectory, "dry-run-summary.json"), summary);

console.log("Route Coverage 3.0 RC3-1 / RC3-2 dry run");
console.log(`Source rows: ${parquet.rowCount}`);
console.log(`Baseline public routes: ${existingPublicRoutes.length}`);
console.log(`Preview routes selected: ${selectedRoutes.length}`);
console.log(`Projected public routes: ${summary.preview.projectedPublicRoutes}`);
console.log(`Proposed merges: ${mergeLedger.length}`);
console.log(`Quarantined conflicts: ${conflictLedger.length}`);
console.log(`Unresolved conflicts: ${summary.identity.unresolvedConflicts}`);
console.log(`Selected exact-link coverage: ${summary.preview.exactRouteLinkCoverage}`);
console.log(`Output: ${outputDirectory}`);
