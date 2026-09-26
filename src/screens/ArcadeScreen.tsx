// The Arcade screen. This is the reward room. You unlock a game once with
// papayas, then spend one ticket every time you want to play. Tickets only
// come from finishing lessons, so playing games always means you learned first.

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MiniGameDef } from '../types'
import { GAMES } from '../data/games'
import { getUnit, isUnitComplete } from '../data/words'
import { usePlayer } from '../game/PlayerContext'
import { sfx } from '../audio/sound'
import { mascotLine } from '../ai/mascot'
import Screen from '../components/Screen'
import Mascot from '../components/Mascot'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Celebration from '../components/Celebration'

export default function ArcadeScreen() {
  const navigate = useNavigate()
  const { player, unlockGame } = usePlayer()
  // Popup shown when a kid taps a game but has no tickets left.
  const [showNoTickets, setShowNoTickets] = useState(false)
  // Big celebration shown right after unlocking a new game.
  const [celebrating, setCelebrating] = useState<MiniGameDef | null>(null)
  // Only unlock the free first game one time, even if React renders twice.
  const didAutoUnlock = useRef(false)

  useEffect(() => {
    if (didAutoUnlock.current) return
    didAutoUnlock.current = true
    const first = GAMES[0]
    if (first && first.unlockCost === 0 && !player.unlockedGameIds.includes(first.id)) {
      unlockGame(first.id, 0)
    }
    // Only ever run this once, right when the screen first opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePlay(game: MiniGameDef) {
    navigate(`/game/${game.id}`)
  }

  function handleNeedTicket() {
    sfx.wrong()
    setShowNoTickets(true)
  }

  function handleUnlock(game: MiniGameDef) {
    const ok = unlockGame(game.id, game.unlockCost)
    if (!ok) return
    setCelebrating(game)
  }

  function handleCantAfford() {
    sfx.wrong()
  }

  return (
    <Screen>
      <h1 className="text-2xl font-display font-bold text-ink mt-3 mb-3">Arcade</h1>

      <div className="bg-white rounded-3xl shadow-chunky-sm px-4 py-3 mb-4 text-center">
        <p className="font-display font-bold text-ink">
          🎟️ Tickets: {player.tickets}. Finish a lesson to earn more!
        </p>
      </div>

      <div className="flex flex-col gap-3 pb-4">
        {GAMES.map((game) => {
          const unlocked = player.unlockedGameIds.includes(game.id)
          const gateMet = !game.requiresUnitId || isUnitComplete(game.requiresUnitId, player)
          const affordable = player.coins >= game.unlockCost
          const hasTickets = player.tickets >= game.ticketCost
          const highScore = player.gameHighScores[game.id]

          return (
            <div key={game.id} className="bg-white rounded-3xl shadow-chunky-sm p-4 flex gap-3 items-center">
              <span className="text-6xl leading-none shrink-0">{unlocked ? game.emoji : gateMet ? game.emoji : '🔒'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-lg text-ink leading-tight">{game.title}</p>
                <p className="text-sm text-ink-soft leading-snug">{game.description}</p>
                {highScore !== undefined && (
                  <p className="text-xs font-bold text-sun-dark mt-1">⭐ Best score: {highScore}</p>
                )}

                <div className="mt-2">
                  {unlocked && hasTickets && (
                    <Button color="leaf" size="sm" onClick={() => handlePlay(game)}>
                      Play ({game.ticketCost} 🎟️)
                    </Button>
                  )}
                  {unlocked && !hasTickets && (
                    <Button color="white" size="sm" onClick={handleNeedTicket}>
                      Need a ticket
                    </Button>
                  )}
                  {!unlocked && !gateMet && (
                    <p className="text-xs font-bold text-ink-soft">
                      🔒 Finish {getUnit(game.requiresUnitId ?? '')?.title ?? 'a unit'} first
                    </p>
                  )}
                  {!unlocked && gateMet && affordable && (
                    <Button color="papaya" size="sm" onClick={() => handleUnlock(game)}>
                      Unlock 🥭 {game.unlockCost}
                    </Button>
                  )}
                  {!unlocked && gateMet && !affordable && (
                    <button
                      type="button"
                      className="opacity-60 grayscale cursor-pointer font-display font-bold text-ink-soft"
                      onClick={handleCantAfford}
                    >
                      🥭 {game.unlockCost}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showNoTickets && (
        <Modal onClose={() => setShowNoTickets(false)}>
          <Mascot buddyId={player.buddyId} size="sm" message={mascotLine('noTickets')} />
          <Button
            color="leaf"
            size="lg"
            full
            className="mt-5"
            onClick={() => {
              setShowNoTickets(false)
              navigate('/path')
            }}
          >
            Go learn
          </Button>
        </Modal>
      )}

      {celebrating && (
        <Celebration
          emoji={celebrating.emoji}
          title={`You unlocked ${celebrating.title}!`}
          subtitle={celebrating.description}
          sound="unlock"
          onDone={() => setCelebrating(null)}
        />
      )}
    </Screen>
  )
}
