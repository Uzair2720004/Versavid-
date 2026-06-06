"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { LogoMark } from "@/components/ui/Logo";
import { Spinner } from "@/components/ui/primitives";

/**
 * Client-side route guard for the authenticated app shell. Redirects to login
 * once hydration confirms there's no session.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, isAuthed } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthed) router.replace("/auth/login");
  }, [ready, isAuthed, router]);

  if (!ready || !isAuthed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas">
        <div className="animate-pulse-ring rounded-[10px]">
          <LogoMark size={44} />
        </div>
        <Spinner />
        <p className="text-sm text-muted">Loading your studio…</p>
      </div>
    );
  }

  return <>{children}</>;
}
