"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  getDnaDimensionLabel,
  getLocalizedDnaText
} from "@/lib/climbingDna";
import { loadDnaProfile } from "@/lib/climbingDnaStorage";
import { getRouteDnaMatch } from "@/lib/routes/route-dna";
import type { DnaVector } from "@/types/climbingDna";
import type { RouteDnaSnapshot } from "@/types/route-dna";

const inputLabels = {
  en: {
    climbingType: "climbing type",
    originalGrade: "original grade",
    lengthMeters: "recorded length",
    pitches: "pitch count",
    controlledTags: "recorded route characteristics",
    dnaProfile: "reviewed route profile"
  },
  zh: {
    climbingType: "攀岩类型",
    originalGrade: "原始等级",
    lengthMeters: "记录长度",
    pitches: "段数",
    controlledTags: "已记录的线路特征",
    dnaProfile: "已审核的线路画像"
  }
};

function matchLabel(score: number, isZh: boolean) {
  if (score >= 88) return isZh ? "强偏好匹配" : "Strong preference match";
  if (score >= 78) return isZh ? "良好偏好匹配" : "Good preference match";
  return isZh ? "混合偏好匹配" : "Mixed preference match";
}

function originLabel(origin: RouteDnaSnapshot["origin"], isZh: boolean) {
  if (origin === "source") return isZh ? "线路画像来自已引用资料" : "Route profile from cited information";
  if (origin === "editorial") return isZh ? "ClimbAtlas 已审核线路画像" : "ClimbAtlas reviewed route profile";
  return isZh ? "ClimbAtlas 推断的线路画像" : "ClimbAtlas inferred route profile";
}

export function RouteDnaMatchPanel({
  routeName,
  snapshot
}: {
  routeName: string;
  snapshot: RouteDnaSnapshot;
}) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const [scores, setScores] = useState<DnaVector | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setScores(loadDnaProfile()?.scores ?? null);
    setLoaded(true);
  }, []);

  const match = useMemo(
    () => scores ? getRouteDnaMatch(scores, snapshot) : null,
    [scores, snapshot]
  );

  if (!loaded) {
    return <div className="mt-6 h-44 animate-pulse bg-sand/25" />;
  }

  if (!match) {
    return (
      <section className="mt-6 border-y border-brandforest/15 py-7">
        <p className="editorial-kicker text-terracotta">
          {isZh ? "路线 DNA 偏好匹配" : "Route DNA preference match"}
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display-serif text-3xl font-medium text-brandforest">
              {isZh ? "这条路线适合你的偏好吗？" : "Does this route fit your preferences?"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/60">
              {isZh
                ? "完成 10 题 Climbing DNA 测试后，这里会显示偏好匹配、理由和需要考虑的取舍。"
                : "Complete the 10-question Climbing DNA quiz to see preference fit, reasons, and tradeoffs here."}
            </p>
          </div>
          <Link className="primary-action shrink-0" href="/climbing-dna">
            {isZh ? "开始 DNA 测试" : "Take the DNA quiz"} →
          </Link>
        </div>
      </section>
    );
  }

  const inputs = snapshot.inputs.map(
    (input) => inputLabels[locale][input as keyof typeof inputLabels.en] ?? input
  );

  return (
    <section className="route-dna-panel mt-6 border-y border-brandforest/15 py-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="editorial-kicker text-terracotta">
            {isZh ? "你的线路偏好匹配" : "Your route preference match"}
          </p>
          <h2 className="display-serif mt-2 text-3xl font-medium text-brandforest">
            {routeName}
          </h2>
          <p className="mt-2 text-sm font-semibold text-terracotta">
            {matchLabel(match.score, isZh)}
          </p>
        </div>
        <div className="flex items-baseline gap-2 text-brandforest">
          <strong className="display-serif text-6xl font-medium leading-none">
            {match.score}
          </strong>
          <span className="max-w-28 text-sm font-semibold">
            % {isZh ? "DNA 偏好匹配" : "DNA preference match"}
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-8 border-t border-brandforest/12 pt-7 md:grid-cols-2">
        <div>
          <h3 className="editorial-kicker text-charcoal/48">
            {isZh ? "为什么适合" : "Why it fits"}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {match.alignedDimensions.map((dimension) => (
              <span className="route-result-badge border border-brandforest/15 text-brandforest" key={dimension}>
                {getDnaDimensionLabel(dimension, locale)}
              </span>
            ))}
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-charcoal/64">
            {match.reasons.map((reason) => (
              <li className="border-l-2 border-terracotta/55 pl-3" key={reason.en}>
                {getLocalizedDnaText(reason, locale)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="editorial-kicker text-charcoal/48">
            {isZh ? "值得考虑" : "Things to consider"}
          </h3>
          {match.considerations.length > 0 ? (
            <ul className="mt-5 space-y-3 text-sm leading-6 text-charcoal/64">
              {match.considerations.map((item) => (
                <li className="border-l-2 border-sky/70 pl-3" key={item.en}>
                  {getLocalizedDnaText(item, locale)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm leading-6 text-charcoal/60">
              {isZh
                ? "目前没有明显偏好落差；季节、当天条件、经验和当地信息仍然需要单独判断。"
                : "No large preference gap stands out. Season, current conditions, experience, and local information still need separate judgment."}
            </p>
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2 border-t border-brandforest/10 pt-5 text-xs leading-5 text-charcoal/48 sm:flex-row sm:items-start sm:justify-between">
        <p>
          <strong className="text-brandforest">
            {originLabel(snapshot.origin, isZh)}
          </strong>
          {" · "}{isZh ? "依据" : "Based on"}: {inputs.join(isZh ? "、" : ", ")}
        </p>
        <p className="max-w-md sm:text-right">
          {isZh
            ? "这是路线偏好匹配，不是安全、能力、天气或当前条件建议。"
            : "This is a route-preference match, not safety, ability, weather, or current-conditions advice."}
        </p>
      </div>
    </section>
  );
}
