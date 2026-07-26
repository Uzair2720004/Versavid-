'use client';
import { motion } from 'framer-motion';

export default function AmbientField({ variant = 'cyan' }: { variant?: 'cyan' | 'purple' | 'mixed' }) {
  const orbs =
    variant === 'cyan'
      ? [
          { c: 'rgba(34,211,238,0.18)', s: 320, x: '8%', y: '12%', d: 0 },
          { c: 'rgba(59,130,246,0.14)', s: 260, x: '72%', y: '60%', d: 1.5 },
        ]
      : variant === 'purple'
      ? [
          { c: 'rgba(168,85,247,0.18)', s: 300, x: '15%', y: '55%', d: 0 },
          { c: 'rgba(236,72,153,0.12)', s: 240, x: '78%', y: '18%', d: 2 },
        ]
      : [
          { c: 'rgba(34,211,238,0.16)', s: 280, x: '10%', y: '70%', d: 0 },
          { c: 'rgba(168,85,247,0.14)', s: 320, x: '75%', y: '25%', d: 1.8 },
          { c: 'rgba(59,130,246,0.10)', s: 200, x: '45%', y: '45%', d: 3 },
        ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ width: o.s, height: o.s, left: o.x, top: o.y, background: o.c }}
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.12, 0.95, 1] }}
          transition={{ duration: 14 + i * 3, repeat: Infinity, ease: 'easeInOut', delay: o.d }}
        />
      ))}
      {Array.from({ length: 14 }).map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i * 0.7) % 5;
        const dur = 8 + (i % 4) * 3;
        const size = 1.5 + (i % 3);
        return (
          <motion.span
            key={`p-${i}`}
            className="absolute rounded-full bg-white/40"
            style={{ width: size, height: size, left: `${left}%`, bottom: -8 }}
            animate={{ y: [0, -600], opacity: [0, 0.6, 0] }}
            transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay }}
          />
        );
      })}
    </div>
  );
}
