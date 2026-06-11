"use client";

import Link from "next/link";
import { useRef, useState } from "react";
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

const defaultPanelPosition = { x: 20, y: 20 };

export function FilterSidebar({
  filters,
  rockTypes,
  searchResults,
  stats,
  onChange
}: FilterSidebarProps) {
  const { locale } = useLanguage();
  const t = getUiText(locale);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [panelPosition, setPanelPosition] = useState(defaultPanelPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  function updateFilters(nextFilters: Partial<Filters>) {
    onChange({ ...filters, ...nextFilters });
  }

  function clampPanelPosition(x: number, y: number) {
    if (typeof window === "undefined") {
      return { x, y };
    }

    return {
      x: Math.min(Math.max(12, x), window.innerWidth - 128),
      y: Math.min(Math.max(12, y), window.innerHeight - 80)
    };
  }

  function startDragging(event: React.PointerEvent<HTMLDivElement>) {
    if (window.innerWidth < 768) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }

    dragOffset.current = {
      x: event.clientX - panelPosition.x,
      y: event.clientY - panelPosition.y
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePanel(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    const nextPosition = clampPanelPosition(
      event.clientX - dragOffset.current.x,
      event.clientY - dragOffset.current.y
    );
    setPanelPosition(nextPosition);
  }

  function stopDragging(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const expandedContentClass = isCollapsed ? "block md:hidden" : "block";

  return (
    <aside
      className={`paper-texture z-[1000] w-full border-b border-ridge/30 bg-parchment/95 p-4 text-bark shadow-atlas backdrop-blur transition-[width,box-shadow] duration-200 md:absolute md:max-h-[calc(100vh-40px)] md:overflow-auto md:rounded-lg md:border ${
        isCollapsed ? "md:w-[18rem]" : "md:w-[22rem]"
      } ${isDragging ? "md:cursor-grabbing md:shadow-2xl" : ""}`}
      style={{ left: panelPosition.x, top: panelPosition.y }}
    >
      <div
        className="mb-3 hidden cursor-grab items-center justify-between gap-3 rounded-md border border-ridge/25 bg-white/35 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-bark/65 md:flex"
        onPointerCancel={stopDragging}
        onPointerDown={startDragging}
        onPointerMove={movePanel}
        onPointerUp={stopDragging}
      >
        <span>{isDragging ? t.movingFieldPanel : t.dragFieldPanel}</span>
        <button
          className="rounded border border-ridge/30 bg-parchment/80 px-2 py-1 text-[10px] font-black text-forest transition hover:border-forest/40"
          onClick={() => setPanelPosition(defaultPanelPosition)}
          type="button"
        >
          {t.resetPosition}
        </button>
      </div>

      {isCollapsed && (
        <div className="hidden md:block">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-forest">
                {t.fieldMap}
              </p>
              <h1 className="mt-1 text-3xl font-black leading-none text-bark">
                ClimbAtlas
              </h1>
              <p className="mt-2 text-xs font-bold text-bark/60">
                {t.destinationsVisible(stats.visible)}
              </p>
            </div>
            <div className="rounded-md border border-ridge/30 bg-white/45 px-3 py-2 text-center">
              <p className="text-2xl font-black leading-none text-forest">
                {stats.visible}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase text-bark/55">
                {t.visible}
              </p>
            </div>
          </div>

          <button
            className="mt-4 w-full rounded-md border border-forest/35 bg-forest px-3 py-3 text-sm font-black text-parchment shadow-atlas transition hover:bg-bark"
            onClick={() => setIsCollapsed(false)}
            type="button"
          >
            {t.openFilters}
          </button>
        </div>
      )}

      <div className={expandedContentClass}>
        <div className="border-b border-ridge/30 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest">
                {t.fieldMap}
              </p>
              <h1 className="mt-1 text-4xl font-black leading-none text-bark">
                ClimbAtlas
              </h1>
            </div>
            <button
              className="hidden rounded-md border border-ridge/30 bg-white/45 px-3 py-2 text-xs font-black uppercase tracking-wide text-forest transition hover:border-forest/40 hover:bg-white/65 md:block"
              onClick={() => setIsCollapsed(true)}
              type="button"
            >
              {t.collapse}
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-bark/75">
            {locale === "zh"
              ? "一份世界攀岩目的地地图，收录经典岩壁、抱石、大墙和阳光灰岩。"
              : "A world guide to classic cliffs, blocs, big walls, and sunny limestone escapes."}
          </p>
        </div>

        <div className="border-b border-ridge/30 py-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-bark/70">
              {t.searchAtlas}
            </span>
            <input
              className="mt-1 w-full rounded-md border border-ridge/40 bg-white/85 px-3 py-3 text-sm font-semibold text-bark outline-none transition placeholder:text-bark/40 focus:border-forest focus:ring-2 focus:ring-sunlit/45"
              onChange={(event) =>
                updateFilters({ searchQuery: event.target.value })
              }
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
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-ridge">
                        {t.destinations}
                      </p>
                      <div className="mt-2 space-y-2">
                        {searchResults.destinations.map((result) => (
                          <Link
                            className="block rounded-md border border-ridge/20 bg-parchment/70 px-3 py-2 transition hover:border-forest/40 hover:bg-parchment"
                            href={result.href}
                            key={result.href}
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
                  )}

                  {searchResults.routes.length > 0 && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-ridge">
                        {t.routes}
                      </p>
                      <div className="mt-2 space-y-2">
                        {searchResults.routes.map((result) => (
                          <Link
                            className="block rounded-md border border-ridge/20 bg-parchment/70 px-3 py-2 transition hover:border-forest/40 hover:bg-parchment"
                            href={result.href}
                            key={result.href}
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
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 py-4">
          <div className="rounded-md border border-ridge/30 bg-white/45 p-3">
            <p className="text-2xl font-black text-forest">{stats.visible}</p>
            <p className="text-[11px] font-bold uppercase text-bark/60">
              {t.visible}
            </p>
          </div>
          <div className="rounded-md border border-ridge/30 bg-white/45 p-3">
            <p className="text-2xl font-black text-forest">{stats.countries}</p>
            <p className="text-[11px] font-bold uppercase text-bark/60">
              {t.countries}
            </p>
          </div>
          <div className="rounded-md border border-ridge/30 bg-white/45 p-3">
            <p className="text-2xl font-black text-forest">{stats.styles}</p>
            <p className="text-[11px] font-bold uppercase text-bark/60">
              {t.styles}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-bark/70">
              {t.climbingType}
            </span>
            <select
              className="mt-1 w-full rounded-md border border-ridge/40 bg-white/80 px-3 py-2 text-sm font-semibold text-bark outline-none transition focus:border-forest focus:ring-2 focus:ring-sunlit/45"
              value={filters.climbingType}
              onChange={(event) =>
                updateFilters({
                  climbingType: event.target.value as Filters["climbingType"]
                })
              }
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
              value={filters.rockType}
              onChange={(event) =>
                updateFilters({ rockType: event.target.value })
              }
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
              value={filters.season}
              onChange={(event) =>
                updateFilters({ season: event.target.value as Filters["season"] })
              }
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
              type="checkbox"
              onChange={(event) =>
                updateFilters({ beginnerFriendly: event.target.checked })
              }
            />
            {t.beginnerFriendlyOnly}
          </label>
        </div>
      </div>
    </aside>
  );
}
