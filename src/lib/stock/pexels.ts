import { hasRealKey, uid, placeholderImage } from "@/lib/utils";

export interface StockFootageClip {
  url: string;
  poster?: string;
  duration?: number;
}

export interface SearchStockFootageInput {
  sceneTexts: string[];
  type: "video" | "photo";
  topic?: string;
}

function extractKeywords(text: string, topic?: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .filter(
      (w) =>
        ![
          "the",
          "and",
          "for",
          "with",
          "this",
          "that",
          "from",
          "will",
          "your",
          "about",
          "what",
          "when",
          "where",
          "how",
          "why",
          "who",
          "which",
        ].includes(w)
    );
  const keywords = words.slice(0, 4);
  // If no keywords extracted, fall back to topic or generic terms
  if (keywords.length === 0 && topic) {
    return topic.toLowerCase().split(/\s+/).filter((w) => w.length > 2).slice(0, 4);
  }
  return keywords.length > 0 ? keywords : ["abstract", "concept", "visual", "scene"];
}

export async function searchStockFootage(
  sceneTexts: string[],
  type: "video" | "photo",
  topic?: string
): Promise<{ footage: StockFootageClip[]; source: "pexels" | "mock" }> {
  const seed = uid("footage");

  // If no scene texts, fall back to mock immediately
  if (!sceneTexts || sceneTexts.length === 0) {
    await new Promise((r) => setTimeout(r, 300));
    return {
      footage: mockStockFootage(seed, 3, type),
      source: "mock",
    };
  }

  if (hasRealKey(process.env.PEXELS_API_KEY)) {
    try {
      const results = await Promise.all(
        sceneTexts.map(async (sceneText, i) => {
          // Try primary query from scene text
          const keywords = extractKeywords(sceneText);
          const primaryQuery = keywords.length ? keywords.join(" ") : (topic ?? "abstract");
          let result = type === "video"
            ? await searchPexelsVideo(primaryQuery)
            : await searchPexelsPhoto(primaryQuery);

          // Try topic fallback if primary failed
          if (!result && topic && keywords.length) {
            result = type === "video"
              ? await searchPexelsVideo(topic)
              : await searchPexelsPhoto(topic);
          }

          // Fall back to mock for this specific scene
          if (!result) {
            result = type === "video"
              ? { url: `https://v3.fal.media/files/mock/${seed}-${i}.mp4`, poster: placeholderImage(`${seed}-${i}`, 720, 1280), duration: 5 }
              : { url: placeholderImage(`${seed}-${i}`, 1080, 1920), poster: placeholderImage(`${seed}-${i}`, 720, 1280), duration: 4 };
          }

          return result;
        })
      );

      // results always has same length as sceneTexts, no filtering
      return { footage: results, source: "pexels" };
    } catch {
      /* fall through to full mock */
    }
  }

  await new Promise((r) => setTimeout(r, 500));
  return {
    footage: mockStockFootage(seed, sceneTexts.length, type),
    source: "mock",
  };
}

// Keep the helper functions for internal use
async function searchPexelsVideo(query: string): Promise<StockFootageClip | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!hasRealKey(key)) return null;

  try {
    console.error("[Pexels Video] Search query:", query);
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
      { headers: { Authorization: key! } }
    );
    console.error("[Pexels Video] Response status:", res.status);
    const bodyText = await res.text();
    console.error("[Pexels Video] Response body (first 500 chars):", bodyText.slice(0, 500));
    const data = JSON.parse(bodyText);
    if (!res.ok) return null;
    const video = data?.videos?.[0];
    if (!video?.video_files?.[0]?.link) return null;
    return {
      url: video.video_files[0].link,
      poster: video.image,
      duration: video.duration,
    };
  } catch {
    return null;
  }
}

async function searchPexelsPhoto(query: string): Promise<StockFootageClip | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!hasRealKey(key)) return null;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
      { headers: { Authorization: key! } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data?.photos?.[0];
    if (!photo?.src?.original) return null;
    return {
      url: photo.src.original,
      poster: photo.src.large,
    };
  } catch {
    return null;
  }
}

function mockStockFootage(
  seed: string,
  count: number,
  type: "video" | "photo"
): StockFootageClip[] {
  const durations = [4, 5, 6, 7, 8];
  return Array.from({ length: count }, (_, i) => {
    const s = `${seed}-${i}`;
    const duration = durations[i % durations.length];
    return type === "video"
      ? {
          url: `https://v3.fal.media/files/mock/${s}.mp4`,
          poster: placeholderImage(s, 720, 1280),
          duration,
        }
      : {
          url: placeholderImage(s, 1080, 1920),
          poster: placeholderImage(s, 720, 1280),
          duration: 4,
        };
  });
}