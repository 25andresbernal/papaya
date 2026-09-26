// Reference pictures. Copy this style exactly when drawing new word art.
// These four show the four kinds of picture in the set:
//   1. a person (mamá)          -> <Kid/> with different hair and colors
//   2. a thing (el lápiz)        -> flat shapes on a tile
//   3. a feeling (feliz)         -> <Kid/> with a rig mood, big and close
//   4. something you say (hola)  -> <Kid/> waving plus a <Bubble/> with a glyph
// They are also used as the real drawings for those four words.

import { ArtFrame, Tile, Ground, Kid, Bubble, BigText, CREAM_DARK, SUN, SUN_DARK, ROSE, INK, CORAL, SEED, LEAF, SKY, WHITE } from './primitives'
import type { WordArtProps } from './primitives'

/** mamá: a grown-up with long hair, a rose shirt, and a warm smile. */
export function Mama(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={50} cy={88} rx={20} />
      <Kid cx={50} baseY={88} scale={1.05} hair="long" hairColor={SEED} shirt={ROSE} pants={SKY} mood="happy" arms="down" />
      {/* tiny earrings so she reads as a grown-up at small sizes */}
      <circle cx={35} cy={38} r={1.8} fill={SUN} />
      <circle cx={65} cy={38} r={1.8} fill={SUN} />
    </ArtFrame>
  )
}

/** el lápiz: a big yellow pencil lying at an angle. */
export function Lapiz(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <g transform="rotate(-40 50 50)">
        {/* body */}
        <rect x={22} y={42} width={50} height={16} rx={2} fill={SUN} />
        <rect x={22} y={42} width={50} height={5} fill={SUN_DARK} opacity={0.5} />
        {/* wood tip and lead */}
        <path d="M 72 42 L 86 50 L 72 58 Z" fill="#E8C39E" />
        <path d="M 80 46 L 86 50 L 80 54 Z" fill={INK} />
        {/* eraser and metal band */}
        <rect x={14} y={42} width={8} height={16} rx={2} fill={CORAL} />
        <rect x={20} y={42} width={4} height={16} fill="#B8B2A7" />
      </g>
    </ArtFrame>
  )
}

/** feliz: a kid up close with the happiest face we have. */
export function Feliz(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={SUN} />
      <Kid cx={50} baseY={118} scale={1.5} hair="curly" shirt={LEAF} mood="excited" arms="up" />
    </ArtFrame>
  )
}

/** hola: a kid waving, with a bubble that shows a little wave. */
export function Hola(p: WordArtProps) {
  return (
    <ArtFrame {...p}>
      <Tile color={CREAM_DARK} />
      <Ground cx={40} cy={90} rx={18} />
      <Kid cx={40} baseY={90} scale={0.95} hair="short" shirt={SKY} mood="excited" arms="wave" />
      <Bubble x={52} y={8} w={40} h={30} fill={WHITE} tail="left">
        <BigText text="¡Hola!" size={12} />
      </Bubble>
    </ArtFrame>
  )
}
