'use client';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { PLANS } from '@/lib/constants';

const plans = PLANS.map((p) => p.name);
const planIds = PLANS.map((p) => p.id);
const allowedModesMap = Object.fromEntries(PLANS.map((p) => [p.id, p.allowedModes]));

const comparison = [
  { category: 'AI Generation', features: [
    { name: 'AI script generation', values: planIds.map(() => true) },
    { name: 'Stock footage (stock_only)', values: planIds.map((id) => allowedModesMap[id].includes('stock_only')) },
    { name: 'Stock + AI images (stock_plus_ai_images)', values: planIds.map((id) => allowedModesMap[id].includes('stock_plus_ai_images')) },
    { name: 'AI images only (ai_images_only)', values: planIds.map((id) => allowedModesMap[id].includes('ai_images_only')) },
    { name: 'AI images + AI video (ai_images_plus_ai_video)', values: planIds.map((id) => allowedModesMap[id].includes('ai_images_plus_ai_video')) },
    { name: 'Monthly credits', values: PLANS.map((p) => p.monthlyCredits === 3 ? '3 videos' : `${p.monthlyCredits} credits`) },
    { name: 'Custom caption styles', values: planIds.map((id) => id === 'pro' || id === 'agency') },
  ]},
  { category: 'Performance', features: [
    { name: 'Generation speed', values: ['Standard', 'Standard', 'Fast', 'Fastest'] },
    { name: 'Priority queue', values: planIds.map((id) => id !== 'free') },
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
