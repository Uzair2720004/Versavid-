import { generateImages } from "@/lib/ai/generate";

export const runtime = "nodejs";

/**
 * POST /api/generate/images — generates scene images via fal.ai Flux.
 * Falls back to deterministic placeholders when FAL_KEY is not configured.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { topic, style, count, format, prompts } = body as Record<string, unknown>;

  const { images, source } = await generateImages({
    topic: topic as string | undefined,
    style: style as string | undefined,
    count: count as number | undefined,
    format: format as string | undefined,
    prompts: prompts as string[] | undefined,
  });

  return Response.json({ images, source });
}
