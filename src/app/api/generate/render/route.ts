import { hasRealKey } from "@/lib/utils";
import { mockRender } from "@/lib/ai/mock";
import { uid } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * POST /api/generate/render — assembles clips, voiceover, captions & music into
 * a final MP4 via Creatomate. Returns a mock render when CREATOMATE_API_KEY is
 * not configured.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    format = "9:16",
    clips = [],
    music = "uplifting",
  } = body as { format?: string; clips?: unknown[]; music?: string };
  const seed = uid("render");

  if (hasRealKey(process.env.CREATOMATE_API_KEY)) {
    try {
      const res = await fetch("https://api.creatomate.com/v1/renders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CREATOMATE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          output_format: "mp4",
          width: format === "16:9" ? 1920 : 1080,
          height: format === "16:9" ? 1080 : 1920,
          source: { elements: clips, music },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const render = Array.isArray(data) ? data[0] : data;
        if (render?.url) {
          return Response.json({
            video_url: render.url,
            thumbnail_url: render.snapshot_url ?? mockRender(seed, format).thumbnail_url,
            format,
            source: "creatomate",
          });
        }
      }
    } catch {
      /* fall through */
    }
  }

  await new Promise((r) => setTimeout(r, 1100));
  return Response.json({ ...mockRender(seed, format), source: "mock" });
}
