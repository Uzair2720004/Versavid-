import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { generateMetadata, structuredData, howItWorksFaqs } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateMetadata({
  title: "How It Works — AI Video Creation in 3 Steps",
  description:
    "See how Versavid turns any topic into a ready-to-upload YouTube video. AI script, visuals, voiceover, and captions — fully automated.",
  path: "/how-it-works",
  ogImage: "/images/og-how-it-works.jpg",
});

const steps = [
  {
    number: "01",
    title: "Enter your topic",
    description:
      "Type any topic, niche, or video idea. Versavid's AI researches and writes a complete, retention-optimized script with hooks, structure, and CTAs.",
    features: ["Topic-to-script in seconds", "Niche-aware writing", "Retention-optimized hooks", "Auto-generated titles & descriptions"],
  },
  {
    number: "02",
    title: "AI generates everything",
    description:
      "Our multi-model pipeline creates matching visuals (AI images + video clips), lifelike voiceover in your choice of voices, and word-perfect captions — all in parallel.",
    features: ["AI-generated B-roll & images", "10+ natural AI voices", "Word-by-word caption sync", "Multiple caption styles"],
  },
  {
    number: "03",
    title: "Review, render, publish",
    description:
      "Preview the full video, make any tweaks, then render in up to 4K. Export directly to YouTube or download. Create Shorts and long-form from the same topic automatically.",
    features: ["Up to 4K rendering", "Direct YouTube upload", "Shorts (9:16) & Standard (16:9)", "Commercial license included"],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={structuredData.softwareApplication()} />
      <JsonLd data={structuredData.faq(howItWorksFaqs)} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16">
          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <span className="text-[12px] uppercase tracking-[0.3em] text-white/40">How It Works</span>
              <h1 className="mt-5 text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">
                Topic to video in 3 steps
              </h1>
              <p className="mt-6 text-[16px] leading-[1.4] text-[#a8aeb8]">
                No editing skills needed. No camera required. Just type your idea.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <article
                  key={step.number}
                  className="relative rounded-2xl glass border border-white/10 p-8 overflow-hidden"
                >
                  <div className="absolute top-6 right-6 text-[80px] font-bold text-white/5">
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-[24px] font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-[#a8aeb8] leading-[1.6] mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.features.map((feature, fi) => (
                        <li key={fi} className="flex items-center gap-3 text-[#a8aeb8]">
                          <span className="h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0 mt-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
            <h2 className="text-[32px] font-bold text-white text-center mb-12">
              See it in action
            </h2>
            <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden glass">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster="/images/feature-pipeline.jpg"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/videos/hero-bg.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="glass-strong rounded-full px-8 py-4 text-white font-medium hover:bg-white/10 transition-colors">
                  Watch demo video
                </button>
              </div>
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
            <h2 className="text-[32px] font-bold text-white text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {howItWorksFaqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl glass border border-white/10 p-6"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-[16px] font-medium text-white">
                    {faq.question}
                    <span className="text-cyan-400 transition-transform group-open:rotate-90">▸</span>
                  </summary>
                  <div className="mt-4 text-[#a8aeb8] leading-[1.6]">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-32 text-center">
            <h2 className="text-[32px] font-bold text-white mb-6">
              Ready to create your first video?
            </h2>
            <p className="text-[#a8aeb8] max-w-xl mx-auto mb-8">
              Start free with 10 credits. No credit card required.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[16px] font-semibold text-black hover:bg-white/90 transition-colors"
            >
              Start free →
            </a>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}