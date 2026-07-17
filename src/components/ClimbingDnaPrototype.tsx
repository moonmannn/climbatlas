"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { dnaQuestions } from "@/data/dnaQuestions";
import { saveDnaAnswers } from "@/lib/climbingDnaStorage";
import { encodeDnaAnswers } from "@/lib/climbingDnaUrl";
import type { DnaAnswerMap } from "@/types/climbingDna";

const q1Artwork: Record<string, { src: string; alt: { en: string; zh: string } }> = {
  "seaside-limestone": {
    src: "/images/climbing-dna/quiz/seaside-limestone.webp",
    alt: {
      en: "Sunlit limestone cliffs rising above the sea",
      zh: "阳光下临海而立的石灰岩岩壁版画"
    }
  },
  "forest-granite": {
    src: "/images/climbing-dna/quiz/forest-granite.webp",
    alt: {
      en: "Granite cliffs surrounded by a quiet pine forest",
      zh: "松林环绕的安静花岗岩岩壁版画"
    }
  },
  "high-alpine-wall": {
    src: "/images/climbing-dna/quiz/high-alpine-wall.webp",
    alt: {
      en: "A monumental alpine wall above a mountain valley",
      zh: "高山山谷上方巨大岩壁的版画"
    }
  },
  "lively-local-crag": {
    src: "/images/climbing-dna/quiz/lively-crag.webp",
    alt: {
      en: "A lively climber basecamp beneath a starry crag",
      zh: "星空岩壁下热闹攀岩营地的版画"
    }
  }
};

const ui = {
  en: {
    eyebrow: "Climbing DNA 2.0",
    title: "What kind of climbing fits you?",
    intro:
      "Grades are only part of the story. Answer 10 questions to discover your climbing profile—and find the routes, crags, and experiences that match you.",
    start: "Discover My Climbing DNA",
    time: "10 questions · about 2–3 minutes",
    choose: "Choose the answer that feels most like you",
    back: "Back",
    restart: "Start again",
    preparing: "Building your climbing profile..."
  },
  zh: {
    eyebrow: "攀岩 DNA 2.0",
    title: "什么样的攀岩最适合你？",
    intro:
      "难度只是攀岩的一部分。回答 10 个问题，了解你的攀岩偏好，并找到与你匹配的线路、岩场和攀岩体验。",
    start: "发现我的攀岩 DNA",
    time: "10 个问题 · 约 2–3 分钟",
    choose: "选择最像你的答案",
    back: "返回",
    restart: "重新测试",
    preparing: "正在生成你的攀岩画像……"
  }
};

export function ClimbingDnaPrototype() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<DnaAnswerMap>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const question = dnaQuestions[questionIndex];
  const selected = answers[question.id];
  const text = ui[locale];
  const isVisualQuestion = question.order === 1;

  function scrollToQuestionTop() {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function startQuiz() {
    setStarted(true);
    scrollToQuestionTop();
  }

  function chooseOption(optionId: string) {
    if (transitioning) return;
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);
    setTransitioning(true);

    window.setTimeout(() => {
      if (questionIndex === dnaQuestions.length - 1) {
        saveDnaAnswers(nextAnswers);
        router.push(
          `/climbing-dna/result?answers=${encodeURIComponent(
            encodeDnaAnswers(nextAnswers)
          )}`
        );
        return;
      }
      setQuestionIndex((current) => current + 1);
      setTransitioning(false);
      scrollToQuestionTop();
    }, 260);
  }

  function goBack() {
    if (questionIndex === 0) {
      setStarted(false);
      return;
    }
    setQuestionIndex((current) => current - 1);
    scrollToQuestionTop();
  }

  function restart() {
    setAnswers({});
    setQuestionIndex(0);
    setTransitioning(false);
    setStarted(false);
  }

  if (!started) {
    return (
      <main className="min-h-[calc(100svh-72px)] bg-cream px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <section className="mx-auto grid max-w-[1240px] gap-12 border-y border-brandforest/15 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-16">
          <div className="max-w-2xl">
            <p className="editorial-kicker text-terracotta">{text.eyebrow}</p>
            <h1 className="display-serif mt-5 text-5xl font-medium leading-[1.02] text-brandforest sm:text-7xl">
              {text.title}
            </h1>
            <p className="mt-7 text-lg leading-8 text-charcoal/65">{text.intro}</p>
            <button
              className="primary-action mt-9"
              onClick={startQuiz}
              type="button"
            >
              {text.start} →
            </button>
            <p className="mt-4 text-sm text-charcoal/45">{text.time}</p>
          </div>
          <figure className="overflow-hidden rounded-lg bg-sand/25">
            <img
              alt={q1Artwork["seaside-limestone"].alt[locale]}
              className="aspect-[4/3] h-full w-full object-cover object-[center_54%]"
              src={q1Artwork["seaside-limestone"].src}
            />
          </figure>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100svh-72px)] bg-cream px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between gap-5">
          <p className="editorial-kicker text-terracotta">{text.eyebrow}</p>
          <span className="text-sm font-medium text-charcoal/45">
            {String(questionIndex + 1).padStart(2, "0")} / {String(dnaQuestions.length).padStart(2, "0")}
          </span>
        </div>
        <div
          aria-label={locale === "zh" ? "测试进度" : "Quiz progress"}
          aria-valuemax={dnaQuestions.length}
          aria-valuemin={1}
          aria-valuenow={questionIndex + 1}
          aria-valuetext={`${questionIndex + 1} / ${dnaQuestions.length}`}
          className="mt-4 h-px bg-sand"
          role="progressbar"
        >
          <div
            className="h-px bg-brandforest transition-[width] duration-200"
            style={{ width: `${((questionIndex + 1) / dnaQuestions.length) * 100}%` }}
          />
        </div>

        <section className="quest-reveal" key={question.id}>
          <div className="mx-auto mt-12 max-w-3xl text-center">
            <h1 className="display-serif text-4xl font-medium leading-[1.06] text-brandforest sm:text-6xl">
              {question.prompt[locale]}
            </h1>
            <p className="mt-5 text-base leading-7 text-charcoal/58">{question.helper[locale]}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/42">
              {transitioning && questionIndex === dnaQuestions.length - 1
                ? text.preparing
                : text.choose}
            </p>
          </div>

          <div
            className={`mt-10 grid gap-5 ${
              isVisualQuestion ? "grid-cols-2 lg:grid-cols-4" : "mx-auto max-w-4xl md:grid-cols-2"
            }`}
          >
            {question.options.map((option) => {
              const active = selected === option.id;
              const artwork = q1Artwork[option.id];
              return (
                <button
                  aria-pressed={active}
                  className={`dna-option-card group text-left ${
                    active ? "dna-option-card-selected" : ""
                  } ${isVisualQuestion ? "" : "min-h-44 p-5 sm:p-6"}`}
                  disabled={transitioning}
                  key={option.id}
                  onClick={() => chooseOption(option.id)}
                  type="button"
                >
                  {isVisualQuestion && artwork ? (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand/30">
                      <img
                        alt={artwork.alt[locale]}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.015]"
                        src={artwork.src}
                      />
                      {active ? (
                        <span className="absolute right-3 top-3 h-3 w-3 rounded-full border-2 border-cream bg-brandforest" />
                      ) : null}
                    </div>
                  ) : (
                    <span className="block h-px w-12 bg-terracotta/65" />
                  )}
                  <h2 className={`display-serif text-2xl font-medium text-brandforest ${isVisualQuestion ? "mt-5" : "mt-7"}`}>
                    {option.label[locale]}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-charcoal/58">{option.description[locale]}</p>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mx-auto mt-9 flex min-h-12 max-w-4xl items-center justify-between gap-5">
          <button className="text-link" disabled={transitioning} onClick={goBack} type="button">
            ← {text.back}
          </button>
          <button className="text-link text-charcoal/48" disabled={transitioning} onClick={restart} type="button">
            {text.restart}
          </button>
        </div>
      </div>
    </main>
  );
}
