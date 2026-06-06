"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, Input, Textarea, Toggle } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OptionTile, PillGroup, SwatchTile, FieldLabel } from "@/components/create/controls";
import { SummaryCard } from "@/components/create/SummaryCard";
import {
  FORMATS,
  LENGTHS,
  TONES,
  MEDIA_TYPES,
  PHOTO_STYLES,
  VIDEO_STYLES,
  VOICES,
  LANGUAGES,
  SPEEDS,
  CAPTION_STYLES,
  CAPTION_POSITIONS,
  MUSIC_TRACKS,
} from "@/lib/constants";
import type { VideoSettings, VideoRecord } from "@/lib/types";
import { cn, creditsForSettings } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Script" },
  { n: 2, label: "Media & style" },
  { n: 3, label: "Voice & captions" },
  { n: 4, label: "Review" },
];

const DEFAULTS: VideoSettings = {
  scriptMode: "ai",
  topic: "",
  format: "9:16",
  length: "short",
  tone: "Energetic",
  mediaType: "both",
  photoStyle: "cinematic",
  videoStyle: "realistic",
  referenceImage: null,
  voice: "nova",
  language: "en",
  speed: "normal",
  captionStyle: "bold-pop",
  captionPosition: "bottom",
  music: "uplifting",
};

export default function CreatePage() {
  const router = useRouter();
  const { credits, addVideo } = useApp();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<VideoSettings>(DEFAULTS);
  const [customScript, setCustomScript] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const canGenerate = settings.topic.trim().length > 0 || (settings.scriptMode === "upload" && customScript.trim().length > 0);

  function handleReferenceUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("referenceImage", reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleGenerate() {
    if (!canGenerate) return;
    setBusy(true);
    // Real UUID so it satisfies the `videos.id` uuid column when persisted.
    const id = crypto.randomUUID();
    const title =
      settings.topic.trim() ||
      customScript.trim().split("\n")[0].slice(0, 60) ||
      "Untitled video";
    const video: VideoRecord = {
      id,
      user_id: "me",
      title,
      topic: settings.topic,
      format: settings.format,
      status: "queued",
      script: settings.scriptMode === "upload" ? customScript : null,
      video_url: null,
      thumbnail_url: null,
      credits_used: creditsForSettings(settings),
      duration: settings.length === "long" ? 150 : settings.length === "medium" ? 45 : 25,
      settings: { ...settings, topic: settings.topic || title },
      created_at: new Date().toISOString(),
    };
    addVideo(video);
    router.push(`/generate/${id}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <PageHeader title="Create a video" subtitle="Four quick steps from idea to publish-ready." />

      {/* Stepper */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {STEPS.map((s, i) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <div key={s.n} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.n)}
                className={cn(
                  "flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-colors",
                  active
                    ? "border-accent/60 bg-accent/10 text-ink"
                    : done
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-edge bg-canvas text-muted hover:text-ink"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                    active ? "gradient-bg text-white" : done ? "bg-success text-canvas" : "bg-panel-2 text-muted"
                  )}
                >
                  {done ? <Icon name="check" size={13} /> : s.n}
                </span>
                <span className="whitespace-nowrap font-medium">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-6 shrink-0 bg-edge" />}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main step content */}
        <Card className="p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-7 animate-fade-up">
              <div>
                <FieldLabel hint="Let AI write the script, or bring your own.">Script source</FieldLabel>
                <div className="flex items-center gap-3 rounded-xl border border-edge bg-canvas p-1.5">
                  {(["ai", "upload"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => set("scriptMode", mode)}
                      className={cn(
                        "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                        settings.scriptMode === mode ? "gradient-bg text-white" : "text-muted hover:text-ink"
                      )}
                    >
                      {mode === "ai" ? "✨ AI generate" : "📝 Upload my script"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel hint="What should the video be about?">Topic</FieldLabel>
                <Input
                  value={settings.topic}
                  onChange={(e) => set("topic", e.target.value)}
                  placeholder="e.g. 5 AI tools that feel illegal to know"
                />
              </div>

              {settings.scriptMode === "upload" && (
                <div>
                  <FieldLabel hint="Paste your script — we'll narrate and visualize it.">Your script</FieldLabel>
                  <Textarea
                    rows={6}
                    value={customScript}
                    onChange={(e) => setCustomScript(e.target.value)}
                    placeholder="[HOOK] ...\n[SCENE 2] ...\n[CTA] ..."
                  />
                </div>
              )}

              <div>
                <FieldLabel>Format</FieldLabel>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FORMATS.map((f) => (
                    <OptionTile
                      key={f.value}
                      selected={settings.format === f.value}
                      onClick={() => set("format", f.value)}
                      title={`${f.label} · ${f.value}`}
                      sub={f.sub}
                      icon={f.value === "9:16" ? "aspect" : "video"}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Length</FieldLabel>
                <PillGroup
                  value={settings.length}
                  onChange={(v) => set("length", v)}
                  options={LENGTHS.map((l) => ({ value: l.value, label: l.label, sub: l.sub }))}
                />
              </div>

              <div>
                <FieldLabel>Tone</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => set("tone", t)}
                      className={cn(
                        "rounded-lg border px-3.5 py-2 text-sm transition-colors",
                        settings.tone === t
                          ? "border-accent/70 bg-accent/10 text-ink"
                          : "border-edge bg-canvas text-muted hover:text-ink"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-7 animate-fade-up">
              <div>
                <FieldLabel hint="Choose what your scenes are built from.">Media type</FieldLabel>
                <div className="grid gap-3 sm:grid-cols-3">
                  {MEDIA_TYPES.map((m) => (
                    <OptionTile
                      key={m.value}
                      selected={settings.mediaType === m.value}
                      onClick={() => set("mediaType", m.value)}
                      title={m.label}
                      sub={m.sub}
                      icon={m.icon as "image"}
                    />
                  ))}
                </div>
              </div>

              {settings.mediaType !== "videos" && (
                <div>
                  <FieldLabel>Photo style</FieldLabel>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {PHOTO_STYLES.map((s) => (
                      <SwatchTile
                        key={s.value}
                        selected={settings.photoStyle === s.value}
                        onClick={() => set("photoStyle", s.value)}
                        label={s.label}
                        swatch={s.swatch}
                      />
                    ))}
                  </div>
                </div>
              )}

              {settings.mediaType !== "images" && (
                <div>
                  <FieldLabel>Video clip style</FieldLabel>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {VIDEO_STYLES.map((s) => (
                      <SwatchTile
                        key={s.value}
                        selected={settings.videoStyle === s.value}
                        onClick={() => set("videoStyle", s.value)}
                        label={s.label}
                        swatch={s.swatch}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <FieldLabel hint="Optional — guide the look with a reference image.">Reference image</FieldLabel>
                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-edge-strong bg-canvas p-4 transition-colors hover:border-accent/60">
                  {settings.referenceImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={settings.referenceImage} alt="reference" className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-panel-2 text-muted">
                      <Icon name="upload" size={22} />
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">
                      {settings.referenceImage ? "Reference added" : "Upload a reference image"}
                    </p>
                    <p className="text-xs text-muted">PNG or JPG, up to 10MB</p>
                  </div>
                  {settings.referenceImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        set("referenceImage", null);
                      }}
                      className="rounded-lg p-2 text-muted hover:text-pink"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleReferenceUpload} />
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-7 animate-fade-up">
              <div>
                <FieldLabel hint="Pick the narrator for your video.">Voice</FieldLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {VOICES.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => set("voice", v.value)}
                      className={cn(
                        "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all",
                        settings.voice === v.value
                          ? "border-accent/70 bg-accent/10"
                          : "border-edge bg-canvas hover:border-edge-strong"
                      )}
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                        style={{ background: v.swatch }}
                      >
                        <Icon name="mic" size={16} />
                      </span>
                      <span className="text-sm font-semibold text-ink">{v.name}</span>
                      <span className="text-[11px] text-muted">{v.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel>Language</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => set("language", l.value)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                          settings.language === l.value
                            ? "border-accent/70 bg-accent/10 text-ink"
                            : "border-edge bg-canvas text-muted hover:text-ink"
                        )}
                      >
                        <span>{l.flag}</span>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel>Speed</FieldLabel>
                  <PillGroup
                    value={settings.speed}
                    onChange={(v) => set("speed", v)}
                    options={SPEEDS.map((s) => ({ value: s.value, label: s.label, sub: s.sub }))}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Caption style</FieldLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {CAPTION_STYLES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => set("captionStyle", c.value)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-xl border py-5 transition-all",
                        settings.captionStyle === c.value
                          ? "border-accent/70 bg-accent/10"
                          : "border-edge bg-canvas hover:border-edge-strong"
                      )}
                    >
                      <span className="text-sm font-bold gradient-text">{c.preview}</span>
                      <span className="text-xs text-muted">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Caption position</FieldLabel>
                <PillGroup
                  value={settings.captionPosition}
                  onChange={(v) => set("captionPosition", v)}
                  options={CAPTION_POSITIONS.map((p) => ({ value: p.value, label: p.label }))}
                />
              </div>

              <div>
                <FieldLabel>Background music</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {MUSIC_TRACKS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => set("music", m.value)}
                      className={cn(
                        "rounded-lg border px-3.5 py-2 text-sm transition-colors",
                        settings.music === m.value
                          ? "border-accent/70 bg-accent/10 text-ink"
                          : "border-edge bg-canvas text-muted hover:text-ink"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-white">
                  <Icon name="check" size={20} />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">Everything looks good?</h3>
                  <p className="text-sm text-muted">Review your settings, then generate.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ReviewRow label="Topic" value={settings.topic || "—"} />
                <ReviewRow label="Format" value={settings.format} />
                <ReviewRow label="Length" value={settings.length} />
                <ReviewRow label="Tone" value={settings.tone} />
                <ReviewRow label="Media type" value={settings.mediaType} />
                <ReviewRow label="Photo style" value={settings.photoStyle} />
                <ReviewRow label="Clip style" value={settings.videoStyle} />
                <ReviewRow label="Voice" value={VOICES.find((v) => v.value === settings.voice)?.name ?? ""} />
                <ReviewRow label="Language" value={LANGUAGES.find((l) => l.value === settings.language)?.label ?? ""} />
                <ReviewRow label="Speed" value={settings.speed} />
                <ReviewRow label="Captions" value={`${settings.captionStyle} · ${settings.captionPosition}`} />
                <ReviewRow label="Music" value={settings.music} />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/10 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <Icon name="coins" size={18} className="text-accent-soft" />
                  <span className="text-sm text-ink">This video will cost</span>
                </div>
                <span className="text-2xl font-bold text-ink">{creditsForSettings(settings)} credits</span>
              </div>

              {settings.scriptMode === "upload" && (
                <label className="flex items-center justify-between rounded-xl border border-edge bg-canvas px-4 py-3">
                  <span className="text-sm text-muted">Using your uploaded script</span>
                  <Toggle checked disabled onChange={() => {}} />
                </label>
              )}
            </div>
          )}

          {/* Footer nav */}
          <div className="mt-8 flex items-center justify-between border-t border-edge pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <Icon name="chevron-left" size={16} />
              Back
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => Math.min(4, s + 1))}>
                Continue
                <Icon name="chevron-right" size={16} />
              </Button>
            ) : (
              <Button onClick={handleGenerate} disabled={!canGenerate || busy}>
                <Icon name="sparkles" size={16} />
                Generate
              </Button>
            )}
          </div>
        </Card>

        {/* Always-visible summary sidebar */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <SummaryCard
            settings={settings}
            credits={credits?.balance ?? 0}
            onGenerate={handleGenerate}
            busy={busy}
            canGenerate={canGenerate}
          />
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-edge bg-canvas px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium capitalize text-ink">{value}</p>
    </div>
  );
}
