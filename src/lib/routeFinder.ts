import type { RouteHighlight } from "@/types/destination";

export type RouteFinderGoal =
  | "technique"
  | "endurance"
  | "challenge"
  | "classic"
  | "adventure";

export type RouteFinderEnergy = "easy" | "steady" | "strong";

export type RouteFinderStyle =
  | "power"
  | "endurance"
  | "technical"
  | "adventure-history"
  | "surprise";

export type RouteFinderComfort =
  | "newer"
  | "intermediate"
  | "experienced"
  | "elite";

export type RouteFinderAnswers = {
  goal: RouteFinderGoal;
  energy: RouteFinderEnergy;
  style: RouteFinderStyle;
  comfort: RouteFinderComfort;
};

export type RouteFinderCandidate = {
  route: RouteHighlight;
  destinationName: string;
  destinationSlug: string;
  country: string;
};

export type RouteRecommendation = RouteFinderCandidate & {
  score: number;
  matchLabel: string;
  tags: string[];
  reasons: string[];
  tips: string[];
};

export const defaultRouteFinderAnswers: RouteFinderAnswers = {
  goal: "classic",
  energy: "steady",
  style: "surprise",
  comfort: "experienced"
};

function getSearchText(route: RouteHighlight) {
  return [
    route.name,
    route.grade,
    route.type,
    route.length,
    route.style,
    route.summary,
    route.bestFor,
    ...route.practiceFocus,
    ...route.editorialTips
  ]
    .join(" ")
    .toLowerCase();
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function getDifficultyBand(route: RouteHighlight) {
  const text = `${route.grade} ${route.summary}`.toLowerCase();

  if (
    hasAny(text, [
      "9a",
      "9b",
      "9c",
      "5.14",
      "5.15",
      "v10",
      "v11",
      "v12",
      "v13",
      "v14",
      "v15",
      "v16",
      "v17"
    ])
  ) {
    return "elite";
  }

  if (hasAny(text, ["8a", "8b", "8c", "5.12", "5.13", "v6", "v7", "v8", "v9"])) {
    return "experienced";
  }

  if (hasAny(text, ["7a", "7b", "7c", "5.10", "5.11", "v3", "v4", "v5"])) {
    return "intermediate";
  }

  return "newer";
}

function getComfortScore(route: RouteHighlight, comfort: RouteFinderComfort) {
  const order: RouteFinderComfort[] = [
    "newer",
    "intermediate",
    "experienced",
    "elite"
  ];
  const routeIndex = order.indexOf(getDifficultyBand(route));
  const comfortIndex = order.indexOf(comfort);
  const distance = Math.abs(routeIndex - comfortIndex);

  if (distance === 0) {
    return 18;
  }

  if (distance === 1) {
    return 8;
  }

  return routeIndex > comfortIndex ? -18 : -4;
}

export function getRoutePersonalityTags(route: RouteHighlight) {
  if (route.personalityTags?.length) {
    return route.personalityTags.slice(0, 3);
  }

  const text = getSearchText(route);
  const tags: string[] = [];

  if (hasAny(text, ["history", "historic", "classic", "milestone", "first ascent"])) {
    tags.push("Historic testpiece");
  }
  if (hasAny(text, ["endurance", "long", "sustained", "pacing"])) {
    tags.push("Endurance quest");
  }
  if (hasAny(text, ["finger", "pocket", "crimp", "small hold"])) {
    tags.push("Finger puzzle");
  }
  if (hasAny(text, ["power", "bouldery", "explosive", "dynamic"])) {
    tags.push("Power problem");
  }
  if (hasAny(text, ["technical", "precision", "foot", "balance"])) {
    tags.push("Technique lab");
  }
  if (hasAny(text, ["big wall", "alpine", "multi-pitch", "adventure"])) {
    tags.push("Adventure mindset");
  }

  if (tags.length === 0) {
    tags.push("Style sampler");
  }

  return Array.from(new Set(tags)).slice(0, 3);
}

export function getRouteDecisionHint(route: RouteHighlight) {
  if (route.decisionHint) {
    return route.decisionHint;
  }

  const text = getSearchText(route);

  if (hasAny(text, ["history", "historic", "classic", "milestone"])) {
    return "Pick this when you want a route with a strong story, not just a number.";
  }

  if (hasAny(text, ["endurance", "long", "sustained", "pacing"])) {
    return "Pick this when you want a longer effort and are ready to manage pacing.";
  }

  if (hasAny(text, ["power", "bouldery", "explosive", "finger", "pocket"])) {
    return "Pick this when you feel fresh and want a sharper physical challenge.";
  }

  if (hasAny(text, ["technical", "precision", "foot", "balance"])) {
    return "Pick this when you want to solve movement carefully instead of just pulling hard.";
  }

  return "Pick this when the style sounds motivating and the grade fits your comfort zone.";
}

function scoreGoal(route: RouteHighlight, goal: RouteFinderGoal) {
  const text = getSearchText(route);

  if (goal === "technique") {
    return hasAny(text, ["technical", "precision", "foot", "balance", "reading"]) ? 18 : 0;
  }

  if (goal === "endurance") {
    return hasAny(text, ["endurance", "long", "sustained", "pacing", "multi-pitch"]) ? 18 : 0;
  }

  if (goal === "challenge") {
    return hasAny(text, ["9a", "9b", "5.14", "5.15", "elite", "limit", "hard"]) ? 18 : 4;
  }

  if (goal === "classic") {
    return hasAny(text, ["classic", "history", "historic", "milestone", "benchmark"]) ? 18 : 2;
  }

  return hasAny(text, ["adventure", "alpine", "big wall", "multi-pitch", "history"]) ? 18 : 0;
}

function scoreStyle(route: RouteHighlight, style: RouteFinderStyle) {
  if (style === "surprise") {
    return 6;
  }

  const text = getSearchText(route);

  if (style === "power") {
    return hasAny(text, ["power", "bouldery", "explosive", "dynamic", "finger", "pocket"]) ? 16 : 0;
  }

  if (style === "endurance") {
    return hasAny(text, ["endurance", "long", "sustained", "pacing"]) ? 16 : 0;
  }

  if (style === "technical") {
    return hasAny(text, ["technical", "precision", "foot", "balance", "reading"]) ? 16 : 0;
  }

  return hasAny(text, ["history", "historic", "classic", "alpine", "big wall", "adventure"])
    ? 16
    : 0;
}

function scoreEnergy(route: RouteHighlight, energy: RouteFinderEnergy) {
  const band = getDifficultyBand(route);
  const text = getSearchText(route);

  if (energy === "easy") {
    return band === "newer" || band === "intermediate" ? 12 : -8;
  }

  if (energy === "strong") {
    return band === "elite" || hasAny(text, ["power", "limit", "hard"]) ? 12 : 4;
  }

  return band === "experienced" || hasAny(text, ["classic", "technical", "endurance"])
    ? 10
    : 4;
}

function buildReasons(route: RouteHighlight, answers: RouteFinderAnswers) {
  const tags = getRoutePersonalityTags(route);
  const reasons = [
    getRouteDecisionHint(route),
    `It lines up with your ${answers.goal.replace("-", " ")} goal and ${answers.energy} energy setting.`,
    `ClimbAtlas reads this as: ${tags.join(", ")}.`
  ];

  return reasons;
}

function buildTips(route: RouteHighlight, answers: RouteFinderAnswers) {
  const routeTip = route.editorialTips[0];
  const secondTip =
    answers.energy === "easy"
      ? "Keep the day light: choose quality attempts and leave space for learning."
      : "Keep notes on what felt hard so your next session has a clear practice target.";

  return [routeTip, secondTip].filter(Boolean).slice(0, 2);
}

export function getRouteRecommendations(
  candidates: RouteFinderCandidate[],
  answers: RouteFinderAnswers
) {
  return candidates
    .filter((candidate) => (candidate.route.status ?? "highlight") === "highlight")
    .map<RouteRecommendation>((candidate) => {
      const score =
        40 +
        scoreGoal(candidate.route, answers.goal) +
        scoreStyle(candidate.route, answers.style) +
        scoreEnergy(candidate.route, answers.energy) +
        getComfortScore(candidate.route, answers.comfort);

      const boundedScore = Math.max(18, Math.min(score, 98));

      return {
        ...candidate,
        score: boundedScore,
        matchLabel:
          boundedScore >= 78
            ? "Strong match"
            : boundedScore >= 58
              ? "Good match"
              : "Stretch pick",
        tags: getRoutePersonalityTags(candidate.route),
        reasons: buildReasons(candidate.route, answers),
        tips: buildTips(candidate.route, answers)
      };
    })
    .sort((a, b) => b.score - a.score || a.route.name.localeCompare(b.route.name))
    .slice(0, 3);
}
