/**
 * Deciding WHEN a popover of this seat has to close because the seat itself
 * left the page.
 *
 * The seat's surfaces are portaled to `document.body` and placed from a
 * `position: fixed` anchor rect, so the Host can take the whole composer away
 * and every one of them stays on screen. That is not hypothetical: when the
 * Host elects a question / approval / read-only-subagent card into the
 * `conversation.composer` chain, it renders the card with `overlay: true`,
 * which keeps the default composer bar MOUNTED but switches it to
 * `display: none` (`renderChainResult`). Measured on dsh 0.2.0-rc.2: the seat
 * root's box goes `0×0`, `getClientRects().length` goes `0`, `isConnected`
 * stays `true`, and an open parameter panel does not move by a single pixel —
 * it then holds a stale position and has lost the anchor whose scroll and
 * resize events were the only things putting it back.
 *
 * So an anchor-less popover is a DISMISSAL, not something to re-place. It is
 * also the only honest reading: the card that replaced the composer is itself
 * transient (it can be minimized or closed), so a panel bound to it would have
 * to follow a control that outlives nothing.
 *
 * @module dsh-rabbit-model-picker/client/anchorLoss
 */

/**
 * How many looks at the seat a loss has to survive before it is believed.
 *
 * One is not enough: a re-layout in flight (a font swap, a chain re-election
 * that lands and is replaced within the frame) reports a 0×0 rect and
 * recovers, and dismissing on that reading would throw away a panel the user
 * can still see and use. Two is the shortest wait that separates "caught
 * mid-re-layout" from "the Host is showing something else now", and being two
 * looks late is imperceptible next to being wrong about a dismissal.
 */
const CONFIRM_LOOKS = 2

/**
 * How long the second look waits, in milliseconds.
 *
 * One animation frame's worth, because that is the latency the user would
 * perceive anyway. It is a timer and not a frame on purpose — see the
 * {@link observeSeatLoss} note on why the frame callback cannot be the wait.
 */
const CONFIRM_DELAY_MS = 16

/**
 * Whether one node still occupies the page.
 *
 * `display: none` and detachment are indistinguishable here and are treated the
 * same on purpose: both mean the node has no box, and the caller does not need
 * to know which host mechanism did it. `isConnected` is kept in the test so a
 * detached ref cannot be mistaken for a live but unpainted one.
 * @param element - the node to test.
 * @returns true when it is in the document and generates a box.
 */
function occupiesPage(element: Element): boolean {
  return element.isConnected && element.getClientRects().length > 0
}

/**
 * The observable fact this module turns into a decision.
 * @param element - the seat root, or null when its ref is not attached.
 * @returns whether the seat is currently laid out on the page.
 */
export function seatLeftThePage(element: Element | null): boolean {
  // A popover cannot outlive a seat that is not there, so a missing root is the
  // same answer as an unpainted one rather than an "unknown".
  return element === null || occupiesPage(element) === false
}

/**
 * Watch the seat and report when it is gone.
 *
 * The observer is the seat ROOT, and not any single anchor, for two measured
 * reasons. `display: none` on an ancestor collapses every descendant box at
 * once, so watching one anchor is watching a symptom of the root's state. And a
 * single anchor's box is not a usable signal by itself: a narrow composer
 * squeezes the trigger and the provider chip down to 12px (measured, the
 * `.dmp-root` flex floor keeps them at 56px overall) while they are still the
 * controls the user is looking at — a per-anchor threshold would either miss
 * real losses or fire on ordinary layout pressure, and neither is acceptable
 * for a rule that silently discards the user's open panel.
 *
 * The second look is a TIMER, and that is the one non-obvious thing here. A
 * ResizeObserver callback runs after layout and before paint, so a single zero
 * may be this frame's re-layout rather than a real loss — but the obvious way
 * to wait for the next frame, `requestAnimationFrame`, does not survive the
 * event it exists to handle: a `display: none` subtree stops the browser from
 * servicing the frame callback at all, so the re-check is scheduled and never
 * runs and the popover stays open forever. That is measured, not assumed, and
 * the first implementation lost the bug this module exists to fix because of
 * it. A `setTimeout` lives on the task queue, which stays serviced.
 * @param root - a getter for the seat root, read at notify time rather than
 *   captured, so a re-created effect always sees the current node.
 * @param onLost - called once when the seat is judged gone. The caller decides
 *   which surfaces to close; this module never touches React state.
 * @returns the disposer.
 */
export function observeSeatLoss(root: () => Element | null, onLost: () => void): () => void {
  let frames = 0
  let reported = false
  let stopped = false
  let timer: number | null = null

  const confirm = (): void => {
    if (stopped || reported) return
    if (seatLeftThePage(root()) === false) {
      frames = 0
      return
    }
    frames += 1
    if (frames < CONFIRM_LOOKS) {
      // NOT requestAnimationFrame: the whole point of this rule is that the
      // seat is off the page, and a `display: none` subtree stops the browser
      // from servicing the frame callback at all — the look we would wait for
      // never comes. (Measured: the observer reported the loss, the re-check was
      // scheduled, and it was still not running 600ms later.) A timeout runs
      // off the task queue, which stays alive.
      timer = window.setTimeout(confirm, CONFIRM_DELAY_MS)
      return
    }
    reported = true
    onLost()
  }

  const observer = new ResizeObserver(confirm)
  const element = root()
  if (element !== null) observer.observe(element)

  return () => {
    stopped = true
    observer.disconnect()
    if (timer !== null) window.clearTimeout(timer)
  }
}
