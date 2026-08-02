'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSwarm = dynamic(() => import('@/components/landing/HeroSwarm'), { ssr: false });

export default function Hero() {
  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const contentY = useTransform(scrollY, [0, 700], [0, 80]);
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-28 pb-24 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 gap-16 items-center min-[900px]:grid-cols-[10fr_10fr] min-[900px]:gap-12">
          <div className="flex flex-col items-center text-center min-[900px]:items-start min-[900px]:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="glass rounded-full px-4 py-1.5 mb-8 flex items-center gap-2 text-[12px] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Type a topic. Get a ready-to-upload video.
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} className="text-[44px] sm:text-[64px] lg:text-[88px] font-bold leading-[1.0] tracking-tightest text-gradient text-glow max-w-5xl">
              Your AI Video<br />Team
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }} className="mt-7 max-w-xl text-[16px] sm:text-[18px] leading-[1.4] text-[#a8aeb8]">
              Script. Visuals. Voice. Captions. Done in minutes — fully automated, ready to upload.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }} className="mt-9 flex flex-col sm:flex-row items-center gap-3">
              <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black hover:scale-[1.03] transition-transform duration-300">
                Start for free <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
          <div className="relative min-h-[560px] pointer-events-none">
            <Suspense fallback={null}>
              <div className="absolute inset-0 z-0 pointer-events-none">
                <HeroSwarm />
              </div>
            </Suspense>
            <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_70%)]" />
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#767D88]">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
