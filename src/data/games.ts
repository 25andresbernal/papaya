// The arcade. Games are the prize for learning.
// Unlock a game once with papayas. Then each play costs a ticket.
// Tickets only come from finishing lessons. That is the rule that makes Papaya work.

import type { MiniGameDef } from '../types'

export const GAMES: MiniGameDef[] = [
  {
    id: 'pinata',
    title: 'Piñata Party',
    emoji: '🪅',
    description: 'Smash the piñata that says the right word!',
    unlockCost: 0,
    ticketCost: 1,
    usesSpanish: true,
  },
  {
    id: 'memory',
    title: 'Match Cards',
    emoji: '🃏',
    description: 'Flip cards. Match the Spanish word to its picture.',
    unlockCost: 120,
    requiresUnitId: 'u1',
    ticketCost: 1,
    usesSpanish: true,
  },
  {
    id: 'feed',
    title: 'Feed Capi',
    emoji: '🍉',
    description: 'Capi is hungry! Give him what he asks for in Spanish.',
    unlockCost: 180,
    requiresUnitId: 'u2',
    ticketCost: 1,
    usesSpanish: true,
  },
  {
    id: 'catch',
    title: 'Papaya Catch',
    emoji: '🧺',
    description: 'Catch the falling fruit that matches the word. Dodge the rest!',
    unlockCost: 250,
    requiresUnitId: 'u3',
    ticketCost: 1,
    usesSpanish: true,
  },
  {
    id: 'paint',
    title: 'Color Splash',
    emoji: '🎨',
    description: 'Paint the picture. Pick the color by its Spanish name.',
    unlockCost: 300,
    requiresUnitId: 'u4',
    ticketCost: 1,
    usesSpanish: true,
  },
  {
    id: 'run',
    title: 'Jungle Run',
    emoji: '🏃',
    description: 'Run through the jungle! Answer fast to jump over logs.',
    unlockCost: 400,
    requiresUnitId: 'u5',
    ticketCost: 1,
    usesSpanish: true,
  },
]

const BY_ID = new Map(GAMES.map((g) => [g.id, g]))

export function getGame(id: string): MiniGameDef | undefined {
  return BY_ID.get(id)
}
