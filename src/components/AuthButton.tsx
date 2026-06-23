"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useSupabaseAuth } from "@/components/SupabaseProvider";

export function AuthButton({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale } = useLanguage();
  const { isConfigured, isLoading, message, signInWithEmail, signOut, user } =
    useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isZh = locale === "zh";
  const buttonClass =
    tone === "dark"
      ? "border-parchment/25 bg-parchment/10 text-parchment hover:bg-parchment/20"
      : "border-ridge/25 bg-white/70 text-bark hover:border-forest/35 hover:bg-white";

  if (user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          className={`rounded-lg border px-4 py-2 text-sm font-black shadow-sm transition ${buttonClass}`}
          href="/my-atlas"
        >
          {isZh ? "我的路线本" : "My Atlas"}
        </Link>
        <button
          className={`rounded-lg border px-4 py-2 text-sm font-black shadow-sm transition ${buttonClass}`}
          onClick={() => void signOut()}
          type="button"
        >
          {isZh ? "退出" : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className={`rounded-lg border px-4 py-2 text-sm font-black shadow-sm transition ${buttonClass}`}
        disabled={isLoading}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isZh ? "登录" : "Sign in"}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-[1600] w-80 rounded-lg border border-ridge/25 bg-parchment p-4 text-bark shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
            {isZh ? "个人路线本" : "Personal route notebook"}
          </p>
          <p className="mt-2 text-sm leading-6 text-bark/70">
            {isConfigured
              ? isZh
                ? "输入邮箱，我们会发送一个登录链接。"
                : "Enter your email and we will send a magic sign-in link."
              : isZh
                ? "还没有配置 Supabase 环境变量。网站可以浏览，但个人路线本暂不可用。"
                : "Supabase env variables are not configured yet. Browsing still works, but saved routes are disabled."}
          </p>

          {isConfigured && (
            <form
              className="mt-3 grid gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void signInWithEmail(email);
              }}
            >
              <input
                className="rounded-md border border-ridge/25 bg-white/75 px-3 py-2 text-sm font-bold text-bark outline-none transition focus:border-forest"
                onChange={(event) => setEmail(event.target.value)}
                placeholder={isZh ? "你的邮箱" : "your@email.com"}
                type="email"
                value={email}
              />
              <button
                className="rounded-md bg-forest px-3 py-2 text-sm font-black text-parchment transition hover:bg-bark"
                type="submit"
              >
                {isZh ? "发送登录链接" : "Send sign-in link"}
              </button>
            </form>
          )}

          {message && (
            <p className="mt-3 rounded-md border border-forest/20 bg-forest/10 p-3 text-xs font-bold leading-5 text-bark/70">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
