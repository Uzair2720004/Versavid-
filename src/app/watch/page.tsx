import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { generateMetadata, structuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateMetadata({
  title: "Watch — VersaVid AI Generated Videos",
  description: "Watch AI-generated YouTube videos created with VersaVid. From faceless channels to educational content.",
  path: "/watch",
  ogImage: "/images/og-watch.jpg",
});

export default function WatchIndexPage() {
  return (
    <>
      <JsonLd data={structuredData.organization()} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16 pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Watch" }]} />

            <header className="text-center mb-16">
              <h1 className="text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">
                Featured Videos
              </h1>
              <p className="mt-4 text-[#a8aeb8] max-w-2xl mx-auto">
                Explore videos created with VersaVid. All generated from a single topic using AI.
              </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video) => (
                <article key={video.id} className="group rounded-2xl overflow-hidden glass border border-white/10 hover:border-white/20 transition-all">
                  <Link href={`/watch/${video.id}`} className="block">
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-transparent group-hover:from-cyan-500/30 group-hover:via-fuchsia-500/20 transition-all duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="glass-strong rounded-full px-6 py-3 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Watch video
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-white/40 mb-2">
                        <time dateTime={video.uploadDate}>
                          {new Date(video.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                        <span>·</span>
                        <span>{video.format}</span>
                        <span>·</span>
                        <span>{video.duration}</span>
                      </div>
                      <h3 className="text-[18px] font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-[#a8aeb8] text-[14px] leading-[1.5] line-clamp-2">
                        {video.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {video.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded text-[10px] text-white/50"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-16 text-center">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[16px] font-semibold text-black hover:bg-white/90 transition-colors"
              >
                Create your own AI video →
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

const featuredVideos = [
  {
    id: "demo-1",
    title: "How to Create Faceless YouTube Videos with AI",
    description: "Complete tutorial on using VersaVid to automate faceless channel content creation from script to publish.",
    thumbnail: "/images/video-thumbnails/demo-1.jpg",
    videoUrl: "/videos/demo-1.mp4",
    duration: "5:30",
    format: "16:9",
    uploadDate: "2024-01-15T10:00:00Z",
    tags: ["AI video", "YouTube automation", "faceless channel", "tutorial"],
  },
  {
    id: "demo-2",
    title: "VersaVid Demo: Topic to Video in 3 Minutes",
    description: "Watch VersaVid create a complete YouTube video from a single topic prompt. No editing required.",
    thumbnail: "/images/video-thumbnails/demo-2.jpg",
    videoUrl: "/videos/demo-2.mp4",
    duration: "3:15",
    format: "16:9",
    uploadDate: "2024-01-10T10:00:00Z",
    tags: ["demo", "AI video generation", "VersaVid", "product demo"],
  },
  {
    id: "demo-3",
    title: "5 YouTube Shorts Ideas for Faceless Channels",
    description: "Quick Shorts concepts you can generate with AI today. High retention, low effort.",
    thumbnail: "/images/video-thumbnails/demo-3.jpg",
    videoUrl: "/videos/demo-3.mp4",
    duration: "0:58",
    format: "9:16",
    uploadDate: "2024-01-05T10:00:00Z",
    tags: ["YouTube Shorts", "faceless", "content ideas", "vertical video"],
  },
];