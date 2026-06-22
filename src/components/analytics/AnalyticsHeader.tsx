'use client';
import { motion } from 'framer-motion';
import { Sparkles, Database } from 'lucide-react';

const emptyStats = [
  { label: 'Total videos generated', hint: 'All videos you have created with AI.', accent: 'rgba(34,211,238,0.10)' },
  { label: 'Credits used', hint: 'Credits consumed across all generations.', accent: 'rgba(168,85,247,0.10)' },
  { label: 'Shorts created', hint: 'YouTube Shorts (9:16) generated.', accent: 'rgba(236,72,153,0.10)' },
  { label: 'Standard videos created', hint: 'Long-form (16:9) videos generated.', accent: 'rgba(59,130,246,0.10)' },
];

const demoStats = [
  { label: 'Total videos generated', value: 126, delta: '+8 this week', deltaPositive: true, spark: [8,12,10,15,13,18,16,22] },
  { label: 'Credits used', value: 342, delta: 'of 500', deltaPositive: true, spark: [20,28,24,35,42,38,52,64] },
  { label: 'Shorts created', value: 89, delta: '+6 this week', deltaPositive: true, spark: [10,14,16,18,22,26,30,34] },
  { label: 'Standard videos created', value: 37, delta: '+2 this week', deltaPositive: true, spark: [12,18,22,28,30,38,44,52] },
];

function Sparkline({ data }: { data: number[] }) {
  const w = 100; const h = 28;
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const pts = data.map((v, i) => (i / (data.length - 1)) * w + ',' + (h - ((v - min) / range) * h));
  const gid = 'as-' + Math.random().toString(36).slice(2, 8);
  return (
    <svg viewBox={'0 0 ' + w + ' ' + h} className="w-full h-7" preserveAspectRatio="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(34,211,238,0.3)" /><stop offset="100%" stopColor="rgba(34,211,238,0)" /></linearGradient></defs>
      <polygon points={'0,' + h + ' ' + pts.join(' ') + ' ' + w + ',' + h} fill={'url(#' + gid + ')'} />
      <polyline points={pts.join(' ')} fill="none" stroke="rgba(34,211,238,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnalyticsHeader({ hasData, onToggle }: { hasData: boolean; onToggle?: () => void }) {
  return (
    <section className="relative pt-28 pb-10 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/analytics-bg.jpg" alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,black_90%)]" />
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="glass rounded-full px-4 py-1.5 mb-4 inline-flex items-center gap-2 text-[12px] text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              {hasData ? '4 channels · last 30 days' : 'Welcome — analytics will appear here'}
            </div>
            <h1 className="text-[40px] sm:text-[56px] font-bold leading-[1.0] tracking-tightest text-gradient text-glow">Analytics</h1>
            <p className="mt-3 text-[15px] text-[#a8aeb8] max-w-lg">
              {hasData ? 'Track views, watch time, subscribers, and revenue across every channel — powered by your automation pipeline.' : 'Performance insights for your YouTube channels. Publish videos to unlock real-time analytics, audience data, and revenue tracking.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={onToggle} className="flex items-center gap-2 text-[12px] text-[#767D88] hover:text-white glass rounded-full px-3.5 py-2 transition-colors">
              <Database className="h-3.5 w-3.5" />{hasData ? 'Reset to empty' : 'Load demo data'}
            </button>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {hasData ? demoStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.08 }}
              className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-5 overflow-hidden group hover:border-white/15 transition-colors">
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-400/8 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-between mb-3">
                <span className="text-[12px] text-[#767D88]">{s.label}</span>
                <span className={'text-[11px] font-medium ' + (s.deltaPositive ? 'text-emerald-400' : 'text-red-400')}>{s.delta}</span>
              </div>
              <div className="relative text-[28px] font-bold tracking-tightest text-white leading-none">{s.value >= 1000 ? (s.value / 1000).toFixed(0) + 'K' : s.value}</div>
              <div className="relative mt-3 -mx-1"><Sparkline data={s.spark} /></div>
            </motion.div>
          )) : emptyStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.08 }}
              className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-5 overflow-hidden group hover:border-white/15 transition-colors">
              <motion.div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: s.accent }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }} />
              <span className="relative text-[12px] text-[#767D88]">{s.label}</span>
              <div className="relative mt-3 text-[28px] font-bold tracking-tightest text-white/20 leading-none">0</div>
              <p className="relative mt-3 text-[11px] text-[#767D88] leading-[1.4]">{s.hint}</p>
              <div className="relative mt-3 h-7 flex items-end gap-1">
                {Array.from({ length: 12 }).map((_, j) => (
                  <motion.span key={j} className="flex-1 rounded-sm bg-white/5" style={{ height: 10 + (j % 3) * 6 + '%' }} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: j * 0.15 }} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
