// A simple bar that fills up. Used for lessons, XP, and games.

export default function ProgressBar({
  value,
  max,
  color = 'bg-leaf',
  height = 'h-4',
  className = '',
}: {
  value: number
  max: number
  color?: string
  height?: string
  className?: string
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className={`w-full ${height} rounded-full bg-cream-dark overflow-hidden ${className}`} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div className={`h-full rounded-full ${color} transition-all duration-500 ease-out`} style={{ width: `${pct}%` }} />
    </div>
  )
}
