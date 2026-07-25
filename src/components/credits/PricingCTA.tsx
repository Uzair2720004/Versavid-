'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  return (
    <section ref={ref} className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-black mx-6 lg:mx-10 rounded-2xl border border-white/5 my-12">
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <img src="/images/pricing-bg.jpg" alt="" className="h-full w-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_90%)]" />
      </motion.div>
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-15%' }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <h2 className="text-[40px] sm:text-[60px] lg:text-[72px] font-bold leading-[1.0] tracking-tightest text-gradient text-glow">Automate your<br />first video today.</h2>
          <p className="mt-6 mx-auto max-w-lg text-[16px] leading-[1.4] text-[#a8aeb8]">Start free with 3 videos/month. No credit card required. Turn any topic into a YouTube video — automatically.</p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black hover:scale-[1.03] transition-transform duration-300">
              Start free <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#plans" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-[15px] font-medium text-white hover:bg-white/10 transition-colors duration-300">Compare plans</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

