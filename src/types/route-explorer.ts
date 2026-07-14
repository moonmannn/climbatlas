import type {
  ExternalLinkStatus,
  LocalizedText
} from "@/types/destination";
import type {
  GradeSystem,
  RouteClimbingType,
  RouteEditorialStatus,
  RouteEditorialTier,
  RouteVerificationStatus
} from "@/types/route";
import type { RouteDnaSnapshot } from "@/types/route-dna";

export type RouteDifficultyBand =
  | "intro"
  | "intermediate"
  | "advanced"
  | "elite"
  | "unknown";

export type RouteExplorerItem = {
  id: string;
  name: string;
  destinationId: string;
  grade: string;
  gradeSystem: GradeSystem;
  difficultyBand: RouteDifficultyBand;
  difficultyRank?: number;
  climbingType: RouteClimbingType;
  sectorName?: string;
  styleTags: string[];
  editorialTier: RouteEditorialTier;
  editorialStatus: RouteEditorialStatus;
  summary?: LocalizedText;
  sourceCount: number;
  verificationStatus: RouteVerificationStatus;
  linkStatus?: ExternalLinkStatus;
  completenessScore: number;
  isImported: boolean;
  dnaSnapshot: RouteDnaSnapshot;
};
