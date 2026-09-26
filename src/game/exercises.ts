// This file turns a Lesson (a list of word ids) into real Exercises the kid
// can play: tap the Spanish word, tap the English word, listen and tap,
// match the pairs, put the words in order, or true-or-false.
//
// The big idea: every word in the lesson must show up at least once, words
// the kid is weak on show up more than once, and the exercise kinds are
// mixed up so the lesson does not feel repetitive.

import type {
  Choice,
  Exercise,
  Lesson,
  MatchPairsExercise,
  OrderWordsExercise,
  PickExercise,
  PlayerState,
  TrueFalseExercise,
  Word,
} from '../types'
import { ALL_LESSONS, WORDS, getLesson, getWord, learnedWords, wordsForLesson, wordsForUnit } from '../data/words'
import { practiceWeight } from './spacedRepetition'
import { pick, randInt, sample, shuffle, uid } from '../utils/random'

/** The three "pick a choice" exercise kinds. The others (matchPairs,
 * orderWords, trueFalse) are one-per-lesson special exercises. */
type PickKind = 'pickSpanish' | 'pickEnglish' | 'listenTap'

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Build a full lesson's worth of exercises (8 to 10, 9 by default) out of
 * a lesson's wordIds, mixing in a couple of review words if the lesson has
 * any.
 */
export function buildLessonExercises(
  lesson: Lesson,
  player: PlayerState,
  opts?: { count?: number },
): Exercise[] {
  const targetWords = wordsForLesson(lesson)
  const location = getLesson(lesson.id)
  const unitPool = location ? wordsForUnit(location.unit) : targetWords

  const reviewWordsAll = (lesson.reviewWordIds ?? [])
    .map(getWord)
    .filter((w): w is Word => !!w)
    .filter((w) => !targetWords.some((t) => t.id === w.id))
  const reviewWords = sample(reviewWordsAll, Math.min(2, reviewWordsAll.length))

  return buildExercises({
    targetWords,
    reviewWords,
    lessonPool: unitPool.length > 0 ? unitPool : targetWords,
    allPool: WORDS,
    count: clampCount(opts?.count),
    player,
  })
}

/**
 * Build a Practice lesson: 8 words the kid has already met, picked more
 * often when they are weak or overdue for review (see spacedRepetition.ts).
 * `learnedWords` already falls back to the first lesson's words when the
 * kid has seen fewer than 8 words, so a brand new kid still gets something
 * to practice.
 */
export function buildPracticeExercises(player: PlayerState, opts?: { count?: number }): Exercise[] {
  const seen = learnedWords(player)
  const targetWords = weightedSampleUnique(seen, Math.min(8, seen.length), player)

  return buildExercises({
    targetWords,
    reviewWords: [],
    lessonPool: seen,
    allPool: WORDS,
    count: clampCount(opts?.count ?? 8),
    player,
  })
}

/**
 * A missed exercise comes back at the end of the lesson so the kid gets
 * another shot. We rebuild it as the easiest kind (pickSpanish, picture +
 * English + four Spanish choices) with fresh, freshly-shuffled distractors.
 */
export function makeRetryExercise(missed: Exercise, player: PlayerState): Exercise {
  // player is not needed for the simple retry we build today, but the
  // parameter stays so LessonScreen's call site does not have to change
  // if we make retries smarter later.
  void player
  return rebuildAsPickSpanish(missed)
}

/** Same idea as makeRetryExercise, shaped for appending straight onto a list. */
export function requeueMissed(exercises: Exercise[], missed: Exercise): Exercise[] {
  return [...exercises, rebuildAsPickSpanish(missed)]
}

/** Did the kid tap the right choice? */
export function isCorrectPick(ex: PickExercise, chosenWordId: string): boolean {
  return chosenWordId === ex.correctWordId
}

/** Did the kid put the tiles in the right order? */
export function isCorrectOrder(ex: OrderWordsExercise, tiles: string[]): boolean {
  if (tiles.length !== ex.correctOrder.length) return false
  return tiles.every((tile, i) => tile === ex.correctOrder[i])
}

/** Did the kid pick the right true/false answer? */
export function isCorrectTrueFalse(ex: TrueFalseExercise, answer: boolean): boolean {
  return answer === ex.isTrue
}

/** One short line telling the kid what to do with this exercise. */
export function describeExercise(ex: Exercise): string {
  switch (ex.kind) {
    case 'pickSpanish':
      return 'Tap the Spanish word'
    case 'pickEnglish':
      return 'Tap what it means'
    case 'listenTap':
      return 'Tap what you hear'
    case 'matchPairs':
      return 'Match the pairs'
    case 'orderWords':
      return 'Put the words in order'
    case 'trueFalse':
      return 'True or false?'
  }
}

/* ------------------------------------------------------------------ */
/* The shared engine                                                   */
/* ------------------------------------------------------------------ */

interface BuildInput {
  /** Words that must each appear at least once. */
  targetWords: Word[]
  /** Extra words that may appear once or twice, on top of targetWords. */
  reviewWords: Word[]
  /** Best pool for distractors and for the matchPairs/trueFalse extras. */
  lessonPool: Word[]
  /** Every word in the game, used when lessonPool runs out of options. */
  allPool: Word[]
  count: number
  player: PlayerState
}

function buildExercises(input: BuildInput): Exercise[] {
  const { targetWords, reviewWords, lessonPool, allPool, count, player } = input
  if (targetWords.length === 0) return []

  // orderWords only makes sense for a short phrase, and only if we can
  // still fit it (plus matchPairs and trueFalse) without the lesson
  // ballooning way past its normal size.
  const orderCandidate = findOrderWordsCandidate([...targetWords, ...reviewWords])
  const useOrderWords = !!orderCandidate && targetWords.length + 3 <= 10
  const specialCount = useOrderWords ? 3 : 2 // matchPairs + trueFalse (+ orderWords)

  const pickSlots = Math.max(targetWords.length, count - specialCount)
  const queue = buildWordQueue(targetWords, reviewWords, pickSlots, player)
  const kinds = assignPickKinds(queue, player)
  const picks = queue.map((word, i) => buildPickExercise(word, kinds[i], lessonPool, allPool))

  const matchPairsEx = buildMatchPairs(targetWords)
  const trueFalseEx = buildTrueFalse(targetWords, lessonPool)
  const orderWordsEx = useOrderWords && orderCandidate ? buildOrderWords(orderCandidate, allPool) : undefined

  return assembleLesson(picks, matchPairsEx, trueFalseEx, orderWordsEx)
}

/** Decide which words get an exercise, and in what order. */
function buildWordQueue(targetWords: Word[], reviewWords: Word[], pickSlots: number, player: PlayerState): Word[] {
  const queue = [...targetWords]
  let extra = pickSlots - queue.length

  // Mix in a review word or two if there is room.
  const reviewToAdd = reviewWords.slice(0, Math.max(0, Math.min(2, extra)))
  queue.push(...reviewToAdd)
  extra -= reviewToAdd.length

  // Any slots left over go to words the kid is weak on, so they get more
  // practice than words they already know well.
  for (let i = 0; i < extra; i++) {
    queue.push(weightedPick(targetWords, player))
  }
  return queue
}

/**
 * Decide pickSpanish vs pickEnglish vs listenTap for every word in the
 * queue: about half pickSpanish, a quarter each pickEnglish and listenTap,
 * a brand new word's first turn is always pickSpanish, the lesson never
 * opens on listenTap, and we try not to repeat the same kind twice in a row.
 */
function assignPickKinds(queue: Word[], player: PlayerState): PickKind[] {
  const kinds: PickKind[] = []
  const counts: Record<PickKind, number> = { pickSpanish: 0, pickEnglish: 0, listenTap: 0 }
  const target: Record<PickKind, number> = { pickSpanish: 0.5, pickEnglish: 0.25, listenTap: 0.25 }
  const seenBefore = new Set<string>()

  queue.forEach((word, i) => {
    const stat = player.words[word.id]
    const brandNew = !stat || stat.timesSeen === 0
    const firstTimeInThisQueue = !seenBefore.has(word.id)
    seenBefore.add(word.id)

    if (brandNew && firstTimeInThisQueue) {
      // The kid has never seen this word: show picture + English + Spanish
      // choices so they can actually learn it, not just guess.
      kinds.push('pickSpanish')
      counts.pickSpanish++
      return
    }

    let options: PickKind[] = ['pickSpanish', 'pickEnglish', 'listenTap']
    if (i === 0) options = options.filter((k) => k !== 'listenTap')
    const prev = kinds[i - 1]
    if (prev) {
      const withoutPrev = options.filter((k) => k !== prev)
      if (withoutPrev.length > 0) options = withoutPrev
    }

    // Pick whichever allowed kind is furthest below its target share so far.
    const seenSoFar = i + 1
    let best = options[0]
    let bestGap = -Infinity
    for (const k of options) {
      const gap = target[k] - counts[k] / seenSoFar
      if (gap > bestGap) {
        bestGap = gap
        best = k
      }
    }
    kinds.push(best)
    counts[best]++
  })

  return kinds
}

function buildPickExercise(word: Word, kind: PickKind, lessonPool: Word[], allPool: Word[]): PickExercise {
  const distractors = pickDistractors(word, lessonPool, allPool)
  const choiceWords = shuffle([word, ...distractors])
  const choices = choiceWords.map((w) => makeChoice(w, kind))

  return {
    id: uid('ex'),
    kind,
    targetWordId: word.id,
    prompt: kind === 'pickSpanish' ? word.en : kind === 'pickEnglish' ? word.es : '',
    promptEmoji: kind === 'pickSpanish' ? word.emoji : undefined,
    choices,
    correctWordId: word.id,
  }
}

function makeChoice(word: Word, kind: PickKind): Choice {
  if (kind === 'pickSpanish') return { wordId: word.id, label: word.es }
  return { wordId: word.id, label: word.en, emoji: word.emoji }
}

/**
 * Three wrong choices for a pick exercise. We like distractors from the
 * same lesson or unit best (similar topic = a better learning challenge),
 * then fill in from every word in the game if we still need more. We never
 * repeat the right answer and never pick a word that means the same thing
 * in English (that would make two "right" answers).
 */
function pickDistractors(correct: Word, lessonPool: Word[], allPool: Word[]): Word[] {
  const usedIds = new Set<string>([correct.id])
  const usedEnglish = new Set<string>([correct.en.trim().toLowerCase()])
  const result: Word[] = []

  const tryFrom = (candidates: Word[]) => {
    for (const w of shuffle(candidates)) {
      if (result.length >= 3) return
      if (usedIds.has(w.id) || usedEnglish.has(w.en.trim().toLowerCase())) continue
      result.push(w)
      usedIds.add(w.id)
      usedEnglish.add(w.en.trim().toLowerCase())
    }
  }

  tryFrom(lessonPool)
  if (result.length < 3) tryFrom(allPool)
  return result
}

/** 4 pairs (or fewer if the lesson does not have 4 words). */
function buildMatchPairs(words: Word[]): MatchPairsExercise {
  const chosen = sample(words, Math.min(4, words.length))
  return {
    id: uid('ex'),
    kind: 'matchPairs',
    targetWordId: chosen[0]?.id ?? words[0].id,
    pairs: chosen.map((w) => ({ wordId: w.id, es: w.es, en: w.en, emoji: w.emoji })),
  }
}

/**
 * A coin-flip true/false question. When it is "false", we pair the Spanish
 * word with a different word's English meaning from the same pool, so the
 * wrong answer is still believable and not a total guess.
 */
function buildTrueFalse(words: Word[], widerPool: Word[]): TrueFalseExercise {
  const word = pick(words)
  const others = widerPool.filter((w) => w.id !== word.id && w.en.trim().toLowerCase() !== word.en.trim().toLowerCase())
  const wantsFalse = Math.random() < 0.5 && others.length > 0
  const decoy = wantsFalse ? pick(others) : undefined

  return {
    id: uid('ex'),
    kind: 'trueFalse',
    targetWordId: word.id,
    es: word.es,
    en: decoy ? decoy.en : word.en,
    emoji: word.emoji,
    isTrue: !decoy,
  }
}

/** Find a short phrase (2 to 4 words, no fill-in-the-blank "___") to order. */
function findOrderWordsCandidate(words: Word[]): Word | undefined {
  return words.find((w) => {
    if (!w.phrase || w.es.includes('___')) return false
    const tileCount = splitPhrase(w.es).length
    return tileCount >= 2 && tileCount <= 4
  })
}

function buildOrderWords(word: Word, allWords: Word[]): OrderWordsExercise {
  const correctOrder = splitPhrase(word.es)

  const otherTiles = allWords
    .filter((w) => w.phrase && w.id !== word.id && !w.es.includes('___'))
    .flatMap((w) => splitPhrase(w.es))
  const distractorPool = uniqueTilesExcluding(otherTiles, correctOrder)
  const distractorCount = Math.min(distractorPool.length, randInt(1, 2))
  const distractors = sample(distractorPool, distractorCount)

  return {
    id: uid('ex'),
    kind: 'orderWords',
    targetWordId: word.id,
    prompt: word.en,
    correctOrder,
    tiles: shuffle([...correctOrder, ...distractors]),
  }
}

/** Strip ¿ ? ¡ ! (but keep accents) and split a Spanish phrase into words. */
function splitPhrase(es: string): string[] {
  return es
    .replace(/[¿?¡!]/g, '')
    .split(' ')
    .map((w) => w.trim())
    .filter(Boolean)
}

function uniqueTilesExcluding(tiles: string[], exclude: string[]): string[] {
  const seen = new Set(exclude)
  const result: string[] = []
  for (const tile of tiles) {
    if (seen.has(tile)) continue
    seen.add(tile)
    result.push(tile)
  }
  return result
}

/**
 * Put the special exercises (matchPairs, trueFalse, orderWords) into the
 * middle of the lesson rather than the very start, then do a light pass to
 * un-stick any two exercises of the same kind that ended up back to back.
 */
function assembleLesson(
  picks: Exercise[],
  matchPairsEx: MatchPairsExercise,
  trueFalseEx: TrueFalseExercise,
  orderWordsEx: OrderWordsExercise | undefined,
): Exercise[] {
  const result: Exercise[] = [...picks]

  const midA = Math.min(result.length, Math.max(1, Math.floor(result.length / 3)))
  result.splice(midA, 0, matchPairsEx)

  const midB = Math.min(result.length, Math.max(midA + 1, Math.floor((result.length * 2) / 3)))
  result.splice(midB, 0, trueFalseEx)

  if (orderWordsEx) {
    // Ordering words is the trickiest kind, so it goes near the end, but
    // not last: the lesson should finish on a normal, winnable note.
    const nearEnd = Math.max(1, result.length - 1)
    result.splice(nearEnd, 0, orderWordsEx)
  }

  return dedupeAdjacentKinds(result)
}

/** Best-effort swap so the same exercise kind does not appear twice in a row. */
function dedupeAdjacentKinds(list: Exercise[]): Exercise[] {
  const arr = [...list]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].kind !== arr[i - 1].kind) continue
    for (let j = i + 1; j < arr.length; j++) {
      const wouldClashAfter = arr[j + 1] && arr[j + 1].kind === arr[i - 1].kind
      if (arr[j].kind !== arr[i - 1].kind && !wouldClashAfter) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        break
      }
    }
  }
  return arr
}

/* ------------------------------------------------------------------ */
/* Small shared helpers                                                */
/* ------------------------------------------------------------------ */

function clampCount(count: number | undefined): number {
  return Math.max(8, Math.min(10, count ?? 9))
}

/** One weighted random word: weak or overdue words come up more often. */
function weightedPick(words: Word[], player: PlayerState): Word {
  const now = Date.now()
  const weights = words.map((w) => practiceWeight(player.words[w.id], now))
  return words[weightedIndex(weights)]
}

/** Pick n different words, each draw weighted by how much practice it needs. */
function weightedSampleUnique(words: Word[], n: number, player: PlayerState): Word[] {
  const now = Date.now()
  const pool = [...words]
  const result: Word[] = []
  while (result.length < n && pool.length > 0) {
    const weights = pool.map((w) => practiceWeight(player.words[w.id], now))
    const i = weightedIndex(weights)
    result.push(pool[i])
    pool.splice(i, 1)
  }
  return result
}

function weightedIndex(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return Math.floor(Math.random() * weights.length)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
}

/** Find which unit a word lives in, so retries can pick similar distractors. */
function poolForWord(word: Word): Word[] {
  const location = ALL_LESSONS.find((l) => l.lesson.wordIds.includes(word.id))
  return location ? wordsForUnit(location.unit) : WORDS
}

function rebuildAsPickSpanish(missed: Exercise): Exercise {
  const word = getWord(missed.targetWordId)
  if (!word) return missed // Should not happen, but never crash the lesson over it.
  return buildPickExercise(word, 'pickSpanish', poolForWord(word), WORDS)
}
