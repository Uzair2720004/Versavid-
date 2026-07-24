import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { generateMetadata } from "@/lib/seo/structured-data";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = generateMetadata({
  title: "Search — VersaVid",
  description:
    "Search VersaVid's blog, features, pricing, and resources for YouTube automation and AI video creation.",
  path: "/search",
  ogImage: "/images/og-search.jpg",
});

const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VersaVid",
  url: "https://versavid.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://versavid.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function SearchPage() {
  return (
    <>
      <JsonLd data={searchActionSchema} />
      <div className="relative bg-black min-h-screen">
        <Nav />
        <main className="pt-16 pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Search" },
              ]}
            />

            <header className="mt-12 mb-12 text-center">
              <h1 className="text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">
                Search VersaVid
              </h1>
              <p className="mt-4 text-[#a8aeb8] max-w-2xl mx-auto">
                Find guides, features, pricing, and resources for AI video creation
              </p>
            </header>

            <SearchClient />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}