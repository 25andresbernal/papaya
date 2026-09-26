// Jungle Run: an endless runner. Logs roll in from the right.
// Answer the Spanish question fast to jump over the log.
// Miss it, and you lose a life. Clear 15 logs to win!

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Word } from '../types'
import type { MiniGameProps } from './types'
import { sfx, speak } from '../audio/sound'
import { pick, sample, shuffle, uid } from '../utils/random'
import Button from '../components/Button'

const HERO_X_PCT = 16 // where the hero stands, as % across the track
const QUESTION_LEAD_MS = 2000 // show the question this long before the log arrives
const LOGS_TO_WIN = 15
const START_LIVES = 3

/** Info about the log currently rolling toward the hero. Only lives in a ref
 *  so our game loop always sees the freshest numbers, never stale ones. */
interface ObstacleMeta {
  id: string
  spawnedAt: number
  travelMs: number
  questionShown: boolean
  resolved: boolean
  correctWordId: string
}

interface ObstacleView {
  id: string
  xPercent: number
}

interface QuestionView {
  prompt: Word
  options: Word[]
  correctId: string
}

const FALLBACK_WORDS: Word[] = [
  { id: 'hola', es: 'hola', en: 'hello', emoji: '👋' },
  { id: 'agua', es: 'agua', en: 'water', emoji: '💧' },
  { id: 'sol', es: 'sol', en: 'sun', emoji: '☀️' },
]

export default function RunGame({ knownWords, onFinish, onQuit, buddyEmoji }: MiniGameProps) {
  const wordPool = knownWords.length >= 3 ? knownWords : FALLBACK_WORDS

  const [phase, setPhase] = useState<'ready' | 'play' | 'done'>('ready')
  const [countdown, setCountdown] = useState(3)
  const [livesUI, setLivesUI] = useState(START_LIVES)
  const [logsUI, setLogsUI] = useState(0)
  const [scoreUI, setScoreUI] = useState(0)
  const [distanceUI, setDistanceUI] = useState(0)
  const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null)
  const [heroAnim, setHeroAnim] = useState<'idle' | 'jump' | 'bump'>('idle')
  const [obstacle, setObstacle] = useState<ObstacleView | null>(null)
  const [question, setQuestion] = useState<QuestionView | null>(null)

  // The real, always-up-to-date game numbers. State above is just for drawing the screen.
  const livesRef = useRef(START_LIVES)
  const logsRef = useRef(0)
  const scoreRef = useRef(0)
  const distanceRef = useRef(0)
  const metaRef = useRef<ObstacleMeta | null>(null)
  const nextSpawnAtRef = useRef(0)
  const finishedRef = useRef(false)

  const speedStage = () => Math.floor(logsRef.current / 5)

  const showQuestion = useCallback(() => {
    const target = pick(wordPool)
    const others = wordPool.filter((w) => w.id !== target.id)
    const distractors = sample(others, Math.min(2, others.length))
    const options = shuffle([target, ...distractors])
    if (metaRef.current) metaRef.current.correctWordId = target.id
    setQuestion({ prompt: target, options, correctId: target.id })
  }, [wordPool])

  const spawnObstacle = useCallback(
    (now: number) => {
      const id = uid('log')
      const travelMs = Math.max(1800, 3500 - speedStage() * 300)
      metaRef.current = { id, spawnedAt: now, travelMs, questionShown: false, resolved: false, correctWordId: '' }
      setObstacle({ id, xPercent: 100 })
      setQuestion(null)
    },
    [],
  )

  // Handle a log being cleared (correct) or hit (wrong / too slow).
  const resolveObstacle = useCallback((correct: boolean) => {
    const meta = metaRef.current
    if (!meta || meta.resolved) return
    meta.resolved = true

    if (correct) {
      scoreRef.current += 100
      logsRef.current += 1
      setScoreUI(scoreRef.current)
      setLogsUI(logsRef.current)
      setHeroAnim('jump')
      sfx.correct()
      speak(meta.correctWordId)
    } else {
      livesRef.current -= 1
      setLivesUI(livesRef.current)
      setHeroAnim('bump')
      sfx.wrong()
    }
    setTimeout(() => setHeroAnim('idle'), 400)

    setObstacle(null)
    setQuestion(null)

    if (livesRef.current <= 0) {
      setOutcome('lose')
      setPhase('done')
    } else if (logsRef.current >= LOGS_TO_WIN) {
      setOutcome('win')
      setPhase('done')
    } else {
      nextSpawnAtRef.current = performance.now() + Math.max(500, 1000 - speedStage() * 100)
    }
  }, [])

  function handleAnswer(word: Word) {
    if (phase !== 'play' || !question || !metaRef.current || metaRef.current.resolved) return
    resolveObstacle(word.id === question.correctId)
  }

  // Countdown: "3... 2... 1..." then go.
  useEffect(() => {
    if (phase !== 'ready') return
    if (countdown <= 0) {
      setPhase('play')
      nextSpawnAtRef.current = performance.now() + 500
      return
    }
    sfx.tick()
    const t = setTimeout(() => setCountdown((c) => c - 1), 700)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // Number keys 1-3 also answer the question, for kids without a mouse.
  useEffect(() => {
    if (phase !== 'play' || !question) return
    function onKey(e: KeyboardEvent) {
      const n = Number(e.key)
      if (n >= 1 && n <= (question?.options.length ?? 0)) {
        const chosen = question?.options[n - 1]
        if (chosen) handleAnswer(chosen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question])

  // The main loop: run every animation frame while playing.
  useEffect(() => {
    if (phase !== 'play') return
    let raf = 0
    let last = performance.now()

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      distanceRef.current += dt * 20
      setDistanceUI(Math.round(distanceRef.current))

      const meta = metaRef.current
      if (!meta) {
        if (now >= nextSpawnAtRef.current) spawnObstacle(now)
      } else if (!meta.resolved) {
        const elapsed = now - meta.spawnedAt
        const progress = elapsed / meta.travelMs
        const xPercent = 100 - progress * (100 - HERO_X_PCT)

        if (!meta.questionShown && meta.travelMs - elapsed <= QUESTION_LEAD_MS) {
          meta.questionShown = true
          showQuestion()
        }

        if (xPercent <= HERO_X_PCT) {
          resolveObstacle(false) // the log reached the hero before an answer was picked
        } else {
          setObstacle({ id: meta.id, xPercent })
        }
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [phase, spawnObstacle, resolveObstacle, showQuestion])

  // Game over (win or lose): flash a message, then hand back the score.
  useEffect(() => {
    if (phase !== 'done' || finishedRef.current) return
    finishedRef.current = true
    const t = setTimeout(() => {
      const finalScore = scoreRef.current + Math.round(distanceRef.current / 10)
      const coinsEarned = Math.min(30, Math.round(finalScore / 10))
      onFinish({ score: finalScore, coinsEarned })
    }, 900)
    return () => clearTimeout(t)
  }, [phase, onFinish])

  return (
    <div className="min-h-screen w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-3">
      <style>{`
        @keyframes track-scroll { from { background-position-x: 0; } to { background-position-x: -80px; } }
        .track-scroll { animation: track-scroll 0.6s linear infinite; }
        @keyframes run-jump { 0% { transform: translateY(0); } 40% { transform: translateY(-38px); } 100% { transform: translateY(0); } }
        .run-jump { animation: run-jump 0.4s ease-out; }
      `}</style>

      <div className="flex items-center justify-between">
        <Button color="white" size="sm" onClick={onQuit}>
          ✕ Quit
        </Button>
        <div className="font-display font-extrabold text-xl text-white">🏃 {scoreUI}</div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-white/90 px-3 py-2">
        <div className="text-2xl">{'🥭'.repeat(livesUI) + '🤎'.repeat(START_LIVES - livesUI)}</div>
        <div className="font-display font-bold text-ink">
          {logsUI}/{LOGS_TO_WIN} logs · {distanceUI}m
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl flex-1"
        style={{ height: '52vh', background: 'linear-gradient(to bottom, #4DA8DA 0%, #4DA8DA 65%, #2E8A38 65%, #2E8A38 100%)' }}
      >
        <div
          className={`absolute left-0 right-0 track-scroll ${phase !== 'play' ? '[animation-play-state:paused]' : ''}`}
          style={{
            bottom: 0,
            height: '35%',
            backgroundImage: 'repeating-linear-gradient(90deg, #266f2e 0 20px, #2E8A38 20px 80px)',
          }}
        />

        {phase === 'ready' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
            <span className="font-display font-extrabold text-6xl text-white animate-pop">
              {countdown > 0 ? countdown : '¡Corre!'}
            </span>
          </div>
        )}

        {phase === 'done' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
            <span className="font-display font-extrabold text-4xl text-white animate-pop text-center px-4">
              {outcome === 'win' ? '¡Ganaste! 🎉' : 'Buen intento'}
            </span>
          </div>
        )}

        <div
          className={`absolute text-6xl select-none ${
            heroAnim === 'jump' ? 'run-jump' : heroAnim === 'bump' ? 'animate-shake' : 'animate-bounce-soft'
          }`}
          style={{ left: `${HERO_X_PCT}%`, bottom: '30%', transform: 'translateX(-50%)' }}
        >
          {buddyEmoji}
        </div>

        {obstacle && (
          <div
            className="absolute text-5xl select-none"
            style={{ left: `${obstacle.xPercent}%`, bottom: '30%', transform: 'translateX(-50%)' }}
          >
            🪵
          </div>
        )}
      </div>

      {question && (
        <div className="rounded-3xl bg-white p-4 shadow-chunky-sm flex flex-col gap-3 animate-pop">
          <p className="text-center font-display font-extrabold text-xl text-ink">
            {question.prompt.en} {question.prompt.emoji}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {question.options.map((opt) => (
              <Button key={opt.id} color="sky" full onClick={() => handleAnswer(opt)}>
                {opt.es}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
