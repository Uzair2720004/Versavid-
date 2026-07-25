'use client';
import { motion } from 'framer-motion';
import { Image, Video, Layers, Film, Lock, Sparkles } from 'lucide-react';

type UserPlan = 'free' | 'creator' | 'pro' | 'agency';

const generationModes = [
  { id: 'stock_only', label: 'Stock footage only', description: 'Curated stock video clips', icon: 'Film', tier: 'free' as const },
  { id: 'stock_plus_ai_images', label: 'Stock + AI Images', description: 'Stock photos mixed with AI images', icon: 'Layers', tier: 'creator' as const },
  { id: 'ai_images_only', label: 'AI Images only', description: 'AI-generated images with motion', icon: 'Image', tier: 'creator' as const },
  { id: 'ai_images_plus_ai_video', label: 'AI Images + AI Video', description: 'AI images animated into video clips', icon: 'Sparkles', tier: 'pro' as const },
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
const iconMap: Record<string, any> = { Image, Video, Layers, Film, Sparkles };

const tierOrder: Record<UserPlan, number> = { free: 0, creator: 1, pro: 2, agency: 3 };

function isModeAllowed(plan: UserPlan, modeTier: 'free' | 'creator' | 'pro'): boolean {
  const requiredTier = tierOrder[modeTier as UserPlan];
  const userTier = tierOrder[plan];
  return userTier >= requiredTier;
}

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

export default function Step2Media({ selections, update, isFreeTier, userPlan }: { selections: Record<string, any>; update: (k: string, v: any) => void; isFreeTier: boolean; userPlan?: UserPlan }) {
  const plan = userPlan ?? (isFreeTier ? 'free' : 'pro');
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8">
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Generation mode</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {generationModes.map((m) => {
            const Icon = iconMap[m.icon];
            const isActive = selections.generationMode === m.id;
            const isLocked = !isModeAllowed(plan, m.tier);
            return (
              <button key={m.id} onClick={() => !isLocked && update('generationMode', m.id)} disabled={isLocked}
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
      {(selections.generationMode === 'ai_images_only' || selections.generationMode === 'ai_images_plus_ai_video' || selections.generationMode === 'stock_plus_ai_images') && (
        <div>
          <label className="text-[13px] font-medium text-white mb-3 block">Photo style</label>
          <StyleGrid options={photoStyles} selected={selections.photoStyle || ''} onSelect={(v) => update('photoStyle', v)} />
        </div>
      )}
      {(selections.generationMode === 'ai_images_plus_ai_video') && !isFreeTier && (
        <div>
          <label className="text-[13px] font-medium text-white mb-3 block">Video clip style</label>
          <StyleGrid options={videoStyles} selected={selections.videoStyle || ''} onSelect={(v) => update('videoStyle', v)} />
        </div>
      )}
      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Reference image <span className="text-[#767D88] font-normal">(optional)</span></label>
        {selections.referenceImage ? (
          <div className="flex items-center gap-3 p-3 rounded-xl glass border-fuchsia-400/30">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-purple-600/20 flex items-center justify-center">
              <Image className="h-5 w-5 text-fuchsia-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white font-medium truncate">reference.jpg</p>
              <p className="text-[10px] text-[#767D88]">Uploaded · 2.4 MB</p>
            </div>
            <button onClick={() => update('referenceImage', undefined)} className="h-8 w-8 rounded-lg flex items-center justify-center text-[#767D88] hover:text-white hover:bg-white/5 transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        ) : (
          <button onClick={() => update('referenceImage', 'reference.jpg')} className="w-full p-6 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:border-fuchsia-400/30 transition-colors">
            <div className="flex items-center justify-center gap-2 text-[12px] text-[#767D88]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload a reference image to guide the style
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
}
