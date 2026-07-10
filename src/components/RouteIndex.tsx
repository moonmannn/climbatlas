"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getRouteSummary } from "@/data/localizedContent";
import type {
  ClimbingType,
  ExternalLinkStatus,
  RouteHighlight,
  RouteStatus
} from "@/types/destination";
import { useLanguage } from "@/components/LanguageProvider";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserRoutes } from "@/components/UserRoutesProvider";
import type { SavedRouteStatus } from "@/lib/supabaseClient";

type RouteIndexProps = {
  routes: RouteHighlight[];
  destinationName: string;
  destinationSlug: string;
};

const routeTypeOptions: Array<"all" | ClimbingType> = [
  "all",
  "sport",
  "trad",
  "boulder",
  "multi-pitch"
];

const routeStatusOptions: Array<"all" | RouteStatus> = [
  "all",
  "highlight",
  "metadata"
];

const linkStatusStyles: Record<ExternalLinkStatus, string> = {
  "route-specific": "border-forest/25 bg-forest/10 text-forest",
  "guidebook-specific": "border-sunlit/45 bg-sunlit/20 text-bark",
  "area-only": "border-ridge/25 bg-white/55 text-bark/60",
  "needs-upgrade": "border-red-900/20 bg-red-900/10 text-red-950"
};

function getPrimaryLinkStatus(route: RouteHighlight): ExternalLinkStatus | undefined {
  const statuses = (route.externalResources ?? [])
    .map((resource) => resource.linkStatus)
    .filter((status): status is ExternalLinkStatus => Boolean(status));

  if (statuses.includes("route-specific")) {
    return "route-specific";
  }

  if (statuses.includes("guidebook-specific")) {
    return "guidebook-specific";
  }

  if (statuses.includes("area-only")) {
    return "area-only";
  }

  return statuses[0];
}

function getLinkStatusLabel(status: ExternalLinkStatus | undefined, isZh: boolean) {
  if (!status) {
    return isZh ? "无外链" : "no link";
  }

  const labels: Record<ExternalLinkStatus, { en: string; zh: string }> = {
    "route-specific": {
      en: "exact link",
      zh: "精确外链"
    },
    "guidebook-specific": {
      en: "guide link",
      zh: "路书资源"
    },
    "area-only": {
      en: "area fallback",
      zh: "区域备用"
    },
    "needs-upgrade": {
      en: "needs upgrade",
      zh: "待升级"
    }
  };

  return isZh ? labels[status].zh : labels[status].en;
}

export function RouteIndex({
  routes,
  destinationName,
  destinationSlug
}: RouteIndexProps) {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ClimbingType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | RouteStatus>("all");
  const [personalFilter, setPersonalFilter] = useState<
    "all" | SavedRouteStatus
  >("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const isZh = locale === "zh";
  const { user } = useSupabaseAuth();
  const { getSavedStatus, savedRoutes } = useUserRoutes();

  const sectors = useMemo(() => {
    return Array.from(
      new Set(routes.map((route) => route.sector).filter(Boolean))
    ).sort() as string[];
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return routes.filter((route) => {
      const status = route.status ?? "highlight";
      const linkStatus = getPrimaryLinkStatus(route) ?? "";
      const personalStatus = getSavedStatus(destinationSlug, route.id);
      const matchesType = typeFilter === "all" || route.type === typeFilter;
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesPersonal =
        personalFilter === "all" || personalStatus === personalFilter;
      const matchesSector =
        sectorFilter === "all" || route.sector === sectorFilter;
      const searchable = [
        route.name,
        route.grade,
        route.type,
        route.sector ?? "",
        status,
        linkStatus,
        route.style,
        route.summary,
        route.bestFor,
        route.decisionHint ?? "",
        ...route.practiceFocus,
        ...(route.personalityTags ?? []),
        ...(route.externalResources ?? []).map((resource) => resource.title)
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesType &&
        matchesStatus &&
        matchesPersonal &&
        matchesSector &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [
    destinationSlug,
    getSavedStatus,
    personalFilter,
    query,
    routes,
    sectorFilter,
    statusFilter,
    typeFilter
  ]);

  const highlightCount = routes.filter(
    (route) => (route.status ?? "highlight") === "highlight"
  ).length;
  const metadataCount = routes.length - highlightCount;
  const exactLinkCount = routes.filter(
    (route) => getPrimaryLinkStatus(route) === "route-specific"
  ).length;
  const personalRoutes = savedRoutes.filter(
    (record) => record.destination_slug === destinationSlug
  );
  const wantCount = personalRoutes.filter(
    (record) => record.status === "want-to-climb"
  ).length;
  const climbedCount = personalRoutes.filter(
    (record) => record.status === "climbed"
  ).length;

  return (
    <section className="rounded-lg border border-ridge/25 bg-white/45 p-4 shadow-[0_10px_30px_rgba(43,33,24,0.08)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ridge">
            {isZh ? "路线索引" : "Route index"}
          </p>
          <h3 className="mt-1 text-2xl font-black text-bark">
            {routes.length} {isZh ? "条路线" : "routes"} / {destinationName}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-bark/65">
            {isZh
              ? "Highlight 是 ClimbAtlas 完整介绍；metadata 是基础索引和外链。精确外链会直达单条线路页，区域备用链接则需要你在外站再次确认。"
              : "Highlights have full ClimbAtlas notes. Metadata entries are lightweight index records with outbound links. Exact links open a single-route page; area fallbacks need confirmation on the external site."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-black text-forest">
              {highlightCount} highlight
            </span>
            <span className="rounded-full border border-ridge/25 bg-white/55 px-3 py-1 text-xs font-black text-bark/65">
              {metadataCount} metadata
            </span>
            <span className="rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-black text-forest">
              {exactLinkCount} {isZh ? "精确外链" : "exact links"}
            </span>
            {user && (
              <>
                <span className="rounded-full border border-sunlit/40 bg-sunlit/20 px-3 py-1 text-xs font-black text-bark">
                  {wantCount} {isZh ? "想爬" : "want"}
                </span>
                <span className="rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-black text-forest">
                  {climbedCount} {isZh ? "已爬" : "climbed"}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:w-[32rem]">
          <input
            className="rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold text-bark outline-none transition focus:border-forest"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isZh ? "搜索路线、等级、区域..." : "Search route, grade, sector..."}
            value={query}
          />
          <select
            className="rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold text-bark outline-none transition focus:border-forest"
            onChange={(event) =>
              setTypeFilter(event.target.value as "all" | ClimbingType)
            }
            value={typeFilter}
          >
            {routeTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? (isZh ? "全部类型" : "All types") : option}
              </option>
            ))}
          </select>
          {user && (
            <select
              className="rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold text-bark outline-none transition focus:border-forest"
              onChange={(event) =>
                setPersonalFilter(
                  event.target.value as "all" | SavedRouteStatus
                )
              }
              value={personalFilter}
            >
              <option value="all">
                {isZh ? "全部个人状态" : "All personal statuses"}
              </option>
              <option value="want-to-climb">
                {isZh ? "只看想爬" : "Want to climb only"}
              </option>
              <option value="climbed">
                {isZh ? "只看已爬" : "Climbed only"}
              </option>
            </select>
          )}
          <select
            className="rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold text-bark outline-none transition focus:border-forest"
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | RouteStatus)
            }
            value={statusFilter}
          >
            {routeStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all"
                  ? isZh
                    ? "全部状态"
                    : "All statuses"
                  : option}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold text-bark outline-none transition focus:border-forest"
            onChange={(event) => setSectorFilter(event.target.value)}
            value={sectorFilter}
          >
            <option value="all">{isZh ? "全部区域" : "All sectors"}</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid max-h-[32rem] gap-2 overflow-y-auto pr-1 md:grid-cols-2">
        {filteredRoutes.map((route) => {
          const status = route.status ?? "highlight";
          const linkStatus = getPrimaryLinkStatus(route);
          const personalStatus = getSavedStatus(destinationSlug, route.id);

          return (
            <Link
              className="group rounded-md border border-ridge/20 bg-parchment/65 p-3 transition hover:border-forest/40 hover:bg-parchment"
              href={`/destinations/${destinationSlug}/routes/${route.id}`}
              key={route.id}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-black text-forest underline decoration-forest/30 underline-offset-4 group-hover:decoration-forest">
                  {route.name}
                </span>
                <span className="rounded-full border border-bark/10 bg-white/70 px-2 py-1 text-[11px] font-black text-bark">
                  {route.grade}
                </span>
                <span className="rounded-full border border-forest/20 bg-forest/10 px-2 py-1 text-[11px] font-black text-forest">
                  {route.type}
                </span>
                <span className="rounded-full border border-ridge/25 bg-white/55 px-2 py-1 text-[11px] font-black text-bark/60">
                  {status === "metadata" && route.metadataKind === "area-index"
                    ? isZh
                      ? "????"
                      : "area index"
                    : status}
                </span>
                {linkStatus && (
                  <span
                    className={`rounded-full border px-2 py-1 text-[11px] font-black ${linkStatusStyles[linkStatus]}`}
                  >
                    {getLinkStatusLabel(linkStatus, isZh)}
                  </span>
                )}
                {route.sector && (
                  <span className="rounded-full border border-ridge/25 bg-white/55 px-2 py-1 text-[11px] font-black text-bark/60">
                    {route.sector}
                  </span>
                )}
                {personalStatus && (
                  <span className="rounded-full border border-sunlit/40 bg-sunlit/20 px-2 py-1 text-[11px] font-black text-bark">
                    {personalStatus === "want-to-climb"
                      ? isZh
                        ? "想爬"
                        : "want"
                      : isZh
                        ? "已爬"
                        : "climbed"}
                  </span>
                )}
                <span className="rounded-full border border-ridge/25 bg-white/55 px-2 py-1 text-[11px] font-black text-bark/60">
                  {isZh
                    ? `${route.sources.length} 个来源`
                    : `${route.sources.length} sources`}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-bark/65">
                {getRouteSummary(route, locale)}
              </p>
            </Link>
          );
        })}
      </div>

      {filteredRoutes.length === 0 && (
        <p className="mt-4 rounded-md border border-dashed border-ridge/35 bg-parchment/60 p-4 text-sm font-bold text-bark/65">
          {isZh
            ? "没有匹配路线。换一个关键词、类型、区域或状态试试。"
            : "No matching routes. Try another keyword, type, sector, or status."}
        </p>
      )}
    </section>
  );
}
