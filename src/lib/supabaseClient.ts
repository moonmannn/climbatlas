"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ClimbingType } from "@/types/destination";

export type SavedRouteStatus = "want-to-climb" | "climbed";

export type ExperienceLevel =
  | "newer"
  | "intermediate"
  | "experienced"
  | "project-focused";

export type UserProfileRecord = {
  id: string;
  email: string | null;
  display_name: string | null;
  home_base: string | null;
  experience_level: ExperienceLevel | null;
  preferred_styles: ClimbingType[];
  bio: string | null;
  created_at?: string;
  updated_at?: string;
};

export type SavedRouteRecord = {
  user_id: string;
  destination_slug: string;
  route_id: string;
  status: SavedRouteStatus;
  created_at?: string;
  updated_at?: string;
};

export type RouteNoteRecord = {
  user_id: string;
  destination_slug: string;
  route_id: string;
  note: string;
  created_at?: string;
  updated_at?: string;
};

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
  }

  return browserClient;
}
