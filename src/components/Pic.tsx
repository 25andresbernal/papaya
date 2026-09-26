// A picture for a word. We use Twemoji: free, flat, rounded emoji drawings that look
// the same on every phone. If the picture cannot load, we show the plain emoji instead.
// Twemoji is CC-BY 4.0 by Twitter/X. The credit line lives on the Settings screen.

import { useState } from 'react'

const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/'

/** Turn an emoji like "👋" into its Twemoji file name like "1f44b". */
export function emojiToCodepoints(emoji: string): string {
  const points: string[] = []
  for (const ch of emoji) {
    const cp = ch.codePointAt(0)
    if (cp === undefined) continue
    // Twemoji drops the "variation selector" (fe0f) unless a zero-width joiner is present.
    if (cp === 0xfe0f && !emoji.includes('‍')) continue
    points.push(cp.toString(16))
  }
  return points.join('-')
}

export function twemojiUrl(emoji: string): string {
  return `${TWEMOJI_BASE}${emojiToCodepoints(emoji)}.svg`
}

export default function Pic({
  emoji,
  size = 48,
  className = '',
  label,
}: {
  emoji: string
  /** Width and height in pixels. */
  size?: number
  className?: string
  label?: string
}) {
  const [failed, setFailed] = useState(false)
  if (!emoji) return null
  if (failed) {
    return (
      <span className={className} style={{ fontSize: size * 0.85, lineHeight: 1 }} role="img" aria-label={label}>
        {emoji}
      </span>
    )
  }
  return (
    <img
      src={twemojiUrl(emoji)}
      width={size}
      height={size}
      alt={label ?? ''}
      draggable={false}
      loading="lazy"
      className={`inline-block select-none ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  )
}
