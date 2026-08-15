import { hasRealKey } from "@/lib/utils";
import { mockScript } from "@/lib/ai/mock";
import { createAdminSupabase } from "@/lib/supabase/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { validateGenerationRequest } from "@/lib/plan-enforcement";

export const runtime = "nodejs";

/** Writes the voiceover script — Anthropic Claude when configured, else a mock. */
async function writeScript(
  topic: string,
  tone: string,
  length: string,
  format: string,
  language: string
): Promise<{ script: string; source: string }> {
  const key = process.env.ANTHROPIC_API_KEY;

  const languageName = mapLanguageForPrompt(language);

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
                 `value, and end with a call to action. This MUST have EXACTLY ${Math.max(3, Math.round(targetSeconds / 5))} distinct scenes — no more, no fewer — ` +
                `(one new scene roughly every 4-5 seconds of narration) so each scene has a matching visual. ` +
                `Write the ENTIRE script — hook, scenes, and CTA — in ${languageName}. ` +
                `Label sections like [HOOK], [SCENE 2], [CTA]. No stage directions other than those labels.`,
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
  return { script: mockScript(topic, tone, length, language), source: "mock" };
}

function mapLanguageForPrompt(language: string): string {
  const map: Record<string, string> = {
    English: "English",
    "Hindi/Urdu": "Urdu",
    Spanish: "Spanish",
    French: "French",
    German: "German",
    Portuguese: "Portuguese",
    Arabic: "Arabic",
  };
  return map[language] ?? "English";
}

/**
 * POST /api/generate/script
 *
 * 1. Generates (or accepts) the voiceover script.
 * 2. Saves the script to the `videos` row and advances its status.
 *
 * Image generation is intentionally NOT done here — it happens later in the
 * main pipeline (see generate/[id]/page.tsx), independent of the script step.
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
    scriptMode = "ai",
    customScript = "",
    language = "English",
    generationMode = "stock_only",
  } = body as Record<string, string>;

  // Server-side plan enforcement
  const enforcement = await validateGenerationRequest(videoId, null, generationMode);
  if (!enforcement.allowed) {
    console.error("[Script Route] Plan enforcement failed:", enforcement.reason);
    return Response.json({ error: enforcement.reason }, { status: enforcement.reason === "Unauthorized" ? 401 : 403 });
  }

  // 1. Produce the script — user-supplied or generated.
  let script: string;
  let source: string;
  if (scriptMode === "upload" && customScript.trim()) {
    script = customScript.trim();
    source = "user";
  } else {
    ({ script, source } = await writeScript(topic, tone, length, format, language));
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

  return Response.json({ script, source });
}