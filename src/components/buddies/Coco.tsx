// Coco the Hummingbird. She never lands — she hovers, wings a blur.
// Silhouette tell: tiny round body, a long thin beak, and two blurry wings.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, SKY, SKY_DARK, SUN, INK, type BuddyProps } from './rig'

export default function Coco({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const wingLift = mood === 'excited' ? -3 : mood === 'sad' ? 3 : 0
  const tailDroop = mood === 'sad' ? 4 : 0

  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* forked tail, tucked behind the body */}
      <g transform={`translate(0 ${tailDroop})`}>
        <path d="M 32 58 L 16 50 L 28 62 Z" fill={SKY_DARK} />
        <path d="M 32 62 L 16 74 L 30 68 Z" fill={SKY_DARK} />
      </g>

      {/* wings: two overlapping ellipses per side at low opacity, so they read as a fast blur */}
      <g transform={`translate(0 ${wingLift})`} opacity={0.6}>
        <ellipse cx={28} cy={36} rx={17} ry={6} fill={SKY_DARK} transform="rotate(-18 28 36)" />
        <ellipse cx={24} cy={40} rx={17} ry={6} fill={SKY_DARK} transform="rotate(-34 24 40)" />
      </g>
      <g transform={`translate(0 ${wingLift})`} opacity={0.6}>
        <ellipse cx={58} cy={30} rx={15} ry={5.5} fill={SKY_DARK} transform="rotate(14 58 30)" />
        <ellipse cx={62} cy={34} rx={15} ry={5.5} fill={SKY_DARK} transform="rotate(28 62 34)" />
      </g>

      {/* round little body */}
      <circle cx={48} cy={50} r={20} fill={SKY} />
      {/* sun-yellow chest patch, low on the belly so it never fights the face */}
      <ellipse cx={44} cy={62} rx={8} ry={6} fill={SUN} />

      {/* long thin beak, pointing right */}
      <path d="M 64 44 L 92 42 L 64 49 Z" fill={INK} />

      <Blush cx={46} cy={50} gap={26} />
      <Eyes mood={mood} cx={52} cy={42} gap={11} r={4.2} />
      <Mouth mood={mood} cx={54} cy={49} w={7} />
      {mood === 'sleepy' && <Zzz x={72} y={22} />}
    </BuddyFrame>
  )
}
