'use client';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const demoCountries = [
  { country: 'United States', code: 'US', views: 284000, percentage: 31 },
  { country: 'India', code: 'IN', views: 156000, percentage: 17 },
  { country: 'United Kingdom', code: 'GB', views: 98000, percentage: 11 },
  { country: 'Germany', code: 'DE', views: 72000, percentage: 8 },
  { country: 'Brazil', code: 'BR', views: 64000, percentage: 7 },
  { country: 'Canada', code: 'CA', views: 51000, percentage: 6 },
];

function fmt(n: number) { return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toString(); }

export default function AudienceGeo({ hasData }: { hasData: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }} className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-5"><Globe className="h-4 w-4 text-cyan-400" /><h3 className="text-[15px] font-semibold text-white">Top countries</h3></div>
      {hasData ? (
        <div className="space-y-3">
          {demoCountries.map((c, i) => (
            <motion.div key={c.code} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.08 }} className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#767D88] w-7 shrink-0">{c.code}</span>
              <span className="text-[12px] text-[#a8aeb8] flex-1 truncate">{c.country}</span>
              <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden shrink-0">
                <motion.div initial={{ width: 0 }} animate={{ width: c.percentage + '%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 + i * 0.08 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>
              <span className="text-[11px] font-mono text-white w-12 text-right shrink-0">{fmt(c.views)}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-4">
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-xl" />
            <div className="relative h-12 w-12 rounded-xl glass flex items-center justify-center"><Globe className="h-5 w-5 text-[#767D88]" /></div>
          </motion.div>
          <p className="text-[13px] text-white font-medium">No audience data</p>
          <p className="text-[12px] text-[#767D88] mt-1 max-w-[200px] leading-[1.4]">Geographic breakdown appears once you have viewers.</p>
        </div>
      )}
    </motion.div>
  );
}
