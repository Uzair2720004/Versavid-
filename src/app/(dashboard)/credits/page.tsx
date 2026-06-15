"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, ProgressBar, Badge } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CREDIT_PACKS, PLANS, LENGTHS } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

const TXN_ICON: Record<Transaction["type"], string> = {
  purchase: "coins",
  subscription: "card",
  usage: "film",
  refund: "refresh",
  bonus: "gift",
};

// Lemon Squeezy product IDs for one-time credit packs (keyed by CREDIT_PACKS id).
const PACK_PRODUCT_ID: Record<string, string | undefined> = {
  starter: process.env.NEXT_PUBLIC_LS_STARTER_ID,
  creator: process.env.NEXT_PUBLIC_LS_CREATOR_ID,
  pro: process.env.NEXT_PUBLIC_LS_PRO_ID,
  studio: process.env.NEXT_PUBLIC_LS_STUDIO_ID,
};

// Lemon Squeezy product IDs for subscription plans (keyed by PLANS id).
const PLAN_PRODUCT_ID: Record<string, string | undefined> = {
  creator: process.env.NEXT_PUBLIC_LS_CREATOR_PLAN_ID,
  pro: process.env.NEXT_PUBLIC_LS_PRO_PLAN_ID,
  agency: process.env.NEXT_PUBLIC_LS_AGENCY_PLAN_ID,
};

/**
 * Build a Lemon Squeezy hosted-checkout URL for a product. The buyer's Supabase
 * user id is attached as custom data so the payment webhook can credit the right
 * account. Returns null when no product id is configured.
 */
function checkoutUrl(productId: string | undefined, userId?: string): string | null {
  if (!productId) return null;
  const url = `https://versavid.lemonsqueezy.com/checkout/buy/${productId}`;
  return userId ? `${url}?checkout[custom][user_id]=${encodeURIComponent(userId)}` : url;
}

export default function CreditsPage() {
  const { credits, transactions, profile } = useApp();
  const userId = profile?.id;
  const [activePlan] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [renewsOn] = useState(() => formatDate(new Date(Date.now() + 12 * 864e5).toISOString()));

  const balance = credits?.balance ?? 0;
  const allowance = credits?.monthly_allowance ?? 0;
  const usedPct = Math.min(100, ((credits?.total_used ?? 0) / allowance) * 100);

  const shortCost = LENGTHS[0].credits;
  const longCost = LENGTHS[2].credits;

  function copyReferral() {
    navigator.clipboard?.writeText("https://versavid.app/r/alex-rivera").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <PageHeader title="Credits & billing" subtitle="Top up, manage your plan, and track usage." />

      {/* Balance + plan */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="relative overflow-hidden p-6">
          <div className="absolute inset-0 -z-10 gradient-bg-soft" />
          <p className="text-sm text-muted">Current balance</p>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-5xl font-bold text-ink">{balance}</span>
            <span className="mb-2 text-sm text-muted">credits</span>
          </div>
          <ProgressBar value={usedPct} className="mt-4" height={10} />
          <p className="mt-2 text-xs text-muted">
            {allowance > 0 ? `${credits?.total_used ?? 0} of ${allowance} monthly credits used` : "One-time credits — never expire"}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-edge bg-canvas/70 px-4 py-3">
              <p className="text-xs text-muted">â‰ˆ Shorts you can make</p>
              <p className="mt-0.5 text-lg font-bold text-ink">{Math.floor(balance / shortCost)}</p>
            </div>
            <div className="rounded-xl border border-edge bg-canvas/70 px-4 py-3">
              <p className="text-xs text-muted">â‰ˆ Long videos</p>
              <p className="mt-0.5 text-lg font-bold text-ink">{Math.floor(balance / longCost)}</p>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Current plan</p>
            <Badge tone="success">Active</Badge>
          </div>
          <h3 className="mt-1 text-2xl font-bold text-ink">Creator</h3>
          <p className="mt-1 text-sm text-muted">$19/mo Â· 120 credits / month</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Icon name="check" size={15} className="text-success" /> 1080p exports, no watermark
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" size={15} className="text-success" /> All 8 AI voices
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" size={15} className="text-success" /> Priority render queue
            </li>
          </ul>
          {allowance > 0 && <p className="mt-4 text-xs text-muted">Renews on {renewsOn}</p>}
        </Card>
      </div>

      {/* Buy credits */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Buy credits</h2>
        <p className="mt-1 text-sm text-muted">One-time top-ups â€” never expire.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKS.map((pack) => {
            const href = checkoutUrl(PACK_PRODUCT_ID[pack.id], userId);
            return (
              <Card key={pack.id} className={cn("relative flex flex-col p-5", pack.popular && "border-accent/60 glow")}>
                {pack.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full gradient-bg px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Best value
                  </span>
                )}
                <h3 className="text-sm font-semibold text-ink">{pack.name}</h3>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-bold text-ink">${pack.price}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-accent-soft">{pack.credits} credits</p>
                <p className="mt-1 text-xs text-muted">{pack.perks}</p>
                {href ? (
                  <ButtonLink
                    href={href}
                    target="_blank"
                    fullWidth
                    variant={pack.popular ? "primary" : "secondary"}
                    className="mt-4"
                  >
                    Buy now
                  </ButtonLink>
                ) : (
                  <Button fullWidth variant={pack.popular ? "primary" : "secondary"} className="mt-4" disabled>
                    Buy now
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Subscription comparison */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Subscription plans</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === activePlan;
            const href = checkoutUrl(PLAN_PRODUCT_ID[plan.id], userId);
            return (
              <Card key={plan.id} className={cn("flex flex-col p-5", isCurrent && "border-accent/60")}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-ink">{plan.name}</h3>
                  {isCurrent && <Badge tone="accent">Current</Badge>}
                </div>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-2xl font-bold text-ink">${plan.price}</span>
                  <span className="mb-1 text-xs text-muted">{plan.period}</span>
                </div>
                <p className="mt-1 text-xs text-accent-soft">{plan.credits}</p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {plan.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted">
                      <Icon name="check" size={13} className="mt-0.5 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="secondary" fullWidth className="mt-4" disabled>
                    Current plan
                  </Button>
                ) : href ? (
                  <ButtonLink href={href} target="_blank" variant="outline" fullWidth className="mt-4">
                    Upgrade
                  </ButtonLink>
                ) : (
                  <Button variant="outline" fullWidth className="mt-4" disabled>
                    Downgrade
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Payment method + Referral */}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ink">Payment method</h2>
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-edge bg-canvas p-4">
            <span className="flex h-10 w-14 items-center justify-center rounded-lg gradient-bg text-white">
              <Icon name="card" size={20} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">Visa â€¢â€¢â€¢â€¢ 4242</p>
              <p className="text-xs text-muted">Expires 08/27</p>
            </div>
            <Button variant="ghost" size="sm">
              Update
            </Button>
          </div>
          <Button variant="secondary" className="mt-4" size="sm">
            <Icon name="plus" size={15} />
            Add payment method
          </Button>
        </Card>

        <Card className="relative overflow-hidden p-6">
          <div className="absolute inset-0 -z-10 gradient-bg-soft opacity-60" />
          <div className="flex items-center gap-2">
            <Icon name="gift" size={18} className="text-accent-soft" />
            <h2 className="text-lg font-semibold text-ink">Refer & earn</h2>
          </div>
          <p className="mt-2 text-sm text-muted">
            Give friends <span className="font-medium text-ink">25 credits</span>, get{" "}
            <span className="font-medium text-ink">25 credits</span> when they create their first video.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-edge bg-canvas p-2 pl-4">
            <span className="flex-1 truncate text-sm text-muted">versavid.app/r/alex-rivera</span>
            <Button size="sm" onClick={copyReferral}>
              {copied ? <Icon name="check" size={15} /> : <Icon name="link" size={15} />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted">3 friends referred Â· 75 credits earned</p>
        </Card>
      </div>

      {/* Transaction history */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Transaction history</h2>
        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Credits</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-edge/60 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-panel-2 text-muted">
                          <Icon name={TXN_ICON[t.type]} size={15} />
                        </span>
                        <span className="text-ink">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize text-muted">{t.type}</td>
                    <td className={cn("px-5 py-3 font-medium", t.credits >= 0 ? "text-success" : "text-pink")}>
                      {t.credits >= 0 ? "+" : ""}
                      {t.credits}
                    </td>
                    <td className="px-5 py-3 text-muted">{t.amount > 0 ? `$${t.amount.toFixed(2)}` : "â€”"}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(t.created_at)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={t.status === "completed" ? "success" : t.status === "pending" ? "warning" : "pink"}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-muted">
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}


