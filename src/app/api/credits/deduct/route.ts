import { createAdminSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/credits/deduct — atomically checks balance and deducts credits
 * server-side using the service-role key. Prevents client-side balance
 * tampering and race conditions from concurrent deduction calls.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { userId, amount, description } = body as {
    userId?: string;
    amount?: number;
    description?: string;
  };

  if (!userId || typeof amount !== "number" || amount <= 0) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createAdminSupabase();
  if (!supabase) {
    // No Supabase configured (local demo mode) — nothing to do server-side.
    return Response.json({ ok: true, mode: "local" });
  }

  const { data: current, error: readError } = await supabase
    .from("credits")
    .select("balance, total_used")
    .eq("user_id", userId)
    .maybeSingle();

  if (readError || !current) {
    return Response.json({ error: "Could not read balance" }, { status: 500 });
  }

  if (current.balance < amount) {
    return Response.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const newBalance = current.balance - amount;
  const newTotalUsed = current.total_used + amount;

  // Optimistic lock: only succeed if balance still matches what we just read,
  // so a concurrent deduction can't be silently overwritten.
  const { data: updated, error: updateError } = await supabase
    .from("credits")
    .update({
      balance: newBalance,
      total_used: newTotalUsed,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("balance", current.balance)
    .select()
    .maybeSingle();

  if (updateError || !updated) {
    return Response.json({ error: "Balance changed concurrently, please retry" }, { status: 409 });
  }

  const { error: txnError } = await supabase.from("transactions").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    amount: 0,
    credits: -amount,
    type: "usage",
    status: "completed",
    payment_id: null,
    description: description ?? "Video render",
    created_at: new Date().toISOString(),
  });

  if (txnError) {
    console.error("credits/deduct: transaction log failed:", txnError.message);
    // Balance already deducted successfully; don't fail the request over a log entry.
  }

  return Response.json({ ok: true, balance: newBalance, total_used: newTotalUsed });
}
