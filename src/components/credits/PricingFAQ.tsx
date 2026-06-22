'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: 'What is a generation credit?', a: 'One credit equals one AI-generated video. Credits are consumed when you generate a new video. Free plan credits are one-time; paid plan credits refresh monthly.' },
  { q: 'Can I buy extra credits?', a: 'Yes. Credit packs are one-time purchases that never expire. Buy them whenever you need a boost on top of your monthly plan credits.' },
  { q: 'Can I upgrade or downgrade anytime?', a: 'Absolutely. Changes take effect immediately and we prorate the difference. Downgrades apply at the end of your current billing cycle.' },
  { q: 'Is there a free plan?', a: 'Yes. The Free plan includes 15 one-time credits — no credit card required. It is perfect for trying Versavid and creating your first videos.' },
  { q: 'Do unused credits roll over?', a: 'On paid plans, unused monthly credits roll over for 60 days. One-time credit pack purchases never expire.' },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-20 bg-[#030303]">
      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-[36px] sm:text-[48px] font-bold leading-[1.0] tracking-tightest text-gradient mb-12">Questions, answered</motion.h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-5%' }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                className="rounded-xl bg-[#0a0a0a] border border-white/5 overflow-hidden">
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="text-[14px] font-medium text-white">{faq.q}</span>
                  <span className="h-6 w-6 rounded-full glass flex items-center justify-center shrink-0">
                    {isOpen ? <Minus className="h-3.5 w-3.5 text-white" /> : <Plus className="h-3.5 w-3.5 text-white" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-[13px] leading-[1.5] text-[#a8aeb8]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
