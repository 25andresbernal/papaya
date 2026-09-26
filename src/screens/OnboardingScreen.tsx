// The very first thing a new kid sees. It feels like talking to the buddy:
// short speech bubbles, one Continue tap at a time.
//
// The steps are:
//   0. Buddy says hi.
//   1. What's your name?
//   2. Pick your buddy!
//   3. Pick your color! (this is where we actually save everything so far)
//   4. Do you already know some Spanish?
//   5. If yes: a quick game that finds out how much (the placement game).
//   6. All done! Show where the kid is starting.
//
// If a kid who already finished onboarding somehow lands here again, we
// send them home. But we only check that ONCE, when the screen opens — not
// on every step — because step 3 marks the kid as "onboarded" partway
// through, and we do not want that to boot them out of their own placement
// game.

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import Button from '../components/Button'
import Hero from '../components/Hero'
import Mascot from '../components/Mascot'
import BackButton from '../components/BackButton'
import ProgressBar from '../components/ProgressBar'
import Confetti from '../components/Confetti'
import PlacementScreen from './PlacementScreen'
import { usePlayer } from '../game/PlayerContext'
import { sfx, speak, speakEnglish } from '../audio/sound'
import { STARTER_CHARACTER_IDS, getCharacter } from '../data/characters'
import { HERO_COLORS } from '../data/shop'
import { UNITS } from '../data/curriculum'

const STEP = {
  INTRO: 0,
  NAME: 1,
  BUDDY: 2,
  COLOR: 3,
  QUESTION: 4,
  PLACEMENT: 5,
  RESULT: 6,
} as const

const LAST_STEP = STEP.RESULT

export default function OnboardingScreen() {
  const { player, finishOnboarding, applyPlacement, activeProfileId } = usePlayer()
  const navigate = useNavigate()

  const [step, setStep] = useState<number>(STEP.INTRO)
  const [name, setName] = useState('')
  const [buddyId, setBuddyId] = useState('')
  const [color, setColor] = useState(HERO_COLORS[0])
  const [unitCount, setUnitCount] = useState(0)

  // Snapshot taken once, when the screen first opens. See the big comment above.
  const wasAlreadyOnboarded = useRef(player.onboarded)

  useEffect(() => {
    if (!activeProfileId) {
      navigate('/who', { replace: true })
      return
    }
    if (wasAlreadyOnboarded.current) navigate('/', { replace: true })
    // Only run once, right when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Before a buddy is picked, Tico speaks. After, the kid's own buddy does.
  const activeBuddyId = buddyId || STARTER_CHARACTER_IDS[0] || 'tico'
  const speakerId = step < STEP.COLOR ? 'tico' : activeBuddyId

  const line = bubbleLine(step, unitCount)

  // Read the bubble out loud once, each time a new step opens. This has to
  // stay above the "not ready yet" return below: every hook in a component
  // must run on every render, in the same order, no matter what.
  const lastSpokenStep = useRef(-1)
  useEffect(() => {
    if (lastSpokenStep.current === step) return
    lastSpokenStep.current = step
    if (line) speakEnglish(line)
  }, [step, line])

  if (!activeProfileId || wasAlreadyOnboarded.current) return null

  function goNext() {
    sfx.tap()
    setStep((s) => Math.min(LAST_STEP, s + 1))
  }

  function goBack() {
    setStep((s) => Math.max(STEP.INTRO, s - 1))
  }

  function choosePal(id: string) {
    sfx.pop()
    setBuddyId(id)
    speak(getCharacter(id).catchphrase)
  }

  // Step 3 (color) is where we actually save the kid's save file, so the
  // rest of onboarding (the placement game) has a real save to build on.
  function saveAndContinue() {
    sfx.unlock()
    finishOnboarding(name, buddyId || STARTER_CHARACTER_IDS[0], color)
    goNext()
  }

  function startNew() {
    sfx.tap()
    applyPlacement(0)
    setUnitCount(0)
    setStep(STEP.RESULT)
  }

  function startPlacement() {
    sfx.tap()
    setStep(STEP.PLACEMENT)
  }

  function handlePlacementDone(count: number) {
    applyPlacement(count)
    setUnitCount(count)
    setStep(STEP.RESULT)
  }

  const showBack = step > STEP.INTRO && step !== STEP.RESULT
  const showTopProgress = step > STEP.INTRO

  return (
    <Screen topBar={false} nav={false} className="items-center gap-6 py-6">
      {(showBack || showTopProgress) && (
        <div className="w-full flex items-center gap-3">
          {showBack ? <BackButton onClick={goBack} /> : <div className="w-12" />}
          {showTopProgress && <ProgressBar value={step} max={LAST_STEP} color="bg-papaya" height="h-2" />}
        </div>
      )}

      {step === STEP.INTRO && (
        <div key="step-intro" className="w-full flex-1 flex flex-col items-center justify-center gap-8 text-center">
          <Mascot buddyId={speakerId} message={line} size="lg" mood="excited" />
          <Button color="leaf" size="xl" full onClick={goNext}>
            Continue
          </Button>
        </div>
      )}

      {step === STEP.NAME && (
        <div key="step-name" className="w-full flex-1 flex flex-col items-center justify-center gap-6">
          <Mascot buddyId={speakerId} message={line} size="md" />
          <input
            autoFocus
            value={name}
            maxLength={16}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name"
            className="w-full text-center text-3xl font-display font-bold rounded-3xl border-4 border-cream-dark bg-white px-4 py-4 focus:outline-none focus:border-papaya"
          />
          <Button color="leaf" size="xl" full disabled={!name.trim()} onClick={goNext}>
            Continue
          </Button>
        </div>
      )}

      {step === STEP.BUDDY && (
        <div key="step-buddy" className="w-full flex-1 flex flex-col items-center gap-4">
          <Mascot buddyId={speakerId} message={line} size="md" />
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
            Continue
          </Button>
        </div>
      )}

      {step === STEP.COLOR && (
        <div key="step-color" className="w-full flex-1 flex flex-col items-center gap-5">
          <Mascot buddyId={speakerId} message={line} size="md" />
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
          <Button color="leaf" size="xl" full onClick={saveAndContinue}>
            Continue
          </Button>
        </div>
      )}

      {step === STEP.QUESTION && (
        <div key="step-question" className="w-full flex-1 flex flex-col items-center justify-center gap-8 text-center">
          <Mascot buddyId={speakerId} message={line} size="lg" mood="thinking" />
          <div className="w-full flex flex-col gap-3">
            <Button color="leaf" size="xl" full onClick={startNew}>
              I'm new!
            </Button>
            <Button color="sky" size="xl" full onClick={startPlacement}>
              Let's find out!
            </Button>
          </div>
        </div>
      )}

      {step === STEP.PLACEMENT && (
        <div key="step-placement" className="w-full flex-1 flex flex-col items-center gap-4">
          <Mascot buddyId={speakerId} message={line} size="sm" />
          <PlacementScreen onDone={handlePlacementDone} />
        </div>
      )}

      {step === STEP.RESULT && (
        <div key="step-result" className="w-full flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <Confetti />
          <Mascot buddyId={speakerId} message={line} size="lg" mood="excited" />
          <div className="flex flex-col items-center gap-2">
            <Hero look={{ color, equipped: {} }} size={120} />
            <p className="font-display text-lg font-bold text-ink">{name || 'Explorer'}, this is your hero</p>
          </div>
          <Button color="leaf" size="xl" full onClick={() => navigate('/path')}>
            Let's go!
          </Button>
        </div>
      )}
    </Screen>
  )
}

/** What the buddy says in the bubble for each step. Two short sentences, max. */
function bubbleLine(step: number, unitCount: number): string {
  switch (step) {
    case STEP.INTRO:
      return "Hi! I'm Tico! Let's learn Spanish together."
    case STEP.NAME:
      return "What's your name?"
    case STEP.BUDDY:
      return 'Pick your buddy!'
    case STEP.COLOR:
      return 'Pick your color!'
    case STEP.QUESTION:
      return 'Do you know some Spanish already?'
    case STEP.PLACEMENT:
      return 'Tap the Spanish word. Miss 3 and we stop. No stress!'
    case STEP.RESULT:
      if (unitCount <= 0) return 'Great! We start at the very beginning. ¡Vamos!'
      if (unitCount >= UNITS.length) return "You know it all! Let's practice."
      return `Wow! You already know ${unitCount} unit${unitCount === 1 ? '' : 's'}. You start at ${UNITS[unitCount].title}!`
    default:
      return ''
  }
}
