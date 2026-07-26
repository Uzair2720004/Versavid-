'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrendingUp, Activity } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  suffix: string;
  delta: string;
  spark: number[];
  delay: number;
}

function useCountUp(target: number, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setN(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function Sparkline({ data }: { data: number[] }) {
  const w = 120, h = 36;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / range) * h]);
  const line = pts.map((p) => `${p[0]},${p[1]}`).join(' ');
  const area = `0,${h} ${line} ${w},${h}`;
  const gid = `spark-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke="rgba(34,211,238,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StatCard({ label, value, suffix, delta, spark, delay }: StatCardProps) {
  const animated = useCountUp(value);
  const isLive = delta === 'live';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className="relative group rounded-2xl bg-[#0a0a0a] border border-white/5 p-5 hover:border-white/15 transition-colors duration-300 overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <span className="text-[12px] text-[#767D88]">{label}</span>
        <span className={`flex items-center gap-1 text-[11px] font-medium ${isLive ? 'text-cyan-400' : 'text-emerald-400'}`}>
          {isLive ? <Activity className="h-3 w-3 animate-pulse" /> : <TrendingUp className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <div className="relative mt-3 text-[32px] font-bold tracking-tightest text-white leading-none">
        {animated.toLocaleString()}
        <span className="text-[16px] text-[#767D88] font-normal ml-1">{suffix}</span>
      </div>
      <div className="relative mt-4 -mx-1">
        <Sparkline data={spark} />
      </div>
    </motion.div>
  );
}
