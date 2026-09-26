// Tortu the Sea Turtle. Slow, steady, and made of one big friendly shell.
// Silhouette tell: a domed shell with patches and a small head poking out.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, LEAF, LEAF_DARK, CREAM, type BuddyProps } from './rig'

const HEAD_GREEN = '#7CC47F'

export default function Tortu({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const headTilt = mood === 'sad' ? 3 : mood === 'excited' ? -2 : 0

  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* flippers, tucked under the shell */}
      <rect x={12} y={62} width={12} height={22} rx={6} fill={LEAF} transform="rotate(-18 18 62)" />
      <rect x={76} y={62} width={12} height={22} rx={6} fill={LEAF} transform="rotate(18 82 62)" />
      <rect x={24} y={80} width={11} height={16} rx={5.5} fill={LEAF} />
      <rect x={65} y={80} width={11} height={16} rx={5.5} fill={LEAF} />

      {/* cream belly peeking out under the shell */}
      <ellipse cx={50} cy={80} rx={30} ry={9} fill={CREAM} />

      {/* the shell */}
      <rect x={17} y={40} width={66} height={42} rx={21} fill={LEAF} />

      {/* shell patches */}
      <rect x={28} y={50} width={13} height={13} rx={4} fill={LEAF_DARK} />
      <rect x={48} y={47} width={14} height={14} rx={4} fill={LEAF_DARK} />
      <rect x={66} y={52} width={12} height={12} rx={4} fill={LEAF_DARK} />
      <rect x={38} y={64} width={13} height={13} rx={4} fill={LEAF_DARK} />
      <rect x={58} y={65} width={12} height={12} rx={4} fill={LEAF_DARK} />

      {/* head poking out top-left */}
      <g transform={`rotate(${headTilt} 24 34)`}>
        <circle cx={24} cy={34} r={15} fill={HEAD_GREEN} />
        <Blush cx={24} cy={37} gap={18} />
        <Eyes mood={mood} cx={24} cy={32} gap={10} r={3.6} />
        <Mouth mood={mood} cx={24} cy={40} w={7} />
      </g>
      {mood === 'sleepy' && <Zzz x={40} y={16} />}
    </BuddyFrame>
  )
}
