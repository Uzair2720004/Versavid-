import { createAdminSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/payment — receives payment provider webhooks (Stripe-style)
 * and credits the user's account on a successful purchase.
 *
 * In production: verify the signature header against your webhook secret before
 * trusting the payload. With placeholder keys this records the event shape and
 * acknowledges receipt.
 */
export async function POST(request: Request) {
  let event: Record<string, unknown> = {};
  try {
    event = await request.json();
  } catch {
    return Response.json({ error: "invalid payload" }, { status: 400 });
  }

  const type = (event.type as string) ?? "unknown";
  const data = (event.data as Record<string, unknown>) ?? {};
  const userId = data.user_id as string | undefined;
  const credits = Number(data.credits) || 0;
  const amount = Number(data.amount) || 0;
  const paymentId = (data.payment_id as string) ?? null;

  const handled = ["checkout.completed", "payment.succeeded", "invoice.paid"].includes(type);

  const supabase = await createAdminSupabase();
  if (handled && supabase && userId && credits > 0) {
    try {
      const { data: row } = await supabase
        .from("credits")
        .select("balance, total_purchased")
        .eq("user_id", userId)
        .single();
      if (row) {
        await supabase
          .from("credits")
          .update({
            balance: row.balance + credits,
            total_purchased: row.total_purchased + credits,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
      await supabase.from("transactions").insert({
        user_id: userId,
        amount,
        credits,
        type: type === "invoice.paid" ? "subscription" : "purchase",
        status: "completed",
        payment_id: paymentId,
        description: `Webhook: ${type}`,
      });
    } catch {
      return Response.json({ received: true, processed: false });
    }
  }

  return Response.json({ received: true, processed: handled });
}
