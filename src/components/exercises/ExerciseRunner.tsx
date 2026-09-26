// The engine that runs a list of exercises one at a time.
// Both LessonScreen and PracticeScreen hand it a list and get results back.
//
// How it works:
//   1. Look at the exercise at the front of the queue.
//   2. Show it with the right component (PickExercise, MatchPairsExercise, ...).
//   3. When the kid answers, record it, play a sound, and wait for "Continue".
//   4. On "Continue", drop that exercise off the front. If it was missed and
//      hasn't been retried too many times, a fresh copy goes on the back.
//   5. When the queue is empty, hand all the results back to the caller.

import { useEffect, useRef, useState } from 'react'
import type { Exercise, ExerciseResult, PlayerState } from '../../types'
import { describeExercise, makeRetryExercise } from '../../game/exercises'
import { getWord } from '../../data/words'
import { sfx, speak } from '../../audio/sound'
import { setMusicTempo } from '../../audio/music'
import { mascotLine } from '../../ai/mascot'
import Mascot from '../Mascot'
import Button from '../Button'
import ProgressBar from '../ProgressBar'
import PickExercise from './PickExercise'
import MatchPairsExercise from './MatchPairsExercise'
import OrderWordsExercise from './OrderWordsExercise'
import TrueFalseExercise from './TrueFalseExercise'

// A missed word can come back at most this many times before we let it go.
const MAX_RETRIES_PER_WORD = 2
// How many seconds the kid gets per question when the timer setting is on.
const TIMER_SECONDS = 10

export interface ExerciseRunnerProps {
  exercises: Exercise[]
  player: PlayerState
  onFinish: (results: ExerciseResult[]) => void
  onQuit: () => void
  /** Optional: lets the screen show live "done / total" in its own top bar. */
  onProgress?: (done: number, total: number) => void
  /** Optional: lets the screen show a live combo badge in its own top bar. */
  onCombo?: (combo: number) => void
}

export default function ExerciseRunner({ exercises, player, onFinish, onQuit, onProgress, onCombo }: ExerciseRunnerProps) {
  // The queue starts as whatever the caller built. We only read `exercises` once:
  // the caller is expected to build it with useState/useMemo so it doesn't change identity.
  const [queue, setQueue] = useState<Exercise[]>(() => exercises)
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [combo, setCombo] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [flashKind, setFlashKind] = useState<'correct' | 'wrong' | null>(null)
  const [comboPopup, setComboPopup] = useState<string | null>(null)
  const [wrongInfo, setWrongInfo] = useState<{ word: string; meaning: string } | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)

  const shownAtRef = useRef(Date.now())
  const retryCountsRef = useRef<Record<string, number>>({})
  const pendingRetryRef = useRef<Exercise | null>(null)
  const finishedRef = useRef(false)

  const current = queue[0] ?? null
  const timerOn = player.settings.timer

  // Tell the queue to the caller once. This also naturally handles a queue
  // that started empty (nothing to practice yet): it finishes right away.
  useEffect(() => {
    if (queue.length === 0 && !finishedRef.current) {
      finishedRef.current = true
      onFinish(results)
    }
    // We only want this to react to the queue emptying, not every result change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue])

  useEffect(() => {
    onProgress?.(results.length, results.length + queue.length)
  }, [results.length, queue.length, onProgress])

  useEffect(() => {
    onCombo?.(combo)
  }, [combo, onCombo])

  // Let the kid quit with Escape too (handy on a keyboard, harmless on a phone).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onQuit()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onQuit])

  // Fresh start whenever a new exercise reaches the front of the queue.
  useEffect(() => {
    shownAtRef.current = Date.now()
    setAnswered(false)
    setWrongInfo(null)
    setTimeLeft(TIMER_SECONDS)
  }, [current?.id])

  // The shrinking timer bar (only when the settings toggle is on).
  useEffect(() => {
    if (!timerOn || !current || answered) {
      setMusicTempo(1)
      return
    }
    const start = Date.now()
    const iv = window.setInterval(() => {
      const elapsed = (Date.now() - start) / 1000
      const left = Math.max(0, TIMER_SECONDS - elapsed)
      setTimeLeft(left)
      setMusicTempo(1 + (elapsed / TIMER_SECONDS) * 0.5)
      if (left <= 0) {
        window.clearInterval(iv)
        handleAnswer(false)
      }
    }, 100)
    return () => window.clearInterval(iv)
    // handleAnswer closes over `current`/`answered` from this same render, which is
    // exactly what we want: this effect is rebuilt whenever those change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, timerOn, answered])

  // Reset the music back to normal speed when the whole runner goes away.
  useEffect(() => () => setMusicTempo(1), [])

  function handleAnswer(correct: boolean) {
    if (!current || answered) return
    const ms = Date.now() - shownAtRef.current
    const word = getWord(current.targetWordId)

    setResults((r) => [...r, { exerciseId: current.id, wordId: current.targetWordId, correct, ms }])
    setAnswered(true)
    setLastCorrect(correct)

    if (correct) {
      sfx.correct()
      setFlashKind('correct')
      window.setTimeout(() => setFlashKind(null), 500)
      if (word) speak(word.es)
      setCombo((c) => {
        const next = c + 1
        if (next === 3 || next === 5 || next === 8) {
          sfx.combo(next)
          setComboPopup(mascotLine('combo', { combo: next }))
          window.setTimeout(() => setComboPopup(null), 1800)
        }
        return next
      })
    } else {
      sfx.wrong()
      setFlashKind('wrong')
      window.setTimeout(() => setFlashKind(null), 500)
      setCombo(0)
      if (word) setWrongInfo({ word: word.es, meaning: word.en })

      const count = retryCountsRef.current[current.targetWordId] ?? 0
      if (count < MAX_RETRIES_PER_WORD) {
        retryCountsRef.current[current.targetWordId] = count + 1
        pendingRetryRef.current = makeRetryExercise(current, player)
      }
    }
  }

  function handleContinue() {
    sfx.tap()
    const retry = pendingRetryRef.current
    pendingRetryRef.current = null
    setQueue((q) => {
      const rest = q.slice(1)
      return retry ? [...rest, retry] : rest
    })
  }

  function renderExercise(ex: Exercise) {
    switch (ex.kind) {
      case 'pickSpanish':
      case 'pickEnglish':
      case 'listenTap':
        return <PickExercise key={ex.id} ex={ex} onAnswer={handleAnswer} answered={answered} />
      case 'matchPairs':
        return <MatchPairsExercise key={ex.id} ex={ex} onAnswer={handleAnswer} answered={answered} />
      case 'orderWords':
        return <OrderWordsExercise key={ex.id} ex={ex} onAnswer={handleAnswer} answered={answered} />
      case 'trueFalse':
        return <TrueFalseExercise key={ex.id} ex={ex} onAnswer={handleAnswer} answered={answered} />
      default:
        return null
    }
  }

  if (!current) return null

  return (
    <div className="flex-1 flex flex-col relative">
      <span className="sr-only">{describeExercise(current)}</span>

      {timerOn && !answered && (
        <ProgressBar
          value={timeLeft}
          max={TIMER_SECONDS}
          color={timeLeft < 3 ? 'bg-coral' : 'bg-sun'}
          height="h-2"
          className="mb-1"
        />
      )}

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-500 ${
          flashKind === 'correct' ? 'bg-leaf/25 opacity-100' : flashKind === 'wrong' ? 'bg-coral/25 opacity-100' : 'opacity-0'
        }`}
      />

      {comboPopup && (
        <div className="fixed inset-x-0 top-24 z-40 flex justify-center pointer-events-none px-4">
          <div className="bg-sun text-seed font-display font-bold text-lg px-5 py-3 rounded-bubble shadow-chunky animate-pop text-center">
            {comboPopup}
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col ${answered ? 'pb-40' : 'pb-2'} ${answered && !lastCorrect ? 'animate-shake' : ''}`}>
        {renderExercise(current)}
      </div>

      {answered && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto flex flex-col gap-3">
            {wrongInfo && (
              <div className="bg-white rounded-3xl shadow-chunky p-3 animate-pop">
                <Mascot buddyId={player.buddyId} mood="thinking" size="sm" message={mascotLine('wrong', wrongInfo)} />
              </div>
            )}
            <Button color={lastCorrect ? 'leaf' : 'coral'} size="lg" full onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
