import type { Locale, LocalizedList, LocalizedText } from "@/types/destination";

export const dnaDimensions = [
  "exploration",
  "performance",
  "adventure",
  "social",
  "comfort",
  "flow"
] as const;

export type DnaDimension = (typeof dnaDimensions)[number];
export type DnaVector = Record<DnaDimension, number>;
export type DnaAnswerEffect = Partial<Record<DnaDimension, number>>;

export type DnaQuestionOption = {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  illustrationKey: string;
  effects: DnaAnswerEffect;
};

export type DnaQuestion = {
  id: string;
  order: number;
  prompt: LocalizedText;
  helper: LocalizedText;
  options: DnaQuestionOption[];
};

export type DnaArchetype = {
  id: string;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  longDescription: LocalizedText;
  strengths: LocalizedList;
  routeStyles: LocalizedList;
  environments: LocalizedList;
  image: {
    src: string;
    alt: LocalizedText;
  };
  dominantDimensions: DnaDimension[];
  idealVector: DnaVector;
  accent: "forest" | "terracotta" | "sky" | "sand";
};

export type DestinationDnaProfile = {
  destinationSlug: string;
  vector: DnaVector;
  traits: LocalizedList;
  summary: LocalizedText;
};

export type DnaAnswerMap = Record<string, string>;

export type DnaProfileResult = {
  scores: DnaVector;
  archetypeId: string;
  secondaryArchetypeId: string;
  completedQuestionIds: string[];
};

export type DnaDestinationMatch = {
  destinationSlug: string;
  score: number;
  reasons: string[];
  alignedDimensions: DnaDimension[];
  watchDimension?: DnaDimension;
  profile: DestinationDnaProfile;
};

export type LocalizedDimensionLabels = Record<
  Locale,
  Record<DnaDimension, string>
>;
