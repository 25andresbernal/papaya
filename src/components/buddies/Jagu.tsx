// Jagu the Jaguar. Cool, confident, king of the jungle, best friend of all.
// Silhouette tell: a long low body covered in rosette spots.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, PAPAYA, PAPAYA_DARK, SEED, CREAM, type BuddyProps } from './rig'

function Rosette({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={9} height={9} rx={3} fill={SEED} />
      <circle cx={x + 4.5} cy={y + 4.5} r={1.6} fill={PAPAYA_DARK} />
    </g>
  )
}

export default function Jagu({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const tailUp = mood === 'excited' ? -6 : mood === 'sad' ? 6 : 0

  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* curled tail */}
      <path d={`M 14 66 Q -8 66 -6 ${48 + tailUp} Q -4 ${58 + tailUp} 12 58 Z`} fill={PAPAYA} />

      {/* legs */}
      <rect x={18} y={78} width={11} height={11} rx={4.5} fill={PAPAYA} />
      <rect x={58} y={78} width={11} height={11} rx={4.5} fill={PAPAYA} />

      {/* long low body */}
      <rect x={10} y={56} width={62} height={26} rx={13} fill={PAPAYA} />
      <ellipse cx={42} cy={73} rx={26} ry={7.5} fill={CREAM} />

      {/* rosette spots on the body */}
      <Rosette x={22} y={60} />
      <Rosette x={36} y={64} />
      <Rosette x={50} y={61} />
      <Rosette x={18} y={68} />

      {/* ears */}
      <circle cx={60} cy={34} r={6} fill={PAPAYA} />
      <circle cx={60} cy={35} r={3} fill={SEED} />
      <circle cx={80} cy={34} r={6} fill={PAPAYA} />
      <circle cx={80} cy={35} r={3} fill={SEED} />

      {/* head */}
      <circle cx={70} cy={48} r={18} fill={PAPAYA} />
      <ellipse cx={71} cy={56} rx={10} ry={7} fill={CREAM} />
      <Rosette x={56} y={42} />
      <Rosette x={78} y={40} />

      {/* whiskers */}
      <circle cx={60} cy={55} r={1} fill={SEED} />
      <circle cx={60} cy={58} r={1} fill={SEED} />
      <circle cx={82} cy={55} r={1} fill={SEED} />
      <circle cx={82} cy={58} r={1} fill={SEED} />

      <Blush cx={71} cy={50} gap={24} />
      <Eyes mood={mood} cx={70} cy={44} gap={14} r={4.6} />
      <Mouth mood={mood} cx={71} cy={57} w={11} />
      {mood === 'sleepy' && <Zzz x={90} y={26} />}
    </BuddyFrame>
  )
}
