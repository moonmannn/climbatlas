export type ClimbingType = "sport" | "trad" | "boulder" | "multi-pitch";

export type Season = "Spring" | "Summer" | "Fall" | "Winter" | "Year-round";

export type Locale = "en" | "zh";

export type LocalizedText = Partial<Record<Locale, string>>;

export type LocalizedList = Partial<Record<Locale, string[]>>;

export type SourceType =
  | "official"
  | "open-encyclopedia"
  | "climbing-media"
  | "route-database-metadata"
  | "community-or-blog";

export type SourceTrustLevel = "high" | "medium" | "low";

export type RouteSource = {
  sourceLabel: string;
  sourceUrl: string;
  lastChecked: string;
  type: SourceType;
  trustLevel: SourceTrustLevel;
  verifies: string[];
  notes: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  license: string;
  sourceUrl: string;
  imageType: "route" | "area-context" | "destination-context";
};

export type ExternalResourceType =
  | "official"
  | "history/article"
  | "route-database"
  | "guidebook/resource"
  | "video/beta";

export type ExternalLinkStatus =
  | "route-specific"
  | "guidebook-specific"
  | "area-only"
  | "needs-upgrade";

export type ExternalResource = {
  title: string;
  url: string;
  type: ExternalResourceType;
  linkStatus?: ExternalLinkStatus;
  description: LocalizedText;
};

export type RouteStatus = "highlight" | "metadata";

export type MetadataKind = "route" | "area-index";

export type NotableAscent = {
  climber: string;
  note: LocalizedText;
  sourceLabel: string;
  sourceUrl: string;
};

export type DestinationGuideContent = {
  history: LocalizedText;
  atmosphere: LocalizedText;
  classicThemes: LocalizedList;
  funFacts: LocalizedList;
  firstVisitTips: LocalizedList;
};

export type RouteLocalizedContent = {
  style?: LocalizedText;
  summary?: LocalizedText;
  practiceFocus?: LocalizedList;
  bestFor?: LocalizedText;
  decisionHint?: LocalizedText;
  editorialTips?: LocalizedList;
};

export type RouteHighlight = {
  id: string;
  name: string;
  grade: string;
  type: ClimbingType;
  length: string;
  sector?: string;
  status?: RouteStatus;
  metadataKind?: MetadataKind;
  style: string;
  summary: string;
  practiceFocus: string[];
  bestFor: string;
  personalityTags?: string[];
  decisionHint?: string;
  sources: RouteSource[];
  images: ImageAsset[];
  editorialTips: string[];
  historicalNotes?: LocalizedText;
  notableAscents?: NotableAscent[];
  externalResources?: ExternalResource[];
  communityStatus: "coming-soon";
  localizedContent?: RouteLocalizedContent;
};

export type DestinationLocalizedContent = {
  description?: LocalizedText;
};

export type Destination = {
  slug: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  climbingTypes: ClimbingType[];
  rockType: string;
  bestSeasons: Season[];
  difficultyRange: string;
  beginnerFriendly: boolean;
  description: string;
  images?: ImageAsset[];
  guideContent?: DestinationGuideContent;
  externalResources?: ExternalResource[];
  routes?: RouteHighlight[];
  localizedContent?: DestinationLocalizedContent;
};
