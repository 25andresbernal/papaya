// Unit 4 word art: numbers, counting, and more/less/first/last words.
// Numbers 1 to 20 all share one helper (Num) so they look like one family:
// a big numeral on a colored tile, with that many small dots underneath.

import type { ComponentType } from 'react'
import {
  ArtFrame,
  Tile,
  Kid,
  Bubble,
  BigText,
  Highlight,
  INK,
  INK_SOFT,
  PAPAYA,
  LEAF,
  SKY,
  SUN,
  CORAL,
  CORAL_DARK,
  PURPLE,
  CREAM_DARK,
  GRAY,
  GRAY_DARK,
  PAPAYA_DARK,
  WHITE,
} from './primitives'
import type { WordArtProps } from './primitives'

/* ------------------------------ numbers ------------------------------ */

// The six tile colors a number's color cycles through, in order.
const NUM_COLORS = [PAPAYA, SKY, LEAF, SUN, CORAL, PURPLE]

/** Which of the six colors number n gets. */
function numColor(n: number): string {
  return NUM_COLORS[(n - 1) % NUM_COLORS.length]
}

/** Small white dots for a number: one row up to 10, two rows for 11 to 20. */
function NumDots({ n }: { n: number }) {
  const r = 3
  const gap = 8
  const row = (count: number, cy: number, key: string) => {
    const width = (count - 1) * gap
    const startX = 50 - width / 2
    return Array.from({ length: count }, (_, i) => (
      <circle key={`${key}${i}`} cx={startX + i * gap} cy={cy} r={r} fill={WHITE} />
    ))
  }
  if (n <= 10) return <>{row(n, 76, 'a')}</>
  return (
    <>
      {row(10, 68, 'a')}
      {row(n - 10, 79, 'b')}
    </>
  )
}

/**
 * The shared number picture: a big numeral high on a colored tile, plus
 * that many small dots underneath. Every uno..veinte component uses this.
 * Dots only show at 40px or bigger so they don't turn to mush when tiny.
 */
function Num({ n, color, size }: { n: number; color: string; size?: number }) {
  return (
    <>
      <Tile color={color} />
      <BigText text={String(n)} size={44} x={50} y={36} color={INK} />
      {(size ?? 64) >= 40 && <NumDots n={n} />}
    </>
  )
}

function numberArt(n: number): ComponentType<WordArtProps> {
  return function NumberArt(p: WordArtProps) {
    return (
      <ArtFrame {...p}>
        <Num n={n} color={numColor(n)} size={p.size} />
      </ArtFrame>
    )
  }
}

/* ------------------------------ podium (first..fifth) ------------------------------ */

/**
 * A little three-step podium with a medal badge showing the ordinal number.
 * Only "primero" (first) gets a kid standing on top.
 */
function Podium({ ordinal, showKid }: { ordinal: number; showKid?: boolean }) {
  return (
    <>
      <Tile color={CREAM_DARK} />
      {/* three steps: 2nd (left), 3rd (right), 1st (center, tallest) */}
      <rect x={12} y={64} width={24} height={24} rx={3} fill={GRAY} />
      <rect x={64} y={70} width={24} height={18} rx={3} fill={PAPAYA_DARK} />
      <rect x={36} y={50} width={28} height={38} rx={3} fill={SUN} />
      {showKid && <Kid cx={50} baseY={50} scale={0.55} arms="up" mood="excited" />}
      <circle cx={76} cy={24} r={13} fill={CORAL_DARK} />
      <BigText text={String(ordinal)} size={15} x={76} y={24} color={WHITE} />
    </>
  )
}

function ordinalArt(ordinal: number, showKid?: boolean): ComponentType<WordArtProps> {
  return function OrdinalArt(p: WordArtProps) {
    return (
      <ArtFrame {...p}>
        <Podium ordinal={ordinal} showKid={showKid} />
      </ArtFrame>
    )
  }
}

/* ------------------------------ the rest ------------------------------ */

/** cuántos hay: three apples and a bubble with a question mark. */
function CuantosHay(p: WordArtProps) {
  const apple = (cx: number) => (
    <g key={cx}>
      <rect x={cx - 1.5} y={45} width={3} height={7} fill={INK} />
      <circle cx={cx} cy={62} r={11} fill={CORAL} />
      <ellipse cx={cx + 6} cy={50} rx={5} ry={3} fill={LEAF} transform={`rotate(30 ${cx + 6} 50)`} />
    </g>
  )
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      {apple(28)}
      {apple(50)}
      {apple(72)}
      <Bubble x={30} y={6} w={40} h={26} tail="none">
        <BigText text="?" size={18} />
      </Bubble>
    </ArtFrame>
  )
}

/** contar: a kid points at three dots while a bubble counts them out. */
function Contar(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Kid cx={30} baseY={88} scale={0.9} shirt={SKY} arms="point" mood="happy" />
      <circle cx={62} cy={70} r={5} fill={LEAF} />
      <circle cx={72} cy={70} r={5} fill={SUN} />
      <circle cx={82} cy={70} r={5} fill={CORAL} />
      <Bubble x={48} y={8} w={42} h={26} tail="left">
        <BigText text="1 2 3" size={11} />
      </Bubble>
    </ArtFrame>
  )
}

/** más: a big plus on a leaf tile, with a small pile growing beside it. */
function Mas(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={LEAF} />
      <BigText text="+" size={56} x={38} y={50} color={WHITE} />
      <rect x={62} y={74} width={7} height={14} rx={2} fill={WHITE} />
      <rect x={71} y={68} width={7} height={20} rx={2} fill={WHITE} />
      <rect x={80} y={60} width={7} height={28} rx={2} fill={WHITE} />
    </ArtFrame>
  )
}

/** menos: a big minus sign on a coral tile. */
function Menos(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CORAL} />
      <BigText text="−" size={60} x={50} y={50} color={WHITE} />
    </ArtFrame>
  )
}

/** todos: five tiny kids in a row, everyone together. */
function Todos(p: WordArtProps) {
  const kids: Array<[number, string, 'short' | 'long' | 'curly' | 'bun' | 'ponytail']> = [
    [18, SKY, 'short'],
    [34, CORAL, 'long'],
    [50, SUN, 'curly'],
    [66, PURPLE, 'bun'],
    [82, LEAF, 'ponytail'],
  ]
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      {kids.map(([cx, shirt, hair]) => (
        <Kid key={cx} cx={cx} baseY={86} scale={0.45} shirt={shirt} hair={hair} mood="happy" />
      ))}
    </ArtFrame>
  )
}

/** nadie: an empty room with a faded, gray kid-shaped ghost. Nobody is really there. */
function Nadie(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <rect x={14} y={14} width={72} height={66} rx={6} fill="none" stroke={INK_SOFT} strokeWidth={4} />
      <g opacity={0.45}>
        <Kid cx={50} baseY={82} scale={0.95} skin={GRAY_DARK} shirt={GRAY_DARK} pants={GRAY_DARK} hairColor={GRAY_DARK} />
      </g>
    </ArtFrame>
  )
}

/** último: four dots in a row, the last one lit up, with a little finish flag. */
function Ultimo(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <circle cx={26} cy={60} r={7} fill={GRAY} />
      <circle cx={42} cy={60} r={7} fill={GRAY} />
      <circle cx={58} cy={60} r={7} fill={GRAY} />
      <Highlight cx={76} cy={60} r={8} color={PAPAYA} />
      <circle cx={76} cy={60} r={7} fill={PAPAYA_DARK} />
      <line x1={76} y1={30} x2={76} y2={52} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <path d="M 76 30 L 88 35 L 76 40 Z" fill={CORAL} />
    </ArtFrame>
  )
}

export const U4_ART: Record<string, ComponentType<WordArtProps>> = {
  uno: numberArt(1),
  dos: numberArt(2),
  tres: numberArt(3),
  cuatro: numberArt(4),
  cinco: numberArt(5),
  seis: numberArt(6),
  siete: numberArt(7),
  ocho: numberArt(8),
  nueve: numberArt(9),
  diez: numberArt(10),
  once: numberArt(11),
  doce: numberArt(12),
  trece: numberArt(13),
  catorce: numberArt(14),
  quince: numberArt(15),
  dieciseis: numberArt(16),
  diecisiete: numberArt(17),
  dieciocho: numberArt(18),
  diecinueve: numberArt(19),
  veinte: numberArt(20),
  'cuantos-hay': CuantosHay,
  contar: Contar,
  mas: Mas,
  menos: Menos,
  todos: Todos,
  nadie: Nadie,
  primero: ordinalArt(1, true),
  segundo: ordinalArt(2),
  tercero: ordinalArt(3),
  cuarto: ordinalArt(4),
  quinto: ordinalArt(5),
  ultimo: Ultimo,
}
