import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

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
const outputDirectory = path.join(root, "outputs", batchId);
const destinationPath = path.join(
  root,
  "src",
  "data",
  "routes",
  "imports",
  `${batchId}.json`
);

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function fail(message) {
  throw new Error(`RC3-3 preview catalog blocked: ${message}`);
}

const summary = readJson(path.join(outputDirectory, "dry-run-summary.json"));
const routeSnapshot = readJson(
  path.join(outputDirectory, "preview-route-snapshot.json")
);
const mergeSnapshot = readJson(
  path.join(outputDirectory, "merge-source-preview.json")
);

if (!summary.source.shaMatches || !summary.source.rowCountMatches || !summary.source.schemaMatches) {
  fail("source snapshot identity does not match the locked manifest");
}
if (
  !["pass", "pass-after-alias-migration"].includes(
    summary.qualityGates.productionMyAtlasReferenceAudit
  )
) {
  fail("the production My Atlas reference audit has not passed");
}
if (summary.qualityGates.unresolvedIdentityConflicts !== 0) {
  fail("unresolved identity conflicts remain");
}
if (summary.qualityGates.brokenSelectedExactLinks !== 0) {
  fail("a selected route has a broken exact link");
}
if (summary.preview.selectedRoutes !== routeSnapshot.routes.length) {
  fail("selected route count differs from the normalized snapshot");
}
if (summary.identity.proposedMerges !== mergeSnapshot.merges.length) {
  fail("merge count differs from the merge-source snapshot");
}
if (
  summary.preview.publishedPicks !==
  (manifest.baselinePublishedPicks ?? 40)
) {
  fail("Published Picks changed before preview publication");
}
if (!summary.qualityGates.requiredSourceIdentitiesSelected) {
  fail("one or more reviewed required source identities were not selected");
}
if (!summary.qualityGates.selectionTypeTargetsReached) {
  fail("one or more destination climbing-type targets were not reached");
}
if (!summary.qualityGates.destinationMinimumsReached) {
  fail("one or more destinations did not reach the reviewed minimum");
}

const routes = [...routeSnapshot.routes].sort(
  (first, second) =>
    first.destinationId.localeCompare(second.destinationId) ||
    first.id.localeCompare(second.id)
);
const sourceMerges = mergeSnapshot.merges
  .map(({ destinationSlug, canonicalRouteId, sourceRoute }) => ({
    destinationSlug,
    canonicalRouteId,
    mergedRouteId: sourceRoute.id,
    sourceRecords: sourceRoute.sourceRecords,
    externalResources: sourceRoute.externalResources
  }))
  .sort(
    (first, second) =>
      first.destinationSlug.localeCompare(second.destinationSlug) ||
      first.canonicalRouteId.localeCompare(second.canonicalRouteId)
  );

const snapshot = {
  schemaVersion: 1,
  batchId,
  source: "openbeta",
  sourceRelease: manifest.sourceRelease,
  sourceSha256: manifest.sourceSha256,
  generatedAt: manifest.sourceCheckedAt,
  publicationStatus: "preview-catalog",
  destinations: Array.from(
    new Set(routes.map((route) => route.destinationId))
  ).sort(),
  routes,
  sourceMerges
};

writeFileSync(destinationPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log("Route Coverage 3.0 RC3-3 preview catalog generated");
console.log(`Routes: ${routes.length}`);
console.log(`Source merges: ${sourceMerges.length}`);
console.log(`Output: ${destinationPath}`);
