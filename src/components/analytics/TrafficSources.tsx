'use client';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

const demoTrafficSources = [
  { source: 'YouTube Shorts feed', percentage: 42, color: 'bg-red-500' },
  { source: 'Browse features', percentage: 24, color: 'bg-cyan-500' },
  { source: 'Suggested videos', percentage: 18, color: 'bg-purple-500' },
  { source: 'Search', percentage: 11, color: 'bg-amber-500' },
  { source: 'External', percentage: 5, color: 'bg-emerald-500' },
];

export default function TrafficSources({ hasData }: { hasData: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-5"><Compass className="h-4 w-4 text-cyan-400" /><h3 className="text-[15px] font-semibold text-white">Traffic sources</h3></div>
      {hasData ? (
        <div className="space-y-4">
          {demoTrafficSources.map((src, i) => (
            <motion.div key={src.source} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.08 }}>
              <div className="flex items-center justify-between mb-2"><span className="text-[12px] text-[#a8aeb8]">{src.source}</span><span className="text-[12px] font-mono text-white">{src.percentage}%</span></div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: src.percentage + '%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 + i * 0.08 }} className={'h-full rounded-full ' + src.color} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-4">
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-xl" />
            <div className="relative h-12 w-12 rounded-xl glass flex items-center justify-center"><Compass className="h-5 w-5 text-[#767D88]" /></div>
          </motion.div>
          <p className="text-[13px] text-white font-medium">No traffic data</p>
          <p className="text-[12px] text-[#767D88] mt-1 max-w-[200px] leading-[1.4]">See where your views come from once you publish.</p>
        </div>
      )}
    </motion.div>
  );
}
