import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { loadRouteProject } from "./load-route-project.mjs";
import { openBetaSourceAdapter } from "./openbeta-source-adapter.mjs";

const root = process.cwd();
const refresh = process.argv.includes("--refresh");
const rawDirectory = path.join(root, "src", "data", "routes", "raw", "openbeta-poc");
const importFile = path.join(
  root,
  "src",
  "data",
  "routes",
  "imports",
  "openbeta-poc.json"
);
const reportFile = path.join(root, "outputs", "openbeta-poc-import-report.json");

const scopes = [
  {
    destinationId: "yosemite-usa",
    sourceAreaName: "Yosemite Valley",
    maxRoutes: 75,
    ancestors: [
      "1db1e8ba-a40e-587c-88a4-64f5ea814b8e",
      "1e18b6dd-d8b1-5c36-b555-175190184622",
      "8ab53875-745f-5076-b396-d3d84945e52c",
      "0f1eddf1-5a79-556e-92f6-0d91627e1f2f"
    ]
  },
  {
    destinationId: "red-river-gorge-usa",
    sourceAreaName: "Red River Gorge",
    maxRoutes: 75,
    ancestors: [
      "1db1e8ba-a40e-587c-88a4-64f5ea814b8e",
      "8677a1b5-08b9-5ce8-b15f-0653205bbc48",
      "78da26bc-cd94-5ac8-8e1c-815f7f30a28b"
    ]
  },
  {
    destinationId: "smith-rock-usa",
    sourceAreaName: "Smith Rock",
    maxRoutes: 75,
    ancestors: [
      "1db1e8ba-a40e-587c-88a4-64f5ea814b8e",
      "5f05ed84-1a18-52d9-b8cf-77f8fd01e061",
      "e7aeefae-15e1-5de7-a395-a48727784e98",
      "f3c655b6-9c95-597f-aaa6-fd7d8a4865ec"
    ]
  }
];

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename, "utf8"));
}

function writeJson(filename, value) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function rawFilename(scope) {
  return path.join(rawDirectory, `${scope.destinationId}.json`);
}

const {
  destinationsModule,
  routesModule,
  validationModule,
  deduplicationModule,
  openBetaNormalizationModule,
  importMergeModule
} = loadRouteProject(root);

const destinationIds = new Set(
  destinationsModule.destinations.map((destination) => destination.slug)
);
const existingRoutes = routesModule
  .getAllRouteRecordsWithDestinations()
  .map((item) => item.route)
  .filter(
    (route) =>
      !route.id.startsWith("openbeta-") &&
      !route.sourceRecords.some((source) => source.provider === "openbeta" && source.importedAt)
  );
const previousSnapshot = fs.existsSync(importFile)
  ? readJson(importFile)
  : { routes: [], generatedAt: new Date().toISOString().slice(0, 10) };

const rawSnapshots = [];
const failures = [];

for (const scope of scopes) {
  const filename = rawFilename(scope);

  try {
    if (refresh) {
      const snapshot = await openBetaSourceAdapter.fetch(scope);
      writeJson(filename, snapshot);
      rawSnapshots.push(snapshot);
    } else if (fs.existsSync(filename)) {
      rawSnapshots.push(readJson(filename));
    } else {
      throw new Error(`Raw snapshot missing: ${path.relative(root, filename)}`);
    }
  } catch (error) {
    failures.push({
      destinationId: scope.destinationId,
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

const invalid = [];
const missingSource = [];
const normalizedByExternalId = new Map();

for (const snapshot of rawSnapshots) {
  const checkedAt = snapshot.fetchedAt.slice(0, 10);

  for (const rawRoute of snapshot.routes) {
    if (!rawRoute.uuid) {
      missingSource.push({
        destinationId: snapshot.scope.destinationId,
        name: rawRoute.name
      });
      continue;
    }

    const route = openBetaNormalizationModule.normalizeOpenBetaRoute(
      rawRoute,
      snapshot.scope.destinationId,
      checkedAt
    );

    if (!route) {
      invalid.push({
        destinationId: snapshot.scope.destinationId,
        externalId: rawRoute.uuid,
        name: rawRoute.name,
        reason: "Missing usable route identity."
      });
      continue;
    }

    const result = validationModule.validateRouteCatalog([route], destinationIds);
    if (result.counts.error > 0) {
      invalid.push({
        destinationId: route.destinationId,
        externalId: rawRoute.uuid,
        name: route.name,
        reason: result.issues.filter((issue) => issue.severity === "error")
      });
      continue;
    }

    const duplicateExternalId = normalizedByExternalId.get(rawRoute.uuid);
    if (duplicateExternalId) {
      invalid.push({
        destinationId: route.destinationId,
        externalId: rawRoute.uuid,
        name: route.name,
        reason: `External ID already appeared in ${duplicateExternalId.destinationId}.`
      });
      continue;
    }

    normalizedByExternalId.set(rawRoute.uuid, route);
  }
}

const normalizedRoutes = Array.from(normalizedByExternalId.values());
const incomingIds = new Set(normalizedRoutes.map((route) => route.id));
const duplicateCandidates = deduplicationModule
  .findPotentialRouteDuplicates([...existingRoutes, ...normalizedRoutes])
  .filter(
    (candidate) =>
      incomingIds.has(candidate.first.id) || incomingIds.has(candidate.second.id)
  );
const quarantinedIds = new Set();

for (const candidate of duplicateCandidates) {
  if (incomingIds.has(candidate.first.id)) quarantinedIds.add(candidate.first.id);
  if (incomingIds.has(candidate.second.id)) quarantinedIds.add(candidate.second.id);
}

const acceptedRoutes = normalizedRoutes
  .filter((route) => !quarantinedIds.has(route.id))
  .sort(
    (first, second) =>
      first.destinationId.localeCompare(second.destinationId) ||
      first.name.localeCompare(second.name) ||
      first.id.localeCompare(second.id)
  );

const { routes, summary } = importMergeModule.mergeImportedRoutes(
  previousSnapshot.routes ?? [],
  acceptedRoutes,
  {
    potentialDuplicates: duplicateCandidates.length,
    invalid: invalid.length,
    missingSource: missingSource.length,
    failed: failures.length
  }
);
const changed = summary.imported > 0 || summary.updated > 0;
const generatedAt = changed
  ? new Date().toISOString().slice(0, 10)
  : previousSnapshot.generatedAt;
const snapshot = {
  schemaVersion: 1,
  source: "openbeta",
  sourceUrl: openBetaSourceAdapter.sourceUrl,
  license: "CC0-1.0",
  attribution: "OpenBeta contributors",
  generatedAt,
  publicationStatus: "review-snapshot",
  destinations: scopes.map((scope) => scope.destinationId),
  routes
};

writeJson(importFile, snapshot);
writeJson(reportFile, {
  generatedAt: new Date().toISOString(),
  mode: refresh ? "refresh" : "offline",
  source: {
    name: openBetaSourceAdapter.sourceName,
    url: openBetaSourceAdapter.sourceUrl,
    license: openBetaSourceAdapter.license,
    attribution: "OpenBeta contributors"
  },
  scope: scopes.map(({ destinationId, sourceAreaName, maxRoutes }) => ({
    destinationId,
    sourceAreaName,
    maxRoutes
  })),
  rawRouteCount: rawSnapshots.reduce(
    (total, rawSnapshot) => total + rawSnapshot.routes.length,
    0
  ),
  acceptedRouteCount: routes.length,
  summary,
  invalid,
  missingSource,
  failures,
  duplicateCandidates
});

console.log("OpenBeta RC-3 import summary");
console.log(`  Mode: ${refresh ? "refresh" : "offline"}`);
console.log(`  Raw routes: ${rawSnapshots.reduce((sum, item) => sum + item.routes.length, 0)}`);
console.log(`  Accepted snapshot routes: ${routes.length}`);
console.log(`  Imported: ${summary.imported}`);
console.log(`  Updated: ${summary.updated}`);
console.log(`  Skipped unchanged: ${summary.skippedUnchanged}`);
console.log(`  Potential duplicates: ${summary.potentialDuplicates}`);
console.log(`  Invalid: ${summary.invalid}`);
console.log(`  Missing source: ${summary.missingSource}`);
console.log(`  Failed scopes: ${summary.failed}`);
console.log(`  Report: ${path.relative(root, reportFile)}`);

if (failures.length > 0) process.exitCode = 1;
