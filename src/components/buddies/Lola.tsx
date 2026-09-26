// Lola the Sloth. Slow, cozy, and always hugging herself.
// The tell: a squashed green-gray body with long arms wrapped around the front.

import { BuddyFrame, Eyes, Mouth, Blush, Zzz, CREAM, SEED_LIGHT } from './rig'
import type { BuddyProps } from './rig'

const BODY = '#9DBE8E' // muted green-gray, leaf tinted toward cream

export default function Lola({ mood = 'happy', size = 96, className = '', label }: BuddyProps) {
  const cozy = mood === 'sleepy' || mood === 'sad'
  return (
    <BuddyFrame size={size} className={className} label={label}>
      {/* tiny feet peeking out under the body */}
      <ellipse cx={40} cy={85} rx={6} ry={4} fill={SEED_LIGHT} />
      <ellipse cx={60} cy={85} rx={6} ry={4} fill={SEED_LIGHT} />
      {/* body: a squashed circle, wider than tall */}
      <ellipse cx={50} cy={64} rx={26} ry={22} fill={BODY} />
      {/* long curved arms hugging the front of the body, drawn as thick rounded paths */}
      <path
        d={`M 30 54 Q 19 66 ${cozy ? 42 : 39} ${cozy ? 80 : 78}`}
        stroke={BODY}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M 70 54 Q 81 66 ${cozy ? 58 : 61} ${cozy ? 80 : 78}`}
        stroke={BODY}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
      />
      {/* three little claws on each hand */}
      <g fill={SEED_LIGHT}>
        <ellipse cx={cozy ? 40 : 37} cy={cozy ? 82 : 80} rx={1.6} ry={2.4} />
        <ellipse cx={cozy ? 44 : 41} cy={cozy ? 84 : 82} rx={1.6} ry={2.4} />
        <ellipse cx={cozy ? 48 : 45} cy={cozy ? 83 : 81} rx={1.6} ry={2.4} />
        <ellipse cx={cozy ? 60 : 63} cy={cozy ? 82 : 80} rx={1.6} ry={2.4} />
        <ellipse cx={cozy ? 56 : 59} cy={cozy ? 84 : 82} rx={1.6} ry={2.4} />
        <ellipse cx={cozy ? 52 : 55} cy={cozy ? 83 : 81} rx={1.6} ry={2.4} />
      </g>
      {/* cream face mask */}
      <ellipse cx={50} cy={52} rx={16} ry={14} fill={CREAM} />
      {/* dark eye patches */}
      <ellipse cx={43} cy={50} rx={6.5} ry={8.5} fill={SEED_LIGHT} />
      <ellipse cx={57} cy={50} rx={6.5} ry={8.5} fill={SEED_LIGHT} />
      <Eyes mood={mood} cx={50} cy={51} gap={14} r={5} />
      <Mouth mood={mood} cx={50} cy={60} w={12} />
      <Blush cx={50} cy={56} gap={26} />
      {mood === 'sleepy' && <Zzz x={70} y={26} />}
    </BuddyFrame>
  )
}
