/**
 * The composer model seat: a trigger plus ONE level of list.
 *
 * What this replaces: the incumbent seat's root pane is a two-cell menu
 * (Model / Effort) that drills into a second pane each. Here the levels are
 * inline — the list carries the models, and each row states its own facts as a
 * read-only badge strip (text / image input, the effort in force, the context
 * window). Nothing inside a row is a control: effort is edited in the model
 * parameters panel, which is what the row's badges now merely report. Search is
 * always present (the incumbent only shows it above four models), and a "Recent"
 * group sits on top so a long catalog does not have to be scrolled or typed
 * through.
 *
 * Data and submission ride the same per-session `ModelDirectory` the `/model`
 * popup uses, so a switch made in either entry is what the other shows next.
 * Everything external (catalog, current selection, pending, errors) is read
 * from that one store; only view state (open, query, highlight, which popover is
 * open, the toast) is local.
 *
 * @module dsh-model-picker/client/Picker
 */

import {
  IconApiOutlineRegular, IconCheckOutlineRegular, IconChevronDownOutlineRegular, IconCloseFillRegular,
  IconDataOutlineRegular, IconSettingsOutlineRegular, IconWarningOutlineRegular, Input, MenuGroup, MenuSurface,
  observeStickyMenuGroups, rankByName, StateDot, Tag, Toast, Tooltip, useAnchoredPosition,
} from '@deepseek-ai/dsh-client-ui-primitives'
import {
  useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore,
  type CSSProperties, type FocusEvent, type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { BadgeIcon } from './BadgeIcons.tsx'
import { observeSeatLoss } from './anchorLoss.ts'
import { badgeSpecsOf, type BadgeSpec } from './badges.ts'
import type { CatalogModel, ModelSelection, PickerProps, ProviderGroup } from './contract.ts'
import { effortLabelOf } from './effort.ts'
import { resolveRoute } from './params.ts'
import { readProviderFilter, rememberProviderFilter } from './prefs.ts'
import { ProviderMenu, type ProviderOption } from './ProviderMenu.tsx'
import { RECENT_ID, RECENT_VISIBLE, readRecent, recentGroupsFor, remember, rowKey, type RecentEntry } from './recent.ts'
import { SettingsMenu } from './SettingsMenu.tsx'

/** Unplaced portal card: hidden but laid out at a fixed origin so measurement is real. */
const MEASURE_STYLE: CSSProperties = { visibility: 'hidden', left: 0, top: 0 }

/** One rendered model row. `key` is unique across groups (a model can appear in Recent too). */
interface Row {
  readonly key: string
  readonly provider: string
  readonly model: CatalogModel
}

/** One rendered group: the sticky-headed Recent group or a provider group. */
interface DisplayGroup {
  readonly id: string
  readonly label: string
  readonly rows: readonly Row[]
}

/**
 * Put the account and official providers first, preserving every other relative
 * order (the same ordering the `/model` popup uses).
 * @param groups - provider groups in catalog order.
 * @returns a sorted copy.
 */
function orderProviders(groups: readonly ProviderGroup[]): ProviderGroup[] {
  return groups.slice().sort((left, right) =>
    (left.id === 'deepseek-account' ? 0 : left.id === 'deepseek-official' ? 1 : 2)
      - (right.id === 'deepseek-account' ? 0 : right.id === 'deepseek-official' ? 1 : 2))
}

/**
 * Resolve the remembered routes that are still selectable and still match the
 * query, most recent first. A route missing from the catalog is skipped but
 * left in storage.
 * @param catalog - every row currently in the catalog.
 * @param recent - remembered routes, most recent first.
 * @param query - the trimmed search text ('' when not searching).
 * @param cap - how many rows to keep; null counts them all (the provider menu
 * reports the total, the list shows {@link RECENT_VISIBLE}).
 * @returns the matching rows, most recent first.
 */
function recentRowsFor(
  catalog: readonly Row[], recent: readonly RecentEntry[], query: string, cap: number | null = RECENT_VISIBLE,
): Row[] {
  const rows: Row[] = []
  for (const entry of recent) {
    const found = catalog.find(row => row.provider === entry.provider && row.model.id === entry.model)
    if (found === undefined) continue
    if (query !== '' && rankByName([found.model], query).length === 0) continue
    rows.push({ key: `recent:${found.provider}:${found.model.id}`, provider: found.provider, model: found.model })
    if (cap !== null && rows.length >= cap) break
  }
  return rows
}

/**
 * Render the composer model seat.
 * @param props - the owner share (`locked`), the injected directory face, and the translators.
 * @returns the trigger and, while open, the single-level menu.
 */
export function Picker(props: PickerProps) {
  const { locked, available, directory, load, select, params, translate, sessionId } = props
  const t = props.t ?? translate
  const state = useSyncExternalStore(
    subscribe => directory.subscribe(subscribe),
    () => directory.getSnapshot(),
  )

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState<number | null>(null)
  const [recent, setRecent] = useState<readonly RecentEntry[]>([])
  // The narrowing is a preference, not session state — but it is a preference
  // ABOUT one conversation, so it is remembered per session (see prefs.ts).
  const [filterSession, setFilterSession] = useState(sessionId)
  const [providerFilter, setProviderFilter] = useState<string | null>(() => readProviderFilter(sessionId))
  const [providerAt, setProviderAt] = useState(false)
  const [providerSide, setProviderSide] = useState<'top' | 'bottom'>('bottom')
  const [settingsAt, setSettingsAt] = useState(false)
  const [settingsSide, setSettingsSide] = useState<'top' | 'bottom'>('bottom')
  // The panel is the tallest surface in this seat, and the composer sits near
  // the viewport floor, so its own budget is measured from the gear instead of
  // being left to the generic 460px cap (which lets the footer note fall past
  // the viewport edge with no scrollbar to reach it).
  const [settingsBudget, setSettingsBudget] = useState<number | undefined>(undefined)
  const [selectionFocus, setSelectionFocus] = useState(false)
  const [toast, setToast] = useState<{ seq: number; text: string } | null>(null)

  const toastSeq = useRef(0)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const providerChipRef = useRef<HTMLButtonElement | null>(null)
  const providerMenuRef = useRef<HTMLDivElement | null>(null)
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null)
  const settingsMenuRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const groupsRef = useRef<HTMLDivElement | null>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  // The in-menu strip is the catalog-load surface; a rejected SELECTION
  // announces through the transient toast instead.
  const lastActionRef = useRef<'load' | 'select'>('load')
  const routeRef = useRef<string | null>(null)
  const id = useId()

  // Which session the settings panel was opened on. The seat spans sessions, so
  // the panel closes when the session (not merely the model) changes under it.
  const [settingsSession, setSettingsSession] = useState(sessionId)
  if (settingsAt && settingsSession !== sessionId) {
    setSettingsAt(false)
    setSettingsSession(sessionId)
  }

  // The same boundary for the narrowing. The seat is NOT remounted when the
  // conversation changes — the model trigger keeps up only because the injected
  // directory is re-resolved per session — so a `useState` initializer never
  // runs again and a session-wide preference read once at mount would follow
  // the wrong conversation for the rest of the seat's life.
  if (filterSession !== sessionId) {
    setFilterSession(sessionId)
    setProviderFilter(readProviderFilter(sessionId))
  }

  const menuPos = useAnchoredPosition({
    open, anchorRef: triggerRef, panelRef: menuRef, side: 'top', align: 'end', gap: 8, margin: 12,
  })

  const orderedGroups = useMemo(() => orderProviders(state.groups), [state.groups])
  const catalogRows = useMemo<Row[]>(() => orderedGroups.flatMap(group =>
    group.models.map(model => ({ key: `${group.id}:${model.id}`, provider: group.id, model }))), [orderedGroups])
  const selectedKey = state.current === null ? null : rowKey(state.current.provider, state.current.model)
  const currentRow = catalogRows.find(row => rowKey(row.provider, row.model.id) === selectedKey) ?? null
  const currentReasoning = currentRow?.model.reasoning
  const effectiveEffort = state.current?.reasoningEffort ?? currentReasoning?.defaultEffort
  const effortLabel = currentReasoning === undefined
    ? state.retainedEffort
    : effortLabelOf(currentReasoning, effectiveEffort, t)

  // The whole settings snapshot, read once for two purposes that must agree:
  // the gear's "edited" mark, and every row's read-only facts. Both derive from
  // this one snapshot through `resolveRoute`, so the badge strip and the panel
  // can never tell different stories about a route.
  const paramsSnapshot = useSyncExternalStore(
    subscribe => params.subscribe(subscribe),
    () => params.getSnapshot(),
  )
  const declaredCurrent = resolveRoute(paramsSnapshot, state.current)?.declared === true

  // One pass per catalog revision resolves the facts of every row: the rows are
  // re-rendered on every highlight move, so nothing may resolve per render.
  const specsByRow = useMemo(() => {
    const map = new Map<string, readonly BadgeSpec[]>()
    for (const row of catalogRows) {
      const selected = row.provider === state.current?.provider && row.model.id === state.current.model
      map.set(rowKey(row.provider, row.model.id), badgeSpecsOf({
        address: resolveRoute(paramsSnapshot, { provider: row.provider, model: row.model.id }),
        reasoning: row.model.reasoning,
        // The effort in force: what the Host accepted on the selected row, else
        // the level the adapter would start this model at.
        effort: selected ? effectiveEffort : row.model.reasoning?.defaultEffort,
        t,
      }))
    }
    return map
  }, [catalogRows, effectiveEffort, paramsSnapshot, state.current, t])

  const trimmedQuery = query.trim()

  /**
   * Localize one provider id: the account provider carries a display name of
   * its own, everything else keeps the catalog name (also used for failures).
   * @param providerId - provider group id.
   * @param fallback - the catalog name.
   * @returns the display label.
   */
  const providerLabel = useCallback(
    (providerId: string, fallback: string): string =>
      providerId === 'deepseek-account' ? t('provider.account') : fallback,
    [t],
  )

  const groups = useMemo<DisplayGroup[]>(() => {
    // Narrowing happens here and nowhere else: it never reaches the store, so
    // the /model popup keeps listing every provider.
    if (providerFilter === RECENT_ID) {
      return recentGroupsFor(recentRowsFor(catalogRows, recent, trimmedQuery), orderedGroups, providerLabel)
    }
    const ranked = rankByName(catalogRows.map(row => row.model), trimmedQuery)
    const rankOf = new Map<CatalogModel, number>(ranked.map((model, index) => [model, index]))
    const bestRank = (candidate: DisplayGroup): number => candidate.rows.reduce(
      (best, row) => Math.min(best, rankOf.get(row.model) ?? Number.MAX_SAFE_INTEGER),
      Number.MAX_SAFE_INTEGER,
    )
    const scoped = providerFilter === null
      ? orderedGroups
      : orderedGroups.filter(group => group.id === providerFilter)
    return scoped
      .map(group => ({
        id: group.id,
        label: providerLabel(group.id, group.name),
        rows: rankByName(group.models, trimmedQuery).map(model => ({
          key: `${group.id}:${model.id}`, provider: group.id, model,
        })),
      }))
      .filter(group => group.rows.length > 0)
      // Group order follows relevance: the best-matching provider floats up,
      // and an empty query leaves catalog order untouched.
      .sort((left, right) => bestRank(left) - bestRank(right))
  }, [catalogRows, orderedGroups, providerFilter, providerLabel, recent, trimmedQuery])

  // How many rows the recent list will actually show, counted for the menu's row.
  // The cap is the SAME one the list applies: the store deliberately keeps more
  // than are shown (so that models leaving the catalog still leave the list
  // full), and a menu count read past the cap reports rows nobody can open —
  // every other row in this menu counts what you get, not what is remembered.
  const presentRecentCount = useMemo(
    () => recentRowsFor(catalogRows, recent, '', RECENT_VISIBLE).length,
    [catalogRows, recent],
  )

  // The provider menu's rows: "all providers", then "recently used", then every
  // loaded provider with its model count, then the providers whose catalog
  // failed (listed so a missing provider is explained rather than mysterious).
  // `session` marks the one this conversation actually runs on — the answer the
  // chip used to give, in the place where it cannot contradict the radio group.
  const providerOptions = useMemo<ProviderOption[]>(() => [
    { id: null, label: t('provider.all'), count: catalogRows.length, failed: false, session: false },
    { id: RECENT_ID, label: t('group.recent'), count: presentRecentCount, failed: false, session: false },
    ...orderedGroups.map(group => ({
      id: group.id,
      label: providerLabel(group.id, group.name),
      count: group.models.length,
      failed: false,
      session: group.id === state.current?.provider,
    })),
    ...state.failures.map(failure => ({
      id: failure.id,
      label: providerLabel(failure.id, failure.name),
      count: 0,
      failed: true,
      session: failure.id === state.current?.provider,
    })),
  ], [catalogRows.length, orderedGroups, presentRecentCount, providerLabel, state.current, state.failures, t])

  // What the chip NAMES. One job, and it is the same one the menu's radio group
  // does: this is the list's scope. It is deliberately NOT the session's own
  // provider — that is a different fact with a different lifetime (it moves when
  // the model or the conversation does), and giving the chip both made it
  // contradict its own menu: the menu said "全部 ✓" while the chip said
  // "commandcode", and no reading of that pair was true. The session's provider
  // is marked on the menu row that names it instead (`session:` below), which is
  // where someone asking that question is already looking.
  const activeProviderId = providerFilter
  const activeProviderLabel = activeProviderId === null
    ? t('provider.all')
    : // Until the catalog loads there is no option to take a name from, so the
      // id stands in for itself (still localized when it names the account).
      providerOptions.find(option => option.id === activeProviderId)?.label
      ?? providerLabel(activeProviderId, activeProviderId)

  // Every provider this catalog knows about, failed ones included: they are
  // listed in the menu, so a filter naming one of them is still a filter the
  // user can see and clear. "Recently used" is in here by construction — its
  // row is unconditional — which is what keeps the cleanup below from throwing
  // away a remembered "recently used" every time the catalog settles.
  const knownProviders = useMemo(() => new Set(
    providerOptions.flatMap(option => option.id === null ? [] : [option.id]),
  ), [providerOptions])

  // Written under the session the value belongs to, not under whatever session
  // the seat happens to be on when the effect runs — `filterSession` is the one
  // kept in step with `sessionId` above, so the two can never disagree.
  useEffect(() => { rememberProviderFilter(filterSession, providerFilter) }, [filterSession, providerFilter])

  // A remembered provider this catalog does not offer (removed, or renamed)
  // would narrow the list to nothing with no visible reason, so it is dropped —
  // but only once the catalog has actually loaded: an unloaded catalog knows no
  // providers, and that must not be mistaken for "this provider is gone".
  useEffect(() => {
    if (providerFilter === null || state.status !== 'ready') return
    if (knownProviders.has(providerFilter)) return
    setProviderFilter(null)
  }, [knownProviders, providerFilter, state.status])

  const rows = useMemo(() => groups.flatMap(group => group.rows), [groups])
  const indexOfRow = useMemo(() => new Map(rows.map((row, index) => [row.key, index])), [rows])
  const currentVisibleIndex = rows.findIndex(row =>
    row.provider === state.current?.provider && row.model.id === state.current.model)
  const activeIndex = rows.length === 0
    ? -1
    : Math.min(highlight ?? Math.max(0, currentVisibleIndex), rows.length - 1)
  const pending = state.pending
  const busy = pending !== null

  const reload = (): void => {
    lastActionRef.current = 'load'
    setRecent(readRecent())
    load()
  }

  // The gear's edited dot is a claim about the Host's config, so the settings
  // snapshot is read once per mounted seat rather than when the panel opens.
  useEffect(() => { params.ensure() }, [params])

  // Remember the route in use, whichever entry set it: the /model popup keeps
  // the same store, so this is how its switches reach the Recent group.
  useEffect(() => {
    if (state.current === null) return
    const route = rowKey(state.current.provider, state.current.model)
    if (routeRef.current === route) return
    routeRef.current = route
    remember(state.current.provider, state.current.model)
    setRecent(readRecent())
  }, [state.current])

  useEffect(() => {
    if (!open && !providerAt && !settingsAt) return
    const closeOutside = (event: MouseEvent): void => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) === true) return
      if (menuRef.current?.contains(target) === true) return
      if (providerMenuRef.current?.contains(target) === true) return
      if (settingsMenuRef.current?.contains(target) === true) return
      setOpen(false)
      setProviderAt(false)
      setSettingsAt(false)
    }
    document.addEventListener('mousedown', closeOutside)
    return () => { document.removeEventListener('mousedown', closeOutside) }
  }, [open, providerAt, settingsAt])

  // The other way out. This seat is a `position: fixed` anchor, and its three
  // surfaces are portaled to the body, so the Host can remove the composer from
  // the page and leave all three on screen with no anchor at all — a question
  // card does exactly this (§5.18). An outside CLICK dismisses for the same
  // reason this does: a popover whose trigger is gone is not a thing the user
  // can still be reading, and the panel is measured once, from a rect that no
  // longer describes anything. All three go together, because they already
  // share the one-at-a-time contract and a model list over a vanished composer
  // is the same defect as a parameter panel over one.
  useEffect(() => {
    if (!open && !providerAt && !settingsAt) return
    return observeSeatLoss(
      () => rootRef.current,
      () => {
        setOpen(false)
        setProviderAt(false)
        setSettingsAt(false)
        // Focus is not handed back anywhere: the trigger the popover would
        // return it to is inside the box that just disappeared, and the Host's
        // card takes focus for its own answer controls.
        setSelectionFocus(false)
      },
    )
  }, [open, providerAt, settingsAt])

  useEffect(() => {
    const viewport = groupsRef.current
    if (viewport === null) return
    return observeStickyMenuGroups(viewport)
  }, [available, open, groups])

  // The card is `visibility: hidden` until the anchor hook has measured it, and
  // a hidden input cannot take focus — so the search seat is focused on the
  // first commit that is actually placed. Later re-placements (scroll, resize)
  // must not steal the keyboard back, hence the containment guard.
  useLayoutEffect(() => {
    if (!open || menuPos === null) return
    const active = document.activeElement
    if (active instanceof Node && menuRef.current?.contains(active) === true) return
    searchRef.current?.focus()
  }, [open, menuPos])

  useLayoutEffect(() => {
    if (open && activeIndex >= 0) {
      rowRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, activeIndex, rows])

  if (!available) return null

  const show = (): void => {
    setSelectionFocus(false)
    triggerRef.current?.focus()
    setQuery('')
    setHighlight(null)
    // Only one popover at a time: the provider filter and the parameter panel are
    // composer controls, not levels inside the model menu.
    setProviderAt(false)
    setSettingsAt(false)
    setRecent(readRecent())
    setOpen(true)
    reload()
  }

  /**
   * Close the seat.
   * @param restoreFocus - hand the keyboard back to the trigger.
   */
  const close = (restoreFocus = false): void => {
    setOpen(false)
    setProviderAt(false)
    setSettingsAt(false)
    if (restoreFocus) queueMicrotask(() => { triggerRef.current?.focus() })
  }

  /**
   * Open or close the provider filter, choosing the side the chip has room for.
   */
  const toggleProviderMenu = (): void => {
    if (providerAt) {
      setProviderAt(false)
      return
    }
    const anchor = providerChipRef.current
    const rect = anchor?.getBoundingClientRect()
    if (rect !== undefined && rect !== null) {
      const estimated = (providerOptions.length + 1) * 34 + 44
      const below = window.innerHeight - rect.bottom
      setProviderSide(below < estimated && rect.top > below ? 'top' : 'bottom')
    }
    // The model menu and this one never share the screen.
    setOpen(false)
    setSettingsAt(false)
    setProviderAt(true)
  }

  /**
   * Close the provider filter.
   * @param restoreToChip - hand focus back to the provider chip.
   */
  const closeProviderMenu = (restoreToChip: boolean): void => {
    setProviderAt(false)
    if (restoreToChip) queueMicrotask(() => { providerChipRef.current?.focus() })
  }

  /**
   * Open or close the parameter panel, choosing the side the gear has room for.
   */
  const toggleSettings = (): void => {
    if (settingsAt) {
      setSettingsAt(false)
      return
    }
    const rect = settingsButtonRef.current?.getBoundingClientRect()
    if (rect !== undefined) {
      // The panel is the tallest surface here; estimate the three sections and
      // the note so a cramped composer opens it upward instead of off-screen.
      const estimated = 330
      const below = window.innerHeight - rect.bottom
      const top = below < estimated && rect.top > below ? 'top' : 'bottom'
      setSettingsSide(top)
      // The card gets its own height budget from the measured free space: the
      // 8px gap to the gear plus the 20px viewport margin the anchor hook keeps.
      const room = top === 'top' ? rect.top - 28 : below - 28
      setSettingsBudget(Math.max(240, Math.min(460, room)))
    }
    // One popover at a time: this is a sibling of the other two, not a level.
    setOpen(false)
    setProviderAt(false)
    setSettingsAt(true)
  }

  /**
   * Close the parameter panel.
   * @param restoreToGear - hand focus back to the gear.
   */
  const closeSettings = (restoreToGear: boolean): void => {
    setSettingsAt(false)
    if (restoreToGear) queueMicrotask(() => { settingsButtonRef.current?.focus() })
  }

  const closeAfterSelection = (): void => {
    setSelectionFocus(true)
    close(true)
  }

  /**
   * Announce a failed model operation through the seat's toast.
   * @param text - the already-localized message.
   */
  const showFailure = (text: string): void => {
    toastSeq.current += 1
    setToast({ seq: toastSeq.current, text })
  }

  const settleSelection = (result: Awaited<ReturnType<PickerProps['select']>>): void => {
    if (result === undefined) return
    if (result.ok) {
      if (rootRef.current !== null) closeAfterSelection()
      return
    }
    const { error } = result
    showFailure(error.code === 'session/writer-held'
      ? t('error.sessionInUse')
      : t('error.action', { message: `${error.code}: ${error.message}` }))
  }

  const submit = (selection: ModelSelection): void => {
    lastActionRef.current = 'select'
    // Rows a selection in flight disables cannot hold the keyboard; the trigger
    // does, so the card's keys still reach the menu.
    setSelectionFocus(true)
    triggerRef.current?.focus()
    void select(selection).then(settleSelection)
  }

  const choose = (row: Row): void => {
    if (state.current?.provider === row.provider && state.current.model === row.model.id) {
      closeAfterSelection()
      return
    }
    // A plain row pick keeps the adapter's own default effort.
    submit({ provider: row.provider, model: row.model.id })
  }

  /**
   * The row that currently holds DOM focus.
   * @returns its flat index, or null when focus is elsewhere (the search box).
   */
  const focusedIndexOf = (): number | null => {
    const active = document.activeElement
    if (active === null) return null
    const rowIndex = rowRefs.current.findIndex(element => element === active)
    return rowIndex === -1 ? null : rowIndex
  }

  /**
   * Move the keyboard along the panel's own focus chain: search box, then each
   * row. The rows carry no controls of their own any more — a row is one target,
   * and effort is a fact it states, not a thing it does. Traversal never leaves
   * the card; the ends wrap, and stepping back off the search box closes the
   * seat like Escape does.
   * @param delta - +1 forward, -1 backward.
   */
  const moveTab = (delta: number): void => {
    // The provider chip sits in the composer to the trigger's left, so the
    // panel's chain starts there rather than pretending the menu is the world.
    const chain: (HTMLElement | null)[] = [providerChipRef.current, searchRef.current]
    rows.forEach((_row, index) => {
      chain.push(rowRefs.current[index] ?? null)
    })
    const elements = chain.filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) return
    const active = document.activeElement instanceof HTMLElement ? elements.indexOf(document.activeElement) : -1
    const next = active === -1 ? (delta > 0 ? 0 : elements.length - 1) : active + delta
    if (next < 0) {
      close(true)
      return
    }
    elements[next % elements.length]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.nativeEvent.isComposing) return
    // The provider and settings surfaces own every key they consume and stop it
    // there.
    if (providerAt || settingsAt) return
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      if (query !== '') {
        setQuery('')
        setHighlight(null)
        searchRef.current?.focus()
        return
      }
      close(true)
      return
    }
    if (!open) return
    const onSearch = document.activeElement === searchRef.current
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && rows.length > 0) {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      // With the search box focused the highlight moves on its own
      // (aria-activedescendant); otherwise the keyboard walks the rows.
      const base = highlight ?? activeIndex
      const next = (base + delta + rows.length) % rows.length
      if (onSearch) {
        setHighlight(next)
        rowRefs.current[next]?.scrollIntoView({ block: 'nearest' })
      } else {
        setHighlight(next)
        rowRefs.current[next]?.focus()
      }
      return
    }
    if (event.key === 'Enter') {
      const index = focusedIndexOf()
      if (index !== null) {
        event.preventDefault()
        const row = rows[index]
        if (row === undefined || busy) return
        choose(row)
        return
      }
      if (onSearch && activeIndex >= 0) {
        const row = rows[activeIndex]
        if (row !== undefined && !busy) {
          event.preventDefault()
          choose(row)
        }
      }
      return
    }
    if (event.key === 'Tab') {
      // The card keeps the browser's traversal out while it is open.
      event.preventDefault()
      moveTab(event.shiftKey ? -1 : 1)
    }
  }

  const onBlur = (event: FocusEvent<HTMLDivElement>): void => {
    const target = event.relatedTarget
    if (target instanceof Node && (
      rootRef.current?.contains(target) === true
      || menuRef.current?.contains(target) === true
      || providerMenuRef.current?.contains(target) === true
      || settingsMenuRef.current?.contains(target) === true
    )) return
    // A focus move with no destination is not a departure: React detaches a
    // control that leaves the tree (every control of the parameter panel is
    // disabled while a settings write is in flight), and that unmount fires
    // focusout with a null relatedTarget. Treating it as a departure closed the
    // whole seat mid-write, on the Enter that submitted a new value.
    if (event.currentTarget.contains(document.activeElement) || document.activeElement === document.body) return
    close()
  }

  const waiting = state.current === null && state.status === 'loading'
  const modelLabel = waiting
    ? t('trigger.loading')
    : currentRow?.model.name
      ?? (state.current === null ? t('trigger.fallback') : `${state.current.provider}/${state.current.model}`)
  // The chip names the model and nothing else: the effort in force is a
  // parameter, it is stated by the row's badge and edited in the panel, and
  // repeating it beside the name only competes with the name for width.
  const triggerAria = waiting
    ? t('trigger.loading')
    : state.current === null
      ? t('trigger.selectAria')
      : effortLabel === undefined
        ? t('trigger.aria', { model: modelLabel })
        : t('trigger.ariaEffort', { model: modelLabel, effort: effortLabel })
  const settingsTitle = state.current === null
    ? t('settings.openNoModel')
    : declaredCurrent
      ? `${t('settings.open')} · ${t('settings.openDeclared')}`
      : t('settings.open')

  rowRefs.current = []

  return (
    <div
      ref={rootRef}
      className="dmp-root"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onMouseDown={(event) => {
        // WebKit blurs a focused control before click unless the mousedown keeps it.
        if (event.target instanceof Element && event.target.closest('button,[role="menuitemradio"]') !== null) {
          event.preventDefault()
        }
      }}
    >
      {/* The provider control sits to the model trigger's left and narrows the
          list below; it is deliberately part of this seat so the two chips are
          guaranteed adjacent, and it shares the composer's compact contract. */}
      <Tooltip label={activeProviderLabel} side="top" align="end" portal disabled={providerAt}>
        <button
          ref={providerChipRef}
          type="button"
          className={providerAt ? 'dmp-provider dmp-provider-open' : 'dmp-provider'}
          aria-label={t('provider.chipAria', { name: activeProviderLabel })}
          aria-haspopup="menu"
          aria-expanded={providerAt}
          aria-controls={providerAt ? `${id}-provider-menu` : undefined}
          data-filtered={providerFilter === null ? undefined : ''}
          data-selection-focus={providerAt ? '' : undefined}
          disabled={locked}
          onClick={toggleProviderMenu}
        >
          <IconApiOutlineRegular className="dmp-provider-icon" size={16} />
          <span className="dmp-provider-label">{activeProviderLabel}</span>
          <IconChevronDownOutlineRegular className={providerAt ? 'dmp-chevron dmp-chevron-open' : 'dmp-chevron'} />
        </button>
      </Tooltip>

      {/* Narrow rows drop the text through the composer's own display variables;
          the bubble is hover/focus only, so it is the one place the full name
          stays readable there. It repeats the NAME, not the effort: the effort
          is the settings panel's subject. */}
      <Tooltip label={modelLabel} side="top" align="end" portal disabled={open}>
        <button
          ref={triggerRef}
          type="button"
          className="dmp-trigger"
          aria-label={triggerAria}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? `${id}-menu` : undefined}
          aria-busy={busy}
          data-selection-focus={selectionFocus ? '' : undefined}
          onBlur={() => { setSelectionFocus(false) }}
          disabled={locked}
          onClick={() => {
            if (open) close(true)
            else show()
          }}
        >
          <IconDataOutlineRegular className="dmp-trigger-icon" size={16} />
          <span className="dmp-trigger-label">{modelLabel}</span>
          {busy
            ? <StateDot state="ongoing" />
            : <IconChevronDownOutlineRegular className={open ? 'dmp-chevron dmp-chevron-open' : 'dmp-chevron'} />}
        </button>
      </Tooltip>

      {/* Parameters of the model in use. It sits to the trigger's RIGHT so the
          "provider → model" pair stays untouched, and it is icon-only because
          the composer's own display variables are about the model label; the
          gear therefore keeps its accessible name from the label, not from CSS. */}
      <Tooltip label={settingsTitle} side="top" align="end" portal disabled={settingsAt}>
        <button
          ref={settingsButtonRef}
          type="button"
          className={settingsAt ? 'dmp-settings-button dmp-settings-open' : 'dmp-settings-button'}
          aria-label={state.current === null
            ? t('settings.openNoModel')
            : t('settings.openAria', { model: modelLabel })}
          aria-haspopup="menu"
          aria-expanded={settingsAt}
          aria-controls={settingsAt ? `${id}-settings` : undefined}
          data-edited={declaredCurrent ? '' : undefined}
          data-selection-focus={settingsAt ? '' : undefined}
          // Nothing to parameterize before a model is selected; the tooltip says so.
          disabled={locked || state.current === null}
          onClick={toggleSettings}
        >
          <IconSettingsOutlineRegular className="dmp-settings-icon" size={16} />
        </button>
      </Tooltip>

      {/* Portaled to body so the sidebar and the columns' overflow clips cannot
          crop the card; synthetic events still bubble through this React
          subtree, keeping onKeyDown/onBlur live. */}
      {open && createPortal(
        <MenuSurface
          ref={menuRef}
          id={`${id}-menu`}
          className="dmp-menu"
          style={menuPos ?? MEASURE_STYLE}
          role="group"
          aria-label={t('menu.aria')}
          aria-busy={state.status === 'loading' || busy}
        >
          <div className="dmp-search-row">
            <Input
              ref={searchRef}
              className={query === '' ? 'dmp-search' : 'dmp-search dmp-search-with-query'}
              type="text"
              role="searchbox"
              aria-label={t('search.placeholder')}
              aria-controls={`${id}-models`}
              aria-activedescendant={activeIndex < 0 ? undefined : `${id}-row-${activeIndex}`}
              placeholder={t('search.placeholder')}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setHighlight(0)
              }}
            />
            {query !== '' && (
              <button
                type="button"
                className="dmp-search-clear"
                aria-label={t('search.clear')}
                disabled={busy}
                onClick={() => {
                  setQuery('')
                  setHighlight(null)
                  searchRef.current?.focus()
                }}
              >
                <IconCloseFillRegular />
              </button>
            )}
          </div>

          {state.status === 'loading' && <div className="dmp-status" role="status">{t('status.loading')}</div>}
          {/* While narrowed, say so inside the card too: the chip is outside it,
              and a one-line list with no explanation reads as a missing catalog. */}
          {providerFilter !== null && (
            <div className="dmp-filter-hint">
              {/* "Showing 最近使用 only" is a provider name spliced into a
                  sentence about a name; "recently used" is a subject, not a
                  provider, so it gets its own sentence. */}
              <span>{t(providerFilter === RECENT_ID ? 'provider.filteredRecent' : 'provider.filtered', { name: activeProviderLabel })}</span>
              <button
                type="button"
                className="dmp-filter-clear"
                disabled={busy}
                onClick={() => { setProviderFilter(null) }}
              >
                {t('provider.showAll')}
              </button>
            </div>
          )}
          {state.error !== null && lastActionRef.current === 'load' && (
            <div className="dmp-error">
              <IconWarningOutlineRegular className="dmp-error-icon" />
              <span>{t('error.action', { message: state.error })}</span>
              <button type="button" className="dmp-retry" onClick={reload}>{t('action.reload')}</button>
            </div>
          )}
          {state.failures.map(failure => (
            <div className="dmp-warning" key={failure.id}>
              <IconWarningOutlineRegular className="dmp-error-icon" />
              <span>
                {t('warning.groupLoad', {
                  name: providerLabel(failure.id, failure.name),
                  message: failure.message,
                })}
              </span>
              <button type="button" className="dmp-retry" onClick={reload}>{t('action.reload')}</button>
            </div>
          ))}

          <div
            ref={groupsRef}
            id={`${id}-models`}
            className="dmp-groups scrollable"
            role="menu"
            aria-label={t('menu.model')}
            hidden={rows.length === 0}
          >
            {groups.map(group => (
              <MenuGroup key={group.id} label={group.label}>
                {group.rows.map((row) => {
                  const index = indexOfRow.get(row.key) ?? -1
                  const selected = row.provider === state.current?.provider && row.model.id === state.current.model
                  // The facts of this route, resolved once per catalog/settings
                  // revision: the row only renders them.
                  const specs = specsByRow.get(rowKey(row.provider, row.model.id)) ?? []
                  const facts = specs.map(spec => spec.sentence).join(t('settings.listJoin'))
                  const rowPending = pending !== null
                    && pending.provider === row.provider && pending.model === row.model.id
                  return (
                    <div
                      key={row.key}
                      ref={(element) => { rowRefs.current[index] = element }}
                      id={`${id}-row-${index}`}
                      role="menuitemradio"
                      aria-checked={selected}
                      // The badge strip is decoration plus values ("High", "128K");
                      // the row's own name carries the whole sentence instead, so a
                      // screen reader hears "model: facts", not a bag of numbers.
                      aria-label={facts === ''
                        ? row.model.name
                        : t('badge.rowAria', { model: row.model.name, facts })}
                      aria-disabled={busy || undefined}
                      data-active={index === activeIndex ? '' : undefined}
                      className="dmp-row"
                      tabIndex={-1}
                      onMouseDown={() => { rowRefs.current[index]?.focus() }}
                      onMouseMove={busy || index === activeIndex ? undefined : () => { setHighlight(index) }}
                      onClick={() => { if (!busy) choose(row) }}
                    >
                      <span className="dmp-row-copy">
                        <span className="dmp-row-name" title={row.model.name}>{row.model.name}</span>
                        {specs.length > 0 && (
                          <span className="dmp-badges" title={facts} aria-hidden="true">
                            {specs.map(spec => (
                              // `Tag` renders a span, never a button: a fact badge
                              // cannot be clicked into anything, by construction.
                              // Every badge is the SAME two-cell capsule: the icon
                              // cell states which fact, the text cell names its
                              // value (or stays empty for the two yes/no ones).
                              <Tag
                                key={spec.fact}
                                tone={spec.off ? 'quiet' : 'neutral'}
                                className="dmp-badge"
                              >
                                <span className="dmp-badge-fact">
                                  <BadgeIcon fact={spec.fact} off={spec.off} className="dmp-badge-icon" />
                                </span>
                                {spec.value !== '' && <span className="dmp-badge-value">{spec.value}</span>}
                              </Tag>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className="dmp-check">
                        {rowPending
                          ? <StateDot state="ongoing" />
                          : selected ? <IconCheckOutlineRegular /> : null}
                      </span>
                    </div>
                  )
                })}
              </MenuGroup>
            ))}
          </div>

          {state.status === 'ready' && rows.length === 0 && (
            <div className="dmp-empty" role="status">
              {/* One sentence per reason the list came up empty. "Recently
                  used" gets its own because there are two ways to get here —
                  nothing was ever used, or every remembered route has since
                  left the catalog — and "this provider has no models" would
                  blame the wrong thing for both. */}
              {t(providerFilter === RECENT_ID
                ? 'empty.recent'
                : providerFilter !== null
                  ? 'empty.provider'
                  : catalogRows.length === 0 ? 'empty.models' : 'search.empty')}
            </div>
          )}
        </MenuSurface>,
        document.body,
      )}

      {providerAt && createPortal(
        <ProviderMenu
          anchorRef={providerChipRef}
          panelRef={providerMenuRef}
          idPrefix={id}
          side={providerSide}
          options={providerOptions}
          current={providerFilter}
          busy={busy}
          t={t}
          onPick={(providerId) => {
            setProviderFilter(providerId)
            closeProviderMenu(true)
          }}
          onClose={closeProviderMenu}
        />,
        document.body,
      )}

      {settingsAt && createPortal(
        <SettingsMenu
          anchorRef={settingsButtonRef}
          panelRef={settingsMenuRef}
          idPrefix={id}
          side={settingsSide}
          directory={directory}
          params={params}
          busy={busy}
          maxHeight={settingsBudget}
          t={t}
          onSelect={(selection) => { submit(selection) }}
          onClose={closeSettings}
        />,
        document.body,
      )}

      {toast !== null && (
        <Toast
          key={toast.seq}
          text={toast.text}
          icon={<IconWarningOutlineRegular />}
          anchor={rootRef.current?.closest<HTMLElement>('[data-composer-card]') ?? null}
          onDone={() => { setToast(null) }}
        />
      )}
    </div>
  )
}
