import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { DevServer } from '../src/DevServer.js'
import { Totemheart, Personality } from '../../../src/index.js'

test( 'DevServer: GET /state returns the real, current emotional state as JSON', async () => {

	const ai         = new Totemheart( { personality: new Personality() } )
	const devServer = new DevServer( ai, { port: 0 } )
	await devServer.start()
	const port = devServer.server.address().port

	await ai.processInput( 'estoy feliz hoy', { userId: 'u' } )

	const state = await fetch( `http://127.0.0.1:${port}/state` ).then( r => r.json() )

	assert.equal( typeof state.vector.valence, 'number' )
	assert.ok( Number.isFinite( state.vector.valence ) )
	assert.equal( typeof state.shame, 'number' )
	assert.equal( typeof state.sleepPressure, 'number' )

	await devServer.stop()

} )

test( 'DevServer: GET /explainability returns the real decision log, growing as real turns happen', async () => {

	const ai         = new Totemheart( { personality: new Personality() } )
	const devServer = new DevServer( ai, { port: 0 } )
	await devServer.start()
	const port = devServer.server.address().port

	const before = await fetch( `http://127.0.0.1:${port}/explainability` ).then( r => r.json() )
	await ai.processInput( 'un evento importante', { userId: 'u' } )
	const after = await fetch( `http://127.0.0.1:${port}/explainability` ).then( r => r.json() )

	assert.ok( Array.isArray( before ) )
	assert.ok( after.length >= before.length, 'a real turn should never SHRINK the decision log' )

	await devServer.stop()

} )

test( 'DevServer: GET / returns the real dashboard HTML, GET /unknown returns 404', async () => {

	const ai         = new Totemheart( { personality: new Personality() } )
	const devServer = new DevServer( ai, { port: 0 } )
	await devServer.start()
	const port = devServer.server.address().port

	const dashboard = await fetch( `http://127.0.0.1:${port}/` )
	assert.equal( dashboard.status, 200 )
	assert.ok( ( await dashboard.text() ).includes( '<html>' ) )

	const missing = await fetch( `http://127.0.0.1:${port}/nope` )
	assert.equal( missing.status, 404 )

	await devServer.stop()

} )

// ============================================================================
// cross: a real multi-turn, cross-mechanism conversation reflected live
// through the real HTTP endpoint, not just via getEmotionalState() in-process.
// ============================================================================

test( 'cross: a real rupture-and-grief scenario is observable live through /state, not just in-process', async () => {

	const ai         = new Totemheart( { personality: new Personality() } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	const devServer     = new DevServer( ai, { port: 0 } )
	await devServer.start()
	const port = devServer.server.address().port

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

	let ruptured = false
	for ( let i = 0; i < 40 && !ruptured; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion', { userId: 'u' } )
		ruptured = ai.loveHateEngine.getBond( 'u' ).ruptured

	}
	assert.ok( ruptured )

	const state = await fetch( `http://127.0.0.1:${port}/state` ).then( r => r.json() )
	assert.ok( state.grief.some( g => g.userId === 'u' && g.active ), '/state must reflect the real active grief over real HTTP, not just in-process' )

	await devServer.stop()

} )
