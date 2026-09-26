// The placement game. It quietly checks how much Spanish the kid already
// knows, unit by unit, so they do not have to sit through lessons on words
// they already have. It stops early if the kid misses 3 times, so it never
// feels like a scary test.
//
// How we score it: units are checked in order (u1, u2, u3, ...). A unit
// "passes" only if BOTH of its questions are answered right. The moment a
// unit is missed, we stop counting units (even if we keep playing a little
// longer before the 3-miss stop) so the kid always starts right where their
// real knowledge ends, never with a gap.

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PickExercise as PickExerciseData, Word } from '../types'
import PickExercisePlayer from '../components/exercises/PickExercise'
import ProgressBar from '../components/ProgressBar'
import { UNITS } from '../data/curriculum'
import { wordsForUnit } from '../data/words'
import { sfx, speak } from '../audio/sound'
import { sample, shuffle, uid } from '../utils/random'

const UNITS_TO_TEST = 7 // u1..u7 — u8..u10 are review/harder, no need to test that far.
const QUESTIONS_PER_UNIT = 2
const MAX_MISSES = 3

/** A word is fair game for placement if it is a plain word (not a phrase)
 * and not so short that guessing it is too easy or too random. */
function isTestableWord(word: Word): boolean {
  return !word.phrase && word.es.length > 3
}

function buildQuestion(word: Word, unitWords: Word[]): PickExerciseData {
  const pool = unitWords.filter((w) => w.id !== word.id && w.en.trim().toLowerCase() !== word.en.trim().toLowerCase())
  const distractors = sample(pool, Math.min(3, pool.length))
  const choices = shuffle([word, ...distractors]).map((w) => ({ wordId: w.id, label: w.es }))
  return {
    id: uid('placement'),
    kind: 'pickSpanish',
    targetWordId: word.id,
    prompt: word.en,
    promptEmoji: word.emoji,
    choices,
    correctWordId: word.id,
  }
}

/** Build up to 14 questions: 2 per unit, easy (u1) to hard (u7). */
function buildQuestions(): PickExerciseData[] {
  const questions: PickExerciseData[] = []
  for (let i = 0; i < UNITS_TO_TEST && i < UNITS.length; i++) {
    const unitWords = wordsForUnit(UNITS[i]).filter(isTestableWord)
    const picked = sample(unitWords, Math.min(QUESTIONS_PER_UNIT, unitWords.length))
    for (const word of picked) questions.push(buildQuestion(word, unitWords))
  }
  return questions
}

export default function PlacementScreen({ onDone }: { onDone: (unitCount: number) => void }) {
  // Build the question set once, not on every render.
  const questions = useMemo(() => buildQuestions(), [])
  const total = questions.length

  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  // Per-unit correct counts, so we know when a whole unit (2 of 2) passed.
  const correctInUnit = useRef(0)
  const missesTotal = useRef(0)
  // The highest unit count confirmed "known" so far. Stops growing at the first miss.
  const unitCountRef = useRef(0)
  const stillCounting = useRef(true)

  function finish() {
    onDone(unitCountRef.current)
  }

  function handleAnswer(correct: boolean) {
    if (answered) return
    setAnswered(true)
    const ex = questions[index]
    if (correct) {
      sfx.correct()
      correctInUnit.current += 1
    } else {
      sfx.wrong()
      missesTotal.current += 1
      stillCounting.current = false // A miss ends the streak of "known" units for good.
    }
    // Speak the Spanish word so the kid hears it either way. We read it off
    // the question's own choices (the correct one always matches targetWordId).
    const choice = ex.choices.find((c) => c.wordId === ex.correctWordId)
    if (choice) speak(choice.label)

    const questionInUnit = (index + 1) % QUESTIONS_PER_UNIT
    const unitJustFinished = questionInUnit === 0
    if (unitJustFinished) {
      if (stillCounting.current && correctInUnit.current === QUESTIONS_PER_UNIT) {
        unitCountRef.current += 1
      } else {
        stillCounting.current = false
      }
      correctInUnit.current = 0
    }

    const tooManyMisses = missesTotal.current >= MAX_MISSES
    window.setTimeout(() => {
      if (tooManyMisses || index + 1 >= total) {
        finish()
        return
      }
      setIndex((i) => i + 1)
      setAnswered(false)
    }, 700)
  }

  // Should not happen, but never trap the kid on a broken screen: if there
  // were no questions to ask, just call it done. This runs in an effect,
  // not during render, because reading a ref's value belongs in an effect
  // or an event handler, never while React is figuring out what to draw.
  useEffect(() => {
    if (total === 0) finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  if (total === 0) return null

  const ex = questions[index]

  return (
    <div className="w-full flex flex-col items-center gap-4 flex-1">
      <div className="w-full flex flex-col items-center gap-1">
        <p className="text-sm font-bold text-ink-soft">
          Question {index + 1} of {total}
        </p>
        <ProgressBar value={index + (answered ? 1 : 0)} max={total} color="bg-sky" />
      </div>
      <PickExercisePlayer key={ex.id} ex={ex} onAnswer={handleAnswer} answered={answered} />
    </div>
  )
}
