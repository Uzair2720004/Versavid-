import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { AppProvider } from "@/lib/store";
import ChatzyWidget from "@/components/ChatzyWidget";
import { structuredData } from "@/lib/seo/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://versavid.com"),
  title: {
    default: "VersaVid — AI Video Studio for YouTube Creators",
    template: "%s | VersaVid",
  },
  description: "Turn any topic into a ready-to-upload YouTube video in minutes. AI scripts, visuals, voiceover, captions — fully automated. Start free.",
  keywords: [
    "AI video generator",
    "YouTube automation",
    "video creation AI",
    "AI voiceover",
    "auto captions",
    "video marketing software",
    "content creation tools",
    "YouTube Shorts maker",
    "faceless video creator",
    "text to video AI",
  ],
  authors: [{ name: "VersaVid" }],
  creator: "VersaVid",
  publisher: "VersaVid",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://versavid.com",
    siteName: "VersaVid",
    title: "VersaVid — AI Video Studio for YouTube Creators",
    description: "Turn any topic into a ready-to-upload YouTube video in minutes. AI scripts, visuals, voiceover, captions — fully automated.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VersaVid AI Video Studio - Create YouTube videos automatically",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VersavidAi",
    creator: "@VersavidAi",
    title: "VersaVid — AI Video Studio for YouTube Creators",
    description: "Turn any topic into a ready-to-upload YouTube video in minutes. AI scripts, visuals, voiceover, captions — fully automated.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = structuredData.organization();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-full bg-canvas text-ink">
        <AppProvider>{children}</AppProvider>
        <ChatzyWidget />
      </body>
    </html>
  );
}
