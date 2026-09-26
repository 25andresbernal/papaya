// A React hook: gives a canned line right away, then swaps in the AI line if one arrives.

import { useEffect, useState } from 'react'
import { mascotLine, mascotLineAsync } from './mascot'
import type { MascotContext, MascotMoment } from './fallbacks'

export function useMascotLine(moment: MascotMoment, ctx: MascotContext = {}): string {
  // The ctx object changes identity every render, so we key on its values.
  const key = JSON.stringify(ctx)
  const [line, setLine] = useState(() => mascotLine(moment, ctx))

  useEffect(() => {
    let alive = true
    const parsed = JSON.parse(key) as MascotContext
    setLine(mascotLine(moment, parsed))
    void mascotLineAsync(moment, parsed).then((l) => {
      if (alive && l) setLine(l)
    })
    return () => {
      alive = false
    }
  }, [moment, key])

  return line
}
