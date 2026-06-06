"use client";

import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  children,
  className,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  title?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-edge bg-panel shadow-2xl animate-fade-up",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-edge px-5 py-4">
            <h3 className="text-base font-semibold text-ink">{title}</h3>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-panel-2 hover:text-ink">
              <Icon name="x" size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
