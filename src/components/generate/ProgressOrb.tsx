'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface GenStepLike {
  key: string;
  label: string;
  status: 'waiting' | 'running' | 'done' | 'failed';
}

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

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, progress)) / 100);

  return (
    <div className="flex flex-col items-center py-10">
      <div className="relative h-[200px] w-[200px]">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#212129"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#orbGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <defs>
            <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="h-[110px] w-[110px] rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #f0abfc, #d946ef 45%, #9333ea 100%)',
              boxShadow: '0 0 60px 10px rgba(217,70,239,0.35)',
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[22px] font-semibold text-white">
            {Math.round(progress)}%
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
