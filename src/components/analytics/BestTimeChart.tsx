'use client';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const demoHourly = [
  { hour: '12a', value: 12 }, { hour: '3a', value: 8 }, { hour: '6a', value: 14 },
  { hour: '9a', value: 28 }, { hour: '12p', value: 42 }, { hour: '3p', value: 38 },
  { hour: '6p', value: 68 }, { hour: '9p', value: 82 }, { hour: '11p', value: 54 },
];

export default function BestTimeChart({ hasData }: { hasData: boolean }) {
  const max = hasData ? Math.max(...demoHourly.map((d) => d.value)) : 0;
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }} className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 overflow-hidden opacity-50 pointer-events-none select-none">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="h-4 w-4 text-fuchsia-400" />
        <h3 className="text-[15px] font-semibold text-white">Best time to post</h3>
        {hasData && <span className="text-[11px] text-[#767D88] ml-auto">peak: 9 PM</span>}
      </div>
      {hasData ? (
        <div className="flex items-end justify-between gap-2 h-32">
          {demoHourly.map((d, i) => (
            <div key={d.hour} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex-1 flex items-end">
                <motion.div initial={{ height: 0 }} animate={{ height: (d.value / max) * 100 + '%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.06 }}
                  className={'w-full rounded-t-md ' + (d.value === max ? 'bg-gradient-to-t from-fuchsia-500 to-purple-400' : 'bg-gradient-to-t from-white/10 to-white/5')} />
              </div>
              <span className="text-[9px] text-[#767D88]">{d.hour}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-4">
            <div className="absolute inset-0 rounded-xl bg-fuchsia-400/10 blur-xl" />
            <div className="relative h-12 w-12 rounded-xl glass flex items-center justify-center"><Clock className="h-5 w-5 text-[#767D88]" /></div>
          </motion.div>
          <p className="text-[13px] text-white font-medium">No timing data</p>
          <p className="text-[12px] text-[#767D88] mt-1 max-w-[200px] leading-[1.4]">Discover when your audience is most active.</p>
        </div>
      )}
    </motion.div>
  );
}

