"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatClimbingType, formatSeason, getUiText } from "@/lib/uiText";
import type { ClimbingType, Season } from "@/types/destination";

export type Filters = {
  climbingType: "all" | ClimbingType;
  rockType: "all" | string;
  season: "all" | Season;
  beginnerFriendly: boolean;
  searchQuery: string;
};

type SearchResult = {
  href: string;
  meta: string;
  title: string;
};

export type SearchResults = {
  destinations: SearchResult[];
  routes: SearchResult[];
};

type FilterSidebarProps = {
  filters: Filters;
  rockTypes: string[];
  searchResults: SearchResults;
  stats: {
    countries: number;
    styles: number;
    visible: number;
  };
  onChange: (filters: Filters) => void;
  onClose?: () => void;
  variant?: "drawer" | "panel";
};

const climbingTypes: Array<"all" | ClimbingType> = [
  "all",
  "sport",
  "trad",
  "boulder",
  "multi-pitch"
];

const seasons: Array<"all" | Season> = [
  "all",
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "Year-round"
];

export function FilterSidebar({
  filters,
  rockTypes,
  searchResults,
  stats,
  onChange,
  onClose,
  variant = "panel"
}: FilterSidebarProps) {
  const { locale } = useLanguage();
  const t = getUiText(locale);
  const isDrawer = variant === "drawer";

  function updateFilters(nextFilters: Partial<Filters>) {
    onChange({ ...filters, ...nextFilters });
  }

  return (
    <aside
      className={`paper-texture h-full w-full text-bark ${
        isDrawer ? "overflow-y-auto p-5" : "rounded-lg border border-ridge/30 p-4"
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-ridge/30 pb-4">
        <div>
          <p className="field-note-label text-forest">
            {locale === "zh" ? "筛选与搜索" : "Filter and search"}
          </p>
          <h2 className="mt-1 text-3xl font-black leading-none text-bark">
            ClimbAtlas
          </h2>
          <p className="mt-3 text-sm font-bold leading-6 text-bark/68">
            {locale === "zh"
              ? "先缩小目的地范围，也可以直接搜索路线名称。"
              : "Narrow the map by destination style, or search for a route directly."}
          </p>
        </div>

        {onClose && (
          <button
            className="rounded-md border border-ridge/30 bg-white/55 px-3 py-2 text-xs font-black uppercase tracking-wide text-forest transition hover:border-forest/40 hover:bg-white"
            onClick={onClose}
            type="button"
          >
            {locale === "zh" ? "关闭" : "Close"}
          </button>
        )}
      </div>

      <div className="border-b border-ridge/30 py-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-bark/70">
            {t.searchAtlas}
          </span>
          <input
            className="mt-1 w-full rounded-md border border-ridge/40 bg-white/85 px-3 py-3 text-sm font-semibold text-bark outline-none transition placeholder:text-bark/40 focus:border-forest focus:ring-2 focus:ring-sunlit/45"
            onChange={(event) => updateFilters({ searchQuery: event.target.value })}
            placeholder={t.searchPlaceholder}
            type="search"
            value={filters.searchQuery}
          />
        </label>

        {filters.searchQuery.trim() && (
          <div className="mt-3 rounded-md border border-ridge/30 bg-white/55 p-3">
            {searchResults.destinations.length === 0 &&
            searchResults.routes.length === 0 ? (
              <p className="text-sm font-bold text-bark/65">
                {t.noSearchResults}
              </p>
            ) : (
              <div className="space-y-4">
                {searchResults.destinations.length > 0 && (
                  <SearchGroup
                    label={t.destinations}
                    onClose={onClose}
                    results={searchResults.destinations}
                  />
                )}

                {searchResults.routes.length > 0 && (
                  <SearchGroup
                    label={t.routes}
                    onClose={onClose}
                    results={searchResults.routes}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 py-4">
        <FilterStat label={t.visible} value={stats.visible} />
        <FilterStat label={t.countries} value={stats.countries} />
        <FilterStat label={t.styles} value={stats.styles} />
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-bark/70">
            {t.climbingType}
          </span>
          <select
            className="mt-1 w-full rounded-md border border-ridge/40 bg-white/80 px-3 py-2 text-sm font-semibold text-bark outline-none transition focus:border-forest focus:ring-2 focus:ring-sunlit/45"
            onChange={(event) =>
              updateFilters({
                climbingType: event.target.value as Filters["climbingType"]
              })
            }
            value={filters.climbingType}
          >
            {climbingTypes.map((type) => (
              <option key={type} value={type}>
                {formatClimbingType(type, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-bark/70">
            {t.rockType}
          </span>
          <select
            className="mt-1 w-full rounded-md border border-ridge/40 bg-white/80 px-3 py-2 text-sm font-semibold text-bark outline-none transition focus:border-forest focus:ring-2 focus:ring-sunlit/45"
            onChange={(event) => updateFilters({ rockType: event.target.value })}
            value={filters.rockType}
          >
            <option value="all">{t.allRockTypes}</option>
            {rockTypes.map((rockType) => (
              <option key={rockType} value={rockType}>
                {rockType}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-bark/70">
            {t.bestSeason}
          </span>
          <select
            className="mt-1 w-full rounded-md border border-ridge/40 bg-white/80 px-3 py-2 text-sm font-semibold text-bark outline-none transition focus:border-forest focus:ring-2 focus:ring-sunlit/45"
            onChange={(event) =>
              updateFilters({ season: event.target.value as Filters["season"] })
            }
            value={filters.season}
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {formatSeason(season, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-md border border-ridge/30 bg-white/55 px-3 py-3 text-sm font-bold text-bark">
          <input
            checked={filters.beginnerFriendly}
            className="h-4 w-4 accent-forest"
            onChange={(event) =>
              updateFilters({ beginnerFriendly: event.target.checked })
            }
            type="checkbox"
          />
          {t.beginnerFriendlyOnly}
        </label>
      </div>
    </aside>
  );
}

function SearchGroup({
  label,
  onClose,
  results
}: {
  label: string;
  onClose?: () => void;
  results: SearchResult[];
}) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-ridge">
        {label}
      </p>
      <div className="mt-2 space-y-2">
        {results.map((result) => (
          <Link
            className="block rounded-md border border-ridge/20 bg-parchment/70 px-3 py-2 transition hover:border-forest/40 hover:bg-parchment"
            href={result.href}
            key={result.href}
            onClick={onClose}
          >
            <span className="block text-sm font-black text-bark">
              {result.title}
            </span>
            <span className="block text-xs font-bold text-bark/55">
              {result.meta}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FilterStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-ridge/30 bg-white/45 p-3">
      <p className="text-2xl font-black text-forest">{value}</p>
      <p className="text-[11px] font-bold uppercase text-bark/60">{label}</p>
    </div>
  );
}
