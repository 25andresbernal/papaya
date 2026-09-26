// A speaker button that reads Spanish out loud. Put it next to every Spanish word.

import { sfx, speak } from '../audio/sound'

export default function SpeakButton({ text, size = 'md', className = '' }: { text: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const s = { sm: 'w-10 h-10 text-lg', md: 'w-14 h-14 text-2xl', lg: 'w-20 h-20 text-4xl' }[size]
  return (
    <button
      type="button"
      aria-label={`Hear ${text}`}
      className={`btn-chunky bg-sky text-white rounded-full ${s} flex items-center justify-center cursor-pointer ${className}`}
      onClick={() => {
        sfx.pop()
        speak(text)
      }}
    >
      🔊
    </button>
  )
}
