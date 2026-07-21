"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import {
  getDestinationSearchText
} from "@/data/localizedContent";
import {
  FilterSidebar,
  type Filters,
  type SearchResults
} from "@/components/FilterSidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDestinationFact } from "@/lib/formatters";
import {
  getDestinationRouteCount,
  getPublicRouteSummaries
} from "@/lib/routes/public-routes";

const MapView = dynamic(
  () => import("@/components/MapView").then((module) => module.MapView),
  {
    loading: () => (
      <div className="flex h-full min-h-[520px] items-center justify-center bg-parchment text-bark">
        Loading map...
      </div>
    ),
    ssr: false
  }
);

const defaultFilters: Filters = {
  climbingType: "all",
  rockType: "all",
  season: "all",
  beginnerFriendly: false,
  searchQuery: ""
};

export function ExploreClient() {
  const { locale } = useLanguage();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const publicRoutes = useMemo(() => getPublicRouteSummaries(), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("search") === "1") setIsFilterOpen(true);
  }, []);

  const rockTypes = useMemo(() => {
    return Array.from(
      new Set(destinations.map((destination) => destination.rockType))
    ).sort();
  }, []);

  const routeCount = publicRoutes.length;

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesType =
        filters.climbingType === "all" ||
        destination.climbingTypes.includes(filters.climbingType);
      const matchesRock =
        filters.rockType === "all" || destination.rockType === filters.rockType;
      const matchesSeason =
        filters.season === "all" ||
        destination.bestSeasons.includes(filters.season);
      const matchesBeginner =
        !filters.beginnerFriendly || destination.beginnerFriendly;

      return matchesType && matchesRock && matchesSeason && matchesBeginner;
    });
  }, [filters]);

  const searchResults = useMemo<SearchResults>(() => {
    const query = filters.searchQuery.trim().toLowerCase();

    if (!query) {
      return { destinations: [], routes: [] };
    }

    const destinationMatches = destinations
      .filter((destination) => {
        const searchableText = getDestinationSearchText(destination).toLowerCase();

        return searchableText.includes(query);
      })
      .map((destination) => ({
        href: `/destinations/${destination.slug}`,
        meta: `${formatDestinationFact(destination.country, locale)} - ${formatDestinationFact(destination.rockType, locale)}`,
        title: destination.name
      }));

    const routeMatches = publicRoutes
      .filter((route) => route.searchText.toLowerCase().includes(query))
      .map((route) => ({
        href: `/destinations/${route.destinationSlug}/routes/${route.id}`,
        meta: `${route.destinationName} - ${route.grade}`,
        title: route.name
      }));

    return {
      destinations: destinationMatches.slice(0, 6),
      routes: routeMatches.slice(0, 6)
    };
  }, [filters.searchQuery, locale, publicRoutes]);

  const stats = useMemo(() => {
    const countries = new Set(destinations.map((destination) => destination.country));
    const styles = new Set(
      destinations.flatMap((destination) => destination.climbingTypes)
    );

    return {
      countries: countries.size,
      styles: styles.size,
      visible: filteredDestinations.length
    };
  }, [filteredDestinations.length]);

  const featuredDestinations = useMemo(() => {
    return [...destinations]
      .sort(
        (a, b) =>
          getDestinationRouteCount(b.slug) - getDestinationRouteCount(a.slug)
      )
      .slice(0, 5);
  }, []);

  return (
    <main className="phase6-content min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-[96rem] bg-cream lg:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="relative min-h-[520px] border-r border-charcoal/10">
          <MapView
            destinations={filteredDestinations}
            showExpeditionLog={false}
            visualStyle="clean"
          />
        </div>

        <aside className="flex flex-col border-t border-charcoal/10 bg-cream lg:border-l lg:border-t-0">
          <div className="border-b border-charcoal/10 p-6">
            <p className="editorial-kicker text-terracotta">
              {locale === "zh" ? "地图入口" : "Atlas entry"}
            </p>
            <h1 className="display-serif mt-3 text-4xl font-bold leading-tight text-brandforest">
              ClimbAtlas
            </h1>
            <h2 className="mt-2 text-2xl font-black leading-tight text-charcoal">
              {locale === "zh"
                ? "从地图直接选目的地"
                : "Choose a climbing destination from the map"}
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-charcoal/68">
              {locale === "zh"
                ? "先从地图选择目的地。进入目的地后，再通过 DNA 偏好匹配和线路探索器比较具体路线。"
                : "Choose a destination from the map, then compare routes with DNA preference matching and the Route Explorer."}
            </p>

            <button
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-brandforest px-4 py-3 text-sm font-black text-cream shadow-editorial transition hover:bg-terracotta"
              onClick={() => setIsFilterOpen(true)}
              type="button"
            >
              {locale === "zh" ? "筛选与搜索" : "Filter and search"}
            </button>
          </div>

          <dl className="grid grid-cols-3 border-b border-charcoal/10 bg-charcoal p-5 text-cream">
            <AtlasStat label={locale === "zh" ? "目的地" : "Places"} value={destinations.length} />
            <AtlasStat label={locale === "zh" ? "路线" : "Routes"} value={routeCount} />
            <AtlasStat label={locale === "zh" ? "国家" : "Countries"} value={stats.countries} />
          </dl>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-black text-bark">
                {locale === "zh" ? "精选目的地" : "Featured destinations"}
              </h2>
              <button
                className="text-xs font-black text-brandforest underline decoration-terracotta/40 underline-offset-4"
                onClick={() => setIsFilterOpen(true)}
                type="button"
              >
                {locale === "zh" ? "查看全部" : "View all"}
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {featuredDestinations.map((destination) => (
                <Link
                  className="group grid grid-cols-[5.25rem_1fr_auto] items-center gap-3 rounded-md border border-charcoal/10 bg-white/65 p-2 transition hover:border-brandforest/35 hover:bg-white"
                  href={`/destinations/${destination.slug}`}
                  key={destination.slug}
                >
                  {destination.images?.[0] ? (
                    <img
                      alt={destination.images[0].alt}
                      className="h-14 w-20 rounded object-cover"
                      decoding="async"
                      loading="lazy"
                      src={destination.images[0].src}
                    />
                  ) : (
                    <div className="grid h-14 w-20 place-items-center rounded border border-ridge/20 bg-parchment text-[10px] font-black uppercase text-bark/45">
                      Atlas
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-bark group-hover:text-brandforest">
                      {destination.name}
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-bark/58">
                      {formatDestinationFact(destination.country, locale)} / {formatDestinationFact(destination.rockType, locale)}
                    </p>
                  </div>

                  <span className="rounded-full border border-brandforest/15 bg-brandforest/10 px-3 py-2 text-sm font-black text-brandforest">
                    {getDestinationRouteCount(destination.slug)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-charcoal/10 p-5">
            <button
              className="flex w-full items-center justify-between rounded-md border border-charcoal/12 bg-white/65 px-4 py-4 text-left text-sm font-black text-brandforest shadow-sm transition hover:border-brandforest/35 hover:bg-white"
              onClick={() => setIsFilterOpen(true)}
              type="button"
            >
              <span>{locale === "zh" ? "打开地图手册" : "Open atlas guide"}</span>
              <span className="rounded-md bg-parchment px-3 py-1 text-xs text-bark/65">
                {locale === "zh"
                  ? `${stats.visible} 个目的地可见`
                  : `${stats.visible} places visible`}
              </span>
            </button>
          </div>
        </aside>
      </section>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[1300] bg-bark/45 backdrop-blur-sm">
          <button
            aria-label={locale === "zh" ? "关闭筛选" : "Close filters"}
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setIsFilterOpen(false)}
            type="button"
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-cream shadow-2xl">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClose={() => setIsFilterOpen(false)}
              rockTypes={rockTypes}
              searchResults={searchResults}
              stats={stats}
              variant="drawer"
            />
          </div>
        </div>
      )}
    </main>
  );
}

function AtlasStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-cream/20 px-3 last:border-r-0">
      <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-terracotta">{label}</dt>
      <dd className="mt-1 text-3xl font-black leading-none text-cream">{value}</dd>
    </div>
  );
}
