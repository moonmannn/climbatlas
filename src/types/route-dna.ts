import type { DnaDimension, DnaVector } from "@/types/climbingDna";
import type { LocalizedText } from "@/types/destination";
import type { AttributeOrigin } from "@/types/route";

export type RouteDnaConfidence = "limited" | "medium" | "editorial";

export type RouteDnaEvidence = {
  dimension: DnaDimension;
  origin: AttributeOrigin;
  text: LocalizedText;
};

export type RouteDnaSnapshot = {
  vector: DnaVector;
  origin: AttributeOrigin;
  confidence: RouteDnaConfidence;
  evidence: RouteDnaEvidence[];
  considerations: RouteDnaEvidence[];
  inputs: string[];
};

export type RouteDnaMatch = {
  score: number;
  alignedDimensions: DnaDimension[];
  reasons: LocalizedText[];
  considerations: LocalizedText[];
  origin: AttributeOrigin;
  confidence: RouteDnaConfidence;
};
