// Flip & Match! 🔄
// Flip two cards at a time. Match the Spanish word with its English meaning.
// Beat a level and the next one has more cards and harder words.
// Tap any face-up card again to hear the Spanish out loud.
//
// How it gets tougher, level by level:
//   1. More pairs: 3, then 4, 6, 8, and 10.
//   2. Newer words: the first levels use words from the first lesson (hola, hi).
//      Later levels move through everything the kid has learned, then into
//      words they have not learned yet, so the game is also a sneak peek.
//   3. Fewer hints: early levels show a picture with the English word and give
//      a quick peek at all the cards. Later levels show English only, no peek.

import { useEffect, useRef, useState } from 'react'
import type { Word } from '../types'
import type { MiniGameProps } from './types'
import { sfx, speak } from '../audio/sound'
import { shuffle } from '../utils/random'
import { WORDS } from '../data/words'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import Confetti from '../components/Confetti'

/** How many pairs on the board at each level. After the list ends, it stays at the last number. */
const PAIRS_PER_LEVEL = [3, 4, 6, 8, 10]
/** The game ends after this many levels. One ticket, one run. */
const MAX_LEVEL = 8
/** How long a wrong pair stays face up before flipping back. */
const FLIP_BACK_MS = 800
/** Early levels show every card for a moment so the kid can plan. */
const PEEK_MS = 1800

interface MemCard {
  id: string
  /** Links exactly two cards together. Unique per pair. */
  pairKey: string
  kind: 'es' | 'en'
  word: Word
}

function pairsForLevel(level: number): number {
  return PAIRS_PER_LEVEL[Math.min(level, PAIRS_PER_LEVEL.length) - 1]
}

/** Levels 1 and 2 show a picture with the English. Later levels show the English only. */
function showsPicture(level: number): boolean {
  return level <= 2
}

/** Levels 1 to 3 give a peek at all the cards. Later levels do not. */
function hasPeek(level: number): boolean {
  return level <= 3
}

/**
 * Build the word list for the whole run, in learning order:
 * words the kid knows first (in curriculum order), then words they have not seen yet.
 * Sentence frames with blanks are skipped because they do not fit on a card.
 */
function buildWordPool(knownWords: Word[]): Word[] {
  const knownIds = new Set(knownWords.map((w) => w.id))
  const usable = WORDS.filter((w) => !w.es.includes('___'))
  const known = usable.filter((w) => knownIds.has(w.id))
  const unknown = usable.filter((w) => !knownIds.has(w.id))
  const pool = [...known, ...unknown]
  // Tiny safety net so the game never has an empty board.
  return pool.length > 0 ? pool : [{ id: 'hola', es: 'hola', en: 'hi', emoji: '👋' }]
}

/** Words for one level: a slice of the pool that moves forward as the levels go up. */
function wordsForLevel(pool: Word[], level: number): Word[] {
  let start = 0
  for (let l = 1; l < level; l++) start += pairsForLevel(l)
  const count = pairsForLevel(level)
  const picked: Word[] = []
  for (let i = 0; i < count; i++) picked.push(pool[(start + i) % pool.length])
  // Shuffle a little so two runs are not identical, but keep the level's word set.
  return shuffle(picked)
}

function buildDeck(words: Word[]): MemCard[] {
  const cards: MemCard[] = []
  words.forEach((w, i) => {
    const pairKey = `${w.id}-${i}`
    cards.push({ id: `${pairKey}-es`, pairKey, kind: 'es', word: w })
    cards.push({ id: `${pairKey}-en`, pairKey, kind: 'en', word: w })
  })
  return shuffle(cards)
}

/** Grid columns and text size depend on how many cards are on the board. */
function boardStyle(cardCount: number): { cols: string; text: string; emoji: string } {
  if (cardCount <= 6) return { cols: 'grid-cols-3', text: 'text-lg', emoji: 'text-4xl' }
  if (cardCount <= 8) return { cols: 'grid-cols-4', text: 'text-base', emoji: 'text-3xl' }
  if (cardCount <= 12) return { cols: 'grid-cols-4', text: 'text-sm', emoji: 'text-3xl' }
  if (cardCount <= 16) return { cols: 'grid-cols-4', text: 'text-xs', emoji: 'text-2xl' }
  return { cols: 'grid-cols-4', text: 'text-[11px]', emoji: 'text-xl' }
}

type Phase = 'countdown' | 'peek' | 'play' | 'levelDone' | 'end'

export default function FlipGame({ knownWords, onFinish, onQuit, buddyEmoji }: MiniGameProps) {
  const [pool] = useState<Word[]>(() => buildWordPool(knownWords))
  const [level, setLevel] = useState(1)
  const [deck, setDeck] = useState<MemCard[]>(() => buildDeck(wordsForLevel(pool, 1)))

  const [phase, setPhase] = useState<Phase>('countdown')
  const [count, setCount] = useState(3)
  const [flipped, setFlipped] = useState<string[]>([])
  const [matchedPairKeys, setMatchedPairKeys] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [levelBonus, setLevelBonus] = useState(0)
  const [lock, setLock] = useState(false)
  const finishedRef = useRef(false)

  const pairCount = deck.length / 2

  // "3, 2, 1, ¡Vamos!" before the first level.
  useEffect(() => {
    if (phase !== 'countdown') return
    if (count <= 0) {
      startLevel()
      return
    }
    sfx.tick()
    const t = setTimeout(() => setCount((c) => c - 1), 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, count])

  // The peek: every card face up for a moment, then they all flip down.
  useEffect(() => {
    if (phase !== 'peek') return
    const t = setTimeout(() => {
      sfx.whoosh()
      setPhase('play')
    }, PEEK_MS)
    return () => clearTimeout(t)
  }, [phase])

  // All pairs found? Give a bonus for using few moves, then show the level screen.
  useEffect(() => {
    if (phase !== 'play' || matchedPairKeys.length < pairCount) return
    // A perfect run is exactly pairCount moves. Every extra move costs a little.
    const extraMoves = Math.max(0, moves - pairCount)
    const bonus = Math.max(0, 50 * pairCount - 10 * extraMoves)
    setLevelBonus(bonus)
    setScore((s) => s + bonus)
    sfx.fanfare()
    setPhase('levelDone')
  }, [matchedPairKeys, moves, pairCount, phase])

  // Hand the score back to the arcade once, and only once.
  useEffect(() => {
    if (phase !== 'end' || finishedRef.current) return
    finishedRef.current = true
    const t = setTimeout(() => {
      const coinsEarned = Math.min(30, Math.round(score / 40))
      onFinish({ score, coinsEarned })
    }, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function startLevel() {
    setFlipped([])
    setMatchedPairKeys([])
    setMoves(0)
    setLock(false)
    setPhase(hasPeek(level) ? 'peek' : 'play')
  }

  function nextLevel() {
    if (level >= MAX_LEVEL) {
      setPhase('end')
      return
    }
    const next = level + 1
    sfx.levelUp()
    setLevel(next)
    setDeck(buildDeck(wordsForLevel(pool, next)))
    setFlipped([])
    setMatchedPairKeys([])
    setMoves(0)
    setLock(false)
    setPhase(hasPeek(next) ? 'peek' : 'play')
  }

  function tapCard(card: MemCard) {
    if (phase !== 'play') return
    const isMatched = matchedPairKeys.includes(card.pairKey)
    const isFaceUp = isMatched || flipped.includes(card.id)

    // Tapping a card that is already face up reads the Spanish out loud.
    if (isFaceUp) {
      sfx.pop()
      speak(card.word.es)
      return
    }
    if (lock || flipped.length >= 2) return

    sfx.pop()
    speak(card.word.es)
    const next = [...flipped, card.id]
    setFlipped(next)
    if (next.length !== 2) return

    setMoves((m) => m + 1)
    const first = deck.find((c) => c.id === next[0])
    const second = deck.find((c) => c.id === next[1])
    if (!first || !second) return

    if (first.pairKey === second.pairKey) {
      setTimeout(() => sfx.correct(), 150)
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

  const style = boardStyle(deck.length)
  const picture = showsPicture(level)

  return (
    <div className="min-h-screen w-full max-w-md mx-auto px-4 flex flex-col">
      <style>{`
        .flip-card { perspective: 600px; }
        .flip-inner { position: relative; width: 100%; height: 100%; transition: transform 0.35s ease; transform-style: preserve-3d; }
        .flip-inner.up { transform: rotateY(180deg); }
        .flip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 0.75rem; padding: 0.25rem; }
        .flip-front { transform: rotateY(180deg); }
      `}</style>

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
          Level {level} · Score {score}
        </div>
      </div>

      <div className="bg-white rounded-bubble shadow-chunky p-4 flex-1 flex flex-col items-center">
        {phase === 'countdown' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="text-6xl">{buddyEmoji}</div>
            <div key={count} className="font-display font-black text-5xl text-papaya animate-pop">
              {count > 0 ? count : '¡Vamos!'}
            </div>
            <div className="text-ink-soft font-bold">Match the Spanish with the English!</div>
          </div>
        )}

        {(phase === 'peek' || phase === 'play') && (
          <div className="w-full flex-1 flex flex-col">
            <div className="flex items-center justify-between text-ink-soft font-bold mb-2 text-sm">
              <span>
                Pairs {matchedPairKeys.length}/{pairCount}
              </span>
              <span>{phase === 'peek' ? 'Look fast! 👀' : `Moves: ${moves}`}</span>
            </div>
            <div className={`grid ${style.cols} gap-2`}>
              {deck.map((card) => {
                const isMatched = matchedPairKeys.includes(card.pairKey)
                const isUp = phase === 'peek' || isMatched || flipped.includes(card.id)
                return (
                  <button
                    key={card.id}
                    type="button"
                    data-pair={card.pairKey}
                    data-kind={card.kind}
                    data-up={isUp ? 'true' : 'false'}
                    aria-label={isUp ? `${card.word.es}, tap to hear it` : 'Face-down card'}
                    onClick={() => tapCard(card)}
                    className="flip-card aspect-[3/4] cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className={`flip-inner ${isUp ? 'up' : ''}`}>
                      {/* The back of the card: a papaya. */}
                      <div className="flip-face flip-back bg-papaya-light shadow-chunky-sm">
                        <span className={style.emoji}>🥭</span>
                      </div>
                      {/* The front of the card: Spanish, or English (with a picture on easy levels). */}
                      <div
                        className={`flip-face flip-front shadow-chunky-sm ${
                          isMatched ? 'bg-leaf text-white' : card.kind === 'es' ? 'bg-sun' : 'bg-sky text-white'
                        }`}
                      >
                        {card.kind === 'es' ? (
                          <span className={`font-display font-bold ${style.text} leading-tight text-center break-words w-full`}>
                            {card.word.es}
                          </span>
                        ) : (
                          <>
                            {picture && <span className={style.emoji}>{card.word.emoji}</span>}
                            <span className={`font-display font-bold ${style.text} leading-tight text-center break-words w-full`}>
                              {card.word.en}
                            </span>
                          </>
                        )}
                        {isUp && <span className="text-[10px] opacity-70 mt-0.5">🔊</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <ProgressBar value={matchedPairKeys.length} max={pairCount} color="bg-leaf" className="mt-3" />
            <p className="text-center text-xs text-ink-soft mt-2">Tap a face-up card to hear it.</p>
          </div>
        )}

        {phase === 'levelDone' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">
            <Confetti count={40} />
            <div className="text-6xl animate-bounce-soft">{buddyEmoji}</div>
            <div className="font-display font-black text-3xl text-papaya">Level {level} done!</div>
            <div className="font-display font-bold text-lg text-ink-soft">
              {moves === pairCount ? 'Perfect memory! ' : ''}Bonus +{levelBonus}
            </div>
            <div className="font-display font-bold text-2xl text-leaf-dark">Score {score}</div>
            {level < MAX_LEVEL ? (
              <>
                <Button color="leaf" size="lg" full onClick={nextLevel}>
                  Next level ({pairsForLevel(level + 1)} pairs)
                </Button>
                <Button color="white" size="md" full onClick={() => setPhase('end')}>
                  Stop here and keep my score
                </Button>
              </>
            ) : (
              <Button color="leaf" size="lg" full onClick={() => setPhase('end')}>
                You beat every level!
              </Button>
            )}
          </div>
        )}

        {phase === 'end' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="text-6xl animate-pop">🃏</div>
            <div className="font-display font-black text-3xl text-papaya">Done!</div>
            <div className="font-display font-bold text-xl text-ink-soft">Score {score}</div>
          </div>
        )}
      </div>
    </div>
  )
}
