"use client";

import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { formatDuration } from "@/lib/utils";

const WEEK = [
  { day: "Mon", value: 2 },
  { day: "Tue", value: 1 },
  { day: "Wed", value: 4 },
  { day: "Thu", value: 3 },
  { day: "Fri", value: 5 },
  { day: "Sat", value: 2 },
  { day: "Sun", value: 3 },
];

export default function AnalyticsPage() {
  const { videos, credits } = useApp();
  const ready = videos.filter((v) => v.status === "ready");
  const totalRuntime = ready.reduce((a, v) => a + v.duration, 0);
  const max = Math.max(...WEEK.map((w) => w.value), 1);

  const byStyle = videos.reduce<Record<string, number>>((acc, v) => {
    acc[v.settings.photoStyle] = (acc[v.settings.photoStyle] ?? 0) + 1;
    return acc;
  }, {});
  const styleEntries = Object.entries(byStyle).sort((a, b) => b[1] - a[1]);
  const styleTotal = styleEntries.reduce((a, [, n]) => a + n, 0) || 1;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <PageHeader title="Analytics" subtitle="Your production at a glance." />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="video" label="Total videos" value={videos.length} tone="accent" />
        <StatCard icon="check" label="Published" value={ready.length} tone="success" />
        <StatCard icon="clock" label="Total runtime" value={formatDuration(totalRuntime)} tone="warning" />
        <StatCard icon="coins" label="Credits used" value={credits?.total_used ?? 0} tone="pink" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Videos created this week</h2>
            <Icon name="chart" size={18} className="text-muted" />
          </div>
          <div className="mt-6 flex h-48 items-end justify-between gap-3">
            {WEEK.map((w) => (
              <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg gradient-bg transition-all"
                    style={{ height: `${(w.value / max) * 100}%` }}
                    title={`${w.value} videos`}
                  />
                </div>
                <span className="text-xs text-muted">{w.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-ink">Top styles</h2>
          <div className="mt-5 space-y-4">
            {styleEntries.length === 0 && <p className="text-sm text-muted">No data yet.</p>}
            {styleEntries.map(([style, count]) => (
              <div key={style}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="capitalize text-ink">{style}</span>
                  <span className="text-muted">{count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-edge">
                  <div className="h-full rounded-full gradient-bg" style={{ width: `${(count / styleTotal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
