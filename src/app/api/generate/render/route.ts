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
  };
  const seed = uid("render");
  void music;

  // Server-side plan enforcement
  const enforcement = await validateGenerationRequest(videoId, null, generationMode);
  if (!enforcement.allowed) {
    return Response.json({ error: enforcement.reason }, { status: enforcement.reason === "Unauthorized" ? 401 : 403 });
  }

  // Validate required assets for each generation mode BEFORE calling JSON2Video
  const footageList = footage as { url: string; poster?: string; duration?: number }[];
  const imagesList = images as string[];
  const clipsList = clips as { url: string; poster?: string; duration?: number }[];

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
    const footageList = footage as { url: string; poster?: string; duration?: number }[];
    scenes = footageList.map((clip) => ({
      elements: [{ type: "video", src: clip.url, duration: clip.duration ?? 5, resize: "cover" }],
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
        elements: [{ type: "video", src: clip.url, duration: clip.duration ?? 5, resize: "cover" }],
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
      const submitRes = await fetch("https://api.json2video.com/v2/movies", {
        method: "POST",
        headers: {
          "x-api-key": `${process.env.JSON2VIDEO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resolution: format === "16:9" ? "full-hd" : "custom",
          width: format === "16:9" ? 1920 : 1080,
          height: format === "16:9" ? 1080 : 1920,
          scenes,
          elements: cleanText
            ? [
                { type: "voice", text: cleanText, model: "elevenlabs", voice: voice, connection: "elevenlabs-main" },
                { type: "subtitles", language: "auto" },
              ]
            : [],
        }),
      });

      if (!submitRes.ok) {
        const errText = await submitRes.text().catch(() => "");
        console.error(`JSON2Video submit failed: ${submitRes.status} ${submitRes.statusText} — ${errText}`);
      } else {
        const submitData = await submitRes.json();
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

            if (!statusRes.ok) {
              console.error(`JSON2Video poll failed (attempt ${attempt + 1}): ${statusRes.status}`);
              continue;
            }

            const statusData = await statusRes.json();
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
  console.error(errorMsg);
  return Response.json({ error: errorMsg, source: "failed" }, { status: 500 });
}