import { test }    from 'node:test'
import assert       from 'node:assert/strict'
import { createServer } from 'node:http'

import { RoboticsBridge } from '../src/RoboticsBridge.js'
import { ExpressionDirectives } from '../../../src/behavior/ExpressionDirectives.js'
import { Totemheart, Personality } from '../../../src/index.js'

function startMockRobot() {

	return new Promise( resolve => {

		const received = []
		const server      = createServer( ( req, res ) => {

			let body = ''
			req.on( 'data', chunk => { body += chunk } )
			req.on( 'end', () => {

				received.push( JSON.parse( body ) )
				res.writeHead( 200, { 'Content-Type': 'application/json' } )
				res.end( JSON.stringify( { ok: true } ) )

			} )

		} )
		server.listen( 0, () => resolve( { server, received, port: server.address().port } ) )

	} )

}

test( 'RoboticsBridge: toCommand() maps a real posture reading into the documented schema', () => {

	const bridge  = new RoboticsBridge( { endpoint: 'http://example.invalid' } )
	const command = bridge.toCommand( { stance: 'approach', openness: 0.8 }, { approach: 0.7, withdraw: 0.1, freeze: 0.1, engage: 0.1 } )

	assert.equal( command.stance, 'approach' )
	assert.equal( command.openness, 0.8 )
	assert.equal( command.dominantAction, 'approach' )
	assert.equal( command.speedScale, 1 )

} )

test( 'RoboticsBridge: a freeze stance maps to a real, much slower speedScale than approach', () => {

	const bridge   = new RoboticsBridge( { endpoint: 'http://example.invalid' } )
	const freezeCmd  = bridge.toCommand( { stance: 'freeze', openness: 0.2 }, {} )
	const approachCmd = bridge.toCommand( { stance: 'approach', openness: 0.8 }, {} )

	assert.ok( freezeCmd.speedScale < approachCmd.speedScale )

} )

test( 'RoboticsBridge: send() throws without a configured endpoint', async () => {

	const bridge = new RoboticsBridge( {} )
	await assert.rejects( () => bridge.send( { stance: 'neutral' } ) )

} )

test( 'RoboticsBridge: send() throws on a real unreachable endpoint', async () => {

	const bridge = new RoboticsBridge( { endpoint: 'http://127.0.0.1:1', timeoutMs: 500 } )
	await assert.rejects( () => bridge.send( { stance: 'neutral' } ) )

} )

test( 'RoboticsBridge: send() performs a real HTTP POST to a real local listener, no mocked transport', async () => {

	const { server, received, port } = await startMockRobot()
	const bridge                             = new RoboticsBridge( { endpoint: `http://127.0.0.1:${port}` } )

	const command = bridge.toCommand( { stance: 'engage', openness: 0.6 }, { engage: 0.9 } )
	const response  = await bridge.send( command )

	assert.deepEqual( response, { ok: true } )
	assert.equal( received.length, 1 )
	assert.equal( received[ 0 ].stance, 'engage' )
	assert.equal( received[ 0 ].dominantAction, 'engage' )

	server.close()

} )

// ============================================================================
// cross: real ExpressionDirectives output through the bridge, and a full
// Totemheart pipeline turn sent to a real local listener.
// ============================================================================

test( 'cross: RoboticsBridge consumes ExpressionDirectives\' real posture AND action-tendency output together', () => {

	const directives = new ExpressionDirectives()
	const bridge         = new RoboticsBridge( { endpoint: 'http://example.invalid' } )

	const posture         = directives.getPostureDirectives( { valence: 0.6, arousal: 0.3, dominance: 0.5 } )
	const actionTendency = directives.getActionTendency( { valence: 0.6, arousal: 0.3, dominance: 0.5 } )
	const command          = bridge.toCommand( posture, actionTendency )

	assert.equal( typeof command.stance, 'string' )
	assert.ok( command.openness >= 0 && command.openness <= 1 )
	assert.ok( Object.keys( actionTendency ).includes( command.dominantAction ) )

} )

test( 'cross: a full Totemheart turn\'s posture/action-tendency reaches a real local robot listener end to end', async () => {

	const { server, received, port } = await startMockRobot()
	const ai                                    = new Totemheart( { personality: new Personality() } )
	const bridge                             = new RoboticsBridge( { endpoint: `http://127.0.0.1:${port}` } )

	await ai.processInput( 'ven aqui, quiero abrazarte', { userId: 'u' } )

	const posture         = ai.expressionDirectives.getPostureDirectives( ai.emotionSpace.vector )
	const actionTendency = ai.expressionDirectives.getActionTendency( { ...ai.emotionSpace.vector, trust: ai.attachment.get( 'u' ).trust } )
	const command          = bridge.toCommand( posture, actionTendency )
	await bridge.send( command )

	assert.equal( received.length, 1 )
	assert.equal( received[ 0 ].stance, posture.stance )
	server.close()

} )
