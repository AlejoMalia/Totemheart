# @totemheart/audit-kit

Reusable cross-mechanism audit helpers, extracted directly from [Totemheart](https://www.npmjs.com/package/totemheart) core's own `test/integration/cross-mechanism-friction.test.js` — the same real assertions used to stress-test its 18 relational-friction mechanisms, packaged so a fork or a downstream app built on Totemheart can run the same discipline against its own scenarios.

## Install

```bash
npm install totemheart @totemheart/audit-kit
```

## Usage

```js
import { Totemheart, Personality } from 'totemheart'
import { noBurst, noHijack, assertFiniteState, driveToRupture } from '@totemheart/audit-kit'

const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )

ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

const ruptured = await driveToRupture( ai, { userId: 'u' } )
console.log( 'Bond ruptured:', ruptured )

assertFiniteState( ai ) // throws with a real message on the first bounded-state violation
```

## API

### `noBurst(ai)`

Raises `SensoryOverload`'s real rate-based burst threshold so a tight `processInput()` loop in a test doesn't trip the (unrelated) freeze early-return. Returns `ai` for chaining.

### `noHijack(ai)`

Neutralizes `AmygdalaHijack`'s early return so a test can reach mechanisms downstream of it (rupture, repair, grief...). Isolates the mechanism under test — not a claim about what `AmygdalaHijack` itself should do. Returns `ai` for chaining.

### `assertFiniteState(ai, assertFn?)`

Checks every real PAD/cortisol/dissonance/egoHealth/budget/sleep-pressure scalar is finite and within its own documented real bounds. Throws on the first violation. Pass your own `assertFn(condition, message)` (e.g. bound to `node:assert`'s `ok`) to integrate with your test runner's own reporting.

### `async driveToRupture(ai, { userId, hostileText, maxTurns })`

Drives a real, deterministic hostile-turn loop against a `LoveHateEngine` bond and returns whether it actually ruptured within `maxTurns` (default `40`).

## License

MIT
