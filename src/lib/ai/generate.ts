import { hasRealKey, uid } from "@/lib/utils";
import { mockImages } from "@/lib/ai/mock";

export interface GenerateImagesInput {
  topic?: string;
  style?: string;
  count?: number;
  format?: string;
}

export interface GeneratedImages {
  images: string[];
  source: "fal" | "mock";
}

/**
 * Generates scene images via fal.ai Flux, falling back to deterministic
 * placeholders when FAL_KEY is not configured.
 *
 * Shared by `POST /api/generate/images` and by the script route, which kicks
 * off image generation as soon as the script has been saved so the pipeline
 * keeps moving without a second client round-trip.
 */
export async function generateImages(input: GenerateImagesInput): Promise<GeneratedImages> {
  const { topic = "scene", style = "photoreal", count = 5, format = "9:16" } = input;
  const n = Number(count) || 5;

  if (hasRealKey(process.env.FAL_KEY)) {
    try {
      const size = format === "16:9" ? "landscape_16_9" : "portrait_16_9";
      const batchSize = 4;
      const allImages: string[] = [];

      for (let i = 0; i < n; i += batchSize) {
        const remaining = Math.min(batchSize, n - i);
        const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
          method: "POST",
          headers: {
            Authorization: `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `${style} style cinematic shot illustrating: ${topic}`,
            image_size: size,
            num_images: remaining,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const images = (data?.images ?? []).map((i: { url: string }) => i.url);
          allImages.push(...images);
        } else {
          break;
        }
      }

      if (allImages.length) return { images: allImages, source: "fal" };
    } catch {
      /* fall through to mock */
    }
  }

  await new Promise((r) => setTimeout(r, 700));
  return { images: mockImages(uid("img"), n), source: "mock" };
}
