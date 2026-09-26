// The "rig": the shared parts every buddy and the hero are built from.
// Same eyes, same mouths, same shadow. That is what makes them look like one family.
// Every face is flat shapes. No outlines. No gradients. Like Duolingo's characters.
//
// A buddy draws itself inside a 100 x 100 box. The feet sit near y=90.
// Moods only change the eyes and mouth. The body stays the same.

import type { ReactNode } from 'react'

export type Mood = 'happy' | 'excited' | 'sad' | 'mad' | 'sleepy'

export interface BuddyProps {
  mood?: Mood
  /** Width and height in pixels. */
  size?: number
  className?: string
  /** For screen readers. */
  label?: string
}

/** Shared colors. Every buddy picks from these. Never invent a new one. */
export const INK = '#2D2A26'
export const PAPAYA = '#FF8A3D'
export const PAPAYA_DARK = '#E56F1F'
export const LEAF = '#3DAA47'
export const LEAF_DARK = '#2E8A38'
export const SKY = '#4DA8DA'
export const SKY_DARK = '#2F8AC0'
export const SUN = '#FFC93C'
export const SUN_DARK = '#E0AA1A'
export const CORAL = '#FF6B6B'
export const ROSE = '#FFA6C9'
export const PURPLE = '#B388FF'
export const PURPLE_DARK = '#8E63E0'
export const CREAM = '#FFF6E5'
export const SEED = '#3B2A1A'
export const SEED_LIGHT = '#6B4A2E'
export const WHITE = '#FFFFFF'

/** The flat shadow on the ground under a character's feet. */
export function GroundShadow({ cx = 50, cy = 92, rx = 26, ry = 5 }: { cx?: number; cy?: number; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={INK} opacity={0.18} />
}

/**
 * Two eyes. The mood lives in the eyebrows and lids.
 * cx/cy is the point between the eyes. gap is the distance between pupils.
 */
export function Eyes({
  mood = 'happy',
  cx = 50,
  cy = 40,
  gap = 16,
  r = 6,
  color = INK,
}: {
  mood?: Mood
  cx?: number
  cy?: number
  gap?: number
  r?: number
  color?: string
}) {
  const lx = cx - gap / 2
  const rx = cx + gap / 2
  const white = r * 1.5
  const pupil = mood === 'excited' ? r * 1.15 : r
  const sleepy = mood === 'sleepy'
  const browY = cy - white - 3

  return (
    <g>
      {/* whites */}
      <ellipse cx={lx} cy={cy} rx={white} ry={sleepy ? white * 0.55 : white} fill={WHITE} />
      <ellipse cx={rx} cy={cy} rx={white} ry={sleepy ? white * 0.55 : white} fill={WHITE} />
      {/* pupils */}
      <circle cx={lx} cy={cy + (sleepy ? white * 0.25 : 0)} r={sleepy ? pupil * 0.7 : pupil} fill={color} />
      <circle cx={rx} cy={cy + (sleepy ? white * 0.25 : 0)} r={sleepy ? pupil * 0.7 : pupil} fill={color} />
      {/* sparkles */}
      {!sleepy && (
        <>
          <circle cx={lx + pupil * 0.35} cy={cy - pupil * 0.35} r={pupil * 0.3} fill={WHITE} />
          <circle cx={rx + pupil * 0.35} cy={cy - pupil * 0.35} r={pupil * 0.3} fill={WHITE} />
          {mood === 'excited' && (
            <>
              <circle cx={lx - pupil * 0.4} cy={cy + pupil * 0.3} r={pupil * 0.18} fill={WHITE} />
              <circle cx={rx - pupil * 0.4} cy={cy + pupil * 0.3} r={pupil * 0.18} fill={WHITE} />
            </>
          )}
        </>
      )}
      {/* upper lids for sleepy */}
      {sleepy && (
        <>
          <rect x={lx - white} y={cy - white} width={white * 2} height={white * 0.9} fill="currentColor" opacity={0} />
        </>
      )}
      {/* eyebrows: the main mood lever */}
      {mood === 'mad' && (
        <>
          <path d={`M ${lx - white} ${browY - 2} L ${lx + white * 0.8} ${browY + 4}`} stroke={color} strokeWidth={3} strokeLinecap="round" />
          <path d={`M ${rx + white} ${browY - 2} L ${rx - white * 0.8} ${browY + 4}`} stroke={color} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {mood === 'sad' && (
        <>
          <path d={`M ${lx - white * 0.9} ${browY + 3} L ${lx + white * 0.8} ${browY - 2}`} stroke={color} strokeWidth={3} strokeLinecap="round" />
          <path d={`M ${rx + white * 0.9} ${browY + 3} L ${rx - white * 0.8} ${browY - 2}`} stroke={color} strokeWidth={3} strokeLinecap="round" />
          {/* one little tear */}
          <ellipse cx={rx + white * 0.9} cy={cy + white + 3} rx={2} ry={3.5} fill={SKY} />
        </>
      )}
      {mood === 'excited' && (
        <>
          <path d={`M ${lx - white * 0.9} ${browY} Q ${lx} ${browY - 5} ${lx + white * 0.9} ${browY}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <path d={`M ${rx - white * 0.9} ${browY} Q ${rx} ${browY - 5} ${rx + white * 0.9} ${browY}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </>
      )}
    </g>
  )
}

/** A mouth for each mood. cx/cy is the middle of the mouth. w is its width. */
export function Mouth({
  mood = 'happy',
  cx = 50,
  cy = 56,
  w = 14,
  color = INK,
}: {
  mood?: Mood
  cx?: number
  cy?: number
  w?: number
  color?: string
}) {
  const h = w * 0.45
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d={`M ${cx - w / 2} ${cy - 2} Q ${cx} ${cy + h * 1.6} ${cx + w / 2} ${cy - 2} Z`} fill={color} />
          <path d={`M ${cx - w / 4} ${cy + h * 0.55} Q ${cx} ${cy + h * 1.1} ${cx + w / 4} ${cy + h * 0.55} Z`} fill={CORAL} />
        </g>
      )
    case 'sad':
      return <path d={`M ${cx - w / 2} ${cy + h * 0.5} Q ${cx} ${cy - h} ${cx + w / 2} ${cy + h * 0.5}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" fill="none" />
    case 'mad':
      return <path d={`M ${cx - w / 2} ${cy} L ${cx - w / 6} ${cy + 3} L ${cx + w / 6} ${cy} L ${cx + w / 2} ${cy + 3}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    case 'sleepy':
      return <ellipse cx={cx} cy={cy + 1} rx={w * 0.18} ry={w * 0.24} fill={color} />
    case 'happy':
    default:
      return <path d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy + h * 1.4} ${cx + w / 2} ${cy}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" fill="none" />
  }
}

/** Rosy cheeks. Optional, but they make every face friendlier. */
export function Blush({ cx = 50, cy = 50, gap = 30, color = CORAL }: { cx?: number; cy?: number; gap?: number; color?: string }) {
  return (
    <g opacity={0.45}>
      <ellipse cx={cx - gap / 2} cy={cy} rx={4} ry={2.5} fill={color} />
      <ellipse cx={cx + gap / 2} cy={cy} rx={4} ry={2.5} fill={color} />
    </g>
  )
}

/** Three "Z" letters for sleepy buddies. */
export function Zzz({ x = 74, y = 24 }: { x?: number; y?: number }) {
  return (
    <g fill={SKY_DARK} fontFamily="Fredoka, system-ui, sans-serif" fontWeight={700}>
      <text x={x} y={y} fontSize={9}>z</text>
      <text x={x + 7} y={y - 7} fontSize={7}>z</text>
      <text x={x + 12} y={y - 13} fontSize={5}>z</text>
    </g>
  )
}

/**
 * The wrapper every buddy uses. Gives the SVG box, size, label, and the ground shadow.
 * Put your body shapes, then Eyes, then Mouth inside as children.
 */
export function BuddyFrame({
  size = 96,
  className = '',
  label,
  shadow = true,
  children,
}: {
  size?: number
  className?: string
  label?: string
  shadow?: boolean
  children: ReactNode
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label}
      style={{ display: 'inline-block', overflow: 'visible' }}
    >
      {shadow && <GroundShadow />}
      {children}
    </svg>
  )
}
