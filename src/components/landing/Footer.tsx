'use client';
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-16">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <svg viewBox="0 0 32 32" className="h-6 w-6"><rect width="32" height="32" rx="7" fill="#000" stroke="rgba(255,255,255,0.2)" /><path d="M12 9 L22 16 L12 23 Z" fill="#fff" /></svg>
              <span className="text-[16px] font-semibold tracking-tight">Versavid</span>
            </Link>
            <p className="mt-5 text-[14px] leading-[1.5] text-[#767D88] max-w-xs">Turn any topic into a YouTube video. AI scripts, visuals, voiceover, captions — all automated.</p>
            <div className="mt-6 flex items-center gap-3">
              {[{ label: 'X', href: 'https://x.com/VersavidAi' },{ label: 'TikTok', href: 'https://tiktok.com' },{ label: 'IG', href: 'https://instagram.com' }].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="h-9 px-3 rounded-full flex items-center justify-center text-[11px] text-white/60 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>{s.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em] text-white/40 mb-5">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-[14px] text-[#a8aeb8] hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-[14px] text-[#a8aeb8] hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em] text-white/40 mb-5">Account</h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-[14px] text-[#a8aeb8] hover:text-white transition-colors">Sign in</Link></li>
              <li><Link href="/signup" className="text-[14px] text-[#a8aeb8] hover:text-white transition-colors">Start free</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em] text-white/40 mb-5">Dashboard</h4>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-[14px] text-[#a8aeb8] hover:text-white transition-colors">Overview</Link></li>
              <li><Link href="/videos" className="text-[14px] text-[#a8aeb8] hover:text-white transition-colors">My Videos</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5">
          <p className="text-[12px] text-[#767D88]">&copy; {new Date().getFullYear()} Versavid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
