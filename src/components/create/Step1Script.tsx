'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Upload, Smartphone, Monitor, FileText, Lock, Mic, Play, Pause } from 'lucide-react';

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
const iconMap: Record<string, any> = { Smartphone, Monitor };

export default function Step1Script({ selections, update, isFreeTier }: { selections: Record<string, any>; update: (k: string, v: any) => void; isFreeTier: boolean }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
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
        <label className="text-[13px] font-medium text-white mb-3 block">Script source</label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {[{ mode: 'ai', Icon: Sparkles, title: 'AI Generate', sub: 'From a topic' }, { mode: 'upload', Icon: Upload, title: 'Upload script', sub: '.txt or .docx' }].map(({ mode, Icon, title, sub }) => (
            <button key={mode} onClick={() => update('scriptMode', mode)}
              className={'flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ' + (scriptMode === mode ? 'glass-strong border-fuchsia-400/40' : 'bg-[#0a0a0a] border-white/5 hover:border-white/15')}>
              <div className={'h-9 w-9 rounded-lg flex items-center justify-center ' + (scriptMode === mode ? 'bg-fuchsia-500/20' : 'bg-white/5')}>
                <Icon className="h-4 w-4 text-fuchsia-400" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium text-white">{title}</p>
                <p className="text-[10px] text-[#767D88]">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">{scriptMode === 'ai' ? 'Topic' : 'Paste or upload your script'}</label>
        {scriptMode === 'ai' ? (
          <input type="text" value={selections.topic || ''} onChange={(e) => update('topic', e.target.value)}
            placeholder="e.g. 5 mysterious facts about deep ocean creatures"
            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white placeholder:text-[#767D88] focus:outline-none focus:border-fuchsia-400/50 transition-colors" />
        ) : (
          <div className="space-y-3">
            <textarea
              value={selections.topic || ''}
              onChange={(e) => update('topic', e.target.value)}
              placeholder="Paste your script here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white placeholder:text-[#767D88] focus:outline-none focus:border-fuchsia-400/50 transition-colors resize-none"
            />
            <div
              className="relative rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:border-fuchsia-400/30 transition-colors cursor-pointer p-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                  <FileText className="h-5 w-5 text-[#767D88]" />
                </div>
                <p className="text-[13px] text-white font-medium">Drop your script here</p>
                <p className="text-[11px] text-[#767D88] mt-1">or click to browse — .txt, .docx up to 5MB</p>
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
        <label className="text-[13px] font-medium text-white mb-3 block">Format</label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {formats.map((f) => {
            const Icon = iconMap[f.icon];
            const isActive = selections.format === f.id;
            return (
              <button key={f.id} onClick={() => update('format', f.id)}
                className={'relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ' + (isActive ? 'glass-strong border-fuchsia-400/40' : 'bg-[#0a0a0a] border-white/5 hover:border-white/15')}>
                {isActive && <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-purple-600/5" />}
                <div className="relative flex items-center gap-3">
                  <Icon className="h-5 w-5 text-fuchsia-400" />
                  <div>
                    <p className="text-[13px] font-medium text-white">{f.label}</p>
                    <p className="text-[10px] text-[#767D88]">{f.ratio} · {f.platform}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

<div>
        <label className="text-[13px] font-medium text-white mb-3 block">Length</label>
        <div className="flex flex-wrap gap-2">
          {lengths.map((l) => {
            const isActive = selections.length === l.label;
            const isLocked = isFreeTier && l.tier === 'paid';
            return (
              <button key={l.id} onClick={() => !isLocked && (update('length', l.label), update('lengthCredits', l.credits))} disabled={isLocked}
                className={'relative px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 ' + 
                  (isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white' : 
                    isLocked ? 'bg-white/3 text-white/30 cursor-not-allowed' 
                    : 'bg-white/5 text-[#a8aeb8] hover:bg-white/10 hover:text-white')}>
                {isLocked && <Lock className="absolute -top-2 -right-2 h-3 w-3 text-amber-400" />}
                {l.label}<span className="ml-1.5 text-[10px] opacity-60">{l.duration}</span>
                {isLocked && <span className="block text-[9px] text-amber-400 mt-1">Upgrade to unlock</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Tone</label>
        <div className="flex flex-wrap gap-2">
          {tones.map((t) => {
            const isActive = selections.tone === t;
            return (
              <button key={t} onClick={() => update('tone', t)}
                className={'px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 ' + (isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white' : 'bg-white/5 text-[#a8aeb8] hover:bg-white/10 hover:text-white')}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-white/80 mb-3 block">Language</label>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => {
            const isActive = activeLanguage === lang;
            return (
              <button key={lang} onClick={() => update('language', lang)} className={'px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 ' + (isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white' : 'bg-white/5 text-[#a8aeb8] hover:bg-white/10 hover:text-white')}>
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-white block mb-2">Voice</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
                className={'relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden cursor-pointer ' + (isActive ? 'glass-strong border-fuchsia-400/40' : 'bg-[#0a0a0a] border-white/5 hover:border-white/15')}
              >
                {isActive && <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-purple-600/5" />}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={'h-8 w-8 rounded-full flex items-center justify-center ' + (isActive ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600' : 'bg-white/5')}>
                      <Mic className="h-3.5 w-3.5 text-white" />
                    </div>
                    <button onClick={(e) => togglePreview(e, v)} className="ml-auto h-6 w-6 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors" aria-label={isPlaying ? 'Pause preview' : 'Play preview'}>
                      {isPlaying ? <Pause className="h-3 w-3 text-fuchsia-400" /> : <Play className="h-3 w-3 text-fuchsia-400" />}
                    </button>
                  </div>
                  <p className="text-[13px] font-medium text-white">{v.name}</p>
                  <p className="text-[10px] text-[#767D88] mt-0.5 leading-[1.3]">{v.description}</p>
                  <p className="text-[9px] text-white/30 mt-1.5">{v.gender}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
