// Put the Spanish words in the right order to match the English prompt.
// Tap a tile to move it into the answer row. Tap it again to take it back out.

import { useMemo, useState } from 'react'
import type { OrderWordsExercise as OrderWordsExerciseData } from '../../types'
import { isCorrectOrder } from '../../game/exercises'
import { sfx } from '../../audio/sound'
import Button from '../Button'

interface Tile {
  key: number
  text: string
}

export default function OrderWordsExercise({
  ex,
  onAnswer,
  answered,
}: {
  ex: OrderWordsExerciseData
  onAnswer: (correct: boolean) => void
  answered: boolean
}) {
  // Each tile gets a stable key, in case two tiles have the same word.
  const allTiles: Tile[] = useMemo(() => ex.tiles.map((t, i) => ({ key: i, text: t })), [ex.tiles])
  const [placedKeys, setPlacedKeys] = useState<number[]>([])

  const placed = placedKeys.map((k) => allTiles.find((t) => t.key === k)).filter((t): t is Tile => !!t)
  const pool = allTiles.filter((t) => !placedKeys.includes(t.key))
  const wasCorrect = answered && isCorrectOrder(ex, placed.map((t) => t.text))

  function placeTile(key: number) {
    if (answered) return
    sfx.tap()
    setPlacedKeys((p) => [...p, key])
  }

  function removeTile(key: number) {
    if (answered) return
    sfx.tap()
    setPlacedKeys((p) => p.filter((k) => k !== key))
  }

  function check() {
    if (answered || placed.length === 0) return
    onAnswer(isCorrectOrder(ex, placed.map((t) => t.text)))
  }

  return (
    <div className="flex flex-col gap-4 flex-1 mt-4">
      <h2 className="font-display text-3xl font-bold text-center">{ex.prompt}</h2>

      <div className="min-h-16 flex flex-wrap gap-2 justify-center border-2 border-dashed border-cream-dark rounded-2xl p-3">
        {placed.length === 0 && <span className="text-ink-soft self-center">Tap words below</span>}
        {placed.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={answered}
            onClick={() => removeTile(t.key)}
            className="btn-chunky bg-papaya text-white rounded-2xl px-4 py-2 min-h-14 font-display text-lg font-bold cursor-pointer"
          >
            {t.text}
          </button>
        ))}
      </div>

      {answered && !wasCorrect && (
        <p className="text-center text-ink-soft font-bold">Correct order: {ex.correctOrder.join(' ')}</p>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        {pool.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={answered}
            onClick={() => placeTile(t.key)}
            className="btn-chunky bg-white text-ink border-2 border-cream-dark rounded-2xl px-4 py-2 min-h-14 font-display text-lg font-bold cursor-pointer"
          >
            {t.text}
          </button>
        ))}
      </div>

      {!answered && (
        <Button color="leaf" size="lg" full onClick={check} disabled={placed.length === 0}>
          Check
        </Button>
      )}
    </div>
  )
}
