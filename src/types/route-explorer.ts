import type { LocalizedText } from "@/types/destination";
import type {
  GradeSystem,
  RouteClimbingType,
  RouteGradeFilterBand,
  RouteGradeParseStatus
} from "@/types/route";
import type { RouteDnaSnapshot } from "@/types/route-dna";

export type RouteDifficultyBand = RouteGradeFilterBand;

export type RouteExplorerItem = {
  id: string;
  name: string;
  destinationId: string;
  // Public grade text always preserves the source wording (minus migration markers).
  grade: string;
  gradeDisplay: string;
  gradeSystem: GradeSystem;
  gradeParseStatus: RouteGradeParseStatus;
  gradeRangeMin?: number;
  gradeRangeMax?: number;
  difficultyBand: RouteDifficultyBand;
  difficultyBands: RouteDifficultyBand[];
  difficultyRank?: number;
  climbingType: RouteClimbingType;
  lengthOriginal?: string;
  sectorName?: string;
  styleTags: string[];
  isPublishedPick: boolean;
  summary?: LocalizedText;
  sourceCount: number;
  dnaSnapshot: RouteDnaSnapshot;
};
