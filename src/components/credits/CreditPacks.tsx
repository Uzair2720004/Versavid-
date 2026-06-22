'use client';
import { motion } from 'framer-motion';
import { Zap, Plus } from 'lucide-react';

const creditPacks = [
  { id: 'cp1', credits: 30, price: 9 },
  { id: 'cp2', credits: 100, price: 25, bonus: 'Save 17%', popular: true },
  { id: 'cp3', credits: 280, price: 59, bonus: 'Save 30%' },
  { id: 'cp4', credits: 700, price: 129, bonus: 'Save 38%' },
];

export default function CreditPacks() {
  return (
    <section id="credits" className="relative py-20 bg-[#030303]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5 text-[12px] text-white/70"><Zap className="h-3.5 w-3.5 text-amber-400" /> Top-up credits</div>
          <h2 className="text-[36px] sm:text-[48px] font-bold leading-[1.0] tracking-tightest text-gradient">Need more credits?</h2>
          <p className="mt-4 text-[15px] text-[#a8aeb8] max-w-lg mx-auto">Credits never expire. Buy a one-time pack whenever your automation pipeline needs a boost.</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {creditPacks.map((pack, i) => (
            <motion.button key={pack.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className={'group relative rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] ' + (pack.popular ? 'glass-strong border-amber-400/30' : 'bg-[#0a0a0a] border border-white/5 hover:border-white/15')}>
              {pack.bonus && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-[9px] font-semibold text-amber-300 whitespace-nowrap">{pack.bonus}</span>}
              <div className="relative">
                <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Zap className="h-5 w-5 text-amber-400" /></div>
                <div className="text-[28px] font-bold tracking-tightest text-white leading-none">{pack.credits.toLocaleString()}</div>
                <p className="text-[11px] text-[#767D88] mt-1">credits</p>
                <div className="mt-4 text-[20px] font-bold text-white">${pack.price}</div>
                <p className="text-[10px] text-[#767D88] mt-0.5">${(pack.price / pack.credits * 100).toFixed(1)}¢ per credit</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] text-white/60 group-hover:text-white transition-colors"><Plus className="h-3 w-3" /> Buy pack</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
