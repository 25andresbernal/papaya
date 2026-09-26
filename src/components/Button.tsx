// The one button everyone uses. Big, chunky, colorful, and it always makes a sound.
// Rule from CLAUDE.md: never a silent tap.

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { sfx } from '../audio/sound'

type Color = 'papaya' | 'leaf' | 'sky' | 'sun' | 'coral' | 'white' | 'seed'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const COLORS: Record<Color, string> = {
  papaya: 'bg-papaya text-white',
  leaf: 'bg-leaf text-white',
  sky: 'bg-sky text-white',
  sun: 'bg-sun text-seed',
  coral: 'bg-coral text-white',
  white: 'bg-white text-ink border-2 border-cream-dark',
  seed: 'bg-seed text-white',
}

const SIZES: Record<Size, string> = {
  sm: 'text-base px-4 py-2 rounded-2xl min-h-11',
  md: 'text-lg px-5 py-3 rounded-2xl min-h-14',
  lg: 'text-xl px-6 py-4 rounded-3xl min-h-16',
  xl: 'text-2xl px-8 py-5 rounded-3xl min-h-20',
}

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  color?: Color
  size?: Size
  /** Stretch to fill the row. */
  full?: boolean
  /** Turn off the tap sound (for buttons that play their own sound). */
  silent?: boolean
  children: ReactNode
}

export default function Button({
  color = 'papaya',
  size = 'md',
  full,
  silent,
  className = '',
  onClick,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn-chunky font-display font-bold tracking-wide select-none cursor-pointer
        inline-flex items-center justify-center gap-2
        ${COLORS[color]} ${SIZES[size]} ${full ? 'w-full' : ''} ${className}`}
      onClick={(e) => {
        if (!silent) sfx.tap()
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
