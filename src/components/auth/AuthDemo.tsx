"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { GEN_STEPS } from "@/lib/constants";

const STEPS = GEN_STEPS.slice(0, 7);

/**
 * Looping product demo for the auth split-screen. Walks through the generation
 * pipeline, advancing one step roughly every second and restarting.
 */
export function AuthDemo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % (STEPS.length + 2));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  const pct = Math.min(100, Math.round((Math.min(active, STEPS.length) / STEPS.length) * 100));

  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden p-10 xl:p-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(70% 60% at 30% 20%, rgba(127,119,221,0.28) 0%, rgba(13,17,23,0) 60%), radial-gradient(60% 60% at 80% 90%, rgba(212,83,126,0.22) 0%, rgba(13,17,23,0) 60%)",
        }}
      />
      <div className="relative z-10 max-w-md">
        <h2 className="text-2xl font-bold leading-tight text-ink xl:text-3xl">
          Watch an idea become a <span className="gradient-text">finished video</span>
        </h2>
        <p className="mt-3 text-sm text-muted">
          This is the exact pipeline that runs the moment you hit generate.
        </p>

        <div className="mt-8 rounded-2xl border border-edge bg-panel/80 p-5 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Generating preview
            </span>
            <span className="text-xs font-semibold text-accent-soft">{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-edge">
            <div
              className="h-full rounded-full gradient-bg transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {STEPS.map((step, i) => {
              const done = i < active;
              const running = i === active;
              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors duration-300 ${
                    running ? "border-accent/50 bg-accent/10" : "border-edge bg-canvas"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-success/20 text-success"
                        : running
                          ? "gradient-bg text-white"
                          : "bg-edge text-muted"
                    }`}
                  >
                    {done ? (
                      <Icon name="check" size={13} />
                    ) : running ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                    )}
                  </span>
                  <span className={`text-sm ${done || running ? "text-ink" : "text-muted"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-muted">
          <Icon name="zap" size={16} className="text-accent-soft" />
          From topic to publish-ready MP4 in about five minutes.
        </div>
      </div>
    </div>
  );
}
