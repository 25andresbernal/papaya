// The Buddies screen. This is like a sticker album for all the animal
// characters. Some you already have. Some cost papayas. Some need you to
// finish a unit first. Tap a buddy you own to make them your best friend!

import { useState } from 'react'
import type { Character, Rarity } from '../types'
import { CHARACTERS } from '../data/characters'
import { getUnit, isUnitComplete } from '../data/words'
import { usePlayer } from '../game/PlayerContext'
import { sfx, speak } from '../audio/sound'
import { mascotLine } from '../ai/mascot'
import Screen from '../components/Screen'
import Mascot from '../components/Mascot'
import Button from '../components/Button'
import Celebration from '../components/Celebration'

// Colors for the little rarity tag on each card.
const RARITY_STYLES: Record<Rarity, string> = {
  common: 'bg-gray-300 text-ink',
  rare: 'bg-sky text-white',
  epic: 'bg-[#B388FF] text-white',
  legendary: 'bg-sun text-seed',
}

export default function CharactersScreen() {
  const { player, unlockCharacter, setBuddy } = usePlayer()
  // We remember the buddy we just unlocked so we can show a big celebration.
  const [celebrating, setCelebrating] = useState<Character | null>(null)
  // Once true, the mascot at the top brags about the new friend instead of
  // showing the plain "learn to earn" tip.
  const [justUnlocked, setJustUnlocked] = useState(false)
  // A card wiggles for a moment when you tap it but cannot afford it yet.
  const [shakeId, setShakeId] = useState<string | null>(null)

  const unlockedCount = player.unlockedCharacterIds.length

  function handlePick(character: Character) {
    sfx.pop()
    setBuddy(character.id)
    speak(character.catchphrase)
  }

  function handleUnlock(character: Character) {
    const ok = unlockCharacter(character.id, character.cost)
    if (!ok) return
    setCelebrating(character)
    setJustUnlocked(true)
    speak(character.catchphrase)
  }

  function handleCantAfford(id: string) {
    sfx.wrong()
    setShakeId(id)
    setTimeout(() => setShakeId((s) => (s === id ? null : s)), 400)
  }

  function handleSpeak(character: Character) {
    sfx.pop()
    speak(character.catchphrase)
  }

  return (
    <Screen>
      <Mascot
        buddyId={player.buddyId}
        size="sm"
        className="mt-3 mb-2"
        message={justUnlocked ? mascotLine('unlock') : 'Learn to earn papayas. Papayas unlock buddies.'}
      />

      <div className="flex items-end justify-between mt-2 mb-3">
        <h1 className="text-2xl font-display font-bold text-ink">My buddies</h1>
        <span className="font-display font-bold text-ink-soft">
          {unlockedCount}/{CHARACTERS.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-4">
        {CHARACTERS.map((character) => {
          const unlocked = player.unlockedCharacterIds.includes(character.id)
          const isBuddy = player.buddyId === character.id
          const gateMet = !character.requiresUnitId || isUnitComplete(character.requiresUnitId, player)
          const affordable = player.coins >= character.cost

          return (
            <CharacterCard
              key={character.id}
              character={character}
              unlocked={unlocked}
              isBuddy={isBuddy}
              gateMet={gateMet}
              affordable={affordable}
              shaking={shakeId === character.id}
              onPick={() => handlePick(character)}
              onUnlock={() => handleUnlock(character)}
              onCantAfford={() => handleCantAfford(character.id)}
              onSpeak={() => handleSpeak(character)}
            />
          )
        })}
      </div>

      {celebrating && (
        <Celebration
          emoji={celebrating.emoji}
          title={`You unlocked ${celebrating.name}!`}
          subtitle={celebrating.catchphrase}
          sound="unlock"
          onDone={() => setCelebrating(null)}
        />
      )}
    </Screen>
  )
}

function CharacterCard({
  character,
  unlocked,
  isBuddy,
  gateMet,
  affordable,
  shaking,
  onPick,
  onUnlock,
  onCantAfford,
  onSpeak,
}: {
  character: Character
  unlocked: boolean
  isBuddy: boolean
  gateMet: boolean
  affordable: boolean
  shaking: boolean
  onPick: () => void
  onUnlock: () => void
  onCantAfford: () => void
  onSpeak: () => void
}) {
  // Locked and the unit gate is not finished yet: show nothing to tap.
  const showLockedGate = !unlocked && !gateMet
  // Locked, the gate is done, but there are not enough papayas yet.
  const showTooPoor = !unlocked && gateMet && !affordable
  // Locked, the gate is done, and there are enough papayas to buy it.
  const showAffordable = !unlocked && gateMet && affordable

  return (
    <div
      className={`relative rounded-3xl p-3 bg-white shadow-chunky-sm flex flex-col items-center text-center gap-1
        ${!unlocked ? 'grayscale opacity-70' : ''} ${shaking ? 'animate-shake' : ''}`}
      onClick={showTooPoor ? onCantAfford : undefined}
      role={showTooPoor ? 'button' : undefined}
    >
      {isBuddy && (
        <span className="absolute -top-2 -left-2 bg-leaf text-white text-xs font-display font-bold px-2 py-1 rounded-full shadow-chunky-sm">
          Your buddy
        </span>
      )}

      <button
        type="button"
        className="text-6xl leading-none mt-1 cursor-pointer disabled:cursor-default"
        disabled={!unlocked}
        aria-label={unlocked ? `Hear ${character.name}` : character.name}
        onClick={unlocked ? onSpeak : undefined}
      >
        {unlocked ? character.emoji : '🔒'}
      </button>

      <p className="font-display font-bold text-ink leading-tight">{character.name}</p>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${RARITY_STYLES[character.rarity]}`}>
        {character.rarity}
      </span>
      <p className="text-xs text-ink-soft leading-snug">{character.home}</p>

      <div className="mt-1 w-full">
        {unlocked && !isBuddy && (
          <Button color="sky" size="sm" full onClick={onPick}>
            Pick me
          </Button>
        )}
        {showAffordable && (
          <Button color="papaya" size="sm" full onClick={onUnlock}>
            🥭 {character.cost}
          </Button>
        )}
        {showLockedGate && (
          <p className="text-xs text-ink-soft font-bold">Finish {getUnit(character.requiresUnitId ?? '')?.title ?? 'a unit'}</p>
        )}
        {showTooPoor && (
          <>
            <p className="font-display font-bold text-ink-soft">🥭 {character.cost}</p>
            <p className="text-xs text-coral font-bold">Earn more papayas</p>
          </>
        )}
      </div>
    </div>
  )
}
