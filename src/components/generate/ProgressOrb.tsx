'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface GenStepLike {
  key: string;
  label: string;
  status: 'waiting' | 'running' | 'done' | 'failed';
}

const ORB_A = '#f0abfc';
const ORB_B = '#d946ef';
const ORB_C = '#9333ea';

export default function ProgressOrb({
  progress,
  steps,
}: {
  progress: number;
  steps: GenStepLike[];
}) {
  const activeStep =
    steps.find((s) => s.status === 'running') ??
    [...steps].reverse().find((s) => s.status === 'done') ??
    steps[0];

  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, progress));
  const offset = circumference * (1 - pct / 100);

  const particles = Array.from({ length: 6 });

  return (
    <div className="flex flex-col items-center py-10">
      <div className="relative h-[220px] w-[220px]">
        {/* Soft layered halo — bloom effect without WebGL */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${ORB_B}55 0%, transparent 70%)`,
            filter: 'blur(24px)',
          }}
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${ORB_C}40 0%, transparent 60%)`,
            filter: 'blur(40px)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.1, 1.3, 1.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Orbiting light particles */}
        {particles.map((_, i) => {
          const angle = (i / particles.length) * 360;
          const duration = 8 + i * 1.3;
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-[6px] w-[6px] rounded-full"
              style={{
                background: i % 2 === 0 ? ORB_A : ORB_B,
                boxShadow: `0 0 8px 2px ${i % 2 === 0 ? ORB_A : ORB_B}`,
                marginLeft: -3,
                marginTop: -3,
              }}
              animate={{
                rotate: [angle, angle + 360],
              }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
            >
              <div
                style={{
                  transform: 'translateX(98px)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'inherit',
                }}
              />
            </motion.div>
          );
        })}

        {/* Progress ring */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#212129" strokeWidth="3" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#orbGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.6s ease',
              filter: `drop-shadow(0 0 6px ${ORB_B}99)`,
            }}
          />
          <defs>
            <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ORB_A} />
              <stop offset="100%" stopColor={ORB_C} />
            </linearGradient>
          </defs>
        </svg>

        {/* Core orb with shimmer sweep */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative h-[118px] w-[118px] overflow-hidden rounded-full"
            style={{
              background: `radial-gradient(circle at 32% 30%, ${ORB_A}, ${ORB_B} 45%, ${ORB_C} 100%)`,
              boxShadow: `0 0 50px 8px ${ORB_B}66, inset 0 0 20px rgba(255,255,255,0.15)`,
            }}
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute inset-[-50%]"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.25) 12%, transparent 24%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[24px] font-semibold text-white"
            style={{ textShadow: `0 0 16px ${ORB_B}` }}
          >
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      <div className="mt-6 h-6 relative w-full max-w-[320px] text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeStep?.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-x-0 text-[14px]"
            style={{ color: '#a8aeb8' }}
          >
            {activeStep?.label ?? 'Getting started'}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
