// Talks to our serverless function at /api/mascot, which talks to Claude.
// The browser never holds the API key - see api/mascot.ts.
//
// This file also does its own safety check on whatever comes back, even
// though the server already checked it. Defense in depth: if the server
// ever changes and forgets a rule, a kid still never sees a bad line.

import type { MascotContext, MascotMoment } from './fallbacks'
import { SPANISH_ALLOWLIST, cleanMascotLine } from './prompts'
import { WORDS } from '../data/words'

const REQUEST_TIMEOUT_MS = 3500
// How long we remember "the server had nothing for us" before asking again.
// Keeps a page with no API key configured from hammering /api/mascot.
const NEGATIVE_CACHE_MS = 10 * 60 * 1000

// Only lives as long as this page load - that is enough to stop repeat asks
// for the same moment in one sitting. Nothing here needs to survive a reload.
const negativeCache = new Map<string, number>()

let aiAvailablePromise: Promise<boolean> | null = null

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

// A short, deterministic (not cryptographic) hash, just so our localStorage
// keys stay small instead of embedding the whole context object.
function hashParts(parts: (string | number | undefined)[]): string {
  const joined = parts.map((part) => String(part ?? '')).join('|')
  let hash = 0
  for (let i = 0; i < joined.length; i++) {
    hash = (hash * 31 + joined.charCodeAt(i)) | 0
  }
  return Math.abs(hash).toString(36)
}

function cacheKey(moment: MascotMoment, ctx: MascotContext): string {
  const hash = hashParts([ctx.name, ctx.streak, ctx.level])
  return `papaya.ai.${todayKey()}.${moment}.${hash}`
}

function readCachedLine(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeCachedLine(key: string, line: string): void {
  try {
    localStorage.setItem(key, line)
  } catch {
    // Private browsing or a full storage quota. No harm done - we just ask
    // the server again next time instead of caching.
  }
}

function stripTokenPunctuation(token: string): string {
  return token.replace(/^[¡¿"'.,!?-]+|[¡¿"'.,!?-]+$/g, '')
}

function tokensOf(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(stripTokenPunctuation)
    .filter(Boolean)
}

// Every Spanish word Claude is allowed to say: our small allowlist, plus
// every word and phrase we actually teach. Built once at module load.
const ALLOWED_SPANISH_TOKENS: Set<string> = (() => {
  const tokens = new Set<string>()
  for (const phrase of SPANISH_ALLOWLIST) for (const token of tokensOf(phrase)) tokens.add(token)
  for (const word of WORDS) for (const token of tokensOf(word.es)) tokens.add(token)
  return tokens
})()

const ACCENTED_LETTER = /[áéíóúñü]/i

/**
 * True if the line contains a Spanish-looking word (has an accent or ñ) that
 * is not in our allowlist and not a word we actually teach. A plain English
 * word never trips this, even if it happens to be spelled unusually.
 */
function hasUnknownSpanish(line: string, catchphrase?: string): boolean {
  const extra = catchphrase ? new Set(tokensOf(catchphrase)) : null
  for (const token of tokensOf(line)) {
    if (!ACCENTED_LETTER.test(token)) continue
    if (ALLOWED_SPANISH_TOKENS.has(token)) continue
    if (extra?.has(token)) continue
    return true
  }
  return false
}

interface MascotApiResponse {
  line?: string | null
}

/** One POST to /api/mascot, with a short timeout and our own line check. Never throws. */
async function callMascotApi(moment: MascotMoment, ctx: MascotContext): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch('/api/mascot', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ moment, ctx }),
      signal: controller.signal,
    })
    if (!response.ok) return null
    const data = (await response.json()) as MascotApiResponse
    if (!data.line) return null
    const { ok, line } = cleanMascotLine(data.line)
    return ok ? line : null
  } catch (err) {
    // In local `npm run dev` there is no /api route (that only exists once
    // deployed to Vercel, or under `vercel dev`), so this is expected there.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- one quiet debug line, not noise
      console.debug('[ai] no mascot line this time (expected without `vercel dev`):', err)
    }
    return null
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Ask the server for a fresh mascot line. Returns null if the server is not
 * set up, is slow, or returns something we should not show a kid.
 */
export async function requestMascotLine(moment: MascotMoment, ctx: MascotContext): Promise<string | null> {
  const key = cacheKey(moment, ctx)

  const cached = readCachedLine(key)
  if (cached) return cached

  const negativeUntil = negativeCache.get(key)
  if (negativeUntil && negativeUntil > Date.now()) return null

  const line = await callMascotApi(moment, ctx)
  if (line && !hasUnknownSpanish(line, ctx.catchphrase)) {
    writeCachedLine(key, line)
    return line
  }

  negativeCache.set(key, Date.now() + NEGATIVE_CACHE_MS)
  return null
}

/**
 * Is the AI mascot actually reachable? Probes the server once per page load
 * and remembers the answer, so Settings can show "AI: on" or "AI: off"
 * without spamming the server every time that screen opens.
 */
export function isAiAvailable(): Promise<boolean> {
  if (!aiAvailablePromise) {
    aiAvailablePromise = callMascotApi('welcome', { name: 'friend' }).then((line) => line !== null)
  }
  return aiAvailablePromise
}
