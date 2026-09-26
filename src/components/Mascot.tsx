// The kid's buddy character with a speech bubble.
// Buddies cheer, comfort, and explain. They live on the home screen and in lessons.
// The buddy is drawn with our own flat SVG art and can show a mood:
// happy, excited, thinking (calm), sad (pouting), mad (dramatic), or sleepy.

import { getCharacter } from '../data/characters'
import Buddy from './buddies'
import type { Mood } from './buddies'

export type MascotMood = Mood | 'thinking'

const SIZE_PX = { sm: 56, md: 96, lg: 150 }

/** Turn a mascot mood into a drawing mood. "thinking" is just a calm happy face. */
function toRigMood(mood: MascotMood): Mood {
  return mood === 'thinking' ? 'happy' : mood
}

export default function Mascot({
  buddyId,
  message,
  size = 'md',
  mood = 'happy',
  className = '',
  onTap,
}: {
  buddyId: string
  message?: string
  size?: 'sm' | 'md' | 'lg'
  mood?: MascotMood
  className?: string
  /** Optional: what happens when the kid taps the buddy. */
  onTap?: () => void
}) {
  const c = getCharacter(buddyId)
  const anim = { happy: 'animate-float', excited: 'animate-bounce-soft', thinking: '', sad: '', mad: 'animate-wiggle', sleepy: '' }[mood]

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <div
        className={`${anim} leading-none ${onTap ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
        aria-label={c.name}
        onClick={onTap}
        role={onTap ? 'button' : undefined}
      >
        <Buddy id={buddyId} mood={toRigMood(mood)} size={SIZE_PX[size]} />
      </div>
      {message && (
        <div className="relative bg-white rounded-bubble px-4 py-3 shadow-chunky-sm border-2 border-cream-dark max-w-xs animate-pop">
          <span className="absolute -left-2 bottom-4 w-4 h-4 bg-white border-l-2 border-b-2 border-cream-dark rotate-45" />
          <p className="font-body font-bold text-ink text-base leading-snug">{message}</p>
        </div>
      )}
    </div>
  )
}
