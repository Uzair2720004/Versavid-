"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, FileText } from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, StatusBadge } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GEN_STEPS } from "@/lib/constants";
import { MUSIC_TRACKS } from "@/lib/generation-options";
import type { GenStep, LogEntry, VideoEditAsset } from "@/lib/types";
import { cn } from "@/lib/utils";
import AmbientBackground from "@/components/AmbientBackground";
import { Topbar } from "@/components/dashboard/Topbar";
import ProgressOrb from "@/components/generate/ProgressOrb";

function parseScenes(text: string): { narration: string; visual: string }[] {
  const regex = /\[(HOOK|SCENE\s*\d+|CTA)\]/gi;
  const matches = [...text.matchAll(regex)];
  const scenes: { narration: string; visual: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index! + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    const chunk = text.slice(start, end).trim();
    const visualMatch = chunk.match(/\[VISUAL:\s*([^\]]+)\]/i);
    const visual = visualMatch ? visualMatch[1].trim() : "";
    const narration = chunk.replace(/\[VISUAL:[^\]]*\]/i, "").trim().slice(0, 300);
    if (narration) scenes.push({ narration, visual });
  }
  // Fallback: if no scene markers found, split into ~4 equal chunks
  if (scenes.length === 0) {
    const words = text.trim().split(/\s+/);
    const chunkSize = Math.max(1, Math.ceil(words.length / 4));
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(" ");
      if (chunk.trim()) scenes.push({ narration: chunk.slice(0, 300), visual: "" });
    }
  }
  return scenes;
}

function capScenes(scenes: { narration: string; visual: string }[], length: string): { narration: string; visual: string }[] {
  const targetSeconds = length === "long" ? 150 : length === "medium" ? 45 : 25;
  const targetCount = Math.max(3, Math.round(targetSeconds / 5));
  return scenes.length > targetCount ? scenes.slice(0, targetCount) : scenes;
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
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(error.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export default function GeneratePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { videos, updateVideo, deductCredits, credits: creditsState, profile } = useApp();
  const video = videos.find((v) => v.id === params?.id);
  const alreadyReady = video?.status === "ready";

  const [steps, setSteps] = useState<GenStep[]>(() =>
    GEN_STEPS.map((s) => ({
      ...s,
      status:
        alreadyReady ||
        (s.key === "script" && (video?.status === "awaiting_review" || video?.status === "generating"))
          ? "done"
          : "waiting",
    }))
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(alreadyReady ? 100 : 0);
  const [finished, setFinished] = useState(alreadyReady);
  const [scriptDraft, setScriptDraft] = useState("");
  const started = useRef(false);
  const cancelledRef = useRef(false);
  const completedRef = useRef(0);

  const log = (message: string, level: LogEntry["level"] = "info") =>
    setLogs((l) => [...l, { time: now(), message, level }]);

  const mark = (key: string, status: GenStep["status"]) =>
    setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, status } : s)));

  const bump = () => {
    completedRef.current += 1;
    setProgress(Math.round((completedRef.current / GEN_STEPS.length) * 100));
  };

  // Keep the editable draft in sync with the persisted script once we hit the review checkpoint.
  useEffect(() => {
    if (video?.status === "awaiting_review" && video.script) {
      setScriptDraft((prev) => (prev ? prev : video.script!));
    }
  }, [video?.status, video?.script]);

  /** Step 1 only: writes the script and persists it. Returns the script (or null on failure). */
  const runScriptStep = async (): Promise<string | null> => {
    const v = video;
    if (!v) return null;
    const s = v.settings;

    // Free-tier users are gated by monthly_video_count (server-side in plan-enforcement.ts),
    // not by credits balance. Only paid tiers need credit balance check.
    const isFreeTier = profile?.plan === 'free';
    if (!isFreeTier && (creditsState?.balance ?? 0) < v.credits_used) {
      log("Insufficient credits to start this generation.", "warn");
      updateVideo(v.id, { status: "failed" });
      return null;
    }

    updateVideo(v.id, { status: "generating" });
    log("Generation started. You can safely navigate away — we'll keep working.", "info");

    mark("script", "running");
    log("Writing the script with Claude…");
    try {
      const scriptRes = await postJSON("/api/generate/script", {
        videoId: v.id,
        topic: s.topic,
        tone: s.tone,
        length: s.length,
        format: s.format,
        photoStyle: s.photoStyle,
        scriptMode: s.scriptMode,
        customScript: v.script ?? "",
        language: s.language,
        generationMode: s.generationMode,
      });
      if (cancelledRef.current) return null;
      const script: string = scriptRes.script ?? "";
      updateVideo(v.id, { script });
      mark("script", "done");
      log(`Script ready (${scriptRes.source}).`, "success");
      bump();
      return script;
    } catch {
      if (!cancelledRef.current) {
        log("Something went wrong during generation.", "warn");
        updateVideo(v.id, { status: "failed" });
      }
      return null;
    }
  };

  /** Steps 2–8: everything after the script checkpoint. Runs only when explicitly invoked. */
  const runRestOfPipeline = async (script: string): Promise<void> => {
    const v = video;
    if (!v) return;
    const s = v.settings;
    const isFreeTier = profile?.plan === 'free';

    // Same credit pre-flight as the script step, so skipping the script step
    // doesn't bypass the paid-tier balance gate.
    if (!isFreeTier && (creditsState?.balance ?? 0) < v.credits_used) {
      log("Insufficient credits to start this generation.", "warn");
      updateVideo(v.id, { status: "failed" });
      return;
    }

    try {
      // 2. Images — only for modes that need AI-generated images
      // stock_only uses only stock footage, so skip Flux entirely
      let images: string[] = [];
      if (s.generationMode !== "stock_only") {
        mark("images", "running");
        log("Generating scene images with Flux…");
        const imgRes = await postJSON("/api/generate/images", {
          topic: s.topic,
          style: s.photoStyle,
          format: s.format,
          count: s.length === "long" ? 8 : s.length === "medium" ? 5 : 3,
          prompts: capScenes(parseScenes(script), s.length).map((sc) => sc.visual || sc.narration),
        });
        if (cancelledRef.current) return;
        images = imgRes.images ?? [];
        if (images[0]) updateVideo(v.id, { thumbnail_url: images[0] });
        mark("images", "done");
        log(`${images.length} images generated.`, "success");
      } else {
        // stock_only: no AI images needed, thumbnail will come from stock footage
        log("Skipping AI image generation — stock_only mode uses stock footage only.");
      }
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
          sceneTexts: capScenes(parseScenes(script), s.length).map((sc) => sc.visual || sc.narration),
          type: "video",
          topic: s.topic,
          generationMode: s.generationMode,
          videoId: v.id,
        });
        if (cancelledRef.current) return;
        footage = footageRes.footage ?? [];
        mark("videos", "done");
        log(`${footage.length} stock footage clips retrieved.`, "success");
      } else if (mode === "stock_plus_ai_images") {
        // Stock photo mode: call /api/generate/footage for photos (AI images mixed in later)
        log("Fetching stock photos from Pexels…");
        const footageRes = await postJSON("/api/generate/footage", {
          sceneTexts: capScenes(parseScenes(script), s.length).map((sc) => sc.visual || sc.narration),
          type: "photo",
          topic: s.topic,
          generationMode: s.generationMode,
          videoId: v.id,
        });
        if (cancelledRef.current) return;
        footage = footageRes.footage ?? [];
        mark("videos", "done");
        log(`${footage.length} stock photos retrieved.`, "success");
      } else if (mode === "ai_images_plus_ai_video") {
        // AI video mode (old "videos"): animate images with Kling
        log("Animating clips with Kling…");
        clipRes = await postJSON("/api/generate/videos", { images, style: s.videoStyle });
        if (cancelledRef.current) return;

        if (clipRes.source === "mock") {
          log("Kling clip generation failed — retrying once…", "warn");
          clipRes = await postJSON("/api/generate/videos", { images, style: s.videoStyle });
          if (cancelledRef.current) return;
        }

        mark("videos", "done");
        if (clipRes.source === "mock") {
          log("Kling clip generation failed after retry — failing video generation (ai_images_plus_ai_video mode requires clips).", "warn");
          updateVideo(v.id, { status: "failed" });
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
      if (cancelledRef.current) return;
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
      if (cancelledRef.current) return;
      mark("captions", "done");
      log(`${capRes.captions?.length ?? 0} caption cues timed.`, "success");
      bump();

      // 6. Music
      // TODO: Implement actual music generation/selection and API call here.
      // For now, this step is simulated.
      mark("music", "running");
      log(`Mixing "${s.music}" background track (simulated)…`);
      await new Promise((r) => setTimeout(r, 800)); // Simulate music processing
      if (cancelledRef.current) return;
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
        videoId: v.id,
        captionStyle: s.captionStyle,
      };

      if (mode === "stock_only") {
        renderPayload.footage = footage;
        renderPayload.images = [];
        renderPayload.generationMode = "stock_only";
      } else if (mode === "stock_plus_ai_images") {
        // For now: use stock footage as clips, no AI images
        renderPayload.footage = footage;
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
      if (cancelledRef.current) return;
      mark("render", "done");

      if (renderRes.error || renderRes.source === "mock" || renderRes.source === "validation" || renderRes.source === "failed") {
        log(`Render failed: ${renderRes.error ?? renderRes.source}`, "warn");
        updateVideo(v.id, { status: "failed" });
        setFinished(false);
        return;
      }

      log("Render complete.", "success");
      bump();

      // 8. Ready — persist + deduct credits (skip for free tier)
      mark("ready", "done");

      const scenes = capScenes(parseScenes(script), s.length);
      let builtAssets: VideoEditAsset[] = [];

      if (mode === "stock_only" || mode === "stock_plus_ai_images") {
        builtAssets = footage.map((f, i) => ({
          index: i,
          type: "footage" as const,
          url: f.url,
          duration: Math.min(f.duration ?? 5, 5),
          ...(scenes[i] ? { text: scenes[i].narration } : {}),
        }));
      } else if (mode === "ai_images_only") {
        builtAssets = images.map((url, i) => ({
          index: i,
          type: "image" as const,
          url,
          duration: 4,
          ...(scenes[i] ? { text: scenes[i].narration } : {}),
        }));
      } else if (mode === "ai_images_plus_ai_video") {
        const clips = clipRes.clips ?? [];
        builtAssets = [
          ...clips.map((c, i) => ({
            index: i,
            type: "clip" as const,
            url: c.url,
            duration: Math.min(c.duration ?? 5, 5),
            ...(scenes[i] ? { text: scenes[i].narration } : {}),
          })),
          ...images.slice(clips.length).map((url, i) => ({
            index: clips.length + i,
            type: "image" as const,
            url,
            duration: 4,
            ...(scenes[clips.length + i] ? { text: scenes[clips.length + i].narration } : {}),
          })),
        ];
      }

      updateVideo(v.id, {
        status: "ready",
        video_url: renderRes.video_url,
        thumbnail_url: renderRes.thumbnail_url ?? images[0] ?? null,
        edits: {
          assets: builtAssets,
          captionStyle: s.captionStyle,
          music: MUSIC_TRACKS[s.music] ? s.music : "uplifting",
          musicVolume: 0.15,
        },
      });
      if (!isFreeTier) {
        deductCredits(v.credits_used, `Video render — ${v.title}`);
      }

      log("🎉 Your video is ready to download!", "success");
      bump();
      setProgress(100);
      setFinished(true);
    } catch {
      if (!cancelledRef.current) {
        log("Something went wrong during generation.", "warn");
        updateVideo(v.id, { status: "failed" });
      }
    }
  };

  const runFullPipeline = async () => {
    cancelledRef.current = false;
    const script = await runScriptStep();
    if (script == null || cancelledRef.current) return;
    await runRestOfPipeline(script);
  };

  useEffect(() => {
    if (!video || alreadyReady) return;
    if (started.current) return;
    // Checkpoint already reached (e.g. refresh on the review screen): don't re-call the script API.
    if (video.status === "awaiting_review") return;

    started.current = true;
    cancelledRef.current = false;

    if (video.status === "queued" || video.status === "draft") {
      // Fresh video: run only the script step, then pause for review.
      runScriptStep().then((script) => {
        if (script != null && !cancelledRef.current) {
          updateVideo(video!.id, { status: "awaiting_review" });
        }
      });
    } else if (video.status === "generating" && video.script) {
      // Script already written (draft created early in the wizard): skip the script
      // step entirely and run the expensive pipeline steps directly.
      runRestOfPipeline(video.script);
    } else {
      // generating or later: pre-existing resume-on-refresh behavior — run the full pipeline.
      runFullPipeline();
    }

    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

  const handleContinue = () => {
    if (!video) return;
    const edited = scriptDraft.trim();
    if (!edited) return;
    updateVideo(video.id, { script: edited, status: "generating" });
    cancelledRef.current = false;
    runRestOfPipeline(edited);
  };

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

  // Script review checkpoint — pause before the expensive generation steps run.
  if (video.status === "awaiting_review") {
    return (
      <div className="relative min-h-screen bg-black flex">
        <AmbientBackground />
        <div className="relative z-10 flex w-full">
          <div className="flex-1 min-w-0 flex flex-col">
            <Topbar />
            <main className="flex-1 px-6 lg:px-8 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-fuchsia-400" />
                  <span className="text-[12px] text-fuchsia-400 font-medium">Script Review</span>
                </div>
                <h1 className="text-[32px] sm:text-[40px] font-bold leading-[1.0] tracking-tightest text-gradient">
                  Review your script
                </h1>
                <p className="mt-2 text-[14px] text-[#a8aeb8]">
                  This is the script your video will be built from — images, voiceover, and captions
                  all follow it. Edit anything before continuing; the expensive generation steps
                  start once you lock it in.
                </p>

                <div className="mt-8 glass border border-white/10 rounded-2xl p-6">
                  <label className="flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#87869a] mb-3">
                    <FileText className="h-3.5 w-3.5" /> Script
                  </label>
                  <textarea
                    value={scriptDraft}
                    onChange={(e) => setScriptDraft(e.target.value)}
                    rows={14}
                    className="w-full px-4 py-3 rounded-xl border text-[14px] leading-relaxed font-mono resize-y outline-none"
                    style={{ background: "#121218", borderColor: "#212129", color: "#EEEEF3" }}
                    placeholder="Your script appears here…"
                  />
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-[12px] text-[#87869a]">
                      {scriptDraft.trim() ? `${scriptDraft.trim().split(/\s+/).length} words` : "No script yet"}
                    </p>
                    <button
                      onClick={handleContinue}
                      disabled={!scriptDraft.trim()}
                      className="flex items-center gap-2 h-11 px-6 rounded-xl text-[13px] font-medium bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:scale-[1.03] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Sparkles className="h-4 w-4" /> Continue
                    </button>
                  </div>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
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

      <div className="mx-auto mt-6 flex max-w-[480px] flex-col gap-6">
        <ProgressOrb progress={progress} steps={steps} />

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
  );
}
