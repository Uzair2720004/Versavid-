import Image from "next/image";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <Image src="/images/logo-dark.jpeg" alt="VersaVid" width={size} height={size} className="object-contain" />
  );
}

export function Logo({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image src="/images/logo-dark.jpeg" alt="VersaVid" width={200} height={size} className={`object-contain w-auto ${className}`} />
  );
}
