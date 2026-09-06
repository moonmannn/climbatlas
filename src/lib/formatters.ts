import type { Locale } from "@/types/destination";
import type {
  GradeSystem,
  RouteClimbingType,
  RouteMovementTag,
  RoutePhysicalTag,
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
  Conglomerate: "砾岩",
  Monzogranite: "二长花岗岩",
  Tuff: "凝灰岩",
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

type RouteStyleTag = RouteWallAngle | RouteTerrainTag | RouteMovementTag | RoutePhysicalTag;

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
  power: { en: "Powerful", zh: "力量型" },
  endurance: { en: "Endurance", zh: "耐力型" },
  sustained: { en: "Sustained", zh: "持续型" },
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

const imageCaptionLabelsZh: Record<string, string> = {
  "Destination context photo: Yosemite Valley from Tunnel View.": "目的地环境照片：从 Tunnel View 眺望 Yosemite Valley。",
  "Destination context photo: El Capitan, one of Yosemite's central climbing landmarks.": "目的地环境照片：El Capitan，Yosemite 最具代表性的攀岩地标之一。",
  "Route context photo: The Nose on El Capitan.": "线路环境照片：El Capitan 上的 The Nose。",
  "Route context photo: image used on the Regular Northwest Face article.": "线路环境照片：Regular Northwest Face 相关文章使用的图片。",
  "Area context photo: Half Dome from Glacier Point, not a route topo.": "岩区环境照片：从 Glacier Point 眺望 Half Dome，并非线路图。",
  "Route photo: Midnight Lightning on Columbia Boulder.": "线路照片：Columbia Boulder 上的 Midnight Lightning。",
  "Destination context photo: Motherlode sandstone wall in Red River Gorge.": "目的地环境照片：Red River Gorge 的 Motherlode 砂岩壁。",
  "Destination context photo: Stawamus Chief Provincial Park above Squamish.": "目的地环境照片：Squamish 上方的 Stawamus Chief Provincial Park。",
  "Area context photo, not exact route: Stawamus Chief Provincial Park above Squamish.": "岩区环境照片，并非具体线路照片：Squamish 上方的 Stawamus Chief Provincial Park。",
  "Destination context photo: Fontainebleau sandstone bouldering.": "目的地环境照片：Fontainebleau 的砂岩抱石。",
  "Destination context photo: Aiguille du Midi in the Mont Blanc massif.": "目的地环境照片：Mont Blanc 山区的 Aiguille du Midi。",
  "Area context photo, not exact route: Aiguille du Midi above Chamonix.": "岩区环境照片，并非具体线路照片：Chamonix 上方的 Aiguille du Midi。",
  "Destination context photo: Ceuse sectors Berlin and Biographie.": "目的地环境照片：Ceuse 的 Berlin 与 Biographie 岩区。",
  "Area context photo: sectors Berlin and Biographie at Ceuse.": "岩区环境照片：Ceuse 的 Berlin 与 Biographie 岩区。",
  "Area context photo, not exact route: sectors Berlin and Biographie at Ceuse.": "岩区环境照片，并非具体线路照片：Ceuse 的 Berlin 与 Biographie 岩区。",
  "Destination context photo: Tre Cime di Lavaredo in the Dolomites.": "目的地环境照片：Dolomites 的 Tre Cime di Lavaredo。",
  "Area context photo, not exact route: Tre Cime di Lavaredo in the Dolomites.": "岩区环境照片，并非具体线路照片：Dolomites 的 Tre Cime di Lavaredo。"
};

export function formatImageCaption(value: string, locale: Locale) {
  return locale === "zh" ? imageCaptionLabelsZh[value] ?? value : value;
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
