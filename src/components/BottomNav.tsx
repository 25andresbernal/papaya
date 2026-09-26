// The tab bar at the bottom. Five big icons a kid can find without reading.

import { NavLink } from 'react-router-dom'
import { sfx } from '../audio/sound'

const TABS = [
  { to: '/', emoji: '🏠', label: 'Home' },
  { to: '/path', emoji: '🗺️', label: 'Learn' },
  { to: '/arcade', emoji: '🎮', label: 'Play' },
  { to: '/characters', emoji: '🦜', label: 'Buddies' },
  { to: '/shop', emoji: '🛍️', label: 'Shop' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white border-t-2 border-cream-dark flex justify-around px-2 pb-[env(safe-area-inset-bottom)] pointer-events-auto">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            onClick={() => sfx.tap()}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-2 min-w-16 min-h-16 rounded-2xl transition-transform active:scale-90 ${
                isActive ? 'bg-cream text-papaya-dark' : 'text-ink-soft'
              }`
            }
          >
            <span className="text-2xl leading-none">{t.emoji}</span>
            <span className="text-xs font-display font-bold">{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
