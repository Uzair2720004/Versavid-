'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  return (
    <section id="cta" ref={ref} className="relative min-h-[90vh] w-full overflow-hidden bg-black flex items-center justify-center">
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <img src="/images/cta-bg.jpg" alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      </motion.div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <h2 className="mt-6 text-[44px] sm:text-[68px] font-bold leading-[1.0] tracking-tighter text-white">Turn any topic<br />into a video.</h2>
          <p className="mt-7 mx-auto max-w-xl text-[16px] leading-[1.4] text-[#a8aeb8]">Versavid writes the script, generates the visuals, adds voiceover and captions. Start free with 5 credits — no credit card required.</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black hover:scale-[1.03] transition-transform">
              Start creating free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-6 text-[12px] text-[#767D88]">5 free credits · No credit card required</p>
        </motion.div>
      </div>
    </section>
  );
}

