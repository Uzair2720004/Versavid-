'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
export default function FinalCTA() {
  return (
    <section id="cta" className="relative min-h-[90vh] w-full overflow-hidden bg-[#0A0A0F] flex items-center justify-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.4 }}
      >
        <source src="https://videos.pexels.com/video-files/36380551/15428477_1920_1080_30fps.mp4" type="video/mp4" />
      </video>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, #0A0A0F 85%)' }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <h2 className="mt-6 text-[44px] sm:text-[68px] font-bold leading-[1.0] tracking-tighter text-white">Turn any topic<br />into a video.</h2>
          <p className="mt-7 mx-auto max-w-xl text-[16px] leading-[1.4] text-[#a8aeb8]">Versavid writes the script, generates the visuals, adds voiceover and captions. Start free — 3 videos every month, no credit card required.</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black hover:scale-[1.03] transition-transform">
              Start creating free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-6 text-[12px] text-[#767D88]">3 free videos every month · No credit card required</p>
        </motion.div>
      </div>
    </section>
  );
}

