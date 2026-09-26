// The very first thing a new kid sees. Three quick steps:
// 1) say your name, 2) pick a buddy, 3) pick a hero color. Then off to the map!
// If the kid already finished this before, we skip straight to Home.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import Button from '../components/Button'
import Hero from '../components/Hero'
import { usePlayer } from '../game/PlayerContext'
import { sfx, speak } from '../audio/sound'
import { STARTER_CHARACTER_IDS, getCharacter } from '../data/characters'
import { HERO_COLORS } from '../data/shop'

export default function OnboardingScreen() {
  const { player, finishOnboarding } = usePlayer()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [buddyId, setBuddyId] = useState('')
  const [color, setColor] = useState(HERO_COLORS[0])

  // A kid who already finished onboarding does not need to see it again.
  useEffect(() => {
    if (player.onboarded) navigate('/', { replace: true })
  }, [player.onboarded, navigate])

  if (player.onboarded) return null

  function goNext() {
    sfx.tap()
    setStep((s) => s + 1)
  }

  function choosePal(id: string) {
    sfx.pop()
    setBuddyId(id)
    speak(getCharacter(id).catchphrase)
  }

  function finish() {
    sfx.unlock()
    finishOnboarding(name, buddyId || STARTER_CHARACTER_IDS[0], color)
    navigate('/')
  }

  return (
    <Screen topBar={false} nav={false} className="items-center justify-center text-center gap-6 py-8">
      {step === 0 && (
        <div key="step-name" className="animate-pop w-full flex flex-col items-center gap-4">
          <div className="text-7xl" aria-hidden="true">
            🥭
          </div>
          <h1 className="font-display text-4xl font-bold text-papaya-dark">Papaya</h1>
          <p className="text-lg text-ink-soft font-bold">Learn Spanish by playing!</p>
          <p className="mt-4 text-xl font-display font-bold">What's your name?</p>
          <input
            autoFocus
            value={name}
            maxLength={16}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name"
            className="w-full text-center text-3xl font-display font-bold rounded-3xl border-4 border-cream-dark bg-white px-4 py-4 focus:outline-none focus:border-papaya"
          />
          <Button color="leaf" size="xl" full disabled={!name.trim()} onClick={goNext}>
            Next
          </Button>
        </div>
      )}

      {step === 1 && (
        <div key="step-buddy" className="animate-pop w-full flex flex-col items-center gap-4">
          <h2 className="font-display text-3xl font-bold text-papaya-dark">Pick your buddy</h2>
          <div className="w-full flex flex-col gap-3">
            {STARTER_CHARACTER_IDS.map((id) => {
              const c = getCharacter(id)
              const selected = buddyId === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => choosePal(id)}
                  className={`btn-chunky w-full flex items-center gap-4 rounded-3xl bg-white p-4 text-left cursor-pointer ${
                    selected ? 'ring-4 ring-papaya' : ''
                  }`}
                >
                  <span className="text-7xl leading-none">{c.emoji}</span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-display text-xl font-bold text-ink">{c.name}</span>
                    <span className="text-sm text-ink-soft font-bold">{c.blurb}</span>
                    <span className="text-sm text-papaya-dark font-bold">{c.catchphrase}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <Button color="leaf" size="xl" full disabled={!buddyId} onClick={goNext}>
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div key="step-color" className="animate-pop w-full flex flex-col items-center gap-5">
          <h2 className="font-display text-3xl font-bold text-papaya-dark">Pick your color</h2>
          <Hero look={{ color, equipped: {} }} size={140} />
          <div className="flex flex-wrap justify-center gap-3">
            {HERO_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Pick color ${c}`}
                onClick={() => {
                  sfx.tap()
                  setColor(c)
                }}
                className={`btn-chunky w-12 h-12 rounded-full cursor-pointer ${color === c ? 'ring-4 ring-ink' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <Button color="leaf" size="xl" full onClick={finish}>
            Let's go!
          </Button>
        </div>
      )}
    </Screen>
  )
}
