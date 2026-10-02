/**
 * The model-provider menu: which provider the model list is narrowed to.
 *
 * It is a separate popover from the model menu on purpose. Narrowing is pure
 * VIEW state — the Host never learns about it, `/model` keeps listing every
 * provider, and the shared selection is untouched. The choice therefore only
 * shortens the model list; it can never change what the session runs on, and a
 * model that is outside the current filter still shows in the trigger, because
 * the trigger reports the truth rather than the filter.
 *
 * Keyboard model matches the effort menu (rows take real focus; this level
 * owns and stops the keys it consumes), because that is enough for a list whose
 * jobs are "show me the providers" and "pick one".
 *
 * @module dsh-model-picker/client/ProviderMenu
 */

import {
  IconCheckOutlineRegular, IconCloseFillRegular, Input, MenuGroup, MenuSurface,
  observeStickyMenuGroups, rankByName, useAnchoredPosition,
} from '@deepseek-ai/dsh-client-ui-primitives'
import {
  useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type CSSProperties, type KeyboardEvent, type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import type { Translate } from './contract.ts'

/** Unplaced portal card: hidden but laid out at a fixed origin so measurement is real. */
const MEASURE_STYLE: CSSProperties = { visibility: 'hidden', left: 0, top: 0 }

/** One row of the provider menu. `id: null` is the "all providers" row. */
export interface ProviderOption {
  /** Provider id, or null for the unfiltered row. */
  readonly id: string | null
  /** Display label (account provider already localized by the caller). */
  readonly label: string
  /** Models this provider currently offers (0 for a failed provider). */
  readonly count: number
  /** The provider's catalog lookup failed: listed for visibility, never selectable. */
  readonly failed: boolean
  /** This conversation currently runs on this provider (marked on the row). */
  readonly session: boolean
}

/** Props of the provider menu. */
export interface ProviderMenuProps {
  /** The chip this menu hangs off. */
  readonly anchorRef: RefObject<HTMLElement | null>
  /** The menu element; the parent also uses it to contain blur/outside checks. */
  readonly panelRef: RefObject<HTMLDivElement | null>
  /**
   * This plugin's `useId` prefix. The card's id is composed here so the chip's
   * `aria-controls` and the element it points at cannot drift apart.
   */
  readonly idPrefix: string
  /** Which side of the chip to open on (the parent measured the free space). */
  readonly side: 'top' | 'bottom'
  /** Every provider in catalog order, with the "all providers" row first. */
  readonly options: readonly ProviderOption[]
  /** The active filter; null when unfiltered. */
  readonly current: string | null
  /** A selection is in flight: the list is inert. */
  readonly busy: boolean
  /** Translator for the plugin namespace. */
  readonly t: Translate
  /** Choose one provider, or null to clear the filter. */
  readonly onPick: (id: string | null) => void
  /**
   * Leave this level.
   * @param restoreToChip - whether the parent should hand focus back to the chip.
   */
  readonly onClose: (restoreToChip: boolean) => void
}

/**
 * Render the anchored provider list.
 * @param props - see {@link ProviderMenuProps}.
 * @returns the portaled menu card.
 */
export function ProviderMenu({
  anchorRef, panelRef, idPrefix, side, options, current, busy, t, onPick, onClose,
}: ProviderMenuProps) {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement | null>(null)
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const position = useAnchoredPosition({ open: true, anchorRef, panelRef, side, align: 'end', gap: 8, margin: 12 })
  const listId = useId()

  const searchable = useMemo(() => options.map(option => ({ name: option.label, option })), [options])
  const visible = useMemo(
    () => rankByName(searchable, query.trim()).map(entry => entry.option),
    [searchable, query],
  )

  // The group heading is `position: sticky` with a TRANSPARENT background; the
  // primitive paints it only once the observer marks it `data-stuck`. Without
  // this, rows scroll underneath a transparent heading and the two texts draw on
  // top of each other — the defect this effect exists to prevent.
  useEffect(() => {
    const viewport = viewportRef.current
    if (viewport === null) return
    return observeStickyMenuGroups(viewport)
  }, [visible])

  // Gated on the measured position: while the card is still placing it is
  // `visibility: hidden`, and a hidden input cannot take focus.
  useLayoutEffect(() => {
    if (position === null) return
    searchRef.current?.focus()
  }, [position])

  /**
   * Move focus along this level's own chain: the search box, then the rows.
   * @param delta - +1 forward, -1 backward.
   */
  const moveTab = (delta: number): void => {
    const chain: (HTMLElement | null)[] = [
      searchRef.current,
      ...rowRefs.current.filter((row): row is HTMLButtonElement => row !== null && !row.disabled),
    ]
    const elements = chain.filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) return
    const active = document.activeElement instanceof HTMLElement ? elements.indexOf(document.activeElement) : -1
    const next = active === -1 ? (delta > 0 ? 0 : elements.length - 1) : active + delta
    elements[(next + elements.length) % elements.length]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.nativeEvent.isComposing) return
    switch (event.key) {
      case 'Escape':
      case 'ArrowLeft':
        event.preventDefault()
        event.stopPropagation()
        onClose(true)
        return
      case 'ArrowDown':
      case 'ArrowUp': {
        // The arrow that leaves the search box lands on the list; inside the
        // list it steps between rows.
        event.preventDefault()
        event.stopPropagation()
        moveTab(event.key === 'ArrowDown' ? 1 : -1)
        return
      }
      case 'Tab':
        // Keep traversal inside this level; Escape/← is the way back out.
        event.preventDefault()
        event.stopPropagation()
        moveTab(event.shiftKey ? -1 : 1)
        return
      default:
    }
  }

  rowRefs.current = []
  return createPortal(
    <MenuSurface
      ref={panelRef}
      id={`${idPrefix}-provider-menu`}
      className="dmp-menu dmp-provider-menu"
      style={position ?? MEASURE_STYLE}
      role="group"
      aria-label={t('provider.menuAria')}
      onKeyDown={onKeyDown}
    >
      <div className="dmp-search-row">
        <Input
          ref={searchRef}
          className={query === '' ? 'dmp-search' : 'dmp-search dmp-search-with-query'}
          type="text"
          role="searchbox"
          aria-label={t('provider.search')}
          aria-controls={listId}
          placeholder={t('provider.search')}
          value={query}
          onChange={(event) => { setQuery(event.target.value) }}
        />
        {query !== '' && (
          <button
            type="button"
            className="dmp-search-clear"
            aria-label={t('search.clear')}
            onClick={() => {
              setQuery('')
              searchRef.current?.focus()
            }}
          >
            <IconCloseFillRegular />
          </button>
        )}
      </div>

      <div
        ref={viewportRef}
        id={listId}
        className="dmp-groups scrollable"
        role="menu"
        aria-label={t('provider.group')}
        hidden={visible.length === 0}
      >
        <MenuGroup label={t('provider.group')}>
          {visible.map((option, index) => (
            <button
              key={option.id ?? 'all'}
              ref={(element) => { rowRefs.current[index] = element }}
              type="button"
              role="menuitemradio"
              aria-checked={option.id === current}
              className="dmp-row"
              disabled={busy || option.failed}
              onClick={() => { onPick(option.id) }}
            >
              <span className="dmp-row-copy">
                <span className="dmp-row-name">{option.label}</span>
                {/* Which provider this conversation runs on. It lives on the row
                    that NAMES it: the chip says what the list is scoped to, and
                    the radio group beside it agrees with that. Two claims about
                    different things would have to share the chip, and they only
                    ever agreed half the time. */}
                {option.session && <span className="dmp-provider-session">{t('provider.sessionHere')}</span>}
              </span>
              <span className={option.failed ? 'dmp-provider-failed' : 'dmp-provider-count'}>
                {option.failed && <span className="dmp-provider-failed-dot" aria-hidden="true" />}
                {option.failed ? t('provider.failed') : option.count}
              </span>
              <span className="dmp-check">
                {option.id === current ? <IconCheckOutlineRegular /> : null}
              </span>
            </button>
          ))}
        </MenuGroup>
      </div>

      {visible.length === 0 && <div className="dmp-status" role="status">{t('search.empty')}</div>}
    </MenuSurface>,
    document.body,
  )
}
