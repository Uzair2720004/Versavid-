import type { Metadata } from "next";

import Script from 'next/script';
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { AppProvider } from "@/lib/store";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VersaVid — Stop editing. Start publishing.",
  description:
    "VersaVid is the AI video studio for YouTube creators. Turn a single idea into a fully narrated, captioned, ready-to-publish video in minutes.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-ink">
        <AppProvider>{children}</AppProvider>
      
        {/* Chatzy VidStrategist Widget */}
        <link rel="stylesheet" href="https://chatzy-kb-store.s3.amazonaws.com/icons/5ab07987-b5db-477c-82ff-1287e0883acb" />
        <Script
          src="https://chatzy-kb-store.s3.amazonaws.com/icons/56706cc4-b3ba-4eba-9610-f2fb07008a5c"
          id="c9fd61cc-273a-4188-aceb-8538c8b507ef"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
