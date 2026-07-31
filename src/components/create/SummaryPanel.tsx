'use client';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Film, Image, Mic, Type, Clock, Monitor, Smartphone } from 'lucide-react';
import { useApp } from '@/lib/store';
import Link from 'next/link';

const INK = "#EEEEF3";
const MUTE = "#87869A";
const SURF = "#121218";
const BORDER = "#212129";
const ACCENT = "#8A7FFF";

function SummaryRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  if (!value || value === '-') return null;
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: BORDER }}>
      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: BORDER }}>
        <Icon className="h-4 w-4" style={{ color: ACCENT }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wide" style={{ color: MUTE }}>{label}</p>
        <p className="text-[12px] truncate" style={{ color: INK }}>{value}</p>
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
      <div className="rounded-2xl overflow-hidden" style={{ background: SURF, border: `1px solid ${BORDER}` }}>
        <div className="p-5 border-b" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4" style={{ color: ACCENT }} />
            <h3 className="text-[15px] font-semibold" style={{ color: INK }}>Summary</h3>
          </div>
          <p className="text-[11px]" style={{ color: MUTE }}>Your video configuration</p>
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
        <div className="p-5 border-t" style={{ borderColor: BORDER, background: 'linear-gradient(to bottom, transparent, rgba(138,127,255,0.05))' }}>
          {!isFreeTier ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px]" style={{ color: MUTE }}>Credits required</span>
                <span className="text-[20px] font-bold" style={{ color: INK }}>{credits}</span>
              </div>
              <button onClick={onGenerate} disabled={!canGenerate}
                className={'w-full h-11 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ' +
                  (canGenerate ? 'hover:scale-[1.03]' : 'cursor-not-allowed')}
                style={canGenerate
                  ? { background: ACCENT, color: SURF }
                  : { background: BORDER, color: MUTE }}>
                <Wand2 className="h-4 w-4" /> Generate Video
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px]" style={{ color: MUTE }}>Free videos used this month</span>
                <span className="text-[20px] font-bold" style={{ color: INK }}>{monthlyVideoCount} / 3</span>
              </div>
              <button onClick={onGenerate} disabled={!canGenerate}
                className={'w-full h-11 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ' +
                  (canGenerate ? 'hover:scale-[1.03]' : 'cursor-not-allowed')}
                style={canGenerate
                  ? { background: ACCENT, color: SURF }
                  : { background: BORDER, color: MUTE }}>
                <Wand2 className="h-4 w-4" /> Generate Video
              </button>
            </>
          )}
          {!canGenerate && <p className="mt-2 text-center text-[10px]" style={{ color: MUTE }}>Complete all steps to generate</p>}
        </div>
      </div>
      {!isFreeTier && (
        <div className="mt-3 rounded-xl p-4 flex items-center justify-between" style={{ background: SURF, border: `1px solid ${BORDER}` }}>
          <div>
            <p className="text-[11px]" style={{ color: MUTE }}>Your balance</p>
            <p className="text-[16px] font-bold" style={{ color: INK }}>{balance} credits</p>
          </div>
          <Link href="/credits" className="text-[11px] transition-colors" style={{ color: ACCENT }}>Top up</Link>
        </div>
      )}
    </motion.aside>
  );
}
