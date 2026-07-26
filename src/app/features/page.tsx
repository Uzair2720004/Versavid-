import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { generateMetadata, structuredData, featureFaqs } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateMetadata({
  title: "Features — AI Video Creation Tools",
  description:
    "Explore Versavid's AI-powered video creation features: script generation, AI visuals, voiceovers, auto-captions, and multi-format support. Everything you need for YouTube automation.",
  path: "/features",
  ogImage: "/images/og-features.jpg",
});

const features = [
  {
    id: "script",
    title: "AI Script Generation",
    description:
      "Type any topic and Versavid writes a complete, retention-optimized video script with hooks, structure, and calls-to-action.",
    icon: "FileText",
    benefits: [
      "Topic-to-script in seconds",
      "Niche-aware writing style",
      "Retention-optimized hooks",
      "Customizable tone & length",
    ],
  },
  {
    id: "visuals",
    title: "AI Images & Video Clips",
    description:
      "Generate unique B-roll, backgrounds, and visual assets for every scene. No stock footage subscriptions needed.",
    icon: "Image",
    benefits: [
      "AI-generated B-roll per scene",
      "Consistent visual style",
      "No licensing concerns",
      "4K quality output",
    ],
  },
  {
    id: "voiceover",
    title: "AI Voiceover",
    description:
      "Natural-sounding narration in multiple voices and languages. Consistent brand voice across all your videos.",
    icon: "Mic",
    benefits: [
      "10+ lifelike voices",
      "Multiple languages",
      "Emotion control",
      "Pronunciation tuning",
    ],
  },
  {
    id: "captions",
    title: "Auto Captions",
    description:
      "Word-perfect, perfectly timed captions generated automatically. Multiple styles optimized for engagement.",
    icon: "MessageSquare",
    benefits: [
      "Word-by-word sync",
      "Dynamic karaoke style",
      "High-contrast readability",
      "Translation ready",
    ],
  },
  {
    id: "formats",
    title: "Shorts & Standard Support",
    description:
      "Create both 16:9 long-form videos and 9:16 YouTube Shorts from the same topic. Auto-reframe and reformat instantly.",
    icon: "Smartphone",
    benefits: [
      "9:16 Shorts from same pipeline",
      "16:9 standard videos",
      "Auto-reframe subjects",
      "Platform-optimized exports",
    ],
  },
  {
    id: "pipeline",
    title: "End-to-End Pipeline",
    description:
      "One prompt → complete video. Script, visuals, voice, captions, and render — all automated in a single workflow.",
    icon: "Zap",
    benefits: [
      "Single-topic input",
      "Parallel AI processing",
      "Minutes, not hours",
      "Edit before render",
    ],
  },
];

const faqs = [
  {
    question: "Can I edit the AI-generated script before creating the video?",
    answer:
      "Yes! You can review and edit the script at any point before generating visuals or voiceover. Full creative control.",
  },
  {
    question: "Do the AI voices sound robotic?",
    answer:
      "No. We use state-of-the-art neural voices that sound remarkably natural. Most viewers can't distinguish them from human narrators.",
  },
  {
    question: "Can I use my own images or video clips?",
    answer:
      "Absolutely. Upload your own assets and Versavid will incorporate them alongside AI-generated content.",
  },
  {
    question: "What languages are supported for voiceover and captions?",
    answer:
      "We support 20+ languages including English, Spanish, French, German, Portuguese, Japanese, Korean, and more.",
  },
  {
    question: "Is there a limit on video length?",
    answer:
      "Standard plans support up to 10-minute videos. Enterprise plans support longer formats. Shorts are optimized for 60 seconds.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={structuredData.faq(featureFaqs)} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main>
          <section className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
            </div>
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-28 pb-24 text-center">
              <span className="text-[12px] uppercase tracking-[0.3em] text-white/40">The Workflow</span>
              <h1 className="mt-5 text-[44px] sm:text-[64px] lg:text-[88px] font-bold leading-[1.0] tracking-tightest text-white">
                Everything you need<br />to make YouTube videos.
              </h1>
              <p className="mt-6 text-[16px] sm:text-[18px] leading-[1.4] text-[#a8aeb8] max-w-lg mx-auto">
                From script to published video — six AI systems working together.
              </p>
            </div>
          </section>

          <section id="features" className="relative bg-black">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <article
                    key={feature.id}
                    className="rounded-2xl p-6 glass border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-[20px] font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-[#a8aeb8] leading-[1.5] mb-6">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-[13px] text-[#a8aeb8]">
                          <span className="text-emerald-400">✓</span>{benefit}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-[32px] font-bold text-white mb-4">
                How it works — in 3 steps
              </h2>
              <p className="text-[#a8aeb8] leading-[1.6]">
                No video editing experience needed. Just type your topic and let the AI handle the rest.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl">1</div>
                <div className="pt-16 rounded-2xl p-6 glass border border-white/10 text-center">
                  <h3 className="text-[20px] font-bold text-white mb-3">Enter your topic</h3>
                  <p className="text-[#a8aeb8]">
                    Type any topic, niche, or idea. Versavid researches and writes a complete script optimized for retention.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl">2</div>
                <div className="pt-16 rounded-2xl p-6 glass border border-white/10 text-center">
                  <h3 className="text-[20px] font-bold text-white mb-3">AI generates everything</h3>
                  <p className="text-[#a8aeb8]">
                    Script, visuals, voiceover, and captions created in parallel. Review and tweak any element before rendering.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl">3</div>
                <div className="pt-16 rounded-2xl p-6 glass border border-white/10 text-center">
                  <h3 className="text-[20px] font-bold text-white mb-3">Publish & grow</h3>
                  <p className="text-[#a8aeb8]">
                    Export in 4K, upload directly to YouTube, or download. Create Shorts and long-form from the same topic.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
            <h2 className="text-[32px] font-bold text-white text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
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