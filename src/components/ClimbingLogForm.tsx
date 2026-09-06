"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  useUserClimbingLogs,
  type ClimbingLogInput
} from "@/components/UserClimbingLogsProvider";
import type {
  ClimbingCompletionStyle,
  ClimbingLogRecord,
  ClimbingLogResult
} from "@/lib/supabaseClient";

type ClimbingLogFormProps = {
  destinationSlug: string;
  existingLog?: ClimbingLogRecord;
  onCancel?: () => void;
  onSaved?: () => void;
  routeId: string;
};

const completionStyles: ClimbingCompletionStyle[] = [
  "unspecified",
  "onsight",
  "flash",
  "redpoint",
  "send",
  "repeat",
  "top-rope"
];

const completionStyleLabels: Record<
  ClimbingCompletionStyle,
  { en: string; zh: string }
> = {
  unspecified: { en: "Not recorded", zh: "不记录" },
  onsight: { en: "Onsight", zh: "Onsight" },
  flash: { en: "Flash", zh: "Flash" },
  redpoint: { en: "Redpoint", zh: "Redpoint" },
  send: { en: "Send", zh: "完成" },
  repeat: { en: "Repeat", zh: "重复完成" },
  "top-rope": { en: "Top-rope", zh: "顶绳完成" }
};

export function ClimbingLogForm({
  destinationSlug,
  existingLog,
  onCancel,
  onSaved,
  routeId
}: ClimbingLogFormProps) {
  const { locale } = useLanguage();
  const { error, isLoading, saveLog } = useUserClimbingLogs();
  const [sessionDate, setSessionDate] = useState(todayInputValue());
  const [result, setResult] = useState<ClimbingLogResult>("completed");
  const [completionStyle, setCompletionStyle] =
    useState<ClimbingCompletionStyle>("unspecified");
  const [attemptCount, setAttemptCount] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const isZh = locale === "zh";

  useEffect(() => {
    setSessionDate(existingLog?.session_date ?? todayInputValue());
    setResult(existingLog?.result ?? "completed");
    setCompletionStyle(existingLog?.completion_style ?? "unspecified");
    setAttemptCount(existingLog?.attempt_count ? String(existingLog.attempt_count) : "");
    setNote(existingLog?.note ?? "");
    setMessage(null);
  }, [existingLog]);

  async function handleSubmit() {
    setMessage(null);
    const parsedAttempts = attemptCount ? Number.parseInt(attemptCount, 10) : null;
    const input: ClimbingLogInput = {
      attemptCount: parsedAttempts,
      completionStyle: result === "completed" ? completionStyle : null,
      destinationSlug,
      id: existingLog?.id,
      note,
      result,
      routeId,
      sessionDate
    };
    const didSave = await saveLog(input);
    if (!didSave) return;

    setMessage(isZh ? "攀岩日志已保存。" : "Climbing log saved.");
    if (!existingLog) {
      setAttemptCount("");
      setNote("");
    }
    onSaved?.();
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">
        {isZh ? "日期" : "Date"}
        <input
          className="atlas-input"
          max={todayInputValue()}
          onChange={(event) => setSessionDate(event.target.value)}
          required
          type="date"
          value={sessionDate}
        />
      </label>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">
          {isZh ? "结果" : "Result"}
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["completed", "attempted"] as ClimbingLogResult[]).map((option) => (
            <label
              className={`flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm font-semibold ${
                result === option
                  ? "border-brandforest bg-brandforest text-cream"
                  : "border-brandforest/15 bg-white/50 text-charcoal"
              }`}
              key={option}
            >
              <input
                checked={result === option}
                className="sr-only"
                name={`log-result-${routeId}-${existingLog?.id ?? "new"}`}
                onChange={() => setResult(option)}
                type="radio"
                value={option}
              />
              {option === "completed"
                ? isZh ? "完成" : "Completed"
                : isZh ? "尝试中" : "Attempted"}
            </label>
          ))}
        </div>
      </fieldset>

      {result === "completed" ? (
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">
          {isZh ? "完成方式" : "Completion style"}
          <select
            className="atlas-input"
            onChange={(event) => setCompletionStyle(event.target.value as ClimbingCompletionStyle)}
            value={completionStyle}
          >
            {completionStyles.map((style) => (
              <option key={style} value={style}>
                {completionStyleLabels[style][locale]}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">
        {isZh ? "这次尝试次数（可选）" : "Attempts this session (optional)"}
        <input
          className="atlas-input"
          inputMode="numeric"
          max={999}
          min={1}
          onChange={(event) => setAttemptCount(event.target.value)}
          placeholder={isZh ? "例如：3" : "Example: 3"}
          type="number"
          value={attemptCount}
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">
        {isZh ? "这次的私人记录（可选）" : "Private session note (optional)"}
        <textarea
          className="atlas-input min-h-24"
          maxLength={2000}
          onChange={(event) => setNote(event.target.value)}
          placeholder={
            isZh
              ? "记录这一天的感受或下次想尝试的方向。不要把它和长期线路笔记混在一起。"
              : "Record how the day felt or what you want to revisit next time."
          }
          value={note}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md bg-brandforest px-4 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta disabled:opacity-50"
          disabled={isLoading || !sessionDate}
          onClick={() => void handleSubmit()}
          type="button"
        >
          {isLoading
            ? isZh ? "正在保存..." : "Saving..."
            : existingLog
              ? isZh ? "更新日志" : "Update log"
              : isZh ? "保存日志" : "Save log"}
        </button>
        {onCancel ? (
          <button
            className="rounded-md border border-brandforest/20 px-4 py-3 text-sm font-semibold text-brandforest"
            onClick={onCancel}
            type="button"
          >
            {isZh ? "取消" : "Cancel"}
          </button>
        ) : null}
      </div>

      {message || error ? (
        <p aria-live="polite" className="text-xs font-semibold leading-5 text-brandforest">
          {error ?? message}
        </p>
      ) : null}
    </div>
  );
}

export function getCompletionStyleLabel(
  style: ClimbingCompletionStyle | null,
  locale: "en" | "zh"
) {
  return style ? completionStyleLabels[style][locale] : "";
}

function todayInputValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
