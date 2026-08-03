import { dnaQuestions } from "@/data/dnaQuestions";
import { scoreDnaAnswers } from "@/lib/climbingDna";
import { decodeDnaAnswers, encodeDnaAnswers } from "@/lib/climbingDnaUrl";
import type { DnaAnswerMap, DnaProfileResult } from "@/types/climbingDna";

export const climbingDnaStorageKey = "climbatlas-climbing-dna-v2";
export const climbingDnaOwnerStorageKey = "climbatlas-climbing-dna-owner-v1";
export const climbingDnaUpdatedEvent = "climbatlas:dna-updated";

export function saveDnaAnswers(
  answers: DnaAnswerMap,
  options: { notify?: boolean; ownerId?: string | null } = {}
) {
  window.localStorage.setItem(climbingDnaStorageKey, encodeDnaAnswers(answers));

  if (options.ownerId === null) {
    window.localStorage.removeItem(climbingDnaOwnerStorageKey);
  } else if (options.ownerId) {
    window.localStorage.setItem(climbingDnaOwnerStorageKey, options.ownerId);
  }

  if (options.notify !== false) {
    window.dispatchEvent(
      new CustomEvent<DnaAnswerMap>(climbingDnaUpdatedEvent, {
        detail: answers
      })
    );
  }
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

export function getDnaStorageOwner() {
  return window.localStorage.getItem(climbingDnaOwnerStorageKey);
}

export function clearDnaAnswers() {
  window.localStorage.removeItem(climbingDnaStorageKey);
  window.localStorage.removeItem(climbingDnaOwnerStorageKey);
  window.dispatchEvent(new CustomEvent(climbingDnaUpdatedEvent));
}

export function isValidCompletedDnaAnswers(value: unknown): value is DnaAnswerMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const answers = value as Record<string, unknown>;
  return dnaQuestions.every((question) => {
    const answer = answers[question.id];
    return (
      typeof answer === "string" &&
      question.options.some((option) => option.id === answer)
    );
  });
}
