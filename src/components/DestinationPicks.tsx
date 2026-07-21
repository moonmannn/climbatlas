"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  formatClimbingType,
  formatRouteStyleTag,
  formatSourceCount
} from "@/lib/formatters";
import type { RouteExplorerItem } from "@/types/route-explorer";

export function DestinationPicks({
  destinationName,
  destinationSlug,
  routes
}: {
  destinationName: string;
  destinationSlug: string;
  routes: RouteExplorerItem[];
}) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  if (!routes.length) return null;

  return (
    <section className="border-t border-brandforest/15 px-6 py-10 sm:px-8 lg:py-12" id="picks">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="editorial-kicker text-terracotta">
            {isZh ? "ClimbAtlas 精选" : "ClimbAtlas Picks"}
          </p>
          <h2 className="display-serif mt-3 text-4xl font-medium text-brandforest">
            {isZh ? "先从这 8 条开始认识这里" : `Eight ways into ${destinationName}`}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-charcoal/60">
          {isZh
            ? "这些线路拥有经过审核的双语选择建议和可追溯体验信息。它们不是完整路书，也不会替你判断能力或安全。"
            : "These routes include reviewed bilingual decision notes and traceable experience information. They are not guidebooks, ability assessments, or safety advice."}
        </p>
      </div>

      <div className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
        {routes.map((route) => {
          const summary = route.summary?.[locale] ?? route.summary?.en;
          return (
            <article className="destination-card" key={route.id}>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-charcoal/50">
                <span>{route.gradeDisplay || route.grade}</span>
                <span aria-hidden="true">·</span>
                <span>{formatClimbingType(route.climbingType, locale)}</span>
              </div>
              <h3 className="display-serif mt-3 text-2xl font-medium leading-tight text-brandforest">
                <Link href={`/destinations/${destinationSlug}/routes/${route.id}`}>
                  {route.name}
                </Link>
              </h3>
              {summary && <p className="mt-3 text-sm leading-6 text-charcoal/62">{summary}</p>}
              {route.styleTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {route.styleTags.slice(0, 3).map((tag) => (
                    <span className="route-result-badge border border-brandforest/15 text-brandforest" key={tag}>
                      {formatRouteStyleTag(tag, locale)}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-5 flex items-center justify-between border-t border-brandforest/10 pt-4 text-xs font-semibold text-charcoal/48">
                <span>{formatSourceCount(route.sourceCount, locale)}</span>
                <Link className="text-link" href={`/destinations/${destinationSlug}/routes/${route.id}`}>
                  {isZh ? "查看体验" : "View experience"} →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
