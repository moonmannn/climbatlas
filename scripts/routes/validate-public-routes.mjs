import assert from "node:assert/strict";
import { loadRouteProject } from "./load-route-project.mjs";

const {
  destinationsModule,
  publicRoutesModule,
  routeExplorerModule,
  routesModule
} = loadRouteProject();

const publicRoutes = publicRoutesModule.getPublicRouteRecords();
const publicSummaries = publicRoutesModule.getPublicRouteSummaries();
const publicExplorerItems = publicRoutes.map(({ route }) =>
  routeExplorerModule.toRouteExplorerItem(route)
);
const areaIndexes = routesModule.getAllAreaIndexesWithDestinations();
const publicKeys = new Set(
  publicRoutes.map(
    ({ destination, route }) => `${destination.slug}:${route.id}`
  )
);

assert.equal(
  publicKeys.size,
  publicRoutes.length,
  "Public route keys must be unique."
);
assert.equal(
  publicSummaries.length,
  publicRoutes.length,
  "Every public route must have one public summary."
);

const internalExplorerFields = [
  "editorialTier",
  "editorialStatus",
  "verificationStatus",
  "linkStatus",
  "completenessScore",
  "isImported"
];

for (const item of publicExplorerItems) {
  for (const field of internalExplorerFields) {
    assert.equal(
      Object.hasOwn(item, field),
      false,
      `Public explorer item ${item.destinationId}:${item.id} exposes ${field}.`
    );
  }
}
assert.equal(
  publicRoutesModule.getFilteredRouteCount(),
  publicRoutes.length,
  "The unfiltered route count must equal the public route collection."
);

for (const destination of destinationsModule.destinations) {
  const routesForDestination = publicRoutesModule.getPublicRoutesForDestination(
    destination.slug
  );
  const count = publicRoutesModule.getDestinationRouteCount(destination.slug);

  assert.equal(
    count,
    routesForDestination.length,
    `${destination.slug} has inconsistent public route counts.`
  );
  assert.equal(
    publicRoutesModule.getFilteredRouteCount({
      destinationSlug: destination.slug
    }),
    count,
    `${destination.slug} has inconsistent filtered route counts.`
  );
}

for (const { destination, areaIndex } of areaIndexes) {
  assert.equal(
    publicKeys.has(`${destination.slug}:${areaIndex.id}`),
    false,
    `Area index ${destination.slug}:${areaIndex.id} entered public routes.`
  );
}

for (const { destination, route } of publicRoutes) {
  assert.ok(
    publicRoutesModule.findPublicRouteWithDestination(
      destination.slug,
      route.id
    ),
    `Public route lookup failed for ${destination.slug}:${route.id}.`
  );

  const explorerItem = routeExplorerModule.toRouteExplorerItem(route);
  const hasPublishedEditorial =
    publicRoutesModule.hasPublishedRouteEditorial(route);

  assert.equal(
    explorerItem.isPublishedPick,
    hasPublishedEditorial,
    `Published pick gate failed for ${destination.slug}:${route.id}.`
  );
  if (!hasPublishedEditorial) {
    assert.equal(
      explorerItem.summary,
      undefined,
      `Unpublished summary leaked for ${destination.slug}:${route.id}.`
    );
  }

  const publicFacts = publicRoutesModule.toPublicRouteFacts(route);
  for (const field of ["editorial", "verification", "legacy"]) {
    assert.equal(
      Object.hasOwn(publicFacts, field),
      false,
      `Public route facts ${destination.slug}:${route.id} expose ${field}.`
    );
  }
  for (const source of publicFacts.sourceRecords) {
    for (const field of ["provider", "sourceType", "trustLevel", "verifiedFields"]) {
      assert.equal(
        Object.hasOwn(source, field),
        false,
        `Public source ${destination.slug}:${route.id} exposes ${field}.`
      );
    }
  }
  assert.equal(
    publicFacts.externalResources.some(
      (resource) => resource.linkStatus === "needs-upgrade"
    ),
    false,
    `Public route facts ${destination.slug}:${route.id} expose maintenance links.`
  );
}

const publishedPicks = destinationsModule.destinations.flatMap((destination) =>
  publicRoutesModule.getPublishedPicksForDestination(destination.slug)
);

assert.ok(
  publishedPicks.every(
    ({ route }) =>
      route.editorial.tier === "pick" &&
      route.editorial.status === "published"
  ),
  "Published pick selectors must not include draft or unreviewed picks."
);

const importedPublicRoutes = publicRoutes.filter(({ route }) => !route.legacy);

assert.ok(
  importedPublicRoutes.length > 0,
  "Imported source-backed routes must be available to public consumers."
);

console.log("Public route parity validation passed.");
console.log(`Public routes: ${publicRoutes.length}`);
console.log(`Imported public routes: ${importedPublicRoutes.length}`);
console.log(`Area indexes excluded: ${areaIndexes.length}`);
console.log(`Published picks: ${publishedPicks.length}`);
