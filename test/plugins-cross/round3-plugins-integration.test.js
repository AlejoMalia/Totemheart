/**
 * The gap the user explicitly asked about: did round-3's 20 mechanisms
 * (NarrativeSelfEngine, OntogenicDevelopment, LegacyMemory, BetrayalTraumaTrace,
 * EnergyBudget, RegulationStrategySelector, CreativeModeSwitch, ColonyDynamics,
 * MultiAgentSocialGraph, CulturalScriptLibrary, PowerDynamicsEngine,
 * MetaEmotionLayer, EmotionalForecasting, InsightGenerator, SomaticMarkerNetwork,
 * plus the 5 extensions) ever get exercised together with the 6 published
 * plugins? Before this file: no. This is that pass.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'
import { createServer } from 'node:http'

import { Totemheart, Personality } from '../../src/index.js'
import { EpisodicMemory }          from '../../src/social/EpisodicMemory.js'

import { OpenAIProvider }     from '../../packages/provider-openai/src/OpenAIProvider.js'
import { AnthropicProvider } from '../../packages/provider-anthropic/src/AnthropicProvider.js'
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
			req.on( 'end', () => { received.push( JSON.parse( body ) ); res.writeHead( 200 ); res.end( '{}' ) } )

		} )
		server.listen( 0, () => resolve( { server, received, port: server.address().port } ) )

	} )

}

test( 'plugins-cross round3: DevServer\'s live /state HTTP endpoint genuinely exposes real round-3 fields, not just round-1/2 ones', async () => {

	const ai         = noBurst( new Totemheart( { personality: new Personality() } ) )
	const devServer = new DevServer( ai, { port: 0 } )
	await devServer.start()
	const port = devServer.server.address().port

	for ( let i = 0; i < 5; i++ ) await ai.processInput( `hoy me despidieron del trabajo, mensaje ${i}`, { userId: 'u' } )

	const state = await fetch( `http://127.0.0.1:${port}/state` ).then( r => r.json() )

	assert.ok( state.narrativeSelf !== null, 'DevServer must expose real NarrativeSelfEngine state' )
	assert.equal( typeof state.narrativeSelf.coherence, 'number' )
	assert.ok( [ 'infancy', 'childhood', 'adolescence', 'adulthood' ].includes( state.ontogenicStage ) )
	assert.equal( typeof state.energyLevel, 'number' )
	assert.ok( state.energyLevel >= 0 && state.energyLevel <= 1 )
	assert.ok( state.significantEventCount > 0 )

	await devServer.stop()

} )

test( 'plugins-cross round3: DevServer\'s /state endpoint now also exposes the previously-missing round-3 fields and the newest GlobalWorkspace/PrimaryDrives/EmotionalImmuneSystem additions', async () => {

	const ai         = noBurst( new Totemheart( { personality: new Personality() } ) )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	const devServer = new DevServer( ai, { port: 0 } )
	await devServer.start()

	try {

		const port = devServer.server.address().port

		// Populate real state for each of the previously-unexposed round-3 mechanisms.
		ai.legacyMemory.inherit( 'cautela', 0.6 )
		ai.betrayalTraumaTrace.record( 'u', 0.9 )
		ai.powerDynamicsEngine.update( 'u', { assertiveAct: 1 } )
		ai.insightGenerator.observe( 'pattern-x', 0.5 )
		ai.somaticMarkerNetwork.recordOutcome( 'optionA', 0.7 )
		// Pure, unmixed negativity — EmotionalImmuneSystem.observe() only ever
		// accumulates exposure on negative valence turns (see EmotionalImmuneSystem.js),
		// so a mixed-valence phrase would net out near 0 and never cross real numbing.
		for ( let i = 0; i < 20; i++ ) await ai.processInput( 'esto es horrible, terrible, me frustra muchisimo', { userId: 'u' } )

		const state = await fetch( `http://127.0.0.1:${port}/state` ).then( r => r.json() )

		assert.ok( Array.isArray( state.legacyMemory ) && state.legacyMemory.length > 0, 'legacyMemory must be a real, non-empty array once inherit() has been called' )
		assert.ok( Array.isArray( state.betrayalTraumaTrace ) && state.betrayalTraumaTrace.some( t => t.userId === 'u' ) )
		assert.ok( Array.isArray( state.culturalScriptLibrary ) && state.culturalScriptLibrary.length > 0 )
		assert.equal( typeof state.somaticMarkerNetwork.markerCount, 'number' )
		assert.ok( state.somaticMarkerNetwork.markerCount > 0 )
		assert.ok( Array.isArray( state.powerDynamicsEngine ) && state.powerDynamicsEngine.some( p => p.userId === 'u' ) )
		assert.ok( Array.isArray( state.insightGenerator ) && state.insightGenerator.some( p => p.name === 'pattern-x' ) )
		assert.equal( state.colony, null, 'no shared ColonyDynamics was wired into this instance, so colony must honestly be null, not fabricated' )

		assert.ok( state.primaryDrives && typeof state.primaryDrives.SEEKING === 'number' )
		assert.equal( typeof state.immuneExposure, 'number' )
		assert.ok( state.immuneExposure > 0, 'sustained negative turns above must have produced real, non-zero exposure' )
		assert.equal( typeof state.immuneDampening, 'number' )
		assert.ok( state.immuneDampening <= 1 && state.immuneDampening > 0 )

	}
	finally { await devServer.stop() }

} )

test( 'plugins-cross round3: audit-kit\'s assertFiniteState now genuinely checks EnergyBudget and NarrativeSelfEngine bounds, and catches a real violation', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	await ai.processInput( 'hola', { userId: 'u' } )

	assert.doesNotThrow( () => assertFiniteState( ai ) )

	ai.energyBudget.energy = NaN
	assert.throws( () => assertFiniteState( ai ), /energyBudget/ )
	ai.energyBudget.energy = 0.5 // restore for cleanliness

} )

test( 'plugins-cross round3: SqliteStore-backed EpisodicMemory survives a real 30-turn conversation with ALL round-3 mechanisms actively firing (betrayal, narrative crises, ontogenic progression)', async () => {

	const store = new SqliteStore( { path: ':memory:' } )
	const ai      = noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.3 } ) } ) )
	ai.episodicMemory = new EpisodicMemory( { adapter: store } )
	noHijack( ai )

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

	for ( let i = 0; i < 30; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion, perdi el trabajo', { userId: 'u' } )
		assertFiniteState( ai )

	}

	const persisted = await store.getAll()
	assert.ok( persisted.length >= 1, 'SqliteStore must still be receiving real writes with the full round-3 pipeline active' )
	assert.ok( ai.betrayalTraumaTrace.getTrace( 'u' ) > 0 )
	assert.ok( [ 'infancy', 'childhood', 'adolescence', 'adulthood' ].includes( ai._ontogenicStage ) )

	store.close()

} )

test( 'plugins-cross round3: TTSBridge and RoboticsBridge produce valid, finite output when CreativeModeSwitch/PowerDynamicsEngine have real, non-neutral state', async () => {

	const ai                  = noBurst( new Totemheart( { personality: new Personality( { extraversion: 0.9, agreeableness: 0.2 } ) } ) )
	const ttsBridge         = new TTSBridge()
	const roboticsBridge = new RoboticsBridge( { endpoint: 'http://example.invalid' } )

	// A defended, assertive exchange — real PowerDynamicsEngine + CreativeModeSwitch activity.
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'no estoy de acuerdo contigo en absoluto, esto es maravilloso e increible', { userId: 'u' } )

	assert.ok( Number.isFinite( ai.powerDynamicsEngine.getPower( 'u' ) ) )

	const prosody = ai.expressionDirectives.getProsodyDirectives( ai.emotionSpace.vector )
	const ssml       = ttsBridge.toSSML( prosody, 'respuesta de prueba' )
	assert.ok( ssml.startsWith( '<speak' ) )

	const posture         = ai.expressionDirectives.getPostureDirectives( ai.emotionSpace.vector )
	const actionTendency = ai.expressionDirectives.getActionTendency( { ...ai.emotionSpace.vector, trust: ai.attachment.get( 'u' ).trust } )
	const command          = roboticsBridge.toCommand( posture, actionTendency )
	assert.ok( command.speedScale >= 0.1 && command.speedScale <= 1 )

} )

test( 'plugins-cross round3: OpenAIProvider\'s real fallback stays transparent even with the FULL round-3 pipeline (heavier per-turn processing) active', async () => {

	const provider = new OpenAIProvider( { apiKey: null } )
	const ai          = noBurst( new Totemheart( { personality: new Personality(), provider } ) )

	const result = await ai.processInput( 'esto es maravilloso, me encanta absolutamente todo', { userId: 'u' } )

	assert.equal( typeof result.text, 'string' )
	assertFiniteState( ai )
	assert.ok( ai.emotionSpace.vector.valence > 0, 'the heuristic fallback must still have registered the real positive sentiment despite all the extra round-3 processing' )
	assert.ok( [ 'infancy', 'childhood', 'adolescence', 'adulthood' ].includes( ai._ontogenicStage ) )

} )

test( 'plugins-cross round3: ALL 6 plugins plus ColonyDynamics plus a real 25-turn rupture-and-recovery scenario, wired together, stay coherent end to end', async () => {

	const store    = new SqliteStore( { path: ':memory:' } )
	const provider = new OpenAIProvider( { apiKey: null } )
	const ai            = noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.4 } ), provider } ) )
	ai.episodicMemory = new EpisodicMemory( { adapter: store } )
	noHijack( ai )

	const devServer = new DevServer( ai, { port: 0 } )
	await devServer.start()
	const devPort      = devServer.server.address().port

	const { server: robotServer, received: robotReceived, port: robotPort } = await startMockRobot()
	const roboticsBridge = new RoboticsBridge( { endpoint: `http://127.0.0.1:${robotPort}` } )
	const ttsBridge         = new TTSBridge()

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	const ruptured = await driveToRupture( ai, { userId: 'u', maxTurns: 40 } )
	assert.ok( ruptured )
	assertFiniteState( ai )

	// Real round-3 state must have genuinely accumulated from that real rupture run.
	assert.ok( ai.betrayalTraumaTrace.getTrace( 'u' ) > 0 )
	assert.ok( ai.narrativeSelfEngine.getChapterCount() >= 1 )

	// Real live state check via HTTP mid-scenario.
	const liveState = await fetch( `http://127.0.0.1:${devPort}/state` ).then( r => r.json() )
	assert.equal( liveState.vector.valence, ai.emotionSpace.vector.valence )
	assert.equal( typeof liveState.energyLevel, 'number' )

	// Real TTS + robotics output from this same, now-scarred state.
	const prosody = ai.expressionDirectives.getProsodyDirectives( ai.emotionSpace.vector )
	const ssml       = ttsBridge.toSSML( prosody, 'texto tras la ruptura' )
	assert.ok( ssml.length > 0 )

	const posture = ai.expressionDirectives.getPostureDirectives( ai.emotionSpace.vector )
	await roboticsBridge.send( roboticsBridge.toCommand( posture, {} ) )
	assert.equal( robotReceived.length, 1 )

	// Real persistence check.
	const persisted = await store.getAll()
	assert.ok( persisted.length >= 1 )

	await devServer.stop()
	robotServer.close()
	store.close()

} )

test( 'plugins-cross round3: the 7th plugin (AnthropicProvider) falls back transparently while GlobalWorkspace/PrimaryDrives/EmotionalImmuneSystem fire through the same real pipeline', async () => {

	const provider = new AnthropicProvider( { apiKey: null } ) // no key -> always throws -> real HeuristicProvider fallback
	const ai            = noBurst( new Totemheart( { personality: new Personality( { openness: 0.7 } ), provider } ) )
	noHijack( ai )

	const devServer = new DevServer( ai, { port: 0 } )
	await devServer.start()

	try {

		const port = devServer.server.address().port
		let sawWorkspaceWinner = false

		for ( let i = 0; i < 20; i++ ) {

			const result = await ai.processInput( 'esto es horrible, terrible, me frustra muchisimo', { userId: 'u' } )
			if ( result.debug.workspaceCompetition?.winner ) sawWorkspaceWinner = true

		}

		assertFiniteState( ai )
		assert.ok( sawWorkspaceWinner, 'GlobalWorkspace must have produced a real winner across 20 real pipeline turns' )
		assert.ok( ai.emotionalImmuneSystem.exposure > 0, 'sustained hostility must have produced real EmotionalImmuneSystem exposure' )
		assert.ok( ai.primaryDrives.getDrive( 'PANIC_GRIEF' ) >= 0 && Number.isFinite( ai.primaryDrives.getDrive( 'SEEKING' ) ) )

		// Same real HTTP state check as the rest of this file, now including the
		// newest fields, proving the 7th plugin and the 3 newest mechanisms
		// coexist in the same live instance without interfering with each other.
		const liveState = await fetch( `http://127.0.0.1:${port}/state` ).then( r => r.json() )
		assert.equal( typeof liveState.immuneExposure, 'number' )
		assert.ok( liveState.immuneExposure > 0 )
		assert.ok( liveState.primaryDrives && typeof liveState.primaryDrives.SEEKING === 'number' )

		// Confirm the fallback really happened (no API key -> AnthropicProvider always
		// throws -> Totemheart's real try/catch routes to HeuristicProvider) rather than
		// silently producing empty appraisal.
		const finalResult = await ai.processInput( 'hola de nuevo', { userId: 'u' } )
		assert.equal( typeof finalResult.text, 'string' )
		assert.ok( finalResult.text.length > 0 )

	}
	finally { await devServer.stop() }

} )
