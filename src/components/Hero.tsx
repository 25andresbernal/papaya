// The kid's hero: a friendly round explorer in their chosen color,
// built on the same rig as the buddies (same eyes, same mouth, same shadow)
// so the hero looks like it belongs to their family. Wears whatever hats,
// glasses, capes, and pets the kid bought in the shop.

import type { HeroLook } from '../types'
import { getItem } from '../data/shop'
import Pic from './Pic'
import {
  Eyes,
  Mouth,
  Blush,
  GroundShadow,
  type Mood,
  INK,
  SEED,
  PAPAYA,
  PAPAYA_DARK,
  LEAF,
  LEAF_DARK,
  SKY,
  SKY_DARK,
  SUN,
  SUN_DARK,
} from './buddies/rig'

/** Skin tone for the hero's head. Same for every kid. */
const SKIN = '#FFD9B3'
/** The stage the hero stands on: a darker shade of the app's cream background. */
const PLATFORM = '#F6E7CC'
/** Purple used for the hero cape, matching the Hero Cape shop item's vibe. */
const CAPE_COLOR = '#B388FF'

/** Darker shade for each hero color we already name in the shared rig palette. */
const DARK_SHADE: Record<string, string> = {
  [PAPAYA]: PAPAYA_DARK,
  [LEAF]: LEAF_DARK,
  [SKY]: SKY_DARK,
  [SUN]: SUN_DARK,
}

/**
 * A rounded-rect "capsule" shape (used for arms and feet) in a shade darker
 * than the body color. If we know a darker match for this color, use it. If
 * not (a kid-picked color like purple or pink), lay a soft black film over
 * the same shape - cheap way to darken any color without new math.
 */
function DarkCapsule({
  x,
  y,
  width,
  height,
  rx,
  color,
}: {
  x: number
  y: number
  width: number
  height: number
  rx: number
  color: string
}) {
  const dark = DARK_SHADE[color]
  if (dark) return <rect x={x} y={y} width={width} height={height} rx={rx} fill={dark} />
  return (
    <>
      <rect x={x} y={y} width={width} height={height} rx={rx} fill={color} />
      <rect x={x} y={y} width={width} height={height} rx={rx} fill={INK} opacity={0.2} />
    </>
  )
}

export default function Hero({
  look,
  size = 120,
  className = '',
  mood = 'happy',
  platform = size >= 100,
}: {
  look: HeroLook
  size?: number
  className?: string
  mood?: Mood
  platform?: boolean
}) {
  const hat = look.equipped.hat ? getItem(look.equipped.hat) : null
  const glasses = look.equipped.glasses ? getItem(look.equipped.glasses) : null
  const cape = look.equipped.cape ? getItem(look.equipped.cape) : null
  const pet = look.equipped.pet ? getItem(look.equipped.pet) : null

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }} aria-label="Your hero">
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: 'visible' }}>
        {/* the stage the hero stands on, plus the flat ground shadow on top of it */}
        {platform && (
          <>
            <rect x={16} y={88} width={68} height={12} rx={6} fill={PLATFORM} />
            <GroundShadow />
          </>
        )}
        {/* cape, drawn behind the body */}
        {cape && <path d="M32 56 L18 96 L82 96 L68 56 Z" fill={CAPE_COLOR} opacity={0.9} />}
        {/* feet peek out from under the body */}
        <DarkCapsule x={36} y={80} width={12} height={12} rx={5} color={look.color} />
        <DarkCapsule x={52} y={80} width={12} height={12} rx={5} color={look.color} />
        {/* body: a small capsule in the hero's chosen color */}
        <rect x={30} y={52} width={40} height={36} rx={18} fill={look.color} />
        {/* stub arms on each side */}
        <DarkCapsule x={20} y={58} width={10} height={20} rx={5} color={look.color} />
        <DarkCapsule x={70} y={58} width={10} height={20} rx={5} color={look.color} />
        {/* head */}
        <circle cx={50} cy={32} r={24} fill={SKIN} />
        {/* a simple hair cap that follows the head's own curve, styled later with more shapes for variety */}
        <path d="M28 22 A24 24 0 0 1 72 22 Q60 27 50 25 Q40 27 28 22 Z" fill={SEED} />
        {/* face, from the shared rig so it matches the buddies exactly */}
        <Eyes mood={mood} cx={50} cy={30} gap={16} r={6} />
        <Blush cx={50} cy={34} gap={32} />
        <Mouth mood={mood} cx={50} cy={40} w={14} />
      </svg>
      {glasses && (
        <div className="absolute left-0 right-0 flex justify-center" style={{ top: size * 0.21 }}>
          <Pic emoji={glasses.emoji} size={size * 0.24} label={glasses.name} />
        </div>
      )}
      {hat && (
        <div className="absolute left-0 right-0 flex justify-center" style={{ top: -size * 0.06 }}>
          <Pic emoji={hat.emoji} size={size * 0.34} label={hat.name} />
        </div>
      )}
      {pet && (
        <div className="absolute" style={{ right: -size * 0.08, bottom: platform ? size * 0.1 : 0 }}>
          <Pic emoji={pet.emoji} size={size * 0.3} label={pet.name} />
        </div>
      )}
    </div>
  )
}
