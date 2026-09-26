// Tico the Toucan. A round little bird with a beak bigger than his whole head.
// The beak is the thing to remember him by: papaya orange on top, sun yellow at the tip.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, PAPAYA, PAPAYA_DARK, SUN, SEED, SKY, CREAM, WHITE } from './rig'
import type { BuddyProps } from './rig'

export default function Tico({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const wingUp = mood === 'excited'
  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* feet */}
      <rect x={38} y={84} width={9} height={7} rx={3.5} fill={PAPAYA_DARK} />
      <rect x={53} y={84} width={9} height={7} rx={3.5} fill={PAPAYA_DARK} />
      {/* body: an egg shape, seed brown */}
      <ellipse cx={50} cy={64} rx={19} ry={23} fill={SEED} />
      {/* cream chest patch */}
      <ellipse cx={50} cy={68} rx={10} ry={14} fill={CREAM} />
      {/* little wings, one flaps up when excited */}
      <ellipse cx={30} cy={wingUp ? 52 : 60} rx={7} ry={11} fill={SEED} transform={wingUp ? 'rotate(-25 30 52)' : undefined} />
      <ellipse cx={70} cy={60} rx={7} ry={11} fill={SEED} />
      {/* head: a round seed-brown head with a sky-blue mask around the eyes */}
      <circle cx={50} cy={31} r={17} fill={SEED} />
      <ellipse cx={50} cy={28} rx={15} ry={9} fill={SKY} />
      {/* the huge beak hangs down from under the eyes: papaya on top, sun at the tip */}
      <path d="M 37 37 Q 50 34 63 37 Q 66 54 56 66 Q 50 69 44 66 Q 34 54 37 37 Z" fill={PAPAYA} />
      <path d="M 40 50 Q 50 47 60 50 Q 59 60 54 65 Q 50 67 46 65 Q 41 60 40 50 Z" fill={SUN} />
      <circle cx={50} cy={62} r={2} fill={SEED} />
      {/* the seam between the beak halves doubles as the mouth */}
      <Mouth mood={mood} cx={50} cy={44} w={14} color={PAPAYA_DARK} />
      <Blush cx={50} cy={31} gap={30} />
      <Eyes mood={mood} cx={50} cy={27} gap={15} r={5} />
      {mood === 'sleepy' && <Zzz x={72} y={14} />}
      {/* a splash of white on the eye ring for shine */}
      <circle cx={44} cy={26} r={1.4} fill={WHITE} opacity={0.5} />
    </BuddyFrame>
  )
}
