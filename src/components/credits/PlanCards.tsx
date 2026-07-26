'use client';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PLANS, type Plan } from '@/lib/constants';

export default function PlanCards() {
  const plans = PLANS as Plan[];
  return (
    <section id="plans" className="relative py-20 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-10">
          <h2 className="text-[36px] sm:text-[48px] font-bold leading-[1.0] tracking-tightest text-gradient">Choose your plan</h2>
          <p className="mt-4 text-[15px] text-[#a8aeb8] max-w-lg mx-auto">From your first AI video to a full automation pipeline.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className={'relative rounded-2xl p-6 flex flex-col transition-colors ' + (plan.highlighted ? 'glass-strong border-cyan-400/30' : 'bg-[#0a0a0a] border border-white/5 hover:border-white/15')}>
              {plan.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[10px] font-semibold text-black whitespace-nowrap">Most popular</span>}
              <div className={'absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-50 bg-gradient-to-br ' + (plan.id === 'free' ? 'from-slate-400/20 to-slate-600/5' : plan.id === 'creator' ? 'from-cyan-400/30 to-blue-600/10' : plan.id === 'pro' ? 'from-fuchsia-400/30 to-purple-600/10' : 'from-amber-400/30 to-orange-600/10') + ' pointer-events-none'} />
              <div className="relative">
                <h3 className="text-[18px] font-bold text-white">{plan.name}</h3>
                <p className="text-[12px] text-[#767D88] mt-1 leading-[1.3]">{plan.blurb}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-[40px] font-bold tracking-tightest text-white leading-none">${plan.price}</span>
                  <span className="text-[13px] text-[#767D88]">{plan.price === 0 ? plan.period : '/ ' + plan.period}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[12px] text-cyan-400">
                  <Sparkles className="h-3.5 w-3.5" />{plan.creditsLabel}
                </div>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[12px] text-[#a8aeb8] leading-[1.4]">
                      <span className={'mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 ' + (plan.highlighted ? 'bg-cyan-400/20' : 'bg-white/10')}><Check className="h-2.5 w-2.5 text-white" /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={plan.id === 'free' ? '/signup' : `https://versavid.lemonsqueezy.com/checkout/buy/${plan.id === 'creator' ? '5260c4ee-168c-4130-a471-e32b3fb7a4b4' : plan.id === 'pro' ? '688d5fdd-bc76-41d7-b859-9469cf93412d' : '5d8895b2-1601-43d7-923d-8ac35c30c4fe'}`} target={plan.id === 'free' ? '_self' : '_blank'} rel="noreferrer"
                  className={'mt-6 w-full h-10 rounded-lg font-medium text-[13px] flex items-center justify-center gap-2 transition-all duration-300 ' + (plan.highlighted ? 'bg-white text-black hover:scale-[1.03]' : 'glass text-white hover:bg-white/10')}>
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



