"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";

type FeedbackForm = {
  routeGoal: string;
  experience: string;
  understoodPurpose: string;
  usefulFeatures: string[];
  sourceTrust: string;
  nextFeature: string;
  usefulMoment: string;
  confusingMoment: string;
  contact: string;
};

const defaultForm: FeedbackForm = {
  routeGoal: "",
  experience: "",
  understoodPurpose: "",
  usefulFeatures: [],
  sourceTrust: "",
  nextFeature: "",
  usefulMoment: "",
  confusingMoment: "",
  contact: ""
};

const featureOptions = [
  { value: "Map", en: "Map", zh: "地图" },
  { value: "Search", en: "Search", zh: "搜索" },
  { value: "Climbing DNA", en: "Climbing DNA", zh: "Climbing DNA 偏好测试" },
  { value: "Destination pages", en: "Destination pages", zh: "目的地详情页" },
  { value: "Bilingual content", en: "Bilingual content", zh: "双语内容" }
];

const nextFeatureOptions = [
  { value: "Wishlist", en: "Wishlist", zh: "想爬清单" },
  { value: "Climbed routes", en: "Climbed routes", zh: "已爬记录" },
  { value: "Private notes", en: "Private notes", zh: "私人笔记" },
  { value: "Public tips", en: "Public tips", zh: "公开心得" },
  { value: "Conditions updates", en: "Conditions updates", zh: "条件更新" }
];

function formatFeedback(form: FeedbackForm) {
  return [
    "ClimbAtlas Beta feedback",
    "",
    `Route or destination decision: ${form.routeGoal || "-"}`,
    `Climbing experience: ${form.experience || "-"}`,
    `Understood purpose in 1 minute: ${form.understoodPurpose || "-"}`,
    `Most useful features: ${form.usefulFeatures.join(", ") || "-"}`,
    `Trust in source labels: ${form.sourceTrust || "-"}`,
    `Most wanted next feature: ${form.nextFeature || "-"}`,
    "",
    "Most useful moment:",
    form.usefulMoment || "-",
    "",
    "Confusing moment:",
    form.confusingMoment || "-",
    "",
    `Optional contact: ${form.contact || "-"}`
  ].join("\n");
}

export function FeedbackClient() {
  const { locale } = useLanguage();
  const [form, setForm] = useState<FeedbackForm>(defaultForm);
  const [generated, setGenerated] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const feedbackEmail =
    process.env.NEXT_PUBLIC_FEEDBACK_EMAIL?.trim() || "thz923@qq.com";
  const isZh = locale === "zh";

  const mailHref = useMemo(() => {
    const subject = encodeURIComponent("ClimbAtlas Beta feedback");
    const body = encodeURIComponent(generated || formatFeedback(form));

    return `mailto:${feedbackEmail ?? ""}?subject=${subject}&body=${body}`;
  }, [feedbackEmail, form, generated]);

  function updateField<K extends keyof FeedbackForm>(
    key: K,
    value: FeedbackForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleFeature(value: string) {
    setForm((current) => {
      const exists = current.usefulFeatures.includes(value);

      return {
        ...current,
        usefulFeatures: exists
          ? current.usefulFeatures.filter((feature) => feature !== value)
          : [...current.usefulFeatures, value]
      };
    });
  }

  async function copyFeedback(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(isZh ? "已复制，可以直接发给 ClimbAtlas。" : "Copied. Ready to send.");
    } catch {
      setCopyStatus(
        isZh
          ? "浏览器没有允许自动复制，你可以手动选中文本复制。"
          : "Browser copy was blocked. You can select and copy the text manually."
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // V1 Beta avoids a database. We generate portable feedback text first,
    // then users can copy it or send it through the configured email link.
    const text = formatFeedback(form);
    setGenerated(text);
    await copyFeedback(text);
  }

  return (
    <main className="phase6-content min-h-screen bg-cream text-charcoal">
      <SiteHeader />

      <div className="relative mx-auto max-w-5xl px-5 py-[72px] sm:px-8 lg:px-12 lg:py-20">
        <div className="hidden">
          <Link
            className="rounded-lg border border-antiquegold/30 bg-parchment/90 px-4 py-2 text-sm font-black text-bark shadow-atlas transition hover:bg-antiquegold"
            href="/"
          >
            {isZh ? "返回地图" : "Back to map"}
          </Link>
          <LanguageToggle />
        </div>

        <section className="overflow-hidden border-y border-brandforest/15 bg-cream">
          <div className="border-b border-brandforest/15 bg-cream p-6 sm:p-8">
            <p className="field-note-label text-ridge">
              {isZh ? "Beta 反馈" : "Beta feedback"}
            </p>
            <h1 className="display-serif mt-3 max-w-3xl text-5xl font-medium leading-tight text-brandforest sm:text-6xl">
              {isZh
                ? "帮我们判断 ClimbAtlas 下一步该做什么"
                : "Help shape what ClimbAtlas builds next"}
            </h1>
            <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-bark/70">
              {isZh
                ? "这个表单部署在 ClimbAtlas 自己的网站里，国内用户访问更稳定。当前 Beta 不保存账号数据；提交后会生成一份反馈文本，你可以复制或通过邮件发送。"
                : "This form lives on the ClimbAtlas site, so it does not depend on external survey tools. V1 Beta does not store account data; submitting creates a feedback note you can copy or send by email."}
            </p>
          </div>

          <form className="grid gap-5 p-6 sm:p-8" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="field-note-label text-ridge">
                {isZh ? "你当时想决定什么？" : "What were you trying to decide?"}
              </span>
              <input
                className="rounded-md border border-bark/20 bg-white/80 px-4 py-3 text-sm font-bold outline-none transition focus:border-ridge"
                onChange={(event) => updateField("routeGoal", event.target.value)}
                placeholder={
                  isZh
                    ? "例如：第一次去 Yosemite 想选哪条路线"
                    : "Example: which route to try on a first Yosemite trip"
                }
                value={form.routeGoal}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="field-note-label text-ridge">
                  {isZh ? "你的攀岩经验" : "Your climbing experience"}
                </span>
                <select
                  className="rounded-md border border-bark/20 bg-white/80 px-4 py-3 text-sm font-bold outline-none transition focus:border-ridge"
                  onChange={(event) => updateField("experience", event.target.value)}
                  value={form.experience}
                >
                  <option value="">{isZh ? "请选择" : "Choose one"}</option>
                  <option value="Indoor mostly">
                    {isZh ? "主要室内" : "Indoor mostly"}
                  </option>
                  <option value="New outdoor climber">
                    {isZh ? "刚开始户外" : "New outdoor climber"}
                  </option>
                  <option value="Regular outdoor climber">
                    {isZh ? "经常户外攀岩" : "Regular outdoor climber"}
                  </option>
                  <option value="Trip planner / guide / coach">
                    {isZh ? "旅行规划/教练/向导" : "Trip planner / guide / coach"}
                  </option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="field-note-label text-ridge">
                  {isZh
                    ? "1 分钟内理解网站用途了吗？"
                    : "Did you understand it in 1 minute?"}
                </span>
                <select
                  className="rounded-md border border-bark/20 bg-white/80 px-4 py-3 text-sm font-bold outline-none transition focus:border-ridge"
                  onChange={(event) =>
                    updateField("understoodPurpose", event.target.value)
                  }
                  value={form.understoodPurpose}
                >
                  <option value="">{isZh ? "请选择" : "Choose one"}</option>
                  <option value="Yes, very clear">
                    {isZh ? "很清楚" : "Yes, very clear"}
                  </option>
                  <option value="Mostly">
                    {isZh ? "大致清楚" : "Mostly"}
                  </option>
                  <option value="Not really">
                    {isZh ? "不太清楚" : "Not really"}
                  </option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="field-note-label text-ridge">
                  {isZh ? "你信任来源标注吗？" : "Do you trust the source labels?"}
                </span>
                <select
                  className="rounded-md border border-bark/20 bg-white/80 px-4 py-3 text-sm font-bold outline-none transition focus:border-ridge"
                  onChange={(event) => updateField("sourceTrust", event.target.value)}
                  value={form.sourceTrust}
                >
                  <option value="">{isZh ? "请选择" : "Choose one"}</option>
                  <option value="Yes">{isZh ? "信任" : "Yes"}</option>
                  <option value="Somewhat">{isZh ? "有点信任" : "Somewhat"}</option>
                  <option value="Need more detail">
                    {isZh ? "还需要更多说明" : "Need more detail"}
                  </option>
                </select>
              </label>
            </div>

            <section className="rounded-md border border-bark/15 bg-white/50 p-4">
              <p className="field-note-label text-ridge">
                {isZh ? "你最常用/最有用的功能" : "Most useful features"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {featureOptions.map((option) => (
                  <label
                    className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-black transition ${
                      form.usefulFeatures.includes(option.value)
                        ? "border-ridge bg-ridge text-parchment"
                        : "border-bark/15 bg-parchment/75 text-bark hover:border-ridge/50"
                    }`}
                    key={option.value}
                  >
                    <input
                      checked={form.usefulFeatures.includes(option.value)}
                      className="sr-only"
                      onChange={() => toggleFeature(option.value)}
                      type="checkbox"
                    />
                    {isZh ? option.zh : option.en}
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-bark/15 bg-white/50 p-4">
              <p className="field-note-label text-ridge">
                {isZh ? "你最想要的下一个功能" : "Most wanted next feature"}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {nextFeatureOptions.map((option) => (
                  <label
                    className={`cursor-pointer rounded-md border px-3 py-3 text-sm font-black transition ${
                      form.nextFeature === option.value
                        ? "border-ridge bg-ridge text-parchment"
                        : "border-bark/15 bg-parchment/75 text-bark hover:border-ridge/50"
                    }`}
                    key={option.value}
                  >
                    <input
                      checked={form.nextFeature === option.value}
                      className="sr-only"
                      name="nextFeature"
                      onChange={() => updateField("nextFeature", option.value)}
                      type="radio"
                    />
                    {isZh ? option.zh : option.en}
                  </label>
                ))}
              </div>
            </section>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="field-note-label text-ridge">
                  {isZh ? "哪里最有用？" : "What felt most useful?"}
                </span>
                <textarea
                  className="min-h-32 rounded-md border border-bark/20 bg-white/80 px-4 py-3 text-sm font-bold leading-6 outline-none transition focus:border-ridge"
                  onChange={(event) =>
                    updateField("usefulMoment", event.target.value)
                  }
                  placeholder={
                    isZh
                      ? "例如：DNA 偏好匹配让我更容易比较目的地。"
                      : "Example: DNA preference matches made destinations easier to compare."
                  }
                  value={form.usefulMoment}
                />
              </label>

              <label className="grid gap-2">
                <span className="field-note-label text-ridge">
                  {isZh ? "哪里让你困惑？" : "What felt confusing?"}
                </span>
                <textarea
                  className="min-h-32 rounded-md border border-bark/20 bg-white/80 px-4 py-3 text-sm font-bold leading-6 outline-none transition focus:border-ridge"
                  onChange={(event) =>
                    updateField("confusingMoment", event.target.value)
                  }
                  placeholder={
                    isZh
                      ? "例如：地图标点太密，或者某个路线卡片信息太多。"
                      : "Example: map markers felt dense, or a route card had too much information."
                  }
                  value={form.confusingMoment}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="field-note-label text-ridge">
                {isZh ? "联系方式（可选）" : "Contact, optional"}
              </span>
              <input
                className="rounded-md border border-bark/20 bg-white/80 px-4 py-3 text-sm font-bold outline-none transition focus:border-ridge"
                onChange={(event) => updateField("contact", event.target.value)}
                placeholder={
                  isZh
                    ? "邮箱、微信备注名，或留空"
                    : "Email, social handle, or leave blank"
                }
                value={form.contact}
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="rounded-md border border-ridge bg-ridge px-5 py-3 text-sm font-black text-parchment shadow-atlas transition hover:bg-forest"
                type="submit"
              >
                {isZh ? "生成并复制反馈" : "Generate and copy feedback"}
              </button>

              <a
                className="rounded-md border border-bark/20 bg-parchment px-5 py-3 text-sm font-black text-bark transition hover:border-ridge"
                href={mailHref}
              >
                {isZh ? "用邮件发送" : "Send by email"}
              </a>

              <button
                className="rounded-md border border-bark/20 bg-white/70 px-5 py-3 text-sm font-black text-bark transition hover:border-ridge"
                onClick={() => {
                  setForm(defaultForm);
                  setGenerated("");
                  setCopyStatus("");
                }}
                type="button"
              >
                {isZh ? "清空" : "Clear"}
              </button>
            </div>

            {copyStatus ? (
              <p className="rounded-md border border-ridge/20 bg-ridge/10 px-4 py-3 text-sm font-black text-ridge">
                {copyStatus}
              </p>
            ) : null}

            {generated ? (
              <section className="rounded-md border border-bark/15 bg-bark p-4 text-parchment">
                <p className="field-note-label text-antiquegold">
                  {isZh ? "生成的反馈文本" : "Generated feedback note"}
                </p>
                <pre className="mt-3 whitespace-pre-wrap rounded-md border border-antiquegold/20 bg-black/20 p-4 text-sm leading-6 text-parchment/85">
                  {generated}
                </pre>
              </section>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
