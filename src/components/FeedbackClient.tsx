"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getSiteSurveyContext,
  surveyOptions,
  surveyVersion,
  type SiteSurveyAnswers
} from "@/lib/siteSurvey";

type SurveyForm = Omit<SiteSurveyAnswers, "clarity" | "fun"> & {
  clarity: number | null;
  fun: number | null | undefined;
};
type QuestionId = "experience" | "features" | "clarity" | "fun" | "discovery" | "returnReasons";
type FormErrors = Partial<Record<QuestionId, string>>;

const emptyForm: SurveyForm = {
  experience: "",
  features: [],
  clarity: null,
  fun: undefined,
  discovery: "",
  returnReasons: [],
  improvement: ""
};

export function FeedbackClient() {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const [form, setForm] = useState<SurveyForm>(emptyForm);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submissionId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors: FormErrors = {};
  const chooseOne = isZh ? "请选择一个选项。" : "Choose one option.";
  const chooseSome = isZh ? "请至少选择一项。" : "Choose at least one option.";
  if (!form.experience) errors.experience = chooseOne;
  if (!form.features.length) errors.features = chooseSome;
  if (form.clarity === null) errors.clarity = chooseOne;
  if (form.fun === undefined) errors.fun = chooseOne;
  if (!form.discovery) errors.discovery = chooseOne;
  if (!form.returnReasons.length) errors.returnReasons = chooseSome;

  function updateField<K extends keyof SurveyForm>(key: K, value: SurveyForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSubmitError("");
    // Keep an unchanged retry idempotent; edited answers form a new submission.
    submissionId.current = null;
  }

  function toggleFeature(value: string) {
    updateField("features", form.features.includes(value)
      ? form.features.filter((feature) => feature !== value)
      : [...form.features, value]);
  }

  function toggleReturnReason(value: string) {
    const exclusive = ["no-return", "unsure"];
    if (form.returnReasons.includes(value)) {
      updateField("returnReasons", form.returnReasons.filter((reason) => reason !== value));
    } else if (exclusive.includes(value)) {
      updateField("returnReasons", [value]);
    } else {
      updateField("returnReasons", [...form.returnReasons.filter((reason) => !exclusive.includes(reason)), value]);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || isSaved) return;
    setHasAttempted(true);
    setSubmitError("");
    const firstError = Object.keys(errors)[0] as QuestionId | undefined;
    if (firstError) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    setIsSubmitting(true);
    submissionId.current ??= crypto.randomUUID();
    const answers: SiteSurveyAnswers = {
      ...form,
      clarity: form.clarity as number,
      fun: form.fun ?? null,
      improvement: form.improvement.trim()
    };
    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: surveyVersion,
          submissionId: submissionId.current,
          locale,
          answers,
          context: getSiteSurveyContext()
        })
      });
      const result: { saved?: boolean } = await response.json();
      if (!response.ok || result.saved !== true) throw new Error("Survey was not confirmed saved.");
      setIsSaved(true);
    } catch {
      setSubmitError(isZh
        ? "暂时未能确认提交成功。你的回答仍在这里，请稍后重试。"
        : "We could not confirm your submission. Your answers are still here. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="phase6-content min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-brandforest/15 pb-7 sm:pb-9">
          <p className="editorial-kicker text-terracotta">{isZh ? "网站体验问卷" : "Website experience survey"}</p>
          <h1 className="display-serif mt-4 text-4xl font-medium leading-[1.08] text-brandforest sm:text-5xl">{isZh ? "分享你的 ClimbAtlas 体验" : "How was your ClimbAtlas visit?"}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-charcoal/68">{isZh
            ? "6 道选择题，1 道选填题。告诉我们哪些地方有趣、哪些地方有用。无需登录。"
            : "6 choice questions and 1 optional comment. Tell us what felt interesting and useful. No sign-in needed."}</p>
        </header>

        {isSaved ? (
          <section aria-live="polite" className="border-b border-brandforest/15 py-12" role="status">
            <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full bg-brandforest/10 text-2xl text-brandforest">✓</span>
            <h2 className="display-serif mt-5 text-3xl text-brandforest">{isZh ? "谢谢，回答已保存。" : "Thank you. Your answers are saved."}</h2>
            <p className="mt-3 text-sm leading-6 text-charcoal/65">{isZh ? "你的反馈会帮助我们决定接下来改进什么。" : "Your feedback will help us decide what to improve next."}</p>
            <div className="mt-7 flex flex-wrap gap-6"><Link className="text-link" href="/explore">{isZh ? "继续探索地图" : "Keep exploring"} →</Link><Link className="text-link" href="/">{isZh ? "返回首页" : "Back to home"}</Link></div>
          </section>
        ) : (
          <form noValidate onSubmit={handleSubmit} ref={formRef}>
            <fieldset className="min-w-0" disabled={isSubmitting}>
              <Question error={hasAttempted ? errors.experience : undefined} id="experience" number={1} title={isZh ? "你的攀岩经历是？" : "What is your climbing experience?"}>
                <div className="grid gap-2 sm:grid-cols-2">{surveyOptions.experience.map((option) => (
                  <Choice checked={form.experience === option.value} key={option.value} label={option[locale]} name="experience" onChange={() => updateField("experience", option.value)} type="radio" value={option.value} />
                ))}</div>
              </Question>

              <Question error={hasAttempted ? errors.features : undefined} hint={isZh ? "选择这次实际体验过的内容，可多选。" : "Select everything you actually tried on this visit."} id="features" number={2} title={isZh ? "这次体验了哪些功能？" : "What did you try on this visit?"}>
                <div className="grid gap-2 sm:grid-cols-2">{surveyOptions.features.map((option) => (
                  <Choice checked={form.features.includes(option.value)} key={option.value} label={option[locale]} name="features" onChange={() => toggleFeature(option.value)} type="checkbox" value={option.value} />
                ))}</div>
              </Question>

              <Question error={hasAttempted ? errors.clarity : undefined} id="clarity" number={3} title={isZh ? "你是否清楚这个网站能做什么？" : "How clear is the website’s purpose to you?"}>
                <Rating firstLabel={isZh ? "完全不清楚" : "Not at all clear"} lastLabel={isZh ? "非常清楚" : "Very clear"} name="clarity" onChange={(value) => updateField("clarity", value)} value={form.clarity} />
              </Question>

              <Question error={hasAttempted ? errors.fun : undefined} id="fun" number={4} title={isZh ? "你觉得这个网站有多有趣？" : "How interesting did you find the website?"}>
                <Rating firstLabel={isZh ? "完全不觉得有趣" : "Not at all interesting"} lastLabel={isZh ? "非常有趣" : "Very interesting"} name="fun" onChange={(value) => updateField("fun", value)} value={form.fun} />
                <div className="mt-3"><Choice checked={form.fun === null} label={isZh ? "浏览太少，无法评价" : "I haven’t explored enough to say"} name="fun" onChange={() => updateField("fun", null)} type="radio" value="unable-to-rate" /></div>
              </Question>

              <Question error={hasAttempted ? errors.discovery : undefined} id="discovery" number={5} title={isZh ? "它是否帮你发现了值得了解的目的地或线路？" : "Did it help you discover a destination or route worth learning more about?"}>
                <div className="grid gap-2 sm:grid-cols-2">{surveyOptions.discovery.map((option) => (
                  <Choice checked={form.discovery === option.value} key={option.value} label={option[locale]} name="discovery" onChange={() => updateField("discovery", option.value)} type="radio" value={option.value} />
                ))}</div>
              </Question>

              <Question error={hasAttempted ? errors.returnReasons : undefined} hint={isZh ? "可多选；也可以选择暂时不会使用或还不确定。" : "Select all that apply, or choose that you would not return or are unsure."} id="returnReasons" number={6} title={isZh ? "你可能会因为什么再次使用？" : "What might bring you back?"}>
                <div className="grid gap-2 sm:grid-cols-2">{surveyOptions.returnReasons.map((option) => (
                  <Choice checked={form.returnReasons.includes(option.value)} key={option.value} label={option[locale]} name="returnReasons" onChange={() => toggleReturnReason(option.value)} type="checkbox" value={option.value} />
                ))}</div>
              </Question>

              <fieldset className="min-w-0 border-b border-brandforest/15 py-7 sm:py-8">
                <legend className="float-left w-full text-base font-semibold leading-6 text-brandforest"><span className="mr-3 text-sm text-terracotta">07</span>{isZh ? "你最希望改进什么？" : "What would you most like us to improve?"}<span className="ml-2 text-xs font-normal text-charcoal/50">{isZh ? "选填" : "Optional"}</span></legend>
                <div className="clear-both pt-4">
                  <label className="sr-only" htmlFor="survey-improvement">{isZh ? "你最希望改进什么？" : "What would you most like us to improve?"}</label>
                  <textarea className="min-h-28 w-full rounded-md border border-brandforest/20 bg-white/60 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-charcoal/40 focus:border-brandforest focus:ring-2 focus:ring-brandforest/15" id="survey-improvement" maxLength={1000} onChange={(event) => updateField("improvement", event.target.value)} placeholder={isZh ? "可以说一个具体页面、操作或内容。请勿填写个人联系方式。" : "A particular page, action, or piece of content. Please leave out personal contact details."} value={form.improvement} />
                  <p className="mt-2 text-right text-xs text-charcoal/45">{form.improvement.length} / 1000</p>
                </div>
              </fieldset>
            </fieldset>

            <div className="pt-7">
              {hasAttempted && Object.keys(errors).length > 0 ? <p className="mb-4 text-sm font-medium text-red-800" role="alert">{isZh ? "请完成前 6 题后提交，第 7 题可以留空。" : "Please answer the first 6 questions. The last question is optional."}</p> : null}
              {submitError ? <p className="mb-4 rounded-md border border-red-800/20 bg-red-800/5 p-4 text-sm leading-6 text-red-900" role="alert">{submitError}</p> : null}
              <button className="min-h-12 w-full rounded-md bg-brandforest px-6 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brandforest disabled:cursor-wait disabled:opacity-60 sm:w-auto" disabled={isSubmitting} type="submit">{isSubmitting ? (isZh ? "正在提交……" : "Submitting…") : (isZh ? "提交问卷" : "Submit survey")} <span aria-hidden="true">→</span></button>
              <p className="mt-4 max-w-xl text-xs leading-5 text-charcoal/50">{isZh ? "提交后，我们会保存你的回答、页面语言和访问来源，用于改进网站及汇总分析。无需提供姓名或邮箱。" : "Submitting saves your answers, page language, and visit source for website improvements and aggregate analysis. No name or email is requested."}</p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

function Question({ children, error, hint, id, number, title }: { children: ReactNode; error?: string; hint?: string; id: QuestionId; number: number; title: string }) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} className="min-w-0 border-b border-brandforest/15 py-7 sm:py-8">
      <legend className="float-left w-full text-base font-semibold leading-6 text-brandforest"><span className="mr-3 text-sm text-terracotta">0{number}</span>{title}</legend>
      <div className="clear-both pt-4">
        {hint ? <p className="mb-3 text-xs leading-5 text-charcoal/55" id={`${id}-hint`}>{hint}</p> : null}
        {children}
        {error ? <p className="mt-3 text-sm text-red-800" id={`${id}-error`}>{error}</p> : null}
      </div>
    </fieldset>
  );
}

function Choice({ checked, label, name, onChange, type, value }: { checked: boolean; label: string; name: string; onChange: () => void; type: "checkbox" | "radio"; value: string }) {
  return (
    <label className="relative flex cursor-pointer">
      <input checked={checked} className="peer sr-only" name={name} onChange={onChange} type={type} value={value} />
      <span className="flex min-h-11 w-full items-center gap-3 rounded-md border border-brandforest/15 bg-white/40 px-3 py-2.5 text-sm leading-5 text-charcoal/75 transition hover:border-brandforest/45 peer-checked:border-brandforest peer-checked:bg-brandforest/8 peer-checked:text-brandforest peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brandforest peer-disabled:cursor-wait">
        <span aria-hidden="true" className={`grid h-4 w-4 shrink-0 place-items-center border text-[10px] ${type === "radio" ? "rounded-full" : "rounded-sm"} ${checked ? "border-brandforest bg-brandforest text-cream" : "border-brandforest/30"}`}>{checked ? "✓" : ""}</span>
        {label}
      </span>
    </label>
  );
}

function Rating({ firstLabel, lastLabel, name, onChange, value }: { firstLabel: string; lastLabel: string; name: string; onChange: (value: number) => void; value: number | null | undefined }) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">{[1, 2, 3, 4, 5].map((score) => (
        <label className="cursor-pointer" key={score}>
          <input checked={value === score} className="peer sr-only" name={name} onChange={() => onChange(score)} type="radio" value={score} />
          <span className="grid min-h-12 place-items-center rounded-md border border-brandforest/20 bg-white/40 text-base font-semibold text-brandforest transition hover:border-brandforest/55 peer-checked:border-brandforest peer-checked:bg-brandforest peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brandforest peer-disabled:cursor-wait">{score}</span>
        </label>
      ))}</div>
      <div className="mt-2 flex justify-between gap-5 text-xs leading-5 text-charcoal/55"><span>1 · {firstLabel}</span><span className="text-right">5 · {lastLabel}</span></div>
    </div>
  );
}
