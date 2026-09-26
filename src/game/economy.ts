// This file is the "rule book" for points, coins, and tickets.
// One place to tune the numbers. Every other file asks this file.
//
// Three currencies, each with a job:
//   XP       = how much you have learned. Levels up your hero. Never spent.
//   Papayas  = coins. Spend them on characters, hats, and unlocking games.
//   Tickets  = turns in the arcade. One lesson = tickets to play games.
// Learning is the only way to earn any of them. That is the whole idea.

export const ECONOMY = {
  /** XP for each correct answer. */
  xpPerCorrect: 10,
  /** Extra XP when you get every answer right. */
  xpPerfectBonus: 20,
  /** Extra XP when a combo (correct answers in a row) hits these numbers. */
  xpComboBonus: { 3: 5, 5: 10, 8: 20 } as Record<number, number>,
  /** XP for answering fast (under 3 seconds). Only when timer is on. */
  xpFastBonus: 5,

  /** Papayas (coins) for each correct answer. */
  coinsPerCorrect: 3,
  /** Extra papayas for a perfect lesson. */
  coinsPerfectBonus: 15,
  /** Papayas for finishing any lesson, even with mistakes. */
  coinsLessonBonus: 10,
  /** Papayas for the very first time you finish a lesson. */
  coinsFirstTimeBonus: 20,

  /** Tickets for finishing a lesson. */
  ticketsPerLesson: 2,
  /** Extra ticket for a perfect lesson. */
  ticketsPerfectBonus: 1,
  /** You can never hoard more than this many tickets. Play them! */
  maxTickets: 10,

  /** Daily chest: opened once a day after the first lesson. */
  dailyChestCoins: { min: 20, max: 50 },
  dailyChestTickets: 1,

  /** Streak rules. */
  streakFreezeEveryDays: 5,
  maxStreakFreezes: 2,
  /** Bonus papayas at these streak milestones. */
  streakMilestoneCoins: { 3: 25, 7: 60, 14: 120, 30: 300 } as Record<number, number>,

  /** Hero levels. Level 1 starts at 0 XP. */
  levelThresholds: [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5200, 6600, 8200, 10000],
  /** After the table runs out, each new level needs this much more XP. */
  xpPerLevelAfterTable: 2000,

  /** Crowns: 3 = perfect, 2 = 80% or better, 1 = finished. */
  crownThresholds: { three: 1.0, two: 0.8 },
} as const

/** Which hero level does this much XP give you? Starts at 1. */
export function levelForXp(xp: number): number {
  const table = ECONOMY.levelThresholds
  let level = 1
  for (let i = 1; i < table.length; i++) {
    if (xp >= table[i]) level = i + 1
    else return level
  }
  // Past the table: keep going in even steps.
  const lastXp = table[table.length - 1]
  const extra = Math.floor((xp - lastXp) / ECONOMY.xpPerLevelAfterTable)
  return table.length + extra
}

/** XP needed to reach a given level. */
export function xpForLevel(level: number): number {
  const table = ECONOMY.levelThresholds
  if (level <= 1) return 0
  if (level <= table.length) return table[level - 1]
  return table[table.length - 1] + (level - table.length) * ECONOMY.xpPerLevelAfterTable
}

/** How far along the kid is inside their current level, as 0 to 1. */
export function levelProgress(xp: number): { level: number; current: number; needed: number; pct: number } {
  const level = levelForXp(xp)
  const start = xpForLevel(level)
  const end = xpForLevel(level + 1)
  const current = xp - start
  const needed = end - start
  return { level, current, needed, pct: Math.min(1, current / needed) }
}

/** How many crowns (0 to 3) for a lesson score. */
export function crownsForScore(correct: number, total: number): number {
  if (total === 0) return 0
  const ratio = correct / total
  if (ratio >= ECONOMY.crownThresholds.three) return 3
  if (ratio >= ECONOMY.crownThresholds.two) return 2
  return 1
}
