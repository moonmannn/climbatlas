import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const issues = [];
const destinationPage = read("src/app/destinations/[slug]/page.tsx");
const routeIndex = read("src/components/RouteIndex.tsx");
const routeDetail = read("src/components/RouteRecordCard.tsx");
const userControls = read("src/components/UserRouteControls.tsx");

requirePattern(destinationPage, /<ul[^>]*>[\s\S]*firstVisitTips[\s\S]*<li/, "First-visit tips must render as a semantic list");
rejectPattern(destinationPage, /destination\.difficultyRange/, "Destination detail must not use a hard-coded mixed difficulty range");
requirePattern(routeIndex, /routeSummary\(route, locale\)\s*&&/, "Routes without editorial summaries must omit placeholder copy");
requirePattern(routeIndex, /formatSourceCount\(route\.sourceCount, locale\)/, "Route cards must use the shared source formatter");
requirePattern(routeIndex, /filterToggleRef\.current\?\.focus\(\)/, "Closing mobile filters must restore focus");
requirePattern(routeIndex, /dnaMatch\s*&&/, "Route DNA match must remain conditional on a real profile result");
requirePattern(routeDetail, /route\.sectorName\s*\?/, "Missing sectors must be hidden instead of rendered as a database placeholder");
requirePattern(routeDetail, /Access and local information/, "General access information must be separate from route sources");
requirePattern(routeDetail, /Exact route page/, "Route-specific external links must have a clear label");
rejectPattern(userControls, /\bV\d+(?:\.\d+)?\b/, "Public account copy must not expose implementation version labels");

if (issues.length > 0) {
  console.error("Production UI validation failed:");
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Production UI valid: semantic lists, conditional summaries, source hierarchy, DNA gating, and mobile filter focus checked.");
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function requirePattern(contents, pattern, message) {
  if (!pattern.test(contents)) issues.push(message);
}

function rejectPattern(contents, pattern, message) {
  if (pattern.test(contents)) issues.push(message);
}
