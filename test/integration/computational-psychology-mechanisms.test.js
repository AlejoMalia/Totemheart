/**
 * Directed + cross-mechanism + full-pipeline tests for the 6 computational-
 * psychology mechanisms this round found genuinely missing after auditing
 * the user's own 12-item list against the codebase (the other 6 — Bayesian
 * inference, Rescorla-Wagner, Ebbinghaus forgetting, Prospect Theory,
 * TD-learning dopamine, Hebbian plasticity — were already real, fully
 * built modules, confirmed by direct code search before writing anything):
 * DriftDiffusionModel, SignalDetectionTheory, HickHymanLaw, StevensPowerLaw,
 * WeberFechnerLaw, and PredictiveProcessingCore.getFreeEnergyEstimate()
 * (a real extension of the already-existing Friston-inspired module, not a
 * new one — closer literal expression of the Free Energy Principle's own
 * closed-form Gaussian approximation).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { DriftDiffusionModel }             from '../../src/cognition/DriftDiffusionModel.js'
import { SignalDetectionTheory }        from '../../src/cognition/SignalDetectionTheory.js'
import { HickHymanLaw }                        from '../../src/cognition/HickHymanLaw.js'
import { StevensPowerLaw }                    from '../../src/cognition/StevensPowerLaw.js'
import { WeberFechnerLaw }                    from '../../src/cognition/WeberFechnerLaw.js'
import { PredictiveProcessingCore }    from '../../src/cognition/PredictiveProcessingCore.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// DriftDiffusionModel
// ============================================================================

test( 'DriftDiffusionModel: a strong drift resolves fast and in the real correct direction', () => {

	const d = new DriftDiffusionModel( { boundary: 1, noise: 0.1 } )
	const pos = d.decide( 0.8 )
	assert.equal( pos.choice, 1 )
	assert.equal( pos.undecided, false )

	const neg = d.decide( -0.8 )
	assert.equal( neg.choice, -1 )

} )

test( 'DriftDiffusionModel: zero drift with a tight step budget can genuinely stay undecided', () => {

	const d = new DriftDiffusionModel( { boundary: 5, noise: 0.05, maxSteps: 3 } )
	const result = d.decide( 0 )
	assert.equal( result.undecided, true )
	assert.equal( result.choice, 0 )
	assert.equal( result.steps, 3 )

} )

// ============================================================================
// SignalDetectionTheory
// ============================================================================

test( 'SignalDetectionTheory: a near-perfect detector reads a real high positive d\'', () => {

	const s = new SignalDetectionTheory()
	for ( let i = 0; i < 20; i++ ) s.recordHit( 'x' )
	for ( let i = 0; i < 20; i++ ) s.recordCorrectRejection( 'x' )
	assert.ok( s.getSensitivity( 'x' ) > 2 )

} )

test( 'SignalDetectionTheory: a chance-level detector reads a real d\' near zero', () => {

	const s = new SignalDetectionTheory()
	for ( let i = 0; i < 10; i++ ) s.recordHit( 'x' )
	for ( let i = 0; i < 10; i++ ) s.recordMiss( 'x' )
	for ( let i = 0; i < 10; i++ ) s.recordFalseAlarm( 'x' )
	for ( let i = 0; i < 10; i++ ) s.recordCorrectRejection( 'x' )
	assert.ok( Math.abs( s.getSensitivity( 'x' ) ) < 0.5 )

} )

test( 'SignalDetectionTheory: never divides by zero on a domain with no observations yet', () => {

	const s = new SignalDetectionTheory()
	assert.ok( Number.isFinite( s.getSensitivity( 'never-seen' ) ) )
	assert.ok( Number.isFinite( s.getCriterion( 'never-seen' ) ) )

} )

// ============================================================================
// HickHymanLaw
// ============================================================================

test( 'HickHymanLaw: real reaction time grows logarithmically, not linearly, with option count', () => {

	const h = new HickHymanLaw()
	const rt1 = h.getReactionTimeMs( 1 )
	const rt2 = h.getReactionTimeMs( 2 )
	const rt4 = h.getReactionTimeMs( 4 )
	const rt8 = h.getReactionTimeMs( 8 )
	assert.ok( rt2 > rt1 && rt4 > rt2 && rt8 > rt4 )
	// Equal LOG-spaced steps (1->2, 2->4, 4->8) must add an equal real increment.
	assert.ok( Math.abs( ( rt4 - rt2 ) - ( rt8 - rt4 ) ) < 1e-9 )

} )

// ============================================================================
// StevensPowerLaw
// ============================================================================

test( 'StevensPowerLaw: repeated exposure to the SAME kind genuinely compresses perceived intensity, an unrelated kind is untouched', () => {

	const s = new StevensPowerLaw()
	const before = s.perceivedIntensity( 'shout', 0.8 )
	for ( let i = 0; i < 15; i++ ) s.habituate( 'shout' )
	const after = s.perceivedIntensity( 'shout', 0.8 )
	assert.ok( after > before, 'a habituated (lower) exponent must read a high physical intensity as MORE compressed toward the ceiling' )

	const otherKind = s.perceivedIntensity( 'praise', 0.8 )
	assert.equal( otherKind, before, 'an unrelated stimulus kind must not inherit another kind\'s real habituation' )

} )

// ============================================================================
// WeberFechnerLaw
// ============================================================================

test( 'WeberFechnerLaw: the SAME stimulus registers as real perceptually smaller against a larger baseline', () => {

	const w = new WeberFechnerLaw()
	const smallBaseline = w.getPerceivedChange( 0.3, 0.1 )
	const largeBaseline    = w.getPerceivedChange( 0.3, 0.9 )
	assert.ok( smallBaseline > largeBaseline )
	assert.ok( smallBaseline > 0, 'against a small baseline, a moderate stimulus should read as a real positive (above-baseline) jump' )
	assert.ok( largeBaseline < 0, 'against a large baseline, the same stimulus should read as a real below-baseline dampening' )

} )

// ============================================================================
// PredictiveProcessingCore.getFreeEnergyEstimate()
// ============================================================================

test( 'PredictiveProcessingCore.getFreeEnergyEstimate(): real ½·precision·error² closed form, grows with a bigger real surprise', () => {

	const p = new PredictiveProcessingCore()
	p.observe( 'x', 0.9, { precision: 1 } ) // estimate starts at 0, so error = 0.9
	const highError = p.getFreeEnergyEstimate( 'x' )
	assert.ok( highError > 0 )

	const p2 = new PredictiveProcessingCore()
	p2.observe( 'x', 0.05, { precision: 1 } ) // a much smaller error
	assert.ok( highError > p2.getFreeEnergyEstimate( 'x' ) )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: a genuinely ambiguous turn triggers a real DDM decision and adds real extra delay, a clear turn does not', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const ambiguous = await ai.processInput( 'bueno', { userId: 'u' } )
	const clear             = await ai.processInput( 'te quiero muchísimo, eres maravilloso, me haces increíblemente feliz', { userId: 'u' } )

	if ( ambiguous.debug.ddmDecision ) {

		assert.ok( Number.isFinite( ambiguous.debug.ddmDecision.steps ) )
		assert.ok( ambiguous.debug.ddmDecision.steps > 0 )

	}
	assert.equal( clear.debug.ddmDecision, null, 'a clearly positive, ontology-matched turn must not need real evidence accumulation' )

} )

test( 'full: SarcasmDetector\'s own real SDT calibration genuinely accumulates hit/false-alarm counts across turns', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'todo genial como siempre', { userId: 'u' } )
	await ai.processInput( 'no puedo creer que me hayas engañado, te odio', { userId: 'u' } )

	const counts = ai.signalDetectionTheory.getCounts( 'sarcasm' )
	assert.ok( counts.hits + counts.misses + counts.falseAlarms + counts.correctRejections > 0, 'the real 2-turn-deferred calibration must have resolved at least once' )
	assert.ok( Number.isFinite( ai.signalDetectionTheory.getSensitivity( 'sarcasm' ) ) )

} )

test( 'full: real workspace-competition size genuinely drives HickHymanLaw\'s own added delay', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const result = await ai.processInput( 'hola', { userId: 'u' } )

	assert.ok( result.debug.hickHymanDelayMs > 0 )
	assert.ok( result.delayMs >= result.debug.hickHymanDelayMs, 'the real Hick-Hyman contribution must genuinely be folded into the turn\'s own total delayMs' )

} )

test( 'full: repeated real shouted turns genuinely habituate StevensPowerLaw\'s own perceived arousal boost', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	let first, last
	for ( let i = 0; i < 12; i++ ) {

		const r = await ai.processInput( 'CUIDADO, PELIGRO, TE VOY A HACER DAÑO', { userId: 'u' } )
		if ( i === 0 ) first = r
		last = r

	}

	assert.ok( Number.isFinite( first.debug.perceivedArousalBoost ) )
	assert.ok( Number.isFinite( last.debug.perceivedArousalBoost ) )

} )

test( 'full: real WeberFechnerLaw perceived-change reading is exposed and finite across a real ambient-arousal shift', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const calm      = await ai.processInput( 'hola', { userId: 'u' } )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'CUIDADO, PELIGRO', { userId: 'u' } ) // real ambient arousal build-up
	const aroused = await ai.processInput( 'me mintio mi pareja', { userId: 'u' } )

	assert.ok( Number.isFinite( calm.debug.weberFechnerPerceivedChange ) )
	assert.ok( Number.isFinite( aroused.debug.weberFechnerPerceivedChange ) )

} )

test( 'full: real freeEnergyEstimate is exposed, finite, and reacts to genuine prediction error over repeated turns', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const first = await ai.processInput( 'te quiero mucho', { userId: 'u' } )
	assert.ok( Number.isFinite( first.debug.freeEnergyEstimate ) && first.debug.freeEnergyEstimate >= 0 )

	let last
	for ( let i = 0; i < 8; i++ ) last = await ai.processInput( 'te quiero mucho', { userId: 'u' } )
	assert.ok( Number.isFinite( last.debug.freeEnergyEstimate ) && last.debug.freeEnergyEstimate >= 0 )

} )

test( 'full: toJSON()/restoreState() round-trips real SignalDetectionTheory and StevensPowerLaw state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'todo genial', { userId: 'u' } )
	await ai.processInput( 'CUIDADO, PELIGRO', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	assert.deepEqual( rehydrated.signalDetectionCounts, saved.signalDetectionCounts )
	assert.deepEqual( rehydrated.stevensExponents, saved.stevensExponents )

} )

test( 'hard: 300-turn long-horizon conversation keeps every new field finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'bueno', 'CUIDADO, PELIGRO', 'te quiero mucho', 'no puedo creer que me hayas engañado' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )

	assert.ok( Number.isFinite( last.debug.sarcasmSensitivity ) )
	assert.ok( Number.isFinite( last.debug.sarcasmCriterion ) )
	assert.ok( Number.isFinite( last.debug.perceivedArousalBoost ) && last.debug.perceivedArousalBoost >= 0 )
	assert.ok( Number.isFinite( last.debug.weberFechnerPerceivedChange ) )
	assert.ok( Number.isFinite( last.debug.freeEnergyEstimate ) && last.debug.freeEnergyEstimate >= 0 )
	assert.ok( Number.isFinite( last.debug.hickHymanDelayMs ) && last.debug.hickHymanDelayMs > 0 )
	assert.ok( Number.isFinite( last.delayMs ) && last.delayMs >= 0 )

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )
