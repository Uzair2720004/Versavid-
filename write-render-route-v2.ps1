$code = @'
import { hasRealKey } from "@/lib/utils";
import { mockRender } from "@/lib/ai/mock";
import { uid } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * POST /api/generate/render — assembles clips, images, voiceover (ElevenLabs
 * via JSON2Video connection), captions & music into a final MP4 via
 * JSON2Video. Returns a mock render when JSON2VIDEO_API_KEY is not configured.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    format = "9:16",
    clips = [],
    images = [],
    music = "uplifting",
    script = "",
  } = body as {
    format?: string;
    clips?: unknown[];
    images?: string[];
    music?: string;
    script?: string;
  };
  const seed = uid("render");
  void music; // temporarily unused — see TODO below

  if (hasRealKey(process.env.JSON2VIDEO_API_KEY)) {
    try {
      const clipList = clips as { url: string; poster?: string; duration?: number }[];
      const leftoverImages = (images as string[]).slice(clipList.length);

      const scenes = [
        ...clipList.map((clip) => ({
          elements: [
            {
              type: "video",
              src: clip.url,
              duration: clip.duration ?? 5,
              resize: "cover",
            },
          ],
        })),
        ...leftoverImages.map((img) => ({
          elements: [
            {
              type: "image",
              src: img,
              duration: 4,
              resize: "cover",
              zoom: 2,
            },
          ],
        })),
      ];

      const cleanText = script
        .replace(/\[[^\]]+\]/g, "")
        .replace(/[#*_`>]/g, "")
        .replace(/\n{2,}/g, " ")
        .trim();

      // 1. Submit the render job
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
                {
                  type: "voice",
                  text: cleanText,
                  model: "elevenlabs",
                  voice: "Rachel",
                  connection: "elevenlabs-main",
                },
                {
                  type: "subtitles",
                  language: "auto",
                },
              ]
            : [],
          // TODO: music is currently a style label ("uplifting"), not a real
          // audio file URL. Map labels to hosted royalty-free MP3 URLs before
          // re-enabling this. Disabled for now so the core pipeline can be tested.
          // ...(music
          //   ? { elements: [{ type: "audio", src: music }] }
          //   : {}),
        }),
      });

      if (submitRes.ok) {
        const submitData = await submitRes.json();
        const projectId = submitData?.project;

        if (projectId) {
          // 2. Poll for completion (every 5s, up to ~2 minutes)
          const maxAttempts = 24;
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await new Promise((r) => setTimeout(r, 5000));

            const statusRes = await fetch(
              `https://api.json2video.com/v2/movies?project=${projectId}`,
              {
                headers: {
                  "x-api-key": `${process.env.JSON2VIDEO_API_KEY}`,
                },
              }
            );

            if (!statusRes.ok) continue;

            const statusData = await statusRes.json();
            const movie = statusData?.movie;

            if (movie?.status === "done" && movie?.url) {
              return Response.json({
                video_url: movie.url,
                thumbnail_url: mockRender(seed, format).thumbnail_url,
                format,
                source: "json2video",
              });
            }

            if (movie?.status === "error") {
              console.error("JSON2Video render error:", movie?.message);
              break; // fall through to mock
            }
            // else status is "queued" or "processing" — keep polling
          }
        }
      }
    } catch {
      /* fall through */
    }
  }

  await new Promise((r) => setTimeout(r, 1100));
  return Response.json({ ...mockRender(seed, format), source: "mock" });
}
'@

Set-Content "src\app\api\generate\render\route.ts" $code -NoNewline
Write-Host "Done. File rewritten with resize + ElevenLabs + text cleanup."