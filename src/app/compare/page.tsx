import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { generateMetadata, structuredData, compareFaqs } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateMetadata({
  title: "VersaVid vs Alternatives — Compare AI Video Tools",
  description:
    "Compare VersaVid vs Wistia, Vimeo, Mux, Synthesia, and more. See why creators choose VersaVid for AI-powered YouTube video automation.",
  path: "/compare",
  ogImage: "/images/og-compare.jpg",
});

const competitors = [
  {
    name: "Wistia",
    tagline: "Video hosting & marketing",
    pricing: "$19–$319/mo",
    bestFor: "Business video hosting",
    pros: ["Advanced analytics", "Lead generation tools", "Customizable player"],
    cons: ["No AI generation", "Expensive at scale", "Manual editing required"],
    verdict: "Great for hosting, not for creation",
  },
  {
    name: "Vimeo",
    tagline: "Video platform for pros",
    pricing: "$12–$65/mo",
    bestFor: "Professional video hosting",
    pros: ["High-quality player", "Review tools", "Live streaming"],
    cons: ["No AI creation", "Limited automation", "Pricey for storage"],
    verdict: "Best for hosting finished videos",
  },
  {
    name: "Mux",
    tagline: "Video API for developers",
    pricing: "Usage-based",
    bestFor: "Custom video infrastructure",
    pros: ["Powerful API", "Per-title encoding", "Real-time analytics"],
    cons: ["Requires engineering", "No AI content tools", "Build everything yourself"],
    verdict: "For devs building video apps",
  },
  {
    name: "Synthesia",
    tagline: "AI avatar videos",
    pricing: "$22–$67/mo",
    bestFor: "Training & corporate videos",
    pros: ["AI avatars", "120+ languages", "No camera needed"],
    cons: ["Avatar-style only", "Limited customization", "Not for YouTube creators"],
    verdict: "Great for talking-head videos",
  },
  {
    name: "HeyGen",
    tagline: "AI video generator",
    pricing: "$24–$72/mo",
    bestFor: "Spokesperson videos",
    pros: ["Realistic avatars", "Templates", "URL-to-video"],
    cons: ["Avatar-focused", "Limited B-roll", "Credit-based pricing"],
    verdict: "Best for avatar presentations",
  },
  {
    name: "Pictory",
    tagline: "Text-to-video for marketers",
    pricing: "$19–$99/mo",
    bestFor: "Repurposing blog content",
    pros: ["Script-to-video", "Auto captions", "Stock footage library"],
    cons: ["Template-heavy", "Less creative control", "Generic stock footage"],
    verdict: "Good for content repurposing",
  },
];

const vsVersavid = [
  { feature: "AI script writing", versavid: "✓", others: "✗" },
  { feature: "AI B-roll generation", versavid: "✓", others: "✗" },
  { feature: "AI voiceover", versavid: "✓", others: "Partial" },
  { feature: "Auto captions", versavid: "✓", others: "Partial" },
  { feature: "YouTube Shorts support", versavid: "✓", others: "✗" },
  { feature: "End-to-end automation", versavid: "✓", others: "✗" },
  { feature: "Purpose-built for YouTube", versavid: "✓", others: "✗" },
  { feature: "Start free forever", versavid: "✓", others: "Trial only" },
];

export default function ComparePage() {
  return (
    <>
      <JsonLd data={structuredData.softwareApplication()} />
      <JsonLd data={structuredData.faq(compareFaqs)} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16">
          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-[12px] uppercase tracking-[0.3em] text-white/40">Compare</span>
              <h1 className="mt-5 text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">
                VersaVid vs. the alternatives
              </h1>
              <p className="mt-6 text-[16px] leading-[1.4] text-[#a8aeb8]">
                See how to see why thousands of creators switched to AI-powered video automation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 font-semibold text-white">Tool</th>
                    <th className="pb-4 font-semibold text-white">Best for</th>
                    <th className="pb-4 font-semibold text-white">Pricing</th>
                    <th className="pb-4 font-semibold text-white">AI Creation</th>
                    <th className="pb-4 font-semibold text-white">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c) => (
                    <tr key={c.name} className="border-b border-white/5">
                      <td className="py-4 font-medium text-white">{c.name}</td>
                      <td className="py-4 text-[#a8aeb8]">{c.bestFor}</td>
                      <td className="py-4 text-[#a8aeb8]">{c.pricing}</td>
                      <td className="py-4 text-red-400">No</td>
                      <td className="py-4 text-[#767D88]">{c.verdict}</td>
                    </tr>
                  ))}
                  <tr className="bg-white/5 border-b border-white/10">
                    <td className="py-4 font-semibold text-cyan-400">VersaVid</td>
                    <td className="py-4 text-[#a8aeb8]">YouTube creators & faceless channels</td>
                    <td className="py-4 text-[#a8aeb8]">Free – $99/mo</td>
                    <td className="py-4 text-emerald-400 font-medium">Yes (full pipeline)</td>
                    <td className="py-4 text-cyan-400 font-medium">All-in-one AI video studio</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
            <h2 className="text-[32px] font-bold text-white text-center mb-12">
              Feature comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] max-w-3xl mx-auto">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 font-semibold text-white">Feature</th>
                    <th className="pb-4 font-semibold text-white text-center">VersaVid</th>
                    <th className="pb-4 font-semibold text-white text-center">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {vsVersavid.map((v) => (
                    <tr key={v.feature} className="border-b border-white/5">
                      <td className="py-3 text-[#a8aeb8]">{v.feature}</td>
                      <td className="py-3 text-center text-emerald-400 font-medium">{v.versavid}</td>
                      <td className="py-3 text-center text-[#767D88]">{v.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
            <h2 className="text-[32px] font-bold text-white text-center mb-12">
              Detailed breakdown
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitors.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl p-6 glass border border-white/10"
                >
                  <h3 className="text-[20px] font-bold text-white mb-2">{c.name}</h3>
                  <p className="text-[14px] text-[#a8aeb8] mb-4">{c.tagline}</p>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#767D88]">Pricing</span>
                      <span className="text-white font-medium">{c.pricing}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#767D88]">Best for</span>
                      <span className="text-white font-medium">{c.bestFor}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-[12px] uppercase tracking-[0.1em] text-emerald-400 mb-2">
                      Pros
                    </h4>
                    <ul className="space-y-1">
                      {c.pros.map((pro) => (
                        <li key={pro} className="text-[13px] text-[#a8aeb8] flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>{pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-[12px] uppercase tracking-[0.1em] text-red-400 mb-2">
                      Cons
                    </h4>
                    <ul className="space-y-1">
                      {c.cons.map((con) => (
                        <li key={con} className="text-[13px] text-[#a8aeb8] flex items-center gap-2">
                          <span className="text-red-400">✗</span>{con}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[13px] text-white/60 italic">{c.verdict}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
            <h2 className="text-[32px] font-bold text-white text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {compareFaqs.map((faq, i) => (
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
              Ready to automate your YouTube channel?
            </h2>
            <p className="text-[#a8aeb8] max-w-xl mx-auto mb-8">
              Join 10,000+ creators using VersaVid to publish more videos in less time.
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