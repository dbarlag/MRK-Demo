import branchesData from "@/data/branches.json"
import { municipalityToCoords } from "./geo"

/** Subset of the Røde Kors branch payload that the hero uses. */
export type RawBranch = {
  branchId: string
  branchName: string
  branchType?: string
  branchStatus?: { isActive?: boolean; isTerminated?: boolean }
  branchLocation?: {
    municipality?: string
    county?: string
    region?: string
    postalAddress?: {
      addressLine1?: string
      postalCode?: string
      postOffice?: string
    }
  }
  communicationChannels?: {
    phone?: string
    email?: string
    web?: string
  }
  branchContacts?: Array<{
    role?: string
    firstName?: string
    lastName?: string
    email?: string
    isVolunteer?: boolean
    isMember?: boolean
    memberNumber?: string
  }>
  branchActivities?: Array<{
    globalActivityName: string
    localActivityName: string
  }>
}

export type ActivityCard = {
  id: string
  branchId: string
  branchName: string
  municipality: string | null
  county: string | null
  region: string | null
  postOffice: string | null
  /** Parsed sub-municipality name (currently only for Oslo). When set, coords
   * resolve to the neighborhood centroid instead of the municipality centroid,
   * so distance sorting within Oslo behaves correctly. */
  neighborhood: string | null
  globalActivityName: string
  localActivityName: string
  /** Coords resolved from neighborhood (if any), else from branch municipality. */
  lat: number | null
  lng: number | null
  /** Pre-lowercased concatenation of all searchable strings. */
  haystack: string
}

/** Oslo neighborhoods that appear in `localActivityName` strings on the Oslo
 * Røde Kors (D003) branch. Matched in this order — first hit wins, so put more
 * specific names before more general ones (e.g. "Søndre Nordstrand" before
 * "Nordstrand"). All entries must also exist in `place-coords.json`. */
const OSLO_NEIGHBORHOODS = [
  "Søndre Nordstrand",
  "Nordre Aker",
  "Vestre Aker",
  "Gamle Oslo",
  "St. Hanshaugen",
  "Hausmanns gate",
  "Stovner",
  "Grorud",
  "Majorstua",
  "Mortensrud",
  "Veitvet",
  "Grønland",
  "Sentrum",
  "Frogner",
  "Grünerløkka",
  "Sagene",
  "Bjerke",
  "Nordstrand",
  "Alna",
  "Ullern",
  "Østensjø",
  "Finnerud",
  "Holmlia",
  "Lambertseter",
  "Bøler",
  "Oppsal",
  "Manglerud",
] as const

/** When the parsed neighborhood is "Sentrum", map to the canonical
 * "Oslo sentrum" lookup entry so coords resolve correctly. */
function osloNeighborhoodLookupName(n: string): string {
  return n === "Sentrum" ? "Oslo sentrum" : n
}

function detectOsloNeighborhood(localActivityName: string): string | null {
  for (const n of OSLO_NEIGHBORHOODS) {
    if (localActivityName.includes(n)) return n
  }
  return null
}

type BranchesEnvelope = { data?: { branches?: RawBranch[] } }

const RAW_BRANCHES: RawBranch[] =
  (branchesData as BranchesEnvelope).data?.branches ?? []

/** Flatten active branches × activities into one list, one card per pair.
 * The source data contains at least one repeated branchId (L192 / Stryn Røde
 * Kors), so we dedupe by branchId — first occurrence wins. Without this the
 * generated `${branchId}-${i}` keys collide and React warns about duplicate
 * keys when the cards render. */
export function getAllActivities(): ActivityCard[] {
  const out: ActivityCard[] = []
  const seenBranchIds = new Set<string>()
  for (const b of RAW_BRANCHES) {
    if (!b.branchStatus?.isActive) continue
    if (seenBranchIds.has(b.branchId)) continue
    seenBranchIds.add(b.branchId)
    const acts = b.branchActivities ?? []
    if (acts.length === 0) continue
    const municipality = b.branchLocation?.municipality ?? null
    const county = b.branchLocation?.county ?? null
    const region = b.branchLocation?.region ?? null
    const postOffice = b.branchLocation?.postalAddress?.postOffice ?? null
    const isOslo = municipality?.toLowerCase() === "oslo"
    const municipalityCoords = municipalityToCoords(municipality)
    acts.forEach((act, i) => {
      const neighborhood = isOslo
        ? detectOsloNeighborhood(act.localActivityName)
        : null
      const neighborhoodCoords = neighborhood
        ? municipalityToCoords(osloNeighborhoodLookupName(neighborhood))
        : null
      const coords = neighborhoodCoords ?? municipalityCoords
      out.push({
        id: `${b.branchId}-${i}`,
        branchId: b.branchId,
        branchName: b.branchName,
        municipality,
        county,
        region,
        postOffice,
        neighborhood,
        globalActivityName: act.globalActivityName,
        localActivityName: act.localActivityName,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        haystack: [
          b.branchName,
          municipality,
          neighborhood,
          county,
          region,
          postOffice,
          act.globalActivityName,
          act.localActivityName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      })
    })
  }
  return out
}
