// A round "go back" button for the corner of a screen.

import { useNavigate } from 'react-router-dom'
import { sfx } from '../audio/sound'

export default function BackButton({ to, label = 'Back', onClick }: { to?: string; label?: string; onClick?: () => void }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      aria-label={label}
      className="btn-chunky bg-white text-ink rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold cursor-pointer"
      onClick={() => {
        sfx.tap()
        if (onClick) onClick()
        else if (to) navigate(to)
        else navigate(-1)
      }}
    >
      ←
    </button>
  )
}
