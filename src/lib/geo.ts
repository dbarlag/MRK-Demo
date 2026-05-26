import placeData from "@/data/place-coords.json"

export type Place = {
  name: string
  lat: number
  lng: number
  aliases?: string[]
}

export type Coords = { lat: number; lng: number }

type PlaceFile = { places?: Place[] }
const PLACES: Place[] = (placeData as PlaceFile).places ?? []

/** Index municipality (canonical) name → coords for O(1) branch lookup. */
const BY_CANONICAL: Map<string, Place> = new Map()
for (const p of PLACES) BY_CANONICAL.set(p.name.toLowerCase(), p)

/**
 * Resolve a free-text place query to a known place.
 * Match tiers (first hit wins): exact on name → exact on alias → prefix on name
 * → prefix on alias → substring on name → substring on alias. Substring tier
 * is gated on `length >= 3` so single/double-letter queries don't sweep up
 * half the country. Returns `null` when nothing matches.
 */
export function resolvePlace(query: string): Place | null {
  const q = query.trim().toLowerCase()
  if (!q) return null

  for (const p of PLACES) {
    if (p.name.toLowerCase() === q) return p
  }
  for (const p of PLACES) {
    if (p.aliases?.some((a) => a.toLowerCase() === q)) return p
  }
  for (const p of PLACES) {
    if (p.name.toLowerCase().startsWith(q)) return p
  }
  for (const p of PLACES) {
    if (p.aliases?.some((a) => a.toLowerCase().startsWith(q))) return p
  }
  if (q.length >= 3) {
    for (const p of PLACES) {
      if (p.name.toLowerCase().includes(q)) return p
    }
    for (const p of PLACES) {
      if (p.aliases?.some((a) => a.toLowerCase().includes(q))) return p
    }
  }
  return null
}

/** Resolve a branch's canonical municipality name to coords. */
export function municipalityToCoords(name: string | null): Coords | null {
  if (!name) return null
  const p = BY_CANONICAL.get(name.toLowerCase())
  if (!p) return null
  return { lat: p.lat, lng: p.lng }
}

/** Great-circle distance in kilometers. */
export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
