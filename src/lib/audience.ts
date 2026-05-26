/**
 * User-facing audience buckets for the Interesser filter, matching the 5-bucket
 * framing Røde Kors uses internally (Barn og familie, Ungdom, Voksne og eldre,
 * Beredskap, Tilleggsaktivitet). Each `globalActivityName` from the branch
 * dataset maps to exactly one bucket. Unmapped activities fall through to
 * `tilleggsaktivitet` (the org's own catch-all for non-core slots).
 */

export type Audience =
  | "barnFamilie"
  | "ungdom"
  | "voksneEldre"
  | "beredskap"
  | "tilleggsaktivitet"

export const AUDIENCE_LABELS: Record<Audience, string> = {
  barnFamilie: "Barn og familie",
  ungdom: "Ungdom",
  voksneEldre: "Voksne og eldre",
  beredskap: "Beredskap",
  tilleggsaktivitet: "Tilleggsaktivitet",
}

export const AUDIENCE_ORDER: Audience[] = [
  "barnFamilie",
  "ungdom",
  "voksneEldre",
  "beredskap",
  "tilleggsaktivitet",
]

/** Keys are exact `globalActivityName` values from the branches dataset. Note
 * the double space in "Øvrige aktiviteter -  Røde Kors Ungdom" — that matches
 * how it appears in the source data. */
const ACTIVITY_TO_AUDIENCE: Record<string, Audience> = {
  // Barn og familie
  "Barnas Røde Kors": "barnFamilie",
  "Familiesenter": "barnFamilie",
  "Mentorfamilie": "barnFamilie",
  "Vennefamilie": "barnFamilie",
  "Familievenn": "barnFamilie",
  "Leksehjelp": "barnFamilie",
  "Digital leksehjelp": "barnFamilie",
  "Ferie for alle": "barnFamilie",
  "Kors på Halsen": "barnFamilie",
  "BUA": "barnFamilie",
  "Arrangement og reise": "barnFamilie",

  // Ungdom
  "Treffpunkt - Røde Kors Ungdom": "ungdom",
  "Møteplass Fellesverkene": "ungdom",
  "Røde Kors Friluftsliv og Førstehjelp (RØFF)": "ungdom",
  "Øvrige aktiviteter -  Røde Kors Ungdom": "ungdom",
  "Gatemegling": "ungdom",
  "Habil": "ungdom",
  "Nattevandring": "ungdom",

  // Voksne og eldre — includes migration, vulnerable adults, prison-adjacent work
  "Besøkstjeneste": "voksneEldre",
  "Besøksvenn med hund": "voksneEldre",
  "Våketjenesten": "voksneEldre",
  "Turgruppe": "voksneEldre",
  "Møteplasser": "voksneEldre",
  "Norsktrening": "voksneEldre",
  "Språkgruppe": "voksneEldre",
  "Flyktningguide": "voksneEldre",
  "Aktiviteter på asylmottak": "voksneEldre",
  "Aktiviteter på utlendingsinternat": "voksneEldre",
  "Visitor": "voksneEldre",
  "Vitnestøtte": "voksneEldre",
  "Nettverk etter soning": "voksneEldre",
  "EVA": "voksneEldre",
  "Akuttovernatting for bostedsløse tilreisende": "voksneEldre",
  "Døråpner": "voksneEldre",
  "Kompetansesenter": "voksneEldre",

  // Beredskap
  "Hjelpekorps": "beredskap",
  "Beredskap": "beredskap",
  "Lokalråd Hjelpekorps": "beredskap",
  "Distriktsråd Hjelpekorps": "beredskap",
  "Internasjonal Humanitær Rett": "beredskap",

  // Tilleggsaktivitet — admin/styre, opplæring, sporadisk, blodgiv etc.
  "Administrative oppgaver": "tilleggsaktivitet",
  "Lokalstyre": "tilleggsaktivitet",
  "Distriktsstyre": "tilleggsaktivitet",
  "Lokalråd Omsorg": "tilleggsaktivitet",
  "Mottak av frivillige i lokalforening": "tilleggsaktivitet",
  "Sporadisk frivillige": "tilleggsaktivitet",
  "Opplæring": "tilleggsaktivitet",
  "Bruktbutikk": "tilleggsaktivitet",
  "Praktiske tjenester": "tilleggsaktivitet",
  "Blodgiververving": "tilleggsaktivitet",
  "Internasjonalt distriktsamarbeid": "tilleggsaktivitet",
}

export function audienceFor(globalActivityName: string): Audience {
  return ACTIVITY_TO_AUDIENCE[globalActivityName] ?? "tilleggsaktivitet"
}

/** All known activity names, ordered by bucket then alphabetically within. */
export const ALL_ACTIVITIES: string[] = (() => {
  const byBucket: Record<Audience, string[]> = {
    barnFamilie: [],
    ungdom: [],
    voksneEldre: [],
    beredskap: [],
    tilleggsaktivitet: [],
  }
  for (const name of Object.keys(ACTIVITY_TO_AUDIENCE)) {
    byBucket[ACTIVITY_TO_AUDIENCE[name]].push(name)
  }
  for (const bucket of AUDIENCE_ORDER) {
    byBucket[bucket].sort((a, b) => a.localeCompare(b, "nb"))
  }
  return AUDIENCE_ORDER.flatMap((b) => byBucket[b])
})()
