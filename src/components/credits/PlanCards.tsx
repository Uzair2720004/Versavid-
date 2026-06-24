'use client';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Try Versavid and create your first videos',
    price: 0,
    period: 'forever',
    credits: 15,
    highlight: false,
    badge: null,
    features: ['5 AI credits (one-time)', 'AI script generation', 'AI images & video clips', 'AI voiceover', 'Auto captions', 'YouTube Shorts & Standard support'],
    cta: 'Get started',
    accent: 'from-slate-400/20 to-slate-600/5',
    checkoutUrl: '/signup',
  },
  {
    id: 'creator',
    name: 'Creator',
    tagline: 'For creators posting regularly',
    price: 19,
    period: 'month',
    credits: 40,
    highlight: true,
    badge: 'Most popular',
    features: ['40 AI credits / month', 'AI script generation', 'AI images & video clips', 'AI voiceover', 'Auto captions', 'YouTube Shorts & Standard support', 'Priority generation queue'],
    cta: 'Get started',
    accent: 'from-cyan-400/30 to-blue-600/10',
    checkoutUrl: 'https://versavid.lemonsqueezy.com/checkout/buy/5260c4ee-168c-4130-a471-e32b3fb7a4b4',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For power users and small teams',
    price: 39,
    period: 'month',
    credits: 90,
    highlight: false,
    badge: null,
    features: ['90 AI credits / month', 'Everything in Creator', 'Faster generation speed', 'Custom caption styles', 'Priority support'],
    cta: 'Get started',
    accent: 'from-fuchsia-400/30 to-purple-600/10',
    checkoutUrl: 'https://versavid.lemonsqueezy.com/checkout/buy/688d5fdd-bc76-41d7-b859-9469cf93412d',
  },
  {
    id: 'agency',
    name: 'Agency',
    tagline: 'For agencies managing multiple channels',
    price: 99,
    period: 'month',
    credits: 240,
    highlight: false,
    badge: null,
    features: ['240 AI credits / month', 'Everything in Pro', 'Highest generation speed', 'Dedicated support'],
    cta: 'Get started',
    accent: 'from-amber-400/30 to-orange-600/10',
    checkoutUrl: 'https://versavid.lemonsqueezy.com/checkout/buy/5d8895b2-1601-43d7-923d-8ac35c30c4fe',
  },
];

export default function PlanCards() {
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
              className={'relative rounded-2xl p-6 flex flex-col transition-colors ' + (plan.highlight ? 'glass-strong border-cyan-400/30' : 'bg-[#0a0a0a] border border-white/5 hover:border-white/15')}>
              {(plan as any).badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[10px] font-semibold text-black whitespace-nowrap">{(plan as any).badge}</span>}
              <div className={'absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-50 bg-gradient-to-br ' + plan.accent + ' pointer-events-none'} />
              <div className="relative">
                <h3 className="text-[18px] font-bold text-white">{plan.name}</h3>
                <p className="text-[12px] text-[#767D88] mt-1 leading-[1.3]">{plan.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-[40px] font-bold tracking-tightest text-white leading-none">${plan.price}</span>
                  <span className="text-[13px] text-[#767D88]">{plan.price === 0 ? plan.period : '/ ' + plan.period}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[12px] text-cyan-400">
                  <Sparkles className="h-3.5 w-3.5" />{plan.credits} {plan.price === 0 ? 'credits' : 'credits / mo'}
                </div>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[12px] text-[#a8aeb8] leading-[1.4]">
                      <span className={'mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 ' + (plan.highlight ? 'bg-cyan-400/20' : 'bg-white/10')}><Check className="h-2.5 w-2.5 text-white" /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={plan.checkoutUrl} target={plan.checkoutUrl === '/signup' ? '_self' : '_blank'} rel="noreferrer"
                  className={'mt-6 w-full h-10 rounded-lg font-medium text-[13px] flex items-center justify-center gap-2 transition-all duration-300 ' + (plan.highlight ? 'bg-white text-black hover:scale-[1.03]' : 'glass text-white hover:bg-white/10')}>
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

