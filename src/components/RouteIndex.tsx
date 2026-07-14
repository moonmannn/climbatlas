"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserRoutes } from "@/components/UserRoutesProvider";
import { dnaQuestions } from "@/data/dnaQuestions";
import {
  getDnaDimensionLabel,
  getLocalizedDnaText,
  scoreDnaAnswers
} from "@/lib/climbingDna";
import { loadDnaAnswers } from "@/lib/climbingDnaStorage";
import { getRouteDnaMatch } from "@/lib/routes/route-dna";
import { compareRouteDifficulty } from "@/lib/routes/route-explorer";
import type { SavedRouteStatus } from "@/lib/supabaseClient";
import type { DnaVector } from "@/types/climbingDna";
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
  | "name"
  | "complete";

const pageSize = 24;

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
  return (
    route.summary?.[locale] ??
    route.summary?.en ??
    (locale === "zh"
      ? "基础路线索引，保留原始等级、来源记录和外部线路页。"
      : "A lightweight route index with the original grade, source trail, and outbound route page.")
  );
}

function linkLabel(route: RouteExplorerItem, isZh: boolean) {
  switch (route.linkStatus) {
    case "route-specific":
      return isZh ? "精确线路页" : "exact route page";
    case "guidebook-specific":
      return isZh ? "路书资源" : "guide resource";
    case "area-only":
      return isZh ? "区域备用" : "area fallback";
    case "needs-upgrade":
      return isZh ? "待升级" : "needs upgrade";
    default:
      return isZh ? "暂无外链" : "no outbound link";
  }
}

function pickRank(route: RouteExplorerItem) {
  if (
    route.editorialTier === "pick" &&
    ["reviewed", "published"].includes(route.editorialStatus)
  ) {
    return 0;
  }
  if (route.editorialTier === "pick") return 1;
  return 2;
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
  const [tierFilter, setTierFilter] = useState<"all" | "pick" | "index">(
    "all"
  );
  const [personalFilter, setPersonalFilter] = useState<
    "all" | SavedRouteStatus
  >("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [dnaScores, setDnaScores] = useState<DnaVector | null>(null);
  const [dnaLoaded, setDnaLoaded] = useState(false);

  useEffect(() => {
    const answers = loadDnaAnswers();
    if (answers) {
      const profile = scoreDnaAnswers(answers);
      if (profile.completedQuestionIds.length === dnaQuestions.length) {
        setDnaScores(profile.scores);
        setSortBy((current) => current === "recommended" ? "dna-match" : current);
      }
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
  const gradeOptions = useMemo(() => {
    const firstRouteByGrade = new Map<string, RouteExplorerItem>();
    for (const route of routes) {
      if (!firstRouteByGrade.has(route.grade)) firstRouteByGrade.set(route.grade, route);
    }
    return Array.from(firstRouteByGrade.values())
      .sort(compareRouteDifficulty)
      .map((route) => route.grade);
  }, [routes]);
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
          route.difficultyBand === difficultyFilter) &&
        (gradeFilter === "all" || route.grade === gradeFilter) &&
        (styleFilter === "all" || route.styleTags.includes(styleFilter)) &&
        (tierFilter === "all" || route.editorialTier === tierFilter) &&
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
            second.completenessScore - first.completenessScore
          );
        case "easy-hard":
          return compareRouteDifficulty(first, second);
        case "hard-easy":
          if (first.difficultyBand === "unknown") return 1;
          if (second.difficultyBand === "unknown") return -1;
          return compareRouteDifficulty(second, first);
        case "name":
          return first.name.localeCompare(second.name);
        case "complete":
          return (
            second.completenessScore - first.completenessScore ||
            first.name.localeCompare(second.name)
          );
        default:
          return (
            pickRank(first) - pickRank(second) ||
            second.completenessScore - first.completenessScore ||
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
    sectorFilter,
    sortBy,
    styleFilter,
    tierFilter,
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
    tierFilter,
    typeFilter
  ]);

  const visibleRoutes = filteredRoutes.slice(0, visibleCount);
  const pickCount = routes.filter((route) => route.editorialTier === "pick").length;
  const reviewedPickCount = routes.filter(
    (route) =>
      route.editorialTier === "pick" &&
      ["reviewed", "published"].includes(route.editorialStatus)
  ).length;
  const importedCount = routes.filter((route) => route.isImported).length;
  const personalRoutes = savedRoutes.filter(
    (record) => record.destination_slug === destinationSlug
  );

  function clearFilters() {
    setQuery("");
    setTypeFilter("all");
    setDifficultyFilter("all");
    setGradeFilter("all");
    setStyleFilter("all");
    setTierFilter("all");
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
            <span>{pickCount} {isZh ? "条精选候选" : "pick candidates"}</span>
            <span>{reviewedPickCount} {isZh ? "条已审核精选" : "reviewed picks"}</span>
            {importedCount > 0 && (
              <span>{importedCount} {isZh ? "条导入索引" : "imported indexes"}</span>
            )}
            {user && (
              <span>{personalRoutes.length} {isZh ? "条个人记录" : "personal saves"}</span>
            )}
          </div>
          {dnaLoaded && (
            dnaScores ? (
              <p className="mt-4 inline-flex border-l-2 border-terracotta pl-3 text-sm font-semibold text-brandforest">
                {isZh
                  ? "已按你的 Climbing DNA 优先排列。匹配只代表偏好，不代表能力或安全判断。"
                  : "Prioritized for your Climbing DNA. Match scores describe preference, not ability or safety."}
              </p>
            ) : (
              <Link className="text-link mt-4 inline-flex" href="/climbing-dna">
                {isZh ? "完成 DNA 测试，个性化路线顺序" : "Take the DNA quiz to personalize route order"} →
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <strong className="text-sm text-brandforest">
            {filteredRoutes.length} {isZh ? "条结果" : "results"}
          </strong>
          <button
            className="border border-brandforest/20 px-3 py-2 text-xs font-semibold text-brandforest transition hover:border-brandforest/45 hover:bg-brandforest/5"
            onClick={clearFilters}
            type="button"
          >
            {isZh ? "清除筛选" : "Clear filters"}
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-3 border-y border-brandforest/12 py-5 sm:grid-cols-2 lg:grid-cols-4">
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
            <option value="dna-match">{isZh ? "最适合我的 DNA" : "Best DNA match"}</option>
          )}
          <option value="recommended">{isZh ? "推荐优先" : "Recommended"}</option>
          <option value="easy-hard">{isZh ? "难度：易到难" : "Difficulty: easy to hard"}</option>
          <option value="hard-easy">{isZh ? "难度：难到易" : "Difficulty: hard to easy"}</option>
          <option value="complete">{isZh ? "资料最完整" : "Most complete"}</option>
          <option value="name">{isZh ? "按名称" : "Name"}</option>
        </FilterSelect>
        <FilterSelect
          id="route-explorer-difficulty"
          label={isZh ? "难度分组" : "Difficulty band"}
          onChange={(value) =>
            setDifficultyFilter(value as "all" | RouteDifficultyBand)
          }
          value={difficultyFilter}
        >
          <option value="all">{isZh ? "全部难度" : "All difficulty bands"}</option>
          {(Object.keys(bandLabels) as RouteDifficultyBand[]).map((band) => (
            <option key={band} value={band}>{bandLabels[band][locale]}</option>
          ))}
        </FilterSelect>
        <FilterSelect
          id="route-explorer-grade"
          label={isZh ? "精确等级" : "Exact grade"}
          onChange={setGradeFilter}
          value={gradeFilter}
        >
          <option value="all">{isZh ? "全部等级" : "All grades"}</option>
          {gradeOptions.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
        </FilterSelect>
        <FilterSelect
          id="route-explorer-tier"
          label={isZh ? "内容层级" : "Content tier"}
          onChange={(value) => setTierFilter(value as "all" | "pick" | "index")}
          value={tierFilter}
        >
          <option value="all">{isZh ? "全部路线" : "All routes"}</option>
          <option value="pick">{isZh ? "精选与候选" : "Picks and candidates"}</option>
          <option value="index">{isZh ? "路线索引" : "Route index"}</option>
        </FilterSelect>
        <FilterSelect
          id="route-explorer-sector"
          label={isZh ? "区域" : "Sector"}
          onChange={setSectorFilter}
          value={sectorFilter}
        >
          <option value="all">{isZh ? "全部区域" : "All sectors"}</option>
          {sectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
        </FilterSelect>
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
          const reviewedPick =
            route.editorialTier === "pick" &&
            ["reviewed", "published"].includes(route.editorialStatus);

          return (
            <Link
              className="group min-h-60 bg-cream p-5 transition-colors hover:bg-white"
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
                <span className="text-xs font-semibold text-charcoal/45">
                  {route.completenessScore}%
                </span>
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
                      {dnaMatch.score}% {isZh ? "DNA 匹配" : "DNA match"}
                    </strong>
                    <span className="text-xs font-semibold text-charcoal/48">
                      {isZh ? "契合" : "Strong fit"}: {dnaMatch.alignedDimensions
                        .map((dimension) => getDnaDimensionLabel(dimension, locale))
                        .join(" · ")}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-charcoal/52">
                    {getLocalizedDnaText(dnaMatch.reasons[0], locale)}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-charcoal/52">
                <span>
                  {reviewedPick
                    ? isZh ? "ClimbAtlas 精选" : "ClimbAtlas pick"
                    : route.editorialTier === "pick"
                      ? isZh ? "精选候选" : "pick candidate"
                      : isZh ? "路线索引" : "route index"}
                </span>
                <span>{route.sourceCount} {isZh ? "个来源" : "sources"}</span>
                <span>{linkLabel(route, isZh)}</span>
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
          <button className="text-link mt-3" onClick={clearFilters} type="button">
            {isZh ? "清除筛选" : "Clear filters"}
          </button>
        </div>
      )}

      {visibleRoutes.length < filteredRoutes.length && (
        <div className="mt-7 flex justify-center">
          <button
            className="border border-brandforest bg-brandforest px-5 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta"
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
