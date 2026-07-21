import type { RouteExperienceOverlay } from "@/data/route-experiences/types";
import { dedupeNormalizedRouteSources } from "@/lib/routes/adapters/normalize-route-source";
import type { RouteMediaRecord, RouteRecord, RouteSourceRecord } from "@/types/route";

function mergeSources(
  existing: RouteSourceRecord[],
  additions: RouteSourceRecord[]
) {
  return dedupeNormalizedRouteSources([...existing, ...additions]);
}

function mediaKey(media: RouteMediaRecord) {
  return `${media.kind}:${media.sourceUrl}:${media.src}`;
}

function mergeMedia(
  existing: RouteMediaRecord[] | undefined,
  additions: RouteMediaRecord[] | undefined
) {
  const media = new Map(
    (existing ?? []).map((item) => [mediaKey(item), item])
  );
  for (const item of additions ?? []) media.set(mediaKey(item), item);
  return Array.from(media.values());
}

export function applyRouteExperience(
  route: RouteRecord,
  overlay: RouteExperienceOverlay | undefined
): RouteRecord {
  if (!overlay) return route;
  if (
    overlay.destinationSlug !== route.destinationId ||
    overlay.routeId !== route.id
  ) {
    throw new Error(
      `Route experience overlay does not match ${route.destinationId}:${route.id}.`
    );
  }

  return {
    ...route,
    editorial: {
      ...route.editorial,
      ...overlay.editorial,
      tier: "pick",
      status: "published"
    },
    experience: overlay.experience,
    style: {
      ...route.style,
      wallAngle: overlay.experience.character.wallAngle.value,
      terrainTags: overlay.experience.character.terrain.value,
      movementTags: overlay.experience.character.movementTendency.value,
      physicalTags: Array.from(
        new Set(
          overlay.experience.character.movementTendency.value.flatMap((tag) => {
            if (tag === "powerful") return ["power" as const];
            if (tag === "endurance") return ["endurance" as const];
            return [];
          })
        )
      )
    },
    sourceRecords: mergeSources(route.sourceRecords, overlay.sources),
    media: mergeMedia(route.media, overlay.media)
  };
}
