import { MetadataRoute } from "next";

const blogPosts = [
  {
    slug: "ai-video-generation-guide-2024",
    title: "Complete Guide to AI Video Generation for YouTube in 2024",
    description: "Everything you need to know about creating YouTube videos with AI — from script writing to voiceovers, visuals, and publishing automation.",
    date: "2024-01-15",
    author: "VersaVid Team",
    category: "Guide",
    tags: ["AI video", "YouTube automation", "content creation"],
  },
  {
    slug: "faceless-youtube-channel-blueprint",
    title: "Faceless YouTube Channel Blueprint: $10K/Month Without Showing Your Face",
    description: "Step-by-step strategy for building a profitable faceless YouTube channel using AI tools. Niche selection, content strategy, and monetization.",
    date: "2024-01-08",
    author: "VersaVid Team",
    category: "Strategy",
    tags: ["faceless channel", "YouTube monetization", "passive income"],
  },
  {
    slug: "youtube-shorts-vs-long-form-strategy",
    title: "YouTube Shorts vs Long-Form: The 2024 Strategy for Maximum Growth",
    description: "Data-driven comparison of Shorts vs long-form content. When to use each, how to repurpose, and the hybrid strategy top creators use.",
    date: "2024-01-02",
    author: "VersaVid Team",
    category: "Strategy",
    tags: ["YouTube Shorts", "content strategy", "algorithm"],
  },
  {
    slug: "ai-voiceover-comparison-2024",
    title: "Best AI Voiceover Tools Compared: ElevenLabs vs PlayHT vs VersaVid",
    description: "In-depth comparison of the top AI voice generators for YouTube. Quality, pricing, features, and which one fits your workflow.",
    date: "2023-12-28",
    author: "VersaVid Team",
    category: "Review",
    tags: ["AI voiceover", "text-to-speech", "tools comparison"],
  },
  {
    slug: "youtube-retention-tips-ai",
    title: "10 YouTube Retention Hacks (And How AI Automates Them)",
    description: "The retention strategies top 1% creators use — and how to automate them with AI. Hooks, pacing, pattern interrupts, and more.",
    date: "2023-12-20",
    author: "VersaVid Team",
    category: "Tips",
    tags: ["audience retention", "YouTube algorithm", "video editing"],
  },
  {
    slug: "scaling-content-with-ai",
    title: "How to Scale from 1 to 50 Videos/Week with AI Automation",
    description: "Case study: How one creator 50x'd their output using AI video generation. Workflow, tools, costs, and lessons learned.",
    date: "2023-12-12",
    author: "VersaVid Team",
    category: "Case Study",
    tags: ["content scaling", "AI workflow", "productivity"],
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://versavid.com";
  const lastModified = new Date();

  return blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}