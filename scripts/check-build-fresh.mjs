/**
 * Gate: the COMMITTED `lib/` must match what `src/` currently builds.
 *
 * `lib/` is committed because git installs
 * (`github:a285292107s/dsh-rabbit-model-picker`) receive the repository verbatim and run
 * no build step. That makes staleness a *distribution* defect, not a local
 * inconvenience: ship an out-of-date `lib/` and every user's install imports the
 * previous behaviour — or, if `lib/` is missing entirely, fails with
 * "failed to import" and the seat silently never appears.
 *
 * The check rebuilds into memory and compares against the tracked files, so it
 * fails on drift without touching the working tree. `npm test` runs the build
 * first, which is why this gate passes only when source and artifact are
 * committed together.
 *
 * Run: node scripts/check-build-fresh.mjs
 *
 * @module dsh-model-picker/check-build-fresh
 */

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** Must stay identical to the list in {@link module:dsh-rabbit-model-picker/build-client}. */
const BASELINE_EXTERNALS = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  '@deepseek-ai/dsh-client-ui-primitives',
]

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const CLIENT_ID = String(pkg.name)

const failures = []
const check = (label, ok, detail) => {
  if (!ok) failures.push(`${label}${detail === undefined ? '' : ` — ${detail}`}`)
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}`)
}

/** Rebuild both halves in memory, exactly as build-client.mjs does. */
async function renderBuild() {
  const host = await build({
    entryPoints: [resolve(root, 'src/index.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'es2022',
    packages: 'external',
    write: false,
  })
  const client = await build({
    entryPoints: [resolve(root, 'src/client/index.ts')],
    bundle: true,
    platform: 'browser',
    format: 'cjs',
    target: 'es2022',
    charset: 'utf8',
    external: BASELINE_EXTERNALS,
    write: false,
  })
  const factory = [
    'var module = { exports: {} }; var exports = module.exports;',
    client.outputFiles[0].text,
    'return module.exports;',
  ].join('\n')
  const wrapped =
    `window.__ModuleLoader__.load({\n` +
    `  id: ${JSON.stringify(CLIENT_ID)},\n` +
    `  factory: (require) => {\n` +
    factory.split('\n').map((line) => `    ${line}`).join('\n') +
    `\n  },\n` +
    `});\n`
  return { host: host.outputFiles[0].text, client: wrapped }
}

/** Read a tracked path, preferring the WORKING TREE over the git index.
 *
 * The index is only interesting when a working-tree file is absent (a
 * committed-but-deleted artifact), which is exactly the "no entry point" case a
 * git install would hit. Judging the index first would let a stale working tree
 * pass merely because a good copy was staged — the drift would then be found
 * only after it was pushed.
 */
function readArtifact(path) {
  try {
    return readFileSync(resolve(root, path), 'utf8')
  } catch {
    return null
  }
}

const rendered = await renderBuild()

for (const [artifact, expected, committedPath] of [
  ['lib/index.js (host)', rendered.host, 'lib/index.js'],
  ['lib/client.js (browser)', rendered.client, 'lib/client.js'],
]) {
  const onDisk = readArtifact(committedPath)
  if (onDisk === null) {
    check(`${artifact} is tracked`, false, `${committedPath} is missing — a git install has no entry point`)
    continue
  }
  // A path that exists on disk but is not tracked ships as nothing, so the
  // tracked-ness is part of the artifact being installable at all.
  let tracked = true
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', '--', committedPath], {
      cwd: root,
      stdio: ['ignore', 'ignore', 'ignore'],
    })
  } catch {
    tracked = false
  }
  check(
    `${artifact} is tracked by git`,
    tracked,
    `${committedPath} exists but is not committed — a git install would not receive it`,
  )
  check(
    `${artifact} matches src/`,
    onDisk === expected,
    'stale: run `npm run build`, then `git add lib` and commit it with the src/ change',
  )
}

if (failures.length > 0) {
  console.error(
    `\nbuild freshness: ${failures.length} problem${failures.length === 1 ? '' : 's'}\n` +
    failures.map((line) => `  - ${line}`).join('\n') +
    '\n\nlib/ is committed on purpose: git installs run no build step, so a stale\n' +
    'artifact ships the wrong code to every user. Build, then commit both.\n',
  )
  process.exit(1)
}
console.log('build freshness: all good')
