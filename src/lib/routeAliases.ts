import { metadataRouteAliases } from "@/data/generatedRouteMetadata";

export function resolveRouteId(destinationSlug: string, routeId: string) {
  let currentId = routeId;
  const visited = new Set<string>();

  while (!visited.has(currentId)) {
    visited.add(currentId);
    const nextId = metadataRouteAliases[`${destinationSlug}:${currentId}`];

    if (!nextId) {
      break;
    }

    currentId = nextId;
  }

  return currentId;
}

export function routeRecordKey(destinationSlug: string, routeId: string) {
  return `${destinationSlug}::${resolveRouteId(destinationSlug, routeId)}`;
}

export function getRouteIdsForStorage(
  destinationSlug: string,
  routeId: string
) {
  const canonicalId = resolveRouteId(destinationSlug, routeId);
  const aliasIds = Object.entries(metadataRouteAliases)
    .filter(([key, targetId]) => {
      const separatorIndex = key.indexOf(":");
      return (
        key.slice(0, separatorIndex) === destinationSlug &&
        resolveRouteId(destinationSlug, targetId) === canonicalId
      );
    })
    .map(([key]) => key.slice(key.indexOf(":") + 1));

  return Array.from(new Set([canonicalId, ...aliasIds]));
}

export function getRouteAliasParams() {
  return Object.keys(metadataRouteAliases).map((key) => {
    const separatorIndex = key.indexOf(":");

    return {
      slug: key.slice(0, separatorIndex),
      routeId: key.slice(separatorIndex + 1)
    };
  });
}
