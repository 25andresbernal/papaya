// Shared parts for word pictures ("word art").
// Every word in a lesson gets a hand-drawn picture built from these parts,
// so the whole set looks like one family, and matches the buddies.
//
// Rules (see docs/design/word-art.md):
//   * Draw in a 100 x 100 box. Keep the picture inside x 8..92, y 8..92.
//   * Flat shapes only. No gradients. Strokes only when a thing needs a line
//     (a pencil edge, a wire): 3px, INK, round caps.
//   * Use ONLY the colors exported here.
//   * People are drawn with <Kid/> so every person in the app matches.
//   * Anything said out loud gets a <Bubble/>.

import type { ReactNode } from 'react'
import { Eyes, Mouth, Blush } from '../buddies/rig'
import type { Mood } from '../buddies/rig'

export type { Mood }

/* ------------------------------ colors ------------------------------ */
export const INK = '#2D2A26'
export const INK_SOFT = '#6B655C'
export const PAPAYA = '#FF8A3D'
export const PAPAYA_DARK = '#E56F1F'
export const LEAF = '#3DAA47'
export const LEAF_DARK = '#2E8A38'
export const SKY = '#4DA8DA'
export const SKY_DARK = '#2F8AC0'
export const SUN = '#FFC93C'
export const SUN_DARK = '#E0AA1A'
export const CORAL = '#FF6B6B'
export const CORAL_DARK = '#E04E4E'
export const ROSE = '#FFA6C9'
export const PURPLE = '#B388FF'
export const PURPLE_DARK = '#8E63E0'
export const CREAM = '#FFF6E5'
export const CREAM_DARK = '#F6E7CC'
export const SEED = '#3B2A1A'
export const SEED_LIGHT = '#6B4A2E'
export const WHITE = '#FFFFFF'
export const GRAY = '#B8B2A7'
export const GRAY_DARK = '#8A847A'
export const SKIN = '#FFD9B3'
export const SKIN_DARK = '#D9A876'
export const SKIN_DEEP = '#8D5A3A'

export interface WordArtProps {
  /** Width and height in pixels. */
  size?: number
  className?: string
  label?: string
}

/** The outer SVG every word picture uses. */
export function ArtFrame({
  size = 64,
  className = '',
  label,
  children,
}: WordArtProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label}
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      {children}
    </svg>
  )
}

/** A soft rounded background tile. Use one per picture for a consistent card look. */
export function Tile({ color = CREAM_DARK }: { color?: string }) {
  return <rect x={4} y={4} width={92} height={92} rx={22} fill={color} />
}

/** A flat shadow on the ground under a thing or a person. */
export function Ground({ cx = 50, cy = 90, rx = 24 }: { cx?: number; cy?: number; rx?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={4} fill={INK} opacity={0.14} />
}

/* ------------------------------ people ------------------------------ */

export type Hair = 'short' | 'long' | 'bun' | 'curly' | 'bald' | 'tuft' | 'ponytail'
export type Arms = 'down' | 'wave' | 'up' | 'hug' | 'hold' | 'point' | 'hips'
export type KidPose = 'stand' | 'sit' | 'lie' | 'run' | 'jump'

export interface KidProps {
  /** Where the kid stands. cx is the middle, baseY is where the feet touch. */
  cx?: number
  baseY?: number
  /** 1 = full size (about 70 tall). Use 0.6 for a small kid next to a big object. */
  scale?: number
  mood?: Mood
  hair?: Hair
  hairColor?: string
  skin?: string
  shirt?: string
  pants?: string
  arms?: Arms
  pose?: KidPose
  /** Glasses for abuela/abuelo/maestra. */
  glasses?: boolean
  /** A gray mustache for abuelo. */
  mustache?: boolean
  /** Anything to draw in the kid's hand when arms is 'hold' (drawn around x+22, y-10 from the hand). */
  children?: ReactNode
}

/**
 * A little person. Every mom, dad, abuela, friend, and "you" in the app is this same
 * figure with different hair, colors, and arms. Faces come from the buddy rig.
 */
export function Kid({
  cx = 50,
  baseY = 90,
  scale = 1,
  mood = 'happy',
  hair = 'short',
  hairColor = SEED,
  skin = SKIN,
  shirt = SKY,
  pants = SEED_LIGHT,
  arms = 'down',
  pose = 'stand',
  glasses = false,
  mustache = false,
  children,
}: KidProps) {
  // Everything is drawn around (0,0) = feet middle, then moved and scaled.
  const headR = 15
  const headY = -52
  const bodyTop = -40
  const legTop = -18
  const lying = pose === 'lie'
  const sitting = pose === 'sit'
  const running = pose === 'run'
  const jumping = pose === 'jump'

  const armPath = (side: 1 | -1) => {
    const sx = side * 11
    const sy = bodyTop + 6
    switch (arms) {
      case 'wave':
        return side === 1 ? `M ${sx} ${sy} L ${sx + 10} ${sy - 18}` : `M ${sx} ${sy} L ${sx - 4} ${sy + 16}`
      case 'up':
        return `M ${sx} ${sy} L ${sx + side * 9} ${sy - 18}`
      case 'hug':
        return `M ${sx} ${sy} Q ${side * 4} ${sy + 14} ${-side * 6} ${sy + 8}`
      case 'hold':
        return side === 1 ? `M ${sx} ${sy} L ${sx + 12} ${sy + 2}` : `M ${sx} ${sy} L ${sx - 4} ${sy + 16}`
      case 'point':
        return side === 1 ? `M ${sx} ${sy} L ${sx + 16} ${sy - 4}` : `M ${sx} ${sy} L ${sx - 4} ${sy + 16}`
      case 'hips':
        return `M ${sx} ${sy} L ${sx + side * 8} ${sy + 8} L ${sx + side * 2} ${sy + 14}`
      case 'down':
      default:
        return running ? `M ${sx} ${sy} L ${sx + side * 8} ${sy + (side === 1 ? -8 : 10)}` : `M ${sx} ${sy} L ${sx + side * 3} ${sy + 16}`
    }
  }

  const legs = lying
    ? null
    : sitting
      ? (
        <>
          <path d={`M -6 ${legTop} L -6 -6 L 8 -6`} stroke={pants} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d={`M 6 ${legTop} L 6 -6 L 18 -6`} stroke={pants} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <ellipse cx={10} cy={-4} rx={6} ry={3} fill={INK} />
          <ellipse cx={20} cy={-4} rx={6} ry={3} fill={INK} />
        </>
      )
      : running
        ? (
          <>
            <path d={`M -4 ${legTop} L -12 -6`} stroke={pants} strokeWidth={9} strokeLinecap="round" fill="none" />
            <path d={`M 5 ${legTop} L 13 -10 L 10 -2`} stroke={pants} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <ellipse cx={-14} cy={-3} rx={6} ry={3} fill={INK} />
            <ellipse cx={11} cy={-1} rx={6} ry={3} fill={INK} />
          </>
        )
        : (
          <>
            <rect x={-11} y={legTop} width={9} height={18} rx={4.5} fill={pants} />
            <rect x={2} y={legTop} width={9} height={18} rx={4.5} fill={pants} />
            <ellipse cx={-7} cy={0} rx={7} ry={3.5} fill={INK} />
            <ellipse cx={7} cy={0} rx={7} ry={3.5} fill={INK} />
          </>
        )

  const lift = jumping ? -10 : 0
  // Lying down: turn the figure on its side so the head is on the left and the
  // feet on the right, centered around cx.
  const transform = lying
    ? `translate(${cx + 28 * scale} ${baseY - 14}) scale(${scale}) rotate(-90)`
    : `translate(${cx} ${baseY + lift}) scale(${scale})`

  return (
    <g transform={transform}>
      {legs}
      {/* body */}
      <rect x={-13} y={bodyTop} width={26} height={26} rx={9} fill={shirt} />
      {/* arms */}
      <path d={armPath(-1)} stroke={shirt} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={armPath(1)} stroke={shirt} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* hands */}
      {arms === 'wave' && <circle cx={21} cy={bodyTop - 12} r={4.5} fill={skin} />}
      {arms === 'up' && (
        <>
          <circle cx={-20} cy={bodyTop - 12} r={4.5} fill={skin} />
          <circle cx={20} cy={bodyTop - 12} r={4.5} fill={skin} />
        </>
      )}
      {(arms === 'hold' || arms === 'point') && <circle cx={arms === 'hold' ? 23 : 27} cy={arms === 'hold' ? bodyTop + 8 : bodyTop + 2} r={4.5} fill={skin} />}
      {/* neck + head */}
      <circle cx={0} cy={headY} r={headR} fill={skin} />
      {/* hair */}
      {hair === 'short' && <path d={`M -15 ${headY - 3} Q 0 ${headY - 22} 15 ${headY - 3} Q 8 ${headY - 12} 0 ${headY - 11} Q -8 ${headY - 12} -15 ${headY - 3} Z`} fill={hairColor} />}
      {hair === 'long' && (
        <>
          <path d={`M -16 ${headY + 12} L -16 ${headY - 2} Q 0 ${headY - 24} 16 ${headY - 2} L 16 ${headY + 12} Q 12 ${headY + 4} 12 ${headY - 2} Q 0 ${headY - 10} -12 ${headY - 2} Q -12 ${headY + 4} -16 ${headY + 12} Z`} fill={hairColor} />
        </>
      )}
      {hair === 'bun' && (
        <>
          <path d={`M -15 ${headY - 3} Q 0 ${headY - 22} 15 ${headY - 3} Q 8 ${headY - 12} 0 ${headY - 11} Q -8 ${headY - 12} -15 ${headY - 3} Z`} fill={hairColor} />
          <circle cx={0} cy={headY - 19} r={6} fill={hairColor} />
        </>
      )}
      {hair === 'curly' && (
        <>
          <circle cx={-10} cy={headY - 10} r={7} fill={hairColor} />
          <circle cx={0} cy={headY - 14} r={8} fill={hairColor} />
          <circle cx={10} cy={headY - 10} r={7} fill={hairColor} />
          <circle cx={-15} cy={headY - 2} r={5} fill={hairColor} />
          <circle cx={15} cy={headY - 2} r={5} fill={hairColor} />
        </>
      )}
      {hair === 'tuft' && <path d={`M -3 ${headY - 14} Q 0 ${headY - 24} 6 ${headY - 16} Q 2 ${headY - 16} 2 ${headY - 13} Z`} fill={hairColor} />}
      {hair === 'ponytail' && (
        <>
          <path d={`M -15 ${headY - 3} Q 0 ${headY - 22} 15 ${headY - 3} Q 8 ${headY - 12} 0 ${headY - 11} Q -8 ${headY - 12} -15 ${headY - 3} Z`} fill={hairColor} />
          <path d={`M 12 ${headY - 8} Q 26 ${headY - 4} 20 ${headY + 14}`} stroke={hairColor} strokeWidth={7} strokeLinecap="round" fill="none" />
        </>
      )}
      {/* face from the shared rig */}
      <Blush cx={0} cy={headY + 4} gap={20} />
      <Eyes mood={mood} cx={0} cy={headY - 1} gap={11} r={3.2} />
      <Mouth mood={mood} cx={0} cy={headY + 7} w={9} />
      {glasses && (
        <g fill="none" stroke={INK} strokeWidth={1.8}>
          <circle cx={-5.5} cy={headY - 1} r={5.5} />
          <circle cx={5.5} cy={headY - 1} r={5.5} />
        </g>
      )}
      {mustache && <path d={`M -7 ${headY + 5} Q 0 ${headY + 1} 7 ${headY + 5} Q 0 ${headY + 8} -7 ${headY + 5} Z`} fill={GRAY} />}
      {children && <g transform={`translate(24 ${bodyTop + 2})`}>{children}</g>}
    </g>
  )
}

/* ------------------------------ speech ------------------------------ */

/**
 * A speech bubble with something inside (a glyph, a heart, a question mark).
 * Anchored at (x, y) top-left with width w and height h; the tail points down-left.
 */
export function Bubble({
  x = 44,
  y = 10,
  w = 48,
  h = 34,
  fill = WHITE,
  tail = 'left',
  children,
}: {
  x?: number
  y?: number
  w?: number
  h?: number
  fill?: string
  tail?: 'left' | 'right' | 'none'
  children?: ReactNode
}) {
  const tx = tail === 'left' ? x + 10 : x + w - 10
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} />
      {tail !== 'none' && <path d={`M ${tx - 6} ${y + h - 1} L ${tx} ${y + h + 9} L ${tx + 7} ${y + h - 1} Z`} fill={fill} />}
      <g transform={`translate(${x + w / 2} ${y + h / 2})`}>{children}</g>
    </g>
  )
}

/** Big friendly text inside a bubble or on a tile. Fredoka, bold, centered at (0,0). */
export function BigText({ text, size = 22, color = INK, x = 0, y = 0 }: { text: string; size?: number; color?: string; x?: number; y?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fontFamily="Fredoka, Nunito, system-ui, sans-serif" fontWeight={700} fill={color} textAnchor="middle" dominantBaseline="central">
      {text}
    </text>
  )
}

/** A heart shape centered at (cx, cy), about s wide. */
export function Heart({ cx = 50, cy = 50, s = 30, color = CORAL }: { cx?: number; cy?: number; s?: number; color?: string }) {
  const r = s / 4
  return (
    <path
      transform={`translate(${cx} ${cy})`}
      d={`M 0 ${r * 2.2} C ${-s / 2} ${r * 0.2} ${-s / 2} ${-r * 1.6} ${-r} ${-r * 1.6} C ${-r * 0.4} ${-r * 1.6} 0 ${-r} 0 ${-r * 0.6} C 0 ${-r} ${r * 0.4} ${-r * 1.6} ${r} ${-r * 1.6} C ${s / 2} ${-r * 1.6} ${s / 2} ${r * 0.2} 0 ${r * 2.2} Z`}
      fill={color}
    />
  )
}

/** A five-point star centered at (cx, cy) with outer radius r. */
export function Star({ cx = 50, cy = 50, r = 22, color = SUN }: { cx?: number; cy?: number; r?: number; color?: string }) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const rad = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 === 0 ? r : r * 0.45
    pts.push(`${cx + rr * Math.cos(rad)},${cy + rr * Math.sin(rad)}`)
  }
  return <polygon points={pts.join(' ')} fill={color} strokeLinejoin="round" />
}

/** A glowing ring to point at a body part or an object ("look here"). */
export function Highlight({ cx, cy, r = 12, color = SUN }: { cx: number; cy: number; r?: number; color?: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r + 4} fill={color} opacity={0.35} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={3} />
    </>
  )
}

/** Little motion lines to show something moving fast (running, wind, hurry). */
export function Zoom({ x = 20, y = 60, color = INK_SOFT }: { x?: number; y?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={3} strokeLinecap="round">
      <line x1={x} y1={y} x2={x - 12} y2={y} />
      <line x1={x - 2} y1={y + 8} x2={x - 10} y2={y + 8} />
      <line x1={x + 2} y1={y - 8} x2={x - 8} y2={y - 8} />
    </g>
  )
}

/** A red "no" slash circle for "don't ___" commands. Draw it over the action. */
export function NoSign({ cx = 72, cy = 28, r = 14 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={CORAL_DARK} strokeWidth={5} />
      <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.7} y2={cy + r * 0.7} stroke={CORAL_DARK} strokeWidth={5} strokeLinecap="round" />
    </g>
  )
}

/** Sparkles for "yummy", "clean", "new", "gold". */
export function Sparkles({ cx = 50, cy = 30, color = SUN }: { cx?: number; cy?: number; color?: string }) {
  const s = (x: number, y: number, r: number) => (
    <path d={`M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`} fill={color} />
  )
  return (
    <g>
      {s(cx, cy, 6)}
      {s(cx + 14, cy + 8, 4)}
      {s(cx - 12, cy + 6, 3)}
    </g>
  )
}
