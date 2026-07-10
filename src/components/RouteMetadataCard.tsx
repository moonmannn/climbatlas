"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type {
  ExternalLinkStatus,
  ExternalResource,
  RouteHighlight
} from "@/types/destination";

type RouteMetadataCardProps = {
  route: RouteHighlight;
};

const trustStyles = {
  high: "border-forest/25 bg-forest/10 text-forest",
  medium: "border-sunlit/45 bg-sunlit/20 text-bark",
  low: "border-ridge/35 bg-white/55 text-bark/65"
};

const linkStatusStyles: Record<ExternalLinkStatus, string> = {
  "route-specific": "border-forest/25 bg-forest/10 text-forest",
  "guidebook-specific": "border-sunlit/45 bg-sunlit/20 text-bark",
  "area-only": "border-ridge/35 bg-white/60 text-bark/65",
  "needs-upgrade": "border-red-900/20 bg-red-900/10 text-red-950"
};

function getLinkStatusLabel(status: ExternalLinkStatus | undefined, isZh: boolean) {
  const value = status ?? "needs-upgrade";

  const labels: Record<ExternalLinkStatus, { en: string; zh: string }> = {
    "route-specific": {
      en: "Exact route page",
      zh: "精确线路页"
    },
    "guidebook-specific": {
      en: "Guidebook/resource page",
      zh: "路书/资源页"
    },
    "area-only": {
      en: "Area fallback",
      zh: "区域备用链接"
    },
    "needs-upgrade": {
      en: "Needs link upgrade",
      zh: "待升级外链"
    }
  };

  return isZh ? labels[value].zh : labels[value].en;
}

function getLinkDescription(resource: ExternalResource, isZh: boolean) {
  if (resource.linkStatus === "route-specific") {
    return isZh
      ? "这个链接应直达单条线路页面。ClimbAtlas 只做导流，不复制外站 beta、评论、评分或图片。"
      : "This link should open a single-route page. ClimbAtlas links out only and does not copy beta, comments, ratings, or photos.";
  }

  if (resource.linkStatus === "guidebook-specific") {
    return isZh
      ? "这个链接指向相关路书或资源页。完整路线信息请以外部资料为准。"
      : "This link points to a related guidebook or resource page. Use the external source for full route information.";
  }

  if (resource.linkStatus === "area-only") {
    return isZh
      ? "目前这是区域备用链接，不一定直达这条线路。打开后请在外部网站内再次确认线路名。"
      : "This is currently an area fallback, not necessarily the exact route page. Confirm the route name on the external site.";
  }

  return isZh
    ? "这条线路还需要更精确的外链。"
    : "This route still needs a more precise outbound link.";
}

export function RouteMetadataCard({ route }: RouteMetadataCardProps) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const isAreaIndex = route.metadataKind === "area-index";

  return (
    <article className="handdrawn-card overflow-hidden bg-white/55">
      <div className="border-b border-ridge/25 bg-parchment/70 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-bark px-3 py-1 text-xs font-black uppercase tracking-wide text-parchment">
            {isAreaIndex
              ? isZh
                ? "区域索引"
                : "area index"
              : "metadata"}
          </span>
          <span className="rounded-full bg-forest px-3 py-1 text-xs font-black uppercase tracking-wide text-parchment">
            {route.type}
          </span>
          <span className="rounded-full border border-ridge/35 bg-white/60 px-3 py-1 text-xs font-black text-bark">
            {route.grade}
          </span>
          <span className="rounded-full border border-ridge/35 bg-white/60 px-3 py-1 text-xs font-black text-bark">
            {route.length}
          </span>
          {route.sector && (
            <span className="rounded-full border border-ridge/35 bg-white/60 px-3 py-1 text-xs font-black text-bark/70">
              {route.sector}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-3xl font-black text-bark">{route.name}</h3>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-bark/70">
          {isAreaIndex
            ? isZh
              ? "这是区域或 sector 索引，不是单条线路。它帮助你理解目的地结构，并跳转到外部区域资料。"
              : "This is an area or sector index, not a single route. It helps explain the destination structure and links to external area resources."
            : isZh
              ? "这是 metadata-only 路线索引。ClimbAtlas 只展示基础事实和外链，不复制 beta、topo、approach、保护信息、评论、评分或图片。"
              : "This is a metadata-only route index entry. ClimbAtlas shows basic facts and outbound links only; it does not copy beta, topos, approach notes, protection details, comments, ratings, or photos."}
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_18rem]">
        <section>
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
            {isZh ? "基础信息" : "Basic facts"}
          </h4>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <Fact label={isZh ? "等级" : "Grade"} value={route.grade} />
            <Fact label={isZh ? "类型" : "Type"} value={route.type} />
            <Fact label={isZh ? "长度/形式" : "Length"} value={route.length} />
            <Fact label={isZh ? "区域" : "Sector"} value={route.sector ?? "TBD"} />
          </dl>

          <div className="mt-5 rounded-md border border-forest/20 bg-forest/10 p-4">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-forest">
              {isZh ? "下一步" : "Next step"}
            </h4>
            <p className="mt-2 text-sm font-bold leading-6 text-bark/75">
              {isAreaIndex
                ? isZh
                  ? "先打开区域资料，再选择有精确线路页或最新路书支持的具体线路。"
                  : "Open the area resource, then choose a specific route supported by an exact route page or current guidebook."
                : isZh
                  ? "如果这条线看起来适合你，请打开外部资料查看最新 beta、路况、保护、approach、下降和当地规定。"
                  : "If this line looks right for you, open the external resources for current beta, conditions, protection, approach, descent, and local rules."}
            </p>
          </div>
        </section>

        <aside className="rounded-md border border-ridge/25 bg-parchment/70 p-4">
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
            {isZh ? "外部资料" : "External resources"}
          </h4>
          <p className="mt-2 text-xs leading-5 text-bark/60">
            {isZh
              ? "这些链接会离开 ClimbAtlas。我们只做导流和来源标注。"
              : "These links leave ClimbAtlas. We provide source trails and navigation only."}
          </p>

          {route.externalResources && route.externalResources.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {route.externalResources.map((resource) => {
                const status = resource.linkStatus ?? "needs-upgrade";

                return (
                  <a
                    className="rounded-md border border-ridge/25 bg-white/45 p-3 transition hover:border-forest/35 hover:bg-white/70"
                    href={resource.url}
                    key={`${resource.url}-${resource.title}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-black uppercase ${linkStatusStyles[status]}`}
                    >
                      {getLinkStatusLabel(status, isZh)}
                    </span>
                    <span className="mt-2 block text-sm font-black text-forest underline decoration-forest/35 underline-offset-4">
                      {resource.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-bark/65">
                      {getLinkDescription(resource, isZh)}
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 rounded-md border border-dashed border-ridge/35 bg-white/35 p-3 text-xs font-bold leading-5 text-bark/60">
              {isZh
                ? "还没有外链，不能作为正式索引发布。"
                : "No outbound links yet; this entry is not ready for publication."}
            </p>
          )}
        </aside>

        <section className="lg:col-span-2">
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
            {isZh ? "来源包" : "Source pack"}
          </h4>
          <div className="mt-3 grid gap-3">
            {route.sources.map((source) => (
              <div
                className="rounded-md border border-ridge/25 bg-white/45 p-4"
                key={`${source.sourceUrl}-${source.sourceLabel}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    className="text-sm font-black text-forest underline decoration-forest/40 underline-offset-4"
                    href={source.sourceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {source.sourceLabel}
                  </a>
                  <span
                    className={`rounded-full border px-2 py-1 text-[11px] font-black uppercase ${trustStyles[source.trustLevel]}`}
                  >
                    {source.trustLevel} trust
                  </span>
                  <span className="rounded-full border border-ridge/25 bg-parchment/70 px-2 py-1 text-[11px] font-bold text-bark/65">
                    {source.type}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold leading-5 text-bark/65">
                  {isZh ? "验证内容" : "Verifies"}: {source.verifies.join(", ")}.{" "}
                  {isZh ? "最后检查" : "Last checked"}: {source.lastChecked}.
                </p>
                <p className="mt-1 text-xs leading-5 text-bark/60">
                  {source.notes}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ridge/25 bg-white/45 p-4">
      <dt className="text-[11px] font-black uppercase tracking-wide text-bark/55">
        {label}
      </dt>
      <dd className="mt-2 text-lg font-black text-bark">{value}</dd>
    </div>
  );
}
