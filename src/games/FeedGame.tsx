// Feed Capi! 🐹
// Capi says a Spanish word out loud. Tap the tray with the right thing on it.
// No English shown here — this game is all about listening.

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../types'
import type { MiniGameProps } from './types'
import { sfx, speak } from '../audio/sound'
import { sample, shuffle } from '../utils/random'
import ProgressBar from '../components/ProgressBar'
import Confetti from '../components/Confetti'

const ROUNDS = 10
// Answer inside this window (in milliseconds) to earn a speed bonus.
const BONUS_WINDOW_MS = 3000
const MAX_BONUS = 50

interface Round {
  target: Word
  trays: Word[]
}

// Pick 3 words that are NOT the target, to use as wrong trays.
// If the kid only knows a few words, we repeat some so there are always 4 trays.
function pickDistractors(target: Word, pool: Word[]): Word[] {
  const others = pool.filter((w) => w.id !== target.id)
  if (others.length >= 3) return sample(others, 3)
  const filler = others.length > 0 ? others : [target]
  return [filler[0], filler[1 % filler.length], filler[2 % filler.length]]
}

function buildRounds(words: Word[]): Round[] {
  const rounds: Round[] = []
  for (let i = 0; i < ROUNDS; i++) {
    const target = words[i % words.length]
    const trays = shuffle([target, ...pickDistractors(target, words)])
    rounds.push({ target, trays })
  }
  return rounds
}

export default function FeedGame({ knownWords, onFinish, onQuit, buddyEmoji }: MiniGameProps) {
  const rounds = useMemo(() => {
    const words = knownWords.length > 0 ? knownWords : [{ id: 'hola', es: 'hola', en: 'hi', emoji: '👋' }]
    return buildRounds(words)
  }, [knownWords])

  const [phase, setPhase] = useState<'countdown' | 'play' | 'end'>('countdown')
  const [count, setCount] = useState(3)
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [flyingId, setFlyingId] = useState<string | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [glowId, setGlowId] = useState<string | null>(null)
  const [bubble, setBubble] = useState<{ text: string; mood: 'ask' | 'yum' | 'again' }>({
    text: '',
    mood: 'ask',
  })
  const [grown, setGrown] = useState(false)

  const roundStartRef = useRef(0)
  const lockRef = useRef(false)

  // "3, 2, 1, Ready?" before Capi asks for anything.
  useEffect(() => {
    if (phase !== 'countdown') return
    if (count <= 0) {
      setPhase('play')
      return
    }
    sfx.tick()
    const t = setTimeout(() => setCount((c) => c - 1), 700)
    return () => clearTimeout(t)
  }, [phase, count])

  // Every new round, Capi asks for a new word out loud.
  useEffect(() => {
    if (phase !== 'play') return
    const round = rounds[roundIndex]
    if (!round) return
    lockRef.current = false
    setFlyingId(null)
    setShakeId(null)
    setGlowId(null)
    setBubble({ text: round.target.es, mood: 'ask' })
    roundStartRef.current = Date.now()
    speak(round.target.es)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundIndex])

  function replay() {
    const round = rounds[roundIndex]
    if (!round) return
    sfx.tap()
    speak(round.target.es)
  }

  function choose(tray: Word, isCorrect: boolean) {
    if (lockRef.current || phase !== 'play') return
    const round = rounds[roundIndex]
    if (!round) return

    if (isCorrect) {
      lockRef.current = true
      const elapsed = Date.now() - roundStartRef.current
      const speedBonus =
        elapsed < BONUS_WINDOW_MS ? Math.round(MAX_BONUS * (1 - elapsed / BONUS_WINDOW_MS)) : 0
      sfx.correct()
      sfx.coin()
      setFlyingId(tray.id)
      setBubble({ text: '¡Ñam!', mood: 'yum' })
      setGrown(true)
      setScore((s) => s + 100 + speedBonus)
      setCorrectCount((c) => c + 1)
      setTimeout(() => {
        setGrown(false)
        setRoundIndex((r) => {
          if (r + 1 >= ROUNDS) {
            setPhase('end')
            return r
          }
          return r + 1
        })
      }, 550)
    } else {
      // Wrong tray: Capi shakes his head, then the kid can try again.
      sfx.wrong()
      setShakeId(tray.id)
      setGlowId(round.target.id)
      setBubble({ text: 'Otra vez', mood: 'again' })
      setTimeout(() => {
        setShakeId(null)
        setGlowId(null)
        setBubble({ text: round.target.es, mood: 'ask' })
      }, 700)
    }
  }

  // Show "Done!" for a moment, then hand the score back to the arcade screen.
  useEffect(() => {
    if (phase !== 'end') return
    const t = setTimeout(() => {
      const coinsEarned = Math.min(30, Math.round(score / 10))
      onFinish({ score, coinsEarned })
    }, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const round = rounds[roundIndex]

  return (
    <div className="min-h-screen w-full max-w-md mx-auto px-4 flex flex-col">
      {/* Trays bob gently, and a chosen tray flies up to Capi. */}
      <style>{`
        @keyframes fly-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-140px) scale(0.3); opacity: 0; }
        }
        .animate-fly { animation: fly-up 0.5s ease-in forwards; }
      `}</style>

      <div className="pt-4 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            onQuit()
          }}
          className="text-sm font-bold text-white/80 bg-black/20 rounded-full px-3 py-1"
        >
          Quit
        </button>
        <div className="font-display font-bold text-white text-base">
          Round {Math.min(roundIndex + 1, ROUNDS)}/{ROUNDS} · Score {score}
        </div>
      </div>

      <div className="bg-white rounded-bubble shadow-chunky p-4 flex-1 flex flex-col items-center">
        {phase === 'countdown' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="text-6xl">{buddyEmoji}</div>
            <div key={count} className="font-display font-black text-5xl text-papaya animate-pop">
              {count > 0 ? count : '¡Vamos!'}
            </div>
            <div className="text-ink-soft font-bold">Ready?</div>
          </div>
        )}

        {phase === 'play' && round && (
          <div className="flex-1 flex flex-col w-full items-center">
            <div className="bg-cream rounded-2xl px-4 py-2 mb-1 flex items-center gap-2 animate-pop" key={bubble.text + roundIndex}>
              <span className="font-display font-bold text-lg text-seed">{bubble.text}</span>
              {bubble.mood === 'ask' && (
                <button type="button" onClick={replay} aria-label="Play word again" className="text-xl">
                  🔊
                </button>
              )}
            </div>
            <div className={`text-7xl mb-2 transition-transform duration-300 ${grown ? 'scale-125' : 'scale-100'} ${shakeId ? 'animate-shake' : ''}`}>
              {shakeId ? '🙈' : '🐹'}
            </div>

            <ProgressBar value={correctCount} max={ROUNDS} color="bg-sun" className="mb-4 w-full" />

            <div className="grid grid-cols-4 gap-2 w-full">
              {round.trays.map((tray) => {
                const isCorrect = tray.id === round.target.id
                const flying = flyingId === tray.id
                const shaking = shakeId === tray.id
                const glowing = glowId === tray.id
                return (
                  <button
                    key={tray.id}
                    type="button"
                    onClick={() => choose(tray, isCorrect)}
                    className={`aspect-square rounded-2xl bg-sky/15 flex items-center justify-center text-4xl
                      ${!flying && !shaking ? 'animate-float' : ''}
                      ${flying ? 'animate-fly' : ''}
                      ${shaking ? 'animate-shake' : ''}
                      ${glowing ? 'ring-4 ring-leaf' : ''}`}
                  >
                    {tray.emoji}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {phase === 'end' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            {correctCount >= ROUNDS && <Confetti />}
            <div className="text-6xl animate-pop">🐹</div>
            <div className="font-display font-black text-3xl text-papaya">Done!</div>
          </div>
        )}
      </div>
    </div>
  )
}
