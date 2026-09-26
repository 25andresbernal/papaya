// A Screen is the frame around every page: a phone-width column, centered,
// with an optional top bar and a bottom nav. Keeps every page looking the same.

import type { ReactNode } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function Screen({
  children,
  topBar = true,
  nav = true,
  className = '',
  bg = 'bg-cream',
}: {
  children: ReactNode
  topBar?: boolean
  nav?: boolean
  className?: string
  /** Tailwind background class. */
  bg?: string
}) {
  return (
    <div className={`min-h-full w-full flex flex-col items-center ${bg}`}>
      <div className="w-full max-w-md flex-1 flex flex-col relative">
        {topBar && <TopBar />}
        <main className={`flex-1 flex flex-col px-4 ${nav ? 'pb-24' : 'pb-4'} ${className}`}>{children}</main>
        {nav && <BottomNav />}
      </div>
    </div>
  )
}
