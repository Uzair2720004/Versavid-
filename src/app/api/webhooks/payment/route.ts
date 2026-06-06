import crypto from "node:crypto";
import { createAdminSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/payment — receives Lemon Squeezy webhooks.
 *
 * The raw request body is verified against LEMONSQUEEZY_WEBHOOK_SECRET using an
 * HMAC-SHA256 signature (sent in the `X-Signature` header). On an
 * `order_created` event we map the purchased product to a credit amount and top
 * up the buyer's Supabase `credits` row. The buyer is identified by the
 * `user_id` we attach as checkout custom data on the credits page.
 */

// Credits granted per Lemon Squeezy product id (one-time packs + plan first orders).
const CREDITS_BY_PRODUCT: Record<string, number> = {
  [process.env.NEXT_PUBLIC_LS_STARTER_ID ?? ""]: 30,
  [process.env.NEXT_PUBLIC_LS_CREATOR_ID ?? ""]: 100,
  [process.env.NEXT_PUBLIC_LS_PRO_ID ?? ""]: 280,
  [process.env.NEXT_PUBLIC_LS_STUDIO_ID ?? ""]: 700,
  [process.env.NEXT_PUBLIC_LS_CREATOR_PLAN_ID ?? ""]: 120,
  [process.env.NEXT_PUBLIC_LS_PRO_PLAN_ID ?? ""]: 300,
  [process.env.NEXT_PUBLIC_LS_AGENCY_PLAN_ID ?? ""]: 900,
};

/** Constant-time check of the Lemon Squeezy HMAC-SHA256 signature. */
function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

interface LemonSqueezyEvent {
  meta?: { event_name?: string; custom_data?: Record<string, unknown> };
  data?: { id?: string | number; attributes?: Record<string, unknown> };
}

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "webhook secret not configured" }, { status: 500 });
  }

  // Read the raw body BEFORE parsing — the signature is computed over these bytes.
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");
  if (!verifySignature(rawBody, signature, secret)) {
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: LemonSqueezyEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "invalid payload" }, { status: 400 });
  }

  const eventName = event.meta?.event_name ?? request.headers.get("x-event-name") ?? "unknown";

  // Credits are granted only when a new order is placed.
  if (eventName !== "order_created") {
    return Response.json({ received: true, processed: false });
  }

  const attributes = (event.data?.attributes ?? {}) as Record<string, unknown>;
  const firstItem = (attributes.first_order_item ?? {}) as Record<string, unknown>;
  const productId = String(firstItem.product_id ?? "");
  const productName = (firstItem.product_name as string | undefined) ?? productId;
  const credits = CREDITS_BY_PRODUCT[productId] ?? 0;

  const customUserId = event.meta?.custom_data?.user_id as string | undefined;
  const userEmail = attributes.user_email as string | undefined;
  const amount = Number(attributes.total ?? 0) / 100; // Lemon Squeezy totals are in cents.
  const paymentId =
    (attributes.identifier as string | undefined) ??
    (event.data?.id != null ? String(event.data.id) : null);

  const supabase = await createAdminSupabase();

  // Prefer the user id attached as checkout custom data; otherwise fall back to
  // matching the order's email against a known profile.
  let userId = customUserId;
  if (!userId && supabase && userEmail) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", userEmail)
      .maybeSingle();
    userId = (prof?.id as string | undefined) ?? undefined;
  }

  if (supabase && userId && credits > 0) {
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
        type: "purchase",
        status: "completed",
        payment_id: paymentId,
        description: `Lemon Squeezy order — ${productName}`,
      });
    } catch {
      return Response.json({ received: true, processed: false });
    }
  }

  return Response.json({ received: true, processed: credits > 0 && !!userId });
}
