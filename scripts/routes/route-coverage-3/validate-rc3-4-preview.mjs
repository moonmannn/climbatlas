import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import { loadRouteProject } from "../load-route-project.mjs";

const root = process.cwd();
const batchId = "route-coverage-3-batch-1";
const destinationSlugs = [
  "joshua-tree-usa",
  "squamish-canada",
  "bishop-area-usa",
  "red-rock-canyon-usa"
];
const sampleSize = 20;
const baseUrlArgument = process.argv.indexOf("--base-url");
const baseUrl =
  baseUrlArgument >= 0
    ? process.argv[baseUrlArgument + 1]?.replace(/\/$/, "")
    : undefined;

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function publicRoutePath(route) {
  return `/destinations/${route.destinationId}/routes/${route.id}`;
}

function sampleBucket(route) {
  return [
    route.areaName ?? "(no-area)",
    route.sectorName ?? "(no-sector)",
    route.climbingType,
    route.grade.filterBand ?? "unknown"
  ].join("|");
}

function balancedSample(routes, count) {
  const groups = new Map();
  for (const route of routes) {
    const key = sampleBucket(route);
    const group = groups.get(key) ?? [];
    group.push(route);
    groups.set(key, group);
  }

  const queues = Array.from(groups.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, group]) => group.sort((first, second) => first.id.localeCompare(second.id)));
  const selected = [];

  while (selected.length < count && queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const route = queue.shift();
      if (route) selected.push(route);
      if (selected.length === count) break;
    }
  }

  return selected;
}

function uniqueValues(routes, selector) {
  return Array.from(new Set(routes.map(selector).filter(Boolean))).sort();
}

function htmlIncludesRouteName(html, name) {
  const normalizedHtml = html
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"');
  return normalizedHtml.includes(name);
}

const snapshot = readJson(
  path.join(root, "src", "data", "routes", "imports", `${batchId}.json`)
);
const {
  publicRoutesModule,
  routeAliasesModule,
  routeDetailViewModelModule,
  routeExplorerModule
} = loadRouteProject(root);
const publicRoutes = publicRoutesModule.getPublicRouteRecords();
const publicByKey = new Map(
  publicRoutes.map(({ destination, route }) => [
    `${destination.slug}:${route.id}`,
    { destination, route }
  ])
);

assert.equal(snapshot.routes.length, 394, "RC3-4 requires the reviewed 394-route snapshot.");
assert.equal(publicRoutes.length, 1468, "RC3-4 requires the 1,468-route Preview catalog.");
assert.equal(
  publicRoutes.filter(({ route }) => publicRoutesModule.hasPublishedRouteEditorial(route)).length,
  40,
  "Published Picks changed before RC3-4."
);

const samples = [];
const destinationReports = [];

for (const destinationSlug of destinationSlugs) {
  const candidates = snapshot.routes.filter(
    (route) => route.destinationId === destinationSlug
  );
  const selected = balancedSample(candidates, sampleSize);
  assert.equal(selected.length, sampleSize, `${destinationSlug} needs 20 Preview samples.`);

  for (const snapshotRoute of selected) {
    const key = `${destinationSlug}:${snapshotRoute.id}`;
    const published = publicByKey.get(key);
    assert.ok(published, `${key} is missing from the public catalog.`);
    assert.equal(snapshotRoute.editorial.tier, "index", `${key} is not an Indexed Route.`);
    assert.equal(snapshotRoute.experience, undefined, `${key} unexpectedly has experience content.`);
    assert.equal(snapshotRoute.media?.length ?? 0, 0, `${key} unexpectedly has media.`);
    assert.ok(snapshotRoute.grade.original, `${key} is missing its original grade.`);
    assert.ok(snapshotRoute.sourceRecords.length > 0, `${key} is missing a route source.`);
    assert.ok(
      snapshotRoute.externalResources.some(
        (resource) => resource.linkStatus === "route-specific"
      ),
      `${key} is missing an exact route resource.`
    );

    const explorerItem = routeExplorerModule.toRouteExplorerItem(published.route);
    assert.equal(explorerItem.id, snapshotRoute.id, `${key} failed explorer conversion.`);
    for (const locale of ["en", "zh"]) {
      const viewModel = routeDetailViewModelModule.buildRouteDetailViewModel(
        published.route,
        { locale, destination: published.destination }
      );
      assert.equal(viewModel.identity.id, snapshotRoute.id, `${key} failed ${locale} ViewModel conversion.`);
      assert.ok(viewModel.identity.name, `${key} has no ${locale} public name.`);
      assert.ok(viewModel.facts.climbingTypeLabel, `${key} leaks an empty climbing type in ${locale}.`);
    }

    samples.push({
      destinationSlug,
      routeId: snapshotRoute.id,
      name: snapshotRoute.name,
      path: publicRoutePath(snapshotRoute),
      originalGrade: snapshotRoute.grade.original,
      gradeSystem: snapshotRoute.grade.primarySystem ?? snapshotRoute.grade.system,
      climbingType: snapshotRoute.climbingType,
      areaName: snapshotRoute.areaName,
      sectorName: snapshotRoute.sectorName,
      exactSourceUrl: snapshotRoute.sourceRecords[0].sourceUrl
    });
  }

  destinationReports.push({
    destinationSlug,
    candidateCount: candidates.length,
    sampleCount: selected.length,
    representedAreas: uniqueValues(selected, (route) => route.areaName),
    representedSectors: uniqueValues(selected, (route) => route.sectorName),
    representedTypes: uniqueValues(selected, (route) => route.climbingType),
    representedGradeSystems: uniqueValues(
      selected,
      (route) => route.grade.primarySystem ?? route.grade.system
    ),
    representedDifficultyBands: uniqueValues(
      selected,
      (route) => route.grade.filterBand
    )
  });
}

const httpResults = [];
if (baseUrl) {
  for (const sample of samples) {
    const response = await fetch(`${baseUrl}${sample.path}`, {
      redirect: "follow",
      headers: { "user-agent": "ClimbAtlas-RC3-4-Preview-Audit/1.0" }
    });
    const html = await response.text();
    const forbiddenPublicCopy = [
      "Not provided",
      "Information unavailable",
      "pick candidate",
      "needs upgrade",
      "imported index"
    ].filter((value) => html.includes(value));

    assert.equal(response.status, 200, `${sample.path} returned ${response.status}.`);
    assert.ok(htmlIncludesRouteName(html, sample.name), `${sample.path} omitted its route name.`);
    assert.ok(html.includes(sample.exactSourceUrl), `${sample.path} omitted its exact route source.`);
    assert.deepEqual(forbiddenPublicCopy, [], `${sample.path} exposes internal or placeholder copy.`);

    httpResults.push({
      path: sample.path,
      status: response.status,
      containsRouteName: true,
      containsExactSource: true,
      forbiddenPublicCopy: []
    });
  }

  for (const merge of snapshot.sourceMerges.slice(0, 10)) {
    const aliasPath = `/destinations/${merge.destinationSlug}/routes/${merge.mergedRouteId}`;
    const response = await fetch(`${baseUrl}${aliasPath}`, {
      redirect: "manual",
      headers: { "user-agent": "ClimbAtlas-RC3-4-Preview-Audit/1.0" }
    });
    const expectedLocation = `/destinations/${merge.destinationSlug}/routes/${merge.canonicalRouteId}`;
    assert.ok([301, 302, 307, 308].includes(response.status), `${aliasPath} did not redirect.`);
    assert.equal(response.headers.get("location"), expectedLocation, `${aliasPath} redirected incorrectly.`);
    assert.equal(
      routeAliasesModule.resolveRouteId(merge.destinationSlug, merge.mergedRouteId),
      merge.canonicalRouteId,
      `${aliasPath} disagrees with the catalog alias map.`
    );
  }
}

const report = {
  schemaVersion: 1,
  batchId,
  generatedAt: new Date().toISOString(),
  baseUrl: baseUrl ?? null,
  totalSamples: samples.length,
  destinationReports,
  samples,
  httpValidation: baseUrl
    ? {
        checked: httpResults.length,
        passed: httpResults.length,
        failed: 0,
        aliasRedirectsChecked: Math.min(10, snapshot.sourceMerges.length)
      }
    : { checked: 0, passed: 0, failed: 0, aliasRedirectsChecked: 0 }
};
const outputDirectory = path.join(root, "docs", "reports", batchId);
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(
  path.join(outputDirectory, "rc3-4-preview-samples.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8"
);

console.log("Route Coverage 3.0 RC3-4 sample validation passed.");
console.log(`Sampled routes: ${samples.length}`);
console.log(`Destinations: ${destinationReports.length}`);
console.log(`HTTP pages checked: ${httpResults.length}`);
console.log(`Alias redirects checked: ${report.httpValidation.aliasRedirectsChecked}`);
console.log(`Report: docs/reports/${batchId}/rc3-4-preview-samples.json`);
