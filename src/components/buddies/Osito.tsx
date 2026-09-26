// Osito the Spectacled Bear. Cuddly, round, and famous for his fur "glasses."
// Silhouette tell: the cream figure-8 ring around his eyes.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, SEED, CREAM, type BuddyProps } from './rig'

export default function Osito({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const armUp = mood === 'excited'

  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* feet */}
      <rect x={35} y={82} width={13} height={9} rx={4.5} fill={SEED} />
      <rect x={52} y={82} width={13} height={9} rx={4.5} fill={SEED} />

      {/* body */}
      <rect x={30} y={54} width={40} height={32} rx={19} fill={SEED} />
      <ellipse cx={50} cy={72} rx={13} ry={13} fill={CREAM} />

      {/* arms */}
      <rect x={22} y={56} width={11} height={20} rx={5.5} fill={SEED} transform={armUp ? 'rotate(-30 27 66)' : undefined} />
      <rect x={67} y={56} width={11} height={20} rx={5.5} fill={SEED} transform={armUp ? 'rotate(30 72 66)' : undefined} />

      {/* ears */}
      <circle cx={32} cy={21} r={7} fill={SEED} />
      <circle cx={68} cy={21} r={7} fill={SEED} />

      {/* head */}
      <circle cx={50} cy={37} r={22} fill={SEED} />
      <ellipse cx={50} cy={49} rx={12} ry={8} fill={CREAM} />

      {/* the famous cream glasses, drawn before the eyes so they sit behind them */}
      <circle cx={40} cy={33} r={9} fill={CREAM} />
      <circle cx={60} cy={33} r={9} fill={CREAM} />
      <rect x={46} y={31} width={8} height={4} rx={2} fill={CREAM} />

      <Blush cx={50} cy={44} gap={36} />
      <Eyes mood={mood} cx={50} cy={34} gap={16} r={5} />
      <circle cx={50} cy={42} r={2} fill={SEED} />
      <Mouth mood={mood} cx={50} cy={49} w={9} />
      {mood === 'sleepy' && <Zzz x={76} y={18} />}
    </BuddyFrame>
  )
}
