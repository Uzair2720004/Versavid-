'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Check, AlertCircle } from 'lucide-react';
import { Topbar } from '@/components/dashboard/Topbar';
import AmbientField from '@/components/dashboard/AmbientField';
import StepIndicator from '@/components/create/StepIndicator';
import Step1Script from '@/components/create/Step1Script';
import Step2Media from '@/components/create/Step2Media';
import Step3Voice from '@/components/create/Step3Voice';
import Step4Review from '@/components/create/Step4Review';
import SummaryPanel from '@/components/create/SummaryPanel';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { uid, creditsForSettings } from '@/lib/utils';

const FREE_TIER_MONTHLY_LIMIT = 3;

export default function CreateVideoPage() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, any>>({ scriptMode: 'ai', lengthCredits: 0, language: 'English' });
  const router = useRouter();
  const { addVideo, profile, updateProfile } = useApp();

  const update = (key: string, value: any) => setSelections((prev) => ({ ...prev, [key]: value }));

  const credits = useMemo(() => creditsForSettings(selections as any), [selections]);

const stepValid = useMemo(() => {
    if (step === 1) return selections.topic && selections.format && selections.length && selections.tone;
    if (step === 2) {
      if (!selections.generationMode) return false;
      if ((selections.generationMode === 'ai_images_only' || selections.generationMode === 'ai_images_plus_ai_video' || selections.generationMode === 'stock_plus_ai_images') && !selections.photoStyle) return false;
      if ((selections.generationMode === 'ai_images_plus_ai_video' || selections.generationMode === 'stock_only') && !selections.videoStyle) return false;
      return true;
    }
    if (step === 3) return selections.voice && selections.language && selections.speed && selections.captionStyle;
    return true;
  }, [step, selections]);

  const canGenerate = useMemo(() => {
    return selections.topic && selections.format && selections.length && selections.tone &&
      selections.generationMode && selections.voice && selections.language && selections.speed && selections.captionStyle;
  }, [selections]);

  const handleGenerate = () => {
    if (!canGenerate) return;

    const plan = profile?.plan ?? 'free';
    const monthlyCount = profile?.monthly_video_count ?? 0;
    const periodStart = profile?.period_start ? new Date(profile.period_start) : null;
    const now = new Date();

    // Reset monthly counter if period_start is more than 30 days ago
    if (plan === 'free' && periodStart) {
      const daysSincePeriodStart = (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePeriodStart >= 30) {
        updateProfile({ monthly_video_count: 0, period_start: now.toISOString() });
        // After reset, monthlyCount will be 0 in the next check
        if (0 >= FREE_TIER_MONTHLY_LIMIT) return; // This won't happen since limit is 3
      }
    }

    // Use updated monthly count after potential reset
    const effectiveMonthlyCount = (plan === 'free' && periodStart && (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24) >= 30) ? 0 : monthlyCount;

    if (plan === 'free' && effectiveMonthlyCount >= FREE_TIER_MONTHLY_LIMIT) {
      setLimitError(`Free plan limit reached: ${FREE_TIER_MONTHLY_LIMIT} videos per month. Upgrade to continue.`);
      return;
    }

    setLimitError(null);
    setGenerating(true);

    const id = crypto.randomUUID();
    addVideo({
      id,
      user_id: '',
      title: selections.topic || 'Untitled video',
      topic: selections.topic,
      format: selections.format,
      status: 'queued',
      script: null,
      video_url: null,
      thumbnail_url: null,
      credits_used: credits,
      duration: 0,
      settings: selections as any,
      created_at: new Date().toISOString(),
    });

    router.push(`/generate/${id}`);
  };

  const handleReset = () => { setDone(false); setStep(1); setSelections({ scriptMode: 'ai', lengthCredits: 0 }); };

  return (
    <div className="relative min-h-screen bg-black flex">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AmbientField variant="mixed" />
      </div>
      <div className="relative z-10 flex w-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1 px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-fuchsia-400" />
                <span className="text-[12px] text-fuchsia-400 font-medium">Create Video</span>
              </div>
              <h1 className="text-[32px] sm:text-[40px] font-bold leading-[1.0] tracking-tightest text-gradient">
                {done ? 'Video generated' : 'Create a new video'}
              </h1>
              <p className="mt-2 text-[14px] text-[#a8aeb8]">
                {done ? 'Your video is ready to review and publish.' : 'Follow the steps to configure your AI-generated video.'}
              </p>
            </motion.div>

            {done ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="max-w-2xl mx-auto text-center py-16">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="relative inline-block mb-8">
                  <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-2xl" />
                  <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <Check className="h-12 w-12 text-white" strokeWidth={3} />
                  </div>
                </motion.div>
                <h2 className="text-[28px] font-bold tracking-tight text-white mb-3">Your video is ready!</h2>
                <p className="text-[14px] text-[#a8aeb8] max-w-md mx-auto mb-8">
                  Versavid has generated your video using {credits} credits. You can review it in your videos, schedule it for publishing, or create another one.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={() => router.push('/videos')} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black hover:scale-[1.03] transition-transform duration-300">
                    <Sparkles className="h-4 w-4" /> View my videos
                  </button>
                  <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-[14px] font-medium text-white hover:bg-white/10 transition-colors duration-300">
                    Create another
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex gap-8">
                <div className="flex-1 min-w-0">
                  {limitError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p className="text-[13px]">{limitError}</p>
                    </motion.div>
                  )}
                  <div className="mb-8"><StepIndicator current={step} onStepClick={setStep} /></div>
                  <div className="max-w-2xl">
                    <AnimatePresence mode="wait">
                      {step === 1 && <Step1Script key="s1" selections={selections} update={update} isFreeTier={profile?.plan === 'free'} />}
                      {step === 2 && <Step2Media key="s2" selections={selections} update={update} isFreeTier={profile?.plan === 'free'} userPlan={profile?.plan ?? 'free'} />}
                      {step === 3 && <Step3Voice key="s3" selections={selections} update={update} />}
                      {step === 4 && <Step4Review key="s4" selections={selections} credits={credits} />}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center justify-between mt-10 max-w-2xl">
                    <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}
                      className={'flex items-center gap-2 h-11 px-5 rounded-xl text-[13px] font-medium transition-all duration-300 ' + (step === 1 ? 'opacity-30 cursor-not-allowed text-[#767D88]' : 'glass text-white hover:bg-white/10')}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    {step < 4 ? (
                      <button onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={!stepValid}
                        className={'flex items-center gap-2 h-11 px-6 rounded-xl text-[13px] font-medium transition-all duration-300 ' + (stepValid ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:scale-[1.03]' : 'bg-white/5 text-[#767D88] cursor-not-allowed')}>
                        Continue <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button onClick={handleGenerate} disabled={generating}
                        className="flex items-center gap-2 h-11 px-6 rounded-xl text-[13px] font-medium bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:scale-[1.03] transition-all duration-300 disabled:opacity-70">
                        {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate Video</>}
                      </button>
                    )}
                  </div>
                </div>
                <SummaryPanel selections={selections} credits={credits} onGenerate={() => { setStep(4); if (canGenerate) handleGenerate(); }} canGenerate={!!canGenerate} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}




