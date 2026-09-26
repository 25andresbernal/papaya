// Saving and loading one kid's progress in the browser.
// localStorage is like a tiny notebook the browser keeps for our app.
// No accounts, no servers. Everything stays on this device.
// Which notebook page we use depends on the profile id (see profiles.ts).

import type { PlayerState } from '../types'
import { playerKey } from './profiles'

/** The state a brand new kid starts with. */
export function makeNewPlayer(): PlayerState {
  return {
    version: 2,
    name: '',
    onboarded: false,
    buddyId: 'tico',
    hero: { color: '#FF8A3D', equipped: {} },

    xp: 0,
    coins: 0,
    tickets: 0,

    streak: 0,
    bestStreak: 0,
    streakFreezes: 0,
    lastPlayDate: null,
    lastChestDate: null,
    lessonsToday: 0,
    lessonsCompleted: 0,

    completedLessonIds: [],
    crowns: {},
    words: {},
    lessonBestMs: {},
    placementUnit: 0,

    unlockedCharacterIds: ['tico'],
    ownedItemIds: [],
    unlockedGameIds: [],
    gameHighScores: {},

    settings: { sound: true, music: true, speak: true, timer: false, raceClock: true, voiceEs: null, voiceEn: null },
  }
}

/** Load a profile's saved progress, or start fresh if there is none. */
export function loadPlayer(profileId: string): PlayerState {
  try {
    const raw = localStorage.getItem(playerKey(profileId))
    if (!raw) return makeNewPlayer()
    const saved = JSON.parse(raw) as Partial<PlayerState>
    // Merge on top of a fresh player so new fields always exist.
    const fresh = makeNewPlayer()
    return {
      ...fresh,
      ...saved,
      version: fresh.version,
      hero: { ...fresh.hero, ...(saved.hero ?? {}) },
      settings: { ...fresh.settings, ...(saved.settings ?? {}) },
      lessonBestMs: saved.lessonBestMs ?? {},
    }
  } catch {
    return makeNewPlayer()
  }
}

/** Save a profile's progress. Called after every change. */
export function savePlayer(profileId: string, state: PlayerState): void {
  try {
    localStorage.setItem(playerKey(profileId), JSON.stringify(state))
  } catch {
    // If the browser will not let us save, the game still works for now.
  }
}

/** Erase one profile's progress. Used by the parent "start over" button. */
export function resetPlayer(profileId: string): void {
  try {
    localStorage.removeItem(playerKey(profileId))
  } catch {
    // Nothing to do.
  }
}
