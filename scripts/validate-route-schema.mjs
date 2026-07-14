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

  if (entry.kind === "route") {
    if (!entry.grade.original.trim()) errors.push(`Missing original grade: ${key}`);
    if (!entry.lengthOriginal?.trim()) {
      const message = `Missing original length: ${key}`;
      if (entry.legacy) errors.push(message);
      else warnings.push(message);
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
