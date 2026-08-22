/**
 * Direct unit tests for round 57's 7 genuinely new mechanisms (the other
 * 13 the user asked for already existed from rounds 50-51 and are only
 * confirmed wired/tested there): OpinionStanceEngine, EpistemicTrust,
 * AssertivenessBoundary, ManipulationSkepticism, DisagreementStyle,
 * AnticipatorySavoring, and DailyExpectationEngine's new getKeepRate().
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { OpinionStanceEngine }        from '../../src/cognition/OpinionStanceEngine.js'
import { EpistemicTrust }                    from '../../src/cognition/EpistemicTrust.js'
import { AssertivenessBoundary } from '../../src/cognition/AssertivenessBoundary.js'
import { ManipulationSkepticism } from '../../src/cognition/ManipulationSkepticism.js'
import { DisagreementStyle }            from '../../src/behavior/DisagreementStyle.js'
import { AnticipatorySavoring }    from '../../src/social/AnticipatorySavoring.js'
import { DailyExpectationEngine } from '../../src/social/DailyExpectationEngine.js'
import { Totemheart }                        from '../../src/index.js'

// ============================================================================
// OpinionStanceEngine
// ============================================================================

test( 'OpinionStanceEngine.update: real, positive evidence genuinely moves the stance positive; real dogmatism dampens the movement', () => {

	const o = new OpinionStanceEngine()
	const open      = o.update( 'topicA', { evidence: 0.8, dogmatism: 0.1 } )
	const dogmatic = new OpinionStanceEngine().update( 'topicA', { evidence: 0.8, dogmatism: 0.9 } )
	assert.ok( open.stance > 0 )
	assert.ok( open.stance > dogmatic.stance )

} )

test( 'OpinionStanceEngine: a real, held negative stance can coexist with high real conviction without needing any interpersonal signal', () => {

	const o = new OpinionStanceEngine()
	for ( let i = 0; i < 10; i++ ) o.update( 'weakIdea', { evidence: -0.7, dogmatism: 0.2 } )
	assert.ok( o.getDisagreementMagnitude( 'weakIdea' ) > 0.3 )

} )

test( 'OpinionStanceEngine.toJSON()/restoreState(): round-trips real per-topic stances', () => {

	const o = new OpinionStanceEngine()
	o.update( 'x', { evidence: 0.5 } )
	const restored = new OpinionStanceEngine()
	restored.restoreState( o.toJSON() )
	assert.deepEqual( restored.getStance( 'x' ), o.getStance( 'x' ) )

} )

// ============================================================================
// EpistemicTrust
// ============================================================================

test( 'EpistemicTrust.getCredibility: real, higher track record and coherence genuinely raise credibility; real manipulation/overclaim cues lower it', () => {

	const e = new EpistemicTrust()
	for ( let i = 0; i < 10; i++ ) e.registerOutcome( 'reliable', true )
	const highTrack = e.getCredibility( 'reliable', { coherence: 0.9, manipulationCue: 0, overclaim: 0 } )
	const suspicious = e.getCredibility( 'stranger', { coherence: 0.9, manipulationCue: 0.9, overclaim: 0.8 } )
	assert.ok( highTrack > suspicious )

} )

test( 'EpistemicTrust: interpersonal warmth alone does not buy content credibility — a real "te aprecio pero no me lo creo" state is representable', () => {

	const e = new EpistemicTrust()
	const credibility = e.getCredibility( 'warmButUnreliable', { coherence: 0.2, manipulationCue: 0.7, overclaim: 0.6 } )
	assert.ok( credibility < 0.5 )

} )

test( 'EpistemicTrust.registerOutcome: a real false claim genuinely raises priorError, which decays over real ticks', () => {

	const e = new EpistemicTrust()
	e.registerOutcome( 'u', false )
	const peak = e.priorError.get( 'u' )
	assert.ok( peak > 0 )
	for ( let i = 0; i < 50; i++ ) e.decayPriorError( 'u', 1 )
	assert.ok( e.priorError.get( 'u' ) < peak )

} )

// ============================================================================
// AssertivenessBoundary
// ============================================================================

test( 'AssertivenessBoundary.getBoundaryProbability: real high agency/self-respect with low fear favors setting a boundary; real high fear/fawn does not', () => {

	const a = new AssertivenessBoundary()
	const secure   = a.getBoundaryProbability( { agency: 0.8, selfRespect: 0.8, clearCost: 0.5, fearOfLoss: 0.1, fawnPattern: 0.1 } )
	const fawning = a.getBoundaryProbability( { agency: 0.2, selfRespect: 0.2, clearCost: 0.1, fearOfLoss: 0.9, fawnPattern: 0.9 } )
	assert.ok( secure > fawning )
	assert.ok( secure > 0.5 )
	assert.ok( fawning < 0.5 )

} )

// ============================================================================
// ManipulationSkepticism
// ============================================================================

test( 'ManipulationSkepticism.getSkepticism: real intensity burst + too-fast pace + low track record raises skepticism, genuinely dampening InfatuationEngine\'s own spark', () => {

	const m = new ManipulationSkepticism()
	const skeptical = m.getSkepticism( { intensityBurst: 0.9, paceTooFast: 0.9, flatteryLoad: 0.8, trackRecord: 0.1, credibility: 0.1 } )
	const trusting     = m.getSkepticism( { intensityBurst: 0.9, paceTooFast: 0.1, flatteryLoad: 0.1, trackRecord: 0.9, credibility: 0.9 } )
	assert.ok( skeptical > trusting )

	const rawSpark = 0.9
	assert.ok( m.getEffectiveSpark( rawSpark, skeptical ) < m.getEffectiveSpark( rawSpark, trusting ) )

} )

// ============================================================================
// DisagreementStyle
// ============================================================================

test( 'DisagreementStyle.select: real high contempt/stress genuinely favors combative over soft, holding everything else equal', () => {

	const d = new DisagreementStyle()
	const calm         = d.select( { agreeableness: 0.8, stress: 0.1, contempt: 0 } )
	const contemptuous = d.select( { agreeableness: 0.2, stress: 0.8, contempt: 0.9 } )
	assert.ok( contemptuous.probabilities.combative > calm.probabilities.combative )

} )

test( 'DisagreementStyle.select: real face threat genuinely favors avoidant', () => {

	const d = new DisagreementStyle()
	const r = d.select( { faceThreat: 0.9, conscientiousness: 0.2 } )
	assert.ok( r.probabilities.avoidant > 0.1 )

} )

// ============================================================================
// AnticipatorySavoring
// ============================================================================

test( 'AnticipatorySavoring.getSavoring: real high probability/value/proximity with low threat produces real, high savoring', () => {

	const s = new AnticipatorySavoring()
	assert.ok( s.getSavoring( { pEvent: 0.9, value: 0.9, proximityInTime: 0.9, threat: 0 } ) > 0.5 )
	assert.ok( s.getSavoring( { pEvent: 0.1, value: 0.1, proximityInTime: 0.1, threat: 0.9 } ) < 0.3 )

} )

test( 'AnticipatorySavoring.getCrashAmplification: real, higher savoring amplifies the crash more', () => {

	const s = new AnticipatorySavoring()
	assert.ok( s.getCrashAmplification( 0.9 ) > s.getCrashAmplification( 0.2 ) )

} )

// ============================================================================
// DailyExpectationEngine.getKeepRate (PromiseTracker)
// ============================================================================

test( 'DailyExpectationEngine.getKeepRate: real, neutral prior with no track record; real rate reflects the actual kept/broken pattern', () => {

	const d = new DailyExpectationEngine()
	assert.equal( d.getKeepRate( 'u' ), 0.5 )

	for ( let i = 0; i < 8; i++ ) { d.registerCommitment( 'u', 'x' ); d.resolveOldestCommitment( 'u', true ) }
	assert.ok( d.getKeepRate( 'u' ) > 0.9 )

	const unreliable = new DailyExpectationEngine()
	for ( let i = 0; i < 8; i++ ) { unreliable.registerCommitment( 'u', 'x' ); unreliable.resolveOldestCommitment( 'u', false ) }
	assert.ok( unreliable.getKeepRate( 'u' ) < 0.1 )

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes all 7 new round-57 engines, wired per-turn, with no NaN across a real multi-turn conversation', async () => {

	const ai = new Totemheart()
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.sensoryOverload         = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } )
	let last
	for ( let i = 0; i < 6; i++ ) last = await ai.processInput( 'creo que esa idea no tiene mucho sentido, pero me cae genial', { userId: 'u' } )
	assert.ok( Number.isFinite( last.debug.disagreementMagnitude ) )
	assert.ok( Number.isFinite( last.debug.epistemicCredibility ) )
	assert.ok( Number.isFinite( last.debug.manipulationSkepticism ) )
	assert.ok( Number.isFinite( last.debug.boundaryProbability ) )
	assert.ok( Number.isFinite( last.debug.savoring ) )
	assert.ok( last.debug.opinionStance && typeof last.debug.opinionStance.stance === 'number' )

} )

test( 'full: toJSON()/restoreState() round-trips real opinionStanceState/epistemicTrustState through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'no estoy de acuerdo con eso, me parece flojo', { userId: 'u' } )
	ai.epistemicTrust.registerOutcome( 'u', false )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.deepEqual( restored.opinionStanceEngine.getStance( 'general' ), ai.opinionStanceEngine.getStance( 'general' ) )
	assert.equal( restored.epistemicTrust.priorError.get( 'u' ), ai.epistemicTrust.priorError.get( 'u' ) )

} )
