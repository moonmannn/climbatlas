import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

import { loadRouteProject } from "../load-route-project.mjs";
import { readJson, writeJson } from "./shared.mjs";

const root = process.cwd();
const manifestArgument = process.argv.indexOf("--manifest");
const manifestPath =
  manifestArgument >= 0
    ? path.resolve(root, process.argv[manifestArgument + 1])
    : path.join(
        root,
        "src",
        "data",
        "routes",
        "manifests",
        "route-coverage-3-batch-1.json"
      );
if (manifestArgument >= 0 && !process.argv[manifestArgument + 1]) {
  throw new Error("--manifest requires a file path.");
}
const manifest = readJson(manifestPath);
const outputArgument = process.argv.indexOf("--output-dir");
const outputDirectory =
  outputArgument >= 0
    ? path.resolve(root, process.argv[outputArgument + 1])
    : path.join(root, "outputs", manifest.batchId);
const requireRemote = process.argv.includes("--require-remote");
const referenceSnapshotArgument = process.argv.indexOf("--reference-snapshot");
const referenceSnapshotPath =
  referenceSnapshotArgument >= 0
    ? path.resolve(root, process.argv[referenceSnapshotArgument + 1])
    : undefined;
const snapshotPath = path.join(outputDirectory, "preview-route-snapshot.json");
const reportPath = path.join(outputDirectory, "my-atlas-reference-audit.json");
const dryRunSummaryPath = path.join(outputDirectory, "dry-run-summary.json");

mkdirSync(outputDirectory, { recursive: true });

if (!existsSync(snapshotPath)) {
  throw new Error(
    "Preview route snapshot is missing. Run routes:rc3-dry-run first."
  );
}

const { publicRoutesModule, routeAliasesModule, routesModule } =
  loadRouteProject(root);
const preview = readJson(snapshotPath);
const publicRoutes = publicRoutesModule.getPublicRouteRecords().map(({ route }) => route);
const publicKeys = new Set(
  [...publicRoutes, ...preview.routes].map(
    (route) => `${route.destinationId}:${route.id}`
  )
);
const areaIndexKeys = new Set(
  routesModule
    .getAllRouteCatalogEntries()
    .filter(({ entry }) => entry.kind === "area-index")
    .map(({ destination, entry }) => `${destination.slug}:${entry.id}`)
);
const aliasMap = new Map(
  routeAliasesModule.getRouteAliasParams().map(({ slug, routeId }) => [
    `${slug}:${routeId}`,
    routeAliasesModule.resolveRouteId(slug, routeId)
  ])
);
const retiredKeys = new Set(
  routeAliasesModule
    .getRetiredRouteParams()
    .map(({ slug, routeId }) => `${slug}:${routeId}`)
);

async function readAll(client, table) {
  const rows = [];
  const pageSize = 1000;

  for (let start = 0; ; start += pageSize) {
    const { data, error } = await client
      .from(table)
      .select("user_id,destination_slug,route_id")
      .range(start, start + pageSize - 1);

    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) break;
  }

  return rows;
}

function assessRow(table, row) {
  const key = `${row.destination_slug}:${row.route_id}`;
  const aliasTarget = aliasMap.get(key);
  const canonicalKey = aliasTarget
    ? `${row.destination_slug}:${aliasTarget}`
    : key;

  if (publicKeys.has(canonicalKey)) {
    return aliasTarget
      ? {
          table,
          ...(row.user_id ? { userId: row.user_id } : {}),
          key,
          canonicalKey,
          referenceCount: row.reference_count ?? 1,
          status: "alias-migration-needed"
        }
      : undefined;
  }

  return {
    table,
    ...(row.user_id ? { userId: row.user_id } : {}),
    key,
    canonicalKey,
    referenceCount: row.reference_count ?? 1,
    status: areaIndexKeys.has(canonicalKey)
      ? "area-index-reference"
      : retiredKeys.has(key)
        ? "retired-reference"
        : "orphaned-reference"
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const staticSummary = {
  publicCanonicalRoutes: publicRoutes.length,
  previewCanonicalRoutes: preview.routes.length,
  aliases: aliasMap.size,
  retiredRouteParameters: retiredKeys.size,
  areaIndexes: areaIndexKeys.size,
  migrationCoverageWarning:
    "The historical route-alias SQL predates climbing_logs and must not be reused as the RC3 migration."
};

function issueCounts(issues) {
  const count = (status) =>
    issues
      .filter((issue) => issue.status === status)
      .reduce((total, issue) => total + issue.referenceCount, 0);

  return {
    aliasMigrationNeeded: count("alias-migration-needed"),
    areaIndexReferences: count("area-index-reference"),
    retiredReferences: count("retired-reference"),
    orphanedReferences: count("orphaned-reference")
  };
}

function updateDryRunAuditGate(status, checkedAt) {
  if (!existsSync(dryRunSummaryPath)) return;

  const summary = readJson(dryRunSummaryPath);
  summary.qualityGates.productionMyAtlasReferenceAudit = status;
  summary.qualityGates.productionMyAtlasReferenceAuditCheckedAt = checkedAt;
  writeJson(dryRunSummaryPath, summary);
}

if (referenceSnapshotPath) {
  if (!existsSync(referenceSnapshotPath)) {
    throw new Error(`Reference snapshot is missing: ${referenceSnapshotPath}`);
  }

  const referenceSnapshot = readJson(referenceSnapshotPath);
  const issues = referenceSnapshot.references
    .map((row) => assessRow(row.source_table, row))
    .filter(Boolean);
  const counts = issueCounts(issues);
  const report = {
    batchId: preview.batchId,
    auditGeneratedAt: new Date().toISOString(),
    remoteStatus: "completed-via-read-only-aggregate-snapshot",
    sourceEvidence: {
      projectRef: referenceSnapshot.projectRef,
      checkedAt: referenceSnapshot.checkedAt,
      queryMode: referenceSnapshot.queryMode,
      containsUserIdentifiers: false,
      containsPrivateNotes: false
    },
    staticSummary,
    rowCounts: referenceSnapshot.tableCounts,
    totalRouteReferences: referenceSnapshot.references.reduce(
      (total, row) => total + row.reference_count,
      0
    ),
    distinctReferenceGroups: referenceSnapshot.references.length,
    issueCounts: counts,
    issues,
    releaseGate:
      counts.areaIndexReferences === 0 &&
      counts.retiredReferences === 0 &&
      counts.orphanedReferences === 0
        ? counts.aliasMigrationNeeded === 0
          ? "pass"
          : "pass-after-alias-migration"
        : "blocked"
  };
  writeJson(reportPath, report);
  updateDryRunAuditGate(report.releaseGate, referenceSnapshot.checkedAt);
  console.log("My Atlas aggregate route-reference audit completed.");
  console.log(`References: ${report.totalRouteReferences}`);
  console.log(`Issues: ${issues.length}`);
  console.log(`Release gate: ${report.releaseGate}`);
  console.log(`Report: ${reportPath}`);
} else if (!supabaseUrl || !serviceRoleKey) {
  const report = {
    batchId: preview.batchId,
    auditGeneratedAt: new Date().toISOString(),
    remoteStatus: "not-run",
    reason:
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY were not supplied to the offline audit process.",
    staticSummary,
    releaseGate: "blocked"
  };
  writeJson(reportPath, report);
  console.log("My Atlas route-reference audit: remote query not run.");
  console.log(`Report: ${reportPath}`);
  if (requireRemote) process.exitCode = 1;
} else {
  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const tables = ["saved_routes", "route_notes", "climbing_logs"];
  const rowsByTable = Object.fromEntries(
    await Promise.all(
      tables.map(async (table) => [table, await readAll(client, table)])
    )
  );
  const issues = Object.entries(rowsByTable).flatMap(([table, rows]) =>
    rows.map((row) => assessRow(table, row)).filter(Boolean)
  );
  const counts = issueCounts(issues);
  const report = {
    batchId: preview.batchId,
    auditGeneratedAt: new Date().toISOString(),
    remoteStatus: "completed",
    staticSummary,
    rowCounts: Object.fromEntries(
      Object.entries(rowsByTable).map(([table, rows]) => [table, rows.length])
    ),
    issueCounts: counts,
    issues,
    releaseGate:
      counts.areaIndexReferences === 0 &&
      counts.retiredReferences === 0 &&
      counts.orphanedReferences === 0
        ? counts.aliasMigrationNeeded === 0
          ? "pass"
          : "pass-after-alias-migration"
        : "blocked"
  };
  writeJson(reportPath, report);
  updateDryRunAuditGate(report.releaseGate, report.auditGeneratedAt);
  console.log("My Atlas route-reference audit completed.");
  console.log(`Issues: ${issues.length}`);
  console.log(`Report: ${reportPath}`);
}
