const API_URL = "https://api.openbeta.io";
const PAGE_SIZE = 25;
const MAX_PAGES = 12;

const BULK_AREAS_QUERY = `
  query ClimbAtlasRouteImport(
    $ancestors: [String!]!
    $limit: Int
    $offset: Int
  ) {
    bulkAreas(ancestors: $ancestors, limit: $limit, offset: $offset) {
      uuid
      area_name
      pathTokens
      climbs {
        uuid
        name
        length
        grades {
          yds
          french
          font
          vscale
          uiaa
          ewbank
          wi
        }
        type {
          trad
          sport
          bouldering
          deepwatersolo
          alpine
          snow
          ice
          mixed
          aid
          tr
        }
      }
    }
  }
`;

async function requestOpenBeta(variables) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "ClimbAtlas-RC3/1.0 (metadata POC; thz923@qq.com)"
    },
    body: JSON.stringify({ query: BULK_AREAS_QUERY, variables }),
    signal: AbortSignal.timeout(30_000)
  });

  if (!response.ok) {
    throw new Error(`OpenBeta request failed with HTTP ${response.status}.`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data?.bulkAreas ?? [];
}

function rawRoute(area, climb) {
  return {
    uuid: climb.uuid,
    name: climb.name,
    length: climb.length,
    grades: climb.grades,
    type: climb.type,
    areaUuid: area.uuid,
    areaName: area.area_name,
    pathTokens: area.pathTokens
  };
}

export const openBetaSourceAdapter = {
  sourceName: "OpenBeta",
  sourceUrl: API_URL,
  license: "CC0-1.0",

  async fetch(scope) {
    const routesById = new Map();
    let offset = 0;

    for (let page = 0; page < MAX_PAGES && routesById.size < scope.maxRoutes; page += 1) {
      const areas = await requestOpenBeta({
        ancestors: scope.ancestors,
        limit: PAGE_SIZE,
        offset
      });

      for (const area of areas) {
        for (const climb of area.climbs ?? []) {
          if (climb.uuid && !routesById.has(climb.uuid)) {
            routesById.set(climb.uuid, rawRoute(area, climb));
          }
        }
      }

      if (areas.length < PAGE_SIZE) break;
      offset += areas.length;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    const routes = Array.from(routesById.values())
      .sort(
        (first, second) =>
          first.pathTokens.join("/").localeCompare(second.pathTokens.join("/")) ||
          first.name.localeCompare(second.name) ||
          first.uuid.localeCompare(second.uuid)
      )
      .slice(0, scope.maxRoutes);

    return {
      source: "openbeta",
      sourceUrl: API_URL,
      license: "CC0-1.0",
      attribution: "OpenBeta contributors",
      fetchedAt: new Date().toISOString(),
      scope,
      routes
    };
  }
};
