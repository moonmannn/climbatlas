import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { loadRouteProject } from "./load-route-project.mjs";

const { destinationsModule, routesModule, auditModule } = loadRouteProject();
const entries = routesModule
  .getAllRouteCatalogEntries()
  .map(({ entry }) => entry);
const destinationNames = new Map(
  destinationsModule.destinations.map((destination) => [
    destination.slug,
    destination.name
  ])
);
const report = auditModule.buildRouteAuditReport(entries, destinationNames);
const outputDirectory = path.join(process.cwd(), "outputs");
const outputPath = path.join(outputDirectory, "route-coverage-audit.json");

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log("Route Coverage RC-2 audit");
console.log(`Routes: ${report.summary.routes}`);
console.log(`Area indexes: ${report.summary.areaIndexes}`);
console.log(`Pick candidates: ${report.summary.pickCandidates}`);
console.log(`Reviewed picks: ${report.summary.reviewedPicks}`);
console.log(`Validation errors: ${report.validation.errors}`);
console.log(`Validation warnings: ${report.validation.warnings}`);
console.log(`Duplicate candidates: ${report.duplicateCandidates.length}`);
console.log(`Report: ${outputPath}`);
