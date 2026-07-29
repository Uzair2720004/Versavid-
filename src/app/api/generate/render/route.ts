import { hasRealKey } from "@/lib/utils";
import { mockRender } from "@/lib/ai/mock";
import { uid } from "@/lib/utils";
import { createServerSupabase } from "@/lib/supabase/server";
import { validateGenerationRequest, incrementFreeTierCount } from "@/lib/plan-enforcement";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    format = "9:16",
    clips = [],
    images = [],
    footage = [],
    generationMode = "ai_images_plus_ai_video",
    music = "uplifting",
    script = "",
    voice = "21m00Tcm4TlvDq8ikWAM",
    videoId = "",
    captionStyle = "clean",
  } = body as {
    format?: string;
    clips?: unknown[];
    images?: string[];
    footage?: unknown[];
    generationMode?: string;
    music?: string;
    script?: string;
    voice?: string;
    videoId?: string;
    captionStyle?: string;
  };
  const MUSIC_TRACKS: Record<string, string> = {
    uplifting: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/atlasaudio-inspiring-uplifting-511864.mp3",
    calm: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/leberch-calm-509384.mp3",
    dramatic: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/atlasaudio-suspense-dramatic-510580.mp3",
    background: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/andriig-background-music-566826.mp3",
  };

  const MUSIC_LIBRARY: Record<string, { label: string; url: string }[]> = {
    uplifting: [
      { label: "Inspiring Uplifting", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/atlasaudio-inspiring-uplifting-511864.mp3" },
      { label: "Uplifting", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/jonasblakewood-uplifting-562853.mp3" },
      { label: "Epic Uplifting", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/leberch-epic-uplifting-509714.mp3" },
    ],
    calm: [
      { label: "Calm 1", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/leberch-calm-509384.mp3" },
      { label: "Calm 2", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/prettyjohn1-calm-537656.mp3" },
      { label: "Calm 3", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/the_mountain-calm-507994.mp3" },
    ],
    dramatic: [
      { label: "Suspense Dramatic", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/atlasaudio-suspense-dramatic-510580.mp3" },
      { label: "Sad Dramatic", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/leberch-sad-dramatic-250863.mp3" },
      { label: "Dramatic 1", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/paulyudin-dramatic-482366.mp3" },
      { label: "Dramatic Music", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/paulyudin-dramatic-dramatic-music-513008.mp3" },
      { label: "Dramatic 2", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/prettyjohn1-dramatic-491632.mp3" },
      { label: "Dramatic Music 2", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/the_mountain-dramatic-dramatic-music-508006.mp3" },
    ],
    background: [
      { label: "Background 1", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/andriig-background-music-566826.mp3" },
      { label: "Background 2", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/bombinsound-background-music-version-3-560450.mp3" },
      { label: "Background 3", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/miromaxmusic-music-promotion-no-copyright-513944.mp3" },
      { label: "Background 4", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/nastelbom-background-music-463062.mp3" },
      { label: "Background 5", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/the_mountain-background-music-159125.mp3" },
    ],
  };
  const CAPTION_STYLES: Record<string, Record<string, unknown>> = {
    bold: {
      style: "classic",
      "font-size": 110,
      "outline-width": 8,
      "outline-color": "#000000",
      "line-color": "#FFFFFF",
      "word-color": "#FFFF00",
      "all-caps": true,
    },
    wordbyword: {
      style: "classic-one-word",
      "max-words-per-line": 1,
      "font-size": 130,
      "word-color": "#FFFF00",
      "line-color": "#FFFFFF",
    },
    clean: {
      style: "classic",
      "font-size": 80,
      "outline-width": 0,
      "line-color": "#FFFFFF",
      "word-color": "#FFFFFF",
    },
    glow: {
      style: "classic",
      "font-size": 100,
      "word-color": "#00E5FF",
      "line-color": "#FFFFFF",
      "shadow-color": "#00E5FF",
      "shadow-offset": 6,
      "outline-width": 0,
    },
    boxed: {
      style: "boxed-line",
      "font-size": 90,
      "box-color": "#000000",
      "line-color": "#FFFFFF",
      "word-color": "#FFFF00",
    },
    type: {
      style: "classic-progressive",
      "font-size": 90,
      "line-color": "#FFFFFF",
      "word-color": "#FFFF00",
    },
  };
  const seed = uid("render");

  // Server-side plan enforcement
  const enforcement = await validateGenerationRequest(videoId, null, generationMode);
  if (!enforcement.allowed) {
    return Response.json({ error: enforcement.reason }, { status: enforcement.reason === "Unauthorized" ? 401 : 403 });
  }

  // Validate required assets for each generation mode BEFORE calling JSON2Video
  const rawFootage = footage as { url: string; poster?: string; duration?: number }[];
  const imagesList = images as string[];
  const clipsList = clips as { url: string; poster?: string; duration?: number }[];

  // Filter out mock URLs from footage — JSON2Video can't download fake mock files
  const MOCK_PATTERN = "fal.media/files/mock";
  const cleanFootage = rawFootage.filter((c) => !c.url?.includes(MOCK_PATTERN));
  const mockCount = rawFootage.length - cleanFootage.length;

  if (mockCount > 0 && (generationMode === "stock_only" || generationMode === "stock_plus_ai_images")) {
    const realCount = cleanFootage.length;
    const totalCount = rawFootage.length;

    if (realCount >= 2 && realCount >= totalCount / 2) {
      console.error(`[Render Route] Filtered out ${mockCount}/${totalCount} mock scenes (${realCount} real scenes remaining)`);
    } else {
      const errorMsg = `Stock footage retrieval incomplete: ${mockCount}/${totalCount} scenes are mock URLs. Only ${realCount} real scenes available, which is insufficient for a render.`;
      console.error(`[Render Route] ${errorMsg}`);
      return Response.json({ error: errorMsg, source: "validation" }, { status: 400 });
    }
  }

  const footageList = cleanFootage;

  let missingAssetError: string | null = null;
  if (generationMode === "stock_only" || generationMode === "stock_plus_ai_images") {
    if (!footageList || footageList.length === 0) {
      missingAssetError = `No stock footage provided for generation mode "${generationMode}". Stock footage retrieval likely returned zero results.`;
    }
  } else if (generationMode === "ai_images_only") {
    if (!imagesList || imagesList.length === 0) {
      missingAssetError = `No AI images provided for generation mode "ai_images_only". Image generation likely failed.`;
    }
  } else if (generationMode === "ai_images_plus_ai_video") {
    if ((!clipsList || clipsList.length === 0) && (!imagesList || imagesList.length === 0)) {
      missingAssetError = `No AI clips or images provided for generation mode "ai_images_plus_ai_video". Both clip and image generation failed.`;
    }
  }

  if (missingAssetError) {
    console.error(`[Render Route] Validation failed for mode "${generationMode}": ${missingAssetError}`);
    console.error(`[Render Route] Received body keys:`, Object.keys(body));
    console.error(`[Render Route] footage length: ${footageList?.length ?? 0}, clips length: ${clipsList?.length ?? 0}, images length: ${imagesList?.length ?? 0}`);
    return Response.json({ error: missingAssetError, source: "validation" }, { status: 400 });
  }

  // Build scenes based on generationMode
  let scenes: { elements: { type: string; src: string; duration?: number; resize?: string; zoom?: number }[] }[] = [];

  if (generationMode === "stock_only" || generationMode === "stock_plus_ai_images") {
    // Use stock footage (video) for all scenes
    scenes = footageList.map((clip) => ({
      elements: [{ type: "video", src: clip.url, duration: Math.min(clip.duration ?? 5, 5), resize: "cover" }],
    }));
  } else if (generationMode === "ai_images_only") {
    // Use AI-generated images as stills
    scenes = (images as string[]).map((img) => ({
      elements: [{ type: "image", src: img, duration: 4, resize: "cover", zoom: 2 }],
    }));
  } else {
    // ai_images_plus_ai_video: use clips first, then leftover images as stills
    const clipList = clips as { url: string; poster?: string; duration?: number }[];
    const leftoverImages = (images as string[]).slice(clipList.length);
    scenes = [
      ...clipList.map((clip) => ({
        elements: [{ type: "video", src: clip.url, duration: Math.min(clip.duration ?? 5, 5), resize: "cover" }],
      })),
      ...leftoverImages.map((img) => ({
        elements: [{ type: "image", src: img, duration: 4, resize: "cover", zoom: 2 }],
      })),
    ];
  }

  const cleanText = script
    .replace(/\[[^\]]+\]/g, "")
    .replace(/[#*_`>]/g, "")
    .replace(/\n{2,}/g, " ")
    .trim();

  if (hasRealKey(process.env.JSON2VIDEO_API_KEY)) {
    try {
      const requestPayload = {
        resolution: format === "16:9" ? "full-hd" : "custom",
        width: format === "16:9" ? 1920 : 1080,
        height: format === "16:9" ? 1080 : 1920,
        scenes,
        elements: cleanText
          ? [
              { type: "voice", text: cleanText, model: "elevenlabs", voice: voice, connection: "elevenlabs-main" },
              { type: "subtitles", language: "auto", settings: CAPTION_STYLES[captionStyle] ?? CAPTION_STYLES.clean },
              { type: "audio", src: MUSIC_TRACKS[music] ?? MUSIC_TRACKS.uplifting, volume: 0.15, loop: true },
            ]
          : [],
      };
      console.error("JSON2Video SUBMIT REQUEST:", JSON.stringify(requestPayload, null, 2));
      const submitRes = await fetch("https://api.json2video.com/v2/movies", {
        method: "POST",
        headers: {
          "x-api-key": `${process.env.JSON2VIDEO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const submitResText = await submitRes.text();
      console.error("JSON2Video SUBMIT RESPONSE:", {
        status: submitRes.status,
        statusText: submitRes.statusText,
        body: submitResText,
      });

      if (!submitRes.ok) {
        console.error(`JSON2Video submit failed: ${submitRes.status} ${submitRes.statusText} — ${submitResText}`);
      } else {
        const submitData = JSON.parse(submitResText);
        const projectId = submitData?.project;

        if (!projectId) {
          console.error("JSON2Video submit succeeded but returned no project id:", JSON.stringify(submitData));
        } else {
          const maxAttempts = 24;
          let lastStatus = "unknown";
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await new Promise((r) => setTimeout(r, 5000));

            const statusRes = await fetch(
              `https://api.json2video.com/v2/movies?project=${projectId}`,
              { headers: { "x-api-key": `${process.env.JSON2VIDEO_API_KEY}` } }
            );

            const statusResText = await statusRes.text();
            console.error("JSON2Video POLL RESPONSE:", {
              attempt: attempt + 1,
              status: statusRes.status,
              statusText: statusRes.statusText,
              body: statusResText,
            });

            if (!statusRes.ok) {
              console.error(`JSON2Video poll failed (attempt ${attempt + 1}): ${statusRes.status} ${statusRes.statusText} — ${statusResText}`);
              continue;
            }

            const statusData = JSON.parse(statusResText);
            const movie = statusData?.movie;
            lastStatus = movie?.status ?? "no-status";

            if (movie?.status === "done" && movie?.url) {
              // Increment free tier counter for successful renders
              if (enforcement.userId && enforcement.plan === "free") {
                incrementFreeTierCount(enforcement.userId).catch(console.error);
              }
              return Response.json({
                video_url: movie.url,
                thumbnail_url: mockRender(seed, format).thumbnail_url,
                format,
                source: "json2video",
              });
            }

            if (movie?.status === "error") {
              console.error("JSON2Video render error:", movie?.message);
              break;
            }
          }
          console.error(`JSON2Video render did not complete after ${maxAttempts} polls. Last status: ${lastStatus}, project: ${projectId}`);
        }
      }
    } catch (err) {
      console.error("JSON2Video render threw an exception:", err);
    }
  } else {
    console.error("JSON2VIDEO_API_KEY missing or invalid — using mock render.");
  }

  // If we reach here, real render failed — return error instead of mock
  const errorMsg = "JSON2Video render failed or timed out. No valid video URL returned.";
  console.error("JSON2Video render failed (500):", {
    message: errorMsg,
    generationMode,
    format,
    scenesCount: scenes.length,
    hasScript: !!cleanText,
    hasJson2VideoKey: hasRealKey(process.env.JSON2VIDEO_API_KEY),
  });
  return Response.json({ error: errorMsg, source: "failed" }, { status: 500 });
}