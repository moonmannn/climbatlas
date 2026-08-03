"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { useUserRoutes } from "@/components/UserRoutesProvider";
import { resolveRouteId, routeRecordKey } from "@/lib/routeAliases";
import {
  getSupabaseBrowserClient,
  type ClimbingCompletionStyle,
  type ClimbingLogRecord,
  type ClimbingLogResult
} from "@/lib/supabaseClient";

export type ClimbingLogInput = {
  id?: string;
  destinationSlug: string;
  routeId: string;
  sessionDate: string;
  result: ClimbingLogResult;
  completionStyle: ClimbingCompletionStyle | null;
  attemptCount: number | null;
  note: string;
};

type UserClimbingLogsContextValue = {
  deleteLog: (id: string) => Promise<boolean>;
  error: string | null;
  getRouteLogs: (destinationSlug: string, routeId: string) => ClimbingLogRecord[];
  isLoading: boolean;
  logs: ClimbingLogRecord[];
  reloadLogs: () => Promise<void>;
  saveLog: (input: ClimbingLogInput) => Promise<boolean>;
};

const UserClimbingLogsContext = createContext<UserClimbingLogsContextValue | null>(null);

export function UserClimbingLogsProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabaseAuth();
  const { reload: reloadRoutes } = useUserRoutes();
  const supabase = getSupabaseBrowserClient();
  const [logs, setLogs] = useState<ClimbingLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reloadLogs = useCallback(async () => {
    if (!supabase || !user) {
      setLogs([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase
      .from("climbing_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("session_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (loadError) {
      setError(loadError.message);
    } else {
      setLogs((data ?? []) as ClimbingLogRecord[]);
    }
    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    void reloadLogs();
  }, [reloadLogs]);

  const routeLogs = useMemo(() => {
    const grouped = new Map<string, ClimbingLogRecord[]>();
    for (const log of logs) {
      const key = routeRecordKey(log.destination_slug, log.route_id);
      grouped.set(key, [...(grouped.get(key) ?? []), log]);
    }
    return grouped;
  }, [logs]);

  const value = useMemo<UserClimbingLogsContextValue>(() => ({
    async deleteLog(id) {
      if (!supabase || !user) {
        setError("Sign in before deleting a climbing log.");
        return false;
      }

      setError(null);
      const { error: deleteError } = await supabase
        .from("climbing_logs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        setError(deleteError.message);
        return false;
      }

      await reloadLogs();
      return true;
    },
    error,
    getRouteLogs(destinationSlug, routeId) {
      const canonicalRouteId = resolveRouteId(destinationSlug, routeId);
      return routeLogs.get(routeRecordKey(destinationSlug, canonicalRouteId)) ?? [];
    },
    isLoading,
    logs,
    reloadLogs,
    async saveLog(input) {
      if (!supabase || !user) {
        setError("Sign in before saving a climbing log.");
        return false;
      }

      setError(null);
      const canonicalRouteId = resolveRouteId(input.destinationSlug, input.routeId);
      const { error: saveError } = await supabase.rpc("save_climbing_log", {
        p_attempt_count: input.attemptCount,
        p_completion_style: input.result === "completed" ? input.completionStyle : null,
        p_destination_slug: input.destinationSlug,
        p_id: input.id ?? null,
        p_note: input.note.trim(),
        p_result: input.result,
        p_route_id: canonicalRouteId,
        p_session_date: input.sessionDate
      });

      if (saveError) {
        setError(saveError.message);
        return false;
      }

      await Promise.all([reloadLogs(), reloadRoutes()]);
      return true;
    }
  }), [error, isLoading, logs, reloadLogs, reloadRoutes, routeLogs, supabase, user]);

  return (
    <UserClimbingLogsContext.Provider value={value}>
      {children}
    </UserClimbingLogsContext.Provider>
  );
}

export function useUserClimbingLogs() {
  const context = useContext(UserClimbingLogsContext);
  if (!context) {
    throw new Error("useUserClimbingLogs must be used inside UserClimbingLogsProvider.");
  }
  return context;
}
