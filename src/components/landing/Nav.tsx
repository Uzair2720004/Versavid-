'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useApp } from '@/lib/store';

const navLinks = [
  { label: 'Product', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '/pricing' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { profile } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-md bg-white/10 blur-md group-hover:bg-white/20 transition-colors" />
            <svg viewBox="0 0 32 32" className="relative h-6 w-6"><rect width="32" height="32" rx="7" fill="#000" stroke="rgba(255,255,255,0.2)" /><path d="M12 9 L22 16 L12 23 Z" fill="#fff" /></svg>
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Versavid</span>
        </Link>
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className="text-[13px] text-[#767D88] hover:text-white transition-colors duration-300">{l.label}</Link>
          ))}
          <Link href={profile ? '/dashboard' : '/login'} className="text-[13px] text-[#767D88] hover:text-white transition-colors duration-300">Dashboard</Link>
        </div>
        <div className="flex items-center gap-3">
          {profile ? (
            <Link href="/dashboard" className="text-[13px] font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-[1.03]">Go to studio</Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block text-[13px] text-[#767D88] hover:text-white transition-colors">Sign in</Link>
              <Link href="/signup" className="text-[13px] font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-[1.03]">Start free</Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
