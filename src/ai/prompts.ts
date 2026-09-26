// Shared between the server (api/mascot.ts) and the browser (src/ai/client.ts):
// the short list of Spanish the AI buddy is allowed to say, the one-line
// description of each "moment" we send to Claude, and the line-cleaning
// rules both sides run before a kid ever sees an AI-written line.
//
// Why one file for both sides: api/ is a separate Vercel function bundle
// from src/, but Vercel bundles relative imports across folders just fine,
// so api/mascot.ts imports this file instead of us keeping two copies of
// the allowlist that could quietly drift apart.

import type { MascotContext, MascotMoment } from './fallbacks'

export type { MascotContext, MascotMoment }

/** Every moment the mascot can react to. Kept here so the server can check
 * that a request's `moment` is a real one before it does any work. */
export const MASCOT_MOMENTS: readonly MascotMoment[] = [
  'welcome',
  'welcomeBack',
  'comeback',
  'lessonStart',
  'correct',
  'wrong',
  'combo',
  'lessonComplete',
  'perfect',
  'streak',
  'levelUp',
  'unlock',
  'noTickets',
  'practice',
]

/**
 * The only Spanish words and short phrases the AI mascot may use in a line,
 * besides its own catchphrase and any word straight from the curriculum
 * (see src/data/words.ts). Lowercase, written the way we compare them: a
 * phrase like "muy bien" is checked one word at a time.
 */
export const SPANISH_ALLOWLIST = [
  'hola',
  'vamos',
  'muy bien',
  'excelente',
  'perfecto',
  'genial',
  'increíble',
  'qué bien',
  'sí',
  'otra vez',
  'lo lograste',
  'buen trabajo',
  'adiós',
  'gracias',
] as const

/** One plain-English sentence telling Claude what is happening right now. */
export function describeMoment(moment: MascotMoment, ctx: MascotContext): string {
  const name = ctx.name?.trim() || 'the kid'
  switch (moment) {
    case 'welcome':
      return `${name} just opened the app for the first time today. Greet them and invite them to play.`
    case 'welcomeBack':
      return `${name} already played once today and came back for more. Cheer them on for playing again.`
    case 'comeback':
      return `${name} has not played in ${ctx.daysAway ?? 'a few'} days. Welcome them back warmly. No guilt, no scolding.`
    case 'lessonStart':
      return `${name} is about to start a lesson${ctx.lessonTitle ? ` about ${ctx.lessonTitle}` : ''}. Hype them up for it.`
    case 'correct':
      return `${name} just answered a question correctly. Celebrate in one short burst.`
    case 'wrong':
      return `${name} missed the word "${ctx.word ?? '?'}" (it means "${ctx.meaning ?? '?'}"). Encourage them gently. Never say the word "wrong".`
    case 'combo':
      return `${name} just got ${ctx.combo ?? 'several'} answers right in a row. Celebrate the streak of correct answers.`
    case 'lessonComplete':
      return `${name} just finished a lesson. Celebrate and mention that they earned a reward.`
    case 'perfect':
      return `${name} got every single question right in the lesson. Give a big celebration.`
    case 'streak':
      return `${name} is on a ${ctx.streak ?? '?'} day streak of playing. Celebrate it.`
    case 'levelUp':
      return `${name}'s hero just reached level ${ctx.level ?? '?'}. Celebrate leveling up.`
    case 'unlock':
      return `${name} just unlocked something new. Celebrate it.`
    case 'noTickets':
      return `${name} wants to play a mini-game but has no tickets left. Gently tell them a lesson earns more tickets.`
    case 'practice':
      return `${name} is starting a practice round on words they are still learning. Encourage them, no pressure.`
  }
}

const BANNED_WORD_PATTERN = /\b(wrong|stupid|dumb|bad job|loser)\b/i

// Letters (with the accents and ñ our curriculum uses), digits, spaces, and a
// small set of everyday punctuation. Nothing else is allowed through.
const ALLOWED_CHARS = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ¡¿.,!?'"\-\s]*$/

/** Removes one matching layer of "quotes" or 'quotes' around a line, if any. */
function stripSurroundingQuotes(value: string): string {
  const trimmed = value.trim()
  if (trimmed.length < 2) return trimmed
  const first = trimmed[0]
  const last = trimmed[trimmed.length - 1]
  const isQuotePair =
    (first === '"' && last === '"') ||
    (first === "'" && last === "'") ||
    (first === '“' && last === '”')
  return isQuotePair ? trimmed.slice(1, -1).trim() : trimmed
}

export interface CleanedMascotLine {
  ok: boolean
  line: string
}

/**
 * Cleans up and checks one candidate mascot line. The server runs this
 * before a line ever leaves the building; the client runs it again in case
 * a server change ever slips. Keep the two in sync by only editing it here.
 */
export function cleanMascotLine(raw: string): CleanedMascotLine {
  const line = stripSurroundingQuotes(raw)
  if (!line || line.length > 140) return { ok: false, line }
  if (line.includes('\n') || line.includes('\r')) return { ok: false, line }
  if (!ALLOWED_CHARS.test(line)) return { ok: false, line }
  if (BANNED_WORD_PATTERN.test(line)) return { ok: false, line }
  return { ok: true, line }
}
