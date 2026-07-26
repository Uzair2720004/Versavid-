'use client';
import { motion } from 'framer-motion';

interface EmptyStatCardProps {
  label: string;
  hint: string;
  accent?: string;
  delay: number;
}

export default function EmptyStatCard({ label, hint, accent = 'rgba(34,211,238,0.12)', delay }: EmptyStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-5 overflow-hidden group hover:border-white/15 transition-colors"
    >
      <motion.div
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: accent }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
      />
      <span className="relative text-[12px] text-[#767D88]">{label}</span>
      <div className="relative mt-3 text-[32px] font-bold tracking-tightest text-white/30 leading-none">0</div>
      <p className="relative mt-4 text-[11px] text-[#767D88] leading-[1.4]">{hint}</p>
      <div className="relative mt-3 h-9 flex items-end gap-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-sm bg-white/5"
            style={{ height: 10 + (i % 3) * 6 + '%' }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
