'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/dashboard/Topbar';
import EmptyStatCard from '@/components/dashboard/EmptyStatCard';
import ProjectsEmpty from '@/components/dashboard/ProjectsEmpty';
import AmbientField from '@/components/dashboard/AmbientField';
import { useApp } from '@/lib/store';

const emptyStats = [
  { label: 'Videos created', hint: 'Your created videos will be counted here.', accent: 'rgba(34,211,238,0.12)' },
  { label: 'Credits remaining', hint: '3 free videos every month to get you started.', accent: 'rgba(168,85,247,0.12)' },
  { label: 'Videos this month', hint: 'New videos you create this month.', accent: 'rgba(236,72,153,0.12)' },
  { label: 'Credits used', hint: 'Credits consumed by your generations.', accent: 'rgba(59,130,246,0.12)' },
];

export default function DashboardPage() {
  const { profile } = useApp();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const userName = profile?.full_name?.split(' ')[0] || 'there';
  const handleGenerate = () => router.push('/create');

  return (
    <div className="relative min-h-screen bg-black flex">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AmbientField variant="mixed" />
      </div>
      <div className="relative z-10 flex w-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1 px-6 lg:px-8 py-8 space-y-8">

            {/* Hero banner */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-2xl border border-white/5"
            >
              <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-30">
                <source src="/videos/hero-bg.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
              <div className="relative z-10 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <p className="text-[12px] text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Welcome to Versavid, {userName}
                  </p>
                  <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tightest text-white leading-[1.05]">
                    Create your first video
                  </h1>
                  <p className="mt-2 text-[14px] text-[#a8aeb8] max-w-md">
                    Type any topic and Versavid writes the script, generates visuals, adds voiceover and captions.
                  </p>
                </div>
                <div className="w-full lg:max-w-md">
                  <div className="glass-strong rounded-xl p-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter a topic for your video..."
                      className="flex-1 bg-transparent text-[13px] text-white placeholder:text-[#767D88] focus:outline-none py-2"
                    />
                    <button
                      onClick={handleGenerate}
                      className="h-9 px-4 rounded-lg bg-white text-black text-[13px] font-medium hover:scale-[1.03] transition-transform flex items-center gap-1.5 shrink-0"
                    >
                      <Wand2 className="h-3.5 w-3.5" /> Generate
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Empty stat cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {emptyStats.map((s, i) => (
                <EmptyStatCard key={s.label} {...s} delay={0.15 + i * 0.08} />
              ))}
            </section>

            {/* Empty projects */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[18px] font-semibold text-white">Recent videos</h2>
                  <p className="text-[12px] text-[#767D88] mt-0.5">Nothing here yet</p>
                </div>
              </div>
              <ProjectsEmpty onCreate={handleGenerate} />
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

