"use client";

import { Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/primitives";
import type { VideoSettings } from "@/lib/types";
import { VOICES, LANGUAGES } from "@/lib/constants";
import { creditsForSettings } from "@/lib/utils";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="truncate font-medium text-ink">{value}</span>
    </div>
  );
}

export function SummaryCard({
  settings,
  credits,
  onGenerate,
  busy,
  canGenerate,
}: {
  settings: VideoSettings;
  credits: number;
  onGenerate: () => void;
  busy?: boolean;
  canGenerate: boolean;
}) {
  const cost = creditsForSettings(settings);
  const enough = credits >= cost;
  const voice = VOICES.find((v) => v.value === settings.voice)?.name ?? settings.voice;
  const language = LANGUAGES.find((l) => l.value === settings.language)?.label ?? settings.language;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Icon name="sparkles" size={18} className="text-accent-soft" />
        <h3 className="font-semibold text-ink">Summary</h3>
      </div>

      <div className="mt-4 divide-y divide-edge">
        <div className="pb-1">
          <Row label="Topic" value={settings.topic || "—"} />
          <Row label="Format" value={settings.format} />
          <Row label="Length" value={settings.length} />
          <Row label="Tone" value={settings.tone} />
        </div>
        <div className="py-1">
          <Row label="Generation mode" value={settings.generationMode} />
          <Row label="Photo style" value={settings.photoStyle} />
          <Row label="Clip style" value={settings.videoStyle} />
        </div>
        <div className="py-1">
          <Row label="Voice" value={voice} />
          <Row label="Language" value={language} />
          <Row label="Speed" value={settings.speed} />
          <Row label="Captions" value={settings.captionStyle} />
          <Row label="Music" value={settings.music} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-edge bg-canvas px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-muted">
          <Icon name="coins" size={16} className="text-accent-soft" />
          Credits required
        </span>
        <span className="text-lg font-bold text-ink">{cost}</span>
      </div>
      <p className={`mt-2 text-xs ${enough ? "text-muted" : "text-pink"}`}>
        {enough ? `You have ${credits} credits available.` : `Not enough credits — you have ${credits}.`}
      </p>

      <Button
        fullWidth
        size="lg"
        className="mt-4"
        disabled={!canGenerate || !enough || busy}
        onClick={onGenerate}
      >
        {busy ? <Spinner size={18} /> : <Icon name="sparkles" size={18} />}
        Generate video
      </Button>
      {!canGenerate && <p className="mt-2 text-center text-xs text-muted">Add a topic to continue.</p>}
    </Card>
  );
}
