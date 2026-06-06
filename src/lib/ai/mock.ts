// Deterministic mock content generators used when real service keys are not
// configured (the default for local development with placeholder env values).

import { placeholderImage } from "@/lib/utils";

export function mockScript(topic: string, tone: string, length: string): string {
  const scenes = length === "long" ? 8 : length === "medium" ? 5 : 3;
  const lines: string[] = [
    `[HOOK] You won't believe what most people get wrong about ${topic}.`,
  ];
  for (let i = 1; i < scenes - 1; i++) {
    lines.push(`[SCENE ${i + 1}] Here's point ${i}: a ${tone.toLowerCase()} take on ${topic} that actually lands.`);
  }
  lines.push(`[CTA] Follow for more on ${topic}. Hit subscribe — you'll thank me later.`);
  return lines.join("\n\n");
}

export function mockImages(seed: string, count = 5): string[] {
  return Array.from({ length: count }, (_, i) => placeholderImage(`${seed}-${i}`, 720, 1280));
}

export function mockClips(seed: string, count = 4) {
  return Array.from({ length: count }, (_, i) => ({
    url: `https://v3.fal.media/files/mock/${seed}-${i}.mp4`,
    poster: placeholderImage(`${seed}-clip-${i}`, 720, 1280),
    duration: 4,
  }));
}

export function mockVoiceover(voice: string, words: number) {
  return {
    audio_url: `https://mock.elevenlabs.io/${voice}.mp3`,
    voice,
    duration: Math.max(8, Math.round(words / 2.6)),
  };
}

export function mockCaptions(script: string) {
  const words = script.replace(/\[[^\]]+\]/g, "").trim().split(/\s+/).slice(0, 60);
  let t = 0;
  return words.map((w) => {
    const start = t;
    t += 0.35;
    return { word: w, start: +start.toFixed(2), end: +t.toFixed(2) };
  });
}

export function mockRender(seed: string, format: string) {
  return {
    video_url: `https://mock.creatomate.com/renders/${seed}.mp4`,
    thumbnail_url: placeholderImage(seed, format === "9:16" ? 720 : 1280, format === "9:16" ? 1280 : 720),
    format,
  };
}
