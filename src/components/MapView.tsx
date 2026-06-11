"use client";

import Link from "next/link";
import { divIcon } from "leaflet";
import { useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from "react-leaflet";
import { useLanguage } from "@/components/LanguageProvider";
import {
  formatBeginnerStatus,
  formatClimbingType,
  formatSeason,
  getUiText
} from "@/lib/uiText";
import type { Destination } from "@/types/destination";

type MapViewProps = {
  compact?: boolean;
  destinations: Destination[];
};

type AtlasRegion = {
  id: string;
  name: { en: string; zh: string };
  center: [number, number];
  zoom: number;
  countries: string[];
};

const clusterZoomThreshold = 2.75;

const atlasRegions: AtlasRegion[] = [
  {
    id: "north-america",
    name: { en: "North America", zh: "北美" },
    center: [39, -105],
    zoom: 4,
    countries: ["USA", "Canada", "Mexico"]
  },
  {
    id: "europe",
    name: { en: "Europe", zh: "欧洲" },
    center: [46, 8],
    zoom: 5,
    countries: ["France", "Greece", "Italy", "Germany", "Spain"]
  },
  {
    id: "asia",
    name: { en: "Asia", zh: "亚洲" },
    center: [28, 107],
    zoom: 4,
    countries: ["China", "Taiwan", "Thailand"]
  },
  {
    id: "oceania",
    name: { en: "Oceania", zh: "大洋洲" },
    center: [-27, 134],
    zoom: 4,
    countries: ["Australia"]
  },
  {
    id: "africa",
    name: { en: "Africa", zh: "非洲" },
    center: [-29, 24],
    zoom: 4,
    countries: ["South Africa"]
  }
];

const markerIcon = divIcon({
  className: "climb-marker",
  iconSize: [34, 42],
  iconAnchor: [17, 38],
  popupAnchor: [0, -36]
});

function getRegionIcon(region: AtlasRegion, count: number, locale: "en" | "zh") {
  return divIcon({
    className: "region-marker-shell",
    html: `
      <div class="region-marker">
        <span class="region-marker-count">${count}</span>
        <span class="region-marker-name">${region.name[locale]}</span>
      </div>
    `,
    iconSize: [132, 68],
    iconAnchor: [66, 34]
  });
}

function MapZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  useMapEvents({
    zoomend(event) {
      onZoomChange(event.target.getZoom());
    }
  });

  return null;
}

function RegionMarker({
  count,
  locale,
  region
}: {
  count: number;
  locale: "en" | "zh";
  region: AtlasRegion;
}) {
  const map = useMap();

  return (
    <Marker
      eventHandlers={{
        click() {
          map.setView(region.center, region.zoom);
        }
      }}
      icon={getRegionIcon(region, count, locale)}
      position={region.center}
    />
  );
}

export function MapView({ compact = false, destinations }: MapViewProps) {
  const { locale } = useLanguage();
  const t = getUiText(locale);
  const [zoom, setZoom] = useState(2);
  const showRegions = zoom <= clusterZoomThreshold;

  const regionSummaries = useMemo(() => {
    return atlasRegions
      .map((region) => {
        const regionDestinations = destinations.filter((destination) =>
          region.countries.includes(destination.country)
        );
        const styles = Array.from(
          new Set(regionDestinations.flatMap((destination) => destination.climbingTypes))
        );

        return {
          ...region,
          count: regionDestinations.length,
          styles
        };
      })
      .filter((region) => region.count > 0);
  }, [destinations]);

  return (
    <div className={`treasure-map-frame h-full w-full ${compact ? "min-h-[300px]" : "min-h-[560px]"}`}>
      <MapContainer
        center={[24, 8]}
        className="atlas-map h-full w-full"
        maxBounds={[
          [-85, -180],
          [85, 180]
        ]}
        minZoom={2}
        scrollWheelZoom
        zoom={2}
      >
        <MapZoomTracker onZoomChange={setZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showRegions
          ? regionSummaries.map((region) => (
              <RegionMarker
                count={region.count}
                key={region.id}
                locale={locale}
                region={region}
              />
            ))
          : destinations.map((destination) => (
              <Marker
                icon={markerIcon}
                key={destination.slug}
                position={[destination.latitude, destination.longitude]}
              >
                <Popup>
                  <article className="w-72 space-y-4 p-1 text-bark">
                    <div className="border-b border-ridge/20 pb-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
                        {destination.country}
                      </p>
                      <h2 className="mt-1 text-2xl font-black leading-tight">
                        {destination.name}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {destination.climbingTypes.map((type) => (
                        <span
                          className="rounded-full bg-forest px-3 py-1 text-xs font-bold text-parchment"
                          key={type}
                        >
                          {formatClimbingType(type, locale)}
                        </span>
                      ))}
                      <span className="rounded-full bg-sunlit/80 px-3 py-1 text-xs font-bold text-bark">
                        {formatBeginnerStatus(destination.beginnerFriendly, locale)}
                      </span>
                    </div>

                    <dl className="grid gap-2 text-sm">
                      <div className="flex justify-between gap-4 rounded-md bg-parchment/70 px-3 py-2">
                        <dt className="font-bold text-bark/65">{t.rock}</dt>
                        <dd className="text-right font-semibold">{destination.rockType}</dd>
                      </div>
                      <div className="flex justify-between gap-4 rounded-md bg-parchment/70 px-3 py-2">
                        <dt className="font-bold text-bark/65">{t.season}</dt>
                        <dd className="text-right font-semibold">
                          {destination.bestSeasons
                            .map((season) => formatSeason(season, locale))
                            .join(", ")}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 rounded-md bg-parchment/70 px-3 py-2">
                        <dt className="font-bold text-bark/65">{t.difficulty}</dt>
                        <dd className="text-right font-semibold">
                          {destination.difficultyRange}
                        </dd>
                      </div>
                    </dl>

                    <Link
                      className="inline-flex w-full items-center justify-center rounded-md bg-bark px-4 py-3 text-sm font-black text-parchment transition hover:bg-forest"
                      href={`/destinations/${destination.slug}`}
                    >
                      {t.openFieldNotes}
                    </Link>
                  </article>
                </Popup>
              </Marker>
            ))}
      </MapContainer>

      {!compact && (
        <aside className="expedition-log">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ridge">
            {locale === "zh" ? "探险日志" : "Expedition log"}
          </p>
          <p className="mt-2 text-xs font-bold leading-5 text-bark/65">
            {showRegions
              ? locale === "zh"
                ? "点击区域印章，展开具体岩区。"
                : "Choose a region seal to reveal its climbing places."
              : locale === "zh"
                ? "缩小回世界视图，可以重新查看区域印章。"
                : "Zoom back out to return to region seals."}
          </p>
        </aside>
      )}
    </div>
  );
}
