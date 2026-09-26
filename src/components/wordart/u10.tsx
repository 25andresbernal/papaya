// Unit 10: sentence frames, questions, and parent phrases.
// Question words share one look: a big speech bubble with a "?" on one side
// and a small picture of the idea on the other, on a purple tile.
// See docs/design/word-art.md for the rules every picture in this set follows.

import type { ComponentType, ReactNode } from 'react'
import { Eyes, Mouth } from '../buddies/rig'
import {
  ArtFrame,
  Tile,
  Ground,
  Kid,
  Bubble,
  BigText,
  Heart,
  Star,
  Zoom,
  NoSign,
  INK,
  INK_SOFT,
  PAPAYA,
  PAPAYA_DARK,
  LEAF,
  SKY,
  SUN,
  SUN_DARK,
  CORAL,
  CORAL_DARK,
  ROSE,
  PURPLE,
  CREAM,
  CREAM_DARK,
  SEED_LIGHT,
  WHITE,
  GRAY_DARK,
  SKIN,
} from './primitives'
import type { WordArtProps } from './primitives'

/* ------------------------------ small glyphs ------------------------------ */

/** A gear wheel for "how", built from six little teeth around a ring. */
function Gear({ x = 0, y = 0, r = 9 }: { x?: number; y?: number; r?: number }) {
  const teeth = [0, 60, 120, 180, 240, 300].map((deg) => (
    <rect key={deg} x={-2.2} y={-r - 4} width={4.4} height={5} rx={1} fill={GRAY_DARK} transform={`rotate(${deg})`} />
  ))
  return (
    <g transform={`translate(${x} ${y})`}>
      {teeth}
      <circle r={r} fill={GRAY_DARK} />
      <circle r={3.3} fill={CREAM} />
    </g>
  )
}

/** A little round clock, for "when" and "see you later". */
function Clock({ x = 0, y = 0, r = 9 }: { x?: number; y?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={WHITE} stroke={INK} strokeWidth={3} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.6} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <line x1={0} y1={0} x2={r * 0.5} y2={2} stroke={INK} strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

/** A little sun coming up over a flat line, for "see you tomorrow". */
function Sunrise({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -9 2 A 9 9 0 0 1 9 2 Z" fill={SUN} />
      <line x1={-11} y1={2} x2={11} y2={2} stroke={INK_SOFT} strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

/** The shared look for every question word: purple tile, big centered bubble, "?" plus a glyph. */
function QuestionArt(p: WordArtProps, glyph: ReactNode) {
  return (
    <ArtFrame {...p}>
      <Tile color={PURPLE} />
      <Bubble x={15} y={22} w={70} h={56} tail="none">
        <g transform="translate(-18 0)">{glyph}</g>
        <BigText text="?" size={30} x={18} y={0} />
      </Bubble>
    </ArtFrame>
  )
}

/* ------------------------------ question words ------------------------------ */

/** que: a little wrapped box, because "what" is the mystery box question. */
function Que(p: WordArtProps) {
  return QuestionArt(
    p,
    <g>
      <rect x={-10} y={-9} width={20} height={16} rx={2} fill={PAPAYA} />
      <rect x={-10} y={-9} width={20} height={5} fill={PAPAYA_DARK} />
    </g>,
  )
}

/** quien: a tiny face, because "who" is asking about a person. */
function Quien(p: WordArtProps) {
  return QuestionArt(
    p,
    <g>
      <path d="M -9 -6 Q 0 -14 9 -6 Q 5 -9 0 -8 Q -5 -9 -9 -6 Z" fill={SEED_LIGHT} />
      <circle r={9} fill={SKIN} />
      <Eyes mood="happy" cx={0} cy={-1} gap={7} r={1.8} />
      <Mouth mood="happy" cx={0} cy={4} w={5} />
    </g>,
  )
}

/** donde: a map pin, because "where" points at a place. */
function Donde(p: WordArtProps) {
  return QuestionArt(
    p,
    <g>
      <circle cx={0} cy={-6} r={7} fill={CORAL} />
      <polygon points="-6,-2 6,-2 0,11" fill={CORAL} />
      <circle cx={0} cy={-6} r={2.6} fill={WHITE} />
    </g>,
  )
}

/** cuando: a little clock, because "when" is about time. */
function Cuando(p: WordArtProps) {
  return QuestionArt(p, <Clock r={10} />)
}

/** por que: a lightbulb, because "why" is the idea lighting up. */
function PorQue(p: WordArtProps) {
  return QuestionArt(
    p,
    <g>
      <circle cx={0} cy={-3} r={8} fill={SUN} />
      <rect x={-4} y={5} width={8} height={4} rx={1.5} fill={GRAY_DARK} />
      <rect x={-3} y={9} width={6} height={3} rx={1} fill={GRAY_DARK} />
    </g>,
  )
}

/** como: a gear, because "how" is about the way something works. */
function Como(p: WordArtProps) {
  return QuestionArt(p, <Gear r={9} />)
}

/* ------------------------------ phrases ------------------------------ */

/** perdon: a sad close-up face with a tiny heart, saying sorry from the heart. */
function Perdon(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <Kid cx={50} baseY={118} scale={1.5} hair="short" shirt={CORAL} mood="sad" arms="down" />
      <Bubble x={58} y={8} w={26} h={22} tail="none">
        <Heart cx={0} cy={0} s={13} />
      </Bubble>
    </ArtFrame>
  )
}

/** con permiso: one kid waves hello while stepping past another kid. */
function ConPermiso(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={30} />
      <Kid cx={66} baseY={90} scale={0.85} hair="short" shirt={SKY} mood="happy" arms="down" />
      <Kid cx={36} baseY={90} scale={0.95} hair="curly" shirt={LEAF} mood="happy" arms="wave" />
    </ArtFrame>
  )
}

/** salud: a kid mid-sneeze, with a little heart bubble to mean "bless you". */
function Salud(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={46} cy={90} rx={20} />
      <Kid cx={46} baseY={90} hair="short" shirt={SUN} mood="excited" arms="up" />
      <g stroke={INK_SOFT} strokeWidth={2.5} strokeLinecap="round">
        <line x1={62} y1={30} x2={73} y2={26} />
        <line x1={64} y1={35} x2={76} y2={35} />
        <line x1={62} y1={40} x2={73} y2={44} />
      </g>
      <Bubble x={58} y={8} w={26} h={20} tail="none">
        <Heart cx={0} cy={0} s={11} />
      </Bubble>
    </ArtFrame>
  )
}

/** estoy bien: a happy kid with a thumbs-up in a bubble. */
function EstoyBien(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={42} cy={90} rx={20} />
      <Kid cx={42} baseY={90} hair="short" shirt={LEAF} mood="happy" arms="down" />
      <Bubble x={54} y={10} w={32} h={26} tail="left">
        <circle cx={-2} cy={5} r={7} fill={SKIN} />
        <rect x={-4} y={-7} width={6} height={12} rx={3} fill={SKIN} />
      </Bubble>
    </ArtFrame>
  )
}

/** como te llamas: a kid points at another kid, asking their name. */
function ComoTeLlamas(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={28} />
      <Kid cx={34} baseY={90} scale={0.9} hair="short" shirt={SKY} mood="happy" arms="point" />
      <Kid cx={68} baseY={90} scale={0.8} hair="curly" shirt={ROSE} mood="happy" arms="down" />
      <Bubble x={52} y={8} w={26} h={22} tail="none">
        <BigText text="?" size={16} />
      </Bubble>
    </ArtFrame>
  )
}

/** me llamo: a kid wearing a name tag with a little wavy signature line. */
function MeLlamo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={20} />
      <Kid cx={50} baseY={90} hair="short" shirt={SKY} mood="happy" arms="down" />
      <rect x={41} y={53} width={18} height={12} rx={2} fill={WHITE} />
      <path d="M 44 59 Q 47 56 50 59 Q 53 62 56 59" stroke={INK} strokeWidth={2} strokeLinecap="round" fill="none" />
    </ArtFrame>
  )
}

/** mucho gusto: two kids shaking hands in the middle. */
function MuchoGusto(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={30} />
      <Kid cx={34} baseY={90} scale={0.9} hair="short" shirt={SKY} mood="happy" arms="hold" />
      <g transform="scale(-1,1) translate(-100,0)">
        <Kid cx={34} baseY={90} scale={0.9} hair="curly" shirt={CORAL} mood="happy" arms="hold" />
      </g>
    </ArtFrame>
  )
}

/** hasta luego: a waving kid with a little clock, meaning "soon". */
function HastaLuego(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={40} cy={90} rx={18} />
      <Kid cx={40} baseY={90} hair="short" shirt={SKY} mood="happy" arms="wave" />
      <Bubble x={54} y={10} w={30} h={26} tail="left">
        <Clock r={9} />
      </Bubble>
    </ArtFrame>
  )
}

/** tengo: a kid holding a little apple, "I have" something in hand. */
function Tengo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={20} />
      <Kid cx={46} baseY={90} hair="short" shirt={SKY} mood="happy" arms="hold">
        <circle cx={0} cy={4} r={7} fill={CORAL} />
        <path d="M 0 -3 Q 3 -8 6 -5" stroke={LEAF} strokeWidth={2} strokeLinecap="round" fill="none" />
      </Kid>
    </ArtFrame>
  )
}

/** no tengo: empty open hands, and a faded apple crossed out to its side. */
function NoTengo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={42} cy={90} rx={20} />
      <Kid cx={42} baseY={90} hair="short" shirt={SKY} mood="sad" arms="hips" />
      <circle cx={74} cy={40} r={8} fill={CORAL} />
      <NoSign cx={74} cy={40} r={13} />
    </ArtFrame>
  )
}

/** puedo: a kid raising a hand to ask, with a "?" bubble. */
function Puedo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={46} cy={90} rx={20} />
      <Kid cx={46} baseY={90} hair="short" shirt={LEAF} mood="happy" arms="up" />
      <Bubble x={58} y={10} w={26} h={22} tail="left">
        <BigText text="?" size={16} />
      </Bubble>
    </ArtFrame>
  )
}

/** si no: a green check and a red X, side by side. */
function SiNo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <circle cx={30} cy={50} r={22} fill={LEAF} />
      <path d="M 20 50 L 27 58 L 40 40" stroke={WHITE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={70} cy={50} r={22} fill={CORAL_DARK} />
      <line x1={61} y1={41} x2={79} y2={59} stroke={WHITE} strokeWidth={5} strokeLinecap="round" />
      <line x1={79} y1={41} x2={61} y2={59} stroke={WHITE} strokeWidth={5} strokeLinecap="round" />
    </ArtFrame>
  )
}

/** un beso: a kid, a big heart, and a bubble with two little kiss lips. */
function UnBeso(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={40} cy={90} rx={20} />
      <Kid cx={40} baseY={90} hair="long" shirt={ROSE} mood="happy" arms="down" />
      <Heart cx={74} cy={30} s={20} />
      <Bubble x={28} y={8} w={26} h={18} tail="none">
        <path d="M -6 -1 Q -3 -4 0 -1" stroke={CORAL} strokeWidth={3} strokeLinecap="round" fill="none" />
        <path d="M 0 -1 Q 3 -4 6 -1" stroke={CORAL} strokeWidth={3} strokeLinecap="round" fill="none" />
      </Bubble>
    </ArtFrame>
  )
}

/** hasta manana: a waving kid with a little sunrise in a bubble. */
function HastaManana(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={40} cy={90} rx={18} />
      <Kid cx={40} baseY={90} hair="short" shirt={SKY} mood="happy" arms="wave" />
      <Bubble x={54} y={10} w={30} h={24} tail="left">
        <Sunrise />
      </Bubble>
    </ArtFrame>
  )
}

/** lo logre: an excited kid, arms up, standing tall on a little podium with a star. */
function LoLogre(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <rect x={30} y={78} width={40} height={14} rx={3} fill={PAPAYA} />
      <Kid cx={50} baseY={78} hair="curly" shirt={LEAF} mood="excited" arms="up" />
      <Star cx={78} cy={26} r={12} />
    </ArtFrame>
  )
}

/** tengo anos: a birthday cake with candles, and a "?" for the number. */
function TengoAnos(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <rect x={28} y={62} width={44} height={20} rx={4} fill={ROSE} />
      <rect x={28} y={54} width={44} height={10} rx={4} fill={CORAL} />
      <rect x={36} y={40} width={4} height={14} fill={SUN_DARK} />
      <rect x={50} y={40} width={4} height={14} fill={SUN_DARK} />
      <rect x={64} y={40} width={4} height={14} fill={SUN_DARK} />
      <circle cx={38} cy={38} r={3} fill={CORAL} />
      <circle cx={52} cy={38} r={3} fill={CORAL} />
      <circle cx={66} cy={38} r={3} fill={CORAL} />
      <BigText text="?" size={20} x={50} y={20} />
    </ArtFrame>
  )
}

/** vivo en: a kid standing next to a little house with a heart on the door. */
function VivoEn(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={54} cy={90} rx={30} />
      <polygon points="66,34 90,54 42,54" fill={CORAL_DARK} />
      <rect x={46} y={54} width={40} height={30} fill={SUN} />
      <rect x={60} y={68} width={12} height={16} rx={1.5} fill={SEED_LIGHT} />
      <Heart cx={66} cy={76} s={7} />
      <Kid cx={24} baseY={90} scale={0.85} hair="short" shirt={SKY} mood="happy" arms="down" />
    </ArtFrame>
  )
}

/** mi color favorito es: a kid holding a paint blob, with a heart for "favorite". */
function MiColorFavoritoEs(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={44} cy={90} rx={20} />
      <Kid cx={40} baseY={90} hair="short" shirt={CREAM} mood="happy" arms="hold">
        <circle cx={2} cy={2} r={9} fill={PURPLE} />
        <circle cx={-1} cy={-2} r={2.2} fill={WHITE} opacity={0.8} />
      </Kid>
      <Heart cx={78} cy={30} s={14} />
    </ArtFrame>
  )
}

/** quiero jugar: a kid holding a ball, with a heart bubble for "want". */
function QuieroJugar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={44} cy={90} rx={22} />
      <Kid cx={40} baseY={90} hair="curly" shirt={SKY} mood="excited" arms="hold">
        <circle cx={4} cy={4} r={9} fill={PAPAYA} />
        <path d="M -3 4 L 11 4 M 4 -3 L 4 11" stroke={PAPAYA_DARK} strokeWidth={1.5} />
      </Kid>
      <Bubble x={60} y={10} w={26} h={22} tail="none">
        <Heart cx={0} cy={0} s={12} />
      </Bubble>
    </ArtFrame>
  )
}

/** vamos: a kid running toward the edge, arm pointing the way, with zoom lines. */
function Vamos(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={54} cy={90} rx={20} />
      <Kid cx={54} baseY={90} hair="short" shirt={LEAF} mood="excited" pose="run" arms="point" />
      <Zoom x={26} y={60} />
    </ArtFrame>
  )
}

/* ------------------------------ export ------------------------------ */

export const U10_ART: Record<string, ComponentType<WordArtProps>> = {
  que: Que,
  quien: Quien,
  donde: Donde,
  cuando: Cuando,
  'por-que': PorQue,
  como: Como,
  perdon: Perdon,
  'con-permiso': ConPermiso,
  salud: Salud,
  'estoy-bien': EstoyBien,
  'como-te-llamas': ComoTeLlamas,
  'me-llamo': MeLlamo,
  'mucho-gusto': MuchoGusto,
  'hasta-luego': HastaLuego,
  tengo: Tengo,
  'no-tengo': NoTengo,
  puedo: Puedo,
  'si-no': SiNo,
  'un-beso': UnBeso,
  'hasta-manana': HastaManana,
  'lo-logre': LoLogre,
  'tengo-anos': TengoAnos,
  'vivo-en': VivoEn,
  'mi-color-favorito-es': MiColorFavoritoEs,
  'quiero-jugar': QuieroJugar,
  vamos: Vamos,
}
