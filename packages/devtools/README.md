# @totemheart/devtools

A **zero-dependency** local HTTP dashboard exposing a running [Totemheart](https://www.npmjs.com/package/totemheart) instance's live internal state — built on Node's own `node:http`, no framework, no build step. Watch PAD/cortisol/kindling/grief change turn by turn instead of reading it from ad-hoc `console.log` calls.

## Install

```bash
npm install totemheart @totemheart/devtools
```

## Usage

```js
import { Totemheart, Personality } from 'totemheart'
import { DevServer }                from '@totemheart/devtools'

const ai         = new Totemheart( { personality: new Personality() } )
const devServer = new DevServer( ai, { port: 4477 } )
await devServer.start()

console.log( 'Open http://localhost:4477 to watch the live state.' )

// ...run your normal conversation loop against `ai` as usual...

// await devServer.stop() when you're done
```

## Endpoints

| Route | Returns |
| --- | --- |
| `GET /` | A minimal HTML dashboard that polls `/state` every second and renders the real numbers as bars |
| `GET /state` | Real JSON: `ai.getEmotionalState()` plus `grief`, `shame`, `guilt`, `egoDepletionBudget`, `sleepPressure` |
| `GET /explainability` | The real, already-tracked `ExplainabilityEngine.decisionLog` array |

## License

MIT
