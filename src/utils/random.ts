// Helpers for shuffling and picking random things.
// Games and lessons use these so every play feels a little different.

/** Returns a new shuffled copy of the list. Does not change the original. */
export function shuffle<T>(list: readonly T[]): T[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Pick one random item. */
export function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)]
}

/** Pick n different random items. */
export function sample<T>(list: readonly T[], n: number): T[] {
  return shuffle(list).slice(0, n)
}

/** Random whole number from min to max, both included. */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Simple unique id for exercises and such. */
export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
