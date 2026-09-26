// The list of every mini-game component, by game id.
// "lazy" means the browser only downloads a game when the kid opens it.
// To add a game: make a file in this folder and add one line here,
// plus one entry in src/data/games.ts.

import { lazy } from 'react'
import type { ComponentType } from 'react'
import type { MiniGameProps } from './types'

export const GAME_COMPONENTS: Record<string, ComponentType<MiniGameProps>> = {
  pinata: lazy(() => import('./PinataGame')),
  memory: lazy(() => import('./MemoryGame')),
  feed: lazy(() => import('./FeedGame')),
  catch: lazy(() => import('./CatchGame')),
  paint: lazy(() => import('./PaintGame')),
  run: lazy(() => import('./RunGame')),
}
