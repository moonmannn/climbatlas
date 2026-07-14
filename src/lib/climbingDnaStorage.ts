import { decodeDnaAnswers, encodeDnaAnswers } from "@/lib/climbingDnaUrl";
import type { DnaAnswerMap } from "@/types/climbingDna";

export const climbingDnaStorageKey = "climbatlas-climbing-dna-v2";

export function saveDnaAnswers(answers: DnaAnswerMap) {
  window.localStorage.setItem(climbingDnaStorageKey, encodeDnaAnswers(answers));
}

export function loadDnaAnswers() {
  const encoded = window.localStorage.getItem(climbingDnaStorageKey);
  return encoded ? decodeDnaAnswers(encoded) : null;
}
