"use client";

import { createBrowserClient } from "@supabase/ssr";
import { hasRealKey } from "@/lib/utils";

/**
 * Browser Supabase client. Returns null when the project has not been
 * configured with real credentials yet (placeholder env values), so the app
 * can transparently fall back to the local demo data layer.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasRealKey(url) || !hasRealKey(key)) return null;
  return createBrowserClient(url!, key!);
}

export const isSupabaseConfigured = (): boolean =>
  hasRealKey(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  hasRealKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
