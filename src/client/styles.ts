/**
 * The plugin's stylesheet, injected once per activation.
 *
 * An out-of-repo plugin has no build-time CSS-module pipeline, so the sheet is
 * a single owned `<style>` element created in `apply` and removed by its
 * disposer. Every class name is `dmp-`-prefixed and global; the static
 * selfcheck cross-checks the sheet and the TSX against each other so a dead
 * rule or a typo'd class cannot ship silently.
 *
 * Colors come only from host semantic tokens (`--dsw-*`); the two
 * `--dsh-composer-model-*` display variables are the composer's narrow-row
 * contract and are consumed exactly as the incumbent seat consumes them.
 *
 * @module dsh-model-picker/client/styles
 */

/** Id of the owned style element (stable, so re-activation replaces it). */
const STYLE_ELEMENT_ID = 'dsh-model-picker-styles'

/** The stylesheet. */
const CSS = `
.dmp-root {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
}

/* Shared chip chrome: the model trigger and the provider chip read as one pair.
   They keep SEPARATE class names on purpose — sharing one name made the two
   controls indistinguishable to every selector, including tests and tooling.
   The settings gear joins the hover/focus/disabled contract but NOT this block:
   it is icon-only at every width, so it has no text to collapse. */
.dmp-trigger,
.dmp-provider {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  max-width: 220px;
  max-width: min(360px, 45cqw);
  height: 28px;
  padding: 0 4px 0 8px;
  border: none;
  border-radius: var(--dsw-radius-sm);
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  cursor: pointer;
}

.dmp-trigger:hover:not(:disabled),
.dmp-provider:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dmp-trigger:focus-visible:not([data-selection-focus]),
.dmp-provider:focus-visible:not([data-selection-focus]) {
  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
}

.dmp-trigger:disabled,
.dmp-provider:disabled {
  color: var(--dsw-alias-label-dimmed);
  cursor: default;
}

/* The composer measures expanded row demand and owns this display variable;
   this seat only consumes it. Outside a composer the trigger keeps its text,
   and the icon stays hidden.
   The trigger labels the MODEL and nothing else: the effort in force is a
   parameter (the row's badge states it, the panel edits it) and repeating it
   beside the name only competes with the name for width. There is therefore no
   separator element to keep alive here — do not reintroduce one. */
.dmp-trigger-label {
  display: var(--dsh-composer-model-text-display, block);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dmp-trigger-icon {
  display: var(--dsh-composer-model-icon-display, none);
  flex: 0 0 auto;
}

.dmp-chevron {
  flex: 0 0 auto;
  color: var(--dsw-alias-label-caption);
  transition: transform 120ms ease;
}

.dmp-chevron-open {
  transform: rotate(180deg);
}

/* The provider chip is the secondary control of the pair: narrower until it
   actually filters, when it tones up to the trigger's own ink. It is NOT
   demoted to the caption token, even unfiltered: this chip renders the word
   "全部", which is the control's whole label, and the caption ink measures
   2.08:1 on this card in the light theme. Declared after the shared block so
   these equal-specificity overrides win. */
.dmp-provider {
  max-width: 100px;
  max-width: min(160px, 22cqw);
  color: var(--dsw-alias-label-secondary);
}

.dmp-provider[data-filtered] {
  color: var(--dsw-alias-label-primary);
}

.dmp-provider-open {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dmp-provider-label {
  display: var(--dsh-composer-model-text-display, block);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dmp-provider-icon {
  display: var(--dsh-composer-model-icon-display, none);
  flex: 0 0 auto;
}

/* The parameter gear: the trigger pair's right-hand companion. Icon-only by
   design (it carries no model text), so the composer's narrow-row variables do
   not apply to it and a 28px square is all the width it ever asks for. */
.dmp-settings-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--dsw-radius-sm);
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-caption);
  cursor: pointer;
}

.dmp-settings-button:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
}

.dmp-settings-button:focus-visible:not([data-selection-focus]) {
  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
}

.dmp-settings-button:disabled {
  color: var(--dsw-alias-label-dimmed);
  cursor: default;
}

/* A route with a record tones the gear up; the open state is spelled by its own
   class so the two do not have to be told apart by specificity. */
.dmp-settings-button[data-edited] {
  color: var(--dsw-alias-label-secondary);
}

.dmp-settings-open {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

/* Portaled to body and placed from the trigger rect, so the sidebar and the
   columns' overflow clips cannot crop the card. border-box keeps the OUTER
   width inside the design budget (padding included). */
.dmp-menu {
  position: fixed;
  z-index: 1100;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(320px, calc(100vw - 32px));
  max-height: min(420px, calc(100vh - 96px));
  overflow: hidden;
  padding: 4px;
  border: 0;
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
  box-shadow: var(--dsw-elevation-prominent);
  color: var(--dsw-alias-label-primary);
  /* Elevated surface: the scrollbar thumb takes the l2 elevation tokens. */
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
}

/* Status and empty copy are sentences a user is meant to read ("正在刷新模型列表…",
   "没有匹配的模型。"), not chrome: the tertiary ink measured 3.61:1 on this card
   in the light theme, under AA for 12px text. Same ink as every other
   explanatory line. */
.dmp-status,
.dmp-empty {
  padding: 8px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}

/* A load failure and a partial failure. The failure signal is the host's danger
   fill plus the icon, NOT the ink: the host's error token measures 4.38:1 light
   and 3.61:1 dark on this card, which is under AA for any of these sizes, and
   the only size at which that red becomes compliant is 24px — absurd for a
   one-line callout. So the sentence takes ordinary readable ink and the state is
   carried by the fill, the icon and the words themselves (the message says the
   load failed). An error that is red but unreadable is worse than one that is
   neutral but legible. */
.dmp-error,
.dmp-warning {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 3px;
  padding: 6px 7px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-interactive-bg-hover-danger);
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 18px;
}

.dmp-error-icon {
  flex: 0 0 14px;
  margin-top: 1px;
  color: var(--dsw-alias-state-error-primary);
}

.dmp-warning {
  background: var(--dsw-alias-bg-module-platform);
}

.dmp-retry {
  flex: 0 0 auto;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.dmp-search-row {
  position: relative;
  flex-shrink: 0;
  margin: 2px 0 3px;
}

.dmp-search-row .dmp-search {
  display: flex;
  height: auto;
  padding: 5px 7px;
  border: 0 solid transparent;
  border-radius: var(--dsw-radius-md);
  background: transparent;
}

.dmp-search-row .dmp-search-with-query {
  padding-right: 34px;
}

.dmp-search-row .dmp-search input {
  padding: 0;
  font-size: 12px;
  line-height: normal;
}

/* The search field's placeholder is the ONLY instruction the list gives
   ("搜索模型…"), so it is held to the same ink as body copy: the caption token
   measures 2.08:1 on the card in the light theme, which is not readable, and a
   placeholder a user cannot read is not a hint. */
.dmp-search-row .dmp-search input::placeholder {
  color: var(--dsw-alias-label-secondary);
}

.dmp-search-row .dmp-search:focus-within {
  border-color: transparent;
}

.dmp-search-clear {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  corner-shape: round;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.dmp-search-clear:hover,
.dmp-search-clear:focus-visible {
  outline: none;
  background: var(--dsw-alias-interactive-bg-hover);
}

.dmp-groups {
  min-height: 0;
  overflow-y: auto;
}

/* The primitive's group heading is position:sticky with a TRANSPARENT
   background: it is painted only once observeStickyMenuGroups marks it
   data-stuck, and that observation rides the rendering pipeline
   (IntersectionObserver + ResizeObserver), which does not run while the tab is
   in the background or the window is occluded. Measured there: none of the
   three observers ever fires, so a pinned heading sits over a row with both
   texts drawn through each other. The shipped seat has the same defect. Filling
   the heading unconditionally makes it cover its rows with no observer in the
   path; the token is the host's own choice for exactly this strip. */
.dmp-groups [data-menu-group-heading] {
  background: var(--dsw-alias-menu-group-header-fill);
}

/* The model row states facts instead of offering controls, and it keeps them on
   ONE line: the name shrinks with an ellipsis while the badge strip keeps its
   own width, so a long catalog name never pushes the facts out of the row. It is
   a div rather than a button so a row can hold block content while aria-disabled
   keeps it focusable during a selection (a disabled button would drop the
   keyboard back to the trigger).

   The row is 38px tall: a 22px badge capsule plus 8px of air above and below is
   what makes the strip read as a fact line rather than as text that happens to
   have a background. The strip is kept on ONE line (flex-wrap: nowrap): a badge
   broken across two lines was the row at 46px, and a row that changes height
   because its facts wrapped is a list that jumps as the eye scans it. */
.dmp-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: auto;
  min-width: 100%;
  min-height: 38px;
  padding: 5px 7px;
  border: none;
  border-radius: var(--dsw-radius-md);
  outline: none;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

/* The rows carry aria-disabled (the provider rows in the other card are real
   buttons and carry disabled); both spellings mean the same thing here. */
.dmp-row:hover:not([aria-disabled='true']):not(:disabled),
.dmp-row:focus-visible,
.dmp-row[data-active]:not([aria-disabled='true']) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dmp-row[aria-disabled='true'],
.dmp-row:disabled {
  color: var(--dsw-alias-label-dimmed);
  cursor: default;
}

/* Trailing model count on a provider row. The count is the reason to pick one
   provider over another, so it reads in the same ink as the row rather than in
   the caption token (2.08:1 on this card in the light theme). */
.dmp-provider-count {
  flex: 0 0 auto;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
}

/* "当前会话" on the provider row this conversation runs on. Same readable ink
   as the count (caption is 2.08:1 on this card) and the same 11px, so the two
   read as one trailing information column rather than the marker looking like
   part of the provider's name. It sits inside dmp-row-copy, whose name half
   is the elastic one — so the marker lands on the row's right edge, beside the
   count, and never squeezes the name into an earlier ellipsis than its
   neighbours get. */
.dmp-provider-session {
  flex: 0 0 auto;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
}

/* The "加载失败" mark on a provider row — the only thing on that row explaining
   why it has no models. The host's warn amber measures 2.72:1 here in the light
   theme (4.26:1 in dark) and no amber token in this palette clears AA on this
   card, so the words take readable ink and the state is carried by a trailing
   red dot, which is decoration and owes no text ratio. */
.dmp-provider-failed {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}

.dmp-provider-failed-dot {
  flex: 0 0 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  corner-shape: round;
  background: var(--dsw-alias-state-error-primary);
}

/* "Only <provider> is shown" strip at the top of the model list. */
.dmp-filter-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 6px 8px 4px;
  /* This strip explains why the list is short and carries the way back to all
     providers, so it is copy rather than chrome: the tertiary ink measures
     3.61:1 on this card in the light theme, below AA for 12px text. */
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}

.dmp-filter-clear {
  flex: 0 0 auto;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.dmp-filter-clear:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
}

/* Name first, facts behind it, both on the row's single line: the name is the
   flexible half, the strip is the fixed half. */
.dmp-row-copy {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.dmp-row-name {
  flex: 1 1 auto;
  /* The name is the row's elastic half: it takes whatever the four capsules do
     not need, and it is what ellipsizes when the composer is narrow. The 48px
     floor is not a width budget — it is the point below which a name stops
     identifying a model at all. */
  min-width: 48px;
  overflow: hidden;
  color: inherit;
  font-size: 13px;
  line-height: 18px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* The fact strip: one badge per fact, in the host's Tag chrome. Nothing in here
   is a control — that is the point of the strip, so it takes no hover, no focus
   ring and no cursor.

   WIDTH IS THE SCARCE RESOURCE, so every capsule is built tight (see
   .dmp-badges .dmp-badge): the four common capsules measure ~151px together,
   where the first version of this strip measured ~212px and left the model name
   53px — barely two characters — in a 320px card. The strip is the row's fixed
   half (it keeps its own width) and the name absorbs the deficit and
   ellipsizes, which is why the name is what got the 69px back. */
.dmp-badges {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
}

/* The badge is two cells on one baseline: the icon cell and the value.
   The primitive's own capsule is 1px 8px at 11px/17px, which both wastes 16px
   of width on a two-cell badge and leaves the icon floating in padding; these
   overrides make it a 22px-tall capsule whose horizontal padding is only the
   4px the capsule edge needs. min-height is stated rather than derived from the
   icon cell, so the capsule keeps its height while the cell stays exactly as
   wide as the glyph — a wide cell is pure width with nothing in it.
   Specificity beats the primitive's own .tag padding regardless of which
   stylesheet the shell injects first. */
.dmp-badges .dmp-badge {
  gap: 3px;
  min-height: 22px;
  padding: 0 4px;
  font-weight: 400;
}

/* The icon cell: it states WHICH fact, so it is never the value's leftover, and
   it is the same size in every badge of the row whether the badge behind it
   carries text or not. It is exactly the glyph's box — the artwork carries its
   own inset inside the viewBox — so the cell adds no width the icon does not
   use. */
.dmp-badge-fact {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
}

.dmp-badge-icon {
  display: block;
  flex: 0 0 auto;
  color: var(--dsw-alias-label-secondary);
}

.dmp-badge[data-tone='quiet'] .dmp-badge-icon {
  color: var(--dsw-alias-label-tertiary);
}

/* A capacity or a level name is a value, so it reads in tabular figures and one
   step brighter than the badge's own ink. The cap is what keeps an adapter's
   unusually long level name (the effort name is free adapter text) from growing
   the strip until the context-window badge — the last one — is pushed off the
   card and clipped by .dmp-menu's overflow. Beyond it the value ellipsizes like
   the name does. */
.dmp-badge-value {
  max-width: 64px;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
  text-overflow: ellipsis;
}

.dmp-check {
  display: grid;
  place-items: center;
  flex: 0 0 14px;
  color: var(--dsw-alias-label-primary);
}

.dmp-check svg {
  width: 14px;
  height: 14px;
}

/* The provider card reuses the model card's material and only narrows it. */
.dmp-provider-menu {
  width: min(240px, calc(100vw - 32px));
  max-height: min(380px, calc(100vh - 96px));
}

/* The parameter panel: same material as the other two cards, wider than the
   provider card (it carries labelled controls, not just rows).
   The surface itself must NOT scroll. MenuSurface paints the card's fill as an
   absolutely positioned child (.material, inset: 0) anchored to this element's
   padding box, so a surface that scrolls drags that layer up with the content
   and the bottom of the card loses its fill — the page shows through the panel's
   own footer, and the layer's rounded bottom corners appear in the middle of the
   card. Measured on the real GUI: exactly that. The scroll role belongs to the
   inner body below; the model card already splits it the same way (.dmp-groups). */
.dmp-settings {
  width: min(280px, calc(100vw - 32px));
  max-height: min(460px, calc(100vh - 96px));
  overflow: hidden;
}

/* The panel's scroll viewport: the head and the state line stay put, everything
   below them scrolls inside the card. min-height: 0 is what lets the flex item
   shrink below its content and actually become scrollable. */
.dmp-settings-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.dmp-settings-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 6px 8px 4px;
}

.dmp-settings-title {
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dmp-settings-reset {
  flex: 0 0 auto;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 11px;
  line-height: 16px;
  font-weight: 600;
  cursor: pointer;
}

.dmp-settings-reset:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
}

.dmp-settings-reset:disabled {
  color: var(--dsw-alias-label-dimmed);
  cursor: default;
}

.dmp-settings-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}

/* The parameter panel's labels and every explanatory line below them. These are
   real copy, not decoration, so they take the secondary ink: the caption token
   measures 2.08:1 on this card in the light theme (3.82:1 in dark), which fails
   WCAG AA for text this size in both themes — "已声明：文字、图片" is information
   the user needs in order to decide what the switches do. Hierarchy is carried
   by size (11px vs the 13px control text) instead of by an unreadable ink. */
.dmp-settings-label {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
  font-weight: 600;
}

.dmp-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 30px;
}

.dmp-settings-name {
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 18px;
}

.dmp-settings-hint {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
}

/* The panel's state line: why the controls above it are inert (no declaration,
   read-only profile, unavailable settings service). It is rendered above the
   controls it qualifies, so the reason is read before the control — which is
   exactly why it must be legible: it is the ONLY explanation of a disabled
   panel. Same ink as the hints. */
.dmp-settings-notice {
  padding: 6px 8px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
}

/* What the settings service refused, in its own words — the one line a user MUST
   read, and the only statement that their edit did not happen.
   It would be natural to paint this in the host's error red, and that is what
   this rule did at first. It cannot: the red measures 4.38:1 on this card in the
   light theme and 3.61:1 on the composer card in dark, both under AA for any
   body size, and the only size where that red becomes compliant is 24px — which
   turns one short refusal into a banner that dwarfs the 11-13px panel it lives
   in and pushes the controls down. So the failure is carried by things that do
   not have to be legible to be read: the host's danger fill, a warning icon in
   the error ink, and a sentence that says "被拒绝" in words. The copy becomes
   MORE legible than the red version (5.64:1 light / 7.86:1 dark), not less. */
.dmp-settings-alert {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 8px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-interactive-bg-hover-danger);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
}

.dmp-settings-alert-icon {
  flex: 0 0 12px;
  margin-top: 2px;
  color: var(--dsw-alias-state-error-primary);
}

/* The declaration this panel writes, so a reviewer can check the edit landed;
   the full namespace + path stays available in the title attribute. It is the
   quietest line of the panel but it is still information ("which declaration
   does this edit?"), so it uses the same secondary ink as every other line
   rather than the dimmed token — dimmed measures 1.23:1 on this card in the
   light theme, which is invisible rather than quiet. */
.dmp-settings-target {
  overflow: hidden;
  padding: 4px 8px 6px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
  font-size: 10px;
  line-height: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* The primitive owns the switch's own chrome; only its place in the row is ours.
   align-self keeps it centered instead of stretching to the row's 30px. */
.dmp-settings-switch {
  flex: 0 0 auto;
  align-self: center;
}

/* The gear's own mark: it must never shrink in a cramped composer row. */
.dmp-settings-icon {
  flex: 0 0 auto;
}

/* The effort choices of the parameter panel: the panel is the one surface that
   lets effort be changed, so these are the only effort controls left in the
   seat. This wrapper stacks them and keeps the group tight against its label. */
.dmp-effort-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* The capacity field takes the row's remaining width; the primitive's wrapper
   and its native input are both stretched so the whole row is the target. */
.dmp-settings-input {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md);
  background: transparent;
}

.dmp-settings-input:focus-within {
  border-color: var(--dsw-alias-state-business-primary);
}

.dmp-settings-input input {
  width: 100%;
  padding: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.dmp-settings-input input::placeholder {
  color: var(--dsw-alias-label-secondary);
}

.dmp-settings-input-bad {
  border-color: var(--dsw-alias-state-error-primary);
}

/* What the panel writes and where the edits land. This is the one paragraph in
   the card with no control of its own, and it is the only place the panel says
   its edits are real rather than a local override — so it is held at the same
   secondary ink as every other explanatory line instead of the caption token
   (2.08:1 on this card in the light theme). */
.dmp-settings-note {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  padding: 6px 8px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
}

.dmp-settings-note-icon {
  flex: 0 0 12px;
  margin-top: 2px;
}

.dmp-effort-item {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 30px;
  padding: 4px 8px;
  border: none;
  border-radius: var(--dsw-radius-md);
  outline: none;
  background: transparent;
  color: inherit;
  font-size: 13px;
  line-height: 18px;
  text-align: left;
  cursor: pointer;
}

.dmp-effort-item:hover:not(:disabled),
.dmp-effort-item:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dmp-effort-item:disabled {
  color: var(--dsw-alias-label-dimmed);
  cursor: default;
}

.dmp-effort-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dmp-effort-check {
  display: grid;
  place-items: center;
  flex: 0 0 14px;
  color: var(--dsw-alias-label-primary);
}

.dmp-effort-check svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 480px) {
  .dmp-menu {
    width: calc(100vw - 24px);
  }

  .dmp-provider-menu {
    width: calc(100vw - 24px);
  }

  .dmp-settings {
    width: calc(100vw - 24px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dmp-chevron {
    transition: none;
  }
}
`

/**
 * Create (or replace) this plugin's style element.
 * @returns the disposer removing exactly the element this call created.
 */
export function injectStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  // A hot-reloaded activation leaves the previous element behind; replacing it
  // keeps exactly one sheet per module revision.
  document.getElementById(STYLE_ELEMENT_ID)?.remove()
  const element = document.createElement('style')
  element.id = STYLE_ELEMENT_ID
  element.textContent = CSS
  document.head.append(element)
  return () => {
    if (element.isConnected) element.remove()
  }
}

/** The stylesheet text, exported for the static selfcheck. */
export const STYLESHEET = CSS
