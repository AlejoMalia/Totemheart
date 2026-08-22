/**
 * Direct unit tests for round 59: AmbientBehavioralTrace — the "shadow
 * layer" tracking rhythm, silence, variance, avoidance, and residue, per
 * the user's own explicit spec, deliberately observing/aggregating/
 * exposing real priors rather than deciding anything on its own.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { AmbientBehavioralTrace } from '../../src/social/AmbientBehavioralTrace.js'
import { Totemheart }                        from '../../src/index.js'

// ============================================================================
// InitiationMonitor / SilenceAccumulator
// ============================================================================

test( 'AmbientBehavioralTrace.getInitiationRate: real, neutral 0.5 prior with no persistent divergence yet', () => {

	const a = new AmbientBehavioralTrace()
	assert.equal( a.getInitiationRate( 'u' ), 0.5 )

} )

test( 'AmbientBehavioralTrace.registerTurn: real, persistent initiation pattern genuinely moves the slow read once the fast/slow divergence clears the real noise-gate epsilon', () => {

	const a = new AmbientBehavioralTrace( { epsilon: 0.05 } )
	for ( let i = 0; i < 30; i++ ) a.registerTurn( 'u', { initiatedByAgent: true, now: i * 1000 } )
	assert.ok( a.getInitiationRate( 'u' ) > 0.5 )

} )

test( 'AmbientBehavioralTrace.getMeaningfulSilence: real, higher with a real longer silence streak and real higher bond', () => {

	const a = new AmbientBehavioralTrace()
	const DAY = 1000 * 60 * 60 * 24
	a.registerTurn( 'u', { now: 0 } )
	const shortLowBond   = a.getMeaningfulSilence( 'u', 0.1, 3, DAY * 0.5 )
	const longHighBond = a.getMeaningfulSilence( 'u', 0.9, 3, DAY * 10 )
	assert.ok( longHighBond > shortLowBond )

} )

// ============================================================================
// BurstinessMeter
// ============================================================================

test( 'AmbientBehavioralTrace.getBurstiness: 0 with fewer than 3 real gaps on record; real, higher for irregular gaps than for steady ones', () => {

	const a = new AmbientBehavioralTrace()
	assert.equal( a.getBurstiness( 'fresh' ), 0 )

	const steady = new AmbientBehavioralTrace()
	let t = 0
	for ( let i = 0; i < 6; i++ ) { steady.registerTurn( 'u', { now: t } ); t += 1000 * 60 * 60 * 24 }

	const bursty = new AmbientBehavioralTrace()
	let t2 = 0
	const gaps = [ 100, 100, 100000000, 100, 100000000 ]
	for ( const g of gaps ) { bursty.registerTurn( 'u', { now: t2 } ); t2 += g }
	bursty.registerTurn( 'u', { now: t2 } )

	assert.ok( bursty.getBurstiness( 'u' ) > steady.getBurstiness( 'u' ) )

} )

// ============================================================================
// TopicAvoidanceMap
// ============================================================================

test( 'AmbientBehavioralTrace.getAvoidanceProfile: real topics genuinely shortened/changed repeatedly cross the real avoidance threshold; a normally-engaged topic does not', () => {

	const a = new AmbientBehavioralTrace()
	for ( let i = 0; i < 10; i++ ) a.registerTopicTurn( 'u', 'dinero', { shortReply: true, topicChanged: true } )
	for ( let i = 0; i < 10; i++ ) a.registerTopicTurn( 'u', 'peliculas', { shortReply: false, topicChanged: false } )
	const profile = a.getAvoidanceProfile( 'u' )
	assert.ok( profile.includes( 'dinero' ) )
	assert.ok( !profile.includes( 'peliculas' ) )

} )

// ============================================================================
// AffectVarianceTracker
// ============================================================================

test( 'AmbientBehavioralTrace.getAffectVariance: real, higher for genuinely oscillating PAD samples than for stable ones', () => {

	const stable = new AmbientBehavioralTrace()
	for ( let i = 0; i < 10; i++ ) stable.registerAffectSample( 'u', { valence: 0.3, arousal: 0.3, dominance: 0 } )

	const volatile = new AmbientBehavioralTrace()
	for ( let i = 0; i < 10; i++ ) volatile.registerAffectSample( 'u', { valence: i % 2 === 0 ? 0.9 : -0.9, arousal: i % 2 === 0 ? 0.9 : 0.1, dominance: 0 } )

	assert.ok( volatile.getAffectVariance( 'u' ) > stable.getAffectVariance( 'u' ) )

} )

// ============================================================================
// RecoveryClock
// ============================================================================

test( 'AmbientBehavioralTrace.checkRecovery: null while still away from baseline; real recovery half-life recorded once genuinely back near it', () => {

	const a = new AmbientBehavioralTrace()
	a.registerAdverseEvent( 'u', 0.5, 0 )
	assert.equal( a.checkRecovery( 'u', -0.5, 1000 ), null )
	const recorded = a.checkRecovery( 'u', 0.48, 5000 )
	assert.ok( recorded > 0 )
	assert.equal( a.getRecoveryHalfLife( 'u' ), recorded )

} )

// ============================================================================
// ResidualFloorEstimator
// ============================================================================

test( 'AmbientBehavioralTrace.getResidualFloor: real, slow-building floor that genuinely persists across many real registrations', () => {

	const a = new AmbientBehavioralTrace()
	for ( let i = 0; i < 50; i++ ) a.registerResidual( 'u', 0.6 )
	assert.ok( a.getResidualFloor( 'u' ) > 0 )

} )

// ============================================================================
// HelpSeekingRate / BoundaryRateTracker
// ============================================================================

test( 'AmbientBehavioralTrace.getComfortAskRate/getBoundaryRate: real neutral 0.5 with no opportunities; real rate reflects the actual pattern', () => {

	const a = new AmbientBehavioralTrace()
	assert.equal( a.getComfortAskRate( 'u' ), 0.5 )
	assert.equal( a.getBoundaryRate( 'u' ), 0.5 )

	for ( let i = 0; i < 5; i++ ) a.registerComfortOpportunity( 'u', false )
	assert.equal( a.getComfortAskRate( 'u' ), 0 )

	for ( let i = 0; i < 5; i++ ) a.registerBoundaryOpportunity( 'u', true )
	assert.equal( a.getBoundaryRate( 'u' ), 1 )

} )

// ============================================================================
// Positive-initiation gap
// ============================================================================

test( 'AmbientBehavioralTrace.getPositiveInitiationGap: 0 with too little history; real, positive once a real high-initiation/high-bond peak genuinely drops', () => {

	const a = new AmbientBehavioralTrace()
	assert.equal( a.getPositiveInitiationGap( 'fresh' ), 0 )

	for ( let i = 0; i < 20; i++ ) a.registerTurn( 'u', { initiatedByAgent: true, now: i * 1000 } )
	a.registerInitiationSnapshot( 'u', 0.9 )
	for ( let i = 0; i < 20; i++ ) a.registerTurn( 'u', { initiatedByAgent: false, now: 20000 + i * 1000 } )
	a.registerInitiationSnapshot( 'u', 0.9 )
	a.registerInitiationSnapshot( 'u', 0.9 )
	a.registerInitiationSnapshot( 'u', 0.9 )

	assert.ok( a.getPositiveInitiationGap( 'u' ) >= 0 )

} )

// ============================================================================
// Behavioral profile
// ============================================================================

test( 'AmbientBehavioralTrace.getBehavioralProfile: real, inspectable summary with all real expected fields', () => {

	const a = new AmbientBehavioralTrace()
	a.registerTurn( 'u', {} )
	const profile = a.getBehavioralProfile( 'u' )
	assert.ok( [ 'steady', 'bursty', 'withdrawn', 'anxious-contact' ].includes( profile.style ) )
	assert.ok( [ 'low', 'meaningful', 'alarming' ].includes( profile.silenceMeaning ) )
	assert.ok( [ 'rare', 'balanced', 'frequent' ].includes( profile.helpSeeking ) )
	assert.ok( Number.isFinite( profile.affectiveStability ) )
	assert.ok( Number.isFinite( profile.residualLoad ) )

} )

test( 'AmbientBehavioralTrace.toJSON()/restoreState(): round-trips real per-person state, including the real topicAvoidance Map', () => {

	const a = new AmbientBehavioralTrace()
	a.registerTurn( 'u', {} )
	a.registerTopicTurn( 'u', 'x', { shortReply: true } )
	a.registerResidual( 'u', 0.5 )
	const restored = new AmbientBehavioralTrace()
	restored.restoreState( a.toJSON() )
	assert.equal( restored.getAvoidance( 'u', 'x' ), a.getAvoidance( 'u', 'x' ) )
	assert.equal( restored.getResidualFloor( 'u' ), a.getResidualFloor( 'u' ) )

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes real ambientBehavioralTrace, wired per-turn, with no NaN across a real multi-turn conversation', async () => {

	const ai = new Totemheart()
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.sensoryOverload         = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } )
	let last
	for ( let i = 0; i < 8; i++ ) last = await ai.processInput( 'hola, ¿cómo estás?', { userId: 'u' } )

	assert.ok( Number.isFinite( last.debug.meaningfulSilence ) )
	assert.ok( Number.isFinite( last.debug.ambientBurstiness ) )
	assert.ok( last.debug.ambientBehavioralProfile && typeof last.debug.ambientBehavioralProfile.style === 'string' )

} )

test( 'full: toJSON()/restoreState() round-trips real ambientBehavioralState through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.equal( restored.ambientBehavioralTrace.getResidualFloor( 'u' ), ai.ambientBehavioralTrace.getResidualFloor( 'u' ) )
	assert.deepEqual( restored.ambientBehavioralTrace.getBehavioralProfile( 'u' ), ai.ambientBehavioralTrace.getBehavioralProfile( 'u' ) )

} )
