/**
 * Per-category image resolution. Slug is derived from `globalActivityName` so
 * the lookup works for any value in the dataset.
 *
 * Image files live at `public/activities/{slug}.jpg`, with `_default.jpg` as
 * the placeholder for unmapped names.
 */

export function slugifyCategory(globalActivityName: string): string {
  return globalActivityName
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function imageFor(globalActivityName: string): string {
  return `/activities/${slugifyCategory(globalActivityName)}.jpg`
}

export const FALLBACK_IMAGE = "/activities/_default.jpg"
