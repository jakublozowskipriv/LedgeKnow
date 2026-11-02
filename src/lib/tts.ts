/** Czytanie na głos przez wbudowaną syntezę mowy (działa offline na iOS). */

let current: SpeechSynthesisUtterance | null = null;

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function polishVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'pl-PL' && /enhanced|premium|zosia|ewa/i.test(v.name)) ?? voices.find((v) => v.lang.startsWith('pl'));
}

export function htmlToText(html: string): string {
  const el = document.createElement('div');
  el.innerHTML = html;
  el.querySelectorAll('li').forEach((li) => li.append('. '));
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function speak(text: string, rate = 1, onEnd?: () => void) {
  stopSpeaking();
  // iOS potrafi uciąć długie wypowiedzi – dzielimy na zdania.
  const chunks = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
  const voice = polishVoice();
  chunks.forEach((chunk, i) => {
    const u = new SpeechSynthesisUtterance(chunk.trim());
    u.lang = 'pl-PL';
    if (voice) u.voice = voice;
    u.rate = rate;
    if (i === chunks.length - 1) {
      u.onend = () => {
        current = null;
        onEnd?.();
      };
    }
    current = u;
    speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if (ttsSupported()) speechSynthesis.cancel();
  current = null;
}

export const isSpeaking = () => current !== null;
