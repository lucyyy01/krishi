import { Language } from '../types';

export function getSpeechLanguageCode(lang: Language): string {
  switch (lang) {
    case 'hi': return 'hi-IN';
    case 'mr': return 'mr-IN';
    case 'te': return 'te-IN';
    case 'ta': return 'ta-IN';
    case 'kn': return 'kn-IN';
    case 'gu': return 'gu-IN';
    case 'pa': return 'pa-IN';
    case 'bn': return 'bn-IN';
    default: return 'en-IN';
  }
}

// Find best high-quality Indian regional voice installed on user's system/browser
function getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const baseLang = langCode.split('-')[0];

  // 1. Exact match with Indian region (e.g. hi-IN, mr-IN, en-IN)
  const exactMatch = voices.find(v => v.lang.toLowerCase() === langCode.toLowerCase() || v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase());
  if (exactMatch) return exactMatch;

  // 2. Base language match (e.g. hi, mr, te, ta, en)
  const baseMatch = voices.find(v => v.lang.toLowerCase().startsWith(baseLang.toLowerCase()));
  if (baseMatch) return baseMatch;

  // 3. Indian English fallback if Indian language voice not installed
  const indianEn = voices.find(v => v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('hindi'));
  if (indianEn) return indianEn;

  return voices[0] || null;
}

export function speakVernacularText(
  text: string, 
  lang: Language, 
  onStart?: () => void, 
  onEnd?: () => void,
  rate: number = 0.95
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip formatting symbols, urls, and brackets for clean speech
  const cleanText = text
    .replace(/[#*_`~[\]]/g, '')
    .replace(/\bhttps?:\/\/\S+/gi, '')
    .replace(/₹/g, 'Rupees ')
    .replace(/🛑|✅|⏳|💰|🌾|🌦️|📸|📡|🧪|👥|🏛️|🌱|📊|🚜|⚠️|🚨|🍃|🐛|💡|✨/g, '')
    .trim();

  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const targetLangCode = getSpeechLanguageCode(lang);
  utterance.lang = targetLangCode;
  utterance.rate = rate; // Configurable speed (default 0.95 for clear Indian pronunciation)
  utterance.pitch = 1.0;

  const bestVoice = getBestVoiceForLanguage(targetLangCode);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
