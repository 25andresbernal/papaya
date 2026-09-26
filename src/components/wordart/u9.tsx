// Unit 9 word art: school things and school verbs.
// Same rules as every other unit (see docs/design/word-art.md): flat shapes,
// one Tile per picture, people are always <Kid/>.

import type { ComponentType } from 'react'
import { Lapiz } from './examples'
import {
  ArtFrame,
  Tile,
  Ground,
  Kid,
  Bubble,
  Zoom,
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
  ROSE,
  PURPLE,
  CREAM_DARK,
  SEED,
  SEED_LIGHT,
  WHITE,
  GRAY,
  GRAY_DARK,
  SKIN,
} from './primitives'
import type { WordArtProps } from './primitives'

/** One crayon, standing on its tip, leaning a little. */
function Crayon({ cx, color, dark, rotate = 0 }: { cx: number; color: string; dark: string; rotate?: number }) {
  return (
    <g transform={`translate(${cx} 60) rotate(${rotate})`}>
      <rect x={-8} y={-28} width={16} height={40} rx={4} fill={color} />
      <path d={`M -8 -28 L 0 -40 L 8 -28 Z`} fill={color} />
      <rect x={-8} y={-4} width={16} height={8} fill={dark} opacity={0.55} />
    </g>
  )
}

/** A little music note: a dot with a stem. */
function Note({ x, y, color = PURPLE }: { x: number; y: number; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill={color} />
      <line x1={x + 3.5} y1={y - 1} x2={x + 3.5} y2={y - 16} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  )
}

/* ------------------------------ school things ------------------------------ */

function Cuaderno(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={50} cy={88} rx={26} />
      <rect x={22} y={16} width={56} height={68} rx={6} fill={WHITE} />
      <rect x={22} y={16} width={12} height={68} rx={5} fill={CREAM_DARK} />
      {[24, 34, 44, 54, 64, 74].map((y) => (
        <circle key={y} cx={28} cy={y} r={2.6} fill={SEED_LIGHT} />
      ))}
      <rect x={42} y={30} width={28} height={5} rx={2.5} fill={SKY} opacity={0.5} />
      <rect x={42} y={44} width={28} height={5} rx={2.5} fill={SKY} opacity={0.5} />
      <rect x={42} y={58} width={20} height={5} rx={2.5} fill={SKY} opacity={0.5} />
    </ArtFrame>
  )
}

function Mochila(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={24} />
      <rect x={26} y={30} width={48} height={50} rx={16} fill={PAPAYA} />
      <rect x={36} y={54} width={28} height={22} rx={10} fill={PAPAYA_DARK} />
      <rect x={30} y={22} width={40} height={18} rx={10} fill={PAPAYA_DARK} />
      <rect x={34} y={12} width={8} height={22} rx={4} fill={SEED_LIGHT} />
      <rect x={58} y={12} width={8} height={22} rx={4} fill={SEED_LIGHT} />
      <circle cx={50} cy={64} r={4} fill={SUN} />
    </ArtFrame>
  )
}

function Tijeras(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <g transform="translate(50 50)">
        <path d="M -6 -4 L 30 -30" stroke={GRAY} strokeWidth={6} strokeLinecap="round" />
        <path d="M -6 4 L 30 30" stroke={GRAY} strokeWidth={6} strokeLinecap="round" />
        <circle cx={-6} cy={0} r={4} fill={SEED} />
        <path d="M -6 -4 L -22 -16" stroke={CORAL} strokeWidth={7} strokeLinecap="round" />
        <path d="M -6 4 L -22 16" stroke={SKY} strokeWidth={7} strokeLinecap="round" />
        <circle cx={-26} cy={-16} r={8} fill="none" stroke={CORAL} strokeWidth={5} />
        <circle cx={-26} cy={16} r={8} fill="none" stroke={SKY} strokeWidth={5} />
      </g>
    </ArtFrame>
  )
}

function Borrador(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={50} cy={82} rx={22} />
      <rect x={20} y={52} width={60} height={28} rx={7} fill={CORAL} />
      <rect x={20} y={52} width={60} height={9} rx={4.5} fill={WHITE} opacity={0.35} />
      <rect x={20} y={71} width={60} height={9} rx={4.5} fill="#E04E4E" />
    </ArtFrame>
  )
}

function Colores(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={30} />
      <Crayon cx={30} color={SUN} dark={SUN_DARK} rotate={-8} />
      <Crayon cx={50} color={LEAF} dark={LEAF_DARK} rotate={0} />
      <Crayon cx={70} color={SKY} dark={SKY_DARK} rotate={8} />
    </ArtFrame>
  )
}

function Maestra(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={22} />
      <Kid cx={48} baseY={90} hair="bun" hairColor={SEED} shirt={LEAF} pants={SEED_LIGHT} glasses arms="hold" mood="happy">
        <rect x={0} y={-6} width={30} height={3} rx={1.5} fill={SEED_LIGHT} />
      </Kid>
    </ArtFrame>
  )
}

function Amigo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Ground cx={50} cy={88} rx={28} />
      <Kid cx={38} baseY={88} scale={0.85} hair="short" shirt={SKY} arms="hug" mood="happy" />
      <Kid cx={62} baseY={88} scale={0.85} hair="curly" shirt={CORAL} arms="hug" mood="happy" />
    </ArtFrame>
  )
}

function Clase(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <rect x={20} y={14} width={60} height={24} rx={4} fill={SEED} />
      <rect x={28} y={21} width={20} height={4} rx={2} fill={WHITE} opacity={0.85} />
      <rect x={28} y={29} width={30} height={4} rx={2} fill={WHITE} opacity={0.85} />
      <rect x={14} y={72} width={22} height={8} rx={2} fill={SEED_LIGHT} />
      <rect x={39} y={72} width={22} height={8} rx={2} fill={SEED_LIGHT} />
      <rect x={64} y={72} width={22} height={8} rx={2} fill={SEED_LIGHT} />
      <Kid cx={25} baseY={72} scale={0.5} pose="sit" hair="short" shirt={SKY} />
      <Kid cx={50} baseY={72} scale={0.5} pose="sit" hair="curly" shirt={CORAL} />
      <Kid cx={75} baseY={72} scale={0.5} pose="sit" hair="long" shirt={LEAF} />
    </ArtFrame>
  )
}

function Recreo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Ground cx={42} cy={90} rx={20} />
      <Kid cx={40} baseY={90} pose="jump" arms="up" hair="short" shirt={SKY} mood="excited" />
      <circle cx={72} cy={58} r={11} fill={PAPAYA} />
      <path d="M 72 47 L 72 69 M 61 58 L 83 58" stroke={PAPAYA_DARK} strokeWidth={2.5} strokeLinecap="round" />
    </ArtFrame>
  )
}

function Tarea(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <rect x={22} y={18} width={52} height={64} rx={6} fill={WHITE} />
      <rect x={22} y={18} width={10} height={64} rx={5} fill={SKY} />
      <rect x={40} y={32} width={26} height={5} rx={2.5} fill={GRAY} />
      <rect x={40} y={44} width={26} height={5} rx={2.5} fill={GRAY} />
      <path d="M 40 60 L 48 68 L 64 50" stroke={LEAF} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g transform="rotate(-38 70 76)">
        <rect x={56} y={72} width={30} height={8} rx={2} fill={SUN} />
        <path d="M 86 72 L 94 76 L 86 80 Z" fill="#E8C39E" />
      </g>
    </ArtFrame>
  )
}

function BusEscolar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={50} cy={84} rx={30} />
      <rect x={14} y={36} width={72} height={36} rx={10} fill={SUN} />
      <rect x={14} y={36} width={72} height={10} rx={5} fill={SUN_DARK} />
      <rect x={21} y={48} width={13} height={12} rx={3} fill={SKY} />
      <rect x={38} y={48} width={13} height={12} rx={3} fill={SKY} />
      <rect x={55} y={48} width={13} height={12} rx={3} fill={SKY} />
      <rect x={72} y={48} width={10} height={12} rx={3} fill={SKY} />
      <rect x={14} y={62} width={72} height={6} fill={SEED_LIGHT} />
      <circle cx={30} cy={76} r={8} fill={SEED} />
      <circle cx={70} cy={76} r={8} fill={SEED} />
      <circle cx={30} cy={76} r={3} fill={GRAY} />
      <circle cx={70} cy={76} r={3} fill={GRAY} />
    </ArtFrame>
  )
}

/* ------------------------------ verbs ------------------------------ */

function Caminar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={22} />
      <Kid cx={54} baseY={90} hair="short" shirt={LEAF} arms="down" pose="stand" mood="happy" />
      <Zoom x={26} y={72} />
    </ArtFrame>
  )
}

function Bailar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={ROSE} />
      <Ground cx={44} cy={90} rx={20} />
      <Kid cx={44} baseY={90} pose="jump" arms="up" hair="curly" shirt={SUN} mood="excited" />
      <Note x={72} y={26} color={PURPLE} />
      <Note x={82} y={40} color={PAPAYA_DARK} />
    </ArtFrame>
  )
}

function Subir(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <rect x={12} y={78} width={22} height={10} fill={SEED_LIGHT} />
      <rect x={28} y={66} width={22} height={22} fill={SEED_LIGHT} />
      <rect x={44} y={54} width={22} height={34} fill={SEED_LIGHT} />
      <rect x={60} y={42} width={26} height={46} fill={SEED_LIGHT} />
      <Kid cx={65} baseY={54} scale={0.7} arms="up" hair="short" shirt={CORAL} mood="excited" />
    </ArtFrame>
  )
}

function Comer(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={22} />
      <Kid cx={40} baseY={90} arms="hold" hair="short" shirt={SUN} mood="happy">
        <path d="M 0 -4 L 15 -15" stroke={SEED_LIGHT} strokeWidth={3} strokeLinecap="round" />
        <ellipse cx={17} cy={-17} rx={5} ry={3.5} fill={GRAY} />
      </Kid>
      <path d="M 58 78 Q 58 92 74 92 Q 90 92 90 78 Z" fill={SKY} />
      <ellipse cx={74} cy={78} rx={16} ry={4} fill={SKY_DARK} />
    </ArtFrame>
  )
}

function Beber(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={50} cy={90} rx={22} />
      <Kid cx={48} baseY={90} arms="hold" hair="long" shirt={ROSE} mood="happy">
        <path d="M -7 -14 L -9 10 L 9 10 L 7 -14 Z" fill={WHITE} />
        <rect x={-8} y={-2} width={16} height={11} fill={SKY} />
      </Kid>
    </ArtFrame>
  )
}

function Jugar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={90} rx={22} />
      <Kid cx={40} baseY={90} arms="hold" hair="short" shirt={SUN} mood="excited">
        <circle cx={15} cy={-4} r={10} fill={PAPAYA} />
        <path d="M 15 -14 L 15 6 M 5 -4 L 25 -4" stroke={PAPAYA_DARK} strokeWidth={2} />
      </Kid>
    </ArtFrame>
  )
}

function Leer(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={24} />
      <Kid cx={50} baseY={88} pose="sit" hair="curly" shirt={SKY} mood="happy" />
      <path d="M 30 76 L 50 70 L 70 76 L 70 84 L 50 78 L 30 84 Z" fill={WHITE} />
      <line x1={50} y1={70} x2={50} y2={78} stroke={GRAY} strokeWidth={2} />
    </ArtFrame>
  )
}

function Escribir(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={22} />
      <Kid cx={38} baseY={90} arms="hold" hair="short" shirt={LEAF} mood="happy">
        <rect x={2} y={-15} width={22} height={5} rx={2.5} fill={SUN} />
        <path d="M 24 -15 L 31 -12.5 L 24 -10 Z" fill={INK} />
      </Kid>
      <rect x={54} y={64} width={30} height={20} rx={2} fill={WHITE} />
      <line x1={58} y1={70} x2={80} y2={70} stroke={GRAY} strokeWidth={2} />
      <line x1={58} y1={77} x2={74} y2={77} stroke={GRAY} strokeWidth={2} />
    </ArtFrame>
  )
}

function Dibujar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={22} />
      <Kid cx={36} baseY={90} arms="hold" hair="curly" shirt={CORAL} mood="happy">
        <rect x={2} y={-17} width={6} height={18} rx={2} fill={SUN} />
      </Kid>
      <rect x={52} y={58} width={34} height={28} rx={3} fill={WHITE} />
      <circle cx={69} cy={72} r={6} fill={SUN} />
      <line x1={69} y1={62} x2={69} y2={58} stroke={SUN_DARK} strokeWidth={2} strokeLinecap="round" />
      <line x1={69} y1={86} x2={69} y2={82} stroke={SUN_DARK} strokeWidth={2} strokeLinecap="round" />
      <line x1={59} y1={72} x2={55} y2={72} stroke={SUN_DARK} strokeWidth={2} strokeLinecap="round" />
      <line x1={79} y1={72} x2={83} y2={72} stroke={SUN_DARK} strokeWidth={2} strokeLinecap="round" />
    </ArtFrame>
  )
}

function Mirar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={50} cy={90} rx={22} />
      <Kid cx={42} baseY={90} hair="short" shirt={LEAF} mood="happy" />
      <ellipse cx={36} cy={30} rx={7} ry={3.5} fill={SKIN} transform="rotate(-12 36 30)" />
      <ellipse cx={78} cy={26} rx={9} ry={6} fill={WHITE} />
      <circle cx={78} cy={26} r={3.5} fill={INK} />
    </ArtFrame>
  )
}

function Escuchar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={ROSE} />
      <Ground cx={54} cy={90} rx={22} />
      <Kid cx={58} baseY={90} hair="short" shirt={SKY} mood="happy" />
      <circle cx={40} cy={34} r={6} fill={SKIN} />
      <path d="M 26 26 Q 18 34 26 42" stroke={INK_SOFT} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M 20 20 Q 8 34 20 48" stroke={INK_SOFT} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </ArtFrame>
  )
}

function Hablar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={90} rx={20} />
      <Kid cx={38} baseY={90} hair="short" shirt={PAPAYA} mood="happy" arms="point" />
      <Bubble x={54} y={12} w={36} h={26} fill={WHITE} tail="left">
        <circle cx={-8} cy={0} r={3} fill={INK_SOFT} />
        <circle cx={0} cy={0} r={3} fill={INK_SOFT} />
        <circle cx={8} cy={0} r={3} fill={INK_SOFT} />
      </Bubble>
    </ArtFrame>
  )
}

function Ayudar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Ground cx={48} cy={90} rx={28} />
      <Kid cx={32} baseY={90} hair="short" shirt={LEAF} arms="point" mood="happy" />
      <Kid cx={68} baseY={92} scale={0.65} hair="curly" shirt={SKY} arms="up" pose="sit" mood="happy" />
      <line x1={59} y1={53} x2={68} y2={59} stroke={SKIN} strokeWidth={5} strokeLinecap="round" />
    </ArtFrame>
  )
}

function Aprender(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={PURPLE} />
      <Ground cx={38} cy={90} rx={20} />
      <Kid cx={38} baseY={90} hair="curly" shirt={SUN} mood="excited" />
      <Bubble x={54} y={10} w={34} h={32} fill={WHITE} tail="left">
        <circle cx={0} cy={-4} r={8} fill={SUN} />
        <rect x={-4} y={5} width={8} height={5} rx={2} fill={GRAY_DARK} />
      </Bubble>
    </ArtFrame>
  )
}

function Compartir(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={50} cy={90} rx={28} />
      <Kid cx={32} baseY={90} scale={0.85} hair="short" shirt={SKY} arms="hold" mood="happy" />
      <Kid cx={68} baseY={90} scale={0.85} hair="long" shirt={ROSE} arms="hold" mood="happy" />
      <circle cx={50} cy={62} r={8} fill={CORAL} />
      <path d="M 50 54 Q 52 50 56 52" stroke={LEAF_DARK} strokeWidth={2} fill="none" strokeLinecap="round" />
    </ArtFrame>
  )
}

export const U9_ART: Record<string, ComponentType<WordArtProps>> = {
  'el-lapiz': Lapiz,
  'el-cuaderno': Cuaderno,
  'la-mochila': Mochila,
  'las-tijeras': Tijeras,
  'el-borrador': Borrador,
  'los-colores': Colores,
  'la-maestra-el-maestro': Maestra,
  'el-amigo-la-amiga': Amigo,
  'la-clase': Clase,
  'el-recreo': Recreo,
  'la-tarea': Tarea,
  'el-bus-escolar': BusEscolar,
  caminar: Caminar,
  bailar: Bailar,
  subir: Subir,
  comer: Comer,
  'beber-tomar': Beber,
  jugar: Jugar,
  leer: Leer,
  escribir: Escribir,
  dibujar: Dibujar,
  mirar: Mirar,
  escuchar: Escuchar,
  hablar: Hablar,
  ayudar: Ayudar,
  aprender: Aprender,
  compartir: Compartir,
}
