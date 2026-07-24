import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://versavid.com";
  const lastModified = new Date();

  // Static marketing pages
  const marketingPages = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/pricing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/features`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/compare`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/resources`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/signup`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/login`, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Authenticated user pages (included for completeness, but disallowed in robots.txt)
  const appPages = [
    { url: `${baseUrl}/dashboard`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/create`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/videos`, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/analytics`, changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/settings`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/credits`, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Blog posts (would be dynamic in production)
  const blogPosts = [
    { url: `${baseUrl}/blog/ai-video-generation-guide-2024`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/faceless-youtube-channel-blueprint`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/youtube-shorts-vs-long-form-strategy`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/ai-voiceover-comparison-2024`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/youtube-retention-tips-ai`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/scaling-content-with-ai`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Public video watch pages (for video SEO)
  const videoPages = [
    { url: `${baseUrl}/watch/demo-1`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/watch/demo-2`, changeFrequency: "monthly", priority: 0.5 },
  ];

  return [...marketingPages, ...appPages, ...blogPosts, ...videoPages].map((page) => ({
    ...page,
    lastModified,
  }));
}