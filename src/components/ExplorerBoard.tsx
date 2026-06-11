"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { RouteFinder } from "@/components/RouteFinder";
import { getUiText } from "@/lib/uiText";
import type { RouteFinderCandidate } from "@/lib/routeFinder";

type ExplorerBoardProps = {
  mapPreview: ReactNode;
  routeFinderCandidates: RouteFinderCandidate[];
  totalDestinations: number;
};

const logCards = [
  {
    title: "Climbed routes",
    titleZh: "已爬路线",
    label: "Field log",
    labelZh: "野外记录",
    body:
      "Beta feedback will decide how saved logs work. Later accounts can let climbers mark real routes they have climbed and keep a personal history.",
    bodyZh:
      "Beta 反馈会帮助决定保存记录怎么做。未来真实账号可以让攀岩者标记实际爬过的路线，并保留个人历史。"
  },
  {
    title: "Wishlist",
    titleZh: "想爬清单",
    label: "Quest list",
    labelZh: "任务清单",
    body:
      "A future wishlist can save routes that match your style, season, or next trip plan once we know testers want it.",
    bodyZh:
      "如果 Beta 用户确实需要，未来想爬清单可以保存适合你风格、季节或下一次旅行计划的路线。"
  },
  {
    title: "Personal notes",
    titleZh: "个人笔记",
    label: "Private notes",
    labelZh: "私人笔记",
    body:
      "A future private space for conditions, training reminders, and reflections written by the user, not seeded demo notes.",
    bodyZh:
      "未来用于记录条件、训练提醒和用户自己的攀登反思，不会预填假的示例笔记。"
  }
];

export function ExplorerBoard({
  mapPreview,
  routeFinderCandidates,
  totalDestinations
}: ExplorerBoardProps) {
  const { locale } = useLanguage();
  const t = getUiText(locale);
  const wholeAtlasLabel = locale === "zh" ? "整个地图" : "the whole atlas";

  return (
    <section className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 pb-8 pt-24 text-bark sm:px-6 lg:grid-cols-[20rem_1fr] lg:px-8">
      <aside className="medieval-panel paper-texture p-5">
        <p className="field-note-label text-antiquegold">{t.explorerBoard}</p>
        <h1 className="mt-2 text-4xl font-black leading-none text-parchment">
          {t.chooseNextClimb}
        </h1>
        <p className="mt-4 text-sm font-bold leading-6 text-parchment/75">
          {t.explorerIntro}
        </p>

        <div className="ink-divider my-5" />

        <dl className="grid gap-3 text-parchment">
          <div className="rounded-md border border-antiquegold/25 bg-bark/35 p-3">
            <dt className="field-note-label text-antiquegold">
              {t.destinations}
            </dt>
            <dd className="mt-1 text-3xl font-black">{totalDestinations}</dd>
          </div>
          <div className="rounded-md border border-antiquegold/25 bg-bark/35 p-3">
            <dt className="field-note-label text-antiquegold">{t.routeCards}</dt>
            <dd className="mt-1 text-3xl font-black">
              {routeFinderCandidates.length}
            </dd>
          </div>
        </dl>
      </aside>

      <div className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
          <div className="medieval-panel overflow-hidden bg-bark">
            <div className="flex items-center justify-between border-b border-antiquegold/25 bg-bark px-4 py-3 text-parchment">
              <div>
                <p className="field-note-label text-antiquegold">{t.atlasMap}</p>
                <h2 className="text-xl font-black">{t.knownClimbingRealms}</h2>
              </div>
              <span className="rounded-full border border-antiquegold/25 px-3 py-1 text-xs font-black text-parchment/75">
                {t.compactPreview}
              </span>
            </div>
            <div className="h-[340px]">{mapPreview}</div>
          </div>

          <div className="medieval-panel paper-texture p-5">
            <p className="field-note-label text-antiquegold">{t.savedLogs}</p>
            <h2 className="mt-2 text-2xl font-black text-parchment">
              {t.yourFutureRecord}
            </h2>
            <p className="mt-3 text-sm font-bold leading-6 text-parchment/70">
              {t.savedLogsBody}
            </p>

            <div className="mt-5 grid gap-3">
              {logCards.map((card) => (
                <article
                  className="scroll-card bg-parchment/95 p-4"
                  key={card.title}
                >
                  <p className="field-note-label text-ridge">
                    {locale === "zh" ? card.labelZh : card.label}
                  </p>
                  <h3 className="mt-1 text-lg font-black text-bark">
                    {locale === "zh" ? card.titleZh : card.title}
                  </h3>
                  <p className="mt-2 text-sm font-bold leading-5 text-bark/70">
                    {locale === "zh" ? card.bodyZh : card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <RouteFinder
          candidates={routeFinderCandidates}
          scopeLabel={wholeAtlasLabel}
          variant="board"
        />
      </div>
    </section>
  );
}
