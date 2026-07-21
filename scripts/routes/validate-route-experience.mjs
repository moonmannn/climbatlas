import assert from "node:assert/strict";
import process from "node:process";

import { loadRouteProject } from "./load-route-project.mjs";

const EXPECTED_PUBLIC_ROUTES = 1074;
const EXPECTED_PICKS = 40;
const EXPECTED_PICKS_PER_DESTINATION = 8;
const TARGET_DESTINATIONS = [
  "yosemite-usa",
  "red-river-gorge-usa",
  "squamish-canada",
  "fontainebleau-france",
  "kalymnos-greece"
];

const {
  publicRoutesModule,
  routeDetailViewModelModule,
  routeExperienceModule
} = loadRouteProject();

const publicRoutes = publicRoutesModule.getPublicRouteRecords();
const overlays = routeExperienceModule.routeExperienceOverlays;
const { buildRouteDetailViewModel } = routeDetailViewModelModule;
const routeByKey = new Map(
  publicRoutes.map((item) => [
    `${item.destination.slug}:${item.route.id}`,
    item
  ])
);

const errors = [];
const warnings = [];

function addError(routeKey, message) {
  errors.push({ routeKey, message });
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function hasLocalizedPair(value) {
  return Boolean(value?.en?.trim() && value?.zh?.trim());
}

function walkObject(value, callback, path = []) {
  if (!value || typeof value !== "object") return;
  callback(value, path);
  for (const [key, child] of Object.entries(value)) {
    walkObject(child, callback, [...path, key]);
  }
}

function evidenceEntries(experience) {
  const entries = [];
  walkObject(experience, (value, path) => {
    if (
      typeof value.origin === "string" &&
      Object.prototype.hasOwnProperty.call(value, "value")
    ) {
      entries.push({ evidence: value, path: path.join(".") });
    }
  });
  return entries;
}

assert.equal(
  publicRoutes.length,
  EXPECTED_PUBLIC_ROUTES,
  `Public route count changed from ${EXPECTED_PUBLIC_ROUTES}.`
);
assert.equal(
  overlays.length,
  EXPECTED_PICKS,
  `Expected ${EXPECTED_PICKS} reviewed experience overlays.`
);

const overlayKeys = new Set();
const picksByDestination = new Map();

for (const overlay of overlays) {
  const routeKey = `${overlay.destinationSlug}:${overlay.routeId}`;
  if (overlayKeys.has(routeKey)) {
    addError(routeKey, "Duplicate route experience overlay.");
    continue;
  }
  overlayKeys.add(routeKey);

  const item = routeByKey.get(routeKey);
  if (!item) {
    addError(routeKey, "Experience overlay does not match a public route.");
    continue;
  }

  picksByDestination.set(
    overlay.destinationSlug,
    (picksByDestination.get(overlay.destinationSlug) ?? 0) + 1
  );

  const { route, destination } = item;
  if (route.editorial.tier !== "pick" || route.editorial.status !== "published") {
    addError(routeKey, "Overlay did not publish the route as a ClimbAtlas Pick.");
  }
  if (!route.experience) {
    addError(routeKey, "Published Pick is missing its experience profile.");
    continue;
  }

  for (const [field, value] of [
    ["summary", overlay.editorial.summary],
    ["whyItStandsOut", overlay.editorial.whyItStandsOut],
    ["bestForText", overlay.editorial.bestForText]
  ]) {
    if (!hasLocalizedPair(value)) {
      addError(routeKey, `${field} requires aligned English and Chinese copy.`);
    }
  }
  if (!overlay.editorial.thingsToConsider?.length) {
    addError(routeKey, "Things to consider requires at least one bilingual item.");
  } else {
    overlay.editorial.thingsToConsider.forEach((item, index) => {
      if (!hasLocalizedPair(item)) {
        addError(
          routeKey,
          `thingsToConsider[${index}] requires aligned English and Chinese copy.`
        );
      }
    });
  }

  const sourceById = new Map(route.sourceRecords.map((source) => [source.id, source]));
  for (const { evidence, path } of evidenceEntries(route.experience)) {
    if (evidence.origin === "community") {
      addError(routeKey, `${path} cannot publish community evidence in 1.0.`);
    }

    for (const sourceId of evidence.sourceIds ?? []) {
      if (!sourceById.has(sourceId)) {
        addError(routeKey, `${path} references missing source ID ${sourceId}.`);
      }
    }

    if (evidence.origin === "source") {
      if (!evidence.sourceIds?.length) {
        addError(routeKey, `${path} is source-backed but has no source IDs.`);
      }
      if (!isIsoDate(evidence.checkedAt)) {
        addError(routeKey, `${path} is source-backed but has no valid checkedAt date.`);
      }
    }

    if (evidence.origin === "inferred") {
      if (!evidence.inferredFrom?.length) {
        addError(routeKey, `${path} is inferred but does not record its inputs.`);
      }
      if (
        path.startsWith("logistics.") ||
        path === "challenge.exposure" ||
        path === "challenge.commitment"
      ) {
        addError(routeKey, `${path} cannot use inferred evidence.`);
      }
    }
  }

  walkObject(route.experience, (_value, path) => {
    const key = path.at(-1)?.toLowerCase();
    if (["beta", "protection", "descent", "rope", "gear"].includes(key)) {
      addError(routeKey, `Forbidden experience field published at ${path.join(".")}.`);
    }
  });

  for (const media of overlay.media ?? []) {
    if (media.kind !== "route") {
      continue;
    }
    if (
      !media.src.trim() ||
      !media.alt.trim() ||
      !media.credit.trim() ||
      !media.license.trim() ||
      !media.sourceUrl.trim()
    ) {
      addError(routeKey, "Exact route media requires src, alt, credit, license, and source URL.");
    }
  }

  const english = buildRouteDetailViewModel(route, {
    destination,
    locale: "en"
  });
  const chinese = buildRouteDetailViewModel(route, {
    destination,
    locale: "zh"
  });
  if (!english.experience || !chinese.experience) {
    addError(routeKey, "Published experience is missing from one localized ViewModel.");
  } else {
    for (const path of [
      ["whatToExpect", "wallAngle"],
      ["whatToExpect", "terrain"],
      ["whatToExpect", "movementTendency"],
      ["whatToExpect", "difficultyShape"],
      ["challenge", "primaryDemand"]
    ]) {
      const en = english.experience[path[0]][path[1]]?.value;
      const zh = chinese.experience[path[0]][path[1]]?.value;
      if (!en?.trim() || !zh?.trim()) {
        addError(routeKey, `${path.join(".")} is missing a localized public label.`);
      }
    }
  }
}

for (const destinationSlug of TARGET_DESTINATIONS) {
  const count = picksByDestination.get(destinationSlug) ?? 0;
  if (count !== EXPECTED_PICKS_PER_DESTINATION) {
    addError(
      destinationSlug,
      `Expected ${EXPECTED_PICKS_PER_DESTINATION} Picks, received ${count}.`
    );
  }

  const bands = new Set(
    publicRoutes
      .filter(
        ({ destination, route }) =>
          destination.slug === destinationSlug &&
          route.editorial.tier === "pick" &&
          route.editorial.status === "published"
      )
      .flatMap(({ route }) => route.grade.filterBands)
      .filter((band) => band !== "unknown")
  );
  if (bands.size < 3) {
    addError(
      destinationSlug,
      `Picks cover only ${bands.size} comparable difficulty bands: ${Array.from(bands).join(", ")}.`
    );
  }

  const eliteCount = publicRoutes.filter(
    ({ destination, route }) =>
      destination.slug === destinationSlug &&
      route.editorial.tier === "pick" &&
      route.editorial.status === "published" &&
      route.grade.filterBands.includes("elite")
  ).length;
  if (eliteCount > 2) {
    addError(destinationSlug, `Picks include ${eliteCount} elite routes; maximum is 2.`);
  }
}

const publishedPicks = publicRoutes.filter(
  ({ route }) =>
    route.editorial.tier === "pick" && route.editorial.status === "published"
);
if (publishedPicks.length !== EXPECTED_PICKS) {
  addError(
    "catalog",
    `Expected ${EXPECTED_PICKS} published Picks, received ${publishedPicks.length}.`
  );
}
for (const { destination, route } of publishedPicks) {
  const routeKey = `${destination.slug}:${route.id}`;
  if (!overlayKeys.has(routeKey)) {
    addError(routeKey, "Route became a published Pick without a reviewed overlay.");
  }
}

const indexFixture = publicRoutes.find(
  ({ route }) => route.editorial.tier === "index"
);
assert.ok(indexFixture, "An Indexed Route fixture is required.");
const indexViewModel = buildRouteDetailViewModel(indexFixture.route, {
  destination: indexFixture.destination,
  locale: "en"
});
assert.equal(indexViewModel.badges.isPublishedPick, false);
assert.equal(indexViewModel.experience, undefined);

const noImagePick = publishedPicks.find(
  ({ route }) => !(route.media ?? []).some((media) => media.kind === "route")
);
assert.ok(noImagePick, "A text-only Pick fixture is required.");
const noImageViewModel = buildRouteDetailViewModel(noImagePick.route, {
  destination: noImagePick.destination,
  locale: "en"
});
assert.equal(noImageViewModel.media?.routeImages.length ?? 0, 0);

const noLogisticsPick = publishedPicks.find(
  ({ route }) => !route.experience?.logistics
);
assert.ok(noLogisticsPick, "A Pick without optional Logistics is required.");
const noLogisticsViewModel = buildRouteDetailViewModel(noLogisticsPick.route, {
  destination: noLogisticsPick.destination,
  locale: "en"
});
assert.equal(noLogisticsViewModel.experience?.logistics, undefined);

console.log("Route Experience Layer 1.0 validation");
console.log(`Public routes: ${publicRoutes.length}`);
console.log(`Published Picks: ${publishedPicks.length}`);
for (const destinationSlug of TARGET_DESTINATIONS) {
  console.log(
    `${destinationSlug}: ${picksByDestination.get(destinationSlug) ?? 0} Picks`
  );
}
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

for (const issue of errors.slice(0, 60)) {
  console.error(`[ERROR] ${issue.routeKey}: ${issue.message}`);
}
if (errors.length > 60) {
  console.error(`... ${errors.length - 60} additional errors.`);
}

if (errors.length > 0) process.exitCode = 1;
