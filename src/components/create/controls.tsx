"use client";

import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** A large selectable option tile. */
export function OptionTile({
  selected,
  onClick,
  icon,
  title,
  sub,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: IconName;
  title?: string;
  sub?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col rounded-xl border p-4 text-left transition-all duration-200",
        selected
          ? "border-accent/70 bg-accent/10 ring-1 ring-accent/40"
          : "border-edge bg-canvas hover:border-edge-strong hover:bg-panel-2",
        className
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full gradient-bg text-white">
          <Icon name="check" size={12} />
        </span>
      )}
      {icon && (
        <span
          className={cn(
            "mb-3 flex h-9 w-9 items-center justify-center rounded-lg",
            selected ? "gradient-bg text-white" : "bg-panel-2 text-muted"
          )}
        >
          <Icon name={icon} size={18} />
        </span>
      )}
      {title && <span className="text-sm font-semibold text-ink">{title}</span>}
      {sub && <span className="mt-0.5 text-xs text-muted">{sub}</span>}
      {children}
    </button>
  );
}

/** Compact pill selector for a small set of choices. */
export function PillGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string; sub?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-lg border px-4 py-2.5 text-sm transition-all duration-200",
              active
                ? "border-accent/70 bg-accent/10 text-ink"
                : "border-edge bg-canvas text-muted hover:border-edge-strong hover:text-ink"
            )}
          >
            <span className="font-medium">{o.label}</span>
            {o.sub && <span className={cn("ml-1.5 text-xs", active ? "text-accent-soft" : "text-muted")}>{o.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Swatch chip for style choices. */
export function SwatchTile({
  selected,
  onClick,
  label,
  swatch,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  swatch: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-all duration-200",
        selected
          ? "border-accent/70 bg-accent/10 text-ink"
          : "border-edge bg-canvas text-muted hover:border-edge-strong hover:text-ink"
      )}
    >
      <span className="h-5 w-5 shrink-0 rounded-md" style={{ background: swatch }} />
      <span className="font-medium">{label}</span>
    </button>
  );
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <p className="text-sm font-semibold text-ink">{children}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
