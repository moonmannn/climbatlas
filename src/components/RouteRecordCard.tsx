"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type {
  PublicRouteFacts,
  PublicRouteResource
} from "@/lib/routes/public-routes";

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
  const publicResources = route.externalResources;

  return (
    <article className="border-y border-brandforest/15 py-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="route-result-badge bg-brandforest text-cream">
          {isZh ? "路线信息" : "Route facts"}
        </span>
        <span className="route-result-badge border border-brandforest/15 text-brandforest">
          {route.climbingType}
        </span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="editorial-kicker text-terracotta">
            {isZh ? "基础信息" : "Route facts"}
          </p>
          <dl className="mt-4 divide-y divide-brandforest/12 border-y border-brandforest/15">
            <Fact label={isZh ? "原始等级" : "Original grade"} value={route.grade.original} />
            <Fact
              label={isZh ? "主要等级体系" : "Primary grade system"}
              value={route.grade.primarySystem ?? (isZh ? "无法安全分类" : "Not safely classified")}
            />
            <Fact label={isZh ? "类型" : "Climbing type"} value={route.climbingType} />
            <Fact
              label={isZh ? "长度" : "Length"}
              value={route.lengthOriginal ?? (isZh ? "来源未提供" : "Not provided by source")}
            />
            <Fact
              label={isZh ? "区域" : "Sector"}
              value={route.sectorName ?? route.areaName ?? (isZh ? "来源未提供" : "Not provided")}
            />
          </dl>

          {equivalentGrades.length > 0 && (
            <div className="mt-6">
              <h3 className="route-filter-label">
                {isZh ? "来源中的其他等级" : "Other source grades"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {equivalentGrades.map(([system, grade]) => (
                  <span
                    className="route-result-badge border border-brandforest/15 text-brandforest"
                    key={system}
                  >
                    {system}: {grade}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(route.grade.aidGrade || route.grade.commitmentGrade) && (
            <details className="mt-6 border-y border-brandforest/12 py-4">
              <summary className="cursor-pointer text-sm font-semibold text-brandforest">
                {isZh ? "更多等级信息" : "Additional grade context"}
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
                    label={isZh ? "人工攀登等级" : "Aid grade"}
                    value={route.grade.aidGrade}
                  />
                )}
              </dl>
            </details>
          )}

          {styleTags.length > 0 && (
            <div className="mt-6">
              <h3 className="route-filter-label">{isZh ? "已记录特征" : "Recorded characteristics"}</h3>
              <div className="flex flex-wrap gap-2">
                {styleTags.map((tag) => (
                  <span className="route-result-badge border border-brandforest/15 text-brandforest" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <p className="editorial-kicker text-terracotta">
            {isZh ? "来源与下一步" : "Sources and next step"}
          </p>
          <h2 className="display-serif mt-3 text-3xl font-medium text-brandforest">
            {isZh ? "从原始资料继续查看" : "Continue with the original source"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/62">
            {isZh
              ? "本页整理可追溯的路线信息和来源链接，不复制 beta、topo、接近路线、保护信息、评论、评分或图片。"
              : "This page organizes traceable route facts and source links without copying beta, topos, approach notes, protection details, comments, ratings, or photos."}
          </p>

          {publicResources.length > 0 ? (
            <div className="mt-6 grid gap-px overflow-hidden border border-brandforest/15 bg-brandforest/15 sm:grid-cols-2">
              {publicResources.map((resource) => (
                <a
                  className="bg-cream p-5 transition-colors hover:bg-white"
                  href={resource.url}
                  key={`${resource.url}-${resource.title}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="route-filter-label">
                    {getResourceLabel(resource.linkStatus, isZh)}
                  </span>
                  <strong className="text-link mt-2 block">{resource.title}</strong>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-6 border-y border-brandforest/15 py-4 text-sm leading-6 text-charcoal/58">
              {isZh
                ? "目前没有可用的外部线路资料。"
                : "No external route resource is available yet."}
            </p>
          )}

          <div className="mt-8">
            <h3 className="route-filter-label">{isZh ? "来源" : "Sources"}</h3>
            <div className="mt-3 divide-y divide-brandforest/12 border-y border-brandforest/15">
              {route.sourceRecords.map((source) => (
                <div className="py-5" key={`${source.sourceUrl}-${source.label}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <a className="text-link" href={source.sourceUrl} rel="noreferrer" target="_blank">
                      {source.label}
                    </a>
                    {source.license && (
                      <span className="text-xs font-semibold text-charcoal/48">
                        {source.license}
                      </span>
                    )}
                  </div>
                  {(source.attribution || source.checkedAt) && (
                    <p className="mt-2 text-sm leading-6 text-charcoal/58">
                      {source.attribution}
                      {source.attribution && source.checkedAt ? " · " : ""}
                      {source.checkedAt
                        ? `${isZh ? "检查日期" : "Checked"}: ${source.checkedAt}`
                        : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function getResourceLabel(
  status: PublicRouteResource["linkStatus"],
  isZh: boolean
) {
  if (status === "route-specific") {
    return isZh ? "线路页面" : "Route page";
  }

  if (status === "guidebook-specific") {
    return isZh ? "路书或专题资料" : "Guidebook or feature";
  }

  if (status === "area-only") {
    return isZh ? "区域资料" : "Area resource";
  }

  return isZh ? "外部资料" : "External resource";
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
      <dt className="font-semibold text-charcoal/48">{label}</dt>
      <dd className="font-semibold text-brandforest">{value}</dd>
    </div>
  );
}
