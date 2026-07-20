import type {
  RouteFactQualifier,
  RouteFormat,
  RouteNormalizationMetadata
} from "@/types/route";

type LegacyRouteFactInput = {
  rawLength?: string;
  lengthMeters?: number;
  lengthFeet?: number;
  lengthQualifier?: RouteFactQualifier;
  pitchCount?: number;
  pitches?: number;
  pitchQualifier?: RouteFactQualifier;
  routeFormat?: RouteFormat;
};

export type NormalizedRouteFacts = {
  lengthMeters?: number;
  lengthFeet?: number;
  lengthQualifier?: RouteFactQualifier;
  pitchCount?: number;
  pitchQualifier?: RouteFactQualifier;
  routeFormat?: RouteFormat;
  omittedLegacyFacts: NonNullable<
    RouteNormalizationMetadata["omittedLegacyFacts"]
  >;
};

const approximatePrefix = String.raw`(?:about|approximately|approx\.?|~)`;
const numericToken = String.raw`[\d,]+(?:\.\d+)?`;

function positiveNumber(value: number | undefined) {
  return value !== undefined && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function routeFormatFromText(value: string): RouteFormat | undefined {
  if (/\bboulder(?:ing)?\s+problem\b/i.test(value)) return "boulder-problem";
  if (/\bbig[-\s]?wall\b/i.test(value)) return "big-wall";
  if (/\bmulti[-\s]?pitch\b/i.test(value)) return "multi-pitch";
  if (/\bsingle[-\s]?pitch\b/i.test(value)) return "single-pitch";
  if (/\balpine\s+(?:route|objective)\b/i.test(value)) {
    return "alpine-objective";
  }
  return undefined;
}

function containsOnlyStructuredFact(value: string) {
  const trimmed = value.trim();
  return [
    new RegExp(`^${approximatePrefix}?\\s*${numericToken}\\s*(?:m|meters?|metres?)$`, "i"),
    new RegExp(`^${approximatePrefix}?\\s*${numericToken}\\s*(?:ft|feet|foot)$`, "i"),
    new RegExp(`^${approximatePrefix}?\\s*\\d+\\s*pitch(?:es)?$`, "i"),
    /^(?:a\s+)?(?:boulder(?:ing)?\s+problem|single[-\s]?pitch(?:\s+route)?|multi[-\s]?pitch(?:\s+route)?|big[-\s]?wall(?:\s+route)?|alpine\s+(?:route|objective))$/i
  ].some((pattern) => pattern.test(trimmed));
}

export function normalizeLegacyRouteFacts({
  rawLength,
  lengthMeters: suppliedMeters,
  lengthFeet: suppliedFeet,
  lengthQualifier: suppliedLengthQualifier,
  pitchCount: suppliedPitchCount,
  pitches,
  pitchQualifier: suppliedPitchQualifier,
  routeFormat: suppliedRouteFormat
}: LegacyRouteFactInput): NormalizedRouteFacts {
  const value = rawLength?.trim() ?? "";
  let lengthMeters = positiveNumber(suppliedMeters);
  let lengthFeet = positiveNumber(suppliedFeet);
  let pitchCount = positiveNumber(suppliedPitchCount ?? pitches);
  let lengthQualifier = suppliedLengthQualifier;
  let pitchQualifier = suppliedPitchQualifier;
  const routeFormat = suppliedRouteFormat ?? routeFormatFromText(value);

  if (value) {
    const meters = value.match(
      new RegExp(`\\b(${approximatePrefix}\\s*)?(${numericToken})\\s*(?:m|meters?|metres?)\\b`, "i")
    );
    const feet = value.match(
      new RegExp(`\\b(${approximatePrefix}\\s*)?(${numericToken})\\s*(?:ft|feet|foot)\\b`, "i")
    );
    const pitch = value.match(
      new RegExp(`\\b(${approximatePrefix}\\s*)?(\\d+)\\s*pitch(?:es)?\\b`, "i")
    );

    if (!lengthMeters && meters) {
      lengthMeters = positiveNumber(Number(meters[2].replace(/,/g, "")));
    }
    if (!lengthFeet && feet) {
      lengthFeet = positiveNumber(Number(feet[2].replace(/,/g, "")));
    }
    if (!pitchCount && pitch) pitchCount = positiveNumber(Number(pitch[2]));
    if (!lengthQualifier && (meters?.[1] || feet?.[1])) {
      lengthQualifier = "approximate";
    }
    if (!pitchQualifier && pitch?.[1]) pitchQualifier = "approximate";
  }

  const omittedLegacyFacts = value && !containsOnlyStructuredFact(value)
    ? [
        {
          field: "length" as const,
          rawValue: value,
          reason:
            lengthMeters || lengthFeet || pitchCount || routeFormat
              ? "Only safely structured facts were retained; descriptive text was excluded."
              : "No reliable numeric length, pitch count, or route format could be parsed."
        }
      ]
    : [];

  return {
    lengthMeters,
    lengthFeet,
    lengthQualifier,
    pitchCount,
    pitchQualifier,
    routeFormat,
    omittedLegacyFacts
  };
}
