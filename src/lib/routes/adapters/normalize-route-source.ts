import type {
  RouteSourcePurpose,
  RouteSourceRecord
} from "@/types/route";

type LegacyRouteSourcePurpose = RouteSourcePurpose | "route" | "area";
type RouteSourceInput = Omit<RouteSourceRecord, "purpose"> & {
  purpose?: LegacyRouteSourcePurpose;
};

const currentPurposes = new Set<RouteSourcePurpose>([
  "route-reference",
  "access",
  "destination-context",
  "history",
  "media",
  "unknown"
]);

export function classifyRouteSourcePurpose(
  source: RouteSourceInput
): RouteSourcePurpose {
  if (source.purpose && currentPurposes.has(source.purpose as RouteSourcePurpose)) {
    return source.purpose as RouteSourcePurpose;
  }
  if (source.purpose === "route") return "route-reference";
  if (source.purpose === "area") return "destination-context";

  const fields = source.verifiedFields.map((field) =>
    field.trim().toLowerCase()
  );
  const joined = fields.join(" ");

  if (/image|license|photo|media/.test(joined)) return "media";
  if (
    fields.some((field) =>
      /(?:^|\b)(?:name|grade|length|type|sector|route|first ascent)(?:\b|$)/.test(
        field
      )
    )
  ) {
    return "route-reference";
  }
  if (/access|closure|permit|regulation|conditions?/.test(joined)) {
    return source.sourceType === "official" ? "access" : "destination-context";
  }
  if (/history|historical/.test(joined)) return "history";
  if (/area|destination|local context|crag|region/.test(joined)) {
    return "destination-context";
  }
  return "unknown";
}

export function normalizeRouteSource(
  source: RouteSourceInput
): RouteSourceRecord {
  return {
    ...source,
    purpose: classifyRouteSourcePurpose(source)
  };
}
