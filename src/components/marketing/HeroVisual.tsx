import { Icon } from "@/components/ui/Icon";

const ROWS = [
  { label: "Script written", done: true },
  { label: "Images generated", done: true },
  { label: "Video clips rendered", done: true },
  { label: "Voiceover recorded", done: false, active: true },
  { label: "Captions timed", done: false },
];

export function HeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[32px] gradient-bg opacity-20 blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-edge bg-panel shadow-2xl">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-pink/70" />
          <span className="h-3 w-3 rounded-full bg-warning/70" />
          <span className="h-3 w-3 rounded-full bg-success/70" />
          <span className="ml-3 text-xs text-muted">versavid.app/create</span>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[1.1fr_1fr]">
          {/* preview */}
          <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-edge gradient-bg-soft">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
              <span className="flex h-14 w-14 animate-pulse-ring items-center justify-center rounded-full gradient-bg text-white">
                <Icon name="play" size={24} />
              </span>
              <p className="text-sm font-semibold text-ink">5 AI tools that feel illegal to know</p>
              <span className="rounded-full bg-canvas/70 px-2.5 py-1 text-[11px] text-muted">0:42 · 9:16</span>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg bg-canvas/80 px-3 py-1.5 text-center text-xs font-bold text-ink backdrop-blur">
              <span className="gradient-text">these tools are insane</span>
            </div>
          </div>

          {/* pipeline */}
          <div className="flex flex-col gap-2.5">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Generating</span>
              <span className="text-xs font-semibold text-accent-soft">68%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-edge">
              <div className="h-full w-[68%] rounded-full gradient-bg" />
            </div>
            {ROWS.map((r) => (
              <div key={r.label} className="flex items-center gap-2.5 rounded-lg border border-edge bg-canvas px-3 py-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    r.done
                      ? "bg-success/20 text-success"
                      : r.active
                        ? "gradient-bg text-white"
                        : "bg-edge text-muted"
                  }`}
                >
                  {r.done ? (
                    <Icon name="check" size={13} />
                  ) : r.active ? (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                  )}
                </span>
                <span className={`text-xs ${r.done || r.active ? "text-ink" : "text-muted"}`}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute -left-4 top-16 hidden animate-float rounded-xl border border-edge bg-panel px-3 py-2 shadow-xl sm:flex sm:items-center sm:gap-2">
        <Icon name="mic" size={16} className="text-accent-soft" />
        <span className="text-xs text-ink">8 AI voices</span>
      </div>
      <div className="absolute -right-3 bottom-20 hidden animate-float rounded-xl border border-edge bg-panel px-3 py-2 shadow-xl [animation-delay:1.5s] sm:flex sm:items-center sm:gap-2">
        <Icon name="captions" size={16} className="text-pink" />
        <span className="text-xs text-ink">Auto captions</span>
      </div>
    </div>
  );
}
