// Profiles: more than one kid can play on the same phone.
// Each profile is its own saved game. A little "who is playing?" list
// remembers everyone, and one of them is the active player.
//
// Storage layout in the browser:
//   papaya.profiles.v1     -> { activeId, profiles: [...] }   (the list)
//   papaya.player.<id>     -> PlayerState                     (one save per kid)
//   papaya.player.v1       -> the old single save, moved into a profile on first run

import type { PlayerState } from '../types'

export interface ProfileMeta {
  id: string
  name: string
  buddyId: string
  color: string
  createdAt: number
  lastPlayedAt: number
}

interface Registry {
  activeId: string | null
  profiles: ProfileMeta[]
}

const REGISTRY_KEY = 'papaya.profiles.v1'
const LEGACY_KEY = 'papaya.player.v1'

export function playerKey(id: string): string {
  return `papaya.player.${id}`
}

export function newProfileId(): string {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function readRegistry(): Registry {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Registry>
      return { activeId: parsed.activeId ?? null, profiles: parsed.profiles ?? [] }
    }
  } catch {
    // Fall through to an empty list.
  }
  return { activeId: null, profiles: [] }
}

function writeRegistry(reg: Registry): void {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg))
  } catch {
    // If the browser will not let us save, the game still works for now.
  }
}

/**
 * First run after the profiles update: if there is an old single save,
 * turn it into the first profile so nobody loses their progress.
 */
function migrateLegacySave(reg: Registry): Registry {
  if (reg.profiles.length > 0) return reg
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return reg
    const old = JSON.parse(raw) as Partial<PlayerState>
    if (!old.onboarded) {
      localStorage.removeItem(LEGACY_KEY)
      return reg
    }
    const id = newProfileId()
    localStorage.setItem(playerKey(id), raw)
    localStorage.removeItem(LEGACY_KEY)
    const meta: ProfileMeta = {
      id,
      name: old.name || 'Explorer',
      buddyId: old.buddyId || 'tico',
      color: old.hero?.color || '#FF8A3D',
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
    }
    const next = { activeId: id, profiles: [meta] }
    writeRegistry(next)
    return next
  } catch {
    return reg
  }
}

/** The list of everyone who plays on this device, plus who is active. */
export function loadRegistry(): Registry {
  return migrateLegacySave(readRegistry())
}

export function listProfiles(): ProfileMeta[] {
  return loadRegistry().profiles
}

export function getActiveProfileId(): string | null {
  const reg = loadRegistry()
  if (reg.activeId && reg.profiles.some((p) => p.id === reg.activeId)) return reg.activeId
  return null
}

export function setActiveProfileId(id: string | null): void {
  const reg = loadRegistry()
  writeRegistry({ ...reg, activeId: id })
}

/** Add a new kid to the list and make them active. Returns the new id. */
export function createProfile(): string {
  const reg = loadRegistry()
  const id = newProfileId()
  const meta: ProfileMeta = {
    id,
    name: '',
    buddyId: 'tico',
    color: '#FF8A3D',
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  }
  writeRegistry({ activeId: id, profiles: [...reg.profiles, meta] })
  return id
}

/** Keep the list's name, buddy, and color in step with the save file. */
export function updateProfileMeta(id: string, patch: Partial<Omit<ProfileMeta, 'id' | 'createdAt'>>): void {
  const reg = loadRegistry()
  const profiles = reg.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p))
  writeRegistry({ ...reg, profiles })
}

/** Remove a kid and their save. Used by the parent zone only. */
export function deleteProfile(id: string): void {
  const reg = loadRegistry()
  try {
    localStorage.removeItem(playerKey(id))
  } catch {
    // Nothing to do.
  }
  const profiles = reg.profiles.filter((p) => p.id !== id)
  writeRegistry({ activeId: reg.activeId === id ? null : reg.activeId, profiles })
}
