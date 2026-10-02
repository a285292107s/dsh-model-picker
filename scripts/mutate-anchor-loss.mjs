/**
 * 改坏验证 for §5.18. Each mutation breaks one decision the fix rests on; the
 * static gate has to notice every one of them, and the source has to come back
 * byte-identical afterwards.
 *
 * Written as a script rather than a shell one-liner because the mutations are
 * line-anchored text edits, and a PowerShell heredoc that mangles a quote or a
 * newline silently reports a false "gate missed" — which is the one thing this
 * file must never do.
 *
 * Run: node scripts/mutate-anchor-loss.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const SELFCHECK = 'scripts/selfcheck-static.mjs'
const LOSS = 'src/client/anchorLoss.ts'
const PICKER = 'src/client/Picker.tsx'

const MUTATIONS = [
  {
    name: 'timer -> requestAnimationFrame',
    file: LOSS,
    // The defect this fix was born from: a `display: none` subtree stops the
    // browser servicing the frame callback, so the confirmation never runs and
    // the popover stays open — the original bug, untouched.
    from: 'timer = window.setTimeout(confirm, CONFIRM_DELAY_MS)',
    to: 'requestAnimationFrame(confirm);',
  },
  {
    name: 'seat root -> single anchor',
    file: PICKER,
    from: '() => rootRef.current,',
    to: '() => triggerRef.current,',
  },
  {
    name: 'drop setSettingsAt(false)',
    file: PICKER,
    from: '        setProviderAt(false)\n        setSettingsAt(false)\n        // Focus',
    to: '        setProviderAt(false)\n        // Focus',
  },
  {
    name: 'drop the open-only guard',
    file: PICKER,
    from: 'if (!open && !providerAt && !settingsAt) return\n    return observeSeatLoss(',
    to: 'return observeSeatLoss(',
  },
  {
    name: 'clientRects -> isConnected',
    file: LOSS,
    // `isConnected` stays true under `display: none`, so the seat would read as
    // present and the popover would keep drifting.
    from: 'return element.isConnected && element.getClientRects().length > 0',
    to: 'return element.isConnected',
  },
  {
    name: 'drop observer.disconnect()',
    file: LOSS,
    from: 'observer.disconnect()',
    to: '/* removed */',
  },
  {
    name: 'drop clearTimeout',
    file: LOSS,
    from: 'if (timer !== null) window.clearTimeout(timer)',
    to: '/* removed */',
  },
  {
    name: 'restore focus on dismissal',
    file: PICKER,
    // Focus has nowhere to go: the trigger is inside the box that just
    // disappeared, and the Host's card autoFocuses its own answer controls.
    // `close()` would also restore focus, so reaching for it here is the
    // tempting wrong answer and the gate has to keep it out.
    from: '        setSettingsAt(false)\n        // Focus is not handed back anywhere',
    to: '        setSettingsAt(false)\n        lastActionRef.current?.focus()\n        // Focus is not handed back anywhere',
  },
]

const original = new Map(MUTATIONS.map(m => [m.file, readFileSync(m.file, 'utf8')]))

function restore() {
  for (const [file, text] of original) writeFileSync(file, text, 'utf8')
}

const rows = []
for (const m of MUTATIONS) {
  const source = readFileSync(m.file, 'utf8')
  if (source.includes(m.from) === false) {
    rows.push(['SKIP', m.name, 'pattern not found in ' + m.file])
    continue
  }
  writeFileSync(m.file, source.replace(m.from, m.to), 'utf8')
  let failed = false
  try {
    const run = spawnSync(process.execPath, [SELFCHECK], { encoding: 'utf8' })
    failed = (run.stdout + run.stderr).includes('FAIL')
  } finally {
    writeFileSync(m.file, original.get(m.file), 'utf8')
  }
  rows.push([failed ? 'RED' : 'MISSED', m.name, failed ? 'gate caught it' : 'gate passed — regression unprotected'])
}

restore()

for (const [verdict, name, note] of rows) {
  const mark = verdict === 'RED' ? 'ok  ' : 'BAD '
  console.log(`  ${mark} ${name} — ${note}`)
}

const missed = rows.filter(([v]) => v !== 'RED')
const final = (() => {
  const proc = spawnSync(process.execPath, [SELFCHECK], { encoding: 'utf8' })
  return (proc.stdout + proc.stderr).trim().split(/\r?\n/).pop()
})()
console.log(`\nafter revert: ${final}`)

process.exitCode = missed.length > 0 || final.includes('all good') === false ? 1 : 0
