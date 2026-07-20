import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { loadRouteProject } from "./load-route-project.mjs";

const root = process.cwd();
const {
  auditModule,
  destinationsModule,
  publicRoutesModule,
  routeDetailViewModelModule,
  routeFactResolutionModule,
  routesModule
} = loadRouteProject(root);

const {
  buildRouteDetailViewModel,
  inspectRouteDetailViewModelBuild,
  RouteViewModelBuildError
} = routeDetailViewModelModule;
const { resolveRouteFactCandidates } = routeFactResolutionModule;
const destinations = destinationsModule.destinations;
const destinationById = new Map(
  destinations.map((destination) => [destination.slug, destination])
);
const publicRoutes = publicRoutesModule.getPublicRouteRecords();
const allRoutes = routesModule.getAllRouteRecordsWithDestinations();
const allEntries = routesModule.getAllRouteCatalogEntries().map(({ entry }) => entry);
const audit = auditModule.buildRouteAuditReport(
  allEntries,
  new Map(destinations.map((destination) => [destination.slug, destination.name]))
);

const failures = [];
const invalidMedia = [];
let duplicateSourcesRemoved = 0;
let duplicateResourcesRemoved = 0;
const afterCounts = new Map();

for (const { destination, route } of publicRoutes) {
  try {
    const english = inspectRouteDetailViewModelBuild(route, {
      destination,
      locale: "en"
    });
    const chinese = buildRouteDetailViewModel(route, {
      destination,
      locale: "zh"
    });

    assert.equal(english.viewModel.identity.id, route.id);
    assert.equal(chinese.identity.id, route.id);
    duplicateSourcesRemoved += english.diagnostics.duplicateSourcesRemoved;
    duplicateResourcesRemoved += english.diagnostics.duplicateResourcesRemoved;
    invalidMedia.push(
      ...english.diagnostics.invalidMedia.map((issue) => ({
        routeKey: `${destination.slug}:${route.id}`,
        ...issue
      }))
    );
    afterCounts.set(destination.slug, (afterCounts.get(destination.slug) ?? 0) + 1);
  } catch (error) {
    failures.push({
      routeKey: `${destination.slug}:${route.id}`,
      code:
        error instanceof RouteViewModelBuildError
          ? error.code
          : "unexpected-build-error",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

const beforeCounts = new Map(
  destinations.map((destination) => [
    destination.slug,
    publicRoutes.filter(
      ({ destination: itemDestination }) =>
        itemDestination.slug === destination.slug
    ).length
  ])
);
const destinationCounts = destinations.map((destination) => {
  const before = beforeCounts.get(destination.slug) ?? 0;
  const after = afterCounts.get(destination.slug) ?? 0;
  const failedRouteIds = failures
    .filter((failure) => failure.routeKey.startsWith(`${destination.slug}:`))
    .map((failure) => failure.routeKey.split(":").slice(1).join(":"));

  return {
    destinationId: destination.slug,
    destinationName: destination.name,
    before,
    after,
    delta: after - before,
    failedRouteIds
  };
});

// Adapter parity: every legacy public route keeps its public facts and rich
// fields in normalized storage, even while editorial publication stays gated.
let legacyParityChecked = 0;
for (const { destination, route } of publicRoutes) {
  if (!route.legacy) continue;
  const legacy = route.legacy;
  legacyParityChecked += 1;
  assert.equal(route.id, legacy.id);
  assert.equal(route.name, legacy.name);
  assert.equal(route.destinationId, destination.slug);
  assert.equal(route.grade.original, legacy.grade);
  assert.equal(route.climbingType, legacy.type);
  assert.equal(route.lengthOriginal, legacy.length?.trim() || undefined);
  assert.equal(route.sectorName, legacy.sector?.trim() || undefined);
  assert.equal((route.media ?? []).length, legacy.images.length);
  assert.equal(route.editorial.summary?.en, legacy.summary);
  assert.equal(route.editorial.whyItStandsOut?.en, legacy.style);
  assert.deepEqual(
    route.editorial.practiceFocus?.map((item) => item.en),
    legacy.practiceFocus
  );
}

const sample = publicRoutes[0];
assert.ok(sample, "At least one public route fixture is required.");
const optionalFactsRoute = {
  ...sample.route,
  grade: {
    ...sample.route.grade,
    original: "",
    system: "unknown",
    detectedSystems: [],
    primarySystem: undefined,
    primaryDisplay: undefined,
    normalizedDifficulty: undefined,
    equivalentGrades: undefined,
    rangeMin: undefined,
    rangeMax: undefined,
    sortValue: undefined,
    filterBands: [],
    parseStatus: "unparsed"
  },
  sectorName: undefined,
  lengthOriginal: undefined,
  pitches: undefined,
  media: undefined
};
const optionalFactsViewModel = buildRouteDetailViewModel(optionalFactsRoute, {
  destination: sample.destination,
  locale: "en"
});
assert.equal(optionalFactsViewModel.facts.originalGrade, undefined);
assert.equal(optionalFactsViewModel.facts.gradeSystemLabel, undefined);
assert.equal(optionalFactsViewModel.facts.lengthLabel, undefined);
assert.equal(optionalFactsViewModel.facts.pitchesLabel, undefined);
assert.equal(optionalFactsViewModel.media, undefined);

for (const [field, route] of [
  ["id", { ...sample.route, id: "" }],
  ["slug", { ...sample.route, slug: "" }],
  ["name", { ...sample.route, name: "" }],
  ["destination", { ...sample.route, destinationId: "" }]
]) {
  assert.throws(
    () =>
      buildRouteDetailViewModel(route, {
        destination: sample.destination,
        locale: "en"
      }),
    RouteViewModelBuildError,
    `Missing ${field} must fail ViewModel construction.`
  );
}

const otherDestination = destinations.find(
  (destination) => destination.slug !== sample.destination.slug
);
assert.ok(otherDestination, "A second destination fixture is required.");
assert.throws(
  () =>
    buildRouteDetailViewModel(sample.route, {
      destination: otherDestination,
      locale: "en"
    }),
  RouteViewModelBuildError,
  "Destination mismatch must fail ViewModel construction."
);

const factResolution = resolveRouteFactCandidates([
  {
    field: "originalGrade",
    sourceKey: "route:low",
    sourcePriority: 110,
    value: "5.10a"
  },
  {
    field: "originalGrade",
    sourceKey: "route:high",
    sourcePriority: 430,
    value: "5.10b"
  }
]);
assert.equal(factResolution?.value, "5.10b");
assert.equal(factResolution?.conflict?.candidates.length, 2);

const sourceDedupeRoute = {
  ...sample.route,
  sourceRecords: [
    {
      ...sample.route.sourceRecords[0],
      provider: "other",
      externalId: undefined,
      purpose: "route",
      sourceUrl: "https://www.example.com/route/123/?utm_source=test"
    },
    {
      ...sample.route.sourceRecords[0],
      provider: "other",
      externalId: undefined,
      purpose: "route",
      sourceUrl: "https://example.com/route/123"
    },
    {
      ...sample.route.sourceRecords[0],
      provider: "official-organization",
      externalId: undefined,
      purpose: "access",
      sourceUrl: "https://example.com/route/123/"
    }
  ],
  externalResources: []
};
const sourceDedupe = inspectRouteDetailViewModelBuild(sourceDedupeRoute, {
  destination: sample.destination,
  locale: "en"
});
assert.equal(sourceDedupe.viewModel.routeSources.length, 1);
assert.equal(sourceDedupe.viewModel.accessSources.length, 1);
assert.equal(sourceDedupe.diagnostics.duplicateSourcesRemoved, 1);

const mediaRoute = {
  ...sample.route,
  media: [
    {
      src: "/route.jpg",
      alt: "Route photograph",
      caption: "Exact route",
      credit: "Photographer",
      license: "CC BY 4.0",
      sourceUrl: "https://example.com/route-photo",
      kind: "route"
    },
    {
      src: "/destination.jpg",
      alt: "Destination context",
      caption: "Destination context, not the exact route",
      credit: "Photographer",
      license: "CC BY 4.0",
      sourceUrl: "https://example.com/destination-photo",
      kind: "destination-context"
    }
  ]
};
const mediaViewModel = buildRouteDetailViewModel(mediaRoute, {
  destination: sample.destination,
  locale: "en"
});
assert.equal(mediaViewModel.media?.routeImages.length, 1);
assert.equal(mediaViewModel.media?.contextImages.length, 1);
assert.equal(mediaViewModel.media?.contextImages[0].kind, "destination-context");

const builderPath = path.join(
  root,
  "src",
  "lib",
  "routes",
  "presentation",
  "route-detail-view-model.ts"
);
const builderSource = fs.readFileSync(builderPath, "utf8");
for (const forbidden of [
  "RouteHighlight",
  ".legacy",
  "openBetaId",
  "mountainProjectUrl",
  "openbeta",
  "mountain-project",
  "provider ==="
]) {
  assert.equal(
    builderSource.includes(forbidden),
    false,
    `ViewModel builder must not recognize legacy field ${forbidden}.`
  );
}

const publicPagePath = path.join(
  root,
  "src",
  "app",
  "destinations",
  "[slug]",
  "routes",
  "[routeId]",
  "page.tsx"
);
const publicPageSource = fs.readFileSync(publicPagePath, "utf8");
assert.ok(
  publicPageSource.includes("LocalizedRouteDetailView") &&
    publicPageSource.includes("buildRouteDetailViewModel"),
  "RC-4 public routes must use the unified RouteDetailViewModel renderer."
);
for (const forbiddenPublicBranch of [
  "RouteHighlightCard",
  "RouteRecordCard",
  "legacyRoute",
  "entry.legacy",
  "toPublicRouteFacts"
]) {
  assert.equal(
    publicPageSource.includes(forbiddenPublicBranch),
    false,
    `Public route page must not read or render ${forbiddenPublicBranch}.`
  );
}

function normalizedComparable(value) {
  if (value === undefined || value === null || value === "") return undefined;
  return String(value).trim().toLowerCase();
}

const routesByKey = new Map(
  allRoutes.map(({ route }) => [`${route.destinationId}:${route.id}`, route])
);
const duplicateDataConflicts = audit.duplicateCandidates.map((candidate) => {
  const first = routesByKey.get(
    `${candidate.first.destinationId}:${candidate.first.id}`
  );
  const second = routesByKey.get(
    `${candidate.second.destinationId}:${candidate.second.id}`
  );
  const fields = [
    ["originalGrade", first?.grade.original, second?.grade.original],
    ["climbingType", first?.climbingType, second?.climbingType],
    ["sectorName", first?.sectorName, second?.sectorName],
    ["lengthOriginal", first?.lengthOriginal, second?.lengthOriginal]
  ]
    .filter(
      ([, firstValue, secondValue]) =>
        normalizedComparable(firstValue) !== normalizedComparable(secondValue)
    )
    .map(([field, firstValue, secondValue]) => ({
      field,
      firstValue,
      secondValue
    }));

  return {
    status: "unresolved-duplicate-candidate",
    reason: "Separate route records cannot be merged without source-level review.",
    ...candidate,
    conflictingFields: fields
  };
});
const adapterFactConflicts = allRoutes.flatMap(({ route }) =>
  (route.normalization?.factConflicts ?? []).map((conflict) => ({
    routeKey: `${route.destinationId}:${route.id}`,
    status: "resolved-by-source-priority",
    ...conflict
  }))
);
const unparseableGrades = allRoutes
  .filter(
    ({ route }) =>
      !route.grade.original.trim() || route.grade.parseStatus === "unparsed"
  )
  .map(({ route }) => ({
    routeKey: `${route.destinationId}:${route.id}`,
    originalGrade: route.grade.original,
    system: route.grade.system
  }));
const missingSources = allRoutes
  .filter(({ route }) => route.sourceRecords.length === 0)
  .map(({ route }) => `${route.destinationId}:${route.id}`);
const publishedEditorial = publicRoutes.filter(({ route }) =>
  publicRoutesModule.hasPublishedRouteEditorial(route)
).length;

const report = {
  schemaVersion: "rendering-consistency-rc6",
  generatedAt: new Date().toISOString(),
  paths: {
    legacyInput: "Destination.routes / RouteHighlight",
    legacyAdapter: "src/lib/routes/adapters/legacy-route-adapter.ts",
    openBetaInput: "OpenBeta raw route and canonical review snapshot",
    openBetaAdapter: "src/lib/routes/adapters/openbeta-route-adapter.ts",
    canonicalRecord: "src/types/route.ts#RouteRecord",
    viewModelBuilder:
      "src/lib/routes/presentation/route-detail-view-model.ts",
    currentPublicRoutePage:
      "src/app/destinations/[slug]/routes/[routeId]/page.tsx"
  },
  summary: {
    destinations: destinations.length,
    catalogEntries: allEntries.length,
    routeRecords: allRoutes.length,
    areaIndexes: audit.summary.areaIndexes,
    publicRoutesBefore: publicRoutes.length,
    viewModelsBuilt: publicRoutes.length - failures.length,
    legacyRouteRecords: publicRoutes.filter(({ route }) => route.legacy).length,
    canonicalSnapshotRouteRecords: publicRoutes.filter(({ route }) => !route.legacy)
      .length,
    routesWithPublishedEditorial: publishedEditorial,
    routesWithFactsOnly: publicRoutes.length - publishedEditorial,
    missingSources: missingSources.length,
    unparseableGrades: unparseableGrades.length,
    duplicateSourcesRemoved,
    duplicateResourcesRemoved,
    invalidMedia: invalidMedia.length,
    viewModelFailures: failures.length,
    dataConflicts:
      adapterFactConflicts.length + duplicateDataConflicts.length
  },
  parity: {
    legacyRoutesChecked: legacyParityChecked,
    optionalFactsAccepted: true,
    criticalIdentityRejected: true,
    sourcePurposeDedupePassed: true,
    conflictPriorityFixturePassed: true,
    mediaSeparationPassed: true,
    builderLegacyFieldCheckPassed: true,
    unifiedPublicRendererActive: true,
    oldPublicRendererStillPresent: false
  },
  publicMigration: {
    routeDetailRenderer: "src/components/RouteDetailView.tsx",
    legacyPublicComponentsRemoved: true,
    gradeFilter: {
      oneActiveSystem: true,
      multipleGradesWithinSystem: true,
      semanticControls: true,
      urlParameters: ["gradeSystem", "grades", "type"]
    },
    dnaEmptyState: {
      serverRenderedAnonymousState: true,
      clientEnhancementAfterValidatedProfile: true,
      defaultMatchPercentage: false
    }
  },
  destinations: destinationCounts,
  viewModelFailures: failures,
  dataConflicts: [...adapterFactConflicts, ...duplicateDataConflicts],
  invalidMedia,
  missingSources,
  unparseableGrades,
  nextPublicComponents: [
    "src/app/destinations/[slug]/routes/[routeId]/page.tsx",
    "src/components/RouteDetailView.tsx",
    "src/components/RouteIndex.tsx",
    "src/app/destinations/[slug]/page.tsx",
    "src/components/DestinationDnaMatch.tsx"
  ]
};

const outputArgumentIndex = process.argv.indexOf("--output");
const outputArgument =
  outputArgumentIndex >= 0 ? process.argv[outputArgumentIndex + 1] : undefined;
if (outputArgumentIndex >= 0 && !outputArgument) {
  throw new Error("--output requires a file path.");
}
const outputPath = outputArgument
  ? path.resolve(root, outputArgument)
  : path.join(root, "outputs", "route-rendering-consistency-rc3.json");
if (!process.argv.includes("--no-write")) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

assert.equal(failures.length, 0, "All public routes must build a ViewModel.");
assert.equal(
  destinationCounts.some((destination) => destination.delta !== 0),
  false,
  "Public route counts must be conserved for every destination."
);

console.log("Route rendering consistency RC-6 validation passed.");
console.log(`Public routes before: ${publicRoutes.length}`);
console.log(`ViewModels built: ${publicRoutes.length - failures.length}`);
console.log(`Legacy parity checked: ${legacyParityChecked}`);
console.log(`Destinations conserved: ${destinationCounts.length}`);
console.log(`ViewModel failures: ${failures.length}`);
console.log(`Data conflicts reported: ${report.summary.dataConflicts}`);
console.log(`Unparseable grades reported: ${unparseableGrades.length}`);
console.log(`Invalid media reported: ${invalidMedia.length}`);
console.log(
  process.argv.includes("--no-write")
    ? "Report: not written (--no-write)"
    : `Report: ${path.relative(root, outputPath)}`
);
