"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { VideoCard } from "@/components/dashboard/VideoCard";
import { Card, ProgressBar } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { formatDuration } from "@/lib/utils";

const QUICK_ACTIONS: { href: string; label: string; desc: string; icon: IconName }[] = [
  { href: "/create", label: "New video", desc: "Start the creation wizard", icon: "plus" },
  { href: "/videos", label: "My videos", desc: "Browse & download", icon: "video" },
  { href: "/credits", label: "Buy credits", desc: "Top up your balance", icon: "coins" },
  { href: "/settings", label: "Defaults", desc: "Set your brand presets", icon: "settings" },
];

export default function DashboardPage() {
  const { profile, credits, videos } = useApp();
  const router = useRouter();

  const firstName = profile?.full_name?.split(" ")[0] || "Creator";
  const ready = videos.filter((v) => v.status === "ready");
  const shorts = videos.filter((v) => v.format === "9:16");
  const totalSeconds = ready.reduce((acc, v) => acc + v.duration, 0);
  // assume ~45 min of manual editing saved per finished video
  const timeSavedHrs = Math.round((ready.length * 45) / 60 * 10) / 10;

  const allowance = credits?.monthly_allowance || 120;
  const usedPct = credits ? Math.min(100, (credits.total_used / allowance) * 100) : 0;
  const recent = videos.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <PageHeader
        title={
          <>
            Welcome back, <span className="gradient-text">{firstName}</span>
          </>
        }
        subtitle="Here's what's happening in your studio today."
        action={
          <ButtonLink href="/create">
            <Icon name="plus" size={18} />
            Create video
          </ButtonLink>
        }
      />

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="video" label="Videos created" value={videos.length} sub={`${ready.length} ready to publish`} tone="accent" />
        <StatCard icon="coins" label="Credits used" value={credits?.total_used ?? 0} sub={`${credits?.balance ?? 0} remaining`} tone="pink" />
        <StatCard icon="aspect" label="Shorts made" value={shorts.length} sub={`${formatDuration(totalSeconds)} total runtime`} tone="success" />
        <StatCard icon="clock" label="Time saved" value={`${timeSavedHrs}h`} sub="vs. manual editing" tone="warning" />
      </div>

      {/* Credits usage */}
      <Card className="mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-ink">Monthly credit usage</h2>
            <p className="mt-1 text-sm text-muted">
              {credits?.total_used ?? 0} of {allowance} credits used · resets in 12 days
            </p>
          </div>
          <ButtonLink href="/credits" variant="secondary" size="sm">
            Manage plan
          </ButtonLink>
        </div>
        <ProgressBar value={usedPct} className="mt-4" height={10} />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{credits?.balance ?? 0} credits available</span>
          <span>{Math.round(usedPct)}%</span>
        </div>
      </Card>

      {/* Recent videos */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Recent videos</h2>
          <Link href="/videos" className="text-sm text-accent-soft hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recent.map((v) => (
            <VideoCard key={v.id} video={v} compact onOpen={() => router.push("/videos")} />
          ))}
          {/* Create new card */}
          <Link
            href="/create"
            className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-card border border-dashed border-edge-strong bg-panel/40 p-6 text-center transition-all duration-200 hover:border-accent/60 hover:bg-panel-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg text-white transition-transform group-hover:scale-110">
              <Icon name="plus" size={22} />
            </span>
            <span className="text-sm font-medium text-ink">Create a new video</span>
            <span className="text-xs text-muted">Idea → published in minutes</span>
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-ink">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} href={a.href}>
              <Card hover className="flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl gradient-bg-soft text-accent-soft">
                  <Icon name={a.icon} size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{a.label}</p>
                  <p className="text-xs text-muted">{a.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
