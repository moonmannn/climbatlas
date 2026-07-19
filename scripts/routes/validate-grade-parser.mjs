import { loadRouteProject } from "./load-route-project.mjs";

const { gradeParserModule, routesModule } = loadRouteProject();
const { gradeRangesOverlap, parseRouteGrade } = gradeParserModule;
const issues = [];

function approximatelyEqual(first, second) {
  return Math.abs(first - second) < 0.001;
}

const cases = [
  { grade: "5.10a", destination: "yosemite-usa", type: "trad", system: "yds", min: 10, max: 10 },
  { grade: "5.10a/b", destination: "yosemite-usa", type: "trad", system: "yds", min: 10, max: 10.25 },
  { grade: "5.9+", destination: "yosemite-usa", type: "trad", system: "yds", min: 9.1, max: 9.1 },
  { grade: "5.8-", destination: "yosemite-usa", type: "trad", system: "yds", min: 7.9, max: 7.9 },
  { grade: "5.10d", destination: "yosemite-usa", type: "sport", system: "yds", min: 10.75, max: 10.75 },
  { grade: "5.13b/c", destination: "yosemite-usa", type: "trad", system: "yds", min: 13.25, max: 13.5 },
  { grade: "5.9-5.12", destination: "yosemite-usa", type: "trad", system: "yds", min: 9, max: 12, bands: ["intermediate", "advanced"] },
  { grade: "V7", destination: "grampians-australia", type: "boulder", system: "v-scale", min: 7, max: 7 },
  { grade: "V0", destination: "grampians-australia", type: "boulder", system: "v-scale", min: 0, max: 0 },
  { grade: "V10+", destination: "grampians-australia", type: "boulder", system: "v-scale", min: 10.1, max: 10.1 },
  { grade: "V6-V15", destination: "grampians-australia", type: "boulder", system: "v-scale", min: 6, max: 15, bands: ["advanced", "elite"] },
  { grade: "6b+", destination: "ceuse-france", type: "sport", system: "french", min: 6.533333333, max: 6.533333333 },
  { grade: "9a+", destination: "ceuse-france", type: "sport", system: "french", min: 9.2, max: 9.2 },
  { grade: "6a-7c", destination: "ceuse-france", type: "sport", system: "french", min: 6, max: 7.666666667, bands: ["intermediate", "advanced"] },
  { grade: "7A+", destination: "fontainebleau-france", type: "boulder", system: "font", min: 7.2, max: 7.2 },
  { grade: "Font 7C", destination: "fontainebleau-france", type: "boulder", system: "font", min: 7.666666667, max: 7.666666667 },
  { grade: "VII", destination: "dolomites-italy", type: "multi-pitch", system: "uiaa", min: 7, max: 7 },
  { grade: "V/VI- with VI+ step", destination: "dolomites-italy", type: "multi-pitch", system: "uiaa", min: 5, max: 6.1 },
  { grade: "VI 5.11 A2", destination: "yosemite-usa", type: "multi-pitch", system: "yds", min: 11, max: 11, aid: "A2", commitment: "VI" },
  { grade: "V 5.9 C2", destination: "yosemite-usa", type: "trad", system: "yds", min: 9, max: 9, aid: "C2", commitment: "V" },
  { grade: "VI 5.13b/c free / C2 aid", destination: "yosemite-usa", type: "multi-pitch", system: "yds", min: 13.25, max: 13.5, aid: "C2", commitment: "VI" },
  { grade: "33 / 5.14b", destination: "grampians-australia", type: "trad", system: "australian", min: 33, max: 33 },
  { grade: "AD / ridge", destination: "chamonix-france", type: "alpine", system: "alpine", min: 3, max: 3 }
];

for (const sample of cases) {
  const parsed = parseRouteGrade(sample.grade, sample.destination, sample.type);
  if (parsed.original !== sample.grade) issues.push(`${sample.grade}: original grade changed`);
  if (parsed.primarySystem !== sample.system) {
    issues.push(`${sample.grade}: expected ${sample.system}, received ${parsed.primarySystem ?? "none"}`);
  }
  if (parsed.rangeMin === undefined || !approximatelyEqual(parsed.rangeMin, sample.min)) {
    issues.push(`${sample.grade}: expected min ${sample.min}, received ${parsed.rangeMin ?? "none"}`);
  }
  if (parsed.rangeMax === undefined || !approximatelyEqual(parsed.rangeMax, sample.max)) {
    issues.push(`${sample.grade}: expected max ${sample.max}, received ${parsed.rangeMax ?? "none"}`);
  }
  if (sample.bands && sample.bands.join(",") !== parsed.filterBands.join(",")) {
    issues.push(`${sample.grade}: expected bands ${sample.bands.join(",")}, received ${parsed.filterBands.join(",")}`);
  }
  if (sample.aid && parsed.aidGrade !== sample.aid) {
    issues.push(`${sample.grade}: expected aid ${sample.aid}, received ${parsed.aidGrade ?? "none"}`);
  }
  if (sample.commitment && parsed.commitmentGrade !== sample.commitment) {
    issues.push(`${sample.grade}: expected commitment ${sample.commitment}, received ${parsed.commitmentGrade ?? "none"}`);
  }
}

const unknown = parseRouteGrade(
  "descriptive text without a grade",
  "squamish-canada",
  "trad"
);
if (unknown.parseStatus !== "unparsed" || unknown.primarySystem) {
  issues.push("Unparseable text must remain unparsed without an invented system");
}

if (!gradeRangesOverlap(9, 12, 10, 10) || gradeRangesOverlap(9, 12, 13, 13)) {
  issues.push("Grade range overlap must include contained grades and exclude separated grades");
}

const catalogRoutes = routesModule.getAllRouteRecordsWithDestinations();
let unparsedCount = 0;
for (const { route } of catalogRoutes) {
  const parsed = parseRouteGrade(
    route.grade.original,
    route.destinationId,
    route.climbingType
  );
  if (parsed.original !== route.grade.original) {
    issues.push(`${route.destinationId}:${route.id}: parser changed the original grade`);
  }
  if (parsed.parseStatus === "unparsed") {
    unparsedCount += 1;
    if (parsed.primarySystem || parsed.sortValue !== undefined) {
      issues.push(`${route.destinationId}:${route.id}: unparsed grade received comparable values`);
    }
  } else if (
    !parsed.primarySystem ||
    parsed.rangeMin === undefined ||
    parsed.rangeMax === undefined ||
    parsed.sortValue === undefined
  ) {
    issues.push(`${route.destinationId}:${route.id}: parsed grade is missing comparable values`);
  }
}

if (issues.length > 0) {
  console.error("Route grade parser validation failed:");
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Route grade parser valid: ${cases.length} regression cases, ` +
      `${catalogRoutes.length} catalog routes, ${unparsedCount} safely left unparsed.`
  );
}
