/**
 * Direct unit tests for round 54: FlowStateEngine (real, named-honestly
 * transient hypofrontality, the real-science slice of the user's own
 * "supraconsciencia" request), InsightGenerator's real incubation-boost
 * extension (Jung-Beeman 2004 alpha-before-gamma pattern), and
 * TipOfTongue's real spontaneous "eureka" resolution.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { FlowStateEngine }   from '../../src/cognition/FlowStateEngine.js'
import { InsightGenerator } from '../../src/cognition/InsightGenerator.js'
import { TipOfTongue }         from '../../src/cognition/TipOfTongue.js'
import { Totemheart }             from '../../src/index.js'

// ============================================================================
// FlowStateEngine
// ============================================================================

test( 'FlowStateEngine.update: real high absorption + real low self-referential thought produces a genuinely higher flow read than the reverse', () => {

	const f = new FlowStateEngine( { smoothing: 0 } )
	const flowing      = f.update( 0.9, 0.1 )
	const notFlowing = new FlowStateEngine( { smoothing: 0 } ).update( 0.1, 0.9 )
	assert.ok( flowing > notFlowing )

} )

test( 'FlowStateEngine.getHypofrontalityDiscount: real, bounded — never fully zeroes out executive control even at maximum flow', () => {

	const f = new FlowStateEngine( { maxReduction: 0.5, smoothing: 0 } )
	f.update( 1, 0 )
	assert.ok( f.getHypofrontalityDiscount() <= 0.5 )
	assert.ok( f.getHypofrontalityDiscount() > 0 )

} )

test( 'FlowStateEngine.toJSON()/restoreState(): round-trips the real smoothed level', () => {

	const f = new FlowStateEngine( { smoothing: 0 } )
	f.update( 0.8, 0.2 )
	const restored = new FlowStateEngine()
	restored.restoreState( f.toJSON() )
	assert.equal( restored.level, f.level )

} )

// ============================================================================
// InsightGenerator's real incubation boost
// ============================================================================

test( 'InsightGenerator.getIncubationBoost: 0 for a pattern that was never actually observed, even with a real active-attempt marker', () => {

	const g = new InsightGenerator()
	g.registerActiveAttempt( 'never-observed', 0 )
	assert.equal( g.getIncubationBoost( 'never-observed', 1000 * 60 * 10 ), 0 )

} )

test( 'InsightGenerator.getIncubationBoost: real, growing boost as real elapsed time passes since the mind stopped actively attacking a real, observed pattern', () => {

	const g = new InsightGenerator( { incubationRampMs: 1000 * 60 * 3, incubationMaxBoost: 0.6 } )
	g.observe( 'actor-name', 0.1, 0 )
	g.registerActiveAttempt( 'actor-name', 0 )
	assert.equal( g.getIncubationBoost( 'actor-name', 0 ), 0, 'still actively attacking it right now should carry no incubation boost yet' )
	const partial = g.getIncubationBoost( 'actor-name', 1000 * 60 * 1.5 )
	const full        = g.getIncubationBoost( 'actor-name', 1000 * 60 * 10 )
	assert.ok( partial > 0 && partial < 0.6 )
	assert.equal( full, 0.6 )

} )

test( 'InsightGenerator.getInsightProbability: real incubation genuinely raises the probability over the base pattern-strength alone, for a real, previously-observed pattern', () => {

	const g = new InsightGenerator()
	g.observe( 'x', 0.5, 0 )
	g.registerActiveAttempt( 'x', 0 )
	const withoutIncubation = g.getInsightProbability( 'x', 0.5, 0, 0 )
	const withIncubation       = g.getInsightProbability( 'x', 0.5, 0, 1000 * 60 * 10 )
	assert.ok( withIncubation > withoutIncubation )

} )

// ============================================================================
// TipOfTongue's real spontaneous eureka resolution
// ============================================================================

test( 'TipOfTongue.checkSpontaneousResolution: never fires for a concept with no registered block', () => {

	const t = new TipOfTongue()
	assert.equal( t.checkSpontaneousResolution( 'nunca-bloqueado' ), null )

} )

test( 'TipOfTongue.checkSpontaneousResolution: real, growing probability with accumulated tension — near-certain at max tension with Math.random() stubbed low', () => {

	const t = new TipOfTongue( { maxTension: 3, resolveBase: 0.1, resolveSlope: 0.4 } )
	for ( let i = 0; i < 200; i++ ) t.registerBlock( 'actor', 0.2 ) // drive tension to its own real ceiling
	assert.ok( t.getTension( 'actor' ) >= t.maxTension * 0.9 )

	const originalRandom = Math.random
	Math.random = () => 0.01 // forces the real Bernoulli draw to hit
	try {

		const resolution = t.checkSpontaneousResolution( 'actor' )
		assert.ok( resolution )
		assert.equal( resolution.concept, 'actor' )
		assert.equal( t.blocks.has( 'actor' ), false, 'a real resolution should genuinely clear the block' )

	}
	finally { Math.random = originalRandom }

} )

test( 'TipOfTongue.checkAllSpontaneousResolutions: real background sweep finds a resolution for ANY blocked concept, not only one matching the current turn\'s own topic', () => {

	const t = new TipOfTongue( { maxTension: 3, resolveBase: 0.1, resolveSlope: 0.4 } )
	for ( let i = 0; i < 50; i++ ) { t.registerBlock( 'unrelated_topic_a', 0.2 ); t.registerBlock( 'unrelated_topic_b', 0.2 ) }

	const originalRandom = Math.random
	Math.random = () => 0.01
	try {

		const resolution = t.checkAllSpontaneousResolutions()
		assert.ok( resolution )
		assert.ok( [ 'unrelated_topic_a', 'unrelated_topic_b' ].includes( resolution.concept ) )

	}
	finally { Math.random = originalRandom }

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes real flowStateEngine, wired per-turn, and debug.eureka/debug.flow fields stay finite across a real multi-turn conversation', async () => {

	const ai = new Totemheart()
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.sensoryOverload         = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } )
	let last
	for ( let i = 0; i < 6; i++ ) last = await ai.processInput( 'me encanta hablar contigo de esto', { userId: 'u' } )
	assert.ok( Number.isFinite( ai.flowStateEngine.level ) )
	assert.ok( Number.isFinite( last.debug.flow ) )
	assert.ok( last.debug.eureka === null || typeof last.debug.eureka === 'object' )

} )

test( 'full: a real, forced-certain eureka resolution appends a real "IMPORTANTE" directive naming the concept to the systemPrompt', async () => {

	const ai = new Totemheart()
	ai.tipOfTongue.registerBlock( 'nombre_del_actor', 0.1 )
	for ( let i = 0; i < 60; i++ ) ai.tipOfTongue.registerBlock( 'nombre_del_actor', 0.1 )

	const originalRandom = Math.random
	Math.random = () => 0.001
	let result
	try { result = await ai.processInput( 'hola', { userId: 'u' } ) }
	finally { Math.random = originalRandom }

	assert.ok( result.debug.eureka, 'a near-certain roll on a maximally-tensioned block should genuinely resolve this turn' )
	assert.equal( result.debug.eureka.concept, 'nombre_del_actor' )
	assert.ok( result.systemPrompt.includes( 'nombre_del_actor' ), 'the real systemPrompt directive should genuinely name the resolved concept' )

} )

test( 'full: toJSON()/restoreState() round-trips real flowStateLevel through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.equal( restored.flowStateEngine.level, ai.flowStateEngine.level )

} )
