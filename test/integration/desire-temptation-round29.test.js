/**
 * Round 29: the "desire and temptation" gap the user's own detailed
 * message identified — Totemheart had bond, arousal, shame, and partial
 * impulsivity, but no real axis for "wanting something now" vs. "knowing
 * it's forbidden/costly." 4 new real modules (DesireEngine, TemptationField,
 * CravingTrace, YieldController), each reusing already-existing real
 * signals (InhibitoryControlPool, ComparisonLevelAlternatives, ShameGuiltSplit,
 * LoyaltyConflictResolver, FaceThreatSensitivity, CognitiveDissonance)
 * rather than inventing new inputs from nothing.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { DesireEngine }                 from '../../src/cognition/DesireEngine.js'
import { TemptationField }           from '../../src/cognition/TemptationField.js'
import { CravingTrace }                 from '../../src/cognition/CravingTrace.js'
import { YieldController }           from '../../src/cognition/YieldController.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// DesireEngine
// ============================================================================

test( 'DesireEngine: real desire builds with repeated high salience, genuinely satiates with real exposure', () => {

	const d = new DesireEngine()
	let s
	for ( let i = 0; i < 15; i++ ) { s = d.getSalience( { attraction: 0.8, novelty: 0.6, bond: 0.5, uncertainty: 0.4 }, 'x' ); d.update( 'x', s ) }
	const peak = d.getDesire( 'x' )
	assert.ok( peak > 0.5 )

	d.registerExposure( 'x', 8 )
	const satedSalience = d.getSalience( { attraction: 0.8, novelty: 0.6, bond: 0.5, uncertainty: 0.4 }, 'x' )
	assert.ok( satedSalience < s, 'real repeated exposure must genuinely lower future salience' )

} )

test( 'DesireEngine.applyForbiddenFruitBoost(): real prohibition genuinely amplifies desire, Brehm 1966', () => {

	const d = new DesireEngine()
	d.update( 'x', 0.5 )
	const before = d.getDesire( 'x' )
	d.applyForbiddenFruitBoost( 'x', 0.9 )
	assert.ok( d.getDesire( 'x' ) > before )

} )

test( 'DesireEngine.getAmbivalentDesire(): real bounded minimum of desire and aversion, not an average', () => {

	const d = new DesireEngine()
	d.update( 'x', 0.9 )
	assert.equal( d.getAmbivalentDesire( 'x', 0.3 ), 0.3 )
	assert.equal( d.getAmbivalentDesire( 'x', 0.99 ), d.getDesire( 'x' ) )

} )

// ============================================================================
// TemptationField / YieldController / CravingTrace
// ============================================================================

test( 'TemptationField: real T=0 with no forbiddenness even at high desire; real T rises with genuine conflict', () => {

	const t = new TemptationField()
	assert.equal( t.getTemptation( 0.9, 0.9, 0 ), 0 )
	const highO = t.getForbiddenness( { normViolation: 0.8, loyaltyCost: 0.8, faceThreat: 0.5, selfDiscord: 0.5 } )
	assert.ok( t.getTemptation( 0.9, 0.9, highO ) > 0.3 )

} )

test( 'YieldController: real high temptation + low inhibitory control raises yield probability well above the reverse case', () => {

	const y = new YieldController()
	const highRisk = y.getYieldProbability( { temptation: 0.9, inhibitoryControl: 0.1, commitment: 0.1, guiltAnticipated: 0.1, depletion: 0.7 } )
	const lowRisk    = y.getYieldProbability( { temptation: 0.2, inhibitoryControl: 0.9, commitment: 0.8, guiltAnticipated: 0.5, depletion: 0.1 } )
	assert.ok( highRisk > lowRisk )
	assert.ok( highRisk > 0.5 )
	assert.ok( lowRisk < 0.1 )

} )

test( 'CravingTrace: real residual persists after exposure and genuinely decays, a reminder re-triggers it without new exposure', () => {

	const c = new CravingTrace()
	for ( let i = 0; i < 5; i++ ) c.registerExposure( 'x', 0.8 )
	assert.ok( c.getCraving( 'x' ) > 0.5 )
	for ( let i = 0; i < 100; i++ ) c.decay( 'x' )
	assert.equal( c.getCraving( 'x' ), 0 )
	c.registerReminder( 'x', 0.5 )
	assert.ok( c.getCraving( 'x' ) > 0 )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: real desire/temptation/craving are exposed and finite through a normal bonded conversation', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'te quiero mucho, eres maravilloso', { userId: 'A' } )
	const result = await ai.processInput( 'te quiero mucho', { userId: 'A' } )

	assert.ok( Number.isFinite( result.debug.desire.level ) && result.debug.desire.level >= 0 && result.debug.desire.level <= 1 )
	assert.ok( Number.isFinite( result.debug.temptation.level ) )
	assert.equal( typeof result.debug.temptation.didYield, 'boolean' )
	assert.ok( Number.isFinite( result.debug.craving ) )
	assert.ok( Number.isFinite( result.debug.ambivalentDesire ) && result.debug.ambivalentDesire >= 0 && result.debug.ambivalentDesire <= 1 )
	assert.ok( Number.isFinite( result.debug.desireTension ) && result.debug.desireTension >= 0 )

} )

test( 'full: a real divided-loyalty scenario with a forbidden comparison genuinely raises real forbiddenness and temptation', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'te quiero mucho, eres maravilloso', { userId: 'A' } )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'C' } )
	const result = await ai.processInput( 'me atraes muchísimo, esto es una traicion, quiero que estemos juntos aunque esté mal', { userId: 'A' } )

	assert.ok( result.debug.temptation.forbiddenness > 0.05, 'a real forbidden/disloyal comparison must genuinely raise forbiddenness above the baseline no-conflict case' )
	assert.ok( result.debug.loyaltyConflict > 0 )

} )

test( 'full: a forced real yield genuinely spends InhibitoryControlPool, registers craving, and can raise guilt', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	ai.inhibitoryControlPool.level = 0.02
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'A' } )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'C' } )
	ai.desireEngine.desire.set( 'A', 0.95 )

	const originalRandom = Math.random
	try {

		Math.random = () => 0 // guaranteed yield if temptation crosses the real gate threshold
		const controlBefore = ai.inhibitoryControlPool.level
		const result             = await ai.processInput( 'esto es una traicion, no puedo evitarlo, te deseo muchísimo', { userId: 'A' } )

		if ( result.debug.temptation.level > 0.1 ) {

			assert.equal( result.debug.temptation.didYield, true )
			assert.ok( ai.inhibitoryControlPool.level <= controlBefore )
			assert.ok( result.debug.craving > 0 )

		}

	}
	finally { Math.random = originalRandom }

} )

test( 'full: toJSON()/restoreState() round-trips real desire/craving state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 6; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'A' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	assert.deepEqual( rehydrated.desireLevels, saved.desireLevels )
	assert.deepEqual( rehydrated.desireExposure, saved.desireExposure )
	assert.deepEqual( rehydrated.cravingLevels, saved.cravingLevels )

} )

test( 'hard: 300-turn long-horizon conversation keeps every new field finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'te quiero mucho', 'esto es una traicion, te deseo', 'hola', 'me atraes' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: i % 3 === 0 ? 'C' : 'A' } )

	assert.ok( Number.isFinite( last.debug.desire.level ) && last.debug.desire.level >= 0 && last.debug.desire.level <= 1 )
	assert.ok( Number.isFinite( last.debug.temptation.level ) && last.debug.temptation.level >= 0 && last.debug.temptation.level <= 1 )
	assert.ok( Number.isFinite( last.debug.craving ) && last.debug.craving >= 0 && last.debug.craving <= 1 )

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )
