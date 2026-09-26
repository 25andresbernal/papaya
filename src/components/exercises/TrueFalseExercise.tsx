// A quick true-or-false check: "gato = dog?" Tap YES or NO.

import { useState } from 'react'
import type { TrueFalseExercise as TrueFalseExerciseData } from '../../types'
import { isCorrectTrueFalse } from '../../game/exercises'
import { sfx } from '../../audio/sound'
import SpeakButton from '../SpeakButton'
import Pic from '../Pic'
import WordArt from '../wordart'

export default function TrueFalseExercise({
  ex,
  onAnswer,
  answered,
}: {
  ex: TrueFalseExerciseData
  onAnswer: (correct: boolean) => void
  answered: boolean
}) {
  const [choice, setChoice] = useState<boolean | null>(null)

  function answer(value: boolean) {
    if (answered) return
    sfx.tap()
    setChoice(value)
    onAnswer(isCorrectTrueFalse(ex, value))
  }

  const yesIsRight = ex.isTrue
  const noIsRight = !ex.isTrue

  return (
    <div className="flex flex-col items-center gap-6 flex-1 mt-4">
      <div className="leading-none">
        <WordArt wordId={ex.targetWordId} emoji={ex.emoji} size={76} label={ex.en} />
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="font-display text-3xl font-bold">{ex.es}</span>
        <SpeakButton text={ex.es} size="sm" />
        <span className="font-display text-2xl font-bold text-ink-soft">=</span>
        <span className="font-display text-3xl font-bold">{ex.en}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          type="button"
          disabled={answered}
          onClick={() => answer(true)}
          className={`btn-chunky bg-btn-green text-white min-h-20 rounded-3xl font-display text-xl font-bold flex flex-col items-center justify-center gap-1 cursor-pointer
            ${answered && yesIsRight ? 'ring-4 ring-white' : ''}
            ${answered && !yesIsRight && choice === true ? 'opacity-60' : ''}
            ${answered && !yesIsRight && choice !== true ? 'opacity-40' : ''}`}
        >
          <Pic emoji="👍" size={40} className="leading-none" label="Yes" />
          <span>
            YES
            {answered && yesIsRight ? ' ✓' : ''}
            {answered && choice === true && !yesIsRight ? ' ✗' : ''}
          </span>
        </button>
        <button
          type="button"
          disabled={answered}
          onClick={() => answer(false)}
          className={`btn-chunky bg-btn-red text-white min-h-20 rounded-3xl font-display text-xl font-bold flex flex-col items-center justify-center gap-1 cursor-pointer
            ${answered && noIsRight ? 'ring-4 ring-white' : ''}
            ${answered && !noIsRight && choice === false ? 'opacity-60' : ''}
            ${answered && !noIsRight && choice !== false ? 'opacity-40' : ''}`}
        >
          <Pic emoji="👎" size={40} className="leading-none" label="No" />
          <span>
            NO
            {answered && noIsRight ? ' ✓' : ''}
            {answered && choice === false && !noIsRight ? ' ✗' : ''}
          </span>
        </button>
      </div>
    </div>
  )
}
