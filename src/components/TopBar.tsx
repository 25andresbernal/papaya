// The strip at the top of most screens: streak, papayas (coins), tickets, level.
// The kid always sees how they are growing. That is design rule 3: visible progress.

import { usePlayer } from '../game/PlayerContext'
import { levelProgress } from '../game/economy'

export default function TopBar() {
  const { player } = usePlayer()
  const lp = levelProgress(player.xp)

  return (
    <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur px-4 pt-3 pb-2">
      <div className="flex items-center justify-between gap-2 text-lg font-display font-bold">
        <Stat emoji="🔥" value={player.streak} label="day streak" color={player.streak > 0 ? 'text-coral' : 'text-ink-soft'} />
        <Stat emoji="🥭" value={player.coins} label="papayas" color="text-papaya-dark" />
        <Stat emoji="🎟️" value={player.tickets} label="tickets" color="text-sky-dark" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="font-display font-bold text-sm text-ink-soft whitespace-nowrap">Lv {lp.level}</span>
        <div className="flex-1 h-3 rounded-full bg-cream-dark overflow-hidden" aria-label="XP progress">
          <div
            className="h-full rounded-full bg-leaf transition-all duration-700"
            style={{ width: `${Math.max(4, lp.pct * 100)}%` }}
          />
        </div>
        <span className="text-xs text-ink-soft whitespace-nowrap">
          {lp.current}/{lp.needed} XP
        </span>
      </div>
    </header>
  )
}

function Stat({ emoji, value, label, color }: { emoji: string; value: number; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-1 ${color}`} title={label} aria-label={`${value} ${label}`}>
      <span className="text-xl">{emoji}</span>
      <span>{value}</span>
    </div>
  )
}
