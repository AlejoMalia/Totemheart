/**
 * Direct unit tests for round 55: CapitalVicesEngine, the user's own
 * supplied formulas for the 7 classical vices, composed from already-real
 * infrastructure (EgoCalibrationSuite, TemporalDiscountingEngine,
 * HedonicAdaptation, AmygdalaHijack/CortisolEngine, DopaminergicEngine,
 * StatusEnvy/JealousyTriangle, EnergyBudget) rather than duplicated.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { CapitalVicesEngine }             from '../../src/social/CapitalVicesEngine.js'
import { EgoCalibrationSuite }            from '../../src/social/EgoCalibrationSuite.js'
import { TemporalDiscountingEngine } from '../../src/cognition/TemporalDiscountingEngine.js'
import { Totemheart }                          from '../../src/index.js'

// ============================================================================
// 1. Soberbia
// ============================================================================

test( 'CapitalVicesEngine.computePride: real, higher pride from a real, higher hubris index, further amplified by real perceived superiority over others', () => {

	const v = new CapitalVicesEngine()
	const alone      = v.computePride( 0.6, [] )
	const superior = v.computePride( 0.6, [ 0.2, 0.1, 0.3 ] )
	assert.ok( superior > alone, 'real perceived superiority over tracked others should genuinely amplify pride beyond the hubris index alone' )

} )

test( 'CapitalVicesEngine.computePride: real, direct composition of EgoCalibrationSuite.getHubrisIndex(), not a reimplementation', () => {

	const ego = new EgoCalibrationSuite()
	for ( let i = 0; i < 10; i++ ) ego.observe( 0.3, 0.9 ) // consistently over-confident relative to real track record
	const v      = new CapitalVicesEngine()
	const pride = v.computePride( ego.getHubrisIndex(), [] )
	assert.ok( pride > 0 )

} )

// ============================================================================
// 2. Avaricia
// ============================================================================

test( 'CapitalVicesEngine.updateGreed: real accumulation grows with repeated real gains, and the real seeking drive never collapses to 0 even as satisfaction flattens (the hedonic-treadmill shape)', () => {

	const v = new CapitalVicesEngine()
	let last
	for ( let i = 0; i < 20; i++ ) last = v.updateGreed( 'u', 0.8 )
	assert.ok( last.accumulated > 0 )
	assert.ok( last.satisfaction > 0 )
	assert.ok( last.seekingDrive > 0, 'the real seeking drive should genuinely persist even once real accumulated satisfaction has grown, the whole point of a flattening marginal-satisfaction curve' )

} )

test( 'CapitalVicesEngine.getGreedLevel: 0 for an entity that never received anything', () => {

	const v = new CapitalVicesEngine()
	assert.equal( v.getGreedLevel( 'never' ), 0 )

} )

// ============================================================================
// 3. Lujuria
// ============================================================================

test( 'CapitalVicesEngine.computeLust: real, direct composition of TemporalDiscountingEngine.discount(), genuinely dampened by real moral cost × real inhibitory control', () => {

	const discounter = new TemporalDiscountingEngine()
	const { discountedValue } = discounter.discount( 0.9, 0, { impulsivity: 0.9 } ) // zero delay, high impulsivity -> near-full discounted value
	const v = new CapitalVicesEngine()
	const unrestrained = v.computeLust( discountedValue, 0, 0 )
	const restrained       = v.computeLust( discountedValue, 0.8, 0.8 )
	assert.ok( restrained < unrestrained, 'real moral cost and real inhibitory control should genuinely dampen the composed impulse' )

} )

test( 'CapitalVicesEngine.computeLust: real hyperbolic discount over increasing delay genuinely lowers the impulse, same as TemporalDiscountingEngine alone', () => {

	const discounter = new TemporalDiscountingEngine()
	const v                 = new CapitalVicesEngine()
	const immediate = v.computeLust( discounter.discount( 0.9, 0, { impulsivity: 0.8 } ).discountedValue, 0, 0 )
	const delayed       = v.computeLust( discounter.discount( 0.9, 20, { impulsivity: 0.8 } ).discountedValue, 0, 0 )
	assert.ok( delayed < immediate )

} )

// ============================================================================
// 4. Ira
// ============================================================================

test( 'CapitalVicesEngine.updateWrath: real buildup only once frustration crosses the real threshold, raised further by real sympathetic activation, dampened by real inhibitory control', () => {

	const v = new CapitalVicesEngine()
	const belowThreshold = v.updateWrath( 'a', 0.2, 0.5, 0, 0.9 )
	assert.equal( belowThreshold, 0, 'frustration below its own real threshold, with no sympathetic activation and real inhibitory control online, should not build wrath' )

	const overThreshold = v.updateWrath( 'b', 0.9, 0.3, 0.2, 0.1 )
	assert.ok( overThreshold > 0 )

	const restrained = v.updateWrath( 'c', 0.9, 0.3, 0.2, 0.9 )
	assert.ok( restrained < overThreshold, 'real, high inhibitory control should genuinely dampen the same real over-threshold frustration' )

} )

test( 'CapitalVicesEngine.decayWrath: real, gradual fade with no further provocation', () => {

	const v = new CapitalVicesEngine()
	v.updateWrath( 'u', 0.9, 0.2, 0.6, 0.1 )
	const peak = v.getWrathLevel( 'u' )
	for ( let i = 0; i < 20; i++ ) v.decayWrath( 1 )
	assert.ok( v.getWrathLevel( 'u' ) < peak )

} )

// ============================================================================
// 5. Gula
// ============================================================================

test( 'CapitalVicesEngine.computeGluttony: real, positive only when hedonic drive genuinely outruns homeostatic satiety', () => {

	const v = new CapitalVicesEngine()
	assert.ok( v.computeGluttony( 0.9, 0.2 ) > 0 )
	assert.equal( v.computeGluttony( 0.3, 0.9 ), 0 )

} )

// ============================================================================
// 6. Envidia
// ============================================================================

test( 'CapitalVicesEngine.computeEnvy: real, higher envy from a real, wider gap in favor of the other, dampened by real social distance', () => {

	const v = new CapitalVicesEngine()
	const closeRival = v.computeEnvy( 0.7, 0.3, 0.9, 0.1 )
	const farRival       = v.computeEnvy( 0.7, 0.3, 0.9, 0.9 )
	assert.ok( closeRival > farRival, 'the real SAME status gap should genuinely envy more toward a real, closer social peer than a distant one' )
	assert.equal( v.computeEnvy( 0.7, 0.9, 0.3, 0.1 ), 0, 'no real envy when the AI itself already has the advantage' )

} )

// ============================================================================
// 7. Pereza
// ============================================================================

test( 'CapitalVicesEngine.computeSlothActionProbability: real, high effort with real low energy genuinely lowers the probability of acting versus the same effort at high energy', () => {

	const v = new CapitalVicesEngine()
	const tired   = v.computeSlothActionProbability( 0.6, 0.7, 0.1 )
	const rested = v.computeSlothActionProbability( 0.6, 0.7, 0.9 )
	assert.ok( tired < rested, 'real low energy should genuinely steepen the real effort penalty and lower action probability for the identical reward/effort' )

} )

test( 'CapitalVicesEngine.computeSlothActionProbability: real, high expected reward with low effort produces a high action probability', () => {

	const v = new CapitalVicesEngine()
	assert.ok( v.computeSlothActionProbability( 0.9, 0.05, 0.9 ) > 0.7 )

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes real capitalVicesEngine, usable directly, with no NaN', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola', { userId: 'u' } )

	const pride = ai.capitalVicesEngine.computePride( ai.egoCalibrationSuite.getHubrisIndex(), [] )
	assert.ok( Number.isFinite( pride ) )

	const lustDiscount = ai.temporalDiscountingEngine.discount( 0.7, 2, { impulsivity: 0.5 } )
	const lust               = ai.capitalVicesEngine.computeLust( lustDiscount.discountedValue, 0.3, ai.inhibitoryControlPool.level / ai.inhibitoryControlPool.capacity )
	assert.ok( Number.isFinite( lust ) )

	const wrath = ai.capitalVicesEngine.updateWrath( 'u', 0.5, 0.3, ai.cortisolEngine.getLevel(), ai.inhibitoryControlPool.level / ai.inhibitoryControlPool.capacity )
	assert.ok( Number.isFinite( wrath ) )

} )

test( 'full: toJSON()/restoreState() round-trips real capitalVicesState through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola', { userId: 'u' } )
	ai.capitalVicesEngine.updateGreed( 'u', 0.7 )
	ai.capitalVicesEngine.updateWrath( 'u', 0.9, 0.2, 0.5, 0.1 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.equal( restored.capitalVicesEngine.getGreedLevel( 'u' ), ai.capitalVicesEngine.getGreedLevel( 'u' ) )
	assert.equal( restored.capitalVicesEngine.getWrathLevel( 'u' ), ai.capitalVicesEngine.getWrathLevel( 'u' ) )

} )
