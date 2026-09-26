// A pop-up card in the middle of the screen. For rewards, confirmations, and level ups.

import type { ReactNode } from 'react'

export default function Modal({ children, onClose, className = '' }: { children: ReactNode; onClose?: () => void; className?: string }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-seed/50 px-4" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`bg-white rounded-3xl p-6 w-full max-w-sm shadow-chunky animate-pop text-center ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
