"use client";

import { JsonLd } from "@/components/JsonLd";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const searchIndex = [
  {
    title: "AI Video Generation Guide 2024",
    url: "/blog/ai-video-generation-guide-2024",
    type: "Article",
    description: "Complete guide to creating YouTube videos with AI",
    tags: ["AI video", "YouTube automation", "content creation"],
  },
  {
    title: "Faceless YouTube Channel Blueprint",
    url: "/blog/faceless-youtube-channel-blueprint",
    type: "Article",
    description: "Step-by-step strategy for building a profitable faceless channel",
    tags: ["faceless channel", "YouTube monetization", "passive income"],
  },
  {
    title: "YouTube Shorts vs Long-Form Strategy",
    url: "/blog/youtube-shorts-vs-long-form-strategy",
    type: "Article",
    description: "Data-driven comparison of Shorts vs long-form content",
    tags: ["YouTube Shorts", "content strategy", "algorithm"],
  },
  {
    title: "AI Voiceover Tools Compared",
    url: "/blog/ai-voiceover-comparison-2024",
    type: "Article",
    description: "ElevenLabs vs PlayHT vs VersaVid voiceover comparison",
    tags: ["AI voiceover", "text-to-speech", "tools comparison"],
  },
  {
    title: "Pricing Plans",
    url: "/pricing",
    type: "Page",
    description: "Simple, transparent pricing for every creator",
    tags: ["pricing", "plans", "credits"],
  },
  {
    title: "Features Overview",
    url: "/features",
    type: "Page",
    description: "AI script, visuals, voiceover, captions, and multi-format support",
    tags: ["features", "AI script", "AI visuals", "voiceover", "captions"],
  },
  {
    title: "How It Works",
    url: "/how-it-works",
    type: "Page",
    description: "Topic to video in 3 steps",
    tags: ["workflow", "process", "automation"],
  },
  {
    title: "VersaVid vs Alternatives",
    url: "/compare",
    type: "Page",
    description: "Compare VersaVid vs Wistia, Vimeo, Mux, Synthesia, HeyGen, Pictory",
    tags: ["comparison", "alternatives", "competitors"],
  },
  {
    title: "Free Resources & Templates",
    url: "/resources",
    type: "Page",
    description: "Keyword research, content calendar, thumbnail templates, and more",
    tags: ["resources", "templates", "tools", "free"],
  },
];

export function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const results = query
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    : [];

  return (
    <>
      <form className="max-w-2xl mx-auto mb-16" role="search">
        <label htmlFor="search" className="sr-only">
          Search VersaVid
        </label>
        <div className="relative">
          <input
            id="search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search guides, features, pricing..."
            className="w-full h-14 pl-12 pr-6 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-[16px] focus:outline-none focus:border-white/25 transition-colors"
            autoComplete="off"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </form>

      {query && (
        <div className="mb-8 text-center text-[#a8aeb8]">
          <p>
            Showing <strong className="text-white">{results.length}</strong> result{results.length !== 1 ? "s" : ""} for{" "}
            <strong className="text-white">"{query}"</strong>
          </p>
        </div>
      )}

      {query ? (
        results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Link
                key={result.url}
                href={result.url}
                className="block group rounded-2xl p-6 glass border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-cyan-400 transition-colors text-[18px]"
                  >
                    {result.type === "Article" ? "📖" : "📄"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-medium text-white/60"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {result.type}
                      </span>
                      {result.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] text-white/50"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-[18px] font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">
                      {result.title}
                    </h3>
                    <p className="text-[#a8aeb8] leading-[1.5] line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                  <svg
                    className="flex-shrink-0 h-6 w-6 text-white/30 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-[24px] font-bold text-white mb-2">
              No results found
            </h2>
            <p className="text-[#a8aeb8] mb-8">
              Try different keywords or browse our categories below
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["AI video", "YouTube automation", "faceless channel", "Shorts", "monetization"].map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 rounded-full text-[13px] text-white/70 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Guides & Tutorials", href: "/blog", icon: "📖", count: "6 articles" },
            { title: "Features", href: "/features", icon: "✨", count: "6 core features" },
            { title: "Pricing", href: "/pricing", icon: "💰", count: "3 plans" },
            { title: "Compare Tools", href: "/compare", icon: "⚔️", count: "6 alternatives" },
            { title: "Free Resources", href: "/resources", icon: "🎁", count: "8 templates" },
            { title: "How It Works", href: "/how-it-works", icon: "🔄", count: "3 steps" },
          ].map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-2xl p-6 glass border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-[18px] font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {category.title}
                </h3>
              </div>
              <p className="text-[#a8aeb8] text-[14px]">{category.count}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}