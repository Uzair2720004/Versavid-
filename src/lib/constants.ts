// Static catalog data used across the wizard, settings, pricing, etc.

export const APP_NAME = "VersaVid";
export const FREE_CREDITS = 5;

export const STATS_BAR = [
  { value: "5 min", label: "Average build time" },
  { value: "8 steps", label: "Fully automated" },
  { value: "6", label: "Languages supported" },
  { value: "15", label: "Free credits on signup" },
];

// ---- Wizard option catalogs ------------------------------------------------

export const FORMATS = [
  { value: "9:16", label: "Vertical", sub: "Shorts / Reels / TikTok", icon: "vertical" },
  { value: "16:9", label: "Horizontal", sub: "Standard YouTube", icon: "horizontal" },
] as const;

export const LENGTHS = [
  { value: "short", label: "Short", sub: "15–30s", credits: 3 },
  { value: "medium", label: "Medium", sub: "30–60s", credits: 5 },
  { value: "long", label: "Long", sub: "1–3 min", credits: 9 },
] as const;

export const TONES = [
  "Energetic",
  "Educational",
  "Cinematic",
  "Casual",
  "Inspirational",
  "Humorous",
  "Professional",
  "Storytelling",
];

export const MEDIA_TYPES = [
  { value: "images", label: "Images only", sub: "AI photos with motion", icon: "image" },
  { value: "videos", label: "Videos only", sub: "AI generated clips", icon: "film" },
  { value: "both", label: "Mixed media", sub: "Photos + video clips", icon: "layers" },
] as const;

export const PHOTO_STYLES = [
  { value: "photoreal", label: "Photorealistic", swatch: "#7f77dd" },
  { value: "cinematic", label: "Cinematic", swatch: "#d4537e" },
  { value: "anime", label: "Anime", swatch: "#3fb950" },
  { value: "3d", label: "3D Render", swatch: "#d29922" },
  { value: "watercolor", label: "Watercolor", swatch: "#5aa0ff" },
  { value: "minimal", label: "Minimal", swatch: "#8b949e" },
];

export const VIDEO_STYLES = [
  { value: "realistic", label: "Realistic", swatch: "#7f77dd" },
  { value: "dreamy", label: "Dreamy", swatch: "#d4537e" },
  { value: "fast-cut", label: "Fast cut", swatch: "#3fb950" },
  { value: "slow-mo", label: "Slow motion", swatch: "#d29922" },
  { value: "retro", label: "Retro film", swatch: "#5aa0ff" },
  { value: "neon", label: "Neon", swatch: "#e879f9" },
];

export const VOICES = [
  { value: "atlas", name: "Atlas", tag: "Deep • Male", accent: "American", swatch: "#7f77dd" },
  { value: "nova", name: "Nova", tag: "Warm • Female", accent: "American", swatch: "#d4537e" },
  { value: "echo", name: "Echo", tag: "Crisp • Male", accent: "British", swatch: "#3fb950" },
  { value: "luna", name: "Luna", tag: "Soft • Female", accent: "British", swatch: "#d29922" },
  { value: "ember", name: "Ember", tag: "Energetic • Female", accent: "Australian", swatch: "#5aa0ff" },
  { value: "ridge", name: "Ridge", tag: "Gravelly • Male", accent: "American", swatch: "#e879f9" },
  { value: "sage", name: "Sage", tag: "Calm • Neutral", accent: "Neutral", swatch: "#2dd4bf" },
  { value: "pixel", name: "Pixel", tag: "Youthful • Female", accent: "American", swatch: "#f59e0b" },
];

export const LANGUAGES = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Spanish", flag: "🇪🇸" },
  { value: "fr", label: "French", flag: "🇫🇷" },
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "pt", label: "Portuguese", flag: "🇧🇷" },
  { value: "hi", label: "Hindi", flag: "🇮🇳" },
];

export const SPEEDS = [
  { value: "slow", label: "Slow", sub: "0.85×" },
  { value: "normal", label: "Normal", sub: "1.0×" },
  { value: "fast", label: "Fast", sub: "1.15×" },
] as const;

export const CAPTION_STYLES = [
  { value: "bold-pop", label: "Bold Pop", preview: "BOLD" },
  { value: "karaoke", label: "Karaoke", preview: "word by word" },
  { value: "minimal", label: "Minimal", preview: "clean" },
  { value: "neon", label: "Neon Glow", preview: "glow" },
  { value: "boxed", label: "Boxed", preview: "boxed" },
  { value: "typewriter", label: "Typewriter", preview: "type_" },
];

export const CAPTION_POSITIONS = [
  { value: "top", label: "Top" },
  { value: "center", label: "Center" },
  { value: "bottom", label: "Bottom" },
] as const;

export const MUSIC_TRACKS = [
  { value: "none", label: "No music" },
  { value: "uplifting", label: "Uplifting" },
  { value: "cinematic", label: "Cinematic" },
  { value: "lofi", label: "Lo-fi chill" },
  { value: "corporate", label: "Corporate" },
  { value: "epic", label: "Epic trailer" },
];

// ---- Generation pipeline ---------------------------------------------------

export const GEN_STEPS = [
  { key: "script", label: "Writing script", description: "AI drafts the narration & scenes" },
  { key: "images", label: "Generating images", description: "Flux renders the visuals" },
  { key: "videos", label: "Creating video clips", description: "Kling animates the scenes" },
  { key: "voiceover", label: "Recording voiceover", description: "ElevenLabs narrates the script" },
  { key: "captions", label: "Adding captions", description: "Whisper transcribes & times words" },
  { key: "music", label: "Mixing music", description: "Background track & audio levels" },
  { key: "render", label: "Final render", description: "Creatomate assembles the MP4" },
  { key: "ready", label: "Ready to download", description: "Your video is published" },
];

export const HOW_IT_WORKS = [
  { step: 1, title: "Pick a topic", desc: "Tell us what your video is about — or paste your own script." },
  { step: 2, title: "AI writes the script", desc: "Claude drafts a scroll-stopping, scene-by-scene script." },
  { step: 3, title: "Visuals are generated", desc: "Flux creates on-brand images for every scene." },
  { step: 4, title: "Clips come alive", desc: "Kling animates stills into smooth motion video." },
  { step: 5, title: "Voiceover is recorded", desc: "ElevenLabs narrates in the voice you choose." },
  { step: 6, title: "Captions are timed", desc: "Whisper transcribes & syncs word-perfect captions." },
  { step: 7, title: "Music is mixed", desc: "A fitting soundtrack is layered and balanced." },
  { step: 8, title: "Final render", desc: "Everything is assembled into a publish-ready MP4." },
];

export const FEATURES = [
  {
    title: "Script-to-screen in minutes",
    desc: "Go from a one-line idea to a finished, narrated video without touching a timeline.",
    icon: "sparkles",
  },
  {
    title: "8-step automation",
    desc: "Script, images, clips, voice, captions, music, render — all orchestrated for you.",
    icon: "workflow",
  },
  {
    title: "Studio-grade voices",
    desc: "Choose from 8 lifelike AI voices across 6 languages with tunable delivery.",
    icon: "mic",
  },
  {
    title: "Caption styles that pop",
    desc: "Word-by-word karaoke, bold pop, neon glow and more — auto-timed to your audio.",
    icon: "captions",
  },
  {
    title: "Shorts & widescreen",
    desc: "Render 9:16 for Shorts/Reels/TikTok or 16:9 for the main feed from one project.",
    icon: "aspect",
  },
  {
    title: "Your brand, remembered",
    desc: "Save default styles, voices and formats so every video matches your channel.",
    icon: "palette",
  },
];

// ---- Billing ---------------------------------------------------------------

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  credits: string;
  blurb: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    credits: "15 credits once",
    blurb: "Kick the tires and ship your first video.",
    features: ["15 starter credits", "720p exports", "Watermark", "5 AI voices", "Community support"],
    cta: "Start free",
  },
  {
    id: "creator",
    name: "Creator",
    price: 19,
    period: "/mo",
    credits: "40 credits / mo",
    blurb: "For creators publishing weekly.",
    features: ["40 credits / month", "1080p exports", "No watermark", "All 8 voices", "Priority queue"],
    highlighted: true,
    cta: "Choose Creator",
  },
  {
    id: "pro",
    name: "Pro",
    price: 39,
    period: "/mo",
    credits: "90 credits / mo",
    blurb: "For daily uploaders and small teams.",
    features: ["90 credits / month", "4K exports", "Voice cloning", "Brand kits", "Analytics"],
    cta: "Choose Pro",
  },
  {
    id: "agency",
    name: "Agency",
    price: 99,
    period: "/mo",
    credits: "240 credits / mo",
    blurb: "For agencies managing many channels.",
    features: ["240 credits / month", "4K exports", "5 team seats", "API access", "Dedicated support"],
    cta: "Choose Agency",
  },
];

export interface CreditPack {
  id: string;
  name: string;
  price: number;
  credits: number;
  perks: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", name: "Starter", price: 9, credits: 30, perks: "~6 short videos" },
  { id: "creator", name: "Creator", price: 25, credits: 100, perks: "~20 short videos", popular: true },
  { id: "pro", name: "Pro", price: 59, credits: 280, perks: "~56 short videos" },
  { id: "studio", name: "Studio", price: 129, credits: 700, perks: "~140 short videos" },
];

export const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile", icon: "user" },
  { id: "security", label: "Security", icon: "lock" },
  { id: "defaults", label: "Video defaults", icon: "film" },
  { id: "voice", label: "Voice", icon: "mic" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "connections", label: "Connections", icon: "link" },
  { id: "danger", label: "Danger zone", icon: "alert" },
];

export const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "India",
  "Germany", "France", "Spain", "Brazil", "Japan", "Other",
];
