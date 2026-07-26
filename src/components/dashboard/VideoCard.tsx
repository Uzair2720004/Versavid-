"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge, Badge } from "@/components/ui/primitives";
import type { VideoRecord } from "@/lib/types";
import { formatDate, formatDuration, cn } from "@/lib/utils";

export function VideoCard({
  video,
  onOpen,
  onDownload,
  onRemake,
  onDelete,
  compact,
}: {
  video: VideoRecord;
  onOpen?: (v: VideoRecord) => void;
  onDownload?: (v: VideoRecord) => void;
  onRemake?: (v: VideoRecord) => void;
  onDelete?: (v: VideoRecord) => void;
  compact?: boolean;
}) {
  const vertical = video.format === "9:16";
  const showActions = !!(onDownload || onRemake || onDelete);

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-card border border-edge bg-panel transition-all duration-200 hover:border-edge-strong hover:bg-panel-2"
    >
      {/* thumbnail */}
      <button
        type="button"
        onClick={() => onOpen?.(video)}
        className={cn(
          "relative w-full overflow-hidden bg-canvas",
          vertical ? "aspect-[16/10]" : "aspect-video"
        )}
      >
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center gradient-bg-soft">
            <Icon name="film" size={28} className="text-muted" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent" />
        <span className="absolute left-2.5 top-2.5">
          <Badge tone="muted">{video.format}</Badge>
        </span>
        {video.status === "generating" ? (
          <span className="absolute bottom-2.5 right-2.5">
            <StatusBadge status={video.status} />
          </span>
        ) : (
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-canvas/80 px-1.5 py-0.5 text-[11px] font-medium text-ink backdrop-blur">
            {formatDuration(video.duration)}
          </span>
        )}
        {video.status === "ready" && (
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas/80 text-ink backdrop-blur">
              <Icon name="play" size={20} />
            </span>
          </span>
        )}
      </button>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <button type="button" onClick={() => onOpen?.(video)} className="text-left">
          <h3 className="line-clamp-2 text-sm font-semibold text-ink transition-colors group-hover:text-accent-soft">
            {video.title}
          </h3>
        </button>

        {!compact && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="capitalize">{video.settings.photoStyle}</span>
            <span className="text-edge-strong">•</span>
            <span>{video.credits_used} credits</span>
            <span className="text-edge-strong">•</span>
            <span>{formatDate(video.created_at)}</span>
          </div>
        )}

        {compact && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted">
            <StatusBadge status={video.status} />
            <span>{formatDate(video.created_at)}</span>
          </div>
        )}

        {showActions && (
          <div className="mt-4 flex items-center gap-2 border-t border-edge pt-3">
            <button
              onClick={() => onDownload?.(video)}
              disabled={video.status !== "ready"}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-panel-2 py-2 text-xs font-medium text-ink transition-colors hover:bg-edge disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="download" size={14} />
              Download
            </button>
            <button
              onClick={() => onRemake?.(video)}
              className="flex items-center justify-center rounded-lg bg-panel-2 p-2 text-muted transition-colors hover:bg-edge hover:text-ink"
              aria-label="Remake"
              title="Remake"
            >
              <Icon name="refresh" size={15} />
            </button>
            <button
              onClick={() => onDelete?.(video)}
              className="flex items-center justify-center rounded-lg bg-panel-2 p-2 text-muted transition-colors hover:bg-pink/15 hover:text-pink"
              aria-label="Delete"
              title="Delete"
            >
              <Icon name="trash" size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
