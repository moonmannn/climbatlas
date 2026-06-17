"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getRouteDecisionHint as getLocalizedRouteDecisionHint,
  getRouteEditorialTips
} from "@/data/localizedContent";
import { useLanguage } from "@/components/LanguageProvider";
import {
  defaultRouteFinderAnswers,
  getRouteRecommendations,
  type RouteFinderAnswers,
  type RouteFinderCandidate
} from "@/lib/routeFinder";
import { getUiText } from "@/lib/uiText";
import type { Locale } from "@/types/destination";

type RouteFinderProps = {
  candidates: RouteFinderCandidate[];
  scopeLabel: string;
  variant?: "board" | "page";
};

type QuestionId = keyof RouteFinderAnswers;

type QuestOption = {
  value: string;
  label: string;
  description: string;
};

type QuestQuestion = {
  id: QuestionId;
  eyebrow: string;
  title: string;
  options: QuestOption[];
};

const englishQuestions: QuestQuestion[] = [
  {
    id: "goal",
    eyebrow: "Quest 1",
    title: "What kind of climbing day are you chasing?",
    options: [
      {
        value: "classic",
        label: "Classic experience",
        description: "A route with story, reputation, and a strong sense of place."
      },
      {
        value: "technique",
        label: "Practice technique",
        description: "A day for movement quality, footwork, and clean decisions."
      },
      {
        value: "endurance",
        label: "Build endurance",
        description: "A longer effort where pacing matters more than one hard move."
      },
      {
        value: "challenge",
        label: "Try a challenge",
        description: "A sharper objective where you want to test your limit."
      },
      {
        value: "adventure",
        label: "Adventure feeling",
        description: "A route that feels like a small expedition, not just a grade."
      }
    ]
  },
  {
    id: "energy",
    eyebrow: "Quest 2",
    title: "How much fire do you have today?",
    options: [
      {
        value: "easy",
        label: "Keep it light",
        description: "You want quality climbing without turning the day into a battle."
      },
      {
        value: "steady",
        label: "Steady",
        description: "You are ready for a real session, but not a full siege."
      },
      {
        value: "strong",
        label: "Feeling strong",
        description: "You want something physical and memorable."
      }
    ]
  },
  {
    id: "style",
    eyebrow: "Quest 3",
    title: "Which style sounds most fun?",
    options: [
      {
        value: "surprise",
        label: "Surprise me",
        description: "Let the atlas choose from the strongest matches."
      },
      {
        value: "power",
        label: "Power",
        description: "Shorter intensity, fingers, pockets, or bouldery movement."
      },
      {
        value: "endurance",
        label: "Endurance",
        description: "Longer sequences, pacing, and staying composed."
      },
      {
        value: "technical",
        label: "Technical",
        description: "Precision, route reading, and movement problem solving."
      },
      {
        value: "adventure-history",
        label: "Story or adventure",
        description: "A route chosen for atmosphere, history, or expedition energy."
      }
    ]
  },
  {
    id: "comfort",
    eyebrow: "Quest 4",
    title: "Where is your comfort zone right now?",
    options: [
      {
        value: "newer",
        label: "Newer outdoors",
        description: "You want a choice that respects learning and decision space."
      },
      {
        value: "intermediate",
        label: "Intermediate",
        description: "You are building outdoor experience and want a useful stretch."
      },
      {
        value: "experienced",
        label: "Experienced",
        description: "You are comfortable reading routes and managing a full session."
      },
      {
        value: "elite",
        label: "Elite project mode",
        description: "You are looking for high-end inspiration or limit-project energy."
      }
    ]
  }
];

const chineseQuestions: QuestQuestion[] = [
  {
    id: "goal",
    eyebrow: "任务 1",
    title: "今天想要什么样的攀岩日？",
    options: [
      {
        value: "classic",
        label: "经典体验",
        description: "想要一条有故事、有名气、有地点感的路线。"
      },
      {
        value: "technique",
        label: "练技术",
        description: "想把脚法、动作质量和判断练得更干净。"
      },
      {
        value: "endurance",
        label: "练耐力",
        description: "想要更长的输出，重点是节奏而不是单个难动作。"
      },
      {
        value: "challenge",
        label: "挑战一下",
        description: "想试一个更尖锐的目标，看看今天状态到哪里。"
      },
      {
        value: "adventure",
        label: "来点冒险感",
        description: "想要像小探险一样的路线，而不只是一个难度数字。"
      }
    ]
  },
  {
    id: "energy",
    eyebrow: "任务 2",
    title: "今天火力有多少？",
    options: [
      {
        value: "easy",
        label: "轻松一点",
        description: "想爬得有质量，但不想把今天变成战斗。"
      },
      {
        value: "steady",
        label: "稳定输出",
        description: "准备好认真爬一场，但不想进入长期围攻模式。"
      },
      {
        value: "strong",
        label: "状态很强",
        description: "想要一点身体参与感强、印象深的目标。"
      }
    ]
  },
  {
    id: "style",
    eyebrow: "任务 3",
    title: "哪种风格最有吸引力？",
    options: [
      {
        value: "surprise",
        label: "给我惊喜",
        description: "让地图从最匹配的路线里帮你挑。"
      },
      {
        value: "power",
        label: "力量型",
        description: "短强度、手指、洞点、抱石感或爆发。"
      },
      {
        value: "endurance",
        label: "耐力型",
        description: "长序列、节奏控制和保持冷静。"
      },
      {
        value: "technical",
        label: "技术型",
        description: "精准、读线和动作解题。"
      },
      {
        value: "adventure-history",
        label: "故事或冒险",
        description: "想要氛围、历史或小探险感。"
      }
    ]
  },
  {
    id: "comfort",
    eyebrow: "任务 4",
    title: "你现在的舒适区在哪里？",
    options: [
      {
        value: "newer",
        label: "户外新手",
        description: "想要尊重学习空间、不要过度压迫的选择。"
      },
      {
        value: "intermediate",
        label: "中级",
        description: "正在积累户外经验，想要有用的拉伸。"
      },
      {
        value: "experienced",
        label: "有经验",
        description: "能比较稳定地读线和管理完整 session。"
      },
      {
        value: "elite",
        label: "高端项目模式",
        description: "想看高难灵感或极限项目方向。"
      }
    ]
  }
];

function getQuestions(locale: Locale) {
  return locale === "zh" ? chineseQuestions : englishQuestions;
}

function getMatchLabel(label: string, locale: Locale) {
  if (locale !== "zh") {
    return label;
  }

  if (label === "Strong match") {
    return "强匹配";
  }

  if (label === "Good match") {
    return "不错的匹配";
  }

  return "拉伸选择";
}

function getOptionLabel(question: QuestQuestion, value?: string) {
  return question.options.find((option) => option.value === value)?.label;
}

export function RouteFinder({
  candidates,
  scopeLabel,
  variant = "page"
}: RouteFinderProps) {
  const { locale } = useLanguage();
  const t = getUiText(locale);
  const questions = getQuestions(locale);
  const [answers, setAnswers] = useState<Partial<RouteFinderAnswers>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentStep];
  const compact = variant === "page";
  const answeredCount = Object.keys(answers).length;
  const progress = showResults
    ? 100
    : Math.round((answeredCount / questions.length) * 100);
  const resolvedAnswers = {
    ...defaultRouteFinderAnswers,
    ...answers
  } as RouteFinderAnswers;

  const recommendations = useMemo(
    () => getRouteRecommendations(candidates, resolvedAnswers),
    [candidates, resolvedAnswers]
  );

  if (candidates.length === 0) {
    return null;
  }

  function chooseAnswer(questionId: QuestionId, value: string) {
    const nextAnswers = {
      ...answers,
      [questionId]: value
    } as Partial<RouteFinderAnswers>;

    setAnswers(nextAnswers);

    if (currentStep === questions.length - 1) {
      setShowResults(true);
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, questions.length - 1));
  }

  function goBack() {
    setShowResults(false);
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function resetQuest() {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  }

  return (
    <section
      className={`medieval-panel paper-texture ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-7"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="field-note-label text-antiquegold">
            {t.routeFinder.eyebrow}
          </p>
          <h2
            className={`font-black leading-tight text-parchment ${
              compact ? "text-2xl" : "text-4xl"
            }`}
          >
            {t.routeFinder.title}
          </h2>
        </div>
        <div className="rounded-md border border-antiquegold/35 bg-bark/45 px-3 py-2 text-sm font-bold text-parchment/80">
          {t.routeFinder.top3(scopeLabel)}
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full border border-antiquegold/30 bg-bark/55">
        <div
          className="h-full rounded-full bg-antiquegold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_18rem]">
        <div className="scroll-card quest-reveal p-5">
          {!showResults ? (
            <>
              <p className="field-note-label text-ridge">{question.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-bark">
                {question.title}
              </h3>

              <div className="mt-5 grid gap-3">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.value;

                  return (
                    <button
                      className={`quest-answer text-left ${
                        selected ? "quest-answer-selected" : ""
                      }`}
                      key={option.value}
                      onClick={() => chooseAnswer(question.id, option.value)}
                      type="button"
                    >
                      <span className="block text-sm font-black text-bark">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs font-bold leading-5 text-bark/60">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="field-note-label text-ridge">
                {t.routeFinder.resultsEyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-bark">
                {t.routeFinder.resultsTitle}
              </h3>

              <div className="mt-5 grid gap-3">
                {recommendations.map((recommendation) => (
                  <article
                    className="ink-frame rounded-md bg-white/70 p-4"
                    key={`${recommendation.destinationSlug}-${recommendation.route.id}`}
                  >
                    {(() => {
                      const localizedDecision =
                        getLocalizedRouteDecisionHint(
                          recommendation.route,
                          locale
                        ) || recommendation.reasons[0];
                      const localizedTips = getRouteEditorialTips(
                        recommendation.route,
                        locale
                      );
                      const goalLabel = getOptionLabel(
                        questions[0],
                        answers.goal
                      );
                      const energyLabel = getOptionLabel(
                        questions[1],
                        answers.energy
                      );
                      const displayReasons =
                        locale === "zh"
                          ? [
                              localizedDecision,
                              `它和你选择的「${goalLabel ?? "经典体验"}」目标、「${energyLabel ?? "稳定输出"}」状态比较合拍。`,
                              `ClimbAtlas 读到的路线性格：${recommendation.tags.join(", ")}。`
                            ]
                          : [
                              localizedDecision,
                              recommendation.reasons[1],
                              recommendation.reasons[2]
                            ];
                      const displayTips = [
                        localizedTips[0] ?? recommendation.tips[0],
                        locale === "zh"
                          ? "记录今天真正卡住你的点，下次训练会更有方向。"
                          : recommendation.tips[1]
                      ].filter(Boolean);

                      return (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-ridge">
                                {getMatchLabel(recommendation.matchLabel, locale)}
                              </p>
                              <h4 className="mt-1 text-xl font-black leading-tight text-bark">
                                {recommendation.route.name}
                              </h4>
                            </div>
                            <span className="rounded-full border border-forest/25 bg-forest/10 px-2 py-1 text-xs font-black text-forest">
                              {recommendation.score}%
                            </span>
                          </div>

                          <p className="mt-2 text-xs font-bold text-bark/60">
                            {recommendation.destinationName} -{" "}
                            {recommendation.route.grade}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {recommendation.tags.map((tag) => (
                              <span
                                className="rounded-md border border-ridge/30 bg-parchment/80 px-2 py-1 text-[11px] font-black text-bark/70"
                                key={tag}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <ul className="mt-3 space-y-2 text-sm leading-5 text-bark/70">
                            {displayReasons
                              .slice(0, compact ? 2 : 3)
                              .map((reason) => (
                                <li key={reason}>{reason}</li>
                              ))}
                          </ul>

                          <div className="mt-3 rounded-md border border-ridge/25 bg-parchment/70 p-3">
                            <p className="field-note-label text-ridge">
                              {t.nonBetaTips}
                            </p>
                            <ul className="mt-2 space-y-1 text-xs leading-5 text-bark/60">
                              {displayTips.map((tip) => (
                                <li key={tip}>{tip}</li>
                              ))}
                            </ul>
                          </div>

                          <Link
                            className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-forest/30 bg-forest px-3 py-2 text-sm font-black text-parchment transition hover:bg-bark"
                            href={`/destinations/${recommendation.destinationSlug}/routes/${recommendation.route.id}`}
                          >
                            {t.openRouteCard}
                          </Link>
                        </>
                      );
                    })()}
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="scroll-card p-4">
          <p className="field-note-label text-ridge">{t.yourChoices}</p>
          <div className="mt-3 space-y-2">
            {questions.map((item, index) => (
              <div
                className={`rounded-md border px-3 py-2 text-xs ${
                  index === currentStep && !showResults
                    ? "border-forest/35 bg-forest/10 text-bark"
                    : "border-ridge/25 bg-white/45 text-bark/60"
                }`}
                key={item.id}
              >
                <p className="font-black">{item.title}</p>
                <p className="mt-1 font-bold">
                  {getOptionLabel(item, answers[item.id]) ??
                    t.routeFinder.awaitingAnswer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              className="flex-1 rounded-md border border-ridge/35 bg-white/55 px-3 py-2 text-sm font-black text-bark transition hover:border-forest/40"
              disabled={currentStep === 0 && !showResults}
              onClick={goBack}
              type="button"
            >
              {t.back}
            </button>
            <button
              className="flex-1 rounded-md border border-ridge/35 bg-bark px-3 py-2 text-sm font-black text-parchment transition hover:bg-forest"
              onClick={resetQuest}
              type="button"
            >
              {t.routeFinder.reset}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
