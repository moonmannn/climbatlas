import { dnaQuestions } from "@/data/dnaQuestions";
import { scoreDnaAnswers } from "@/lib/climbingDna";
import { decodeDnaAnswers, encodeDnaAnswers } from "@/lib/climbingDnaUrl";
import type { DnaAnswerMap, DnaProfileResult } from "@/types/climbingDna";

export const climbingDnaStorageKey = "climbatlas-climbing-dna-v2";

export function saveDnaAnswers(answers: DnaAnswerMap) {
  window.localStorage.setItem(climbingDnaStorageKey, encodeDnaAnswers(answers));
}

export function loadDnaAnswers() {
  const encoded = window.localStorage.getItem(climbingDnaStorageKey);
  return encoded ? decodeDnaAnswers(encoded) : null;
}

export function loadDnaProfile(): DnaProfileResult | null {
  const answers = loadDnaAnswers();
  if (!answers) return null;

  const profile = scoreDnaAnswers(answers);
  return profile.completedQuestionIds.length === dnaQuestions.length
    ? profile
    : null;
}
