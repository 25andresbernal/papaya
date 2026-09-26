// Helpers for finding words, lessons, and units.
// The big lists live in curriculum.ts. This file makes them easy to search.

import type { Lesson, PlayerState, Unit, Word } from '../types'
import { UNITS, WORDS } from './curriculum'

const WORD_BY_ID = new Map(WORDS.map((w) => [w.id, w]))

/** Find a word by id. Returns undefined if it does not exist. */
export function getWord(id: string): Word | undefined {
  return WORD_BY_ID.get(id)
}

/** Find a word by id, or throw if missing. Use when the id must exist. */
export function mustGetWord(id: string): Word {
  const w = WORD_BY_ID.get(id)
  if (!w) throw new Error(`Unknown word id: ${id}`)
  return w
}

export interface LessonLocation {
  unit: Unit
  lesson: Lesson
  /** 0-based position of the unit in UNITS. */
  unitIndex: number
  /** 0-based position of the lesson inside its unit. */
  lessonIndex: number
}

const LESSON_INDEX = new Map<string, LessonLocation>()
UNITS.forEach((unit, unitIndex) => {
  unit.lessons.forEach((lesson, lessonIndex) => {
    LESSON_INDEX.set(lesson.id, { unit, lesson, unitIndex, lessonIndex })
  })
})

/** Find a lesson and its unit by lesson id. */
export function getLesson(id: string): LessonLocation | undefined {
  return LESSON_INDEX.get(id)
}

export function getUnit(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id)
}

/** All lessons in path order. */
export const ALL_LESSONS: LessonLocation[] = [...LESSON_INDEX.values()]

/** Words taught in a lesson (not the review words). */
export function wordsForLesson(lesson: Lesson): Word[] {
  return lesson.wordIds.map(getWord).filter((w): w is Word => !!w)
}

/** Every word in a unit. */
export function wordsForUnit(unit: Unit): Word[] {
  return unit.lessons.flatMap(wordsForLesson)
}

/** Has the kid finished every lesson in this unit? */
export function isUnitComplete(unitId: string, player: PlayerState): boolean {
  const unit = getUnit(unitId)
  if (!unit) return false
  return unit.lessons.every((l) => player.completedLessonIds.includes(l.id))
}

/**
 * Which lesson is unlocked? Lessons unlock in order: you must finish the one before.
 * The very first lesson is always unlocked.
 */
export function isLessonUnlocked(lessonId: string, player: PlayerState): boolean {
  const idx = ALL_LESSONS.findIndex((l) => l.lesson.id === lessonId)
  if (idx <= 0) return idx === 0
  return player.completedLessonIds.includes(ALL_LESSONS[idx - 1].lesson.id)
}

/** The next lesson the kid has not finished yet, or null if all done. */
export function nextLesson(player: PlayerState): LessonLocation | null {
  return ALL_LESSONS.find((l) => !player.completedLessonIds.includes(l.lesson.id)) ?? null
}

/** Words the kid has seen at least once. Mini-games use these. */
export function learnedWords(player: PlayerState): Word[] {
  const seen = WORDS.filter((w) => (player.words[w.id]?.timesSeen ?? 0) > 0)
  if (seen.length >= 8) return seen
  // A brand new kid still needs something to play with: use the first lesson's words.
  const first = ALL_LESSONS[0] ? wordsForLesson(ALL_LESSONS[0].lesson) : []
  const merged = [...seen]
  for (const w of first) if (!merged.some((m) => m.id === w.id)) merged.push(w)
  return merged
}

/** How many words the kid has learned (seen at least once). */
export function learnedCount(player: PlayerState): number {
  return WORDS.filter((w) => (player.words[w.id]?.timesSeen ?? 0) > 0).length
}

export { UNITS, WORDS }
