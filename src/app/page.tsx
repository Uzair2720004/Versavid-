import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import TrustBar from "@/components/landing/TrustBar";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import { generateMetadata, defaultJsonLd, structuredData, pricingFaqs } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateMetadata({
  title: "VersaVid — AI Video Studio for YouTube Creators",
  description:
    "Turn any topic into a fully narrated, captioned, ready-to-publish YouTube video in minutes. AI script, visuals, voiceover, and captions — all automated.",
  path: "/",
  ogImage: "/images/og-home.jpg",
});

export default function LandingPage() {
  return (
    <>
      <JsonLd data={defaultJsonLd} />
      <JsonLd data={structuredData.faq(pricingFaqs)} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main>
          <Hero />
          <Features />
          <TrustBar />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}