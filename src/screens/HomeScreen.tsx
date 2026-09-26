// The home screen: the first thing the kid sees every day.
// It shows their hero and buddy, today's goal, a big "keep going" button,
// the daily chest, quick links, and a fun word to learn right now.

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import Hero from '../components/Hero'
import Mascot from '../components/Mascot'
import Button from '../components/Button'
import Celebration from '../components/Celebration'
import SpeakButton from '../components/SpeakButton'
import { usePlayer } from '../game/PlayerContext'
import { sfx, speak } from '../audio/sound'
import { getCharacter } from '../data/characters'
import { nextLesson, learnedCount, learnedWords } from '../data/words'
import { todayKey, daysBetween } from '../utils/date'
import { useMascotLine } from '../ai/useMascotLine'
import type { MascotMoment } from '../ai/fallbacks'

/** Turns a day string into a number, so the same word shows all day but changes tomorrow. */
function hashText(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0
  return h
}

export default function HomeScreen() {
  const { player, openDailyChest, chestAvailable } = usePlayer()
  const navigate = useNavigate()
  const [wiggle, setWiggle] = useState(false)
  const [chestReward, setChestReward] = useState<{ coins: number; tickets: number } | null>(null)

  const buddy = getCharacter(player.buddyId)
  const today = todayKey()

  // Figure out what the buddy should say: welcome back, comeback hug, or plain hello.
  const daysAway = player.lastPlayDate ? daysBetween(player.lastPlayDate, today) : null
  let moment: MascotMoment = 'welcome'
  if (player.lastPlayDate === today) moment = 'welcomeBack'
  else if (daysAway !== null && daysAway > 1) moment = 'comeback'

  const line = useMascotLine(moment, {
    name: player.name,
    buddy: buddy.name,
    catchphrase: buddy.catchphrase,
    streak: player.streak,
    daysAway: daysAway ?? undefined,
  })

  function tapBuddy() {
    sfx.pop()
    speak(buddy.catchphrase)
    setWiggle(true)
    window.setTimeout(() => setWiggle(false), 400)
  }

  const nl = nextLesson(player)
  const continueTitle = nl ? nl.lesson.title : 'Practice'
  const continuePath = nl ? `/lesson/${nl.lesson.id}` : '/practice'

  function handleOpenChest() {
    const reward = openDailyChest()
    if (reward) setChestReward(reward)
  }

  const words = useMemo(() => learnedWords(player), [player])
  const wordOfDay = words.length > 0 ? words[hashText(today) % words.length] : null

  return (
    <Screen>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">¡Hola, {player.name || 'friend'}!</h1>

      {/* Hero and buddy, side by side. Tap the buddy to hear them talk. */}
      <section className="mt-4 w-full bg-white rounded-3xl p-4 shadow-chunky-sm flex items-center gap-3 animate-pop">
        <Hero look={player.hero} size={140} />
        <button
          type="button"
          onClick={tapBuddy}
          aria-label={`Tap ${buddy.name}`}
          className="flex-1 min-w-0 text-left cursor-pointer"
        >
          <Mascot buddyId={player.buddyId} message={line} size="md" className={wiggle ? 'animate-wiggle' : ''} />
        </button>
      </section>

      {/* Today's goal: one lesson keeps the streak alive. */}
      <section className="mt-4 w-full bg-white rounded-3xl p-4 shadow-chunky-sm flex items-center justify-between gap-2">
        <span className="font-display font-bold text-lg text-ink flex items-center gap-2">
          Today: {Math.min(player.lessonsToday, 1)}/1 lesson
          {player.lessonsToday >= 1 && <span aria-hidden="true">✅</span>}
        </span>
        <span className="flex items-center gap-3 font-display font-bold text-lg">
          <span className={player.streak > 0 ? 'text-coral' : 'text-ink-soft'}>🔥 {player.streak}</span>
          {player.streakFreezes > 0 && <span className="text-sky-dark">🧊 x{player.streakFreezes}</span>}
        </span>
      </section>

      {/* The one big button that keeps the loop going. */}
      <Button color="leaf" size="xl" full className="mt-4 flex-col gap-0 !py-4" onClick={() => navigate(continuePath)}>
        <span className="text-sm font-body font-bold opacity-80">Continue learning</span>
        <span>{continueTitle}</span>
      </Button>

      {/* Daily chest: one free surprise a day, after a lesson. */}
      <section className="mt-4 w-full bg-white rounded-3xl p-4 shadow-chunky-sm text-center">
        {chestAvailable ? (
          <Button color="sun" size="lg" full className="animate-bounce-soft" onClick={handleOpenChest}>
            🎁 Open your chest!
          </Button>
        ) : player.lastPlayDate !== today ? (
          <p className="font-display font-bold text-ink-soft">Finish a lesson to unlock today's chest</p>
        ) : (
          <p className="font-display font-bold text-ink-soft">Come back tomorrow for another chest</p>
        )}
      </section>

      {/* Quick links to the rest of the app. */}
      <section className="mt-4 grid grid-cols-3 gap-3">
        <NavCard emoji="🧠" label="Practice" to="/practice" />
        <NavCard emoji="📖" label={`${learnedCount(player)} words`} to="/words" />
        <NavCard emoji="⚙️" label="Settings" to="/settings" />
      </section>

      {/* A fun word to think about today. */}
      {wordOfDay && (
        <section className="mt-4 mb-4 w-full bg-white rounded-3xl p-4 shadow-chunky-sm flex items-center gap-3">
          <span className="text-5xl leading-none" aria-hidden="true">
            {wordOfDay.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-ink-soft text-xs uppercase tracking-wide">Word of the day</p>
            <p className="font-display font-bold text-2xl text-papaya-dark">{wordOfDay.es}</p>
            <p className="text-ink-soft font-bold">{wordOfDay.en}</p>
          </div>
          <SpeakButton text={wordOfDay.es} />
        </section>
      )}

      {chestReward && (
        <Celebration
          emoji="🎁"
          title="Chest opened!"
          subtitle={`+${chestReward.coins} 🥭 and +${chestReward.tickets} 🎟️`}
          sound="chest"
          onDone={() => setChestReward(null)}
        />
      )}
    </Screen>
  )
}

/** One small tappable card in the quick-links row. */
function NavCard({ emoji, label, to }: { emoji: string; label: string; to: string }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        navigate(to)
      }}
      className="btn-chunky bg-white rounded-3xl p-3 flex flex-col items-center gap-1 cursor-pointer"
    >
      <span className="text-3xl leading-none" aria-hidden="true">
        {emoji}
      </span>
      <span className="text-xs font-display font-bold text-ink-soft text-center leading-tight">{label}</span>
    </button>
  )
}
