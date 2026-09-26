// Pure functions that decide what happens to the player after a lesson.
// "Pure" means: same input, same output, and nothing else changes.
// This makes them easy to test and easy to read.

import type { ExerciseResult, LessonSummary, PlayerState } from '../types'
import { ECONOMY, crownsForScore, levelForXp } from './economy'
import { updateWordStat } from './spacedRepetition'
import { daysBetween, todayKey } from '../utils/date'

/** Work out XP, coins, and tickets for a finished lesson. */
export function scoreLesson(results: ExerciseResult[], firstTime: boolean, timerOn: boolean) {
  const total = results.length
  const correct = results.filter((r) => r.correct).length
  const perfect = total > 0 && correct === total

  // Combo: count correct answers in a row.
  let combo = 0
  let bestCombo = 0
  let comboXp = 0
  let fastXp = 0
  for (const r of results) {
    if (r.correct) {
      combo++
      bestCombo = Math.max(bestCombo, combo)
      if (ECONOMY.xpComboBonus[combo]) comboXp += ECONOMY.xpComboBonus[combo]
      if (timerOn && r.ms < 3000) fastXp += ECONOMY.xpFastBonus
    } else {
      combo = 0
    }
  }

  const xpEarned =
    correct * ECONOMY.xpPerCorrect + (perfect ? ECONOMY.xpPerfectBonus : 0) + comboXp + fastXp

  const coinsEarned =
    correct * ECONOMY.coinsPerCorrect +
    ECONOMY.coinsLessonBonus +
    (perfect ? ECONOMY.coinsPerfectBonus : 0) +
    (firstTime ? ECONOMY.coinsFirstTimeBonus : 0)

  const ticketsEarned = ECONOMY.ticketsPerLesson + (perfect ? ECONOMY.ticketsPerfectBonus : 0)

  const missedWordIds = [...new Set(results.filter((r) => !r.correct).map((r) => r.wordId))]

  return { total, correct, perfect, bestCombo, xpEarned, coinsEarned, ticketsEarned, missedWordIds }
}

/**
 * Update the streak for a play on `today`.
 * Returns the new streak fields and whether the streak grew.
 */
export function advanceStreak(state: PlayerState, today = todayKey()) {
  let { streak, streakFreezes, bestStreak } = state
  let extended = false
  let freezeUsed = false

  if (state.lastPlayDate === today) {
    // Already played today. Nothing changes.
  } else if (state.lastPlayDate === null) {
    streak = 1
    extended = true
  } else {
    const gap = daysBetween(state.lastPlayDate, today)
    if (gap === 1) {
      streak += 1
      extended = true
    } else if (gap === 2 && streakFreezes > 0) {
      // Missed exactly one day but a freeze saves us.
      streakFreezes -= 1
      freezeUsed = true
      streak += 1
      extended = true
    } else if (gap > 1) {
      streak = 1
      extended = true
    }
  }

  // Earn a freeze every 5 streak days, up to the max.
  if (extended && streak > 0 && streak % ECONOMY.streakFreezeEveryDays === 0) {
    streakFreezes = Math.min(ECONOMY.maxStreakFreezes, streakFreezes + 1)
  }

  bestStreak = Math.max(bestStreak, streak)
  const milestoneCoins = extended ? (ECONOMY.streakMilestoneCoins[streak] ?? 0) : 0

  return { streak, streakFreezes, bestStreak, extended, freezeUsed, milestoneCoins, lastPlayDate: today }
}

/**
 * Check the streak when the app opens, without playing.
 * If the kid missed more than a freeze can cover, the streak resets to 0.
 */
export function checkStreakOnOpen(state: PlayerState, today = todayKey()): PlayerState {
  if (!state.lastPlayDate || state.lastPlayDate === today) return state
  const gap = daysBetween(state.lastPlayDate, today)
  if (gap <= 1) return state
  if (gap === 2 && state.streakFreezes > 0) return state // freeze will cover it when they play
  return { ...state, streak: 0 }
}

/** Apply a finished lesson to the player. Returns the new state and a summary. */
export function applyLesson(
  state: PlayerState,
  lessonId: string,
  unitId: string,
  results: ExerciseResult[],
  now = Date.now(),
): { state: PlayerState; summary: LessonSummary } {
  const today = todayKey(new Date(now))
  const firstTime = !state.completedLessonIds.includes(lessonId)
  const score = scoreLesson(results, firstTime, state.settings.timer)
  const streakInfo = advanceStreak(state, today)

  // Update word stats.
  const words = { ...state.words }
  for (const r of results) {
    words[r.wordId] = updateWordStat(words[r.wordId], r.correct, now)
  }

  const levelBefore = levelForXp(state.xp)
  const xp = state.xp + score.xpEarned
  const levelAfter = levelForXp(xp)

  const crowns = crownsForScore(score.correct, score.total)
  const isNewDay = state.lastPlayDate !== today

  const next: PlayerState = {
    ...state,
    xp,
    coins: state.coins + score.coinsEarned + streakInfo.milestoneCoins,
    tickets: Math.min(ECONOMY.maxTickets, state.tickets + score.ticketsEarned),
    streak: streakInfo.streak,
    bestStreak: streakInfo.bestStreak,
    streakFreezes: streakInfo.streakFreezes,
    lastPlayDate: streakInfo.lastPlayDate,
    lessonsToday: isNewDay ? 1 : state.lessonsToday + 1,
    lessonsCompleted: state.lessonsCompleted + 1,
    completedLessonIds: firstTime ? [...state.completedLessonIds, lessonId] : state.completedLessonIds,
    crowns: { ...state.crowns, [lessonId]: Math.max(state.crowns[lessonId] ?? 0, crowns) },
    words,
  }

  const summary: LessonSummary = {
    lessonId,
    unitId,
    total: score.total,
    correct: score.correct,
    perfect: score.perfect,
    bestCombo: score.bestCombo,
    xpEarned: score.xpEarned,
    coinsEarned: score.coinsEarned + streakInfo.milestoneCoins,
    ticketsEarned: score.ticketsEarned,
    missedWordIds: score.missedWordIds,
    streakExtended: streakInfo.extended,
    levelBefore,
    levelAfter,
  }

  return { state: next, summary }
}

/** Can the daily chest be opened right now? */
export function canOpenChest(state: PlayerState, today = todayKey()): boolean {
  return state.lastPlayDate === today && state.lastChestDate !== today
}
