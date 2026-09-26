// Turn a stopwatch time (in milliseconds) into something a kid can read.
// Lessons are timed for racing, so this file has the one job of making
// "42300" milliseconds look like "0:42.3" seconds instead.

/** "0:42.3" - minutes, seconds, and a tenth of a second. Used on the lesson complete screen. */
export function formatMs(ms: number): string {
  const safeMs = Math.max(0, ms)
  const totalTenths = Math.round(safeMs / 100)
  const minutes = Math.floor(totalTenths / 600)
  const seconds = Math.floor((totalTenths % 600) / 10)
  const tenths = totalTenths % 10
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths}`
}

/** "0:42" - just minutes and seconds, for the live stopwatch that ticks while playing. */
export function formatMsShort(ms: number): string {
  const safeMs = Math.max(0, ms)
  const totalSeconds = Math.floor(safeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
