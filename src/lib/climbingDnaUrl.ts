import { dnaQuestions } from "@/data/dnaQuestions";
import type { DnaAnswerMap } from "@/types/climbingDna";

const separator = ".";

export function encodeDnaAnswers(answers: DnaAnswerMap) {
  return dnaQuestions.map((question) => answers[question.id] ?? "").join(separator);
}

export function decodeDnaAnswers(value: string): DnaAnswerMap | null {
  const optionIds = value.split(separator);
  if (optionIds.length !== dnaQuestions.length) return null;

  const answers: DnaAnswerMap = {};
  for (let index = 0; index < dnaQuestions.length; index += 1) {
    const question = dnaQuestions[index];
    const optionId = optionIds[index];
    if (!question.options.some((option) => option.id === optionId)) return null;
    answers[question.id] = optionId;
  }

  return answers;
}
