// Find the hand-drawn picture for a word.
// <WordArt wordId="mama" emoji="👩" size={64} /> draws mom.
// If a word has no drawing yet, we show the flat Twemoji picture instead,
// so nothing is ever blank.

import type { ComponentType } from 'react'
import type { WordArtProps } from './primitives'
import Pic from '../Pic'
import { U1_ART } from './u1'
import { U2_ART } from './u2'
import { U3_ART } from './u3'
import { U4_ART } from './u4'
import { U5_ART } from './u5'
import { U6_ART } from './u6'
import { U7_ART } from './u7'
import { U8_ART } from './u8'
import { U9_ART } from './u9'
import { U10_ART } from './u10'

export type { WordArtProps }

/** Every word picture, by word id. Later units never overwrite earlier ones. */
export const WORD_ART: Record<string, ComponentType<WordArtProps>> = {
  ...U10_ART,
  ...U9_ART,
  ...U8_ART,
  ...U7_ART,
  ...U6_ART,
  ...U5_ART,
  ...U4_ART,
  ...U3_ART,
  ...U2_ART,
  ...U1_ART,
}

export function hasWordArt(wordId: string): boolean {
  return wordId in WORD_ART
}

export default function WordArt({
  wordId,
  emoji,
  size = 64,
  className = '',
  label,
}: {
  wordId: string
  /** Fallback picture if there is no drawing for this word yet. */
  emoji?: string
  size?: number
  className?: string
  label?: string
}) {
  const Art = WORD_ART[wordId]
  if (Art) return <Art size={size} className={className} label={label} />
  if (emoji) return <Pic emoji={emoji} size={size} className={className} label={label} />
  return null
}
