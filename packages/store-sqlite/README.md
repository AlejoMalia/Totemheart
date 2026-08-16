# @totemheart/store-sqlite

A real, on-disk `EpisodicMemory` adapter for [Totemheart](https://www.npmjs.com/package/totemheart), backed by Node's own built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) — **zero external dependency**. Makes conversation memory survive a process restart, on disk, for real — the gap the default in-memory array (no adapter) explicitly doesn't cover.

## Install

```bash
npm install totemheart @totemheart/store-sqlite
```

Requires **Node ≥ 22.5** — `node:sqlite` is an experimental core module below that version and isn't available at all before it.

## Usage

```js
import { Totemheart, Personality, EpisodicMemory } from 'totemheart'
import { SqliteStore }                             from '@totemheart/store-sqlite'

const store = new SqliteStore( { path: './conversations.db' } ) // or ':memory:' for a real in-memory-only DB
const ai      = new Totemheart( { personality: new Personality() } )
ai.episodicMemory = new EpisodicMemory( { adapter: store } )

await ai.processInput( 'hoy fue un día muy especial contigo', { userId: 'u' } )
// this memory is now really on disk, not just in the process's RAM
```

## API

### `new SqliteStore({ path })`

`path` — a real filesystem path, or `':memory:'` for a real (but non-persistent) in-memory SQLite database. Creates the `memories` table on first use if it doesn't already exist.

### `async upsert(entry)` / `async query(text, topK)`

The exact adapter contract `EpisodicMemory` documents and calls. `query()` does a real two-stage retrieval: a SQL `LIKE`-based prefilter narrows candidates (indexed via the `text` column), then the same real token-overlap scoring `EpisodicMemory.recall()` already uses ranks them — not a fake keyword match, the identical technique, just persisted.

### `async getAll()`

Real, direct access beyond the adapter contract — useful for inspection/tooling, not called by `EpisodicMemory` itself.

### `close()`

Closes the underlying database handle.

## ⚠️ Known, honest limitation

`EpisodicMemory`'s adapter contract, **as implemented in Totemheart core today**, only routes `store()` and `recall()` through the adapter. Every other method — `markResolved()`, `getUnresolvedMemories()`, `getZeigarnikPressure()`, `rollIntrusiveThought()`, `recallMoodCongruent()`, `tagRemSalient()`, `reconsolidate()` — reads/writes the in-memory `this.memories` array **directly**, which stays empty once an adapter is set. In practice: an adapter-backed `EpisodicMemory` gets real, persisted store-and-recall, but loses unresolved-wound tracking, Zeigarnik pressure, intrusive thoughts, and REM-salience reactivation entirely.

This is verified explicitly in this package's own test suite (`test/SqliteStore.test.js`), not silently assumed to work — see the `cross:` test there. Extending core's adapter contract to cover the rest of `EpisodicMemory`'s real feature set is a real, separate piece of work, not something this package can paper over.

## License

MIT
