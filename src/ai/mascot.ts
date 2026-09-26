// What the buddy says. Fast path: a canned line right away.
// Slow path: ask Claude (through our serverless function) for a fresher line.
// If the internet is slow or off, the canned line is what the kid sees. That is fine.
//
// This file is the contract. The API call itself lives in client.ts.

import { fallbackLine } from './fallbacks'
import type { MascotContext, MascotMoment } from './fallbacks'
import { requestMascotLine } from './client'

export type { MascotContext, MascotMoment }

/** Instant. Use this inside lessons where feedback must be under 200ms. */
export function mascotLine(moment: MascotMoment, ctx: MascotContext = {}): string {
  return fallbackLine(moment, ctx)
}

/**
 * Async. Tries the AI, falls back to canned text.
 * Resolves in under ~3 seconds no matter what.
 */
export async function mascotLineAsync(moment: MascotMoment, ctx: MascotContext = {}): Promise<string> {
  const fallback = fallbackLine(moment, ctx)
  try {
    const line = await requestMascotLine(moment, ctx)
    return line ?? fallback
  } catch {
    return fallback
  }
}
