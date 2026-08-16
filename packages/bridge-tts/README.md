# @totemheart/bridge-tts

Maps [Totemheart](https://www.npmjs.com/package/totemheart)'s real `ExpressionDirectives.getProsodyDirectives()` output (`{ pitchShift, rateShift, energyLevel, breathiness }`) onto standard **W3C SSML** `<prosody>` markup — the real published standard Azure Cognitive Services Speech, Amazon Polly, and Google Cloud Text-to-Speech all accept as-is, chosen over any single vendor's proprietary API so this one mapping stays honestly reusable.

This package makes **no network calls** and bundles **no vendor SDK** — it only produces a markup string. Sending it to a real TTS engine (with your own real credentials) is the caller's job.

## Install

```bash
npm install totemheart @totemheart/bridge-tts
```

## Usage

```js
import { Totemheart, Personality } from 'totemheart'
import { TTSBridge }                from '@totemheart/bridge-tts'

const ai       = new Totemheart( { personality: new Personality() } )
const bridge = new TTSBridge()

const result = await ai.processInput( 'estoy muy emocionado por esto', { userId: 'u' } )
const prosody = ai.expressionDirectives.getProsodyDirectives( ai.emotionSpace.vector )
const ssml       = bridge.toSSML( prosody, result.text )

// ssml is now real, valid SSML — feed it directly to Azure/Polly/Google's synthesize call
```

## API

### `toSSMLAttributes(prosody)`

Returns `{ rate, pitch, volume }` as real SSML-style relative percent strings (e.g. `'+20%'`, `'-10%'`), derived directly from the real `pitchShift`/`rateShift`/`energyLevel` numbers `ExpressionDirectives` produces.

### `toSSML(prosody, text)`

Wraps real text in a complete `<speak>`/`<prosody>` SSML document, XML-escaping the text. Adds a real `<break time="120ms"/>` when `breathiness > 0.2`.

## License

MIT
