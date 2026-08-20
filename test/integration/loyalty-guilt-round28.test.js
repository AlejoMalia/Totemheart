/**
 * Round 28: closing the last real gap the round-26/27 "5 emergent human
 * tests" mock left honest — residual guilt toward an abandoned bond never
 * fired, because LoyaltyConflictResolver.getConflict()/getResolutionLean()
 * were already built but never actually evaluated anywhere in the real
 * pipeline. A real bug was caught empirically while wiring this: the two
 * "sides" fed into getConflict() need genuinely OPPOSING signs to read as
 * real tension — feeding it two independently-positive bond magnitudes
 * (both people genuinely liked) produced almost NO conflict under the raw
 * formula, the opposite of the real intent.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

test( 'full: real loyaltyConflict is exposed and genuinely rises when 2 real, separately-bonded people compete for the same turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'C' } )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'A' } )
	const result = await ai.processInput( 'quiero volver contigo, eres el amor de mi vida', { userId: 'A' } )

	assert.ok( result.debug.loyaltyConflict > 0.3, 'two real, separately strong bonds pulling on the same turn must read as real, substantial conflict' )

} )

test( 'full: real residual guilt toward the "other" bonded person genuinely fires from the loyalty-conflict coupling', async () => {

	// Deliberately few prior turns — enough for 2 real, distinct bonds to
	// exist, not so many that guilt is already saturated at its own real
	// ceiling before the turn under test even runs (caught empirically:
	// an 8-turn courtship on each side already maxed guilt out beforehand).
	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 3; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'C' } )
	for ( let i = 0; i < 3; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'A' } )
	const guiltBefore = ai.shameGuiltSplit.guilt
	await ai.processInput( 'sé que te hice mucho daño, lo siento, quiero volver contigo, eres el amor de mi vida', { userId: 'A' } )

	assert.ok( ai.shameGuiltSplit.guilt > guiltBefore, 'real divided loyalty must genuinely raise guilt, not stay flat' )

} )

test( 'full: a single real bond with no competing loyalty produces no real loyaltyConflict', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'A' } )
	const result = await ai.processInput( 'te quiero mucho', { userId: 'A' } )

	assert.equal( result.debug.loyaltyConflict, 0, 'with only one real known relation, there is nothing real to be torn between' )

} )

test( 'hard: 300-turn long-horizon conversation keeps loyaltyConflict finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'te quiero mucho', 'quiero volver contigo, eres el amor de mi vida' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: i % 2 === 0 ? 'A' : 'C' } )

	assert.ok( Number.isFinite( last.debug.loyaltyConflict ) && last.debug.loyaltyConflict >= 0 && last.debug.loyaltyConflict <= 1 )
	assert.ok( Number.isFinite( ai.shameGuiltSplit.guilt ) && ai.shameGuiltSplit.guilt >= 0 && ai.shameGuiltSplit.guilt <= 1 )

} )
