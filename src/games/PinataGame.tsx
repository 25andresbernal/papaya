// Piñata Party! 🪅
// Three piñatas swing on screen. One has the right Spanish word.
// Swipe your finger (or mouse) across it like a little sword to slice it open
// before time runs out. Fast slices earn a bonus!

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../types'
import type { MiniGameProps } from './types'
import { sfx, speak } from '../audio/sound'
import { sample, shuffle, randInt } from '../utils/random'
import ProgressBar from '../components/ProgressBar'
import Pic from '../components/Pic'

const ROUNDS = 10
const ROUND_MS = 8000
// Answer inside this window (in milliseconds) to earn a speed bonus.
const BONUS_WINDOW_MS = 2000
const MAX_BONUS = 50
// A swipe has to travel at least this many pixels to count as a real slice,
// so a plain tap can never score by accident.
const SLICE_MIN_LENGTH = 40
// How many recent finger positions we remember, to draw the glowing trail.
const TRAIL_LENGTH = 12
// Colors from our palette, used for the candy that bursts out of a piñata.
const CANDY_COLORS = ['#FF8A3D', '#3DAA47', '#4DA8DA', '#FFC93C', '#FF6B6B']

interface Round {
  target: Word
  // 3 words to show on the piñatas. One of them is the target.
  options: Word[]
}

interface Point {
  x: number
  y: number
}

interface Candy {
  dx: number
  dy: number
  color: string
  round: boolean
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

// Six or eight little candy pieces that fly out when a piñata pops open.
function makeCandyBurst(): Candy[] {
  const count = randInt(6, 8)
  const pieces: Candy[] = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6
    const dist = randInt(35, 70)
    pieces.push({
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 20, // a little upward pop, like real confetti
      color: CANDY_COLORS[i % CANDY_COLORS.length],
      round: i % 2 === 0,
    })
  }
  return pieces
}

// Math helper: does the line from (ax,ay)-(bx,by) cross the line from (cx,cy)-(dx,dy)?
// This is how we check if the sword swipe crossed one edge of a piñata's box.
function segmentsCross(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): boolean {
  const cross = (x1: number, y1: number, x2: number, y2: number) => x1 * y2 - y1 * x2
  const d1 = cross(dx - cx, dy - cy, ax - cx, ay - cy)
  const d2 = cross(dx - cx, dy - cy, bx - cx, by - cy)
  const d3 = cross(bx - ax, by - ay, cx - ax, cy - ay)
  const d4 = cross(bx - ax, by - ay, dx - ax, dy - ay)
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
}

// Does the swipe segment from p1 to p2 touch this piñata's box at all?
// True if either end is already inside the box, or the line crosses one of its 4 sides.
function segmentHitsRect(p1: Point, p2: Point, rect: DOMRect): boolean {
  const inside = (p: Point) => p.x >= rect.left && p.x <= rect.right && p.y >= rect.top && p.y <= rect.bottom
  if (inside(p1) || inside(p2)) return true
  const corners: [Point, Point][] = [
    [{ x: rect.left, y: rect.top }, { x: rect.right, y: rect.top }],
    [{ x: rect.right, y: rect.top }, { x: rect.right, y: rect.bottom }],
    [{ x: rect.right, y: rect.bottom }, { x: rect.left, y: rect.bottom }],
    [{ x: rect.left, y: rect.bottom }, { x: rect.left, y: rect.top }],
  ]
  return corners.some(([c1, c2]) => segmentsCross(p1.x, p1.y, p2.x, p2.y, c1.x, c1.y, c2.x, c2.y))
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
  const [trail, setTrail] = useState<Point[]>([])
  const [showHint, setShowHint] = useState(false)
  const [hintWobbleId, setHintWobbleId] = useState<string | null>(null)
  const [candies, setCandies] = useState<Candy[]>([])

  // Refs hold values we need instantly, without waiting for a re-render.
  const roundStartRef = useRef(0)
  const lockRef = useRef(false)
  const comboRef = useRef(0)

  // Slicing refs: everything the swipe-detector needs, kept out of React state
  // because it changes many times a second while a finger is moving.
  const playAreaRef = useRef<HTMLDivElement | null>(null)
  const pinataRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const pinataRectsRef = useRef<Record<string, DOMRect>>({})
  const playAreaRectRef = useRef<DOMRect | null>(null)
  const lastPointRef = useRef<Point | null>(null)
  const swipeLenRef = useRef(0)
  const pointerDownRef = useRef(false)
  const slicedSetRef = useRef<Set<string>>(new Set())
  const slicedThisStrokeRef = useRef(false)
  const hintShownRef = useRef(false)

  const round = rounds[roundIndex]

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

  // Every new round gets a fresh 8-second clock and a clean slate for slicing.
  useEffect(() => {
    if (phase !== 'play') return
    setStatus('idle')
    setPickedId(null)
    setTrail([])
    setCandies([])
    lockRef.current = false
    slicedSetRef.current = new Set()
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

  // A piñata got sliced open. Same scoring as before, just triggered by a swipe now.
  function sliceWord(word: Word, isCorrect: boolean) {
    if (lockRef.current || phase !== 'play') return
    lockRef.current = true
    slicedThisStrokeRef.current = true
    setPickedId(word.id)
    const elapsed = Date.now() - roundStartRef.current

    if (isCorrect) {
      sfx.correct()
      sfx.coin()
      speak(word.es)
      setStatus('correct')
      setCandies(makeCandyBurst())
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

  // Finger (or mouse) touched down: remember where every piñata is right now,
  // so the fast-moving swipe check below never has to re-measure the page.
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (phase !== 'play' || lockRef.current || !round) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Some environments do not support pointer capture. The game still works.
    }
    const playRect = playAreaRef.current?.getBoundingClientRect() ?? null
    playAreaRectRef.current = playRect
    const rects: Record<string, DOMRect> = {}
    for (const opt of round.options) {
      const el = pinataRefs.current[opt.id]
      if (el) rects[opt.id] = el.getBoundingClientRect()
    }
    pinataRectsRef.current = rects
    swipeLenRef.current = 0
    slicedThisStrokeRef.current = false
    pointerDownRef.current = true
    lastPointRef.current = { x: e.clientX, y: e.clientY }
    setTrail(playRect ? [{ x: e.clientX - playRect.left, y: e.clientY - playRect.top }] : [])
  }

  // Finger is moving: grow the trail, and check if it just swiped through a piñata.
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointerDownRef.current || phase !== 'play' || lockRef.current || !round) return
    const last = lastPointRef.current
    if (!last) return
    const here = { x: e.clientX, y: e.clientY }
    const segLen = Math.hypot(here.x - last.x, here.y - last.y)
    if (segLen >= 1) {
      swipeLenRef.current += segLen
      if (swipeLenRef.current >= SLICE_MIN_LENGTH) {
        for (const opt of round.options) {
          if (slicedSetRef.current.has(opt.id)) continue
          const rect = pinataRectsRef.current[opt.id]
          if (rect && segmentHitsRect(last, here, rect)) {
            slicedSetRef.current.add(opt.id)
            sliceWord(opt, opt.id === round.target.id)
            break
          }
        }
      }
      lastPointRef.current = here
    }
    const playRect = playAreaRectRef.current
    if (playRect) {
      setTrail((pts) => [...pts, { x: here.x - playRect.left, y: here.y - playRect.top }].slice(-TRAIL_LENGTH))
    }
  }

  // Finger lifted. If nothing got sliced, it was just a tap: a soft sound,
  // and (only the very first time) a little "swipe to slice" hint.
  function handlePointerUp() {
    if (!pointerDownRef.current) return
    pointerDownRef.current = false
    const madeSlice = slicedThisStrokeRef.current
    const last = lastPointRef.current
    setTrail([])
    if (madeSlice || !round) return

    sfx.tap()
    if (hintShownRef.current) return
    hintShownRef.current = true
    setShowHint(true)
    setTimeout(() => setShowHint(false), 1400)
    const tapped = last
      ? round.options.find((opt) => {
          const rect = pinataRectsRef.current[opt.id]
          return rect && last.x >= rect.left && last.x <= rect.right && last.y >= rect.top && last.y <= rect.bottom
        })
      : undefined
    if (tapped) {
      setHintWobbleId(tapped.id)
      setTimeout(() => setHintWobbleId(null), 500)
    }
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

  return (
    <div className="min-h-screen w-full max-w-md mx-auto px-4 flex flex-col">
      {/* The piñatas swing gently until one is sliced open. */}
      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-swing { animation: swing 1.6s ease-in-out infinite; }

        @keyframes split-left {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-42px, 34px) rotate(-55deg); opacity: 0; }
        }
        @keyframes split-right {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(42px, 34px) rotate(55deg); opacity: 0; }
        }
        .pinata-half {
          position: absolute;
          top: 0;
          left: 0;
          animation-duration: 500ms;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
        .pinata-half-left { animation-name: split-left; }
        .pinata-half-right { animation-name: split-right; }

        @keyframes candy-fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0.4); opacity: 0; }
        }
        .candy-piece {
          position: absolute;
          top: 28px;
          left: 28px;
          width: 10px;
          height: 10px;
          animation: candy-fly 600ms ease-out forwards;
        }
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
            <div className="text-center mb-2 flex flex-col items-center gap-1">
              <div className="text-base font-bold text-ink-soft">Slice:</div>
              <div className="font-display font-black text-3xl text-seed flex items-center gap-2">
                {round.target.en}
                <Pic emoji={round.target.emoji} size={40} label={round.target.en} />
              </div>
            </div>

            {/* The play area: a sword-swipe zone. touch-action none stops the
                page from scrolling while a kid is slicing with their finger. */}
            <div
              ref={playAreaRef}
              className="relative flex-1 w-full select-none"
              style={{ minHeight: '60vh', touchAction: 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="absolute inset-0 flex justify-around items-start pt-1">
                {round.options.map((opt, i) => {
                  const isCorrect = opt.id === round.target.id
                  const isPicked = pickedId === opt.id
                  const splitting = isPicked && status === 'correct'
                  const wobble = (isPicked && status === 'wrong') || hintWobbleId === opt.id
                  const glow = status !== 'idle' && status !== 'correct' && isCorrect
                  return (
                    <div
                      key={opt.id}
                      ref={(el) => {
                        pinataRefs.current[opt.id] = el
                      }}
                      data-word={opt.es}
                      data-correct={isCorrect ? 'true' : 'false'}
                      className={`relative flex flex-col items-center gap-1 rounded-2xl p-2 min-w-[100px] min-h-[150px] justify-start
                        ${glow ? 'ring-4 ring-leaf bg-leaf/10' : ''}`}
                    >
                      {/* the string it hangs from: different lengths so the piñatas are spread out */}
                      <div className="w-0.5 bg-seed/40" style={{ height: [70, 24, 110][i % 3] }} />
                      <div
                        className={`relative flex flex-col items-center gap-1 origin-top
                          ${!lockRef.current ? 'animate-swing' : ''} ${wobble ? 'animate-shake' : ''}`}
                        style={{ animationDelay: `${i * 0.25}s` }}
                      >
                        {!splitting && <Pic emoji="🪅" size={88} label={opt.es} />}
                        {splitting && (
                          <div className="relative" style={{ width: 64, height: 64 }}>
                            <div className="pinata-half pinata-half-left">
                              <div style={{ clipPath: 'inset(0 50% 0 0)' }}>
                                <Pic emoji="🪅" size={88} />
                              </div>
                            </div>
                            <div className="pinata-half pinata-half-right">
                              <div style={{ clipPath: 'inset(0 0 0 50%)' }}>
                                <Pic emoji="🪅" size={88} />
                              </div>
                            </div>
                            {candies.map((c, ci) => (
                              <span
                                key={ci}
                                className="candy-piece"
                                style={
                                  {
                                    background: c.color,
                                    borderRadius: c.round ? '50%' : '3px',
                                    '--dx': `${c.dx}px`,
                                    '--dy': `${c.dy}px`,
                                  } as React.CSSProperties
                                }
                              />
                            ))}
                          </div>
                        )}
                        {isPicked && status === 'wrong' && <div className="text-2xl">❌</div>}
                        {splitting && (
                          <div className="text-lg font-display font-black text-leaf animate-pop">¡Ñam!</div>
                        )}
                      </div>
                      <div className="font-display font-bold text-sm text-seed bg-cream rounded-full px-2 py-1">
                        {opt.es}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* The glowing sword trail. It follows the finger while it is down. */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                {trail.slice(1).map((p, idx) => {
                  const prev = trail[idx]
                  const t = (idx + 1) / Math.max(1, trail.length - 1)
                  return (
                    <g key={idx}>
                      <line x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} stroke="#FFC93C" strokeWidth={16} strokeLinecap="round" opacity={t * 0.45} />
                      <line x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} stroke="#ffffff" strokeWidth={5} strokeLinecap="round" opacity={t} />
                    </g>
                  )
                })}
              </svg>

              {showHint && (
                <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none">
                  <span className="inline-block bg-black/70 text-white font-display font-bold text-sm rounded-full px-3 py-1 animate-pop">
                    Swipe to slice!
                  </span>
                </div>
              )}
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
