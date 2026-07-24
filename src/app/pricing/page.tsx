import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import {
  generateMetadata,
  pricingFaqs,
  structuredData,
} from "@/lib/seo/structured-data";
import PlanCards from "@/components/credits/PlanCards";
import ComparisonTable from "@/components/credits/ComparisonTable";
import PricingFAQ from "@/components/credits/PricingFAQ";
import PricingCTA from "@/components/credits/PricingCTA";

export const metadata: Metadata = generateMetadata({
  title: "Pricing — Simple, Transparent Plans",
  description:
    "Choose the perfect plan for your YouTube channel. Free tier available. No hidden fees. Cancel anytime.",
  path: "/pricing",
  ogImage: "/images/og-pricing.jpg",
});

const plans = [
  {
    name: "Free",
    description: "Perfect for trying Versavid",
    price: 0,
    currency: "USD",
    billingPeriod: "P1M",
    features: [
      "5 credits/month",
      "AI script generation",
      "AI images & video clips",
      "AI voiceover (2 voices)",
      "Auto captions",
      "720p export",
      "Shorts & standard support",
    ],
  },
  {
    name: "Pro",
    description: "For regular content creators",
    price: 29,
    currency: "USD",
    billingPeriod: "P1M",
    features: [
      "100 credits/month",
      "Everything in Free",
      "10+ AI voices",
      "1080p export",
      "Priority rendering",
      "Commercial license",
      "Email support",
    ],
  },
  {
    name: "Studio",
    description: "For power users & agencies",
    price: 99,
    currency: "USD",
    billingPeriod: "P1M",
    features: [
      "500 credits/month",
      "Everything in Pro",
      "4K export",
      "Custom AI voice cloning",
      "API access",
      "Team collaboration (5 seats)",
      "Priority support",
      "Custom branding",
    ],
  },
];

const comparisonData = [
  { feature: "Monthly credits", free: "5", pro: "100", studio: "500" },
  { feature: "Max resolution", free: "720p", pro: "1080p", studio: "4K" },
  { feature: "AI voices", free: "2", pro: "10+", studio: "Unlimited + cloning" },
  { feature: "Export formats", free: "MP4", pro: "MP4, MOV", studio: "All formats" },
  { feature: "Rendering priority", free: "Standard", pro: "Priority", studio: "Highest" },
  { feature: "Commercial license", free: "✗", pro: "✓", studio: "✓" },
  { feature: "API access", free: "✗", pro: "✗", studio: "✓" },
  { feature: "Team seats", free: "1", pro: "1", studio: "5" },
  { feature: "Custom branding", free: "✗", pro: "✗", studio: "✓" },
  { feature: "Support", free: "Community", pro: "Email", studio: "Priority + Slack" },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={structuredData.service()} />
      <JsonLd data={structuredData.faq(pricingFaqs)} />
      <JsonLd data={plans.map((p) => structuredData.productSchema(p))} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16">
          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-[12px] uppercase tracking-[0.3em] text-white/40">Pricing</span>
              <h1 className="mt-5 text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">
                Simple, transparent pricing
              </h1>
              <p className="mt-6 text-[16px] leading-[1.4] text-[#a8aeb8]">
                Start free. Scale as you grow. No hidden fees, cancel anytime.
              </p>
            </div>
            <PlanCards />
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
            <ComparisonTable />
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
            <PricingFAQ />
          </section>

          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-32">
            <PricingCTA />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}