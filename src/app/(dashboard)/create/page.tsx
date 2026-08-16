'use client';
import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Check, AlertCircle } from 'lucide-react';
import { Topbar } from '@/components/dashboard/Topbar';
import AmbientBackground from '@/components/AmbientBackground';
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
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [scriptBusy, setScriptBusy] = useState(false);
  const [selections, setSelections] = useState<Record<string, any>>({ scriptMode: 'ai', lengthCredits: 0, language: 'English', tone: 'Energetic' });
  const draftIdRef = useRef<string | null>(null);
  const router = useRouter();
  const { addVideo, updateVideo, videos, profile, updateProfile, ready } = useApp();

  const update = (key: string, value: any) => setSelections((prev) => ({ ...prev, [key]: value }));

  const credits = useMemo(() => creditsForSettings(selections as any), [selections]);

  const isFreeTier = profile?.plan === 'free';

  // The early-created draft (if any) — lets Step 1 render/edit its generated script.
  const draftVideo = draftIdRef.current ? videos.find((v) => v.id === draftIdRef.current) : undefined;

  // Wizard uses display labels for some settings; normalize to the code values
  // the script/generation routes expect.
  const LENGTH_CODE: Record<string, string> = { Short: 'short', Medium: 'medium', Long: 'long' };
  const FORMAT_CODE: Record<string, string> = { vertical: '9:16', horizontal: '16:9' };

  const normalizeSettings = (topic: string) => ({
    scriptMode: selections.scriptMode ?? 'ai',
    topic,
    format: FORMAT_CODE[selections.format] ?? '9:16',
    length: LENGTH_CODE[selections.length] ?? 'short',
    tone: selections.tone ?? 'Energetic',
    generationMode: selections.generationMode ?? 'stock_only',
    photoStyle: selections.photoStyle ?? 'photoreal',
    videoStyle: selections.videoStyle ?? 'realistic',
    voice: selections.voice ?? '',
    language: selections.language ?? 'English',
    speed: selections.speed ?? 'normal',
    captionStyle: selections.captionStyle ?? 'bold',
    captionPosition: selections.captionPosition ?? 'bottom',
    music: selections.music ?? 'none',
  });

  // Pressing Enter in Step 1 creates the video record immediately (draft) and
  // kicks off script generation in the background, before the wizard is complete.
  const handleTopicCommit = async (topicText: string) => {
    const topic = topicText.trim();
    if (!topic || draftIdRef.current) return;

    const id = crypto.randomUUID();
    draftIdRef.current = id;
    const settings = normalizeSettings(topic);

    addVideo({
      id,
      user_id: '',
      title: topic || 'Untitled video',
      topic,
      format: settings.format as "9:16" | "16:9",
      status: 'draft',
      script: null,
      video_url: null,
      thumbnail_url: null,
      credits_used: 0,
      duration: 0,
      settings: settings as any,
      edits: {},
      created_at: new Date().toISOString(),
    });

    setScriptError(null);
    setScriptBusy(true);
    try {
      const res = await fetch('/api/generate/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: id,
          topic,
          tone: settings.tone,
          length: settings.length,
          format: settings.format,
          photoStyle: settings.photoStyle,
          scriptMode: settings.scriptMode,
          customScript: settings.scriptMode === 'upload' ? topic : '',
          language: settings.language,
          generationMode: settings.generationMode,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setScriptError(err.error ?? `Script request failed (${res.status})`);
        return;
      }
      const data = await res.json();
      updateVideo(id, { script: data.script ?? null, status: 'awaiting_review' });
    } catch {
      setScriptError('Could not generate the script right now. It will be generated when you submit.');
    } finally {
      setScriptBusy(false);
    }
  };

  const stepValid = useMemo(() => {
    if (step === 1) {
      if (!selections.topic || !selections.format || !selections.length || !selections.voice || !selections.language) return false;
      if (scriptBusy) return false;
      return draftVideo?.script != null || scriptError != null;
    }
    if (step === 2) {
      if (!selections.generationMode) return false;
      const mode = selections.generationMode;
      if (mode !== 'stock_only' && !selections.photoStyle) return false;
      if (mode === 'ai_images_plus_ai_video' && !selections.videoStyle) return false;
      return true;
    }
    if (step === 3) return selections.speed && selections.captionStyle;
    return true;
  }, [step, selections, scriptBusy, draftVideo, scriptError]);

  // Step 1 base fields filled (topic/format/length/voice/language) — used to
  // show a targeted helper message when the only blocker left is the script.
  const step1Base = !!(selections.topic && selections.format && selections.length && selections.voice && selections.language);

  const canGenerate = useMemo(() => {
    return selections.topic && selections.format && selections.length &&
      selections.generationMode && selections.voice && selections.language && selections.speed && selections.captionStyle;
  }, [selections]);

  // Don't render steps until profile is loaded (prevents free-tier lock bypass during auth)
  if (!ready || !profile) {
    return (
      <div className="relative min-h-screen bg-black flex">
        <div className="relative z-10 flex w-full">
          <div className="flex-1 min-w-0 flex flex-col">
            <Topbar />
            <main className="flex-1 px-6 lg:px-8 py-8">
              <div className="flex items-center justify-center h-[60vh]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <div className="h-12 w-12 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mb-4 mx-auto" />
                  <p className="text-[14px] text-[#a8aeb8]">Loading your account&hellip;</p>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

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

    const id = draftIdRef.current ?? crypto.randomUUID();

    if (draftIdRef.current) {
      // Reuse the early-created draft: backfill the completed settings and either
      // resume to the review checkpoint (script ready) or regenerate the script.
      const draftRecord = videos.find((v) => v.id === id);
      updateVideo(id, {
        title: selections.topic || 'Untitled video',
        topic: selections.topic,
        format: (FORMAT_CODE[selections.format] ?? '9:16') as "9:16" | "16:9",
        credits_used: credits,
        settings: selections as any,
        status: draftRecord?.script ? 'generating' : 'draft',
      });
    } else {
      // Create video record in database FIRST (await it) before starting generation
      const videoRecord = {
        id,
        user_id: '',
        title: selections.topic || 'Untitled video',
        topic: selections.topic,
        format: (FORMAT_CODE[selections.format] ?? selections.format) as any,
        status: 'queued' as const,
        script: null,
        video_url: null,
        thumbnail_url: null,
        credits_used: credits,
        duration: 0,
        settings: selections as any,
        edits: {},
        created_at: new Date().toISOString(),
      };

      // Call addVideo and wait for DB insert to complete
      addVideo(videoRecord);
    }

    // Small delay to ensure DB write propagates (Supabase is fast but we need the row to exist)
    setTimeout(() => {
      router.push(`/generate/${id}`);
    }, 100);
  };

  const handleReset = () => { setDone(false); setStep(1); setSelections({ scriptMode: 'ai', lengthCredits: 0 }); };

  return (
    <div className="relative min-h-screen bg-black flex">
      <AmbientBackground />
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
                  {scriptError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p className="text-[13px]">{scriptError}</p>
                    </motion.div>
                  )}
                  <div className="mb-8"><StepIndicator current={step} onStepClick={setStep} /></div>
                  <div className="max-w-2xl">
                    <AnimatePresence mode="wait">
                      {step === 1 && <Step1Script key="s1" selections={selections} update={update} isFreeTier={isFreeTier} onTopicCommit={handleTopicCommit} scriptBusy={scriptBusy} draftScript={draftVideo?.script ?? null} onScriptEdit={(text) => { if (draftIdRef.current) updateVideo(draftIdRef.current, { script: text }); }} />}
                      {step === 2 && <Step2Media key="s2" selections={selections} update={update} isFreeTier={isFreeTier} userPlan={profile?.plan ?? 'free'} />}
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
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={!stepValid}
                          className={'flex items-center gap-2 h-11 px-6 rounded-xl text-[13px] font-medium transition-all duration-300 ' + (stepValid ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:scale-[1.03]' : 'bg-white/5 text-[#767D88] cursor-not-allowed')}>
                          Continue <ArrowRight className="h-4 w-4" />
                        </button>
                        {step === 1 && !stepValid && step1Base && (
                          <p className="text-[11px]" style={{ color: scriptBusy ? '#a8aeb8' : '#767D88' }}>
                            {scriptBusy ? 'Generating your script…' : 'Generate a script to continue'}
                          </p>
                        )}
                      </div>
                    ) : (
                      <button onClick={handleGenerate} disabled={generating}
                        className="flex items-center gap-2 h-11 px-6 rounded-xl text-[13px] font-medium bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:scale-[1.03] transition-all duration-300 disabled:opacity-70">
                        {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate Video</>}
                      </button>
                    )}
                  </div>
                </div>
                <SummaryPanel selections={selections} credits={credits} onGenerate={() => { setStep(4); if (canGenerate) handleGenerate(); }} canGenerate={!!canGenerate} isFreeTier={isFreeTier} monthlyVideoCount={profile?.monthly_video_count ?? 0} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}




