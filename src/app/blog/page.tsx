import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { generateMetadata, structuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateMetadata({
  title: "Blog — YouTube Automation & AI Video Guides",
  description:
    "Learn how to grow your YouTube channel with AI video automation. Tutorials, strategies, and case studies for faceless channels, Shorts, and content scaling.",
  path: "/blog",
  ogImage: "/images/og-blog.jpg",
});

const blogPosts = [
  {
    slug: "ai-video-generation-guide-2024",
    title: "Complete Guide to AI Video Generation for YouTube in 2024",
    excerpt:
      "Everything you need to know about creating YouTube videos with AI — from script writing to voiceovers, visuals, and publishing automation.",
    category: "Guide",
    readTime: "12 min read",
    date: "2024-01-15",
    image: "/images/blog/ai-video-guide.jpg",
    tags: ["AI video", "YouTube automation", "content creation"],
  },
  {
    slug: "faceless-youtube-channel-blueprint",
    title: "Faceless YouTube Channel Blueprint: $10K/Month Without Showing Your Face",
    excerpt:
      "Step-by-step strategy for building a profitable faceless YouTube channel using AI tools. Niche selection, content strategy, and monetization.",
    category: "Strategy",
    readTime: "15 min read",
    date: "2024-01-08",
    image: "/images/blog/faceless-blueprint.jpg",
    tags: ["faceless channel", "YouTube monetization", "passive income"],
  },
  {
    slug: "youtube-shorts-vs-long-form-strategy",
    title: "YouTube Shorts vs Long-Form: The 2024 Strategy for Maximum Growth",
    excerpt:
      "Data-driven comparison of Shorts vs long-form content. When to use each, how to repurpose, and the hybrid strategy top creators use.",
    category: "Strategy",
    readTime: "10 min read",
    date: "2024-01-02",
    image: "/images/blog/shorts-vs-longform.jpg",
    tags: ["YouTube Shorts", "content strategy", "algorithm"],
  },
  {
    slug: "ai-voiceover-comparison-2024",
    title: "Best AI Voiceover Tools Compared: ElevenLabs vs PlayHT vs Versavid",
    excerpt:
      "In-depth comparison of the top AI voice generators for YouTube. Quality, pricing, features, and which one fits your workflow.",
    category: "Review",
    readTime: "8 min read",
    date: "2023-12-28",
    image: "/images/blog/voiceover-comparison.jpg",
    tags: ["AI voiceover", "text-to-speech", "tools comparison"],
  },
  {
    slug: "youtube-retention-tips-ai",
    title: "10 YouTube Retention Hacks (And How AI Automates Them)",
    excerpt:
      "The retention strategies top 1% creators use — and how to automate them with AI. Hooks, pacing, pattern interrupts, and more.",
    category: "Tips",
    readTime: "9 min read",
    date: "2023-12-20",
    image: "/images/blog/retention-hacks.jpg",
    tags: ["audience retention", "YouTube algorithm", "video editing"],
  },
  {
    slug: "scaling-content-with-ai",
    title: "How to Scale from 1 to 50 Videos/Week with AI Automation",
    excerpt:
      "Case study: How one creator 50x'd their output using AI video generation. Workflow, tools, costs, and lessons learned.",
    category: "Case Study",
    readTime: "11 min read",
    date: "2023-12-12",
    image: "/images/blog/scaling-content.jpg",
    tags: ["content scaling", "AI workflow", "productivity"],
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "VersaVid Blog",
          description:
            "YouTube automation guides, AI video tutorials, and content strategy for creators.",
          url: "https://versavid.com/blog",
          publisher: structuredData.organization(),
          blogPosts: blogPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: `https://versavid.com/blog/${post.slug}`,
            datePublished: post.date,
            image: post.image,
          })),
        }}
      />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16">
          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-[12px] uppercase tracking-[0.3em] text-white/40">Resources</span>
              <h1 className="mt-5 text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">
                VersaVid Blog
              </h1>
              <p className="mt-6 text-[16px] leading-[1.4] text-[#a8aeb8]">
                Learn how to grow your YouTube channel with AI video automation.
                Tutorials, strategies, and case studies for modern creators.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group rounded-2xl overflow-hidden glass border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 text-6xl">
                      {post.category === "Guide" && "📖"}
                      {post.category === "Strategy" && "📊"}
                      {post.category === "Review" && "⭐"}
                      {post.category === "Tips" && "💡"}
                      {post.category === "Case Study" && "📈"}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] uppercase tracking-[0.1em] text-cyan-400">
                        {post.category}
                      </span>
                      <span className="text-[11px] text-white/40">·</span>
                      <span className="text-[11px] text-white/40">{post.readTime}</span>
                    </div>
                    <h2 className="text-[20px] font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[#a8aeb8] leading-[1.5] mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-[12px] text-white/40">
                      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                      <span>·</span>
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-white/60 hover:text-white transition-colors">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16 text-center">
              <a
                href="/resources"
                className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-3 text-[14px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                View all resources →
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}