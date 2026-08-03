"use client";

import Link from "next/link";
import { ClimbingLogForm, getCompletionStyleLabel } from "@/components/ClimbingLogForm";
import { useLanguage } from "@/components/LanguageProvider";
import { useUserClimbingLogs } from "@/components/UserClimbingLogsProvider";

export function RouteClimbingLogPanel({
  destinationSlug,
  routeId
}: {
  destinationSlug: string;
  routeId: string;
}) {
  const { locale } = useLanguage();
  const { getRouteLogs } = useUserClimbingLogs();
  const routeLogs = getRouteLogs(destinationSlug, routeId);
  const isZh = locale === "zh";

  return (
    <details className="mt-4 border-t border-brandforest/15 pt-4">
      <summary className="cursor-pointer text-sm font-semibold text-brandforest">
        {isZh ? "记录这次攀登" : "Log this climbing session"}
        {routeLogs.length ? ` · ${routeLogs.length}` : ""}
      </summary>
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <ClimbingLogForm destinationSlug={destinationSlug} routeId={routeId} />
        <div className="border-l-0 border-brandforest/15 lg:border-l lg:pl-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">
            {isZh ? "最近记录" : "Recent logs"}
          </p>
          {routeLogs.length ? (
            <ul className="mt-3 grid gap-3">
              {routeLogs.slice(0, 3).map((log) => (
                <li className="border-t border-brandforest/12 pt-3 text-sm" key={log.id}>
                  <p className="font-semibold text-brandforest">
                    {formatLogDate(log.session_date, locale)} · {log.result === "completed" ? (isZh ? "完成" : "Completed") : (isZh ? "尝试" : "Attempted")}
                  </p>
                  {log.completion_style && log.completion_style !== "unspecified" ? (
                    <p className="mt-1 text-xs text-charcoal/55">{getCompletionStyleLabel(log.completion_style, locale)}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-charcoal/60">
              {isZh ? "还没有这条路线的日志。" : "No logs for this route yet."}
            </p>
          )}
          <Link className="text-link mt-4 inline-flex" href="/my-atlas">
            {isZh ? "打开攀岩日志" : "Open climbing journal"} →
          </Link>
        </div>
      </div>
    </details>
  );
}

function formatLogDate(value: string, locale: "en" | "zh") {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-CA", {
    dateStyle: "medium"
  }).format(date);
}
