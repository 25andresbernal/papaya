// "Who is playing?" screen. More than one kid can share this device,
// so before anything else we ask which kid is playing right now.
// Route: /who. Tapping a card signs that kid in. Holding a card (parents only)
// lets you remove a player for good.

import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import Mascot from '../components/Mascot'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { usePlayer } from '../game/PlayerContext'
import { sfx } from '../audio/sound'
import { randInt } from '../utils/random'
import type { ProfileMeta } from '../game/profiles'

/** How long (ms) a parent must hold a card before the remove option shows up. */
const HOLD_MS = 600

export default function ProfilesScreen() {
  const { profiles, switchProfile, createProfile, deleteProfile } = usePlayer()
  const navigate = useNavigate()

  const [removing, setRemoving] = useState<ProfileMeta | null>(null)
  const [question, setQuestion] = useState<{ a: number; b: number } | null>(null)
  const [answer, setAnswer] = useState('')
  const [gateError, setGateError] = useState(false)

  // Most recently played kid shows up first.
  const sorted = [...profiles].sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)

  function pick(id: string) {
    sfx.pop()
    switchProfile(id)
    // If this kid never finished onboarding, RequireOnboarding sends them
    // to /welcome for us. So "/" is always the right place to head next.
    navigate('/')
  }

  function addNew() {
    sfx.pop()
    createProfile()
    navigate('/welcome')
  }

  function askRemove(p: ProfileMeta) {
    setRemoving(p)
    setQuestion({ a: randInt(2, 9), b: randInt(2, 9) })
    setAnswer('')
    setGateError(false)
  }

  function cancelRemove() {
    sfx.tap()
    setRemoving(null)
  }

  function confirmRemove() {
    sfx.tap()
    if (!removing || !question) return
    if (Number(answer) === question.a + question.b) {
      deleteProfile(removing.id)
      setRemoving(null)
    } else {
      setGateError(true)
      sfx.wrong()
    }
  }

  return (
    <Screen topBar={false} nav={false} className="items-center justify-center text-center gap-5 py-8">
      <div className="text-7xl" aria-hidden="true">
        🥭
      </div>
      <h1 className="font-display text-4xl font-bold text-papaya-dark">Papaya</h1>

      {sorted.length === 0 ? (
        <div className="w-full flex flex-col items-center gap-4 mt-2 animate-pop">
          <p className="font-display text-xl font-bold text-ink">Let's make your player!</p>
          <Button color="leaf" size="xl" full onClick={addNew}>
            + New player
          </Button>
        </div>
      ) : (
        <>
          <p className="text-lg text-ink-soft font-bold">Who is playing?</p>
          <div className="w-full grid grid-cols-2 gap-3 mt-1">
            {sorted.map((p) => (
              <ProfileCard key={p.id} profile={p} onPick={() => pick(p.id)} onHold={() => askRemove(p)} />
            ))}
            <button
              type="button"
              onClick={addNew}
              aria-label="New player"
              className="rounded-3xl border-4 border-dashed border-cream-dark p-4 flex flex-col items-center justify-center gap-1 min-h-36 cursor-pointer"
            >
              <span className="font-display text-2xl font-bold text-ink-soft">+</span>
              <span className="font-display font-bold text-ink-soft text-sm">New player</span>
            </button>
          </div>
          <p className="mt-1 text-xs text-ink-soft font-bold">Parents: hold a card to remove a player</p>
        </>
      )}

      {removing && question && (
        <Modal onClose={cancelRemove}>
          <h2 className="font-display text-xl font-bold text-ink mb-2">
            Remove {removing.name || 'this player'}?
          </h2>
          <p className="text-ink-soft font-bold mb-4">Their progress will be erased.</p>
          <p className="font-display font-bold text-ink mb-2">
            What is {question.a} + {question.b}?
          </p>
          <input
            autoFocus
            inputMode="numeric"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full text-center text-2xl font-display font-bold rounded-2xl border-2 border-cream-dark px-4 py-3 mb-3"
          />
          {gateError && <p className="text-coral font-bold mb-2">Not quite. Try again!</p>}
          <div className="flex gap-3">
            <Button color="white" size="md" full onClick={cancelRemove}>
              Cancel
            </Button>
            <Button color="coral" size="md" full onClick={confirmRemove} silent>
              Remove
            </Button>
          </div>
        </Modal>
      )}
    </Screen>
  )
}

/** One kid's card. A quick tap signs them in. A long hold (parents only) offers to remove them. */
function ProfileCard({ profile, onPick, onHold }: { profile: ProfileMeta; onPick: () => void; onHold: () => void }) {
  const timerRef = useRef<number | null>(null)
  const heldRef = useRef(false)

  function startPress() {
    heldRef.current = false
    timerRef.current = window.setTimeout(() => {
      heldRef.current = true
      sfx.tap()
      onHold()
    }, HOLD_MS)
  }

  function endPress() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = null
  }

  function handleClick() {
    // The long-press already handled this tap. A normal tap picks the kid.
    if (heldRef.current) {
      heldRef.current = false
      return
    }
    onPick()
  }

  return (
    <button
      type="button"
      aria-label={`Play as ${profile.name || 'new player'}`}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onPointerCancel={endPress}
      onClick={handleClick}
      className="btn-chunky bg-white rounded-3xl p-4 flex flex-col items-center gap-2 min-h-36 cursor-pointer"
    >
      <Mascot buddyId={profile.buddyId} size="sm" />
      <span className="font-display font-bold text-lg text-ink truncate max-w-full">
        {profile.name || 'New player'}
      </span>
    </button>
  )
}
