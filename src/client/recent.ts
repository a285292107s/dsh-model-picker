/**
 * "Recently used" model routes, kept in this plugin's own `localStorage`.
 *
 * Scope is deliberately global rather than per-session (model preference
 * usually travels with the person, not the conversation), and entries are
 * recorded from the shared directory's `current` route — so a switch made in
 * the `/model` popup lands here too, not just one made in this menu.
 *
 * {@link RECENT_ID} is what the provider menu offers as "recently used" beside
 * "all providers": selecting it swaps WHICH rows the list holds, without
 * changing how they are grouped. It is not a group of its own any more.
 *
 * An entry whose model is currently missing from the catalog is hidden by the
 * menu but never deleted: a transient catalog failure must not erase history.
 *
 * @module dsh-rabbit-model-picker/client/recent
 */

/**
 * The pseudo-provider id the provider menu lists for "recently used".
 *
 * It has to be a value the catalog can never produce, because the stale-filter
 * cleanup judges a remembered id against the catalog's provider list — a real
 * provider called this would make "recently used" and that provider the same
 * row.
 */
export const RECENT_ID = '__recent__'

/**
 * Storage key; the version suffix lets a future shape change start clean.
 *
 * Kept at the pre-rename `dsh-model-picker.*` spelling on purpose: this is
 * persisted user data, so a package rename must not wipe the recent-model list.
 */
const STORAGE_KEY = 'dsh-model-picker.recent.v1'

/** How many routes are retained (the menu shows at most {@link RECENT_VISIBLE}). */
const LIMIT = 12

/** How many retained routes the menu lists. */
export const RECENT_VISIBLE = 5

/** One remembered model route. */
export interface RecentEntry {
  /** `${provider}/${model}` — the identity used for de-duplication. */
  readonly key: string
  readonly provider: string
  readonly model: string
  /** Epoch milliseconds of the last use (ordering only). */
  readonly at: number
}

/** One list row this module needs to know about: a route already resolved to a catalog model. */
export interface RecentRow {
  readonly key: string
  readonly provider: string
  readonly model: { readonly id: string; readonly name: string }
}

/** One provider group of the rendered list. */
export interface RecentGroup {
  readonly id: string
  readonly label: string
  readonly rows: readonly RecentRow[]
}

/** One provider the catalog offers, in the shape this module reads. */
interface NamedGroup {
  readonly id: string
  readonly name: string
}

/**
 * Bucket resolved recent rows back into the providers they belong to.
 *
 * This is the whole of "recently used": it changes WHICH rows the list holds,
 * never how they are grouped. Each provider keeps the sticky heading that
 * already names it, so no row has to repeat its own provider, and two routes
 * from one provider stay a single block instead of two one-row groups.
 *
 * Order is recency throughout — providers by their newest route, routes by their
 * own — because the rows arrive that way and this function never re-sorts them.
 * That is the difference from the catalog mode beside it: a user who picked
 * "recently used" is walking backwards through what they used, so a search
 * narrows that walk (rows the query excludes drop out) instead of re-sorting it
 * by relevance.
 * @param rows - resolved recent rows, most recent first.
 * @param orderedGroups - the catalog's providers, in display order.
 * @param label - the shared provider-label localizer.
 * @returns one group per provider that owns at least one row, newest first.
 */
export function recentGroupsFor(
  rows: readonly RecentRow[],
  orderedGroups: readonly NamedGroup[],
  label: (providerId: string, fallback: string) => string,
): RecentGroup[] {
  const groups = new Map<string, RecentGroup>()
  for (const row of rows) {
    // The caller resolves rows against the catalog, so the provider is always
    // one of `orderedGroups`; the `continue` only tells the checker the lookup
    // is fallible, and it cannot fire.
    const group = orderedGroups.find(candidate => candidate.id === row.provider)
    if (group === undefined) continue
    const existing = groups.get(group.id)
    groups.set(group.id, {
      id: group.id,
      label: label(group.id, group.name),
      rows: existing === undefined ? [row] : [...existing.rows, row],
    })
  }
  return [...groups.values()]
}

/**
 * Compose the opaque row identity used across this plugin.
 * @param provider - provider group id.
 * @param model - model id within that provider.
 * @returns the combined key.
 */
export function rowKey(provider: string, model: string): string {
  return `${provider}/${model}`
}

/**
 * Reach `localStorage` without letting a denied/absent store break rendering
 * (private modes and sandboxed frames can throw on access).
 * @returns the store, or null when unavailable.
 */
function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * Read the remembered routes, most recent first.
 * @returns validated entries; an unreadable or malformed value reads as empty.
 */
export function readRecent(): RecentEntry[] {
  const store = storage()
  if (store === null) return []
  let parsed: unknown
  try {
    const raw = store.getItem(STORAGE_KEY)
    if (raw === null) return []
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  const entries: RecentEntry[] = []
  for (const value of parsed) {
    if (typeof value !== 'object' || value === null) continue
    const { provider, model, at } = value as { provider?: unknown; model?: unknown; at?: unknown }
    if (typeof provider !== 'string' || provider === '') continue
    if (typeof model !== 'string' || model === '') continue
    entries.push({ key: rowKey(provider, model), provider, model, at: typeof at === 'number' ? at : 0 })
  }
  return entries
}

/**
 * Move one route to the front, de-duplicating and capping the list.
 * @param provider - provider group id.
 * @param model - model id within that provider.
 * @param at - epoch milliseconds to record; defaults to now.
 */
export function remember(provider: string, model: string, at = Date.now()): void {
  const store = storage()
  if (store === null) return
  const key = rowKey(provider, model)
  const next: RecentEntry[] = [
    { key, provider, model, at },
    ...readRecent().filter(entry => entry.key !== key),
  ].slice(0, LIMIT)
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // A full or read-only store is not worth surfacing: recency is a nicety.
  }
}
