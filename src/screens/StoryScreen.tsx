// A bilingual picture book: a few pages of a Spanish sentence with a picture,
// then one question to check the kid understood the story. Every word can be
// tapped to hear it, and the "Read it" button reads the whole line out loud
// while lighting up each word as it is said (a real timing track would be
// nicer, but we do not have one, so we estimate how long each word takes).

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Screen from '../components/Screen'
import BackButton from '../components/BackButton'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import Celebration from '../components/Celebration'
import Mascot from '../components/Mascot'
import WordArt from '../components/wordart'
import { usePlayer } from '../game/PlayerContext'
import { sfx, speak, speakEnglish } from '../audio/sound'
import { getStory } from '../data/stories'
import type { LessonSummary, UnitColor } from '../types'

// A soft, tinted card behind each page's picture, one color per unit theme.
const PAGE_TINT: Record<UnitColor, string> = {
  papaya: 'bg-papaya/20',
  sky: 'bg-sky/20',
  leaf: 'bg-leaf/20',
  sun: 'bg-sun/20',
  coral: 'bg-coral/20',
}

// Kahoot-style answer colors, same as every other quiz in the app.
const ANSWER_COLORS = ['bg-btn-red', 'bg-btn-blue', 'bg-btn-yellow', 'bg-btn-green']

// How many pixels a swipe needs to travel before we flip the page.
const SWIPE_THRESHOLD = 40

export default function StoryScreen() {
  const { storyId } = useParams<{ storyId: string }>()
  const navigate = useNavigate()
  const { player, completeLesson } = usePlayer()
  const story = storyId ? getStory(storyId) : undefined

  // A story id that does not exist sends the kid back to the shelf.
  useEffect(() => {
    if (!story) navigate('/stories', { replace: true })
  }, [story, navigate])

  const [pageIndex, setPageIndex] = useState(0)
  const [phase, setPhase] = useState<'book' | 'question'>('book')
  const [highlight, setHighlight] = useState(-1)
  const [chosen, setChosen] = useState<number | null>(null)
  const [summary, setSummary] = useState<LessonSummary | null>(null)
  const [showLevelUp, setShowLevelUp] = useState(false)

  // The clock starts the moment the book opens, for the reward we pay at the end.
  const openedAtRef = useRef(Date.now())
  // Guards completeLesson so a double-tap on an answer never pays twice.
  const answeredRef = useRef(false)
  const highlightTimers = useRef<number[]>([])
  const pointerStartX = useRef<number | null>(null)

  const page = story?.pages[pageIndex]
  const pageCount = story?.pages.length ?? 0
  const words = useMemo(() => (page ? page.es.split(' ') : []), [page])

  function clearHighlightTimers() {
    highlightTimers.current.forEach((id) => window.clearTimeout(id))
    highlightTimers.current = []
  }

  /** Read the whole Spanish line, lighting up one word at a time as it plays. */
  function readPage() {
    if (!page) return
    clearHighlightTimers()
    speak(page.es)
    const total = 350 + words.length * 420 + page.es.length * 45
    const step = words.length > 0 ? total / words.length : total
    words.forEach((_, i) => {
      const t = window.setTimeout(() => setHighlight(i), Math.round(step * i))
      highlightTimers.current.push(t)
    })
    const end = window.setTimeout(() => setHighlight(-1), Math.round(total))
    highlightTimers.current.push(end)
  }

  // Every new page reads itself out loud a beat after it appears.
  useEffect(() => {
    if (phase !== 'book') return
    setHighlight(-1)
    const t = window.setTimeout(readPage, 300)
    return () => {
      window.clearTimeout(t)
      clearHighlightTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, phase])

  function goNext() {
    if (!story) return
    clearHighlightTimers()
    if (pageIndex >= story.pages.length - 1) setPhase('question')
    else setPageIndex((i) => i + 1)
  }

  function goBack() {
    clearHighlightTimers()
    setPageIndex((i) => Math.max(0, i - 1))
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    pointerStartX.current = e.clientX
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const start = pointerStartX.current
    pointerStartX.current = null
    if (start === null) return
    const dx = e.clientX - start
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    sfx.tap()
    if (dx < 0) goNext()
    else goBack()
  }

  /** Tap a single word chip: strip any punctuation stuck to it, then say it. */
  function tapWord(raw: string) {
    const clean = raw.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')
    if (!clean) return
    sfx.pop()
    speak(clean)
  }

  function hearQuestion() {
    if (!story) return
    sfx.pop()
    speak(story.question.es)
    window.setTimeout(() => speakEnglish(story.question.en), 1200)
  }

  // The question reads itself out loud too, same as every page.
  useEffect(() => {
    if (phase !== 'question' || !story) return
    const t = window.setTimeout(() => {
      speak(story.question.es)
      window.setTimeout(() => speakEnglish(story.question.en), 1200)
    }, 300)
    return () => window.clearTimeout(t)
  }, [phase, story])

  function answer(index: number) {
    if (!story || answeredRef.current) return
    answeredRef.current = true
    setChosen(index)
    const correct = index === story.question.correctIndex
    sfx[correct ? 'correct' : 'wrong']()

    const choice = story.question.choices[index]
    const ms = Date.now() - openedAtRef.current
    const s = completeLesson(
      `story-${story.id}`,
      story.unitId,
      [{ exerciseId: 'story-q', wordId: choice.artWordId ?? story.coverWordId, correct, ms }],
      ms,
    )
    setSummary(s)
  }

  function finishFirstCelebration() {
    if (summary && summary.levelAfter > summary.levelBefore) setShowLevelUp(true)
    else navigate('/stories')
  }

  if (!story) return null

  return (
    <Screen topBar={false} nav={false}>
      <div className="flex items-center gap-3 pt-3">
        <BackButton to="/stories" />
        {phase === 'book' && page && (
          <>
            <ProgressBar value={pageIndex + 1} max={pageCount} color="bg-leaf" className="flex-1" />
            <span className="font-display font-bold text-ink-soft whitespace-nowrap">
              {pageIndex + 1}/{pageCount}
            </span>
          </>
        )}
      </div>

      {phase === 'book' && page && (
        <div className="flex-1 flex flex-col gap-4 mt-3 pb-4">
          <div
            className={`w-full rounded-3xl p-6 flex items-center justify-center gap-4 touch-pan-y select-none ${
              page.color ? PAGE_TINT[page.color] : 'bg-cream-dark'
            }`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <WordArt wordId={page.artWordId} size={160} label={page.es} />
            {page.artWordId2 && <WordArt wordId={page.artWordId2} size={110} label="" />}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {words.map((w, i) => (
              <button
                key={`${pageIndex}-${i}`}
                type="button"
                onClick={() => tapWord(w)}
                className={`btn-chunky min-h-11 px-3 py-2 rounded-2xl font-display text-2xl font-bold cursor-pointer transition-colors
                  ${highlight === i ? 'bg-sun ring-4 ring-sun-dark' : 'bg-white text-ink'}`}
              >
                {w}
              </button>
            ))}
          </div>

          <Button color="sky" size="lg" full onClick={readPage}>
            Read it 🔊
          </Button>

          <p className="text-center text-lg text-ink-soft font-bold flex items-center gap-2 justify-center flex-wrap">
            {page.en}
            <button
              type="button"
              onClick={() => {
                sfx.pop()
                speakEnglish(page.en)
              }}
              className="btn-chunky bg-white rounded-full px-3 py-1 text-sm font-display font-bold cursor-pointer"
            >
              🔊 English
            </button>
          </p>

          <div className="mt-auto flex flex-col gap-2">
            <Button color="leaf" size="lg" full onClick={goNext}>
              Next ▶
            </Button>
            {pageIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  goBack()
                }}
                className="self-center font-display font-bold text-ink-soft text-sm cursor-pointer"
              >
                ◀ Back
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'question' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center pb-4">
          <Mascot buddyId={player.buddyId} mood="thinking" size="lg" />
          <div className="bg-white rounded-3xl p-4 shadow-chunky-sm w-full">
            <p className="font-display text-2xl font-bold">{story.question.es}</p>
            <p className="text-ink-soft font-bold mt-1">{story.question.en}</p>
            <button
              type="button"
              onClick={hearQuestion}
              aria-label="Hear the question"
              className="btn-chunky bg-sky text-white rounded-full w-12 h-12 mt-3 flex items-center justify-center text-xl mx-auto cursor-pointer"
            >
              🔊
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {story.question.choices.map((c, i) => {
              const isCorrectChoice = i === story.question.correctIndex
              const isChosen = i === chosen
              let extra = ''
              if (chosen !== null) {
                if (isCorrectChoice) extra = 'ring-4 ring-white'
                else if (isChosen) extra = 'opacity-60'
                else extra = 'opacity-40'
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={chosen !== null}
                  onClick={() => answer(i)}
                  className={`btn-chunky ${ANSWER_COLORS[i % 4]} text-white min-h-16 rounded-3xl font-display font-bold flex flex-col items-center justify-center gap-1 px-2 py-3 cursor-pointer ${extra}`}
                >
                  {c.artWordId && <WordArt wordId={c.artWordId} size={40} label={c.es} />}
                  <span className="text-lg">{c.es}</span>
                  <span className="text-xs font-body opacity-90">{c.en}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {summary && !showLevelUp && (
        <Celebration
          emoji="📚"
          title={summary.correct > 0 ? '¡Muy bien!' : 'Good try!'}
          subtitle={`+${summary.xpEarned} XP · +${summary.coinsEarned} 🥭 · +${summary.ticketsEarned} 🎟️`}
          buttonLabel="Done"
          onDone={finishFirstCelebration}
        />
      )}

      {showLevelUp && summary && (
        <Celebration
          emoji="🎉"
          title="Level up!"
          subtitle={`You're now level ${summary.levelAfter}!`}
          sound="levelUp"
          buttonLabel="Done"
          onDone={() => navigate('/stories')}
        />
      )}
    </Screen>
  )
}
