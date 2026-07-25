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

export default function PricingPage() {
  return (
    <>
      <JsonLd data={structuredData.service()} />
      <JsonLd data={structuredData.faq(pricingFaqs)} />
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