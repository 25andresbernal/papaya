// This file holds the "shapes" of all the things in Papaya.
// A shape tells the computer what pieces something has.
// For example, a Word has Spanish, English, and a picture.
// Every other file imports these shapes so we all agree on them.

/* ------------------------------------------------------------------ */
/* Learning content                                                    */
/* ------------------------------------------------------------------ */

/** One Spanish word or short phrase the kid can learn. */
export interface Word {
  /** Unique id like "hola" or "buenos-dias". No spaces. */
  id: string
  /** The Spanish, with accents: "mamá". */
  es: string
  /** The English: "mom". */
  en: string
  /** A single emoji that stands in for a picture: "👩". */
  emoji: string
  /** Optional simple hint for a 7-year-old. Keep it short. */
  hint?: string
  /** A short example sentence in Spanish, optional. */
  example?: string
  /** Same sentence in English. */
  exampleEn?: string
  /** Is this a whole phrase (like "buenas noches") instead of a word? */
  phrase?: boolean
}

/** A lesson is a small set of words taught together. About 3 minutes. */
export interface Lesson {
  id: string
  /** Kid-facing title: "Say hi". */
  title: string
  /** Ids of the Words taught here. */
  wordIds: string[]
  /** Optional: review words from earlier lessons mixed in. */
  reviewWordIds?: string[]
}

/** A unit is a group of lessons about one topic, like "Family". */
export interface Unit {
  id: string
  title: string
  /** Big emoji for the unit badge on the path. */
  emoji: string
  /** One short, kid-readable line: "Meet your family in Spanish." */
  description: string
  /** Theme color name from our palette: "papaya" | "sky" | "leaf" | "sun" | "coral". */
  color: UnitColor
  lessons: Lesson[]
}

export type UnitColor = 'papaya' | 'sky' | 'leaf' | 'sun' | 'coral'

/* ------------------------------------------------------------------ */
/* Exercises inside a lesson                                           */
/* ------------------------------------------------------------------ */

export type ExerciseKind =
  | 'pickSpanish' // See English + picture, tap the Spanish word (4 choices)
  | 'pickEnglish' // See Spanish, tap the English word or picture (4 choices)
  | 'listenTap' // Hear Spanish (TTS), tap the matching picture (4 choices)
  | 'matchPairs' // Tap pairs: Spanish on one side, English on the other
  | 'orderWords' // Put the words of a short phrase in order
  | 'trueFalse' // "gato = dog?" Tap YES or NO

export interface Choice {
  wordId: string
  label: string
  emoji?: string
}

export interface BaseExercise {
  id: string
  kind: ExerciseKind
  /** The word this exercise is really testing. Used for word strength. */
  targetWordId: string
}

export interface PickExercise extends BaseExercise {
  kind: 'pickSpanish' | 'pickEnglish' | 'listenTap'
  /** The text shown on top. For listenTap this is empty and we play audio. */
  prompt: string
  promptEmoji?: string
  choices: Choice[]
  correctWordId: string
}

export interface MatchPairsExercise extends BaseExercise {
  kind: 'matchPairs'
  /** 3 to 5 words. The UI shuffles both columns. */
  pairs: { wordId: string; es: string; en: string; emoji: string }[]
}

export interface OrderWordsExercise extends BaseExercise {
  kind: 'orderWords'
  /** The English meaning shown as the prompt. */
  prompt: string
  /** The correct Spanish words in order. */
  correctOrder: string[]
  /** Correct words plus 1 or 2 extra distractors, shuffled. */
  tiles: string[]
}

export interface TrueFalseExercise extends BaseExercise {
  kind: 'trueFalse'
  es: string
  en: string
  emoji: string
  isTrue: boolean
}

export type Exercise =
  | PickExercise
  | MatchPairsExercise
  | OrderWordsExercise
  | TrueFalseExercise

/** What happened on one exercise. */
export interface ExerciseResult {
  exerciseId: string
  wordId: string
  correct: boolean
  /** How long the kid took, in milliseconds. */
  ms: number
}

/** Summary of a whole finished lesson. */
export interface LessonSummary {
  lessonId: string
  unitId: string
  total: number
  correct: number
  perfect: boolean
  /** Longest run of correct answers in a row. */
  bestCombo: number
  xpEarned: number
  coinsEarned: number
  ticketsEarned: number
  /** Word ids that were missed at least once. */
  missedWordIds: string[]
  /** Did this lesson keep the streak alive today? */
  streakExtended: boolean
  /** Hero level before and after, so we can celebrate a level up. */
  levelBefore: number
  levelAfter: number
  /** How long the lesson took, in milliseconds. 0 if not timed. */
  timeMs: number
  /** The kid's fastest time on this lesson, after this run. */
  bestTimeMs: number
  /** Was this run a new personal best (or the first timed run)? */
  newBestTime: boolean
}

/* ------------------------------------------------------------------ */
/* Story books                                                         */
/* ------------------------------------------------------------------ */

/** One page of a picture book: a Spanish line, its English, and a picture. */
export interface StoryPage {
  /** The Spanish sentence, 4 to 8 words, with accents. */
  es: string
  /** The same sentence in simple English. */
  en: string
  /** Word id whose drawing is the big picture on this page. */
  artWordId: string
  /** Optional second drawing shown smaller next to the first. */
  artWordId2?: string
  /** Optional tile color for the page background: 'papaya' | 'sky' | 'leaf' | 'sun' | 'coral'. */
  color?: UnitColor
}

/** A four-choice question asked after the last page. */
export interface StoryQuestion {
  es: string
  en: string
  /** Four answers. Each has Spanish and English. */
  choices: { es: string; en: string; artWordId?: string }[]
  correctIndex: number
}

/** A short bilingual picture book. Unlocks with a unit. */
export interface Story {
  id: string
  /** Spanish title: "A comer". */
  title: string
  /** English title: "Time to eat". */
  titleEn: string
  /** Unit that must have at least one finished lesson before the book opens. */
  unitId: string
  /** Word id whose drawing is the cover. */
  coverWordId: string
  /** One kid-readable line about the book. */
  blurb: string
  pages: StoryPage[]
  question: StoryQuestion
}

/* ------------------------------------------------------------------ */
/* Rewards: characters, shop items, mini-games                         */
/* ------------------------------------------------------------------ */

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

/** A collectible character the kid can unlock and pick as their buddy. */
export interface Character {
  id: string
  /** Spanish name and English nickname: "Tico the toucan". */
  name: string
  /** Emoji used as the character's picture. */
  emoji: string
  rarity: Rarity
  /** Coins (papayas) to unlock. 0 means free starter. */
  cost: number
  /** Or unlock by finishing this unit id (optional gate). */
  requiresUnitId?: string
  /** A one-line fun fact a 7-year-old can read. */
  blurb: string
  /** Where this animal lives in Colombia, for flavor. */
  home: string
  /** A Spanish catchphrase the character says: "¡Vamos!" */
  catchphrase: string
}

export type ShopSlot = 'hat' | 'glasses' | 'cape' | 'pet' | 'background'

/** A cosmetic item for the hero. Only cosmetic. Never pay to win. */
export interface ShopItem {
  id: string
  name: string
  emoji: string
  slot: ShopSlot
  cost: number
  rarity: Rarity
}

/** A mini-game the kid can unlock and play with tickets. */
export interface MiniGameDef {
  id: string
  title: string
  emoji: string
  /** One short line a kid can read. */
  description: string
  /** Coins (papayas) to unlock forever. */
  unlockCost: number
  /** Must finish this unit before it can be bought (optional). */
  requiresUnitId?: string
  /** Tickets spent per play. Usually 1. */
  ticketCost: number
  /** Does this game teach Spanish while you play, or is it pure fun? */
  usesSpanish: boolean
}

/* ------------------------------------------------------------------ */
/* Player state (saved in the browser)                                 */
/* ------------------------------------------------------------------ */

/** How well the kid knows one word. Higher box = stronger. */
export interface WordStat {
  /** Leitner box 0 to 5. 0 = brand new or just missed. 5 = mastered. */
  box: number
  timesSeen: number
  timesCorrect: number
  timesWrong: number
  /** When we last practiced it, as a timestamp. */
  lastSeen: number
  /** When it is "due" for review, as a timestamp. */
  due: number
}

export interface HeroLook {
  /** Hero color choice: a hex string. */
  color: string
  /** Equipped shop items by slot. */
  equipped: Partial<Record<ShopSlot, string>>
}

export interface PlayerState {
  /** Version so we can safely change the shape later. */
  version: number
  /** Name the kid typed. */
  name: string
  /** Has the kid finished onboarding? */
  onboarded: boolean
  /** The character id they picked as their buddy. */
  buddyId: string
  hero: HeroLook

  xp: number
  coins: number
  tickets: number

  /** Daily streak count. */
  streak: number
  /** Longest streak ever. */
  bestStreak: number
  /** Streak freezes stored (max 2). */
  streakFreezes: number
  /** "YYYY-MM-DD" of the last day a lesson was completed. */
  lastPlayDate: string | null
  /** "YYYY-MM-DD" of the last day the daily chest was opened. */
  lastChestDate: string | null
  /** How many lessons finished today (for daily quests). */
  lessonsToday: number
  /** Total lessons finished ever. */
  lessonsCompleted: number

  /** Lesson ids finished at least once. */
  completedLessonIds: string[]
  /** Best score (0 to 3 crowns) per lesson id. */
  crowns: Record<string, number>
  /** Word learning stats keyed by word id. */
  words: Record<string, WordStat>
  /** Fastest finish per lesson id, in milliseconds. Race yourself! */
  lessonBestMs: Record<string, number>
  /** How many units the placement game skipped the kid past. 0 = started at the beginning. */
  placementUnit: number

  unlockedCharacterIds: string[]
  ownedItemIds: string[]
  unlockedGameIds: string[]
  /** High score per mini-game id. */
  gameHighScores: Record<string, number>

  /** Settings the parent or kid can change. */
  settings: {
    sound: boolean
    music: boolean
    /** Read the Spanish out loud with the browser's voice. */
    speak: boolean
    /** Per-question countdown for older kids. Off by default. */
    timer: boolean
    /** Show the race stopwatch during lessons. On by default. */
    raceClock: boolean
    /** Chosen Spanish voice (voiceURI), or null for the app's best guess. */
    voiceEs: string | null
    /** Chosen English voice (voiceURI), or null for the app's best guess. */
    voiceEn: string | null
  }
}
