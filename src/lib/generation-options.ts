export const MUSIC_TRACKS: Record<string, string> = {
  uplifting: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/atlasaudio-inspiring-uplifting-511864.mp3",
  calm: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/leberch-calm-509384.mp3",
  dramatic: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/atlasaudio-suspense-dramatic-510580.mp3",
  background: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/andriig-background-music-566826.mp3",
};

export const MUSIC_LIBRARY: Record<string, { label: string; url: string }[]> = {
  uplifting: [
    { label: "Inspiring Uplifting", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/atlasaudio-inspiring-uplifting-511864.mp3" },
    { label: "Uplifting", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/jonasblakewood-uplifting-562853.mp3" },
    { label: "Epic Uplifting", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/leberch-epic-uplifting-509714.mp3" },
  ],
  calm: [
    { label: "Calm 1", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/leberch-calm-509384.mp3" },
    { label: "Calm 2", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/prettyjohn1-calm-537656.mp3" },
    { label: "Calm 3", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/the_mountain-calm-507994.mp3" },
  ],
  dramatic: [
    { label: "Suspense Dramatic", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/atlasaudio-suspense-dramatic-510580.mp3" },
    { label: "Sad Dramatic", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/leberch-sad-dramatic-250863.mp3" },
    { label: "Dramatic 1", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/paulyudin-dramatic-482366.mp3" },
    { label: "Dramatic Music", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/paulyudin-dramatic-dramatic-music-513008.mp3" },
    { label: "Dramatic 2", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/prettyjohn1-dramatic-491632.mp3" },
    { label: "Dramatic Music 2", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/the_mountain-dramatic-dramatic-music-508006.mp3" },
  ],
  background: [
    { label: "Background 1", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/andriig-background-music-566826.mp3" },
    { label: "Background 2", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/bombinsound-background-music-version-3-560450.mp3" },
    { label: "Background 3", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/miromaxmusic-music-promotion-no-copyright-513944.mp3" },
    { label: "Background 4", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/nastelbom-background-music-463062.mp3" },
    { label: "Background 5", url: "https://gckyfqoiynysfcayqpwm.supabase.co/storage/v1/object/public/Music/Music/the_mountain-background-music-159125.mp3" },
  ],
};

export const CAPTION_STYLES: Record<string, Record<string, unknown>> = {
  bold: {
    style: "classic",
    "font-size": 110,
    "outline-width": 8,
    "outline-color": "#000000",
    "line-color": "#FFFFFF",
    "word-color": "#FFFF00",
    "all-caps": true,
  },
  wordbyword: {
    style: "classic-one-word",
    "max-words-per-line": 1,
    "font-size": 130,
    "word-color": "#FFFF00",
    "line-color": "#FFFFFF",
  },
  clean: {
    style: "classic",
    "font-size": 80,
    "outline-width": 0,
    "line-color": "#FFFFFF",
    "word-color": "#FFFFFF",
  },
  glow: {
    style: "classic",
    "font-size": 100,
    "word-color": "#00E5FF",
    "line-color": "#FFFFFF",
    "shadow-color": "#00E5FF",
    "shadow-offset": 6,
    "outline-width": 0,
  },
  boxed: {
    style: "boxed-line",
    "font-size": 90,
    "box-color": "#000000",
    "line-color": "#FFFFFF",
    "word-color": "#FFFF00",
  },
  type: {
    style: "classic-progressive",
    "font-size": 90,
    "line-color": "#FFFFFF",
    "word-color": "#FFFF00",
  },
};
