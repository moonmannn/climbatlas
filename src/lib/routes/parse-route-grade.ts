import type {
  GradeSystem,
  ParsedRouteGrade,
  RouteClimbingType,
  RouteGradeFilterBand
} from "@/types/route";

type GradeCandidate = {
  system: GradeSystem;
  display: string;
  min: number;
  max: number;
};

const bandOrder: RouteGradeFilterBand[] = [
  "intro",
  "intermediate",
  "advanced",
  "elite"
];

const destinationSystemPreferences: Record<string, GradeSystem[]> = {
  "yosemite-usa": ["yds", "aid", "french"],
  "red-river-gorge-usa": ["yds", "french"],
  "joshua-tree-usa": ["yds"],
  "smith-rock-usa": ["yds", "french", "aid"],
  "squamish-canada": ["yds", "aid"],
  "el-potrero-chico-mexico": ["yds", "french"],
  "fontainebleau-france": ["font", "v-scale"],
  "chamonix-france": ["french", "alpine", "uiaa"],
  "ceuse-france": ["french", "yds"],
  "kalymnos-greece": ["french", "yds"],
  "dolomites-italy": ["uiaa", "french", "yds", "alpine"],
  "frankenjura-germany": ["uiaa", "french", "yds"],
  "siurana-spain": ["french", "yds"],
  "margalef-spain": ["french", "yds"],
  "yangshuo-china": ["french", "yds"],
  "liming-china": ["yds", "french"],
  "long-dong-taiwan": ["french", "yds"],
  "railay-tonsai-thailand": ["french", "yds"],
  "grampians-australia": ["australian", "v-scale", "font"],
  "rocklands-south-africa": ["font", "v-scale"]
};

const romanValues: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12
};

function cleanGrade(original: string) {
  return original.replace(/\bmetadata\b/gi, "").replace(/\s+/g, " ").trim();
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function signedOffset(sign?: string) {
  return sign === "+" ? 0.1 : sign === "-" ? -0.1 : 0;
}

function ydsValue(number: string, letter?: string, sign?: string) {
  const letterOffset = letter ? "abcd".indexOf(letter.toLowerCase()) * 0.25 : 0;
  return Number(number) + letterOffset + signedOffset(sign);
}

function frenchValue(number: string, letter?: string, plus?: string) {
  const letterOffset = letter ? "abc".indexOf(letter.toLowerCase()) / 3 : 0;
  return Number(number) + letterOffset + (plus ? 0.2 : 0);
}

function romanValue(roman: string, sign?: string) {
  return romanValues[roman.toUpperCase()] + signedOffset(sign);
}

function addCandidate(
  candidates: GradeCandidate[],
  system: GradeSystem,
  display: string,
  min: number,
  max = min
) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return;
  candidates.push({ system, display: display.trim(), min: Math.min(min, max), max: Math.max(min, max) });
}

function extractYds(text: string, candidates: GradeCandidate[]) {
  const covered = new Set<number>();
  const fullRange = /5\.(\d{1,2})([abcd])?([+-])?\s*-\s*5\.(\d{1,2})([abcd])?([+-])?/gi;
  for (const match of Array.from(text.matchAll(fullRange))) {
    addCandidate(
      candidates,
      "yds",
      match[0],
      ydsValue(match[1], match[2], match[3]),
      ydsValue(match[4], match[5], match[6])
    );
    for (let index = match.index ?? 0; index < (match.index ?? 0) + match[0].length; index += 1) covered.add(index);
  }

  const letterRange = /5\.(\d{1,2})([abcd])([+-])?\s*\/\s*([abcd])([+-])?/gi;
  for (const match of Array.from(text.matchAll(letterRange))) {
    addCandidate(
      candidates,
      "yds",
      match[0],
      ydsValue(match[1], match[2], match[3]),
      ydsValue(match[1], match[4], match[5])
    );
    for (let index = match.index ?? 0; index < (match.index ?? 0) + match[0].length; index += 1) covered.add(index);
  }

  const single = /5\.(\d{1,2})([abcd])?([+-])?/gi;
  for (const match of Array.from(text.matchAll(single))) {
    if (covered.has(match.index ?? -1)) continue;
    addCandidate(candidates, "yds", match[0], ydsValue(match[1], match[2], match[3]));
  }
}

function extractVScale(text: string, candidates: GradeCandidate[]) {
  const range = /\bV(\d{1,2})([+-])?\s*-\s*V(\d{1,2})([+-])?(?!\w)/gi;
  const covered = new Set<number>();
  for (const match of Array.from(text.matchAll(range))) {
    addCandidate(
      candidates,
      "v-scale",
      match[0],
      Number(match[1]) + signedOffset(match[2]),
      Number(match[3]) + signedOffset(match[4])
    );
    for (let index = match.index ?? 0; index < (match.index ?? 0) + match[0].length; index += 1) covered.add(index);
  }

  for (const match of Array.from(text.matchAll(/\bV(\d{1,2})([+-])?(?!\w)/gi))) {
    if (covered.has(match.index ?? -1)) continue;
    addCandidate(candidates, "v-scale", match[0], Number(match[1]) + signedOffset(match[2]));
  }
}

function extractFrenchOrFont(
  text: string,
  climbingType: RouteClimbingType,
  candidates: GradeCandidate[]
) {
  const system: GradeSystem = climbingType === "boulder" ? "font" : "french";
  const range = /(?<![.\w])([3-9])([abcABC])(\+)?\s*-\s*([3-9])([abcABC])(\+)?(?!\w)/g;
  const covered = new Set<number>();
  for (const match of Array.from(text.matchAll(range))) {
    addCandidate(
      candidates,
      system,
      match[0],
      frenchValue(match[1], match[2], match[3]),
      frenchValue(match[4], match[5], match[6])
    );
    for (let index = match.index ?? 0; index < (match.index ?? 0) + match[0].length; index += 1) covered.add(index);
  }

  for (const match of Array.from(text.matchAll(/(?<![.\w])([3-9])([abcABC])(\+)?(?!\w)/g))) {
    if (covered.has(match.index ?? -1)) continue;
    addCandidate(candidates, system, match[0], frenchValue(match[1], match[2], match[3]));
  }

  if (climbingType === "boulder") {
    for (const match of Array.from(text.matchAll(/\bFont\s*([3-9])([abcABC])?(\+)?\b/g))) {
      addCandidate(candidates, "font", match[0], frenchValue(match[1], match[2], match[3]));
    }
  }
}

function extractUiaa(text: string, destinationId: string, candidates: GradeCandidate[]) {
  const allowsImplicit = ["dolomites-italy", "frankenjura-germany"].includes(destinationId);
  if (!allowsImplicit && !/\bUIAA\b/i.test(text)) return;

  const gradeText = text.replace(/\bUIAA\b/gi, " ");
  const romanPattern = "XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I";
  const range = new RegExp(`\\b(${romanPattern})([+-])?\\s*\\/\\s*(${romanPattern})([+-])?(?!\\w)`, "gi");
  const rangeMatch = range.exec(gradeText);
  const values: number[] = [];
  let display: string | undefined;
  if (rangeMatch) {
    display = rangeMatch[0];
    values.push(romanValue(rangeMatch[1], rangeMatch[2]), romanValue(rangeMatch[3], rangeMatch[4]));
  }

  const single = new RegExp(`\\b(${romanPattern})([+-])?(?!\\w)`, "gi");
  for (const match of Array.from(gradeText.matchAll(single))) {
    values.push(romanValue(match[1], match[2]));
    display ??= match[0];
  }

  if (values.length > 0 && display) {
    addCandidate(candidates, "uiaa", display, Math.min(...values), Math.max(...values));
  }
}

function extractAustralian(text: string, destinationId: string, candidates: GradeCandidate[]) {
  if (destinationId !== "grampians-australia") return;
  const range = /(?<![.\w])([1-9]\d?)(?:\s*-\s*([1-9]\d?))?(?![.\w])/g;
  for (const match of Array.from(text.matchAll(range))) {
    addCandidate(candidates, "australian", match[0], Number(match[1]), Number(match[2] ?? match[1]));
  }
}

function extractAlpine(text: string, candidates: GradeCandidate[]) {
  const values: Record<string, number> = { F: 1, PD: 2, AD: 3, D: 4, TD: 5, ED: 6 };
  const match = text.match(/\b(PD|AD|TD|ED(?:[1-4])?|D|F)([+-])?\b/);
  if (!match) return;
  const base = match[1].startsWith("ED") ? "ED" : match[1];
  const edSubdivision = match[1].startsWith("ED")
    ? Number(match[1].slice(2) || 0) / 10
    : 0;
  addCandidate(
    candidates,
    "alpine",
    match[0],
    values[base] + edSubdivision + signedOffset(match[2])
  );
}

function extractAidAndIce(text: string, candidates: GradeCandidate[]) {
  const aid = text.match(/\b([AC])([0-5])([+-])?\b/i);
  if (aid) addCandidate(candidates, "aid", aid[0], Number(aid[2]) + signedOffset(aid[3]));

  const ice = text.match(/\b(?:WI|AI)(\d)([+-])?\b/i);
  if (ice) addCandidate(candidates, "ice", ice[0], Number(ice[1]) + signedOffset(ice[2]));

  const mixed = text.match(/\bM(\d{1,2})([+-])?\b/i);
  if (mixed) addCandidate(candidates, "mixed", mixed[0], Number(mixed[1]) + signedOffset(mixed[2]));
}

function defaultPreferences(climbingType: RouteClimbingType): GradeSystem[] {
  if (climbingType === "boulder") return ["v-scale", "font", "yds", "french"];
  if (climbingType === "alpine") return ["alpine", "uiaa", "french", "yds", "ice", "mixed"];
  if (climbingType === "ice" || climbingType === "mixed") return ["ice", "mixed", "uiaa", "yds"];
  return ["french", "yds", "uiaa", "australian", "british-trad", "aid", "alpine"];
}

function pickPrimaryCandidate(
  candidates: GradeCandidate[],
  destinationId: string,
  climbingType: RouteClimbingType
) {
  const preferences =
    climbingType === "boulder" && destinationId === "grampians-australia"
      ? ["v-scale", "font", "australian"] as GradeSystem[]
      : destinationSystemPreferences[destinationId] ?? defaultPreferences(climbingType);
  for (const system of preferences) {
    const matches = candidates
      .filter((candidate) => candidate.system === system)
      .sort((first, second) => second.max - first.max || (second.max - second.min) - (first.max - first.min));
    if (matches[0]) return matches[0];
  }
  return candidates[0];
}

function bandFor(system: GradeSystem, value: number): RouteGradeFilterBand {
  switch (system) {
    case "yds":
      return value < 9 ? "intro" : value < 11 ? "intermediate" : value < 13 ? "advanced" : "elite";
    case "v-scale":
      return value <= 2 ? "intro" : value <= 5 ? "intermediate" : value <= 9 ? "advanced" : "elite";
    case "french":
    case "font":
      return value < 6 ? "intro" : value < 7 ? "intermediate" : value < 8 ? "advanced" : "elite";
    case "uiaa":
      return value < 5 ? "intro" : value <= 6 ? "intermediate" : value <= 8 ? "advanced" : "elite";
    case "australian":
      return value <= 14 ? "intro" : value <= 20 ? "intermediate" : value <= 27 ? "advanced" : "elite";
    case "alpine":
      return value <= 2 ? "intro" : value <= 3 ? "intermediate" : value <= 5 ? "advanced" : "elite";
    case "aid":
    case "ice":
    case "mixed":
      return value <= 1 ? "intro" : value <= 2 ? "intermediate" : value <= 4 ? "advanced" : "elite";
    default:
      return "unknown";
  }
}

function bandsFor(system: GradeSystem, min: number, max: number) {
  const first = bandFor(system, min);
  const last = bandFor(system, max);
  if (first === "unknown" || last === "unknown") return ["unknown"] as RouteGradeFilterBand[];
  const start = bandOrder.indexOf(first);
  const end = bandOrder.indexOf(last);
  return bandOrder.slice(Math.min(start, end), Math.max(start, end) + 1);
}

function commitmentGrade(text: string, primary?: GradeCandidate) {
  if (!primary || !["yds", "aid"].includes(primary.system)) return undefined;
  return text.match(/^\s*(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b/i)?.[1]?.toUpperCase();
}

function comparisonStatus(
  text: string,
  primary: GradeCandidate | undefined
) {
  if (/\bproposed\b/i.test(text)) return "proposed" as const;
  if (
    primary?.system === "font" &&
    (/\b(?:historic|historical)\b/i.test(text) ||
      /\bFont\s*[3-9](?![abcABC+])/i.test(text))
  ) {
    return "historical" as const;
  }
  return primary ? ("comparable" as const) : ("ambiguous" as const);
}

export function gradeRangesOverlap(
  firstMin: number,
  firstMax: number,
  secondMin: number,
  secondMax: number
) {
  return Math.min(firstMin, firstMax) <= Math.max(secondMin, secondMax) &&
    Math.max(firstMin, firstMax) >= Math.min(secondMin, secondMax);
}

export function parseRouteGrade(
  original: string,
  destinationId: string,
  climbingType: RouteClimbingType
): ParsedRouteGrade {
  const text = cleanGrade(original);
  const candidates: GradeCandidate[] = [];

  extractYds(text, candidates);
  extractVScale(text, candidates);
  extractFrenchOrFont(text, climbingType, candidates);
  extractUiaa(text, destinationId, candidates);
  extractAustralian(text, destinationId, candidates);
  extractAlpine(text, candidates);
  extractAidAndIce(text, candidates);

  const primary = pickPrimaryCandidate(candidates, destinationId, climbingType);
  const detectedSystems = unique(candidates.map((candidate) => candidate.system));
  const aidGrade = candidates.find((candidate) => candidate.system === "aid")?.display;
  const gradeComparisonStatus = comparisonStatus(text, primary);

  if (!primary) {
    return {
      original,
      comparisonStatus: gradeComparisonStatus,
      detectedSystems,
      filterBands: ["unknown"],
      aidGrade,
      parseStatus: "unparsed"
    };
  }

  if (gradeComparisonStatus !== "comparable") {
    return {
      original,
      comparisonStatus: gradeComparisonStatus,
      detectedSystems,
      primarySystem: primary.system,
      primaryDisplay: primary.display,
      filterBands: ["unknown"],
      aidGrade,
      commitmentGrade: commitmentGrade(text, primary),
      parseStatus: detectedSystems.length > 1 ? "partial" : "parsed"
    };
  }

  const filterBands = bandsFor(primary.system, primary.min, primary.max);
  return {
    original,
    comparisonStatus: gradeComparisonStatus,
    detectedSystems,
    primarySystem: primary.system,
    primaryDisplay: primary.display,
    rangeMin: primary.min,
    rangeMax: primary.max,
    sortValue: (primary.min + primary.max) / 2,
    filterBand: bandFor(primary.system, primary.max),
    filterBands,
    aidGrade,
    commitmentGrade: commitmentGrade(text, primary),
    parseStatus: detectedSystems.length > 1 ? "partial" : "parsed"
  };
}
