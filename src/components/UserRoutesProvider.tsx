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
import {
  getSupabaseBrowserClient,
  type RouteNoteRecord,
  type SavedRouteRecord,
  type SavedRouteStatus
} from "@/lib/supabaseClient";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import {
  getRouteIdsForStorage,
  resolveRouteId,
  routeRecordKey
} from "@/lib/routeAliases";

type UserRoutesContextValue = {
  error: string | null;
  getNote: (destinationSlug: string, routeId: string) => string;
  getSavedStatus: (
    destinationSlug: string,
    routeId: string
  ) => SavedRouteStatus | undefined;
  isLoading: boolean;
  notes: RouteNoteRecord[];
  reload: () => Promise<void>;
  saveNote: (
    destinationSlug: string,
    routeId: string,
    note: string
  ) => Promise<boolean>;
  saveStatus: (
    destinationSlug: string,
    routeId: string,
    status: SavedRouteStatus | null
  ) => Promise<boolean>;
  savedRoutes: SavedRouteRecord[];
};

const UserRoutesContext = createContext<UserRoutesContextValue | null>(null);


export function UserRoutesProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabaseAuth();
  const supabase = getSupabaseBrowserClient();
  const [savedRoutes, setSavedRoutes] = useState<SavedRouteRecord[]>([]);
  const [notes, setNotes] = useState<RouteNoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!supabase || !user) {
      setSavedRoutes([]);
      setNotes([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const [savedResponse, notesResponse] = await Promise.all([
      supabase
        .from("saved_routes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("route_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
    ]);

    if (savedResponse.error || notesResponse.error) {
      setError(
        savedResponse.error?.message ??
          notesResponse.error?.message ??
          "Could not load your atlas."
      );
    } else {
      setSavedRoutes((savedResponse.data ?? []) as SavedRouteRecord[]);
      setNotes((notesResponse.data ?? []) as RouteNoteRecord[]);
    }

    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const savedMap = useMemo(() => {
    return new Map(
      savedRoutes.map((record) => [
        routeRecordKey(record.destination_slug, record.route_id),
        record.status
      ])
    );
  }, [savedRoutes]);

  const noteMap = useMemo(() => {
    return new Map(
      notes.map((record) => [
        routeRecordKey(record.destination_slug, record.route_id),
        record.note
      ])
    );
  }, [notes]);

  const value = useMemo<UserRoutesContextValue>(
    () => ({
      error,
      getNote(destinationSlug, routeId) {
        return noteMap.get(routeRecordKey(destinationSlug, routeId)) ?? "";
      },
      getSavedStatus(destinationSlug, routeId) {
        return savedMap.get(routeRecordKey(destinationSlug, routeId));
      },
      isLoading,
      notes,
      reload,
      async saveNote(destinationSlug, routeId, note) {
        if (!supabase || !user) {
          setError("Sign in before saving private notes.");
          return false;
        }

        setError(null);
        const trimmedNote = note.trim();
        const canonicalRouteId = resolveRouteId(destinationSlug, routeId);
        const storedRouteIds = getRouteIdsForStorage(destinationSlug, routeId);

        if (!trimmedNote) {
          const { error: deleteError } = await supabase
            .from("route_notes")
            .delete()
            .eq("user_id", user.id)
            .eq("destination_slug", destinationSlug)
            .in("route_id", storedRouteIds);

          if (deleteError) {
            setError(deleteError.message);
            return false;
          }
        } else {
          const aliasRouteIds = storedRouteIds.filter(
            (storedRouteId) => storedRouteId !== canonicalRouteId
          );

          if (aliasRouteIds.length > 0) {
            const { error: aliasDeleteError } = await supabase
              .from("route_notes")
              .delete()
              .eq("user_id", user.id)
              .eq("destination_slug", destinationSlug)
              .in("route_id", aliasRouteIds);

            if (aliasDeleteError) {
              setError(aliasDeleteError.message);
              return false;
            }
          }

          const { error: upsertError } = await supabase
            .from("route_notes")
            .upsert(
              {
                destination_slug: destinationSlug,
                note: trimmedNote,
                route_id: canonicalRouteId,
                user_id: user.id
              },
              { onConflict: "user_id,destination_slug,route_id" }
            );

          if (upsertError) {
            setError(upsertError.message);
            return false;
          }
        }

        await reload();
        return true;
      },
      async saveStatus(destinationSlug, routeId, status) {
        if (!supabase || !user) {
          setError("Sign in before saving routes.");
          return false;
        }

        setError(null);
        const canonicalRouteId = resolveRouteId(destinationSlug, routeId);
        const storedRouteIds = getRouteIdsForStorage(destinationSlug, routeId);

        if (!status) {
          const { error: deleteError } = await supabase
            .from("saved_routes")
            .delete()
            .eq("user_id", user.id)
            .eq("destination_slug", destinationSlug)
            .in("route_id", storedRouteIds);

          if (deleteError) {
            setError(deleteError.message);
            return false;
          }
        } else {
          const aliasRouteIds = storedRouteIds.filter(
            (storedRouteId) => storedRouteId !== canonicalRouteId
          );

          if (aliasRouteIds.length > 0) {
            const { error: aliasDeleteError } = await supabase
              .from("saved_routes")
              .delete()
              .eq("user_id", user.id)
              .eq("destination_slug", destinationSlug)
              .in("route_id", aliasRouteIds);

            if (aliasDeleteError) {
              setError(aliasDeleteError.message);
              return false;
            }
          }

          const { error: upsertError } = await supabase
            .from("saved_routes")
            .upsert(
              {
                destination_slug: destinationSlug,
                route_id: canonicalRouteId,
                status,
                user_id: user.id
              },
              { onConflict: "user_id,destination_slug,route_id" }
            );

          if (upsertError) {
            setError(upsertError.message);
            return false;
          }
        }

        await reload();
        return true;
      },
      savedRoutes
    }),
    [error, isLoading, noteMap, notes, reload, savedMap, savedRoutes, supabase, user]
  );

  return (
    <UserRoutesContext.Provider value={value}>
      {children}
    </UserRoutesContext.Provider>
  );
}

export function useUserRoutes() {
  const context = useContext(UserRoutesContext);

  if (!context) {
    throw new Error("useUserRoutes must be used inside UserRoutesProvider.");
  }

  return context;
}
