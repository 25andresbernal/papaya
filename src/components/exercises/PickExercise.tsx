// One of three "pick the right answer" exercises:
//   pickSpanish  - see English (and a picture), tap the Spanish word
//   pickEnglish  - see Spanish, tap the English word
//   listenTap    - hear Spanish out loud, tap the matching picture
// All three share the same "four big buttons" layout, so one component does all three.

import { useEffect, useState } from 'react'
import type { PickExercise as PickExerciseData } from '../../types'
import { getWord } from '../../data/words'
import { isCorrectPick } from '../../game/exercises'
import { sfx, speak } from '../../audio/sound'
import SpeakButton from '../SpeakButton'

// Kahoot-style button colors, in order.
const BUTTON_COLORS = ['bg-btn-red', 'bg-btn-blue', 'bg-btn-yellow', 'bg-btn-green']

export default function PickExercise({
  ex,
  onAnswer,
  answered,
}: {
  ex: PickExerciseData
  onAnswer: (correct: boolean) => void
  answered: boolean
}) {
  const [chosen, setChosen] = useState<string | null>(null)
  const targetWord = getWord(ex.targetWordId)

  // listenTap has no text prompt: the kid hears the word instead. Play it as soon
  // as this exercise appears, so they don't have to guess what to tap first.
  useEffect(() => {
    if (ex.kind === 'listenTap' && targetWord) speak(targetWord.es)
    // We only want this once, when this exercise first shows up.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function choose(wordId: string) {
    if (answered) return
    sfx.tap()
    setChosen(wordId)
    onAnswer(isCorrectPick(ex, wordId))
  }

  return (
    <div className="flex flex-col items-center gap-6 flex-1">
      <div className="flex flex-col items-center gap-2 mt-4 min-h-24 justify-center">
        {ex.kind === 'listenTap' ? (
          <SpeakButton text={targetWord?.es ?? ''} size="lg" />
        ) : (
          <>
            {ex.promptEmoji && <div className="text-7xl leading-none">{ex.promptEmoji}</div>}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <h2 className="font-display text-3xl font-bold text-center">{ex.prompt}</h2>
              {ex.kind === 'pickEnglish' && <SpeakButton text={ex.prompt} size="sm" />}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {ex.choices.map((c, i) => {
          const isCorrectChoice = c.wordId === ex.correctWordId
          const isChosen = c.wordId === chosen
          let extra = ''
          if (answered) {
            if (isCorrectChoice) extra = 'ring-4 ring-white'
            else if (isChosen) extra = 'opacity-60'
            else extra = 'opacity-40'
          }
          return (
            <button
              key={c.wordId}
              type="button"
              disabled={answered}
              onClick={() => choose(c.wordId)}
              className={`btn-chunky ${BUTTON_COLORS[i % 4]} text-white min-h-20 rounded-3xl font-display text-xl font-bold flex flex-col items-center justify-center gap-1 px-2 py-3 cursor-pointer ${extra}`}
            >
              {c.emoji && <span className="text-4xl leading-none">{c.emoji}</span>}
              <span>
                {c.label}
                {answered && isCorrectChoice ? ' ✓' : ''}
                {answered && isChosen && !isCorrectChoice ? ' ✗' : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
