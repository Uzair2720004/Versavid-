'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Mail, Lock, User, Globe2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import AmbientField from '@/components/dashboard/AmbientField';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin + '/dashboard' },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } });
  };

  return (
    <div className="relative min-h-screen bg-black flex overflow-hidden">
      {/* Left: video panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-60">
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <AmbientField variant="mixed" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
            <div className="glass rounded-full px-4 py-1.5 mb-5 inline-flex items-center gap-2 text-[12px] text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Start free — no credit card required
            </div>
            <h2 className="text-[40px] font-bold leading-[1.05] tracking-tightest text-white max-w-sm">
              Your AI video studio awaits.
            </h2>
            <p className="mt-4 text-[14px] text-[#a8aeb8] max-w-xs leading-[1.5]">
              Join creators using Versavid to automate their entire YouTube pipeline with AI.
            </p>
            <div className="mt-8 space-y-3">
              {['5 free credits on signup', 'AI script, visuals, voiceover & captions', 'YouTube Shorts & long-form support', 'No credit card required'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[13px] text-[#a8aeb8]">
                  <span className="h-5 w-5 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0">
                    <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-[480px] shrink-0 flex flex-col items-center justify-center px-8 py-12 relative">
        <div className="absolute inset-0 bg-black lg:bg-[#030303]" />
        <div className="absolute inset-0 lg:hidden">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-15">
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-2.5 mb-10">
            <Link href="/">
              <svg viewBox="0 0 32 32" className="h-7 w-7"><rect width="32" height="32" rx="7" fill="#000" stroke="rgba(255,255,255,0.2)" /><path d="M12 9 L22 16 L12 23 Z" fill="#fff" /></svg>
            </Link>
            <Link href="/" className="text-[17px] font-semibold tracking-tight text-white">Versavid</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
            {done ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center mx-auto mb-5">
                  <Sparkles className="h-7 w-7 text-black" />
                </div>
                <h2 className="text-[22px] font-bold text-white">Check your email</h2>
                <p className="mt-2 text-[13px] text-[#767D88] leading-[1.5]">
                  We sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account and get your 5 free credits.
                </p>
                <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-[12px] text-cyan-400 hover:text-cyan-300 transition-colors">
                  Back to sign in <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ) : (
              <>
                <h1 className="text-[28px] font-bold tracking-tight text-white mb-1">Create your account</h1>
                <p className="text-[13px] text-[#767D88] mb-8">Start automating your YouTube videos</p>

                <button onClick={handleGoogle} className="w-full h-11 rounded-xl glass border border-white/10 flex items-center justify-center gap-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white transition-all mb-6">
                  <Globe2 className="h-4 w-4" /> Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[11px] text-[#767D88]">or continue with email</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[12px] text-red-400">{error}</motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#767D88]" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white placeholder:text-[#767D88] focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-colors" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#767D88]" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white placeholder:text-[#767D88] focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-colors" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#767D88]" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" minLength={6} required
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white placeholder:text-[#767D88] focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-colors" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-11 rounded-xl bg-white text-black text-[14px] font-semibold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-70">
                    {loading ? 'Creating account...' : <><span>Create account</span><ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] text-[#767D88] flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3 text-cyan-400" /> Get 5 free credits — no credit card required
                </p>
                <p className="mt-5 text-center text-[12px] text-[#767D88]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Sign in</Link>
                </p>
              </>
            )}
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 text-center text-[11px] text-[#767D88]">
            <Link href="/" className="hover:text-white transition-colors">← Back to home</Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}



