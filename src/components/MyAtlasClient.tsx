"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthButton } from "@/components/AuthButton";
import { ClimbingLogForm, getCompletionStyleLabel } from "@/components/ClimbingLogForm";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserAtlas } from "@/components/UserAtlasProvider";
import { useUserClimbingLogs } from "@/components/UserClimbingLogsProvider";
import { useUserProfile } from "@/components/UserProfileProvider";
import { useUserRoutes } from "@/components/UserRoutesProvider";
import { dnaArchetypes } from "@/data/dnaArchetypes";
import {
  getDnaDimensionLabel,
  getLocalizedDnaText
} from "@/lib/climbingDna";
import {
  formatClimbingType,
  formatDestinationFact
} from "@/lib/formatters";
import { routeRecordKey } from "@/lib/routeAliases";
import {
  getPublicRouteSummaries,
  type PublicRouteSummary
} from "@/lib/routes/public-routes";
import type {
  ExperienceLevel,
  ClimbingLogRecord,
  RouteNoteRecord,
  SavedRouteRecord,
  SavedRouteStatus,
  UserProfileRecord
} from "@/lib/supabaseClient";
import type { ClimbingType, Locale } from "@/types/destination";
import { dnaDimensions } from "@/types/climbingDna";

export type MyAtlasDestinationSummary = {
  country: string;
  image?: {
    alt: string;
    src: string;
  };
  name: string;
  rockType: string;
  routeCount: number;
  slug: string;
};

type MyAtlasClientProps = {
  destinationSummaries: MyAtlasDestinationSummary[];
};

type AtlasItem = {
  destination: {
    country: string;
    name: string;
    slug: string;
  };
  note?: RouteNoteRecord;
  route: PublicRouteSummary;
  saved?: SavedRouteRecord;
};

type JournalItem = {
  destination: AtlasItem["destination"];
  log: ClimbingLogRecord;
  route: PublicRouteSummary;
};

type AtlasTab = "overview" | "routes" | "journal" | "places" | "dna" | "account";

const styleOptions: ClimbingType[] = [
  "sport",
  "trad",
  "boulder",
  "multi-pitch"
];

const experienceLabels: Record<ExperienceLevel, { en: string; zh: string }> = {
  newer: { en: "Newer outdoors", zh: "户外新手" },
  intermediate: { en: "Intermediate", zh: "进阶中" },
  experienced: { en: "Experienced", zh: "有经验" },
  "project-focused": { en: "Project focused", zh: "项目型" }
};

const tabLabels: Record<AtlasTab, { en: string; zh: string }> = {
  overview: { en: "Overview", zh: "概览" },
  routes: { en: "Routes", zh: "路线" },
  journal: { en: "Journal", zh: "攀岩日志" },
  places: { en: "Saved places", zh: "收藏目的地" },
  dna: { en: "DNA & preferences", zh: "DNA 与偏好" },
  account: { en: "Account & privacy", zh: "账户与隐私" }
};

export function MyAtlasClient({ destinationSummaries }: MyAtlasClientProps) {
  const { locale } = useLanguage();
  const {
    isConfigured,
    signOut,
    user
  } = useSupabaseAuth();
  const {
    error: profileError,
    isLoading: isProfileLoading,
    profile,
    reloadProfile,
    saveProfile
  } = useUserProfile();
  const {
    error: routesError,
    isLoading: areRoutesLoading,
    notes,
    reload: reloadRoutes,
    savedRoutes
  } = useUserRoutes();
  const {
    clearPrivateAtlas,
    dnaAnswers,
    dnaProfile,
    error: atlasError,
    isLoading: isAtlasLoading,
    lastDnaSyncAt,
    saveDestination,
    savedDestinations
  } = useUserAtlas();
  const {
    deleteLog,
    error: logsError,
    isLoading: areLogsLoading,
    logs,
    reloadLogs
  } = useUserClimbingLogs();
  const [activeTab, setActiveTab] = useState<AtlasTab>("overview");
  const isZh = locale === "zh";

  const atlasItems = useMemo<AtlasItem[]>(() => {
    const routeLookup = new Map(
      getPublicRouteSummaries().map((route) => [
        routeRecordKey(route.destinationSlug, route.id),
        route
      ])
    );
    const savedLookup = new Map(
      savedRoutes.map((record) => [
        routeRecordKey(record.destination_slug, record.route_id),
        record
      ])
    );
    const noteLookup = new Map(
      notes.map((record) => [
        routeRecordKey(record.destination_slug, record.route_id),
        record
      ])
    );
    const keys = new Set([
      ...Array.from(savedLookup.keys()),
      ...Array.from(noteLookup.keys())
    ]);

    return Array.from(keys).flatMap((key) => {
      const route = routeLookup.get(key);
      if (!route) return [];

      return [{
        destination: {
          country: route.country,
          name: route.destinationName,
          slug: route.destinationSlug
        },
        note: noteLookup.get(key),
        route,
        saved: savedLookup.get(key)
      }];
    });
  }, [notes, savedRoutes]);

  const wantItems = atlasItems.filter(
    (item) => item.saved?.status === "want-to-climb"
  );
  const climbedItems = atlasItems.filter(
    (item) => item.saved?.status === "climbed"
  );
  const noteItems = atlasItems.filter((item) => Boolean(item.note?.note));
  const recentItems = [...atlasItems]
    .sort((first, second) => getItemDate(second).localeCompare(getItemDate(first)))
    .slice(0, 6);
  const journalItems = useMemo<JournalItem[]>(() => {
    const routeLookup = new Map(
      getPublicRouteSummaries().map((route) => [
        routeRecordKey(route.destinationSlug, route.id),
        route
      ])
    );

    return logs.flatMap((log) => {
      const route = routeLookup.get(routeRecordKey(log.destination_slug, log.route_id));
      if (!route) return [];
      return [{
        destination: {
          country: route.country,
          name: route.destinationName,
          slug: route.destinationSlug
        },
        log,
        route
      }];
    });
  }, [logs]);
  const completedLogKeys = useMemo(
    () => new Set(
      logs
        .filter((log) => log.result === "completed")
        .map((log) => routeRecordKey(log.destination_slug, log.route_id))
    ),
    [logs]
  );
  const legacyClimbedItems = climbedItems.filter(
    (item) => !completedLogKeys.has(routeRecordKey(item.destination.slug, item.route.id))
  );
  const destinationLookup = useMemo(
    () => new Map(destinationSummaries.map((destination) => [destination.slug, destination])),
    [destinationSummaries]
  );
  const savedPlaceSummaries = savedDestinations.flatMap((record) => {
    const destination = destinationLookup.get(record.destination_slug);
    return destination ? [{ destination, record }] : [];
  });
  const routeDestinationCount = new Set(
    atlasItems.map((item) => item.destination.slug)
  ).size;
  const totalDestinationCount = new Set([
    ...atlasItems.map((item) => item.destination.slug),
    ...savedDestinations.map((item) => item.destination_slug)
  ]).size;
  const displayName =
    profile?.display_name || user?.email?.split("@")[0] || "ClimbAtlas climber";
  const isLoading = isProfileLoading || areRoutesLoading || isAtlasLoading || areLogsLoading;
  const error = profileError ?? routesError ?? atlasError ?? logsError;

  return (
    <main className="phase6-content min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <div className="mx-auto max-w-[1240px] px-5 py-[72px] sm:px-8 lg:px-12 lg:py-20">
        <header className="border-y border-brandforest/15 bg-brandforest px-6 py-8 text-cream sm:px-8">
          <p className="editorial-kicker text-sunlit">
            {isZh ? "私人 My Atlas" : "Private My Atlas"}
          </p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="grid h-20 w-20 place-items-center rounded-full border border-cream/25 bg-cream/10 text-3xl font-semibold text-sunlit">
              {getInitials(displayName)}
            </div>
            <div>
              <h1 className="display-serif text-4xl font-medium leading-tight sm:text-6xl">
                {displayName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-cream/75">
                {profile?.bio || (isZh
                  ? "保存路线、目的地和攀岩偏好。这里的内容仅你本人可见。"
                  : "Keep routes, destinations, and climbing preferences in one private place.")}
              </p>
              {user ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <ProfilePill
                    label={profile?.experience_level
                      ? experienceLabels[profile.experience_level][locale]
                      : isZh ? "经验未设置" : "Experience unset"}
                  />
                  <ProfilePill
                    label={profile?.home_base || (isZh ? "所在地未设置" : "Home base unset")}
                  />
                  {(profile?.preferred_styles ?? []).map((style) => (
                    <ProfilePill key={style} label={formatClimbingType(style, locale)} />
                  ))}
                </div>
              ) : null}
            </div>
            <div className="border-l border-cream/20 pl-5 text-sm leading-6 text-cream/70">
              <p className="font-semibold text-cream">{user?.email ?? (isZh ? "尚未登录" : "Not signed in")}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-sunlit">
                {isZh ? "仅本人可见" : "Private only"}
              </p>
            </div>
          </div>
        </header>

        <section className="border-b border-brandforest/15 py-8">
          {!isConfigured ? (
            <EmptyState
              action={
                <code className="rounded-md border border-brandforest/15 bg-white/50 px-3 py-2 text-xs text-charcoal/65">
                  NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>
              }
              body={isZh
                ? "Supabase 尚未配置。网站仍可浏览，但私人同步暂不可用。"
                : "Supabase is not configured. Browsing still works, but private sync is unavailable."}
              title={isZh ? "私人空间尚未启用" : "Private Atlas is not enabled"}
            />
          ) : !user ? (
            <EmptyState
              action={<AuthButton />}
              body={isZh
                ? "使用邮箱登录后，可跨设备同步想爬、已爬、私人笔记、收藏目的地和 Climbing DNA。"
                : "Sign in by email to sync routes, private notes, saved places, and Climbing DNA across devices."}
              title={isZh ? "登录你的私人 My Atlas" : "Sign in to your private My Atlas"}
            />
          ) : (
            <>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Stat label={isZh ? "想爬" : "Want"} value={wantItems.length} />
                <Stat label={isZh ? "已爬" : "Climbed"} value={climbedItems.length} />
                <Stat label={isZh ? "私人笔记" : "Notes"} value={noteItems.length} />
                <Stat label={isZh ? "收藏目的地" : "Saved places"} value={savedDestinations.length} />
                <Stat label={isZh ? "涉及目的地" : "Places covered"} value={totalDestinationCount} />
              </dl>

              {error ? (
                <p className="mt-5 rounded-md border border-red-900/20 bg-red-900/10 p-3 text-sm font-semibold text-red-950">
                  {error}
                </p>
              ) : null}

              <div className="mt-8 overflow-x-auto border-y border-brandforest/15">
                <div
                  aria-label={isZh ? "My Atlas 页面" : "My Atlas views"}
                  className="flex min-w-max gap-1 py-2"
                  role="tablist"
                >
                  {(Object.keys(tabLabels) as AtlasTab[]).map((tab) => (
                    <button
                      aria-controls={`atlas-panel-${tab}`}
                      aria-selected={activeTab === tab}
                      className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition ${
                        activeTab === tab
                          ? "bg-brandforest text-cream"
                          : "text-brandforest hover:bg-brandforest/8"
                      }`}
                      id={`atlas-tab-${tab}`}
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      role="tab"
                      type="button"
                    >
                      {tabLabels[tab][locale]}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <p className="py-10 text-sm font-semibold text-charcoal/60" aria-live="polite">
                  {isZh ? "正在同步你的 My Atlas..." : "Syncing your My Atlas..."}
                </p>
              ) : (
                <div className="pt-8">
                  <AtlasPanel activeTab={activeTab} tab="overview">
                    <OverviewPanel
                      dnaProfile={dnaProfile}
                      locale={locale}
                      recentItems={recentItems}
                      recentJournalItems={journalItems.slice(0, 4)}
                      routeDestinationCount={routeDestinationCount}
                      savedPlaces={savedPlaceSummaries.slice(0, 3).map(({ destination }) => destination)}
                      setActiveTab={setActiveTab}
                    />
                  </AtlasPanel>

                  <AtlasPanel activeTab={activeTab} tab="routes">
                    <div className="grid gap-10">
                      <RouteSection
                        emptyText={isZh ? "还没有想爬路线。打开任意路线即可加入计划。" : "No want-to-climb routes yet. Open a route to start a plan."}
                        items={wantItems}
                        locale={locale}
                        title={isZh ? "想爬路线" : "Want to climb"}
                      />
                      <RouteSection
                        emptyText={isZh ? "还没有已爬记录。完成后可在线路页标记。" : "No climbed routes yet. Mark one after a climbing day."}
                        items={climbedItems}
                        locale={locale}
                        title={isZh ? "已爬路线" : "Climbed"}
                      />
                      <RouteSection
                        emptyText={isZh ? "还没有私人笔记。你可以在线路页记录只给自己看的内容。" : "No private notes yet. Route pages can hold notes only you can see."}
                        items={noteItems}
                        locale={locale}
                        showNotes
                        title={isZh ? "私人笔记" : "Private notes"}
                      />
                    </div>
                  </AtlasPanel>

                  <AtlasPanel activeTab={activeTab} tab="journal">
                    <JournalPanel
                      deleteLog={deleteLog}
                      items={journalItems}
                      legacyClimbedItems={legacyClimbedItems}
                      locale={locale}
                    />
                  </AtlasPanel>

                  <AtlasPanel activeTab={activeTab} tab="places">
                    <SavedPlacesPanel
                      locale={locale}
                      onRemove={(slug) => saveDestination(slug, false)}
                      places={savedPlaceSummaries.map(({ destination }) => destination)}
                    />
                  </AtlasPanel>

                  <AtlasPanel activeTab={activeTab} tab="dna">
                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                      <DnaPanel
                        dnaProfile={dnaProfile}
                        lastSyncAt={lastDnaSyncAt}
                        locale={locale}
                      />
                      <ProfileEditor
                        locale={locale}
                        profile={profile}
                        saveProfile={saveProfile}
                      />
                    </div>
                  </AtlasPanel>

                  <AtlasPanel activeTab={activeTab} tab="account">
                    <AccountPanel
                      clearPrivateAtlas={clearPrivateAtlas}
                      dnaAnswers={dnaAnswers}
                      locale={locale}
                      notes={notes}
                      logs={logs}
                      profile={profile}
                      reloadProfile={reloadProfile}
                      reloadLogs={reloadLogs}
                      reloadRoutes={reloadRoutes}
                      savedDestinations={savedDestinations.map((item) => item.destination_slug)}
                      savedRoutes={savedRoutes}
                      signOut={signOut}
                      userEmail={user.email ?? null}
                    />
                  </AtlasPanel>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function AtlasPanel({
  activeTab,
  children,
  tab
}: {
  activeTab: AtlasTab;
  children: ReactNode;
  tab: AtlasTab;
}) {
  if (activeTab !== tab) return null;

  return (
    <section
      aria-labelledby={`atlas-tab-${tab}`}
      id={`atlas-panel-${tab}`}
      role="tabpanel"
      tabIndex={0}
    >
      {children}
    </section>
  );
}

function OverviewPanel({
  dnaProfile,
  locale,
  recentItems,
  recentJournalItems,
  routeDestinationCount,
  savedPlaces,
  setActiveTab
}: {
  dnaProfile: ReturnType<typeof useUserAtlas>["dnaProfile"];
  locale: Locale;
  recentItems: AtlasItem[];
  recentJournalItems: JournalItem[];
  routeDestinationCount: number;
  savedPlaces: MyAtlasDestinationSummary[];
  setActiveTab: (tab: AtlasTab) => void;
}) {
  const isZh = locale === "zh";
  const archetype = dnaProfile
    ? dnaArchetypes.find((item) => item.id === dnaProfile.archetypeId)
    : undefined;

  return (
    <div className="grid gap-10">
      <section className="grid gap-6 border-b border-brandforest/15 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="editorial-kicker text-terracotta">{isZh ? "最近保存" : "Recent saves"}</p>
          <h2 className="display-serif mt-3 text-3xl text-brandforest">{isZh ? "继续你的路线计划" : "Continue your route planning"}</h2>
          {recentItems.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {recentItems.map((item) => (
                <RouteCard item={item} key={`${item.destination.slug}-${item.route.id}`} locale={locale} showNote={false} />
              ))}
            </div>
          ) : (
            <EmptyInline text={isZh ? "保存第一条路线后，它会出现在这里。" : "Your first saved route will appear here."} />
          )}
          <button className="text-link mt-5" onClick={() => setActiveTab("routes")} type="button">
            {isZh ? "查看全部路线" : "View all routes"} →
          </button>
        </div>

        <div className="border-l-0 border-brandforest/15 lg:border-l lg:pl-8">
          <p className="editorial-kicker text-terracotta">Climbing DNA</p>
          {archetype && dnaProfile ? (
            <>
              <h2 className="display-serif mt-3 text-3xl text-brandforest">
                {getLocalizedDnaText(archetype.name, locale)}
              </h2>
              <p className="mt-3 text-sm leading-6 text-charcoal/68">
                {getLocalizedDnaText(archetype.tagline, locale)}
              </p>
              <div className="mt-5 grid gap-3">
                {dnaDimensions.slice(0, 3).map((dimension) => (
                  <DnaBar key={dimension} label={getDnaDimensionLabel(dimension, locale)} value={dnaProfile.scores[dimension]} />
                ))}
              </div>
            </>
          ) : (
            <EmptyInline text={isZh ? "完成 Climbing DNA 后，可在这里查看攀岩偏好。" : "Complete Climbing DNA to see your climbing preferences here."} />
          )}
          <button className="text-link mt-5" onClick={() => setActiveTab("dna")} type="button">
            {isZh ? "查看 DNA 与偏好" : "View DNA and preferences"} →
          </button>
        </div>
      </section>

      <section className="border-b border-brandforest/15 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="editorial-kicker text-terracotta">{isZh ? "最近攀登" : "Recent climbing"}</p>
            <h2 className="display-serif mt-3 text-3xl text-brandforest">{isZh ? "你的私人攀岩历史" : "Your private climbing history"}</h2>
          </div>
          <button className="text-link" onClick={() => setActiveTab("journal")} type="button">
            {isZh ? "打开攀岩日志" : "Open journal"} →
          </button>
        </div>
        {recentJournalItems.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {recentJournalItems.map((item) => (
              <JournalSummaryCard item={item} key={item.log.id} locale={locale} />
            ))}
          </div>
        ) : (
          <EmptyInline text={isZh ? "在线路页记录一次完攀或尝试后，它会出现在这里。" : "Log a completed route or attempt from a route page and it will appear here."} />
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="editorial-kicker text-terracotta">{isZh ? "收藏目的地" : "Saved places"}</p>
            <h2 className="display-serif mt-3 text-3xl text-brandforest">
              {isZh ? `路线记录涉及 ${routeDestinationCount} 个目的地` : `Routes across ${routeDestinationCount} destinations`}
            </h2>
          </div>
          <button className="text-link" onClick={() => setActiveTab("places")} type="button">
            {isZh ? "查看收藏" : "View saved places"} →
          </button>
        </div>
        {savedPlaces.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {savedPlaces.map((destination) => <DestinationCard destination={destination} key={destination.slug} locale={locale} />)}
          </div>
        ) : (
          <EmptyInline text={isZh ? "在目的地页点击“收藏目的地”，就能在这里快速返回。" : "Use Save destination on a destination page to keep it close."} />
        )}
      </section>
    </div>
  );
}

function JournalPanel({
  deleteLog,
  items,
  legacyClimbedItems,
  locale
}: {
  deleteLog: (id: string) => Promise<boolean>;
  items: JournalItem[];
  legacyClimbedItems: AtlasItem[];
  locale: Locale;
}) {
  const isZh = locale === "zh";
  const [filter, setFilter] = useState<"all" | "completed" | "attempted">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const filteredItems = filter === "all"
    ? items
    : items.filter((item) => item.log.result === filter);
  const climbingDays = new Set(items.map((item) => item.log.session_date)).size;
  const completedCount = items.filter((item) => item.log.result === "completed").length;
  const attemptedCount = items.filter((item) => item.log.result === "attempted").length;
  const destinationCount = new Set(items.map((item) => item.destination.slug)).size;

  return (
    <section>
      <p className="editorial-kicker text-terracotta">{isZh ? "私人攀岩日志" : "Private climbing journal"}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h2 className="display-serif text-4xl text-brandforest">{isZh ? "记住每一次攀登" : "Keep the days that mattered"}</h2>
        <p className="max-w-lg text-sm leading-6 text-charcoal/60">
          {isZh ? "日志只属于你。完攀会自动更新路线状态，尝试记录不会把路线标成已爬。" : "Logs stay private. Completed entries update route status; attempts do not mark a route as climbed."}
        </p>
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={isZh ? "攀岩天数" : "Climbing days"} value={climbingDays} />
        <Stat label={isZh ? "完攀记录" : "Completed"} value={completedCount} />
        <Stat label={isZh ? "尝试记录" : "Attempts"} value={attemptedCount} />
        <Stat label={isZh ? "涉及目的地" : "Destinations"} value={destinationCount} />
      </dl>

      <fieldset className="mt-8 border-y border-brandforest/15 py-4">
        <legend className="sr-only">{isZh ? "筛选攀岩日志" : "Filter climbing journal"}</legend>
        <div className="flex flex-wrap gap-2">
          {(["all", "completed", "attempted"] as const).map((option) => (
            <button
              aria-pressed={filter === option}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${filter === option ? "bg-brandforest text-cream" : "border border-brandforest/15 text-brandforest"}`}
              key={option}
              onClick={() => setFilter(option)}
              type="button"
            >
              {option === "all" ? (isZh ? "全部" : "All") : option === "completed" ? (isZh ? "完攀" : "Completed") : (isZh ? "尝试" : "Attempted")}
            </button>
          ))}
        </div>
      </fieldset>

      {filteredItems.length ? (
        <div className="mt-6 grid gap-4">
          {filteredItems.map((item) => (
            <article className="border-t border-brandforest/20 pt-5" key={item.log.id}>
              {editingId === item.log.id ? (
                <div className="max-w-2xl">
                  <ClimbingLogForm
                    destinationSlug={item.destination.slug}
                    existingLog={item.log}
                    onCancel={() => setEditingId(null)}
                    onSaved={() => setEditingId(null)}
                    routeId={item.route.id}
                  />
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-[9rem_minmax(0,1fr)_auto] lg:items-start">
                  <div>
                    <p className="text-sm font-semibold text-brandforest">{formatSessionDate(item.log.session_date, locale)}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.1em] text-terracotta">
                      {item.log.result === "completed" ? (isZh ? "完成" : "Completed") : (isZh ? "尝试" : "Attempted")}
                    </p>
                  </div>
                  <div>
                    <Link className="text-xl font-semibold text-brandforest hover:text-terracotta" href={`/destinations/${item.destination.slug}/routes/${item.route.id}`}>
                      {item.route.name}
                    </Link>
                    <p className="mt-1 text-sm text-charcoal/58">{item.destination.name} · {item.route.grade}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-charcoal/55">
                      {item.log.completion_style && item.log.completion_style !== "unspecified" ? <span>{getCompletionStyleLabel(item.log.completion_style, locale)}</span> : null}
                      {item.log.attempt_count ? <span>{isZh ? `${item.log.attempt_count} 次尝试` : `${item.log.attempt_count} attempts`}</span> : null}
                    </div>
                    {item.log.note ? <p className="mt-3 max-w-2xl border-l-2 border-terracotta pl-3 text-sm leading-6 text-charcoal/68">{item.log.note}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button className="text-link" onClick={() => setEditingId(item.log.id)} type="button">{isZh ? "编辑" : "Edit"}</button>
                    {deleteId === item.log.id ? (
                      <>
                        <button className="text-sm font-semibold text-red-950 underline underline-offset-4" onClick={async () => { const didDelete = await deleteLog(item.log.id); if (didDelete) setDeleteId(null); }} type="button">{isZh ? "确认删除" : "Confirm delete"}</button>
                        <button className="text-sm font-semibold text-charcoal/55" onClick={() => setDeleteId(null)} type="button">{isZh ? "取消" : "Cancel"}</button>
                      </>
                    ) : (
                      <button className="text-sm font-semibold text-charcoal/50 hover:text-red-950" onClick={() => setDeleteId(item.log.id)} type="button">{isZh ? "删除" : "Delete"}</button>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyInline text={isZh ? "这个筛选下还没有日志。" : "There are no journal entries in this filter yet."} />
      )}

      {legacyClimbedItems.length ? (
        <section className="mt-12 border-t border-brandforest/20 pt-7">
          <p className="editorial-kicker text-terracotta">{isZh ? "待补充日期" : "Dates not recorded"}</p>
          <h3 className="display-serif mt-3 text-3xl text-brandforest">{isZh ? "保留的旧已爬记录" : "Earlier climbed statuses"}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/60">
            {isZh ? "这些路线仍然标记为已爬，但我们没有猜测实际日期。打开路线即可补一条真实日志。" : "These routes remain marked as climbed, but no date was invented. Open a route to add a real log."}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {legacyClimbedItems.map((item) => (
              <div key={`${item.destination.slug}-${item.route.id}`}>
                <RouteCard item={item} locale={locale} showNote={false} />
                <p className="mt-2 text-xs font-semibold text-charcoal/50">{isZh ? "已爬 · 日期未记录" : "Climbed · date not recorded"}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function JournalSummaryCard({ item, locale }: { item: JournalItem; locale: Locale }) {
  return (
    <Link className="destination-card" href={`/destinations/${item.destination.slug}/routes/${item.route.id}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-terracotta">{formatSessionDate(item.log.session_date, locale)}</p>
      <h3 className="mt-3 text-lg font-semibold text-brandforest">{item.route.name}</h3>
      <p className="mt-1 text-sm text-charcoal/58">{item.destination.name}</p>
      <p className="mt-3 text-xs font-semibold text-charcoal/50">{item.log.result === "completed" ? (locale === "zh" ? "完成" : "Completed") : (locale === "zh" ? "尝试" : "Attempted")}</p>
    </Link>
  );
}

function SavedPlacesPanel({
  locale,
  onRemove,
  places
}: {
  locale: Locale;
  onRemove: (slug: string) => Promise<boolean>;
  places: MyAtlasDestinationSummary[];
}) {
  const isZh = locale === "zh";

  return (
    <section>
      <p className="editorial-kicker text-terracotta">{isZh ? "收藏目的地" : "Saved places"}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h2 className="display-serif text-4xl text-brandforest">{isZh ? "想去的岩场" : "Places on your radar"}</h2>
        <Link className="text-link" href="/explore">{isZh ? "继续探索地图" : "Explore the map"} →</Link>
      </div>
      {places.length ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {places.map((destination) => (
            <div key={destination.slug}>
              <DestinationCard destination={destination} locale={locale} />
              <button
                className="mt-2 text-xs font-semibold text-charcoal/55 underline decoration-charcoal/25 underline-offset-4 hover:text-terracotta"
                onClick={() => void onRemove(destination.slug)}
                type="button"
              >
                {isZh ? "取消收藏" : "Remove from saved places"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          action={<Link className="primary-action" href="/explore">{isZh ? "打开地图" : "Open the map"} →</Link>}
          body={isZh ? "在目的地页收藏后，它会同步到你的私人 My Atlas。" : "Save a destination from its page and it will sync to your private My Atlas."}
          title={isZh ? "还没有收藏目的地" : "No saved places yet"}
        />
      )}
    </section>
  );
}

function DnaPanel({
  dnaProfile,
  lastSyncAt,
  locale
}: {
  dnaProfile: ReturnType<typeof useUserAtlas>["dnaProfile"];
  lastSyncAt: string | null;
  locale: Locale;
}) {
  const isZh = locale === "zh";
  const archetype = dnaProfile
    ? dnaArchetypes.find((item) => item.id === dnaProfile.archetypeId)
    : undefined;

  return (
    <section>
      <p className="editorial-kicker text-terracotta">Climbing DNA</p>
      <h2 className="display-serif mt-3 text-4xl text-brandforest">
        {archetype ? getLocalizedDnaText(archetype.name, locale) : isZh ? "发现你的攀岩偏好" : "Discover your climbing preferences"}
      </h2>
      {archetype && dnaProfile ? (
        <>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/68">
            {getLocalizedDnaText(archetype.longDescription, locale)}
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {dnaDimensions.map((dimension) => (
              <DnaBar key={dimension} label={getDnaDimensionLabel(dimension, locale)} value={dnaProfile.scores[dimension]} />
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-charcoal/50">
            {lastSyncAt
              ? isZh ? `最近同步：${formatDate(lastSyncAt, locale)}` : `Last synced: ${formatDate(lastSyncAt, locale)}`
              : isZh ? "DNA 会在登录后跨设备同步。" : "Your DNA syncs across devices while signed in."}
          </p>
          <Link className="primary-action mt-6" href="/climbing-dna">{isZh ? "重新测试" : "Retake the quiz"} →</Link>
        </>
      ) : (
        <>
          <p className="mt-4 max-w-xl text-sm leading-7 text-charcoal/68">
            {isZh
              ? "完成简短测试，查看你对探索、表现、冒险、社交、舒适和流动感的偏好。结果表达偏好，不判断能力或安全。"
              : "Take the short quiz to explore your preferences across exploration, performance, adventure, social energy, comfort, and flow. It does not judge ability or safety."}
          </p>
          <Link className="primary-action mt-6" href="/climbing-dna">{isZh ? "开始 Climbing DNA" : "Discover my Climbing DNA"} →</Link>
        </>
      )}
    </section>
  );
}

function AccountPanel({
  clearPrivateAtlas,
  dnaAnswers,
  logs,
  locale,
  notes,
  profile,
  reloadLogs,
  reloadProfile,
  reloadRoutes,
  savedDestinations,
  savedRoutes,
  signOut,
  userEmail
}: {
  clearPrivateAtlas: () => Promise<boolean>;
  dnaAnswers: Record<string, string> | null;
  logs: ClimbingLogRecord[];
  locale: Locale;
  notes: RouteNoteRecord[];
  profile: UserProfileRecord | null;
  reloadLogs: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  reloadRoutes: () => Promise<void>;
  savedDestinations: string[];
  savedRoutes: SavedRouteRecord[];
  signOut: () => Promise<void>;
  userEmail: string | null;
}) {
  const isZh = locale === "zh";
  const [confirmClear, setConfirmClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function downloadPrivateData() {
    const payload = {
      accountEmail: userEmail,
      climbingDna: dnaAnswers,
      climbingLogs: logs,
      exportedAt: new Date().toISOString(),
      notes,
      profile,
      savedDestinations,
      savedRoutes
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.download = `climbatlas-private-data-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.href = url;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(isZh ? "私人数据文件已生成。" : "Your private data file is ready.");
  }

  return (
    <section>
      <p className="editorial-kicker text-terracotta">{isZh ? "账户与隐私" : "Account & privacy"}</p>
      <h2 className="display-serif mt-3 text-4xl text-brandforest">{isZh ? "你控制自己的记录" : "You control your records"}</h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="border-t border-brandforest/20 pt-5">
          <h3 className="text-lg font-semibold text-brandforest">{isZh ? "账户" : "Account"}</h3>
          <dl className="mt-4 grid gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">Email</dt>
              <dd className="mt-1 font-semibold text-charcoal">{userEmail ?? (isZh ? "未提供" : "Unavailable")}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">{isZh ? "可见范围" : "Visibility"}</dt>
              <dd className="mt-1 leading-6 text-charcoal/68">{isZh ? "个人资料、收藏、DNA 和笔记默认仅本人可见。" : "Your profile, saves, DNA, and notes are private by default."}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">{isZh ? "同步" : "Sync"}</dt>
              <dd className="mt-1 leading-6 text-charcoal/68">{isZh ? "登录后通过 Supabase 在设备之间同步。" : "Signing in enables cross-device sync through Supabase."}</dd>
            </div>
          </dl>
          <button className="mt-6 rounded-md border border-brandforest/25 px-4 py-3 text-sm font-semibold text-brandforest hover:border-brandforest" onClick={() => void signOut()} type="button">
            {isZh ? "退出登录" : "Sign out"}
          </button>
        </div>

        <div className="border-t border-brandforest/20 pt-5">
          <h3 className="text-lg font-semibold text-brandforest">{isZh ? "数据管理" : "Data controls"}</h3>
          <p className="mt-3 text-sm leading-6 text-charcoal/68">
            {isZh ? "你可以下载一份 JSON 格式的私人数据副本。文件只在当前浏览器中生成。" : "Download a JSON copy of your private data. The file is generated in this browser."}
          </p>
          <button className="mt-5 rounded-md bg-brandforest px-4 py-3 text-sm font-semibold text-cream hover:bg-terracotta" onClick={downloadPrivateData} type="button">
            {isZh ? "下载私人数据" : "Download private data"}
          </button>

          <div className="mt-8 border-t border-red-900/15 pt-6">
            <h3 className="font-semibold text-red-950">{isZh ? "清空 My Atlas" : "Clear My Atlas"}</h3>
            <p className="mt-2 text-sm leading-6 text-charcoal/68">
              {isZh
                ? "这会删除个人资料内容、路线状态、私人笔记、收藏目的地和 DNA。登录账户与邮箱仍会保留。"
                : "This removes profile details, route statuses, private notes, saved places, and DNA. Your sign-in account remains."}
            </p>
            {!confirmClear ? (
              <button className="mt-4 rounded-md border border-red-900/25 px-4 py-3 text-sm font-semibold text-red-950 hover:bg-red-900/5" onClick={() => setConfirmClear(true)} type="button">
                {isZh ? "准备清空数据" : "Prepare to clear data"}
              </button>
            ) : (
              <div className="mt-4 flex flex-wrap gap-3" role="group" aria-label={isZh ? "确认清空私人数据" : "Confirm clearing private data"}>
                <button
                  className="rounded-md bg-red-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  disabled={isClearing}
                  onClick={async () => {
                    setIsClearing(true);
                    setMessage(null);
                    const didClear = await clearPrivateAtlas();
                    if (didClear) {
                      await Promise.all([reloadRoutes(), reloadProfile(), reloadLogs()]);
                      setMessage(isZh ? "My Atlas 私人数据已清空。" : "Your private My Atlas data has been cleared.");
                      setConfirmClear(false);
                    }
                    setIsClearing(false);
                  }}
                  type="button"
                >
                  {isClearing ? (isZh ? "正在清空..." : "Clearing...") : (isZh ? "确认永久清空" : "Confirm permanent clear")}
                </button>
                <button className="rounded-md border border-brandforest/20 px-4 py-3 text-sm font-semibold text-brandforest" onClick={() => setConfirmClear(false)} type="button">
                  {isZh ? "取消" : "Cancel"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {message ? <p aria-live="polite" className="mt-6 border-t border-brandforest/15 pt-4 text-sm font-semibold text-brandforest">{message}</p> : null}
    </section>
  );
}

function ProfileEditor({
  locale,
  profile,
  saveProfile
}: {
  locale: Locale;
  profile: UserProfileRecord | null;
  saveProfile: (input: {
    bio: string;
    display_name: string;
    experience_level: ExperienceLevel | null;
    home_base: string;
    preferred_styles: ClimbingType[];
  }) => Promise<boolean>;
}) {
  const isZh = locale === "zh";
  const [displayName, setDisplayName] = useState("");
  const [homeBase, setHomeBase] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [preferredStyles, setPreferredStyles] = useState<ClimbingType[]>([]);
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
    setHomeBase(profile?.home_base ?? "");
    setExperienceLevel(profile?.experience_level ?? null);
    setPreferredStyles(profile?.preferred_styles ?? []);
    setBio(profile?.bio ?? "");
  }, [profile]);

  return (
    <section className="border-l-0 border-brandforest/15 lg:border-l lg:pl-8">
      <p className="editorial-kicker text-terracotta">{isZh ? "个人偏好" : "Personal preferences"}</p>
      <h2 className="display-serif mt-3 text-3xl text-brandforest">{isZh ? "编辑个人资料" : "Edit your profile"}</h2>
      <div className="mt-6 grid gap-4">
        <Field label={isZh ? "显示名称" : "Display name"}>
          <input className="atlas-input" onChange={(event) => setDisplayName(event.target.value)} placeholder={isZh ? "例如：Moon" : "Example: Moon"} value={displayName} />
        </Field>
        <Field label={isZh ? "所在地" : "Home base"}>
          <input className="atlas-input" onChange={(event) => setHomeBase(event.target.value)} placeholder={isZh ? "例如：Toronto" : "Example: Toronto"} value={homeBase} />
        </Field>
        <Field label={isZh ? "经验水平" : "Experience level"}>
          <select className="atlas-input" onChange={(event) => setExperienceLevel(event.target.value ? event.target.value as ExperienceLevel : null)} value={experienceLevel ?? ""}>
            <option value="">{isZh ? "暂不设置" : "Leave unset"}</option>
            {Object.entries(experienceLabels).map(([value, label]) => <option key={value} value={value}>{label[locale]}</option>)}
          </select>
        </Field>
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">{isZh ? "偏好类型" : "Preferred styles"}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {styleOptions.map((style) => (
              <label className="flex min-h-11 items-center gap-3 rounded-md border border-brandforest/15 px-3 py-2 text-sm font-semibold text-charcoal" key={style}>
                <input
                  checked={preferredStyles.includes(style)}
                  onChange={() => setPreferredStyles((current) => current.includes(style) ? current.filter((item) => item !== style) : [...current, style])}
                  type="checkbox"
                />
                {formatClimbingType(style, locale)}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label={isZh ? "私人简介" : "Private bio"}>
          <textarea className="atlas-input min-h-28" onChange={(event) => setBio(event.target.value)} placeholder={isZh ? "记录自己的攀岩偏好或目标。" : "Keep private climbing preferences or goals."} value={bio} />
        </Field>
        <button
          className="primary-action"
          onClick={async () => {
            setMessage(null);
            const didSave = await saveProfile({ bio, display_name: displayName, experience_level: experienceLevel, home_base: homeBase, preferred_styles: preferredStyles });
            if (didSave) setMessage(isZh ? "个人资料已保存。" : "Profile saved.");
          }}
          type="button"
        >
          {isZh ? "保存个人资料" : "Save profile"} →
        </button>
        {message ? <p aria-live="polite" className="text-sm font-semibold text-brandforest">{message}</p> : null}
      </div>
    </section>
  );
}

function RouteSection({
  emptyText,
  items,
  locale,
  showNotes = false,
  title
}: {
  emptyText: string;
  items: AtlasItem[];
  locale: Locale;
  showNotes?: boolean;
  title: string;
}) {
  return (
    <section>
      <div className="flex items-end justify-between gap-3 border-b border-brandforest/15 pb-4">
        <h2 className="display-serif text-3xl text-brandforest">{title}</h2>
        <span className="text-sm font-semibold text-charcoal/50">{items.length}</span>
      </div>
      {items.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <RouteCard item={item} key={`${title}-${item.destination.slug}-${item.route.id}`} locale={locale} showNote={showNotes} />)}
        </div>
      ) : <EmptyInline text={emptyText} />}
    </section>
  );
}

function RouteCard({ item, locale, showNote }: { item: AtlasItem; locale: Locale; showNote: boolean }) {
  const statusLabel = item.saved ? getStatusLabel(item.saved.status, locale) : locale === "zh" ? "私人笔记" : "Private note";
  return (
    <Link className="destination-card border-brandforest/15" href={`/destinations/${item.destination.slug}/routes/${item.route.id}`}>
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal/50">
        <span>{statusLabel}</span><span aria-hidden="true">·</span><span>{item.route.grade}</span><span aria-hidden="true">·</span><span>{formatClimbingType(item.route.climbingType, locale)}</span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-brandforest">{item.route.name}</h3>
      <p className="mt-1 text-sm text-charcoal/60">{item.destination.name} / {formatDestinationFact(item.destination.country, locale)}</p>
      {getLocalizedSummary(item.route, locale) ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-charcoal/68">{getLocalizedSummary(item.route, locale)}</p> : null}
      {showNote && item.note?.note ? <p className="mt-3 border-l-2 border-terracotta pl-3 text-sm leading-6 text-charcoal/68">{item.note.note}</p> : null}
    </Link>
  );
}

function DestinationCard({ destination, locale }: { destination: MyAtlasDestinationSummary; locale: Locale }) {
  return (
    <Link className="destination-card" href={`/destinations/${destination.slug}`}>
      {destination.image ? <img alt={destination.image.alt} className="aspect-[16/9] w-full rounded-md object-cover" loading="lazy" src={destination.image.src} /> : <div className="grid aspect-[16/9] place-items-center rounded-md bg-brandforest/8 text-3xl text-brandforest" aria-hidden="true">△</div>}
      <h3 className="mt-4 text-xl font-semibold text-brandforest">{destination.name}</h3>
      <p className="mt-1 text-sm text-charcoal/60">{formatDestinationFact(destination.country, locale)} / {formatDestinationFact(destination.rockType, locale)}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-terracotta">{destination.routeCount} {locale === "zh" ? "条公开路线" : "public routes"}</p>
    </Link>
  );
}

function DnaBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-charcoal/60"><span>{label}</span><span>{value}</span></div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brandforest/10"><div className="h-full rounded-full bg-terracotta" style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">{label}{children}</label>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="border-t border-brandforest/20 pt-4"><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal/48">{label}</dt><dd className="display-serif mt-2 text-3xl text-brandforest">{value}</dd></div>;
}

function EmptyState({ action, body, title }: { action?: ReactNode; body: string; title: string }) {
  return <div className="border-y border-dashed border-brandforest/25 py-10"><h2 className="display-serif text-3xl text-brandforest">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/68">{body}</p>{action ? <div className="mt-5 flex flex-wrap gap-3">{action}</div> : null}</div>;
}

function EmptyInline({ text }: { text: string }) {
  return <p className="mt-5 border-y border-dashed border-brandforest/20 py-6 text-sm leading-6 text-charcoal/60">{text}</p>;
}

function ProfilePill({ label }: { label: string }) {
  return <span className="rounded-full border border-cream/20 bg-cream/8 px-3 py-1 text-xs font-semibold text-cream/85">{label}</span>;
}

function getInitials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CA";
}

function getItemDate(item: AtlasItem) {
  return item.saved?.updated_at ?? item.note?.updated_at ?? "";
}

function getStatusLabel(status: SavedRouteStatus, locale: Locale) {
  if (status === "want-to-climb") return locale === "zh" ? "想爬" : "Want";
  return locale === "zh" ? "已爬" : "Climbed";
}

function getLocalizedSummary(route: PublicRouteSummary, locale: Locale) {
  return route.summary?.[locale] ?? route.summary?.en ?? route.summary?.zh;
}

function formatDate(value: string, locale: Locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-CA", { dateStyle: "medium" }).format(date);
}

function formatSessionDate(value: string, locale: Locale) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-CA", {
    dateStyle: "medium"
  }).format(date);
}
