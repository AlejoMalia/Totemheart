# @totemheart/provider-anthropic

A real Anthropic Messages API [`LanguageProvider`](https://github.com/AlejoMalia/Totemheart) for [Totemheart](https://www.npmjs.com/package/totemheart) — same resilience contract as `OllamaProvider`/`OpenAIProvider`: throws on **any** failure (missing key, unreachable host, non-2xx response, malformed JSON), and Totemheart's own `#analyze()` catches that and falls back to `HeuristicProvider` transparently.

## Install

```bash
npm install totemheart @totemheart/provider-anthropic
```

## Usage

```js
import { Totemheart, Personality } from 'totemheart'
import { AnthropicProvider }        from '@totemheart/provider-anthropic'

const provider = new AnthropicProvider( {
	apiKey : process.env.ANTHROPIC_API_KEY,
	model  : 'claude-sonnet-5', // default
} )

const ai = new Totemheart( { personality: new Personality(), provider } )

const result = await ai.processInput( 'hola, ¿qué tal tu día?', { userId: 'u' } )
console.log( result.text )
```

## API

### `new AnthropicProvider({ apiKey, baseURL, model, apiVersion, timeoutMs })`

| Option | Default | Notes |
| --- | --- | --- |
| `apiKey` | `process.env.ANTHROPIC_API_KEY` | Required for any real call to succeed |
| `baseURL` | `https://api.anthropic.com/v1` | Real Anthropic Messages API base |
| `model` | `claude-sonnet-5` | Any real model your account supports |
| `apiVersion` | `2023-06-01` | Real `anthropic-version` header value |
| `timeoutMs` | `8000` | Aborts and throws past this real wall-clock limit |

### `analyze(task, payload)`

Duck-types Totemheart's real provider contract directly — no runtime dependency on `totemheart`, only a `peerDependency` for discoverability. Supports the same 5 tasks Totemheart's pipeline calls: `sentiment`, `appraisal`, `beliefConflict`, `mentalState`, `selfCritique`.

## Testing without a real API key

Same pattern the core repo uses for `OllamaProvider`/`OpenAIProvider`:

```js
const provider = new AnthropicProvider( { apiKey: 'sk-fake', baseURL: 'http://127.0.0.1:1', timeoutMs: 500 } )
await provider.analyze( 'sentiment', { text: 'hola' } ) // rejects — real, honest failure
```

## License

MIT
