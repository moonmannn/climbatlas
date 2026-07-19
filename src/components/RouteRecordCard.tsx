"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  formatCheckedDate,
  formatClimbingType,
  formatGradeSystem,
  formatMissingValue,
  formatSourceCount
} from "@/lib/formatters";
import type {
  PublicRouteFacts,
  PublicRouteResource,
  PublicRouteSource
} from "@/lib/routes/public-routes";

type SourceEntry = {
  attribution?: string;
  checkedAt?: string;
  label: string;
  license?: string;
  linkStatus?: PublicRouteResource["linkStatus"];
  resourceType?: PublicRouteResource["type"];
  role?: PublicRouteSource["role"];
  url: string;
};

export function RouteRecordCard({ route }: { route: PublicRouteFacts }) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const equivalentGrades = Object.entries(route.grade.equivalentGrades ?? {}).filter(
    ([system]) => system !== route.grade.primarySystem
  );
  const styleTags = [
    route.style.wallAngle,
    ...route.style.terrainTags,
    ...route.style.movementTags,
    ...route.style.physicalTags
  ].filter(Boolean) as string[];
  const sourceEntries = mergeSourceEntries(route);
  const accessEntries = sourceEntries.filter(isAccessEntry);
  const routeEntries = sourceEntries.filter((entry) => !isAccessEntry(entry));

  return (
    <article className="border-y border-brandforest/15 py-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="route-result-badge bg-brandforest text-cream">
          {formatClimbingType(route.climbingType, locale)}
        </span>
        {route.sourceRecords.length > 0 && (
          <span className="route-result-badge border border-brandforest/15 text-brandforest">
            {formatSourceCount(route.sourceRecords.length, locale)}
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="editorial-kicker text-terracotta">
            {isZh ? "线路事实" : "Route facts"}
          </p>
          <dl className="mt-4 divide-y divide-brandforest/12 border-y border-brandforest/15">
            <Fact label={isZh ? "原始难度" : "Original grade"} value={route.grade.original} />
            <Fact
              label={isZh ? "主要难度体系" : "Primary grade system"}
              value={
                route.grade.primarySystem
                  ? formatGradeSystem(route.grade.primarySystem, locale)
                  : formatMissingValue(locale)
              }
            />
            <Fact
              label={isZh ? "攀岩类型" : "Climbing type"}
              value={formatClimbingType(route.climbingType, locale)}
            />
            <Fact
              label={isZh ? "长度" : "Length"}
              value={route.lengthOriginal ?? formatMissingValue(locale)}
            />
            {route.sectorName ? (
              <Fact label={isZh ? "分区" : "Sector"} value={route.sectorName} />
            ) : route.areaName ? (
              <Fact label={isZh ? "区域" : "Area"} value={route.areaName} />
            ) : null}
          </dl>

          {equivalentGrades.length > 0 && (
            <div className="mt-6">
              <h3 className="route-filter-label">
                {isZh ? "来源中的其他难度" : "Other source grades"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {equivalentGrades.map(([system, grade]) => (
                  <span
                    className="route-result-badge border border-brandforest/15 text-brandforest"
                    key={system}
                  >
                    {formatGradeSystem(system as Parameters<typeof formatGradeSystem>[0], locale)}: {grade}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(route.grade.aidGrade || route.grade.commitmentGrade) && (
            <details className="mt-6 border-y border-brandforest/12 py-4">
              <summary className="cursor-pointer text-sm font-semibold text-brandforest">
                {isZh ? "其他难度信息" : "Additional grade context"}
              </summary>
              <dl className="mt-3 divide-y divide-brandforest/10">
                {route.grade.commitmentGrade && (
                  <Fact
                    label={isZh ? "承诺等级" : "Commitment grade"}
                    value={route.grade.commitmentGrade}
                  />
                )}
                {route.grade.aidGrade && (
                  <Fact
                    label={isZh ? "人工攀登难度" : "Aid grade"}
                    value={route.grade.aidGrade}
                  />
                )}
              </dl>
            </details>
          )}

          {styleTags.length > 0 && (
            <div className="mt-6">
              <h3 className="route-filter-label">
                {isZh ? "已记录特征" : "Recorded characteristics"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {styleTags.map((tag) => (
                  <span
                    className="route-result-badge border border-brandforest/15 text-brandforest"
                    key={tag}
                  >
                    {tag.replaceAll("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <p className="editorial-kicker text-terracotta">
            {isZh ? "来源与外部资料" : "Sources and external resources"}
          </p>
          <h2 className="display-serif mt-3 text-3xl font-medium text-brandforest">
            {isZh ? "核对线路资料" : "Check the route sources"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/62">
            {isZh
              ? "这里区分单条线路资料与目的地访问资料。ClimbAtlas 只做信息整理和导流，不复制 beta、topo、接近路线、保护信息、评论、评分或图片。"
              : "Route-specific references are separated from destination access information. ClimbAtlas organizes traceable links without copying beta, topos, approach notes, protection details, comments, ratings, or photos."}
          </p>

          <SourceSection
            entries={routeEntries}
            emptyText={isZh ? "目前没有可用的单条线路资料。" : "No route-specific resource is available yet."}
            heading={isZh ? "线路来源" : "Route sources"}
            isZh={isZh}
            locale={locale}
          />

          {accessEntries.length > 0 && (
            <SourceSection
              entries={accessEntries}
              heading={isZh ? "当地访问与区域资料" : "Access and local information"}
              isZh={isZh}
              locale={locale}
            />
          )}
        </section>
      </div>
    </article>
  );
}

function SourceSection({
  emptyText,
  entries,
  heading,
  isZh,
  locale
}: {
  emptyText?: string;
  entries: SourceEntry[];
  heading: string;
  isZh: boolean;
  locale: "en" | "zh";
}) {
  return (
    <section className="mt-8">
      <h3 className="route-filter-label">{heading}</h3>
      {entries.length > 0 ? (
        <div className="mt-3 divide-y divide-brandforest/12 border-y border-brandforest/15">
          {entries.map((entry) => (
            <div className="py-5" key={entry.url}>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  className="text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  href={entry.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {entry.label}
                </a>
                <span className="text-xs font-semibold text-charcoal/48">
                  {getResourceLabel(entry.linkStatus, entry.resourceType, isZh)}
                </span>
                {entry.license && (
                  <span className="text-xs font-semibold text-charcoal/48">
                    {entry.license}
                  </span>
                )}
              </div>
              {(entry.attribution || entry.checkedAt) && (
                <p className="mt-2 text-sm leading-6 text-charcoal/58">
                  {entry.attribution}
                  {entry.attribution && entry.checkedAt ? " · " : ""}
                  {entry.checkedAt
                    ? `${isZh ? "检查日期" : "Checked"}: ${formatCheckedDate(entry.checkedAt, locale)}`
                    : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : emptyText ? (
        <p className="mt-3 border-y border-brandforest/15 py-4 text-sm leading-6 text-charcoal/58">
          {emptyText}
        </p>
      ) : null}
    </section>
  );
}

function mergeSourceEntries(route: PublicRouteFacts) {
  const entries = new Map<string, SourceEntry>();

  for (const source of route.sourceRecords) {
    entries.set(normalizeUrl(source.sourceUrl), {
      attribution: source.attribution,
      checkedAt: source.checkedAt,
      label: source.label,
      license: source.license,
      role: source.role,
      url: source.sourceUrl
    });
  }

  for (const resource of route.externalResources) {
    const key = normalizeUrl(resource.url);
    const existing = entries.get(key);
    entries.set(key, {
      ...existing,
      label: resource.title || existing?.label || resource.url,
      linkStatus: resource.linkStatus,
      resourceType: resource.type,
      url: resource.url
    });
  }

  return Array.from(entries.values());
}

function isAccessEntry(entry: SourceEntry) {
  return (
    entry.linkStatus === "area-only" ||
    entry.resourceType === "official" ||
    (entry.role === "access" && entry.linkStatus !== "route-specific")
  );
}

function normalizeUrl(url: string) {
  return url.trim().replace(/\/$/, "").toLowerCase();
}

function getResourceLabel(
  status: PublicRouteResource["linkStatus"],
  type: PublicRouteResource["type"] | undefined,
  isZh: boolean
) {
  if (status === "route-specific") return isZh ? "单条线路页" : "Exact route page";
  if (status === "guidebook-specific") return isZh ? "路书或专题资料" : "Guidebook resource";
  if (status === "area-only" || type === "official") return isZh ? "访问或区域资料" : "Access or area resource";
  return isZh ? "参考来源" : "Reference source";
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
      <dt className="font-semibold text-charcoal/48">{label}</dt>
      <dd className="font-semibold text-brandforest">{value}</dd>
    </div>
  );
}
