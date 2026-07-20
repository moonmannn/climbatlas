import { loadRouteProject } from "./routes/load-route-project.mjs";

const { routesModule } = loadRouteProject();

const legacyEntries = routesModule.getAllRoutesWithDestinations();
const catalogEntries = routesModule.getAllRouteCatalogEntries();
const routeRecords = routesModule.getAllRouteRecordsWithDestinations();
const areaIndexes = routesModule.getAllAreaIndexesWithDestinations();
const migratedEntries = catalogEntries.filter(({ entry }) => entry.legacy);
const importedEntries = catalogEntries.filter(({ entry }) => !entry.legacy);
const errors = [];
const warnings = [];
const keys = new Set();
const sourcePurposes = new Set([
  "route-reference",
  "access",
  "destination-context",
  "history",
  "media",
  "unknown"
]);

if (legacyEntries.length !== migratedEntries.length) {
  errors.push(
    `Migration count mismatch: ${legacyEntries.length} legacy vs ${migratedEntries.length} migrated entries.`
  );
}

for (const { destination, entry } of catalogEntries) {
  const key = `${destination.slug}:${entry.id}`;

  if (keys.has(key)) errors.push(`Duplicate catalog key: ${key}`);
  keys.add(key);

  if (!entry.name.trim()) errors.push(`Missing name: ${key}`);
  if (entry.destinationId !== destination.slug) {
    errors.push(`Destination mismatch: ${key}`);
  }
  if (entry.sourceRecords.length === 0) errors.push(`Missing sources: ${key}`);
  for (const source of entry.sourceRecords) {
    if (!sourcePurposes.has(source.purpose)) {
      errors.push(`Invalid source purpose for ${key}: ${source.purpose ?? "missing"}`);
    } else if (source.purpose === "unknown") {
      warnings.push(`Unknown source purpose: ${key} (${source.label})`);
    }
  }

  if (entry.kind === "route") {
    if (!entry.grade.original.trim()) warnings.push(`Missing original grade: ${key}`);
    for (const [field, value] of [
      ["lengthMeters", entry.lengthMeters],
      ["lengthFeet", entry.lengthFeet],
      ["pitchCount", entry.pitchCount]
    ]) {
      if (value !== undefined && (!Number.isFinite(value) || value <= 0)) {
        errors.push(`Invalid ${field}: ${key}`);
      }
    }
  }
}

console.log("Route Coverage RC-1 schema validation");
console.log(`Legacy entries: ${legacyEntries.length}`);
console.log(`Imported canonical entries: ${importedEntries.length}`);
console.log(`Route records: ${routeRecords.length}`);
console.log(`Area indexes: ${areaIndexes.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length > 0) {
  for (const error of errors.slice(0, 50)) console.error(`- ${error}`);
  process.exitCode = 1;
}
