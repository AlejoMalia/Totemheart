# @totemheart/provider-openai

A real OpenAI-compatible chat-completions [`LanguageProvider`](https://github.com/AlejoMalia/Totemheart) for [Totemheart](https://www.npmjs.com/package/totemheart) — same resilience contract as the core's built-in `OllamaProvider`: it throws on **any** failure (missing key, unreachable host, non-2xx response, malformed JSON), and Totemheart's own `#analyze()` catches that and falls back to `HeuristicProvider` transparently. A misconfigured or down provider never breaks the pipeline.

Works with the real OpenAI API and with any real OpenAI-compatible endpoint (`baseURL` is a genuine parameter, not hardcoded), since many local/hosted inference servers implement the same `/chat/completions` shape.

## Install

```bash
npm install totemheart @totemheart/provider-openai
```

## Usage

```js
import { Totemheart, Personality } from 'totemheart'
import { OpenAIProvider }          from '@totemheart/provider-openai'

const provider = new OpenAIProvider( {
	apiKey : process.env.OPENAI_API_KEY, // or pass explicitly
	model  : 'gpt-4o-mini',              // default
} )

const ai = new Totemheart( { personality: new Personality(), provider } )

const result = await ai.processInput( 'hola, ¿qué tal tu día?', { userId: 'u' } )
console.log( result.text )
```

## API

### `new OpenAIProvider({ apiKey, baseURL, model, timeoutMs })`

| Option | Default | Notes |
| --- | --- | --- |
| `apiKey` | `process.env.OPENAI_API_KEY` | Required for any real call to succeed |
| `baseURL` | `https://api.openai.com/v1` | Point at any real OpenAI-compatible endpoint |
| `model` | `gpt-4o-mini` | Any real chat-completions model your account/endpoint supports |
| `timeoutMs` | `8000` | Aborts and throws past this real wall-clock limit |

### `analyze(task, payload)`

Duck-types Totemheart's real provider contract directly — this class doesn't extend `LanguageProvider` from the core package (Totemheart's own orchestrator calls `this.provider.analyze(task, payload)` with no `instanceof` check), so this package has no runtime dependency on `totemheart`, only a `peerDependency` for discoverability. Supports the same 5 tasks Totemheart's pipeline calls: `sentiment`, `appraisal`, `beliefConflict`, `mentalState`, `selfCritique`.

## Testing without a real API key

`OpenAIProvider` throws on a missing key or unreachable `baseURL` — the same pattern the core repo uses to test `OllamaProvider` without a live server:

```js
const provider = new OpenAIProvider( { apiKey: 'sk-fake', baseURL: 'http://127.0.0.1:1', timeoutMs: 500 } )
await provider.analyze( 'sentiment', { text: 'hola' } ) // rejects — real, honest failure
```

## License

MIT
