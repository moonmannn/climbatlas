"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { dnaArchetypes } from "@/data/dnaArchetypes";
import {
  getDestinationDnaMatches,
  scoreDnaAnswers
} from "@/lib/climbingDna";
import { saveDnaAnswers } from "@/lib/climbingDnaStorage";
import { decodeDnaAnswers } from "@/lib/climbingDnaUrl";
import { dnaDimensions, type DnaDimension } from "@/types/climbingDna";

export type DestinationMatchCardData = {
  slug: string;
  name: string;
  country: string;
  rockType: string;
  climbingTypes: string[];
  bestSeasons: string[];
  routeCount: number;
  image?: { src: string; alt: string };
};

const dimensionNames = {
  en: {
    exploration: "Exploration",
    performance: "Performance",
    adventure: "Adventure",
    social: "Social",
    comfort: "Comfort",
    flow: "Flow"
  },
  zh: {
    exploration: "探索",
    performance: "表现",
    adventure: "冒险",
    social: "社交",
    comfort: "舒适",
    flow: "流动"
  }
};

const factTranslations: Record<string, string> = {
  Spring: "春季",
  Summer: "夏季",
  Fall: "秋季",
  Winter: "冬季",
  sport: "运动攀",
  trad: "传统攀",
  boulder: "抱石",
  "multi-pitch": "多段攀登",
  Granite: "花岗岩",
  Limestone: "石灰岩",
  Sandstone: "砂岩",
  "Dolomite limestone": "白云岩",
  "Jura limestone": "侏罗纪石灰岩",
  "Karst limestone": "喀斯特石灰岩",
  "Coastal sandstone": "海岸砂岩",
  Quartzite: "石英岩",
  "Volcanic tuff": "火山凝灰岩",
  Gneiss: "片麻岩",
  USA: "美国",
  Canada: "加拿大",
  Mexico: "墨西哥",
  France: "法国",
  Greece: "希腊",
  Italy: "意大利",
  Germany: "德国",
  Spain: "西班牙",
  China: "中国",
  Taiwan: "中国台湾",
  Thailand: "泰国",
  Australia: "澳大利亚",
  "South Africa": "南非"
};

const ui = {
  en: {
    archetype: "Your climbing archetype",
    secondary: "with a {name} streak",
    profile: "Your DNA preference profile",
    profileScale: "Preference profile score (0–100)",
    strengths: "Top strengths",
    styles: "Route styles to explore",
    environments: "Environments that may fit",
    matches: "DNA preference matches",
    matchIntro:
      "These places align with your preferences for movement, atmosphere, travel, and challenge—not only grade.",
    why: "Why it fits",
    consider: "Things to consider",
    facts: "Destination snapshot",
    routes: "routes indexed",
    season: "Best seasons",
    open: "Open destination guide",
    explore: "Explore the map",
    retake: "Retake the quiz",
    share: "Share My Climbing DNA",
    shared: "Share link copied",
    shareFailed: "Sharing is not available in this browser",
    invalidTitle: "This result link is incomplete.",
    invalidBody: "Answer all 10 questions to create a valid Climbing DNA profile.",
    start: "Start the quiz",
    note:
      "Matches describe preferences and atmosphere, not route safety or current conditions. Always check current local information before climbing."
  },
  zh: {
    archetype: "你的攀岩人格",
    secondary: "同时带有{name}的倾向",
    profile: "你的 DNA 偏好画像",
    profileScale: "偏好画像分值（0–100）",
    strengths: "你的主要优势",
    styles: "值得探索的路线风格",
    environments: "可能适合你的攀岩环境",
    matches: "DNA 偏好匹配",
    matchIntro: "这些地方匹配的是你的动作、氛围、旅行和挑战偏好，而不只是难度。",
    why: "为什么匹配",
    consider: "值得考虑",
    facts: "目的地速览",
    routes: "条收录路线",
    season: "推荐季节",
    open: "打开目的地攻略",
    explore: "探索地图",
    retake: "重新测试",
    share: "分享我的攀岩 DNA",
    shared: "分享链接已复制",
    shareFailed: "当前浏览器暂不支持分享",
    invalidTitle: "这个结果链接不完整。",
    invalidBody: "回答全部 10 个问题后，才能生成有效的攀岩 DNA 画像。",
    start: "开始测试",
    note: "匹配结果反映偏好与氛围，不代表路线安全或当前条件。攀登前请始终核对最新当地信息。"
  }
};

function localizeFact(value: string, locale: "en" | "zh") {
  return locale === "zh" ? factTranslations[value] ?? value : value;
}

function getStrongestDimensions(scores: Record<DnaDimension, number>) {
  return [...dnaDimensions]
    .sort((first, second) => scores[second] - scores[first])
    .slice(0, 3);
}

function getMatchLabel(score: number, locale: "en" | "zh") {
  if (score >= 88) return locale === "zh" ? "偏好高度契合" : "Strong preference match";
  if (score >= 78) return locale === "zh" ? "偏好较为契合" : "Good preference match";
  return locale === "zh" ? "偏好部分契合" : "Mixed preference match";
}

export function ClimbingDnaResult({
  encodedAnswers,
  destinations
}: {
  encodedAnswers: string;
  destinations: DestinationMatchCardData[];
}) {
  const { locale } = useLanguage();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const text = ui[locale];
  const destinationBySlug = useMemo(
    () => new Map(destinations.map((destination) => [destination.slug, destination])),
    [destinations]
  );

  const result = useMemo(() => {
    const answers = decodeDnaAnswers(encodedAnswers);
    if (!answers) return null;
    const profile = scoreDnaAnswers(answers);
    const archetype =
      dnaArchetypes.find((item) => item.id === profile.archetypeId) ?? dnaArchetypes[0];
    const secondaryArchetype =
      dnaArchetypes.find((item) => item.id === profile.secondaryArchetypeId) ?? dnaArchetypes[1];
    return {
      answers,
      profile,
      archetype,
      secondaryArchetype,
      matches: getDestinationDnaMatches(profile.scores, locale, 3)
    };
  }, [encodedAnswers, locale]);

  useEffect(() => {
    if (result) saveDnaAnswers(result.answers);
  }, [result]);

  async function shareResult() {
    if (!result) return;
    const shareText =
      locale === "zh"
        ? `我的 ClimbAtlas 攀岩人格是「${result.archetype.name.zh}」。`
        : `My ClimbAtlas archetype is ${result.archetype.name.en}.`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ClimbAtlas Climbing DNA",
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      }
      setShareStatus(text.shared);
    } catch {
      setShareStatus(text.shareFailed);
    }
  }

  if (!result) {
    return (
      <main className="min-h-[calc(100svh-72px)] bg-cream px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl border-y border-brandforest/15 py-16 text-center">
          <p className="editorial-kicker text-terracotta">Climbing DNA</p>
          <h1 className="display-serif mt-5 text-5xl font-medium text-brandforest">
            {text.invalidTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-charcoal/65">
            {text.invalidBody}
          </p>
          <Link className="primary-action mt-8" href="/climbing-dna">
            {text.start} →
          </Link>
        </div>
      </main>
    );
  }

  const strongestDimensions = getStrongestDimensions(result.profile.scores);
  const secondaryCopy = text.secondary.replace(
    "{name}",
    result.secondaryArchetype.name[locale] ?? result.secondaryArchetype.name.en ?? ""
  );

  return (
    <main className="min-h-[calc(100svh-72px)] bg-cream px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1240px] quest-reveal">
        <p className="editorial-kicker text-terracotta">{text.archetype}</p>
        <section className="mt-5 grid gap-12 border-y border-brandforest/15 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <figure className="overflow-hidden rounded-lg bg-sand/25">
            <img
              alt={result.archetype.image.alt[locale] ?? result.archetype.image.alt.en}
              className="aspect-[4/5] h-full w-full object-cover"
              src={result.archetype.image.src}
            />
          </figure>
          <div>
            <h1 className="display-serif text-5xl font-medium leading-[1.02] text-brandforest sm:text-7xl">
              {result.archetype.name[locale]}
            </h1>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-terracotta">
              {secondaryCopy}
            </p>
            <p className="mt-7 text-xl leading-8 text-charcoal/70">
              {result.archetype.tagline[locale]}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-charcoal/62">
              {result.archetype.longDescription[locale]}
            </p>

            <div className="mt-9 grid gap-6 border-t border-brandforest/12 pt-7 sm:grid-cols-3">
              <ResultList title={text.strengths} items={result.archetype.strengths[locale] ?? []} />
              <ResultList title={text.styles} items={result.archetype.routeStyles[locale] ?? []} />
              <ResultList title={text.environments} items={result.archetype.environments[locale] ?? []} />
            </div>
          </div>
        </section>

        <section className="grid gap-10 py-16 lg:grid-cols-[0.42fr_0.58fr] lg:py-20">
          <div>
            <p className="editorial-kicker text-terracotta">{text.profile}</p>
            <h2 className="display-serif mt-4 text-4xl font-medium text-brandforest">
              {locale === "zh" ? "你的偏好不是一个标签，而是一组倾向。" : "Your profile is a set of tendencies, not a box."}
            </h2>
            <p className="mt-5 text-base leading-7 text-charcoal/60">
              {result.archetype.description[locale]}
            </p>
          </div>
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">
              {text.profileScale}
            </p>
            {dnaDimensions.map((dimension) => (
              <div
                aria-label={`${dimensionNames[locale][dimension]}: ${result.profile.scores[dimension]} / 100`}
                className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[8rem_1fr_3rem]"
                key={dimension}
              >
                <span className="text-xs font-semibold uppercase text-charcoal/58">
                  {dimensionNames[locale][dimension]}
                </span>
                <span className="h-1 bg-sand/70">
                  <span
                    className="block h-full bg-terracotta"
                    style={{ width: `${result.profile.scores[dimension]}%` }}
                  />
                </span>
                <span className="text-right text-sm font-medium text-brandforest">
                  {result.profile.scores[dimension]}
                </span>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-4">
              {strongestDimensions.map((dimension) => (
                <span
                  className="rounded-sm border border-brandforest/15 px-3 py-1.5 text-xs font-semibold text-brandforest"
                  key={dimension}
                >
                  {dimensionNames[locale][dimension]}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brandforest/15 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="editorial-kicker text-terracotta">{text.matches}</p>
            <h2 className="display-serif mt-4 text-4xl font-medium text-brandforest sm:text-5xl">
              {locale === "zh" ? "与你攀岩方式相合的地方" : "Places that fit how you climb"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-charcoal/62">{text.matchIntro}</p>
          </div>

          <div className="mt-12 space-y-10">
            {result.matches.map((match, index) => {
              const destination = destinationBySlug.get(match.destinationSlug);
              if (!destination) return null;
              return (
                <article
                  className="grid gap-7 border-t border-brandforest/15 pt-7 lg:grid-cols-[0.32fr_0.68fr]"
                  key={match.destinationSlug}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-sand/25">
                    {destination.image ? (
                      <img
                        alt={destination.image.alt}
                        className="h-full w-full object-cover"
                        src={destination.image.src}
                      />
                    ) : (
                      <div className="flex h-full items-end bg-brandforest p-6 text-cream">
                        <span className="display-serif text-3xl">{destination.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                    <div>
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">
                            0{index + 1} / {localizeFact(destination.country, locale)}
                          </p>
                          <h3 className="display-serif mt-2 text-4xl font-medium text-brandforest">
                            {destination.name}
                          </h3>
                          <p className="mt-2 text-sm font-semibold text-terracotta">
                            {getMatchLabel(match.score, locale)}
                          </p>
                        </div>
                        <span className="max-w-32 text-right text-sm font-semibold text-brandforest">
                          {match.score}% {locale === "zh" ? "DNA 偏好匹配" : "DNA preference match"}
                        </span>
                      </div>
                      <p className="mt-5 text-base leading-7 text-charcoal/62">
                        {match.profile.summary[locale]}
                      </p>
                      <Link className="text-link mt-6 inline-flex" href={`/destinations/${destination.slug}`}>
                        {text.open} →
                      </Link>
                    </div>

                    <div className="border-brandforest/12 lg:border-l lg:pl-7">
                      <p className="editorial-kicker text-charcoal/45">{text.why}</p>
                      <ul className="mt-4 space-y-3 text-sm leading-6 text-charcoal/65">
                        {match.reasons.map((reason, reasonIndex) => (
                          <li className="border-l-2 border-terracotta/55 pl-3" key={`${match.destinationSlug}-${reasonIndex}`}>
                            {reason}
                          </li>
                        ))}
                      </ul>
                      <p className="editorial-kicker mt-6 text-charcoal/45">{text.facts}</p>
                      <p className="mt-3 text-sm leading-6 text-charcoal/62">
                        {localizeFact(destination.rockType, locale)} · {destination.climbingTypes.map((type) => localizeFact(type, locale)).join(" / ")} · {destination.routeCount} {text.routes}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-charcoal/62">
                        {text.season}: {destination.bestSeasons.map((season) => localizeFact(season, locale)).join(", ")}
                      </p>
                      {match.watchDimension ? (
                        <div className="mt-5 border-t border-brandforest/10 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-terracotta">{text.consider}</p>
                          <p className="mt-2 text-sm leading-6 text-charcoal/60">
                            {locale === "zh"
                              ? `这里的「${dimensionNames.zh[match.watchDimension]}」画像低于你的偏好，可以把它视为一个取舍。`
                              : `${dimensionNames.en[match.watchDimension]} is lower here than in your profile, so this may feel like a tradeoff.`}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-5 border-t border-brandforest/15 pt-8">
          <button className="primary-action" onClick={() => void shareResult()} type="button">
            {text.share} →
          </button>
          <Link className="text-link" href="/explore">{text.explore} →</Link>
          <Link className="text-link" href="/climbing-dna">{text.retake}</Link>
        </div>
        {shareStatus ? <p className="mt-4 text-sm font-medium text-terracotta" role="status">{shareStatus}</p> : null}
        <p className="mt-8 max-w-3xl text-sm leading-6 text-charcoal/50">{text.note}</p>
      </div>
    </main>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-charcoal/65">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
