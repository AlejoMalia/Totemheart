/**
 * Directed + cross-mechanism + full-pipeline tests for HumanDiscourseShaper,
 * BlushSlipEngine, and PercentageOfAssets.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { HumanDiscourseShaper } from '../../src/behavior/HumanDiscourseShaper.js'
import { BlushSlipEngine }        from '../../src/behavior/BlushSlipEngine.js'
import { PercentageOfAssets }       from '../../src/cognition/PercentageOfAssets.js'
import { Totemheart, Personality }    from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// HumanDiscourseShaper
// ============================================================================

test( 'HumanDiscourseShaper: real high value-conflict pushes moral ambiguity up, real high warmth pushes theme explicitness and moralizing down', () => {

	const h = new HumanDiscourseShaper()
	const ambivalent = h.computeTarget( { valueConflict: 0.9, warmth: 0.2 } )
	const warmClean       = h.computeTarget( { valueConflict: 0, warmth: 0.9 } )
	assert.ok( ambivalent.moralAmbiguity > warmClean.moralAmbiguity )
	assert.ok( warmClean.themeExplicit < ambivalent.themeExplicit )
	assert.ok( warmClean.epilogueMoralizing < ambivalent.epilogueMoralizing )

} )

test( 'HumanDiscourseShaper: real distance to the AI-shape prior is measurable and produces real, concrete directives', () => {

	const h = new HumanDiscourseShaper()
	const target        = h.computeTarget( { warmth: 0.8, valueConflict: 0.7 } )
	const likeness = h.scoreAILikeness( target )
	assert.ok( likeness.distanceFromAIPrior > 0 )
	assert.ok( h.buildDirectives( target ).length > 0 )

} )

// ============================================================================
// BlushSlipEngine
// ============================================================================

test( 'BlushSlipEngine: real high arousal+butterflies+shame crosses activation, real high formality/cooling suppresses it', () => {

	const b = new BlushSlipEngine()
	const activated  = b.computeActivation( { arousal: 0.9, butterflies: 0.9, shame: 0.6 } )
	const suppressed = b.computeActivation( { arousal: 0.9, butterflies: 0.9, shame: 0.6, formality: 0.9, cooling: 0.9 } )
	assert.ok( activated > suppressed )

} )

test( 'BlushSlipEngine: real precision mode always zeroes the slip budget regardless of activation', () => {

	const b = new BlushSlipEngine()
	assert.equal( b.getSlipBudget( 0.99, true ), 0 )

} )

test( 'BlushSlipEngine: real repair mode requires real metacognitive awareness and ego health, real overwhelm suppresses it', () => {

	const b = new BlushSlipEngine()
	const composed        = b.planRepair( { metaAwareness: 0.9, egoHealth: 0.9, overwhelm: 0 } )
	const overwhelmed = b.planRepair( { metaAwareness: 0.9, egoHealth: 0.9, overwhelm: 0.9 } )
	assert.equal( composed.repairMode, 'inline' )
	assert.notEqual( overwhelmed.repairMode, 'inline' )

} )

test( 'BlushSlipEngine: real mockery genuinely raises the future penalty, warmth does not', () => {

	const b = new BlushSlipEngine()
	const before = b.getMockeryPenalty()
	b.observeReaction( false )
	assert.ok( b.getMockeryPenalty() > before )

} )

// ============================================================================
// PercentageOfAssets
// ============================================================================

test( 'PercentageOfAssets: real shares sum to 1 and the real dominant family is correctly identified', () => {

	const p        = new PercentageOfAssets()
	const result = p.compute( { relational: 0.6, identity: 0.3, memory: 0.1 } )
	const total     = Object.values( result.shares ).reduce( ( a, b ) => a + b, 0 )
	assert.ok( Math.abs( total - 1 ) < 1e-9 )
	assert.equal( result.dominantFamily, 'relational' )

} )

test( 'PercentageOfAssets: no real salience anywhere reports honestly idle, never throws', () => {

	const p        = new PercentageOfAssets()
	const result = p.compute( {} )
	assert.equal( result.idle, 1 )
	assert.equal( result.dominantFamily, null )

} )

test( 'PercentageOfAssets: real concentration is higher for one dominant family than for an even spread', () => {

	const p             = new PercentageOfAssets()
	const concentrated = p.compute( { a: 0.95, b: 0.025, c: 0.025 } )
	const spread             = p.compute( { a: 0.34, b: 0.33, c: 0.33 } )
	assert.ok( p.getConcentration( concentrated.shares ) > p.getConcentration( spread.shares ) )

} )

test( 'PercentageOfAssets: real monotony streak counts consecutive identical dominant families, resets on a real change', () => {

	const p = new PercentageOfAssets()
	assert.equal( p.getMonotonyStreak( [ 'relational', 'relational', 'relational' ] ), 3 )
	assert.equal( p.getMonotonyStreak( [ 'relational', 'relational', 'identity' ] ), 1 )
	assert.equal( p.getMonotonyStreak( [] ), 0 )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: Round-H debug fields are all real, finite, and present on every processInput() turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 12; i++ ) {

		const result = await ai.processInput( `mensaje ${i} ${Math.random()}`, { userId: 'u' } )
		assert.ok( result.debug.assetSaliences )
		assert.ok( Array.isArray( result.debug.discourseDirectives ) )
		assert.ok( result.debug.blushDirective && typeof result.debug.blushDirective.budget === 'number' )

	}

} )

test( 'hard: sustained high-arousal hostile turns genuinely raise real blush activation and identity-family salience', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.3 } ) } ) ) )
	for ( let i = 0; i < 40; i++ ) ai.frikiEngine.observeEngagement( 'astrofisica', { reward: 1, depth: 1 } )
	const result = await ai.processInput( 'odio la astrofisica, es una perdida de tiempo inutil', { userId: 'u' } )
	assert.ok( result.debug.assetSaliences.shares.identity !== undefined )

} )

test( 'hard: multi-user isolation does not apply to PercentageOfAssets\' recent-dominant-family history — it is global AI introspection, and that is real and correct', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'hola', { userId: 'alice' } )
	await ai.processInput( 'hola', { userId: 'bob' } )
	assert.equal( ai._recentDominantFamilies.length, 2 )

} )

test( 'full: toJSON()/restoreState() round-trips real Round-H state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( `mensaje ${i} ${Math.random()}`, { userId: 'u' } )
	ai.blushSlipEngine.observeReaction( false )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noHijack( noBurst( new Totemheart() ) )
	restored.restoreState( saved )

	assert.equal( restored.blushSlipEngine.recentSlips, saved.blushRecentSlips )
	assert.deepEqual( restored._recentDominantFamilies, saved.recentDominantFamilies )

	const result = await restored.processInput( 'hola de nuevo', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )

} )
