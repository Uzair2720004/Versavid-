'use client';

import { motion } from 'framer-motion';

const MUTE = '#87869A';
const ACCENT = '#8A7FFF';
const SIGNAL = '#E8577E';

export function ScriptTypeVisual() {
  const lines = [
    { text: 'HOOK: Ever wondered why...', color: SIGNAL },
    { text: "Here's what nobody tells you", color: MUTE },
    { text: "Let's break it down.", color: MUTE },
  ];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2.5 px-2 font-mono text-[11px]">
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden whitespace-nowrap" style={{ color: line.color }}>
          <motion.span
            className="inline-block overflow-hidden whitespace-nowrap align-top"
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
            transition={{
              duration: 1.1,
              delay: i * 0.9,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 3.2,
              repeatType: 'loop',
            }}
          >
            {line.text}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

export function WaveformVisual() {
  const bars = Array.from({ length: 12 });
  return (
    <div className="flex h-full w-full items-center justify-center gap-[3px]">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-[4px] rounded-full"
          style={{ background: i % 2 === 0 ? ACCENT : SIGNAL, height: 20 }}
          animate={{ height: [16, 64, 28, 52, 16] }}
          transition={{
            duration: 1.6 + (i % 3) * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

export function CaptionRevealVisual() {
  const words = ['MAKE', 'VIDEOS', 'THAT', 'PEOPLE', 'ACTUALLY', 'WATCH'];
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-3 text-center font-mono text-[11px] font-semibold">
      {words.map((w, i) => (
        <motion.span
          key={w}
          animate={{ color: [MUTE, SIGNAL, MUTE] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            times: [0, 0.08, 1],
            delay: i * 0.35,
            ease: 'easeOut',
          }}
        >
          {w}
        </motion.span>
      ))}
    </div>
  );
}

export function AspectMorphVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className="relative rounded-[10px] border"
        style={{ borderColor: ACCENT }}
        animate={{ width: [46, 90, 46], height: [82, 50, 82] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: `9px solid ${SIGNAL}`,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}