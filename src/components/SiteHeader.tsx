"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthButton } from "@/components/AuthButton";
import { LanguageToggle, useLanguage } from "@/components/LanguageProvider";

const navItems = [
  { href: "/", label: { en: "Discover", zh: "发现" } },
  { href: "/climbing-dna", label: { en: "Climbing DNA", zh: "攀岩 DNA" } },
  { href: "/explore", label: { en: "Map", zh: "地图" } },
  { href: "/my-atlas", label: { en: "My Atlas", zh: "我的地图册" } }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1200] h-[72px] border-b border-brandforest/10 bg-cream/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        <Link className="flex shrink-0 items-center gap-3 text-brandforest" href="/" aria-label="ClimbAtlas home">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-brandforest/20 text-[10px] font-semibold tracking-[0.12em]">CA</span>
          <span className="display-serif text-2xl font-medium leading-none">ClimbAtlas</span>
        </Link>

        <nav className="mx-auto hidden h-full items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link className={`relative flex h-full items-center text-sm font-medium transition-colors ${active ? "text-brandforest" : "text-charcoal/60 hover:text-brandforest"}`} href={item.href} key={item.href}>
                {item.label[locale]}
                {active ? <span className="absolute bottom-0 left-0 h-0.5 w-full bg-terracotta" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <div className="hidden md:block"><AuthButton /></div>
          <button aria-expanded={menuOpen} aria-label={locale === "zh" ? "打开导航菜单" : "Open navigation menu"} className="grid h-10 w-10 place-items-center border border-brandforest/15 text-xl text-brandforest md:hidden" onClick={() => setMenuOpen((current) => !current)} type="button">≡</button>
        </div>

        {menuOpen ? (
          <div className="absolute left-5 right-5 top-[62px] border border-brandforest/15 bg-cream p-4 shadow-editorial md:hidden">
            <nav className="grid">
              {navItems.map((item) => (
                <Link className="border-b border-brandforest/10 py-3 text-sm font-medium text-brandforest last:border-0" href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label[locale]}</Link>
              ))}
            </nav>
            <div className="mt-4"><AuthButton /></div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
