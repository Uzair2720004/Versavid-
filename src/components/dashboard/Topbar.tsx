'use client';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';

const pageNames: Record<string, string> = {
  '/dashboard': 'Overview',
  '/videos': 'My Videos',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/credits': 'Credits',
  '/create': 'Create Video',
};

export function Topbar() {
  const { profile } = useApp();
  const pathname = usePathname();
  const initial = (profile?.full_name || 'U').charAt(0).toUpperCase();
  const pageName = pageNames[pathname] || 'Studio';

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="sticky top-0 z-20 h-16 flex items-center gap-4 px-6 lg:px-8 border-b border-white/5 bg-black/60 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-[#767D88]">Studio</span>
        <span className="text-white/20">/</span>
        <span className="text-white font-medium">{pageName}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="relative h-9 w-9 rounded-lg glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-[12px] font-bold text-black ml-1">
          {initial}
        </div>
      </div>
    </motion.header>
  );
}

