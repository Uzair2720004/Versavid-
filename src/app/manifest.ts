import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = "https://versavid.com";

  return {
    name: "VersaVid",
    short_name: "VersaVid",
    description:
      "AI video studio for YouTube creators. Turn any topic into a ready-to-upload video in minutes.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["video", "productivity", "creativity"],
    shortcuts: [
      {
        name: "Create Video",
        short_name: "Create",
        description: "Create a new AI video",
        url: "/create",
        icons: [{ src: "/icons/create-icon.png", sizes: "192x192" }],
      },
      {
        name: "My Videos",
        short_name: "Videos",
        description: "View your created videos",
        url: "/videos",
        icons: [{ src: "/icons/videos-icon.png", sizes: "192x192" }],
      },
    ],
    prefer_related_applications: false,
  };
}