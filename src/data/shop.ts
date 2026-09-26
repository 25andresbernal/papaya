// Things the kid can buy for their hero. Only looks. Never power.
// No real money ever. Only papayas earned by learning.

import type { ShopItem } from '../types'

export const SHOP_ITEMS: ShopItem[] = [
  // Hats
  { id: 'hat-cap', name: 'Sun Cap', emoji: '🧢', slot: 'hat', cost: 60, rarity: 'common' },
  { id: 'hat-party', name: 'Party Hat', emoji: '🎉', slot: 'hat', cost: 80, rarity: 'common' },
  { id: 'hat-sombrero', name: 'Vueltiao Hat', emoji: '👒', slot: 'hat', cost: 150, rarity: 'rare' },
  { id: 'hat-crown', name: 'Crown', emoji: '👑', slot: 'hat', cost: 400, rarity: 'epic' },
  { id: 'hat-wizard', name: 'Wizard Hat', emoji: '🎩', slot: 'hat', cost: 220, rarity: 'rare' },
  // Glasses
  { id: 'glasses-cool', name: 'Cool Shades', emoji: '🕶️', slot: 'glasses', cost: 90, rarity: 'common' },
  { id: 'glasses-smart', name: 'Smart Glasses', emoji: '👓', slot: 'glasses', cost: 90, rarity: 'common' },
  // Capes
  { id: 'cape-hero', name: 'Hero Cape', emoji: '🦸', slot: 'cape', cost: 250, rarity: 'rare' },
  // Pets (tiny friends that sit next to the hero)
  { id: 'pet-butterfly', name: 'Blue Butterfly', emoji: '🦋', slot: 'pet', cost: 120, rarity: 'common' },
  { id: 'pet-cat', name: 'Little Cat', emoji: '🐱', slot: 'pet', cost: 180, rarity: 'rare' },
  { id: 'pet-dragon', name: 'Baby Dragon', emoji: '🐉', slot: 'pet', cost: 500, rarity: 'epic' },
  // Backgrounds
  { id: 'bg-beach', name: 'Beach', emoji: '🏖️', slot: 'background', cost: 100, rarity: 'common' },
  { id: 'bg-jungle', name: 'Jungle', emoji: '🌴', slot: 'background', cost: 100, rarity: 'common' },
  { id: 'bg-mountain', name: 'Mountains', emoji: '🏔️', slot: 'background', cost: 160, rarity: 'rare' },
  { id: 'bg-space', name: 'Space', emoji: '🌌', slot: 'background', cost: 350, rarity: 'epic' },
]

const BY_ID = new Map(SHOP_ITEMS.map((i) => [i.id, i]))

export function getItem(id: string): ShopItem | undefined {
  return BY_ID.get(id)
}

/** Hero color choices during onboarding and in the shop (free). */
export const HERO_COLORS = ['#FF8A3D', '#4DA8DA', '#3DAA47', '#FFC93C', '#FF6B6B', '#B388FF', '#FF9AD5', '#2D2A26']
