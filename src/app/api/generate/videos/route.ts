import { hasRealKey } from "@/lib/utils";
import { mockClips } from "@/lib/ai/mock";
import { uid } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * POST /api/generate/videos — animates scenes into clips via fal.ai Kling.
 * Returns mock clips when FAL_KEY is not configured.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { images = [], style = "realistic" } = body as { images?: string[]; style?: string };
  const seed = uid("clip");
  const count = Math.max(1, Math.min(images.length || 4, 6));

  if (hasRealKey(process.env.FAL_KEY) && images.length) {
    try {
      const clips: { url: string; poster: string; duration: number }[] = [];
      for (const image of images.slice(0, 3)) {
        const res = await fetch("https://fal.run/fal-ai/kling-video/v1/standard/image-to-video", {
          method: "POST",
          headers: {
            Authorization: `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_url: image, prompt: `${style} subtle motion`, duration: "5" }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.video?.url) clips.push({ url: data.video.url, poster: image, duration: 5 });
        }
      }
      if (clips.length) return Response.json({ clips, source: "fal" });
    } catch {
      /* fall through */
    }
  }

  await new Promise((r) => setTimeout(r, 900));
  return Response.json({ clips: mockClips(seed, count), source: "mock" });
}
