'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Play } from 'lucide-react';

const demoTopVideos = [
  { id: 'tv1', title: 'Epic Mountain Drone Shots That Will Inspire You', thumbnail: '/images/vid-6.jpg', channel: 'TechFlow', channelColor: 'from-cyan-400 to-blue-500', views: 256000, revenue: '$1,240' },
  { id: 'tv2', title: '5 Mind-Blowing Space Facts You Didn\'t Know', thumbnail: '/images/vid-1.jpg', channel: 'Cosmos Daily', channelColor: 'from-purple-400 to-indigo-500', views: 142000, revenue: '$820' },
  { id: 'tv3', title: 'The Perfect Pasta — Restaurant Secret', thumbnail: '/images/vid-5.jpg', channel: 'FoodLab', channelColor: 'from-amber-400 to-orange-500', views: 89200, revenue: '$510' },
  { id: 'tv4', title: 'This Gadget Will Change Everything in 2025', thumbnail: '/images/vid-2.jpg', channel: 'TechFlow', channelColor: 'from-cyan-400 to-blue-500', views: 38400, revenue: '$280' },
];

function fmt(n: number) { return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString(); }

export default function TopVideos({ hasData }: { hasData: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }} className="rounded-2xl bg-[#0a0a0a] border border-white/5 p-6">
      <div className="flex items-center gap-2 mb-5"><TrendingUp className="h-4 w-4 text-emerald-400" /><h3 className="text-[15px] font-semibold text-white">Top performing videos</h3></div>
      {hasData ? (
        <div className="space-y-3">
          {demoTopVideos.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.08 }}
              className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
              <span className="text-[16px] font-bold text-white/20 w-5 text-center shrink-0">{i + 1}</span>
              <div className="relative h-12 w-20 rounded-lg overflow-hidden shrink-0">
                <img src={v.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <Play className="absolute inset-0 m-auto h-3.5 w-3.5 text-white/80 fill-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-white truncate group-hover:text-cyan-300 transition-colors">{v.title}</p>
                <div className="flex items-center gap-2 mt-1"><span className={'h-3 w-3 rounded-full bg-gradient-to-br ' + v.channelColor} /><span className="text-[10px] text-[#767D88]">{v.channel}</span></div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-[13px] font-semibold text-white flex items-center gap-1 justify-end"><Eye className="h-3 w-3 text-[#767D88]" />{fmt(v.views)}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">{v.revenue}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-4">
            <div className="absolute inset-0 rounded-xl bg-emerald-400/10 blur-xl" />
            <div className="relative h-12 w-12 rounded-xl glass flex items-center justify-center"><TrendingUp className="h-5 w-5 text-[#767D88]" /></div>
          </motion.div>
          <p className="text-[13px] text-white font-medium">No top videos yet</p>
          <p className="text-[12px] text-[#767D88] mt-1 max-w-[200px] leading-[1.4]">Your best-performing videos will be ranked here.</p>
        </div>
      )}
    </motion.div>
  );
}
