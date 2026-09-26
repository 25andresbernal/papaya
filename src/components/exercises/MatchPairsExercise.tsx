// Tap a Spanish word on the left, then its English match on the right.
// A right match locks in green. A wrong match shakes both and counts as a mistake,
// but the kid keeps going. The whole exercise is only "correct" if there were zero mistakes.

import { useEffect, useMemo, useRef, useState } from 'react'
import type { MatchPairsExercise as MatchPairsExerciseData } from '../../types'
import { sfx, speak } from '../../audio/sound'
import { shuffle } from '../../utils/random'

export default function MatchPairsExercise({
  ex,
  onAnswer,
  answered,
}: {
  ex: MatchPairsExerciseData
  onAnswer: (correct: boolean) => void
  answered: boolean
}) {
  // Shuffle each column once, so the two sides don't line up.
  const leftOrder = useMemo(() => shuffle(ex.pairs), [ex.pairs])
  const rightOrder = useMemo(() => shuffle(ex.pairs), [ex.pairs])

  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [selLeft, setSelLeft] = useState<string | null>(null)
  const [selRight, setSelRight] = useState<string | null>(null)
  const [shakeIds, setShakeIds] = useState<Set<string>>(new Set())
  const mistakesRef = useRef(0)
  const doneRef = useRef(false)

  // Tell the runner once every pair is matched. Only fire this once.
  useEffect(() => {
    if (matched.size > 0 && matched.size === ex.pairs.length && !doneRef.current) {
      doneRef.current = true
      onAnswer(mistakesRef.current === 0)
    }
  }, [matched, ex.pairs.length, onAnswer])

  function evaluate(leftId: string, rightId: string) {
    if (leftId === rightId) {
      sfx.correct()
      setMatched((m) => new Set(m).add(leftId))
      setSelLeft(null)
      setSelRight(null)
    } else {
      sfx.wrong()
      mistakesRef.current += 1
      setShakeIds(new Set([leftId, rightId]))
      window.setTimeout(() => {
        setShakeIds(new Set())
        setSelLeft(null)
        setSelRight(null)
      }, 400)
    }
  }

  function tapLeft(wordId: string) {
    if (answered || matched.has(wordId) || shakeIds.size > 0) return
    sfx.tap()
    const pair = ex.pairs.find((p) => p.wordId === wordId)
    if (pair) speak(pair.es)
    if (selRight) evaluate(wordId, selRight)
    else setSelLeft(wordId)
  }

  function tapRight(wordId: string) {
    if (answered || matched.has(wordId) || shakeIds.size > 0) return
    sfx.tap()
    if (selLeft) evaluate(selLeft, wordId)
    else setSelRight(wordId)
  }

  return (
    <div className="flex flex-col gap-4 flex-1 mt-4">
      <h2 className="font-display text-2xl font-bold text-center">Match the pairs</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {leftOrder.map((p) => {
            const isMatched = matched.has(p.wordId)
            const isSel = selLeft === p.wordId
            const isShake = shakeIds.has(p.wordId)
            return (
              <button
                key={p.wordId}
                type="button"
                disabled={isMatched || answered}
                onClick={() => tapLeft(p.wordId)}
                className={`btn-chunky rounded-2xl px-3 py-3 min-h-14 font-display text-lg font-bold cursor-pointer
                  ${isMatched ? 'bg-leaf text-white opacity-80' : isSel ? 'bg-sky text-white' : 'bg-white text-ink'}
                  ${isShake ? 'animate-shake' : ''}`}
              >
                {p.es}
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rightOrder.map((p) => {
            const isMatched = matched.has(p.wordId)
            const isSel = selRight === p.wordId
            const isShake = shakeIds.has(p.wordId)
            return (
              <button
                key={`r-${p.wordId}`}
                type="button"
                disabled={isMatched || answered}
                onClick={() => tapRight(p.wordId)}
                className={`btn-chunky rounded-2xl px-3 py-3 min-h-14 font-display text-lg font-bold flex items-center justify-center gap-2 cursor-pointer
                  ${isMatched ? 'bg-leaf text-white opacity-80' : isSel ? 'bg-sky text-white' : 'bg-white text-ink'}
                  ${isShake ? 'animate-shake' : ''}`}
              >
                <span className="text-2xl leading-none">{p.emoji}</span>
                <span>{p.en}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
