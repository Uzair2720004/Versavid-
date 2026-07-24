"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function VideoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { videos } = useApp();

  const video = videos.find((v) => v.id === params?.id);

  if (!video) {
    return (
      <div className="p-8">
        <button onClick={() => router.push("/videos")} className="text-sm text-muted-foreground hover:underline">
          &larr; Back to My Videos
        </button>
        <div className="mt-8 text-center text-muted-foreground">
          Video not found. It may still be processing — check My Videos.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button onClick={() => router.push("/videos")} className="text-sm text-muted-foreground hover:underline">
        &larr; Back to My Videos
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
  );
}