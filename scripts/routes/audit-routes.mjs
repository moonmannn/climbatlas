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
const outputArgumentIndex = process.argv.indexOf("--output");
const customOutputPath =
  outputArgumentIndex >= 0 ? process.argv[outputArgumentIndex + 1] : undefined;
const shouldWriteReport = !process.argv.includes("--no-write");
const outputPath = customOutputPath
  ? path.resolve(process.cwd(), customOutputPath)
  : path.join(outputDirectory, "route-coverage-audit.json");

if (outputArgumentIndex >= 0 && !customOutputPath) {
  throw new Error("--output requires a file path.");
}

if (shouldWriteReport) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

console.log("Route Coverage RC-2 audit");
console.log(`Routes: ${report.summary.routes}`);
console.log(`Area indexes: ${report.summary.areaIndexes}`);
console.log(`Pick candidates: ${report.summary.pickCandidates}`);
console.log(`Reviewed picks: ${report.summary.reviewedPicks}`);
console.log(`Validation errors: ${report.validation.errors}`);
console.log(`Validation warnings: ${report.validation.warnings}`);
console.log(`Duplicate candidates: ${report.duplicateCandidates.length}`);
console.log(
  shouldWriteReport ? `Report: ${outputPath}` : "Report: not written (--no-write)"
);
