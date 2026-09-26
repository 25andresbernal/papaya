// Pinki the Flamingo. Tall, pink, and balanced perfectly on one leg.
// The tell: a long S-curve neck and standing on one thin leg with the other tucked up.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, ROSE, CORAL, INK, WHITE } from './rig'
import type { BuddyProps } from './rig'

export default function Pinki({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const neckUp = mood === 'excited'
  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* the standing leg, thin and straight */}
      <rect x={47} y={68} width={4.5} height={20} rx={2.25} fill={INK} />
      <ellipse cx={49} cy={88} rx={5} ry={2} fill={INK} />
      {/* the tucked leg, just a little bend peeking out of the body */}
      <path d="M 56 70 Q 62 74 58 80" stroke={INK} strokeWidth={4} strokeLinecap="round" fill="none" />
      {/* body: a tall egg */}
      <ellipse cx={50} cy={56} rx={16} ry={20} fill={ROSE} />
      {/* the wing, a coral teardrop over the body */}
      <path d="M 60 42 Q 70 54 62 72 Q 54 64 55 48 Z" fill={CORAL} />
      {/* the S-curve neck, up to the small head */}
      <path
        d={`M 48 40 Q 30 34 38 ${neckUp ? 12 : 18} Q 40 6 34 ${neckUp ? 4 : 8}`}
        stroke={ROSE}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
      />
      {/* small round head */}
      <circle cx={34} cy={neckUp ? 7 : 11} r={10} fill={ROSE} />
      {/* beak: white base, dark bent tip */}
      <ellipse cx={25} cy={(neckUp ? 7 : 11) + 1} rx={4} ry={2.5} fill={WHITE} />
      <path
        d={`M 22 ${(neckUp ? 7 : 11) - 1} Q 15 ${(neckUp ? 7 : 11) + 1} 19 ${(neckUp ? 7 : 11) + 4}`}
        stroke={INK}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <Eyes mood={mood} cx={35} cy={neckUp ? 6 : 10} gap={7.5} r={2.6} />
      <Mouth mood={mood} cx={35} cy={neckUp ? 12 : 16} w={6.5} />
      <Blush cx={35} cy={neckUp ? 9 : 13} gap={12} />
      {mood === 'sleepy' && <Zzz x={50} y={0} />}
    </BuddyFrame>
  )
}
