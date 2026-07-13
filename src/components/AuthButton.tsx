"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useSupabaseAuth } from "@/components/SupabaseProvider";

export function AuthButton({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale } = useLanguage();
  const { isConfigured, isLoading, message, signInWithEmail, signOut, user } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const isZh = locale === "zh";
  const trimmedEmail = email.trim();
  const buttonClass = tone === "dark"
    ? "border-cream/25 bg-cream/10 text-cream hover:bg-cream/20"
    : "border-brandforest/15 bg-cream text-brandforest hover:border-brandforest/35";
  const displayMessage = localMessage ?? translateAuthMessage(message, isZh);

  if (user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${buttonClass}`} href="/my-atlas">{isZh ? "我的路线本" : "My Atlas"}</Link>
        <button className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${buttonClass}`} onClick={() => void signOut()} type="button">{isZh ? "退出" : "Sign out"}</button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${buttonClass}`} disabled={isLoading} onClick={() => { setLocalMessage(null); setIsOpen((current) => !current); }} type="button">{isZh ? "登录" : "Sign in"}</button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-[1600] w-80 rounded-lg border border-brandforest/15 bg-cream p-5 text-charcoal shadow-editorial">
          <p className="editorial-kicker text-terracotta">{isZh ? "个人路线本" : "Personal route notebook"}</p>
          <p className="mt-3 text-sm leading-6 text-charcoal/68">
            {isConfigured
              ? isZh ? "输入邮箱，我们会发送登录链接。登录后可以保存想爬、已爬路线和私人笔记。" : "Enter your email and we will send a magic sign-in link. After signing in, you can save routes and private notes."
              : isZh ? "Supabase 环境变量尚未配置。网站仍可正常浏览，但路线收藏暂不可用。" : "Supabase env variables are not configured yet. Browsing still works, but saved routes are disabled."}
          </p>

          {isConfigured ? (
            <form className="mt-4 grid gap-2" onSubmit={(event) => { event.preventDefault(); if (!trimmedEmail) { setLocalMessage(isZh ? "请先输入邮箱。" : "Enter an email first."); return; } setLocalMessage(null); void signInWithEmail(trimmedEmail); }}>
              <input autoComplete="email" className="rounded-md border border-brandforest/20 bg-white/55 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brandforest" onChange={(event) => setEmail(event.target.value)} placeholder={isZh ? "你的邮箱" : "your@email.com"} type="email" value={email} />
              <button className="rounded-md bg-terracotta px-3 py-2 text-sm font-semibold text-white transition hover:bg-brandforest disabled:cursor-not-allowed disabled:opacity-50" disabled={isLoading} type="submit">{isZh ? "发送登录链接" : "Send sign-in link"}</button>
            </form>
          ) : null}

          {displayMessage ? <p className="mt-3 border-t border-brandforest/10 pt-3 text-xs font-medium leading-5 text-charcoal/65">{displayMessage}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function translateAuthMessage(message: string | null, isZh: boolean) {
  if (!message || !isZh) return message;
  const knownMessages: Record<string, string> = {
    "Check your email for the sign-in link.": "请查看邮箱里的登录链接。",
    "Supabase is not configured yet.": "Supabase 尚未配置。"
  };
  return knownMessages[message] ?? message;
}
