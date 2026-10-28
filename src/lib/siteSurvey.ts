export const surveyVersion = "site-value-v1";

export const surveyOptions = {
  experience: [
    { value: "never", en: "Not tried climbing yet", zh: "尚未尝试" },
    { value: "indoor", en: "Mostly indoors", zh: "主要室内" },
    { value: "occasional-outdoor", en: "Occasionally outdoors", zh: "偶尔户外" },
    { value: "frequent-outdoor", en: "Often outdoors", zh: "经常户外" }
  ],
  features: [
    { value: "home", en: "Homepage", zh: "首页" },
    { value: "dna", en: "Climbing DNA", zh: "攀岩 DNA" },
    { value: "map", en: "Map and search", zh: "地图与搜索" },
    { value: "destination", en: "Destination pages", zh: "目的地详情" },
    { value: "route", en: "Route pages", zh: "线路详情" },
    { value: "my-atlas", en: "My Atlas", zh: "我的地图册" }
  ],
  discovery: [
    { value: "yes", en: "Yes", zh: "是" },
    { value: "no", en: "No", zh: "没有" },
    { value: "not-tried", en: "I did not try looking", zh: "没有尝试寻找" },
    { value: "no-need", en: "I do not currently need this", zh: "目前没有相关需求" }
  ],
  returnReasons: [
    { value: "inspiration", en: "Find destination ideas", zh: "寻找目的地灵感" },
    { value: "compare-routes", en: "Compare routes", zh: "比较线路" },
    { value: "preferences", en: "Explore my climbing preferences", zh: "了解攀岩偏好" },
    { value: "journal", en: "Keep climbing plans and records", zh: "记录攀岩与计划" },
    { value: "no-return", en: "Not for now", zh: "暂时不会再用" },
    { value: "unsure", en: "Not sure yet", zh: "还不确定" }
  ]
} as const;

export type SiteSurveyAnswers = {
  experience: string;
  features: string[];
  clarity: number;
  fun: number | null;
  discovery: string;
  returnReasons: string[];
  improvement: string;
};

export type SiteSurveyContext = {
  source: string;
  medium: string | null;
  campaign: string | null;
  entryPath: string;
};

export type SiteSurveySubmission = {
  version: typeof surveyVersion;
  submissionId: string;
  locale: "en" | "zh";
  answers: SiteSurveyAnswers;
  context: SiteSurveyContext;
};

const attributionKey = "climbatlas-survey-attribution";
const campaignToken = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/;
const publicPath = /^\/(?:explore|feedback|my-atlas|climbing-dna(?:\/result)?|destinations\/[a-z0-9-]+(?:\/routes\/[a-z0-9-]+)?)?$/;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function token(value: unknown) {
  return typeof value === "string" && campaignToken.test(value) ? value : null;
}

export function normalizeSiteSurveyContext(value: unknown): SiteSurveyContext {
  const context = record(value) ? value : {};
  return {
    source: token(context.source) ?? "unattributed",
    medium: token(context.medium),
    campaign: token(context.campaign),
    entryPath: typeof context.entryPath === "string" && context.entryPath.length <= 200 && publicPath.test(context.entryPath)
      ? context.entryPath
      : "/feedback"
  };
}

// Only explicit campaign labels and a public pathname are retained. No full URL,
// referrer, DNA answers, account information, or persistent visitor ID is saved.
export function getSiteSurveyContext(): SiteSurveyContext {
  if (typeof window === "undefined") return normalizeSiteSurveyContext(null);
  const url = new URL(window.location.href);
  let previous: unknown;
  try {
    const stored = window.sessionStorage.getItem(attributionKey);
    previous = stored ? JSON.parse(stored) : undefined;
  } catch {
    previous = undefined;
  }
  const source = token(url.searchParams.get("utm_source"));
  const context = source || !record(previous)
    ? normalizeSiteSurveyContext({
        source,
        medium: url.searchParams.get("utm_medium"),
        campaign: url.searchParams.get("utm_campaign"),
        entryPath: url.pathname
      })
    : normalizeSiteSurveyContext(previous);
  try {
    window.sessionStorage.setItem(attributionKey, JSON.stringify(context));
  } catch {
    // Submitting still works when the browser blocks session storage.
  }
  return context;
}

function validChoice(value: unknown, options: readonly { value: string }[]) {
  return typeof value === "string" && options.some((option) => option.value === value);
}

function validChoices(value: unknown, options: readonly { value: string }[]): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.length <= options.length &&
    new Set(value).size === value.length && value.every((item) => validChoice(item, options));
}

function rating(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
}

export function parseSiteSurveySubmission(value: unknown): SiteSurveySubmission | null {
  if (!record(value) || value.version !== surveyVersion ||
      typeof value.submissionId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.submissionId) ||
      (value.locale !== "en" && value.locale !== "zh") || !record(value.answers)) return null;

  const answers = value.answers;
  if (!validChoice(answers.experience, surveyOptions.experience) ||
      !validChoices(answers.features, surveyOptions.features) ||
      !rating(answers.clarity) || (answers.fun !== null && !rating(answers.fun)) ||
      !validChoice(answers.discovery, surveyOptions.discovery) ||
      !validChoices(answers.returnReasons, surveyOptions.returnReasons) ||
      typeof answers.improvement !== "string" || answers.improvement.length > 1000) return null;
  if (answers.returnReasons.length > 1 &&
      answers.returnReasons.some((reason) => reason === "no-return" || reason === "unsure")) return null;

  return {
    version: surveyVersion,
    submissionId: value.submissionId,
    locale: value.locale,
    answers: {
      experience: answers.experience as string,
      features: [...answers.features],
      clarity: answers.clarity,
      fun: answers.fun as number | null,
      discovery: answers.discovery as string,
      returnReasons: [...answers.returnReasons],
      improvement: answers.improvement.trim()
    },
    context: normalizeSiteSurveyContext(value.context)
  };
}
