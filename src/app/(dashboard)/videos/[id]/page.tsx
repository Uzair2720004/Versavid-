"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { JsonLd } from "@/components/JsonLd";
import { structuredData } from "@/lib/seo/structured-data";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s}S`;
}

function VideoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { videos } = useApp();

  const video = videos.find((v) => v.id === params?.id);

  if (!video) {
    return (
      <div className="p-8">
        <button
          onClick={() => router.push("/videos")}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to My Videos
        </button>
        <div className="mt-8 text-center text-muted-foreground">
          Video not found. It may still be processing — check My Videos.
        </div>
      </div>
    );
  }

  const videoSchema = structuredData.videoObject({
    name: video.title,
    description: video.script || `AI-generated video about ${video.topic}`,
    thumbnailUrl: [video.thumbnail_url || "https://versavid.com/images/og-default.jpg"],
    uploadDate: video.created_at || new Date().toISOString(),
    duration: formatDuration(video.duration || 0),
    contentUrl: video.video_url || undefined,
    embedUrl: `https://versavid.com/watch/${video.id}`,
    hasPart: [
      {
        "@type": "Clip",
        name: "Introduction",
        startOffset: "PT0S",
        endOffset: `PT${Math.min(30, video.duration || 60)}S`,
        url: video.video_url ? `${video.video_url}#t=0,${Math.min(30, video.duration || 60)}` : "",
      },
      {
        "@type": "Clip",
        name: "Main Content",
        startOffset: `PT${Math.min(30, video.duration || 60)}S`,
        endOffset: `PT${video.duration || 60}S`,
        url: video.video_url ? `${video.video_url}#t=${Math.min(30, video.duration || 60)},${video.duration || 60}` : "",
      },
    ],
  });

  return (
    <>
      <JsonLd data={[videoSchema, structuredData.organization()]} />
      <div className="p-8 max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/videos")}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to My Videos
        </button>

        <h1 className="text-2xl font-semibold mt-4">{video.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {video.status} · {video.format} · {video.duration}s · {video.credits_used} credits
        </p>

        <div className="mt-6 rounded-lg overflow-hidden bg-black flex justify-center">
          {video.video_url ? (
            <video
              src={video.video_url}
              poster={video.thumbnail_url ?? undefined}
              controls
              className="max-h-[80vh] w-auto"
            />
          ) : (
            <div className="p-16 text-center text-muted-foreground">
              No video file available yet. Status: {video.status}
            </div>
          )}
        </div>

        {video.script && (
          <div className="mt-6">
            <h2 className="text-sm font-medium mb-2">Script</h2>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/30 rounded-md p-4">
              {video.script}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}

export default VideoDetailPage;