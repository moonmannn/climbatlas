import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const issues = [];
const destinationPage = read("src/app/destinations/[slug]/page.tsx");
const routePage = read("src/app/destinations/[slug]/routes/[routeId]/page.tsx");
const routeIndex = read("src/components/RouteIndex.tsx");
const routeDetail = read("src/components/RouteDetailView.tsx");
const destinationDna = read("src/components/DestinationDnaMatch.tsx");
const userControls = read("src/components/UserRouteControls.tsx");

requirePattern(destinationPage, /<ul[^>]*>[\s\S]*firstVisitTips[\s\S]*<li/, "First-visit tips must render as a semantic list");
rejectPattern(destinationPage, /destination\.difficultyRange/, "Destination detail must not use a hard-coded mixed difficulty range");
requirePattern(routeIndex, /routeSummary\(route, locale\)\s*&&/, "Routes without editorial summaries must omit placeholder copy");
requirePattern(routeIndex, /formatSourceCount\(route\.sourceCount, locale\)/, "Route cards must use the shared source formatter");
requirePattern(routeIndex, /filterToggleRef\.current\?\.focus\(\)/, "Closing mobile filters must restore focus");
requirePattern(routeIndex, /dnaMatch\s*&&/, "Route DNA match must remain conditional on a real profile result");
requirePattern(routeIndex, /type="checkbox"/, "Grade choices must use independent semantic checkbox controls");
requirePattern(routeIndex, /type="radio"/, "Grade systems must use a semantic radio group");
requirePattern(routeIndex, /gradeSystem/, "Grade filter state must be shareable in the URL");
requirePattern(routeDetail, /identity\.sectorName\s*\?/, "Missing sectors must be hidden instead of rendered as a database placeholder");
requirePattern(routeDetail, /Access information/, "General access information must be separate from route sources");
requirePattern(routeDetail, /resource\.linkStatusLabel/, "Route-specific external links must render their public precision label");
rejectPattern(routeDetail, />Source<\/a>/, "Route media source links must be localized");
requirePattern(routePage, /LocalizedRouteDetailView/, "All route pages must use the unified public renderer");
rejectPattern(routePage, /RouteHighlightCard|RouteRecordCard|entry\.legacy/, "Public route pages must not branch on legacy data");
requirePattern(destinationDna, /Complete Climbing DNA to see how this destination matches/, "DNA empty state must explain the benefit on the server-rendered first frame");
rejectPattern(destinationDna, /animate-pulse|\[loaded, setLoaded\]/, "DNA empty state must not be replaced by a hydration-only skeleton");
rejectPattern(userControls, /\bV\d+(?:\.\d+)?\b/, "Public account copy must not expose implementation version labels");
rejectPattern(destinationPage, /\{resource\.type\}/, "Destination resources must not expose raw resource enums");
rejectPattern(destinationPage, /en="Approach"\s+zh="适合程度"/, "Experience fit must not be labeled as route approach");

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
