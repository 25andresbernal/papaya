// Small helpers for "what day is it?" questions.
// Streaks care about days, not hours, so we turn dates into "YYYY-MM-DD".

/** Today as "YYYY-MM-DD" in the kid's local time zone. */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** How many whole days between two "YYYY-MM-DD" keys. */
export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((db.getTime() - da.getTime()) / 86_400_000)
}

/** Yesterday's key. */
export function yesterdayKey(now: Date = new Date()): string {
  const d = new Date(now)
  d.setDate(d.getDate() - 1)
  return todayKey(d)
}
