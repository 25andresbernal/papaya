// A big happy moment: an emoji that pops in, a title, and confetti.
// Use it for level ups, unlocks, and streak milestones.

import { useEffect } from 'react'
import Confetti from './Confetti'
import Button from './Button'
import Modal from './Modal'
import Pic from './Pic'
import { sfx } from '../audio/sound'

export default function Celebration({
  emoji,
  title,
  subtitle,
  buttonLabel = 'Yay!',
  onDone,
  sound = 'fanfare',
}: {
  emoji: string
  title: string
  subtitle?: string
  buttonLabel?: string
  onDone: () => void
  sound?: 'fanfare' | 'levelUp' | 'unlock' | 'streak' | 'chest' | 'none'
}) {
  useEffect(() => {
    if (sound !== 'none') sfx[sound]()
  }, [sound])

  return (
    <>
      <Confetti />
      <Modal onClose={onDone}>
        <div className="mb-3 flex justify-center">
          <Pic emoji={emoji} size={88} className="animate-bounce-soft" label={title} />
        </div>
        <h2 className="text-3xl font-display font-bold text-papaya-dark">{title}</h2>
        {subtitle && <p className="mt-2 text-lg text-ink-soft font-bold">{subtitle}</p>}
        <Button color="leaf" size="lg" full className="mt-5" onClick={onDone}>
          {buttonLabel}
        </Button>
      </Modal>
    </>
  )
}
