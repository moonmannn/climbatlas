import assert from "node:assert/strict";
import {
  buildRouteDnaSnapshot,
  getRouteDnaMatch
} from "../../src/lib/routes/route-dna.ts";

function route(overrides) {
  return {
    kind: "route",
    id: "test-route",
    slug: "test-route",
    name: "Test route",
    destinationId: "test-destination",
    climbingType: "trad",
    grade: { original: "5.10a", system: "yds", detectedSystems: ["yds"] },
    style: { terrainTags: [], movementTags: [], physicalTags: [] },
    experienceTags: [],
    editorial: { tier: "index", status: "draft" },
    sourceRecords: [],
    verification: { status: "source-backed" },
    externalResources: [],
    ...overrides
  };
}

const adventureUser = {
  exploration: 78,
  performance: 62,
  adventure: 90,
  social: 48,
  comfort: 34,
  flow: 58
};
const comfortUser = {
  exploration: 45,
  performance: 38,
  adventure: 28,
  social: 64,
  comfort: 92,
  flow: 55
};

const committingRoute = route({
  id: "committing-route",
  climbingType: "multi-pitch",
  grade: { original: "5.12a", system: "yds", detectedSystems: ["yds"] },
  lengthMeters: 220,
  lengthOriginal: "220 m",
  pitches: 7
});
const comfortableRoute = route({
  id: "comfortable-route",
  climbingType: "top-rope",
  grade: { original: "5.7", system: "yds", detectedSystems: ["yds"] }
});

const committingSnapshot = buildRouteDnaSnapshot(committingRoute, "advanced");
const comfortableSnapshot = buildRouteDnaSnapshot(comfortableRoute, "intro");
const adventureCommitting = getRouteDnaMatch(adventureUser, committingSnapshot);
const adventureComfortable = getRouteDnaMatch(adventureUser, comfortableSnapshot);
const comfortCommitting = getRouteDnaMatch(comfortUser, committingSnapshot);
const comfortComfortable = getRouteDnaMatch(comfortUser, comfortableSnapshot);

assert.ok(adventureCommitting.score > adventureComfortable.score);
assert.ok(comfortComfortable.score > comfortCommitting.score);
assert.equal(committingSnapshot.origin, "inferred");
assert.ok(committingSnapshot.considerations.length > 0);
assert.equal(adventureCommitting.reasons.length, 2);
assert.ok(adventureCommitting.score >= 0 && adventureCommitting.score <= 100);

const editorialSnapshot = buildRouteDnaSnapshot(
  route({
    dnaProfile: {
      origin: "editorial",
      values: { flow: 91 }
    }
  }),
  "intermediate"
);
assert.equal(editorialSnapshot.vector.flow, 91);
assert.equal(editorialSnapshot.origin, "editorial");
assert.equal(editorialSnapshot.confidence, "editorial");

console.log("Route DNA validation passed.");
console.log(`Adventure user: committing ${adventureCommitting.score}%, comfortable ${adventureComfortable.score}%.`);
console.log(`Comfort user: comfortable ${comfortComfortable.score}%, committing ${comfortCommitting.score}%.`);
