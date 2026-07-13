"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import type { Destination } from "@/types/destination";

const MapView = dynamic(() => import("@/components/MapView").then((module) => module.MapView), {
  loading: () => <div className="flex h-full min-h-[340px] items-center justify-center bg-sky/20 text-sm font-medium text-brandforest">Loading map...</div>,
  ssr: false
});

export type HomeDestinationSummary = {
  slug: string;
  name: string;
  country: string;
  rockType: string;
  routeCount: number;
  descriptions: { en: string; zh: string };
  image?: { src: string; alt: string };
};

type HomeClientProps = {
  featuredDestinations: HomeDestinationSummary[];
  mapDestinations: Destination[];
};

const copy = {
  en: {
    eyebrow: "Personalized climbing discovery",
    title: "Find places that fit how you climb.",
    intro: "Discover landscapes, destinations, and climbing days shaped around what draws you outside.",
    primary: "Discover your Climbing DNA",
    secondary: "Explore the map",
    plate: "ClimbAtlas field study",
    plateNumber: "Plate 001",
    plateName: "Forest granite",
    dnaKicker: "More than grades",
    dnaTitle: "Every climber is drawn to something different.",
    dnaBody: "Grades only tell part of the story. Discover the landscapes, experiences, and climbing days that feel most like you.",
    choiceKicker: "A question of instinct",
    choiceTitle: "Which climbing day feels most like you?",
    choices: ["Seaside limestone", "Forest granite", "High alpine walls", "Climbing community"],
    choiceNotes: ["Warm rock / Open horizons", "Quiet movement / Cool shade", "Big scale / Thin air", "Shared days / Good energy"],
    matchesKicker: "Personalized matches",
    matchesTitle: "Places selected around how you climb.",
    match: "match",
    mapKicker: "Explore the atlas",
    mapTitle: "The world is your wall.",
    mapBody: "Explore climbing destinations by season, style, and atmosphere.",
    atlasKicker: "Your climbing record",
    atlasTitle: "Build a personal atlas, one place at a time.",
    atlasBody: "Save places. Plan journeys. Keep the routes and moments that matter to you.",
    states: ["Want to go", "Planning", "Visited"],
    openAtlas: "Open My Atlas",
    footer: "A source-aware guide to climbing places and the routes that shape them.",
    feedback: "Send feedback"
  },
  zh: {
    eyebrow: "个性化攀岩发现",
    title: "找到真正适合你攀岩方式的地方。",
    intro: "从吸引你走向户外的事物出发，发现更合拍的风景、目的地与攀岩体验。",
    primary: "发现我的攀岩 DNA",
    secondary: "探索地图",
    plate: "ClimbAtlas 户外研究",
    plateNumber: "图版 001",
    plateName: "森林花岗岩",
    dnaKicker: "不只是难度",
    dnaTitle: "每位攀岩者，都会被不同的事物吸引。",
    dnaBody: "难度只讲了故事的一部分。去发现最像你的风景、体验与攀岩日。",
    choiceKicker: "跟着直觉选择",
    choiceTitle: "哪一种攀岩日最像你？",
    choices: ["海边石灰岩", "森林花岗岩", "高山岩壁", "攀岩伙伴"],
    choiceNotes: ["温暖岩石 / 开阔视野", "安静移动 / 林间凉意", "巨大尺度 / 高处空气", "一起出发 / 分享快乐"],
    matchesKicker: "个性化匹配",
    matchesTitle: "根据你的攀岩方式挑选目的地。",
    match: "匹配",
    mapKicker: "探索地图册",
    mapTitle: "世界就是你的岩壁。",
    mapBody: "按照季节、风格与氛围探索全球攀岩目的地。",
    atlasKicker: "你的攀岩记录",
    atlasTitle: "从一个地方开始，建立自己的攀岩地图册。",
    atlasBody: "收藏目的地，计划旅程，留下对你真正重要的路线与时刻。",
    states: ["想去", "计划中", "去过"],
    openAtlas: "打开我的地图册",
    footer: "一份重视来源、帮助你发现攀岩目的地与路线的指南。",
    feedback: "发送反馈"
  }
};

const choiceImages = [
  "/images/editorial/seaside-limestone-plate.png",
  "/images/editorial/forest-granite-plate.png",
  "/images/editorial/climbatlas-discovery-hero.png",
  "/images/editorial/forest-granite-plate.png"
];

const matchScores = [94, 89, 86];

export function HomeClient({ featuredDestinations, mapDestinations }: HomeClientProps) {
  const { locale } = useLanguage();
  const text = copy[locale];

  return (
    <main className="min-h-screen bg-cream text-charcoal">
      <SiteHeader />

      <section className="px-5 py-[72px] sm:px-8 lg:px-12 lg:py-[120px]">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[42fr_58fr] lg:items-center">
          <div className="max-w-xl">
            <p className="editorial-kicker text-terracotta">{text.eyebrow}</p>
            <h1 className="display-serif mt-6 text-[52px] font-medium leading-[0.95] text-brandforest sm:text-7xl lg:text-[88px]">{text.title}</h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-charcoal/72">{text.intro}</p>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Link className="primary-action" href="/climbing-dna">{text.primary} <span aria-hidden="true">→</span></Link>
              <Link className="text-link" href="/explore">{text.secondary} <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <figure className="art-plate mx-auto w-full max-w-[680px] lg:mx-0 lg:ml-auto">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand/30">
              <img alt={locale === "zh" ? "森林与花岗岩的原创户外版画" : "Original outdoor print of forest granite"} className="h-full w-full object-cover" src="/images/editorial/forest-granite-plate.png" />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              <span>{text.plate}</span><span>{text.plateNumber} / {text.plateName}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-brandforest px-5 py-[72px] text-cream sm:px-8 lg:px-12 lg:py-[120px]">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-xl">
            <p className="editorial-kicker text-terracotta">{text.dnaKicker}</p>
            <h2 className="display-serif mt-5 text-5xl font-medium leading-[1.02] sm:text-6xl">{text.dnaTitle}</h2>
            <p className="mt-7 text-lg leading-8 text-cream/72">{text.dnaBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {choiceImages.map((src, index) => (
              <div className="overflow-hidden rounded-lg border border-cream/15" key={`${src}-${index}`}>
                <img alt="" className="aspect-[4/3] h-full w-full object-cover opacity-90" src={src} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-[72px] sm:px-8 lg:px-12 lg:py-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <p className="editorial-kicker text-terracotta">{text.choiceKicker}</p>
          <h2 className="display-serif mt-4 max-w-3xl text-5xl font-medium leading-[1.04] text-brandforest sm:text-6xl">{text.choiceTitle}</h2>
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {text.choices.map((choice, index) => (
              <Link className="artwork-card group" href="/climbing-dna" key={choice}>
                <div className="aspect-[4/5] overflow-hidden rounded-lg bg-sand/30">
                  <img alt="" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.015]" src={choiceImages[index]} />
                </div>
                <h3 className="display-serif mt-5 text-2xl font-medium text-brandforest">{choice}</h3>
                <p className="mt-2 text-sm text-charcoal/58">{text.choiceNotes[index]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-brandforest/10 bg-sand/20 px-5 py-[72px] sm:px-8 lg:px-12 lg:py-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <p className="editorial-kicker text-terracotta">{text.matchesKicker}</p>
          <h2 className="display-serif mt-4 max-w-3xl text-5xl font-medium leading-[1.04] text-brandforest sm:text-6xl">{text.matchesTitle}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredDestinations.map((destination, index) => (
              <Link className="destination-card group" href={`/destinations/${destination.slug}`} key={destination.slug}>
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-sky/20">
                  <img alt={destination.image?.alt ?? destination.name} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.015]" src={destination.image?.src ?? choiceImages[index]} />
                </div>
                <div className="pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">{destination.country}</p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <h3 className="display-serif text-3xl font-medium text-brandforest">{destination.name}</h3>
                    <span className="text-sm font-semibold text-brandforest">{matchScores[index]}% {text.match}</span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-charcoal/65">{destination.descriptions[locale]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brandforest px-5 py-[72px] text-cream sm:px-8 lg:px-12 lg:py-[120px]">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:items-center">
          <div>
            <p className="editorial-kicker text-terracotta">{text.mapKicker}</p>
            <h2 className="display-serif mt-4 text-5xl font-medium leading-[1.02]">{text.mapTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-cream/70">{text.mapBody}</p>
            <Link className="mt-7 inline-flex text-sm font-medium text-cream underline decoration-terracotta underline-offset-8" href="/explore">{text.secondary} →</Link>
          </div>
          <div className="h-[460px] overflow-hidden rounded-lg border border-cream/15">
            <MapView compact destinations={mapDestinations} showExpeditionLog={false} visualStyle="clean" />
          </div>
        </div>
      </section>

      <section className="px-5 py-[72px] sm:px-8 lg:px-12 lg:py-[120px]">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="editorial-kicker text-terracotta">{text.atlasKicker}</p>
            <h2 className="display-serif mt-4 text-5xl font-medium leading-[1.04] text-brandforest">{text.atlasTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-charcoal/68">{text.atlasBody}</p>
            <Link className="text-link mt-7 inline-flex" href="/my-atlas">{text.openAtlas} →</Link>
          </div>
          <div className="border-y border-brandforest/15 py-3">
            {text.states.map((state, index) => (
              <div className="flex items-center justify-between border-b border-brandforest/10 py-6 last:border-0" key={state}>
                <span className="display-serif text-2xl font-medium text-brandforest">{state}</span>
                <span className="text-sm text-charcoal/48">0{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-brandforest/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 text-sm text-charcoal/58 sm:flex-row sm:items-center sm:justify-between">
          <p>{text.footer}</p>
          <Link className="text-link" href="/feedback">{text.feedback} →</Link>
        </div>
      </footer>
    </main>
  );
}
