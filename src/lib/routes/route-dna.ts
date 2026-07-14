import type { DnaDimension, DnaVector } from "@/types/climbingDna";
import type { LocalizedText } from "@/types/destination";
import type { RouteDnaEvidence, RouteDnaMatch, RouteDnaSnapshot } from "@/types/route-dna";
import type { RouteDifficultyBand } from "@/types/route-explorer";
import type { AttributeOrigin, RouteRecord } from "@/types/route";

type VectorAdjustment = Partial<Record<DnaDimension, number>>;

const dnaDimensions: DnaDimension[] = [
  "exploration",
  "performance",
  "adventure",
  "social",
  "comfort",
  "flow"
];

const matchReasonCopy: Record<DnaDimension, LocalizedText> = {
  exploration: {
    en: "You and this route both lean toward discovery and a day with some variety.",
    zh: "你和这条路线都更偏向探索感，以及带有变化的一天。"
  },
  performance: {
    en: "Its challenge profile is close to your appetite for focused progression.",
    zh: "它的挑战画像与你对专注进步的偏好比较接近。"
  },
  adventure: {
    en: "Its inferred level of commitment fits your interest in adventurous climbing days.",
    zh: "它推断出的投入感，契合你对冒险型攀岩日的兴趣。"
  },
  social: {
    en: "Its route format is compatible with the shared energy you enjoy.",
    zh: "它的线路形式与你偏好的结伴和分享氛围较为一致。"
  },
  comfort: {
    en: "Its inferred day profile is close to the level of comfort and predictability you prefer.",
    zh: "它推断出的攀岩日节奏，接近你偏好的舒适度和可预期性。"
  },
  flow: {
    en: "Its structured profile points toward the rhythm and problem-solving you value.",
    zh: "它的结构化画像更靠近你看重的动作节奏和解题体验。"
  }
};

const mismatchCopy: Record<DnaDimension, LocalizedText> = {
  exploration: {
    en: "This route may offer less variety than your exploration preference suggests.",
    zh: "这条路线提供的变化感，可能低于你的探索偏好。"
  },
  performance: {
    en: "Its inferred performance demand is above your current preference profile.",
    zh: "它推断出的表现需求，高于你当前的偏好画像。"
  },
  adventure: {
    en: "Its inferred commitment is higher than your usual adventure preference.",
    zh: "它推断出的投入感，高于你平时偏好的冒险程度。"
  },
  social: {
    en: "The route format may feel less social than your profile prefers.",
    zh: "这条路线的形式，可能没有你的画像所偏好的那么社交。"
  },
  comfort: {
    en: "This route appears less comfort-oriented than your profile prefers.",
    zh: "这条路线看起来没有你的画像所偏好的那么舒适从容。"
  },
  flow: {
    en: "The available structured data gives only limited evidence for the movement rhythm you prefer.",
    zh: "现有结构化数据，对你偏好的动作节奏只能提供有限证据。"
  }
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function neutralVector(): DnaVector {
  return Object.fromEntries(dnaDimensions.map((dimension) => [dimension, 50])) as DnaVector;
}

function localized(en: string, zh: string): LocalizedText {
  return { en, zh };
}

function addAdjustment(vector: DnaVector, adjustment: VectorAdjustment) {
  for (const dimension of dnaDimensions) {
    vector[dimension] = clamp(vector[dimension] + (adjustment[dimension] ?? 0));
  }
}

function addEvidence(
  target: RouteDnaEvidence[],
  dimension: DnaDimension,
  origin: AttributeOrigin,
  en: string,
  zh: string
) {
  target.push({ dimension, origin, text: localized(en, zh) });
}

function applyTypeRules(
  route: RouteRecord,
  vector: DnaVector,
  evidence: RouteDnaEvidence[],
  considerations: RouteDnaEvidence[]
) {
  switch (route.climbingType) {
    case "sport":
      addAdjustment(vector, { performance: 10, flow: 6, comfort: 4 });
      addEvidence(evidence, "performance", "inferred", "Sport climbing raises the performance signal.", "运动攀类型提高了表现维度。以推断信息显示。");
      break;
    case "trad":
      addAdjustment(vector, { adventure: 10, exploration: 7, comfort: -5 });
      addEvidence(evidence, "adventure", "inferred", "Trad type raises the adventure signal.", "传统攀类型提高了冒险维度。以推断信息显示。");
      break;
    case "boulder":
      addAdjustment(vector, { performance: 8, flow: 8, social: 4, comfort: 4 });
      addEvidence(evidence, "flow", "inferred", "Bouldering raises the movement and flow signal.", "抱石类型提高了动作与流动维度。以推断信息显示。");
      break;
    case "top-rope":
      addAdjustment(vector, { comfort: 12, social: 5, adventure: -8 });
      addEvidence(evidence, "comfort", "inferred", "Top-rope format raises the comfort signal.", "顶绳形式提高了舒适维度。以推断信息显示。");
      break;
    case "multi-pitch":
      addAdjustment(vector, { adventure: 14, exploration: 8, comfort: -10 });
      addEvidence(evidence, "adventure", "inferred", "Multi-pitch format raises the commitment and adventure signal.", "多段线路形式提高了投入感与冒险维度。以推断信息显示。");
      addEvidence(considerations, "comfort", "inferred", "Multi-pitch format can make the day feel more committing; check current local resources before choosing.", "多段线路通常会让一天更有投入感；做决定前仍应查看最新当地资料。以推断信息显示。");
      break;
    case "alpine":
      addAdjustment(vector, { adventure: 18, exploration: 12, comfort: -14 });
      addEvidence(evidence, "adventure", "inferred", "Alpine type strongly raises the adventure signal.", "高山攀类型明显提高了冒险维度。以推断信息显示。");
      addEvidence(considerations, "comfort", "inferred", "Alpine classification suggests a less comfort-oriented day; this is not a conditions or safety assessment.", "高山攀分类意味着这一天可能不太偏舒适；这不是条件或安全评估。以推断信息显示。");
      break;
    case "ice":
    case "mixed":
      addAdjustment(vector, { adventure: 16, performance: 8, comfort: -12 });
      addEvidence(evidence, "adventure", "inferred", "The recorded climbing type raises the adventure signal.", "记录的攀登类型提高了冒险维度。以推断信息显示。");
      break;
  }
}

function applyDifficultyRules(
  band: RouteDifficultyBand,
  vector: DnaVector,
  evidence: RouteDnaEvidence[],
  considerations: RouteDnaEvidence[]
) {
  switch (band) {
    case "intro":
      addAdjustment(vector, { comfort: 14, performance: -8 });
      addEvidence(evidence, "comfort", "inferred", "The original grade falls in this destination's broad intro band.", "原始等级落在该目的地的宽泛入门分组中。以推断信息显示。");
      break;
    case "intermediate":
      addAdjustment(vector, { comfort: 6, performance: 4 });
      addEvidence(evidence, "comfort", "inferred", "The original grade falls in a broad intermediate band.", "原始等级落在宽泛的进阶分组中。以推断信息显示。");
      break;
    case "advanced":
      addAdjustment(vector, { performance: 15, comfort: -8 });
      addEvidence(evidence, "performance", "inferred", "The original grade raises the performance signal.", "原始等级提高了表现维度。以推断信息显示。");
      addEvidence(considerations, "performance", "inferred", "The grade sits in a broad advanced band; this is a preference signal, not an ability recommendation.", "该等级属于宽泛的高阶分组；这只是偏好信号，不是能力建议。以推断信息显示。");
      break;
    case "elite":
      addAdjustment(vector, { performance: 25, comfort: -15 });
      addEvidence(evidence, "performance", "inferred", "The original grade strongly raises the performance signal.", "原始等级明显提高了表现维度。以推断信息显示。");
      addEvidence(considerations, "performance", "inferred", "The grade sits in a broad elite band; current ability, conditions, and local information still decide whether it is appropriate.", "该等级属于宽泛的精英分组；是否合适仍取决于当前能力、条件和当地资料。以推断信息显示。");
      break;
  }
}

function applyLengthRules(
  route: RouteRecord,
  vector: DnaVector,
  evidence: RouteDnaEvidence[],
  considerations: RouteDnaEvidence[]
) {
  const longByLength = (route.lengthMeters ?? 0) >= 100;
  const longByPitches = (route.pitches ?? 0) >= 5;
  if (!longByLength && !longByPitches) return;

  addAdjustment(vector, { adventure: 9, comfort: -6 });
  addEvidence(evidence, "adventure", "inferred", "Recorded length or pitch count raises the commitment signal.", "记录的长度或段数提高了投入感。以推断信息显示。");
  addEvidence(considerations, "comfort", "inferred", "Recorded length or pitch count may make this a fuller day than a short single-pitch route.", "记录的长度或段数意味着，它可能比短小单段线路更像完整的一天。以推断信息显示。");
}

function applyControlledTagRules(route: RouteRecord, vector: DnaVector, evidence: RouteDnaEvidence[]) {
  const tagValues: Array<string | undefined> = [
    route.style.wallAngle,
    ...route.style.terrainTags,
    ...route.style.movementTags,
    ...route.style.physicalTags,
    ...route.experienceTags
  ];
  const tags = new Set<string>(
    tagValues.filter((tag): tag is string => Boolean(tag))
  );

  const rules: Array<{ tags: string[]; adjustment: VectorAdjustment; dimension: DnaDimension; en: string; zh: string }> = [
    { tags: ["technical", "slab", "vertical"], adjustment: { flow: 11 }, dimension: "flow", en: "Controlled technical or wall-angle tags raise the flow signal.", zh: "已确认的技术或壁面角度标签提高了流动维度。" },
    { tags: ["power", "overhang", "roof"], adjustment: { performance: 13 }, dimension: "performance", en: "Controlled power or steepness tags raise the performance signal.", zh: "已确认的力量或陡峭标签提高了表现维度。" },
    { tags: ["endurance", "sustained"], adjustment: { performance: 11, flow: 5 }, dimension: "performance", en: "Controlled endurance tags raise the performance signal.", zh: "已确认的耐力标签提高了表现维度。" },
    { tags: ["scenic", "quiet"], adjustment: { exploration: 10 }, dimension: "exploration", en: "Controlled experience tags raise the exploration signal.", zh: "已确认的体验标签提高了探索维度。" },
    { tags: ["beginner-friendly", "first-outdoor-route", "short-approach"], adjustment: { comfort: 12 }, dimension: "comfort", en: "Controlled accessibility tags raise the comfort signal.", zh: "已确认的友好度标签提高了舒适维度。" },
    { tags: ["classic", "crowded"], adjustment: { social: 8 }, dimension: "social", en: "Controlled popularity tags raise the social signal.", zh: "已确认的人气标签提高了社交维度。" },
    { tags: ["high-commitment", "long-approach", "exposed"], adjustment: { adventure: 13, comfort: -8 }, dimension: "adventure", en: "Controlled commitment tags raise the adventure signal.", zh: "已确认的投入感标签提高了冒险维度。" }
  ];

  for (const rule of rules) {
    if (!rule.tags.some((tag) => tags.has(tag))) continue;
    addAdjustment(vector, rule.adjustment);
    addEvidence(evidence, rule.dimension, "inferred", rule.en, `${rule.zh}DNA 映射以推断信息显示。`);
  }
}

export function buildRouteDnaSnapshot(route: RouteRecord, difficultyBand: RouteDifficultyBand): RouteDnaSnapshot {
  const vector = neutralVector();
  const evidence: RouteDnaEvidence[] = [];
  const considerations: RouteDnaEvidence[] = [];
  const inputs = ["climbingType"];

  applyTypeRules(route, vector, evidence, considerations);
  if (difficultyBand !== "unknown") {
    inputs.push("originalGrade");
    applyDifficultyRules(difficultyBand, vector, evidence, considerations);
  }
  if (route.lengthMeters || route.pitches) {
    inputs.push(route.pitches ? "pitches" : "lengthMeters");
    applyLengthRules(route, vector, evidence, considerations);
  }

  const hasControlledTags = Boolean(
    route.style.wallAngle ||
      route.style.terrainTags.length ||
      route.style.movementTags.length ||
      route.style.physicalTags.length ||
      route.experienceTags.length
  );
  if (hasControlledTags) {
    inputs.push("controlledTags");
    applyControlledTagRules(route, vector, evidence);
  }

  if (route.dnaProfile) {
    inputs.push("dnaProfile");
    for (const dimension of dnaDimensions) {
      const value = route.dnaProfile.values[dimension];
      if (value === undefined) continue;
      vector[dimension] = clamp(value);
      addEvidence(
        evidence,
        dimension,
        route.dnaProfile.origin,
        `The route's ${dimension} value comes from its explicit DNA profile.`,
        `这条路线的${dimension}数值来自明确的 DNA 画像。`
      );
    }
  }

  const origin = route.dnaProfile?.origin ?? "inferred";
  const confidence = route.dnaProfile
    ? route.dnaProfile.origin === "inferred" ? "medium" : "editorial"
    : hasControlledTags || inputs.length >= 3 ? "medium" : "limited";

  return { vector, origin, confidence, evidence, considerations, inputs };
}

function routeMatchScore(user: DnaVector, route: DnaVector) {
  let weightedGap = 0;
  let totalWeight = 0;
  for (const dimension of dnaDimensions) {
    const weight = 0.6 + Math.max(user[dimension], route[dimension]) / 100;
    weightedGap += Math.abs(user[dimension] - route[dimension]) * weight;
    totalWeight += weight;
  }
  return clamp(100 - weightedGap / totalWeight);
}

function alignedDimensions(user: DnaVector, route: DnaVector) {
  return [...dnaDimensions]
    .filter((dimension) => user[dimension] >= 48 && route[dimension] >= 52)
    .sort((first, second) => {
      const firstFit = Math.min(user[first], route[first]) - Math.abs(user[first] - route[first]);
      const secondFit = Math.min(user[second], route[second]) - Math.abs(user[second] - route[second]);
      return secondFit - firstFit || first.localeCompare(second);
    })
    .slice(0, 2);
}

export function getRouteDnaMatch(user: DnaVector, snapshot: RouteDnaSnapshot): RouteDnaMatch {
  const aligned = alignedDimensions(user, snapshot.vector);
  const fallbackAligned = [...dnaDimensions]
    .sort((first, second) => Math.abs(user[first] - snapshot.vector[first]) - Math.abs(user[second] - snapshot.vector[second]))
    .slice(0, 2);
  const finalAligned = aligned.length >= 2 ? aligned : fallbackAligned;

  const mismatchDimensions = [...dnaDimensions]
    .filter((dimension) => {
      if (dimension === "comfort") return user[dimension] - snapshot.vector[dimension] >= 15;
      return snapshot.vector[dimension] - user[dimension] >= 18;
    })
    .sort((first, second) => Math.abs(user[second] - snapshot.vector[second]) - Math.abs(user[first] - snapshot.vector[first]));

  const considerations = [
    ...mismatchDimensions.slice(0, 2).map((dimension) => mismatchCopy[dimension]),
    ...snapshot.considerations.slice(0, 2).map((item) => item.text)
  ].filter((item, index, list) => list.findIndex((candidate) => candidate.en === item.en) === index).slice(0, 2);

  return {
    score: routeMatchScore(user, snapshot.vector),
    alignedDimensions: finalAligned,
    reasons: finalAligned.map((dimension) => matchReasonCopy[dimension]),
    considerations,
    origin: snapshot.origin,
    confidence: snapshot.confidence
  };
}
