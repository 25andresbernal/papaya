// Rana the Frog. Tiny, bright yellow, and very loud.
// The tell: two huge eyes bulging on top of the head, like real tree frogs.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, SUN, SUN_DARK, LEAF } from './rig'
import type { BuddyProps } from './rig'

export default function Rana({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const jump = mood === 'excited'
  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* front feet */}
      <ellipse cx={38} cy={jump ? 82 : 86} rx={6} ry={4} fill={SUN_DARK} />
      <ellipse cx={62} cy={jump ? 82 : 86} rx={6} ry={4} fill={SUN_DARK} />
      {/* leg stubs at the sides */}
      <rect x={11} y={60} width={15} height={11} rx={5.5} fill={SUN_DARK} />
      <rect x={74} y={60} width={15} height={11} rx={5.5} fill={SUN_DARK} />
      {/* body: a flattened, wide circle */}
      <ellipse cx={50} cy={60} rx={29} ry={21} fill={SUN} />
      {/* leaf-green spots */}
      <ellipse cx={35} cy={56} rx={4.5} ry={4} fill={LEAF} />
      <ellipse cx={64} cy={58} rx={4} ry={3.6} fill={LEAF} />
      <ellipse cx={46} cy={70} rx={3.6} ry={3.2} fill={LEAF} />
      <ellipse cx={58} cy={70} rx={4} ry={3.4} fill={LEAF} />
      <ellipse cx={50} cy={50} rx={3.4} ry={3} fill={LEAF} />
      {/* the two huge eye bumps, sitting on top of the body */}
      <circle cx={37} cy={34} r={12} fill={SUN} />
      <circle cx={63} cy={34} r={12} fill={SUN} />
      <Eyes mood={mood} cx={50} cy={31} gap={26} r={7.5} />
      {/* wide mouth */}
      <Mouth mood={mood} cx={50} cy={54} w={30} />
      <Blush cx={50} cy={50} gap={40} />
      {mood === 'sleepy' && <Zzz x={74} y={16} />}
    </BuddyFrame>
  )
}
