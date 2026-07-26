import { hasRealKey, uid } from "@/lib/utils";
import { mockImages } from "@/lib/ai/mock";

export interface GenerateImagesInput {
  topic?: string;
  style?: string;
  count?: number;
  format?: string;
  prompts?: string[];
}

export interface GeneratedImages {
  images: string[];
  source: "fal" | "mock";
}

/**
 * Generates scene images via fal.ai Flux, falling back to deterministic
 * placeholders when FAL_KEY is not configured.
 *
 * If `prompts` is provided (one string per scene, parsed from the actual
 * script), each image is generated from its own scene's content. Otherwise
 * falls back to `count` copies of a generic topic-based prompt.
 */
export async function generateImages(input: GenerateImagesInput): Promise<GeneratedImages> {
  const { topic = "scene", style = "photoreal", count = 5, format = "9:16", prompts } = input;
  const scenePrompts = prompts && prompts.length ? prompts : Array.from({ length: Number(count) || 5 }, () => topic);
  const n = scenePrompts.length;

  if (hasRealKey(process.env.FAL_KEY)) {
    try {
      const size = format === "16:9" ? "landscape_16_9" : "portrait_16_9";

      const results = await Promise.all(
        scenePrompts.map(async (scenePrompt) => {
          try {
            const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
              method: "POST",
              headers: {
                Authorization: `Key ${process.env.FAL_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: `${style} style cinematic shot illustrating: ${scenePrompt}`,
                image_size: size,
                num_images: 1,
              }),
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data?.images?.[0]?.url ?? null;
          } catch {
            return null;
          }
        })
      );

      const allImages = results.filter((u): u is string => !!u);
      if (allImages.length) return { images: allImages, source: "fal" };
    } catch {
      /* fall through to mock */
    }
  }

  await new Promise((r) => setTimeout(r, 700));
  return { images: mockImages(uid("img"), n), source: "mock" };
}