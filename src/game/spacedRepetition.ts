// Spaced repetition: practice a word a little now, a bit later, then rarely.
// We use "Leitner boxes". A word starts in box 0. Get it right, it moves up a box
// and we wait longer before asking again. Get it wrong, it drops back to box 0.
// This is a simple version of what Duolingo does with its fancy math.

import type { WordStat } from '../types'

/** How many days to wait before a word in each box is due again. */
const BOX_DAYS = [0, 1, 3, 7, 14, 30]
const MAX_BOX = BOX_DAYS.length - 1
const DAY_MS = 86_400_000

export function newWordStat(now = Date.now()): WordStat {
  return { box: 0, timesSeen: 0, timesCorrect: 0, timesWrong: 0, lastSeen: 0, due: now }
}

/** Update a word's stat after the kid answers. Returns a new object. */
export function updateWordStat(stat: WordStat | undefined, correct: boolean, now = Date.now()): WordStat {
  const s = stat ?? newWordStat(now)
  const box = correct ? Math.min(MAX_BOX, s.box + 1) : 0
  return {
    box,
    timesSeen: s.timesSeen + 1,
    timesCorrect: s.timesCorrect + (correct ? 1 : 0),
    timesWrong: s.timesWrong + (correct ? 0 : 1),
    lastSeen: now,
    due: now + BOX_DAYS[box] * DAY_MS,
  }
}

/** 0 to 1: how strong the kid is on this word. Used for the "word garden". */
export function wordStrength(stat: WordStat | undefined, now = Date.now()): number {
  if (!stat || stat.timesSeen === 0) return 0
  const base = stat.box / MAX_BOX
  // Strength fades if the word is overdue.
  const overdueDays = Math.max(0, (now - stat.due) / DAY_MS)
  const fade = Math.max(0.3, 1 - overdueDays * 0.05)
  return Math.max(0, Math.min(1, base * fade))
}

/** Is it time to review this word? */
export function isDue(stat: WordStat | undefined, now = Date.now()): boolean {
  return !stat || stat.due <= now
}

/**
 * Weight for choosing which words to practice.
 * Weak or overdue words get a bigger number so they show up more.
 */
export function practiceWeight(stat: WordStat | undefined, now = Date.now()): number {
  if (!stat || stat.timesSeen === 0) return 3
  const weak = 1 + (MAX_BOX - stat.box)
  const due = isDue(stat, now) ? 2 : 0.5
  const wrongRatio = stat.timesSeen > 0 ? stat.timesWrong / stat.timesSeen : 0
  return weak * due * (1 + wrongRatio * 2)
}
