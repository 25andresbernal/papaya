// One place to find every buddy's picture by id.
// <Buddy id="tico" mood="excited" size={120} /> draws Tico, excited, 120px wide.
// If an id is unknown we fall back to the character's emoji so nothing ever breaks.

import type { ComponentType } from 'react'
import type { BuddyProps, Mood } from './rig'
import { getCharacter } from '../../data/characters'
import Tico from './Tico'
import Lola from './Lola'
import Capi from './Capi'
import Pinki from './Pinki'
import Rana from './Rana'
import Manu from './Manu'
import Coco from './Coco'
import Tortu from './Tortu'
import Osito from './Osito'
import Delfi from './Delfi'
import Andi from './Andi'
import Jagu from './Jagu'

export type { Mood, BuddyProps }

export const BUDDY_ART: Record<string, ComponentType<BuddyProps>> = {
  tico: Tico,
  lola: Lola,
  capi: Capi,
  pinki: Pinki,
  rana: Rana,
  manu: Manu,
  coco: Coco,
  tortu: Tortu,
  osito: Osito,
  delfi: Delfi,
  andi: Andi,
  jagu: Jagu,
}

export default function Buddy({ id, mood = 'happy', size = 96, className = '' }: { id: string; mood?: Mood; size?: number; className?: string }) {
  const Art = BUDDY_ART[id]
  const c = getCharacter(id)
  if (!Art) {
    return (
      <span className={className} style={{ fontSize: size * 0.8, lineHeight: 1 }} role="img" aria-label={c.name}>
        {c.emoji}
      </span>
    )
  }
  return <Art mood={mood} size={size} className={className} label={c.name} />
}
