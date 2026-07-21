import type { Locale } from "@/types/destination";
import type {
  GradeSystem,
  RouteClimbingType,
  RouteMovementTag,
  RouteTerrainTag,
  RouteWallAngle
} from "@/types/route";

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

const destinationFactLabelsZh: Record<string, string> = {
  Spring: "春季",
  Summer: "夏季",
  Fall: "秋季",
  Winter: "冬季",
  "Year-round": "全年",
  Granite: "花岗岩",
  Limestone: "石灰岩",
  Sandstone: "砂岩",
  "Dolomite limestone": "白云岩",
  "Jura limestone": "侏罗纪石灰岩",
  "Karst limestone": "喀斯特石灰岩",
  "Coastal sandstone": "海岸砂岩",
  Quartzite: "石英岩",
  "Volcanic tuff": "火山凝灰岩",
  Gneiss: "片麻岩",
  USA: "美国",
  Canada: "加拿大",
  Mexico: "墨西哥",
  France: "法国",
  Greece: "希腊",
  Italy: "意大利",
  Germany: "德国",
  Spain: "西班牙",
  China: "中国",
  Taiwan: "中国台湾",
  Thailand: "泰国",
  Australia: "澳大利亚",
  "South Africa": "南非"
};

type RouteStyleTag = RouteWallAngle | RouteTerrainTag | RouteMovementTag;

const routeStyleTagLabels: Record<RouteStyleTag, Record<Locale, string>> = {
  slab: { en: "Slab", zh: "板壁" },
  vertical: { en: "Vertical", zh: "垂直岩壁" },
  overhang: { en: "Overhang", zh: "仰角岩壁" },
  roof: { en: "Roof", zh: "屋檐" },
  crack: { en: "Crack", zh: "裂缝" },
  face: { en: "Face", zh: "岩面" },
  corner: { en: "Corner", zh: "内角" },
  chimney: { en: "Chimney", zh: "烟囱" },
  arete: { en: "Arête", zh: "岩棱" },
  flake: { en: "Flake", zh: "片状岩" },
  pockets: { en: "Pockets", zh: "孔洞" },
  tufa: { en: "Tufa", zh: "石灰华" },
  technical: { en: "Technical", zh: "技术型" },
  powerful: { en: "Powerful", zh: "力量型" },
  endurance: { en: "Endurance", zh: "耐力型" },
  compression: { en: "Compression", zh: "夹抱" },
  stemming: { en: "Stemming", zh: "对撑" },
  "precise-footwork": { en: "Precise footwork", zh: "精准脚法" },
  "route-reading": { en: "Route reading", zh: "线路阅读" },
  balance: { en: "Balance", zh: "平衡" }
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

export function formatDestinationFact(value: string, locale: Locale) {
  return locale === "zh" ? destinationFactLabelsZh[value] ?? value : value;
}

export function formatRouteStyleTag(tag: string, locale: Locale) {
  const labels = routeStyleTagLabels[tag as RouteStyleTag];
  if (labels) return labels[locale];
  return tag
    .split("-")
    .map((part, index) =>
      index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part
    )
    .join(" ");
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
