import { loadRouteProject } from "./load-route-project.mjs";

const {
  formattersModule,
  gradeFilterOptionsModule,
  gradeParserModule
} = loadRouteProject();
const {
  formatCheckedDate,
  formatClimbingType,
  formatGradeSystem,
  formatMissingValue,
  formatSourceCount
} = formattersModule;
const {
  buildDifficultySystemSummaries,
  buildGradeFilterSet,
  routeMatchesGradeOption
} = gradeFilterOptionsModule;
const { parseRouteGrade } = gradeParserModule;
const issues = [];

expect(formatSourceCount(0, "en"), "No sources", "English zero sources");
expect(formatSourceCount(1, "en"), "1 source", "English singular source");
expect(formatSourceCount(2, "en"), "2 sources", "English plural sources");
expect(formatSourceCount(0, "zh"), "暂无来源", "Chinese zero sources");
expect(formatSourceCount(1, "zh"), "1 个来源", "Chinese one source");
expect(formatSourceCount(2, "zh"), "2 个来源", "Chinese two sources");
expect(formatClimbingType("multi-pitch", "zh"), "多段攀登", "Chinese climbing type");
expect(formatGradeSystem("yds", "en"), "Yosemite Decimal System (YDS)", "YDS label");
expect(formatMissingValue("zh"), "暂无信息", "Chinese missing value");
expect(formatCheckedDate("2026-06-10", "en"), "Jun 10, 2026", "English checked date");
expect(formatCheckedDate("2026-06-10", "zh"), "2026年6月10日", "Chinese checked date");

const ydsRoutes = [
  routeItem("5.8", "yosemite-usa", "trad"),
  routeItem("5.10a/b", "yosemite-usa", "trad"),
  routeItem("VI 5.11 A2", "yosemite-usa", "multi-pitch")
];
const ydsFilterSet = buildGradeFilterSet(ydsRoutes);
expect(ydsFilterSet.primarySystem, "yds", "YDS filter system");
expect(
  ydsFilterSet.options.map((option) => option.label).join("|"),
  "5.8|5.10a/b|5.11",
  "YDS option labels stay separate and omit aid/commitment grades"
);
const ydsEleven = ydsFilterSet.options.find((option) => option.label === "5.11");
if (!ydsEleven || !routeMatchesGradeOption(ydsRoutes[2], ydsEleven)) {
  issues.push("Mixed free/aid route must match its YDS free grade option");
}

for (const sample of [
  { grade: "7A+", destination: "fontainebleau-france", type: "boulder", system: "font" },
  { grade: "V8", destination: "grampians-australia", type: "boulder", system: "v-scale" },
  { grade: "7b+", destination: "ceuse-france", type: "sport", system: "french" }
]) {
  const filterSet = buildGradeFilterSet([
    routeItem(sample.grade, sample.destination, sample.type)
  ]);
  expect(filterSet.primarySystem, sample.system, `${sample.system} filter system`);
  expect(filterSet.options.length, 1, `${sample.system} option count`);
  expect(filterSet.options[0]?.label, sample.grade, `${sample.system} option label`);
}

const summaries = buildDifficultySystemSummaries([
  routeItem("5.8", "yosemite-usa", "trad"),
  routeItem("5.11", "yosemite-usa", "trad"),
  routeItem("V4", "grampians-australia", "boulder"),
  routeItem("V8", "grampians-australia", "boulder")
]);
expect(summaries.length, 2, "Difficulty summary system count");
expect(summaries.find((item) => item.system === "yds")?.minLabel, "5.8", "YDS summary minimum");
expect(summaries.find((item) => item.system === "yds")?.maxLabel, "5.11", "YDS summary maximum");
expect(summaries.find((item) => item.system === "v-scale")?.minLabel, "V4", "V summary minimum");
expect(summaries.find((item) => item.system === "v-scale")?.maxLabel, "V8", "V summary maximum");

const nonStandardFilterSet = buildGradeFilterSet([
  routeItem("Historic Font 7 problem", "fontainebleau-france", "boulder"),
  routeItem("8C+ / 9A proposed", "fontainebleau-france", "boulder"),
  routeItem("7A+", "fontainebleau-france", "boulder")
]);
expect(
  nonStandardFilterSet.options.map((option) => option.label).join("|"),
  "7A+",
  "Historical and proposed Font grades stay out of standard filter options"
);

if (issues.length > 0) {
  console.error("Public formatter validation failed:");
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Public formatters valid: source counts, labels, dates, grade options, and grouped summaries checked.");
}

function routeItem(grade, destinationId, climbingType) {
  const parsed = parseRouteGrade(grade, destinationId, climbingType);
  return {
    id: `${destinationId}-${grade}`,
    name: grade,
    destinationId,
    grade,
    gradeDisplay: parsed.primaryDisplay ?? grade,
    gradeSystem: parsed.primarySystem ?? "unknown",
    gradeParseStatus: parsed.parseStatus,
    gradeComparisonStatus: parsed.comparisonStatus,
    gradeRangeMin: parsed.rangeMin,
    gradeRangeMax: parsed.rangeMax,
    difficultyBand: parsed.filterBand ?? "unknown",
    difficultyBands: parsed.filterBands,
    difficultyRank: parsed.sortValue,
    climbingType,
    styleTags: [],
    isPublishedPick: false,
    sourceCount: 1,
    dnaSnapshot: { origin: "inferred", values: {} }
  };
}

function expect(actual, expected, label) {
  if (actual !== expected) {
    issues.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}
