# @totemheart/bridge-robotics

Maps [Totemheart](https://www.npmjs.com/package/totemheart)'s real `ExpressionDirectives.getPostureDirectives()`/`getActionTendency()` output onto a generic actuator-command schema, and sends it over **real HTTP** — genuine network I/O, tested in this package's own suite against a real local listener, not a mocked transport.

**Honest scope**: the command schema below is this repo's own documented mapping, not a claim of conformance to ROS2, MoveIt, or any specific robot's native protocol — there's no real robot available to verify that against. A real integrator translates this generic schema to their own actuator API in one small adapter function.

## Install

```bash
npm install totemheart @totemheart/bridge-robotics
```

## Usage

```js
import { Totemheart, Personality } from 'totemheart'
import { RoboticsBridge }           from '@totemheart/bridge-robotics'

const ai       = new Totemheart( { personality: new Personality() } )
const bridge = new RoboticsBridge( { endpoint: 'http://localhost:8080/command' } )

await ai.processInput( 'ven aquí, quiero abrazarte', { userId: 'u' } )

const posture         = ai.expressionDirectives.getPostureDirectives( ai.emotionSpace.vector )
const actionTendency = ai.expressionDirectives.getActionTendency( { ...ai.emotionSpace.vector, trust: ai.attachment.get( 'u' ).trust } )
const command          = bridge.toCommand( posture, actionTendency )

await bridge.send( command ) // real HTTP POST — throws on any real failure
```

## API

### `new RoboticsBridge({ endpoint, timeoutMs })`

`endpoint` — a real URL your own listener/robot controller exposes. `timeoutMs` (default `3000`) — real wall-clock abort limit.

### `toCommand(posture, actionTendency)`

Returns:

```js
{
  stance         : 'approach' | 'withdraw' | 'freeze' | 'engage' | 'neutral',
  openness       : 0..1,
  dominantAction : string, // the highest-weight key from the real actionTendency softmax
  speedScale     : 0.1..1, // freeze = 0.1, withdraw = 0.4, everything else = 1 — own tuning
}
```

### `async send(command)`

Real `fetch` POST with `Content-Type: application/json`. Throws on a missing endpoint, network failure, timeout, or non-2xx response — same resilience contract Totemheart's own providers use.

## License

MIT
