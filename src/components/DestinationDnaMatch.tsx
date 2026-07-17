"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  dnaDimensionLabels,
  getDestinationDnaMatches
} from "@/lib/climbingDna";
import { loadDnaProfile } from "@/lib/climbingDnaStorage";
import type { DnaDestinationMatch, DnaVector } from "@/types/climbingDna";

const ui = {
  en: {
    eyebrow: "DNA preference match",
    title: "How well does this place fit you?",
    emptyBody:
      "Discover how this destination matches your climbing style, travel preferences, and ideal crag atmosphere.",
    cta: "Discover My Climbing DNA",
    yourMatch: "Your DNA preference match",
    why: "Why you match",
    consider: "Things to consider",
    noGap:
      "No major preference gap stands out. Season, conditions, and local logistics still matter.",
    safety:
      "This is a preference match, not a safety or conditions recommendation."
  },
  zh: {
    eyebrow: "DNA 偏好匹配",
    title: "这个地方与你有多匹配？",
    emptyBody: "看看这个目的地与你的攀岩风格、旅行偏好和理想岩场氛围有多契合。",
    cta: "发现我的攀岩 DNA",
    yourMatch: "你的 DNA 偏好匹配",
    why: "为什么匹配",
    consider: "值得考虑",
    noGap: "没有明显的偏好差距，但季节、当前条件和当地安排仍然重要。",
    safety: "这是偏好匹配，不代表路线安全或当前条件建议。"
  }
};

function getMatchLabel(score: number, locale: "en" | "zh") {
  if (score >= 88) return locale === "zh" ? "偏好高度契合" : "Strong preference match";
  if (score >= 78) return locale === "zh" ? "偏好较为契合" : "Good preference match";
  return locale === "zh" ? "偏好部分契合" : "Mixed preference match";
}

export function DestinationDnaMatch({
  destinationSlug,
  destinationName
}: {
  destinationSlug: string;
  destinationName: string;
}) {
  const { locale } = useLanguage();
  const [scores, setScores] = useState<DnaVector | null>(null);
  const [loaded, setLoaded] = useState(false);
  const text = ui[locale];

  useEffect(() => {
    setScores(loadDnaProfile()?.scores ?? null);
    setLoaded(true);
  }, []);

  const match = useMemo<DnaDestinationMatch | null>(() => {
    if (!scores) return null;
    return (
      getDestinationDnaMatches(scores, locale, 100).find(
        (item) => item.destinationSlug === destinationSlug
      ) ?? null
    );
  }, [scores, destinationSlug, locale]);

  return (
    <section className="border-t border-brandforest/15 px-6 py-10 sm:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
        <div>
          <p className="editorial-kicker text-terracotta">{text.eyebrow}</p>
          <h2 className="display-serif mt-3 text-4xl font-medium leading-tight text-brandforest">
            {text.title}
          </h2>
        </div>

        {!loaded ? (
          <div className="h-40 animate-pulse bg-sand/20" />
        ) : match ? (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-5 border-b border-brandforest/12 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">
                  {text.yourMatch}
                </p>
                <p className="mt-2 text-sm font-semibold text-terracotta">
                  {getMatchLabel(match.score, locale)}
                </p>
              </div>
              <span className="display-serif text-6xl font-medium leading-none text-brandforest">
                {match.score}%
              </span>
            </div>

            <div className="mt-7 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="editorial-kicker text-charcoal/45">{text.why}</p>
                <p className="mt-3 text-base leading-7 text-charcoal/65">
                  {locale === "zh"
                    ? `${destinationName} 与你偏好的${match.alignedDimensions.map((dimension) => dnaDimensionLabels.zh[dimension]).join("、")}体验较为一致。`
                    : `${destinationName} aligns especially well with your preferences for ${match.alignedDimensions.map((dimension) => dnaDimensionLabels.en[dimension].toLowerCase()).join(" and ")}.`}
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-charcoal/62">
                  {match.reasons.map((reason) => (
                    <li className="border-l-2 border-terracotta/55 pl-3" key={reason}>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="editorial-kicker text-charcoal/45">{text.consider}</p>
                <p className="mt-3 text-sm leading-7 text-charcoal/62">
                  {match.watchDimension
                    ? locale === "zh"
                      ? `这里的「${dnaDimensionLabels.zh[match.watchDimension]}」画像低于你的偏好，可能会成为需要取舍的一点。`
                      : `${dnaDimensionLabels.en[match.watchDimension]} is lower here than in your profile, so it may feel like a tradeoff.`
                    : text.noGap}
                </p>
                <p className="mt-5 border-t border-brandforest/10 pt-4 text-xs leading-5 text-charcoal/45">
                  {text.safety}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-l-2 border-terracotta/55 pl-6">
            <p className="max-w-2xl text-lg leading-8 text-charcoal/65">{text.emptyBody}</p>
            <Link className="primary-action mt-7" href="/climbing-dna">
              {text.cta} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
