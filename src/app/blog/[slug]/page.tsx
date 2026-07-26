import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { generateMetadata, structuredData } from "@/lib/seo/structured-data";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const blogPosts: Record<string, any> = {
  "ai-video-generation-guide-2024": {
    slug: "ai-video-generation-guide-2024",
    title: "Complete Guide to AI Video Generation for YouTube in 2024",
    excerpt:
      "Everything you need to know about creating YouTube videos with AI — from script writing to voiceovers, visuals, and publishing automation.",
    content: `
      <h2>Introduction</h2>
      <p>AI video generation has transformed from a novelty into a production-ready tool that serious creators use daily. In this guide, we'll cover everything you need to know to start creating AI-powered YouTube videos in 2024.</p>

      <h2>How AI Video Generation Works</h2>
      <p>Modern AI video tools use a multi-model pipeline:</p>
      <ul>
        <li><strong>LLMs (GPT-4, Claude)</strong> for script writing and ideation</li>
        <li><strong>Diffusion models (Midjourney, DALL-E, Stable Diffusion)</strong> for image generation</li>
        <li><strong>Video models (Runway Gen-2, Pika, Sora)</strong> for video clip generation</li>
        <li><strong>TTS models (ElevenLabs, PlayHT, OpenAI TTS)</strong> for voiceover</li>
        <li><strong>ASR models (Whisper)</strong> for caption generation</li>
      </ul>
`,
    category: "Guide",
    readTime: "12 min read",
    date: "2024-01-15",
    author: "VersaVid Team",
    image: "/images/blog/ai-video-guide.jpg",
    tags: ["AI video", "YouTube automation", "content creation"],
  },
  "faceless-youtube-channel-blueprint": {
    slug: "faceless-youtube-channel-blueprint",
    title: "Faceless YouTube Channel Blueprint: $10K/Month Without Showing Your Face",
    excerpt:
      "Step-by-step strategy for building a profitable faceless YouTube channel using AI tools. Niche selection, content strategy, and monetization.",
    content: `
      <h2>Why Faceless Channels Work</h2>
      <p>Faceless (or "cash cow") channels have exploded because they remove the biggest barrier to YouTube: being on camera. With AI, the production barrier is now gone too.</p>

      <h2>Step 1: Niche Selection</h2>
      <p>High-RPM niches for faceless channels:</p>
      <ul>
        <li>Finance & investing ($20-50 RPM)</li>
        <li>Luxury watches ($30-60 RPM)</li>
        <li>Top 10s / Lists ($5-15 RPM, high volume)</li>
        <li>Psychology / Self-improvement ($10-25 RPM)</li>
        <li>History / Documentaries ($8-20 RPM)</li>
        <li>Tech / AI news ($15-30 RPM)</li>
      </ul>

      <h2>Step 2: Content Strategy</h2>
      <p>Three content pillars that work:</p>
      <ol>
        <li><strong>Evergreen explainers</strong> — "How does X work?"</li>
        <li><strong>Listicles</strong> — "Top 10 X for Y"</li>
        <li><strong>Case studies</strong> — "How [person] achieved [result]"</li>
      </ol>

      <h2>Step 3: Production at Scale</h2>
      <p>This is where AI changes everything. Old way: $100-500/video, 1-2 weeks. New way with VersaVid: $1-3/video, 5 minutes.</p>

      <h2>Step 4: Monetization Stack</h2>
      <ul>
        <li>AdSense (baseline)</li>
        <li>Affiliate marketing (high-ticket products)</li>
        <li>Digital products (courses, templates)</li>
        <li>Sponsorships (once you hit 10K+ subs)</li>
      </ul>

      <h2>Real Numbers</h2>
      <p>A 50K subscriber finance channel doing 3 videos/week:</p>
      <ul>
        <li>Monthly views: ~500K</li>
        <li>AdSense: $5,000-15,000</li>
        <li>Affiliates: $3,000-10,000</li>
        <li>Total: $8,000-25,000/month</li>
      </ul>

      <h2>Start Your Channel Today</h2>
      <p><a href="/signup">Try VersaVid free →</a></p>
    `,
    category: "Strategy",
    readTime: "15 min read",
    date: "2024-01-08",
    author: "VersaVid Team",
    image: "/images/blog/faceless-blueprint.jpg",
    tags: ["faceless channel", "YouTube monetization", "passive income"],
  },
};

export async function generatePostMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts[resolvedParams.slug];

  if (!post) {
    return generateMetadata({
      title: "Post Not Found",
      description: "The blog post you're looking for doesn't exist.",
      path: `/blog/${resolvedParams.slug}`,
    });
  }

  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.image,
    ogType: "article",
  });
}

export { generatePostMetadata as generateMetadata };

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = blogPosts[resolvedParams.slug];

  if (!post) {
    return (
      <div className="relative bg-black min-h-screen flex items-center justify-center">
        <Nav />
        <div className="text-center px-6">
          <h1 className="text-[32px] font-bold text-white mb-4">Post not found</h1>
          <a href="/blog" className="text-cyan-400 hover:text-cyan-300">← Back to blog</a>
        </div>
        <Footer />
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `https://versavid.com${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://versavid.com",
    },
    publisher: {
      "@type": "Organization",
      name: "VersaVid",
      logo: {
        "@type": "ImageObject",
        url: "https://versavid.com/images/logo-light.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://versavid.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
  };

  return (
    <>
      <JsonLd data={[articleSchema, structuredData.organization()]} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16">
          <article className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />

            <header className="mb-12">
              <div className="flex items-center gap-3 text-[12px] text-white/40 mb-4">
                <span className="px-2 py-1 rounded text-white/60"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {post.category}
                </span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h1 className="text-[36px] sm:text-[48px] font-bold leading-[1.1] text-white">
                {post.title}
              </h1>
              <p className="mt-4 text-[#a8aeb8] text-[16px] leading-[1.6]">{post.excerpt}</p>
            </header>

            <div
              className="relative aspect-video rounded-2xl overflow-hidden mb-12"
              style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(232,121,249,0.1) 100%)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl">
                📖
              </div>
            </div>

            <div
              className="prose prose-invert max-w-none text-[#a8aeb8] leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <footer className="mt-16 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <div>
                  <p className="text-white font-medium">{post.author}</p>
                  <p className="text-[12px] text-white/40">AI video studio for creators</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <a
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 rounded-full text-[12px] text-white/60 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </footer>
          </article>

          <section className="max-w-3xl mx-auto px-6 lg:px-10 pb-20">
            <div className="rounded-2xl p-8 glass border border-white/10 text-center"
              style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(232,121,249,0.1) 100%)" }}>
              <h2 className="text-[24px] font-bold text-white mb-4">
                Ready to automate your video creation?
              </h2>
              <p className="text-[#a8aeb8] max-w-xl mx-auto mb-6">
                VersaVid handles the entire pipeline — script, visuals, voice, captions — so you can publish more in less time.
              </p>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[16px] font-semibold text-black hover:bg-white/90 transition-colors"
              >
                Start free →
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}