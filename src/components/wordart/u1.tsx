// Unit 1: greetings and family.
// One small picture per word. See docs/design/word-art.md for the rules.
// Four words (hola, mamá, feliz) are the shared reference pictures — we just reuse them.

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
  CREAM_DARK,
  SUN,
  SUN_DARK,
  SKY,
  SKY_DARK,
  LEAF,
  PAPAYA,
  PAPAYA_DARK,
  CORAL,
  CORAL_DARK,
  ROSE,
  PURPLE,
  PURPLE_DARK,
  SEED,
  SEED_LIGHT,
  WHITE,
  GRAY,
  SKIN,
} from './primitives'
import type { WordArtProps } from './primitives'
import { Hola, Mama, Feliz } from './examples'
import { Zzz } from '../buddies/rig'

/* --------------------------- tiny glyphs for bubbles --------------------------- */
// These are not exported. They only draw a small shape at (0,0), the center
// a <Bubble/> already moves its children to.

function SunGlyph() {
  const rays = [0, 60, 120, 180, 240, 300].map((a) => {
    const rad = (a * Math.PI) / 180
    const x1 = Math.cos(rad) * 8
    const y1 = Math.sin(rad) * 8
    const x2 = Math.cos(rad) * 13
    const y2 = Math.sin(rad) * 13
    return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SUN_DARK} strokeWidth={2.5} strokeLinecap="round" />
  })
  return (
    <g>
      {rays}
      <circle r={7} fill={SUN} />
    </g>
  )
}

/** A low, setting sun for "good afternoon". */
function HalfSunGlyph() {
  return (
    <g>
      <line x1={-14} y1={4} x2={14} y2={4} stroke={SUN_DARK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M -8 4 A 8 8 0 0 1 8 4 Z" fill={PAPAYA} />
      <line x1={-4} y1={-10} x2={-4} y2={-14} stroke={SUN_DARK} strokeWidth={2} strokeLinecap="round" />
      <line x1={4} y1={-10} x2={4} y2={-14} stroke={SUN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

/** A pale crescent moon for "good night". Draw a full circle, then "erase" a
 * bite of it with a same-color-as-bubble circle so a crescent sliver is left. */
function MoonGlyph() {
  return (
    <g>
      <circle cx={0} cy={0} r={9} fill={SUN} />
      <circle cx={5} cy={-3} r={8} fill={WHITE} />
    </g>
  )
}

/** A little thumbs-up for "good" (bien). */
function ThumbsUpGlyph() {
  return (
    <g>
      <rect x={-7} y={-4} width={13} height={13} rx={5} fill={SKIN} />
      <rect x={-4} y={-15} width={7} height={11} rx={3.5} fill={SKIN} />
    </g>
  )
}

/* --------------------------------- greetings --------------------------------- */

function Adios(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={60} cy={90} rx={18} />
      <Kid cx={60} baseY={90} scale={0.95} hair="short" shirt={LEAF} mood="happy" arms="wave" />
      <Bubble x={8} y={8} w={40} h={30} fill={WHITE} tail="right">
        <BigText text="¡Adiós!" size={11} />
      </Bubble>
    </ArtFrame>
  )
}

function BuenosDias(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={90} rx={18} />
      <Kid cx={38} baseY={90} scale={0.95} hair="short" shirt={SKY} mood="happy" arms="wave" />
      <Bubble x={50} y={8} w={40} h={32} fill={WHITE} tail="left">
        <SunGlyph />
      </Bubble>
    </ArtFrame>
  )
}

function BuenasTardes(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={90} rx={18} />
      <Kid cx={38} baseY={90} scale={0.95} hair="short" shirt={CORAL} mood="happy" arms="wave" />
      <Bubble x={50} y={8} w={40} h={32} fill={WHITE} tail="left">
        <HalfSunGlyph />
      </Bubble>
    </ArtFrame>
  )
}

function BuenasNoches(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY_DARK} />
      <Star cx={20} cy={18} r={4} color={SUN} />
      <Star cx={78} cy={16} r={3} color={SUN} />
      <Ground cx={38} cy={90} rx={18} />
      <Kid cx={38} baseY={90} scale={0.95} hair="short" shirt={PURPLE} mood="happy" arms="down" />
      <Bubble x={50} y={10} w={38} h={30} fill={WHITE} tail="left">
        <MoonGlyph />
      </Bubble>
    </ArtFrame>
  )
}

function ComoEstas(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={90} rx={18} />
      <Kid cx={38} baseY={90} scale={0.95} hair="short" shirt={LEAF} mood="happy" arms="hips" />
      <Bubble x={50} y={8} w={38} h={32} fill={WHITE} tail="left">
        <BigText text="¿?" size={20} />
      </Bubble>
    </ArtFrame>
  )
}

function Bien(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Ground cx={36} cy={90} rx={18} />
      <Kid cx={36} baseY={90} scale={0.95} hair="short" shirt={SKY_DARK} mood="excited" arms="hips" />
      <Bubble x={50} y={8} w={38} h={32} fill={WHITE} tail="left">
        <ThumbsUpGlyph />
      </Bubble>
    </ArtFrame>
  )
}

function Gracias(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={38} cy={90} rx={18} />
      <Kid cx={38} baseY={90} scale={0.95} hair="short" shirt={ROSE} mood="happy" arms="wave" />
      <Bubble x={50} y={8} w={36} h={30} fill={WHITE} tail="left">
        <Heart cx={0} cy={0} s={16} color={CORAL} />
      </Bubble>
    </ArtFrame>
  )
}

function PorFavor(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={38} cy={90} rx={18} />
      <Kid cx={38} baseY={90} scale={0.95} hair="short" shirt={CORAL} mood="happy" arms="down" />
      <Bubble x={50} y={8} w={36} h={30} fill={WHITE} tail="left">
        <Heart cx={0} cy={0} s={16} color={ROSE} />
      </Bubble>
    </ArtFrame>
  )
}

function DeNada(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Ground cx={38} cy={90} rx={18} />
      <Kid cx={38} baseY={90} scale={0.95} hair="short" shirt={SUN} mood="happy" arms="hips" />
      <Bubble x={50} y={8} w={36} h={30} fill={WHITE} tail="left">
        <Heart cx={0} cy={0} s={16} color={PURPLE} />
      </Bubble>
    </ArtFrame>
  )
}

/* ---------------------------------- family ---------------------------------- */

function Papa(p: WordArtProps) {
  const cx = 50
  const baseY = 88
  const scale = 1.05
  const headCenterY = baseY - 52 * scale
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={cx} cy={88} rx={20} />
      <Kid cx={cx} baseY={baseY} scale={scale} hair="short" hairColor={SEED} shirt={SKY_DARK} pants={SEED_LIGHT} mood="happy" arms="hips" />
      {/* a little chin stubble so he reads as a grown-up */}
      <path d={`M ${cx - 5} ${headCenterY + 12} Q ${cx} ${headCenterY + 16} ${cx + 5} ${headCenterY + 12}`} stroke={SEED_LIGHT} strokeWidth={2.5} strokeLinecap="round" fill="none" />
    </ArtFrame>
  )
}

function Hermano(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={17} />
      <Kid cx={50} baseY={90} scale={0.82} hair="short" hairColor={SEED_LIGHT} shirt={LEAF} mood="happy" arms="wave" />
    </ArtFrame>
  )
}

function Hermana(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={17} />
      <Kid cx={50} baseY={90} scale={0.82} hair="ponytail" hairColor={SEED} shirt={ROSE} mood="happy" arms="wave" />
    </ArtFrame>
  )
}

function Bebe(p: WordArtProps) {
  const cx = 50
  const baseY = 90
  const scale = 0.7
  const mouthY = baseY - 45 * scale
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={cx} cy={90} rx={16} />
      <Kid cx={cx} baseY={baseY} scale={scale} hair="tuft" hairColor={SEED_LIGHT} shirt={SUN} mood="happy" arms="up" />
      {/* pacifier */}
      <circle cx={cx} cy={mouthY + 3} r={3.5} fill={ROSE} />
      <circle cx={cx} cy={mouthY + 3} r={1.6} fill={CREAM_DARK} />
    </ArtFrame>
  )
}

function Abuela(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={20} />
      <Kid cx={50} baseY={88} scale={1.05} hair="bun" hairColor={GRAY} shirt={PURPLE} pants={SEED_LIGHT} mood="happy" arms="down" glasses />
    </ArtFrame>
  )
}

function Abuelo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={20} />
      <Kid cx={50} baseY={88} scale={1.05} hair="bald" shirt={SKY} pants={SEED_LIGHT} mood="happy" arms="down" glasses mustache />
    </ArtFrame>
  )
}

function Familia(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={34} />
      <Kid cx={26} baseY={90} scale={0.58} hair="short" hairColor={SEED} shirt={SKY_DARK} mood="happy" arms="down" />
      <Kid cx={50} baseY={92} scale={0.62} hair="long" hairColor={SEED} shirt={ROSE} mood="happy" arms="down" />
      <Kid cx={73} baseY={90} scale={0.5} hair="short" hairColor={SEED_LIGHT} shirt={LEAF} mood="happy" arms="wave" />
    </ArtFrame>
  )
}

function Tia(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={20} />
      <Kid cx={50} baseY={88} scale={1.05} hair="long" hairColor={SEED} shirt={PAPAYA} pants={SKY_DARK} mood="happy" arms="down" />
    </ArtFrame>
  )
}

function Tio(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={20} />
      <Kid cx={50} baseY={88} scale={1.05} hair="short" hairColor={SEED} shirt={CORAL} pants={SEED_LIGHT} mood="happy" arms="hips" />
    </ArtFrame>
  )
}

function Primo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={17} />
      <Kid cx={50} baseY={90} scale={0.82} hair="short" hairColor={SEED_LIGHT} shirt={CORAL_DARK} mood="happy" arms="wave" />
    </ArtFrame>
  )
}

function Prima(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={17} />
      <Kid cx={50} baseY={90} scale={0.82} hair="ponytail" hairColor={SEED} shirt={SUN} mood="happy" arms="wave" />
    </ArtFrame>
  )
}

function Amigo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={17} />
      <Kid cx={50} baseY={90} scale={0.85} hair="curly" hairColor={SEED_LIGHT} shirt={SKY} mood="excited" arms="up" />
    </ArtFrame>
  )
}

function Amiga(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={17} />
      <Kid cx={50} baseY={90} scale={0.85} hair="long" hairColor={SEED_LIGHT} shirt={PURPLE_DARK} mood="excited" arms="up" />
    </ArtFrame>
  )
}

function Vecino(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={30} />
      {/* a small house */}
      <polygon points="64,38 88,54 40,54" fill={PAPAYA_DARK} />
      <rect x={46} y={54} width={36} height={30} fill={CREAM_DARK} stroke={SEED_LIGHT} strokeWidth={2} />
      <rect x={60} y={66} width={10} height={18} fill={SEED} />
      <Kid cx={26} baseY={88} scale={0.85} hair="short" shirt={LEAF} mood="happy" arms="wave" />
    </ArtFrame>
  )
}

/* --------------------------------- feelings ---------------------------------- */

function Triste(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Kid cx={50} baseY={118} scale={1.5} hair="short" shirt={PAPAYA} mood="sad" arms="down" />
    </ArtFrame>
  )
}

function Enojado(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CORAL} />
      <Kid cx={50} baseY={118} scale={1.5} hair="short" shirt={SUN} mood="mad" arms="hips" />
    </ArtFrame>
  )
}

function Cansado(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={PURPLE} />
      <Kid cx={46} baseY={118} scale={1.5} hair="short" shirt={SUN} mood="sleepy" arms="down" />
      <Zzz x={74} y={30} />
    </ArtFrame>
  )
}

function ConMiedo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={GRAY} />
      <Kid cx={50} baseY={118} scale={1.5} hair="short" shirt={SKY} mood="sad" arms="up" />
      <ellipse cx={72} cy={30} rx={3} ry={4.5} fill={SKY_DARK} />
    </ArtFrame>
  )
}

function Sorprendido(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={PAPAYA} />
      <Kid cx={50} baseY={118} scale={1.5} hair="short" shirt={SKY} mood="excited" arms="up" />
      <line x1={16} y1={22} x2={24} y2={28} stroke={WHITE} strokeWidth={3} strokeLinecap="round" />
      <line x1={84} y1={22} x2={76} y2={28} stroke={WHITE} strokeWidth={3} strokeLinecap="round" />
    </ArtFrame>
  )
}

function Tranquilo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <Kid cx={50} baseY={118} scale={1.5} hair="short" shirt={SUN} mood="happy" arms="down" />
    </ArtFrame>
  )
}

/* ------------------------------ love and hugs -------------------------------- */

function TeQuiero(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Heart cx={50} cy={52} s={48} color={CORAL} />
      <circle cx={38} cy={38} r={3} fill={WHITE} opacity={0.7} />
    </ArtFrame>
  )
}

function TeAmo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Heart cx={60} cy={54} s={34} color={ROSE} />
      <Heart cx={40} cy={48} s={38} color={CORAL} />
    </ArtFrame>
  )
}

function MiAmor(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={48} cy={90} rx={26} />
      <Kid cx={38} baseY={90} scale={1} hair="long" hairColor={SEED} shirt={ROSE} mood="happy" arms="hug" />
      <Kid cx={60} baseY={92} scale={0.6} hair="short" hairColor={SEED_LIGHT} shirt={SKY} mood="happy" arms="hug" />
      <Heart cx={50} cy={18} s={16} color={CORAL} />
    </ArtFrame>
  )
}

function UnAbrazo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Ground cx={50} cy={90} rx={28} />
      <Kid cx={38} baseY={90} scale={0.95} hair="short" hairColor={SEED} shirt={LEAF} mood="happy" arms="hug" />
      <Kid cx={62} baseY={90} scale={0.95} hair="curly" hairColor={SEED_LIGHT} shirt={PAPAYA_DARK} mood="happy" arms="hug" />
    </ArtFrame>
  )
}

function Mijo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Ground cx={46} cy={90} rx={26} />
      <Kid cx={36} baseY={88} scale={1} hair="short" hairColor={SEED} shirt={SKY_DARK} mood="happy" arms="point" />
      <Kid cx={64} baseY={94} scale={0.55} hair="short" hairColor={SEED_LIGHT} shirt={LEAF} mood="happy" arms="down" />
      <circle cx={62} cy={55} r={4.5} fill={SKIN} />
    </ArtFrame>
  )
}

function Mija(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={ROSE} />
      <Ground cx={46} cy={90} rx={26} />
      <Kid cx={36} baseY={88} scale={1} hair="long" hairColor={SEED} shirt={PAPAYA} mood="happy" arms="point" />
      <Kid cx={64} baseY={94} scale={0.55} hair="long" hairColor={SEED_LIGHT} shirt={ROSE} mood="happy" arms="down" />
      <circle cx={62} cy={55} r={4.5} fill={SKIN} />
    </ArtFrame>
  )
}

/* ---------------------------------- export ------------------------------------ */

export const U1_ART: Record<string, ComponentType<WordArtProps>> = {
  hola: Hola,
  adios: Adios,
  'buenos-dias': BuenosDias,
  'buenas-tardes': BuenasTardes,
  'buenas-noches': BuenasNoches,
  'como-estas': ComoEstas,
  bien: Bien,
  gracias: Gracias,
  mama: Mama,
  papa: Papa,
  hermano: Hermano,
  hermana: Hermana,
  bebe: Bebe,
  abuela: Abuela,
  abuelo: Abuelo,
  familia: Familia,
  tia: Tia,
  tio: Tio,
  primo: Primo,
  prima: Prima,
  amigo: Amigo,
  amiga: Amiga,
  vecino: Vecino,
  feliz: Feliz,
  triste: Triste,
  enojado: Enojado,
  cansado: Cansado,
  'con-miedo': ConMiedo,
  sorprendido: Sorprendido,
  tranquilo: Tranquilo,
  'te-quiero': TeQuiero,
  'te-amo': TeAmo,
  'mi-amor': MiAmor,
  mijo: Mijo,
  mija: Mija,
  'por-favor': PorFavor,
  'de-nada': DeNada,
  'un-abrazo': UnAbrazo,
}
