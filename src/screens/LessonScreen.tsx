// The screen where a kid actually plays a Word Battle: a short intro card that
// previews the words, then a run of exercises, then the payoff screen.

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getLesson, wordsForLesson } from '../data/words'
import { getCharacter } from '../data/characters'
import { usePlayer } from '../game/PlayerContext'
import { buildLessonExercises } from '../game/exercises'
import type { Exercise, ExerciseResult, LessonSummary } from '../types'
import Screen from '../components/Screen'
import BackButton from '../components/BackButton'
import ProgressBar from '../components/ProgressBar'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Mascot from '../components/Mascot'
import SpeakButton from '../components/SpeakButton'
import ExerciseRunner from '../components/exercises/ExerciseRunner'
import LessonComplete from '../components/exercises/LessonComplete'
import { mascotLine } from '../ai/mascot'

export default function LessonScreen() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { player, completeLesson } = usePlayer()
  const loc = lessonId ? getLesson(lessonId) : undefined

  // A lesson id that doesn't exist sends the kid back to the map instead of a blank page.
  useEffect(() => {
    if (!loc) navigate('/path', { replace: true })
  }, [loc, navigate])

  const [runKey, setRunKey] = useState(0)
  const [exercises, setExercises] = useState<Exercise[]>(() => (loc ? buildLessonExercises(loc.lesson, player) : []))
  const [started, setStarted] = useState(false)
  const [showQuit, setShowQuit] = useState(false)
  const [done, setDone] = useState(0)
  const [total, setTotal] = useState(exercises.length)
  const [combo, setCombo] = useState(0)
  const [summary, setSummary] = useState<LessonSummary | null>(null)
  const completedRef = useRef(false)

  function handleFinish(results: ExerciseResult[]) {
    if (!loc || completedRef.current) return
    completedRef.current = true
    const s = completeLesson(loc.lesson.id, loc.unit.id, results)
    setSummary(s)
  }

  function restart() {
    if (!loc) return
    completedRef.current = false
    setSummary(null)
    setDone(0)
    setTotal(exercises.length)
    setCombo(0)
    setExercises(buildLessonExercises(loc.lesson, player))
    setRunKey((k) => k + 1)
  }

  if (!loc) return null

  const buddy = getCharacter(player.buddyId)
  const words = wordsForLesson(loc.lesson)
  const noExercises = exercises.length === 0

  return (
    <Screen topBar={false} nav={false}>
      <div className="flex items-center gap-3 pt-3">
        <BackButton onClick={() => setShowQuit(true)} label="Quit lesson" />
        <ProgressBar value={done} max={Math.max(total, 1)} color="bg-leaf" className="flex-1" />
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
            <Button color="coral" full onClick={() => navigate('/path')}>
              Quit
            </Button>
          </div>
        </Modal>
      )}

      {noExercises ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <Mascot buddyId={player.buddyId} mood="thinking" message="This lesson has no words yet!" />
          <Button color="leaf" size="lg" onClick={() => navigate('/path')}>
            Back to map
          </Button>
        </div>
      ) : summary ? (
        <LessonComplete
          summary={summary}
          player={player}
          onPlayAgain={restart}
          onPractice={() => navigate('/practice')}
          onContinue={() => navigate('/path')}
        />
      ) : !started ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <Mascot
            buddyId={player.buddyId}
            mood="excited"
            size="lg"
            message={mascotLine('lessonStart', {
              name: player.name,
              lessonTitle: loc.lesson.title,
              catchphrase: buddy.catchphrase,
            })}
          />
          <h1 className="font-display text-2xl font-bold">{loc.lesson.title}</h1>
          <div className="flex flex-wrap gap-2 justify-center">
            {words.map((w) => (
              <div key={w.id} className="flex items-center gap-2 bg-white rounded-2xl pl-3 pr-2 py-2 shadow-chunky-sm">
                <span className="text-2xl leading-none">{w.emoji}</span>
                <span className="font-display font-bold">{w.es}</span>
                <SpeakButton text={w.es} size="sm" />
              </div>
            ))}
          </div>
          <Button color="leaf" size="xl" full onClick={() => setStarted(true)}>
            Start
          </Button>
        </div>
      ) : (
        <ExerciseRunner
          key={runKey}
          exercises={exercises}
          player={player}
          onFinish={handleFinish}
          onQuit={() => navigate('/path')}
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
