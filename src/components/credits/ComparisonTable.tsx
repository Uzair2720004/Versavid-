'use client';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

const plans = ['Free', 'Creator', 'Pro', 'Agency'];
const comparison = [
  { category: 'AI Generation', features: [
    { name: 'AI script generation', values: [true, true, true, true] },
    { name: 'AI images & video clips', values: [true, true, true, true] },
    { name: 'AI voiceover', values: [true, true, true, true] },
    { name: 'Auto captions', values: [true, true, true, true] },
    { name: 'Shorts & Standard support', values: [true, true, true, true] },
    { name: 'Monthly credits', values: ['15 (once)', '40', '90', '240'] },
    { name: 'Custom caption styles', values: [false, false, true, true] },
  ]},
  { category: 'Performance', features: [
    { name: 'Generation speed', values: ['Standard', 'Standard', 'Fast', 'Fastest'] },
    { name: 'Priority queue', values: [false, true, true, true] },
    { name: 'Support', values: ['Community', 'Email', 'Priority', 'Dedicated'] },
  ]},
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="h-4 w-4 text-cyan-400 mx-auto" />;
  if (value === false) return <Minus className="h-4 w-4 text-[#3a3a3a] mx-auto" />;
  return <span className="text-[12px] text-[#a8aeb8]">{value}</span>;
}

export default function ComparisonTable() {
  return (
    <section className="relative py-20 bg-black">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-[36px] sm:text-[48px] font-bold leading-[1.0] tracking-tightest text-gradient mb-12">Compare every feature</motion.h2>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-2 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <span className="text-[12px] uppercase tracking-[0.15em] text-[#767D88]">Feature</span>
              {plans.map((p) => <span key={p} className="text-center text-[13px] font-semibold text-white">{p}</span>)}
            </div>
            {comparison.map((section) => (
              <div key={section.category}>
                <div className="px-6 py-2.5 bg-white/[0.015] border-b border-white/5">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-400/70 font-medium">{section.category}</span>
                </div>
                {section.features.map((row, idx) => (
                  <div key={row.name} className={'grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-2 px-6 py-3 items-center border-b border-white/[0.03] ' + (idx % 2 === 0 ? 'bg-white/[0.01]' : '')}>
                    <span className="text-[12px] text-[#a8aeb8]">{row.name}</span>
                    {row.values.map((v, i) => <div key={i} className="text-center"><Cell value={v} /></div>)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
