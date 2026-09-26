// Delfi the Pink River Dolphin. Splashy, playful, always mid-jump.
// Silhouette tell: a long pink body, a dorsal fin, and an upturned snout.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, ROSE, SKY, type BuddyProps } from './rig'

const ROSE_LIGHT = '#FFC2D9'
const ROSE_DARK = '#E8899E'

export default function Delfi({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const finUp = mood === 'sad' ? -4 : mood === 'excited' ? 4 : 0

  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* water splash instead of feet */}
      <ellipse cx={30} cy={86} rx={11} ry={4} fill={SKY} opacity={0.7} />
      <ellipse cx={50} cy={90} rx={15} ry={5} fill={SKY} opacity={0.7} />
      <ellipse cx={72} cy={86} rx={10} ry={4} fill={SKY} opacity={0.7} />

      {/* tail fluke */}
      <path d="M 20 58 L 4 48 L 12 64 L 4 80 L 20 70 Z" fill={ROSE} />

      {/* body */}
      <rect x={18} y={48} width={58} height={30} rx={15} fill={ROSE} />
      <ellipse cx={46} cy={66} rx={26} ry={9} fill={ROSE_LIGHT} />

      {/* dorsal fin */}
      <path d={`M 40 ${52 + finUp} Q 50 ${20 + finUp} 60 ${52 + finUp} Z`} fill={ROSE_DARK} />

      {/* upturned snout */}
      <rect x={72} y={54} width={26} height={13} rx={6.5} fill={ROSE} />
      <circle cx={97} cy={51} r={6} fill={ROSE} />

      <Blush cx={66} cy={56} gap={18} />
      <Eyes mood={mood} cx={66} cy={52} gap={10} r={4} />
      <Mouth mood={mood} cx={68} cy={60} w={8} />
      {mood === 'sleepy' && <Zzz x={30} y={38} />}
    </BuddyFrame>
  )
}
