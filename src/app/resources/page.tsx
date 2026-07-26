import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { generateMetadata, structuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateMetadata({
  title: "Resources — Free Tools, Templates & Guides for YouTube Creators",
  description:
    "Free YouTube tools, video templates, content calendars, keyword research guides, and AI prompt libraries. Everything you need to grow your channel.",
  path: "/resources",
  ogImage: "/images/og-resources.jpg",
});

const resources = [
  {
    id: "keyword-research",
    title: "YouTube Keyword Research Template",
    description:
      "Notion template for finding high-volume, low-competition keywords. Includes search volume estimator, competition score, and content angle generator.",
    category: "Template",
    format: "Notion",
    image: "/images/resources/keyword-template.jpg",
    link: "/resources/keyword-research",
    tags: ["SEO", "Keywords", "Planning"],
  },
  {
    id: "content-calendar",
    title: "90-Day Content Calendar",
    description:
      "Plan your next quarter of content in one sitting. Includes topic clusters, publishing schedule, and repurposing checklist for Shorts + long-form.",
    category: "Template",
    format: "Notion + Google Sheets",
    image: "/images/resources/content-calendar.jpg",
    link: "/resources/content-calendar",
    tags: ["Planning", "Consistency", "Workflow"],
  },
  {
    id: "ai-prompt-library",
    title: "AI Video Prompt Library",
    description:
      "50+ battle-tested prompts for scripts, hooks, titles, descriptions, and thumbnails. Copy-paste into any LLM or use directly in VersaVid.",
    category: "Guide",
    format: "PDF + Notion",
    image: "/images/resources/prompt-library.jpg",
    link: "/resources/ai-prompts",
    tags: ["AI", "Prompts", "Scripts"],
  },
  {
    id: "thumbnail-checklist",
    title: "High-CTR Thumbnail Checklist",
    description:
      "15-point visual checklist used by 100K+ subscriber channels. Covers contrast, text hierarchy, facial expression, curiosity gaps, and A/B testing.",
    category: "Checklist",
    format: "PDF",
    image: "/images/resources/thumbnail-checklist.jpg",
    link: "/resources/thumbnail-checklist",
    tags: ["Thumbnails", "CTR", "Design"],
  },
  {
    id: "shorts-repurposing",
    title: "Long-Form to Shorts Repurposing Workflow",
    description:
      "Step-by-step system to turn one 10-minute video into 8+ Shorts. Includes timestamp mapping, hook extraction, and vertical reframing guide.",
    category: "Workflow",
    format: "Video + Notion",
    image: "/images/resources/shorts-workflow.jpg",
    link: "/resources/shorts-repurposing",
    tags: ["Shorts", "Repurposing", "Scale"],
  },
  {
    id: "monetization-calculator",
    title: "YouTube Revenue Calculator",
    description:
      "Estimate your earnings from AdSense, affiliates, sponsorships, and digital products. Input your niche, views, and conversion rates.",
    category: "Tool",
    format: "Google Sheets",
    image: "/images/resources/revenue-calculator.jpg",
    link: "/resources/monetization-calculator",
    tags: ["Monetization", "Revenue", "Planning"],
  },
  {
    id: "script-templates",
    title: "Viral Script Templates Pack",
    description:
      "10 proven script structures: Listicle, Story, Tutorial, Controversy, Case Study, Myth-Busting, Comparison, Behind-the-Scenes, Q&A, and Challenge.",
    category: "Template",
    format: "Notion + Google Docs",
    image: "/images/resources/script-templates.jpg",
    link: "/resources/script-templates",
    tags: ["Scripts", "Writing", "Templates"],
  },
  {
    id: "channel-audit",
    title: "Channel Audit Scorecard",
    description:
      "50-point diagnostic for any YouTube channel. Scores branding, content, SEO, retention, monetization, and growth potential. Includes prioritized action plan.",
    category: "Tool",
    format: "Notion",
    image: "/images/resources/channel-audit.jpg",
    link: "/resources/channel-audit",
    tags: ["Audit", "Growth", "Strategy"],
  },
];

const freeTools = [
  {
    name: "YouTube Title Generator",
    description: "Generate 20 click-worthy titles from your topic",
    link: "/tools/title-generator",
    category: "Free Tool",
  },
  {
    name: "Thumbnail CTR Predictor",
    description: "Upload a thumbnail, get predicted CTR score",
    link: "/tools/thumbnail-predictor",
    category: "Free Tool",
  },
  {
    name: "Video Idea Validator",
    description: "Check search volume & competition before creating",
    link: "/tools/idea-validator",
    category: "Free Tool",
  },
  {
    name: "Script Hook Writer",
    description: "Generate 10 retention-optimized hooks for any topic",
    link: "/tools/hook-writer",
    category: "Free Tool",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Resources for YouTube Creators",
          description:
            "Free tools, templates, and guides for YouTube automation and growth",
          publisher: structuredData.organization(),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: resources.map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "CreativeWork",
                name: r.title,
                description: r.description,
                url: `https://versavid.com${r.link}`,
              },
            })),
          },
        }}
      />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16">
          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Resources" },
              ]}
            />

            <div className="max-w-3xl mx-auto text-center mb-16 mt-8">
              <span className="text-[12px] uppercase tracking-[0.3em] text-white/40"
                >Free Resources</span
              >
              <h1 className="mt-5 text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">
                Tools, templates & guides<br />for YouTube creators
              </h1>
              <p className="mt-6 text-[16px] leading-[1.4] text-[#a8aeb8]">
                Everything we've learned building channels to 100K+ subscribers.
                Free to download, use, and share.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {resources.map((resource) => (
                <article
                  key={resource.id}
                  className="group rounded-2xl overflow-hidden glass border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-transparent group-hover:from-cyan-500/30 group-hover:via-fuchsia-500/20 transition-all duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl group-hover:text-white/50 transition-colors">
                      {resource.category === "Template" && "📋"}
                      {resource.category === "Guide" && "📖"}
                      {resource.category === "Checklist" && "✅"}
                      {resource.category === "Workflow" && "🔄"}
                      {resource.category === "Tool" && "🔧"}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="px-2.5 py-1 rounded text-[10px] font-medium text-white/90"
                        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                        {resource.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-[18px] font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-[#a8aeb8] text-[14px] leading-[1.5] mb-4">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-2 text-[12px] text-white/40 mb-4">
                      <span>{resource.format}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] text-white/50"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={resource.link}
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-[13px] font-medium"
                    >
                      Get free access <span>→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <section className="mb-20">
              <h2 className="text-[28px] font-bold text-white text-center mb-12">
                Free online tools
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {freeTools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.link}
                    className="rounded-2xl p-6 glass border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                  >
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <h3 className="text-[16px] font-semibold text-white mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-[#a8aeb8] text-[13px] leading-[1.5] mb-4">
                      {tool.description}
                    </p>
                    <span className="text-cyan-400 text-[12px] font-medium flex items-center gap-1">
                      Try it free <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-[28px] font-bold text-white mb-6">
                Want the ultimate unfair advantage?
              </h2>
              <p className="text-[#a8aeb8] max-w-xl mx-auto mb-8">
                VersaVid automates the entire video creation pipeline. Script,
                visuals, voice, captions — done in minutes, not hours.
              </p>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[16px] font-semibold text-black hover:bg-white/90 transition-colors"
              >
                Start free →
              </a>
            </section>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}