'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Topbar } from '@/components/dashboard/Topbar';
import AmbientField from '@/components/dashboard/AmbientField';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import ViewsChart from '@/components/analytics/ViewsChart';
import TrafficSources from '@/components/analytics/TrafficSources';
import TopVideos from '@/components/analytics/TopVideos';
import AudienceGeo from '@/components/analytics/AudienceGeo';
import BestTimeChart from '@/components/analytics/BestTimeChart';
import ChannelPerformance from '@/components/analytics/ChannelPerformance';
import AutomationStats from '@/components/analytics/AutomationStats';
import { BarChart2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [hasData, setHasData] = useState(false);
  return (
    <div className="relative min-h-screen bg-black flex">
      <div className="fixed inset-0 z-0 pointer-events-none"><AmbientField variant="mixed" /></div>
      <div className="relative z-10 flex w-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1">
            <AnalyticsHeader hasData={hasData} onToggle={() => setHasData((v) => !v)} />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-12 space-y-4">
              {!hasData && (
                <div className="relative rounded-2xl border border-white/10 overflow-hidden min-h-[340px] flex items-center justify-center">
                  <img src="/images/audience-map.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                  <div className="relative z-10 flex flex-col items-center text-center px-6 py-16">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute -inset-3 rounded-full border border-dashed border-white/15">
                        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      </motion.div>
                      <div className="relative h-16 w-16 rounded-2xl glass-strong flex items-center justify-center">
                        <BarChart2 className="h-7 w-7 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-[22px] font-bold text-white tracking-tight">Analytics unlock after your first publish</h3>
                    <p className="mt-2 text-[14px] text-[#a8aeb8] max-w-md leading-[1.4]">Generate and publish your first video to see real-time views, audience demographics, revenue, and automation insights here.</p>
                    <div className="mt-4 flex items-center gap-2 glass rounded-full px-3 py-1.5 text-[11px] text-white/60">
                      <BarChart2 className="h-3 w-3" /> Versavid tracks everything automatically
                    </div>
                    <Link href="/create" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black hover:scale-[1.03] transition-transform duration-300">
                      Create your first video <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div key={hasData ? 'demo' : 'empty'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
                    <ViewsChart hasData={hasData} />
                    <TrafficSources hasData={hasData} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
                    <TopVideos hasData={hasData} />
                    <AudienceGeo hasData={hasData} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative"><div className="absolute -top-3 left-0 right-0 flex justify-center z-10"><span className="glass rounded-full px-4 py-1 text-[11px] text-white/50 border border-white/10">Coming soon — YouTube channel integration</span></div>
                    <BestTimeChart hasData={hasData} />
                    <ChannelPerformance hasData={hasData} />
                    <AutomationStats hasData={hasData} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}



