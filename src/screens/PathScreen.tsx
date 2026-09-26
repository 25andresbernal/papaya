// The world map: a winding path of lesson stops, grouped into themed units.
// Locked stops are grey. The next stop to play glows and pulses. Finished
// stops turn green and show crowns. The hero stands next to the current stop.

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import Hero from '../components/Hero'
import Button from '../components/Button'
import Pic from '../components/Pic'
import { usePlayer } from '../game/PlayerContext'
import { sfx } from '../audio/sound'
import { ALL_LESSONS, UNITS, isLessonUnlocked, isUnitComplete, nextLesson, wordsForLesson } from '../data/words'
import { WORLD_TITLE, WORLD_SUBTITLE } from '../data/curriculum'
import { formatMsShort } from '../utils/format'
import type { UnitColor } from '../types'

/** Maps each unit's theme color name to a real Tailwind background class. */
const UNIT_BG: Record<UnitColor, string> = {
  papaya: 'bg-papaya',
  sky: 'bg-sky',
  leaf: 'bg-leaf',
  sun: 'bg-sun',
  coral: 'bg-coral',
}

export default function PathScreen() {
  const { player } = usePlayer()
  const navigate = useNavigate()
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [shakeId, setShakeId] = useState<string | null>(null)

  // The stop the kid should play next. If everything is done, point at the last one.
  const upcoming = nextLesson(player)
  const currentLessonId = upcoming
    ? upcoming.lesson.id
    : (ALL_LESSONS[ALL_LESSONS.length - 1]?.lesson.id ?? null)

  // Scroll the path so the current stop is right in the middle when the page opens.
  useEffect(() => {
    if (!currentLessonId) return
    nodeRefs.current[currentLessonId]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [currentLessonId])

  function tapLocked(id: string) {
    sfx.wrong()
    setShakeId(id)
    window.setTimeout(() => setShakeId((s) => (s === id ? null : s)), 400)
  }

  return (
    <Screen>
      <div className="pt-2 pb-2 text-center relative">
        <h1 className="font-display text-3xl font-bold text-papaya-dark">{WORLD_TITLE}</h1>
        <p className="text-ink-soft font-bold">{WORLD_SUBTITLE}</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Button color="sky" size="sm" onClick={() => navigate('/race')}>
            🏁 Race
          </Button>
          <Button color="papaya" size="sm" onClick={() => navigate('/stories')}>
            📚 Books
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 pb-8">
        {UNITS.map((unit) => {
          const complete = isUnitComplete(unit.id, player)
          return (
            <div key={unit.id} className="w-full flex flex-col items-center gap-6">
              <div
                className={`w-full rounded-3xl p-4 text-center text-white shadow-chunky-sm border-2 border-black/10 ${UNIT_BG[unit.color]}`}
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 2px, transparent 2px)',
                  backgroundSize: '14px 14px',
                }}
              >
                <div className="leading-none flex justify-center">
                  <Pic emoji={unit.emoji} size={40} label={unit.title} />
                </div>
                <h2 className="font-display text-xl font-bold">{unit.title}</h2>
                <p className="text-sm font-bold opacity-90">{unit.description}</p>
                {complete && (
                  <span className="mt-2 inline-block bg-white/90 text-ink text-xs font-display font-bold px-3 py-1 rounded-full">
                    ⭐ Unit complete!
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center gap-8 w-full">
                {unit.lessons.map((lesson, i) => {
                  const unlocked = isLessonUnlocked(lesson.id, player)
                  const done = player.completedLessonIds.includes(lesson.id)
                  const crowns = Math.max(1, player.crowns[lesson.id] ?? 0)
                  const isCurrent = lesson.id === currentLessonId
                  const emoji = wordsForLesson(lesson)[0]?.emoji ?? '📘'
                  const shift = i % 2 === 0 ? '-translate-x-10' : 'translate-x-10'

                  return (
                    <div key={lesson.id} className={`relative flex flex-col items-center gap-1 ${shift}`}>
                      {isCurrent && <Hero look={player.hero} size={56} className="absolute -right-16 top-0" />}
                      <button
                        ref={(el) => {
                          nodeRefs.current[lesson.id] = el
                        }}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          if (!unlocked) {
                            tapLocked(lesson.id)
                            return
                          }
                          sfx.tap()
                          navigate(`/lesson/${lesson.id}`)
                        }}
                        className={`btn-chunky w-20 h-20 rounded-full flex items-center justify-center text-3xl cursor-pointer
                          ${
                            !unlocked
                              ? 'bg-cream-dark text-ink-soft'
                              : done
                                ? 'bg-leaf text-white'
                                : `${UNIT_BG[unit.color]} text-white animate-pulse-ring`
                          }
                          ${shakeId === lesson.id ? 'animate-shake' : ''}`}
                      >
                        <Pic emoji={!unlocked ? '🔒' : emoji} size={34} label={!unlocked ? 'Locked' : lesson.title} />
                      </button>
                      {!unlocked ? (
                        <span className="text-xs font-display font-bold text-ink-soft">Locked</span>
                      ) : done ? (
                        <>
                          <span className="text-sm" aria-label={`${crowns} crowns`}>
                            {'⭐'.repeat(crowns)}
                          </span>
                          {player.lessonBestMs[lesson.id] !== undefined && (
                            <span className="text-xs font-display font-bold text-sky-dark">
                              ⏱ {formatMsShort(player.lessonBestMs[lesson.id])}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-display font-bold text-papaya-dark">START</span>
                      )}
                      <span className="text-xs font-bold text-ink-soft text-center max-w-24">{lesson.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Screen>
  )
}
