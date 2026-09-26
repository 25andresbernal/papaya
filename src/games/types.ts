// Every mini-game is a React component that gets these props.
// The Arcade screen spends the ticket, then shows the game.
// When the game ends, it calls onFinish with the score.

import type { Word } from '../types'

export interface MiniGameProps {
  /** Words the kid has already learned, so the game can use Spanish they know. */
  knownWords: Word[]
  /** Call this when the game is over. score is a whole number, bigger is better. */
  onFinish: (result: { score: number; coinsEarned: number }) => void
  /** Call this if the kid quits early. No score is saved. */
  onQuit: () => void
  /** The kid's buddy character emoji, for flavor. */
  buddyEmoji: string
}
