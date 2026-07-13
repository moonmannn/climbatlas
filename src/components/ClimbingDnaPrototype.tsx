"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { dnaQuestions } from "@/data/dnaQuestions";
import { encodeDnaAnswers } from "@/lib/climbingDnaUrl";
import type { DnaAnswerMap, DnaQuestionOption } from "@/types/climbingDna";

const artworkPool = [
  "/images/editorial/seaside-limestone-plate.png",
  "/images/editorial/forest-granite-plate.png",
  "/images/editorial/climbatlas-discovery-hero.png"
];

const preferredArtwork: Record<string, string> = {
  "sunlit-limestone": artworkPool[0],
  "forest-granite": artworkPool[1],
  "high-alpine-wall": artworkPool[2],
  "lively-local-crag": artworkPool[1]
};

const ui = {
  en: { journey: "Climbing DNA", choose: "Choose one", back: "Back", restart: "Start again", preparing: "Building your profile..." },
  zh: { journey: "攀岩 DNA", choose: "选择一项", back: "返回", restart: "重新测试", preparing: "正在生成你的画像……" }
};

function getArtwork(option: DnaQuestionOption) {
  if (preferredArtwork[option.id]) return preferredArtwork[option.id];
  const hash = option.illustrationKey.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
  return artworkPool[hash % artworkPool.length];
}

export function ClimbingDnaPrototype() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [answers, setAnswers] = useState<DnaAnswerMap>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const question = dnaQuestions[questionIndex];
  const selected = answers[question.id];
  const text = ui[locale];

  function chooseOption(optionId: string) {
    if (transitioning) return;
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);
    setTransitioning(true);

    window.setTimeout(() => {
      if (questionIndex === dnaQuestions.length - 1) {
        router.push(`/climbing-dna/result?answers=${encodeURIComponent(encodeDnaAnswers(nextAnswers))}`);
        return;
      }
      setQuestionIndex((current) => current + 1);
      setTransitioning(false);
    }, 260);
  }

  function restart() {
    setAnswers({});
    setQuestionIndex(0);
    setTransitioning(false);
  }

  return (
    <main className="min-h-[calc(100svh-72px)] bg-cream px-5 py-[72px] sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between gap-5">
          <p className="editorial-kicker text-terracotta">{text.journey}</p>
          <span className="text-sm font-medium text-charcoal/45">{String(questionIndex + 1).padStart(2, "0")} / {String(dnaQuestions.length).padStart(2, "0")}</span>
        </div>
        <div className="mt-4 h-px bg-sand"><div className="h-px bg-brandforest transition-[width] duration-200" style={{ width: `${((questionIndex + 1) / dnaQuestions.length) * 100}%` }} /></div>

        <section className="quest-reveal" key={question.id}>
          <div className="mx-auto mt-14 max-w-3xl text-center">
            <h1 className="display-serif text-5xl font-medium leading-[1.04] text-brandforest sm:text-6xl">{question.prompt[locale]}</h1>
            <p className="mt-5 text-base text-charcoal/58">{question.helper[locale]}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/42">{transitioning && questionIndex === dnaQuestions.length - 1 ? text.preparing : text.choose}</p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {question.options.map((option) => {
              const active = selected === option.id;
              return (
                <button aria-pressed={active} className={`dna-option-card group text-left ${active ? "dna-option-card-selected" : ""}`} disabled={transitioning} key={option.id} onClick={() => chooseOption(option.id)} type="button">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand/30">
                    <img alt="" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.015]" src={getArtwork(option)} />
                    {active ? <span className="absolute right-3 top-3 h-3 w-3 rounded-full border-2 border-cream bg-brandforest" /> : null}
                  </div>
                  <h2 className="display-serif mt-5 text-2xl font-medium text-brandforest">{option.label[locale]}</h2>
                  <p className="mt-2 text-sm leading-6 text-charcoal/58">{option.description[locale]}</p>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-10 flex min-h-12 items-center justify-between gap-5">
          {questionIndex > 0 ? <button className="text-link" disabled={transitioning} onClick={() => setQuestionIndex((current) => current - 1)} type="button">← {text.back}</button> : <span />}
          <button className="text-link text-charcoal/48" disabled={transitioning} onClick={restart} type="button">{text.restart}</button>
        </div>
      </div>
    </main>
  );
}
