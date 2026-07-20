"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserRoutes } from "@/components/UserRoutesProvider";
import {
  getDnaDimensionLabel,
  getLocalizedDnaText
} from "@/lib/climbingDna";
import { loadDnaProfile } from "@/lib/climbingDnaStorage";
import {
  formatClimbingType,
  formatGradeSystem,
  formatSourceCount
} from "@/lib/formatters";
import { getRouteDnaMatch } from "@/lib/routes/route-dna";
import {
  buildGradeFilterSet,
  type GradeFilterGroup,
  routeMatchesGradeOption
} from "@/lib/routes/grade-filter-options";
import { compareRouteDifficulty } from "@/lib/routes/route-explorer";
import type { SavedRouteStatus } from "@/lib/supabaseClient";
import type { DnaVector } from "@/types/climbingDna";
import type { GradeSystem } from "@/types/route";
import type { RouteDifficultyBand, RouteExplorerItem } from "@/types/route-explorer";

type RouteIndexProps = {
  routes: RouteExplorerItem[];
  destinationName: string;
  destinationSlug: string;
};

type SortOption =
  | "recommended"
  | "dna-match"
  | "easy-hard"
  | "hard-easy"
  | "name";

type GradeFilterState = {
  system?: GradeSystem;
  selectedGrades: string[];
};

const pageSize = 24;
const difficultyBandOrder: RouteDifficultyBand[] = [
  "intro",
  "intermediate",
  "advanced",
  "elite",
  "unknown"
];

const bandLabels: Record<
  RouteDifficultyBand,
  { en: string; zh: string }
> = {
  intro: { en: "Intro", zh: "入门" },
  intermediate: { en: "Intermediate", zh: "进阶" },
  advanced: { en: "Advanced", zh: "高阶" },
  elite: { en: "Elite", zh: "精英" },
  unknown: { en: "Unclassified", zh: "未分类" }
};

function routeSummary(route: RouteExplorerItem, locale: "en" | "zh") {
  return route.summary?.[locale] ?? route.summary?.en;
}

function formatRouteFactSummary(
  route: RouteExplorerItem,
  locale: "en" | "zh"
) {
  const values: string[] = [];
  const number = (value: number) =>
    new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
      maximumFractionDigits: 1
    }).format(value);
  const approximateLength = route.lengthQualifier === "approximate"
    ? locale === "zh" ? "约 " : "about "
    : "";
  const lengths = [
    route.lengthMeters === undefined ? undefined : `${number(route.lengthMeters)} m`,
    route.lengthFeet === undefined ? undefined : `${number(route.lengthFeet)} ft`
  ].filter((value): value is string => Boolean(value));

  if (lengths.length > 0) values.push(`${approximateLength}${lengths.join(" / ")}`);
  if (route.pitchCount !== undefined) {
    const approximatePitch = route.pitchQualifier === "approximate"
      ? locale === "zh" ? "约 " : "about "
      : "";
    values.push(
      locale === "zh"
        ? `${approximatePitch}${number(route.pitchCount)} 段`
        : `${approximatePitch}${number(route.pitchCount)} ${route.pitchCount === 1 ? "pitch" : "pitches"}`
    );
  }
  return values;
}

function pickRank(route: RouteExplorerItem) {
  return route.isPublishedPick ? 0 : 1;
}

function routeProfileBasis(route: RouteExplorerItem, isZh: boolean) {
  if (route.dnaSnapshot.origin === "source") {
    return isZh ? "线路画像来自已引用资料" : "Route profile from cited information";
  }
  if (route.dnaSnapshot.origin === "editorial") {
    return isZh ? "ClimbAtlas 已审核线路画像" : "ClimbAtlas reviewed route profile";
  }
  return isZh ? "根据已记录的线路事实推断" : "Profile inferred from recorded route facts";
}

export function RouteIndex({
  routes,
  destinationName,
  destinationSlug
}: RouteIndexProps) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const { user } = useSupabaseAuth();
  const { getSavedStatus, savedRoutes } = useUserRoutes();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "all" | RouteDifficultyBand
  >("all");
  const [gradeFilter, setGradeFilter] = useState<GradeFilterState>({
    selectedGrades: []
  });
  const [styleFilter, setStyleFilter] = useState("all");
  const [personalFilter, setPersonalFilter] = useState<
    "all" | SavedRouteStatus
  >("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [dnaScores, setDnaScores] = useState<DnaVector | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filterToggleRef = useRef<HTMLButtonElement>(null);
  const urlFiltersInitializedRef = useRef(false);

  useEffect(() => {
    const profile = loadDnaProfile();
    if (profile) {
      setDnaScores(profile.scores);
      setSortBy((current) => current === "recommended" ? "dna-match" : current);
    }
  }, []);

  const types = useMemo(
    () => Array.from(new Set(routes.map((route) => route.climbingType))).sort(),
    [routes]
  );
  const sectors = useMemo(
    () =>
      Array.from(
        new Set(routes.map((route) => route.sectorName).filter(Boolean))
      ).sort() as string[],
    [routes]
  );
  const styles = useMemo(
    () => Array.from(new Set(routes.flatMap((route) => route.styleTags))).sort(),
    [routes]
  );
  const availableDifficultyBands = useMemo(
    () => Array.from(new Set(routes.flatMap((route) => route.difficultyBands)))
      .sort(
        (first, second) =>
          difficultyBandOrder.indexOf(first) - difficultyBandOrder.indexOf(second)
      ),
    [routes]
  );
  const gradeFilterSet = useMemo(() => buildGradeFilterSet(routes), [routes]);
  const primaryGradeSystem = gradeFilterSet.primarySystem;
  const activeGradeSystem = gradeFilter.system ?? primaryGradeSystem;
  const activeGradeGroup = gradeFilterSet.groups.find(
    (group) => group.system === activeGradeSystem
  );
  const selectedGradeOptions = useMemo(
    () =>
      (activeGradeGroup?.options ?? []).filter((option) =>
        gradeFilter.selectedGrades.includes(option.value)
      ),
    [activeGradeGroup, gradeFilter.selectedGrades]
  );

  useEffect(() => {
    function restoreFiltersFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const requestedType = params.get("type");
      setTypeFilter(
        requestedType && types.some((type) => type === requestedType)
          ? requestedType
          : "all"
      );

      const requestedSystem = params.get("gradeSystem") as GradeSystem | null;
      const group = gradeFilterSet.groups.find(
        (candidate) => candidate.system === requestedSystem
      );
      const requestedGrades = (params.get("grades") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      const validGrades = new Set(group?.options.map((option) => option.value));
      const selectedGrades = (group?.options ?? [])
        .map((option) => option.value)
        .filter(
          (grade) =>
            requestedGrades.includes(grade) && validGrades.has(grade)
        );
      setGradeFilter({
        system: group?.system ?? primaryGradeSystem,
        selectedGrades
      });
    }

    restoreFiltersFromUrl();
    urlFiltersInitializedRef.current = true;
    window.addEventListener("popstate", restoreFiltersFromUrl);
    return () => window.removeEventListener("popstate", restoreFiltersFromUrl);
  }, [gradeFilterSet.groups, primaryGradeSystem, types]);
  const dnaMatches = useMemo(
    () =>
      new Map(
        dnaScores
          ? routes.map((route) => [
              route.id,
              getRouteDnaMatch(dnaScores, route.dnaSnapshot)
            ] as const)
          : []
      ),
    [dnaScores, routes]
  );

  const filteredRoutes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = routes.filter((route) => {
      const personalStatus = getSavedStatus(destinationSlug, route.id);
      const searchable = [
        route.name,
        route.grade,
        route.gradeDisplay,
        route.climbingType,
        route.sectorName ?? "",
        ...route.styleTags,
        routeSummary(route, locale) ?? ""
      ]
        .join(" ")
        .toLowerCase();

      return (
        (typeFilter === "all" || route.climbingType === typeFilter) &&
        (difficultyFilter === "all" ||
          route.difficultyBands.includes(difficultyFilter)) &&
        (selectedGradeOptions.length === 0 ||
          selectedGradeOptions.some((grade) =>
            routeMatchesGradeOption(route, grade)
          )) &&
        (styleFilter === "all" || route.styleTags.includes(styleFilter)) &&
        (sectorFilter === "all" || route.sectorName === sectorFilter) &&
        (personalFilter === "all" || personalStatus === personalFilter) &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });

    return filtered.sort((first, second) => {
      switch (sortBy) {
        case "dna-match":
          return (
            (dnaMatches.get(second.id)?.score ?? -1) -
              (dnaMatches.get(first.id)?.score ?? -1) ||
            pickRank(first) - pickRank(second) ||
            compareRouteDifficulty(first, second)
          );
        case "easy-hard":
          return compareRouteDifficulty(first, second);
        case "hard-easy":
          if (first.difficultyBand === "unknown") return 1;
          if (second.difficultyBand === "unknown") return -1;
          return compareRouteDifficulty(second, first);
        case "name":
          return first.name.localeCompare(second.name);
        default:
          return (
            pickRank(first) - pickRank(second) ||
            compareRouteDifficulty(first, second)
          );
      }
    });
  }, [
    destinationSlug,
    dnaMatches,
    difficultyFilter,
    getSavedStatus,
    gradeFilter.selectedGrades,
    locale,
    personalFilter,
    query,
    routes,
    selectedGradeOptions,
    sectorFilter,
    sortBy,
    styleFilter,
    typeFilter
  ]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [
    difficultyFilter,
    gradeFilter.selectedGrades,
    personalFilter,
    query,
    sectorFilter,
    sortBy,
    styleFilter,
    typeFilter
  ]);

  const visibleRoutes = filteredRoutes.slice(0, visibleCount);
  const personalRoutes = savedRoutes.filter(
    (record) => record.destination_slug === destinationSlug
  );
  const activeFilterCount = [
    query.trim() ? query : "",
    typeFilter !== "all" ? typeFilter : "",
    difficultyFilter !== "all" ? difficultyFilter : "",
    gradeFilter.selectedGrades.length > 0 ? gradeFilter.selectedGrades : "",
    styleFilter !== "all" ? styleFilter : "",
    sectorFilter !== "all" ? sectorFilter : "",
    personalFilter !== "all" ? personalFilter : ""
  ].filter(Boolean).length;

  function clearFilters() {
    setQuery("");
    setTypeFilter("all");
    setDifficultyFilter("all");
    const nextGradeFilter = {
      system: primaryGradeSystem,
      selectedGrades: []
    };
    setGradeFilter(nextGradeFilter);
    setStyleFilter("all");
    setPersonalFilter("all");
    setSectorFilter("all");
    setSortBy(dnaScores ? "dna-match" : "recommended");
    writeRouteFilterUrl("all", nextGradeFilter);
  }

  function writeRouteFilterUrl(
    nextType: string,
    nextGradeFilter: GradeFilterState
  ) {
    if (!urlFiltersInitializedRef.current) return;
    const url = new URL(window.location.href);
    if (nextType === "all") url.searchParams.delete("type");
    else url.searchParams.set("type", nextType);

    const gradeGroup = gradeFilterSet.groups.find(
      (group) => group.system === nextGradeFilter.system
    );
    const selectedGradeSet = new Set(nextGradeFilter.selectedGrades);
    const sortedGrades = (gradeGroup?.options ?? [])
      .map((option) => option.value)
      .filter((grade) => selectedGradeSet.has(grade));

    const shouldPersistGradeSystem =
      nextGradeFilter.system !== primaryGradeSystem || sortedGrades.length > 0;

    if (nextGradeFilter.system && shouldPersistGradeSystem) {
      url.searchParams.set("gradeSystem", nextGradeFilter.system);
      if (sortedGrades.length > 0) {
        url.searchParams.set("grades", sortedGrades.join(","));
      } else {
        url.searchParams.delete("grades");
      }
    } else {
      url.searchParams.delete("gradeSystem");
      url.searchParams.delete("grades");
    }
    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function updateTypeFilter(value: string) {
    setTypeFilter(value);
    writeRouteFilterUrl(value, gradeFilter);
  }

  function updateGradeSystem(system: GradeSystem) {
    const nextGradeFilter = { system, selectedGrades: [] };
    setGradeFilter(nextGradeFilter);
    writeRouteFilterUrl(typeFilter, nextGradeFilter);
  }

  function toggleGrade(value: string) {
    const unsortedGrades = gradeFilter.selectedGrades.includes(value)
      ? gradeFilter.selectedGrades.filter((grade) => grade !== value)
      : [...gradeFilter.selectedGrades, value];
    const selectedGradeSet = new Set(unsortedGrades);
    const selectedGrades = (activeGradeGroup?.options ?? [])
      .map((option) => option.value)
      .filter((grade) => selectedGradeSet.has(grade));
    const nextGradeFilter = {
      system: activeGradeSystem,
      selectedGrades
    };
    setGradeFilter(nextGradeFilter);
    writeRouteFilterUrl(typeFilter, nextGradeFilter);
  }

  function toggleGradeFamily(values: string[]) {
    const allSelected = values.every((value) =>
      gradeFilter.selectedGrades.includes(value)
    );
    const unsortedGrades = allSelected
      ? gradeFilter.selectedGrades.filter((value) => !values.includes(value))
      : Array.from(new Set([...gradeFilter.selectedGrades, ...values]));
    const selectedGradeSet = new Set(unsortedGrades);
    const selectedGrades = (activeGradeGroup?.options ?? [])
      .map((option) => option.value)
      .filter((grade) => selectedGradeSet.has(grade));
    const nextGradeFilter = {
      system: activeGradeSystem,
      selectedGrades
    };
    setGradeFilter(nextGradeFilter);
    writeRouteFilterUrl(typeFilter, nextGradeFilter);
  }

  function openFilters() {
    setIsFiltersOpen(true);
    requestAnimationFrame(() => {
      document.getElementById("route-explorer-search")?.focus();
    });
  }

  function closeFilters() {
    setIsFiltersOpen(false);
    requestAnimationFrame(() => filterToggleRef.current?.focus());
  }

  return (
    <section className="route-explorer border-y border-brandforest/15 py-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="editorial-kicker text-terracotta">
            {isZh ? "路线探索器" : "Route explorer"}
          </p>
          <h3 className="display-serif mt-2 text-4xl font-medium text-brandforest sm:text-5xl">
            {destinationName}
          </h3>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-charcoal/62">
            <span>{routes.length} {isZh ? "条路线" : "routes"}</span>
            {user && (
              <span>{personalRoutes.length} {isZh ? "条个人记录" : "personal saves"}</span>
            )}
          </div>
          {dnaScores ? (
              <p className="mt-4 inline-flex border-l-2 border-terracotta pl-3 text-sm font-semibold text-brandforest">
                {isZh
                  ? "已按你的 Climbing DNA 偏好匹配优先排列。分数只代表偏好，不代表能力或安全判断。"
                  : "Prioritized by your Climbing DNA preference match. Scores describe preference, not ability or safety."}
              </p>
            ) : (
              <Link className="text-link mt-4 inline-flex" href="/climbing-dna">
                {isZh ? "完成 DNA 测试，个性化路线顺序" : "Take the DNA quiz to personalize route order"} →
              </Link>
            )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <strong aria-live="polite" className="text-sm text-brandforest">
            {filteredRoutes.length} {isZh ? "条结果" : "results"}
          </strong>
          <button
            className="border border-brandforest/20 px-3 py-2 text-xs font-semibold text-brandforest transition hover:border-brandforest/45 hover:bg-brandforest/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            onClick={clearFilters}
            type="button"
          >
            {isZh ? "清除筛选" : "Clear filters"}
          </button>
        </div>
      </div>

      <button
        aria-controls="route-explorer-filters"
        aria-expanded={isFiltersOpen}
        className="mt-7 flex w-full items-center justify-between border-y border-brandforest/15 py-4 text-left text-sm font-semibold text-brandforest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-inset md:hidden"
        onClick={() => (isFiltersOpen ? closeFilters() : openFilters())}
        ref={filterToggleRef}
        type="button"
      >
        <span>
          {isZh ? "筛选与排序" : "Filters and sort"}
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-terracotta px-2 py-0.5 text-xs text-cream">
              {activeFilterCount}
            </span>
          )}
        </span>
        <span aria-hidden="true" className="text-lg leading-none">
          {isFiltersOpen ? "−" : "+"}
        </span>
      </button>

      <div
        className={`gap-3 border-b border-brandforest/12 py-5 sm:grid-cols-2 md:mt-7 md:grid md:border-y lg:grid-cols-4 ${
          isFiltersOpen ? "grid" : "hidden"
        }`}
        id="route-explorer-filters"
      >
        <label className="sm:col-span-2" htmlFor="route-explorer-search">
          <span className="route-filter-label">{isZh ? "搜索" : "Search"}</span>
          <input
            aria-label={isZh ? "搜索" : "Search"}
            className="route-filter-control"
            id="route-explorer-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isZh ? "路线名、等级或区域" : "Route, grade, or sector"}
            value={query}
          />
        </label>
        <FilterSelect
          id="route-explorer-type"
          label={isZh ? "类型" : "Type"}
          onChange={updateTypeFilter}
          value={typeFilter}
        >
          <option value="all">{isZh ? "全部类型" : "All types"}</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {formatClimbingType(type, locale)}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          id="route-explorer-sort"
          label={isZh ? "排序" : "Sort"}
          onChange={(value) => setSortBy(value as SortOption)}
          value={sortBy}
        >
          {dnaScores && (
            <option value="dna-match">{isZh ? "最高 DNA 偏好匹配" : "Best DNA preference match"}</option>
          )}
          <option value="recommended">{isZh ? "默认顺序" : "Browse order"}</option>
          <option value="easy-hard">{isZh ? "难度：易到难" : "Difficulty: easy to hard"}</option>
          <option value="hard-easy">{isZh ? "难度：难到易" : "Difficulty: hard to easy"}</option>
          <option value="name">{isZh ? "按名称" : "Name"}</option>
        </FilterSelect>
        {availableDifficultyBands.length > 0 && (
          <FilterSelect
            id="route-explorer-difficulty"
            label={isZh ? "难度分组" : "Difficulty band"}
            onChange={(value) =>
              setDifficultyFilter(value as "all" | RouteDifficultyBand)
            }
            value={difficultyFilter}
          >
            <option value="all">{isZh ? "全部难度" : "All difficulty bands"}</option>
            {availableDifficultyBands.map((band) => (
              <option key={band} value={band}>{bandLabels[band][locale]}</option>
            ))}
          </FilterSelect>
        )}
        {gradeFilterSet.groups.length > 0 && activeGradeGroup && (
          <GradeFilterControls
            activeGroup={activeGradeGroup}
            groups={gradeFilterSet.groups}
            isZh={isZh}
            locale={locale}
            onGradeFamilyToggle={toggleGradeFamily}
            onGradeSystemChange={updateGradeSystem}
            onGradeToggle={toggleGrade}
            selectedGrades={gradeFilter.selectedGrades}
          />
        )}
        {sectors.length > 0 && (
          <FilterSelect
            id="route-explorer-sector"
            label={isZh ? "区域" : "Sector"}
            onChange={setSectorFilter}
            value={sectorFilter}
          >
            <option value="all">{isZh ? "全部区域" : "All sectors"}</option>
            {sectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
          </FilterSelect>
        )}
        {styles.length > 0 && (
          <FilterSelect
            id="route-explorer-style"
            label={isZh ? "风格" : "Style"}
            onChange={setStyleFilter}
            value={styleFilter}
          >
            <option value="all">{isZh ? "全部风格" : "All styles"}</option>
            {styles.map((style) => <option key={style} value={style}>{style}</option>)}
          </FilterSelect>
        )}
        {user && (
          <FilterSelect
            id="route-explorer-personal"
            label={isZh ? "个人路线本" : "My atlas"}
            onChange={(value) =>
              setPersonalFilter(value as "all" | SavedRouteStatus)
            }
            value={personalFilter}
          >
            <option value="all">{isZh ? "全部个人状态" : "All personal statuses"}</option>
            <option value="want-to-climb">{isZh ? "只看想爬" : "Want to climb"}</option>
            <option value="climbed">{isZh ? "只看已爬" : "Climbed"}</option>
          </FilterSelect>
        )}
        <button
          className="sm:col-span-2 border border-brandforest/20 px-3 py-3 text-sm font-semibold text-brandforest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta md:hidden"
          onClick={closeFilters}
          type="button"
        >
          {isZh ? "关闭筛选" : "Close filters"}
        </button>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden border border-brandforest/15 bg-brandforest/15 md:grid-cols-2 xl:grid-cols-3">
        {visibleRoutes.map((route) => {
          const savedStatus = getSavedStatus(destinationSlug, route.id);
          const dnaMatch = dnaMatches.get(route.id);
          return (
            <Link
              className="group min-h-60 bg-cream p-5 transition-colors hover:bg-white focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta"
              href={`/destinations/${destinationSlug}/routes/${route.id}`}
              key={route.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="route-result-badge bg-brandforest text-cream">
                    {route.grade || (isZh ? "等级未知" : "grade unknown")}
                  </span>
                  <span className="route-result-badge border border-brandforest/15 text-brandforest">
                    {formatClimbingType(route.climbingType, locale)}
                  </span>
                </div>
              </div>

              <h4 className="display-serif mt-5 text-2xl font-medium leading-tight text-brandforest group-hover:text-terracotta">
                {route.name}
              </h4>
              {routeSummary(route, locale) && (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-charcoal/62">
                  {routeSummary(route, locale)}
                </p>
              )}

              <p className="mt-3 text-xs font-semibold text-charcoal/52">
                {[
                  route.gradeDisplay,
                  formatClimbingType(route.climbingType, locale),
                  ...formatRouteFactSummary(route, locale)
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>

              {dnaMatch && (
                <div className="mt-4 border-t border-brandforest/10 pt-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <strong className="text-sm text-terracotta">
                      {dnaMatch.score}% {isZh ? "DNA 偏好匹配" : "DNA preference match"}
                    </strong>
                    <span className="text-xs font-semibold text-charcoal/48">
                      {isZh ? "偏好契合点" : "Aligned preferences"}: {dnaMatch.alignedDimensions
                        .map((dimension) => getDnaDimensionLabel(dimension, locale))
                        .join(" · ")}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-charcoal/52">
                    {getLocalizedDnaText(dnaMatch.reasons[0], locale)}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-charcoal/42">
                    {routeProfileBasis(route, isZh)}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-charcoal/52">
                {route.isPublishedPick && (
                  <span>{isZh ? "ClimbAtlas 精选" : "ClimbAtlas pick"}</span>
                )}
                {route.sourceCount > 0 && (
                  <span>{formatSourceCount(route.sourceCount, locale)}</span>
                )}
                {route.sectorName && <span>{route.sectorName}</span>}
                {savedStatus && (
                  <span className="text-terracotta">
                    {savedStatus === "climbed"
                      ? isZh ? "已爬" : "climbed"
                      : isZh ? "想爬" : "want to climb"}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="border-b border-brandforest/15 py-12 text-center">
          <p className="display-serif text-2xl text-brandforest">
            {isZh ? "没有找到匹配路线" : "No routes match this view"}
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-charcoal/58">
            {isZh
              ? "可以扩大难度或等级范围，也可以清除筛选后重新选择。"
              : "Try a broader difficulty or grade range, or clear the filters and start again."}
          </p>
          <button
            className="text-link mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            onClick={clearFilters}
            type="button"
          >
            {isZh ? "清除筛选" : "Clear filters"}
          </button>
        </div>
      )}

      {visibleRoutes.length < filteredRoutes.length && (
        <div className="mt-7 flex justify-center">
          <button
            className="border border-brandforest bg-brandforest px-5 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            onClick={() => setVisibleCount((count) => count + pageSize)}
            type="button"
          >
            {isZh
              ? `再显示 ${Math.min(pageSize, filteredRoutes.length - visibleRoutes.length)} 条`
              : `Show ${Math.min(pageSize, filteredRoutes.length - visibleRoutes.length)} more`}
          </button>
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  children,
  id,
  label,
  onChange,
  value
}: {
  children: React.ReactNode;
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label htmlFor={id}>
      <span className="route-filter-label">{label}</span>
      <select
        aria-label={label}
        className="route-filter-control"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function GradeFilterControls({
  activeGroup,
  groups,
  isZh,
  locale,
  onGradeFamilyToggle,
  onGradeSystemChange,
  onGradeToggle,
  selectedGrades
}: {
  activeGroup: GradeFilterGroup;
  groups: GradeFilterGroup[];
  isZh: boolean;
  locale: "en" | "zh";
  onGradeFamilyToggle: (values: string[]) => void;
  onGradeSystemChange: (system: GradeSystem) => void;
  onGradeToggle: (value: string) => void;
  selectedGrades: string[];
}) {
  const families = buildGradeFamilies(activeGroup);

  return (
    <div className="sm:col-span-2 lg:col-span-4">
      <fieldset>
        <legend className="route-filter-label">
          {isZh ? "难度体系" : "Grade system"}
        </legend>
        <ul className="mt-2 flex list-none flex-wrap gap-2 p-0">
          {groups.map((group) => {
            const inputId = `grade-system-${group.system}`;
            return (
              <li key={group.system}>
                <label
                  className={`cursor-pointer border px-3 py-2 text-xs font-semibold transition ${
                    group.system === activeGroup.system
                      ? "border-brandforest bg-brandforest text-cream"
                      : "border-brandforest/20 text-brandforest hover:border-brandforest/45"
                  }`}
                  htmlFor={inputId}
                >
                  <input
                    aria-label={`${formatGradeSystem(group.system, locale)}, ${group.routeCount} ${isZh ? "条路线" : "routes"}`}
                    checked={group.system === activeGroup.system}
                    className="sr-only"
                    id={inputId}
                    name="route-grade-system"
                    onChange={() => onGradeSystemChange(group.system)}
                    type="radio"
                    value={group.system}
                  />
                  <span aria-hidden="true">
                    {formatGradeSystem(group.system, locale)} ({group.routeCount})
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="mt-4 border-t border-brandforest/10 pt-4">
        <legend className="route-filter-label">
          {isZh
            ? `选择等级 · ${formatGradeSystem(activeGroup.system, locale)}`
            : `Choose grades · ${formatGradeSystem(activeGroup.system, locale)}`}
        </legend>
        {families.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" aria-label={isZh ? "快速选择等级组" : "Grade family shortcuts"}>
            {families.map((family) => {
              const allSelected = family.values.every((value) =>
                selectedGrades.includes(value)
              );
              return (
                <button
                  aria-pressed={allSelected}
                  className={`border px-3 py-1.5 text-xs font-semibold ${
                    allSelected
                      ? "border-terracotta bg-terracotta text-cream"
                      : "border-terracotta/30 text-terracotta"
                  }`}
                  key={family.label}
                  onClick={() => onGradeFamilyToggle(family.values)}
                  type="button"
                >
                  {family.label} {isZh ? "全部" : "all"}
                </button>
              );
            })}
          </div>
        )}
        <ul
          className="mt-3 flex list-none flex-wrap gap-2 p-0"
          data-grade-option-list={activeGroup.system}
        >
          {activeGroup.options.map((grade, index) => {
            const checked = selectedGrades.includes(grade.value);
            const inputId = `route-grade-${activeGroup.system}-${index}`;
            const accessibleName = `${grade.label}, ${formatGradeSystem(grade.system, locale)}`;
            return (
              <li
                data-grade-option={grade.value}
                key={`${grade.system}-${grade.min}-${grade.max}-${grade.label}`}
              >
                <label
                  className={`cursor-pointer border px-3 py-2 text-xs font-semibold transition ${
                    checked
                      ? "border-brandforest bg-brandforest text-cream"
                      : "border-brandforest/20 text-brandforest hover:border-brandforest/45"
                  }`}
                  htmlFor={inputId}
                >
                  <input
                    aria-label={accessibleName}
                    checked={checked}
                    className="sr-only"
                    id={inputId}
                    onChange={() => onGradeToggle(grade.value)}
                    type="checkbox"
                    value={grade.value}
                  />
                  <span aria-hidden="true">{grade.label}</span>
                </label>
                {index < activeGroup.options.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="sr-only"
                    data-grade-separator="true"
                  >
                    ;{" "}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

function buildGradeFamilies(group: GradeFilterGroup) {
  if (group.system !== "yds") return [];
  const families = new Map<string, string[]>();
  for (const option of group.options) {
    const family = option.label.match(/^(5\.\d{1,2})/)?.[1];
    if (!family) continue;
    const values = families.get(family) ?? [];
    values.push(option.value);
    families.set(family, values);
  }
  return Array.from(families, ([label, values]) => ({ label, values })).filter(
    (family) => family.values.length > 1
  );
}
