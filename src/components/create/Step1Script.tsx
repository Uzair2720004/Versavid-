'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Upload, FileText, Lock } from 'lucide-react';

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Neutral';
  language: string;
  previewUrl: string;
}

const voices: VoiceOption[] = [
  { id: 'UgBBYS2sOqTuMpoF3BR0', name: 'Mark', description: 'Natural Conversations, casual young-adult', gender: 'Male', language: 'English', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/f94e260200764678babc807b935bfb0b/voices/UgBBYS2sOqTuMpoF3BR0/0Oc7jiXwWN9kRTXfQsmw.mp3' },
  { id: 'MFZUKuGQUsGJPQjTS4wC', name: 'Jon', description: 'Warm & Grounded Storyteller', gender: 'Male', language: 'English', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/7bdd69d9e581481a8ea5216493271f81/voices/MFZUKuGQUsGJPQjTS4wC/xEoCh0QqT3VPBukUnnNT.mp3' },
  { id: 'wBXNqKUATyqu0RtYt25i', name: 'Adam', description: 'Middle-aged American male, rich radio tone', gender: 'Male', language: 'English', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/1b0aef06ad1848988df4847a8d377baf/voices/wBXNqKUATyqu0RtYt25i/92f83238-5f85-4793-ba6b-dc2cdc482735.mp3' },
  { id: 'EST9Ui6982FZPSi7gCHi', name: 'Elise', description: 'Warm, Natural and Engaging', gender: 'Female', language: 'English', previewUrl: 'https://api.us.elevenlabs.io/v1/voices/EST9Ui6982FZPSi7gCHi/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiJlMmM1MmY5NjQxYzU0ZGY4Yjg2OWZkNWQzYzljZTRmNCIsImZpbGVuYW1lIjoiaWlTa3NSRnpuelZ5cDYwdVlGT1oubXAzIiwidGltZXN0YW1wIjoxNzgzNTY5NjAwMDAwMDAwfQ%3D%3D' },
  { id: 'K7W7zLWeGoxU9YqWoB7A', name: 'Rachel', description: 'Social Media Narrator, clear modern tone', gender: 'Female', language: 'English', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/e24009fa931a4fcd9ee81ea32cb7beda/voices/K7W7zLWeGoxU9YqWoB7A/JyYCTsdVf8ikvvri5CTU.mp3' },
  { id: '4BoDaQ6aygOP6fpsUmJe', name: 'Raghav', description: 'Calm, Confident and Engaging storyteller', gender: 'Male', language: 'Hindi/Urdu', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/4BoDaQ6aygOP6fpsUmJe/N8hoKK2hY8Cxaf5RTeSl.mp3' },
  { id: 'ogCFP29Q71Wj6WHkN69b', name: 'Aakash Aryan', description: 'Mystery & Thriller, tense and expressive', gender: 'Male', language: 'Hindi/Urdu', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/ogCFP29Q71Wj6WHkN69b/Gfo7xJabk7qK1b6DWLXA.mp3' },
  { id: 'QO2wwSVI9F7DwU5uUXDX', name: 'Shivank S', description: 'Digital Brand Voice, modern and youth-facing', gender: 'Male', language: 'Hindi/Urdu', previewUrl: 'https://api.us.elevenlabs.io/v1/voices/QO2wwSVI9F7DwU5uUXDX/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiJlZDliMDVlNjMyNGM0NTc2ODU0OTAzNTJlOWExZWM5MCIsImZpbGVuYW1lIjoidzlHT0VxTGpsWkZBU2NVQTl4VU4ubXAzIiwidGltZXN0YW1wIjoxNzgzNTY5NjAwMDAwMDAwfQ%3D%3D' },
  { id: 'Ms9OTvWb99V6DwRHZn6q', name: 'Monika Sogam', description: 'Deep and Clear, friendly and professional', gender: 'Female', language: 'Hindi/Urdu', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/Ms9OTvWb99V6DwRHZn6q/ydOVuLS9FtBvfNGm8vHK.mp3' },
  { id: 'YqZLNYWZm98oKaaLZkUA', name: 'Edoardo', description: 'Dark, Measured, Natural narration', gender: 'Male', language: 'Spanish', previewUrl: 'https://api.us.elevenlabs.io/v1/voices/YqZLNYWZm98oKaaLZkUA/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiIyMjJkMDY3NzI2ZmU0YzQ2OWJkYmQyZDU1NGExNWQ5MiIsImZpbGVuYW1lIjoieVdRVHdRTFhsZkxBNmg2aUxrNDcubXAzIiwidGltZXN0YW1wIjoxNzgzNTY5NjAwMDAwMDAwfQ%3D%3D' },
  { id: 'W1hAcdh0RNsPYUA7fkJh', name: 'El Faraon', description: 'Deep, Powerful and Peaceful', gender: 'Male', language: 'Spanish', previewUrl: 'https://api.us.elevenlabs.io/v1/voices/W1hAcdh0RNsPYUA7fkJh/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiIxNWJhYTU3YjBmZDg0ZGJjOTA4MWUzZDdlZjE0Y2Q2MCIsImZpbGVuYW1lIjoiWU9KM0RnekxoeFN3czhHMm5HaUgubXAzIiwidGltZXN0YW1wIjoxNzgzNTY5NjAwMDAwMDAwfQ%3D%3D' },
  { id: '86V9x9hrQds83qf7zaGn', name: 'Marcela', description: 'Youthful, Smooth and Natural', gender: 'Female', language: 'Spanish', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/72227268391b4c159a1492e14ddbe5f3/voices/86V9x9hrQds83qf7zaGn/R5bpwcDSsSufxky1fSpx.mp3' },
  { id: 'aQROLel5sQbj1vuIVi6B', name: 'Nicolas', description: 'Narrator, audioguides and narration', gender: 'Male', language: 'French', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/7593eab373974d1db7d45255c5986d46/voices/aQROLel5sQbj1vuIVi6B/shwzqRrR51OISZWUl7EN.mp3' },
  { id: 'JdwJ7jL68CWmQZuo7KgG', name: 'Peter', description: 'Narrator, storytelling', gender: 'Male', language: 'French', previewUrl: 'https://api.us.elevenlabs.io/v1/voices/JdwJ7jL68CWmQZuo7KgG/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiIwNDY5NTRiYWViMjU0YzkzOGYwYjNmMDJkMDVmYzBkYSIsImZpbGVuYW1lIjoiN3d4eW5BeW1ZcWZiWHJEeURFclcubXAzIiwidGltZXN0YW1wIjoxNzgzNTY5NjAwMDAwMDAwfQ%3D%3D' },
  { id: 'O31r762Gb3WFygrEOGh0', name: 'Victoria', description: 'Content Creator, young and captivating', gender: 'Female', language: 'French', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/8883bfc00193440ba374c3ecd71610b5/voices/O31r762Gb3WFygrEOGh0/x79aDNW4Q3qgJKq1svTL.mp3' },
  { id: 'EeTjZnu1OfgjhGKT6ywY', name: 'Lax Whisper', description: 'Deep, hoarse, mysterious and expressive', gender: 'Male', language: 'Portuguese', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/c4ac53b6ed344b3a93f8c66b7b9d4344/voices/EeTjZnu1OfgjhGKT6ywY/zB5leEXmDfC0LBaszWXp.mp3' },
  { id: 'x3mAOLD9WzlmrFCwA1S3', name: 'Evelin Perdomo', description: 'Smooth and Expressive', gender: 'Female', language: 'Portuguese', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/c4ac53b6ed344b3a93f8c66b7b9d4344/voices/x3mAOLD9WzlmrFCwA1S3/xTJ7rTNlWJnl03Xf9Dru.mp3' },
  { id: 'jdKpAe6rxAe99tFGbsAc', name: 'Daniel', description: 'Corporate Narration, warm and resonant', gender: 'Male', language: 'German', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/b425cd85a3d74001977777991113b1cb/voices/jdKpAe6rxAe99tFGbsAc/gg5Nt89QdvNgcwDdR0wI.mp3' },
  { id: 'ZswvODxwIaNVszyBPqBF', name: 'Irene', description: 'Reflective thinking, calm and grounded', gender: 'Female', language: 'German', previewUrl: 'https://api.us.elevenlabs.io/v1/voices/ZswvODxwIaNVszyBPqBF/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiJmMDE5MGEzODVkZDI0YTNiOTI5MTg3ODlmNzBlMzE1OSIsImZpbGVuYW1lIjoiZlEzNVROMXl1V3VSQ0ZVYWFwZVEubXAzIiwidGltZXN0YW1wIjoxNzgzNTY5NjAwMDAwMDAwfQ%3D%3D' },
  { id: 'nH7M8bGCLQbKoS0wBZj7', name: 'Salim', description: 'Warm, Expressive, Tunisian accent', gender: 'Male', language: 'Arabic', previewUrl: 'https://api.us.elevenlabs.io/v1/voices/nH7M8bGCLQbKoS0wBZj7/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiIyYzJhOTdiMzEzMDM0ZDg5YmNkNTM1MWEyNDZmNTA4OSIsImZpbGVuYW1lIjoiaGh3N21BMUs2TjRxUHROcHN5aG4ubXAzIiwidGltZXN0YW1wIjoxNzgzNTY5NjAwMDAwMDAwfQ%3D%3D' },
  { id: 'XdoLPWNt7ytn6BtU4FBf', name: 'Abdullah', description: 'Dramatic Bass, deep Arabic voice', gender: 'Male', language: 'Arabic', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/database/workspace/d2b48386ba4a4c8fbce08a67cf77f798/voices/XdoLPWNt7ytn6BtU4FBf/0daf5416-89e7-4e96-b742-526d9429bd1a.mp3' },
  { id: 'mRdG9GYEjJmIzqbYTidv', name: 'Sana', description: 'Calm, Soft and Honest', gender: 'Female', language: 'Arabic', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/custom/voices/mRdG9GYEjJmIzqbYTidv/QDWxPOKqyxeNJEgcmVIY.mp3' },
];

const languages = ['English', 'Hindi/Urdu', 'Spanish', 'French', 'German', 'Portuguese', 'Arabic'];

const formats = [
  { id: 'vertical', label: 'Vertical', ratio: '9:16', platform: 'Shorts / Reels', icon: 'Smartphone' },
  { id: 'horizontal', label: 'Horizontal', ratio: '16:9', platform: 'Long-form', icon: 'Monitor' },
];
const lengths = [
  { id: 'short', label: 'Short', duration: '15-30s', credits: 1, tier: 'free' as const },
  { id: 'medium', label: 'Medium', duration: '1-3 min', credits: 3, tier: 'paid' as const },
  { id: 'long', label: 'Long', duration: '5-10 min', credits: 8, tier: 'paid' as const },
];
const tones = ['Energetic', 'Educational', 'Cinematic', 'Casual', 'Inspirational', 'Humorous', 'Professional', 'Storytelling'];

const INK = "#EEEEF3";
const MUTE = "#87869A";
const FAINT = "#57566B";
const SURF = "#121218";
const BORDER = "#212129";
const BORDER_STRONG = "#2E2E38";
const ACCENT = "#8A7FFF";
const ACCENT_DIM = "rgba(138,127,255,0.10)";
const SIGNAL = "#E8577E";

export default function Step1Script({ selections, update, isFreeTier }: { selections: Record<string, any>; update: (k: string, v: any) => void; isFreeTier: boolean }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [toneOpen, setToneOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scriptMode = selections.scriptMode || 'ai';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeLanguage = selections.language || 'English';
  const filteredVoices = voices.filter((v) => v.language === activeLanguage);

  const togglePreview = (e: React.MouseEvent, voice: VoiceOption) => {
    e.stopPropagation();
    if (playingId === voice.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(voice.previewUrl);
    audioRef.current = audio;
    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);
    setPlayingId(voice.id);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') {
      const text = await file.text();
      update('topic', text);
    } else if (ext === 'docx') {
      // For docx, just store filename and notify user
      update('topic', `[Uploaded: ${file.name}] — paste your script text here or use a .txt file for auto-read`);
    } else {
      alert('Please upload a .txt or .docx file');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8">
      <div>
        <label className="text-[13px] font-medium mb-3 block" style={{ color: INK }}>Script source</label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {[{ mode: 'ai', Icon: Sparkles, title: 'AI Generate', sub: 'From a topic' }, { mode: 'upload', Icon: Upload, title: 'Upload script', sub: '.txt or .docx' }].map(({ mode, Icon, title, sub }) => (
            <button key={mode} onClick={() => update('scriptMode', mode)}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-300"
              style={{
                borderColor: scriptMode === mode ? `${ACCENT}66` : BORDER,
                background: scriptMode === mode ? ACCENT_DIM : SURF,
              }}>
              <div className="h-9 w-9 rounded-lg flex items-center justify-center"
                style={{ background: scriptMode === mode ? ACCENT_DIM : 'transparent' }}>
                <Icon className="h-4 w-4" style={{ color: ACCENT }} />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium" style={{ color: INK }}>{title}</p>
                <p className="text-[10px]" style={{ color: MUTE }}>{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium mb-3 block" style={{ color: INK }}>{scriptMode === 'ai' ? 'Topic' : 'Paste or upload your script'}</label>
        {scriptMode === 'ai' ? (
          <div className="relative mb-2">
            {[
              "top-0 left-0 border-t border-l",
              "top-0 right-0 border-t border-r",
              "bottom-0 left-0 border-b border-l",
              "bottom-0 right-0 border-b border-r",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-4 h-4 transition-all duration-300 ease-out pointer-events-none`}
                style={{
                  borderColor: focused ? ACCENT : BORDER_STRONG,
                  opacity: focused ? 1 : 0.7,
                  transform: focused
                    ? i === 0
                      ? "translate(-2px,-2px)"
                      : i === 1
                      ? "translate(2px,-2px)"
                      : i === 2
                      ? "translate(-2px,2px)"
                      : "translate(2px,2px)"
                    : "translate(0,0)",
                }}
              />
            ))}
            <div className="px-6 py-8">
              <label className="block text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style={{ color: MUTE }}>
                What's your video about?
              </label>
              <input
                type="text"
                value={selections.topic || ''}
                onChange={(e) => update('topic', e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Historical places lost to time"
                className="w-full bg-transparent outline-none text-[28px] leading-tight"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500, color: INK }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={selections.topic || ''}
              onChange={(e) => update('topic', e.target.value)}
              placeholder="Paste your script here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border text-[14px] resize-none"
              style={{
                background: SURF,
                borderColor: BORDER,
                color: INK,
              }}
            />
            <div
              className="relative rounded-xl border border-dashed cursor-pointer p-8 transition-colors"
              style={{ borderColor: BORDER, background: 'rgba(18,18,24,0.5)' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-3" style={{ background: SURF }}>
                  <FileText className="h-5 w-5" style={{ color: MUTE }} />
                </div>
                <p className="text-[13px] font-medium" style={{ color: INK }}>Drop your script here</p>
                <p className="text-[11px] mt-1" style={{ color: MUTE }}>or click to browse — .txt, .docx up to 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-[13px] font-medium mb-3 block" style={{ color: INK }}>Format</label>
        <div className="flex items-center gap-2 px-1">
          {formats.map((f) => {
            const isActive = selections.format === f.id;
            return (
              <button key={f.id} onClick={() => update('format', f.id)}
                className="px-3 py-1.5 text-[12px] rounded-md border transition-colors duration-200"
                style={{
                  borderColor: isActive ? BORDER_STRONG : BORDER,
                  color: isActive ? INK : FAINT,
                  background: isActive ? SURF : 'transparent',
                }}>
                {f.ratio}
              </button>
            );
          })}
          <span className="text-[11px] ml-1" style={{ color: FAINT }}>
            {selections.format === 'vertical' ? 'Shorts / Reels' : 'Long-form'}
          </span>
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium mb-3 block" style={{ color: INK }}>Length</label>
        <div className="flex flex-wrap gap-2">
          {lengths.map((l) => {
            const isActive = selections.length === l.label;
            const isLocked = isFreeTier && l.tier === 'paid';
            return (
              <button key={l.id} onClick={() => !isLocked && (update('length', l.label), update('lengthCredits', l.credits))} disabled={isLocked}
                className="relative px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 border"
                style={{
                  borderColor: isActive ? ACCENT : BORDER,
                  background: isActive ? ACCENT : 'transparent',
                  color: isActive ? '#0A0A0F' : isLocked ? FAINT : MUTE,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                }}>
                {isLocked && <Lock className="absolute -top-2 -right-2 h-3 w-3" style={{ color: SIGNAL }} />}
                {l.label}<span className="ml-1.5 text-[10px]" style={{ opacity: 0.6 }}>{l.duration}</span>
                {isLocked && <span className="block text-[9px] mt-1" style={{ color: SIGNAL }}>Upgrade to unlock</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setToneOpen((o) => !o)}
        className="flex items-center gap-2 text-[13px] transition-colors"
        style={{ color: MUTE }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="transition-transform duration-300"
          style={{ transform: toneOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </svg>
        Customize tone
      </button>

      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{ maxHeight: toneOpen ? "200px" : "0px", opacity: toneOpen ? 1 : 0 }}
      >
        <div className="pt-6">
          <div className="flex flex-wrap gap-2">
            {tones.map((t, i) => {
              const isActive = selections.tone === t;
              return (
                <button key={t} onClick={() => update('tone', t)}
                  className="px-3.5 py-1.5 rounded-full text-[13px] border transition-all duration-300"
                  style={{
                    borderColor: isActive ? ACCENT : BORDER,
                    background: isActive ? ACCENT_DIM : "transparent",
                    color: isActive ? INK : MUTE,
                    transitionDelay: toneOpen ? `${i * 40}ms` : "0ms",
                  }}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[11px] font-mono tracking-[0.14em] uppercase mb-3 flex items-center gap-2" style={{ color: MUTE }}>
          Language
          <span className="text-[10px] normal-case tracking-normal" style={{ color: SIGNAL }}>required</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => {
            const isActive = activeLanguage === lang;
            return (
              <button key={lang} onClick={() => update('language', lang)}
                className="px-3.5 py-1.5 rounded-full text-[13px] border transition-colors duration-200"
                style={{
                  borderColor: isActive ? ACCENT : BORDER,
                  background: isActive ? ACCENT_DIM : "transparent",
                  color: isActive ? INK : MUTE,
                }}>
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[11px] font-mono tracking-[0.14em] uppercase mb-3 flex items-center gap-2" style={{ color: MUTE }}>
          Voice
          <span className="text-[10px] normal-case tracking-normal" style={{ color: SIGNAL }}>required</span>
        </p>
        <div className="space-y-2">
          {filteredVoices.map((v) => {
            const isActive = selections.voice === v.id;
            const isPlaying = playingId === v.id;
            return (
              <div
                key={v.id}
                role="button"
                tabIndex={0}
                onClick={() => update('voice', v.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') update('voice', v.id); }}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg border cursor-pointer transition-colors duration-200"
                style={{
                  borderColor: isActive ? ACCENT : BORDER,
                  background: isActive ? ACCENT_DIM : SURF,
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { togglePreview(e, v); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center border shrink-0"
                    style={{ borderColor: BORDER_STRONG, color: INK }}
                  >
                    {isPlaying ? (
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <rect x="1" y="1" width="3" height="8" fill="currentColor" />
                        <rect x="6" y="1" width="3" height="8" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <path d="M1 1l8 4-8 4z" fill="currentColor" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <p className="text-[13px]" style={{ color: INK }}>{v.name}</p>
                    <p className="text-[11px]" style={{ color: FAINT }}>{v.description}</p>
                  </div>
                </div>
                {isPlaying && (
                  <div className="flex items-center gap-[2px] h-4">
                    {[3, 8, 5, 10, 4].map((h, i) => (
                      <div
                        key={i}
                        className="w-[2px] rounded-full animate-pulse"
                        style={{ height: `${h}px`, background: SIGNAL, animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
