// Deterministic mock content generators used when real service keys are not
// configured (the default for local development with placeholder env values).

import { placeholderImage } from "@/lib/utils";

function mockScriptByLanguage(topic: string, tone: string, length: string, language: string): string {
  const scenes = length === "long" ? 8 : length === "medium" ? 5 : 3;

  const templates: Record<string, { hook: string; scene: string; cta: string }> = {
    English: {
      hook: `You won't believe what most people get wrong about ${topic}.`,
      scene: `Here's point ${"{{i}}"}: a ${tone.toLowerCase()} take on ${topic} that actually lands.`,
      cta: `Follow for more on ${topic}. Hit subscribe — you'll thank me later.`,
    },
    Urdu: {
      hook: `آپ یقین نہیں کریں گے کہ اکثر لوگ ${topic} کے بارے میں کیا غلط سمجھتے ہیں۔`,
      scene: `یہ رہا نکاتہ ${"{{i}"}: ${topic} پر ${tone.toLowerCase()} انداز جو اصل میں کام کرتا ہے۔`,
      cta: `${topic} پر مزید کے لیے فالو کریں। سبسکرائب بٹن دبائیں — آپ شکر گزار ہوں گے۔`,
    },
    Spanish: {
      hook: `No creerás lo que la mayoría de la gente entiende mal sobre ${topic}.`,
      scene: `Aquí está el punto ${"{{i}"}: una visión ${tone.toLowerCase()} sobre ${topic} que realmente funciona.`,
      cta: `Síguenos para más sobre ${topic}. Suscríbete — te lo agradecerás.`,
    },
    French: {
      hook: `Vous ne croirez pas ce que la plupart des gens comprennent mal à propos de ${topic}.`,
      scene: `Voici le point ${"{{i}"}: une approche ${tone.toLowerCase()} sur ${topic} qui fonctionne vraiment.`,
      cta: `Suivez-nous pour plus sur ${topic}. Abonnez-vous — vous nous remercierez plus tard.`,
    },
    German: {
      hook: `Du wirst nicht glauben, was die meisten Leute über ${topic} falsch verstehen.`,
      scene: `Hier ist Punkt ${"{{i}"}: ein ${tone.toLowerCase()} Blick auf ${topic}, der tatsächlich funktioniert.`,
      cta: `Folge uns für mehr zu ${topic}. Abonnieren — du wirst es nicht bereuen.`,
    },
    Portuguese: {
      hook: `Você não vai acreditar no que a maioria das pessoas erra sobre ${topic}.`,
      scene: `Aqui está o ponto ${"{{i}"}: uma visão ${tone.toLowerCase()} sobre ${topic} que realmente funciona.`,
      cta: `Siga para mais sobre ${topic}. Inscreva-se — você vai agradecer depois.`,
    },
    Arabic: {
      hook: `لن تصدق ما يخطئ فيه معظم الناس حول ${topic}.`,
      scene: `إليك النقطة ${"{{i}"}: نظرة ${tone.toLowerCase()} على ${topic} تعمل حقاً.`,
      cta: `تابع للمزيد حول ${topic}. اشترك — ستشكر نفسك لاحقاً.`,
    },
  };

  const t = templates[language] ?? templates.English;
  const lines: string[] = [`[HOOK] ${t.hook}`];
  for (let i = 1; i < scenes - 1; i++) {
    lines.push(`[SCENE ${i + 1}] ${t.scene.replace("{{i}}", String(i))}`);
  }
  lines.push(`[CTA] ${t.cta}`);
  return lines.join("\n\n");
}

export function mockScript(topic: string, tone: string, length: string, language = "English"): string {
  return mockScriptByLanguage(topic, tone, length, language);
}

export function mockImages(seed: string, count = 5): string[] {
  return Array.from({ length: count }, (_, i) => placeholderImage(`${seed}-${i}`, 720, 1280));
}

export function mockClips(seed: string, count = 4) {
  return Array.from({ length: count }, (_, i) => ({
    url: `https://v3.fal.media/files/mock/${seed}-${i}.mp4`,
    poster: placeholderImage(`${seed}-clip-${i}`, 720, 1280),
    duration: 4,
  }));
}

export function mockVoiceover(voice: string, words: number) {
  return {
    audio_url: `https://mock.elevenlabs.io/${voice}.mp3`,
    voice,
    duration: Math.max(8, Math.round(words / 2.6)),
  };
}

export function mockCaptions(script: string) {
  const words = script.replace(/\[[^\]]+\]/g, "").trim().split(/\s+/).slice(0, 60);
  let t = 0;
  return words.map((w) => {
    const start = t;
    t += 0.35;
    return { word: w, start: +start.toFixed(2), end: +t.toFixed(2) };
  });
}

export function mockRender(seed: string, format: string) {
  return {
    video_url: `https://mock.creatomate.com/renders/${seed}.mp4`,
    thumbnail_url: placeholderImage(seed, format === "9:16" ? 720 : 1280, format === "9:16" ? 1280 : 720),
    format,
  };
}
