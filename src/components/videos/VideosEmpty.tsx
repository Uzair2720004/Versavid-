'use client';
import { motion } from 'framer-motion';
import { Film, Plus, Play } from 'lucide-react';

export default function VideosEmpty({ onCreate }: { onCreate?: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="relative rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] overflow-hidden">
      <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 0.3, scale: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="absolute inset-0">
        <img src="/images/empty-projects.jpg" alt="" className="h-full w-full object-cover" loading="lazy" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_85%)]" />
      <motion.div animate={{ x: [0,40,0], y: [0,-20,0], opacity: [0.3,0.5,0.3] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col items-center justify-center text-center py-20 px-6">
        <motion.div animate={{ y: [0,-10,0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-purple-400/20 blur-2xl" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="absolute -inset-3 rounded-full border border-dashed border-white/15">
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </motion.div>
          <div className="relative h-20 w-20 rounded-2xl glass-strong flex items-center justify-center">
            <Film className="h-9 w-9 text-purple-400" />
          </div>
        </motion.div>
        <h3 className="text-[24px] font-bold tracking-tight text-white">No videos yet</h3>
        <p className="mt-2 text-[14px] text-[#a8aeb8] max-w-md leading-[1.4]">Your generated, scheduled, and published videos will appear here. Create your first one below — it takes less than a minute.</p>
        <div className="mt-4 flex items-center gap-2 glass rounded-full px-3 py-1.5 text-[11px] text-white/60">
          <Play className="h-3 w-3 fill-white/60" /> Pick a template to get started
        </div>
        <button onClick={onCreate} className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black hover:scale-[1.03] transition-transform duration-300">
          <Plus className="h-4 w-4" /> Create your first video
        </button>
      </div>
    </motion.div>
  );
}
