"use client";

import { useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative bg-black min-h-screen flex items-center justify-center">
      <Nav />
      <div className="text-center px-6">
        <h1 className="text-[48px] sm:text-[72px] font-bold text-white mb-4">
          404
        </h1>
        <h2 className="text-[24px] text-white/80 mb-6">
          Page not found
        </h2>
        <p className="text-[#a8aeb8] max-w-md mx-auto mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[16px] font-semibold text-black hover:bg-white/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-[16px] font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
          >
            Search
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}