"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { RouteRecord } from "@/types/route";

export function RouteRecordCard({ route }: { route: RouteRecord }) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const equivalentGrades = Object.entries(route.grade.equivalentGrades ?? {}).filter(
    ([system]) => system !== route.grade.system
  );
  const styleTags = [
    route.style.wallAngle,
    ...route.style.terrainTags,
    ...route.style.movementTags,
    ...route.style.physicalTags
  ].filter(Boolean) as string[];

  return (
    <article className="border-y border-brandforest/15 py-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="route-result-badge bg-brandforest text-cream">
          {isZh ? "来源路线索引" : "source-backed route index"}
        </span>
        <span className="route-result-badge border border-brandforest/15 text-brandforest">
          {route.climbingType}
        </span>
        <span className="route-result-badge border border-brandforest/15 text-brandforest">
          {route.verification.status}
        </span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="editorial-kicker text-terracotta">
            {isZh ? "基础信息" : "Route facts"}
          </p>
          <dl className="mt-4 divide-y divide-brandforest/12 border-y border-brandforest/15">
            <Fact label={isZh ? "原始等级" : "Original grade"} value={route.grade.original} />
            <Fact label={isZh ? "等级体系" : "Grade system"} value={route.grade.system} />
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

          {styleTags.length > 0 && (
            <div className="mt-6">
              <h3 className="route-filter-label">{isZh ? "已确认风格" : "Confirmed style"}</h3>
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
              ? "这是一条轻量路线索引。ClimbAtlas 保留可追溯的基础事实，但不复制 beta、topo、接近路线、保护信息、评论、评分或图片。"
              : "This is a lightweight route index. ClimbAtlas keeps traceable facts but does not copy beta, topos, approach notes, protection details, comments, ratings, or photos."}
          </p>

          <div className="mt-6 grid gap-px overflow-hidden border border-brandforest/15 bg-brandforest/15 sm:grid-cols-2">
            {route.externalResources.map((resource) => (
              <a
                className="bg-cream p-5 transition-colors hover:bg-white"
                href={resource.url}
                key={`${resource.url}-${resource.title}`}
                rel="noreferrer"
                target="_blank"
              >
                <span className="route-filter-label">
                  {resource.linkStatus === "route-specific"
                    ? isZh ? "精确线路页" : "Exact route page"
                    : resource.linkStatus ?? resource.type}
                </span>
                <strong className="text-link mt-2 block">{resource.title}</strong>
              </a>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="route-filter-label">{isZh ? "来源包" : "Source pack"}</h3>
            <div className="mt-3 divide-y divide-brandforest/12 border-y border-brandforest/15">
              {route.sourceRecords.map((source) => (
                <div className="py-5" key={`${source.provider}-${source.externalId ?? source.sourceUrl}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <a className="text-link" href={source.sourceUrl} rel="noreferrer" target="_blank">
                      {source.label}
                    </a>
                    <span className="text-xs font-semibold text-charcoal/48">
                      {source.license ?? (isZh ? "许可未注明" : "license not stated")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-charcoal/58">
                    {source.attribution ?? source.provider}
                    {source.checkedAt ? ` · ${isZh ? "检查于" : "checked"} ${source.checkedAt}` : ""}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-charcoal/48">
                    {isZh ? "支持字段" : "Supports"}: {source.verifiedFields.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
      <dt className="font-semibold text-charcoal/48">{label}</dt>
      <dd className="font-semibold text-brandforest">{value}</dd>
    </div>
  );
}
