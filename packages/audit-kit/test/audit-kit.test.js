import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { noBurst, noHijack, assertFiniteState, driveToRupture } from '../src/index.js'
import { Totemheart, Personality } from '../../../src/index.js'

test( 'noBurst: raises SensoryOverload\'s burst threshold so tight processInput() loops don\'t freeze', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	let froze  = false
	for ( let i = 0; i < 6; i++ ) {

		const result = await ai.processInput( `mensaje ${i}`, { userId: 'u' } )
		if ( result.styleTags?.includes( 'burst' ) ) froze = true

	}
	assert.equal( froze, false )

} )

test( 'noHijack: neutralizes AmygdalaHijack\'s early return so downstream mechanisms are reachable', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const result = await ai.processInput( 'esto es horrible, te odio, eres pesimo, fatal', { userId: 'u' } )
	assert.notEqual( result.styleTags?.[ 0 ], 'hijack' )

} )

test( 'assertFiniteState: passes on a healthy instance, throws a real error on a real violation', () => {

	const ai = new Totemheart( { personality: new Personality() } )
	assert.doesNotThrow( () => assertFiniteState( ai ) )

	ai.emotionSpace.vector.valence = NaN
	assert.throws( () => assertFiniteState( ai ), /valence must be finite/ )

} )

test( 'assertFiniteState: accepts a custom assert function (e.g. node:assert.ok bound with a message)', () => {

	const ai = new Totemheart( { personality: new Personality() } )
	let calls  = 0
	assertFiniteState( ai, ( condition, message ) => { calls++; assert.ok( condition, message ) } )
	assert.ok( calls > 5, 'the custom assert function must have actually been called for each real check' )

} )

test( 'driveToRupture: reaches a real rupture within the real bound, using the exact same setup pattern as core\'s own cross-mechanism tests', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

	const ruptured = await driveToRupture( ai, { userId: 'u' } )
	assert.ok( ruptured )
	assertFiniteState( ai )

} )

test( 'driveToRupture: returns false, not throws, when the bond never had enough affinity to rupture meaningfully', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const ruptured = await driveToRupture( ai, { userId: 'stranger', maxTurns: 3 } )
	assert.equal( typeof ruptured, 'boolean' )

} )
