import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://versavid.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pricing",
          "/features",
          "/how-it-works",
          "/compare",
          "/blog",
          "/resources",
          "/api/og",
        ],
        disallow: [
          "/dashboard",
          "/create",
          "/videos",
          "/settings",
          "/credits",
          "/analytics",
          "/generate",
          "/auth",
          "/api/",
          "/_next/",
          "/static/",
          "/*.json$",
          "/*?*",
          "/*?utm_*",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        disallow: ["/"],
      },
      {
        userAgent: "ClaudeBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}