// Manu the Monkey. Swings from tree to tree looking for bananas.
// The tell: round ears, a curly tail, and one arm always up waving hello.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, CREAM, SEED_LIGHT } from './rig'
import type { BuddyProps } from './rig'

export default function Manu({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const waveHigh = mood === 'excited'
  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* curly tail on the right, drawn as one looping path */}
      <path
        d="M 72 68 Q 90 66 88 50 Q 86 38 74 40"
        stroke={SEED_LIGHT}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      {/* feet */}
      <ellipse cx={42} cy={87} rx={6} ry={4} fill={SEED_LIGHT} />
      <ellipse cx={58} cy={87} rx={6} ry={4} fill={SEED_LIGHT} />
      {/* body: a small capsule */}
      <rect x={33} y={56} width={34} height={32} rx={16} fill={SEED_LIGHT} />
      <ellipse cx={50} cy={72} rx={10} ry={12} fill={CREAM} />
      {/* the waving arm, up beside the head */}
      <path
        d={`M 32 60 Q 16 ${waveHigh ? 30 : 40} ${waveHigh ? 20 : 24} ${waveHigh ? 16 : 26}`}
        stroke={SEED_LIGHT}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={waveHigh ? 20 : 24} cy={waveHigh ? 16 : 26} r={5} fill={CREAM} />
      {/* the other arm, resting by the body */}
      <path d="M 68 62 Q 78 70 72 80" stroke={SEED_LIGHT} strokeWidth={8} strokeLinecap="round" fill="none" />
      {/* ears */}
      <circle cx={29} cy={34} r={9} fill={SEED_LIGHT} />
      <circle cx={71} cy={34} r={9} fill={SEED_LIGHT} />
      <circle cx={29} cy={34} r={5} fill={CREAM} />
      <circle cx={71} cy={34} r={5} fill={CREAM} />
      {/* head */}
      <circle cx={50} cy={36} r={18} fill={SEED_LIGHT} />
      {/* heart-ish cream face */}
      <path d="M 50 24 Q 40 20 36 30 Q 34 40 50 50 Q 66 40 64 30 Q 60 20 50 24 Z" fill={CREAM} />
      <Eyes mood={mood} cx={50} cy={37} gap={14} r={5} />
      <Mouth mood={mood} cx={50} cy={45} w={11} />
      <Blush cx={50} cy={42} gap={24} />
      {mood === 'sleepy' && <Zzz x={72} y={18} />}
    </BuddyFrame>
  )
}
