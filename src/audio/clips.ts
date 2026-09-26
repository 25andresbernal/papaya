// Real recorded voices. When we have an audio file for a line, we play it.
// When we do not, the phone's built-in voice reads it instead (see sound.ts).
//
// The files live in public/audio/es/ and public/audio/en/. A small list called
// the manifest (public/audio/manifest.json) says which lines we have, so the app
// never asks for a file that does not exist. The generate-audio script makes both.

interface Manifest {
  /** Normalized Spanish text -> file name (without folder). */
  es: Record<string, string>
  /** Normalized English text -> file name. */
  en: Record<string, string>
  /** Which voice made the files, for the Settings screen. */
  voices?: { es?: string; en?: string }
}

let manifest: Manifest | null = null
let loading: Promise<Manifest> | null = null
let current: HTMLAudioElement | null = null
const cache = new Map<string, HTMLAudioElement>()

/** Lowercase, trim, collapse spaces, drop the "___" blank. Same rule as the script. */
export function normalizeLine(text: string): string {
  return text
    .replace(/___/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** Load the list of available clips once. Safe to call many times. */
export function loadClipManifest(): Promise<Manifest> {
  if (manifest) return Promise.resolve(manifest)
  if (loading) return loading
  loading = fetch('/audio/manifest.json', { cache: 'force-cache' })
    .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : { es: {}, en: {} }))
    .catch(() => ({ es: {}, en: {} }))
    .then((m) => {
      manifest = m
      return m
    })
  return loading
}

/** Do we have a recorded clip for this line? */
export function hasClip(lang: 'es' | 'en', text: string): boolean {
  if (!manifest) return false
  return normalizeLine(text) in manifest[lang]
}

/** The recorded voice names, if the files were made by the script. */
export function clipVoices(): { es?: string; en?: string } {
  return manifest?.voices ?? {}
}

/** Stop whatever clip is playing. */
export function stopClip() {
  if (current) {
    current.pause()
    current.currentTime = 0
    current = null
  }
}

/**
 * Play the recorded clip for a line. Returns true if a clip started,
 * false if there is none (so the caller can fall back to the phone's voice).
 */
export function playClip(lang: 'es' | 'en', text: string, opts: { rate?: number } = {}): boolean {
  if (!manifest) return false
  const file = manifest[lang][normalizeLine(text)]
  if (!file) return false
  try {
    stopClip()
    const url = `/audio/${lang}/${file}`
    let el = cache.get(url)
    if (!el) {
      el = new Audio(url)
      el.preload = 'auto'
      cache.set(url, el)
    }
    el.playbackRate = opts.rate ?? 1
    el.currentTime = 0
    current = el
    void el.play().catch(() => {
      // If the browser blocks it (no tap yet), the phone voice is not used either;
      // the kid just taps the speaker again.
    })
    return true
  } catch {
    return false
  }
}

/** Warm up the clips for a lesson so the first tap plays instantly. */
export function preloadClips(lang: 'es' | 'en', texts: string[]) {
  if (!manifest) return
  for (const t of texts) {
    const file = manifest[lang][normalizeLine(t)]
    if (!file) continue
    const url = `/audio/${lang}/${file}`
    if (cache.has(url)) continue
    const el = new Audio(url)
    el.preload = 'auto'
    cache.set(url, el)
  }
}
