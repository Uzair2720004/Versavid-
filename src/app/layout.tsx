import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { AppProvider } from "@/lib/store";
import ChatzyWidget from "@/components/ChatzyWidget";

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
      className={{${geistSans.variable}  h-full antialiased}}
    >
      <body className="min-h-full bg-canvas text-ink">
        <AppProvider>{children}</AppProvider>
        <ChatzyWidget />
      </body>
    </html>
  );
}
