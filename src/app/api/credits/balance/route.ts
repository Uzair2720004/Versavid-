import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET /api/credits/balance — returns the signed-in user's credit balance.
 * When Supabase isn't configured, the client uses its local store instead and
 * this route reports that fallback so callers can branch.
 */
export async function GET() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return Response.json({ configured: false, source: "local" });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("credits")
    .select("balance, total_purchased, total_used, monthly_allowance")
    .eq("user_id", user.id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ configured: true, ...data });
}
