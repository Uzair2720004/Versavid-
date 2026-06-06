"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { VideoCard } from "@/components/dashboard/VideoCard";
import { Modal } from "@/components/ui/Modal";
import { Input, StatusBadge, Badge } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { VideoRecord } from "@/lib/types";
import { cn, formatDate, formatDuration } from "@/lib/utils";

type Filter = "all" | "shorts" | "standard" | "ready" | "generating";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "shorts", label: "Shorts" },
  { value: "standard", label: "Standard" },
  { value: "ready", label: "Ready" },
  { value: "generating", label: "Generating" },
];

export default function VideosPage() {
  const router = useRouter();
  const { videos, deleteVideo } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<VideoRecord | null>(null);

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      if (query && !v.title.toLowerCase().includes(query.toLowerCase())) return false;
      switch (filter) {
        case "shorts":
          return v.format === "9:16";
        case "standard":
          return v.format === "16:9";
        case "ready":
          return v.status === "ready";
        case "generating":
          return v.status === "generating" || v.status === "queued";
        default:
          return true;
      }
    });
  }, [videos, filter, query]);

  const ready = videos.filter((v) => v.status === "ready").length;
  const shorts = videos.filter((v) => v.format === "9:16").length;
  const creditsUsed = videos.reduce((a, v) => a + v.credits_used, 0);

  function handleDownload(v: VideoRecord) {
    if (v.video_url) window.open(v.video_url, "_blank");
  }
  function handleRemake() {
    router.push("/create");
  }
  function handleDelete(v: VideoRecord) {
    deleteVideo(v.id);
    if (selected?.id === v.id) setSelected(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <PageHeader
        title="My Videos"
        subtitle="Browse, download, remake or remove your generated videos."
        action={
          <ButtonLink href="/create">
            <Icon name="plus" size={18} />
            Create video
          </ButtonLink>
        }
      />

      {/* Stats bar */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total videos", value: videos.length },
          { label: "Ready", value: ready },
          { label: "Shorts", value: shorts },
          { label: "Credits used", value: creditsUsed },
        ].map((s) => (
          <div key={s.label} className="rounded-card border border-edge bg-panel px-4 py-3">
            <p className="text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
                filter === f.value
                  ? "border-accent/60 bg-accent/10 text-ink"
                  : "border-edge bg-canvas text-muted hover:text-ink"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid / empty state */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              onOpen={setSelected}
              onDownload={handleDownload}
              onRemake={handleRemake}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center rounded-card border border-dashed border-edge-strong bg-panel/40 px-6 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg-soft text-accent-soft">
            <Icon name="film" size={30} />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-ink">
            {videos.length === 0 ? "No videos yet" : "No videos match your filters"}
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            {videos.length === 0
              ? "Create your first AI video and it'll show up here, ready to download."
              : "Try a different filter or clear your search."}
          </p>
          <ButtonLink href="/create" className="mt-6">
            <Icon name="plus" size={18} />
            Create your first video
          </ButtonLink>
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} className="max-w-2xl">
        {selected && (
          <div className="p-5">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-canvas">
              {selected.thumbnail_url ? (
                <Image src={selected.thumbnail_url} alt={selected.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center gradient-bg-soft" />
              )}
              {selected.status === "ready" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas/80 text-ink backdrop-blur">
                    <Icon name="play" size={22} />
                  </span>
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.status} />
              <Badge tone="muted">{selected.format}</Badge>
              <Badge tone="accent" className="capitalize">
                {selected.settings.photoStyle}
              </Badge>
              <Badge tone="muted">{formatDuration(selected.duration)}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <Meta label="Credits" value={String(selected.credits_used)} />
              <Meta label="Voice" value={selected.settings.voice} />
              <Meta label="Language" value={selected.settings.language.toUpperCase()} />
              <Meta label="Created" value={formatDate(selected.created_at)} />
            </div>

            {selected.script && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Script</p>
                <div className="max-h-32 overflow-y-auto whitespace-pre-line rounded-xl border border-edge bg-canvas p-3 text-sm text-muted">
                  {selected.script}
                </div>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <Button fullWidth onClick={() => handleDownload(selected)} disabled={selected.status !== "ready"}>
                <Icon name="download" size={16} />
                Download
              </Button>
              <Button variant="secondary" onClick={handleRemake}>
                <Icon name="refresh" size={16} />
                Remake
              </Button>
              <Button variant="danger" onClick={() => handleDelete(selected)}>
                <Icon name="trash" size={16} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-edge bg-canvas px-3 py-2.5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 font-medium capitalize text-ink">{value}</p>
    </div>
  );
}
