// Unit 7 word art: clothes and weather.
// One small drawing per word, built only from the shared parts in `primitives.tsx`.
// See docs/design/word-art.md for the rules.

import type { ComponentType } from 'react'
import {
  ArtFrame,
  Tile,
  Ground,
  Kid,
  Bubble,
  BigText,
  Heart,
  Star,
  INK,
  PAPAYA_DARK,
  LEAF,
  SKY,
  SKY_DARK,
  SUN,
  SUN_DARK,
  CORAL,
  CORAL_DARK,
  ROSE,
  PURPLE,
  PURPLE_DARK,
  CREAM_DARK,
  SEED,
  SEED_LIGHT,
  WHITE,
  GRAY_DARK,
} from './primitives'
import type { WordArtProps } from './primitives'

/* ------------------------------ garment parts ------------------------------ */
// Small building blocks so every garment in the unit looks like one family:
// rounded sleeve/leg shapes, a V collar notch cut in the tile color, flat fill.

function ShirtShape({ cx = 50, cy = 48, s = 1, color, collar = CREAM_DARK }: { cx?: number; cy?: number; s?: number; color: string; collar?: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-34} y={-14} width={16} height={24} rx={7} fill={color} transform="rotate(-18 -26 -2)" />
      <rect x={18} y={-14} width={16} height={24} rx={7} fill={color} transform="rotate(18 26 -2)" />
      <path d="M -16 -18 L -6 -26 Q 0 -18 6 -26 L 16 -18 L 16 30 Q 0 34 -16 30 Z" fill={color} />
      <path d="M -6 -26 Q 0 -16 6 -26 Q 0 -20 -6 -26 Z" fill={collar} />
    </g>
  )
}

function PantsShape({ cx = 50, cy = 50, s = 1, color }: { cx?: number; cy?: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-20} y={-24} width={40} height={14} rx={6} fill={color} />
      <rect x={-20} y={-12} width={17} height={40} rx={6} fill={color} />
      <rect x={3} y={-12} width={17} height={40} rx={6} fill={color} />
    </g>
  )
}

function DressShape({ cx = 50, cy = 45, s = 1, color, collar = CREAM_DARK }: { cx?: number; cy?: number; s?: number; color: string; collar?: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <path d="M -14 -30 L -6 -36 Q 0 -30 6 -36 L 14 -30 L 10 -6 L -10 -6 Z" fill={color} />
      <path d="M -12 -8 L 12 -8 L 26 34 L -26 34 Z" fill={color} />
      <path d="M -6 -36 Q 0 -28 6 -36 Q 0 -31 -6 -36 Z" fill={collar} />
    </g>
  )
}

function ShoesPair({ cx = 50, cy = 56, s = 1, color, sole = SEED }: { cx?: number; cy?: number; s?: number; color: string; sole?: string }) {
  const shoe = (dx: number) => (
    <g transform={`translate(${dx} 0)`}>
      <path d="M -13 -6 Q -13 -15 -4 -15 L 8 -15 Q 13 -15 13 -8 L 13 0 L -13 0 Z" fill={color} />
      <rect x={-14} y={0} width={28} height={6} rx={3} fill={sole} />
    </g>
  )
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {shoe(-20)}
      {shoe(20)}
    </g>
  )
}

function SocksPair({ cx = 50, cy = 50, s = 1, color, stripe = WHITE }: { cx?: number; cy?: number; s?: number; color: string; stripe?: string }) {
  const sock = (dx: number) => (
    <g transform={`translate(${dx} 0)`}>
      <path d="M -8 -30 L 8 -30 L 8 6 Q 8 16 -4 16 L -14 16 Q -18 16 -18 10 L -18 0 L -8 0 Z" fill={color} />
      <rect x={-8} y={-24} width={16} height={5} fill={stripe} />
      <rect x={-8} y={-14} width={16} height={5} fill={stripe} />
    </g>
  )
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {sock(-14)}
      {sock(14)}
    </g>
  )
}

function ShortsShape({ cx = 50, cy = 48, s = 1, color }: { cx?: number; cy?: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-22} y={-20} width={44} height={14} rx={6} fill={color} />
      <rect x={-22} y={-8} width={19} height={24} rx={7} fill={color} />
      <rect x={3} y={-8} width={19} height={24} rx={7} fill={color} />
    </g>
  )
}

function SweaterShape({ cx = 50, cy = 48, s = 1, color, rib }: { cx?: number; cy?: number; s?: number; color: string; rib: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-34} y={-14} width={16} height={26} rx={7} fill={color} transform="rotate(-18 -26 -1)" />
      <rect x={18} y={-14} width={16} height={26} rx={7} fill={color} transform="rotate(18 26 -1)" />
      <path d="M -18 -20 L -6 -26 Q 0 -20 6 -26 L 18 -20 L 18 28 L -18 28 Z" fill={color} />
      <path d="M -6 -26 Q 0 -18 6 -26 Q 0 -22 -6 -26 Z" fill={rib} />
      <line x1={-16} y1={20} x2={16} y2={20} stroke={rib} strokeWidth={2.5} />
      <line x1={-16} y1={25} x2={16} y2={25} stroke={rib} strokeWidth={2.5} />
      <rect x={-32} y={6} width={12} height={6} rx={3} fill={rib} transform="rotate(-18 -26 9)" />
      <rect x={20} y={6} width={12} height={6} rx={3} fill={rib} transform="rotate(18 26 9)" />
    </g>
  )
}

function HatShape({ cx = 50, cy = 52, s = 1, color, band }: { cx?: number; cy?: number; s?: number; color: string; band: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <ellipse cx={0} cy={10} rx={34} ry={9} fill={color} />
      <path d="M -18 10 Q -18 -22 0 -22 Q 18 -22 18 10 Z" fill={color} />
      <rect x={-18} y={4} width={36} height={7} fill={band} />
    </g>
  )
}

function CapShape({ cx = 50, cy = 52, s = 1, color, bill }: { cx?: number; cy?: number; s?: number; color: string; bill: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {/* dome, viewed from the front, with a small brim centered below it */}
      <path d="M -22 6 Q -22 -22 0 -22 Q 22 -22 22 6 Z" fill={color} />
      <ellipse cx={0} cy={9} rx={20} ry={6} fill={bill} />
    </g>
  )
}

function ScarfShape({ cx = 50, cy = 46, s = 1, color }: { cx?: number; cy?: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {/* band draped over the shoulders */}
      <path d="M -32 -8 Q -16 -20 0 -10 Q 16 0 32 -12 Q 32 -3 24 1 Q 8 10 -8 0 Q -22 -8 -32 0 Z" fill={color} />
      {/* knot at the front */}
      <rect x={-10} y={-6} width={20} height={16} rx={6} fill={color} transform="rotate(10 0 2)" />
      {/* two hanging tails */}
      <rect x={-17} y={6} width={11} height={26} rx={5} fill={color} transform="rotate(-8 -11 19)" />
      <rect x={6} y={6} width={11} height={26} rx={5} fill={color} transform="rotate(8 11 19)" />
      {/* fringe */}
      <line x1={-14} y1={32} x2={-14} y2={38} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <line x1={-9} y1={33} x2={-9} y2={39} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <line x1={9} y1={33} x2={9} y2={39} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <line x1={14} y1={32} x2={14} y2={38} stroke={color} strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

function Mitten({ dx, flip = false, color }: { dx: number; flip?: boolean; color: string }) {
  return (
    <g transform={`translate(${dx} 0) scale(${flip ? -1 : 1},1)`}>
      {/* rounded hand with a tapered cuff */}
      <path d="M -13 12 L -13 -6 Q -13 -19 0 -19 Q 13 -19 13 -6 L 13 12 Q 13 19 5 19 L -5 19 Q -13 19 -13 12 Z" fill={color} />
      {/* thumb, poking out to one side */}
      <path d="M -13 0 Q -23 -3 -22 7 Q -21 14 -12 10 Z" fill={color} />
      {/* cuff line */}
      <rect x={-13} y={12} width={26} height={5} rx={2.5} fill={color} opacity={0.55} />
    </g>
  )
}

function GlovesPair({ cx = 50, cy = 52, s = 1, color }: { cx?: number; cy?: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <Mitten dx={-18} color={color} />
      <Mitten dx={18} flip color={color} />
    </g>
  )
}

function Boot({ dx, color, sole }: { dx: number; color: string; sole: string }) {
  return (
    <g transform={`translate(${dx} 0)`}>
      {/* tall shaft plus a foot that pokes out to the right */}
      <path d="M -8 -26 L 8 -26 Q 12 -26 12 -21 L 12 -2 L 18 -2 Q 24 -2 24 4 L 24 8 L -8 8 Z" fill={color} />
      <rect x={-8} y={8} width={32} height={6} rx={3} fill={sole} />
    </g>
  )
}

function BootsPair({ cx = 50, cy = 54, s = 1, color, sole = SEED }: { cx?: number; cy?: number; s?: number; color: string; sole?: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <Boot dx={-20} color={color} sole={sole} />
      <Boot dx={20} color={color} sole={sole} />
    </g>
  )
}

function JacketShape({ cx = 50, cy = 48, s = 1, color }: { cx?: number; cy?: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-34} y={-14} width={16} height={26} rx={7} fill={color} transform="rotate(-18 -26 -1)" />
      <rect x={18} y={-14} width={16} height={26} rx={7} fill={color} transform="rotate(18 26 -1)" />
      <path d="M -18 -18 L -8 -26 L 0 -20 L 8 -26 L 18 -18 L 18 30 L -18 30 Z" fill={color} />
      <path d="M -8 -26 L 0 -20 L -3 -14 Z" fill={INK} opacity={0.15} />
      <path d="M 8 -26 L 0 -20 L 3 -14 Z" fill={INK} opacity={0.15} />
      <line x1={0} y1={-18} x2={0} y2={28} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  )
}

function PajamaShape({ cx = 50, cy = 50, s = 1, color, star }: { cx?: number; cy?: number; s?: number; color: string; star: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-32} y={-16} width={16} height={22} rx={7} fill={color} transform="rotate(-14 -24 -5)" />
      <rect x={16} y={-16} width={16} height={22} rx={7} fill={color} transform="rotate(14 24 -5)" />
      <path d="M -18 -20 L -6 -26 Q 0 -20 6 -26 L 18 -20 L 18 12 Q 18 26 0 26 Q -18 26 -18 12 Z" fill={color} />
      <Star cx={-7} cy={-2} r={5} color={star} />
      <Star cx={7} cy={10} r={4} color={star} />
      <Star cx={0} cy={-10} r={3.5} color={star} />
    </g>
  )
}

/* ------------------------------ weather parts ------------------------------ */

function SunShape({ cx = 50, cy = 46, r = 18, color = SUN, rayColor = SUN_DARK }: { cx?: number; cy?: number; r?: number; color?: string; rayColor?: string }) {
  const rays = []
  for (let i = 0; i < 8; i++) {
    const ang = (Math.PI / 4) * i
    const x1 = cx + Math.cos(ang) * (r + 4)
    const y1 = cy + Math.sin(ang) * (r + 4)
    const x2 = cx + Math.cos(ang) * (r + 13)
    const y2 = cy + Math.sin(ang) * (r + 13)
    rays.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={rayColor} strokeWidth={4} strokeLinecap="round" />)
  }
  return (
    <g>
      {rays}
      <circle cx={cx} cy={cy} r={r} fill={color} />
    </g>
  )
}

function CloudShape({ cx = 50, cy = 46, s = 1, color = WHITE }: { cx?: number; cy?: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-22} y={-2} width={44} height={16} rx={8} fill={color} />
      <circle cx={-10} cy={-6} r={12} fill={color} />
      <circle cx={6} cy={-11} r={15} fill={color} />
      <circle cx={20} cy={-4} r={10} fill={color} />
    </g>
  )
}

function Raindrop({ cx, cy, s = 1, color }: { cx: number; cy: number; s?: number; color: string }) {
  return <path transform={`translate(${cx} ${cy}) scale(${s})`} d="M 0 -8 Q 6 2 0 8 Q -6 2 0 -8 Z" fill={color} />
}

function Snowflake({ cx, cy, r = 6, color = WHITE }: { cx: number; cy: number; r?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={2} strokeLinecap="round">
      {[0, 60, 120].map((deg) => (
        <line key={deg} x1={cx - r} y1={cy} x2={cx + r} y2={cy} transform={`rotate(${deg} ${cx} ${cy})`} />
      ))}
    </g>
  )
}

function WindShape({ cx = 50, cy = 50 }: { cx?: number; cy?: number }) {
  return (
    <g>
      <g stroke={WHITE} strokeWidth={4} strokeLinecap="round" fill="none">
        <path d={`M ${cx - 26} ${cy - 16} Q ${cx - 8} ${cy - 22} ${cx + 14} ${cy - 16}`} />
        <path d={`M ${cx - 26} ${cy} Q ${cx - 4} ${cy - 8} ${cx + 22} ${cy}`} />
        <path d={`M ${cx - 26} ${cy + 16} Q ${cx - 8} ${cy + 8} ${cx + 16} ${cy + 16}`} />
      </g>
      <path d={`M ${cx + 10} ${cy + 10} Q ${cx + 18} ${cy + 2} ${cx + 22} ${cy + 12} Q ${cx + 16} ${cy + 18} ${cx + 10} ${cy + 10} Z`} fill={LEAF} />
    </g>
  )
}

function UmbrellaGlyph({ cx = 0, cy = 0, s = 1, color = CORAL }: { cx?: number; cy?: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <path d="M -12 0 A 12 12 0 0 1 12 0 Z" fill={color} />
      <line x1={0} y1={0} x2={0} y2={13} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M 0 13 Q 4 17 8 13" stroke={INK} strokeWidth={2.5} strokeLinecap="round" fill="none" />
    </g>
  )
}

/** A green check for "it fits / it matches". */
function Check({ cx, cy, r = 11, color = LEAF }: { cx: number; cy: number; r?: number; color?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <path d={`M ${cx - r * 0.5} ${cy} L ${cx - r * 0.1} ${cy + r * 0.4} L ${cx + r * 0.5} ${cy - r * 0.4}`} stroke={WHITE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  )
}

/* ------------------------------ clothes ------------------------------ */

function LaCamisa(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ShirtShape cx={50} cy={52} s={1.15} color={SKY} />
    </ArtFrame>
  )
}

function ElPantalon(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PantsShape cx={50} cy={56} s={1.05} color={SKY_DARK} />
    </ArtFrame>
  )
}

function ElVestido(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <DressShape cx={50} cy={50} s={1} color={CORAL} />
    </ArtFrame>
  )
}

function LosZapatos(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ShoesPair cx={50} cy={58} s={1} color={SEED_LIGHT} sole={SEED} />
    </ArtFrame>
  )
}

function LasMedias(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <SocksPair cx={50} cy={54} s={1} color={SKY} stripe={WHITE} />
    </ArtFrame>
  )
}

function ElPantalonCorto(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ShortsShape cx={50} cy={52} s={1.1} color={LEAF} />
    </ArtFrame>
  )
}

function ElSueter(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <SweaterShape cx={50} cy={50} s={1.05} color={PURPLE} rib={PURPLE_DARK} />
    </ArtFrame>
  )
}

function ElSombrero(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <HatShape cx={50} cy={54} s={1} color={SUN} band={SUN_DARK} />
    </ArtFrame>
  )
}

function LaGorra(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <CapShape cx={50} cy={54} s={1.15} color={CORAL} bill={CORAL_DARK} />
    </ArtFrame>
  )
}

function LaBufanda(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ScarfShape cx={50} cy={44} s={1} color={ROSE} />
    </ArtFrame>
  )
}

function LosGuantes(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <GlovesPair cx={50} cy={52} s={1} color={ROSE} />
    </ArtFrame>
  )
}

function LasBotas(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <BootsPair cx={50} cy={56} s={0.95} color={SEED_LIGHT} sole={SEED} />
    </ArtFrame>
  )
}

function LaChaqueta(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <JacketShape cx={50} cy={50} s={1.05} color={PAPAYA_DARK} />
    </ArtFrame>
  )
}

function LaPijama(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PajamaShape cx={50} cy={50} s={1} color={PURPLE} star={SUN} />
    </ArtFrame>
  )
}

/* ------------------------------ weather ------------------------------ */

function ElSol(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <SunShape cx={50} cy={50} r={20} />
    </ArtFrame>
  )
}

function LaLluvia(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <CloudShape cx={50} cy={36} s={1.1} color={GRAY_DARK} />
      <Raindrop cx={34} cy={66} color={SKY_DARK} />
      <Raindrop cx={50} cy={74} color={SKY_DARK} />
      <Raindrop cx={66} cy={66} color={SKY_DARK} />
    </ArtFrame>
  )
}

function ElViento(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <WindShape cx={48} cy={50} />
    </ArtFrame>
  )
}

function LaNube(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <CloudShape cx={50} cy={52} s={1.3} color={WHITE} />
    </ArtFrame>
  )
}

function Calor(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Kid cx={50} baseY={104} scale={1.3} mood="happy" arms="down" />
      <Raindrop cx={73} cy={24} s={1.1} color={SKY_DARK} />
    </ArtFrame>
  )
}

function Frio(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY_DARK} />
      <Kid cx={50} baseY={106} scale={1.3} mood="sad" arms="hug" />
      <ScarfShape cx={50} cy={70} s={0.5} color={ROSE} />
      <Snowflake cx={22} cy={26} r={5} />
      <Snowflake cx={78} cy={30} r={4} />
    </ArtFrame>
  )
}

function LaNieve(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY_DARK} />
      <Snowflake cx={50} cy={48} r={11} />
      <Snowflake cx={24} cy={30} r={6} />
      <Snowflake cx={76} cy={28} r={6} />
      <Snowflake cx={26} cy={70} r={6} />
      <Snowflake cx={74} cy={72} r={6} />
    </ArtFrame>
  )
}

/* ------------------------------ sentences ------------------------------ */

function HaceCalor(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <SunShape cx={28} cy={26} r={13} />
      <Ground cx={62} cy={90} rx={18} />
      <Kid cx={62} baseY={90} scale={0.85} mood="happy" arms="wave" />
    </ArtFrame>
  )
}

function HaceFrio(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY_DARK} />
      <Ground cx={50} cy={90} rx={18} />
      <Kid cx={50} baseY={90} scale={0.9} mood="sad" arms="hug" />
      <ScarfShape cx={50} cy={58} s={0.42} color={ROSE} />
      <Snowflake cx={18} cy={24} r={5} />
      <Snowflake cx={82} cy={30} r={5} />
      <Snowflake cx={78} cy={64} r={4} />
    </ArtFrame>
  )
}

function EstaLloviendo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <CloudShape cx={50} cy={22} s={0.85} color={GRAY_DARK} />
      <Raindrop cx={22} cy={40} s={0.8} color={SKY_DARK} />
      <Raindrop cx={80} cy={42} s={0.8} color={SKY_DARK} />
      <Ground cx={50} cy={90} rx={18} />
      <Kid cx={50} baseY={90} scale={0.85} mood="happy" arms="down" />
      <UmbrellaGlyph cx={50} cy={54} s={1.7} color={CORAL} />
    </ArtFrame>
  )
}

function PonteElAbrigo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={34} cy={90} rx={16} />
      <Ground cx={72} cy={92} rx={12} />
      <Kid cx={34} baseY={90} scale={1} hair="long" shirt={ROSE} arms="hold" mood="happy">
        <ShirtShape cx={0} cy={0} s={0.5} color={PAPAYA_DARK} />
      </Kid>
      <Kid cx={72} baseY={92} scale={0.62} mood="happy" arms="down" />
    </ArtFrame>
  )
}

function NecesitoUnParaguas(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Raindrop cx={16} cy={30} s={0.7} color={SKY_DARK} />
      <Raindrop cx={84} cy={26} s={0.7} color={SKY_DARK} />
      <Ground cx={38} cy={90} rx={16} />
      <Kid cx={38} baseY={90} scale={0.9} mood="happy" arms="up" />
      <Bubble x={54} y={10} w={38} h={34} fill={WHITE} tail="left">
        <BigText text="?" size={16} x={-10} />
        <UmbrellaGlyph cx={7} cy={0} s={0.85} />
      </Bubble>
    </ArtFrame>
  )
}

function QueTeVasAPoner(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ShirtShape cx={26} cy={30} s={0.55} color={SKY} />
      <DressShape cx={74} cy={30} s={0.5} color={CORAL} />
      <Bubble x={36} y={6} w={28} h={22} fill={WHITE} tail="none">
        <BigText text="?" size={14} />
      </Bubble>
      <Ground cx={50} cy={90} rx={16} />
      <Kid cx={50} baseY={90} scale={0.85} mood="happy" arms="up" />
    </ArtFrame>
  )
}

function HaceSol(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <SunShape cx={26} cy={26} r={13} />
      <Ground cx={64} cy={90} rx={18} />
      <Kid cx={64} baseY={90} scale={0.85} mood="happy" arms="down" />
      <CapShape cx={64} cy={33} s={0.5} color={CORAL} bill={CORAL_DARK} />
    </ArtFrame>
  )
}

function MePongo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={92} rx={18} />
      <Kid cx={50} baseY={92} scale={0.95} mood="happy" arms="up" />
      <ShirtShape cx={50} cy={26} s={0.8} color={LEAF} />
    </ArtFrame>
  )
}

function MeQuedaBien(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={44} cy={92} rx={18} />
      <Kid cx={44} baseY={92} scale={1} mood="excited" arms="up" shirt={SKY} />
      <Check cx={78} cy={28} />
    </ArtFrame>
  )
}

function MeQuedaGrande(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={92} rx={22} />
      <ShirtShape cx={50} cy={48} s={1.7} color={CORAL} />
      <Kid cx={50} baseY={94} scale={0.55} mood="happy" arms="down" />
    </ArtFrame>
  )
}

function MeQuedaPequeno(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={92} rx={18} />
      <Kid cx={50} baseY={92} scale={1.05} mood="mad" arms="up" />
      <ShirtShape cx={50} cy={62} s={0.5} color={SKY} />
    </ArtFrame>
  )
}

function TeGusta(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={40} cy={92} rx={16} />
      <Kid cx={40} baseY={92} scale={0.9} mood="happy" arms="hold">
        <DressShape cx={0} cy={0} s={0.38} color={ROSE} />
      </Kid>
      <Bubble x={58} y={8} w={30} h={22} fill={WHITE} tail="none">
        <BigText text="?" size={14} />
      </Bubble>
      <Heart cx={80} cy={54} s={16} />
    </ArtFrame>
  )
}

function CombinaBien(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ShirtShape cx={32} cy={54} s={0.85} color={SKY} />
      <PantsShape cx={68} cy={58} s={0.85} color={SKY_DARK} />
      <Check cx={50} cy={20} r={10} />
    </ArtFrame>
  )
}

function QueRopaQuieresUsar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ShirtShape cx={22} cy={58} s={0.55} color={SKY} />
      <PantsShape cx={22} cy={78} s={0.4} color={SKY_DARK} />
      <DressShape cx={78} cy={62} s={0.55} color={CORAL} />
      <Bubble x={36} y={6} w={28} h={22} fill={WHITE} tail="none">
        <BigText text="?" size={14} />
      </Bubble>
    </ArtFrame>
  )
}

/* ------------------------------ export map ------------------------------ */

export const U7_ART: Record<string, ComponentType<WordArtProps>> = {
  'la-camisa': LaCamisa,
  'el-pantalon': ElPantalon,
  'el-vestido': ElVestido,
  'los-zapatos': LosZapatos,
  'las-medias': LasMedias,
  'el-pantalon-corto': ElPantalonCorto,
  'el-sueter': ElSueter,
  'el-sombrero': ElSombrero,
  'la-gorra': LaGorra,
  'la-bufanda': LaBufanda,
  'los-guantes': LosGuantes,
  'las-botas': LasBotas,
  'la-chaqueta': LaChaqueta,
  'la-pijama': LaPijama,
  'el-sol': ElSol,
  'la-lluvia': LaLluvia,
  'el-viento': ElViento,
  'la-nube': LaNube,
  calor: Calor,
  frio: Frio,
  'la-nieve': LaNieve,
  'hace-calor': HaceCalor,
  'hace-frio': HaceFrio,
  'esta-lloviendo': EstaLloviendo,
  'ponte-el-abrigo': PonteElAbrigo,
  'necesito-un-paraguas': NecesitoUnParaguas,
  'que-te-vas-a-poner': QueTeVasAPoner,
  'hace-sol': HaceSol,
  'me-pongo': MePongo,
  'me-queda-bien': MeQuedaBien,
  'me-queda-grande': MeQuedaGrande,
  'me-queda-pequeno': MeQuedaPequeno,
  'te-gusta': TeGusta,
  'combina-bien': CombinaBien,
  'que-ropa-quieres-usar': QueRopaQuieresUsar,
}
