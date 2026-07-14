import type { RouteRecord } from "@/types/route";

export type DuplicateConfidence = "high" | "medium" | "low";

export type DuplicateRouteSummary = {
  destinationId: string;
  id: string;
  name: string;
  grade: string;
  sectorName?: string;
};

export type RouteDuplicateCandidate = {
  confidence: DuplicateConfidence;
  score: number;
  reasons: string[];
  first: DuplicateRouteSummary;
  second: DuplicateRouteSummary;
};

export function normalizeRouteName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function normalizeLooseRouteName(name: string) {
  return normalizeRouteName(name)
    .replace(/\b(?:route|route line|line)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGrade(grade: string) {
  return grade
    .replace(/\bmetadata\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function routeSpecificUrls(route: RouteRecord) {
  return new Set(
    route.externalResources
      .filter((resource) => resource.linkStatus === "route-specific")
      .map((resource) => resource.url.toLowerCase())
  );
}

function externalIds(route: RouteRecord) {
  return new Set(
    route.sourceRecords
      .filter((source) => source.externalId)
      .map((source) => `${source.provider}:${source.externalId}`)
  );
}

function intersects(first: ReadonlySet<string>, second: ReadonlySet<string>) {
  return Array.from(first).some((value) => second.has(value));
}

function summarize(route: RouteRecord): DuplicateRouteSummary {
  return {
    destinationId: route.destinationId,
    id: route.id,
    name: route.name,
    grade: route.grade.original,
    sectorName: route.sectorName
  };
}

function compareRoutes(
  first: RouteRecord,
  second: RouteRecord
): RouteDuplicateCandidate | undefined {
  const reasons: string[] = [];
  let score = 0;
  const firstName = normalizeRouteName(first.name);
  const secondName = normalizeRouteName(second.name);
  const firstLooseName = normalizeLooseRouteName(first.name);
  const secondLooseName = normalizeLooseRouteName(second.name);
  const exactExternalId = intersects(externalIds(first), externalIds(second));
  const exactRouteUrl = intersects(routeSpecificUrls(first), routeSpecificUrls(second));

  if (exactExternalId) {
    score += 100;
    reasons.push("same external source ID");
  }

  if (exactRouteUrl) {
    score += 90;
    reasons.push("same exact route URL");
  }

  if (firstName === secondName) {
    score += 80;
    reasons.push("same normalized name");
  } else if (firstLooseName && firstLooseName === secondLooseName) {
    score += 65;
    reasons.push("same name after removing generic route/line suffixes");
  }

  const firstGrade = normalizeGrade(first.grade.original);
  const secondGrade = normalizeGrade(second.grade.original);
  if (firstGrade && firstGrade === secondGrade) {
    score += 10;
    reasons.push("same normalized grade");
  }

  if (
    first.sectorName &&
    second.sectorName &&
    normalizeRouteName(first.sectorName) === normalizeRouteName(second.sectorName)
  ) {
    score += 10;
    reasons.push("same sector");
  }

  // A name resemblance alone is intentionally insufficient for automatic action.
  if (score < 65 || (!exactExternalId && !exactRouteUrl && firstLooseName !== secondLooseName)) {
    return undefined;
  }

  return {
    confidence: score >= 100 ? "high" : score >= 75 ? "medium" : "low",
    score,
    reasons,
    first: summarize(first),
    second: summarize(second)
  };
}

export function findPotentialRouteDuplicates(routes: RouteRecord[]) {
  const byDestination = new Map<string, RouteRecord[]>();

  for (const route of routes) {
    const destinationRoutes = byDestination.get(route.destinationId) ?? [];
    destinationRoutes.push(route);
    byDestination.set(route.destinationId, destinationRoutes);
  }

  const candidates: RouteDuplicateCandidate[] = [];

  for (const destinationRoutes of Array.from(byDestination.values())) {
    for (let firstIndex = 0; firstIndex < destinationRoutes.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < destinationRoutes.length;
        secondIndex += 1
      ) {
        const candidate = compareRoutes(
          destinationRoutes[firstIndex],
          destinationRoutes[secondIndex]
        );
        if (candidate) candidates.push(candidate);
      }
    }
  }

  return candidates.sort(
    (first, second) =>
      second.score - first.score ||
      first.first.destinationId.localeCompare(second.first.destinationId) ||
      first.first.name.localeCompare(second.first.name)
  );
}
