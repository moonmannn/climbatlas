import type {
  RouteSourcePurpose,
  RouteSourceRecord
} from "@/types/route";

type LegacyRouteSourcePurpose = RouteSourcePurpose | "route" | "area";
type RouteSourceInput = Omit<RouteSourceRecord, "id" | "purpose"> & {
  id?: string;
  purpose?: LegacyRouteSourcePurpose;
};

export function canonicalizeSourceUrl(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    url.pathname = url.pathname.replace(/\/$/, "") || "/";
    return url.toString();
  } catch {
    return sourceUrl.trim();
  }
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function createRouteSourceId(
  source: Pick<
    RouteSourceInput,
    "provider" | "sourceUrl" | "externalId" | "purpose"
  >
) {
  const purpose = source.purpose === "route"
    ? "route-reference"
    : source.purpose === "area"
      ? "destination-context"
      : source.purpose ?? "unknown";
  const identity = source.externalId?.trim() || canonicalizeSourceUrl(source.sourceUrl);
  return `src-${source.provider}-${purpose}-${stableHash(identity)}`;
}

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
  const purpose = classifyRouteSourcePurpose(source);
  return {
    ...source,
    id: source.id?.trim() || createRouteSourceId({ ...source, purpose }),
    purpose
  };
}

const trustRank = { low: 0, medium: 1, high: 2 } as const;

/** Merge duplicate references to the same normalized source without changing purpose. */
export function dedupeNormalizedRouteSources(
  sources: RouteSourceRecord[]
): RouteSourceRecord[] {
  const byId = new Map<string, RouteSourceRecord>();

  for (const source of sources) {
    const current = byId.get(source.id);
    if (!current) {
      byId.set(source.id, source);
      continue;
    }

    if (
      current.provider !== source.provider ||
      current.purpose !== source.purpose ||
      canonicalizeSourceUrl(current.sourceUrl) !==
        canonicalizeSourceUrl(source.sourceUrl)
    ) {
      throw new Error(`Stable source ID collision: ${source.id}`);
    }

    const preferred =
      trustRank[source.trustLevel] > trustRank[current.trustLevel]
        ? source
        : current;
    const notes = Array.from(
      new Set([current.notes, source.notes].filter(Boolean))
    ).join(" ");

    byId.set(source.id, {
      ...current,
      attribution: current.attribution ?? source.attribution,
      checkedAt: [current.checkedAt, source.checkedAt]
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1),
      importedAt: [current.importedAt, source.importedAt]
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1),
      license: current.license ?? source.license,
      notes: notes || undefined,
      sourceType: preferred.sourceType,
      trustLevel: preferred.trustLevel,
      verifiedFields: Array.from(
        new Set([...current.verifiedFields, ...source.verifiedFields])
      )
    });
  }

  return Array.from(byId.values());
}
