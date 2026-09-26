// Drago the Dragon. A friendly purple dragon who breathes sparkles, not fire.
// The tell: a row of sun-yellow spikes down his back, plus two little wings.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, PURPLE, PURPLE_DARK, SUN, CREAM, PAPAYA } from './rig'
import type { BuddyProps } from './rig'

/** A little 4-point sparkle star, like the ones a birthday card has. No emoji, just shapes. */
function Star({ cx, cy, r, color = SUN }: { cx: number; cy: number; r: number; color?: string }) {
  const inner = r * 0.4
  const pts: string[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i - Math.PI / 2
    const rad = i % 2 === 0 ? r : inner
    const x = cx + Math.cos(angle) * rad
    const y = cy + Math.sin(angle) * rad
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return <path d={`${pts.join(' ')} Z`} fill={color} />
}

export default function Drago({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  // wings droop for sad, lift up high for mad, flap a little for excited
  const wingAngle = mood === 'sad' ? 62 : mood === 'mad' ? -60 : mood === 'excited' ? -25 : -8

  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* curled tail, drawn first so it tucks behind the body. Ends in a little spade,
          kept low and to the right so it never bumps into the wing. */}
      <ellipse cx={74} cy={79} rx={8} ry={9} fill={PURPLE_DARK} />
      <ellipse cx={87} cy={68} rx={6} ry={7.5} fill={PURPLE_DARK} />
      <ellipse cx={92} cy={54} rx={4.5} ry={5.5} fill={PURPLE_DARK} />
      <path d="M 92 45 C 89 40 84 42 86 48 C 87 52 92 56 92 56 C 92 56 97 52 98 48 C 100 42 95 40 92 45 Z" fill={PURPLE_DARK} />

      {/* little wings behind the body: flat half-circles that hinge at the shoulder */}
      <path d="M 32 40 A 15 15 0 0 0 32 70 Z" fill={PURPLE_DARK} transform={`rotate(${wingAngle} 32 55)`} />
      <path d="M 68 40 A 15 15 0 0 1 68 70 Z" fill={PURPLE_DARK} transform={`rotate(${-wingAngle} 68 55)`} />

      {/* stubby feet */}
      <rect x={38} y={82} width={10} height={9} rx={4} fill={PURPLE_DARK} />
      <rect x={54} y={82} width={10} height={9} rx={4} fill={PURPLE_DARK} />

      {/* body: a big rounded egg */}
      <ellipse cx={50} cy={63} rx={20} ry={24} fill={PURPLE} />
      {/* cream belly patch */}
      <ellipse cx={50} cy={68} rx={10} ry={14} fill={CREAM} />

      {/* big round head */}
      <circle cx={50} cy={31} r={17} fill={PURPLE} />
      {/* two small nubby horns */}
      <path d="M 38 19 L 41 9 L 45 19 Z" fill={PURPLE_DARK} />
      <path d="M 55 19 L 59 9 L 62 19 Z" fill={PURPLE_DARK} />

      {/* row of sun-yellow spikes down the center of his back, sitting below his chin
          so they never crowd his face, drawn on top so they read as a clean ridge */}
      <path d="M 46 58 L 54 58 L 50 49 Z" fill={SUN} />
      <path d="M 46 68 L 54 68 L 50 59 Z" fill={SUN} />
      <path d="M 46 78 L 54 78 L 50 69 Z" fill={SUN} />

      <Blush cx={50} cy={31} gap={26} />
      <Eyes mood={mood} cx={50} cy={30} gap={15} r={5} />
      <Mouth mood={mood} cx={50} cy={42} w={12} />

      {/* mood extras */}
      {mood === 'excited' && (
        <>
          <Star cx={68} cy={46} r={5} />
          <Star cx={77} cy={38} r={4} />
          <Star cx={82} cy={48} r={3.2} />
        </>
      )}
      {mood === 'mad' && (
        <>
          <circle cx={68} cy={16} r={4} fill={PAPAYA} opacity={0.7} />
          <circle cx={73} cy={12} r={2.6} fill={PAPAYA} opacity={0.6} />
        </>
      )}
      {mood === 'sleepy' && <Zzz x={73} y={15} />}
    </BuddyFrame>
  )
}
