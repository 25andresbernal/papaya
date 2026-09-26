// The Race screen: a kid's own best times, plus a leaderboard of every
// profile saved on this phone. There is no server, so "leaderboard" only
// ever means "everyone who plays on this device".

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import { usePlayer } from '../game/PlayerContext'
import { loadPlayer } from '../game/storage'
import { getCharacter } from '../data/characters'
import { getLesson } from '../data/words'
import { formatMs } from '../utils/format'
import { sfx } from '../audio/sound'
import type { PlayerState } from '../types'

/** One row of leaderboard info built from a profile's save. */
interface BoardRow {
  id: string
  name: string
  buddyId: string
  lessonsCompleted: number
  xp: number
  fastest: { lessonId: string; ms: number } | null
}

export default function RaceScreen() {
  const navigate = useNavigate()
  const { player, profiles, activeProfileId } = usePlayer()

  // A save for every kid on this phone. The active kid uses their live,
  // in-memory state so numbers update the instant a lesson finishes; every
  // other profile is read straight from storage (read-only).
  const stateByProfile = useMemo(() => {
    const map = new Map<string, PlayerState>()
    for (const meta of profiles) {
      map.set(meta.id, meta.id === activeProfileId ? player : loadPlayer(meta.id))
    }
    return map
  }, [profiles, activeProfileId, player])

  // My best times, fastest first.
  const myBests = useMemo(() => {
    return Object.entries(player.lessonBestMs)
      .map(([lessonId, ms]) => ({ lessonId, ms, loc: getLesson(lessonId) }))
      .filter((row): row is { lessonId: string; ms: number; loc: NonNullable<ReturnType<typeof getLesson>> } => !!row.loc)
      .sort((a, b) => a.ms - b.ms)
  }, [player.lessonBestMs])

  // One row per profile: total lessons, total XP, and their single fastest lesson.
  const board: BoardRow[] = useMemo(() => {
    return profiles
      .map((meta) => {
        const state = stateByProfile.get(meta.id)!
        let fastest: BoardRow['fastest'] = null
        for (const [lessonId, ms] of Object.entries(state.lessonBestMs)) {
          if (!fastest || ms < fastest.ms) fastest = { lessonId, ms }
        }
        return {
          id: meta.id,
          name: state.name || meta.name || 'Explorer',
          buddyId: state.buddyId || meta.buddyId,
          lessonsCompleted: state.lessonsCompleted,
          xp: state.xp,
          fastest,
        }
      })
      .sort((a, b) => b.xp - a.xp)
  }, [profiles, stateByProfile])

  // Every lesson id that at least one kid has raced, for the "fastest on" picker.
  const raceableLessons = useMemo(() => {
    const ids = new Set<string>()
    for (const state of stateByProfile.values()) {
      Object.keys(state.lessonBestMs).forEach((id) => ids.add(id))
    }
    return [...ids]
      .map((id) => getLesson(id))
      .filter((l): l is NonNullable<typeof l> => !!l)
      .sort((a, b) => a.lesson.title.localeCompare(b.lesson.title))
  }, [stateByProfile])

  const [pickedLessonId, setPickedLessonId] = useState('')
  const effectiveLessonId = pickedLessonId || raceableLessons[0]?.lesson.id || ''

  const lessonRanking = useMemo(() => {
    if (!effectiveLessonId) return []
    return profiles
      .map((meta) => {
        const state = stateByProfile.get(meta.id)!
        const ms = state.lessonBestMs[effectiveLessonId]
        if (ms === undefined) return null
        return { id: meta.id, name: state.name || meta.name || 'Explorer', buddyId: state.buddyId || meta.buddyId, ms }
      })
      .filter((r): r is { id: string; name: string; buddyId: string; ms: number } => !!r)
      .sort((a, b) => a.ms - b.ms)
  }, [profiles, stateByProfile, effectiveLessonId])

  function medal(i: number): string {
    if (i === 0) return '🥇'
    if (i === 1) return '🥈'
    if (i === 2) return '🥉'
    return `${i + 1}.`
  }

  return (
    <Screen>
      <div className="flex items-center gap-3 pt-2 pb-4">
        <BackButton to="/" />
        <h1 className="font-display text-2xl font-bold text-ink">Race 🏁</h1>
      </div>

      <section className="mb-6">
        <h2 className="font-display text-lg font-bold text-ink mb-2">My best times</h2>
        {myBests.length === 0 ? (
          <p className="text-ink-soft font-bold">Finish a lesson to set your first time!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {myBests.map(({ lessonId, ms, loc }) => (
              <div key={lessonId} className="bg-white rounded-2xl shadow-chunky-sm p-3 flex items-center gap-3">
                <span className="text-2xl leading-none" aria-hidden="true">
                  {loc.unit.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold truncate">{loc.lesson.title}</p>
                  <p className="text-sm text-sky-dark font-bold">⏱ {formatMs(ms)}</p>
                </div>
                <Button color="sky" size="sm" onClick={() => navigate(`/lesson/${lessonId}`)}>
                  Race
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-6">
        <h2 className="font-display text-lg font-bold text-ink mb-2">Leaderboard (this phone)</h2>
        <div className="flex flex-col gap-2">
          {board.map((row, i) => (
            <div
              key={row.id}
              className={`bg-white rounded-2xl shadow-chunky-sm p-3 flex items-center gap-3 ${
                row.id === activeProfileId ? 'ring-2 ring-papaya' : ''
              }`}
            >
              <span className="font-display font-bold text-ink-soft w-5 text-center">{i + 1}</span>
              <span className="text-2xl leading-none" aria-hidden="true">
                {getCharacter(row.buddyId).emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold truncate">{row.name}</p>
                <p className="text-xs text-ink-soft font-bold truncate">
                  {row.lessonsCompleted} lessons · {row.xp} XP
                  {row.fastest && ` · fastest ${getLesson(row.fastest.lessonId)?.lesson.title ?? ''} ${formatMs(row.fastest.ms)}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="font-display text-lg font-bold text-ink mb-2">Fastest on one lesson</h2>
        {raceableLessons.length === 0 ? (
          <p className="text-ink-soft font-bold">No race times yet.</p>
        ) : (
          <>
            <label className="block mb-2">
              <span className="sr-only">Choose a lesson</span>
              <select
                className="w-full bg-white rounded-2xl shadow-chunky-sm p-3 font-display font-bold"
                value={effectiveLessonId}
                onChange={(e) => {
                  sfx.tap()
                  setPickedLessonId(e.target.value)
                }}
              >
                {raceableLessons.map((l) => (
                  <option key={l.lesson.id} value={l.lesson.id}>
                    {l.lesson.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-2">
              {lessonRanking.map((row, i) => (
                <div
                  key={row.id}
                  className={`bg-white rounded-2xl shadow-chunky-sm p-3 flex items-center gap-3 ${
                    row.id === activeProfileId ? 'ring-2 ring-papaya' : ''
                  }`}
                >
                  <span className="text-xl w-8 text-center" aria-hidden="true">
                    {medal(i)}
                  </span>
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {getCharacter(row.buddyId).emoji}
                  </span>
                  <p className="flex-1 min-w-0 font-display font-bold truncate">{row.name}</p>
                  <p className="font-display font-bold text-sky-dark whitespace-nowrap">{formatMs(row.ms)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <p className="text-xs text-ink-soft text-center font-bold">Only players on this phone. Online races coming later.</p>
    </Screen>
  )
}
