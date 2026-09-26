// Talks to our serverless function at /api/mascot, which talks to Claude.
// The browser never holds the API key. This is a placeholder the AI agent will fill in.

import type { MascotContext, MascotMoment } from './fallbacks'

/**
 * Ask the server for a fresh mascot line. Returns null if the server is not set up,
 * is slow, or returns something we should not show a kid.
 */
export async function requestMascotLine(_moment: MascotMoment, _ctx: MascotContext): Promise<string | null> {
  return null
}
