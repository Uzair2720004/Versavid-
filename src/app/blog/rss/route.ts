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

export async function GET() {
  const baseUrl = "https://versavid.com";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>VersaVid Blog</title>
    <link>${baseUrl}/blog</link>
    <description>YouTube automation guides, AI video tutorials, and content strategy for creators</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logo-light.png</url>
      <title>VersaVid</title>
      <link>${baseUrl}</link>
    </image>
    ${blogPosts
      .map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <dc:creator>${post.author}</dc:creator>
      <category>${post.category}</category>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("")}
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>
    `)
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}