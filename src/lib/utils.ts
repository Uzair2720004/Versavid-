import { CREDIT_COSTS } from "./constants";
import type { VideoLength, GenerationMode, VideoSettings } from "./types";

/** Tiny classnames joiner. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Stable-ish id without external deps. Crypto when available. */
export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/** Credits required for a video, derived from length + generationMode. */
export function creditsForSettings(settings: Partial<VideoSettings>): number {
  const length = settings.length as VideoLength;
  const mode = settings.generationMode as GenerationMode;
  const base = CREDIT_COSTS?.[length]?.[mode] ?? 3;
  let total = base;
  if (settings.music && settings.music !== "none") total += 1;
  return total;
}

export function creditsForLength(length: VideoLength, mode: GenerationMode): number {
  return CREDIT_COSTS?.[length]?.[mode] ?? 3;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `0:${s.toString().padStart(2, "0")}`;
}

/** A deterministic placeholder image URL for a given seed (no external key). */
export function placeholderImage(seed: string | number, w = 800, h = 450): string {
  return `https://picsum.photos/seed/versavid-${seed}/${w}/${h}`;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

export function passwordStrength(pw: string): PasswordStrength {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: Record<number, PasswordStrength> = {
    0: { score: 0, label: "Too short", color: "#8b949e" },
    1: { score: 1, label: "Weak", color: "#d4537e" },
    2: { score: 2, label: "Fair", color: "#d29922" },
    3: { score: 3, label: "Good", color: "#5aa0ff" },
    4: { score: 4, label: "Strong", color: "#3fb950" },
  };
  return map[Math.min(score, 4) as 0 | 1 | 2 | 3 | 4];
}

/** Whether the running env has real service keys (vs. the placeholder defaults). */
export function hasRealKey(value: string | undefined): boolean {
  return !!value && !value.startsWith("your_") && value.length > 8;
}
