import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { loadRouteProject } from "./load-route-project.mjs";

const PREVIOUS_PUBLIC_COUNTS = {
  "yosemite-usa": 128,
  "red-river-gorge-usa": 140,
  "joshua-tree-usa": 42,
  "smith-rock-usa": 109,
  "squamish-canada": 64,
  "el-potrero-chico-mexico": 40,
  "fontainebleau-france": 56,
  "chamonix-france": 40,
  "ceuse-france": 40,
  "kalymnos-greece": 48,
  "dolomites-italy": 40,
  "frankenjura-germany": 40,
  "siurana-spain": 40,
  "margalef-spain": 40,
  "yangshuo-china": 40,
  "liming-china": 40,
  "long-dong-taiwan": 40,
  "railay-tonsai-thailand": 40,
  "grampians-australia": 40,
  "rocklands-south-africa": 40
};

const PREVIOUS_PUBLIC_TOTAL = 1107;
const EXPECTED_PUBLIC_TOTAL = 1074;
const EXPECTED_PICKS = 40;

const {
  auditModule,
  destinationsModule,
  publicRoutesModule,
  routeAliasesModule,
  routeCleanupModule,
  routeExperienceModule,
  routesModule
} = loadRouteProject();

const destinations = destinationsModule.destinations;
const entries = routesModule.getAllRouteCatalogEntries().map(({ entry }) => entry);
const publicRoutes = publicRoutesModule.getPublicRouteRecords();
const rules = routeCleanupModule.routeCatalogCleanupRules;
const conflicts = routeCleanupModule.routeCatalogCleanupConflicts;
const removalRules = rules.filter((rule) => rule.action !== "keep");
const destinationNames = new Map(
  destinations.map((destination) => [destination.slug, destination.name])
);
const audit = auditModule.buildRouteAuditReport(entries, destinationNames);
const entryByKey = new Map(
  entries.map((entry) => [`${entry.destinationId}:${entry.id}`, entry])
);
const publicRouteByKey = new Map(
  publicRoutes.map(({ route }) => [`${route.destinationId}:${route.id}`, route])
);

assert.equal(
  Object.values(PREVIOUS_PUBLIC_COUNTS).reduce((sum, count) => sum + count, 0),
  PREVIOUS_PUBLIC_TOTAL,
  "Previous per-destination baseline must add up to the approved total."
);

const ruleKeys = rules.map((rule) => `${rule.destinationSlug}:${rule.routeId}`);
assert.equal(
  new Set(ruleKeys).size,
  ruleKeys.length,
  "Cleanup rules must not contain duplicate route keys."
);
assert.equal(
  PREVIOUS_PUBLIC_TOTAL - removalRules.length,
  EXPECTED_PUBLIC_TOTAL,
  "Every public route reduction must have one removal-ledger entry."
);
assert.equal(
  publicRoutes.length,
  EXPECTED_PUBLIC_TOTAL,
  "Public route count does not match the reviewed cleanup baseline."
);

const removalsByDestination = removalRules.reduce((counts, rule) => {
  counts.set(
    rule.destinationSlug,
    (counts.get(rule.destinationSlug) ?? 0) + 1
  );
  return counts;
}, new Map());
const currentCounts = publicRoutes.reduce((counts, { destination }) => {
  counts.set(destination.slug, (counts.get(destination.slug) ?? 0) + 1);
  return counts;
}, new Map());

const destinationMigration = destinations.map((destination) => {
  const before = PREVIOUS_PUBLIC_COUNTS[destination.slug];
  assert.notEqual(
    before,
    undefined,
    `Missing approved baseline for ${destination.slug}.`
  );
  const removed = removalsByDestination.get(destination.slug) ?? 0;
  const after = currentCounts.get(destination.slug) ?? 0;
  assert.equal(
    after,
    before - removed,
    `${destination.slug} route count changed without a matching ledger entry.`
  );

  return {
    destinationId: destination.slug,
    destinationName: destination.name,
    before,
    removed,
    after,
    delta: after - before
  };
});

assert.equal(
  audit.duplicateCandidates.length,
  0,
  "Reviewed duplicate candidates must be fully resolved."
);

const invalidGrades = publicRoutes
  .filter(
    ({ route }) =>
      route.grade.original.trim() && route.grade.parseStatus === "unparsed"
  )
  .map(({ route }) => ({
    routeKey: `${route.destinationId}:${route.id}`,
    grade: route.grade.original
  }));
assert.equal(
  invalidGrades.length,
  0,
  "Descriptive or unparseable public grades must be removed or corrected."
);

const unknownSources = entries.flatMap((entry) =>
  entry.sourceRecords
    .filter((source) => source.purpose === "unknown")
    .map((source) => ({
      routeKey: `${entry.destinationId}:${entry.id}`,
      label: source.label,
      url: source.sourceUrl
    }))
);
assert.equal(
  unknownSources.length,
  0,
  "No normalized catalog source may retain an unknown purpose."
);

const areaResolutionFailures = [];
for (const rule of rules) {
  const key = `${rule.destinationSlug}:${rule.routeId}`;
  const entry = entryByKey.get(key);

  if (rule.action === "area-index" && entry?.kind !== "area-index") {
    areaResolutionFailures.push({
      routeKey: key,
      expected: "area-index",
      actual: entry?.kind ?? "missing"
    });
  }
  if ((rule.action === "hidden" || rule.action === "alias") && entry) {
    areaResolutionFailures.push({
      routeKey: key,
      expected: "not in catalog",
      actual: entry.kind
    });
  }
}
assert.equal(
  areaResolutionFailures.length,
  0,
  "Hidden, alias, and area-index actions must resolve before normalization."
);

const aliasFailures = [];
for (const { slug, routeId } of routeAliasesModule.getRouteAliasParams()) {
  const resolvedId = routeAliasesModule.resolveRouteId(slug, routeId);
  const resolvesToPublicRoute = publicRouteByKey.has(`${slug}:${resolvedId}`);
  const resolvesToRetiredIndex = Boolean(
    routeAliasesModule.getRetiredRouteHref(slug, resolvedId)
  );

  if (
    resolvedId === routeId ||
    (!resolvesToPublicRoute && !resolvesToRetiredIndex)
  ) {
    aliasFailures.push({
      routeKey: `${slug}:${routeId}`,
      resolvedId,
      resolvesToPublicRoute,
      resolvesToRetiredIndex
    });
  }
}
assert.equal(
  aliasFailures.length,
  0,
  "Aliases must terminate at a public route or reviewed area index without loops."
);

const publishedPicks = publicRoutes.filter(({ route }) =>
  publicRoutesModule.hasPublishedRouteEditorial(route)
);
assert.equal(
  publishedPicks.length,
  EXPECTED_PICKS,
  "Published Pick count changed during index cleanup."
);

const retiredKeys = new Set(removalRules.map((rule) =>
  `${rule.destinationSlug}:${rule.routeId}`
));
const retiredPickOverlays = routeExperienceModule.routeExperienceOverlays
  .map((overlay) => `${overlay.destinationSlug}:${overlay.routeId}`)
  .filter((key) => retiredKeys.has(key));
assert.equal(
  retiredPickOverlays.length,
  0,
  "A Published Pick points at an alias, hidden record, or area index."
);

const actionCounts = rules.reduce((counts, rule) => {
  counts[rule.action] = (counts[rule.action] ?? 0) + 1;
  return counts;
}, {});
const sourceChanges = rules
  .filter(
    (rule) =>
      rule.replaceSources ||
      rule.appendSources ||
      rule.sourcePurposeByUrl
  )
  .map((rule) => ({
    routeKey: `${rule.destinationSlug}:${rule.routeId}`,
    replacementSources: rule.replaceSources?.map((source) => ({
      label: source.sourceLabel,
      url: source.sourceUrl,
      purpose: source.purpose
    })) ?? [],
    appendedSources: rule.appendSources?.map((source) => ({
      label: source.sourceLabel,
      url: source.sourceUrl,
      purpose: source.purpose
    })) ?? [],
    purposeOverrides: rule.sourcePurposeByUrl ?? {}
  }));

const report = {
  schemaVersion: "legacy-route-index-cleanup-1.0",
  generatedAt: new Date().toISOString(),
  summary: {
    previousPublicRoutes: PREVIOUS_PUBLIC_TOTAL,
    currentPublicRoutes: publicRoutes.length,
    explainedReduction: removalRules.length,
    catalogEntries: entries.length,
    routeRecords: publicRoutes.length,
    areaIndexes: entries.filter((entry) => entry.kind === "area-index").length,
    publishedPicks: publishedPicks.length,
    duplicateCandidates: audit.duplicateCandidates.length,
    invalidPublicGrades: invalidGrades.length,
    unknownPurposeSources: unknownSources.length,
    invalidAliases: aliasFailures.length,
    unresolvedAreaMasquerades: areaResolutionFailures.length,
    factConflictsRecorded: conflicts.length
  },
  actionCounts,
  destinations: destinationMigration,
  removalLedger: removalRules.map((rule) => ({
    routeKey: `${rule.destinationSlug}:${rule.routeId}`,
    action: rule.action,
    canonicalRouteId: rule.canonicalRouteId,
    reason: rule.reason
  })),
  areaIndexes: rules
    .filter((rule) => rule.action === "area-index")
    .map((rule) => ({
      routeKey: `${rule.destinationSlug}:${rule.routeId}`,
      name: rule.patch?.name,
      reason: rule.reason
    })),
  aliases: rules
    .filter((rule) => rule.action === "alias")
    .map((rule) => ({
      routeKey: `${rule.destinationSlug}:${rule.routeId}`,
      canonicalRouteId: rule.canonicalRouteId,
      reason: rule.reason
    })),
  hiddenRecords: rules
    .filter((rule) => rule.action === "hidden")
    .map((rule) => ({
      routeKey: `${rule.destinationSlug}:${rule.routeId}`,
      reason: rule.reason
    })),
  factCorrections: rules
    .filter((rule) => rule.action === "keep" && rule.patch)
    .map((rule) => ({
      routeKey: `${rule.destinationSlug}:${rule.routeId}`,
      patch: rule.patch,
      reason: rule.reason
    })),
  factConflicts: conflicts,
  sourceChanges,
  validation: {
    invalidGrades,
    unknownSources,
    aliasFailures,
    areaResolutionFailures,
    retiredPickOverlays
  }
};

function markdownTable(rows) {
  return rows.map((row) =>
    `| ${row.destinationName} | ${row.before} | ${row.removed} | ${row.after} | ${row.delta} |`
  ).join("\n");
}

function markdownCell(value) {
  return String(value ?? "-")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");
}

function routeRuleTable(rows) {
  return rows.map((row) =>
    `| \`${markdownCell(row.routeKey)}\` | ${markdownCell(row.action)} | ` +
    `${markdownCell(row.canonicalRouteId)} | ${markdownCell(row.reason)} |`
  ).join("\n");
}

function factCorrectionTable(rows) {
  return rows.map((row) => {
    const patch = Object.entries(row.patch)
      .map(([field, value]) => `${field}=${value || "(cleared)"}`)
      .join("; ");
    return `| \`${markdownCell(row.routeKey)}\` | ${markdownCell(patch)} | ${markdownCell(row.reason)} |`;
  }).join("\n");
}

const sourceChangeRows = sourceChanges.flatMap((change) => [
  ...change.replacementSources.map((source) => ({
    routeKey: change.routeKey,
    change: "replace",
    ...source
  })),
  ...change.appendedSources.map((source) => ({
    routeKey: change.routeKey,
    change: "append",
    ...source
  })),
  ...Object.entries(change.purposeOverrides).map(([url, purpose]) => ({
    routeKey: change.routeKey,
    change: "purpose override",
    label: "Existing source",
    url,
    purpose
  }))
]);

function sourceChangeTable(rows) {
  return rows.map((row) =>
    `| \`${markdownCell(row.routeKey)}\` | ${markdownCell(row.change)} | ` +
    `${markdownCell(row.label)} | ${markdownCell(row.purpose)} | ${markdownCell(row.url)} |`
  ).join("\n");
}

function conflictTable(rows) {
  return rows.map((row) => {
    const candidates = row.candidates
      .map((candidate) => `${candidate.value} (${candidate.source})`)
      .join("; ");
    return `| \`${markdownCell(row.routeKey)}\` | ${markdownCell(row.field)} | ` +
      `${markdownCell(row.selectedValue)} | ${markdownCell(candidates)} | ${markdownCell(row.rationale)} |`;
  }).join("\n");
}

const markdown = `# Legacy Route Index Cleanup\n\n` +
  `Generated: ${report.generatedAt}\n\n` +
  `The reviewed public baseline changed from **${PREVIOUS_PUBLIC_TOTAL}** to **${publicRoutes.length}** routes. ` +
  `All ${removalRules.length} removals are listed in the JSON migration ledger. Published Picks remain at **${publishedPicks.length}**.\n\n` +
  `## Validation\n\n` +
  `- Duplicate candidates: ${audit.duplicateCandidates.length}\n` +
  `- Invalid public grades: ${invalidGrades.length}\n` +
  `- Unknown-purpose sources: ${unknownSources.length}\n` +
  `- Invalid aliases: ${aliasFailures.length}\n` +
  `- Unresolved reviewed area/route identities: ${areaResolutionFailures.length}\n` +
  `- Recorded source conflicts: ${conflicts.length}\n\n` +
  `## Destination Counts\n\n` +
  `| Destination | Before | Removed | After | Delta |\n` +
  `| --- | ---: | ---: | ---: | ---: |\n` +
  `${markdownTable(destinationMigration)}\n\n` +
  `## Removal Ledger\n\n` +
  `Every reduction from the previous public baseline appears below. Area indexes remain in the catalog but no longer render as routes. Aliases and hidden records no longer count as public routes.\n\n` +
  `| Route key | Action | Canonical route | Reason |\n` +
  `| --- | --- | --- | --- |\n` +
  `${routeRuleTable(report.removalLedger)}\n\n` +
  `## Area Indexes\n\n` +
  `| Former route key | Area name | Reason |\n` +
  `| --- | --- | --- |\n` +
  `${report.areaIndexes.map((row) => `| \`${markdownCell(row.routeKey)}\` | ${markdownCell(row.name)} | ${markdownCell(row.reason)} |`).join("\n")}\n\n` +
  `## Aliases\n\n` +
  `| Former route key | Canonical route ID | Reason |\n` +
  `| --- | --- | --- |\n` +
  `${report.aliases.map((row) => `| \`${markdownCell(row.routeKey)}\` | \`${markdownCell(row.canonicalRouteId)}\` | ${markdownCell(row.reason)} |`).join("\n")}\n\n` +
  `## Hidden Records\n\n` +
  `| Former route key | Reason |\n` +
  `| --- | --- |\n` +
  `${report.hiddenRecords.map((row) => `| \`${markdownCell(row.routeKey)}\` | ${markdownCell(row.reason)} |`).join("\n")}\n\n` +
  `## Fact Corrections\n\n` +
  `| Route key | Structured patch | Reason |\n` +
  `| --- | --- | --- |\n` +
  `${factCorrectionTable(report.factCorrections)}\n\n` +
  `## Source Changes\n\n` +
  `| Route key | Change | Source | Purpose | URL |\n` +
  `| --- | --- | --- | --- | --- |\n` +
  `${sourceChangeTable(sourceChangeRows)}\n\n` +
  `## Recorded Fact Conflicts\n\n` +
  `Conflicts are resolved by documented source priority and remain visible here rather than being silently overwritten.\n\n` +
  `| Route key | Field | Selected value | Source candidates | Rationale |\n` +
  `| --- | --- | --- | --- | --- |\n` +
  `${conflictTable(report.factConflicts)}\n\n` +
  `The machine-readable companion remains available locally at \`outputs/route-index-cleanup.json\`.\n`;

const shouldWrite = !process.argv.includes("--no-write");
if (shouldWrite) {
  const jsonPath = path.join(process.cwd(), "outputs", "route-index-cleanup.json");
  const markdownPath = path.join(
    process.cwd(),
    "docs",
    "reports",
    "legacy-route-index-cleanup.md"
  );
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(markdownPath, markdown, "utf8");
}

console.log("Legacy route index cleanup validation passed.");
console.log(`Public routes: ${PREVIOUS_PUBLIC_TOTAL} -> ${publicRoutes.length}`);
console.log(`Removal ledger entries: ${removalRules.length}`);
console.log(`Area indexes: ${report.summary.areaIndexes}`);
console.log(`Published Picks: ${publishedPicks.length}`);
console.log(`Duplicate candidates: ${audit.duplicateCandidates.length}`);
console.log(`Invalid public grades: ${invalidGrades.length}`);
console.log(`Unknown-purpose sources: ${unknownSources.length}`);
console.log(`Invalid aliases: ${aliasFailures.length}`);
console.log(`Recorded fact conflicts: ${conflicts.length}`);
console.log(shouldWrite ? "Migration reports written." : "Reports not written (--no-write)." );
