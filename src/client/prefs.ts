/**
 * The seat's own view preferences, kept in this plugin's `localStorage`.
 *
 * One thing lives here: the provider the model list is narrowed to. Narrowing is
 * pure VIEW state — it never reaches the Host, `/model` keeps listing every
 * provider, and the shared selection is untouched.
 *
 * Scope is PER SESSION. The model trigger reads the session's own directory, so
 * it already answers "what is this conversation running on"; a narrowing
 * remembered globally would contradict that the moment a second window was
 * opened, because the list would be scoped to a provider the other session has
 * nothing to do with — and the model in use would not even be in it. One key
 * per session keeps each window's view where it was left.
 *
 * The remembered value is only ever an id. Whether that id still exists is
 * decided by the catalog, not here: the caller drops a remembered provider the
 * catalog no longer offers (see `Picker`), because a filter naming a provider
 * nothing can explain would narrow the list to nothing for no visible reason.
 *
 * @module dsh-model-picker/client/prefs
 */

/**
 * Storage key prefix; the session id is appended, so narrowing never leaks from
 * one conversation into another. The version suffix lets a future shape change
 * start clean.
 */
const PROVIDER_KEY_PREFIX = 'dsh-model-picker.provider.v1:'

/**
 * The unscoped key written before narrowing became session-scoped. Nothing reads
 * it any more; {@link retireLegacyProviderFilter} drops it once so a stale global
 * choice cannot be mistaken for a remembered one.
 */
const LEGACY_PROVIDER_KEY = 'dsh-model-picker.provider.v1'

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
 * The storage key holding one session's provider narrowing.
 * @param sessionId - the session the narrowing belongs to.
 * @returns the composed key.
 */
export function providerKeyOf(sessionId: string): string {
  return `${PROVIDER_KEY_PREFIX}${sessionId}`
}

/**
 * The provider this session's model list was last narrowed to.
 * @param sessionId - the session the narrowing belongs to.
 * @returns the remembered provider id, or null when this list is unfiltered.
 */
export function readProviderFilter(sessionId: string): string | null {
  const store = storage()
  if (store === null) return null
  try {
    const raw = store.getItem(providerKeyOf(sessionId))
    return raw === null || raw === '' ? null : raw
  } catch {
    return null
  }
}

/**
 * Remember this session's provider filter; null records "every provider".
 *
 * The write is scoped to one session on purpose: a composer whose session
 * changes underneath it must not carry the previous window's narrowing with it.
 * @param sessionId - the session the narrowing belongs to.
 * @param provider - the provider id, or null to forget the narrowing.
 */
export function rememberProviderFilter(sessionId: string, provider: string | null): void {
  const store = storage()
  if (store === null) return
  try {
    const key = providerKeyOf(sessionId)
    if (provider === null) store.removeItem(key)
    else store.setItem(key, provider)
  } catch {
    // A full or read-only store is not worth surfacing: the filter itself works,
    // it is only the memory of it that is lost.
  }
}

/**
 * Drop the unscoped key written by the single-key era. Called once on mount; it
 * is a no-op for every user who never narrowed, and for anyone who did it
 * prevents an orphaned value from outliving the shape that produced it.
 */
export function retireLegacyProviderFilter(): void {
  const store = storage()
  if (store === null) return
  try {
    store.removeItem(LEGACY_PROVIDER_KEY)
  } catch {
    // Losing the cleanup costs one dead key; it must not break the seat.
  }
}
