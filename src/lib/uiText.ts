import type { Locale, Season } from "@/types/destination";
import {
  formatClimbingType,
  formatSourceCount
} from "@/lib/formatters";

export { formatClimbingType } from "@/lib/formatters";

export const uiText = {
  en: {
    allTypes: "All types",
    allRockTypes: "All rock types",
    allSeasons: "All seasons",
    atlasMap: "Atlas Map",
    back: "Back",
    backToMap: "Back to map",
    beginnerFriendly: "beginner friendly",
    beginnerFriendlyOnly: "Beginner friendly only",
    bestFor: "Best for",
    bestSeason: "Best season",
    chooseNextClimb: "Choose the next climb",
    climbedRoutes: "Climbed routes",
    climbingProfile: "Climbing profile",
    climbingType: "Climbing type",
    collapse: "Collapse",
    community: "Community",
    communityNotes: "Community notes",
    compactPreview: "Compact preview",
    coordinates: "Coordinates",
    countries: "Countries",
    destinationGallery: "Destination gallery",
    destinations: "Destinations",
    difficulty: "Difficulty",
    dragFieldPanel: "Drag field panel",
    editorialTips: "Editorial tips",
    explorerBoard: "Explorer Board",
    fieldMap: "Field map",
    fieldNotes: "Field notes",
    futureReviewSpace: "Future review space",
    imageSource: "Image source",
    knownClimbingRealms: "Known climbing realms",
    movingFieldPanel: "Moving field panel",
    noSearchResults: "No matching destinations or verified routes yet.",
    nonBetaTips: "Non-beta tips",
    openFieldNotes: "Open field notes",
    openFilters: "Open filters and search",
    openRouteCard: "Open route card",
    originalNote: "Original ClimbAtlas note",
    personalNotes: "Personal notes",
    photos: "Photos",
    practice: "Practice",
    practiceFocus: "Practice focus",
    reset: "Reset",
    resetPosition: "Reset position",
    rock: "Rock",
    rockType: "Rock type",
    routeCards: "Route cards",
    routes: "Routes",
    savedLogs: "Saved logs",
    searchAtlas: "Search atlas",
    season: "Season",
    sendFeedback: "Send feedback",
    sourcePack: "Source pack",
    styles: "Styles",
    visible: "Visible",
    visualContext: "Visual context",
    wishlist: "Wishlist",
    whenToPickIt: "When to pick it",
    yourChoices: "Your choices",
    yourFutureRecord: "Your future record",
    searchPlaceholder: "Try Yosemite, granite, The Nose...",
    destinationsVisible: (count: number) => `${count} destinations visible`,
    destinationCount: (visible: number, total: number) =>
      `${visible} of ${total} destinations`,
    sourceCount: (count: number) => formatSourceCount(count, "en"),
    approachLevel: {
      welcoming: "Welcoming",
      experienced: "Experienced"
    },
    approachBody: {
      welcoming:
        "A good candidate for newer outdoor climbers with careful planning.",
      experienced:
        "Better suited to confident climbers with solid outdoor systems."
    },
    explorerIntro:
      "A medieval-atlas style workspace for choosing routes by mood, style, and readiness. This is not a guidebook or route beta.",
    savedLogsBody:
      "Beta testers will help decide whether saved logs become wishlist, climbed routes, private notes, public tips, or conditions updates. No accounts or fake user data are included in this version.",
    galleryBody:
      "These images are licensed context photos for the destination. They are not route topos or guidebook substitutes.",
    routeSectionBody:
      "ClimbAtlas shows verified route facts with original summaries. It does not publish topo, beta, protection, or approach details.",
    noRoutes:
      "Verified route highlights have not been added for this destination yet. ClimbAtlas will only publish route facts and media after source and license checks.",
    routePhotosNeeded:
      "Route photos needed. ClimbAtlas will only show images with verified permission and attribution.",
    singleSource:
      "Single-source route. ClimbAtlas is showing this transparently until a second independent source is added.",
    communityComingSoon:
      "Community notes are intentionally paused for Beta. No reviews, ratings, or user tips are seeded until real accounts and moderation exist.",
    futureReviewBody:
      "Beta feedback will decide whether this becomes wishlist notes, climbed logs, private notes, public tips, or condition updates."
  },
  zh: {
    allTypes: "全部类型",
    allRockTypes: "全部岩石",
    allSeasons: "全部季节",
    atlasMap: "地图模式",
    back: "返回",
    backToMap: "返回地图",
    beginnerFriendly: "新手友好",
    beginnerFriendlyOnly: "只看新手友好",
    bestFor: "适合谁",
    bestSeason: "最佳季节",
    chooseNextClimb: "选择下一条路线",
    climbedRoutes: "已爬路线",
    climbingProfile: "攀岩画像",
    climbingType: "攀岩类型",
    collapse: "收起",
    community: "社区",
    communityNotes: "社区笔记",
    compactPreview: "紧凑预览",
    coordinates: "坐标",
    countries: "国家/地区",
    destinationGallery: "目的地图集",
    destinations: "目的地",
    difficulty: "难度",
    dragFieldPanel: "拖动地图面板",
    editorialTips: "编辑 tips",
    explorerBoard: "探索板",
    fieldMap: "地图手册",
    fieldNotes: "野外笔记",
    futureReviewSpace: "未来评价区",
    imageSource: "图片来源",
    knownClimbingRealms: "已收录攀岩区域",
    movingFieldPanel: "正在移动面板",
    noSearchResults: "暂时没有匹配的目的地或已验证路线。",
    nonBetaTips: "非 beta tips",
    openFieldNotes: "打开野外笔记",
    openFilters: "打开筛选和搜索",
    openRouteCard: "打开路线卡",
    originalNote: "ClimbAtlas 原创笔记",
    personalNotes: "个人笔记",
    photos: "照片",
    practice: "练习",
    practiceFocus: "练习方向",
    reset: "重置",
    resetPosition: "重置位置",
    rock: "岩石",
    rockType: "岩石类型",
    routeCards: "路线卡",
    routes: "路线",
    savedLogs: "记录",
    searchAtlas: "搜索地图",
    season: "季节",
    sendFeedback: "反馈",
    sourcePack: "来源包",
    styles: "风格",
    visible: "可见",
    visualContext: "视觉参考",
    wishlist: "想爬清单",
    whenToPickIt: "什么时候适合选它",
    yourChoices: "你的选择",
    yourFutureRecord: "未来个人记录",
    searchPlaceholder: "试试 Yosemite、花岗岩、The Nose...",
    destinationsVisible: (count: number) => `${count} 个目的地可见`,
    destinationCount: (visible: number, total: number) =>
      `${visible} / ${total} 个目的地`,
    sourceCount: (count: number) => formatSourceCount(count, "zh"),
    approachLevel: {
      welcoming: "比较友好",
      experienced: "更适合有经验者"
    },
    approachBody: {
      welcoming: "适合有计划的新户外攀岩者，但仍然需要认真判断。",
      experienced: "更适合系统扎实、户外经验更稳定的攀岩者。"
    },
    explorerIntro:
      "一个中世纪探险地图风格的路线选择工作台，按心情、风格和状态选路线。它不是路书，也不提供路线 beta。",
    savedLogsBody:
      "Beta 反馈会帮助决定之后先做想爬清单、已爬记录、私人笔记、公开 tips，还是条件更新。当前版本没有账号，也不会展示假用户数据。",
    galleryBody:
      "这些图片是目的地的授权/开放许可视觉参考，不是 topo，也不是路书替代品。",
    routeSectionBody:
      "ClimbAtlas 展示可核验的路线事实和原创摘要，不发布 topo、beta、保护、approach 等路书细节。",
    noRoutes:
      "这个目的地还没有添加已验证路线。ClimbAtlas 只会在来源和图片许可检查后发布路线事实和媒体。",
    routePhotosNeeded:
      "这条路线还需要照片。ClimbAtlas 只展示有明确授权和署名信息的图片。",
    singleSource:
      "单一来源路线。ClimbAtlas 会透明标注，直到补充第二个独立来源。",
    communityComingSoon:
      "社区笔记在 Beta 阶段暂不开放。真实账号和审核机制上线前，不会预填评论、评分或用户 tips。",
    futureReviewBody:
      "这个区域会根据 Beta 反馈决定优先做想爬清单、已爬记录、私人笔记、公开 tips，还是条件更新。"
  }
} as const;

export function getUiText(locale: Locale) {
  return uiText[locale];
}

export function formatSeason(season: "all" | Season, locale: Locale) {
  const labels: Record<Locale, Record<"all" | Season, string>> = {
    en: {
      all: "All seasons",
      Spring: "Spring",
      Summer: "Summer",
      Fall: "Fall",
      Winter: "Winter",
      "Year-round": "Year-round"
    },
    zh: {
      all: "全部季节",
      Spring: "春季",
      Summer: "夏季",
      Fall: "秋季",
      Winter: "冬季",
      "Year-round": "全年"
    }
  };

  return labels[locale][season];
}

export function formatBeginnerStatus(beginnerFriendly: boolean, locale: Locale) {
  if (locale === "zh") {
    return beginnerFriendly ? "新手友好" : "更适合进阶者";
  }

  return beginnerFriendly ? "beginner friendly" : "advanced";
}
