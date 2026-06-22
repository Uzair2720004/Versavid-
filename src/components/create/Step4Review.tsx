'use client';
import { motion } from 'framer-motion';
import { Film, Clock, Type, Image, Mic, Monitor, Smartphone, Sparkles, Check } from 'lucide-react';

function ReviewCard({ icon: Icon, label, value, delay }: { icon: any; label: string; value: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className="rounded-xl bg-[#0a0a0a] border border-white/5 p-4 hover:border-white/15 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-7 w-7 rounded-lg bg-fuchsia-500/10 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-fuchsia-400" />
        </div>
        <span className="text-[10px] text-[#767D88] uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-[13px] text-white font-medium capitalize">{value || '—'}</p>
    </motion.div>
  );
}

export default function Step4Review({ selections, credits }: { selections: Record<string, any>; credits: number }) {
  const formatIcon = selections.format === 'vertical' ? Smartphone : Monitor;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 text-[12px] text-white/70">
          <Check className="h-3.5 w-3.5 text-emerald-400" /> Everything looks ready
        </motion.div>
        <h2 className="text-[24px] font-bold tracking-tight text-white">Review your video</h2>
        <p className="text-[13px] text-[#767D88] mt-1">Confirm your settings before generating</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <ReviewCard icon={Type} label="Topic" value={selections.topic} delay={0.05} />
        <ReviewCard icon={formatIcon} label="Format" value={selections.format} delay={0.1} />
        <ReviewCard icon={Clock} label="Length" value={selections.length} delay={0.15} />
        <ReviewCard icon={Type} label="Tone" value={selections.tone} delay={0.2} />
        <ReviewCard icon={Image} label="Media type" value={selections.mediaType} delay={0.25} />
        <ReviewCard icon={Image} label="Photo style" value={selections.photoStyle} delay={0.3} />
        <ReviewCard icon={Film} label="Video style" value={selections.videoStyle} delay={0.35} />
        <ReviewCard icon={Mic} label="Voice" value={selections.voice} delay={0.4} />
        <ReviewCard icon={Type} label="Language" value={selections.language} delay={0.45} />
        <ReviewCard icon={Clock} label="Speed" value={selections.speed} delay={0.5} />
        <ReviewCard icon={Type} label="Captions" value={selections.captionStyle} delay={0.55} />
        <ReviewCard icon={Sparkles} label="Script" value={selections.scriptMode === 'ai' ? 'AI generated' : 'Uploaded'} delay={0.6} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.65 }} className="rounded-2xl glass-strong p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-fuchsia-400" />
          <h3 className="text-[14px] font-semibold text-white">Cost breakdown</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#767D88]">Video length ({selections.length || '—'})</span>
            <span className="text-white font-mono">{selections.lengthCredits || 0} credits</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#767D88]">AI voiceover ({selections.voice || '—'})</span>
            <span className="text-white font-mono">2 credits</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#767D88]">Media generation</span>
            <span className="text-white font-mono">3 credits</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#767D88]">Caption generation</span>
            <span className="text-white font-mono">1 credit</span>
          </div>
          <div className="h-px bg-white/10 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-white">Total</span>
            <span className="text-[20px] font-bold text-white">{credits} credits</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
