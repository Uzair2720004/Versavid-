'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
const features = [
  { index: '01', title: 'AI Script Generation', tagline: 'From topic to script in seconds', description: 'Type any topic and Versavid writes a complete, engaging video script optimized for retention.', image: '/images/feature-editing.jpg', bullets: ['Topic-to-script AI', 'Niche-aware writing', 'Retention-optimized hooks'], accent: 'from-cyan-400/30 to-blue-500/10' },
  { index: '02', title: 'AI Images & Video Clips', tagline: 'Generate every visual automatically', description: 'Versavid generates matching images and video clips for each scene. No stock footage needed.', image: '/images/feature-effects.jpg', bullets: ['AI-generated B-roll', 'Scene-matched visuals', 'No stock licensing needed'], accent: 'from-fuchsia-500/30 to-purple-600/10' },
  { index: '03', title: 'AI Voiceover', tagline: 'Natural narration, instantly', description: 'Turn your script into a lifelike voiceover with a single click. Multiple voices and languages.', image: '/images/feature-color.jpg', bullets: ['Lifelike AI voices', 'Multiple languages', 'Consistent brand voice'], accent: 'from-amber-400/30 to-orange-500/10' },
  { index: '04', title: 'Auto Captions', tagline: 'Every word, perfectly synced', description: 'Automatic perfectly-timed captions. Word-by-word subtitles that sync flawlessly to your voiceover.', image: '/images/feature-motion.jpg', bullets: ['Word-by-word sync', 'Boosts engagement', 'Multiple caption styles'], accent: 'from-emerald-400/30 to-teal-500/10' },
  { index: '05', title: 'Shorts & Standard Support', tagline: 'One pipeline, every format', description: 'Generate YouTube Shorts (9:16) and standard videos (16:9) from the same topic automatically.', image: '/images/vid-6.jpg', bullets: ['YouTube Shorts (9:16)', 'Standard long-form (16:9)', 'Auto-reframe & reformat'], accent: 'from-violet-400/30 to-indigo-600/10' },
];
function FeatureRow({ feature, idx }: { feature: typeof features[number]; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.35, 0.7]);
  const reversed = idx % 2 === 1;
  return (
    <div ref={ref} className="relative min-h-[88vh] w-full overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <motion.img src={feature.image} alt={feature.title} style={{ y: imgY }} className="h-[120%] w-full object-cover" loading="lazy" />
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black" />
        <div className={`absolute inset-0 bg-gradient-to-tr ${feature.accent} mix-blend-screen opacity-40`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10">
        <div className={`max-w-xl ${reversed ? 'ml-auto text-right' : ''}`}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-15%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className={`flex items-center gap-3 mb-5 ${reversed ? 'justify-end' : ''}`}>
              <span className="text-[12px] font-mono text-white/40">{feature.index}</span>
              <span className="h-px w-10 bg-white/20" />
              <span className="text-[12px] uppercase tracking-[0.25em] text-white/60">{feature.tagline}</span>
            </div>
            <h2 className="text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">{feature.title}</h2>
            <p className="mt-6 text-[16px] leading-[1.4] text-[#a8aeb8] max-w-md">{feature.description}</p>
            <ul className={`mt-7 flex flex-wrap gap-2.5 ${reversed ? 'justify-end' : ''}`}>
              {feature.bullets.map((b) => (<li key={b} className="rounded-full px-3.5 py-1.5 text-[12px] text-white/80" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>{b}</li>))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
export default function Features() {
  return (
    <section id="features" className="relative bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-2xl">
          <span className="text-[12px] uppercase tracking-[0.3em] text-white/40">The Workflow</span>
          <h2 className="mt-5 text-[40px] sm:text-[56px] font-bold leading-[1.0] text-white">Everything you need<br />to make YouTube videos.</h2>
          <p className="mt-6 text-[16px] leading-[1.4] text-[#a8aeb8] max-w-lg">From script to published video — five AI systems working together.</p>
        </motion.div>
      </div>
      <div id="how" className="flex flex-col">
        {features.map((f, i) => <FeatureRow key={f.index} feature={f} idx={i} />)}
      </div>
    </section>
  );
}
