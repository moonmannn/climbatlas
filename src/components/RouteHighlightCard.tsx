"use client";

import { useState, type KeyboardEvent } from "react";
import {
  getRouteBestFor,
  getRouteDecisionHint as getLocalizedRouteDecisionHint,
  getRouteEditorialTips,
  getRoutePracticeFocus,
  getRouteStyle,
  getRouteSummary
} from "@/data/localizedContent";
import { useLanguage } from "@/components/LanguageProvider";
import { getUiText } from "@/lib/uiText";
import type { ExternalResource, RouteHighlight } from "@/types/destination";
import {
  getRouteDecisionHint as getRouteFinderDecisionHint,
  getRoutePersonalityTags
} from "@/lib/routeFinder";

type RouteHighlightCardProps = {
  route: RouteHighlight;
};

type RouteTab = "overview" | "photos" | "practice" | "story";

const tabDefinitions: Array<{ id: RouteTab; label: { en: string; zh: string } }> = [
  { id: "overview", label: { en: "Overview", zh: "概览" } },
  { id: "photos", label: { en: "Photos", zh: "照片" } },
  { id: "practice", label: { en: "Practice", zh: "练习" } },
  { id: "story", label: { en: "Story / Links", zh: "故事 / 链接" } }
];

const imageTypeLabels = {
  en: {
    route: "Exact route photo",
    "area-context": "Area context photo, not exact route",
    "destination-context": "Destination context photo"
  },
  zh: {
    route: "精确路线照片",
    "area-context": "区域环境照片，不是精确路线",
    "destination-context": "目的地环境照片"
  }
};

export function RouteHighlightCard({ route }: RouteHighlightCardProps) {
  const [activeTab, setActiveTab] = useState<RouteTab>("overview");
  const { locale } = useLanguage();
  const t = getUiText(locale);
  const sourceCount = route.sources.length;
  const personalityTags = getRoutePersonalityTags(route);
  const decisionHint =
    getLocalizedRouteDecisionHint(route, locale) ||
    getRouteFinderDecisionHint(route);
  const style = getRouteStyle(route, locale);
  const summary = getRouteSummary(route, locale);
  const bestFor = getRouteBestFor(route, locale);
  const practiceFocus = getRoutePracticeFocus(route, locale);
  const editorialTips = getRouteEditorialTips(route, locale);
  const historicalNote =
    route.historicalNotes?.[locale] ?? route.historicalNotes?.en;
  const publicExternalResources = (route.externalResources ?? []).filter(
    (resource) => resource.linkStatus !== "needs-upgrade"
  );
  const hasStoryContent =
    Boolean(historicalNote) ||
    Boolean(route.notableAscents?.length) ||
    publicExternalResources.length > 0;
  const hasStoryNarrative =
    Boolean(historicalNote) || Boolean(route.notableAscents?.length);
  const availableTabs = tabDefinitions.filter((tab) => {
    if (tab.id === "photos") return route.images.length > 0;
    if (tab.id === "practice") {
      return practiceFocus.length > 0 || editorialTips.length > 0;
    }
    if (tab.id === "story") return hasStoryContent;
    return true;
  });

  function focusTab(tab: RouteTab) {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      document.getElementById(`route-tab-${route.id}-${tab}`)?.focus();
    });
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentTab: RouteTab
  ) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = availableTabs.findIndex((tab) => tab.id === currentTab);
    if (event.key === "Home") return focusTab(availableTabs[0].id);
    if (event.key === "End") return focusTab(availableTabs.at(-1)!.id);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + availableTabs.length) % availableTabs.length;
    focusTab(availableTabs[nextIndex].id);
  }

  return (
    <article
      className="handdrawn-card scroll-mt-6 overflow-hidden bg-white/55"
      id={`route-${route.id}`}
    >
      <div className="border-b border-ridge/25 bg-parchment/70 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-forest px-3 py-1 text-xs font-black uppercase tracking-wide text-parchment">
            {route.type}
          </span>
          <span className="rounded-full border border-ridge/35 bg-white/60 px-3 py-1 text-xs font-black text-bark">
            {route.grade}
          </span>
          <span className="rounded-full border border-ridge/35 bg-white/60 px-3 py-1 text-xs font-black text-bark">
            {route.length}
          </span>
          <span className="rounded-full border border-forest/25 bg-forest/10 px-3 py-1 text-xs font-black text-forest">
            {t.sourceCount(sourceCount)}
          </span>
        </div>

        <h3 className="mt-4 text-3xl font-black text-bark">{route.name}</h3>
        <p className="mt-2 text-base font-bold text-forest">{style}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {personalityTags.map((tag) => (
            <span
              className="rounded-md border border-ridge/30 bg-white/55 px-3 py-1 text-xs font-black text-bark/70"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {availableTabs.length > 1 && (
        <div className="border-b border-ridge/25 bg-white/35 px-4 pt-4">
          <div
            aria-label={locale === "zh" ? "路线详情" : "Route details"}
            className="flex gap-2 overflow-x-auto"
            role="tablist"
          >
          {availableTabs.map((tab) => (
            <button
              aria-controls={`route-panel-${route.id}-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={`shrink-0 rounded-t-md border border-b-0 px-4 py-2 text-sm font-black transition ${
                activeTab === tab.id
                  ? "border-ridge/35 bg-parchment text-bark"
                  : "border-transparent bg-transparent text-bark/55 hover:text-bark"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-inset`}
              id={`route-tab-${route.id}-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
              role="tab"
              tabIndex={activeTab === tab.id ? 0 : -1}
              type="button"
            >
              {tab.label[locale]}
            </button>
          ))}
          </div>
        </div>
      )}

      <div
        aria-label={
          availableTabs.length === 1
            ? locale === "zh"
              ? "路线概览"
              : "Route overview"
            : undefined
        }
        aria-labelledby={
          availableTabs.length > 1
            ? `route-tab-${route.id}-${activeTab}`
            : undefined
        }
        className="p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-inset sm:p-6"
        id={`route-panel-${route.id}-${activeTab}`}
        role={availableTabs.length > 1 ? "tabpanel" : "region"}
        tabIndex={availableTabs.length > 1 ? 0 : undefined}
      >
        {activeTab === "overview" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                {t.originalNote}
              </h4>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-bark/75">
                {summary}
              </p>
              <div className="mt-4 rounded-md border border-forest/20 bg-forest/10 p-4">
                <h4 className="text-xs font-black uppercase tracking-[0.18em] text-forest">
                  {t.whenToPickIt}
                </h4>
                <p className="mt-2 text-sm font-bold leading-6 text-bark/75">
                  {decisionHint}
                </p>
              </div>
            </div>

            <div className="rounded-md border border-ridge/25 bg-parchment/70 p-4">
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                {t.bestFor}
              </h4>
              <p className="mt-2 text-sm leading-6 text-bark/75">
                {bestFor}
              </p>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                {locale === "zh" ? "来源" : "Sources"}
              </h4>
              <div className="mt-3 grid gap-3">
                {route.sources.map((source) => (
                  <div
                    className="rounded-md border border-ridge/25 bg-white/45 p-4"
                    key={`${source.sourceUrl}-${source.sourceLabel}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <a
                        className="text-sm font-black text-forest underline decoration-forest/40 underline-offset-4"
                        href={source.sourceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {source.sourceLabel}
                      </a>
                      <span className="text-xs font-bold text-bark/55">
                        {locale === "zh" ? "检查日期" : "Checked"}: {source.lastChecked}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "photos" && route.images.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
                {route.images.map((image) => (
                  <figure
                    className="overflow-hidden rounded-md border border-ridge/25 bg-parchment"
                    key={image.src}
                  >
                    <img
                      alt={image.alt}
                      className="h-64 w-full object-cover"
                      src={image.src}
                    />
                    <figcaption className="space-y-1 p-3 text-xs leading-5 text-bark/70">
                      <p className="font-bold text-bark">{image.caption}</p>
                      <p>
                        {imageTypeLabels[locale][image.imageType]}
                      </p>
                      <p>
                        {image.credit} - {image.license}
                      </p>
                      <a
                        className="font-bold text-forest underline decoration-forest/40 underline-offset-4"
                        href={image.sourceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {t.imageSource}
                      </a>
                    </figcaption>
                  </figure>
                ))}
          </div>
        )}

        {activeTab === "practice" && (
          <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                {t.practiceFocus}
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {practiceFocus.map((focus) => (
                  <span
                    className="rounded-md bg-bark px-3 py-2 text-xs font-bold text-parchment"
                    key={focus}
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                {t.editorialTips}
              </h4>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-bark/75">
                {editorialTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "story" && hasStoryContent && (
          <div
            className={`grid gap-5 ${
              hasStoryNarrative && publicExternalResources.length > 0
                ? "lg:grid-cols-[1fr_18rem]"
                : ""
            }`}
          >
            {hasStoryNarrative && (
              <div className="space-y-4">
              {historicalNote && (
                <section className="rounded-md border border-ridge/25 bg-parchment/65 p-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                    {locale === "zh" ? "历史小记" : "Historical note"}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-bark/75">
                    {historicalNote}
                  </p>
                </section>
              )}

              {route.notableAscents && route.notableAscents.length > 0 && (
                <section className="rounded-md border border-ridge/25 bg-white/45 p-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                    {locale === "zh"
                      ? "可核验人物记录"
                      : "Verified climber notes"}
                  </h4>
                  <div className="mt-3 grid gap-3">
                    {route.notableAscents.map((ascent) => (
                      <div
                        className="rounded-md border border-ridge/20 bg-parchment/60 p-3"
                        key={`${ascent.climber}-${ascent.sourceUrl}`}
                      >
                        <p className="text-sm font-black text-bark">
                          {ascent.climber}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-bark/70">
                          {ascent.note[locale] ?? ascent.note.en}
                        </p>
                        <a
                          className="mt-2 inline-flex text-xs font-black text-forest underline decoration-forest/40 underline-offset-4"
                          href={ascent.sourceUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {ascent.sourceLabel}
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              </div>
            )}

            {publicExternalResources.length > 0 && (
              <aside className="rounded-md border border-ridge/25 bg-parchment/70 p-4">
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                {locale === "zh" ? "外部资料" : "External resources"}
              </h4>
              <p className="mt-2 text-xs leading-5 text-bark/60">
                {locale === "zh"
                  ? "这些链接会离开 ClimbAtlas。我们只做导流，不复制 beta、topo、路书正文或用户评论。"
                  : "These links leave ClimbAtlas. We point outward without copying beta, topos, guidebook text, or user comments."}
              </p>

                <div className="mt-4 grid gap-3">
                  {publicExternalResources.map((resource) => (
                    <a
                      className="rounded-md border border-ridge/25 bg-white/45 p-3 transition hover:border-forest/35 hover:bg-white/70"
                      href={resource.url}
                      key={`${resource.url}-${resource.title}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-black uppercase text-ridge">
                          {getResourceLabel(resource, locale === "zh")}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm font-black text-forest underline decoration-forest/35 underline-offset-4">
                        {resource.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-bark/65">
                        {resource.description[locale] ??
                          resource.description.en}
                      </span>
                    </a>
                  ))}
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function getResourceLabel(resource: ExternalResource, isZh: boolean) {
  if (resource.linkStatus === "route-specific") {
    return isZh ? "线路页面" : "Route page";
  }

  if (resource.linkStatus === "guidebook-specific") {
    return isZh ? "路书或专题资料" : "Guidebook or feature";
  }

  if (resource.linkStatus === "area-only") {
    return isZh ? "区域资料" : "Area resource";
  }

  return isZh ? "外部资料" : "External resource";
}
