import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { hasRealKey } from "@/lib/utils";

/**
 * Server-side Supabase client for Route Handlers / Server Components.
 * In Next.js 16 `cookies()` is async, so this helper is async too.
 * Returns null when credentials are not configured.
 */
export async function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasRealKey(url) || !hasRealKey(key)) return null;

  const cookieStore = await cookies();

  return createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore; the proxy/session
          // refresh path will persist cookies instead.
        }
      },
    },
  });
}

/** Admin client using the service role key (server only). */
export async function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasRealKey(url) || !hasRealKey(serviceKey)) return null;

  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
