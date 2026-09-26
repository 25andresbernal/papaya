// The kid's buddy character with a speech bubble.
// Buddies cheer, comfort, and explain. They live on the home screen and in lessons.

import { getCharacter } from '../data/characters'

export default function Mascot({
  buddyId,
  message,
  size = 'md',
  mood = 'happy',
  className = '',
}: {
  buddyId: string
  message?: string
  size?: 'sm' | 'md' | 'lg'
  mood?: 'happy' | 'excited' | 'thinking' | 'sad'
  className?: string
}) {
  const c = getCharacter(buddyId)
  const sizeClass = { sm: 'text-5xl', md: 'text-7xl', lg: 'text-9xl' }[size]
  const anim = { happy: 'animate-float', excited: 'animate-bounce-soft', thinking: '', sad: '' }[mood]

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <div className={`${sizeClass} ${anim} leading-none drop-shadow-md`} aria-label={c.name}>
        {c.emoji}
      </div>
      {message && (
        <div className="relative bg-white rounded-bubble px-4 py-3 shadow-chunky-sm max-w-xs animate-pop">
          <span className="absolute -left-2 bottom-4 w-4 h-4 bg-white rotate-45" />
          <p className="font-body font-bold text-ink text-base leading-snug">{message}</p>
        </div>
      )}
    </div>
  )
}
