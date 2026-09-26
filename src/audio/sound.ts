// Every tap makes a sound. This file makes the sounds.
// We do not download sound files. We "draw" sounds with the Web Audio API,
// like drawing a picture with math. This keeps the app tiny and fast.
//
// Also: the browser can read Spanish out loud for free. We use that for words.

import { englishVoice, spanishVoice } from './voice'

let ctx: AudioContext | null = null
let enabled = true
let speakEnabled = true

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** Turn sound effects on or off. */
export function setSoundEnabled(on: boolean) {
  enabled = on
}
/** Turn spoken Spanish on or off. */
export function setSpeakEnabled(on: boolean) {
  speakEnabled = on
}

/** Browsers only allow sound after the kid taps something. Call this on first tap. */
export function unlockAudio() {
  getCtx()
}

type Wave = OscillatorType

/** Play one note. freq in Hz, duration in seconds. */
function tone(freq: number, duration: number, opts: { type?: Wave; volume?: number; delay?: number; slideTo?: number } = {}) {
  if (!enabled) return
  const ac = getCtx()
  if (!ac) return
  const { type = 'sine', volume = 0.2, delay = 0, slideTo } = opts
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

/** A short burst of noise, for pops and whooshes. */
function noise(duration: number, volume = 0.15, delay = 0) {
  if (!enabled) return
  const ac = getCtx()
  if (!ac) return
  const buffer = ac.createBuffer(1, ac.sampleRate * duration, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const src = ac.createBufferSource()
  src.buffer = buffer
  const gain = ac.createGain()
  gain.gain.value = volume
  const filter = ac.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 800
  src.connect(filter).connect(gain).connect(ac.destination)
  src.start(ac.currentTime + delay)
}

/** All the sounds the game can make. Call sfx.tap(), sfx.correct(), etc. */
export const sfx = {
  /** A soft click for any button. */
  tap: () => tone(600, 0.06, { type: 'triangle', volume: 0.12 }),
  /** A happy ding for a right answer. */
  correct: () => {
    tone(660, 0.12, { type: 'triangle', volume: 0.2 })
    tone(880, 0.18, { type: 'triangle', volume: 0.2, delay: 0.08 })
  },
  /** A gentle "try again" buzz. Never harsh. */
  wrong: () => tone(220, 0.25, { type: 'square', volume: 0.08, slideTo: 160 }),
  /** Coin pickup. */
  coin: () => {
    tone(1200, 0.08, { type: 'square', volume: 0.1 })
    tone(1600, 0.12, { type: 'square', volume: 0.1, delay: 0.06 })
  },
  /** A combo hit: gets higher the bigger the combo. */
  combo: (n: number) => {
    const base = 500 + Math.min(n, 10) * 60
    tone(base, 0.1, { type: 'triangle', volume: 0.18 })
    tone(base * 1.5, 0.14, { type: 'triangle', volume: 0.18, delay: 0.07 })
  },
  /** Big fanfare for finishing a lesson. */
  fanfare: () => {
    const notes = [523, 659, 784, 1047]
    notes.forEach((n, i) => tone(n, 0.25, { type: 'triangle', volume: 0.2, delay: i * 0.12 }))
    tone(1047, 0.5, { type: 'triangle', volume: 0.2, delay: 0.5 })
  },
  /** Level up! Rising sparkle. */
  levelUp: () => {
    for (let i = 0; i < 8; i++) tone(400 + i * 120, 0.12, { type: 'sine', volume: 0.15, delay: i * 0.06 })
  },
  /** Unlocking something new. */
  unlock: () => {
    tone(392, 0.15, { type: 'triangle', volume: 0.2 })
    tone(523, 0.15, { type: 'triangle', volume: 0.2, delay: 0.12 })
    tone(784, 0.35, { type: 'triangle', volume: 0.2, delay: 0.24 })
    noise(0.3, 0.08, 0.24)
  },
  /** Pop, like a bubble. */
  pop: () => {
    tone(900, 0.05, { type: 'sine', volume: 0.15, slideTo: 300 })
    noise(0.05, 0.1)
  },
  /** Whoosh for screen changes. */
  whoosh: () => noise(0.25, 0.08),
  /** Tick for a countdown timer. */
  tick: () => tone(1000, 0.04, { type: 'square', volume: 0.06 }),
  /** Chest opening. */
  chest: () => {
    noise(0.2, 0.1)
    for (let i = 0; i < 5; i++) tone(700 + i * 150, 0.1, { type: 'triangle', volume: 0.15, delay: 0.2 + i * 0.07 })
  },
  /** Streak fire. */
  streak: () => {
    tone(300, 0.2, { type: 'sawtooth', volume: 0.08, slideTo: 900 })
    tone(900, 0.3, { type: 'triangle', volume: 0.15, delay: 0.15 })
  },
}

/** Say a Spanish word out loud, calmly and clearly, with a Latin American voice. */
export function speak(text: string, opts: { rate?: number; lang?: string } = {}) {
  if (!speakEnabled) return
  if (typeof speechSynthesis === 'undefined') return
  try {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    const voice = spanishVoice()
    if (voice) u.voice = voice
    u.lang = opts.lang ?? voice?.lang ?? 'es-MX'
    u.rate = opts.rate ?? 0.8 // Slow and calm so kids can hear each sound.
    u.pitch = 1.1 // A touch higher sounds younger and friendlier.
    u.volume = 1
    speechSynthesis.speak(u)
  } catch {
    // If speaking fails, the game still works.
  }
}

/** Say an English word or sentence with an American English voice. */
export function speakEnglish(text: string, opts: { rate?: number } = {}) {
  if (!speakEnabled) return
  if (typeof speechSynthesis === 'undefined') return
  try {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    const voice = englishVoice()
    if (voice) u.voice = voice
    u.lang = voice?.lang ?? 'en-US'
    u.rate = opts.rate ?? 0.95
    u.pitch = 1.05
    u.volume = 1
    speechSynthesis.speak(u)
  } catch {
    // If speaking fails, the game still works.
  }
}

/** Try a specific voice out loud (used by the Settings voice picker). */
export function previewVoice(uri: string, text: string) {
  if (typeof speechSynthesis === 'undefined') return
  try {
    const v = speechSynthesis.getVoices().find((x) => x.voiceURI === uri)
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    if (v) {
      u.voice = v
      u.lang = v.lang
    }
    u.rate = 0.85
    u.pitch = 1.1
    speechSynthesis.speak(u)
  } catch {
    // Nothing to do.
  }
}

/** Is a Spanish voice available on this device? */
export function hasSpanishVoice(): boolean {
  return spanishVoice() !== null
}
