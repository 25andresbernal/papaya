// Andi the Condor. The biggest, proudest flyer in the sky.
// Silhouette tell: a huge wingspan and a fluffy cream ruff around the neck.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, SEED, CREAM, INK, WHITE, type BuddyProps } from './rig'

const HEAD_PINK = '#E8A09A'

export default function Andi({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  // more negative angle = wings lifted higher; 0 = wings flat out to the sides
  const angle = mood === 'excited' ? -30 : mood === 'sad' ? -4 : -16

  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* Andi's wingspan is wider than the box, so we shrink him a little to fit.
          The scale is around the middle so his feet still land on the shadow. */}
      <g transform="translate(50 62) scale(0.68) translate(-50 -62)">
      {/* feet */}
      <rect x={42} y={84} width={7} height={7} rx={3} fill={SEED} />
      <rect x={51} y={84} width={7} height={7} rx={3} fill={SEED} />

      {/* huge oar-shaped wings spread wide, tucked into the shoulders (they spill past
          the box on purpose — that is what makes the wingspan feel huge) */}
      <ellipse cx={2} cy={50} rx={40} ry={13} fill={SEED} transform={`rotate(${angle} 2 50)`} />
      <ellipse cx={-32} cy={50} rx={11} ry={7} fill={WHITE} transform={`rotate(${angle} 2 50)`} />
      <ellipse cx={98} cy={50} rx={40} ry={13} fill={SEED} transform={`rotate(${-angle} 98 50)`} />
      <ellipse cx={132} cy={50} rx={11} ry={7} fill={WHITE} transform={`rotate(${-angle} 98 50)`} />

      {/* body */}
      <ellipse cx={50} cy={63} rx={22} ry={27} fill={SEED} />

      {/* fluffy cream ruff around the neck */}
      <circle cx={33} cy={42} r={6.5} fill={CREAM} />
      <circle cx={40} cy={34} r={6.5} fill={CREAM} />
      <circle cx={50} cy={31} r={6.5} fill={CREAM} />
      <circle cx={60} cy={34} r={6.5} fill={CREAM} />
      <circle cx={67} cy={42} r={6.5} fill={CREAM} />

      {/* small pink head */}
      <circle cx={50} cy={27} r={13} fill={HEAD_PINK} />
      {/* hooked beak */}
      <path d="M 60 26 Q 71 23 66 32 Q 62 30 58 30 Z" fill={INK} />

      <Blush cx={50} cy={28} gap={20} />
      <Eyes mood={mood} cx={49} cy={25} gap={11} r={3.6} />
      <Mouth mood={mood} cx={50} cy={32} w={6} />
      {mood === 'sleepy' && <Zzz x={70} y={12} />}
      </g>
    </BuddyFrame>
  )
}
