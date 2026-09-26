// Papaya Catch: fruit-basket word game.
// A word shows at the top in English. Spanish word pills fall from the sky.
// Move the basket under the pill that matches, and catch it!
// We move things every animation frame (like drawing a new picture 60 times a second).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../types'
import type { MiniGameProps } from './types'
import { sfx, speak } from '../audio/sound'
import { pick, uid } from '../utils/random'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'

/** One falling word pill. x and y are in pixels inside the play area. */
interface FallingItem {
  id: string
  word: Word
  x: number
  y: number
}

const GAME_SECONDS = 45
const BASKET_WIDTH_PCT = 20 // how wide the basket "catch zone" is, as % of play-area width
const ITEM_COUNT = 3 // how many pills fall at once

export default function CatchGame({ knownWords, onFinish, onQuit, buddyEmoji }: MiniGameProps) {
  // If somehow there are no words yet, we still need something to show.
  const wordPool = useMemo(
    () => (knownWords.length > 0 ? knownWords : [{ id: 'x', es: '?', en: '?', emoji: '❓' }]),
    [knownWords],
  )

  const [phase, setPhase] = useState<'ready' | 'play' | 'done'>('ready')
  const [countdown, setCountdown] = useState(3)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [target, setTarget] = useState<Word>(() => pick(wordPool))
  const [basketX, setBasketX] = useState(50) // percent across the play area
  const [wobble, setWobble] = useState(false)
  const [items, setItems] = useState<FallingItem[]>([])

  const areaRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef(target)
  targetRef.current = target
  const startTimeRef = useRef(0)
  const finishedRef = useRef(false)
  // Keep a ref of basketX so the animation loop always sees the latest spot
  // without needing to restart every time the basket moves.
  const basketXRef = useRef(basketX)
  basketXRef.current = basketX

  // Make one new falling pill at the top, above the visible area.
  const spawnItem = useCallback(
    (currentTarget: Word): FallingItem => {
      const isCorrect = Math.random() < 0.4
      const otherWords = wordPool.filter((w) => w.id !== currentTarget.id)
      const word = isCorrect ? currentTarget : otherWords.length > 0 ? pick(otherWords) : currentTarget
      return {
        id: uid('drop'),
        word,
        x: 10 + Math.random() * 80,
        y: -40 - Math.random() * 200,
      }
    },
    [wordPool],
  )

  // Countdown: "3... 2... 1... Go!" then start the real game.
  useEffect(() => {
    if (phase !== 'ready') return
    if (countdown <= 0) {
      setPhase('play')
      startTimeRef.current = performance.now()
      setItems(Array.from({ length: ITEM_COUNT }, () => spawnItem(targetRef.current)))
      return
    }
    sfx.tick()
    const t = setTimeout(() => setCountdown((c) => c - 1), 700)
    return () => clearTimeout(t)
  }, [phase, countdown, spawnItem])

  // The 45-second timer.
  useEffect(() => {
    if (phase !== 'play') return
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t)
          setPhase('done')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [phase])

  // The falling-and-catching loop. Runs every animation frame while playing.
  useEffect(() => {
    if (phase !== 'play') return
    let raf = 0
    let lastTime = performance.now()

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now
      const elapsed = (now - startTimeRef.current) / 1000
      const speed = Math.min(220, 90 + elapsed * 1.5) // fruit falls faster over time

      const area = areaRef.current
      const areaHeight = area?.clientHeight ?? 500

      setItems((prev) => {
        const next: FallingItem[] = []
        for (const item of prev) {
          const newY = item.y + speed * dt
          const nearBottom = newY + 40 >= areaHeight - 70
          const overBasket = Math.abs(item.x - basketXRef.current) < BASKET_WIDTH_PCT
          if (nearBottom && overBasket) {
            // Caught it! Figure out if it was the right word.
            if (item.word.id === targetRef.current.id) {
              handleCorrectCatch()
            } else {
              handleWrongCatch()
            }
            next.push(spawnItem(targetRef.current))
          } else if (newY > areaHeight) {
            // It fell off the bottom. No penalty, just try again.
            next.push(spawnItem(targetRef.current))
          } else {
            next.push({ ...item, y: newY })
          }
        }
        return next
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, spawnItem])

  function handleCorrectCatch() {
    sfx.correct()
    sfx.coin()
    speak(targetRef.current.es)
    setScore((s) => s + 100)
    setCombo((c) => {
      const next = c + 1
      if (next % 3 === 0) {
        sfx.combo(next)
        setScore((s) => s + 50)
      }
      return next
    })
    setTarget((old) => {
      const others = wordPool.filter((w) => w.id !== old.id)
      return others.length > 0 ? pick(others) : old
    })
  }

  function handleWrongCatch() {
    sfx.wrong()
    setCombo(0)
    setWobble(true)
    setTimeout(() => setWobble(false), 350)
  }

  // Move the basket to a percent position, staying inside the play area.
  const moveBasketTo = useCallback((clientX: number) => {
    const area = areaRef.current
    if (!area) return
    const rect = area.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setBasketX(Math.max(6, Math.min(94, pct)))
  }, [])

  // Arrow keys also move the basket, for kids without a touchscreen or mouse.
  useEffect(() => {
    if (phase !== 'play') return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setBasketX((x) => Math.max(6, x - 6))
      if (e.key === 'ArrowRight') setBasketX((x) => Math.min(94, x + 6))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  // When time runs out, flash "Time!" for a moment, then hand back the score.
  useEffect(() => {
    if (phase !== 'done' || finishedRef.current) return
    finishedRef.current = true
    const t = setTimeout(() => {
      const coinsEarned = Math.min(30, Math.round(score / 10))
      onFinish({ score, coinsEarned })
    }, 500)
    return () => clearTimeout(t)
  }, [phase, score, onFinish])

  return (
    <div className="min-h-screen w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button color="white" size="sm" onClick={onQuit}>
          ✕ Quit
        </Button>
        <div className="flex items-center gap-2">
          {combo >= 2 && (
            <span className="font-display font-extrabold text-lg text-sun animate-pop">🔥×{combo}</span>
          )}
          <div className="font-display font-extrabold text-xl text-white">🍯 {score}</div>
        </div>
      </div>

      {phase === 'play' && <ProgressBar value={timeLeft} max={GAME_SECONDS} color="bg-sun" />}

      <div className="rounded-3xl bg-white/90 px-4 py-3 text-center shadow-chunky-sm">
        <p className="font-body text-sm text-ink-soft">Catch the Spanish word for:</p>
        <p className="font-display font-extrabold text-2xl text-ink">
          {target.en} {target.emoji} {buddyEmoji}
        </p>
      </div>

      <div
        ref={areaRef}
        className="relative overflow-hidden rounded-3xl flex-1"
        style={{ height: '60vh', background: 'linear-gradient(to bottom, #4DA8DA 0%, #4DA8DA 55%, #3DAA47 100%)' }}
        onPointerDown={(e) => moveBasketTo(e.clientX)}
        onPointerMove={(e) => {
          if (e.buttons > 0 || e.pointerType === 'touch') moveBasketTo(e.clientX)
        }}
      >
        {phase === 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="font-display font-extrabold text-6xl text-white animate-pop">
              {countdown > 0 ? countdown : '¡Vamos!'}
            </span>
          </div>
        )}

        {phase === 'done' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="font-display font-extrabold text-5xl text-white animate-pop">Time!</span>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 rounded-full bg-white px-3 py-1 font-display font-bold text-ink shadow-chunky-sm whitespace-nowrap"
            style={{ left: `${item.x}%`, top: item.y }}
          >
            {item.word.es}
          </div>
        ))}

        <div
          className={`absolute bottom-2 -translate-x-1/2 text-6xl select-none ${wobble ? 'animate-shake' : ''}`}
          style={{ left: `${basketX}%` }}
        >
          🧺
        </div>
      </div>

      <p className="text-center text-ink-soft text-sm">Drag, or use ← → arrow keys, to move the basket.</p>
    </div>
  )
}
