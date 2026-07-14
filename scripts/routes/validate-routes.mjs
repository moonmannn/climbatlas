import { loadRouteProject } from "./load-route-project.mjs";

const { destinationsModule, routesModule, validationModule } = loadRouteProject();
const entries = routesModule
  .getAllRouteCatalogEntries()
  .map(({ entry }) => entry);
const destinationIds = new Set(
  destinationsModule.destinations.map((destination) => destination.slug)
);
const result = validationModule.validateRouteCatalog(entries, destinationIds);

console.log("Route Coverage RC-2 validation");
console.log(`Catalog entries: ${entries.length}`);
console.log(`Errors: ${result.counts.error}`);
console.log(`Warnings: ${result.counts.warning}`);
console.log(`Info: ${result.counts.info}`);

const issuesToShow = result.issues
  .filter((issue) => issue.severity === "error")
  .concat(result.issues.filter((issue) => issue.severity === "warning"))
  .slice(0, 30);

for (const issue of issuesToShow) {
  console.log(
    `[${issue.severity.toUpperCase()}] ${issue.code} ${issue.routeKey}: ${issue.message}`
  );
}

if (result.issues.length > issuesToShow.length) {
  console.log(`... ${result.issues.length - issuesToShow.length} more issues in the audit report.`);
}

if (result.counts.error > 0) process.exitCode = 1;
