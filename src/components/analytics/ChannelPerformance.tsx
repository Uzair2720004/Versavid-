'use client';
import { motion } from 'framer-motion';
import { Tv, TrendingUp } from 'lucide-react';

const demoChannels = [
  { name: 'Cosmos Daily', color: 'from-purple-400 to-indigo-500', views: 4200000, videos: 48, growth: 18 },
  { name: 'TechFlow', color: 'from-cyan-400 to-blue-500', views: 2800000, videos: 32, growth: 24 },
  { name: 'FitForge', color: 'from-emerald-400 to-teal-500', views: 1100000, videos: 27, growth: 12 },
  { name: 'FoodLab', color: 'from-amber-400 to-orange-500', views: 890000, videos: 19, growth: 31 },
];

function fmt(n: number) { return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toString(); }

export default function ChannelPerformance({ hasData }: { hasData: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }} className="rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 opacity-50 pointer-events-none select-none">
      <div className="flex items-center gap-2 mb-5"><Tv className="h-4 w-4 text-red-400" /><h3 className="text-[15px] font-semibold text-white">Channel performance</h3></div>
      {hasData ? (
        <div className="space-y-4">
          {demoChannels.map((ch, i) => (
            <motion.div key={ch.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.08 }} className="flex items-center gap-3">
              <span className={'h-9 w-9 rounded-lg bg-gradient-to-br ' + ch.color + ' flex items-center justify-center shrink-0'}><Tv className="h-4 w-4 text-white" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white truncate">{ch.name}</p>
                <p className="text-[10px] text-[#767D88]">{ch.videos} videos · {fmt(ch.views)} views</p>
              </div>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-400 shrink-0"><TrendingUp className="h-3 w-3" />+{ch.growth}%</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-4">
            <div className="absolute inset-0 rounded-xl bg-red-500/10 blur-xl" />
            <div className="relative h-12 w-12 rounded-xl glass flex items-center justify-center"><Tv className="h-5 w-5 text-[#767D88]" /></div>
          </motion.div>
          <p className="text-[13px] text-white font-medium">No channels connected</p>
          <p className="text-[12px] text-[#767D88] mt-1 max-w-[200px] leading-[1.4]">Connect a YouTube channel to track its performance.</p>
        </div>
      )}
    </motion.div>
  );
}

