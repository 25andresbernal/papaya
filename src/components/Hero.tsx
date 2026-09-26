// The kid's hero: a friendly round explorer in their chosen color,
// wearing whatever hats and things they bought. Drawn with SVG so it scales.

import type { HeroLook } from '../types'
import { getItem } from '../data/shop'

export default function Hero({ look, size = 120, className = '' }: { look: HeroLook; size?: number; className?: string }) {
  const hat = look.equipped.hat ? getItem(look.equipped.hat) : null
  const glasses = look.equipped.glasses ? getItem(look.equipped.glasses) : null
  const cape = look.equipped.cape ? getItem(look.equipped.cape) : null
  const pet = look.equipped.pet ? getItem(look.equipped.pet) : null

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }} aria-label="Your hero">
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* cape behind the body */}
        {cape && <path d="M30 55 L20 95 L80 95 L70 55 Z" fill="#B388FF" opacity="0.9" />}
        {/* body */}
        <ellipse cx="50" cy="66" rx="24" ry="28" fill={look.color} />
        {/* head */}
        <circle cx="50" cy="38" r="24" fill="#FFD9B3" />
        {/* eyes */}
        <circle cx="41" cy="36" r="3.5" fill="#2D2A26" />
        <circle cx="59" cy="36" r="3.5" fill="#2D2A26" />
        <circle cx="42.5" cy="34.5" r="1.2" fill="#fff" />
        <circle cx="60.5" cy="34.5" r="1.2" fill="#fff" />
        {/* cheeks */}
        <circle cx="36" cy="44" r="3" fill="#FF9AA2" opacity="0.7" />
        <circle cx="64" cy="44" r="3" fill="#FF9AA2" opacity="0.7" />
        {/* smile */}
        <path d="M42 46 Q50 53 58 46" stroke="#2D2A26" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* hair tuft */}
        <path d="M38 18 Q50 8 62 18 Q56 14 50 16 Q44 14 38 18Z" fill="#3B2A1A" />
      </svg>
      {glasses && (
        <span className="absolute text-center" style={{ left: 0, right: 0, top: size * 0.26, fontSize: size * 0.22, lineHeight: 1 }}>
          {glasses.emoji}
        </span>
      )}
      {hat && (
        <span className="absolute text-center" style={{ left: 0, right: 0, top: -size * 0.08, fontSize: size * 0.3, lineHeight: 1 }}>
          {hat.emoji}
        </span>
      )}
      {pet && (
        <span className="absolute" style={{ right: -size * 0.1, bottom: 0, fontSize: size * 0.28, lineHeight: 1 }}>
          {pet.emoji}
        </span>
      )}
    </div>
  )
}
