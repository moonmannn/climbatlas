"use client";

import { useState } from "react";
import { AuthButton } from "@/components/AuthButton";
import { useLanguage } from "@/components/LanguageProvider";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserAtlas } from "@/components/UserAtlasProvider";

type UserDestinationControlProps = {
  destinationName: string;
  destinationSlug: string;
};

export function UserDestinationControl({
  destinationName,
  destinationSlug
}: UserDestinationControlProps) {
  const { locale } = useLanguage();
  const { isConfigured, user } = useSupabaseAuth();
  const { isDestinationSaved, saveDestination } = useUserAtlas();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isZh = locale === "zh";
  const isSaved = isDestinationSaved(destinationSlug);

  if (!isConfigured || !user) {
    return (
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <AuthButton />
        <p className="max-w-sm text-xs leading-5 text-charcoal/55">
          {isZh
            ? "登录后可收藏目的地，并在不同设备上同步。"
            : "Sign in to save destinations and sync them across devices."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <button
        aria-label={
          isSaved
            ? isZh
              ? `取消收藏 ${destinationName}`
              : `Remove ${destinationName} from saved places`
            : isZh
              ? `收藏 ${destinationName}`
              : `Save ${destinationName}`
        }
        aria-pressed={isSaved}
        className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${
          isSaved
            ? "border-terracotta bg-terracotta text-white"
            : "border-brandforest/25 bg-cream text-brandforest hover:border-brandforest"
        }`}
        disabled={isSaving}
        onClick={async () => {
          setIsSaving(true);
          setMessage(null);
          const didSave = await saveDestination(destinationSlug, !isSaved);
          setIsSaving(false);

          if (didSave) {
            setMessage(
              !isSaved
                ? isZh
                  ? "已收藏到 My Atlas。"
                  : "Saved to My Atlas."
                : isZh
                  ? "已从收藏中移除。"
                  : "Removed from saved places."
            );
          }
        }}
        type="button"
      >
        <span aria-hidden="true">{isSaved ? "★" : "☆"}</span>
        {isSaving
          ? isZh
            ? "正在保存..."
            : "Saving..."
          : isSaved
            ? isZh
              ? "已收藏"
              : "Saved place"
            : isZh
              ? "收藏目的地"
              : "Save destination"}
      </button>
      {message ? (
        <p aria-live="polite" className="text-xs font-semibold text-brandforest">
          {message}
        </p>
      ) : null}
    </div>
  );
}
