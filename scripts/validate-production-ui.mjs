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
const destinationPicks = read("src/components/DestinationPicks.tsx");
const languageProvider = read("src/components/LanguageProvider.tsx");
const notFoundPage = read("src/app/not-found.tsx");
const homeClient = read("src/components/HomeClient.tsx");

requirePattern(destinationPage, /<ul[^>]*>[\s\S]*firstVisitTips[\s\S]*<li/, "First-visit tips must render as a semantic list");
rejectPattern(destinationPage, /destination\.difficultyRange/, "Destination detail must not use a hard-coded mixed difficulty range");
requirePattern(routeIndex, /routeSummary\(route, locale\)\s*&&/, "Routes without editorial summaries must omit placeholder copy");
requirePattern(routeIndex, /formatSourceCount\(route\.sourceCount, locale\)/, "Route cards must use the shared source formatter");
requirePattern(routeIndex, /filterToggleRef\.current\?\.focus\(\)/, "Closing mobile filters must restore focus");
requirePattern(routeIndex, /dnaMatch\s*&&/, "Route DNA match must remain conditional on a real profile result");
requirePattern(routeIndex, /type="checkbox"/, "Grade choices must use independent semantic checkbox controls");
requirePattern(routeIndex, /type="radio"/, "Grade systems must use a semantic radio group");
requirePattern(routeIndex, /<fieldset>[\s\S]*<legend[\s\S]*type="radio"/, "Grade systems must use fieldset and legend semantics");
requirePattern(routeIndex, /data-grade-option-list[\s\S]*<li[\s\S]*type="checkbox"/, "Grade choices must render as semantic list items");
requirePattern(routeIndex, /data-grade-separator/, "Grade choices must include a text-extraction boundary");
requirePattern(routeIndex, /gradeSystem/, "Grade filter state must be shareable in the URL");
requirePattern(
  routeIndex,
  /nextGradeFilter\.system !== primaryGradeSystem \|\| sortedGrades\.length > 0/,
  "A non-default grade system must survive refresh even before grades are selected"
);
requirePattern(routeIndex, /popstate/, "Browser navigation must restore URL-backed Grade filters");
rejectPattern(routeIndex, /lengthOriginal/, "Route cards must not render legacy free-text length values");
requirePattern(routeDetail, /identity\.sectorName\s*\?/, "Missing sectors must be hidden instead of rendered as a database placeholder");
requirePattern(
  routeDetail,
  /viewModel\.accessSources\.length > 0[\s\S]*entries=\{viewModel\.accessSources\}[\s\S]*Access and local information/,
  "General access information must render from the dedicated access source collection"
);
requirePattern(routeDetail, /Context references/, "Destination and history references must be separate from route sources");
requirePattern(routeDetail, /Source policy/, "Detailed source boundaries must live in the collapsible source policy");
requirePattern(routeDetail, /resource\.linkStatusLabel/, "Route-specific external links must render their public precision label");
rejectPattern(routeDetail, />Source<\/a>/, "Route media source links must be localized");
requirePattern(routePage, /LocalizedRouteDetailView/, "All route pages must use the unified public renderer");
rejectPattern(routePage, /RouteHighlightCard|RouteRecordCard|entry\.legacy/, "Public route pages must not branch on legacy data");
requirePattern(destinationDna, /Complete Climbing DNA to see how this destination matches/, "DNA empty state must explain the benefit on the server-rendered first frame");
rejectPattern(destinationDna, /animate-pulse|\[loaded, setLoaded\]/, "DNA empty state must not be replaced by a hydration-only skeleton");
rejectPattern(userControls, /\bV\d+(?:\.\d+)?\b/, "Public account copy must not expose implementation version labels");
rejectPattern(destinationPage, /\{resource\.type\}/, "Destination resources must not expose raw resource enums");
rejectPattern(destinationPage, /en="Approach"\s+zh="适合程度"/, "Experience fit must not be labeled as route approach");
requirePattern(destinationPage, /<dl[^>]*data-difficulty-summary/, "Difficulty summaries must use semantic description lists");
requirePattern(routeDetail, /Review recorded facts and traceable sources/, "The unified route detail must use the concise shared source introduction");
requirePattern(routeDetail, /publishedEditorial && experience/, "Rich experience sections must remain gated to published Picks");
requirePattern(destinationPicks, /id="picks"/, "Destination Picks must expose a stable in-page navigation target");
requirePattern(destinationPage, /<DestinationPicks[\s\S]*id="all-routes"[\s\S]*id="field-guide"/, "Destination content must place Picks before all routes and Field Guide");
requirePattern(languageProvider, /document\.documentElement\.lang = locale === "zh" \? "zh-CN" : "en"/, "Language switching must synchronize the document language");
requirePattern(notFoundPage, /Return to map[\s\S]*返回地图/, "The branded 404 must provide bilingual map recovery copy");
requirePattern(homeClient, /fetchPriority="high"[\s\S]*forest-granite-plate\.webp/, "The homepage hero must prioritize the optimized editorial image");

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
