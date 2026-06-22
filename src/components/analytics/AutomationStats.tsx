'use client';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const demoStats = [
  { label: 'Videos auto-generated', value: 126, total: 130, color: 'from-cyan-400 to-blue-500' },
  { label: 'Auto-published', value: 118, total: 126, color: 'from-emerald-400 to-teal-500' },
  { label: 'AI thumbnails created', value: 112, total: 126, color: 'from-fuchsia-400 to-purple-500' },
  { label: 'Titles AI-optimized', value: 120, total: 126, color: 'from-amber-400 to-orange-500' },
];

const emptyStats = [
  { label: 'Videos auto-generated', hint: '0 of 0 — generate videos to see this fill up.' },
  { label: 'Auto-published', hint: 'Connect a channel to enable auto-publishing.' },
  { label: 'AI thumbnails created', hint: 'Thumbnails are generated with each video.' },
  { label: 'Titles AI-optimized', hint: 'AI optimizes titles for SEO automatically.' },
];

export default function AutomationStats({ hasData }: { hasData: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }} className="rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 opacity-50 pointer-events-none select-none">
      <div className="flex items-center gap-2 mb-5"><Cpu className="h-4 w-4 text-cyan-400" /><h3 className="text-[15px] font-semibold text-white">Automation pipeline</h3></div>
      {hasData ? (
        <div className="space-y-5">
          {demoStats.map((stat, i) => {
            const pct = (stat.value / stat.total) * 100;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.55 + i * 0.08 }}>
                <div className="flex items-center justify-between mb-2"><span className="text-[12px] text-[#a8aeb8]">{stat.label}</span><span className="text-[12px] font-mono text-white">{stat.value}/{stat.total}</span></div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.65 + i * 0.08 }} className={'h-full rounded-full bg-gradient-to-r ' + stat.color} />
                </div>
              </motion.div>
            );
          })}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-[#767D88]">Automation rate</span>
            <span className="text-[16px] font-bold text-emerald-400">91%</span>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {emptyStats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.55 + i * 0.08 }}>
              <div className="flex items-center justify-between mb-2"><span className="text-[12px] text-[#a8aeb8]">{stat.label}</span><span className="text-[12px] font-mono text-white/20">0/0</span></div>
              <div className="h-2 rounded-full bg-white/5" />
              <p className="text-[10px] text-[#767D88] mt-1.5">{stat.hint}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

