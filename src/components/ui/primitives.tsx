import type { HTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { VideoStatus } from "@/lib/types";

/* Card ---------------------------------------------------------------- */
export function Card({
  className,
  children,
  hover,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-card border border-edge bg-panel",
        hover && "transition-all duration-200 hover:border-edge-strong hover:bg-panel-2",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* Badge --------------------------------------------------------------- */
type Tone = "accent" | "pink" | "success" | "warning" | "muted" | "info";
const badgeTones: Record<Tone, string> = {
  accent: "bg-accent/15 text-accent-soft border-accent/30",
  pink: "bg-pink/15 text-pink border-pink/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  muted: "bg-panel-2 text-muted border-edge",
  info: "bg-[#5aa0ff]/15 text-[#5aa0ff] border-[#5aa0ff]/30",
};

export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<VideoStatus, { tone: Tone; label: string }> = {
  draft: { tone: "muted", label: "Draft" },
  queued: { tone: "info", label: "Queued" },
  generating: { tone: "warning", label: "Generating" },
  ready: { tone: "success", label: "Ready" },
  failed: { tone: "pink", label: "Failed" },
};

const DOT_COLOR: Record<Tone, string> = {
  muted: "bg-muted",
  info: "bg-[#5aa0ff]",
  warning: "bg-warning",
  success: "bg-success",
  pink: "bg-pink",
  accent: "bg-accent",
};

export function StatusBadge({ status }: { status: VideoStatus }) {
  const { tone, label } = STATUS_TONE[status];
  return (
    <Badge tone={tone}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          DOT_COLOR[tone],
          status === "generating" && "animate-pulse"
        )}
      />
      {label}
    </Badge>
  );
}

/* ProgressBar --------------------------------------------------------- */
export function ProgressBar({
  value,
  className,
  gradient = true,
  height = 8,
}: {
  value: number;
  className?: string;
  gradient?: boolean;
  height?: number;
}) {
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-edge", className)}
      style={{ height }}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500 ease-out", gradient ? "gradient-bg" : "bg-accent")}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* Spinner ------------------------------------------------------------- */
export function Spinner({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-block animate-spin rounded-full border-2 border-edge border-t-accent", className)}
      style={{ width: size, height: size }}
    />
  );
}

/* Form fields --------------------------------------------------------- */
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-[10px] border border-edge bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputBase, "resize-none leading-relaxed", className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: InputHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={cn(inputBase, "appearance-none cursor-pointer", className)} {...rest}>
      {children}
    </select>
  );
}

/* Toggle -------------------------------------------------------------- */
export function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-40",
        checked ? "gradient-bg" : "bg-edge-strong"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

/* Section heading ----------------------------------------------------- */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-xs font-semibold uppercase tracking-[0.14em] text-muted", className)}>
      {children}
    </span>
  );
}
