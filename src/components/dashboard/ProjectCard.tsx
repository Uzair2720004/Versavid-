'use client';
import { motion } from 'framer-motion';
import { Play, MoreHorizontal, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Video {
  id: string;
  topic: string;
  status: string;
  thumbnail_url?: string;
  created_at?: string;
}

const statusStyles: Record<string, string> = {
  ready: 'text-emerald-400 bg-emerald-400/10',
  generating: 'text-cyan-400 bg-cyan-400/10',
  failed: 'text-red-400 bg-red-400/10',
  draft: 'text-[#767D88] bg-white/5',
};

export default function ProjectCard({ project, index }: { project: Video; index: number }) {
  const router = useRouter();
  return (
    <motion.div
      onClick={() => router.push(`/videos/${project.id}`)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="group relative rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-white/15 transition-colors duration-300 cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden bg-white/5">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.topic} loading="lazy" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[11px] text-white/20 font-mono">9:16</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <span className={`absolute top-3 left-3 text-[10px] font-medium px-2 py-1 rounded-full ${statusStyles[project.status] || statusStyles.draft}`}>
          {project.status}
        </span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="h-12 w-12 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition-transform">
            <Play className="h-5 w-5 fill-white text-white ml-0.5" />
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/70">
          <span className="flex items-center gap-1 glass rounded px-2 py-0.5"><Clock className="h-3 w-3" /> —</span>
          <span className="glass rounded px-2 py-0.5 font-mono">9:16</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <h4 className="text-[13px] font-medium text-white truncate">{project.topic}</h4>
          <p className="text-[11px] text-[#767D88] mt-0.5">{project.created_at ? new Date(project.created_at).toLocaleDateString() : '—'}</p>
        </div>
        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-[#767D88] hover:text-white hover:bg-white/5 transition-colors shrink-0">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
