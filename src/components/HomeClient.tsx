"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import {
  getDestinationSearchText,
  getRouteSearchText
} from "@/data/localizedContent";
import { ExplorerBoard } from "@/components/ExplorerBoard";
import {
  FilterSidebar,
  type Filters,
  type SearchResults
} from "@/components/FilterSidebar";
import { LanguageToggle, useLanguage } from "@/components/LanguageProvider";
import { getUiText } from "@/lib/uiText";
import type { RouteFinderCandidate } from "@/lib/routeFinder";

const MapView = dynamic(
  () => import("@/components/MapView").then((module) => module.MapView),
  {
    loading: () => (
      <div className="flex h-full min-h-[560px] items-center justify-center bg-slate-200 text-slate-700">
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

type HomeMode = "map" | "board";

export function HomeClient() {
  const { locale } = useLanguage();
  const t = getUiText(locale);
  const [activeMode, setActiveMode] = useState<HomeMode>("map");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL?.trim();
  const feedbackHref = feedbackUrl || "/feedback";

  const rockTypes = useMemo(() => {
    return Array.from(
      new Set(destinations.map((destination) => destination.rockType))
    ).sort();
  }, []);

  const routeFinderCandidates = useMemo<RouteFinderCandidate[]>(() => {
    return destinations.flatMap((destination) =>
      (destination.routes ?? []).map((route) => ({
        route,
        destinationName: destination.name,
        destinationSlug: destination.slug,
        country: destination.country
      }))
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
          href: `/destinations/${destination.slug}#route-${route.id}`,
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

  const modeButtonBase =
    "rounded-md border px-3 py-2 text-sm font-black transition";

  return (
    <main
      className={`relative min-h-screen bg-bark ${
        activeMode === "map" ? "overflow-hidden md:h-screen" : "overflow-x-hidden"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 z-[500] bg-[radial-gradient(circle_at_75%_12%,rgba(199,151,72,0.25),transparent_28%),linear-gradient(90deg,rgba(43,33,24,0.38),transparent_42%)]" />

      <div className="absolute right-4 top-4 z-[1200] flex flex-wrap justify-end gap-2">
        <a
          className="rounded-lg border border-antiquegold/30 bg-parchment/90 px-3 py-2 text-sm font-black text-bark shadow-atlas backdrop-blur transition hover:bg-antiquegold"
          href={feedbackHref}
          rel={feedbackUrl ? "noreferrer" : undefined}
          target={feedbackUrl ? "_blank" : undefined}
        >
          {t.sendFeedback}
        </a>
        <LanguageToggle />
        <nav className="flex rounded-lg border border-antiquegold/30 bg-bark/88 p-1 shadow-atlas backdrop-blur">
          <button
            className={`${modeButtonBase} ${
              activeMode === "map"
                ? "border-antiquegold/40 bg-antiquegold text-bark"
                : "border-transparent text-parchment hover:border-antiquegold/30"
            }`}
            onClick={() => setActiveMode("map")}
            type="button"
          >
            {t.atlasMap}
          </button>
          <button
            className={`${modeButtonBase} ${
              activeMode === "board"
                ? "border-antiquegold/40 bg-antiquegold text-bark"
                : "border-transparent text-parchment hover:border-antiquegold/30"
            }`}
            onClick={() => setActiveMode("board")}
            type="button"
          >
            {t.explorerBoard}
          </button>
        </nav>
      </div>

      {activeMode === "map" ? (
        <>
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            rockTypes={rockTypes}
            searchResults={searchResults}
            stats={stats}
          />

          <div className="h-[calc(100vh-380px)] min-h-[560px] md:h-full">
            <MapView destinations={filteredDestinations} />
          </div>

        </>
      ) : (
        <ExplorerBoard
          mapPreview={<MapView compact destinations={destinations} />}
          routeFinderCandidates={routeFinderCandidates}
          totalDestinations={destinations.length}
        />
      )}
    </main>
  );
}
