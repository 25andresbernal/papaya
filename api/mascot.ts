// Vercel serverless function: the ONLY place in this whole project that ever
// touches the Claude API key. The browser calls POST /api/mascot with what
// is happening ("the kid just got a combo of 5"); this function asks Claude
// for one short, kid-safe line and hands back just the text. If anything at
// all looks off - no key, a slow network, a line that fails our checks - we
// answer with { line: null } so the app quietly uses a canned line instead.
//
// This file lives in /api (not /src) because that is where Vercel looks for
// serverless functions. It imports the shared allowlist and prompt text from
// src/ai/prompts.ts with a relative path - Vercel bundles files outside
// /api just fine, so we do not keep a second copy of the allowlist here.

import {
  cleanMascotLine,
  describeMoment,
  MASCOT_MOMENTS,
  SPANISH_ALLOWLIST,
  type MascotContext,
  type MascotMoment,
} from '../src/ai/prompts'

// Minimal shapes for what we read off the request and write to the response.
// This is everything a Vercel Node function gives us; writing it out by hand
// means we do not need the @vercel/node package just for types.
interface MinimalRequest {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
}

interface MinimalResponse {
  status(code: number): { json(body: unknown): void; end(): void }
  setHeader(key: string, value: string): void
}

const MODEL_ID = 'claude-haiku-4-5'
const MAX_TOKENS = 60
const UPSTREAM_TIMEOUT_MS = 4000

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 30

// Best-effort, per-server-instance rate limit so one runaway loop cannot burn
// through our Claude budget. It resets whenever Vercel starts a fresh
// instance and is not shared across instances - that is fine, its job is to
// blunt abuse, not to be perfectly exact.
const rateLimitBuckets = new Map<string, { count: number; windowStart: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const bucket = rateLimitBuckets.get(ip)
  if (!bucket || now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(ip, { count: 1, windowStart: now })
    return false
  }
  bucket.count += 1
  return bucket.count > RATE_LIMIT_MAX_REQUESTS
}

function getClientIp(req: MinimalRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  if (Array.isArray(forwarded) && forwarded.length > 0) return forwarded[0]
  return req.socket?.remoteAddress ?? 'unknown'
}

/**
 * We deploy same-origin on Vercel, so the browser never needs CORS headers
 * to call this function. This just refuses a request that clearly came from
 * a different site (a real cross-site Origin header), so someone else's
 * page cannot spend our Claude budget through a kid's browser.
 */
function isTrustedOrigin(req: MinimalRequest): boolean {
  const origin = req.headers.origin
  const host = req.headers.host
  if (typeof origin !== 'string' || typeof host !== 'string') return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function isMascotMoment(value: unknown): value is MascotMoment {
  return typeof value === 'string' && (MASCOT_MOMENTS as readonly string[]).includes(value)
}

function parseBody(req: MinimalRequest): { moment: MascotMoment; ctx: MascotContext } | null {
  let raw: unknown = req.body
  if (typeof raw === 'string') {
    try {
      raw = raw.length > 0 ? JSON.parse(raw) : {}
    } catch {
      return null
    }
  }
  if (!raw || typeof raw !== 'object') return null
  const { moment, ctx } = raw as { moment?: unknown; ctx?: unknown }
  if (!isMascotMoment(moment)) return null
  const context: MascotContext = ctx && typeof ctx === 'object' ? (ctx as MascotContext) : {}
  return { moment, ctx: context }
}

function buildSystemPrompt(ctx: MascotContext): string {
  const buddy = ctx.buddy?.trim() || 'the buddy'
  const allowedSpanish = [...SPANISH_ALLOWLIST, ...(ctx.catchphrase ? [ctx.catchphrase] : [])].join(', ')
  return [
    `You are ${buddy}, a friendly Colombian animal buddy character in a Spanish-learning game for kids ages 5 to 10.`,
    'Reply with exactly ONE line: at most 2 short sentences, at most 100 characters total.',
    'Write so an average 7-year-old can read it. Be warm, playful, and encouraging. Never say the word "wrong".',
    `You may use at most one short Spanish word or exclamation, and only from this list: ${allowedSpanish}. Use no other Spanish.`,
    'Do not use emojis. Do not wrap the line in quotation marks. Output only the line itself, nothing else.',
  ].join(' ')
}

interface ClaudeMessageResponse {
  content?: { type: string; text?: string }[]
}

/** Asks Claude for one line. Returns null on any timeout, network, or API problem. */
async function callClaude(moment: MascotMoment, ctx: MascotContext, apiKey: string): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL_ID,
        max_tokens: MAX_TOKENS,
        temperature: 1,
        system: buildSystemPrompt(ctx),
        messages: [{ role: 'user', content: describeMoment(moment, ctx) }],
      }),
      signal: controller.signal,
    })
    if (!response.ok) return null
    const data = (await response.json()) as ClaudeMessageResponse
    const textBlock = data.content?.find((block) => block.type === 'text')
    return textBlock?.text ?? null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export default async function handler(req: MinimalRequest, res: MinimalResponse): Promise<void> {
  // Never let a CDN or browser cache a mascot line - every moment is fresh.
  res.setHeader('Cache-Control', 'no-store')

  // Same-origin only: we handle OPTIONS (and every other non-POST verb) the
  // same way, since there is no cross-site caller we need a preflight for.
  if (req.method !== 'POST') {
    res.status(405).json({ line: null, reason: 'method-not-allowed' })
    return
  }

  if (!isTrustedOrigin(req)) {
    res.status(403).json({ line: null, reason: 'bad-origin' })
    return
  }

  if (isRateLimited(getClientIp(req))) {
    res.status(429).json({ line: null, reason: 'rate-limited' })
    return
  }

  const parsed = parseBody(req)
  if (!parsed) {
    res.status(400).json({ line: null, reason: 'bad-request' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // No key set up yet. This is not an error - the app is built to work
    // fine without one, using its built-in canned lines.
    res.status(200).json({ line: null, reason: 'no-key' })
    return
  }

  const rawLine = await callClaude(parsed.moment, parsed.ctx, apiKey)
  if (!rawLine) {
    res.status(200).json({ line: null, reason: 'upstream-error' })
    return
  }

  const { ok, line } = cleanMascotLine(rawLine)
  if (!ok) {
    res.status(200).json({ line: null, reason: 'filtered' })
    return
  }

  res.status(200).json({ line })
}
