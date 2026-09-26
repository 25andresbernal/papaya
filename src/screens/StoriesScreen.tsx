// The story shelf: a list of short bilingual picture books.
// Books unlock as the kid finishes lessons in the matching unit.
// Tap a book to open it and read along with the buddy.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import BackButton from '../components/BackButton'
import WordArt from '../components/wordart'
import { usePlayer } from '../game/PlayerContext'
import { sfx } from '../audio/sound'
import { getUnit } from '../data/words'
import { STORIES } from '../data/stories'

export default function StoriesScreen() {
  const { player } = usePlayer()
  const navigate = useNavigate()
  // Which book card is shaking right now (a kid tapped a locked one).
  const [shakeId, setShakeId] = useState<string | null>(null)

  function tapLocked(id: string) {
    sfx.wrong()
    setShakeId(id)
    window.setTimeout(() => setShakeId((s) => (s === id ? null : s)), 400)
  }

  function openStory(id: string) {
    sfx.tap()
    navigate(`/story/${id}`)
  }

  return (
    <Screen>
      <div className="flex items-center gap-3 pt-2">
        <BackButton to="/" />
        <div>
          <h1 className="font-display text-2xl font-bold text-papaya-dark">Story time</h1>
          <p className="text-ink-soft font-bold text-sm">Read with Tico. Tap any word to hear it.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 pb-4">
        {STORIES.map((story) => {
          const unit = getUnit(story.unitId)
          const unlocked = !!unit && unit.lessons.some((l) => player.completedLessonIds.includes(l.id))
          const read = player.completedLessonIds.includes(`story-${story.id}`)

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => (unlocked ? openStory(story.id) : tapLocked(story.id))}
              className={`btn-chunky bg-white rounded-3xl p-3 flex items-center gap-3 text-left cursor-pointer
                ${!unlocked ? 'opacity-60 grayscale' : ''}
                ${shakeId === story.id ? 'animate-shake' : ''}`}
            >
              <div className="shrink-0 leading-none">
                <WordArt wordId={story.coverWordId} size={72} label={story.title} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl font-bold text-ink truncate">{story.title}</p>
                <p className="text-ink-soft font-bold text-sm truncate">{story.titleEn}</p>
                <p className="text-ink-soft text-xs mt-1">{story.blurb}</p>
                {unlocked ? (
                  <span className={`mt-1 inline-block text-xs font-display font-bold ${read ? 'text-sun-dark' : 'text-leaf-dark'}`}>
                    {read ? '⭐ Read · Read again' : 'Read'}
                  </span>
                ) : (
                  <span className="mt-1 inline-block text-xs font-display font-bold text-ink-soft">
                    🔒 Finish a lesson in {unit?.title ?? 'this unit'}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </Screen>
  )
}
