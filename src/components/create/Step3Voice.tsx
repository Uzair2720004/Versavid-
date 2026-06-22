'use client';
import { motion } from 'framer-motion';
import { Mic, Volume2 } from 'lucide-react';

const voices = [
  { id: 'atlas', name: 'Atlas', description: 'Deep, authoritative narrator', gender: 'Male', accent: 'American' },
  { id: 'nova', name: 'Nova', description: 'Bright, energetic and youthful', gender: 'Female', accent: 'American' },
  { id: 'echo', name: 'Echo', description: 'Calm, measured and thoughtful', gender: 'Male', accent: 'British' },
  { id: 'luna', name: 'Luna', description: 'Warm, soothing and friendly', gender: 'Female', accent: 'American' },
  { id: 'ember', name: 'Ember', description: 'Smoky, mysterious and intense', gender: 'Female', accent: 'Australian' },
  { id: 'ridge', name: 'Ridge', description: 'Rugged, outdoorsy and bold', gender: 'Male', accent: 'American' },
  { id: 'sage', name: 'Sage', description: 'Wise, gentle and reassuring', gender: 'Female', accent: 'British' },
  { id: 'pixel', name: 'Pixel', description: 'Robotic, futuristic and fun', gender: 'Neutral', accent: 'Digital' },
];
const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Hindi'];
const speeds = [
  { id: 'slow', label: 'Slow', value: '0.85x' },
  { id: 'normal', label: 'Normal', value: '1.0x' },
  { id: 'fast', label: 'Fast', value: '1.25x' },
];
const captionStyles = [
  { id: 'bold', label: 'Bold', preview: 'font-bold text-white' },
  { id: 'wordbyword', label: 'Word by word', preview: 'font-semibold text-cyan-400' },
  { id: 'clean', label: 'Clean', preview: 'font-medium text-white/90' },
  { id: 'glow', label: 'Glow', preview: 'font-semibold text-fuchsia-400' },
  { id: 'boxed', label: 'Boxed', preview: 'font-bold text-black bg-white' },
  { id: 'type', label: 'Type', preview: 'font-mono text-emerald-400' },
];

export default function Step3Voice({ selections, update }: { selections: Record<string, any>; update: (k: string, v: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8">
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Voice</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {voices.map((v) => {
            const isActive = selections.voice === v.name;
            return (
              <button key={v.id} onClick={() => update('voice', v.name)}
                className={'relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ' + (isActive ? 'glass-strong border-fuchsia-400/40' : 'bg-[#0a0a0a] border-white/5 hover:border-white/15')}>
                {isActive && <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-purple-600/5" />}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={'h-8 w-8 rounded-full flex items-center justify-center ' + (isActive ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600' : 'bg-white/5')}>
                      <Mic className="h-3.5 w-3.5 text-white" />
                    </div>
                    {isActive && <Volume2 className="h-3.5 w-3.5 text-fuchsia-400 ml-auto" />}
                  </div>
                  <p className="text-[13px] font-medium text-white">{v.name}</p>
                  <p className="text-[10px] text-[#767D88] mt-0.5 leading-[1.3]">{v.description}</p>
                  <p className="text-[9px] text-white/30 mt-1.5">{v.gender} · {v.accent}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Language</label>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => {
            const isActive = selections.language === lang;
            return (
              <button key={lang} onClick={() => update('language', lang)}
                className={'px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 ' + (isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white' : 'bg-white/5 text-[#a8aeb8] hover:bg-white/10 hover:text-white')}>
                {lang}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Speed</label>
        <div className="flex flex-wrap gap-2">
          {speeds.map((s) => {
            const isActive = selections.speed === s.label;
            return (
              <button key={s.id} onClick={() => update('speed', s.label)}
                className={'px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 ' + (isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white' : 'bg-white/5 text-[#a8aeb8] hover:bg-white/10 hover:text-white')}>
                {s.label}<span className="ml-1.5 text-[10px] opacity-60">{s.value}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Caption style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {captionStyles.map((c) => {
            const isActive = selections.captionStyle === c.id;
            return (
              <button key={c.id} onClick={() => update('captionStyle', c.id)}
                className={'relative h-20 rounded-xl border overflow-hidden transition-all duration-300 group ' + (isActive ? 'border-fuchsia-400/50' : 'border-white/5 hover:border-white/15')}>
                <div className="absolute inset-0 bg-black/60" />
                {isActive && <div className="absolute inset-0 bg-fuchsia-500/10" />}
                <div className="relative h-full flex items-center justify-center">
                  <span className={'text-[16px] ' + c.preview}>{c.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
