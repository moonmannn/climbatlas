"use client";

import { useEffect, useState } from "react";
import { AuthButton } from "@/components/AuthButton";
import { useLanguage } from "@/components/LanguageProvider";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserRoutes } from "@/components/UserRoutesProvider";
import type { SavedRouteStatus } from "@/lib/supabaseClient";

type RouteIdentity = {
  id: string;
  name: string;
};

type UserRouteControlsProps = {
  destinationName: string;
  destinationSlug: string;
  route: RouteIdentity;
};

const statusLabels: Record<SavedRouteStatus, { en: string; zh: string }> = {
  "want-to-climb": {
    en: "Want to climb",
    zh: "想爬"
  },
  climbed: {
    en: "Climbed",
    zh: "已爬"
  }
};

export function UserRouteControls({
  destinationName,
  destinationSlug,
  route
}: UserRouteControlsProps) {
  const { locale } = useLanguage();
  const { isConfigured, user } = useSupabaseAuth();
  const {
    error,
    getNote,
    getSavedStatus,
    isLoading,
    saveNote,
    saveStatus
  } = useUserRoutes();
  const [noteDraft, setNoteDraft] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const isZh = locale === "zh";
  const currentStatus = getSavedStatus(destinationSlug, route.id);
  const savedNote = getNote(destinationSlug, route.id);
  const hasNoteChange = noteDraft.trim() !== savedNote.trim();

  useEffect(() => {
    setNoteDraft(savedNote);
  }, [savedNote]);

  async function handleStatus(nextStatus: SavedRouteStatus | null) {
    setMessage(null);
    const didSave = await saveStatus(destinationSlug, route.id, nextStatus);

    if (didSave) {
      setMessage(
        nextStatus
          ? isZh
            ? `已标记为${statusLabels[nextStatus].zh}。`
            : `Marked as ${statusLabels[nextStatus].en.toLowerCase()}.`
          : isZh
            ? "已从路线本移除。"
            : "Removed from your atlas."
      );
    }
  }

  async function handleNoteSave(nextNote = noteDraft) {
    setMessage(null);
    const didSave = await saveNote(destinationSlug, route.id, nextNote);

    if (didSave) {
      setMessage(
        nextNote.trim()
          ? isZh
            ? "私人笔记已保存。"
            : "Private note saved."
          : isZh
            ? "私人笔记已清空。"
            : "Private note cleared."
      );
    }
  }

  return (
    <section className="mb-5 rounded-lg border border-forest/20 bg-forest/10 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-forest">
            {isZh ? "个人路线本" : "Personal route notebook"}
          </p>
          <h2 className="mt-1 text-2xl font-black text-bark">
            {isZh ? "把这条线放进你的计划" : "Save this route to your atlas"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-bark/70">
            {isZh
              ? "这些记录只属于你自己，不会显示在公开评价中。"
              : "These records are private to you and do not appear in public reviews."}
          </p>
        </div>
        <div className="rounded-md border border-ridge/25 bg-parchment/70 px-3 py-2 text-xs font-black text-bark/65">
          {destinationName} / {route.name}
        </div>
      </div>

      {!isConfigured && (
        <p className="mt-4 rounded-md border border-ridge/25 bg-white/60 p-3 text-sm font-bold leading-6 text-bark/70">
          {isZh
            ? "还没有配置 Supabase 环境变量。上线前配置好之后，这里就能保存个人记录。"
            : "Supabase env variables are not configured yet. Once configured, this panel will save personal records."}
        </p>
      )}

      {isConfigured && !user && (
        <div className="mt-4 flex flex-col gap-3 rounded-md border border-ridge/25 bg-white/60 p-3 text-sm font-bold leading-6 text-bark/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isZh
              ? "登录后可以保存想爬、已爬和私人笔记。"
              : "Sign in to save want-to-climb, climbed, and private notes."}
          </p>
          <AuthButton />
        </div>
      )}

      {user && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[18rem_1fr]">
          <div className="grid gap-2">
            <div className="rounded-md border border-ridge/25 bg-parchment/70 p-3 text-xs font-black leading-5 text-bark/65">
              {isZh ? "当前状态：" : "Current status: "}
              <span className="text-forest">
                {currentStatus
                  ? statusLabels[currentStatus][locale]
                  : isZh
                    ? "未保存"
                    : "not saved"}
              </span>
            </div>
            {(["want-to-climb", "climbed"] as SavedRouteStatus[]).map(
              (status) => (
                <button
                  className={`rounded-md border px-3 py-3 text-left text-sm font-black transition ${
                    currentStatus === status
                      ? "border-forest bg-forest text-parchment"
                      : "border-ridge/25 bg-white/60 text-bark hover:border-forest/35"
                  }`}
                  disabled={isLoading}
                  key={status}
                  onClick={() => void handleStatus(status)}
                  type="button"
                >
                  {statusLabels[status][locale]}
                </button>
              )
            )}
            <button
              className="rounded-md border border-ridge/25 bg-white/40 px-3 py-3 text-left text-sm font-black text-bark/60 transition hover:border-forest/35 hover:text-bark disabled:cursor-not-allowed disabled:opacity-45"
              disabled={isLoading || !currentStatus}
              onClick={() => void handleStatus(null)}
              type="button"
            >
              {isZh ? "从路线本移除" : "Remove saved status"}
            </button>
          </div>

          <div>
            <label
              className="text-xs font-black uppercase tracking-[0.18em] text-ridge"
              htmlFor={`note-${route.id}`}
            >
              {isZh ? "私人笔记" : "Private note"}
            </label>
            <textarea
              className="mt-2 min-h-28 w-full rounded-md border border-ridge/25 bg-white/70 px-3 py-3 text-sm font-bold leading-6 text-bark outline-none transition focus:border-forest"
              id={`note-${route.id}`}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder={
                isZh
                  ? "只给自己看的路线想法、训练目标，或下次要确认的事项。"
                  : "Private thoughts, training goals, or things to confirm next time."
              }
              value={noteDraft}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="rounded-md bg-bark px-4 py-2 text-sm font-black text-parchment transition hover:bg-forest disabled:cursor-not-allowed disabled:bg-bark/45"
                disabled={isLoading || !hasNoteChange}
                onClick={() => void handleNoteSave()}
                type="button"
              >
                {isZh ? "保存笔记" : "Save note"}
              </button>
              <button
                className="rounded-md border border-ridge/25 bg-white/45 px-4 py-2 text-sm font-black text-bark/65 transition hover:border-forest/35 hover:text-bark disabled:cursor-not-allowed disabled:opacity-45"
                disabled={isLoading || (!savedNote && !noteDraft)}
                onClick={() => {
                  setNoteDraft("");
                  void handleNoteSave("");
                }}
                type="button"
              >
                {isZh ? "清空笔记" : "Clear note"}
              </button>
            </div>
          </div>
        </div>
      )}

      {(message || error) && (
        <p className="mt-4 rounded-md border border-ridge/25 bg-parchment/70 p-3 text-xs font-bold leading-5 text-bark/70">
          {error ?? message}
        </p>
      )}
    </section>
  );
}
