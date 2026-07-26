'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Upload, Smartphone, Monitor, FileText, Lock } from 'lucide-react';

const formats = [
  { id: 'vertical', label: 'Vertical', ratio: '9:16', platform: 'Shorts / Reels', icon: 'Smartphone' },
  { id: 'horizontal', label: 'Horizontal', ratio: '16:9', platform: 'Long-form', icon: 'Monitor' },
];
const lengths = [
  { id: 'short', label: 'Short', duration: '15-30s', credits: 1, tier: 'free' as const },
  { id: 'medium', label: 'Medium', duration: '1-3 min', credits: 3, tier: 'paid' as const },
  { id: 'long', label: 'Long', duration: '5-10 min', credits: 8, tier: 'paid' as const },
];
const tones = ['Energetic', 'Educational', 'Cinematic', 'Casual', 'Inspirational', 'Humorous', 'Professional', 'Storytelling'];
const iconMap: Record<string, any> = { Smartphone, Monitor };

export default function Step1Script({ selections, update, isFreeTier }: { selections: Record<string, any>; update: (k: string, v: any) => void; isFreeTier: boolean }) {
  const scriptMode = selections.scriptMode || 'ai';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') {
      const text = await file.text();
      update('topic', text);
    } else if (ext === 'docx') {
      // For docx, just store filename and notify user
      update('topic', `[Uploaded: ${file.name}] — paste your script text here or use a .txt file for auto-read`);
    } else {
      alert('Please upload a .txt or .docx file');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8">
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Script source</label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {[{ mode: 'ai', Icon: Sparkles, title: 'AI Generate', sub: 'From a topic' }, { mode: 'upload', Icon: Upload, title: 'Upload script', sub: '.txt or .docx' }].map(({ mode, Icon, title, sub }) => (
            <button key={mode} onClick={() => update('scriptMode', mode)}
              className={'flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ' + (scriptMode === mode ? 'glass-strong border-fuchsia-400/40' : 'bg-[#0a0a0a] border-white/5 hover:border-white/15')}>
              <div className={'h-9 w-9 rounded-lg flex items-center justify-center ' + (scriptMode === mode ? 'bg-fuchsia-500/20' : 'bg-white/5')}>
                <Icon className="h-4 w-4 text-fuchsia-400" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium text-white">{title}</p>
                <p className="text-[10px] text-[#767D88]">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">{scriptMode === 'ai' ? 'Topic' : 'Paste or upload your script'}</label>
        {scriptMode === 'ai' ? (
          <input type="text" value={selections.topic || ''} onChange={(e) => update('topic', e.target.value)}
            placeholder="e.g. 5 mysterious facts about deep ocean creatures"
            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white placeholder:text-[#767D88] focus:outline-none focus:border-fuchsia-400/50 transition-colors" />
        ) : (
          <div className="space-y-3">
            <textarea
              value={selections.topic || ''}
              onChange={(e) => update('topic', e.target.value)}
              placeholder="Paste your script here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white placeholder:text-[#767D88] focus:outline-none focus:border-fuchsia-400/50 transition-colors resize-none"
            />
            <div
              className="relative rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:border-fuchsia-400/30 transition-colors cursor-pointer p-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                  <FileText className="h-5 w-5 text-[#767D88]" />
                </div>
                <p className="text-[13px] text-white font-medium">Drop your script here</p>
                <p className="text-[11px] text-[#767D88] mt-1">or click to browse — .txt, .docx up to 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Format</label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {formats.map((f) => {
            const Icon = iconMap[f.icon];
            const isActive = selections.format === f.id;
            return (
              <button key={f.id} onClick={() => update('format', f.id)}
                className={'relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ' + (isActive ? 'glass-strong border-fuchsia-400/40' : 'bg-[#0a0a0a] border-white/5 hover:border-white/15')}>
                {isActive && <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-purple-600/5" />}
                <div className="relative flex items-center gap-3">
                  <Icon className="h-5 w-5 text-fuchsia-400" />
                  <div>
                    <p className="text-[13px] font-medium text-white">{f.label}</p>
                    <p className="text-[10px] text-[#767D88]">{f.ratio} · {f.platform}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

<div>
        <label className="text-[13px] font-medium text-white mb-3 block">Length</label>
        <div className="flex flex-wrap gap-2">
          {lengths.map((l) => {
            const isActive = selections.length === l.label;
            const isLocked = isFreeTier && l.tier === 'paid';
            return (
              <button key={l.id} onClick={() => !isLocked && (update('length', l.label), update('lengthCredits', l.credits))} disabled={isLocked}
                className={'relative px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 ' + 
                  (isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white' : 
                    isLocked ? 'bg-white/3 text-white/30 cursor-not-allowed' 
                    : 'bg-white/5 text-[#a8aeb8] hover:bg-white/10 hover:text-white')}>
                {isLocked && <Lock className="absolute -top-2 -right-2 h-3 w-3 text-amber-400" />}
                {l.label}<span className="ml-1.5 text-[10px] opacity-60">{l.duration}</span>
                {isLocked && <span className="block text-[9px] text-amber-400 mt-1">Upgrade to unlock</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Tone</label>
        <div className="flex flex-wrap gap-2">
          {tones.map((t) => {
            const isActive = selections.tone === t;
            return (
              <button key={t} onClick={() => update('tone', t)}
                className={'px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 ' + (isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white' : 'bg-white/5 text-[#a8aeb8] hover:bg-white/10 hover:text-white')}>
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
