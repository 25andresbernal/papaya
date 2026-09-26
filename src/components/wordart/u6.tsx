// Unit 6 word art: pets and animals -- house pets, jungle animals, farm
// animals, sea animals, three animal sounds, and four action verbs.
//
// Every animal is a big round head (or a body shape when a head doesn't
// make sense, like a fish or a starfish) with the same eyes and mouth as
// the buddies, plus ONE silhouette cue so a kid can tell them apart even
// tiny. Sea animals sit on a sky tile, farm animals on a leaf tile, and
// pets/jungle animals on a warm cream tile.

import type { ComponentType } from 'react'
import { Eyes, Mouth } from '../buddies/rig'
import {
  ArtFrame,
  Tile,
  Ground,
  Bubble,
  BigText,
  Star,
  Zoom,
  PAPAYA,
  PAPAYA_DARK,
  LEAF,
  LEAF_DARK,
  SKY,
  SKY_DARK,
  SUN,
  SUN_DARK,
  CORAL,
  CORAL_DARK,
  ROSE,
  PURPLE,
  PURPLE_DARK,
  CREAM,
  CREAM_DARK,
  SEED,
  SEED_LIGHT,
  WHITE,
  GRAY,
  GRAY_DARK,
  INK,
} from './primitives'
import type { WordArtProps } from './primitives'

/* ------------------------- shared animal heads ------------------------- */
// A few animals show up twice: once alone, once in a sound or a verb.
// These small helpers draw just the head group so both pictures match.

function DogHead({ cx = 50, cy = 54, running = false }: { cx?: number; cy?: number; running?: boolean }) {
  const tilt = running ? -8 : 0
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      {/* floppy ears hang past the sides of the round head */}
      <ellipse cx={cx - 24} cy={cy - 2} rx={9} ry={16} fill={SEED} transform={`rotate(16 ${cx - 24} ${cy - 2})`} />
      <ellipse cx={cx + 24} cy={cy - 2} rx={9} ry={16} fill={SEED} transform={`rotate(-16 ${cx + 24} ${cy - 2})`} />
      <circle cx={cx} cy={cy} r={26} fill={SEED_LIGHT} />
      {/* tongue hanging out */}
      <rect x={cx - 5} y={cy + 12} width={10} height={13} rx={5} fill={ROSE} />
      <Eyes mood={running ? 'excited' : 'happy'} cx={cx} cy={cy - 4} gap={14} r={5.4} />
      <Mouth mood={running ? 'excited' : 'happy'} cx={cx} cy={cy + 9} w={14} />
    </g>
  )
}

function CatHead({ cx = 50, cy = 52 }: { cx?: number; cy?: number }) {
  return (
    <g>
      {/* pointed ears */}
      <path d={`M ${cx - 26} ${cy - 10} L ${cx - 14} ${cy - 28} L ${cx - 6} ${cy - 8} Z`} fill={PAPAYA} />
      <path d={`M ${cx + 26} ${cy - 10} L ${cx + 14} ${cy - 28} L ${cx + 6} ${cy - 8} Z`} fill={PAPAYA} />
      <path d={`M ${cx - 20} ${cy - 12} L ${cx - 13} ${cy - 22} L ${cx - 9} ${cy - 11} Z`} fill={PAPAYA_DARK} />
      <path d={`M ${cx + 20} ${cy - 12} L ${cx + 13} ${cy - 22} L ${cx + 9} ${cy - 11} Z`} fill={PAPAYA_DARK} />
      <circle cx={cx} cy={cy} r={25} fill={PAPAYA} />
      {/* whisker dots, three on each cheek */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <circle cx={cx + side * 21} cy={cy + 4} r={1.6} fill={PAPAYA_DARK} />
          <circle cx={cx + side * 22} cy={cy + 9} r={1.6} fill={PAPAYA_DARK} />
          <circle cx={cx + side * 20} cy={cy + 14} r={1.6} fill={PAPAYA_DARK} />
        </g>
      ))}
      <Eyes cx={cx} cy={cy - 3} gap={13} r={5.2} />
      <Mouth cx={cx} cy={cy + 8} w={11} />
    </g>
  )
}

function CowHead({ cx = 50, cy = 52 }: { cx?: number; cy?: number }) {
  return (
    <g>
      <ellipse cx={cx - 22} cy={cy - 4} rx={7} ry={9} fill={WHITE} />
      <ellipse cx={cx + 22} cy={cy - 4} rx={7} ry={9} fill={WHITE} />
      <circle cx={cx} cy={cy} r={26} fill={WHITE} />
      {/* black-and-white spots */}
      <circle cx={cx - 12} cy={cy - 14} r={7} fill={SEED} />
      <circle cx={cx + 14} cy={cy + 4} r={6} fill={SEED} />
      {/* pink muzzle with two nostril dots */}
      <ellipse cx={cx} cy={cy + 15} rx={13} ry={9} fill={ROSE} />
      <circle cx={cx - 4} cy={cy + 15} r={1.6} fill={SEED} />
      <circle cx={cx + 4} cy={cy + 15} r={1.6} fill={SEED} />
      <Eyes cx={cx} cy={cy - 4} gap={14} r={5.2} />
      <Mouth cx={cx} cy={cy + 6} w={10} />
    </g>
  )
}

function FrogHead({ cx = 50, cy = 56, jump = false }: { cx?: number; cy?: number; jump?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={25} fill={LEAF} />
      {/* legs tucked under, mid-jump they kick back */}
      <ellipse cx={cx - 20} cy={cy + 20} rx={9} ry={6} fill={LEAF_DARK} transform={jump ? `rotate(20 ${cx - 20} ${cy + 20})` : undefined} />
      <ellipse cx={cx + 20} cy={cy + 20} rx={9} ry={6} fill={LEAF_DARK} transform={jump ? `rotate(-20 ${cx + 20} ${cy + 20})` : undefined} />
      {/* bulging eyes sit up on top of the head */}
      <Eyes mood={jump ? 'excited' : 'happy'} cx={cx} cy={cy - 22} gap={20} r={7} />
      <Mouth mood="happy" cx={cx} cy={cy + 4} w={16} />
    </g>
  )
}

function FishBody({ cx = 50, cy = 50, swim = false }: { cx?: number; cy?: number; swim?: boolean }) {
  return (
    <g>
      <path d={`M ${cx + 20} ${cy} L ${cx + 34} ${cy - 12} L ${cx + 34} ${cy + 12} Z`} fill={PAPAYA_DARK} />
      <ellipse cx={cx - 4} cy={cy} rx={28} ry={19} fill={PAPAYA} />
      <path d={`M ${cx - 6} ${cy - 17} Q ${cx + 4} ${cy - 26} ${cx + 12} ${cy - 16} Z`} fill={PAPAYA_DARK} />
      {swim && <circle cx={cx - 4} cy={cy - 26} r={3} fill={WHITE} opacity={0.85} />}
      {swim && <circle cx={cx + 4} cy={cy - 33} r={2} fill={WHITE} opacity={0.7} />}
      <Eyes cx={cx - 16} cy={cy - 2} gap={0} r={5} />
      <Mouth cx={cx - 24} cy={cy + 6} w={7} />
    </g>
  )
}

function BirdBody({ cx = 50, cy = 54, fly = false }: { cx?: number; cy?: number; fly?: boolean }) {
  return (
    <g>
      {/* one wing lifts up to show flying */}
      <ellipse
        cx={cx - 20}
        cy={fly ? cy - 14 : cy + 2}
        rx={10}
        ry={16}
        fill={SKY_DARK}
        transform={fly ? `rotate(-40 ${cx - 20} ${cy - 14})` : `rotate(-10 ${cx - 20} ${cy + 2})`}
      />
      <circle cx={cx} cy={cy} r={24} fill={SKY} />
      <path d={`M ${cx + 20} ${cy} L ${cx + 32} ${cy - 5} L ${cx + 20} ${cy + 7} Z`} fill={SUN} />
      <Eyes mood={fly ? 'excited' : 'happy'} cx={cx - 2} cy={cy - 4} gap={12} r={4.6} />
    </g>
  )
}

/* --------------------------------- pets --------------------------------- */

function ElPerro(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={22} />
      <DogHead />
    </ArtFrame>
  )
}

function ElGato(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={22} />
      <CatHead />
    </ArtFrame>
  )
}

function ElPez(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <FishBody cx={48} cy={50} />
    </ArtFrame>
  )
}

function ElConejo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={20} />
      {/* two tall ears with pink inner ears */}
      <ellipse cx={38} cy={22} rx={8} ry={20} fill={WHITE} transform="rotate(-8 38 22)" />
      <ellipse cx={38} cy={24} rx={4} ry={15} fill={ROSE} transform="rotate(-8 38 24)" />
      <ellipse cx={62} cy={22} rx={8} ry={20} fill={WHITE} transform="rotate(8 62 22)" />
      <ellipse cx={62} cy={24} rx={4} ry={15} fill={ROSE} transform="rotate(8 62 24)" />
      <circle cx={50} cy={56} r={24} fill={WHITE} />
      <circle cx={50} cy={68} r={2} fill={ROSE} />
      <Eyes cx={50} cy={52} gap={13} r={5.2} />
      <Mouth cx={50} cy={62} w={10} />
    </ArtFrame>
  )
}

function ElPajaro(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <BirdBody cx={50} cy={54} />
      <Mouth cx={48} cy={62} w={8} />
    </ArtFrame>
  )
}

function ElHamster(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={22} />
      <circle cx={34} cy={30} r={6} fill={SUN_DARK} />
      <circle cx={66} cy={30} r={6} fill={SUN_DARK} />
      <circle cx={50} cy={54} r={27} fill={SUN} />
      {/* full cheek pouches */}
      <circle cx={28} cy={58} r={7} fill={SUN_DARK} opacity={0.5} />
      <circle cx={72} cy={58} r={7} fill={SUN_DARK} opacity={0.5} />
      <Eyes cx={50} cy={50} gap={14} r={5} />
      <Mouth cx={50} cy={62} w={9} />
    </ArtFrame>
  )
}

function ElRaton(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      {/* long tail curling behind */}
      <path d="M 70 70 Q 90 66 86 50 Q 84 42 90 38" stroke={GRAY_DARK} strokeWidth={3} strokeLinecap="round" fill="none" />
      <circle cx={34} cy={30} r={10} fill={GRAY} />
      <circle cx={66} cy={30} r={10} fill={GRAY} />
      <circle cx={34} cy={30} r={5} fill={ROSE} opacity={0.6} />
      <circle cx={66} cy={30} r={5} fill={ROSE} opacity={0.6} />
      <circle cx={50} cy={54} r={24} fill={GRAY} />
      <circle cx={50} cy={66} r={2} fill={SEED} />
      <Eyes cx={50} cy={50} gap={12} r={4.6} />
      <Mouth cx={50} cy={60} w={8} />
    </ArtFrame>
  )
}

/* ------------------------------- jungle -------------------------------- */

function ElJaguar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={22} />
      <circle cx={32} cy={30} r={7} fill={PAPAYA} />
      <circle cx={68} cy={30} r={7} fill={PAPAYA} />
      <circle cx={32} cy={31} r={3} fill={SEED} />
      <circle cx={68} cy={31} r={3} fill={SEED} />
      <circle cx={50} cy={54} r={26} fill={PAPAYA} />
      {/* rosette spots, the jaguar's signature */}
      <circle cx={34} cy={46} r={3} fill={SEED} />
      <circle cx={66} cy={46} r={3} fill={SEED} />
      <circle cx={38} cy={62} r={3} fill={SEED} />
      <circle cx={62} cy={62} r={3} fill={SEED} />
      <Eyes cx={50} cy={50} gap={15} r={5.4} />
      <Mouth cx={50} cy={63} w={11} />
    </ArtFrame>
  )
}

function ElMono(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={22} />
      <circle cx={30} cy={48} r={9} fill={SEED_LIGHT} />
      <circle cx={70} cy={48} r={9} fill={SEED_LIGHT} />
      <circle cx={50} cy={52} r={26} fill={SEED_LIGHT} />
      <ellipse cx={50} cy={58} rx={16} ry={17} fill={CREAM} />
      <Eyes cx={50} cy={52} gap={13} r={5.2} />
      <Mouth cx={50} cy={64} w={11} />
    </ArtFrame>
  )
}

function LaSerpiente(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <path d="M 20 78 Q 40 78 40 62 Q 40 46 60 46 Q 80 46 80 30" stroke={LEAF} strokeWidth={13} strokeLinecap="round" fill="none" />
      <circle cx={80} cy={26} r={11} fill={LEAF} />
      <Eyes cx={80} cy={24} gap={8} r={2.6} />
      <path d="M 80 32 L 84 38 M 80 32 L 76 38" stroke={CORAL} strokeWidth={1.6} strokeLinecap="round" />
    </ArtFrame>
  )
}

function ElTucan(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={20} />
      <ellipse cx={44} cy={62} rx={14} ry={18} fill={SEED} />
      <circle cx={48} cy={38} r={17} fill={SEED} />
      {/* the huge beak is the whole point of a toucan */}
      <path d="M 34 40 Q 50 36 74 42 Q 76 54 62 62 Q 52 66 44 60 Q 32 52 34 40 Z" fill={PAPAYA} />
      <path d="M 38 48 Q 52 45 66 49 Q 63 56 54 60 Q 48 62 43 58 Q 37 54 38 48 Z" fill={SUN} />
      <Mouth cx={48} cy={50} w={12} color={PAPAYA_DARK} />
      <Eyes cx={48} cy={34} gap={14} r={4.8} />
    </ArtFrame>
  )
}

function LaRana(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={20} />
      <FrogHead />
    </ArtFrame>
  )
}

function LaMariposa(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ellipse cx={30} cy={40} rx={15} ry={19} fill={PURPLE} transform="rotate(-18 30 40)" />
      <ellipse cx={70} cy={40} rx={15} ry={19} fill={PURPLE} transform="rotate(18 70 40)" />
      <ellipse cx={34} cy={62} rx={10} ry={13} fill={ROSE} transform="rotate(-12 34 62)" />
      <ellipse cx={66} cy={62} rx={10} ry={13} fill={ROSE} transform="rotate(12 66 62)" />
      <rect x={47} y={32} width={6} height={36} rx={3} fill={SEED_LIGHT} />
      <path d="M 48 32 Q 44 24 40 22 M 52 32 Q 56 24 60 22" stroke={SEED_LIGHT} strokeWidth={2} strokeLinecap="round" fill="none" />
    </ArtFrame>
  )
}

function ElOsoPerezoso(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      {/* the branch it hangs on */}
      <rect x={12} y={48} width={76} height={9} rx={4.5} fill={SEED_LIGHT} />
      <path d="M 36 52 Q 30 66 40 78" stroke={GRAY} strokeWidth={11} strokeLinecap="round" fill="none" />
      <path d="M 64 52 Q 70 66 60 78" stroke={GRAY} strokeWidth={11} strokeLinecap="round" fill="none" />
      <circle cx={50} cy={56} r={24} fill={GRAY} />
      <ellipse cx={50} cy={60} rx={13} ry={15} fill={CREAM} />
      <circle cx={22} cy={44} r={2.6} fill={LEAF} />
      <Eyes mood="sleepy" cx={50} cy={54} gap={13} r={5} />
      <Mouth cx={50} cy={64} w={9} />
    </ArtFrame>
  )
}

/* --------------------------------- farm --------------------------------- */

function LaVaca(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={86} rx={22} />
      <CowHead />
    </ArtFrame>
  )
}

function ElCaballo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={86} rx={22} />
      {/* zig-zag mane along the top of the head */}
      <path d="M 30 30 L 36 20 L 42 30 L 48 20 L 54 30 L 60 20 L 66 30" stroke={SEED} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx={26} cy={54} rx={9} ry={11} fill={SEED_LIGHT} />
      <circle cx={50} cy={56} r={25} fill={SEED_LIGHT} />
      <circle cx={30} cy={62} r={2} fill={SEED} />
      <Eyes cx={52} cy={52} gap={14} r={5.2} />
      <Mouth cx={40} cy={64} w={9} />
    </ArtFrame>
  )
}

function ElCerdo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={86} rx={22} />
      <path d={`M 26 42 L 32 30 L 38 44 Z`} fill={ROSE} />
      <path d={`M 74 42 L 68 30 L 62 44 Z`} fill={ROSE} />
      <circle cx={50} cy={54} r={26} fill={ROSE} />
      {/* snout with two nostril dots */}
      <ellipse cx={50} cy={62} rx={13} ry={10} fill={CORAL} />
      <circle cx={46} cy={62} r={2} fill={CORAL_DARK} />
      <circle cx={54} cy={62} r={2} fill={CORAL_DARK} />
      <Eyes cx={50} cy={48} gap={14} r={5.2} />
    </ArtFrame>
  )
}

function LaGallina(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={86} rx={20} />
      <path d="M 40 22 Q 44 12 50 20 Q 56 12 60 22 Q 54 24 50 22 Q 46 24 40 22 Z" fill={CORAL} />
      <circle cx={50} cy={54} r={24} fill={WHITE} />
      <path d={`M 72 54 L 84 50 L 74 60 Z`} fill={SUN} />
      <Eyes cx={50} cy={50} gap={13} r={5} />
      <Mouth cx={50} cy={60} w={8} />
    </ArtFrame>
  )
}

function LaOveja(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={86} rx={22} />
      {/* fluffy cloud body made of overlapping circles */}
      <circle cx={30} cy={52} r={13} fill={CREAM} />
      <circle cx={70} cy={52} r={13} fill={CREAM} />
      <circle cx={40} cy={38} r={15} fill={CREAM} />
      <circle cx={60} cy={38} r={15} fill={CREAM} />
      <circle cx={50} cy={58} r={20} fill={CREAM} />
      <ellipse cx={50} cy={58} rx={14} ry={13} fill={SEED} />
      <Eyes cx={50} cy={54} gap={12} r={4.6} />
      <Mouth cx={50} cy={64} w={8} color={CREAM} />
    </ArtFrame>
  )
}

function ElPato(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={86} rx={20} />
      <ellipse cx={34} cy={64} rx={11} ry={16} fill={SUN} transform="rotate(-16 34 64)" />
      <circle cx={50} cy={52} r={24} fill={SUN} />
      <path d={`M 68 54 L 82 50 L 82 60 Z`} fill={PAPAYA} />
      <Eyes cx={48} cy={48} gap={13} r={5} />
    </ArtFrame>
  )
}

function LaCabra(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={86} rx={20} />
      <path d={`M 36 26 L 32 12 L 42 24 Z`} fill={SEED} />
      <path d={`M 64 26 L 68 12 L 58 24 Z`} fill={SEED} />
      <circle cx={50} cy={54} r={24} fill={GRAY} />
      {/* chin beard */}
      <path d="M 44 74 Q 50 82 56 74 Q 50 78 44 74 Z" fill={WHITE} />
      <Eyes cx={50} cy={50} gap={13} r={5} />
      <Mouth cx={50} cy={62} w={8} />
    </ArtFrame>
  )
}

/* ---------------------------------- sea ---------------------------------- */

function ElDelfin(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <path d={`M 50 20 L 58 34 L 42 34 Z`} fill={SKY_DARK} />
      <ellipse cx={48} cy={54} rx={30} ry={20} fill={SKY_DARK} />
      <ellipse cx={44} cy={64} rx={20} ry={9} fill={WHITE} />
      <path d={`M 78 50 L 92 58 L 76 62 Z`} fill={SKY_DARK} />
      <Eyes cx={28} cy={48} gap={0} r={4.4} />
      <Mouth cx={20} cy={56} w={10} color={SKY_DARK} />
    </ArtFrame>
  )
}

function LaTortuga(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={50} cy={88} rx={24} />
      <circle cx={26} cy={58} r={9} fill={SEED_LIGHT} />
      <circle cx={74} cy={58} r={9} fill={SEED_LIGHT} />
      <circle cx={50} cy={62} r={10} fill={SEED_LIGHT} />
      <ellipse cx={50} cy={50} rx={30} ry={24} fill={LEAF} />
      <circle cx={36} cy={44} r={6} fill={LEAF_DARK} />
      <circle cx={64} cy={44} r={6} fill={LEAF_DARK} />
      <circle cx={50} cy={58} r={6} fill={LEAF_DARK} />
      <Eyes cx={50} cy={64} gap={12} r={3.6} />
    </ArtFrame>
  )
}

function LaBallena(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      {/* water spout */}
      <circle cx={44} cy={16} r={3} fill={WHITE} opacity={0.85} />
      <circle cx={52} cy={12} r={2.4} fill={WHITE} opacity={0.7} />
      <path d="M 48 34 L 48 20" stroke={WHITE} strokeWidth={4} strokeLinecap="round" />
      <ellipse cx={48} cy={58} rx={34} ry={24} fill={SKY_DARK} />
      <ellipse cx={44} cy={70} rx={22} ry={8} fill={WHITE} opacity={0.5} />
      <path d={`M 80 54 L 92 48 L 88 62 Z`} fill={SKY_DARK} />
      <Eyes cx={24} cy={52} gap={0} r={4.2} />
      <Mouth cx={18} cy={62} w={10} color={SKY_DARK} />
    </ArtFrame>
  )
}

function ElCangrejo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={50} cy={84} rx={22} />
      {/* two big claws */}
      <circle cx={18} cy={44} r={10} fill={CORAL_DARK} />
      <circle cx={82} cy={44} r={10} fill={CORAL_DARK} />
      <path d="M 30 52 L 18 44" stroke={CORAL} strokeWidth={7} strokeLinecap="round" />
      <path d="M 70 52 L 82 44" stroke={CORAL} strokeWidth={7} strokeLinecap="round" />
      {/* little legs */}
      <path d="M 32 70 L 20 76 M 68 70 L 80 76 M 34 74 L 24 82 M 66 74 L 76 82" stroke={CORAL_DARK} strokeWidth={3.4} strokeLinecap="round" />
      <ellipse cx={50} cy={58} rx={26} ry={19} fill={CORAL} />
      <Eyes cx={50} cy={50} gap={16} r={5} />
      <Mouth cx={50} cy={62} w={9} />
    </ArtFrame>
  )
}

function ElPulpo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      {/* six curly legs */}
      {[-32, -19, -6, 6, 19, 32].map((dx) => (
        <path key={dx} d={`M ${50 + dx * 0.7} 66 Q ${50 + dx} 78 ${50 + dx * 0.6} 88`} stroke={PURPLE_DARK} strokeWidth={7} strokeLinecap="round" fill="none" />
      ))}
      <path d="M 22 50 Q 22 18 50 18 Q 78 18 78 50 Q 78 68 50 68 Q 22 68 22 50 Z" fill={PURPLE} />
      <Eyes cx={50} cy={44} gap={16} r={6} />
      <Mouth cx={50} cy={56} w={10} />
    </ArtFrame>
  )
}

function LaEstrellaDeMar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Star cx={50} cy={50} r={36} color={PAPAYA} />
      <Eyes cx={50} cy={44} gap={13} r={4.6} />
      <circle cx={50} cy={54} r={1.8} fill={INK} />
    </ArtFrame>
  )
}

function ElTiburon(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <path d={`M 46 16 L 56 34 L 38 34 Z`} fill={GRAY_DARK} />
      <path d="M 14 56 Q 50 28 90 50 Q 60 62 40 62 Q 20 66 14 56 Z" fill={GRAY} />
      <ellipse cx={44} cy={60} rx={22} ry={9} fill={WHITE} />
      <path d={`M 78 46 L 92 44 L 82 56 Z`} fill={GRAY} />
      {/* a couple of little teeth */}
      <path d="M 66 54 L 69 60 L 72 54 Z" fill={WHITE} />
      <Eyes cx={30} cy={46} gap={0} r={4} />
    </ArtFrame>
  )
}

/* -------------------------------- sounds -------------------------------- */

function ElPerroLadra(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={44} cy={86} rx={18} />
      <DogHead cx={42} cy={58} />
      <Bubble x={54} y={10} w={38} h={26} tail="left">
        <BigText text="Guau" size={13} />
      </Bubble>
    </ArtFrame>
  )
}

function ElGatoMaulla(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={42} cy={84} rx={17} />
      <CatHead cx={40} cy={58} />
      <Bubble x={54} y={10} w={38} h={26} tail="left">
        <BigText text="Miau" size={13} />
      </Bubble>
    </ArtFrame>
  )
}

function LaVacaMuge(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={42} cy={86} rx={18} />
      <CowHead cx={40} cy={58} />
      <Bubble x={54} y={10} w={36} h={26} tail="left">
        <BigText text="Muu" size={14} />
      </Bubble>
    </ArtFrame>
  )
}

/* --------------------------------- verbs --------------------------------- */

function Volar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <BirdBody cx={54} cy={50} fly />
      <Mouth cx={52} cy={58} w={7} />
      <Zoom x={26} y={46} color={SKY_DARK} />
      <Zoom x={22} y={60} color={SKY_DARK} />
    </ArtFrame>
  )
}

function Nadar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <path d="M 14 74 Q 24 68 34 74 Q 44 80 54 74" stroke={SKY_DARK} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M 46 82 Q 56 76 66 82 Q 76 88 86 82" stroke={SKY_DARK} strokeWidth={4} strokeLinecap="round" fill="none" />
      <FishBody cx={48} cy={46} swim />
    </ArtFrame>
  )
}

function Saltar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={16} />
      <FrogHead cx={54} cy={44} jump />
      <Zoom x={24} y={58} />
      <Zoom x={20} y={72} />
    </ArtFrame>
  )
}

function Correr(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={86} rx={22} />
      <DogHead running />
      <Zoom x={18} y={56} />
      <Zoom x={14} y={70} />
    </ArtFrame>
  )
}

/* --------------------------------- export -------------------------------- */

export const U6_ART: Record<string, ComponentType<WordArtProps>> = {
  'el-perro': ElPerro,
  'el-gato': ElGato,
  'el-pez': ElPez,
  'el-conejo': ElConejo,
  'el-pajaro': ElPajaro,
  'el-hamster': ElHamster,
  'el-raton': ElRaton,
  'el-jaguar': ElJaguar,
  'el-mono': ElMono,
  'la-serpiente': LaSerpiente,
  'el-tucan': ElTucan,
  'la-rana': LaRana,
  'la-mariposa': LaMariposa,
  'el-oso-perezoso': ElOsoPerezoso,
  'la-vaca': LaVaca,
  'el-caballo': ElCaballo,
  'el-cerdo': ElCerdo,
  'la-gallina': LaGallina,
  'la-oveja': LaOveja,
  'el-pato': ElPato,
  'la-cabra': LaCabra,
  'el-delfin': ElDelfin,
  'la-tortuga': LaTortuga,
  'la-ballena': LaBallena,
  'el-cangrejo': ElCangrejo,
  'el-pulpo': ElPulpo,
  'la-estrella-de-mar': LaEstrellaDeMar,
  'el-tiburon': ElTiburon,
  'el-perro-ladra': ElPerroLadra,
  'el-gato-maulla': ElGatoMaulla,
  'la-vaca-muge': LaVacaMuge,
  volar: Volar,
  nadar: Nadar,
  saltar: Saltar,
  correr: Correr,
}
