import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { STATS_BAR, HOW_IT_WORKS, FEATURES, PLANS } from "@/lib/constants";

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

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1">
        {/* Hero -------------------------------------------------------- */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(127,119,221,0.18) 0%, rgba(13,17,23,0) 70%)",
            }}
          />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel px-3.5 py-1.5 text-xs font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                AI video studio for YouTube creators
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
                Stop editing.
                <br />
                <span className="gradient-text">Start publishing.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                VersaVid turns a single idea into a fully narrated, captioned, ready-to-publish
                video — script, visuals, voice, music and render, all automated in minutes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/auth/signup" size="lg">
                  Start free
                  <Icon name="arrow-right" size={18} />
                </ButtonLink>
                <ButtonLink href="#how" variant="outline" size="lg">
                  See how it works
                </ButtonLink>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Icon name="gift" size={16} className="text-accent-soft" />
                15 free credits on signup — no card required.
              </p>
            </div>
            <div className="animate-fade-up [animation-delay:150ms]">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* Stats bar --------------------------------------------------- */}
        <section className="border-y border-edge bg-panel/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 sm:px-8 md:grid-cols-4">
            {STATS_BAR.map((s) => (
              <div key={s.label} className="px-2 py-8 text-center">
                <div className="text-3xl font-bold gradient-text">{s.value}</div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Before / After --------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The old way is <span className="text-pink">exhausting</span>
            </h2>
            <p className="mt-4 text-muted">
              A single short can eat an entire afternoon. VersaVid collapses the whole pipeline
              into a few clicks.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="p-7">
              <div className="mb-5 flex items-center gap-2 text-pink">
                <Icon name="x" size={18} />
                <h3 className="font-semibold">Without VersaVid</h3>
              </div>
              <ul className="space-y-3.5">
                {BEFORE.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink/60" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-lg bg-pink/10 px-3 py-2 text-sm font-medium text-pink">
                ⏱ Hours per video
              </p>
            </Card>
            <Card className="relative overflow-hidden p-7 glow">
              <div className="absolute inset-0 -z-10 gradient-bg-soft" />
              <div className="mb-5 flex items-center gap-2 text-success">
                <Icon name="check" size={18} />
                <h3 className="font-semibold text-ink">With VersaVid</h3>
              </div>
              <ul className="space-y-3.5">
                {AFTER.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-ink">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
                ⚡ About 5 minutes per video
              </p>
            </Card>
          </div>
        </section>

        {/* How it works ------------------------------------------------ */}
        <section id="how" className="border-y border-edge bg-panel/30">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">
                How it works
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                8 steps, fully automated
              </h2>
              <p className="mt-4 text-muted">
                Every stage of production runs for you — you just approve the idea.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((s) => (
                <Card key={s.step} hover className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-sm font-bold text-white">
                    {s.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features ---------------------------------------------------- */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">
              Features
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to ship faster
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} hover className="p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg-soft text-accent-soft">
                  <Icon name={f.icon} size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing ----------------------------------------------------- */}
        <section id="pricing" className="border-y border-edge bg-panel/30">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">
                Pricing
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Plans that scale with your channel
              </h2>
              <p className="mt-4 text-muted">Start free. Upgrade when you&apos;re ready to post daily.</p>
            </div>
            <div className="mt-14 grid gap-6 lg:grid-cols-4">
              {PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col p-7 ${
                    plan.highlighted ? "border-accent/60 glow" : ""
                  }`}
                >
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
                  <ButtonLink
                    href="/auth/signup"
                    variant={plan.highlighted ? "primary" : "secondary"}
                    fullWidth
                    className="mt-7"
                  >
                    {plan.cta}
                  </ButtonLink>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist CTA ------------------------------------------------ */}
        <section id="waitlist" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Card className="relative overflow-hidden p-10 text-center sm:p-16">
            <div className="absolute inset-0 -z-10 gradient-bg-soft" />
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-70"
              style={{
                background:
                  "radial-gradient(50% 80% at 50% 0%, rgba(212,83,126,0.18) 0%, rgba(13,17,23,0) 70%)",
              }}
            />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Be first to the future of <span className="gradient-text">faceless video</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Join the waitlist for early access, bonus credits, and creator-only drops.
            </p>
            <div className="mt-8">
              <WaitlistForm />
            </div>
            <p className="mt-4 text-xs text-muted">No spam. Unsubscribe anytime.</p>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
