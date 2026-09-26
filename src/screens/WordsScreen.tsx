// The word garden: every word the kid can learn, grouped by unit.
// Learned words show how strong they are. Unseen words are a friendly "?".
// Tap a learned word chip to hear it out loud.

import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import { usePlayer } from '../game/PlayerContext'
import { sfx, speak } from '../audio/sound'
import { UNITS, WORDS, learnedCount, wordsForUnit } from '../data/words'
import { wordStrength } from '../game/spacedRepetition'
import type { Word, WordStat } from '../types'
import Pic from '../components/Pic'
import WordArt from '../components/wordart'

export default function WordsScreen() {
  const { player } = usePlayer()
  const navigate = useNavigate()
  const learned = learnedCount(player)
  const total = WORDS.length

  return (
    <Screen>
      <div className="flex items-center gap-2 pt-2">
        <BackButton to="/" />
        <h1 className="font-display text-2xl font-bold text-ink">My words</h1>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <ProgressBar value={learned} max={total} color="bg-leaf" className="flex-1" />
        <span className="font-display font-bold text-ink-soft text-sm whitespace-nowrap">
          {learned}/{total}
        </span>
      </div>

      <Button color="sky" size="md" full className="mt-4" onClick={() => navigate('/practice')}>
        🧠 Practice weak words
      </Button>

      <div className="mt-6 flex flex-col gap-6 pb-4">
        {UNITS.map((unit) => (
          <section key={unit.id}>
            <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
              <Pic emoji={unit.emoji} size={20} label="" />
              {unit.title}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {wordsForUnit(unit).map((w) => (
                <WordChip key={w.id} word={w} stat={player.words[w.id]} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Screen>
  )
}

/** One word tile. Grey "?" until the kid has seen it at least once. */
function WordChip({ word, stat }: { word: Word; stat?: WordStat }) {
  const seen = (stat?.timesSeen ?? 0) > 0

  if (!seen) {
    return (
      <div
        className="rounded-2xl border-2 border-black/10 bg-cream-dark/60 p-3 flex flex-col items-center justify-center gap-1 opacity-70"
        aria-label="Not learned yet"
      >
        <Pic emoji="❓" size={34} label="" />
        <span className="text-xs font-display font-bold text-ink-soft">???</span>
      </div>
    )
  }

  const dots = Math.round(wordStrength(stat) * 5)

  return (
    <button
      type="button"
      onClick={() => {
        sfx.pop()
        speak(word.es)
      }}
      className="btn-chunky bg-white border-2 border-black/10 rounded-2xl p-3 flex flex-col items-center gap-1 cursor-pointer"
    >
      <WordArt wordId={word.id} emoji={word.emoji} size={34} className="leading-none" label={word.en} />
      <span className="font-display font-bold text-sm text-papaya-dark">{word.es}</span>
      <span className="text-xs text-ink-soft font-bold">{word.en}</span>
      <span className="flex gap-0.5" aria-label={`Strength ${dots} of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < dots ? 'bg-leaf' : 'bg-cream-dark'}`} />
        ))}
      </span>
    </button>
  )
}
