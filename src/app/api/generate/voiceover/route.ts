import { hasRealKey } from "@/lib/utils";
import { mockVoiceover } from "@/lib/ai/mock";

export const runtime = "nodejs";

// Maps VersaVid voice ids to ElevenLabs voice ids (sample defaults).
const VOICE_MAP: Record<string, string> = {
  atlas: "pNInz6obpgDQGcFmaJgB",
  nova: "EXAVITQu4vr4xnSDxMaL",
  echo: "TxGEqnHWrfWFTfGW9XjX",
  luna: "ThT5KcBeYPX3keUQqHPh",
  ember: "MF3mGyEYCl7XYWbV9V6O",
  ridge: "VR6AewLTigWG4xSOukaG",
  sage: "yoZ06aMxZJJ28mfd3POQ",
  pixel: "jsCqWAovK2LkecY7zXl4",
};

/**
 * POST /api/generate/voiceover — narrates the script with ElevenLabs.
 * Returns mock audio metadata when ELEVENLABS_API_KEY is not configured.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { script = "", voice = "nova", speed = "normal" } = body as Record<string, string>;
  const text = script.replace(/\[[^\]]+\]/g, "").trim();
  const words = text.split(/\s+/).filter(Boolean).length;

  if (hasRealKey(process.env.ELEVENLABS_API_KEY) && text) {
    try {
      const voiceId = VOICE_MAP[voice] ?? VOICE_MAP.nova;
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });
      if (res.ok) {
        // In production we'd upload the audio buffer to storage; here we report success.
        return Response.json({
          audio_url: "stored://voiceover.mp3",
          voice,
          duration: Math.max(8, Math.round(words / 2.6)),
          speed,
          source: "elevenlabs",
        });
      }
    } catch {
      /* fall through */
    }
  }

  await new Promise((r) => setTimeout(r, 700));
  return Response.json({ ...mockVoiceover(voice, words), speed, source: "mock" });
}
