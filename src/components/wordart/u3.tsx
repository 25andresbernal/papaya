// Unit 3 word art: colors, shapes, size and speed words, and the little
// phrases a kid uses to talk about all of it ("I like ___", "which do you
// prefer?"). See docs/design/word-art.md for the rules these follow.

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
  Highlight,
  Zoom,
  Sparkles,
  INK,
  PAPAYA,
  PAPAYA_DARK,
  LEAF,
  SKY,
  SKY_DARK,
  SUN,
  CORAL,
  CORAL_DARK,
  ROSE,
  PURPLE,
  CREAM,
  CREAM_DARK,
  SEED_LIGHT,
  WHITE,
  GRAY,
} from './primitives'
import type { WordArtProps } from './primitives'

/* --------------------------- shared bits --------------------------- */

/** A round blob of paint with a couple of splat bumps and a shine dot. */
function PaintBlob({
  color,
  shine = WHITE,
  cx = 50,
  cy = 55,
}: {
  color: string
  shine?: string
  cx?: number
  cy?: number
}) {
  return (
    <g>
      <circle cx={cx} cy={cy + 2} r={25} fill={color} />
      <circle cx={cx - 22} cy={cy - 14} r={11} fill={color} />
      <circle cx={cx + 21} cy={cy - 9} r={9} fill={color} />
      <circle cx={cx - 8} cy={cy + 25} r={8} fill={color} />
      <ellipse cx={cx - 9} cy={cy - 7} rx={5} ry={3.5} fill={shine} opacity={0.85} />
    </g>
  )
}

/** A small plain paint dot, for pictures that show more than one color. */
function SmallBlob({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={15} fill={color} />
      <circle cx={cx - 9} cy={cy - 8} r={6} fill={color} />
      <ellipse cx={cx - 4} cy={cy - 4} rx={2.5} ry={1.8} fill={WHITE} opacity={0.85} />
    </g>
  )
}

/** A round red apple with a stem and one leaf. */
function Apple({ cx, cy, r = 12 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={CORAL_DARK} />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy - r - 5} stroke={SEED_LIGHT} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M ${cx} ${cy - r - 4} q 6 -4 7 2 q -6 3 -7 -2 Z`} fill={LEAF} />
    </g>
  )
}

/** A plain gold circle, for pile pictures that do not need the full apple. */
function PileApple({ cx, cy, r = 12 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={CORAL_DARK} />
}

/** A curved yellow banana, standing on its end like a little smile. */
function Banana({ cx = 76, cy = 58 }: { cx?: number; cy?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(-10)`}>
      <path
        d="M -8 26 Q -20 10 -12 -10 Q -6 -24 6 -28 Q 14 -30 12 -24 Q 4 -20 0 -8 Q -6 8 2 24 Q 4 30 -8 26 Z"
        fill={SUN}
      />
      <ellipse cx={9} cy={-27} rx={3} ry={2.4} fill={SEED_LIGHT} />
    </g>
  )
}

/* -------------------------------- colors -------------------------------- */

export function Rojo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={CORAL_DARK} />
    </ArtFrame>
  )
}

export function Azul(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={SKY_DARK} />
    </ArtFrame>
  )
}

export function Amarillo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={SUN} />
    </ArtFrame>
  )
}

export function Verde(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={LEAF} />
    </ArtFrame>
  )
}

export function Naranja(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={PAPAYA} />
    </ArtFrame>
  )
}

export function Morado(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={PURPLE} />
    </ArtFrame>
  )
}

export function Celeste(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={SKY} />
    </ArtFrame>
  )
}

export function Rosado(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={ROSE} />
    </ArtFrame>
  )
}

export function Cafe(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={SEED_LIGHT} />
    </ArtFrame>
  )
}

export function Negro(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={INK} />
    </ArtFrame>
  )
}

export function Blanco(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <PaintBlob color={WHITE} shine={GRAY} />
    </ArtFrame>
  )
}

export function Gris(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={GRAY} />
    </ArtFrame>
  )
}

export function Dorado(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={SUN} />
      <Sparkles cx={50} cy={22} />
    </ArtFrame>
  )
}

export function Plateado(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={GRAY} />
      <Sparkles cx={50} cy={22} />
    </ArtFrame>
  )
}

/* -------------------------------- shapes -------------------------------- */

export function ElCirculo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <circle cx={50} cy={50} r={32} fill={PAPAYA} />
    </ArtFrame>
  )
}

export function ElCuadrado(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <rect x={22} y={22} width={56} height={56} rx={6} fill={SKY_DARK} />
    </ArtFrame>
  )
}

export function ElTriangulo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <polygon points="50,18 80,76 20,76" fill={LEAF} />
    </ArtFrame>
  )
}

export function LaEstrella(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Star cx={50} cy={50} r={32} color={SUN} />
    </ArtFrame>
  )
}

export function ElCorazon(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Heart cx={50} cy={52} s={46} color={CORAL} />
    </ArtFrame>
  )
}

export function ElRectangulo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <rect x={14} y={34} width={72} height={34} rx={8} fill={PURPLE} />
    </ArtFrame>
  )
}

export function ElOvalo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <ellipse cx={50} cy={50} rx={36} ry={22} fill={ROSE} />
    </ArtFrame>
  )
}

/* --------------------------- size and speed --------------------------- */

export function Grande(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={82} rx={22} />
      <Ground cx={78} cy={88} rx={9} />
      <circle cx={38} cy={56} r={24} fill={PAPAYA} />
      <circle cx={78} cy={78} r={10} fill={SKY_DARK} />
      <Highlight cx={38} cy={56} r={30} color={SUN} />
    </ArtFrame>
  )
}

export function Pequeno(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={82} rx={22} />
      <Ground cx={78} cy={88} rx={9} />
      <circle cx={38} cy={56} r={24} fill={PAPAYA} />
      <circle cx={78} cy={78} r={10} fill={SKY_DARK} />
      <Highlight cx={78} cy={78} r={16} color={SUN} />
    </ArtFrame>
  )
}

export function Alto(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={32} cy={90} rx={18} />
      <Ground cx={72} cy={90} rx={14} />
      <Kid cx={32} baseY={90} scale={1.1} hair="short" shirt={SKY} mood="happy" />
      <Kid cx={72} baseY={90} scale={0.7} hair="short" shirt={LEAF} mood="happy" />
      <Highlight cx={32} cy={31} r={20} color={SUN} />
    </ArtFrame>
  )
}

export function Bajo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={32} cy={90} rx={18} />
      <Ground cx={72} cy={90} rx={14} />
      <Kid cx={32} baseY={90} scale={1.1} hair="short" shirt={SKY} mood="happy" />
      <Kid cx={72} baseY={90} scale={0.7} hair="short" shirt={LEAF} mood="happy" />
      <Highlight cx={72} cy={52} r={14} color={SUN} />
    </ArtFrame>
  )
}

export function Mucho(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={84} rx={30} />
      <PileApple cx={30} cy={64} r={12} />
      <PileApple cx={54} cy={62} r={13} />
      <PileApple cx={72} cy={66} r={11} />
      <PileApple cx={40} cy={44} r={12} />
      <PileApple cx={62} cy={44} r={11} />
      <PileApple cx={50} cy={26} r={11} />
      <path d="M 50 15 q 6 -4 7 2 q -6 3 -7 -2 Z" fill={LEAF} />
    </ArtFrame>
  )
}

export function Poco(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={80} rx={20} />
      <Apple cx={50} cy={52} r={26} />
    </ArtFrame>
  )
}

export function Rapido(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={58} cy={90} rx={22} />
      <Zoom x={28} y={46} />
      <Zoom x={22} y={62} />
      <Kid cx={58} baseY={88} scale={1.05} hair="short" shirt={SKY} mood="excited" pose="run" />
    </ArtFrame>
  )
}

export function Lento(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={40} cy={86} rx={28} />
      {/* body, low and flat, crawling to the right */}
      <path d="M 16 80 Q 16 64 34 64 Q 52 64 56 74 Q 60 82 52 84 L 22 84 Q 14 84 16 80 Z" fill={SEED_LIGHT} />
      <circle cx={54} cy={72} r={7} fill={SEED_LIGHT} />
      <path d="M 56 66 Q 60 54 64 50" stroke={SEED_LIGHT} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M 50 66 Q 50 54 48 48" stroke={SEED_LIGHT} strokeWidth={3} strokeLinecap="round" fill="none" />
      <circle cx={64} cy={49} r={2.5} fill={INK} />
      <circle cx={48} cy={47} r={2.5} fill={INK} />
      {/* spiral shell, riding on the back */}
      <circle cx={36} cy={46} r={20} fill={PAPAYA} />
      <circle cx={36} cy={46} r={13} fill={CREAM} />
      <circle cx={36} cy={46} r={6} fill={PAPAYA_DARK} />
    </ArtFrame>
  )
}

/* -------------------------------- phrases -------------------------------- */

export function MeGusta(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={42} cy={90} rx={20} />
      <Kid cx={42} baseY={90} scale={0.95} hair="short" shirt={SUN} mood="happy" arms="hug" />
      <Bubble x={54} y={10} w={36} h={30} fill={WHITE} tail="left">
        <Heart cx={0} cy={0} s={16} color={CORAL} />
      </Bubble>
    </ArtFrame>
  )
}

export function ElColor(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <SmallBlob cx={26} cy={60} color={CORAL_DARK} />
      <SmallBlob cx={50} cy={68} color={SKY_DARK} />
      <SmallBlob cx={74} cy={60} color={SUN} />
    </ArtFrame>
  )
}

export function DeQueColorEs(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <PaintBlob color={PURPLE} cx={42} cy={62} />
      <Bubble x={54} y={10} w={34} h={30} fill={WHITE} tail="left">
        <BigText text="?" size={20} />
      </Bubble>
    </ArtFrame>
  )
}

export function MiFavorito(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={46} cy={90} rx={22} />
      <Star cx={52} cy={66} r={14} color={SUN} />
      <Kid cx={42} baseY={90} scale={1} hair="short" shirt={LEAF} mood="excited" arms="hug" />
    </ArtFrame>
  )
}

export function Igual(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <circle cx={26} cy={50} r={16} fill={SKY_DARK} />
      <circle cx={74} cy={50} r={16} fill={SKY_DARK} />
      <BigText text="=" size={26} x={50} y={52} />
    </ArtFrame>
  )
}

export function Diferente(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <circle cx={24} cy={54} r={15} fill={SKY_DARK} />
      <polygon points="74,36 88,62 60,62" fill={LEAF} />
      <BigText text="≠" size={20} x={50} y={50} />
    </ArtFrame>
  )
}

export function CualPrefieres(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={20} />
      <Apple cx={20} cy={70} r={11} />
      <Banana cx={82} cy={62} />
      <Kid cx={50} baseY={90} scale={0.85} hair="short" shirt={SKY} mood="happy" />
      <Bubble x={58} y={8} w={30} h={24} fill={WHITE} tail="left">
        <BigText text="?" size={16} />
      </Bubble>
    </ArtFrame>
  )
}

/* --------------------------------- export -------------------------------- */

export const U3_ART: Record<string, ComponentType<WordArtProps>> = {
  rojo: Rojo,
  azul: Azul,
  amarillo: Amarillo,
  verde: Verde,
  naranja: Naranja,
  morado: Morado,
  celeste: Celeste,
  rosado: Rosado,
  cafe: Cafe,
  negro: Negro,
  blanco: Blanco,
  gris: Gris,
  dorado: Dorado,
  plateado: Plateado,
  'el-circulo': ElCirculo,
  'el-cuadrado': ElCuadrado,
  'el-triangulo': ElTriangulo,
  'la-estrella': LaEstrella,
  'el-corazon': ElCorazon,
  'el-rectangulo': ElRectangulo,
  'el-ovalo': ElOvalo,
  grande: Grande,
  pequeno: Pequeno,
  alto: Alto,
  bajo: Bajo,
  mucho: Mucho,
  poco: Poco,
  rapido: Rapido,
  lento: Lento,
  'me-gusta': MeGusta,
  'el-color': ElColor,
  'de-que-color-es': DeQueColorEs,
  'mi-favorito': MiFavorito,
  igual: Igual,
  diferente: Diferente,
  'cual-prefieres': CualPrefieres,
}
