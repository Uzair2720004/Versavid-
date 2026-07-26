'use client';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, Folder, BarChart3, Settings, ArrowLeft, CreditCard, Wand2 } from 'lucide-react';
import { useApp } from '@/lib/store';

const sidebarLinks = [
  { label: 'Dashboard', icon: 'LayoutGrid', href: '/dashboard' },
  { label: 'Create Video', icon: 'Wand2', href: '/create' },
  { label: 'My Videos', icon: 'Folder', href: '/videos' },
  { label: 'Credits', icon: 'CreditCard', href: '/credits' },
  { label: 'Analytics', icon: 'BarChart3', href: '/analytics' },
  { label: 'Settings', icon: 'Settings', href: '/settings' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid, Folder, BarChart3, Settings, CreditCard, Wand2,
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useApp();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-[#030303] z-30"
    >
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo-dark.jpeg" alt="VersaVid" width={140} height={36} className="object-contain" />
        </Link>
      </div>
      <nav className="flex-1 px-3 py-6">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-white/30">Workspace</p>
        <ul className="space-y-1">
          {sidebarLinks.map((l) => {
            const Icon = iconMap[l.icon];
            const isActive = pathname === l.href;
            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-300 ${
                    isActive ? 'bg-white/10 text-white' : 'text-[#767D88] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {l.label}
                  {isActive && (
                    <motion.span layoutId="sidebar-active" className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="m-3 space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl glass">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-[12px] font-bold text-black shrink-0">
            {(profile?.full_name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white truncate">{profile?.full_name || 'User'}</p>
            <p className="text-[10px] text-[#767D88] truncate">{profile?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-[10px] text-[#767D88] hover:text-white transition-colors shrink-0">
            Sign out
          </button>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-[11px] text-[#767D88] hover:text-white transition-colors px-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to site
        </Link>
      </div>
    </motion.aside>
  );
}
