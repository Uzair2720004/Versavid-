'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';

export default function HolographicUI() {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.8 });
  const rotateY = useTransform(sx, [0, 1], [16, -16]);
  const rotateX = useTransform(sy, [0, 1], [-12, 12]);
  const translateX = useTransform(sx, [0, 1], [-18, 18]);
  const translateY = useTransform(sy, [0, 1], [-12, 12]);
  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={() => { px.set(0.5); py.set(0.5); }} className="relative w-full max-w-[640px] mx-auto [perspective:1400px] select-none">
      <motion.div style={{ rotateX, rotateY, translateX, translateY }} initial={{ opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }} className="relative [transform-style:preserve-3d]">
        <div className="absolute -inset-10 rounded-[40px] bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="glass-strong rounded-2xl overflow-hidden relative shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#767D88] font-medium tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              versavid · timeline.ai
            </div>
            <Sparkles className="h-4 w-4 text-white/40" />
          </div>
          <div className="relative aspect-video bg-black overflow-hidden">
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-90" poster="/images/feature-effects.jpg">
              <source src="/videos/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-fuchsia-500/10" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.03)_50%)] bg-[length:100%_4px]" />
            <div className="absolute left-4 top-4 flex items-center gap-2 glass rounded-full px-3 py-1.5 text-[11px] text-white/80">
              <Play className="h-3 w-3 fill-white/80" /> Preview
            </div>
            <div className="absolute right-4 bottom-4 glass rounded-md px-2.5 py-1 text-[10px] font-mono text-cyan-300/80">4K · 60fps</div>
          </div>
          <div className="p-5 space-y-3 bg-gradient-to-b from-transparent to-black/40">
            <div className="flex items-center justify-between text-[10px] text-[#767D88] font-mono">
              <span>00:00:00</span><span className="text-white/50">● REC</span><span>00:00:24</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-[9px] text-[#767D88] font-mono shrink-0">V1</span>
              <div className="flex-1 h-7 rounded-md overflow-hidden flex gap-1">
                <div className="h-full w-[22%] rounded-md bg-gradient-to-r from-cyan-500/60 to-blue-500/40 border border-white/10" />
                <div className="h-full w-[34%] rounded-md bg-gradient-to-r from-fuchsia-500/50 to-purple-500/40 border border-white/10" />
                <div className="h-full w-[18%] rounded-md bg-gradient-to-r from-amber-400/50 to-orange-500/40 border border-white/10" />
                <div className="h-full w-[26%] rounded-md bg-gradient-to-r from-emerald-400/50 to-teal-500/40 border border-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-[9px] text-[#767D88] font-mono shrink-0">A1</span>
              <div className="flex-1 h-6 rounded-md bg-white/5 border border-white/10 flex items-center gap-[2px] px-1 overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (<span key={i} className="w-[3px] rounded-full bg-cyan-300/40" style={{ height: `${20 + Math.abs(Math.sin(i * 0.7)) * 60}%` }} />))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-[9px] text-[#767D88] font-mono shrink-0">FX</span>
              <div className="flex-1 h-5 rounded-md overflow-hidden flex gap-1">
                <div className="h-full w-[40%] rounded-md bg-white/5 border border-dashed border-white/15" />
                <div className="h-full w-[30%] rounded-md bg-gradient-to-r from-fuchsia-500/40 to-transparent border border-dashed border-fuchsia-300/20" />
                <div className="h-full w-[30%] rounded-md bg-white/5 border border-dashed border-white/15" />
              </div>
            </div>
            <div className="relative h-1">
              <motion.div className="absolute top-0 bottom-0 w-px bg-white/80" animate={{ left: ['8%', '92%', '8%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
                <span className="absolute -top-1 -left-[3px] h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </motion.div>
            </div>
          </div>
        </div>
        <motion.div style={{ z: 60 }} className="absolute -right-6 -top-6 glass rounded-xl px-3 py-2 text-[10px] text-white/70 hidden sm:block">
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Render · 0.4s</div>
        </motion.div>
        <motion.div style={{ z: 50 }} className="absolute -left-8 bottom-16 glass rounded-xl px-3 py-2 text-[10px] text-white/70 hidden sm:block">
          ✦ Prompt: &quot;cinematic slow-mo&quot;
        </motion.div>
      </motion.div>
    </div>
  );
}
