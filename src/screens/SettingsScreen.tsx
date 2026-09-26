// Settings: sound and speech switches, hero color, the kid's name,
// and a locked-away "Parent zone" with real stats and the big reset button.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Mascot from '../components/Mascot'
import VoicePicker from '../components/VoicePicker'
import { usePlayer } from '../game/PlayerContext'
import { sfx } from '../audio/sound'
import { HERO_COLORS } from '../data/shop'
import { learnedCount } from '../data/words'
import { randInt } from '../utils/random'
import type { PlayerState } from '../types'

export default function SettingsScreen() {
  const { player, setSetting, setHeroColor, update, reset, signOut, createProfile, deleteProfile, activeProfileId } =
    usePlayer()
  const navigate = useNavigate()

  const [name, setName] = useState(player.name)
  const [parentUnlocked, setParentUnlocked] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [question, setQuestion] = useState<{ a: number; b: number } | null>(null)
  const [answer, setAnswer] = useState('')
  const [gateError, setGateError] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  function toggle(key: keyof PlayerState['settings']) {
    sfx.tap()
    setSetting(key, !player.settings[key])
  }

  function openGate() {
    sfx.tap()
    setQuestion({ a: randInt(2, 9), b: randInt(2, 9) })
    setAnswer('')
    setGateError(false)
    setShowGate(true)
  }

  function checkGate() {
    sfx.tap()
    if (question && Number(answer) === question.a + question.b) {
      setParentUnlocked(true)
      setShowGate(false)
    } else {
      setGateError(true)
      sfx.wrong()
    }
  }

  function commitName(value: string) {
    update({ name: value.trim().slice(0, 16) || 'Explorer' })
  }

  function doReset() {
    sfx.tap()
    reset()
    navigate('/welcome')
  }

  function switchPlayer() {
    sfx.tap()
    signOut()
    navigate('/who')
  }

  function addPlayer() {
    sfx.tap()
    createProfile()
    navigate('/welcome')
  }

  function doRemovePlayer() {
    sfx.tap()
    if (activeProfileId) deleteProfile(activeProfileId)
    navigate('/who')
  }

  return (
    <Screen>
      <div className="flex items-center gap-2 pt-2">
        <BackButton to="/" />
        <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
      </div>

      <section className="mt-4 bg-white rounded-3xl p-4 shadow-chunky-sm flex flex-col gap-3">
        <h2 className="font-display font-bold text-lg text-ink">Players</h2>
        <div className="flex items-center gap-3">
          <Mascot buddyId={player.buddyId} size="sm" />
          <span className="font-display font-bold text-xl text-ink">{player.name || 'Explorer'}</span>
        </div>
        <div className="flex gap-3">
          <Button color="sky" size="md" full onClick={switchPlayer}>
            Switch player
          </Button>
          <Button color="white" size="md" full onClick={addPlayer}>
            Add a player
          </Button>
        </div>
      </section>

      <div className="mt-4 flex flex-col gap-3">
        <ToggleRow label="Sounds" value={player.settings.sound} onToggle={() => toggle('sound')} />
        <ToggleRow label="Music" value={player.settings.music} onToggle={() => toggle('music')} />
        <ToggleRow label="Read Spanish out loud" value={player.settings.speak} onToggle={() => toggle('speak')} />
        <ToggleRow label="Timer (for big kids)" value={player.settings.timer} onToggle={() => toggle('timer')} />
      </div>

      <section className="mt-6">
        <VoicePicker />
      </section>

      <section className="mt-6">
        <h2 className="font-display font-bold text-lg text-ink mb-2">Hero color</h2>
        <div className="flex flex-wrap gap-3">
          {HERO_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Pick color ${c}`}
              onClick={() => {
                sfx.tap()
                setHeroColor(c)
              }}
              className={`btn-chunky w-12 h-12 rounded-full cursor-pointer ${player.hero.color === c ? 'ring-4 ring-ink' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-display font-bold text-lg text-ink mb-2">Your name</h2>
        <input
          value={name}
          maxLength={16}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => commitName(name)}
          className="w-full text-xl font-display font-bold rounded-2xl border-2 border-cream-dark bg-white px-4 py-3 focus:outline-none focus:border-papaya"
        />
      </section>

      <section className="mt-8 mb-4">
        {!parentUnlocked ? (
          <Button color="white" size="md" full onClick={openGate}>
            👪 Parents
          </Button>
        ) : (
          <div className="bg-white rounded-3xl p-4 shadow-chunky-sm flex flex-col gap-3">
            <h2 className="font-display font-bold text-lg text-ink">Parent zone</h2>
            <div className="grid grid-cols-2 gap-3 text-center">
              <Stat label="Lessons done" value={player.lessonsCompleted} />
              <Stat label="Best streak" value={player.bestStreak} />
              <Stat label="Words learned" value={learnedCount(player)} />
              <Stat label="XP" value={player.xp} />
            </div>
            <p className="text-xs text-ink-soft font-bold">
              Fresh AI messages need an ANTHROPIC_API_KEY set on the server. Papaya still works fine without it, using
              its built-in messages.
            </p>
            <Button color="coral" size="md" full onClick={() => setShowResetConfirm(true)}>
              Start over
            </Button>
            <Button color="coral" size="md" full onClick={() => setShowRemoveConfirm(true)}>
              Remove this player
            </Button>
          </div>
        )}
      </section>

      <p className="mt-auto mb-4 text-center text-xs text-ink-soft font-bold">Papaya v1.1 · Pictures by Twemoji (CC-BY 4.0)</p>

      {showGate && question && (
        <Modal onClose={() => setShowGate(false)}>
          <h2 className="font-display text-xl font-bold text-ink mb-3">
            What is {question.a} + {question.b}?
          </h2>
          <input
            autoFocus
            inputMode="numeric"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full text-center text-2xl font-display font-bold rounded-2xl border-2 border-cream-dark px-4 py-3 mb-3"
          />
          {gateError && <p className="text-coral font-bold mb-2">Not quite. Try again!</p>}
          <Button color="leaf" size="md" full onClick={checkGate}>
            Enter
          </Button>
        </Modal>
      )}

      {showResetConfirm && (
        <Modal onClose={() => setShowResetConfirm(false)}>
          <h2 className="font-display text-xl font-bold text-ink mb-3">Are you sure?</h2>
          <p className="text-ink-soft font-bold mb-4">Everything will be erased.</p>
          <div className="flex gap-3">
            <Button color="white" size="md" full onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button color="coral" size="md" full onClick={doReset}>
              Erase
            </Button>
          </div>
        </Modal>
      )}

      {showRemoveConfirm && (
        <Modal onClose={() => setShowRemoveConfirm(false)}>
          <h2 className="font-display text-xl font-bold text-ink mb-3">Remove {player.name || 'this player'}?</h2>
          <p className="text-ink-soft font-bold mb-4">Their progress will be erased for good.</p>
          <div className="flex gap-3">
            <Button color="white" size="md" full onClick={() => setShowRemoveConfirm(false)}>
              Cancel
            </Button>
            <Button color="coral" size="md" full onClick={doRemovePlayer}>
              Remove
            </Button>
          </div>
        </Modal>
      )}
    </Screen>
  )
}

/** A big, easy-to-tap on/off switch. */
function ToggleRow({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between bg-white rounded-2xl p-4 shadow-chunky-sm cursor-pointer"
    >
      <span className="font-display font-bold text-ink">{label}</span>
      <span
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${value ? 'bg-leaf' : 'bg-cream-dark'}`}
        aria-hidden="true"
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`}
        />
      </span>
    </button>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-cream rounded-2xl p-3">
      <div className="font-display text-2xl font-bold text-papaya-dark">{value}</div>
      <div className="text-xs text-ink-soft font-bold">{label}</div>
    </div>
  )
}
