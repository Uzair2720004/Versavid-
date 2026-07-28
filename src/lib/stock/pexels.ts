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

  // Debug: log whether Pexels API key is configured
  const pexelsKey = process.env.PEXELS_API_KEY;
  console.error("[Pexels Debug] PEXELS_API_KEY present:", !!pexelsKey);
  console.error("[Pexels Debug] PEXELS_API_KEY length:", pexelsKey?.length ?? 0);
  console.error("[Pexels Debug] PEXELS_API_KEY isRealKey:", hasRealKey(pexelsKey));
  console.error("[Pexels Debug] Scene texts count:", sceneTexts?.length);
  console.error("[Pexels Debug] Type:", type);

  // If no scene texts, fall back to mock immediately
  if (!sceneTexts || sceneTexts.length === 0) {
    await new Promise((r) => setTimeout(r, 300));
    return {
      footage: mockStockFootage(seed, 3, type),
      source: "mock",
    };
  }

  if (hasRealKey(pexelsKey)) {
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
            console.error(`[Pexels Debug] Scene ${i}: Falling back to MOCK for query "${primaryQuery}"`);
            result = type === "video"
              ? { url: `https://v3.fal.media/files/mock/${seed}-${i}.mp4`, poster: placeholderImage(`${seed}-${i}`, 720, 1280), duration: 5 }
              : { url: placeholderImage(`${seed}-${i}`, 1080, 1920), poster: placeholderImage(`${seed}-${i}`, 720, 1280), duration: 4 };
          } else {
            console.error(`[Pexels Debug] Scene ${i}: Using REAL Pexels result for query "${primaryQuery}"`);
          }

          return result;
        })
      );

      // Check if any results are mock (contain fal.media/mock or placeholderImage)
      const mockCount = results.filter(r => r.url?.includes("fal.media/files/mock") || r.url?.includes("placeholder")).length;
      if (mockCount > 0) {
        console.error(`[Pexels Debug] ${mockCount}/${results.length} scenes fell back to MOCK — overall source reported as "pexels" but contains mock URLs`);
      } else {
        console.error(`[Pexels Debug] Using REAL Pexels results for all ${results.length} scenes`);
      }

      return { footage: results, source: "pexels" };
    } catch (err) {
      console.error("[Pexels Debug] searchStockFootage caught error:", err);
      await new Promise((r) => setTimeout(r, 500));
      return {
        footage: mockStockFootage(seed, sceneTexts.length, type),
        source: "mock",
      };
    }
  }

  await new Promise((r) => setTimeout(r, 500));
  console.error("[Pexels Debug] Falling back to MOCK — reason: PEXELS_API_KEY missing or invalid");
  return {
    footage: mockStockFootage(seed, sceneTexts.length, type),
    source: "mock",
  };
}

// Keep the helper functions for internal use
async function fetchPexelsVideo(key: string, query: string): Promise<StockFootageClip | null> {
  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
    { headers: { Authorization: `${key}` } }
  );
  const bodyText = await res.text();
  console.error("[Pexels Video] Response status:", res.status);
  console.error("[Pexels Video] Response body (first 500 chars):", bodyText.slice(0, 500));
  if (!res.ok) return null;
  const data = JSON.parse(bodyText);
  console.error("[Pexels Video] Total results:", data?.total_results ?? 0);
  const video = data?.videos?.[0];
  if (!video?.video_files?.[0]?.link) return null;
  return {
    url: video.video_files[0].link,
    poster: video.image,
    duration: video.duration,
  };
}

async function searchPexelsVideo(query: string): Promise<StockFootageClip | null> {
  const rawKey = process.env.PEXELS_API_KEY;
  if (!hasRealKey(rawKey)) return null;
  const key: string = rawKey!;

  try {
    console.error("[Pexels Video] Search query:", query);
    let result = await fetchPexelsVideo(key, query);

    // Retry once after 500ms on any failure (transient 401, rate-limit, etc.)
    if (!result) {
      console.error("[Pexels Video] First attempt failed, retrying after 500ms...");
      await new Promise((r) => setTimeout(r, 500));
      result = await fetchPexelsVideo(key, query);
    }

    return result;
  } catch (err) {
    console.error("[Pexels Video] Fetch error:", err);
    return null;
  }
}

async function fetchPexelsPhoto(key: string, query: string): Promise<StockFootageClip | null> {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
    { headers: { Authorization: `${key}` } }
  );
  const bodyText = await res.text();
  console.error("[Pexels Photo] Response status:", res.status);
  console.error("[Pexels Photo] Response body (first 500 chars):", bodyText.slice(0, 500));
  if (!res.ok) return null;
  const data = JSON.parse(bodyText);
  console.error("[Pexels Photo] Total results:", data?.total_results ?? 0);
  const photo = data?.photos?.[0];
  if (!photo?.src?.original) return null;
  return {
    url: photo.src.original,
    poster: photo.src.large,
  };
}

async function searchPexelsPhoto(query: string): Promise<StockFootageClip | null> {
  const rawKey = process.env.PEXELS_API_KEY;
  if (!hasRealKey(rawKey)) return null;
  const key: string = rawKey!;

  try {
    console.error("[Pexels Photo] Search query:", query);
    let result = await fetchPexelsPhoto(key, query);

    // Retry once after 500ms on any failure (transient 401, rate-limit, etc.)
    if (!result) {
      console.error("[Pexels Photo] First attempt failed, retrying after 500ms...");
      await new Promise((r) => setTimeout(r, 500));
      result = await fetchPexelsPhoto(key, query);
    }

    return result;
  } catch (err) {
    console.error("[Pexels Photo] Fetch error:", err);
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