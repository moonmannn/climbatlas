"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserRoutes } from "@/components/UserRoutesProvider";
import {
  getDnaDimensionLabel,
  getLocalizedDnaText
} from "@/lib/climbingDna";
import { loadDnaProfile } from "@/lib/climbingDnaStorage";
import { getRouteDnaMatch } from "@/lib/routes/route-dna";
import { gradeRangesOverlap } from "@/lib/routes/parse-route-grade";
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

const gradeSystemLabels: Partial<Record<GradeSystem, string>> = {
  yds: "YDS",
  french: "French",
  font: "Font",
  "v-scale": "V-scale",
  uiaa: "UIAA",
  australian: "Australian",
  alpine: "Alpine",
  aid: "Aid",
  ice: "Ice",
  mixed: "Mixed"
};

type GradeFilterOption = {
  value: string;
  label: string;
  system: GradeSystem;
  min: number;
  max: number;
};

function routeSummary(route: RouteExplorerItem, locale: "en" | "zh") {
  return (
    route.summary?.[locale] ??
    route.summary?.en ??
    (locale === "zh"
      ? "查看难度、类型、区域、来源和外部线路资料。"
      : "View grade, type, sector, sources, and external route resources.")
  );
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
  const [gradeFilter, setGradeFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [personalFilter, setPersonalFilter] = useState<
    "all" | SavedRouteStatus
  >("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [dnaScores, setDnaScores] = useState<DnaVector | null>(null);
  const [dnaLoaded, setDnaLoaded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const profile = loadDnaProfile();
    if (profile) {
      setDnaScores(profile.scores);
      setSortBy((current) => current === "recommended" ? "dna-match" : current);
    }
    setDnaLoaded(true);
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
  const primaryGradeSystem = useMemo(() => {
    const counts = new Map<GradeSystem, number>();
    for (const route of routes) {
      if (
        route.gradeRangeMin === undefined ||
        route.gradeRangeMax === undefined ||
        ["unknown", "mixed"].includes(route.gradeSystem)
      ) continue;
      counts.set(route.gradeSystem, (counts.get(route.gradeSystem) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort(
        ([firstSystem, firstCount], [secondSystem, secondCount]) =>
          secondCount - firstCount || firstSystem.localeCompare(secondSystem)
      )[0]?.[0];
  }, [routes]);
  const gradeOptions = useMemo(() => {
    if (!primaryGradeSystem) return [];
    const options = new Map<string, GradeFilterOption>();
    for (const route of routes) {
      if (
        route.gradeSystem !== primaryGradeSystem ||
        route.gradeRangeMin === undefined ||
        route.gradeRangeMax === undefined
      ) continue;
      const value = `${primaryGradeSystem}:${route.gradeRangeMin}:${route.gradeRangeMax}`;
      if (!options.has(value)) {
        options.set(value, {
          value,
          label: route.gradeDisplay,
          system: primaryGradeSystem,
          min: route.gradeRangeMin,
          max: route.gradeRangeMax
        });
      }
    }
    return Array.from(options.values()).sort(
      (first, second) =>
        first.min - second.min || first.max - second.max || first.label.localeCompare(second.label)
    );
  }, [primaryGradeSystem, routes]);
  const selectedGrade = useMemo(
    () => gradeOptions.find((option) => option.value === gradeFilter),
    [gradeFilter, gradeOptions]
  );
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
        routeSummary(route, locale)
      ]
        .join(" ")
        .toLowerCase();

      return (
        (typeFilter === "all" || route.climbingType === typeFilter) &&
        (difficultyFilter === "all" ||
          route.difficultyBands.includes(difficultyFilter)) &&
        (gradeFilter === "all" || Boolean(
          selectedGrade &&
          route.gradeSystem === selectedGrade.system &&
          route.gradeRangeMin !== undefined &&
          route.gradeRangeMax !== undefined &&
          gradeRangesOverlap(
            route.gradeRangeMin,
            route.gradeRangeMax,
            selectedGrade.min,
            selectedGrade.max
          )
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
    gradeFilter,
    locale,
    personalFilter,
    query,
    routes,
    selectedGrade,
    sectorFilter,
    sortBy,
    styleFilter,
    typeFilter
  ]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [
    difficultyFilter,
    gradeFilter,
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
    gradeFilter !== "all" ? gradeFilter : "",
    styleFilter !== "all" ? styleFilter : "",
    sectorFilter !== "all" ? sectorFilter : "",
    personalFilter !== "all" ? personalFilter : ""
  ].filter(Boolean).length;

  function clearFilters() {
    setQuery("");
    setTypeFilter("all");
    setDifficultyFilter("all");
    setGradeFilter("all");
    setStyleFilter("all");
    setPersonalFilter("all");
    setSectorFilter("all");
    setSortBy(dnaScores ? "dna-match" : "recommended");
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
          {dnaLoaded && (
            dnaScores ? (
              <p className="mt-4 inline-flex border-l-2 border-terracotta pl-3 text-sm font-semibold text-brandforest">
                {isZh
                  ? "已按你的 Climbing DNA 偏好匹配优先排列。分数只代表偏好，不代表能力或安全判断。"
                  : "Prioritized by your Climbing DNA preference match. Scores describe preference, not ability or safety."}
              </p>
            ) : (
              <Link className="text-link mt-4 inline-flex" href="/climbing-dna">
                {isZh ? "完成 DNA 测试，个性化路线顺序" : "Take the DNA quiz to personalize route order"} →
              </Link>
            )
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
        onClick={() => setIsFiltersOpen((isOpen) => !isOpen)}
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
          onChange={setTypeFilter}
          value={typeFilter}
        >
          <option value="all">{isZh ? "全部类型" : "All types"}</option>
          {types.map((type) => <option key={type} value={type}>{type}</option>)}
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
        {gradeOptions.length > 0 && primaryGradeSystem && (
          <FilterSelect
            id="route-explorer-grade"
            label={`${isZh ? "等级范围" : "Grade range"} · ${gradeSystemLabels[primaryGradeSystem] ?? primaryGradeSystem}`}
            onChange={setGradeFilter}
            value={gradeFilter}
          >
            <option value="all">{isZh ? "全部可比较等级" : "All comparable grades"}</option>
            {gradeOptions.map((grade) => (
              <option key={grade.value} value={grade.value}>{grade.label}</option>
            ))}
          </FilterSelect>
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
                    {route.climbingType}
                  </span>
                </div>
              </div>

              <h4 className="display-serif mt-5 text-2xl font-medium leading-tight text-brandforest group-hover:text-terracotta">
                {route.name}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-charcoal/62">
                {routeSummary(route, locale)}
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
                <span>{route.sourceCount} {isZh ? "个来源" : "sources"}</span>
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
