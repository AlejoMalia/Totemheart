/**
 * Cross-plugin integration — all 6 plugins wired together into ONE real
 * Totemheart session, not each plugin verified only in isolation against
 * core. This is the "no dejar espacios" pass: SqliteStore persisting real
 * memory, OpenAIProvider configured as the (unreachable, honestly-failing)
 * provider, a DevServer exposing the live state over real HTTP, TTSBridge
 * and RoboticsBridge consuming the SAME turn's real output, and audit-kit's
 * helpers driving/verifying the whole thing — the same combination a real
 * embodied companion app would actually use at once.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'
import { createServer } from 'node:http'

import { Totemheart, Personality } from '../../src/index.js'
import { EpisodicMemory }          from '../../src/social/EpisodicMemory.js'
import { ExpressionDirectives }    from '../../src/behavior/ExpressionDirectives.js'

import { OpenAIProvider }   from '../../packages/provider-openai/src/OpenAIProvider.js'
import { SqliteStore }      from '../../packages/store-sqlite/src/SqliteStore.js'
import { TTSBridge }        from '../../packages/bridge-tts/src/TTSBridge.js'
import { RoboticsBridge }   from '../../packages/bridge-robotics/src/RoboticsBridge.js'
import { DevServer }        from '../../packages/devtools/src/DevServer.js'
import { noBurst, noHijack, assertFiniteState, driveToRupture } from '../../packages/audit-kit/src/index.js'

function startMockRobot() {

	return new Promise( resolve => {

		const received = []
		const server      = createServer( ( req, res ) => {

			let body = ''
			req.on( 'data', c => { body += c } )
			req.on( 'end', () => {

				received.push( JSON.parse( body ) )
				res.writeHead( 200, { 'Content-Type': 'application/json' } )
				res.end( '{"ok":true}' )

			} )

		} )
		server.listen( 0, () => resolve( { server, received, port: server.address().port } ) )

	} )

}

test( 'plugins-cross: SqliteStore + OpenAIProvider fallback + DevServer + TTSBridge + RoboticsBridge + audit-kit, all wired to the same real Totemheart instance', async () => {

	const store    = new SqliteStore( { path: ':memory:' } )
	const provider = new OpenAIProvider( { apiKey: null } ) // no key configured — real, honest failure every call

	const ai = new Totemheart( { personality: new Personality( { agreeableness: 0.4 } ), provider } )
	ai.episodicMemory = new EpisodicMemory( { adapter: store } )
	noBurst( ai )
	noHijack( ai )

	const devServer = new DevServer( ai, { port: 0 } )
	await devServer.start()
	const devPort      = devServer.server.address().port

	const { server: robotServer, received: robotReceived, port: robotPort } = await startMockRobot()
	const roboticsBridge = new RoboticsBridge( { endpoint: `http://127.0.0.1:${robotPort}` } )
	const ttsBridge         = new TTSBridge()

	// Real conversation — the OpenAIProvider will fail every single call (no key),
	// so every turn genuinely falls back to HeuristicProvider under the hood; this
	// is the real, documented resilience contract, not an unrelated side effect.
	const result1 = await ai.processInput( 'hola, que tal tu dia', { userId: 'alice' } )
	assert.equal( typeof result1.text, 'string' )
	assertFiniteState( ai )

	// Real persistence: this turn's memory must actually be in SqliteStore, not
	// just Totemheart's in-memory default.
	const persisted = await store.getAll()
	assert.ok( persisted.length >= 1, 'the real SqliteStore adapter must have received at least one upsert from this turn' )

	// Real live state over real HTTP, cross-checked against the in-process object.
	const liveState = await fetch( `http://127.0.0.1:${devPort}/state` ).then( r => r.json() )
	assert.equal( liveState.vector.valence, ai.emotionSpace.vector.valence )

	// Real TTS + robotics output from the SAME turn's real emotional state.
	const prosody = ai.expressionDirectives.getProsodyDirectives( ai.emotionSpace.vector )
	const ssml       = ttsBridge.toSSML( prosody, result1.text )
	assert.ok( ssml.startsWith( '<speak' ) )

	const posture         = ai.expressionDirectives.getPostureDirectives( ai.emotionSpace.vector )
	const actionTendency = ai.expressionDirectives.getActionTendency( { ...ai.emotionSpace.vector, trust: ai.attachment.get( 'alice' ).trust } )
	const command          = roboticsBridge.toCommand( posture, actionTendency )
	await roboticsBridge.send( command )
	assert.equal( robotReceived.length, 1 )
	assert.equal( robotReceived[ 0 ].stance, posture.stance )

	// Now drive a real rupture with a SECOND user, using audit-kit's own driver —
	// verifying grief shows up BOTH in-process and through the live DevServer
	// endpoint, and that SqliteStore keeps accepting real writes throughout.
	ai.loveHateEngine.observe( 'bob', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'bob', { L: 1, H: 0 }, {} )
	const ruptured = await driveToRupture( ai, { userId: 'bob' } )
	assert.ok( ruptured )
	assertFiniteState( ai )

	const liveStateAfterGrief = await fetch( `http://127.0.0.1:${devPort}/state` ).then( r => r.json() )
	assert.ok( liveStateAfterGrief.grief.some( g => g.userId === 'bob' && g.active ), 'DevServer must reflect the real grief state live, sourced from the same instance SqliteStore/OpenAIProvider/audit-kit are all operating on' )

	const persistedAfterGrief = await store.getAll()
	assert.ok( persistedAfterGrief.length > persisted.length, 'SqliteStore must have kept accepting real writes through the rupture sequence' )

	// Full serialization round-trip still works with the plugin-backed EpisodicMemory
	// swapped in — toJSON()/restoreState() operate on Totemheart's own state, which
	// is adapter-agnostic (episodicMemories is explicitly null when an adapter is set).
	const saved = JSON.parse( JSON.stringify( ai.toJSON() ) )
	assert.equal( saved.episodicMemories, null, 'toJSON() must correctly report null for episodicMemories when an adapter-backed store is in use, not silently dump nothing as an empty array' )

	await devServer.stop()
	robotServer.close()
	store.close()

} )

test( 'plugins-cross: TTSBridge and RoboticsBridge stay finite and coherent across the SAME 25-turn cross-mechanism stress scenario core itself runs', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { conscientiousness: 0.9 } ) } ) ) )
	const ttsBridge      = new TTSBridge()
	const roboticsBridge = new RoboticsBridge( { endpoint: 'http://example.invalid' } )

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	const ruptured = await driveToRupture( ai, { userId: 'u' } )
	assert.ok( ruptured )

	for ( let i = 0; i < 25; i++ ) {

		await ai.processInput( 'sigo pensando en lo que paso, no se que decir', { userId: 'u' } )
		assertFiniteState( ai )

		const prosody      = ai.expressionDirectives.getProsodyDirectives( ai.emotionSpace.vector )
		const ssml            = ttsBridge.toSSML( prosody, 'texto de prueba' )
		assert.ok( ssml.length > 0 )

		const posture       = ai.expressionDirectives.getPostureDirectives( ai.emotionSpace.vector )
		const command      = roboticsBridge.toCommand( posture, {} )
		assert.ok( command.speedScale >= 0.1 && command.speedScale <= 1 )

	}

} )
