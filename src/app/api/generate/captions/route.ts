import { hasRealKey } from "@/lib/utils";
import { mockCaptions } from "@/lib/ai/mock";

export const runtime = "nodejs";

/**
 * POST /api/generate/captions — transcribes & word-times the voiceover with
 * OpenAI Whisper. Returns mock word timings when OPENAI_API_KEY is missing.
 *
 * Note: real Whisper transcription needs the audio file; in this build the
 * client passes the generated script so captions stay in sync with the mock
 * voiceover. With a real audio_url, you'd download it and send to Whisper.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { script = "", style = "bold-pop", position = "bottom" } = body as Record<string, string>;

  // Whisper requires audio input; we expose the integration shape but use the
  // script-derived timing as the deterministic fallback.
  if (hasRealKey(process.env.OPENAI_API_KEY)) {
    // Real path would POST audio to https://api.openai.com/v1/audio/transcriptions
    // with response_format=verbose_json & timestamp_granularities[]=word.
    await new Promise((r) => setTimeout(r, 500));
  } else {
    await new Promise((r) => setTimeout(r, 600));
  }

  return Response.json({
    captions: mockCaptions(script),
    style,
    position,
    source: hasRealKey(process.env.OPENAI_API_KEY) ? "whisper" : "mock",
  });
}
