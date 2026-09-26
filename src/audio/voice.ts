// The voices that read words out loud.
// The browser gives us a list of voices that live on the phone or computer.
// We pick the calmest, clearest ones we can find: a Latin American Spanish
// voice for Spanish and an American English voice for English.
// Parents can pick a different voice in Settings, and we remember it.

export interface VoiceChoice {
  /** A unique name the browser uses to find the voice again. */
  uri: string
  /** Friendly name like "Juan" or "Samantha". */
  name: string
  /** Language code like "es-MX" or "en-US". */
  lang: string
}

/** Names of male Latin American Spanish voices, best first, on iPhone, Android, Mac, and Windows. */
const ES_NAME_PREFS = ['juan', 'diego', 'carlos', 'jorge', 'andrés', 'andres', 'raul', 'raúl', 'pablo', 'mateo', 'eddy', 'reed', 'rocko']
/** Latin American language tags, best first. */
const ES_LANG_PREFS = ['es-co', 'es-mx', 'es-us', 'es-419', 'es-ar', 'es-cl', 'es-pe', 'es']
/** Calm, clear American English voices, best first. */
const EN_NAME_PREFS = ['evan', 'aaron', 'nathan', 'alex', 'tom', 'fred', 'samantha', 'ava', 'allison', 'nicky', 'zoe', 'guy', 'christopher', 'eric']
const EN_LANG_PREFS = ['en-us', 'en']

/** Voices that sound robotic or jokey. We skip these unless nothing else exists. */
const AVOID = ['novelty', 'bad news', 'bells', 'boing', 'bubbles', 'cellos', 'zarvox', 'trinoids', 'whisper', 'wobble', 'compact', 'eloquence']

let voices: SpeechSynthesisVoice[] = []
let preferredEs: string | null = null
let preferredEn: string | null = null

function refresh(): void {
  if (typeof speechSynthesis === 'undefined') return
  try {
    voices = speechSynthesis.getVoices()
  } catch {
    voices = []
  }
}

if (typeof speechSynthesis !== 'undefined') {
  refresh()
  speechSynthesis.addEventListener?.('voiceschanged', refresh)
}

/** Remember the voices the parent picked in Settings (null = let the app choose). */
export function setPreferredVoices(esUri: string | null, enUri: string | null): void {
  preferredEs = esUri
  preferredEn = enUri
}

function isAvoided(v: SpeechSynthesisVoice): boolean {
  const n = v.name.toLowerCase()
  return AVOID.some((bad) => n.includes(bad))
}

function scoreVoice(v: SpeechSynthesisVoice, langPrefs: string[], namePrefs: string[]): number {
  const lang = v.lang.toLowerCase().replace('_', '-')
  const name = v.name.toLowerCase()
  let score = 0
  const langIdx = langPrefs.findIndex((p) => (p.includes('-') ? lang === p : lang.startsWith(p)))
  if (langIdx === -1) return -1
  score += (langPrefs.length - langIdx) * 10
  const nameIdx = namePrefs.findIndex((p) => name.includes(p))
  if (nameIdx !== -1) score += (namePrefs.length - nameIdx) * 3
  // "Enhanced" or "Premium" voices sound much nicer than the compact ones.
  if (name.includes('enhanced') || name.includes('premium') || name.includes('natural') || name.includes('neural')) score += 8
  if (v.localService) score += 1
  if (isAvoided(v)) score -= 100
  return score
}

function best(langPrefs: string[], namePrefs: string[], preferredUri: string | null): SpeechSynthesisVoice | null {
  if (voices.length === 0) refresh()
  if (preferredUri) {
    const chosen = voices.find((v) => v.voiceURI === preferredUri)
    if (chosen) return chosen
  }
  let top: SpeechSynthesisVoice | null = null
  let topScore = -1
  for (const v of voices) {
    const s = scoreVoice(v, langPrefs, namePrefs)
    if (s > topScore) {
      top = v
      topScore = s
    }
  }
  return top
}

/** The Spanish voice we will use right now. */
export function spanishVoice(): SpeechSynthesisVoice | null {
  return best(ES_LANG_PREFS, ES_NAME_PREFS, preferredEs)
}

/** The English voice we will use right now. */
export function englishVoice(): SpeechSynthesisVoice | null {
  return best(EN_LANG_PREFS, EN_NAME_PREFS, preferredEn)
}

function toChoice(v: SpeechSynthesisVoice): VoiceChoice {
  return { uri: v.voiceURI, name: v.name.replace(/\(.*?\)/g, '').trim(), lang: v.lang }
}

/** Every Spanish voice on this device, best guess first. For the Settings picker. */
export function listSpanishVoices(): VoiceChoice[] {
  if (voices.length === 0) refresh()
  return voices
    .filter((v) => v.lang.toLowerCase().startsWith('es'))
    .sort((a, b) => scoreVoice(b, ES_LANG_PREFS, ES_NAME_PREFS) - scoreVoice(a, ES_LANG_PREFS, ES_NAME_PREFS))
    .map(toChoice)
}

/** Every English voice on this device, best guess first. For the Settings picker. */
export function listEnglishVoices(): VoiceChoice[] {
  if (voices.length === 0) refresh()
  return voices
    .filter((v) => v.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => scoreVoice(b, EN_LANG_PREFS, EN_NAME_PREFS) - scoreVoice(a, EN_LANG_PREFS, EN_NAME_PREFS))
    .map(toChoice)
}

/** Are any voices loaded yet? Some browsers load them a moment after the page opens. */
export function voicesReady(): boolean {
  if (voices.length === 0) refresh()
  return voices.length > 0
}
