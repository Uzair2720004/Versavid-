import { searchStockFootage } from "@/lib/stock/pexels";
import { createServerSupabase } from "@/lib/supabase/server";
import { validateGenerationRequest } from "@/lib/plan-enforcement";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { sceneTexts = [], type = "video", topic, videoId = "", generationMode = "stock_only" } = body as {
    sceneTexts?: string[];
    type?: "video" | "photo";
    topic?: string;
    videoId?: string;
    generationMode?: string;
  };

  console.error("[Footage Route] Received sceneTexts count:", sceneTexts?.length);
  console.error("[Footage Route] Scene texts:", sceneTexts);
  console.error("[Footage Route] Type:", type);
  console.error("[Footage Route] Topic:", topic);

  // Server-side plan enforcement
  const enforcement = await validateGenerationRequest(videoId, null, generationMode);
  if (!enforcement.allowed) {
    console.error("[Footage Route] Plan enforcement failed:", enforcement.reason);
    return Response.json({ error: enforcement.reason }, { status: enforcement.reason === "Unauthorized" ? 401 : 403 });
  }

  const { footage, source } = await searchStockFootage(sceneTexts, type, topic);

  console.error("[Footage Route] Returning footage count:", footage.length, "source:", source);
  return Response.json({ footage, source });
}