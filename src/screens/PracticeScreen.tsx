// Practice mode: a quick session built from the words the kid is still shaky on.
// Same engine as a lesson, but it isn't tied to one place on the map.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWord } from '../data/words'
import { usePlayer } from '../game/PlayerContext'
import { buildPracticeExercises } from '../game/exercises'
import type { Exercise, ExerciseResult, LessonSummary } from '../types'
import Screen from '../components/Screen'
import BackButton from '../components/BackButton'
import ProgressBar from '../components/ProgressBar'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Mascot from '../components/Mascot'
import SpeakButton from '../components/SpeakButton'
import Pic from '../components/Pic'
import ExerciseRunner from '../components/exercises/ExerciseRunner'
import LessonComplete from '../components/exercises/LessonComplete'
import { mascotLine } from '../ai/mascot'
import { formatMsShort } from '../utils/format'

export default function PracticeScreen() {
  const navigate = useNavigate()
  const { player, completeLesson } = usePlayer()

  const [runKey, setRunKey] = useState(0)
  const [exercises, setExercises] = useState<Exercise[]>(() => buildPracticeExercises(player))
  const [started, setStarted] = useState(false)
  const [showQuit, setShowQuit] = useState(false)
  const [done, setDone] = useState(0)
  const [total, setTotal] = useState(exercises.length)
  const [combo, setCombo] = useState(0)
  const [summary, setSummary] = useState<LessonSummary | null>(null)
  const completedRef = useRef(false)

  const previewWords = useMemo(() => {
    const ids = [...new Set(exercises.map((e) => e.targetWordId))]
    return ids.map(getWord).filter((w): w is NonNullable<typeof w> => !!w)
  }, [exercises])

  // The stopwatch: starts the moment the kid taps Start, not during the intro card.
  const startedAtRef = useRef<number | null>(null)
  const [liveMs, setLiveMs] = useState(0)

  useEffect(() => {
    if (!started || summary) return
    const iv = window.setInterval(() => {
      setLiveMs(startedAtRef.current ? Date.now() - startedAtRef.current : 0)
    }, 100)
    return () => window.clearInterval(iv)
  }, [started, summary])

  function beginRun() {
    startedAtRef.current = Date.now()
    setLiveMs(0)
    setStarted(true)
  }

  function handleFinish(results: ExerciseResult[]) {
    if (completedRef.current) return
    completedRef.current = true
    const elapsedMs = startedAtRef.current ? Date.now() - startedAtRef.current : 0
    const s = completeLesson('practice', 'practice', results, elapsedMs)
    setSummary(s)
  }

  function restart() {
    completedRef.current = false
    setSummary(null)
    setDone(0)
    setCombo(0)
    const fresh = buildPracticeExercises(player)
    setExercises(fresh)
    setTotal(fresh.length)
    startedAtRef.current = Date.now()
    setLiveMs(0)
    setRunKey((k) => k + 1)
  }

  const noExercises = exercises.length === 0

  return (
    <Screen topBar={false} nav={false}>
      <div className="flex items-center gap-3 pt-3">
        <BackButton onClick={() => setShowQuit(true)} label="Quit practice" />
        <ProgressBar value={done} max={Math.max(total, 1)} color="bg-leaf" className="flex-1" />
        {started && !summary && player.settings.raceClock && (
          <span
            className="font-display font-bold text-sky-dark whitespace-nowrap"
            aria-label={`Time ${formatMsShort(liveMs)}`}
          >
            ⏱ {formatMsShort(liveMs)}
          </span>
        )}
        {combo >= 2 && (
          <span className="font-display font-bold text-coral whitespace-nowrap" aria-label={`Combo ${combo}`}>
            🔥 x{combo}
          </span>
        )}
      </div>

      {showQuit && (
        <Modal onClose={() => setShowQuit(false)}>
          <p className="font-display text-xl font-bold mb-5">Stop now? You keep nothing yet.</p>
          <div className="flex gap-3">
            <Button color="white" full onClick={() => setShowQuit(false)}>
              Keep going
            </Button>
            <Button color="coral" full onClick={() => navigate('/')}>
              Quit
            </Button>
          </div>
        </Modal>
      )}

      {noExercises ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <Mascot buddyId={player.buddyId} mood="happy" message="Nothing to practice yet! Play a lesson first." />
          <Button color="leaf" size="lg" onClick={() => navigate('/')}>
            Back home
          </Button>
        </div>
      ) : summary ? (
        <LessonComplete
          summary={summary}
          player={player}
          onPlayAgain={restart}
          onPractice={restart}
          onContinue={() => navigate('/')}
        />
      ) : !started ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <Mascot buddyId={player.buddyId} mood="excited" size="lg" message={mascotLine('practice', { name: player.name })} />
          <h1 className="font-display text-2xl font-bold">Practice time</h1>
          {player.lessonBestMs.practice !== undefined && (
            <p className="font-display font-bold text-sky-dark">
              ⏱ Your best: {formatMsShort(player.lessonBestMs.practice)}. Beat it!
            </p>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            {previewWords.map((w) => (
              <div key={w.id} className="flex items-center gap-2 bg-white rounded-2xl pl-3 pr-2 py-2 shadow-chunky-sm">
                <Pic emoji={w.emoji} size={28} className="leading-none" label={w.en} />
                <span className="font-display font-bold">{w.es}</span>
                <SpeakButton text={w.es} size="sm" />
              </div>
            ))}
          </div>
          <Button color="leaf" size="xl" full onClick={beginRun}>
            Start
          </Button>
        </div>
      ) : (
        <ExerciseRunner
          key={runKey}
          exercises={exercises}
          player={player}
          onFinish={handleFinish}
          onQuit={() => navigate('/')}
          onProgress={(d, t) => {
            setDone(d)
            setTotal(t)
          }}
          onCombo={setCombo}
        />
      )}
    </Screen>
  )
}
