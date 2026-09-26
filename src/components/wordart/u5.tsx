// Unit 5 word art: food, drink, and mealtime phrases.
// Foods are the food alone, big and flat, with one white highlight dot.
// Mealtime phrases are a Kid plus a Bubble (see docs/design/word-art.md).

import {
  ArtFrame,
  Tile,
  Ground,
  Kid,
  Bubble,
  BigText,
  Heart,
  NoSign,
  Sparkles,
  INK,
  INK_SOFT,
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
  PURPLE,
  ROSE,
  CREAM,
  CREAM_DARK,
  SEED,
  SEED_LIGHT,
  WHITE,
} from './primitives'
import type { WordArtProps } from './primitives'
import type { ComponentType } from 'react'

/* ------------------------------ small helpers ------------------------------ */

/** A little leaf, used on fruit stems. */
function Leaf({ cx, cy, rotate = 0, color = LEAF }: { cx: number; cy: number; rotate?: number; color?: string }) {
  return (
    <path
      transform={`translate(${cx} ${cy}) rotate(${rotate})`}
      d="M 0 0 Q -9 -8 0 -14 Q 9 -8 0 0 Z"
      fill={color}
    />
  )
}

/** A round white shine dot for a food's highlight (rule: one per picture). */
function Shine({ cx, cy, r = 4.5 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={WHITE} opacity={0.85} />
}

/** A shallow bowl, used by rice, sancocho, and the "more please" and "yummy" pictures. */
function Bowl({ cx = 50, cy = 68, w = 44, color = SKY_DARK }: { cx?: number; cy?: number; w?: number; color?: string }) {
  return <path d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy + w * 0.36} ${cx + w / 2} ${cy} L ${cx + w / 2 - 3} ${cy - 6} L ${cx - w / 2 + 3} ${cy - 6} Z`} fill={color} />
}

/** Two curly steam lines above a hot drink. */
function Steam({ x = 50, y = 30 }: { x?: number; y?: number }) {
  return (
    <g stroke={INK_SOFT} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.55}>
      <path d={`M ${x - 7} ${y + 14} Q ${x - 12} ${y + 4} ${x - 7} ${y - 2} Q ${x - 2} ${y - 8} ${x - 7} ${y - 16}`} />
      <path d={`M ${x + 7} ${y + 14} Q ${x + 2} ${y + 4} ${x + 7} ${y - 2} Q ${x + 12} ${y - 8} ${x + 7} ${y - 16}`} />
    </g>
  )
}

/** A plain dinner plate seen from above. */
function Plate({ cx = 50, cy = 60, r = 24, color = WHITE }: { cx?: number; cy?: number; r?: number; color?: string }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.62} fill={color} />
      <ellipse cx={cx} cy={cy} rx={r * 0.62} ry={r * 0.38} fill={CREAM_DARK} opacity={0.5} />
    </>
  )
}

/** A tiny fork glyph, for "I want to eat". */
function Fork() {
  return (
    <g stroke={INK} strokeWidth={2.4} strokeLinecap="round">
      <line x1={-6} y1={-8} x2={-6} y2={4} />
      <line x1={-2} y1={-8} x2={-2} y2={4} />
      <line x1={2} y1={-8} x2={2} y2={4} />
      <line x1={-2} y1={4} x2={-2} y2={10} />
    </g>
  )
}

/** A tiny glass glyph, for "I want to drink" and "thirsty". */
function GlassGlyph() {
  return (
    <g>
      <path d="M -7 -8 L 7 -8 L 5 10 L -5 10 Z" fill={WHITE} stroke={SKY_DARK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M -6 -4 L 6 -4 L 4.5 8 L -4.5 8 Z" fill={SKY} />
    </g>
  )
}

/** A little dinner table with legs. */
function Table({ y = 72 }: { y?: number }) {
  return (
    <g>
      <rect x={20} y={y} width={60} height={7} rx={2} fill={SEED_LIGHT} />
      <rect x={24} y={y + 7} width={5} height={13} fill={SEED_LIGHT} />
      <rect x={71} y={y + 7} width={5} height={13} fill={SEED_LIGHT} />
    </g>
  )
}

/* ------------------------------ fruit ------------------------------ */

export function Manzana(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <path d="M 50 32 C 34 20 18 36 21 56 C 24 78 38 86 50 86 C 62 86 76 78 79 56 C 82 36 66 20 50 32 Z" fill={CORAL_DARK} />
      <path d="M 49 30 Q 46 20 38 17" stroke={SEED} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Leaf cx={49} cy={19} rotate={-30} />
      <Shine cx={38} cy={46} />
    </ArtFrame>
  )
}

export function Platano(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <path d="M 30 74 Q 24 46 42 24 Q 50 16 58 20 Q 46 26 40 42 Q 34 60 42 76 Q 36 78 30 74 Z" fill={SUN} />
      <path d="M 40 74 Q 34 48 50 26" stroke={SUN_DARK} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.5} />
      <path d="M 55 18 L 62 12" stroke={SEED_LIGHT} strokeWidth={4} strokeLinecap="round" />
      <Shine cx={34} cy={52} r={3.5} />
    </ArtFrame>
  )
}

export function Naranja(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <circle cx={50} cy={54} r={30} fill={PAPAYA} />
      <circle cx={50} cy={28} r={3} fill={PAPAYA_DARK} />
      <Leaf cx={57} cy={24} rotate={30} />
      <Shine cx={39} cy={44} />
    </ArtFrame>
  )
}

export function Uva(p: WordArtProps) {
  const dots: Array<[number, number, number]> = [
    [50, 32, 8], [40, 44, 9], [60, 44, 9], [32, 58, 9], [50, 58, 9.5], [68, 58, 9], [50, 74, 9],
  ]
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <path d="M 50 30 L 50 18" stroke={LEAF_DARK} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Leaf cx={56} cy={18} rotate={40} />
      {dots.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={PURPLE} />
      ))}
      <Shine cx={44} cy={40} r={3.5} />
    </ArtFrame>
  )
}

export function Fresa(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <path d="M 50 30 Q 30 34 26 56 Q 32 82 50 84 Q 68 82 74 56 Q 70 34 50 30 Z" fill={CORAL_DARK} />
      <path d="M 34 30 Q 42 22 50 30 Q 58 22 66 30 Q 58 26 50 32 Q 42 26 34 30 Z" fill={LEAF} />
      <circle cx={42} cy={48} r={2} fill={SUN} />
      <circle cx={58} cy={50} r={2} fill={SUN} />
      <circle cx={50} cy={62} r={2} fill={SUN} />
      <circle cx={40} cy={66} r={2} fill={SUN} />
      <Shine cx={40} cy={46} r={4} />
    </ArtFrame>
  )
}

export function Mango(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <path d="M 50 24 C 68 26 78 44 72 62 C 66 80 50 84 42 76 C 30 66 30 44 40 32 C 43 28 46 25 50 24 Z" fill={PAPAYA} />
      <path d="M 62 34 C 70 42 72 54 66 64" fill={CORAL} opacity={0.55} />
      <Leaf cx={48} cy={23} rotate={-20} />
      <Shine cx={44} cy={44} />
    </ArtFrame>
  )
}

export function Sandia(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <path d="M 20 34 Q 50 20 80 34 Q 66 78 50 86 Q 34 78 20 34 Z" fill={LEAF_DARK} />
      <path d="M 26 36 Q 50 26 74 36 Q 62 72 50 79 Q 38 72 26 36 Z" fill={WHITE} />
      <path d="M 30 40 Q 50 32 70 40 Q 59 68 50 75 Q 41 68 30 40 Z" fill={CORAL_DARK} />
      <circle cx={42} cy={50} r={2.4} fill={INK} />
      <circle cx={58} cy={50} r={2.4} fill={INK} />
      <circle cx={50} cy={62} r={2.4} fill={INK} />
      <circle cx={44} cy={64} r={2} fill={INK} />
    </ArtFrame>
  )
}

/* ------------------------------ meal staples ------------------------------ */

export function Pan(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM} />
      <ellipse cx={50} cy={68} rx={34} ry={14} fill={SUN_DARK} />
      <path d="M 18 62 Q 50 34 82 62 Q 68 50 50 50 Q 32 50 18 62 Z" fill={SUN} />
      <path d="M 40 44 L 36 54 M 50 41 L 47 52 M 60 44 L 58 54" stroke={SUN_DARK} strokeWidth={2} strokeLinecap="round" />
    </ArtFrame>
  )
}

export function Arroz(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Bowl cx={50} cy={72} w={54} color={CORAL_DARK} />
      <ellipse cx={50} cy={58} rx={27} ry={16} fill={WHITE} />
      <circle cx={40} cy={54} r={2.2} fill={CREAM_DARK} />
      <circle cx={52} cy={50} r={2.2} fill={CREAM_DARK} />
      <circle cx={61} cy={56} r={2.2} fill={CREAM_DARK} />
    </ArtFrame>
  )
}

export function Pollo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <rect x={46} y={60} width={8} height={26} rx={4} fill={CREAM} />
      <circle cx={50} cy={84} r={5} fill={CREAM} />
      <ellipse cx={50} cy={42} rx={26} ry={24} fill={SUN_DARK} />
      <path d="M 34 36 Q 40 30 48 32" stroke={SEED_LIGHT} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6} />
      <Shine cx={40} cy={34} />
    </ArtFrame>
  )
}

export function Queso(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <path d="M 22 74 L 50 20 L 82 74 Q 52 84 22 74 Z" fill={SUN} />
      <circle cx={45} cy={56} r={5} fill={CREAM_DARK} />
      <circle cx={62} cy={62} r={4} fill={CREAM_DARK} />
      <circle cx={52} cy={40} r={3.5} fill={CREAM_DARK} />
      <Shine cx={34} cy={64} r={3.5} />
    </ArtFrame>
  )
}

export function Huevo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Plate cx={50} cy={62} r={30} />
      <ellipse cx={50} cy={56} rx={22} ry={14} fill={WHITE} />
      <circle cx={50} cy={56} r={9} fill={SUN} />
      <Shine cx={46} cy={52} r={2.5} />
    </ArtFrame>
  )
}

export function Leche(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <path d="M 34 30 L 66 30 L 66 82 L 34 82 Z" fill={WHITE} />
      <path d="M 34 30 L 50 16 L 66 30 Z" fill={CREAM_DARK} />
      <rect x={34} y={46} width={32} height={10} fill={SKY_DARK} />
      <Shine cx={42} cy={64} r={3} />
    </ArtFrame>
  )
}

export function Agua(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM} />
      <path d="M 36 24 L 64 24 L 60 82 L 40 82 Z" fill={CREAM_DARK} opacity={0.5} />
      <path d="M 39 40 L 61 40 L 58 82 L 42 82 Z" fill={SKY} />
      <path d="M 39 40 Q 50 34 61 40 L 60 46 Q 50 41 40 46 Z" fill={WHITE} opacity={0.7} />
      <Shine cx={46} cy={56} r={3} />
    </ArtFrame>
  )
}

/* ------------------------------ colombian foods ------------------------------ */

export function Arepa(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ellipse cx={50} cy={62} rx={32} ry={12} fill={SUN_DARK} />
      <ellipse cx={50} cy={54} rx={32} ry={16} fill={SUN} />
      <circle cx={38} cy={50} r={2} fill={SUN_DARK} />
      <circle cx={54} cy={46} r={2} fill={SUN_DARK} />
      <circle cx={62} cy={54} r={2} fill={SUN_DARK} />
      <circle cx={46} cy={60} r={2} fill={SUN_DARK} />
      <Shine cx={40} cy={46} r={3} />
    </ArtFrame>
  )
}

export function Empanada(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <path d="M 18 62 Q 50 20 82 62 Q 50 76 18 62 Z" fill={SUN_DARK} />
      <path d="M 24 60 Q 50 70 76 60" stroke={SEED_LIGHT} strokeWidth={2} strokeLinecap="round" fill="none" />
      <circle cx={30} cy={58} r={2} fill={SEED_LIGHT} />
      <circle cx={42} cy={66} r={2} fill={SEED_LIGHT} />
      <circle cx={58} cy={66} r={2} fill={SEED_LIGHT} />
      <circle cx={70} cy={58} r={2} fill={SEED_LIGHT} />
      <Shine cx={38} cy={44} r={3.5} />
    </ArtFrame>
  )
}

export function ChocolateCaliente(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Steam x={48} y={26} />
      <path d="M 68 48 Q 80 48 80 58 Q 80 66 68 66" fill="none" stroke={SEED_LIGHT} strokeWidth={5} />
      <rect x={26} y={44} width={44} height={34} rx={6} fill={CORAL} />
      <ellipse cx={48} cy={44} rx={22} ry={6} fill={SEED} />
      <Shine cx={40} cy={62} r={3} />
    </ArtFrame>
  )
}

export function Bunuelo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <circle cx={50} cy={54} r={30} fill={SUN_DARK} />
      <circle cx={40} cy={44} r={3} fill={SEED_LIGHT} opacity={0.6} />
      <circle cx={62} cy={58} r={3} fill={SEED_LIGHT} opacity={0.6} />
      <circle cx={54} cy={70} r={2.5} fill={SEED_LIGHT} opacity={0.6} />
      <Shine cx={38} cy={42} r={5} />
    </ArtFrame>
  )
}

export function Sancocho(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Bowl cx={50} cy={72} w={54} color={SKY_DARK} />
      <path d="M 24 62 Q 50 44 76 62 Q 66 52 50 52 Q 34 52 24 62 Z" fill={SUN} />
      <rect x={44} y={50} width={10} height={16} rx={3} fill={SUN} />
      <circle cx={47} cy={54} r={1.4} fill={SUN_DARK} />
      <circle cx={51} cy={58} r={1.4} fill={SUN_DARK} />
      <Leaf cx={64} cy={50} rotate={50} />
    </ArtFrame>
  )
}

export function Jugo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <path d="M 36 32 L 64 32 L 59 82 L 41 82 Z" fill={CREAM} />
      <path d="M 39 44 L 61 44 L 57 82 L 43 82 Z" fill={PAPAYA} />
      <line x1={58} y1={18} x2={50} y2={40} stroke={CORAL_DARK} strokeWidth={4} strokeLinecap="round" />
      <Shine cx={46} cy={58} r={3} />
    </ArtFrame>
  )
}

export function Aguapanela(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM} />
      <path d="M 70 46 Q 82 46 82 56 Q 82 64 70 64" fill="none" stroke={SEED_LIGHT} strokeWidth={5} />
      <rect x={28} y={42} width={42} height={34} rx={6} fill={SUN_DARK} />
      <ellipse cx={49} cy={42} rx={21} ry={6} fill={SEED_LIGHT} />
      <circle cx={60} cy={30} r={8} fill={LEAF} />
      <path d="M 60 24 L 60 36 M 55 30 L 65 30" stroke={WHITE} strokeWidth={1.5} />
    </ArtFrame>
  )
}

/* ------------------------------ mealtime phrases ------------------------------ */

export function TengoHambre(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={42} cy={90} rx={16} />
      <Kid cx={42} baseY={90} scale={0.9} hair="short" shirt={PAPAYA} mood="sad" arms="hug" />
      <Bubble x={54} y={10} w={36} h={30} tail="left">
        <ellipse cx={0} cy={2} rx={11} ry={6} fill={CREAM_DARK} stroke={INK_SOFT} strokeWidth={2} />
      </Bubble>
    </ArtFrame>
  )
}

export function TengoSed(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={42} cy={90} rx={16} />
      <Kid cx={42} baseY={90} scale={0.9} hair="short" shirt={SKY} mood="sad" arms="down" />
      <Bubble x={54} y={8} w={36} h={32} tail="left">
        <GlassGlyph />
      </Bubble>
    </ArtFrame>
  )
}

export function Rico(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Sparkles cx={68} cy={22} />
      <Bowl cx={42} cy={86} w={30} color={SKY_DARK} />
      <Kid cx={50} baseY={92} scale={1.1} hair="curly" shirt={LEAF} mood="excited" arms="up" />
    </ArtFrame>
  )
}

export function MasPorFavor(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={46} cy={90} rx={18} />
      <Kid cx={46} baseY={90} scale={0.95} hair="short" shirt={CORAL} mood="happy" arms="hold">
        <ellipse cx={0} cy={6} rx={13} ry={6} fill={SKY_DARK} />
      </Kid>
      <Bubble x={58} y={10} w={30} h={28} tail="left">
        <BigText text="+" size={20} />
      </Bubble>
    </ArtFrame>
  )
}

export function YaTermine(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Plate cx={38} cy={64} r={22} />
      <path d="M 30 64 L 36 70 L 48 56" fill="none" stroke={LEAF} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <Kid cx={74} baseY={86} scale={0.7} hair="short" shirt={SUN} mood="excited" arms="up" />
    </ArtFrame>
  )
}

export function AComer(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Table y={58} />
      <Plate cx={50} cy={52} r={14} />
      <Kid cx={26} baseY={90} scale={0.85} hair="short" shirt={SKY} mood="excited" pose="run" />
    </ArtFrame>
  )
}

export function BuenProvecho(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Table y={62} />
      <Kid cx={28} baseY={92} scale={0.62} hair="long" shirt={ROSE} mood="happy" />
      <Kid cx={72} baseY={92} scale={0.62} hair="short" shirt={SKY} mood="happy" />
      <Heart cx={50} cy={22} s={20} />
    </ArtFrame>
  )
}

export function YoQuiero(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={90} rx={16} />
      <Kid cx={38} baseY={90} scale={0.9} hair="short" shirt={LEAF} mood="happy" arms="point" />
      <circle cx={72} cy={54} r={12} fill={PAPAYA} />
      <Leaf cx={72} cy={44} rotate={0} />
      <Heart cx={70} cy={22} s={18} />
    </ArtFrame>
  )
}

export function QuieroComer(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={42} cy={90} rx={16} />
      <Kid cx={42} baseY={90} scale={0.9} hair="short" shirt={CORAL} mood="happy" arms="down" />
      <Bubble x={54} y={10} w={32} h={30} tail="left">
        <Fork />
      </Bubble>
    </ArtFrame>
  )
}

export function QuieroTomar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={42} cy={90} rx={16} />
      <Kid cx={42} baseY={90} scale={0.9} hair="short" shirt={SUN} mood="happy" arms="down" />
      <Bubble x={54} y={8} w={36} h={32} tail="left">
        <GlassGlyph />
      </Bubble>
    </ArtFrame>
  )
}

export function NoQuiero(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={62} cy={90} rx={16} />
      <Plate cx={26} cy={56} r={16} />
      <NoSign cx={26} cy={56} r={16} />
      <Kid cx={62} baseY={90} scale={0.9} hair="short" shirt={CORAL} mood="mad" arms="hips" />
    </ArtFrame>
  )
}

export function QueQuieres(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={90} rx={16} />
      <Kid cx={38} baseY={90} scale={0.9} hair="short" shirt={SKY} mood="happy" arms="up" />
      <Bubble x={54} y={8} w={30} h={28} tail="left">
        <BigText text="?" size={20} />
      </Bubble>
      <circle cx={68} cy={68} r={9} fill={CORAL_DARK} />
      <rect x={80} y={64} width={10} height={8} rx={3} fill={SUN_DARK} />
    </ArtFrame>
  )
}

export function PruebaEsto(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={92} rx={26} />
      <Kid cx={30} baseY={92} scale={1.05} hair="long" shirt={ROSE} mood="happy" arms="hold">
        <ellipse cx={4} cy={4} rx={3} ry={9} fill={SEED_LIGHT} />
      </Kid>
      <Kid cx={68} baseY={92} scale={0.65} hair="short" shirt={LEAF} mood="happy" arms="down" />
    </ArtFrame>
  )
}

export function QueRicoEsta(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Sparkles cx={70} cy={18} />
      <Sparkles cx={26} cy={26} color={CORAL} />
      <Bowl cx={42} cy={86} w={32} color={CORAL_DARK} />
      <Kid cx={52} baseY={92} scale={1.15} hair="curly" shirt={LEAF} mood="excited" arms="up" />
    </ArtFrame>
  )
}

/* ------------------------------ export map ------------------------------ */

export const U5_ART: Record<string, ComponentType<WordArtProps>> = {
  'la-manzana': Manzana,
  'el-platano': Platano,
  'la-naranja': Naranja,
  'la-uva': Uva,
  'la-fresa': Fresa,
  'el-mango': Mango,
  'la-sandia': Sandia,
  'el-pan': Pan,
  'el-arroz': Arroz,
  'el-pollo': Pollo,
  'el-queso': Queso,
  'el-huevo': Huevo,
  'la-leche': Leche,
  'el-agua': Agua,
  'la-arepa': Arepa,
  'la-empanada': Empanada,
  'el-chocolate-caliente': ChocolateCaliente,
  'el-bunuelo': Bunuelo,
  'el-sancocho': Sancocho,
  'el-jugo': Jugo,
  'la-aguapanela': Aguapanela,
  'tengo-hambre': TengoHambre,
  'tengo-sed': TengoSed,
  rico: Rico,
  'mas-por-favor': MasPorFavor,
  'ya-termine': YaTermine,
  'a-comer': AComer,
  'buen-provecho': BuenProvecho,
  'yo-quiero': YoQuiero,
  'quiero-comer': QuieroComer,
  'quiero-tomar': QuieroTomar,
  'no-quiero': NoQuiero,
  'que-quieres': QueQuieres,
  'prueba-esto': PruebaEsto,
  'que-rico-esta': QueRicoEsta,
}
