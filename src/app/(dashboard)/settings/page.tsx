'use client';
import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, Bell, Sparkles, ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/dashboard/Topbar';
import AmbientField from '@/components/dashboard/AmbientField';
import ToggleSwitch from '@/components/settings/ToggleSwitch';
import { useApp } from '@/lib/store';
import Link from 'next/link';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const notificationSettings = [
  { id: 'video_ready', label: 'Video generation complete', email: true, push: true },
  { id: 'credit_low', label: 'Credits running low', email: true, push: false },
  { id: 'publish_success', label: 'Video published successfully', email: false, push: true },
  { id: 'weekly_report', label: 'Weekly performance report', email: true, push: false },
  { id: 'new_features', label: 'New features & updates', email: true, push: false },
];

function Card({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }} className="rounded-2xl bg-[#0a0a0a] border border-white/5 p-6">
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: typeof User; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-xl glass flex items-center justify-center"><Icon className="h-5 w-5 text-cyan-400" /></div>
      <div><h2 className="text-[18px] font-semibold text-white">{title}</h2><p className="text-[12px] text-[#767D88]">{subtitle}</p></div>
    </div>
  );
}

function ProfileSection() {
  const { profile } = useApp();
  const name = profile?.full_name || 'User';
  const email = profile?.email || '';
  const initial = name.charAt(0).toUpperCase();
  return (
    <Card>
      <SectionHeader icon={User} title="Profile" subtitle="Manage your account information" />
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-[20px] font-bold text-black">{initial}</div>
        <div><p className="text-[15px] font-semibold text-white">{name}</p><p className="text-[12px] text-[#767D88]">{email}</p></div>
        <button className="ml-auto h-9 px-3 rounded-lg glass text-[12px] text-white/70 hover:text-white hover:bg-white/10 transition-colors">Change avatar</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-[11px] text-[#767D88] mb-1.5 block">Full name</label><input defaultValue={name} className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white focus:outline-none focus:border-white/25 transition-colors" /></div>
        <div><label className="text-[11px] text-[#767D88] mb-1.5 block">Email</label><input defaultValue={email} className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white focus:outline-none focus:border-white/25 transition-colors" /></div>
        <div><label className="text-[11px] text-[#767D88] mb-1.5 block">Timezone</label>
          <select className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white focus:outline-none focus:border-white/25 transition-colors">
            <option>Pacific Time (PT)</option><option>Eastern Time (ET)</option><option>Central European (CET)</option>
          </select>
        </div>
        <div><label className="text-[11px] text-[#767D88] mb-1.5 block">Default video format</label>
          <select className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white focus:outline-none focus:border-white/25 transition-colors">
            <option>YouTube Shorts (9:16)</option><option>Long-form (16:9)</option>
          </select>
        </div>
      </div>
      <button className="mt-5 h-9 px-5 rounded-lg bg-white text-black text-[13px] font-medium hover:scale-[1.03] transition-transform">Save changes</button>
    </Card>
  );
}

function BillingSection() {
  const { credits } = useApp();
  const balance = (credits as any)?.balance ?? credits ?? 0;
  const total = 15;
  const pct = Math.min((balance / total) * 100, 100);
  return (
    <Card delay={0.05}>
      <SectionHeader icon={CreditCard} title="Billing & Plan" subtitle="Manage your subscription" />
      <div className="flex items-center justify-between p-4 rounded-xl glass mb-4">
        <div><p className="text-[15px] font-semibold text-white">Free Plan</p><p className="text-[12px] text-[#767D88] mt-0.5">Free forever</p></div>
        <Link href="/credits" className="h-9 px-4 rounded-lg bg-white text-black text-[12px] font-medium hover:scale-[1.03] transition-transform flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> Upgrade
        </Link>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between text-[12px] mb-2"><span className="text-[#767D88]">Credits remaining</span><span className="text-white font-mono">{balance} / {total}</span></div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
        </div>
      </div>
      <Link href="/credits" className="inline-flex items-center gap-1 text-[12px] text-[#767D88] hover:text-white transition-colors">
        View plans & credits <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </Card>
  );
}

function NotificationsSection() {
  const [settings, setSettings] = useState(notificationSettings);
  return (
    <Card delay={0.1}>
      <SectionHeader icon={Bell} title="Notifications" subtitle="Choose what you want to hear about" />
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1 items-center">
        <span className="text-[11px] text-[#767D88] uppercase tracking-wider pb-2">Event</span>
        <span className="text-[11px] text-[#767D88] uppercase tracking-wider pb-2 text-center w-12">Email</span>
        <span className="text-[11px] text-[#767D88] uppercase tracking-wider pb-2 text-center w-12">Push</span>
        {settings.map((s) => (
          <Fragment key={s.id}>
            <span className="text-[13px] text-white py-2.5 border-t border-white/5">{s.label}</span>
            <div className="flex justify-center py-2.5 border-t border-white/5"><ToggleSwitch enabled={s.email} onChange={() => setSettings((prev) => prev.map((x) => x.id === s.id ? { ...x, email: !x.email } : x))} /></div>
            <div className="flex justify-center py-2.5 border-t border-white/5"><ToggleSwitch enabled={s.push} onChange={() => setSettings((prev) => prev.map((x) => x.id === s.id ? { ...x, push: !x.push } : x))} /></div>
          </Fragment>
        ))}
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState('profile');
  return (
    <div className="relative min-h-screen bg-black flex">
      <div className="fixed inset-0 z-0 pointer-events-none"><AmbientField variant="mixed" /></div>
      <div className="relative z-10 flex w-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1">
            <div className="relative pt-28 pb-8 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src="/images/analytics-bg.jpg" alt="" className="h-full w-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
              </div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
                <h1 className="text-[40px] sm:text-[56px] font-bold leading-[1.0] tracking-tightest text-gradient text-glow">Settings</h1>
                <p className="mt-3 text-[15px] text-[#a8aeb8] max-w-lg">Manage your profile, billing, and notification preferences.</p>
              </motion.div>
            </div>
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
                <motion.nav initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="hidden lg:flex flex-col gap-1 sticky top-20 self-start">
                  {sections.map((s) => {
                    const isActive = active === s.id;
                    return (
                      <button key={s.id} onClick={() => setActive(s.id)} className={'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-300 text-left ' + (isActive ? 'bg-white/10 text-white' : 'text-[#767D88] hover:text-white hover:bg-white/5')}>
                        <s.icon className="h-[18px] w-[18px]" />
                        {s.label}
                        {isActive && <motion.span layoutId="settings-active" className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    );
                  })}
                </motion.nav>
                <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4">
                  {sections.map((s) => {
                    const isActive = active === s.id;
                    return (
                      <button key={s.id} onClick={() => setActive(s.id)} className={'flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ' + (isActive ? 'bg-white/10 text-white' : 'text-[#767D88]')}>
                        <s.icon className="h-4 w-4" />{s.label}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                      {active === 'profile' && <ProfileSection />}
                      {active === 'billing' && <BillingSection />}
                      {active === 'notifications' && <NotificationsSection />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
