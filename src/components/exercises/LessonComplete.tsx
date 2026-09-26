// The payoff screen after a lesson (or a practice session) finishes.
// Confetti, crowns, a rewards list, and a chance to level up.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LessonSummary, PlayerState } from '../../types'
import { crownsForScore } from '../../game/economy'
import { sfx } from '../../audio/sound'
import { mascotLine } from '../../ai/mascot'
import { formatMs } from '../../utils/format'
import Confetti from '../Confetti'
import Mascot from '../Mascot'
import Button from '../Button'
import Celebration from '../Celebration'

export default function LessonComplete({
  summary,
  player,
  onPlayAgain,
  onPractice,
  onContinue,
}: {
  summary: LessonSummary
  player: PlayerState
  onPlayAgain: () => void
  onPractice: () => void
  onContinue: () => void
}) {
  const navigate = useNavigate()
  const crowns = crownsForScore(summary.correct, summary.total)
  const [shownCrowns, setShownCrowns] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const leveledUp = summary.levelAfter > summary.levelBefore
  const timed = summary.timeMs > 0

  // Crowns pop in one at a time so it feels like a little show, not a wall of text.
  useEffect(() => {
    sfx.fanfare()
    if (timed && summary.newBestTime) sfx.levelUp()
    if (crowns === 0) return
    let i = 0
    const iv = window.setInterval(() => {
      i++
      setShownCrowns(i)
      if (i >= crowns) window.clearInterval(iv)
    }, 350)
    return () => window.clearInterval(iv)
    // Only run this once, when the summary first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleContinue() {
    if (leveledUp) setShowLevelUp(true)
    else onContinue()
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-6">
      <Confetti />

      {summary.perfect && (
        <div className="bg-sun text-seed font-display font-bold px-4 py-1 rounded-full shadow-chunky-sm animate-pop tracking-wide">
          PERFECT
        </div>
      )}

      {timed && summary.newBestTime && (
        <div className="bg-coral text-white font-display font-bold px-4 py-1 rounded-full shadow-chunky-sm animate-pop tracking-wide">
          NEW RECORD!
        </div>
      )}

      <div className="flex gap-2 text-5xl" aria-label={`${crowns} out of 3 crowns`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= shownCrowns ? 'animate-pop' : 'opacity-20'}>
            ⭐
          </span>
        ))}
      </div>

      <Mascot
        buddyId={player.buddyId}
        mood={summary.perfect ? 'excited' : 'happy'}
        message={mascotLine(summary.perfect ? 'perfect' : 'lessonComplete', { name: player.name })}
      />

      <div className="bg-white rounded-3xl shadow-chunky p-4 w-full max-w-xs flex flex-col gap-2 text-left font-display font-bold text-lg">
        <Row emoji="✨" label="XP" value={`+${summary.xpEarned}`} color="text-leaf-dark" />
        <Row emoji="🥭" label="Papayas" value={`+${summary.coinsEarned}`} color="text-papaya-dark" />
        <Row emoji="🎟️" label="Tickets" value={`+${summary.ticketsEarned}`} color="text-sky-dark" />
        <Row emoji="🔥" label="Best combo" value={`x${summary.bestCombo}`} color="text-coral" />
        {summary.streakExtended && <Row emoji="🔥" label="Streak" value={`${player.streak} days`} color="text-coral" />}
        {timed && <Row emoji="⏱" label="Time" value={formatMs(summary.timeMs)} color="text-sky-dark" />}
        {timed && (
          <Row
            emoji="🏆"
            label="Best"
            value={
              summary.newBestTime
                ? formatMs(summary.bestTimeMs)
                : `${formatMs(summary.bestTimeMs)} (${((summary.timeMs - summary.bestTimeMs) / 1000).toFixed(1)}s slower)`
            }
            color="text-seed"
          />
        )}
      </div>

      <div className="w-full max-w-xs flex flex-col gap-3 mt-2">
        {timed ? (
          <Button color="sun" size="lg" full onClick={onPlayAgain}>
            Race again ⏱
          </Button>
        ) : (
          <Button color="sky" size="lg" full onClick={onPlayAgain}>
            Play again
          </Button>
        )}
        {summary.missedWordIds.length > 0 && (
          <Button color="sky" size="lg" full onClick={onPractice}>
            Practice missed
          </Button>
        )}
        <Button color="leaf" size="xl" full onClick={handleContinue}>
          Continue
        </Button>
        <Button color="white" size="sm" onClick={() => navigate('/race')}>
          See records 🏁
        </Button>
      </div>

      {showLevelUp && (
        <Celebration
          emoji="🎉"
          title="Level up!"
          subtitle={`You're now level ${summary.levelAfter}!`}
          sound="levelUp"
          onDone={onContinue}
        />
      )}
    </div>
  )
}

function Row({ emoji, label, value, color }: { emoji: string; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-soft text-base font-bold">
        <span className="text-xl">{emoji}</span>
        {label}
      </span>
      <span className={color}>{value}</span>
    </div>
  )
}
