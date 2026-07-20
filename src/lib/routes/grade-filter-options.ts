import type { GradeSystem } from "@/types/route";
import type { RouteExplorerItem } from "@/types/route-explorer";

export type GradeFilterOption = {
  value: string;
  label: string;
  system: GradeSystem;
  min: number;
  max: number;
};

export type GradeFilterSet = {
  primarySystem?: GradeSystem;
  options: GradeFilterOption[];
  groups: GradeFilterGroup[];
};

export type GradeFilterGroup = {
  system: GradeSystem;
  options: GradeFilterOption[];
  routeCount: number;
};

export type DifficultySystemSummary = {
  system: GradeSystem;
  minLabel: string;
  maxLabel: string;
  routeCount: number;
};

const excludedComparableSystems = new Set<GradeSystem>(["unknown", "mixed"]);

export function buildGradeFilterSet(routes: RouteExplorerItem[]): GradeFilterSet {
  const counts = new Map<GradeSystem, number>();
  for (const route of routes) {
    if (!isComparableRoute(route)) continue;
    counts.set(route.gradeSystem, (counts.get(route.gradeSystem) ?? 0) + 1);
  }

  const primarySystem = Array.from(counts.entries()).sort(
    ([firstSystem, firstCount], [secondSystem, secondCount]) =>
      secondCount - firstCount || firstSystem.localeCompare(secondSystem)
  )[0]?.[0];

  const groups = Array.from(counts.entries())
    .map(([system, routeCount]) => ({
      system,
      options: buildOptionsForSystem(routes, system),
      routeCount
    }))
    .filter((group) => group.options.length > 0)
    .sort(
      (first, second) =>
        second.routeCount - first.routeCount ||
        first.system.localeCompare(second.system)
    );

  if (!primarySystem) return { options: [], groups: [] };

  return {
    primarySystem,
    options: buildOptionsForSystem(routes, primarySystem),
    groups
  };
}

export function buildDifficultySystemSummaries(
  routes: RouteExplorerItem[]
): DifficultySystemSummary[] {
  const systems = Array.from(
    new Set(routes.filter(isComparableRoute).map((route) => route.gradeSystem))
  );

  return systems
    .map((system) => {
      const systemRoutes = routes.filter(
        (route) => isComparableRoute(route) && route.gradeSystem === system
      );
      const options = buildOptionsForSystem(systemRoutes, system);
      if (options.length === 0) return undefined;
      const first = options[0];
      const last = options.reduce((current, option) =>
        option.max > current.max ? option : current
      );

      return {
        system,
        minLabel: boundaryLabel(first.label, "min", system),
        maxLabel: boundaryLabel(last.label, "max", system),
        routeCount: systemRoutes.length
      };
    })
    .filter((summary): summary is DifficultySystemSummary => Boolean(summary))
    .sort((first, second) => second.routeCount - first.routeCount);
}

export function routeMatchesGradeOption(
  route: RouteExplorerItem,
  option: GradeFilterOption
) {
  if (
    route.gradeSystem !== option.system ||
    route.gradeRangeMin === undefined ||
    route.gradeRangeMax === undefined
  ) {
    return false;
  }

  return (
    Math.min(route.gradeRangeMin, route.gradeRangeMax) <= option.max &&
    Math.max(route.gradeRangeMin, route.gradeRangeMax) >= option.min
  );
}

function isComparableRoute(route: RouteExplorerItem) {
  return (
    route.gradeRangeMin !== undefined &&
    route.gradeRangeMax !== undefined &&
    !excludedComparableSystems.has(route.gradeSystem)
  );
}

function buildOptionsForSystem(
  routes: RouteExplorerItem[],
  system: GradeSystem
) {
  const options = new Map<string, GradeFilterOption>();
  for (const route of routes) {
    if (!isComparableRoute(route) || route.gradeSystem !== system) continue;
    const optionKey = `${system}:${route.gradeRangeMin}:${route.gradeRangeMax}`;
    if (!options.has(optionKey)) {
      options.set(optionKey, {
        value: route.gradeDisplay,
        label: route.gradeDisplay,
        system,
        min: route.gradeRangeMin!,
        max: route.gradeRangeMax!
      });
    }
  }

  return Array.from(options.values()).sort(
    (first, second) =>
      first.min - second.min ||
      first.max - second.max ||
      first.label.localeCompare(second.label)
  );
}

function boundaryLabel(
  display: string,
  boundary: "min" | "max",
  system: GradeSystem
) {
  const separatorRange = display.match(/^(.+?)\s*[-–]\s*(.+)$/);
  if (separatorRange) return separatorRange[boundary === "min" ? 1 : 2].trim();

  if (system === "yds") {
    const letterRange = display.match(/^(5\.\d{1,2})([abcd])\s*\/\s*([abcd])$/i);
    if (letterRange) {
      return `${letterRange[1]}${letterRange[boundary === "min" ? 2 : 3]}`;
    }
  }

  return display;
}
