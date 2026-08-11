import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { loadRouteProject } from "./load-route-project.mjs";

const root = process.cwd();
const outputArgument = process.argv.indexOf("--output");
const outputPath =
  outputArgument >= 0
    ? path.resolve(root, process.argv[outputArgument + 1])
    : path.join(
        root,
        "outputs",
        "route-coverage-3-batch-2",
        "legacy-grade-marker-ledger.json"
      );
const shouldWrite = !process.argv.includes("--no-write");

if (outputArgument >= 0 && !process.argv[outputArgument + 1]) {
  throw new Error("--output requires a file path.");
}

const { destinationsModule, routesModule, routeCleanupModule } =
  loadRouteProject(root);
const publicRoutes = new Map(
  routesModule
    .getAllRouteRecordsWithDestinations()
    .map(({ route }) => [`${route.destinationId}:${route.id}`, route])
);
const markerPattern = /\s+metadata\s*$/i;
const entries = [];
const errors = [];

for (const destination of destinationsModule.destinations) {
  for (const legacyRoute of destination.routes ?? []) {
    const before = legacyRoute.grade?.trim() ?? "";
    if (!markerPattern.test(before)) continue;

    const routeKey = `${destination.slug}:${legacyRoute.id}`;
    const cleanupRule = routeCleanupModule.routeCatalogCleanupByKey.get(routeKey);
    const retiredByCleanup = ["hidden", "alias", "area-index"].includes(
      cleanupRule?.action
    );
    const expected = (
      cleanupRule?.patch?.grade ?? before.replace(markerPattern, "")
    ).trim();
    const normalized = publicRoutes.get(routeKey);

    if ((!normalized || normalized.kind !== "route") && retiredByCleanup) {
      entries.push({
        routeKey,
        before,
        after: null,
        action: `cleanup-${cleanupRule.action}`,
        reason: cleanupRule.reason
      });
      continue;
    }

    if (!normalized || normalized.kind !== "route") {
      errors.push({ routeKey, reason: "normalized-route-missing" });
      continue;
    }

    if (normalized.grade.original !== expected) {
      errors.push({
        routeKey,
        reason: "unexpected-normalized-grade",
        expected,
        actual: normalized.grade.original
      });
    }

    if (markerPattern.test(normalized.grade.original)) {
      errors.push({ routeKey, reason: "internal-marker-still-public" });
    }

    entries.push({
      routeKey,
      before,
      after: normalized.grade.original,
      action: cleanupRule?.patch?.grade
        ? "cleanup-source-backed-grade-override"
        : "removed-exact-trailing-internal-marker",
      ...(cleanupRule?.reason ? { reason: cleanupRule.reason } : {})
    });
  }
}

entries.sort((first, second) => first.routeKey.localeCompare(second.routeKey));
const report = {
  generatedAt: new Date().toISOString(),
  rule: "Only an exact trailing `metadata` marker is removed from legacy grade strings.",
  summary: {
    reviewed: entries.length,
    publicMarkersRemoved: entries.filter(
      (entry) => entry.action === "removed-exact-trailing-internal-marker"
    ).length,
    sourceBackedOverrides: entries.filter(
      (entry) => entry.action === "cleanup-source-backed-grade-override"
    ).length,
    retiredLegacyRecords: entries.filter((entry) => entry.after === null).length,
    errors: errors.length
  },
  errors,
  entries
};

if (shouldWrite) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

console.log("Legacy grade marker validation");
console.log(`Reviewed: ${entries.length}`);
console.log(`Errors: ${errors.length}`);
console.log(shouldWrite ? `Ledger: ${outputPath}` : "Ledger: not written (--no-write)");

if (errors.length > 0) {
  process.exitCode = 1;
}
