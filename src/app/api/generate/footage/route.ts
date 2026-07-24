import { searchStockFootage } from "@/lib/stock/pexels";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { sceneTexts = [], type = "video", topic } = body as {
    sceneTexts?: string[];
    type?: "video" | "photo";
    topic?: string;
  };

  const { footage, source } = await searchStockFootage(sceneTexts, type, topic);

  return Response.json({ footage, source });
}