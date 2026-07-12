import { hasRealKey } from "@/lib/utils";
import { mockScript } from "@/lib/ai/mock";
import { generateImages } from "@/lib/ai/generate";
import { createAdminSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Writes the voiceover script — Anthropic Claude when configured, else a mock. */
async function writeScript(
  topic: string,
  tone: string,
  length: string,
  format: string
): Promise<{ script: string; source: string }> {
  const key = process.env.ANTHROPIC_API_KEY;

  if (hasRealKey(key)) {
    try {
      const targetSeconds = length === "long" ? 150 : length === "medium" ? 45 : 25;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key!,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content:
                `Write a punchy ${tone.toLowerCase()} voiceover script for a ${targetSeconds}-second ` +
                `${format} YouTube video about "${topic}". Open with a strong hook, deliver tight ` +
                `value, and end with a call to action. Label sections like [HOOK], [SCENE 2], [CTA]. ` +
                `No stage directions other than those labels.`,
            },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const script = data?.content?.[0]?.text?.trim();
        if (script) return { script, source: "anthropic" };
      }
    } catch {
      // fall through to mock
    }
  }

  // Small delay so the UI shows a "working" state, then mock content.
  await new Promise((r) => setTimeout(r, 600));
  return { script: mockScript(topic, tone, length), source: "mock" };
}

/**
 * POST /api/generate/script
 *
 * 1. Generates (or accepts) the voiceover script.
 * 2. Saves the script to the `videos` row and advances its status.
 * 3. Triggers the next pipeline step — scene image generation with fal.ai —
 *    and persists the resulting thumbnail.
 *
 * DB writes use the service-role admin client so persistence works regardless
 * of the request's auth context. They no-op gracefully when the service-role
 * key is not configured (the local-demo data layer persists instead).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    videoId = "",
    topic = "an interesting subject",
    tone = "Energetic",
    length = "short",
    format = "9:16",
    photoStyle = "photoreal",
    scriptMode = "ai",
    customScript = "",
  } = body as Record<string, string>;

  // 1. Produce the script — user-supplied or generated.
  let script: string;
  let source: string;
  if (scriptMode === "upload" && customScript.trim()) {
    script = customScript.trim();
    source = "user";
  } else {
    ({ script, source } = await writeScript(topic, tone, length, format));
  }

  // Resolve the admin (service-role) client once (null when not configured).
  const supabase = videoId ? await createAdminSupabase() : null;

  // 2. Save the script to the videos table and mark generation in-progress.
  if (supabase) {
    const { error } = await supabase
      .from("videos")
      .update({ script, status: "generating" })
      .eq("id", videoId);
    if (error) console.error("script route: failed to save script:", error.message);
  }

// 3. Move to image generation with fal.ai — count images to match actual scenes in the script.
const sceneMatches = script.match(/\[(HOOK|SCENE\s*\d+|CTA)\]/gi) ?? [];
const fallbackCount = length === "long" ? 8 : length === "medium" ? 5 : 3;
const count = sceneMatches.length > 0 ? sceneMatches.length : fallbackCount;
  const { images, source: imagesSource } = await generateImages({
    topic,
    style: photoStyle,
    format,
    count,
  });

  // Persist the first scene image as the thumbnail.
  if (supabase && images[0]) {
    const { error } = await supabase
      .from("videos")
      .update({ thumbnail_url: images[0] })
      .eq("id", videoId);
    if (error) console.error("script route: failed to save thumbnail:", error.message);
  }

  return Response.json({ script, source, images, imagesSource });
}
