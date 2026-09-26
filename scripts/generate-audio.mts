// Makes a real recorded voice clip for every word, phrase, and sentence in Papaya.
// Run it ONCE (and again whenever words are added). It skips clips that already exist.
//
//   AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=eastus npx tsx scripts/generate-audio.mts
//
// Why Azure: it is the only service with real Colombian Spanish voices
// (es-CO Gonzalo and Salome), and it has a child voice for English (Ana).
// See docs/research/voices.md for the comparison.
//
// Output: public/audio/es/<id>.mp3, public/audio/en/<id>.mp3, and public/audio/manifest.json.
// The app plays these through src/audio/clips.ts and falls back to the phone voice
// for any line that has no file.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { WORDS } from '../src/data/curriculum'
import { CHARACTERS } from '../src/data/characters'

const KEY = process.env.AZURE_SPEECH_KEY
const REGION = process.env.AZURE_SPEECH_REGION ?? 'eastus'
if (!KEY) {
  console.error('Set AZURE_SPEECH_KEY (and AZURE_SPEECH_REGION). Nothing was generated.')
  process.exit(1)
}

/** Which voice reads each language. Change here to try others. */
const VOICES = {
  // Colombian Spanish. Gonzalo is male; Salome is female. A little higher pitch sounds younger.
  es: { name: process.env.VOICE_ES ?? 'es-CO-GonzaloNeural', lang: 'es-CO', rate: '-15%', pitch: '+8%' },
  // American English. Ana is Azure's child voice. Fallbacks: en-US-JennyNeural, en-US-GuyNeural.
  en: { name: process.env.VOICE_EN ?? 'en-US-AnaNeural', lang: 'en-US', rate: '-8%', pitch: '+0%' },
}

const OUT = join(process.cwd(), 'public', 'audio')
const MANIFEST_PATH = join(OUT, 'manifest.json')

/** Same rule as src/audio/clips.ts so the app finds the file for a line. */
function normalizeLine(text: string): string {
  return text.replace(/___/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

/** A safe file name from an id or a line of text. */
function slug(text: string): string {
  return normalizeLine(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

/** Blanks like "yo quiero ___" are read as "yo quiero". Clean up leftover punctuation. */
function readable(text: string): string {
  return text.replace(/___/g, '').replace(/\s+/g, ' ').replace(/\s([?!.,])/g, '$1').trim()
}

interface Line {
  lang: 'es' | 'en'
  id: string
  text: string
}

/** Everything the app can say: every word in both languages, plus buddy catchphrases. */
function collectLines(): Line[] {
  const lines: Line[] = []
  const seen = new Set<string>()
  const add = (lang: 'es' | 'en', id: string, text: string) => {
    const key = `${lang}:${normalizeLine(text)}`
    if (seen.has(key) || !normalizeLine(text)) return
    seen.add(key)
    lines.push({ lang, id, text })
  }
  for (const w of WORDS) {
    add('es', w.id, w.es)
    add('en', w.id, w.en)
    if (w.example) add('es', `${w.id}-example`, w.example)
    if (w.exampleEn) add('en', `${w.id}-example`, w.exampleEn)
  }
  for (const c of CHARACTERS) add('es', `buddy-${c.id}`, c.catchphrase)
  // Story books are added here once src/data/stories.ts exists.
  try {
    const stories = require('../src/data/stories') as { STORIES?: { id: string; pages: { es: string; en: string }[] }[] }
    for (const s of stories.STORIES ?? []) {
      s.pages.forEach((p, i) => {
        add('es', `${s.id}-p${i + 1}`, p.es)
        add('en', `${s.id}-p${i + 1}`, p.en)
      })
    }
  } catch {
    // No stories yet. That is fine.
  }
  return lines
}

function ssml(line: Line): string {
  const v = VOICES[line.lang]
  const text = readable(line.text).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${v.lang}">
  <voice name="${v.name}"><prosody rate="${v.rate}" pitch="${v.pitch}">${text}</prosody></voice>
</speak>`
}

async function synthesize(line: Line): Promise<Buffer> {
  const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': KEY!,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'papaya-audio-generator',
    },
    body: ssml(line),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  const lines = collectLines()
  console.log(`Lines to voice: ${lines.length}`)
  mkdirSync(join(OUT, 'es'), { recursive: true })
  mkdirSync(join(OUT, 'en'), { recursive: true })

  let manifest: { es: Record<string, string>; en: Record<string, string>; voices: Record<string, string> } = {
    es: {},
    en: {},
    voices: {},
  }
  if (existsSync(MANIFEST_PATH)) {
    try {
      manifest = { es: {}, en: {}, voices: {}, ...JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) }
    } catch {
      // Start fresh if the old manifest is broken.
    }
  }
  manifest.voices = { es: VOICES.es.name, en: VOICES.en.name }

  let made = 0
  let skipped = 0
  let failed = 0
  for (const line of lines) {
    const file = `${slug(line.id)}.mp3`
    const path = join(OUT, line.lang, file)
    const key = normalizeLine(line.text)
    if (existsSync(path)) {
      manifest[line.lang][key] = file
      skipped++
      continue
    }
    try {
      const audio = await synthesize(line)
      writeFileSync(path, audio)
      manifest[line.lang][key] = file
      made++
      process.stdout.write(`\r${made} made, ${skipped} skipped, ${failed} failed   `)
      // Be polite to the API.
      await new Promise((r) => setTimeout(r, 120))
    } catch (err) {
      failed++
      console.error(`\nFailed: [${line.lang}] ${line.text}: ${(err as Error).message}`)
    }
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 1))
  console.log(`\nDone. ${made} made, ${skipped} already there, ${failed} failed. Manifest has ${Object.keys(manifest.es).length} Spanish and ${Object.keys(manifest.en).length} English clips.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
