'use client';
import { motion } from 'framer-motion';
import type { ReactElement } from 'react';

const INK = '#EEEEF3';
const MUTE = '#87869A';
const FAINT = '#57566B';
const BORDER = '#212129';
const ACCENT = '#8A7FFF';
const SIGNAL = '#E8577E';

type Glyph = (p: { color: string }) => ReactElement;

const glyphs: Glyph[] = [
  // script / document icon
  ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <path d="M4 20 L4 4 L14 4 L20 10 L20 20 Z" />
      <path d="M14 4 L14 10 L20 10" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="16" x2="14" y2="16" />
    </svg>
  ),
  // image grid icon
  ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <path d="M15 15 L18 18 M18 15 L15 18" />
    </svg>
  ),
  // waveform icon
  ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <path d="M3 12 L3 12" strokeLinecap="round" />
      <path d="M6 9 L6 15 M9 6 L9 18 M12 10 L12 14 M15 4 L15 20 M18 8 L18 16 M21 11 L21 13" strokeLinecap="round" />
    </svg>
  ),
  // caption bars icon
  ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="12" y1="12" x2="18" y2="12" />
    </svg>
  ),
  // aspect-ratio icon
  ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <rect x="8" y="2" width="8" height="14" rx="1.5" />
      <rect x="2" y="18" width="20" height="4" rx="1" opacity="0.4" />
    </svg>
  ),
];

const features = [
  { index: '01', title: 'AI Script Generation', description: 'Type any topic and Versavid writes a complete, engaging video script optimized for retention.', bullets: ['Topic-to-script AI', 'Niche-aware writing', 'Retention-optimized hooks'] },
  { index: '02', title: 'AI Images & Video Clips', description: 'Versavid generates matching images and video clips for each scene. No stock footage needed.', bullets: ['AI-generated B-roll', 'Scene-matched visuals', 'No stock licensing needed'] },
  { index: '03', title: 'AI Voiceover', description: 'Turn your script into a lifelike voiceover with a single click. Multiple voices and languages.', bullets: ['Lifelike AI voices', 'Multiple languages', 'Consistent brand voice'] },
  { index: '04', title: 'Auto Captions', description: 'Automatic perfectly-timed captions. Word-by-word subtitles that sync flawlessly to your voiceover.', bullets: ['Word-by-word sync', 'Boosts engagement', 'Multiple caption styles'] },
  { index: '05', title: 'Shorts & Standard Support', description: 'Generate YouTube Shorts (9:16) and standard videos (16:9) from the same topic automatically.', bullets: ['YouTube Shorts (9:16)', 'Standard long-form (16:9)', 'Auto-reframe & reformat'] },
];

const cornerPositions = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
];

function FeatureRow({ feature, idx }: { feature: typeof features[number]; idx: number }) {
  const Glyph = glyphs[idx];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-5 py-10 sm:grid sm:grid-cols-[90px_1fr] sm:gap-8"
      style={{ borderTop: `1px solid ${BORDER}` }}
    >
      <div className="relative h-16 w-16 shrink-0">
        {cornerPositions.map((pos, i) => (
          <div
            key={i}
            className={`absolute h-[14px] w-[14px] ${pos}`}
            style={{ borderColor: ACCENT, borderStyle: 'solid', borderWidth: '1.5px', opacity: 0.5 }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <Glyph color={SIGNAL} />
        </div>
      </div>

      <div>
        <div className="mb-3 font-mono text-[12px]" style={{ color: FAINT }}>{feature.index}</div>
        <h3 className="mb-2.5 text-[24px] font-semibold leading-tight" style={{ color: INK }}>{feature.title}</h3>
        <p className="max-w-[480px] text-[15px] leading-[1.6]" style={{ color: MUTE }}>{feature.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {feature.bullets.map((b) => (
            <span key={b} className="rounded-full font-mono text-[11px] px-2.5 py-1" style={{ border: `1px solid ${BORDER}`, color: FAINT }}>{b}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative" style={{ background: '#0A0A0F' }}>
      <div className="mx-auto max-w-[880px] px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: FAINT }}>The Workflow</span>
          <h2
            className="mt-2 text-[40px] leading-[1.1]"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontStyle: 'normal', fontWeight: 500, color: INK }}
          >
            Everything you need to make YouTube videos.
          </h2>
        </motion.div>

        <div className="flex flex-col pb-px" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {features.map((f, i) => <FeatureRow key={f.index} feature={f} idx={i} />)}
        </div>
      </div>
    </section>
  );
}