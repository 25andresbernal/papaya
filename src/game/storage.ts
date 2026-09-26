// Saving and loading the kid's progress in the browser.
// localStorage is like a tiny notebook the browser keeps for our app.
// No accounts, no servers. Everything stays on this device.

import type { PlayerState } from '../types'

const KEY = 'papaya.player.v1'

/** The state a brand new kid starts with. */
export function makeNewPlayer(): PlayerState {
  return {
    version: 1,
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

    unlockedCharacterIds: ['tico'],
    ownedItemIds: [],
    unlockedGameIds: [],
    gameHighScores: {},

    settings: { sound: true, music: true, speak: true, timer: false },
  }
}

/** Load saved progress, or start fresh if there is none. */
export function loadPlayer(): PlayerState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return makeNewPlayer()
    const saved = JSON.parse(raw) as Partial<PlayerState>
    // Merge on top of a fresh player so new fields always exist.
    const fresh = makeNewPlayer()
    return {
      ...fresh,
      ...saved,
      hero: { ...fresh.hero, ...(saved.hero ?? {}) },
      settings: { ...fresh.settings, ...(saved.settings ?? {}) },
    }
  } catch {
    return makeNewPlayer()
  }
}

/** Save progress. Called after every change. */
export function savePlayer(state: PlayerState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // If the browser will not let us save, the game still works for now.
  }
}

/** Erase everything. Used by the parent "start over" button. */
export function resetPlayer(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to do.
  }
}
