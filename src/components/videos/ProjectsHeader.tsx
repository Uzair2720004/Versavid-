'use client';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Video, Eye } from 'lucide-react';
import Link from 'next/link';

function Sparkline({ data }: { data: number[] }) {
  const w = 100; const h = 28;
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const pts = data.map((v, i) => (i / (data.length - 1)) * w + ',' + (h - ((v - min) / range) * h));
  const gid = 'spark-' + Math.random().toString(36).slice(2, 8);
  return (
    <svg viewBox={'0 0 ' + w + ' ' + h} className="w-full h-7" preserveAspectRatio="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(34,211,238,0.3)" /><stop offset="100%" stopColor="rgba(34,211,238,0)" /></linearGradient></defs>
      <polygon points={'0,' + h + ' ' + pts.join(' ') + ' ' + w + ',' + h} fill={'url(#' + gid + ')'} />
      <polyline points={pts.join(' ')} fill="none" stroke="rgba(34,211,238,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const emptyStats = [
  { label: 'Total videos', hint: 'Your generated videos will appear here.', accent: 'rgba(168,85,247,0.10)', Icon: Video },
  { label: 'Credits used', hint: 'Credits consumed by your generations.', accent: 'rgba(34,211,238,0.10)', Icon: Eye },
];

export default function ProjectsHeader({ hasData, videoCount }: { hasData: boolean; videoCount: number }) {
  const liveStats = [
    { label: 'Total videos', value: videoCount, delta: `+${videoCount} total`, spark: [0,0,0,0,0,0,0,videoCount], Icon: Video },
    { label: 'Credits used', value: 0, delta: 'of your credits', spark: [0,0,0,0,0,0,0,0], Icon: Eye },
  ];
  return (
    <section className="relative pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-20"><source src="/videos/hero-bg.mp4" type="video/mp4" /></video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,black_90%)]" />
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="glass rounded-full px-4 py-1.5 mb-4 inline-flex items-center gap-2 text-[12px] text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              {hasData ? `${videoCount} videos generated` : "Welcome — let's create your first video"}
            </div>
            <h1 className="text-[40px] sm:text-[56px] font-bold leading-[1.0] tracking-tightest text-gradient text-glow">My Videos</h1>
            <p className="mt-3 text-[15px] text-[#a8aeb8] max-w-lg">
              {hasData ? 'Every video Versavid has generated, published, and scheduled across your channels.' : 'Your generated, scheduled, and published videos will live here. Start by creating your first one.'}
            </p>
          </div>
          <Link href="/create" className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black hover:scale-[1.03] transition-transform duration-300">
            <Sparkles className="h-4 w-4" /> Generate new video
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          {hasData ? liveStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.08 }}
              className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-5 overflow-hidden group hover:border-white/15 transition-colors">
              <div className="relative flex items-center justify-between mb-3"><span className="text-[12px] text-[#767D88]">{s.label}</span><s.Icon className="h-4 w-4 text-white/30" /></div>
              <div className="relative text-[28px] font-bold tracking-tightest text-white leading-none">{s.value}</div>
              <div className="relative mt-1 flex items-center gap-1 text-[11px] text-emerald-400"><TrendingUp className="h-3 w-3" />{s.delta}</div>
              <div className="relative mt-3 -mx-1"><Sparkline data={s.spark} /></div>
            </motion.div>
          )) : emptyStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.08 }}
              className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-5 overflow-hidden group hover:border-white/15 transition-colors">
              <motion.div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-60" style={{ background: s.accent }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }} />
              <div className="relative flex items-center justify-between mb-3"><span className="text-[12px] text-[#767D88]">{s.label}</span><s.Icon className="h-4 w-4 text-white/20" /></div>
              <div className="relative text-[28px] font-bold tracking-tightest text-white/20 leading-none">0</div>
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


