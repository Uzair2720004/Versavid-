import crypto from "node:crypto";
import { createAdminSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/payment — receives Lemon Squeezy webhooks.
 *
 * The raw request body is verified against LEMONSQUEEZY_WEBHOOK_SECRET using an
 * HMAC-SHA256 signature (sent in the `X-Signature` header).
 *
 * Events handled:
 * - order_created: first-time purchase (one-time pack or new subscription).
 *   Grants credits additively.
 * - subscription_payment_success: fires on initial subscription payment AND
 *   every monthly renewal. Resets the user's monthly credit balance to the
 *   plan's full allowance (does NOT stack additively).
 *
 * The buyer is identified by the `user_id` we attach as checkout custom data.
 */

// Credits granted per Lemon Squeezy product id (subscription plans only).
// One-time credit packs have been removed from the product catalog.
const CREDITS_BY_PRODUCT: Record<string, number> = {
  [process.env.NEXT_PUBLIC_LS_CREATOR_PLAN_ID ?? ""]: 80,
  [process.env.NEXT_PUBLIC_LS_PRO_PLAN_ID ?? ""]: 100,
  [process.env.NEXT_PUBLIC_LS_AGENCY_PLAN_ID ?? ""]: 250,
};

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

function extractProductIdFromOrderCreated(attributes: Record<string, unknown>): string {
  const firstItem = (attributes.first_order_item ?? {}) as Record<string, unknown>;
  return String(firstItem.product_id ?? "");
}

function extractProductIdFromSubscriptionPayment(attributes: Record<string, unknown>): string {
  // subscription_payment_success payload has product_id directly on attributes
  // (not nested under first_order_item like order_created)
  return String(attributes.product_id ?? "");
}

function extractProductNameFromOrderCreated(attributes: Record<string, unknown>): string {
  const firstItem = (attributes.first_order_item ?? {}) as Record<string, unknown>;
  return (firstItem.product_name as string | undefined) ?? "";
}

function extractProductNameFromSubscriptionPayment(attributes: Record<string, unknown>): string {
  return (attributes.product_name as string | undefined) ?? "";
}

function extractPaymentIdFromOrderCreated(attributes: Record<string, unknown>, dataId: string | number | undefined): string | null {
  return (attributes.identifier as string | undefined) ??
    (dataId != null ? String(dataId) : null);
}

function extractPaymentIdFromSubscriptionPayment(attributes: Record<string, unknown>, dataId: string | number | undefined): string | null {
  // subscription_payment_success uses the order identifier (same pattern)
  return (attributes.identifier as string | undefined) ??
    (dataId != null ? String(dataId) : null);
}

async function findUserId(supabase: Awaited<ReturnType<typeof createAdminSupabase>> | null, customUserId: string | undefined, userEmail: string | undefined): Promise<string | undefined> {
  let userId = customUserId;
  if (!userId && supabase && userEmail) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", userEmail)
      .maybeSingle();
    userId = (prof?.id as string | undefined) ?? undefined;
  }
  return userId;
}

async function processOrderCreated(
  supabase: Awaited<ReturnType<typeof createAdminSupabase>> | null,
  attributes: Record<string, unknown>,
  dataId: string | number | undefined,
  customUserId: string | undefined,
  userEmail: string | undefined
): Promise<{ processed: boolean; credits: number }> {
  const productId = extractProductIdFromOrderCreated(attributes);
  const productName = extractProductNameFromOrderCreated(attributes) || productId;
  const credits = CREDITS_BY_PRODUCT[productId] ?? 0;
  const paymentId = extractPaymentIdFromOrderCreated(attributes, dataId);
  const amount = Number(attributes.total ?? 0) / 100;

  const userId = await findUserId(supabase, customUserId, userEmail);

  if (!userId || credits <= 0 || !paymentId) {
    return { processed: false, credits };
  }

  try {
    if (!supabase) return { processed: false, credits };
    const { data: existingTransaction, error: fetchError } = await supabase
      .from("transactions")
      .select("id")
      .eq("payment_id", paymentId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking for existing transaction:", fetchError);
      return { processed: false, credits };
    }

    if (existingTransaction) {
      console.log(`Duplicate order_created webhook for payment_id ${paymentId} received. Skipping.`);
      return { processed: true, credits };
    }

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

    return { processed: true, credits };
  } catch (error) {
    console.error("Error processing order_created webhook:", error);
    return { processed: false, credits };
  }
}

async function processSubscriptionPayment(
  supabase: Awaited<ReturnType<typeof createAdminSupabase>> | null,
  attributes: Record<string, unknown>,
  dataId: string | number | undefined,
  customUserId: string | undefined,
  userEmail: string | undefined
): Promise<{ processed: boolean; credits: number }> {
  const productId = extractProductIdFromSubscriptionPayment(attributes);
  const productName = extractProductNameFromSubscriptionPayment(attributes) || productId;
  const credits = CREDITS_BY_PRODUCT[productId] ?? 0;
  const paymentId = extractPaymentIdFromSubscriptionPayment(attributes, dataId);
  const amount = Number(attributes.total ?? 0) / 100;

  const userId = await findUserId(supabase, customUserId, userEmail);

  if (!userId || credits <= 0 || !paymentId) {
    return { processed: false, credits };
  }

  try {
    if (!supabase) return { processed: false, credits };
    const { data: existingTransaction, error: fetchError } = await supabase
      .from("transactions")
      .select("id")
      .eq("payment_id", paymentId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking for existing transaction:", fetchError);
      return { processed: false, credits };
    }

    if (existingTransaction) {
      console.log(`Duplicate subscription_payment_success webhook for payment_id ${paymentId} received. Skipping.`);
      return { processed: true, credits };
    }

    // For subscription renewals: RESET balance to plan's monthly allowance (not additive)
    await supabase
      .from("credits")
      .update({
        balance: credits,
        total_purchased: credits, // For subscriptions, total_purchased mirrors the current monthly allowance
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      amount,
      credits,
      type: "subscription",
      status: "completed",
      payment_id: paymentId,
      description: `Lemon Squeezy subscription renewal — ${productName}`,
    });

    return { processed: true, credits };
  } catch (error) {
    console.error("Error processing subscription_payment_success webhook:", error);
    return { processed: false, credits };
  }
}

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "webhook secret not configured" }, { status: 500 });
  }

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
  const attributes = (event.data?.attributes ?? {}) as Record<string, unknown>;
  const dataId = event.data?.id;
  const customUserId = event.meta?.custom_data?.user_id as string | undefined;
  const userEmail = attributes.user_email as string | undefined;

  const supabase = await createAdminSupabase();

  let processed = false;
  let credits = 0;

  if (eventName === "order_created") {
    const result = await processOrderCreated(supabase, attributes, dataId, customUserId, userEmail);
    processed = result.processed;
    credits = result.credits;
  } else if (eventName === "subscription_payment_success") {
    const result = await processSubscriptionPayment(supabase, attributes, dataId, customUserId, userEmail);
    processed = result.processed;
    credits = result.credits;
  }

  return Response.json({ received: true, processed });
}
