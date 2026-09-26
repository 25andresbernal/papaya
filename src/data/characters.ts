// The buddies. All of them are real animals that live in Colombia.
// Kids unlock them with papayas (coins) earned from lessons.
// The first one, Tico, is free so every kid starts with a friend.

import type { Character } from '../types'

export const CHARACTERS: Character[] = [
  {
    id: 'tico',
    name: 'Tico the Toucan',
    emoji: '🦜',
    rarity: 'common',
    cost: 0,
    blurb: 'Tico has a big beak and a bigger heart.',
    home: 'The rainforest',
    catchphrase: '¡Vamos!',
  },
  {
    id: 'lola',
    name: 'Lola the Sloth',
    emoji: '🦥',
    rarity: 'common',
    cost: 0,
    blurb: 'Lola is slow but she never gives up.',
    home: 'The Amazon trees',
    catchphrase: 'Tranquilo...',
  },
  {
    id: 'capi',
    name: 'Capi the Capybara',
    emoji: '🐹',
    rarity: 'common',
    cost: 0,
    blurb: 'Capi is friends with every animal. Every one.',
    home: 'The Llanos rivers',
    catchphrase: '¡Hola, amigo!',
  },
  {
    id: 'pinki',
    name: 'Pinki the Flamingo',
    emoji: '🦩',
    rarity: 'common',
    cost: 120,
    blurb: 'Pinki can stand on one leg all day long.',
    home: 'The Caribbean coast',
    catchphrase: '¡Qué lindo!',
  },
  {
    id: 'rana',
    name: 'Rana the Frog',
    emoji: '🐸',
    rarity: 'common',
    cost: 150,
    blurb: 'Rana is tiny, bright, and very loud.',
    home: 'The Chocó jungle',
    catchphrase: '¡Salta!',
  },
  {
    id: 'manu',
    name: 'Manu the Monkey',
    emoji: '🐒',
    rarity: 'rare',
    cost: 280,
    requiresUnitId: 'u2',
    blurb: 'Manu swings from tree to tree looking for bananas.',
    home: 'The Amazon',
    catchphrase: '¡Más rápido!',
  },
  {
    id: 'coco',
    name: 'Coco the Hummingbird',
    emoji: '🐦',
    rarity: 'rare',
    cost: 300,
    requiresUnitId: 'u3',
    blurb: 'Coco flaps her wings 50 times every second.',
    home: 'The Andes mountains',
    catchphrase: '¡Zum zum!',
  },
  {
    id: 'tortu',
    name: 'Tortu the Sea Turtle',
    emoji: '🐢',
    rarity: 'rare',
    cost: 320,
    requiresUnitId: 'u4',
    blurb: 'Tortu swam across the whole ocean to meet you.',
    home: 'The Pacific coast',
    catchphrase: 'Poco a poco.',
  },
  {
    id: 'osito',
    name: 'Osito the Bear',
    emoji: '🐻',
    rarity: 'epic',
    cost: 550,
    requiresUnitId: 'u5',
    blurb: 'Osito wears glasses made of fur. Really!',
    home: 'The cloud forest',
    catchphrase: '¡Abrazo!',
  },
  {
    id: 'delfi',
    name: 'Delfi the Pink Dolphin',
    emoji: '🐬',
    rarity: 'epic',
    cost: 600,
    requiresUnitId: 'u6',
    blurb: 'Delfi is pink and lives in a river, not the sea.',
    home: 'The Amazon river',
    catchphrase: '¡Splash!',
  },
  {
    id: 'andi',
    name: 'Andi the Condor',
    emoji: '🦅',
    rarity: 'legendary',
    cost: 900,
    requiresUnitId: 'u8',
    blurb: 'Andi is the biggest flying bird in the world.',
    home: 'The high Andes',
    catchphrase: '¡Al cielo!',
  },
  {
    id: 'jagu',
    name: 'Jagu the Jaguar',
    emoji: '🐆',
    rarity: 'legendary',
    cost: 1000,
    requiresUnitId: 'u10',
    blurb: 'Jagu is the king of the jungle and your best friend.',
    home: 'Deep in the jungle',
    catchphrase: '¡Rugido!',
  },
]

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]))

/** Find a character by id. Falls back to Tico so the app never crashes. */
export function getCharacter(id: string): Character {
  return BY_ID.get(id) ?? CHARACTERS[0]
}

/** Characters the kid can pick during onboarding (the free ones). */
export const STARTER_CHARACTER_IDS = CHARACTERS.filter((c) => c.cost === 0).map((c) => c.id)
