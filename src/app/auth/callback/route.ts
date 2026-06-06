import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * OAuth / email-link callback. Supabase redirects here with a `code` query
 * param after the user authenticates with the provider. We exchange it for a
 * session (which writes the auth cookies via the server client) and then send
 * the user on to their destination.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Something went wrong (no code, not configured, or exchange failed).
  return NextResponse.redirect(`${origin}/auth/login?error=auth`);
}
