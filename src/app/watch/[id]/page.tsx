import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { generateMetadata, structuredData } from "@/lib/seo/structured-data";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s}S`;
}

function getVideoData(id: string) {
  const mockVideos: Record<string, any> = {
    "demo-1": {
      id: "demo-1",
      title: "How AI is Changing Content Creation Forever",
      description:
        "Discover how artificial intelligence is revolutionizing the way creators produce content. From scriptwriting to video editing, AI tools are making it easier than ever to create high-quality content at scale.",
      thumbnail_url: "https://versavid.com/images/vid-1.jpg",
      video_url: "https://versavid.com/videos/demo-1.mp4",
      duration: 180,
      upload_date: "2024-01-15T10:00:00Z",
      tags: ["AI", "content creation", "YouTube automation", "video marketing"],
      topic: "AI content creation",
      status: "published",
      format: "16:9",
      script: "Welcome to today's video about AI content creation...",
    },
    "demo-2": {
      id: "demo-2",
      title: "5 YouTube Automation Tools That Actually Work",
      description:
        "Stop wasting time on manual video editing. These 5 AI-powered tools will automate your entire YouTube workflow from script to publish.",
      thumbnail_url: "https://versavid.com/images/vid-2.jpg",
      video_url: "https://versavid.com/videos/demo-2.mp4",
      duration: 245,
      upload_date: "2024-02-03T14:30:00Z",
      tags: ["YouTube automation", "AI tools", "video editing", "productivity"],
      topic: "YouTube automation tools",
      status: "published",
      format: "16:9",
      script: "If you're a YouTuber looking to save time...",
    },
  };

  return mockVideos[id];
}

export async function generateWatchMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const video = getVideoData(resolvedParams.id);

  if (!video) {
    return generateMetadata({
      title: "Video Not Found",
      description: "The video you're looking for doesn't exist or has been removed.",
      path: `/watch/${resolvedParams.id}`,
    });
  }

  return generateMetadata({
    title: video.title,
    description: video.description,
    path: `/watch/${resolvedParams.id}`,
    ogImage: video.thumbnail_url,
    ogType: "video.other",
  });
}

export { generateWatchMetadata as generateMetadata };

export default async function WatchPage({ params }: WatchPageProps) {
  const resolvedParams = await params;
  const video = getVideoData(resolvedParams.id);

  if (!video) {
    return (
      <div className="relative bg-black min-h-screen flex items-center justify-center">
        <Nav />
        <div className="text-center px-6">
          <h1 className="text-[32px] font-bold text-white mb-4">Video not found</h1>
          <p className="text-[#a8aeb8] mb-8">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black hover:bg-white/90 transition-colors"
          >
            Back to home
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const videoSchema = structuredData.videoObject({
    name: video.title,
    description: video.description,
    thumbnailUrl: [video.thumbnail_url],
    uploadDate: video.upload_date,
    duration: formatDuration(video.duration),
    contentUrl: video.video_url,
    embedUrl: `https://versavid.com/watch/${video.id}`,
    hasPart: [
      {
        "@type": "Clip",
        name: "Introduction",
        startOffset: "PT0S",
        endOffset: `PT${Math.min(30, video.duration)}S`,
        url: video.video_url ? `${video.video_url}#t=0,${Math.min(30, video.duration)}` : "",
      },
      {
        "@type": "Clip",
        name: "Main Content",
        startOffset: `PT${Math.min(30, video.duration)}S`,
        endOffset: `PT${video.duration}S`,
        url: video.video_url ? `${video.video_url}#t=${Math.min(30, video.duration)},${video.duration}` : "",
      },
    ],
  });

  return (
    <>
      <JsonLd data={[videoSchema, structuredData.organization()]} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16 pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <article className="video-page">
              <header className="mb-8">
                <div className="flex items-center gap-2 text-[12px] text-white/40 mb-4">
                  <time dateTime={video.upload_date}>
                    {new Date(video.upload_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{video.format}</span>
                  <span>·</span>
                  <span>{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}</span>
                </div>
                <h1 className="text-[32px] sm:text-[44px] font-bold leading-[1.1] text-white">
                  {video.title}
                </h1>
                <p className="mt-4 text-[#a8aeb8] leading-[1.6] max-w-3xl">
                  {video.description}
                </p>
              </header>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-8">
                <video
                  src={video.video_url}
                  poster={video.thumbnail_url}
                  controls
                  controlsList="nodownload noremoteplayback"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {video.script && (
                    <section>
                      <h2 className="text-[20px] font-bold text-white mb-4">Video Script</h2>
                      <div className="glass rounded-xl p-6 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-[#a8aeb8] leading-[1.7]">
                          {video.script}
                        </pre>
                      </div>
                    </section>
                  )}

                  <section>
                    <h2 className="text-[20px] font-bold text-white mb-4">Topics & Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full text-[12px] text-white/80"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[20px] font-bold text-white mb-4">Share this video</h2>
                    <div className="flex items-center gap-3">
                      <button
                        className="px-4 py-2 rounded-lg text-[13px] font-medium text-white/80 hover:text-white transition-colors"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                      >
                        Copy link
                      </button>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(video.title)}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-[13px] font-medium text-white/80 hover:text-white transition-colors"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        Share on X
                      </a>
                    </div>
                  </section>
                </div>

                <aside className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-[14px] font-bold text-white mb-4">Created with VersaVid</h3>
                    <p className="text-[#a8aeb8] text-[14px] mb-4">
                      This video was generated automatically from a single topic using AI.
                    </p>
                    <a
                      href="/signup"
                      className="block w-full text-center rounded-full bg-white px-4 py-3 text-[14px] font-semibold text-black hover:bg-white/90 transition-colors"
                    >
                      Create your own →
                    </a>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-[14px] font-bold text-white mb-4">Video Details</h3>
                    <dl className="space-y-3 text-[13px]">
                      <div className="flex justify-between">
                        <dt className="text-white/50">Format</dt>
                        <dd className="text-white font-medium">{video.format}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-white/50">Duration</dt>
                        <dd className="text-white font-medium">
                          {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-white/50">Published</dt>
                        <dd className="text-white font-medium">
                          {new Date(video.upload_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-white/50">Topic</dt>
                        <dd className="text-white font-medium">{video.topic}</dd>
                      </div>
                    </dl>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}