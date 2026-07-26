'use client';
import { motion } from 'framer-motion';
import { Play, Clock, Calendar, AlertCircle, Loader2, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  ready:      { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2 },
  published:  { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2 },
  scheduled:  { color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    icon: Calendar },
  generating: { color: 'text-amber-400',   bg: 'bg-amber-400/10',   icon: Loader2 },
  draft:      { color: 'text-[#767D88]',   bg: 'bg-white/5',        icon: Clock },
  failed:     { color: 'text-red-400',     bg: 'bg-red-400/10',     icon: AlertCircle },
};

export default function VideoCard({ video, index }: { video: any; index: number }) {
  const router = useRouter();
  const cfg = statusConfig[video.status?.toLowerCase()] || statusConfig.draft;
  const Icon = cfg.icon;
  const isProcessing = video.status === 'generating';
  return (
    <motion.div onClick={() => router.push(`/videos/${video.id}`)} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      className="group relative rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-white/15 transition-colors duration-300 cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.topic} loading="lazy" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="h-full w-full bg-white/5 flex items-center justify-center text-[11px] text-white/20 font-mono">9:16</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <span className={'absolute top-3 left-3 flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ' + cfg.bg + ' ' + cfg.color}>
          <Icon className={isProcessing ? 'h-3 w-3 animate-spin' : 'h-3 w-3'} />{video.status}
        </span>
        <span className="absolute top-3 right-3 glass rounded px-2 py-1 text-[10px] text-white/70">9:16</span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="h-12 w-12 rounded-full glass-strong flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="h-5 w-5 fill-white text-white ml-0.5" />
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[14px] font-medium text-white leading-[1.35] line-clamp-2 group-hover:text-cyan-300 transition-colors">{video.topic}</h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] text-[#767D88]">{video.created_at ? new Date(video.created_at).toLocaleDateString() : '—'}</p>
          <button className="h-7 w-7 rounded-lg flex items-center justify-center text-[#767D88] hover:text-white hover:bg-white/5 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
