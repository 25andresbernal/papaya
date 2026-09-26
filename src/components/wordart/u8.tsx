// Unit 8: school and play... no wait, this file is the house words -
// rooms, furniture, gadgets, and the things a grown-up says about them.
// See docs/design/word-art.md for the rules. Copy the style in examples.tsx.

import type { ComponentType, ReactNode } from 'react'
import {
  ArtFrame,
  Tile,
  Ground,
  Kid,
  BigText,
  Zoom,
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
} from './primitives'
import type { WordArtProps } from './primitives'

/* ------------------------------ little helpers used by many rooms ------------------------------ */

/** A doorway view: a wall, a floor strip, and whatever the room's signature thing is. */
function RoomFrame({
  wall = CREAM_DARK,
  floor = SEED_LIGHT,
  children,
}: {
  wall?: string
  floor?: string
  children?: ReactNode
}) {
  return (
    <>
      <Tile color={CREAM} />
      <rect x={10} y={12} width={80} height={66} rx={14} fill={wall} />
      <rect x={10} y={66} width={80} height={12} rx={5} fill={floor} opacity={0.6} />
      {children}
    </>
  )
}

/** A sofa: armrests, a backrest, a seat, and a seam so it does not read as a car. */
function Sofa({ x = 18, y = 32, w = 64, base = SKY, dark = SKY_DARK }: { x?: number; y?: number; w?: number; base?: string; dark?: string }) {
  const midX = x + w / 2
  return (
    <>
      <rect x={x + 6} y={y} width={w - 12} height={24} rx={10} fill={dark} />
      <rect x={x} y={y + 10} width={11} height={32} rx={5.5} fill={dark} />
      <rect x={x + w - 11} y={y + 10} width={11} height={32} rx={5.5} fill={dark} />
      <rect x={x + 3} y={y + 20} width={w - 6} height={22} rx={8} fill={base} />
      <line x1={midX} y1={y + 22} x2={midX} y2={y + 40} stroke={dark} strokeWidth={2} strokeLinecap="round" />
    </>
  )
}

/** A simple bed: headboard, mattress, pillow, blanket. */
function Bed({ x = 22, y = 52, w = 48, color = SKY }: { x?: number; y?: number; w?: number; color?: string }) {
  return (
    <>
      <rect x={x} y={y - 14} width={9} height={28} rx={3} fill={SEED_LIGHT} />
      <rect x={x + 7} y={y} width={w - 7} height={16} rx={5} fill={WHITE} />
      <rect x={x + 7} y={y + 7} width={w - 7} height={9} rx={4} fill={color} />
      <rect x={x + 11} y={y - 6} width={16} height={10} rx={4} fill={WHITE} />
    </>
  )
}

/** A table seen from the side: a top and two legs. */
function Table({ x = 24, y = 54, w = 52, color = SEED_LIGHT }: { x?: number; y?: number; w?: number; color?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={8} rx={3} fill={color} />
      <rect x={x + 5} y={y + 8} width={5} height={16} fill={color} />
      <rect x={x + w - 10} y={y + 8} width={5} height={16} fill={color} />
    </>
  )
}

/** A wooden door with a round knob. */
function Door({ x = 30, y = 14, w = 40, h = 64, color = SEED_LIGHT }: { x?: number; y?: number; w?: number; h?: number; color?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={color} />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx={4} fill={SEED} opacity={0.15} />
      <circle cx={x + w - 10} cy={y + h / 2} r={4} fill={SUN} />
    </>
  )
}

/** A lamp: shade, pole, base, and a switch dot. Pass a gray shade for "off". */
function Lamp({ x = 50, shade = SUN }: { x?: number; shade?: string }) {
  return (
    <>
      <path d={`M ${x - 16} 34 L ${x + 16} 34 L ${x + 10} 14 L ${x - 10} 14 Z`} fill={shade} />
      <rect x={x - 2} y={34} width={4} height={30} fill={SEED_LIGHT} />
      <rect x={x - 14} y={64} width={28} height={6} rx={3} fill={SEED_LIGHT} />
      <circle cx={x + 9} cy={50} r={3} fill={GRAY_DARK} />
    </>
  )
}

/* ------------------------------ rooms ------------------------------ */

/** la cocina: a pot cooking on a stove. */
export function LaCocina(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <RoomFrame>
        <rect x={28} y={60} width={44} height={12} rx={3} fill={GRAY_DARK} />
        <circle cx={38} cy={60} r={3} fill={SEED} />
        <circle cx={62} cy={60} r={3} fill={SEED} />
        <rect x={36} y={42} width={26} height={18} rx={4} fill={CORAL} />
        <ellipse cx={49} cy={42} rx={14} ry={3.5} fill={CORAL_DARK} />
        <rect x={30} y={47} width={6} height={4} rx={2} fill={CORAL_DARK} />
        <rect x={64} y={47} width={6} height={4} rx={2} fill={CORAL_DARK} />
      </RoomFrame>
    </ArtFrame>
  )
}

/** el baño: a bathtub with a faucet. */
export function ElBano(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <RoomFrame>
        <rect x={28} y={54} width={44} height={18} rx={9} fill={WHITE} />
        <ellipse cx={50} cy={58} rx={17} ry={4} fill={SKY} />
        <rect x={47} y={44} width={4} height={10} fill={GRAY_DARK} />
        <circle cx={49} cy={43} r={3} fill={GRAY_DARK} />
      </RoomFrame>
    </ArtFrame>
  )
}

/** la sala: a sofa with two cushions. */
export function LaSala(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <RoomFrame>
        <Sofa x={22} y={32} w={56} />
      </RoomFrame>
    </ArtFrame>
  )
}

/** el cuarto: a cozy bed. */
export function ElCuarto(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <RoomFrame>
        <Bed x={26} y={52} w={46} color={CORAL} />
      </RoomFrame>
    </ArtFrame>
  )
}

/** el jardín: grass, a flower, and a tree. */
export function ElJardin(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <rect x={8} y={64} width={84} height={24} rx={10} fill={LEAF} />
      <rect x={67} y={40} width={7} height={26} rx={3} fill={SEED_LIGHT} />
      <circle cx={71} cy={34} r={16} fill={LEAF_DARK} />
      <rect x={29} y={70} width={2} height={10} fill={LEAF_DARK} />
      <circle cx={30} cy={70} r={4} fill={SUN} />
      <circle cx={24} cy={66} r={4} fill={ROSE} />
      <circle cx={36} cy={66} r={4} fill={ROSE} />
      <circle cx={24} cy={74} r={4} fill={ROSE} />
      <circle cx={36} cy={74} r={4} fill={ROSE} />
    </ArtFrame>
  )
}

/** el garaje: a car parked in front of a paneled door. */
export function ElGaraje(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <RoomFrame wall={GRAY}>
        <rect x={14} y={26} width={72} height={3} fill={GRAY_DARK} />
        <rect x={14} y={38} width={72} height={3} fill={GRAY_DARK} />
        <rect x={14} y={50} width={72} height={3} fill={GRAY_DARK} />
        <rect x={30} y={58} width={40} height={14} rx={6} fill={CORAL} />
        <rect x={38} y={50} width={24} height={12} rx={4} fill={SKY} />
        <circle cx={38} cy={72} r={6} fill={SEED} />
        <circle cx={62} cy={72} r={6} fill={SEED} />
        <circle cx={34} cy={62} r={2.5} fill={SUN} />
        <circle cx={66} cy={62} r={2.5} fill={SUN} />
      </RoomFrame>
    </ArtFrame>
  )
}

/** el comedor: a table set with two plates. */
export function ElComedor(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <RoomFrame>
        <Table x={24} y={54} w={52} />
        <circle cx={38} cy={50} r={7} fill={WHITE} />
        <circle cx={62} cy={50} r={7} fill={WHITE} />
      </RoomFrame>
    </ArtFrame>
  )
}

/* ------------------------------ furniture and objects ------------------------------ */

/** la mesa: a big table, alone. */
export function LaMesa(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Ground cx={50} cy={82} rx={28} />
      <rect x={18} y={44} width={64} height={10} rx={4} fill={SEED_LIGHT} />
      <rect x={26} y={54} width={7} height={26} rx={2} fill={SEED} />
      <rect x={67} y={54} width={7} height={26} rx={2} fill={SEED} />
    </ArtFrame>
  )
}

/** la silla: a chair from the side. */
export function LaSilla(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Ground cx={50} cy={82} rx={22} />
      <rect x={28} y={18} width={8} height={32} rx={3} fill={PAPAYA_DARK} />
      <rect x={28} y={50} width={40} height={8} rx={3} fill={PAPAYA} />
      <rect x={30} y={58} width={6} height={20} rx={2} fill={PAPAYA_DARK} />
      <rect x={60} y={58} width={6} height={20} rx={2} fill={PAPAYA_DARK} />
    </ArtFrame>
  )
}

/** la puerta: a door with a knob. */
export function LaPuerta(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Door x={28} y={14} w={44} h={64} />
    </ArtFrame>
  )
}

/** la ventana: four panes and curtains. */
export function LaVentana(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <rect x={14} y={12} width={72} height={4} rx={2} fill={SEED_LIGHT} />
      <rect x={22} y={18} width={56} height={56} rx={8} fill={WHITE} />
      <rect x={48} y={18} width={4} height={56} fill={SEED_LIGHT} />
      <rect x={22} y={44} width={56} height={4} fill={SEED_LIGHT} />
      <path d="M16 14 Q24 42 16 80" fill={CORAL} />
      <path d="M84 14 Q76 42 84 80" fill={CORAL} />
    </ArtFrame>
  )
}

/** el sofá: a sofa alone, big. */
export function ElSofa(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Ground cx={50} cy={84} rx={28} />
      <Sofa x={14} y={26} w={72} />
    </ArtFrame>
  )
}

/** la escalera: steps going up. */
export function LaEscalera(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <rect x={16} y={70} width={68} height={10} rx={2} fill={SEED_LIGHT} />
      <rect x={16} y={56} width={52} height={10} rx={2} fill={SEED_LIGHT} />
      <rect x={16} y={42} width={36} height={10} rx={2} fill={SEED_LIGHT} />
      <rect x={16} y={28} width={20} height={10} rx={2} fill={SEED_LIGHT} />
    </ArtFrame>
  )
}

/** la televisión: a screen on a little stand. */
export function LaTelevision(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Ground cx={50} cy={80} rx={22} />
      <rect x={16} y={20} width={68} height={42} rx={6} fill={INK} />
      <rect x={20} y={24} width={60} height={34} rx={3} fill={SKY} />
      <rect x={44} y={62} width={12} height={8} fill={GRAY_DARK} />
      <rect x={32} y={72} width={36} height={4} rx={2} fill={GRAY_DARK} />
    </ArtFrame>
  )
}

/** el libro: an open book. */
export function ElLibro(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <path d="M50 26 L50 74 L20 68 Q18 68 18 66 L18 30 Q18 28 20 28 Z" fill={SKY} />
      <path d="M50 26 L50 74 L80 68 Q82 68 82 66 L82 30 Q82 28 80 28 Z" fill={SKY_DARK} />
      <rect x={48} y={26} width={4} height={48} fill={SEED_LIGHT} />
      <line x1={26} y1={38} x2={42} y2={36} stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={26} y1={46} x2={42} y2={44} stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={58} y1={36} x2={74} y2={38} stroke={CREAM} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={58} y1={44} x2={74} y2={46} stroke={CREAM} strokeWidth={2.5} strokeLinecap="round" />
    </ArtFrame>
  )
}

/** el juguete: a toy block and a ball. */
export function ElJuguete(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Ground cx={50} cy={82} rx={26} />
      <rect x={24} y={40} width={32} height={32} rx={7} fill={PAPAYA} />
      <BigText text="A" x={40} y={58} size={22} color={WHITE} />
      <circle cx={70} cy={62} r={13} fill={SKY} />
      <circle cx={65} cy={57} r={3.5} fill={WHITE} opacity={0.7} />
    </ArtFrame>
  )
}

/** la lámpara: a lamp, lit. */
export function LaLampara(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Ground cx={50} cy={72} rx={18} />
      <Lamp x={50} shade={SUN} />
    </ArtFrame>
  )
}

/** el teléfono: a phone with a screen. */
export function ElTelefono(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <rect x={34} y={14} width={32} height={64} rx={8} fill={INK} />
      <rect x={38} y={22} width={24} height={44} rx={2} fill={SKY} />
      <circle cx={50} cy={72} r={3} fill={GRAY} />
    </ArtFrame>
  )
}

/** el reloj: a clock with two hands and twelve ticks. */
export function ElReloj(p: WordArtProps) {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI / 6) * i - Math.PI / 2
    return { x: 50 + 29 * Math.cos(a), y: 50 + 29 * Math.sin(a) }
  })
  return (
    <ArtFrame {...p}>
      <Tile />
      <circle cx={50} cy={50} r={35} fill={WHITE} />
      <circle cx={50} cy={50} r={35} fill="none" stroke={SEED_LIGHT} strokeWidth={4} />
      {ticks.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r={1.8} fill={SEED_LIGHT} />
      ))}
      <line x1={50} y1={50} x2={50} y2={30} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <line x1={50} y1={50} x2={64} y2={58} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={50} cy={50} r={3} fill={INK} />
    </ArtFrame>
  )
}

/** el espejo: an oval mirror with a shine. */
export function ElEspejo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <rect x={44} y={80} width={12} height={8} rx={2} fill={SEED_LIGHT} />
      <ellipse cx={50} cy={46} rx={26} ry={34} fill={SKY} />
      <ellipse cx={50} cy={46} rx={19} ry={27} fill={WHITE} />
      <path d="M40 26 Q45 46 40 66" stroke={SKY} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.6} />
    </ArtFrame>
  )
}

/** el computador: a monitor and a keyboard. */
export function ElComputador(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <rect x={22} y={16} width={56} height={38} rx={5} fill={INK} />
      <rect x={26} y={20} width={48} height={30} rx={2} fill={SKY} />
      <rect x={44} y={54} width={12} height={8} fill={GRAY_DARK} />
      <rect x={18} y={64} width={64} height={12} rx={4} fill={SEED_LIGHT} />
      <rect x={26} y={68} width={8} height={4} rx={1} fill={GRAY_DARK} />
      <rect x={38} y={68} width={8} height={4} rx={1} fill={GRAY_DARK} />
      <rect x={50} y={68} width={8} height={4} rx={1} fill={GRAY_DARK} />
    </ArtFrame>
  )
}

/** la tableta: a flat tablet. */
export function LaTableta(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <rect x={24} y={14} width={52} height={72} rx={8} fill={INK} />
      <rect x={29} y={22} width={42} height={54} rx={3} fill={SKY} />
      <circle cx={50} cy={81} r={3} fill={GRAY} />
    </ArtFrame>
  )
}

/** el control remoto: a remote with buttons. */
export function ElControlRemoto(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <rect x={38} y={14} width={24} height={64} rx={10} fill={SEED_LIGHT} />
      <circle cx={50} cy={27} r={5} fill={CORAL} />
      <rect x={42} y={38} width={16} height={8} rx={3} fill={GRAY_DARK} />
      <circle cx={50} cy={56} r={4} fill={SKY} />
      <circle cx={50} cy={68} r={4} fill={SUN} />
    </ArtFrame>
  )
}

/** el cargador: a plug with a curled cable. */
export function ElCargador(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <rect x={36} y={12} width={4} height={10} fill={SEED} />
      <rect x={46} y={12} width={4} height={10} fill={SEED} />
      <rect x={30} y={20} width={22} height={26} rx={4} fill={GRAY_DARK} />
      <path d="M52 38 Q80 38 78 66 Q76 80 60 78" stroke={SKY} strokeWidth={5} strokeLinecap="round" fill="none" />
      <circle cx={60} cy={78} r={4} fill={GRAY_DARK} />
    </ArtFrame>
  )
}

/** el internet: three wifi arcs and a dot. */
export function ElInternet(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SKY} />
      <path d="M16 50 Q50 14 84 50" stroke={WHITE} strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M28 58 Q50 34 72 58" stroke={WHITE} strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M40 66 Q50 56 60 66" stroke={WHITE} strokeWidth={5} strokeLinecap="round" fill="none" />
      <circle cx={50} cy={76} r={5} fill={WHITE} />
    </ArtFrame>
  )
}

/** los audífonos: a headband and two ear cups. */
export function LosAudifonos(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <path d="M22 54 Q22 18 50 18 Q78 18 78 54" stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
      <rect x={14} y={48} width={16} height={28} rx={8} fill={CORAL} />
      <rect x={70} y={48} width={16} height={28} rx={8} fill={CORAL} />
      <rect x={19} y={54} width={6} height={16} rx={3} fill={CORAL_DARK} opacity={0.6} />
      <rect x={75} y={54} width={6} height={16} rx={3} fill={CORAL_DARK} opacity={0.6} />
    </ArtFrame>
  )
}

/* ------------------------------ commands ------------------------------ */

/** recoge tus juguetes: a kid reaching down toward toys on the floor. */
export function RecogeTusJuguetes(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Ground cx={50} cy={90} rx={30} />
      <Kid cx={34} baseY={90} scale={0.9} arms="hold" mood="happy" />
      <rect x={60} y={76} width={14} height={14} rx={3} fill={PAPAYA} />
      <circle cx={80} cy={82} r={7} fill={SKY} />
    </ArtFrame>
  )
}

/** ordena tu cuarto: a made bed and a tidy shelf, with sparkles. */
export function OrdenaTuCuarto(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Bed x={14} y={56} w={40} color={LEAF} />
      <rect x={64} y={30} width={22} height={44} rx={4} fill={SEED_LIGHT} />
      <rect x={68} y={36} width={14} height={5} fill={SUN} />
      <rect x={68} y={45} width={14} height={5} fill={SKY} />
      <rect x={68} y={54} width={14} height={5} fill={CORAL} />
      <Sparkles cx={48} cy={18} color={SUN} />
    </ArtFrame>
  )
}

/** cierra la puerta: a kid pushing a door shut. */
export function CierraLaPuerta(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Ground cx={30} cy={90} rx={16} />
      <Door x={46} y={14} w={34} h={64} />
      <Kid cx={28} baseY={90} scale={0.85} arms="point" mood="happy" />
      <path d="M38 40 Q46 34 54 40" stroke={INK_SOFT} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M50 36 L54 40 L49 42" stroke={INK_SOFT} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </ArtFrame>
  )
}

/** apaga la luz: a kid at the switch, lamp going dark. */
export function ApagaLaLuz(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SEED} />
      <Lamp x={64} shade={GRAY} />
      <Kid cx={28} baseY={90} scale={0.85} arms="point" mood="sleepy" hairColor={SUN} shirt={CORAL} />
    </ArtFrame>
  )
}

/** ven a cenar: a set table and a kid running to eat. */
export function VenACenar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Table x={40} y={54} w={40} />
      <circle cx={52} cy={50} r={6} fill={WHITE} />
      <circle cx={68} cy={50} r={6} fill={WHITE} />
      <Ground cx={20} cy={90} rx={16} />
      <Kid cx={20} baseY={90} scale={0.85} pose="run" mood="excited" />
      <Zoom x={8} y={70} />
    </ArtFrame>
  )
}

/** es hora de dormir: a moon, a bed, and a sleepy kid. */
export function EsHoraDeDormir(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={PURPLE} />
      <circle cx={74} cy={22} r={10} fill={SUN} />
      <circle cx={79} cy={18} r={10} fill={PURPLE} />
      <Bed x={16} y={58} w={44} color={SKY} />
      <Kid cx={48} baseY={78} scale={0.7} pose="lie" mood="sleepy" />
    </ArtFrame>
  )
}

/** no saltes en la cama: a kid jumping over the bed, with a no sign. */
export function NoSaltesEnLaCama(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile />
      <Bed x={18} y={62} w={56} color={CORAL} />
      <Kid cx={46} baseY={60} scale={0.8} pose="jump" mood="excited" arms="up" />
      <NoSign cx={78} cy={24} />
    </ArtFrame>
  )
}

export const U8_ART: Record<string, ComponentType<WordArtProps>> = {
  'la-cocina': LaCocina,
  'el-bano': ElBano,
  'la-sala': LaSala,
  'el-cuarto': ElCuarto,
  'el-jardin': ElJardin,
  'el-garaje': ElGaraje,
  'el-comedor': ElComedor,
  'la-mesa': LaMesa,
  'la-silla': LaSilla,
  'la-puerta': LaPuerta,
  'la-ventana': LaVentana,
  'el-sofa': ElSofa,
  'la-escalera': LaEscalera,
  'la-television': LaTelevision,
  'el-libro': ElLibro,
  'el-juguete': ElJuguete,
  'la-lampara': LaLampara,
  'el-telefono': ElTelefono,
  'el-reloj': ElReloj,
  'el-espejo': ElEspejo,
  'el-computador': ElComputador,
  'la-tableta': LaTableta,
  'el-control-remoto': ElControlRemoto,
  'el-cargador': ElCargador,
  'el-internet': ElInternet,
  'los-audifonos': LosAudifonos,
  'recoge-tus-juguetes': RecogeTusJuguetes,
  'ordena-tu-cuarto': OrdenaTuCuarto,
  'cierra-la-puerta': CierraLaPuerta,
  'apaga-la-luz': ApagaLaLuz,
  'ven-a-cenar': VenACenar,
  'es-hora-de-dormir': EsHoraDeDormir,
  'no-saltes-en-la-cama': NoSaltesEnLaCama,
}
