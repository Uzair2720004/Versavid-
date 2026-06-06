import type { SVGProps } from "react";

// Feather-style stroke icon paths, drawn in a 24×24 viewBox using currentColor.
const PATHS: Record<string, string> = {
  menu: "M3 12h18 M3 6h18 M3 18h18",
  x: "M18 6 6 18 M6 6l12 12",
  check: "M20 6 9 17l-5-5",
  "arrow-right": "M5 12h14 M12 5l7 7-7 7",
  "arrow-up-right": "M7 17 17 7 M7 7h10v10",
  play: "M6 4l14 8-14 8V4z",
  sparkles: "M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3z M19 14l.8 2 .2.2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z",
  workflow: "M4 4h6v6H4z M14 14h6v6h-6z M10 7h4a3 3 0 0 1 3 3v4",
  mic: "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z M19 10a7 7 0 0 1-14 0 M12 17v5",
  captions: "M3 5h18v14H3z M7 11h3 M7 14h6 M14 11h3",
  aspect: "M3 5h18v14H3z M3 10h4 M17 14h4",
  palette: "M12 3a9 9 0 1 0 0 18c1.7 0 2-1.3 1.2-2.2-.8-.9-.3-2.2 1-2.2H17a4 4 0 0 0 4-4c0-4.4-4-7.6-9-7.6z M7.5 11.5h.01 M10.5 8.5h.01 M14.5 8.5h.01",
  user: "M20 21a8 8 0 1 0-16 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
  film: "M3 4h18v16H3z M7 4v16 M17 4v16 M3 9h4 M3 15h4 M17 9h4 M17 15h4",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0",
  link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  alert: "M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  dashboard: "M3 3h8v8H3z M13 3h8v5h-8z M13 12h8v9h-8z M3 13h8v8H3z",
  video: "M23 7l-7 5 7 5V7z M1 5h15v14H1z",
  plus: "M12 5v14 M5 12h14",
  coins: "M8 8a7 3 0 1 0 0-.001 M1 8v8c0 1.7 3.1 3 7 3s7-1.3 7-3V8 M15 11.5c2.4-.4 4-1.4 4-2.5 M9 11.9c4 0 7-1.3 7-3",
  chart: "M3 3v18h18 M7 14v3 M12 9v8 M17 5v12",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3",
  download: "M12 3v12 M7 10l5 5 5-5 M5 21h14",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6",
  refresh: "M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-right": "M9 6l6 6-6 6",
  "chevron-left": "M15 6l-6 6 6 6",
  image: "M3 5h18v14H3z M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 16l-5-5L5 21",
  layers: "M12 3 2 8l10 5 10-5-10-5z M2 16l10 5 10-5 M2 12l10 5 10-5",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  "eye-off": "M9.9 4.2A9.5 9.5 0 0 1 12 4c6.5 0 10 7 10 7a17 17 0 0 1-3 3.7 M6.6 6.6A17 17 0 0 0 2 11s3.5 7 10 7a9.5 9.5 0 0 0 4-.9 M3 3l18 18 M9.9 9.9a3 3 0 0 0 4.2 4.2",
  upload: "M12 17V5 M7 10l5-5 5 5 M5 21h14",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
  zap: "M13 2 3 14h7l-1 8 10-12h-7l1-8z",
  scissors: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M20 4 8.1 15.9 M14.5 14.5 20 20 M8.1 8.1 12 12",
  shield: "M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  calendar: "M3 5h18v16H3z M3 9h18 M8 3v4 M16 3v4",
  "external-link": "M15 3h6v6 M10 14 21 3 M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3a14 14 0 0 1 0 18 M12 3a14 14 0 0 0 0 18",
  gift: "M20 12v9H4v-9 M2 7h20v5H2z M12 21V7 M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z",
  card: "M2 6h20v12H2z M2 10h20",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  rocket: "M5 13c-1.5 1-2 5-2 5s4-.5 5-2 M12 15l-3-3a14 14 0 0 1 6-9c3 0 5 2 5 5a14 14 0 0 1-9 6z M14.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  volume: "M11 5 6 9H2v6h4l5 4V5z M19 5a9 9 0 0 1 0 14 M15.5 8.5a4 4 0 0 1 0 7",
  type: "M4 7V5h16v2 M9 19h6 M12 5v14",
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: keyof typeof PATHS | string;
  size?: number;
}

export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  const d = PATHS[name] ?? "";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={(i === 0 ? seg : `M${seg}`).trim()} />
      ))}
    </svg>
  );
}

export type IconName = keyof typeof PATHS;
