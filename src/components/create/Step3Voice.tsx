'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Play, Pause } from 'lucide-react';

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

const speeds = [
  { id: 'slow', label: 'Slow', value: '0.85x' },
  { id: 'normal', label: 'Normal', value: '1.0x' },
  { id: 'fast', label: 'Fast', value: '1.25x' },
];

const captionStyles = [
  { id: 'bold', label: 'Bold', preview: 'font-bold text-white' },
  { id: 'wordbyword', label: 'Word by word', preview: 'font-semibold text-cyan-400' },
  { id: 'clean', label: 'Clean', preview: 'font-medium text-white/90' },
  { id: 'glow', label: 'Glow', preview: 'font-semibold text-fuchsia-400' },
  { id: 'boxed', label: 'Boxed', preview: 'font-bold text-black bg-white' },
  { id: 'type', label: 'Type', preview: 'font-mono text-emerald-400' },
];

export default function Step3Voice({ selections, update }: { selections: Record<string, any>; update: (k: string, v: any) => void }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8">
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

      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Speed</label>
        <div className="flex flex-wrap gap-2">
          {speeds.map((s) => {
            const isActive = selections.speed === s.label;
            return (
              <button key={s.id} onClick={() => update('speed', s.label)} className={'px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 ' + (isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white' : 'bg-white/5 text-[#a8aeb8] hover:bg-white/10 hover:text-white')}>
                {s.label}<span className="ml-1.5 text-[10px] opacity-60">{s.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-white mb-3 block">Caption style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {captionStyles.map((c) => {
            const isActive = selections.captionStyle === c.id;
            return (
              <button key={c.id} onClick={() => update('captionStyle', c.id)} className={'relative h-20 rounded-xl border overflow-hidden transition-all duration-300 group ' + (isActive ? 'border-fuchsia-400/50' : 'border-white/5 hover:border-white/15')}>
                <div className="absolute inset-0 bg-black/60" />
                {isActive && <div className="absolute inset-0 bg-fuchsia-500/10" />}
                <div className="relative h-full flex items-center justify-center">
                  <span className={'text-[16px] ' + c.preview}>{c.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
