'use client';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Film, Image, Mic, Type, Clock, Monitor, Smartphone } from 'lucide-react';
import { useApp } from '@/lib/store';
import Link from 'next/link';

function SummaryRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  if (!value || value === '-') return null;
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-fuchsia-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[#767D88] uppercase tracking-wide">{label}</p>
        <p className="text-[12px] text-white truncate">{value}</p>
      </div>
    </motion.div>
  );
}

export default function SummaryPanel({ selections, credits, onGenerate, canGenerate, isFreeTier, monthlyVideoCount }: { selections: Record<string, any>; credits: number; onGenerate: () => void; canGenerate: boolean; isFreeTier: boolean; monthlyVideoCount: number }) {
  const { credits: userCredits } = useApp();
  const balance = (userCredits as any)?.balance ?? userCredits ?? 0;
  const formatIcon = selections.format === 'vertical' ? Smartphone : Monitor;

  return (
    <motion.aside initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-80 shrink-0 hidden lg:flex flex-col sticky top-16 self-start">
      <div className="rounded-2xl glass-strong border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-fuchsia-400" />
            <h3 className="text-[15px] font-semibold text-white">Summary</h3>
          </div>
          <p className="text-[11px] text-[#767D88]">Your video configuration</p>
        </div>
        <div className="p-5 space-y-0">
          <SummaryRow icon={Film} label="Topic" value={selections.topic || '-'} />
          <SummaryRow icon={formatIcon} label="Format" value={selections.format ? (selections.format === 'vertical' ? 'Vertical 9:16' : 'Horizontal 16:9') : '-'} />
          <SummaryRow icon={Clock} label="Length" value={selections.length || '-'} />
          <SummaryRow icon={Type} label="Tone" value={selections.tone || '-'} />
          <SummaryRow icon={Film} label="Generation mode" value={selections.generationMode || '-'} />
          <SummaryRow icon={Image} label="Photo style" value={selections.photoStyle || '-'} />
          <SummaryRow icon={Film} label="Video style" value={selections.videoStyle || '-'} />
          <SummaryRow icon={Mic} label="Voice" value={selections.voice || '-'} />
          <SummaryRow icon={Type} label="Language" value={selections.language || '-'} />
          <SummaryRow icon={Clock} label="Speed" value={selections.speed || '-'} />
          <SummaryRow icon={Type} label="Captions" value={selections.captionStyle || '-'} />
        </div>
        <div className="p-5 border-t border-white/10 bg-gradient-to-b from-transparent to-fuchsia-500/5">
          {!isFreeTier ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] text-[#767D88]">Credits required</span>
                <span className="text-[20px] font-bold text-white">{credits}</span>
              </div>
              <button onClick={onGenerate} disabled={!canGenerate}
                className={'w-full h-11 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ' +
                  (canGenerate ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:scale-[1.03]' : 'bg-white/5 text-[#767D88] cursor-not-allowed')}>
                <Wand2 className="h-4 w-4" /> Generate Video
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] text-[#767D88]">Free videos used this month</span>
                <span className="text-[20px] font-bold text-white">{monthlyVideoCount} / 3</span>
              </div>
              <button onClick={onGenerate} disabled={!canGenerate}
                className={'w-full h-11 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ' +
                  (canGenerate ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:scale-[1.03]' : 'bg-white/5 text-[#767D88] cursor-not-allowed')}>
                <Wand2 className="h-4 w-4" /> Generate Video
              </button>
            </>
          )}
          {!canGenerate && <p className="mt-2 text-center text-[10px] text-[#767D88]">Complete all steps to generate</p>}
        </div>
      </div>
      {!isFreeTier && (
        <div className="mt-3 rounded-xl glass p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#767D88]">Your balance</p>
            <p className="text-[16px] font-bold text-white">{balance} credits</p>
          </div>
          <Link href="/credits" className="text-[11px] text-fuchsia-400 hover:text-fuchsia-300 transition-colors">Top up</Link>
        </div>
      )}
    </motion.aside>
  );
}
