// Color Splash: a tiny coloring book that teaches Spanish color words.
// One shape at a time needs a color. We say the Spanish color word out loud.
// Tap the matching swatch and the shape fills in. Finish the picture to win!

import { useEffect, useState } from 'react'
import type { MiniGameProps } from './types'
import { sfx, speak } from '../audio/sound'
import Button from '../components/Button'
import Confetti from '../components/Confetti'

/** The six Spanish color words we teach, with their real hex color. */
const COLORS = [
  { id: 'rojo', hex: '#E21B3C' },
  { id: 'azul', hex: '#1368CE' },
  { id: 'amarillo', hex: '#FFC93C' },
  { id: 'verde', hex: '#26890C' },
  { id: 'naranja', hex: '#FF8A3D' },
  { id: 'morado', hex: '#B388FF' },
] as const

type ColorId = (typeof COLORS)[number]['id']

/** One paintable shape in the picture, and which color it needs. */
interface SceneShape {
  id: string
  name: string
  emoji: string
  targetColorId: ColorId
}

const SHAPES: SceneShape[] = [
  { id: 'sun', name: 'Sun', emoji: '☀️', targetColorId: 'amarillo' },
  { id: 'cloud', name: 'Cloud', emoji: '☁️', targetColorId: 'azul' },
  { id: 'roof', name: 'Roof', emoji: '🏠', targetColorId: 'rojo' },
  { id: 'wall', name: 'House', emoji: '🏡', targetColorId: 'verde' },
  { id: 'door', name: 'Door', emoji: '🚪', targetColorId: 'naranja' },
  { id: 'trunk', name: 'Tree trunk', emoji: '🌳', targetColorId: 'morado' },
  { id: 'treetop', name: 'Tree top', emoji: '🌳', targetColorId: 'verde' },
  { id: 'grass', name: 'Grass', emoji: '🌱', targetColorId: 'amarillo' },
]

const OUTLINE = '#2D2A26'
const BLANK = '#FFFFFF'

export default function PaintGame({ onFinish, onQuit, buddyEmoji }: MiniGameProps) {
  const [phase, setPhase] = useState<'ready' | 'play' | 'done'>('ready')
  const [countdown, setCountdown] = useState(3)
  const [index, setIndex] = useState(0)
  const [filled, setFilled] = useState<Record<string, string>>({})
  const [mistakes, setMistakes] = useState(0)
  const [score, setScore] = useState(0)
  const [flashId, setFlashId] = useState<string | null>(null)

  const current = SHAPES[index]

  // Countdown: "3... 2... 1..." then start. This runs once per game (not once
  // per tick) so it does not keep re-triggering itself.
  useEffect(() => {
    if (phase !== 'ready') return
    let n = 3
    setCountdown(n)
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      sfx.tick()
      n -= 1
      if (n < 0) {
        setPhase('play')
        return
      }
      setCountdown(n)
      timer = setTimeout(tick, 700)
    }
    timer = setTimeout(tick, 700)
    return () => clearTimeout(timer)
  }, [phase])

  // Say the color word out loud whenever a new shape needs painting.
  useEffect(() => {
    if (phase !== 'play' || !current) return
    const t = setTimeout(() => speak(current.targetColorId), 200)
    return () => clearTimeout(t)
  }, [phase, current])

  // The picture is done! Celebrate, then hand back the score.
  useEffect(() => {
    if (phase !== 'done') return
    const t = setTimeout(() => {
      const bonus = mistakes === 0 ? 200 : 0
      const finalScore = score + bonus
      const coinsEarned = Math.min(30, Math.round(finalScore / 10))
      onFinish({ score: finalScore, coinsEarned })
    }, 1100)
    return () => clearTimeout(t)
  }, [phase, mistakes, score, onFinish])

  function handleColorTap(colorId: ColorId) {
    if (phase !== 'play' || !current) return
    const colorHex = COLORS.find((c) => c.id === colorId)?.hex ?? BLANK
    if (colorId === current.targetColorId) {
      sfx.correct()
      sfx.coin()
      setFilled((prev) => ({ ...prev, [current.id]: colorHex }))
      setScore((s) => s + 100)
      if (index + 1 >= SHAPES.length) {
        setPhase('done')
      } else {
        setIndex((i) => i + 1)
      }
    } else {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setFlashId(current.id)
      setTimeout(() => setFlashId(null), 400)
    }
  }

  function colorFor(shapeId: string): string {
    return filled[shapeId] ?? BLANK
  }

  function flashClass(shapeId: string): string {
    return flashId === shapeId ? 'animate-shake' : ''
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button color="white" size="sm" onClick={onQuit}>
          ✕ Quit
        </Button>
        <div className="font-display font-extrabold text-xl text-seed">🎨 {score}</div>
      </div>

      {current && (
        <div className="rounded-3xl bg-white px-4 py-3 text-center shadow-chunky-sm">
          <p className="font-body text-sm text-ink-soft">
            Paint the {current.name} {current.emoji} {buddyEmoji}
          </p>
          <p className="font-display font-extrabold text-3xl" style={{ color: OUTLINE }}>
            {current.targetColorId}
          </p>
        </div>
      )}

      <div className="relative rounded-3xl bg-sky/20 flex-1 flex items-center justify-center p-2">
        {phase === 'ready' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 rounded-3xl">
            <span className="font-display font-extrabold text-6xl text-white animate-pop">
              {countdown > 0 ? countdown : '¡Vamos!'}
            </span>
          </div>
        )}
        {phase === 'done' && (
          <>
            <Confetti />
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 rounded-3xl">
              <span className="font-display font-extrabold text-4xl text-white animate-pop drop-shadow">
                ¡Qué bonito!
              </span>
            </div>
          </>
        )}

        <svg viewBox="0 0 300 260" className="w-full max-w-xs" role="img" aria-label="A picture to color">
          {/* Sky */}
          <rect x="0" y="0" width="300" height="260" fill="#EAF6FF" />
          {/* Sun */}
          <circle
            className={flashClass('sun')}
            cx="240"
            cy="55"
            r="30"
            fill={colorFor('sun')}
            stroke={OUTLINE}
            strokeWidth="4"
          />
          {/* Cloud */}
          <ellipse
            className={flashClass('cloud')}
            cx="75"
            cy="55"
            rx="40"
            ry="20"
            fill={colorFor('cloud')}
            stroke={OUTLINE}
            strokeWidth="4"
          />
          {/* Grass */}
          <rect
            className={flashClass('grass')}
            x="0"
            y="210"
            width="300"
            height="50"
            fill={colorFor('grass')}
            stroke={OUTLINE}
            strokeWidth="4"
          />
          {/* Tree trunk */}
          <rect
            className={flashClass('trunk')}
            x="40"
            y="150"
            width="18"
            height="60"
            fill={colorFor('trunk')}
            stroke={OUTLINE}
            strokeWidth="4"
          />
          {/* Tree top */}
          <circle
            className={flashClass('treetop')}
            cx="49"
            cy="140"
            r="35"
            fill={colorFor('treetop')}
            stroke={OUTLINE}
            strokeWidth="4"
          />
          {/* House wall */}
          <rect
            className={flashClass('wall')}
            x="140"
            y="150"
            width="100"
            height="80"
            fill={colorFor('wall')}
            stroke={OUTLINE}
            strokeWidth="4"
          />
          {/* Roof */}
          <polygon
            className={flashClass('roof')}
            points="130,150 190,105 250,150"
            fill={colorFor('roof')}
            stroke={OUTLINE}
            strokeWidth="4"
          />
          {/* Door */}
          <rect
            className={flashClass('door')}
            x="178"
            y="185"
            width="24"
            height="45"
            fill={colorFor('door')}
            stroke={OUTLINE}
            strokeWidth="4"
          />
        </svg>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.id}
            title={c.id}
            onClick={() => handleColorTap(c.id)}
            disabled={phase !== 'play'}
            className="btn-chunky h-14 rounded-2xl border-4 border-white cursor-pointer disabled:cursor-default"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </div>
  )
}
