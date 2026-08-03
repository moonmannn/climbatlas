"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import {
  clearDnaAnswers,
  climbingDnaUpdatedEvent,
  getDnaStorageOwner,
  isValidCompletedDnaAnswers,
  loadDnaAnswers,
  saveDnaAnswers
} from "@/lib/climbingDnaStorage";
import { scoreDnaAnswers } from "@/lib/climbingDna";
import {
  getSupabaseBrowserClient,
  type ClimbingDnaProfileRecord,
  type SavedDestinationRecord
} from "@/lib/supabaseClient";
import type { DnaAnswerMap, DnaProfileResult } from "@/types/climbingDna";

type UserAtlasContextValue = {
  clearPrivateAtlas: () => Promise<boolean>;
  dnaAnswers: DnaAnswerMap | null;
  dnaProfile: DnaProfileResult | null;
  error: string | null;
  isDestinationSaved: (destinationSlug: string) => boolean;
  isLoading: boolean;
  lastDnaSyncAt: string | null;
  reload: () => Promise<void>;
  saveDestination: (destinationSlug: string, saved: boolean) => Promise<boolean>;
  savedDestinations: SavedDestinationRecord[];
};

const UserAtlasContext = createContext<UserAtlasContextValue | null>(null);

export function UserAtlasProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabaseAuth();
  const supabase = getSupabaseBrowserClient();
  const previousUserId = useRef<string | null>(null);
  const [savedDestinations, setSavedDestinations] = useState<SavedDestinationRecord[]>([]);
  const [dnaAnswers, setDnaAnswers] = useState<DnaAnswerMap | null>(null);
  const [lastDnaSyncAt, setLastDnaSyncAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDna = useCallback(async (
    answers: DnaAnswerMap,
    userId: string
  ) => {
    if (!supabase) return false;

    const { data, error: upsertError } = await supabase
      .from("climbing_dna_profiles")
      .upsert(
        {
          answers,
          schema_version: 2,
          user_id: userId
        },
        { onConflict: "user_id" }
      )
      .select("updated_at")
      .single();

    if (upsertError) {
      setError(upsertError.message);
      return false;
    }

    saveDnaAnswers(answers, { notify: false, ownerId: userId });
    setDnaAnswers(answers);
    setLastDnaSyncAt(data.updated_at ?? new Date().toISOString());
    return true;
  }, [supabase]);

  const reload = useCallback(async () => {
    if (!supabase || !user) {
      setSavedDestinations([]);
      setDnaAnswers(null);
      setLastDnaSyncAt(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const [destinationResponse, dnaResponse] = await Promise.all([
      supabase
        .from("saved_destinations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("climbing_dna_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
    ]);

    if (destinationResponse.error || dnaResponse.error) {
      setError(
        destinationResponse.error?.message ??
          dnaResponse.error?.message ??
          "Could not load your private atlas."
      );
      setIsLoading(false);
      return;
    }

    setSavedDestinations(
      (destinationResponse.data ?? []) as SavedDestinationRecord[]
    );

    const serverDna = dnaResponse.data as ClimbingDnaProfileRecord | null;
    if (serverDna && isValidCompletedDnaAnswers(serverDna.answers)) {
      saveDnaAnswers(serverDna.answers, {
        notify: false,
        ownerId: user.id
      });
      setDnaAnswers(serverDna.answers);
      setLastDnaSyncAt(serverDna.updated_at ?? null);
    } else {
      const localOwner = getDnaStorageOwner();
      const localAnswers = loadDnaAnswers();
      if (
        isValidCompletedDnaAnswers(localAnswers) &&
        (!localOwner || localOwner === user.id)
      ) {
        await uploadDna(localAnswers, user.id);
      } else {
        if (localOwner && localOwner !== user.id) {
          clearDnaAnswers();
        }
        setDnaAnswers(null);
        setLastDnaSyncAt(null);
      }
    }

    setIsLoading(false);
  }, [supabase, uploadDna, user]);

  useEffect(() => {
    const previous = previousUserId.current;
    if (previous && !user) {
      clearDnaAnswers();
    }
    previousUserId.current = user?.id ?? null;
    void reload();
  }, [reload, user]);

  useEffect(() => {
    function handleDnaUpdate(event: Event) {
      const answers = (event as CustomEvent<DnaAnswerMap>).detail;
      if (!user || !isValidCompletedDnaAnswers(answers)) return;
      void uploadDna(answers, user.id);
    }

    window.addEventListener(climbingDnaUpdatedEvent, handleDnaUpdate);
    return () => window.removeEventListener(climbingDnaUpdatedEvent, handleDnaUpdate);
  }, [uploadDna, user]);

  const savedDestinationSet = useMemo(
    () => new Set(savedDestinations.map((record) => record.destination_slug)),
    [savedDestinations]
  );
  const dnaProfile = useMemo(
    () => dnaAnswers ? scoreDnaAnswers(dnaAnswers) : null,
    [dnaAnswers]
  );

  const value = useMemo<UserAtlasContextValue>(() => ({
    async clearPrivateAtlas() {
      if (!supabase || !user) {
        setError("Sign in before clearing private data.");
        return false;
      }

      setError(null);
      const { error: clearError } = await supabase.rpc("clear_my_atlas_data");
      if (clearError) {
        setError(clearError.message);
        return false;
      }

      clearDnaAnswers();
      setSavedDestinations([]);
      setDnaAnswers(null);
      setLastDnaSyncAt(null);
      return true;
    },
    dnaAnswers,
    dnaProfile,
    error,
    isDestinationSaved(destinationSlug) {
      return savedDestinationSet.has(destinationSlug);
    },
    isLoading,
    lastDnaSyncAt,
    reload,
    async saveDestination(destinationSlug, saved) {
      if (!supabase || !user) {
        setError("Sign in before saving destinations.");
        return false;
      }

      setError(null);
      const response = saved
        ? await supabase.from("saved_destinations").upsert(
            { destination_slug: destinationSlug, user_id: user.id },
            { onConflict: "user_id,destination_slug" }
          )
        : await supabase
            .from("saved_destinations")
            .delete()
            .eq("user_id", user.id)
            .eq("destination_slug", destinationSlug);

      if (response.error) {
        setError(response.error.message);
        return false;
      }

      await reload();
      return true;
    },
    savedDestinations
  }), [
    dnaAnswers,
    dnaProfile,
    error,
    isLoading,
    lastDnaSyncAt,
    reload,
    savedDestinationSet,
    savedDestinations,
    supabase,
    user
  ]);

  return (
    <UserAtlasContext.Provider value={value}>
      {children}
    </UserAtlasContext.Provider>
  );
}

export function useUserAtlas() {
  const context = useContext(UserAtlasContext);
  if (!context) {
    throw new Error("useUserAtlas must be used inside UserAtlasProvider.");
  }
  return context;
}
