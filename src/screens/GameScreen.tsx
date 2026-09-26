// The screen that actually plays a mini-game. It spends one ticket to start,
// shows the game full-screen (no top bar or nav bar so the game has room),
// and shows a results popup with the score and papayas earned when it ends.

import { Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGame } from '../data/games'
import { GAME_COMPONENTS } from '../games/index'
import { learnedWords } from '../data/words'
import { getCharacter } from '../data/characters'
import { usePlayer } from '../game/PlayerContext'
import { sfx } from '../audio/sound'
import Screen from '../components/Screen'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Confetti from '../components/Confetti'
import Pic from '../components/Pic'

// Games never earn more than this many papayas per play. Lessons should
// always be the best way to earn papayas, not the arcade.
const MAX_COINS_PER_PLAY = 30

interface Result {
  score: number
  coinsEarned: number
  isHighScore: boolean
}

export default function GameScreen() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const { player, spendTicket, addCoins, recordGameScore } = usePlayer()

  const game = gameId ? getGame(gameId) : undefined
  const unlocked = game ? player.unlockedGameIds.includes(game.id) : false

  // Only spend the starting ticket once, even if React re-runs this effect.
  const spentRef = useRef(false)
  const [ready, setReady] = useState(false)
  // Bumping this key makes React throw away the old game and start a fresh one.
  const [gameKey, setGameKey] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    if (!game || !unlocked) {
      navigate('/arcade', { replace: true })
      return
    }
    if (spentRef.current) return
    spentRef.current = true
    const ok = spendTicket(game.ticketCost)
    if (!ok) {
      navigate('/arcade', { replace: true })
      return
    }
    setReady(true)
    // We only want this to run once, right when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!game) return null
  // Once we know the game exists, give it its own name so functions defined
  // below always see it as "definitely there", not "maybe missing".
  const activeGame = game

  function handleQuit() {
    navigate('/arcade')
  }

  function handleFinish({ score, coinsEarned }: { score: number; coinsEarned: number }) {
    const capped = Math.min(MAX_COINS_PER_PLAY, Math.max(0, Math.floor(coinsEarned)))
    const prevHigh = player.gameHighScores[activeGame.id] ?? 0
    recordGameScore(activeGame.id, score)
    addCoins(capped)
    sfx.fanfare()
    setResult({ score, coinsEarned: capped, isHighScore: score > prevHigh })
  }

  function handlePlayAgain() {
    if (player.tickets < activeGame.ticketCost) return
    const ok = spendTicket(activeGame.ticketCost)
    if (!ok) return
    setResult(null)
    setGameKey((k) => k + 1)
  }

  const GameComponent = GAME_COMPONENTS[activeGame.id]
  const canPlayAgain = player.tickets >= activeGame.ticketCost

  return (
    <Screen topBar={false} nav={false} bg="bg-seed">
      {ready && GameComponent ? (
        <Suspense fallback={<LoadingFallback />}>
          <GameComponent
            key={gameKey}
            knownWords={learnedWords(player)}
            buddyEmoji={getCharacter(player.buddyId).emoji}
            onQuit={handleQuit}
            onFinish={handleFinish}
          />
        </Suspense>
      ) : (
        <LoadingFallback />
      )}

      {result && (
        <>
          <Confetti />
          <Modal>
            <div className="text-6xl mb-2">🏆</div>
            <h2 className="text-2xl font-display font-bold text-papaya-dark">Score {result.score}</h2>
            {result.isHighScore && <p className="mt-1 font-display font-bold text-leaf">New high score!</p>}
            <p className="mt-2 text-xl font-display font-bold text-papaya-dark">+{result.coinsEarned} 🥭</p>

            <div className="mt-5 flex flex-col gap-3">
              <Button color="leaf" size="lg" full disabled={!canPlayAgain} onClick={handlePlayAgain}>
                {canPlayAgain ? `Play again (${activeGame.ticketCost} 🎟️)` : 'Need a ticket'}
              </Button>
              <Button color="white" size="lg" full onClick={handleQuit}>
                Back to arcade
              </Button>
            </div>
          </Modal>
        </>
      )}
    </Screen>
  )
}

function LoadingFallback() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-cream gap-3">
      <Pic emoji="🎮" size={64} className="animate-bounce-soft" label="" />
      <p className="font-display font-bold text-lg">Loading...</p>
    </div>
  )
}
