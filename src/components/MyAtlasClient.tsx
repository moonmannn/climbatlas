"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthButton } from "@/components/AuthButton";
import { LanguageToggle, useLanguage } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserProfile } from "@/components/UserProfileProvider";
import { useUserRoutes } from "@/components/UserRoutesProvider";
import { getRouteSummary } from "@/data/localizedContent";
import { routeRecordKey } from "@/lib/routeAliases";
import { getAllRoutesWithDestinations } from "@/lib/routes";
import type {
  ExperienceLevel,
  RouteNoteRecord,
  SavedRouteRecord,
  SavedRouteStatus,
  UserProfileRecord
} from "@/lib/supabaseClient";
import type { ClimbingType, Locale, RouteHighlight } from "@/types/destination";

type AtlasItem = {
  destination: {
    country: string;
    name: string;
    slug: string;
  };
  note?: RouteNoteRecord;
  route: RouteHighlight;
  saved?: SavedRouteRecord;
};

type MyAtlasClientProps = {
  variant?: "page" | "embedded";
};

const styleOptions: ClimbingType[] = [
  "sport",
  "trad",
  "boulder",
  "multi-pitch"
];

const experienceLabels: Record<ExperienceLevel, { en: string; zh: string }> = {
  newer: {
    en: "Newer outdoors",
    zh: "户外新手"
  },
  intermediate: {
    en: "Intermediate",
    zh: "进阶中"
  },
  experienced: {
    en: "Experienced",
    zh: "有经验"
  },
  "project-focused": {
    en: "Project focused",
    zh: "项目型"
  }
};

export function MyAtlasClient({ variant = "page" }: MyAtlasClientProps) {
  const { locale } = useLanguage();
  const { isConfigured, user } = useSupabaseAuth();
  const {
    error: profileError,
    isLoading: isProfileLoading,
    profile,
    saveProfile
  } = useUserProfile();
  const {
    error: routesError,
    isLoading: areRoutesLoading,
    notes,
    savedRoutes
  } = useUserRoutes();
  const isZh = locale === "zh";

  const atlasItems = useMemo<AtlasItem[]>(() => {
    const routeLookup = new Map(
      getAllRoutesWithDestinations().map((item) => [
        routeRecordKey(item.destination.slug, item.route.id),
        item
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
    const keys = Array.from(
      new Set([
        ...Array.from(savedLookup.keys()),
        ...Array.from(noteLookup.keys())
      ])
    );

    return keys.flatMap((key) => {
      const item = routeLookup.get(key);

      if (!item) {
        return [];
      }

      return [
        {
          destination: {
            country: item.destination.country,
            name: item.destination.name,
            slug: item.destination.slug
          },
          note: noteLookup.get(key),
          route: item.route,
          saved: savedLookup.get(key)
        }
      ];
    });
  }, [notes, savedRoutes]);

  const wantItems = atlasItems.filter(
    (item) => item.saved?.status === "want-to-climb"
  );
  const climbedItems = atlasItems.filter(
    (item) => item.saved?.status === "climbed"
  );
  const noteItems = atlasItems.filter((item) => item.note?.note);
  const recentItems = [...atlasItems]
    .sort((a, b) => {
      const aDate = a.saved?.updated_at ?? a.note?.updated_at ?? "";
      const bDate = b.saved?.updated_at ?? b.note?.updated_at ?? "";

      return bDate.localeCompare(aDate);
    })
    .slice(0, 6);
  const destinationCount = new Set(
    atlasItems.map((item) => item.destination.slug)
  ).size;
  const isLoading = isProfileLoading || areRoutesLoading;
  const displayName =
    profile?.display_name || user?.email?.split("@")[0] || "ClimbAtlas climber";

  const content = (
    <div className="relative mx-auto max-w-6xl">
      {variant === "page" && (
        <div className="hidden">
          <Link
            className="inline-flex rounded-md border border-parchment/25 bg-parchment/10 px-3 py-2 text-sm font-bold text-parchment backdrop-blur transition hover:bg-parchment/20"
            href="/"
          >
            {isZh ? "返回地图" : "Back to map"}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <AuthButton tone="dark" />
            <LanguageToggle />
          </div>
        </div>
      )}

        <section className="mt-5 overflow-hidden border-y border-brandforest/15 bg-cream">
          <div className="border-b border-brandforest/15 bg-brandforest px-6 py-8 text-parchment sm:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sunlit">
              {isZh ? "私人个人主页" : "Private profile"}
            </p>
            <div className="mt-4 grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="grid h-20 w-20 place-items-center rounded-full border border-parchment/30 bg-parchment/15 text-3xl font-black text-sunlit shadow-atlas">
                {getInitials(displayName)}
              </div>
              <div>
                <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                  {displayName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-parchment/80">
                  {profile?.bio ||
                    (isZh
                      ? "你的私人 ClimbAtlas 空间：路线计划、已爬记录和只给自己看的笔记。"
                      : "Your private ClimbAtlas space for route plans, climbed routes, and notes only you can see.")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ProfilePill
                    label={
                      profile?.experience_level
                        ? experienceLabels[profile.experience_level][locale]
                        : isZh
                          ? "未设置经验"
                          : "Experience unset"
                    }
                  />
                  <ProfilePill
                    label={
                      profile?.home_base ||
                      (isZh ? "未设置所在地" : "Home base unset")
                    }
                  />
                  {(profile?.preferred_styles ?? []).map((style) => (
                    <ProfilePill key={style} label={style} />
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-parchment/20 bg-parchment/10 p-4 text-sm font-bold leading-6 text-parchment/80">
                <p>{user?.email ?? (isZh ? "未登录" : "Not signed in")}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-sunlit">
                  {isZh ? "Private only" : "Private only"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {!isConfigured && (
              <EmptyState
                action={
                  <span className="rounded-md border border-ridge/25 bg-parchment/70 px-3 py-2 text-xs font-black leading-5 text-bark/65">
                    {isZh
                      ? "下一步：运行 supabase/schema.sql，并在本地和 Vercel 填入 Supabase 环境变量。"
                      : "Next: run supabase/schema.sql, then add Supabase env variables locally and in Vercel."}
                  </span>
                }
                body={
                  isZh
                    ? "Supabase 环境变量还没有配置。配置完成后，用户就能登录、编辑个人资料并保存路线。"
                    : "Supabase env variables are not configured yet. Once configured, users can sign in, edit profiles, and save routes."
                }
                title={isZh ? "还不能保存" : "Saving is not ready yet"}
              />
            )}

            {isConfigured && !user && (
              <EmptyState
                action={<AuthButton />}
                body={
                  isZh
                    ? "登录后可以看到自己的个人主页、想爬路线、已爬路线和私人笔记。"
                    : "Sign in to see your private profile, want-to-climb routes, climbed routes, and private notes."
                }
                title={isZh ? "请先登录" : "Sign in first"}
              />
            )}

            {user && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Stat
                    label={isZh ? "全部保存" : "Saved"}
                    value={atlasItems.filter((item) => item.saved).length}
                  />
                  <Stat label={isZh ? "想爬" : "Want"} value={wantItems.length} />
                  <Stat label={isZh ? "已爬" : "Climbed"} value={climbedItems.length} />
                  <Stat label={isZh ? "笔记" : "Notes"} value={noteItems.length} />
                  <Stat label={isZh ? "目的地" : "Places"} value={destinationCount} />
                </div>

                {(profileError || routesError) && (
                  <p className="mt-4 rounded-md border border-red-900/20 bg-red-900/10 p-3 text-sm font-bold text-red-950">
                    {profileError ?? routesError}
                  </p>
                )}

                {isLoading ? (
                  <p className="mt-6 rounded-md border border-ridge/25 bg-white/45 p-5 text-sm font-bold text-bark/65">
                    {isZh ? "正在读取你的个人主页..." : "Loading your profile..."}
                  </p>
                ) : (
                  <div className="mt-6 grid gap-5 lg:grid-cols-[20rem_1fr]">
                    <ProfileEditor
                      locale={locale}
                      profile={profile}
                      saveProfile={saveProfile}
                    />
                    <div className="grid gap-5">
                      <RouteSection
                        emptyText={
                          isZh
                            ? "还没有想爬路线。去路线页点“想爬”开始做计划。"
                            : "No want-to-climb routes yet. Open a route and mark it as want-to-climb."
                        }
                        items={wantItems.slice(0, 6)}
                        locale={locale}
                        title={isZh ? "想爬路线" : "Want to climb"}
                      />
                      <RouteSection
                        emptyText={
                          isZh
                            ? "还没有已爬记录。爬完后把路线标记为已爬。"
                            : "No climbed routes yet. Mark routes as climbed after your days out."
                        }
                        items={climbedItems.slice(0, 6)}
                        locale={locale}
                        title={isZh ? "已爬路线" : "Climbed routes"}
                      />
                      <RouteSection
                        emptyText={
                          isZh
                            ? "还没有私人笔记。路线页可以记录只给自己看的想法。"
                            : "No private notes yet. Route pages can hold notes only you can see."
                        }
                        items={noteItems.slice(0, 6)}
                        locale={locale}
                        showNotes
                        title={isZh ? "私人笔记" : "Private notes"}
                      />
                      <RouteSection
                        emptyText={
                          isZh
                            ? "还没有最近记录。"
                            : "No recent saves yet."
                        }
                        items={recentItems}
                        locale={locale}
                        title={isZh ? "最近记录" : "Recent saves"}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
  );

  if (variant === "embedded") {
    return content;
  }

  return (
    <main className="phase6-content min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <div className="px-5 py-[72px] sm:px-8 lg:px-12 lg:py-20">{content}</div>
    </main>
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
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);
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

  function toggleStyle(style: ClimbingType) {
    setPreferredStyles((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style]
    );
  }

  return (
    <aside className="rounded-lg border border-ridge/25 bg-white/45 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
        {isZh ? "编辑个人资料" : "Edit profile"}
      </p>
      <div className="mt-4 grid gap-3">
        <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-bark/55">
          {isZh ? "显示名称" : "Display name"}
          <input
            className="rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold normal-case tracking-normal text-bark outline-none transition focus:border-forest"
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder={isZh ? "例如：Moon" : "Example: Moon"}
            value={displayName}
          />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-bark/55">
          {isZh ? "所在地" : "Home base"}
          <input
            className="rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold normal-case tracking-normal text-bark outline-none transition focus:border-forest"
            onChange={(event) => setHomeBase(event.target.value)}
            placeholder={isZh ? "例如：Toronto" : "Example: Toronto"}
            value={homeBase}
          />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-bark/55">
          {isZh ? "经验水平" : "Experience level"}
          <select
            className="rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold normal-case tracking-normal text-bark outline-none transition focus:border-forest"
            onChange={(event) =>
              setExperienceLevel(
                event.target.value
                  ? (event.target.value as ExperienceLevel)
                  : null
              )
            }
            value={experienceLevel ?? ""}
          >
            <option value="">{isZh ? "暂不设置" : "Leave unset"}</option>
            {Object.entries(experienceLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label[locale]}
              </option>
            ))}
          </select>
        </label>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-bark/55">
            {isZh ? "偏好风格" : "Preferred styles"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {styleOptions.map((style) => (
              <button
                className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                  preferredStyles.includes(style)
                    ? "border-forest bg-forest text-parchment"
                    : "border-ridge/25 bg-parchment/80 text-bark hover:border-forest/35"
                }`}
                key={style}
                onClick={() => toggleStyle(style)}
                type="button"
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-bark/55">
          {isZh ? "简介" : "Bio"}
          <textarea
            className="min-h-28 rounded-md border border-ridge/25 bg-parchment/80 px-3 py-2 text-sm font-bold normal-case tracking-normal text-bark outline-none transition focus:border-forest"
            onChange={(event) => setBio(event.target.value)}
            placeholder={
              isZh
                ? "只给自己看的攀岩偏好或目标。"
                : "Private climbing preferences or goals."
            }
            value={bio}
          />
        </label>
        <button
          className="rounded-md bg-forest px-4 py-3 text-sm font-black text-parchment transition hover:bg-bark"
          onClick={async () => {
            setMessage(null);
            const didSave = await saveProfile({
              bio,
              display_name: displayName,
              experience_level: experienceLevel,
              home_base: homeBase,
              preferred_styles: preferredStyles
            });

            if (didSave) {
              setMessage(isZh ? "个人资料已保存。" : "Profile saved.");
            }
          }}
          type="button"
        >
          {isZh ? "保存个人资料" : "Save profile"}
        </button>
        {message && (
          <p className="rounded-md border border-forest/20 bg-forest/10 p-3 text-xs font-bold leading-5 text-bark/70">
            {message}
          </p>
        )}
      </div>
    </aside>
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
    <section className="rounded-lg border border-ridge/25 bg-white/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-bark">{title}</h2>
        <span className="rounded-full border border-ridge/25 bg-parchment/70 px-3 py-1 text-xs font-black text-bark/60">
          {items.length}
        </span>
      </div>
      {items.length > 0 ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <RouteCard
              item={item}
              key={`${title}-${item.destination.slug}-${item.route.id}`}
              locale={locale}
              showNote={showNotes}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-dashed border-ridge/35 bg-parchment/55 p-4">
          <p className="text-sm font-bold leading-6 text-bark/65">
            {emptyText}
          </p>
          <Link
            className="mt-3 inline-flex rounded-md border border-forest/25 bg-forest px-3 py-2 text-xs font-black text-parchment transition hover:bg-bark"
            href="/"
          >
            {locale === "zh" ? "去地图找路线" : "Find routes on the map"}
          </Link>
        </div>
      )}
    </section>
  );
}

function RouteCard({
  item,
  locale,
  showNote
}: {
  item: AtlasItem;
  locale: Locale;
  showNote: boolean;
}) {
  const isZh = locale === "zh";
  const statusLabel = item.saved
    ? getStatusLabel(item.saved.status, locale)
    : isZh
      ? "私人笔记"
      : "private note";

  return (
    <Link
      className="rounded-lg border border-ridge/20 bg-parchment/65 p-4 transition hover:border-forest/40 hover:bg-parchment"
      href={`/destinations/${item.destination.slug}/routes/${item.route.id}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-forest/20 bg-forest/10 px-2 py-1 text-[11px] font-black text-forest">
          {statusLabel}
        </span>
        <span className="rounded-full border border-ridge/25 bg-white/55 px-2 py-1 text-[11px] font-black text-bark/65">
          {item.route.grade}
        </span>
        <span className="rounded-full border border-ridge/25 bg-white/55 px-2 py-1 text-[11px] font-black text-bark/65">
          {item.route.type}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-black text-bark">{item.route.name}</h3>
      <p className="mt-1 text-sm font-bold text-forest">
        {item.destination.name} / {item.destination.country}
      </p>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-bark/70">
        {getRouteSummary(item.route, locale)}
      </p>
      {showNote && item.note?.note && (
        <p className="mt-3 rounded-md border border-sunlit/30 bg-sunlit/15 p-3 text-xs font-bold leading-5 text-bark/70">
          {item.note.note}
        </p>
      )}
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-ridge/25 bg-white/45 p-4">
      <dt className="text-xs font-black uppercase tracking-wide text-bark/55">
        {label}
      </dt>
      <dd className="mt-2 text-3xl font-black text-forest">{value}</dd>
    </div>
  );
}

function EmptyState({
  action,
  body,
  title
}: {
  action?: ReactNode;
  body: string;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-ridge/40 bg-white/35 p-6">
      <h2 className="text-2xl font-black text-bark">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-bark/70">
        {body}
      </p>
      {action && <div className="mt-4 flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}

function ProfilePill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-parchment/20 bg-parchment/10 px-3 py-1 text-xs font-black text-parchment/85">
      {label}
    </span>
  );
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CA";
}

function getStatusLabel(status: SavedRouteStatus, locale: Locale) {
  if (status === "want-to-climb") {
    return locale === "zh" ? "想爬" : "want";
  }

  return locale === "zh" ? "已爬" : "climbed";
}
