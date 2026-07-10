"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured
} from "@/lib/supabaseClient";

type SupabaseContextValue = {
  isConfigured: boolean;
  isLoading: boolean;
  message: string | null;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
};

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const isConfigured = isSupabaseConfigured();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo<SupabaseContextValue>(
    () => ({
      isConfigured,
      isLoading,
      message,
      async signInWithEmail(email: string) {
        if (!supabase) {
          setMessage("Supabase is not configured yet.");
          return;
        }

        setMessage(null);
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.href
          }
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage("Check your email for the sign-in link.");
      },
      async signOut() {
        if (!supabase) {
          return;
        }

        await supabase.auth.signOut();
        setMessage(null);
      },
      user
    }),
    [isConfigured, isLoading, message, supabase, user]
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("useSupabaseAuth must be used inside SupabaseProvider.");
  }

  return context;
}
