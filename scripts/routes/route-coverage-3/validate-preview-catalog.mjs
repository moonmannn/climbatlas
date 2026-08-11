import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

import { loadRouteProject } from "../load-route-project.mjs";

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
const batchId = manifest.batchId;

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

const snapshot = readJson(
  path.join(
    root,
    "src",
    "data",
    "routes",
    "imports",
    `${batchId}.json`
  )
);
const audit = readJson(
  path.join(root, "outputs", batchId, "my-atlas-reference-audit.json")
);
const summary = readJson(
  path.join(root, "outputs", batchId, "dry-run-summary.json")
);
const candidateReport = readJson(
  path.join(root, "outputs", batchId, "candidate-selection-report.json")
);
const {
  destinationsModule,
  publicRoutesModule,
  routeAliasesModule,
  routeDetailViewModelModule,
  routeExplorerModule
} = loadRouteProject();

const expectedCounts = Object.fromEntries(
  Object.entries(manifest.destinationTargets).map(([slug, target]) => [
    slug,
    target.target
  ])
);
const newDestinationCount = candidateReport.reports.filter(
  (report) => report.existingPublicRoutes === 0
).length;
const expectedDestinationCount =
  summary.baseline.destinations + newDestinationCount;
const expectedPublicRouteCount =
  summary.baseline.publicRoutes + snapshot.routes.length;
const publicRoutes = publicRoutesModule.getPublicRouteRecords();
const publicByKey = new Map(
  publicRoutes.map(({ destination, route }) => [
    `${destination.slug}:${route.id}`,
    { destination, route }
  ])
);

assert.equal(
  destinationsModule.destinations.length,
  expectedDestinationCount,
  `Preview must contain ${expectedDestinationCount} destinations.`
);
assert.equal(
  publicRoutes.length,
  expectedPublicRouteCount,
  `Preview must contain ${expectedPublicRouteCount} public routes.`
);
assert.equal(
  snapshot.routes.length,
  summary.preview.selectedRoutes,
  "The Preview snapshot route count must match the dry-run summary."
);
assert.equal(
  snapshot.sourceMerges.length,
  summary.identity.proposedMerges,
  "The Preview source-merge count must match the dry-run summary."
);
assert.ok(
  ["pass", "pass-after-alias-migration"].includes(audit.releaseGate),
  "Production My Atlas references must pass before preview publication."
);
assert.equal(audit.issues.length, 0, "Production My Atlas reference audit must have zero issues.");

const publishedPicks = publicRoutes.filter(({ route }) =>
  publicRoutesModule.hasPublishedRouteEditorial(route)
);
assert.equal(publishedPicks.length, 40, "RC3-3 must not change Published Picks.");

for (const [destinationSlug, expected] of Object.entries(expectedCounts)) {
  assert.equal(
    publicRoutesModule.getDestinationRouteCount(destinationSlug),
    expected,
    `${destinationSlug} must contain ${expected} public routes in Preview.`
  );
}

for (const route of snapshot.routes) {
  const key = `${route.destinationId}:${route.id}`;
  const published = publicByKey.get(key);
  assert.ok(published, `${key} is missing from the public Preview catalog.`);
  assert.equal(route.editorial.tier, "index", `${key} must remain an Indexed Route.`);
  assert.notEqual(route.editorial.status, "published", `${key} must not become a Pick.`);
  assert.equal(route.experience, undefined, `${key} must not contain an experience profile.`);
  assert.equal(route.media?.length ?? 0, 0, `${key} must not import media.`);
  assert.equal(route.sourceRecords.length, 1, `${key} must have one OpenBeta source record.`);
  assert.equal(route.sourceRecords[0].purpose, "route-reference", `${key} source purpose must be route-reference.`);
  assert.equal(route.sourceRecords[0].sourceRelease, snapshot.sourceRelease, `${key} source release mismatch.`);
  assert.ok(
    route.externalResources.some(
      (resource) =>
        resource.linkStatus === "route-specific" &&
        resource.url === route.sourceRecords[0].sourceUrl
    ),
    `${key} must expose its exact route source link.`
  );
  assert.equal("latitude" in route, false, `${key} must not publish latitude.`);
  assert.equal("longitude" in route, false, `${key} must not publish longitude.`);
  assert.equal("coordinates" in route, false, `${key} must not publish coordinates.`);

  const explorerItem = routeExplorerModule.toRouteExplorerItem(published.route);
  assert.equal(explorerItem.id, route.id, `${key} failed Route Explorer conversion.`);
  for (const locale of ["en", "zh"]) {
    const viewModel = routeDetailViewModelModule.buildRouteDetailViewModel(
      published.route,
      { locale, destination: published.destination }
    );
    assert.equal(viewModel.identity.id, route.id, `${key} failed ${locale} detail ViewModel conversion.`);
  }
}

for (const merge of snapshot.sourceMerges) {
  const key = `${merge.destinationSlug}:${merge.canonicalRouteId}`;
  const canonical = publicByKey.get(key);
  assert.ok(canonical, `${key} merge target is missing.`);
  const incomingSource = merge.sourceRecords[0];
  assert.ok(
    canonical.route.sourceRecords.some(
      (source) =>
        source.provider === incomingSource.provider &&
        source.externalId === incomingSource.externalId
    ),
    `${key} did not receive the imported source identity.`
  );
  assert.equal(
    routeAliasesModule.resolveRouteId(merge.destinationSlug, merge.mergedRouteId),
    merge.canonicalRouteId,
    `${merge.destinationSlug}:${merge.mergedRouteId} does not resolve to its canonical route.`
  );
}

console.log(`${batchId} Preview validation passed.`);
console.log(`Destinations: ${destinationsModule.destinations.length}`);
console.log(`Public routes: ${publicRoutes.length}`);
console.log(`New Indexed Routes: ${snapshot.routes.length}`);
console.log(`Source merges: ${snapshot.sourceMerges.length}`);
console.log(`Published Picks: ${publishedPicks.length}`);
console.log("My Atlas reference gate: pass");
