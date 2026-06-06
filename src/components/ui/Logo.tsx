import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-[10px] gradient-bg"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 4l7 16 7-16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2" fill="white" />
      </svg>
    </span>
  );
}

export function Logo({
  href = "/",
  size = 32,
  className,
}: {
  href?: string;
  size?: number;
  className?: string;
  /** @deprecated logo image already includes the wordmark */
  showWordmark?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center", className)}>
      <img src="/logo-light.png" alt="VersaVid" style={{ height: size }} className="w-auto" />
    </Link>
  );
}
