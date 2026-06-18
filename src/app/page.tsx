import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { STATS_BAR, HOW_IT_WORKS, FEATURES, PLANS } from "@/lib/constants";
import Link from "next/link";

const BEFORE = [
  "Hunt for B-roll & stock footage",
  "Write & re-record the voiceover",
  "Cut clips on a fiddly timeline",
  "Hand-sync captions word by word",
  "Find royalty-free music",
  "Export, re-export, repeat",
];

const AFTER = [
  "Type one topic or paste a script",
  "AI writes a scroll-stopping script",
  "Visuals, voice & music generated",
  "Captions auto-timed to the audio",
  "Render in 9:16 or 16:9",
  "Download a publish-ready MP4",
];

const PIPELINE = [
  { tool: "Claude AI", label: "Script" },
  { tool: "Flux AI", label: "Images" },
  { tool: "Kling AI", label: "Clips" },
  { tool: "ElevenLabs", label: "Voice" },
  { tool: "Whisper", label: "Captions" },
  { tool: "Creatomate", label: "Render" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      <main className="flex-1">

        {/* HERO */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] opacity-40"
              style={{ background: "radial-gradient(ellipse at center, rgba(127,119,221,0.18) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 right-0 h-[400px] w-[600px] opacity-20"
              style={{ background: "radial-gradient(ellipse at center, rgba(212,83,126,0.15) 0%, transparent 70%)" }} />
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "linear-gradient(rgba(127,119,221,1) 1px, transparent 1px), linear-gradient(90deg, rgba(127,119,221,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel px-3.5 py-1.5 text-xs font-medium text-muted mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                AI video studio for YouTube creators
              </span>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-7xl">
                Stop editing.
                <br />
                <span className="gradient-text">Start publishing.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                VersaVid turns a single idea into a fully narrated, captioned, ready-to-publish video — script, visuals, voice, music and render, all automated in minutes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/auth/signup" size="lg">
                  Start creating free
                  <Icon name="arrow-right" size={18} />
                </ButtonLink>
                <ButtonLink href="#how" variant="outline" size="lg">
                  See how it works
                </ButtonLink>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted">
                <span className="flex items-center gap-1.5"><Icon name="check" size={14} className="text-success" /> 5 free credits</span>
                <span className="flex items-center gap-1.5"><Icon name="check" size={14} className="text-success" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Icon name="check" size={14} className="text-success" /> Cancel anytime</span>
              </div>
            </div>
            <div className="animate-fade-up [animation-delay:150ms]">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* POWERED BY */}
        <section className="border-y border-edge/50 bg-panel/30">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs text-muted mr-2">Powered by</span>
              {PIPELINE.map((p) => (
                <span key={p.tool} className="inline-flex items-center gap-1.5 rounded-lg border border-edge bg-panel/60 px-3 py-1.5 text-xs font-medium text-muted">
                  {p.tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="border-b border-edge/50 bg-panel/20">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
            {STATS_BAR.map((s) => (
              <div key={s.label} className="px-4 py-10 text-center sm:px-8">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{s.value}</div>
                <div className="mt-1.5 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BEFORE / AFTER */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">Why creators switch</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              The old way is <span className="text-pink">exhausting</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              A single short can eat an entire afternoon. VersaVid collapses the whole pipeline into a few clicks.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Card className="p-8 border-pink/10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink/10">
                  <Icon name="x" size={18} className="text-pink" />
                </div>
                <h3 className="text-lg font-semibold text-pink">Without VersaVid</h3>
              </div>
              <ul className="space-y-4">
                {BEFORE.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pink/50" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl bg-pink/5 border border-pink/10 px-4 py-3">
                <span className="text-sm font-medium text-pink">Hours per video</span>
              </div>
            </Card>
            <Card className="relative overflow-hidden p-8 glow">
              <div className="absolute inset-0 -z-10 gradient-bg-soft" />
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <Icon name="check" size={18} className="text-success" />
                </div>
                <h3 className="text-lg font-semibold text-ink">With VersaVid</h3>
              </div>
              <ul className="space-y-4">
                {AFTER.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-ink">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl bg-success/5 border border-success/10 px-4 py-3">
                <span className="text-sm font-medium text-success">About 5 minutes per video</span>
              </div>
            </Card>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="border-y border-edge/50 bg-panel/30">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">How it works</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">8 steps, fully automated</h2>
              <p className="mt-4 text-lg text-muted">Every stage of production runs for you — you just approve the idea.</p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((s, i) => (
                <Card key={s.step} hover className="group relative overflow-hidden p-6">
                  <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-6xl font-bold text-accent">{s.step}</span>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-bg text-sm font-bold text-white">
                    {s.step}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">Features</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Everything you need to ship faster</h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} hover className="group p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg-soft text-accent-soft group-hover:shadow-glow-sm transition-shadow">
                  <Icon name={f.icon} size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink group-hover:text-accent-soft transition-colors">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-y border-edge/50 bg-panel/30">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">Pricing</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Plans that scale with your channel</h2>
              <p className="mt-4 text-lg text-muted">Start free. Upgrade when you are ready to post daily.</p>
            </div>
            <div className="mt-14 grid gap-6 lg:grid-cols-4">
              {PLANS.map((plan) => (
                <Card key={plan.id} className={`relative flex flex-col p-7 ${plan.highlighted ? "border-accent/60 glow" : ""}`}>
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-bg px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted">{plan.blurb}</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-4xl font-bold text-ink">${plan.price}</span>
                    <span className="mb-1 text-sm text-muted">{plan.period}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-accent-soft">{plan.credits}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-muted">
                        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="/auth/signup" variant={plan.highlighted ? "primary" : "secondary"} fullWidth className="mt-7">
                    {plan.cta}
                  </ButtonLink>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="waitlist" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Card className="relative overflow-hidden p-10 text-center sm:p-16">
            <div className="absolute inset-0 -z-10 gradient-bg-soft" />
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-70"
              style={{ background: "radial-gradient(50% 80% at 50% 0%, rgba(212,83,126,0.18) 0%, rgba(13,17,23,0) 70%)" }} />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to publish your first <span className="gradient-text">AI video?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
              Join creators who stopped editing and started growing — no skills required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <ButtonLink href="/auth/signup" size="lg">
                Start creating free
                <Icon name="arrow-right" size={18} />
              </ButtonLink>
              <ButtonLink href="#how" variant="outline" size="lg">
                See how it works
              </ButtonLink>
            </div>
            <div className="mt-6">
              <WaitlistForm />
            </div>
            <p className="mt-4 text-xs text-muted">No spam. No credit card required.</p>
          </Card>
        </section>

      </main>
      <Footer />
    </div>
  );
}
