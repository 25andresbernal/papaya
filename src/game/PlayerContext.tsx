// The PlayerContext is the one place that holds the kid's progress while the app runs.
// Any screen can call usePlayer() to read the state or change it.
// Every change is saved to the browser right away.
//
// It also knows WHO is playing. More than one kid can share a phone:
// each has a profile, and switching profiles swaps the whole saved game.

/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { ExerciseResult, LessonSummary, PlayerState, ShopSlot } from '../types'
import { loadPlayer, makeNewPlayer, resetPlayer, savePlayer } from './storage'
import {
  createProfile as createProfileInStorage,
  deleteProfile as deleteProfileInStorage,
  getActiveProfileId,
  listProfiles,
  setActiveProfileId,
  updateProfileMeta,
} from './profiles'
import type { ProfileMeta } from './profiles'
import { applyLesson, canOpenChest, checkStreakOnOpen } from './progression'
import { ECONOMY } from './economy'
import { randInt } from '../utils/random'
import { todayKey } from '../utils/date'
import { UNITS } from '../data/curriculum'

export interface PlayerApi {
  player: PlayerState
  /** Replace part of the state. Prefer the named helpers below. */
  update: (patch: Partial<PlayerState> | ((p: PlayerState) => PlayerState)) => void

  /* ---------- profiles: who is playing ---------- */
  /** Everyone who has a save on this device. */
  profiles: ProfileMeta[]
  /** The active profile id, or null when nobody is signed in. */
  activeProfileId: string | null
  /** Make this kid the active player. Loads their save. */
  switchProfile: (id: string) => void
  /** Add a brand new kid and make them active. They go through onboarding next. */
  createProfile: () => string
  /** Sign out: nobody is active, so the "who is playing?" screen shows. */
  signOut: () => void
  /** Remove a kid and their save for good. */
  deleteProfile: (id: string) => void

  /** Onboarding: set name, buddy, hero color, and mark onboarded. */
  finishOnboarding: (name: string, buddyId: string, color: string) => void
  /**
   * Placement: the kid already knows the first `unitCount` units.
   * Marks those lessons done (1 crown) and their words as known, so the path
   * opens up at the right spot. 0 means start at the very beginning.
   */
  applyPlacement: (unitCount: number) => void

  /**
   * Called by the lesson screen when the last exercise is done.
   * elapsedMs is how long the lesson took (for racing yourself).
   */
  completeLesson: (lessonId: string, unitId: string, results: ExerciseResult[], elapsedMs?: number) => LessonSummary

  /** Spend papayas. Returns false if the kid cannot afford it. */
  spendCoins: (amount: number) => boolean
  /** Add papayas (mini-games use this for small bonuses). */
  addCoins: (amount: number) => void

  /** Spend one ticket to play a game. Returns false if none left. */
  spendTicket: (count?: number) => boolean

  unlockCharacter: (id: string, cost: number) => boolean
  setBuddy: (id: string) => void
  buyItem: (id: string, cost: number) => boolean
  equipItem: (slot: ShopSlot, id: string | null) => void
  setHeroColor: (color: string) => void
  unlockGame: (id: string, cost: number) => boolean
  recordGameScore: (gameId: string, score: number) => void

  /** Daily chest. Returns the reward or null if not available. */
  openDailyChest: () => { coins: number; tickets: number } | null
  chestAvailable: boolean

  setSetting: <K extends keyof PlayerState['settings']>(key: K, value: PlayerState['settings'][K]) => void
  /** Wipe the active kid's progress and start fresh (keeps the profile). */
  reset: () => void
}

const PlayerContext = createContext<PlayerApi | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activeProfileId, setActiveId] = useState<string | null>(() => getActiveProfileId())
  const [profiles, setProfiles] = useState<ProfileMeta[]>(() => listProfiles())
  const [player, setPlayer] = useState<PlayerState>(() =>
    activeProfileId ? checkStreakOnOpen(loadPlayer(activeProfileId)) : makeNewPlayer(),
  )
  // Keep the newest state in a ref so helpers that return values can read it.
  const ref = useRef(player)
  ref.current = player
  const idRef = useRef(activeProfileId)
  idRef.current = activeProfileId

  // Save after every change, and keep the profile list's name/buddy/color fresh.
  useEffect(() => {
    if (!activeProfileId) return
    savePlayer(activeProfileId, player)
    updateProfileMeta(activeProfileId, {
      name: player.name,
      buddyId: player.buddyId,
      color: player.hero.color,
      lastPlayedAt: Date.now(),
    })
    setProfiles(listProfiles())
  }, [player, activeProfileId])

  const update = useCallback<PlayerApi['update']>((patch) => {
    setPlayer((p) => {
      const next = typeof patch === 'function' ? patch(p) : { ...p, ...patch }
      ref.current = next
      return next
    })
  }, [])

  /* ---------- profiles ---------- */

  const switchProfile = useCallback((id: string) => {
    setActiveProfileId(id)
    const loaded = checkStreakOnOpen(loadPlayer(id))
    ref.current = loaded
    idRef.current = id
    setActiveId(id)
    setPlayer(loaded)
    setProfiles(listProfiles())
  }, [])

  const createProfile = useCallback(() => {
    const id = createProfileInStorage()
    const fresh = makeNewPlayer()
    ref.current = fresh
    idRef.current = id
    setActiveId(id)
    setPlayer(fresh)
    setProfiles(listProfiles())
    return id
  }, [])

  const signOut = useCallback(() => {
    setActiveProfileId(null)
    idRef.current = null
    setActiveId(null)
    setProfiles(listProfiles())
  }, [])

  const deleteProfile = useCallback((id: string) => {
    deleteProfileInStorage(id)
    if (idRef.current === id) {
      idRef.current = null
      setActiveId(null)
    }
    setProfiles(listProfiles())
  }, [])

  /* ---------- progress ---------- */

  const finishOnboarding = useCallback<PlayerApi['finishOnboarding']>(
    (name, buddyId, color) => {
      update((p) => ({
        ...p,
        name: name.trim().slice(0, 16) || 'Explorer',
        buddyId,
        onboarded: true,
        hero: { ...p.hero, color },
        unlockedCharacterIds: p.unlockedCharacterIds.includes(buddyId)
          ? p.unlockedCharacterIds
          : [...p.unlockedCharacterIds, buddyId],
      }))
    },
    [update],
  )

  const applyPlacement = useCallback<PlayerApi['applyPlacement']>(
    (unitCount) => {
      const units = UNITS.slice(0, Math.max(0, Math.min(unitCount, UNITS.length)))
      const now = Date.now()
      update((p) => {
        const completedLessonIds = [...p.completedLessonIds]
        const crowns = { ...p.crowns }
        const words = { ...p.words }
        for (const unit of units) {
          for (const lesson of unit.lessons) {
            if (!completedLessonIds.includes(lesson.id)) completedLessonIds.push(lesson.id)
            crowns[lesson.id] = Math.max(crowns[lesson.id] ?? 0, 1)
            for (const wordId of lesson.wordIds) {
              if (!words[wordId] || words[wordId].timesSeen === 0) {
                // Box 2 = "known, check again in a few days".
                words[wordId] = { box: 2, timesSeen: 1, timesCorrect: 1, timesWrong: 0, lastSeen: now, due: now + 3 * 86_400_000 }
              }
            }
          }
        }
        return { ...p, completedLessonIds, crowns, words, placementUnit: units.length }
      })
    },
    [update],
  )

  const completeLesson = useCallback<PlayerApi['completeLesson']>(
    (lessonId, unitId, results, elapsedMs = 0) => {
      const { state, summary } = applyLesson(ref.current, lessonId, unitId, results, Date.now(), elapsedMs)
      update(state)
      return summary
    },
    [update],
  )

  const spendCoins = useCallback<PlayerApi['spendCoins']>(
    (amount) => {
      if (ref.current.coins < amount) return false
      update((p) => ({ ...p, coins: p.coins - amount }))
      return true
    },
    [update],
  )

  const addCoins = useCallback<PlayerApi['addCoins']>(
    (amount) => update((p) => ({ ...p, coins: p.coins + Math.max(0, Math.floor(amount)) })),
    [update],
  )

  const spendTicket = useCallback<PlayerApi['spendTicket']>(
    (count = 1) => {
      if (ref.current.tickets < count) return false
      update((p) => ({ ...p, tickets: p.tickets - count }))
      return true
    },
    [update],
  )

  const unlockCharacter = useCallback<PlayerApi['unlockCharacter']>(
    (id, cost) => {
      const p = ref.current
      if (p.unlockedCharacterIds.includes(id)) return true
      if (p.coins < cost) return false
      update((s) => ({
        ...s,
        coins: s.coins - cost,
        unlockedCharacterIds: [...s.unlockedCharacterIds, id],
      }))
      return true
    },
    [update],
  )

  const setBuddy = useCallback<PlayerApi['setBuddy']>(
    (id) => update((p) => (p.unlockedCharacterIds.includes(id) ? { ...p, buddyId: id } : p)),
    [update],
  )

  const buyItem = useCallback<PlayerApi['buyItem']>(
    (id, cost) => {
      const p = ref.current
      if (p.ownedItemIds.includes(id)) return true
      if (p.coins < cost) return false
      update((s) => ({ ...s, coins: s.coins - cost, ownedItemIds: [...s.ownedItemIds, id] }))
      return true
    },
    [update],
  )

  const equipItem = useCallback<PlayerApi['equipItem']>(
    (slot, id) => {
      update((p) => {
        const equipped = { ...p.hero.equipped }
        if (id === null) delete equipped[slot]
        else if (p.ownedItemIds.includes(id)) equipped[slot] = id
        return { ...p, hero: { ...p.hero, equipped } }
      })
    },
    [update],
  )

  const setHeroColor = useCallback<PlayerApi['setHeroColor']>(
    (color) => update((p) => ({ ...p, hero: { ...p.hero, color } })),
    [update],
  )

  const unlockGame = useCallback<PlayerApi['unlockGame']>(
    (id, cost) => {
      const p = ref.current
      if (p.unlockedGameIds.includes(id)) return true
      if (p.coins < cost) return false
      update((s) => ({ ...s, coins: s.coins - cost, unlockedGameIds: [...s.unlockedGameIds, id] }))
      return true
    },
    [update],
  )

  const recordGameScore = useCallback<PlayerApi['recordGameScore']>(
    (gameId, score) => {
      update((p) => ({
        ...p,
        gameHighScores: { ...p.gameHighScores, [gameId]: Math.max(p.gameHighScores[gameId] ?? 0, score) },
      }))
    },
    [update],
  )

  const chestAvailable = canOpenChest(player)

  const openDailyChest = useCallback<PlayerApi['openDailyChest']>(() => {
    const p = ref.current
    if (!canOpenChest(p)) return null
    const coins = randInt(ECONOMY.dailyChestCoins.min, ECONOMY.dailyChestCoins.max)
    const tickets = ECONOMY.dailyChestTickets
    update((s) => ({
      ...s,
      coins: s.coins + coins,
      tickets: Math.min(ECONOMY.maxTickets, s.tickets + tickets),
      lastChestDate: todayKey(),
    }))
    return { coins, tickets }
  }, [update])

  const setSetting = useCallback<PlayerApi['setSetting']>(
    (key, value) => update((p) => ({ ...p, settings: { ...p.settings, [key]: value } })),
    [update],
  )

  const reset = useCallback(() => {
    const id = idRef.current
    if (id) resetPlayer(id)
    const fresh = makeNewPlayer()
    ref.current = fresh
    setPlayer(fresh)
  }, [])

  const api = useMemo<PlayerApi>(
    () => ({
      player,
      update,
      profiles,
      activeProfileId,
      switchProfile,
      createProfile,
      signOut,
      deleteProfile,
      finishOnboarding,
      applyPlacement,
      completeLesson,
      spendCoins,
      addCoins,
      spendTicket,
      unlockCharacter,
      setBuddy,
      buyItem,
      equipItem,
      setHeroColor,
      unlockGame,
      recordGameScore,
      openDailyChest,
      chestAvailable,
      setSetting,
      reset,
    }),
    [
      player,
      update,
      profiles,
      activeProfileId,
      switchProfile,
      createProfile,
      signOut,
      deleteProfile,
      finishOnboarding,
      applyPlacement,
      completeLesson,
      spendCoins,
      addCoins,
      spendTicket,
      unlockCharacter,
      setBuddy,
      buyItem,
      equipItem,
      setHeroColor,
      unlockGame,
      recordGameScore,
      openDailyChest,
      chestAvailable,
      setSetting,
      reset,
    ],
  )

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>
}

/** Read and change the kid's progress from any screen. */
export function usePlayer(): PlayerApi {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}
