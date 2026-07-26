'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Search } from 'lucide-react';
import { Topbar } from '@/components/dashboard/Topbar';
import AmbientField from '@/components/dashboard/AmbientField';
import ProjectsHeader from '@/components/videos/ProjectsHeader';
import VideoCard from '@/components/videos/VideoCard';
import VideosEmpty from '@/components/videos/VideosEmpty';
import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';

const filterTabs = [
  { label: 'All', status: 'All' },
  { label: 'Published', status: 'published' },
  { label: 'Scheduled', status: 'scheduled' },
  { label: 'Processing', status: 'generating' },
  { label: 'Drafts', status: 'draft' },
  { label: 'Failed', status: 'failed' },
];

export default function VideosPage() {
  const { videos } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const hasData = videos.length > 0;

  const filtered = useMemo(() => {
    return videos.filter((v: any) => {
      const matchesFilter = filter === 'All' || v.status === filter;
      const matchesSearch = (v.topic || '').toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, videos]);

  return (
    <div className="relative min-h-screen bg-black flex">
      <div className="fixed inset-0 z-0 pointer-events-none"><AmbientField variant="mixed" /></div>
      <div className="relative z-10 flex w-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1">
            <ProjectsHeader hasData={hasData} videoCount={videos.length} />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-12">
              <AnimatePresence mode="wait">
                {!hasData ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <VideosEmpty onCreate={() => router.push('/create')} />
                  </motion.div>
                ) : (
                  <motion.div key="populated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {filterTabs.map((tab) => {
                          const isActive = filter === tab.status;
                          return (
                            <button key={tab.label} onClick={() => setFilter(tab.status)}
                              className={'relative px-4 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ' + (isActive ? 'text-white' : 'text-[#767D88] hover:text-white')}>
                              {tab.label}
                              {isActive && <motion.span layoutId="filter-active" className="absolute inset-0 rounded-lg bg-white/10 -z-10" />}
                            </button>
                          );
                        })}
                      </div>
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#767D88]" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search videos..."
                          className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white placeholder:text-[#767D88] focus:outline-none focus:border-white/25 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[13px] text-[#767D88]">{filtered.length} {filtered.length === 1 ? 'video' : 'videos'}</p>
                        <div className="flex items-center gap-1.5 text-[12px] text-[#767D88]"><LayoutGrid className="h-3.5 w-3.5" /> Grid view</div>
                      </div>
                      <AnimatePresence mode="popLayout">
                        {filtered.length > 0 ? (
                          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filtered.map((video: any, i: number) => <VideoCard key={video.id} video={video} index={i} />)}
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="relative mb-5">
                              <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl" />
                              <div className="relative h-14 w-14 rounded-xl glass flex items-center justify-center"><Search className="h-6 w-6 text-[#767D88]" /></div>
                            </div>
                            <p className="text-[14px] text-white font-medium">No videos found</p>
                            <p className="text-[12px] text-[#767D88] mt-1">Try a different filter or search term.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
