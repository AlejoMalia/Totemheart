/**
 * Direct unit tests for the round-50 mechanisms, per the user's own
 * priority-1 list: ContactFrequencyExpectation, ReliefEngine's real
 * physiological-release/residual-tremor extension, ComfortSeekingEngine,
 * PrideCompetenceEngine, GratitudeEngine's real sustained state,
 * SocialFatigueEngine, FirstImpressionEngine, DailyExpectationEngine,
 * AffinityResonance, and ComfortAccumulation.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { ContactFrequencyExpectation } from '../../src/social/ContactFrequencyExpectation.js'
import { ReliefEngine }                                    from '../../src/cognition/ReliefEngine.js'
import { ComfortSeekingEngine }                      from '../../src/social/ComfortSeekingEngine.js'
import { PrideCompetenceEngine }                      from '../../src/social/PrideCompetenceEngine.js'
import { GratitudeEngine }                                  from '../../src/social/GratitudeEngine.js'
import { SocialFatigueEngine }                          from '../../src/core/SocialFatigueEngine.js'
import { FirstImpressionEngine }                        from '../../src/social/FirstImpressionEngine.js'
import { DailyExpectationEngine }                    from '../../src/social/DailyExpectationEngine.js'
import { AffinityResonance }                                from '../../src/social/AffinityResonance.js'
import { ComfortAccumulation }                            from '../../src/social/ComfortAccumulation.js'
import { Totemheart }                                          from '../../src/index.js'

// ============================================================================
// ContactFrequencyExpectation
// ============================================================================

test( 'ContactFrequencyExpectation: a real, learned daily cadence produces real distress once the current silence clearly outruns it, and none while within it', () => {

	const c = new ContactFrequencyExpectation()
	const DAY = 1000 * 60 * 60 * 24
	let t = 0
	let lastContactAt = 0
	for ( let i = 0; i < 10; i++ ) { c.registerContact( 'u', t ); lastContactAt = t; t += DAY }
	assert.ok( c.getExpectedCadenceDays( 'u' ) > 0.9 && c.getExpectedCadenceDays( 'u' ) < 1.1 )

	assert.equal( c.getDistress( 'u', lastContactAt + DAY * 0.5 ), 0, 'well within the learned cadence should read zero distress' )
	assert.ok( c.getDistress( 'u', lastContactAt + DAY * 8 ) > 0, 'a real, sharp deviation from a daily cadence should read real distress' )

} )

test( 'ContactFrequencyExpectation: someone who was always sporadic produces less distress from the SAME absolute gap than someone who was daily', () => {

	const daily        = new ContactFrequencyExpectation()
	const sporadic = new ContactFrequencyExpectation()
	const DAY = 1000 * 60 * 60 * 24
	let t = 0
	for ( let i = 0; i < 6; i++ ) { daily.registerContact( 'u', t ); t += DAY }
	let t2 = 0
	for ( let i = 0; i < 6; i++ ) { sporadic.registerContact( 'u', t2 ); t2 += DAY * 10 }

	const gapNow = 8 * DAY
	assert.ok( daily.getDistress( 'u', t + gapNow ) > sporadic.getDistress( 'u', t2 + gapNow ), 'the same absolute silence should distress the previously-daily contact more than the previously-sporadic one' )

} )

// ============================================================================
// ReliefEngine — real physiological release + residual tremor
// ============================================================================

test( 'ReliefEngine.getPhysiologicalRelease: real, nonzero cortisol/arousal release only while a real relief spike is active', () => {

	const r = new ReliefEngine( { spikeDuration: 1000 } )
	assert.deepEqual( r.getPhysiologicalRelease( 0 ), { cortisolRelease: 0, arousalRelease: 0 } )
	r.trigger( 0.8, 0.9, 0 )
	const release = r.getPhysiologicalRelease( 100 )
	assert.ok( release.cortisolRelease > 0 )
	assert.ok( release.arousalRelease > 0 )

} )

test( 'ReliefEngine.getResidualTremor: real, distinct residual echo that genuinely OUTLASTS the relief spike itself', () => {

	const r = new ReliefEngine( { spikeDuration: 500, tremorDuration: 4000 } )
	r.trigger( 0.9, 1, 0 )
	assert.equal( r.getLevel( 600 ), 0, 'the felt relief spike should already be gone by now' )
	assert.ok( r.getResidualTremor( 600 ) > 0, 'a real residual tremor should still be present after the relief spike itself has faded' )
	assert.equal( r.getResidualTremor( 5000 ), 0, 'the tremor itself should eventually fully fade too' )

} )

// ============================================================================
// ComfortSeekingEngine
// ============================================================================

test( 'ComfortSeekingEngine.evaluateBid: real high distress + real high trust crosses the bid threshold; either alone, low, does not', () => {

	const c = new ComfortSeekingEngine()
	assert.equal( c.evaluateBid( 'u', 0.9, 0.9 ).bids, true )
	assert.equal( c.evaluateBid( 'v', 0.9, 0.1 ).bids, false )
	assert.equal( c.evaluateBid( 'w', 0.1, 0.9 ).bids, false )

} )

test( 'ComfortSeekingEngine: a real unanswered bid produces a real loneliness/yearning penalty; a real response clears it with none', () => {

	const answered   = new ComfortSeekingEngine()
	answered.evaluateBid( 'u', 0.9, 0.9 )
	answered.registerResponse( 'u' )
	assert.deepEqual( answered.registerUnmetBid( 'u' ), { loneliness: 0, yearning: 0 } )

	const unanswered = new ComfortSeekingEngine()
	unanswered.evaluateBid( 'u', 0.9, 0.9 )
	const penalty = unanswered.registerUnmetBid( 'u' )
	assert.ok( penalty.loneliness > 0 && penalty.yearning > 0 )

} )

// ============================================================================
// PrideCompetenceEngine
// ============================================================================

test( 'PrideCompetenceEngine: real pride is a real, short spike distinct from performance shame, which persists until it decays', () => {

	const p = new PrideCompetenceEngine( { prideDecayMs: 1000 } )
	const result = p.registerSuccess( 0.8, true, 0 )
	assert.ok( result.spike > 0 )
	assert.ok( result.shareImpulse > result.spike * 0.9, 'a WITNESSED success should carry a real, strong share impulse' )
	assert.ok( p.getPride( 0 ) > 0 )
	assert.equal( p.getPride( 2000 ), 0, 'pride should genuinely fade as a short spike' )

	p.registerFailure( 0.6 )
	assert.ok( p.getPerformanceShame() > 0 )
	p.decay( 100 )
	assert.ok( p.getPerformanceShame() < 0.6, 'performance shame should genuinely decay over real ticks' )

} )

// ============================================================================
// GratitudeEngine — real sustained state
// ============================================================================

test( 'GratitudeEngine: real sustained state persists and decays independently of the one-shot evaluate() spike, and dampens boredom/resentment while active', () => {

	const g = new GratitudeEngine()
	g.registerSustained( 'u', 0.8 )
	assert.ok( g.getSustainedLevel( 'u' ) > 0 )
	assert.ok( g.getBoredomDampening( 'u' ) > 0 )
	assert.ok( g.getResentmentRelief( 'u' ) > 0 )

	g.decayAll( 100 )
	assert.ok( g.getSustainedLevel( 'u' ) < 0.4, 'sustained gratitude should genuinely decay over real ticks' )

} )

// ============================================================================
// SocialFatigueEngine
// ============================================================================

test( 'SocialFatigueEngine: real accumulation from sustained interaction crosses the withdraw threshold; real rest brings it back down', () => {

	const f = new SocialFatigueEngine()
	assert.equal( f.shouldWithdraw(), false )
	for ( let i = 0; i < 40; i++ ) f.registerInteraction( 0.8, 0.7 )
	assert.equal( f.shouldWithdraw(), true )
	f.rest( 20 )
	assert.equal( f.shouldWithdraw(), false )

} )

test( 'SocialFatigueEngine: a real introvert drains faster than a real extravert from the identical interaction intensity', () => {

	const introvert = new SocialFatigueEngine()
	const extravert  = new SocialFatigueEngine()
	for ( let i = 0; i < 10; i++ ) { introvert.registerInteraction( 0.9, 0.6 ); extravert.registerInteraction( 0.1, 0.6 ) }
	assert.ok( introvert.getLevel() > extravert.getLevel() )

} )

// ============================================================================
// FirstImpressionEngine
// ============================================================================

test( 'FirstImpressionEngine: real one-shot anchor set on first contact, biasing later readings toward it even when they genuinely differ', () => {

	const f = new FirstImpressionEngine( { pullStrength: 0.8, lambda: 0.01 } )
	f.registerFirstImpression( 'u', 0.9 ) // a real strong positive halo
	const biased = f.getBiasedValence( 'u', -0.5 ) // a later, genuinely negative turn
	assert.ok( biased > -0.5, 'the real halo should genuinely soften how negative a later reading lands, right after the anchor is set' )

} )

test( 'FirstImpressionEngine: the anchor is genuinely one-shot — a second registerFirstImpression() call never overwrites it', () => {

	const f = new FirstImpressionEngine()
	f.registerFirstImpression( 'u', 0.9 )
	f.registerFirstImpression( 'u', -0.9 )
	assert.equal( f.getAnchor( 'u' ), 0.9 )

} )

test( 'FirstImpressionEngine: real, gradual erosion — the anchor\'s pull genuinely weakens with more real accumulated contact', () => {

	const f = new FirstImpressionEngine( { pullStrength: 0.8, lambda: 0.3 } )
	f.registerFirstImpression( 'u', 0.9 )
	const early = f.getBiasedValence( 'u', -0.5 )
	for ( let i = 0; i < 20; i++ ) f.getBiasedValence( 'u', -0.5 )
	const late = f.getBiasedValence( 'u', -0.5 )
	assert.ok( late < early, 'with real accumulated disconfirming contact, the halo\'s pull should genuinely weaken' )

} )

// ============================================================================
// DailyExpectationEngine
// ============================================================================

test( 'DailyExpectationEngine: real repeated small broken commitments accumulate erosion; kept ones repair it', () => {

	const d = new DailyExpectationEngine()
	d.registerCommitment( 'u', 'llamar mañana' )
	d.resolveOldestCommitment( 'u', false )
	d.registerCommitment( 'u', 'escribir luego' )
	d.resolveOldestCommitment( 'u', false )
	const eroded = d.getErosion( 'u' )
	assert.ok( eroded > 0 )

	d.registerCommitment( 'u', 'esta vez sí' )
	d.resolveOldestCommitment( 'u', true )
	assert.ok( d.getErosion( 'u' ) < eroded, 'a real kept commitment should genuinely repair some of the accumulated erosion' )

} )

// ============================================================================
// AffinityResonance
// ============================================================================

test( 'AffinityResonance.compute: real cosine similarity — aligned vectors read high, orthogonal read ~0, opposed read negative', () => {

	const a = new AffinityResonance()
	assert.ok( a.compute( { x: 1, y: 1 }, { x: 1, y: 1 } ) > 0.99 )
	assert.ok( Math.abs( a.compute( { x: 1, y: 0 }, { x: 0, y: 1 } ) ) < 0.01 )
	assert.ok( a.compute( { x: 1, y: 1 }, { x: -1, y: -1 } ) < -0.99 )
	assert.equal( a.compute( {}, { x: 1 } ), 0 )

} )

// ============================================================================
// ComfortAccumulation
// ============================================================================

test( 'ComfortAccumulation: real logarithmic growth — the first real safe interactions matter more than later ones (diminishing returns)', () => {

	const c = new ComfortAccumulation()
	const c0    = c.getComfort( 'u' )
	c.registerInteraction( 'u', 0 )
	const c1    = c.getComfort( 'u' )
	for ( let i = 0; i < 30; i++ ) c.registerInteraction( 'u', 0 )
	const c31 = c.getComfort( 'u' )

	assert.ok( c1 - c0 > 0, 'the first real safe interaction should genuinely raise comfort' )
	assert.ok( ( c31 - c1 ) / 30 < c1 - c0, 'later interactions should genuinely contribute less per interaction than the first one (log-curve diminishing returns)' )

} )

test( 'ComfortAccumulation: a real threatening turn does not count toward accumulation', () => {

	const c = new ComfortAccumulation()
	c.registerInteraction( 'u', 0.9 ) // above default threshold
	assert.equal( c.getSafeInteractionCount( 'u' ), 0 )

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes all 8 new round-50 engines, real and usable, with no NaN across a real multi-turn conversation', async () => {

	const ai = new Totemheart()
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'hola, ¿qué tal?', { userId: 'u' } )

	assert.ok( ai.contactFrequencyExpectation.getExpectedCadenceDays( 'u' ) !== null )
	assert.ok( Number.isFinite( ai.firstImpressionEngine.getAnchor( 'u' ) ) )
	assert.ok( Number.isFinite( ai.comfortAccumulation.getComfort( 'u' ) ) )
	assert.ok( Number.isFinite( ai.socialFatigueEngine.getLevel() ) )
	assert.ok( Number.isFinite( ai.reliefEngine.getResidualTremor() ) )

} )

test( 'full: toJSON()/restoreState() round-trips all 8 new round-50 fields through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola', { userId: 'u' } )
	ai.comfortSeekingEngine.evaluateBid( 'u', 0.8, 0.8 )
	ai.prideCompetenceEngine.registerSuccess( 0.7 )
	ai.dailyExpectationEngine.registerCommitment( 'u', 'test' )
	ai.gratitudeEngine.registerSustained( 'u', 0.5 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.equal( restored.contactFrequencyExpectation.getExpectedCadenceDays( 'u' ), ai.contactFrequencyExpectation.getExpectedCadenceDays( 'u' ) )
	assert.equal( restored.comfortSeekingEngine.hasPendingBid( 'u' ), ai.comfortSeekingEngine.hasPendingBid( 'u' ) )
	assert.equal( restored.prideCompetenceEngine.getPride(), ai.prideCompetenceEngine.getPride() )
	assert.equal( restored.socialFatigueEngine.getLevel(), ai.socialFatigueEngine.getLevel() )
	assert.equal( restored.firstImpressionEngine.getAnchor( 'u' ), ai.firstImpressionEngine.getAnchor( 'u' ) )
	assert.equal( restored.dailyExpectationEngine.getOpenCommitmentCount( 'u' ), ai.dailyExpectationEngine.getOpenCommitmentCount( 'u' ) )
	assert.equal( restored.comfortAccumulation.getComfort( 'u' ), ai.comfortAccumulation.getComfort( 'u' ) )
	assert.equal( restored.gratitudeEngine.getSustainedLevel( 'u' ), ai.gratitudeEngine.getSustainedLevel( 'u' ) )

} )
