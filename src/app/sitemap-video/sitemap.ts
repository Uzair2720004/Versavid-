import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://versavid.com";
  const lastModified = new Date();

  // In production, this would fetch from database
  const videos = [
    {
      id: "demo-1",
      title: "How to Create Faceless YouTube Videos with AI",
      description:
        "Complete tutorial on using VersaVid to automate faceless channel content creation.",
      thumbnailUrl: `${baseUrl}/images/video-thumbnails/demo-1.jpg`,
      contentUrl: `${baseUrl}/videos/demo-1.mp4`,
      playerUrl: `${baseUrl}/watch/demo-1`,
      uploadDate: "2024-01-15T10:00:00Z",
      duration: "PT5M30S",
      tags: ["AI video", "YouTube automation", "faceless channel", "tutorial"],
      category: "Education",
    },
    {
      id: "demo-2",
      title: "VersaVid Demo: Topic to Video in 3 Minutes",
      description:
        "Watch VersaVid create a complete YouTube video from a single topic prompt.",
      thumbnailUrl: `${baseUrl}/images/video-thumbnails/demo-2.jpg`,
      contentUrl: `${baseUrl}/videos/demo-2.mp4`,
      playerUrl: `${baseUrl}/watch/demo-2`,
      uploadDate: "2024-01-10T10:00:00Z",
      duration: "PT3M15S",
      tags: ["demo", "AI video generation", "VersaVid", "product demo"],
      category: "Science & Technology",
    },
  ];

  return videos.map((video) => ({
    url: video.playerUrl,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
    alternates: {
      languages: {
        en: video.playerUrl,
      },
    },
    // Video-specific sitemap extensions would go here
    // For now, we include video metadata in the page itself via VideoObject schema
  }));
}