import type { Locale } from "@/types/destination";
import type { GradeSystem, RouteClimbingType } from "@/types/route";

const climbingTypeLabels: Record<
  Locale,
  Record<"all" | RouteClimbingType, string>
> = {
  en: {
    all: "All types",
    sport: "Sport",
    trad: "Trad",
    boulder: "Bouldering",
    "top-rope": "Top rope",
    "multi-pitch": "Multi-pitch",
    alpine: "Alpine",
    ice: "Ice",
    mixed: "Mixed",
    other: "Other"
  },
  zh: {
    all: "全部类型",
    sport: "运动攀",
    trad: "传统攀",
    boulder: "抱石",
    "top-rope": "顶绳",
    "multi-pitch": "多段攀登",
    alpine: "高山攀登",
    ice: "攀冰",
    mixed: "混合攀登",
    other: "其他"
  }
};

const gradeSystemLabels: Record<Locale, Record<GradeSystem, string>> = {
  en: {
    yds: "Yosemite Decimal System (YDS)",
    french: "French",
    font: "Fontainebleau (Font)",
    "v-scale": "V scale",
    "british-trad": "British trad",
    uiaa: "UIAA",
    australian: "Australian",
    alpine: "Alpine",
    aid: "Aid",
    ice: "Ice",
    mixed: "Mixed",
    unknown: "Unclassified"
  },
  zh: {
    yds: "优胜美地十进制（YDS）",
    french: "法国难度",
    font: "枫丹白露（Font）",
    "v-scale": "V 级",
    "british-trad": "英国传统攀难度",
    uiaa: "UIAA",
    australian: "澳大利亚难度",
    alpine: "高山难度",
    aid: "人工攀登难度",
    ice: "攀冰难度",
    mixed: "混合攀登难度",
    unknown: "未分类"
  }
};

export function formatSourceCount(count: number, locale: Locale) {
  if (count <= 0) return locale === "zh" ? "暂无来源" : "No sources";
  if (locale === "zh") return `${count} 个来源`;
  return `${count} ${count === 1 ? "source" : "sources"}`;
}

export function formatClimbingType(
  type: "all" | RouteClimbingType,
  locale: Locale
) {
  return climbingTypeLabels[locale][type];
}

export function formatGradeSystem(system: GradeSystem, locale: Locale) {
  return gradeSystemLabels[locale][system];
}

export function formatMissingValue(locale: Locale) {
  return locale === "zh" ? "暂无信息" : "Information unavailable";
}

export function formatCheckedDate(value: string | undefined, locale: Locale) {
  if (!value) return formatMissingValue(locale);
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;

  const [, year, month, day] = match;
  if (locale === "zh") {
    return `${Number(year)}年${Number(month)}月${Number(day)}日`;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return `${monthNames[Number(month) - 1]} ${Number(day)}, ${year}`;
}
