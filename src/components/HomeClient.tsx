"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import {
  getDestinationSearchText,
  getRouteSearchText
} from "@/data/localizedContent";
import {
  FilterSidebar,
  type Filters,
  type SearchResults
} from "@/components/FilterSidebar";
import { LanguageToggle, useLanguage } from "@/components/LanguageProvider";
import { getUiText } from "@/lib/uiText";

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

export function HomeClient() {
  const { locale } = useLanguage();
  const t = getUiText(locale);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL?.trim();
  const feedbackHref = feedbackUrl || "/feedback";

  const rockTypes = useMemo(() => {
    return Array.from(
      new Set(destinations.map((destination) => destination.rockType))
    ).sort();
  }, []);

  const routeCount = useMemo(() => {
    return destinations.reduce(
      (total, destination) => total + (destination.routes?.length ?? 0),
      0
    );
  }, []);

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
        meta: `${destination.country} - ${destination.rockType}`,
        title: destination.name
      }));

    const routeMatches = destinations.flatMap((destination) =>
      (destination.routes ?? [])
        .filter((route) => {
          const searchableText = getRouteSearchText(route).toLowerCase();

          return searchableText.includes(query);
        })
        .map((route) => ({
          href: `/destinations/${destination.slug}/routes/${route.id}`,
          meta: `${destination.name} - ${route.grade}`,
          title: route.name
        }))
    );

    return {
      destinations: destinationMatches.slice(0, 6),
      routes: routeMatches.slice(0, 6)
    };
  }, [filters.searchQuery]);

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
      .sort((a, b) => (b.routes?.length ?? 0) - (a.routes?.length ?? 0))
      .slice(0, 5);
  }, []);

  return (
    <main className="min-h-screen bg-bark text-bark">
      <header className="relative z-[1100] border-b border-ridge/25 bg-parchment/95 px-4 py-3 shadow-atlas backdrop-blur">
        <div className="mx-auto flex max-w-[96rem] flex-wrap items-center justify-between gap-3">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-forest/30 bg-forest text-sm font-black text-parchment shadow-atlas">
              CA
            </span>
            <span>
              <span className="block text-2xl font-black leading-none text-bark">
                ClimbAtlas
              </span>
              <span className="mt-1 inline-flex rounded-md border border-ridge/30 bg-white/45 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-bark/60">
                Beta 2
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <a
              className="rounded-lg border border-ridge/25 bg-white/70 px-4 py-2 text-sm font-black text-bark shadow-sm transition hover:border-forest/35 hover:bg-white"
              href={feedbackHref}
              rel={feedbackUrl ? "noreferrer" : undefined}
              target={feedbackUrl ? "_blank" : undefined}
            >
              {t.sendFeedback}
            </a>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-[96rem] bg-parchment lg:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="relative min-h-[520px] border-r border-ridge/20">
          <MapView destinations={filteredDestinations} showExpeditionLog={false} />
        </div>

        <aside className="paper-texture flex flex-col border-t border-ridge/25 bg-parchment lg:border-l lg:border-t-0">
          <div className="border-b border-ridge/25 p-6">
            <p className="field-note-label text-forest">
              {locale === "zh" ? "地图入口" : "Atlas entry"}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-forest">
              ClimbAtlas
            </h1>
            <h2 className="mt-2 text-2xl font-black leading-tight text-bark">
              {locale === "zh"
                ? "从地图直接选目的地"
                : "Choose a climbing destination from the map"}
            </h2>
            <p className="mt-3 text-sm font-bold leading-6 text-bark/68">
              {locale === "zh"
                ? "首页先帮你找到想去的岩区。进入目的地后，再用路线目录和小测试决定具体爬哪条线。"
                : "Start by choosing a place. Once you enter a destination, the route directory and quiz help you decide what to climb."}
            </p>

            <button
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-forest/25 bg-forest px-4 py-3 text-sm font-black text-parchment shadow-atlas transition hover:bg-bark"
              onClick={() => setIsFilterOpen(true)}
              type="button"
            >
              {locale === "zh" ? "筛选与搜索" : "Filter and search"}
            </button>
          </div>

          <dl className="grid grid-cols-3 border-b border-ridge/25 bg-bark p-5 text-parchment">
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
                className="text-xs font-black text-forest underline decoration-forest/30 underline-offset-4"
                onClick={() => setIsFilterOpen(true)}
                type="button"
              >
                {locale === "zh" ? "查看全部" : "View all"}
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {featuredDestinations.map((destination) => (
                <Link
                  className="group grid grid-cols-[5.25rem_1fr_auto] items-center gap-3 rounded-md border border-ridge/20 bg-white/50 p-2 transition hover:border-forest/40 hover:bg-white/75"
                  href={`/destinations/${destination.slug}`}
                  key={destination.slug}
                >
                  {destination.images?.[0] ? (
                    <img
                      alt={destination.images[0].alt}
                      className="h-14 w-20 rounded object-cover"
                      src={destination.images[0].src}
                    />
                  ) : (
                    <div className="grid h-14 w-20 place-items-center rounded border border-ridge/20 bg-parchment text-[10px] font-black uppercase text-bark/45">
                      Atlas
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-bark group-hover:text-forest">
                      {destination.name}
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-bark/58">
                      {destination.country} / {destination.rockType}
                    </p>
                  </div>

                  <span className="rounded-full border border-forest/20 bg-forest/10 px-3 py-2 text-sm font-black text-forest">
                    {destination.routes?.length ?? 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-ridge/25 p-5">
            <button
              className="flex w-full items-center justify-between rounded-lg border border-ridge/25 bg-white/60 px-4 py-4 text-left text-sm font-black text-forest shadow-sm transition hover:border-forest/40 hover:bg-white"
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
          <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-parchment shadow-2xl">
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
    <div className="border-r border-parchment/20 px-3 last:border-r-0">
      <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-antiquegold">
        {label}
      </dt>
      <dd className="mt-1 text-3xl font-black leading-none text-parchment">
        {value}
      </dd>
    </div>
  );
}
