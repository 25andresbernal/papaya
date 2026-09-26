// Canned mascot lines. These are what the buddy says when the AI is off or slow.
// Rule: 2 short sentences max, readable by a 7-year-old, warm, never "wrong".
// The AI layer (mascot.ts) picks from these first, then asks Claude for a fresher line.

import { pick } from '../utils/random'

export type MascotMoment =
  | 'welcome' // home screen, first open today
  | 'welcomeBack' // home screen, already played today
  | 'comeback' // home screen, missed some days
  | 'lessonStart' // the buddy introduces a lesson
  | 'correct' // right answer inside a lesson
  | 'wrong' // missed answer inside a lesson
  | 'combo' // combo milestone hit
  | 'lessonComplete' // lesson finished
  | 'perfect' // perfect lesson
  | 'streak' // streak grew today
  | 'levelUp' // hero leveled up
  | 'unlock' // unlocked a buddy, item, or game
  | 'noTickets' // tried to play with no tickets
  | 'practice' // starting a practice session

export interface MascotContext {
  /** The kid's name. */
  name?: string
  /** The buddy's name, like "Tico". */
  buddy?: string
  /** The buddy's Spanish catchphrase. */
  catchphrase?: string
  /** Lesson title, for lessonStart. */
  lessonTitle?: string
  /** The Spanish word involved, for correct or wrong. */
  word?: string
  /** The English meaning of that word. */
  meaning?: string
  streak?: number
  level?: number
  combo?: number
  /** Days since last play, for comeback. */
  daysAway?: number
}

const LINES: Record<MascotMoment, ((c: MascotContext) => string)[]> = {
  welcome: [
    (c) => `¡Hola, ${c.name}! Ready to learn some Spanish today?`,
    (c) => `Hi ${c.name}! Let's go win some papayas!`,
    (c) => `${c.catchphrase ?? '¡Vamos!'} A new lesson is waiting for you, ${c.name}.`,
    () => `Good to see you! One lesson keeps your streak alive.`,
  ],
  welcomeBack: [
    () => `You already played today. Want to play more?`,
    () => `Back for more? ¡Qué bien! Your tickets are waiting.`,
    (c) => `Nice work today, ${c.name}. Another lesson means more papayas!`,
  ],
  comeback: [
    (c) => `I missed you, ${c.name}! Let's play one quick lesson.`,
    () => `Welcome back! Your words are waiting for you.`,
    () => `¡Hola otra vez! Let's warm up with something easy.`,
  ],
  lessonStart: [
    (c) => `Let's learn ${c.lessonTitle ? `about ${c.lessonTitle.toLowerCase()}` : 'new words'}! Tap the right answer.`,
    (c) => `${c.catchphrase ?? '¡Vamos!'} Listen close and tap what you hear.`,
    () => `You can do this. Take your time and tap the answer.`,
  ],
  correct: [
    () => `¡Sí! That's right!`,
    () => `¡Muy bien! Keep going!`,
    () => `¡Excelente! You got it!`,
    () => `¡Perfecto! Nice one!`,
    () => `Yes! ¡Genial!`,
  ],
  wrong: [
    (c) => `Almost! "${c.word}" means "${c.meaning}". Let's try it again soon.`,
    (c) => `Good try! "${c.word}" is "${c.meaning}". You'll get it next time.`,
    (c) => `Not yet! Remember: "${c.word}" means "${c.meaning}".`,
  ],
  combo: [
    (c) => `${c.combo} in a row! You're on fire!`,
    (c) => `Wow, ${c.combo} right in a row! ¡Increíble!`,
    (c) => `Combo ${c.combo}! Keep it up!`,
  ],
  lessonComplete: [
    () => `Lesson done! You earned papayas and tickets!`,
    (c) => `Great job, ${c.name}! Go spend those papayas!`,
    () => `¡Lo lograste! You did it!`,
  ],
  perfect: [
    () => `PERFECT! Every single one right!`,
    (c) => `¡Perfecto, ${c.name}! Three crowns for you!`,
    () => `Not one miss! You are a Spanish star!`,
  ],
  streak: [
    (c) => `${c.streak} days in a row! Your streak is growing!`,
    (c) => `Day ${c.streak}! Come back tomorrow to keep it going!`,
    (c) => `🔥 ${c.streak} day streak! ¡Qué bien!`,
  ],
  levelUp: [
    (c) => `LEVEL ${c.level}! Your hero is getting stronger!`,
    (c) => `Level up! You are level ${c.level} now!`,
  ],
  unlock: [
    () => `You unlocked something new! Go check it out!`,
    () => `¡Nuevo! That's all yours now!`,
  ],
  noTickets: [
    () => `No tickets left! Finish a lesson to get more.`,
    () => `Tickets come from lessons. One quick lesson and you can play!`,
  ],
  practice: [
    () => `Practice time! Let's make your words stronger.`,
    () => `These are words you're still learning. You've got this!`,
  ],
}

/** A canned line for this moment. Always works, never calls the internet. */
export function fallbackLine(moment: MascotMoment, ctx: MascotContext = {}): string {
  const name = ctx.name?.trim() || 'friend'
  return pick(LINES[moment])({ ...ctx, name })
}
