/**
 * Direct unit tests for round 53: ClinginessEngine (real excessive-affection
 * expression, per the user's own supplied formulas).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { ClinginessEngine } from '../../src/social/ClinginessEngine.js'
import { Totemheart }             from '../../src/index.js'

test( 'ClinginessEngine.computeExpression: real high anxious attachment + low inhibitory control + genuine space request produces high over-expression', () => {

	const c = new ClinginessEngine()
	const clingy = c.computeExpression( { affection: 0.7, anxiousAttachment: 0.9, oxytocin: 0.8, wanting: 0.8, inhibitoryControl: 0.1, spaceRequested: 0.8 } )
	const healthy   = c.computeExpression( { affection: 0.7, anxiousAttachment: 0.1, oxytocin: 0.8, wanting: 0.8, inhibitoryControl: 0.9, spaceRequested: 0.8 } )
	assert.ok( clingy > healthy, 'high anxious attachment + low inhibitory control should genuinely read as more over-expressed than the same affection with secure/regulated traits' )

} )

test( 'ClinginessEngine.computeExpression: real, high inhibitory control genuinely dampens expression EVEN under high anxious attachment', () => {

	const c = new ClinginessEngine()
	const lowControl    = c.computeExpression( { affection: 0.2, anxiousAttachment: 0.4, oxytocin: 0.3, wanting: 0.3, inhibitoryControl: 0.15, spaceRequested: 0.5 } )
	const highControl = c.computeExpression( { affection: 0.2, anxiousAttachment: 0.4, oxytocin: 0.3, wanting: 0.3, inhibitoryControl: 0.9, spaceRequested: 0.5 } )
	assert.ok( highControl < lowControl )

} )

test( 'ClinginessEngine.updateHyperactivation: real, growing hyperactivation when desired contact clearly outruns actual contact, held down by real inhibitory control', () => {

	const c = new ClinginessEngine()
	let last
	for ( let i = 0; i < 3; i++ ) last = c.updateHyperactivation( 'u', 0.9, 0.1, 0.8, 0.2 )
	assert.ok( last > 0.1, 'a real, sustained desired-vs-actual contact gap under real anxious attachment should genuinely build hyperactivation' )

	const regulated = new ClinginessEngine()
	let lastRegulated
	for ( let i = 0; i < 3; i++ ) lastRegulated = regulated.updateHyperactivation( 'u', 0.9, 0.1, 0.8, 0.95 )
	assert.ok( lastRegulated < last, 'real, high inhibitory control should genuinely keep hyperactivation lower than low control, same contact gap and same anxious attachment' )

} )

test( 'ClinginessEngine.reinforceReassuranceSeeking: real Q-learning-style reinforcement — repeated real anxiety relief from reassurance-seeking raises its own learned value', () => {

	const c = new ClinginessEngine()
	assert.equal( c.getReassuranceQ( 'u' ), 0 )
	for ( let i = 0; i < 5; i++ ) c.reinforceReassuranceSeeking( 'u', 0.6 )
	assert.ok( c.getReassuranceQ( 'u' ) > 0 )

} )

test( 'ClinginessEngine.decayAll: real, gradual fade of both hyperactivation and reassurance-seeking over real ticks with no further reinforcement', () => {

	const c = new ClinginessEngine()
	for ( let i = 0; i < 10; i++ ) c.updateHyperactivation( 'u', 0.9, 0.1, 0.8, 0.2 )
	c.reinforceReassuranceSeeking( 'u', 0.8 )
	const peakH = c.getHyperactivation( 'u' )
	const peakQ = c.getReassuranceQ( 'u' )

	for ( let i = 0; i < 50; i++ ) c.decayAll( 1 )
	assert.ok( c.getHyperactivation( 'u' ) < peakH )
	assert.ok( c.getReassuranceQ( 'u' ) < peakQ )

} )

test( 'ClinginessEngine.toJSON()/restoreState(): round-trips real hyperactivation/reassuranceQ state', () => {

	const c = new ClinginessEngine()
	c.updateHyperactivation( 'u', 0.8, 0.2, 0.7, 0.3 )
	c.reinforceReassuranceSeeking( 'u', 0.5 )
	const restored = new ClinginessEngine()
	restored.restoreState( c.toJSON() )
	assert.equal( restored.getHyperactivation( 'u' ), c.getHyperactivation( 'u' ) )
	assert.equal( restored.getReassuranceQ( 'u' ), c.getReassuranceQ( 'u' ) )

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes real clinginessEngine, wired per-turn, with no NaN across a real multi-turn conversation', async () => {

	const ai = new Totemheart()
	for ( let i = 0; i < 6; i++ ) await ai.processInput( 'te quiero mucho, no dejo de pensar en ti', { userId: 'u' } )
	assert.ok( Number.isFinite( ai.clinginessEngine.getHyperactivation( 'u' ) ) )

} )

test( 'full: toJSON()/restoreState() round-trips real clinginessState through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola', { userId: 'u' } )
	ai.clinginessEngine.reinforceReassuranceSeeking( 'u', 0.5 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.equal( restored.clinginessEngine.getHyperactivation( 'u' ), ai.clinginessEngine.getHyperactivation( 'u' ) )
	assert.equal( restored.clinginessEngine.getReassuranceQ( 'u' ), ai.clinginessEngine.getReassuranceQ( 'u' ) )

} )
