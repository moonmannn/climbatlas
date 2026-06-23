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
import {
  getSupabaseBrowserClient,
  type UserProfileRecord
} from "@/lib/supabaseClient";
import type { ClimbingType } from "@/types/destination";

type ProfileInput = {
  bio: string;
  display_name: string;
  experience_level: UserProfileRecord["experience_level"];
  home_base: string;
  preferred_styles: ClimbingType[];
};

type UserProfileContextValue = {
  error: string | null;
  isLoading: boolean;
  profile: UserProfileRecord | null;
  reloadProfile: () => Promise<void>;
  saveProfile: (input: ProfileInput) => Promise<boolean>;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

function normalizeProfile(data: UserProfileRecord): UserProfileRecord {
  return {
    ...data,
    preferred_styles: data.preferred_styles ?? []
  };
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabaseAuth();
  const supabase = getSupabaseBrowserClient();
  const [profile, setProfile] = useState<UserProfileRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reloadProfile = useCallback(async () => {
    if (!supabase || !user) {
      setProfile(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: selectError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (selectError) {
      setError(selectError.message);
      setIsLoading(false);
      return;
    }

    if (data) {
      setProfile(normalizeProfile(data as UserProfileRecord));
      setIsLoading(false);
      return;
    }

    const { data: createdProfile, error: upsertError } = await supabase
      .from("profiles")
      .upsert(
        {
          email: user.email ?? null,
          id: user.id,
          preferred_styles: []
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setProfile(normalizeProfile(createdProfile as UserProfileRecord));
    }

    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    void reloadProfile();
  }, [reloadProfile]);

  const value = useMemo<UserProfileContextValue>(
    () => ({
      error,
      isLoading,
      profile,
      reloadProfile,
      async saveProfile(input) {
        if (!supabase || !user) {
          setError("Sign in before saving your profile.");
          return false;
        }

        setError(null);

        const { data, error: upsertError } = await supabase
          .from("profiles")
          .upsert(
            {
              bio: input.bio.trim() || null,
              display_name: input.display_name.trim() || null,
              email: user.email ?? null,
              experience_level: input.experience_level,
              home_base: input.home_base.trim() || null,
              id: user.id,
              preferred_styles: input.preferred_styles
            },
            { onConflict: "id" }
          )
          .select("*")
          .single();

        if (upsertError) {
          setError(upsertError.message);
          return false;
        }

        setProfile(normalizeProfile(data as UserProfileRecord));
        return true;
      }
    }),
    [error, isLoading, profile, reloadProfile, supabase, user]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error("useUserProfile must be used inside UserProfileProvider.");
  }

  return context;
}
