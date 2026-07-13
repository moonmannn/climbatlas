"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { dnaArchetypes } from "@/data/dnaArchetypes";
import { decodeDnaAnswers } from "@/lib/climbingDnaUrl";
import { getDestinationDnaMatches, scoreDnaAnswers } from "@/lib/climbingDna";
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
  en: { exploration: "Exploration", performance: "Performance", adventure: "Adventure", social: "Social", comfort: "Comfort", flow: "Flow" },
  zh: { exploration: "探索", performance: "表现", adventure: "冒险", social: "社交", comfort: "舒适", flow: "流动" }
};

const factTranslations: Record<string, string> = {
  "Spring": "春季", "Summer": "夏季", "Fall": "秋季", "Winter": "冬季",
  "sport": "运动攀", "trad": "传统攀", "boulder": "抱石", "multi-pitch": "多段攀登",
  "Granite": "花岗岩", "Limestone": "石灰岩", "Sandstone": "砂岩", "Dolomite limestone": "白云岩",
  "Jura limestone": "侏罗纪石灰岩", "Karst limestone": "喀斯特石灰岩", "Coastal sandstone": "海岸砂岩",
  "Quartzite": "石英岩", "Volcanic tuff": "火山凝灰岩", "Gneiss": "片麻岩",
  "USA": "美国", "Canada": "加拿大", "Mexico": "墨西哥", "France": "法国", "Greece": "希腊",
  "Italy": "意大利", "Germany": "德国", "Spain": "西班牙", "China": "中国", "Taiwan": "中国台湾",
  "Thailand": "泰国", "Australia": "澳大利亚", "South Africa": "南非"
};

function localizeFact(value: string, locale: "en" | "zh") {
  return locale === "zh" ? factTranslations[value] ?? value : value;
}
const ui = {
  en: {
    archetype: "Your climbing archetype", profile: "DNA profile", matches: "Places selected around how you climb",
    matchIntro: "These matches compare your six preferences with each destination profile. The score is deterministic, and every recommendation shows its strongest reasons.",
    yourPriorities: "Your strongest signals", why: "Why it fits", consider: "A useful tradeoff", facts: "Destination snapshot",
    routes: "routes indexed", season: "Best seasons", open: "Open destination guide", noGap: "No major preference gap detected.",
    explore: "Explore the map", retake: "Retake the quiz", share: "Share my Climbing DNA",
    shared: "Share link copied", shareFailed: "Sharing is not available in this browser",
    invalidTitle: "This result link is incomplete.", invalidBody: "Take the six-question journey to create a valid Climbing DNA profile.",
    start: "Start the quiz", note: "Matches describe atmosphere and experience preferences, not route safety or current conditions. Always check current local information before climbing."
  },
  zh: {
    archetype: "你的攀岩人格", profile: "DNA 画像", matches: "根据你的攀岩方式挑选的地方",
    matchIntro: "匹配会比较你的六项偏好和各目的地画像。分数由固定规则计算，每个推荐都会展示最主要的理由。",
    yourPriorities: "你最强烈的偏好", why: "为什么匹配", consider: "值得留意的取舍", facts: "目的地速览",
    routes: "条收录路线", season: "推荐季节", open: "打开目的地攻略", noGap: "没有发现明显的偏好差距。",
    explore: "探索地图", retake: "重新测试", share: "分享我的攀岩 DNA",
    shared: "分享链接已复制", shareFailed: "当前浏览器暂不支持分享",
    invalidTitle: "这个结果链接不完整。", invalidBody: "完成六道问题后，才能生成有效的攀岩 DNA 画像。",
    start: "开始测试", note: "匹配结果反映的是氛围与体验偏好，不代表线路安全或当前条件。攀登前请始终核对最新的当地信息。"
  }
};

function artworkForArchetype(dimensions: string[]) {
  if (dimensions.includes("adventure")) return "/images/editorial/climbatlas-discovery-hero.png";
  if (dimensions.includes("social") || dimensions.includes("comfort")) return "/images/editorial/seaside-limestone-plate.png";
  return "/images/editorial/forest-granite-plate.png";
}

function getStrongestDimensions(scores: Record<DnaDimension, number>) {
  return [...dnaDimensions].sort((first, second) => scores[second] - scores[first]).slice(0, 3);
}

export function ClimbingDnaResult({ encodedAnswers, destinations }: { encodedAnswers: string; destinations: DestinationMatchCardData[] }) {
  const { locale } = useLanguage();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const text = ui[locale];
  const destinationBySlug = useMemo(() => new Map(destinations.map((destination) => [destination.slug, destination])), [destinations]);

  const result = useMemo(() => {
    const answers = decodeDnaAnswers(encodedAnswers);
    if (!answers) return null;
    const profile = scoreDnaAnswers(answers);
    const archetype = dnaArchetypes.find((item) => item.id === profile.archetypeId) ?? dnaArchetypes[0];
    return { profile, archetype, matches: getDestinationDnaMatches(profile.scores, locale, 3) };
  }, [encodedAnswers, locale]);

  async function shareResult() {
    if (!result) return;
    const shareText = locale === "zh" ? `我的 ClimbAtlas 攀岩人格是「${result.archetype.name.zh}」。` : `My ClimbAtlas archetype is ${result.archetype.name.en}.`;
    try {
      if (navigator.share) await navigator.share({ title: "ClimbAtlas Climbing DNA", text: shareText, url: window.location.href });
      else await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setShareStatus(text.shared);
    } catch {
      setShareStatus(text.shareFailed);
    }
  }

  if (!result) {
    return (
      <main className="min-h-[calc(100svh-72px)] bg-cream px-5 py-[72px] sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl border-y border-brandforest/15 py-16 text-center">
          <p className="editorial-kicker text-terracotta">Climbing DNA</p>
          <h1 className="display-serif mt-5 text-5xl font-medium text-brandforest">{text.invalidTitle}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-charcoal/65">{text.invalidBody}</p>
          <Link className="primary-action mt-8" href="/climbing-dna">{text.start} →</Link>
        </div>
      </main>
    );
  }

  const strongestDimensions = getStrongestDimensions(result.profile.scores);

  return (
    <main className="min-h-[calc(100svh-72px)] bg-cream px-5 py-[72px] sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1240px] quest-reveal">
        <p className="editorial-kicker text-terracotta">{text.archetype}</p>
        <section className="mt-5 grid gap-10 border-y border-brandforest/15 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-lg bg-sand/30">
            <img alt="" className="h-full w-full object-cover" src={artworkForArchetype(result.archetype.dominantDimensions)} />
          </div>
          <div>
            <h1 className="display-serif text-5xl font-medium leading-[1.02] text-brandforest sm:text-7xl">{result.archetype.name[locale]}</h1>
            <p className="mt-6 text-xl leading-8 text-charcoal/68">{result.archetype.tagline[locale]}</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-charcoal/60">{result.archetype.description[locale]}</p>
            <div className="mt-9 flex flex-wrap gap-2">
              <span className="mr-2 self-center text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">{text.yourPriorities}</span>
              {strongestDimensions.map((dimension) => <span className="rounded-sm border border-brandforest/15 px-3 py-1.5 text-xs font-semibold text-brandforest" key={dimension}>{dimensionNames[locale][dimension]}</span>)}
            </div>
            <div className="mt-10">
              <p className="editorial-kicker text-charcoal/50">{text.profile}</p>
              <div className="mt-5 space-y-4">
                {dnaDimensions.map((dimension) => (
                  <div className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[7rem_1fr_2.5rem]" key={dimension}>
                    <span className="text-xs font-semibold uppercase text-charcoal/58">{dimensionNames[locale][dimension]}</span>
                    <span className="h-1 bg-sand/70"><span className="block h-full bg-terracotta" style={{ width: `${result.profile.scores[dimension]}%` }} /></span>
                    <span className="text-right text-sm font-medium text-brandforest">{result.profile.scores[dimension]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-[72px] lg:py-24">
          <div className="max-w-3xl">
            <p className="editorial-kicker text-terracotta">{text.matches}</p>
            <p className="mt-5 text-lg leading-8 text-charcoal/62">{text.matchIntro}</p>
          </div>

          <div className="mt-10 space-y-8">
            {result.matches.map((match, index) => {
              const destination = destinationBySlug.get(match.destinationSlug);
              if (!destination) return null;
              return (
                <article className="grid gap-6 border-t border-brandforest/15 pt-6 lg:grid-cols-[0.34fr_0.66fr]" key={match.destinationSlug}>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-sand/30">
                    <img alt={destination.image?.alt ?? destination.name} className="h-full w-full object-cover" src={destination.image?.src ?? artworkForArchetype(match.alignedDimensions)} />
                  </div>
                  <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
                    <div>
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">0{index + 1} / {localizeFact(destination.country, locale)}</p>
                          <h2 className="display-serif mt-2 text-4xl font-medium text-brandforest">{destination.name}</h2>
                        </div>
                        <span className="display-serif text-4xl font-medium text-brandforest">{match.score}%</span>
                      </div>
                      <p className="mt-4 text-base leading-7 text-charcoal/62">{match.profile.summary[locale]}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {(match.profile.traits[locale] ?? match.profile.traits.en ?? []).map((trait) => <span className="rounded-sm bg-sand/35 px-2.5 py-1.5 text-xs font-medium text-charcoal/68" key={trait}>{trait}</span>)}
                      </div>
                      <Link className="text-link mt-6 inline-flex" href={`/destinations/${destination.slug}`}>{text.open} →</Link>
                    </div>

                    <div className="border-l-0 border-brandforest/12 lg:border-l lg:pl-7">
                      <p className="editorial-kicker text-charcoal/45">{text.why}</p>
                      <ul className="mt-4 space-y-3 text-sm leading-6 text-charcoal/65">
                        {match.reasons.map((reason, reasonIndex) => <li className="border-l-2 border-terracotta/55 pl-3" key={`${match.destinationSlug}-${reasonIndex}`}>{reason}</li>)}
                      </ul>
                      <p className="editorial-kicker mt-6 text-charcoal/45">{text.facts}</p>
                      <p className="mt-3 text-sm leading-6 text-charcoal/62">{localizeFact(destination.rockType, locale)} · {destination.climbingTypes.map((type) => localizeFact(type, locale)).join(" / ")} · {destination.routeCount} {text.routes}</p>
                      <p className="mt-1 text-sm leading-6 text-charcoal/62">{text.season}: {destination.bestSeasons.map((season) => localizeFact(season, locale)).join(", ")}</p>
                      {match.watchDimension ? (
                        <div className="mt-5 border-t border-brandforest/10 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-terracotta">{text.consider}</p>
                          <p className="mt-2 text-sm leading-6 text-charcoal/60">{locale === "zh" ? `这里的「${dimensionNames.zh[match.watchDimension]}」画像低于你的偏好，可以把它视为一个取舍。` : `${dimensionNames.en[match.watchDimension]} is lower here than in your profile, so this may feel like a tradeoff.`}</p>
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
          <button className="primary-action" onClick={() => void shareResult()} type="button">{text.share} →</button>
          <Link className="text-link" href="/explore">{text.explore} →</Link>
          <Link className="text-link" href="/climbing-dna">{text.retake}</Link>
        </div>
        {shareStatus ? <p className="mt-4 text-sm font-medium text-terracotta" role="status">{shareStatus}</p> : null}
        <p className="mt-8 max-w-3xl text-sm leading-6 text-charcoal/50">{text.note}</p>
      </div>
    </main>
  );
}
