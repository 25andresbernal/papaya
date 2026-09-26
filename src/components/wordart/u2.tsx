// Unit 2 word art: my body, getting ready in the morning and for bed, and
// small commands a grown-up gives a kid. See docs/design/word-art.md.
//
// Body parts: a close, cropped Kid (scale 1.4, baseY 112 pushes the feet off
// the bottom so we see just the head) with a Highlight ring on the part.
// Hands, feet, fingers, and teeth are drawn alone, big, in SKIN.
// Routines: a Kid mid-action with one prop. Commands: a Kid doing the thing.

import type { ComponentType, ReactNode } from 'react'
import { Zzz } from '../buddies/rig'
import {
  ArtFrame,
  Tile,
  Ground,
  Kid,
  Bubble,
  BigText,
  Highlight,
  Zoom,
  NoSign,
  Sparkles,
  Star,
  INK,
  INK_SOFT,
  PAPAYA,
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
  SEED,
  SEED_LIGHT,
  WHITE,
  GRAY,
  GRAY_DARK,
  SKIN,
  SKIN_DARK,
} from './primitives'
import type { WordArtProps } from './primitives'

/* --------------------------- small local helpers --------------------------- */

/** One open hand, palm up, with four finger bumps and a thumb to the side. */
function Hand({ cx, mirror = false }: { cx: number; mirror?: boolean }): ReactNode {
  const s = mirror ? -1 : 1
  return (
    <g>
      {[-8, -2.5, 2.5, 8].map((dx) => (
        <circle key={dx} cx={cx + dx} cy={36} r={4.5} fill={SKIN} />
      ))}
      <circle cx={cx + s * 14} cy={53} r={5.5} fill={SKIN} />
      <rect x={cx - 11} y={39} width={22} height={24} rx={10} fill={SKIN} />
    </g>
  )
}

/** One bare foot, seen from above, with four toe bumps. */
function Foot({ cx }: { cx: number }): ReactNode {
  return (
    <g>
      {[-8, -2.5, 3, 8.5].map((dx) => (
        <circle key={dx} cx={cx + dx} cy={48} r={4} fill={SKIN} />
      ))}
      <ellipse cx={cx} cy={60} rx={13} ry={10} fill={SKIN} />
    </g>
  )
}

/* -------------------------------- body parts -------------------------------- */

function ElPelo(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="el pelo">
      <Tile color={CREAM_DARK} />
      <Highlight cx={50} cy={24} r={18} color={SUN} />
      <Kid cx={50} baseY={112} scale={1.4} hair="curly" hairColor={SEED} mood="happy" />
    </ArtFrame>
  )
}

function LosOjos(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="los ojos">
      <Tile color={SKY} />
      <Kid cx={50} baseY={112} scale={1.4} mood="excited" hair="short" />
      <Highlight cx={50} cy={38} r={14} color={SUN} />
    </ArtFrame>
  )
}

function LaNariz(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="la nariz">
      <Tile color={ROSE} />
      <Kid cx={50} baseY={112} scale={1.4} mood="happy" hair="short" />
      <ellipse cx={50} cy={43} rx={3.5} ry={4.5} fill={SKIN_DARK} />
      <Highlight cx={50} cy={43} r={10} color={SUN} />
    </ArtFrame>
  )
}

function LaBoca(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="la boca">
      <Tile color={CORAL} />
      <Kid cx={50} baseY={112} scale={1.4} mood="excited" hair="long" hairColor={SEED} />
      <Highlight cx={50} cy={50} r={11} color={SUN} />
    </ArtFrame>
  )
}

function LasOrejas(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="las orejas">
      <Tile color={LEAF} />
      <Kid cx={50} baseY={112} scale={1.4} mood="happy" hair="short" />
      <ellipse cx={27} cy={40} rx={4} ry={6} fill={SKIN} />
      <ellipse cx={73} cy={40} rx={4} ry={6} fill={SKIN} />
      <Highlight cx={27} cy={40} r={9} color={SUN} />
      <Highlight cx={73} cy={40} r={9} color={SUN} />
    </ArtFrame>
  )
}

function LasManos(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="las manos">
      <Tile color={SKY} />
      <Hand cx={28} />
      <Hand cx={72} mirror />
    </ArtFrame>
  )
}

function LosPies(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="los pies">
      <Tile color={PAPAYA} />
      <Ground cx={50} cy={78} rx={30} />
      <Foot cx={34} />
      <Foot cx={66} />
    </ArtFrame>
  )
}

function LaCabeza(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="la cabeza">
      <Tile color={SUN} />
      <Highlight cx={50} cy={38} r={26} color={PAPAYA} />
      <Kid cx={50} baseY={112} scale={1.4} mood="happy" hair="short" />
    </ArtFrame>
  )
}

function LosBrazos(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="los brazos">
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={92} rx={22} />
      <Kid cx={50} baseY={90} scale={1.15} mood="happy" arms="hips" hair="short" />
      <Highlight cx={35} cy={54} r={10} color={SUN} />
      <Highlight cx={65} cy={54} r={10} color={SUN} />
    </ArtFrame>
  )
}

function LasPiernas(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="las piernas">
      <Tile color={LEAF} />
      <Ground cx={50} cy={92} rx={22} />
      <Kid cx={50} baseY={90} scale={1.15} mood="happy" hair="short" />
      <Highlight cx={50} cy={82} r={18} color={SUN} />
    </ArtFrame>
  )
}

function LosDedos(p: WordArtProps) {
  const fingers = [
    { x: 30, len: 24 },
    { x: 38, len: 30 },
    { x: 47, len: 34 },
    { x: 56, len: 32 },
    { x: 65, len: 26 },
  ]
  return (
    <ArtFrame {...p} label="los dedos">
      <Tile color={ROSE} />
      {fingers.map((f) => (
        <rect key={f.x} x={f.x - 3.5} y={52 - f.len} width={7} height={f.len} rx={3.5} fill={SKIN} />
      ))}
      {fingers.map((f) => (
        <circle key={`tip-${f.x}`} cx={f.x} cy={52 - f.len + 4} r={2.2} fill={SUN} />
      ))}
      <rect x={22} y={50} width={56} height={26} rx={14} fill={SKIN} />
    </ArtFrame>
  )
}

function LaPanza(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="la panza">
      <Tile color={SUN} />
      <Ground cx={50} cy={92} rx={22} />
      <Kid cx={50} baseY={90} scale={1.15} mood="excited" arms="hips" shirt={LEAF} hair="short" />
      <Highlight cx={50} cy={60} r={13} color={PAPAYA} />
    </ArtFrame>
  )
}

function LosDientes(p: WordArtProps) {
  const topTeeth = [28, 40, 52, 64]
  const botTeeth = [34, 46, 58]
  return (
    <ArtFrame {...p} label="los dientes">
      <Tile color={CORAL} />
      <path d="M 18 40 Q 50 80 82 40 Q 50 60 18 40 Z" fill={CORAL_DARK} />
      {topTeeth.map((x) => (
        <rect key={`t${x}`} x={x} y={38} width={10} height={12} rx={3} fill={WHITE} />
      ))}
      {botTeeth.map((x) => (
        <rect key={`b${x}`} x={x} y={58} width={10} height={10} rx={3} fill={WHITE} />
      ))}
    </ArtFrame>
  )
}

function LaCara(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="la cara">
      <Tile color={SKY} />
      <Highlight cx={50} cy={39} r={22} color={SUN} />
      <Kid cx={50} baseY={112} scale={1.4} mood="excited" hair="ponytail" hairColor={SEED} />
    </ArtFrame>
  )
}

/* ------------------------------ morning routine ------------------------------ */

function Despertarse(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="despertarse">
      <Tile color={SKY} />
      <circle cx={78} cy={20} r={14} fill={SUN} />
      <Ground cx={44} cy={90} rx={22} />
      <Kid cx={44} baseY={90} mood="sleepy" arms="up" hair="tuft" />
    </ArtFrame>
  )
}

function Levantarse(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="levantarse">
      <Tile color={CREAM_DARK} />
      <rect x={10} y={62} width={30} height={16} rx={5} fill={SKY} />
      <rect x={10} y={54} width={12} height={10} rx={4} fill={WHITE} />
      <Ground cx={64} cy={90} rx={20} />
      <Kid cx={64} baseY={90} mood="happy" arms="up" hair="short" />
    </ArtFrame>
  )
}

function LavarseLaCara(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="lavarse la cara">
      <Tile color={SKY} />
      <Kid cx={50} baseY={88} scale={0.9} mood="happy" arms="up" hair="short" />
      <Sparkles cx={50} cy={38} color={SUN} />
      <rect x={18} y={76} width={64} height={16} rx={8} fill={WHITE} />
      <rect x={46} y={64} width={8} height={14} fill={GRAY} />
    </ArtFrame>
  )
}

function LavateLasManos(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="lavate las manos">
      <Tile color={LEAF} />
      <Kid cx={50} baseY={88} scale={0.9} mood="happy" hair="short" />
      <Sparkles cx={32} cy={68} color={WHITE} />
      <Sparkles cx={68} cy={68} color={WHITE} />
      <rect x={18} y={76} width={64} height={16} rx={8} fill={WHITE} />
      <rect x={46} y={64} width={8} height={14} fill={GRAY} />
    </ArtFrame>
  )
}

function CepillarseLosDientes(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="cepillarse los dientes">
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={90} rx={20} />
      <Kid cx={50} baseY={90} mood="excited" arms="hold" hair="short">
        <rect x={0} y={-6} width={22} height={6} rx={3} fill={WHITE} />
        <rect x={18} y={-9} width={8} height={10} rx={2} fill={SKY} />
      </Kid>
      <Sparkles cx={66} cy={34} color={SUN} />
    </ArtFrame>
  )
}

function Vestirse(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="vestirse">
      <Tile color={ROSE} />
      <Ground cx={58} cy={90} rx={18} />
      <Kid cx={58} baseY={90} scale={0.95} mood="happy" arms="up" shirt={SKY} hair="short" />
      <rect x={14} y={54} width={26} height={22} rx={4} fill={SUN} />
      <rect x={8} y={58} width={10} height={8} rx={3} fill={SUN} />
      <rect x={36} y={58} width={10} height={8} rx={3} fill={SUN} />
    </ArtFrame>
  )
}

function Desayunar(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="desayunar">
      <Tile color={SUN} />
      <rect x={16} y={70} width={68} height={8} rx={4} fill={SEED_LIGHT} />
      <ellipse cx={38} cy={66} rx={16} ry={8} fill={WHITE} />
      <ellipse cx={38} cy={64} rx={12} ry={5} fill={SKY} />
      <Kid cx={66} baseY={78} scale={0.85} mood="happy" arms="hold" hair="short">
        <rect x={0} y={-2} width={3} height={14} rx={1.5} fill={GRAY} />
        <ellipse cx={1.5} cy={-4} rx={4} ry={3} fill={GRAY} />
      </Kid>
    </ArtFrame>
  )
}

function Peinarse(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="peinarse">
      <Tile color={PURPLE} />
      <Ground cx={50} cy={90} rx={20} />
      <Kid cx={50} baseY={90} mood="happy" arms="hold" hair="long" hairColor={SEED}>
        <rect x={0} y={-30} width={16} height={5} rx={2} fill={CORAL} />
        {[2, 6, 10, 14].map((dx) => (
          <rect key={dx} x={dx} y={-25} width={2} height={8} fill={CORAL} />
        ))}
      </Kid>
    </ArtFrame>
  )
}

function Banarse(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="banarse">
      <Tile color={SKY} />
      <path d="M 16 58 Q 16 82 50 82 Q 84 82 84 58 L 76 58 Q 76 74 50 74 Q 24 74 24 58 Z" fill={WHITE} />
      <Kid cx={50} baseY={72} scale={0.8} pose="sit" mood="excited" hair="short" />
      <circle cx={30} cy={52} r={5} fill={WHITE} opacity={0.9} />
      <circle cx={46} cy={46} r={6} fill={WHITE} opacity={0.9} />
      <circle cx={62} cy={50} r={4} fill={WHITE} opacity={0.9} />
      <circle cx={54} cy={60} r={5} fill={WHITE} opacity={0.9} />
    </ArtFrame>
  )
}

function PonerseLaPijama(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="ponerse la pijama">
      <Tile color={SEED} />
      <Ground cx={50} cy={90} rx={20} />
      <Kid cx={50} baseY={90} mood="sleepy" arms="up" shirt={PURPLE} pants={PURPLE} hair="tuft" />
      <Star cx={26} cy={28} r={4} color={SUN} />
      <Star cx={72} cy={22} r={3} color={SUN} />
      <Star cx={80} cy={44} r={3} color={SUN} />
    </ArtFrame>
  )
}

function CepillarseElPelo(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="cepillarse el pelo">
      <Tile color={ROSE} />
      <Ground cx={50} cy={90} rx={20} />
      <Kid cx={50} baseY={90} mood="happy" arms="hold" hair="curly" hairColor={SEED}>
        <rect x={2} y={-34} width={14} height={16} rx={5} fill={CORAL} />
        <rect x={-2} y={-20} width={6} height={10} rx={3} fill={CORAL_DARK} />
      </Kid>
    </ArtFrame>
  )
}

/* -------------------------------- bedtime -------------------------------- */

function UnCuento(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="un cuento">
      <Tile color={PAPAYA} />
      <path d="M 50 28 L 50 76 Q 30 68 16 74 L 16 30 Q 30 24 50 28 Z" fill={WHITE} />
      <path d="M 50 28 L 50 76 Q 70 68 84 74 L 84 30 Q 70 24 50 28 Z" fill={CREAM} />
      <rect x={22} y={38} width={20} height={3} rx={1.5} fill={GRAY} />
      <rect x={22} y={48} width={20} height={3} rx={1.5} fill={GRAY} />
      <rect x={58} y={38} width={20} height={3} rx={1.5} fill={GRAY} />
      <rect x={58} y={48} width={20} height={3} rx={1.5} fill={GRAY} />
      <Star cx={50} cy={18} r={5} color={SUN} />
    </ArtFrame>
  )
}

function Dormir(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="dormir">
      <Tile color={SEED} />
      <rect x={12} y={40} width={10} height={44} rx={3} fill={SEED_LIGHT} />
      <rect x={18} y={62} width={66} height={22} rx={6} fill={CREAM} />
      <rect x={50} y={66} width={34} height={18} rx={6} fill={SKY} />
      <rect x={20} y={58} width={20} height={12} rx={5} fill={WHITE} />
      <Kid cx={28} baseY={70} scale={0.8} pose="lie" mood="sleepy" hair="tuft" />
      <Zzz x={70} y={34} />
    </ArtFrame>
  )
}

function LaCama(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="la cama">
      <Tile color={CREAM_DARK} />
      <rect x={12} y={30} width={10} height={54} rx={3} fill={SEED_LIGHT} />
      <rect x={18} y={54} width={66} height={30} rx={8} fill={WHITE} />
      <rect x={44} y={60} width={40} height={24} rx={8} fill={SKY} />
      <rect x={22} y={48} width={22} height={14} rx={6} fill={CREAM} />
      <Ground cx={50} cy={88} rx={30} />
    </ArtFrame>
  )
}

function ApagarLaLuz(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="apagar la luz">
      <Tile color={SEED} />
      <Star cx={78} cy={20} r={3} color={SUN} />
      <Star cx={20} cy={26} r={2.5} color={SUN} />
      <line x1={50} y1={8} x2={50} y2={38} stroke={GRAY} strokeWidth={3} strokeLinecap="round" />
      <circle cx={50} cy={50} r={16} fill={GRAY} />
      <rect x={45} y={64} width={10} height={7} rx={2} fill={GRAY_DARK} />
      <line x1={50} y1={71} x2={50} y2={82} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <circle cx={50} cy={85} r={3.5} fill={GRAY_DARK} />
    </ArtFrame>
  )
}

/* -------------------------------- commands -------------------------------- */

function VenAqui(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="ven aqui">
      <Tile color={LEAF} />
      <Ground cx={40} cy={90} rx={20} />
      <Kid cx={40} baseY={90} scale={1.1} mood="happy" arms="point" hair="short" />
      <Ground cx={78} cy={82} rx={10} />
      <Kid cx={78} baseY={82} scale={0.55} mood="happy" hair="curly" shirt={SUN} />
    </ArtFrame>
  )
}

function Sientate(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="sientate">
      <Tile color={SKY} />
      <rect x={30} y={38} width={8} height={34} rx={3} fill={SEED_LIGHT} />
      <rect x={30} y={70} width={40} height={8} rx={3} fill={SEED_LIGHT} />
      <rect x={30} y={78} width={6} height={10} fill={SEED_LIGHT} />
      <rect x={64} y={78} width={6} height={10} fill={SEED_LIGHT} />
      <Kid cx={50} baseY={78} pose="sit" mood="happy" hair="short" />
    </ArtFrame>
  )
}

function Levantate(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="levantate">
      <Tile color={SUN} />
      <Ground cx={50} cy={90} rx={20} />
      <Kid cx={50} baseY={90} mood="excited" arms="up" hair="short" />
      <Zoom x={24} y={80} color={INK_SOFT} />
    </ArtFrame>
  )
}

function TenCuidado(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="ten cuidado">
      <Tile color={SUN} />
      <Ground cx={32} cy={90} rx={16} />
      <Kid cx={32} baseY={90} scale={0.9} mood="excited" arms="hips" hair="short" />
      <path d="M 66 82 L 84 82 L 75 58 Z" fill={SUN_DARK} />
      <BigText text="!" x={75} y={76} size={14} color={INK} />
    </ArtFrame>
  )
}

function Espera(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="espera">
      <Tile color={CREAM_DARK} />
      <Ground cx={36} cy={90} rx={18} />
      <Kid cx={36} baseY={90} mood="happy" arms="wave" hair="short" />
      <circle cx={72} cy={30} r={15} fill={WHITE} />
      <circle cx={72} cy={17} r={1.8} fill={GRAY_DARK} />
      <circle cx={72} cy={43} r={1.8} fill={GRAY_DARK} />
      <circle cx={59} cy={30} r={1.8} fill={GRAY_DARK} />
      <circle cx={85} cy={30} r={1.8} fill={GRAY_DARK} />
      <line x1={72} y1={30} x2={66} y2={22} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={72} y1={30} x2={80} y2={24} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={72} cy={30} r={1.8} fill={INK} />
    </ArtFrame>
  )
}

function Apurate(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="apurate">
      <Tile color={PAPAYA} />
      <Ground cx={54} cy={90} rx={20} />
      <Kid cx={54} baseY={90} pose="run" mood="excited" hair="short" />
      <Zoom x={26} y={60} color={INK_SOFT} />
      <Zoom x={22} y={76} color={INK_SOFT} />
    </ArtFrame>
  )
}

function Silencio(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="silencio">
      <Tile color={SKY} />
      <Ground cx={42} cy={90} rx={18} />
      <Kid cx={42} baseY={90} mood="happy" hair="short" />
      <rect x={40.5} y={38} width={3} height={12} rx={1.5} fill={SKIN_DARK} />
      <Bubble x={58} y={12} w={30} h={22} fill={WHITE} tail="left">
        <BigText text="Shh" size={10} />
      </Bubble>
    </ArtFrame>
  )
}

function NoToques(p: WordArtProps) {
  return (
    <ArtFrame {...p} label="no toques">
      <Tile color={CORAL} />
      <Ground cx={36} cy={90} rx={18} />
      <Kid cx={36} baseY={90} mood="excited" arms="point" hair="short" />
      <rect x={58} y={64} width={28} height={16} rx={4} fill={GRAY_DARK} />
      <rect x={58} y={62} width={28} height={5} rx={2.5} fill={GRAY} />
      <rect x={53} y={66} width={6} height={4} fill={GRAY_DARK} />
      <rect x={87} y={66} width={6} height={4} fill={GRAY_DARK} />
      <NoSign cx={74} cy={50} r={17} />
    </ArtFrame>
  )
}

/* --------------------------------- export --------------------------------- */

export const U2_ART: Record<string, ComponentType<WordArtProps>> = {
  'el-pelo': ElPelo,
  'los-ojos': LosOjos,
  'la-nariz': LaNariz,
  'la-boca': LaBoca,
  'las-orejas': LasOrejas,
  'las-manos': LasManos,
  'los-pies': LosPies,
  'la-cabeza': LaCabeza,
  'los-brazos': LosBrazos,
  'las-piernas': LasPiernas,
  'los-dedos': LosDedos,
  'la-panza': LaPanza,
  'los-dientes': LosDientes,
  'la-cara': LaCara,
  despertarse: Despertarse,
  levantarse: Levantarse,
  'lavarse-la-cara': LavarseLaCara,
  'lavate-las-manos': LavateLasManos,
  'cepillarse-los-dientes': CepillarseLosDientes,
  vestirse: Vestirse,
  desayunar: Desayunar,
  peinarse: Peinarse,
  banarse: Banarse,
  'ponerse-la-pijama': PonerseLaPijama,
  'cepillarse-el-pelo': CepillarseElPelo,
  'un-cuento': UnCuento,
  dormir: Dormir,
  'la-cama': LaCama,
  'apagar-la-luz': ApagarLaLuz,
  'ven-aqui': VenAqui,
  sientate: Sientate,
  levantate: Levantate,
  'ten-cuidado': TenCuidado,
  espera: Espera,
  apurate: Apurate,
  silencio: Silencio,
  'no-toques': NoToques,
}
