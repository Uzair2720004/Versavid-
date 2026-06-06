"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/videos", label: "My Videos", icon: "video" },
  { href: "/create", label: "Create Video", icon: "plus" },
  { href: "/credits", label: "Credits", icon: "coins" },
  { href: "/analytics", label: "Analytics", icon: "chart" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active ? "bg-panel-2 text-ink" : "text-muted hover:bg-panel-2/60 hover:text-ink"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                active ? "gradient-bg text-white" : "bg-panel text-muted group-hover:text-ink"
              )}
            >
              <Icon name={item.icon} size={17} />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function CreditWidget() {
  const { credits } = useApp();
  if (!credits) return null;
  const used = credits.total_used;
  const allowance = credits.monthly_allowance || 120;
  const pct = Math.min(100, (used / allowance) * 100);
  return (
    <div className="rounded-card border border-edge bg-panel p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-ink">
          <Icon name="coins" size={16} className="text-accent-soft" />
          Credits
        </span>
        <span className="font-semibold text-ink">{credits.balance}</span>
      </div>
      <ProgressBar value={pct} className="mt-3" height={6} />
      <p className="mt-2 text-xs text-muted">
        {used} / {allowance} used this month
      </p>
      <Link href="/credits">
        <Button size="sm" variant="secondary" fullWidth className="mt-3">
          Buy credits
        </Button>
      </Link>
    </div>
  );
}

function UserChip() {
  const { profile, logout } = useApp();
  const router = useRouter();
  if (!profile) return null;
  const initials = profile.full_name
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center gap-3 border-t border-edge pt-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-bg text-sm font-semibold text-white">
        {initials || "U"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{profile.full_name || "Creator"}</p>
        <p className="truncate text-xs text-muted">{profile.email}</p>
      </div>
      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="rounded-lg p-2 text-muted transition-colors hover:bg-panel-2 hover:text-pink"
        aria-label="Log out"
      >
        <Icon name="logout" size={18} />
      </button>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-edge bg-canvas/90 px-4 backdrop-blur-xl lg:hidden">
        <img src="/logo-light.png" alt="VersaVid" style={{ height: 40 }} className="w-auto" />
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-ink" aria-label="Open menu">
          <Icon name="menu" size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col gap-4 border-r border-edge bg-canvas p-4">
            <div className="flex items-center justify-between">
              <img src="/logo-light.png" alt="VersaVid" style={{ height: 40 }} className="w-auto" />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-muted" aria-label="Close">
                <Icon name="x" size={20} />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <CreditWidget />
            <UserChip />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col gap-5 border-r border-edge bg-canvas p-5 lg:flex">
        <div className="flex items-center px-2 py-3">
          <img src="/logo-light.png" alt="VersaVid" style={{ height: 80 }} className="w-auto" />
        </div>
        <NavLinks />
        <CreditWidget />
        <UserChip />
      </aside>
    </>
  );
}
