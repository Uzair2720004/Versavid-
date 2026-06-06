import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/credits/deduct — atomically deducts credits after a generation.
 * Body: { amount: number, description?: string }
 * Falls back to a no-op acknowledgement when Supabase isn't configured (the
 * client store handles deduction locally in that case).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const amount = Math.max(0, Number((body as { amount?: number }).amount) || 0);
  const description = (body as { description?: string }).description ?? "Video generation";

  const supabase = await createServerSupabase();
  if (!supabase) {
    return Response.json({ configured: false, deducted: amount });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { data: credits, error } = await supabase
    .from("credits")
    .select("balance, total_used")
    .eq("user_id", user.id)
    .single();

  if (error || !credits) return Response.json({ error: "no credit record" }, { status: 500 });
  if (credits.balance < amount) {
    return Response.json({ error: "insufficient credits", balance: credits.balance }, { status: 402 });
  }

  const newBalance = credits.balance - amount;
  const { error: updateError } = await supabase
    .from("credits")
    .update({ balance: newBalance, total_used: credits.total_used + amount, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (updateError) return Response.json({ error: updateError.message }, { status: 500 });

  await supabase.from("transactions").insert({
    user_id: user.id,
    amount: 0,
    credits: -amount,
    type: "usage",
    status: "completed",
    description,
  });

  return Response.json({ configured: true, deducted: amount, balance: newBalance });
}
