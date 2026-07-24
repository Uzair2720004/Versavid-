'use client';
import { motion } from 'framer-motion';
import { Image, Video, Layers, Upload, X, Lock } from 'lucide-react';

const mediaTypes = [
  { id: 'images', label: 'Images only', description: 'AI-generated photos with motion', icon: 'Image', tier: 'free' as const },
  { id: 'videos', label: 'Videos only', description: 'AI-generated video clips', icon: 'Video', tier: 'paid' as const },
  { id: 'mixed', label: 'Mixed media', description: 'Blend of images and video clips', icon: 'Layers', tier: 'paid' as const },
];
const photoStyles = [
  { id: 'photorealistic', label: 'Photorealistic', preview: 'from-blue-400/30 to-cyan-600/10' },
  { id: 'cinematic', label: 'Cinematic', preview: 'from-amber-400/30 to-orange-600/10' },
  { id: 'anime', label: 'Anime', preview: 'from-pink-400/30 to-rose-600/10' },
  { id: '3d', label: '3D Render', preview: 'from-purple-400/30 to-indigo-600/10' },
  { id: 'watercolor', label: 'Watercolor', preview: 'from-teal-400/30 to-emerald-600/10' },
  { id: 'minimal', label: 'Minimal', preview: 'from-slate-400/30 to-slate-600/10' },
];
const videoStyles = [
  { id: 'realistic', label: 'Realistic', preview: 'from-blue-400/30 to-cyan-600/10' },
  { id: 'dreamy', label: 'Dreamy', preview: 'from-purple-400/30 to-fuchsia-600/10' },
  { id: 'fastcut', label: 'Fast cut', preview: 'from-red-400/30 to-orange-600/10' },
  { id: 'slowmo', label: 'Slow motion', preview: 'from-cyan-400/30 to-blue-600/10' },
  { id: 'retro', label: 'Retro film', preview: 'from-amber-400/30 to-yellow-600/10' },
  { id: 'neon', label: 'Neon', preview: 'from-fuchsia-400/30 to-purple-600/10' },
];
const iconMap: Record<string, any> = { Image, Video, Layers };

function StyleGrid({ options, selected, onSelect }: { options: any[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((opt) => {
        const isActive = selected === opt.id;
        return (
          <button key={opt.id} onClick={() => onSelect(opt.id)}
            className={'relative h-20 rounded-xl border overflow-hidden transition-all duration-300 group ' + (isActive ? 'border-fuchsia-400/50' : 'border-white/5 hover:border-white/15')}>
            <div className={'absolute inset-0 bg-gradient-to-br ' + opt.preview} />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            {isActive && <div className="absolute inset-0 bg-fuchsia-500/10 border-2 border-fuchsia-400/50 rounded-xl" />}
            <div className="relative h-full flex items-end p-3">
              <span className={'text-[12px] font-medium ' + (isActive ? 'text-white' : 'text-white/80')}>{opt.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function Step2Media({ selections, update, isFreeTier }: { selections: Record<string, any>; update: (k: string, v: any) => void; isFreeTier: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8">
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Media type</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mediaTypes.map((m) => {
            const Icon = iconMap[m.icon];
            const isActive = selections.mediaType === m.id;
            const isLocked = isFreeTier && m.tier === 'paid';
            return (
              <button key={m.id} onClick={() => !isLocked && update('mediaType', m.id)} disabled={isLocked}
                className={'relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ' + 
                  (isActive ? 'glass-strong border-fuchsia-400/40' : 
                    isLocked ? 'bg-[#0a0a0a] border-white/5 opacity-50 cursor-not-allowed' 
                    : 'bg-[#0a0a0a] border-white/5 hover:border-white/15')}>
                {isActive && <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-purple-600/5" />}
                {isLocked && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Lock className="h-5 w-5 text-white/30" /></div>}
                <div className="relative">
                  <div className={'h-9 w-9 rounded-lg flex items-center justify-center mb-3 ' + (isActive ? 'bg-fuchsia-500/20' : isLocked ? 'bg-white/3' : 'bg-white/5')}>
                    <Icon className={'h-4 w-4 ' + (isLocked ? 'text-white/30' : 'text-fuchsia-400')} />
                  </div>
                  <p className="text-[13px] font-medium text-white">{m.label}</p>
                  <p className="text-[10px] text-[#767D88] mt-0.5">{m.description}</p>
                  {isLocked && <p className="text-[10px] text-amber-400 mt-1">Upgrade to unlock</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {(selections.mediaType === 'images' || selections.mediaType === 'mixed') && (
        <div>
          <label className="text-[13px] font-medium text-white mb-3 block">Photo style</label>
          <StyleGrid options={photoStyles} selected={selections.photoStyle || ''} onSelect={(v) => update('photoStyle', v)} />
        </div>
      )}
      {(selections.mediaType === 'videos' || selections.mediaType === 'mixed') && !isFreeTier && (
        <div>
          <label className="text-[13px] font-medium text-white mb-3 block">Video clip style</label>
          <StyleGrid options={videoStyles} selected={selections.videoStyle || ''} onSelect={(v) => update('videoStyle', v)} />
        </div>
      )}
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Reference image <span className="text-[#767D88] font-normal">(optional)</span></label>
        {selections.refImage ? (
          <div className="flex items-center gap-3 p-3 rounded-xl glass border-fuchsia-400/30">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-purple-600/20 flex items-center justify-center">
              <Image className="h-5 w-5 text-fuchsia-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white font-medium truncate">reference.jpg</p>
              <p className="text-[10px] text-[#767D88]">Uploaded · 2.4 MB</p>
            </div>
            <button onClick={() => update('refImage', undefined)} className="h-8 w-8 rounded-lg flex items-center justify-center text-[#767D88] hover:text-white hover:bg-white/5 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => update('refImage', 'reference.jpg')} className="w-full p-6 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:border-fuchsia-400/30 transition-colors">
            <div className="flex items-center justify-center gap-2 text-[12px] text-[#767D88]">
              <Upload className="h-4 w-4" /> Upload a reference image to guide the style
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
}
