'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function UsageHeader() {
  const { profile } = useApp();
  const userName = profile?.full_name?.split(' ')[0] || 'there';
  return (
    <section className="relative pt-32 pb-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/credits-bg.jpg" alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,black_90%)]" />
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center">
          <div className="glass rounded-full px-4 py-1.5 mb-6 inline-flex items-center gap-2 text-[12px] text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Welcome, {userName}
          </div>
          <h1 className="text-[44px] sm:text-[64px] lg:text-[80px] font-bold leading-[1.0] tracking-tightest text-gradient text-glow">Pricing & Credits</h1>
          <p className="mt-5 max-w-xl mx-auto text-[16px] leading-[1.4] text-[#a8aeb8]">Pick a plan, top up credits, and keep your YouTube video pipeline running.</p>
        </motion.div>
      </div>
    </section>
  );
}
