// Background music made from code. A simple, happy loop that can speed up.
// No music files to download. Kids can turn it off in settings.

let ctx: AudioContext | null = null
let playing = false
let timer: number | null = null
let tempo = 1
let masterGain: GainNode | null = null

function getCtx(): AudioContext | null {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

// A cheerful little melody in C major. Numbers are Hz.
const MELODY = [523, 587, 659, 523, 659, 784, 659, 587, 523, 440, 494, 523, 587, 659, 587, 523]
const BASS = [131, 131, 175, 175, 196, 196, 175, 175]

function playNote(ac: AudioContext, freq: number, when: number, dur: number, type: OscillatorType, vol: number) {
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0.0001, when)
  g.gain.exponentialRampToValueAtTime(vol, when + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur)
  osc.connect(g).connect(masterGain ?? ac.destination)
  osc.start(when)
  osc.stop(when + dur + 0.05)
}

let step = 0
function scheduleBar() {
  const ac = getCtx()
  if (!ac || !playing) return
  const beat = 0.22 / tempo
  const now = ac.currentTime + 0.05
  for (let i = 0; i < 8; i++) {
    const m = MELODY[(step * 8 + i) % MELODY.length]
    playNote(ac, m, now + i * beat, beat * 0.9, 'triangle', 0.05)
    if (i % 2 === 0) playNote(ac, BASS[(step * 4 + i / 2) % BASS.length], now + i * beat, beat * 1.8, 'sine', 0.07)
  }
  step = (step + 1) % 4
  timer = window.setTimeout(scheduleBar, beat * 8 * 1000 - 30)
}

/** Start the background loop. Safe to call many times. */
export function startMusic() {
  if (playing) return
  const ac = getCtx()
  if (!ac) return
  if (!masterGain) {
    masterGain = ac.createGain()
    masterGain.gain.value = 0.5
    masterGain.connect(ac.destination)
  }
  playing = true
  scheduleBar()
}

/** Stop the loop. */
export function stopMusic() {
  playing = false
  if (timer) window.clearTimeout(timer)
  timer = null
}

/** 1 = normal. 1.3 = faster (used when a timer is running low). */
export function setMusicTempo(t: number) {
  tempo = Math.max(0.5, Math.min(2, t))
}

export function isMusicPlaying() {
  return playing
}
