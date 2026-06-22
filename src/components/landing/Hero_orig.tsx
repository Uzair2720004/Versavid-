import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

/* The floating holographic video-editing timeline UI.
   Reacts to the pointer with subtle 3D parallax + tilt. */
function HolographicUI() {
  const ref = useRef<HTMLDivElement>(null);

  // raw pointer position (0..1 across the element)
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  // smoothed springs so motion feels high-end, not jittery
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

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative w-full max-w-[640px] mx-auto [perspective:1400px] select-none"
    >
      <motion.div
        style={{ rotateX, rotateY, translateX, translateY }}
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="relative [transform-style:preserve-3d]"
      >
        {/* ambient glow behind the panel */}
        <div className="absolute -inset-10 rounded-[40px] bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* main glass panel */}
        <div className="glass-strong rounded-2xl overflow-hidden relative shadow-2xl">
          {/* top bar */}
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

          {/* preview viewport */}
          <div className="relative aspect-video bg-black overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              poster="/images/feature-effects.jpg"
            >
              <source src="/videos/hero-bg.mp4" type="video/mp4" />
            </video>
            {/* grade overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-fuchsia-500/10" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.03)_50%)] bg-[length:100%_4px]" />

            {/* floating chips */}
            <div className="absolute left-4 top-4 flex items-center gap-2 glass rounded-full px-3 py-1.5 text-[11px] text-white/80">
              <Play className="h-3 w-3 fill-white/80" /> Preview
            </div>
            <div className="absolute right-4 bottom-4 glass rounded-md px-2.5 py-1 text-[10px] font-mono text-cyan-300/80">
              4K · 60fps
            </div>
          </div>

          {/* timeline tracks */}
          <div className="p-5 space-y-3 bg-gradient-to-b from-transparent to-black/40">
            <div className="flex items-center justify-between text-[10px] text-[#767D88] font-mono">
              <span>00:00:00</span>
              <span className="text-white/50">● REC</span>
              <span>00:00:24</span>
            </div>

            {/* track: video */}
            <div className="flex items-center gap-2">
              <span className="w-10 text-[9px] text-[#767D88] font-mono shrink-0">V1</span>
              <div className="flex-1 h-7 rounded-md overflow-hidden flex gap-1">
                <div className="h-full w-[22%] rounded-md bg-gradient-to-r from-cyan-500/60 to-blue-500/40 border border-white/10" />
                <div className="h-full w-[34%] rounded-md bg-gradient-to-r from-fuchsia-500/50 to-purple-500/40 border border-white/10" />
                <div className="h-full w-[18%] rounded-md bg-gradient-to-r from-amber-400/50 to-orange-500/40 border border-white/10" />
                <div className="h-full w-[26%] rounded-md bg-gradient-to-r from-emerald-400/50 to-teal-500/40 border border-white/10" />
              </div>
            </div>
            {/* track: audio */}
            <div className="flex items-center gap-2">
              <span className="w-10 text-[9px] text-[#767D88] font-mono shrink-0">A1</span>
              <div className="flex-1 h-6 rounded-md bg-white/5 border border-white/10 flex items-center gap-[2px] px-1 overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-cyan-300/40"
                    style={{ height: `${20 + Math.abs(Math.sin(i * 0.7)) * 60}%` }}
                  />
                ))}
              </div>
            </div>
            {/* track: effects */}
            <div className="flex items-center gap-2">
              <span className="w-10 text-[9px] text-[#767D88] font-mono shrink-0">FX</span>
              <div className="flex-1 h-5 rounded-md overflow-hidden flex gap-1">
                <div className="h-full w-[40%] rounded-md bg-white/5 border border-dashed border-white/15" />
                <div className="h-full w-[30%] rounded-md bg-gradient-to-r from-fuchsia-500/40 to-transparent border border-dashed border-fuchsia-300/20" />
                <div className="h-full w-[30%] rounded-md bg-white/5 border border-dashed border-white/15" />
              </div>
            </div>

            {/* playhead line */}
            <div className="relative h-1">
              <motion.div
                className="absolute top-0 bottom-0 w-px bg-white/80"
                animate={{ left: ['8%', '92%', '8%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <span className="absolute -top-1 -left-[3px] h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* floating side chips — depth layers */}
        <motion.div
          style={{ z: 60 }}
          className="absolute -right-6 -top-6 glass rounded-xl px-3 py-2 text-[10px] text-white/70 hidden sm:block"
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Render · 0.4s
          </div>
        </motion.div>
        <motion.div
          style={{ z: 50 }}
          className="absolute -left-8 bottom-16 glass rounded-xl px-3 py-2 text-[10px] text-white/70 hidden sm:block"
        >
          ✦ Prompt: &quot;cinematic slow-mo&quot;
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  // subtle parallax + fade as you scroll past hero
  const bgY = useTransform(scrollY, [0, 800], [0, 120]);
  const contentOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const contentY = useTransform(scrollY, [0, 700], [0, 80]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* full-bleed cinematic background video */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-50"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* cinematic vignette + grade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_95%)]" />
      </motion.div>

      {/* content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-28 pb-24 min-h-screen flex flex-col items-center justify-center text-center"
      >
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-full px-4 py-1.5 mb-8 flex items-center gap-2 text-[12px] text-white/70"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Turn any topic into a YouTube video in minutes
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-[44px] sm:text-[64px] lg:text-[88px] font-bold leading-[1.0] tracking-tightest text-gradient text-glow max-w-5xl"
        >
          Create Without
          <br />
          Limits
        </motion.h1>

        {/* sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="mt-7 max-w-xl text-[16px] sm:text-[18px] leading-[1.4] text-[#a8aeb8]"
        >
          The AI-powered YouTube automation tool that writes scripts, generates
          visuals, adds voiceover and captions, and publishes — all from a single topic.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3"
        >
          <a
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black hover:scale-[1.03] transition-transform duration-300"
          >
            Start creating
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* interactive holographic UI — floats above the fold */}
        <div className="mt-16 w-full">
          <HolographicUI />
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#767D88]"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}