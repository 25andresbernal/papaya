// Piñata Party! 🪅
// Three piñatas swing on screen. One has the right Spanish word.
// Smash the right one before time runs out. Get it fast for a bonus!

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../types'
import type { MiniGameProps } from './types'
import { sfx, speak } from '../audio/sound'
import { sample, shuffle } from '../utils/random'
import ProgressBar from '../components/ProgressBar'

const ROUNDS = 10
const ROUND_MS = 8000
// Answer inside this window (in milliseconds) to earn a speed bonus.
const BONUS_WINDOW_MS = 2000
const MAX_BONUS = 50

interface Round {
  target: Word
  // 3 words to show on the piñatas. One of them is the target.
  options: Word[]
}

// Pick 2 words that are NOT the target, to use as wrong answers.
// If the kid only knows a few words, we repeat some so we still have 3 choices.
function pickDistractors(target: Word, pool: Word[]): Word[] {
  const others = pool.filter((w) => w.id !== target.id)
  if (others.length >= 2) return sample(others, 2)
  const filler = others.length > 0 ? others : [target]
  return [filler[0], filler[1 % filler.length]]
}

function buildRounds(words: Word[]): Round[] {
  const rounds: Round[] = []
  for (let i = 0; i < ROUNDS; i++) {
    const target = words[i % words.length]
    const options = shuffle([target, ...pickDistractors(target, words)])
    rounds.push({ target, options })
  }
  return rounds
}

export default function PinataGame({ knownWords, onFinish, onQuit, buddyEmoji }: MiniGameProps) {
  // Safety net: the game always needs at least one word to work with.
  const rounds = useMemo(() => {
    const words = knownWords.length > 0 ? knownWords : [{ id: 'hola', es: 'hola', en: 'hi', emoji: '👋' }]
    return buildRounds(words)
  }, [knownWords])

  const [phase, setPhase] = useState<'countdown' | 'play' | 'end'>('countdown')
  const [count, setCount] = useState(3)
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [comboPop, setComboPop] = useState(false)
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'timeout'>('idle')
  const [timeLeft, setTimeLeft] = useState(ROUND_MS)

  // Refs hold values we need instantly, without waiting for a re-render.
  const roundStartRef = useRef(0)
  const lockRef = useRef(false)
  const comboRef = useRef(0)

  // The "3, 2, 1, Ready?" countdown before play starts.
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

  // Every new round gets a fresh 8-second clock.
  useEffect(() => {
    if (phase !== 'play') return
    setStatus('idle')
    setPickedId(null)
    lockRef.current = false
    setTimeLeft(ROUND_MS)
    roundStartRef.current = Date.now()
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 100))
    }, 100)
    return () => clearInterval(id)
  }, [phase, roundIndex])

  // Ran out of time? That counts as a miss.
  useEffect(() => {
    if (phase !== 'play' || timeLeft > 0 || lockRef.current) return
    lockRef.current = true
    setStatus('timeout')
    comboRef.current = 0
    const t = setTimeout(goToNextRound, 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase])

  function goToNextRound() {
    setRoundIndex((r) => {
      if (r + 1 >= ROUNDS) {
        setPhase('end')
        return r
      }
      return r + 1
    })
  }

  function choose(word: Word, isCorrect: boolean) {
    if (lockRef.current || phase !== 'play') return
    lockRef.current = true
    setPickedId(word.id)
    const elapsed = Date.now() - roundStartRef.current

    if (isCorrect) {
      sfx.correct()
      sfx.coin()
      speak(word.es)
      setStatus('correct')
      const speedBonus =
        elapsed < BONUS_WINDOW_MS ? Math.round(MAX_BONUS * (1 - elapsed / BONUS_WINDOW_MS)) : 0
      const newCombo = comboRef.current + 1
      comboRef.current = newCombo
      let comboBonus = 0
      if (newCombo === 3) {
        sfx.combo(newCombo)
        comboBonus = 50
        setComboPop(true)
        setTimeout(() => setComboPop(false), 700)
      }
      setScore((s) => s + 100 + speedBonus + comboBonus)
    } else {
      sfx.wrong()
      setStatus('wrong')
      comboRef.current = 0
    }
    setTimeout(goToNextRound, 900)
  }

  // Show "Time!" for a moment, then hand the score back to the arcade screen.
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
    <div className="min-h-screen max-w-md mx-auto px-4 flex flex-col">
      {/* The piñatas swing gently until one is smashed. */}
      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-swing { animation: swing 1.6s ease-in-out infinite; }
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
          <div className="flex-1 flex flex-col w-full">
            <ProgressBar value={timeLeft} max={ROUND_MS} color="bg-coral" className="mb-3" />
            <div className="text-center mb-4">
              <div className="text-base font-bold text-ink-soft">Smash:</div>
              <div className="font-display font-black text-3xl text-seed">
                {round.target.en} {round.target.emoji}
              </div>
            </div>
            <div className="flex justify-around items-start gap-2 flex-1">
              {round.options.map((opt) => {
                const isCorrect = opt.id === round.target.id
                const isPicked = pickedId === opt.id
                const burst = isPicked && status === 'correct'
                const wobble = isPicked && status === 'wrong'
                const glow = status !== 'idle' && status !== 'correct' && isCorrect
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={lockRef.current}
                    onClick={() => choose(opt, isCorrect)}
                    className={`flex-1 flex flex-col items-center gap-1 rounded-2xl p-2
                      ${glow ? 'ring-4 ring-leaf bg-leaf/10' : ''}
                      ${wobble ? 'animate-shake' : ''}
                      ${!lockRef.current ? 'animate-swing' : ''}`}
                  >
                    <div className="text-5xl">{burst ? '🎉' : '🪅'}</div>
                    {burst && <div className="text-xl animate-pop">🍬🍭🍬</div>}
                    <div className="font-display font-bold text-sm text-seed bg-cream rounded-full px-2 py-1">
                      {opt.es}
                    </div>
                  </button>
                )
              })}
            </div>
            {comboPop && (
              <div className="text-center font-display font-black text-2xl text-sun animate-pop mt-2">
                ¡Combo!
              </div>
            )}
          </div>
        )}

        {phase === 'end' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="text-6xl animate-pop">🎉</div>
            <div className="font-display font-black text-3xl text-papaya">Time!</div>
          </div>
        )}
      </div>
    </div>
  )
}
