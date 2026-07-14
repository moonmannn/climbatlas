import { destinationDnaProfiles } from "@/data/destinationDnaProfiles";
import { dnaArchetypes } from "@/data/dnaArchetypes";
import { dnaQuestions } from "@/data/dnaQuestions";
import {
  dnaDimensions,
  type DnaAnswerMap,
  type DnaArchetype,
  type DnaDestinationMatch,
  type DnaDimension,
  type DnaProfileResult,
  type DnaVector,
  type LocalizedDimensionLabels
} from "@/types/climbingDna";
import type { Locale, LocalizedText } from "@/types/destination";

export const dnaDimensionLabels: LocalizedDimensionLabels = {
  en: { exploration: "Exploration", performance: "Performance", adventure: "Adventure", social: "Social", comfort: "Comfort", flow: "Flow" },
  zh: { exploration: "探索", performance: "表现", adventure: "冒险", social: "社交", comfort: "舒适", flow: "流动" }
};

const reasonCopy: Record<Locale, Record<DnaDimension, string>> = {
  en: {
    exploration: "The destination leaves room for variety, discovery, and a sense of place.",
    performance: "Its profile supports focused climbing and meaningful progression.",
    adventure: "The scale and commitment align with your appetite for adventurous days.",
    social: "Its climbing rhythm is well suited to shared days and community energy.",
    comfort: "Its overall rhythm fits your preference for manageable, repeatable climbing days.",
    flow: "The destination profile favors movement quality, rhythm, and problem solving."
  },
  zh: {
    exploration: "这里有足够的变化、发现感和鲜明的地方体验。",
    performance: "这里的体验画像适合专注攀爬和有方向的进步。",
    adventure: "这里的尺度与投入感，契合你对冒险型攀岩日的偏好。",
    social: "这里的攀岩节奏适合共享一天，也有较强的社群能量。",
    comfort: "这里的整体节奏，符合你对可管理、可重复攀岩日的偏好。",
    flow: "这里更强调动作质量、节奏和解题体验。"
  }
};

function emptyVector(value = 0): DnaVector {
  return Object.fromEntries(dnaDimensions.map((dimension) => [dimension, value])) as DnaVector;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getArchetypeDistance(scores: DnaVector, archetype: DnaArchetype) {
  return dnaDimensions.reduce((total, dimension) => total + Math.abs(scores[dimension] - archetype.idealVector[dimension]), 0) / dnaDimensions.length;
}

export function getDnaArchetype(scores: DnaVector) {
  return getRankedDnaArchetypes(scores)[0];
}

export function getRankedDnaArchetypes(scores: DnaVector) {
  return [...dnaArchetypes].sort(
    (first, second) =>
      getArchetypeDistance(scores, first) -
        getArchetypeDistance(scores, second) ||
      first.id.localeCompare(second.id)
  );
}

export function scoreDnaAnswers(answers: DnaAnswerMap): DnaProfileResult {
  const totals = emptyVector();
  const possibleTotals = emptyVector();
  const completedQuestionIds: string[] = [];

  for (const question of dnaQuestions) {
    const selectedOption = question.options.find((option) => option.id === answers[question.id]);
    if (!selectedOption) continue;
    completedQuestionIds.push(question.id);
    for (const dimension of dnaDimensions) {
      totals[dimension] += selectedOption.effects[dimension] ?? 0;
      possibleTotals[dimension] += Math.max(...question.options.map((option) => option.effects[dimension] ?? 0));
    }
  }

  const scores = Object.fromEntries(dnaDimensions.map((dimension) => {
    const possible = possibleTotals[dimension];
    const normalized = possible === 0 ? 50 : 20 + (totals[dimension] / possible) * 80;
    return [dimension, clampScore(normalized)];
  })) as DnaVector;
  const [archetype, secondaryArchetype] = getRankedDnaArchetypes(scores);
  return {
    scores,
    archetypeId: archetype.id,
    secondaryArchetypeId: secondaryArchetype.id,
    completedQuestionIds
  };
}

export function getLocalizedDnaText(text: LocalizedText, locale: Locale) {
  return text[locale] ?? text.en ?? "";
}

function getDestinationMatchScore(userScores: DnaVector, destinationScores: DnaVector) {
  let weightedGap = 0;
  let totalWeight = 0;
  for (const dimension of dnaDimensions) {
    const weight = 0.1 + Math.pow(userScores[dimension] / 100, 2);
    const difference = destinationScores[dimension] - userScores[dimension];
    const gap = difference >= 0 ? difference * 0.35 : Math.abs(difference);
    weightedGap += gap * weight;
    totalWeight += weight;
  }
  return clampScore(100 - weightedGap / totalWeight);
}

function getAlignedDimensions(userScores: DnaVector, destinationScores: DnaVector) {
  const ranked = [...dnaDimensions].sort((first, second) => {
    const firstValue = userScores[first] - Math.abs(userScores[first] - destinationScores[first]);
    const secondValue = userScores[second] - Math.abs(userScores[second] - destinationScores[second]);
    return secondValue - firstValue || first.localeCompare(second);
  });
  const strong = ranked.filter((dimension) => userScores[dimension] >= 55 && destinationScores[dimension] >= 60 && Math.abs(userScores[dimension] - destinationScores[dimension]) <= 25);
  return (strong.length >= 2 ? strong : ranked).slice(0, 2);
}

function getWatchDimension(userScores: DnaVector, destinationScores: DnaVector) {
  return [...dnaDimensions]
    .filter((dimension) => userScores[dimension] >= 60 && userScores[dimension] - destinationScores[dimension] >= 22)
    .sort((first, second) => (userScores[second] - destinationScores[second]) - (userScores[first] - destinationScores[first]))[0];
}

function getMatchReasons(alignedDimensions: DnaDimension[], locale: Locale) {
  return alignedDimensions.map((dimension) => reasonCopy[locale][dimension]);
}

export function getDestinationDnaMatches(userScores: DnaVector, locale: Locale, limit = 3): DnaDestinationMatch[] {
  return destinationDnaProfiles
    .map((profile) => {
      const alignedDimensions = getAlignedDimensions(userScores, profile.vector);
      return {
        destinationSlug: profile.destinationSlug,
        score: getDestinationMatchScore(userScores, profile.vector),
        reasons: getMatchReasons(alignedDimensions, locale),
        alignedDimensions,
        watchDimension: getWatchDimension(userScores, profile.vector),
        profile
      };
    })
    .sort((first, second) => second.score - first.score || first.destinationSlug.localeCompare(second.destinationSlug))
    .slice(0, Math.max(0, limit));
}

export function getDnaDimensionLabel(dimension: DnaDimension, locale: Locale) {
  return dnaDimensionLabels[locale][dimension];
}
