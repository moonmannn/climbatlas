"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";

const copy = {
  en: {
    kicker: "This line is not on the map",
    title: "We could not find that page.",
    body: "The destination or route may have moved, or the link may be incomplete. Start again from the atlas and we will keep the trail clear.",
    home: "Go to homepage",
    map: "Return to map",
    search: "Search destinations"
  },
  zh: {
    kicker: "这条线路不在地图上",
    title: "没有找到这个页面。",
    body: "目的地或线路可能已经移动，也可能是链接不完整。你可以从地图册重新出发，我们会帮你把路径理清。",
    home: "返回首页",
    map: "返回地图",
    search: "搜索目的地"
  }
};

export default function NotFound() {
  const { locale } = useLanguage();
  const text = copy[locale];

  return (
    <main className="min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <section className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-12 lg:py-20">
        <div className="max-w-xl">
          <p className="editorial-kicker text-terracotta">404 · {text.kicker}</p>
          <h1 className="display-serif mt-5 text-5xl font-medium leading-[1.02] text-brandforest sm:text-7xl">
            {text.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-charcoal/68">{text.body}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link className="primary-action" href="/explore">
              {text.map} <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link px-2 py-3" href="/explore?search=1">
              {text.search} <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link px-2 py-3" href="/">
              {text.home}
            </Link>
          </div>
        </div>

        <figure className="overflow-hidden rounded-lg border border-brandforest/10 bg-sand/20">
          <img
            alt={locale === "zh" ? "ClimbAtlas 原创虚构攀岩山谷插画" : "Original ClimbAtlas illustration of a fictional climbing valley"}
            className="aspect-[4/3] h-full w-full object-cover"
            decoding="async"
            loading="eager"
            src="/images/editorial/climbatlas-discovery-hero.webp"
          />
          <figcaption className="border-t border-brandforest/10 px-4 py-3 text-xs text-charcoal/50">
            {locale === "zh"
              ? "ClimbAtlas 原创编辑插画，不对应现实线路。"
              : "Original ClimbAtlas editorial artwork; it does not depict a real route."}
          </figcaption>
        </figure>
      </section>
    </main>
  );
}
