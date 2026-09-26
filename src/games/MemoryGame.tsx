// Match Cards! 🃏
// Flip two cards at a time. Find the Spanish word that matches its picture.
// Fewer moves = a bigger bonus at the end.

import { useEffect, useRef, useState } from 'react'
import type { Word } from '../types'
import type { MiniGameProps } from './types'
import { sfx, speak } from '../audio/sound'
import { sample, shuffle } from '../utils/random'
import ProgressBar from '../components/ProgressBar'

const PAIR_COUNT = 6
const FLIP_BACK_MS = 700

interface MemCard {
  id: string
  // pairKey links exactly two cards together. It is unique per pair,
  // even if the same word had to be reused because we don't know many words yet.
  pairKey: string
  kind: 'es' | 'pic'
  word: Word
}

// Pick 6 words to build pairs from. If the kid only knows a few words,
// we repeat some so the board always has 6 pairs.
function pickSixWords(words: Word[]): Word[] {
  if (words.length >= PAIR_COUNT) return sample(words, PAIR_COUNT)
  const result: Word[] = []
  for (let i = 0; result.length < PAIR_COUNT; i++) {
    result.push(words[i % words.length])
  }
  return result
}

function buildDeck(words: Word[]): MemCard[] {
  const six = pickSixWords(words)
  const cards: MemCard[] = []
  six.forEach((w, i) => {
    const pairKey = `${w.id}-${i}`
    cards.push({ id: `${pairKey}-es`, pairKey, kind: 'es', word: w })
    cards.push({ id: `${pairKey}-pic`, pairKey, kind: 'pic', word: w })
  })
  return shuffle(cards)
}

export default function MemoryGame({ knownWords, onFinish, onQuit, buddyEmoji }: MiniGameProps) {
  const words = knownWords.length > 0 ? knownWords : [{ id: 'hola', es: 'hola', en: 'hi', emoji: '👋' }]
  const [deck] = useState<MemCard[]>(() => buildDeck(words))

  const [phase, setPhase] = useState<'countdown' | 'play' | 'end'>('countdown')
  const [count, setCount] = useState(3)
  const [flipped, setFlipped] = useState<string[]>([])
  const [matchedPairKeys, setMatchedPairKeys] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [lock, setLock] = useState(false)

  const bonusAppliedRef = useRef(false)

  // "3, 2, 1, Ready?" before the cards can be flipped.
  useEffect(() => {
    if (phase !== 'countdown') return
    if (count <= 0) {
      setPhase('play')
      return
    }
    sfx.tick()
    const t = setTimeout(() => setCount((c) => c - 1), 700)
    return () => clearTimeout(t)
  }, [phase, count])

  // All 6 pairs found? Add the move bonus and finish up.
  useEffect(() => {
    if (phase !== 'play' || matchedPairKeys.length < PAIR_COUNT || bonusAppliedRef.current) return
    bonusAppliedRef.current = true
    const bonus = Math.max(0, 300 - 15 * moves)
    setScore((s) => s + bonus)
    setPhase('end')
  }, [matchedPairKeys, moves, phase])

  // Show "Done!" for a moment, then hand the score back to the arcade screen.
  useEffect(() => {
    if (phase !== 'end') return
    const t = setTimeout(() => {
      const coinsEarned = Math.min(30, Math.round(score / 10))
      onFinish({ score, coinsEarned })
    }, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function flip(card: MemCard) {
    if (lock || phase !== 'play') return
    if (flipped.includes(card.id) || matchedPairKeys.includes(card.pairKey)) return
    if (flipped.length >= 2) return

    sfx.pop()
    const next = [...flipped, card.id]
    setFlipped(next)
    if (next.length !== 2) return

    setMoves((m) => m + 1)
    const [firstId, secondId] = next
    const first = deck.find((c) => c.id === firstId)
    const second = deck.find((c) => c.id === secondId)
    if (!first || !second) return

    if (first.pairKey === second.pairKey) {
      sfx.correct()
      speak(first.word.es)
      setScore((s) => s + 100)
      setMatchedPairKeys((m) => [...m, first.pairKey])
      setFlipped([])
    } else {
      setLock(true)
      sfx.wrong()
      setTimeout(() => {
        setFlipped([])
        setLock(false)
      }, FLIP_BACK_MS)
    }
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 flex flex-col">
      <div className="pt-4 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            onQuit()
          }}
          className="text-sm font-bold text-white/80 bg-black/20 rounded-full px-3 py-1"
        >
          Quit
        </button>
        <div className="font-display font-bold text-white text-base">
          Pairs {matchedPairKeys.length}/{PAIR_COUNT} · Score {score}
        </div>
      </div>

      <div className="bg-white rounded-bubble shadow-chunky p-4 flex-1 flex flex-col items-center">
        {phase === 'countdown' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="text-6xl">{buddyEmoji}</div>
            <div key={count} className="font-display font-black text-5xl text-papaya animate-pop">
              {count > 0 ? count : '¡Vamos!'}
            </div>
            <div className="text-ink-soft font-bold">Ready?</div>
          </div>
        )}

        {phase === 'play' && (
          <div className="w-full flex-1 flex flex-col">
            <div className="text-center text-ink-soft font-bold mb-2">Moves: {moves}</div>
            <div className="grid grid-cols-4 gap-2 flex-1">
              {deck.map((card) => {
                const isMatched = matchedPairKeys.includes(card.pairKey)
                const isUp = isMatched || flipped.includes(card.id)
                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={isUp}
                    onClick={() => flip(card)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1
                      ${isUp ? 'bg-cream animate-pop' : 'bg-papaya-light'}
                      ${isMatched ? 'ring-4 ring-leaf' : ''}`}
                  >
                    {isUp ? (
                      card.kind === 'es' ? (
                        <span className="font-display font-bold text-xs text-seed leading-tight text-center">
                          {card.word.es}
                        </span>
                      ) : (
                        <>
                          <span className="text-2xl">{card.word.emoji}</span>
                          <span className="text-[10px] font-bold text-ink-soft">{card.word.en}</span>
                        </>
                      )
                    ) : (
                      <span className="text-2xl">🥭</span>
                    )}
                  </button>
                )
              })}
            </div>
            <ProgressBar
              value={matchedPairKeys.length}
              max={PAIR_COUNT}
              color="bg-leaf"
              className="mt-3"
            />
          </div>
        )}

        {phase === 'end' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="text-6xl animate-pop">🃏</div>
            <div className="font-display font-black text-3xl text-papaya">Done!</div>
          </div>
        )}
      </div>
    </div>
  )
}
