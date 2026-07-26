export interface Feature {
  index: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  bullets: string[];
  accent: string;
}

export const features: Feature[] = [
  {
    index: '01',
    title: 'Script Generation',
    tagline: 'AI that writes like a pro',
    description:
      'Type a topic and VersaVid crafts a full video script in seconds — hooks, pacing, narrative arc and all. Powered by Claude, it writes in your voice and adapts for Shorts or Standard format automatically.',
    image: '/images/feature-editing.jpg',
    bullets: ['Topic to script in seconds', 'Shorts & Standard formats', 'Hook-first structure'],
    accent: 'from-cyan-400/30 to-blue-500/10',
  },
  {
    index: '02',
    title: 'AI Video & Images',
    tagline: 'Visuals, generated on demand',
    description:
      'From your script, VersaVid generates cinematic images and video clips using fal.ai Flux and Kling — no stock footage, no camera needed. Every frame is created specifically for your content.',
    image: '/images/feature-effects.jpg',
    bullets: ['fal.ai Flux image gen', 'Kling video clips', 'Scene-matched visuals'],
    accent: 'from-fuchsia-500/30 to-purple-600/10',
  },
  {
    index: '03',
    title: 'Voice & Captions',
    tagline: 'Sound like a studio production',
    description:
      'ElevenLabs voices your script with natural, human-quality narration. OpenAI Whisper then generates perfectly synced captions — ready for silent scroll, optimised for every platform.',
    image: '/images/feature-color.jpg',
    bullets: ['ElevenLabs voiceover', 'Auto-synced captions', 'Platform-ready output'],
    accent: 'from-amber-400/30 to-orange-500/10',
  },
  {
    index: '04',
    title: 'One-Click Render',
    tagline: 'From idea to MP4 in minutes',
    description:
      'Creatomate assembles every element — clips, voice, captions, music — into a finished MP4 you can download and post immediately. YouTube Shorts 9:16 or Standard 16:9, your choice.',
    image: '/images/feature-motion.jpg',
    bullets: ['Creatomate render engine', '9:16 and 16:9 output', 'Download-ready MP4'],
    accent: 'from-emerald-400/30 to-teal-500/10',
  },
];

export const stats = [
  { value: '8-step', label: 'Fully automated pipeline' },
  { value: '5 min', label: 'Topic to finished video' },
  { value: '2 formats', label: 'Shorts & Standard' },
  { value: '15 cr', label: 'Free on signup' },
];

export const logos = [
  'CLAUDE', 'FAL.AI', 'ELEVENLABS', 'CREATOMATE', 'WHISPER', 'SUPABASE', 'VERCEL', 'NEXT.JS', 'TAILWIND', 'TYPESCRIPT',
];

export const navLinks = [
  { label: 'Product', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '#cta' },
  { label: 'Sign in', href: '/login' },
];

