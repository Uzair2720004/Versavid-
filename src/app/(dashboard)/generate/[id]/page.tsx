"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useApp } from "@/lib/store";
import { Card, ProgressBar, StatusBadge } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GEN_STEPS } from "@/lib/constants";
import type { GenStep, LogEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

function parseScenes(text: string): string[] {
  const regex = /\[(HOOK|SCENE\s*\d+|CTA)\]/gi;
  const matches = [...text.matchAll(regex)];
  const scenes: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index! + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    const chunk = text.slice(start, end).trim();
    if (chunk) scenes.push(chunk.slice(0, 300));
  }
  return scenes;
}

function now(): string {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour12: false });
}

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function GeneratePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { videos, updateVideo, deductCredits, credits: creditsState, profile, updateProfile } = useApp();
  const video = videos.find((v) => v.id === params?.id);
  const alreadyReady = video?.status === "ready";

  const [steps, setSteps] = useState<GenStep[]>(() =>
    GEN_STEPS.map((s) => ({ ...s, status: alreadyReady ? "done" : "waiting" }))
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(alreadyReady ? 100 : 0);
  const [finished, setFinished] = useState(alreadyReady);
  const started = useRef(false);

  const log = (message: string, level: LogEntry["level"] = "info") =>
    setLogs((l) => [...l, { time: now(), message, level }]);

  const mark = (key: string, status: GenStep["status"]) =>
    setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, status } : s)));

  useEffect(() => {
    if (!video || alreadyReady) return;
    if (started.current) return;
    started.current = true;

    let cancelled = false;
    const total = GEN_STEPS.length;
    let completed = 0;
    const bump = () => {
      completed += 1;
      setProgress(Math.round((completed / total) * 100));
    };

    async function run() {
      const s = video!.settings;
      if ((creditsState?.balance ?? 0) < video!.credits_used) {
        log("Insufficient credits to start this generation.", "warn");
        updateVideo(video!.id, { status: "failed" });
        return;
      }

      updateVideo(video!.id, { status: "generating" });
      log("Generation started. You can safely navigate away — we'll keep working.", "info");

      try {
        // 1. Script
        mark("script", "running");
        log("Writing the script with Claude…");
const scriptRes = await postJSON("/api/generate/script", {
          videoId: video!.id,
          topic: s.topic,
          tone: s.tone,
          length: s.length,
          format: s.format,
          photoStyle: s.photoStyle,
          scriptMode: s.scriptMode,
          customScript: video!.script ?? "",
          language: s.language,
        });
        if (cancelled) return;
        const script: string = scriptRes.script ?? "";
        updateVideo(video!.id, { script });
        mark("script", "done");
        log(`Script ready (${scriptRes.source}).`, "success");
        bump();

// 2. Images — the script step already kicked these off with fal.ai;
        // reuse them, only falling back to a direct call if none came back.
        mark("images", "running");
        log("Generating scene images with Flux…");
        let images: string[] = scriptRes.images ?? [];
        if (!images.length) {
          const imgRes = await postJSON("/api/generate/images", {
            topic: s.topic,
            style: s.photoStyle,
            format: s.format,
            count: s.length === "long" ? 8 : s.length === "medium" ? 5 : 3,
          });
          if (cancelled) return;
          images = imgRes.images ?? [];
        }
        if (images[0]) updateVideo(video!.id, { thumbnail_url: images[0] });
        mark("images", "done");
        log(`${images.length} images generated.`, "success");
        bump();

        // 3. Footage/Video — behavior depends on generationMode
        mark("videos", "running");
        let clipRes: { clips?: { url: string; poster?: string; duration?: number }[]; source?: string } = { clips: [] };
        let footage: { url: string; poster?: string; duration?: number }[] = [];

        const mode = s.generationMode;

        if (mode === "stock_only") {
          // Stock video mode: call /api/generate/footage for video clips
          log("Fetching stock footage (video) from Pexels…");
          const footageRes = await postJSON("/api/generate/footage", {
            sceneTexts: parseScenes(script),
            type: "video",
            topic: s.topic,
          });
          if (cancelled) return;
          footage = footageRes.footage ?? [];
          mark("videos", "done");
          log(`${footage.length} stock footage clips retrieved.`, "success");
        } else if (mode === "stock_plus_ai_images") {
          // Stock photo mode: call /api/generate/footage for photos (AI images mixed in later)
          log("Fetching stock photos from Pexels…");
          const footageRes = await postJSON("/api/generate/footage", {
            sceneTexts: parseScenes(script),
            type: "photo",
            topic: s.topic,
          });
          if (cancelled) return;
          footage = footageRes.footage ?? [];
          mark("videos", "done");
          log(`${footage.length} stock photos retrieved.`, "success");
        } else if (mode === "ai_images_plus_ai_video") {
          // AI video mode (old "videos"): animate images with Kling
          log("Animating clips with Kling…");
          clipRes = await postJSON("/api/generate/videos", { images, style: s.videoStyle });
          if (cancelled) return;

          if (clipRes.source === "mock") {
            log("Kling clip generation failed — retrying once…", "warn");
            clipRes = await postJSON("/api/generate/videos", { images, style: s.videoStyle });
            if (cancelled) return;
          }

          mark("videos", "done");
          if (clipRes.source === "mock") {
            log("Kling clip generation failed after retry — failing video generation (ai_images_plus_ai_video mode requires clips).", "warn");
            updateVideo(video!.id, { status: "failed" });
            setFinished(false);
            return;
          } else {
            log(`${clipRes.clips?.length ?? 0} clips rendered.`, "success");
          }
        } else {
          // ai_images_only (old "images"): skip video entirely
          log("Skipping video clips — ai_images_only mode selected.");
          mark("videos", "done");
          log("0 clips rendered (ai_images_only mode).", "success");
        }
        bump();

        // 4. Voiceover
        mark("voiceover", "running");
        log("Recording the voiceover with ElevenLabs…");
        const voRes = await postJSON("/api/generate/voiceover", {
          script,
          voice: s.voice,
          speed: s.speed,
        });
        if (cancelled) return;
        mark("voiceover", "done");
        log(`Voiceover ready (${voRes.duration ?? 0}s).`, "success");
        bump();

        // 5. Captions
        mark("captions", "running");
        log("Transcribing & timing captions with Whisper…");
        const capRes = await postJSON("/api/generate/captions", {
          script,
          style: s.captionStyle,
          position: s.captionPosition,
        });
        if (cancelled) return;
        mark("captions", "done");
        log(`${capRes.captions?.length ?? 0} caption cues timed.`, "success");
        bump();

        // 6. Music
        // TODO: Implement actual music generation/selection and API call here.
        // For now, this step is simulated.
        mark("music", "running");
        log(`Mixing "${s.music}" background track (simulated)…`);
        await new Promise((r) => setTimeout(r, 800)); // Simulate music processing
        if (cancelled) return;
        mark("music", "done");
        log("Audio levels balanced (simulated).", "success");
        bump();

        // 7. Final render
        mark("render", "running");
        log("Assembling the final MP4 with JSON2Video…");

        const renderPayload: any = {
          format: s.format,
          music: s.music,
          script,
          voice: s.voice,
        };

        if (mode === "stock_only") {
          renderPayload.clips = footage;
          renderPayload.images = [];
          renderPayload.generationMode = "stock_only";
        } else if (mode === "stock_plus_ai_images") {
          // For now: use stock footage as clips, no AI images
          renderPayload.clips = footage;
          renderPayload.images = [];
          renderPayload.generationMode = "stock_plus_ai_images";
        } else if (mode === "ai_images_only") {
          renderPayload.clips = [];
          renderPayload.images = images;
          renderPayload.generationMode = "ai_images_only";
        } else { // ai_images_plus_ai_video
          renderPayload.clips = clipRes.clips ?? [];
          renderPayload.images = images;
          renderPayload.generationMode = "ai_images_plus_ai_video";
        }

        const renderRes = await postJSON("/api/generate/render", renderPayload);
        if (cancelled) return;
mark("render", "done");

if (renderRes.source === "mock") {
  log("Render failed — JSON2Video did not complete in time (fell back to mock).", "warn");
  updateVideo(video!.id, { status: "failed" });
  setFinished(false);
  return;
}

log("Render complete.", "success");
        bump();

        // 8. Ready — persist + deduct credits
        mark("ready", "done");
        updateVideo(video!.id, {
          status: "ready",
          video_url: renderRes.video_url,
          thumbnail_url: renderRes.thumbnail_url ?? images[0] ?? null,
        });
        deductCredits(video!.credits_used, `Video render — ${video!.title}`);

        log("🎉 Your video is ready to download!", "success");
        bump();
        setProgress(100);
        setFinished(true);
      } catch {
        if (cancelled) return;
        log("Something went wrong during generation.", "warn");
        updateVideo(video!.id, { status: "failed" });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

  if (!video) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-panel-2 text-muted">
          <Icon name="film" size={26} />
        </span>
        <h1 className="mt-5 text-xl font-semibold text-ink">Video not found</h1>
        <p className="mt-2 text-sm text-muted">This generation may have expired or been removed.</p>
        <ButtonLink href="/create" className="mt-6">
          Create a new video
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {finished ? "Your video is ready" : "Generating your video"}
          </h1>
          <p className="mt-1 text-sm text-muted">{video.title}</p>
        </div>
        <StatusBadge status={video.status} />
      </div>

      {/* Overall progress */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">
            {finished ? "Completed" : "Overall progress"}
          </span>
          <span className="text-lg font-bold gradient-text">{progress}%</span>
        </div>
        <ProgressBar value={progress} className="mt-3" height={12} />
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Step cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map((step) => (
            <StepCard key={step.key} step={step} />
          ))}
        </div>

        {/* Live log + preview */}
        <div className="space-y-4">
          {finished && (
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-canvas">
                {video.thumbnail_url ? (
                  <Image src={video.thumbnail_url} alt={video.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center gradient-bg-soft" />
                )}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas/80 text-ink backdrop-blur">
                    <Icon name="play" size={22} />
                  </span>
                </span>
              </div>
              <div className="flex gap-2 p-4">
                <Button fullWidth onClick={() => router.push("/videos")}>
                  <Icon name="download" size={16} />
                  Download
                </Button>
                <ButtonLink href="/create" variant="secondary">
                  <Icon name="plus" size={16} />
                  New
                </ButtonLink>
              </div>
            </Card>
          )}

          <Card className="flex flex-col">
            <div className="flex items-center justify-between border-b border-edge px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className={cn("h-2 w-2 rounded-full", finished ? "bg-success" : "animate-pulse bg-warning")} />
                Live log
              </span>
              <span className="text-xs text-muted">{logs.length} events</span>
            </div>
            <div className="max-h-[320px] overflow-y-auto p-4 font-mono text-xs">
              {logs.length === 0 && <p className="text-muted">Waiting to start…</p>}
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3 py-1">
                  <span className="shrink-0 text-muted">{l.time}</span>
                  <span
                    className={cn(
                      l.level === "success" && "text-success",
                      l.level === "warn" && "text-warning",
                      l.level === "info" && "text-ink"
                    )}
                  >
                    {l.message}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {!finished && (
            <div className="flex items-start gap-3 rounded-card border border-edge bg-panel/60 p-4">
              <Icon name="sparkles" size={18} className="mt-0.5 shrink-0 text-accent-soft" />
              <p className="text-sm text-muted">
                <span className="font-medium text-ink">Tip:</span> you can navigate away — generation
                continues in the background and your video will appear in{" "}
                <span className="text-accent-soft">My Videos</span> when it&apos;s done.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({ step }: { step: GenStep }) {
  const border =
    step.status === "done"
      ? "border-success/40"
      : step.status === "running"
        ? "border-accent/60"
        : step.status === "failed"
          ? "border-pink/50"
          : "border-edge";
  return (
    <div className={cn("flex items-start gap-3 rounded-card border bg-panel p-4 transition-colors", border)}>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          step.status === "done"
            ? "bg-success/20 text-success"
            : step.status === "running"
              ? "gradient-bg text-white"
              : step.status === "failed"
                ? "bg-pink/20 text-pink"
                : "bg-panel-2 text-muted"
        )}
      >
        {step.status === "done" ? (
          <Icon name="check" size={16} />
        ) : step.status === "running" ? (
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
        ) : step.status === "failed" ? (
          <Icon name="x" size={16} />
        ) : (
          <span className="h-2 w-2 rounded-full bg-muted" />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{step.label}</p>
        <p className="mt-0.5 text-xs text-muted">{step.description}</p>
        <p
          className={cn(
            "mt-1.5 text-[11px] font-medium uppercase tracking-wide",
            step.status === "done"
              ? "text-success"
              : step.status === "running"
                ? "text-accent-soft"
                : step.status === "failed"
                  ? "text-pink"
                  : "text-muted"
          )}
        >
          {step.status === "running" ? "In progress" : step.status}
        </p>
      </div>
    </div>
  );
}






