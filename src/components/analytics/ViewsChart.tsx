'use client';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const demoWeeklyViews = [
  { day: 'Mon', value: 32000 }, { day: 'Tue', value: 48000 }, { day: 'Wed', value: 41000 },
  { day: 'Thu', value: 67000 }, { day: 'Fri', value: 58000 }, { day: 'Sat', value: 72000 }, { day: 'Sun', value: 49000 },
];

export default function ViewsChart({ hasData }: { hasData: boolean }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (!hasData) return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 overflow-hidden">
      <motion.div animate={{ x: [0, 60, 0], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 left-1/4 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
      <div className="relative mb-6"><h3 className="text-[15px] font-semibold text-white">Views over time</h3><p className="text-[12px] text-[#767D88] mt-0.5">Daily views · last 7 days</p></div>
      <div className="relative flex flex-col items-center justify-center h-[200px] text-center">
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-4">
          <div className="absolute inset-0 rounded-xl bg-cyan-400/15 blur-xl" />
          <div className="relative h-12 w-12 rounded-xl glass flex items-center justify-center"><BarChart3 className="h-5 w-5 text-[#767D88]" /></div>
        </motion.div>
        <p className="text-[13px] text-white font-medium">No data yet</p>
        <p className="text-[12px] text-[#767D88] mt-1">Views will chart here once you publish videos.</p>
      </div>
      <div className="relative flex items-end justify-between gap-2 mt-4 h-12 px-2">
        {days.map((d, i) => (
          <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
            <motion.span className="w-full rounded-sm bg-white/5" animate={{ height: ['20%', '35%', '15%', '25%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }} style={{ height: '20%' }} />
            <span className="text-[10px] text-white/15">{d}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const w = 560; const h = 200; const padX = 24; const padY = 24;
  const max = Math.max(...demoWeeklyViews.map((d) => d.value)) * 1.15;
  const points = demoWeeklyViews.map((d, i) => ({ x: padX + (i / (demoWeeklyViews.length - 1)) * (w - padX * 2), y: h - padY - (d.value / max) * (h - padY * 2), ...d }));
  const linePath = points.map((p, i) => (i === 0 ? 'M ' + p.x + ' ' + p.y : 'L ' + p.x + ' ' + p.y)).join(' ');
  const areaPath = linePath + ' L ' + points[points.length - 1].x + ' ' + (h - padY) + ' L ' + points[0].x + ' ' + (h - padY) + ' Z';

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} className="rounded-2xl bg-[#0a0a0a] border border-white/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h3 className="text-[15px] font-semibold text-white">Views over time</h3><p className="text-[12px] text-[#767D88] mt-0.5">Daily views · last 7 days</p></div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#767D88]"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Views</span>
          <span className="text-emerald-400 font-medium">+12.4%</span>
        </div>
      </div>
      <svg viewBox={'0 0 ' + w + ' ' + h} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="views-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(34,211,238,0.30)" /><stop offset="100%" stopColor="rgba(34,211,238,0)" /></linearGradient>
          <linearGradient id="views-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={padX} x2={w - padX} y1={padY + g * (h - padY * 2)} y2={padY + g * (h - padY * 2)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
        <motion.path d={areaPath} fill="url(#views-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} />
        <motion.path d={linePath} fill="none" stroke="url(#views-line)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }} />
        {points.map((p, i) => (
          <motion.g key={p.day} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 1.2 + i * 0.08 }}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#000" stroke="#22d3ee" strokeWidth="2" />
            <text x={p.x} y={h - 6} textAnchor="middle" fill="#767D88" style={{ fontSize: '10px' }}>{p.day}</text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}
