// Capi the Capybara. Wide, low, and calm. Friends with everyone.
// The tell: a long low body with a big flat snout and tiny round ears.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, CREAM, SEED, SEED_LIGHT } from './rig'
import type { BuddyProps } from './rig'

export default function Capi({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const earsUp = mood === 'excited'
  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* tiny feet */}
      <rect x={24} y={80} width={11} height={8} rx={4} fill={SEED} />
      <rect x={65} y={80} width={11} height={8} rx={4} fill={SEED} />
      {/* ears on top, small ovals */}
      <ellipse cx={30} cy={earsUp ? 34 : 37} rx={6} ry={8} fill={SEED} />
      <ellipse cx={70} cy={earsUp ? 34 : 37} rx={6} ry={8} fill={SEED} />
      {/* body: a wide low capsule */}
      <rect x={12} y={42} width={76} height={42} rx={21} fill={SEED_LIGHT} />
      {/* cream belly */}
      <rect x={24} y={58} width={52} height={24} rx={12} fill={CREAM} />
      {/* snout, a rounded rectangle at the front of the face */}
      <rect x={36} y={58} width={28} height={18} rx={9} fill={SEED_LIGHT} />
      {/* nostril dots */}
      <circle cx={44} cy={66} r={1.6} fill={SEED} />
      <circle cx={56} cy={66} r={1.6} fill={SEED} />
      <Eyes mood={mood} cx={50} cy={50} gap={22} r={5.5} />
      <Mouth mood={mood} cx={50} cy={72} w={12} />
      <Blush cx={50} cy={58} gap={38} />
      {mood === 'sleepy' && <Zzz x={78} y={30} />}
    </BuddyFrame>
  )
}
