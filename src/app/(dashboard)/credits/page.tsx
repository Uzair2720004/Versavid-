'use client';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Topbar } from '@/components/dashboard/Topbar';
import AmbientField from '@/components/dashboard/AmbientField';
import UsageHeader from '@/components/credits/UsageHeader';
import PlanCards from '@/components/credits/PlanCards';
import ComparisonTable from '@/components/credits/ComparisonTable';
import PricingFAQ from '@/components/credits/PricingFAQ';
import PricingCTA from '@/components/credits/PricingCTA';
import { useApp } from '@/lib/store';
import Link from 'next/link';

export default function CreditsPage() {
  const { profile, credits: creditsState } = useApp();
  const isFreeTier = profile?.plan === 'free';
  const monthlyCount = profile?.monthly_video_count ?? 0;
  const balance = creditsState?.balance ?? 0;

  return (
    <div className="relative bg-black min-h-screen flex">
      <div className="fixed inset-0 z-0 pointer-events-none"><AmbientField variant="mixed" /></div>
      <div className="relative z-10 flex w-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1">
            <UsageHeader />
            <div className="pb-12">
              {/* Plan summary */}
              <section className="relative py-12">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-xl mx-auto rounded-2xl glass-strong border-white/10 p-8 text-center">
                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5 text-[12px] text-white/70">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Current plan
                    </div>
                    <h3 className="text-[28px] font-bold text-white capitalize">{profile?.plan ?? 'Free'}</h3>
                    {isFreeTier ? (
                      <>
                        <p className="mt-2 text-[14px] text-[#a8aeb8]">Free plan — 3 videos per month</p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                          <span className="text-[40px] font-bold tracking-tightest text-white leading-none">{monthlyCount}</span>
                          <span className="text-[14px] text-[#767D88]">/ 3 free videos used this month</span>
                        </div>
                        <Link href="/pricing"
                          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black hover:scale-[1.03] transition-transform">
                          Upgrade to unlock more <ArrowRight className="h-4 w-4" />
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="mt-2 text-[14px] text-[#a8aeb8]">{profile?.plan === 'creator' ? 'Creator' : profile?.plan === 'pro' ? 'Pro' : 'Agency'} plan</p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                          <span className="text-[40px] font-bold tracking-tightest text-white leading-none">{balance}</span>
                          <span className="text-[14px] text-[#767D88]">credits remaining</span>
                        </div>
                        <Link href="/pricing"
                          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[13px] font-medium text-white hover:bg-white/10 transition-colors">
                          Change plan <ArrowRight className="h-4 w-4" />
                        </Link>
                      </>
                    )}
                  </motion.div>
                </div>
              </section>
              <PlanCards />
              <ComparisonTable />
              <PricingFAQ />
              <PricingCTA />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
