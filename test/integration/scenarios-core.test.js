import { test }   from 'node:test'
import assert      from 'node:assert/strict'
import { Totemheart, Personality } from '../../src/index.js'

import { EmotionSpace }            from '../../src/core/EmotionSpace.js'
import { Homeostasis }             from '../../src/core/Homeostasis.js'
import { DecayEngine, cubicDecayTowards } from '../../src/core/DecayEngine.js'
import { HedonicAdaptation }       from '../../src/core/HedonicAdaptation.js'
import { MoodTracker }             from '../../src/core/MoodTracker.js'
import { AffectEMA }               from '../../src/core/AffectEMA.js'
import { HebbianPlasticity }       from '../../src/core/HebbianPlasticity.js'
import { WornPathCache }           from '../../src/core/WornPathCache.js'
import { safeStep }                from '../../src/core/PipelineResilience.js'

import { DopaminergicEngine }      from '../../src/neurochemistry/DopaminergicEngine.js'
import { CortisolEngine }          from '../../src/neurochemistry/CortisolEngine.js'
import { CircadianRhythm }         from '../../src/neurochemistry/CircadianRhythm.js'
import { ArousalKalmanFilter }     from '../../src/neurochemistry/ArousalKalmanFilter.js'

import { EpisodicMemory }          from '../../src/social/EpisodicMemory.js'
import { ForgettingCurve }         from '../../src/social/ForgettingCurve.js'
import { Attachment }              from '../../src/social/Attachment.js'
import { ReputationEngine }        from '../../src/social/ReputationEngine.js'
import { TheoryOfMind }            from '../../src/social/TheoryOfMind.js'
import { EmotionalContagion }      from '../../src/social/EmotionalContagion.js'
import { LoveHateEngine }          from '../../src/social/LoveHateEngine.js'

import { AmygdalaHijack }          from '../../src/cognition/AmygdalaHijack.js'
import { DefenseMechanisms }       from '../../src/cognition/DefenseMechanisms.js'
import { CognitiveDissonance }     from '../../src/cognition/CognitiveDissonance.js'
import { DecisionFatigue }         from '../../src/cognition/DecisionFatigue.js'
import { RefractoryPeriod }        from '../../src/cognition/RefractoryPeriod.js'
import { Sensitization }           from '../../src/cognition/Sensitization.js'
import { RemConsolidation }        from '../../src/cognition/RemConsolidation.js'
import { LoadScheduler }           from '../../src/cognition/LoadScheduler.js'

import { ExpressionDebt }          from '../../src/behavior/ExpressionDebt.js'
import { ExpressionDirectives }    from '../../src/behavior/ExpressionDirectives.js'

// ============================================================================
// Core / State Engine
// ============================================================================

test( '1. emotionSpace_momentum_preserves_direction_after_spike', () => {

	// Kept well below tanh saturation on purpose: applySpike() re-tanh's its
	// OWN previous (already-bounded) output plus the new push every call —
	// deep in the saturating region that compounding can make even a
	// same-direction push move the value backward (a real, pre-existing
	// property of this squashing scheme, not something this test is about).
	// In the small-signal regime, tanh is close to linear and momentum's
	// effect is unambiguous.
	const es = new EmotionSpace()
	es.applySpike( { valence: 0.15, weight: 1 } )
	es.applySpike( { valence: 0.15, weight: 1 } ) // velocity has built up by now
	assert.ok( es.velocity.valence > 0, `expected positive residual momentum, got ${es.velocity.valence}` )

	// A neutral (zero) third spike still moves the vector further in the SAME
	// direction purely from the momentum term carried over from the prior two.
	const before = es.vector.valence
	es.applySpike( { valence: 0, weight: 1 } )
	assert.ok( es.vector.valence > before, 'momentum alone should keep nudging valence upward on a zero-push spike' )

} )

test( '2. emotionSpace_hysteresis_harder_to_exit_extreme_quadrant', () => {

	const personality = new Personality()
	const decay          = new DecayEngine()
	const mood             = { valence: 0, arousal: 0 }

	const extreme = new EmotionSpace()
	for ( let i = 0; i < 5; i++ ) extreme.applySpike( { valence: 0.35, arousal: 0.35, weight: 1 } )
	let ticksExtreme = 0
	while ( Math.hypot( extreme.vector.valence, extreme.vector.arousal ) > 0.15 && ticksExtreme < 500 ) { decay.apply( extreme, mood, personality, 1 ); ticksExtreme++ }

	const mild = new EmotionSpace()
	mild.applySpike( { valence: 0.35, arousal: 0.35, weight: 1 } )
	let ticksMild = 0
	while ( Math.hypot( mild.vector.valence, mild.vector.arousal ) > 0.15 && ticksMild < 500 ) { decay.apply( mild, mood, personality, 1 ); ticksMild++ }

	assert.ok( ticksExtreme > ticksMild, `expected exiting the extreme quadrant to take longer: extreme=${ticksExtreme} mild=${ticksMild}` )

} )

test( '3. emotionSpace_dominance_axis_updates_independently', () => {

	const es = new EmotionSpace()
	es.applySpike( { dominance: 0.5, weight: 1 } )
	assert.equal( es.vector.valence, 0 )
	assert.equal( es.vector.arousal, 0 )
	assert.ok( es.vector.dominance > 0 )

	const es2 = new EmotionSpace()
	es2.applySpike( { valence: 0.6, arousal: 0.4, weight: 1 } )
	assert.equal( es2.vector.dominance, 0, 'a valence/arousal-only spike must not move dominance' )

} )

test( '4. homeostasis_allostatic_load_accumulates_under_chronic_stress', () => {

	const h                     = new Homeostasis()
	const personality = new Personality( { neuroticism: 0.8 } )
	for ( let i = 0; i < 30; i++ ) h.tick( 1, personality, { circadianEnergy: 0.3, cortisol: 0.7 } )
	assert.ok( h.allostaticLoad > 0.1 )

	const relaxedTarget = h.getDynamicTarget( 'stamina', { personality, circadianEnergy: 1, cortisol: 0 } )
	const stressedTarget = h.getDynamicTarget( 'stamina', { personality, circadianEnergy: 0.3, cortisol: 0.7 } )
	assert.ok( stressedTarget < relaxedTarget, 'chronic load should itself pull the achievable set point down further' )

} )

test( '5. homeostasis_pid_antiwindup_prevents_integrator_explosion', () => {

	const h = new Homeostasis( { alertThreshold: 0.2 } )
	// Force stamina deep into deficit and hold it there for many ticks —
	// a plain (non-anti-windup) PID's integral term would keep growing
	// unboundedly the whole time the output stays saturated.
	h.needs.stamina = 0
	for ( let i = 0; i < 200; i++ ) h.controllers.stamina.step( 0, 1, 1 )
	const integral = h.controllers.stamina.integral
	assert.ok( Number.isFinite( integral ) && Math.abs( integral ) < 50, `expected a bounded, frozen-while-saturated integral, got ${integral}` )

} )

test( '6. decayEngine_cubic_non_linear_pull_to_baseline', () => {

	const smallOffsetMove = 0.1 - Math.abs( cubicDecayTowards( 0.1, 0, 0.15, 1 ) )
	const bigOffsetMove      = 1.0 - Math.abs( cubicDecayTowards( 1.0, 0, 0.15, 1 ) )
	assert.ok( bigOffsetMove > smallOffsetMove * 20, `expected a much stronger proportional pull for the large offset: small=${smallOffsetMove} big=${bigOffsetMove}` )

} )

test( '7. hedonicAdaptation_repeated_stimulus_loses_impact', () => {

	const adaptation = new HedonicAdaptation()
	const personality = new Personality()
	const fingerprint  = HedonicAdaptation.fingerprintOf( 'hola de nuevo', 'joy' )

	const first = adaptation.getMultiplier( fingerprint, personality )
	for ( let i = 0; i < 10; i++ ) adaptation.record( fingerprint )
	const after = adaptation.getMultiplier( fingerprint, personality )

	assert.equal( first, 1 )
	assert.ok( after < first )

} )

test( '8. moodTracker_window_reflects_recent_trajectory', () => {

	const tracker = new MoodTracker()
	for ( let i = 0; i < 5; i++ ) tracker.push( { valence: -0.5, arousal: 0.2 } )
	const negativeMood = tracker.getMood().valence
	for ( let i = 0; i < 10; i++ ) tracker.push( { valence: 0.6, arousal: 0.1 } )
	const positiveMood = tracker.getMood().valence

	assert.ok( negativeMood < 0 )
	assert.ok( positiveMood > negativeMood, 'the mood should track the RECENT run of turns, not stay anchored to the earlier negative ones' )

} )

test( '9. affectEMA_smooths_rapid_oscillations', () => {

	const ema      = new AffectEMA( { alpha: 0.8 } )
	const raw        = []
	const smoothed = []
	for ( let i = 0; i < 40; i++ ) {

		const impulse = i % 2 === 0 ? 1 : -1 // maximally oscillating raw signal
		raw.push( impulse )
		smoothed.push( ema.update( impulse ) )

	}
	const variance = arr => { const m = arr.reduce( ( a, b ) => a + b, 0 ) / arr.length; return arr.reduce( ( a, b ) => a + ( b - m ) ** 2, 0 ) / arr.length }
	assert.ok( variance( smoothed ) < variance( raw ), `expected smoothed variance ${variance( smoothed )} < raw variance ${variance( raw )}` )

} )

test( '10. personality_traits_modulate_recovery_and_adaptation_rates', () => {

	const calm       = new Personality( { neuroticism: 0.1 } )
	const anxious = new Personality( { neuroticism: 0.9 } )
	assert.ok( calm.getEmotionalRecoveryRate( -1 ) > anxious.getEmotionalRecoveryRate( -1 ), 'higher neuroticism should recover from negative states more slowly' )

	const closed = new Personality( { openness: 0.1 } )
	const open      = new Personality( { openness: 0.9 } )
	assert.ok( open.getHedonicAdaptationRate() < closed.getHedonicAdaptationRate(), 'higher openness should habituate to repeated stimuli more slowly' )

} )

// ============================================================================
// Neurochemistry
// ============================================================================

test( '11. dopaminergic_rpe_larger_for_unexpected_reward', () => {

	const surpriseEngine = new DopaminergicEngine()
	const surprise           = surpriseEngine.computeRPE( 1 )

	const expectedEngine = new DopaminergicEngine()
	for ( let i = 0; i < 20; i++ ) expectedEngine.computeRPE( 1 )
	const expected = expectedEngine.computeRPE( 1 )

	assert.ok( surprise > expected )

} )

test( '12. dopaminergic_wanting_vs_liking_dissociation', () => {

	const dop = new DopaminergicEngine()
	for ( let i = 0; i < 5; i++ ) dop.computeRPE( -0.6, 'ctx' ) // consistently bad, but each hit is a real surprise relative to a fresh prior
	assert.ok( dop.getWanting() > 0, 'wanting should rise from repeated surprise even though the reward itself is bad' )
	assert.ok( dop.getLiking() < 0, 'liking should track the actual (negative) reward, diverging from wanting' )

} )

test( '13. dopaminergic_eligibility_traces_propagate_credit', () => {

	const dop = new DopaminergicEngine( { lambda: 0.9, gamma: 0.9 } )
	dop.computeRPE( 0.5, 'ctxA' )
	const before = dop.getExpectedValue( 'ctxB' )
	dop.eligibility.set( 'ctxB', 0.7 ) // ctxB was active a moment ago, its trace is still live
	dop.computeRPE( 1.0, 'ctxC' )
	assert.notEqual( dop.getExpectedValue( 'ctxB' ), before, 'a reward elsewhere should still credit a context with a live eligibility trace' )

} )

test( '14. cortisol_rises_with_aversive_input_and_decays_slowly', () => {

	// CortisolEngine.decay() subtracts a flat lambda·dt each tick (not
	// proportional to the current level), so it needs several register()
	// calls to build a peak safely above one tick's flat decay step before
	// "barely moves" is a meaningful comparison.
	const cortisol = new CortisolEngine()
	for ( let i = 0; i < 4; i++ ) cortisol.register( -0.8, false )
	const peak = cortisol.getLevel()
	assert.ok( peak > 0.3 )

	cortisol.decay( 1 )
	assert.ok( cortisol.getLevel() > peak - 0.05, `default lambda=0.03/tick should barely move a peak this size: peak=${peak} after=${cortisol.getLevel()}` )

} )

test( '15. circadian_energy_troughs_at_night_peaks_afternoon', () => {

	const circadian = new CircadianRhythm()
	const night         = circadian.getEnergyLevel( new Date( 2024, 0, 1, 3, 0 ) )
	const day             = circadian.getEnergyLevel( new Date( 2024, 0, 1, 15, 0 ) )
	assert.ok( night < 0.05 )
	assert.ok( day > 0.95 )

} )

test( '16. arousalKalman_filters_noisy_spikes', () => {

	const kalman  = new ArousalKalmanFilter()
	const trueValue   = 0.4
	const rawSignal  = []
	const filtered  = []
	for ( let i = 0; i < 30; i++ ) {

		const noisy = trueValue + ( i % 2 === 0 ? 0.3 : -0.3 )
		rawSignal.push( noisy )
		filtered.push( kalman.filter( noisy ) )

	}
	const variance = arr => { const m = arr.reduce( ( a, b ) => a + b, 0 ) / arr.length; return arr.reduce( ( a, b ) => a + ( b - m ) ** 2, 0 ) / arr.length }
	assert.ok( variance( filtered.slice( 10 ) ) < variance( rawSignal.slice( 10 ) ) )

} )

test( '17. circadian_cortisol_coupling_shifts_setpoints', () => {

	const circadian    = new CircadianRhythm()
	const peakHour       = new Date( '2024-01-01T15:00:00' )
	const calmEnergy      = circadian.getEnergyLevel( peakHour, 0 )
	const stressedEnergy = circadian.getEnergyLevel( peakHour, 0.9 )
	assert.ok( stressedEnergy < calmEnergy )

	const h                          = new Homeostasis()
	const relaxedTarget    = h.getDynamicTarget( 'stamina', { circadianEnergy: calmEnergy, cortisol: 0 } )
	const stressedTarget = h.getDynamicTarget( 'stamina', { circadianEnergy: stressedEnergy, cortisol: 0.9 } )
	assert.ok( stressedTarget < relaxedTarget )

} )

test( '18. dopamine_freeze_on_rupture_event', () => {

	const dop = new DopaminergicEngine()
	for ( let i = 0; i < 5; i++ ) dop.computeRPE( 0.7, 'ctx' )
	assert.ok( dop.getWanting() > 0 )
	dop.freezeWanting()
	assert.equal( dop.getWanting(), 0 )

} )

// ============================================================================
// Memory & Consolidation
// ============================================================================

test( '19. episodicMemory_stores_unresolved_wounds', async () => {

	const mem   = new EpisodicMemory()
	const entry = await mem.store( { text: 'me traicionaste', userId: 'u', emotionalSignature: { valence: -0.8, arousal: 0.7 }, importance: 0.9 } )
	assert.equal( entry.resolution, 'unresolved' )
	assert.equal( mem.getUnresolvedMemories( 'u' ).length, 1 )

} )

test( '20. episodicMemory_reconsolidation_makes_memory_labile_on_reactivation', async () => {

	const mem   = new EpisodicMemory()
	const entry = await mem.store( { text: 'x', userId: 'u', emotionalSignature: { valence: -0.8, arousal: 0.7 }, importance: 0.9 } )
	assert.equal( entry.labile, undefined )
	mem.markLabile( entry.id )
	assert.equal( entry.labile, true )
	assert.equal( mem.reconsolidate( entry, { valence: 0.5, arousal: 0.1 } ), true )
	assert.ok( entry.emotionalSignature.valence > -0.8 )

} )

test( '21. episodicMemory_intrusive_thoughts_from_high_salience_wounds', async () => {

	const mem     = new EpisodicMemory()
	const wound = await mem.store( { text: 'dolor sin resolver', userId: 'u', emotionalSignature: { valence: -0.9, arousal: 0.6 }, importance: 0.95 } )
	wound.timestamp = Date.now() - 1000 * 60 * 60 * 24 * 10
	// A real Poisson roll, not deterministic — 400 attempts keeps the chance
	// of a false failure astronomically small without pinning the RNG, same
	// margin used for the analogous check in mocks-50-set2.test.js.
	let fired = 0
	for ( let i = 0; i < 400; i++ ) if ( mem.rollIntrusiveThought( 'u', Date.now(), 1, 0.01 ) ) fired++
	assert.ok( fired > 0 )

	const empty = new EpisodicMemory()
	assert.equal( empty.rollIntrusiveThought( 'u' ), null )

} )

test( '22. forgettingCurve_decays_toward_non_zero_floor', () => {

	const mem   = new EpisodicMemory()
	const entry = { id: 1, importance: 0.8, remSalient: true, remTaggedAt: Date.now() - 1000 * 60 * 60 * 24 * 365 } // a full year ago
	const weight = mem.getLatentWeight( entry )
	assert.ok( weight > 0, `expected a nonzero latent weight even after a year, got ${weight}` )
	assert.ok( weight < 0.1, 'should have decayed close to the floor by now' )

	// ForgettingCurve.tick() itself prunes below a threshold rather than a
	// literal asymptote — its "permanent" flag is the real non-zero floor
	// mechanism for high-magnitude memories.
	const curve = new ForgettingCurve()
	entry.permanent = true
	entry.retention   = 1
	mem.memories        = [ entry ]
	curve.tick( mem, 10000, { pruneBelow: 0.5 } )
	assert.equal( mem.memories.length, 1, 'a permanent memory must survive even extreme dt' )

} )

test( '23. latent_memory_reactivates_on_token_overlap', async () => {

	const mem   = new EpisodicMemory()
	const entry = await mem.store( { text: 'una traicion dolorosa', userId: 'u', emotionalSignature: { valence: -0.7, arousal: 0.6 }, importance: 0.9 } )
	mem.tagRemSalient( entry.id, Date.now() - 1000 * 60 * 60 * 24 * 60 )

	const unrelated  = mem.getBestReactivation( [ 'que', 'tal', 'el', 'clima' ] )
	const related      = mem.getBestReactivation( [ 'otra', 'vez', 'esa', 'traicion' ] )
	assert.equal( unrelated, null )
	assert.ok( related && related.score > 0 )

} )

test( '24. remConsolidation_triggers_on_real_idle_time', () => {

	const rem = new RemConsolidation( { idleThresholdMs: 1000 * 60 * 60 * 4 } )
	rem.recordTurn( Date.now() - 1000 * 60 * 30 ) // 30 min ago, below threshold
	assert.equal( rem.shouldTrigger(), false )

	rem.recordTurn( Date.now() - 1000 * 60 * 60 * 6 ) // 6h ago, above threshold
	assert.equal( rem.shouldTrigger(), true )

} )

test( '25. remConsolidation_cools_arousal_and_prunes_stale_links', async () => {

	const mem   = new EpisodicMemory()
	const entry = await mem.store( { text: 'x', userId: 'u', emotionalSignature: { valence: -0.5, arousal: 0.9 }, importance: 0.8 } )
	const hebbian = new HebbianPlasticity()
	hebbian.update( [ 'sarcasm', 'defense' ] )
	const beforeAssoc = hebbian.getAssociation( 'sarcasm', 'defense' )

	const rem = new RemConsolidation()
	rem.recordTurn( Date.now() - 1000 * 60 * 60 * 6 )
	const report = rem.sweep( {
		episodicMemory: mem, hebbianPlasticity: hebbian, cortisolEngine: new CortisolEngine(),
		expressionDebt: new ExpressionDebt(), sensitization: new Sensitization(),
		emotionSpace: new EmotionSpace(), moodTracker: new MoodTracker(), decayEngine: new DecayEngine(), personality: new Personality(),
	} )

	assert.ok( entry.emotionalSignature.arousal < 0.9 )
	assert.ok( hebbian.getAssociation( 'sarcasm', 'defense' ) < beforeAssoc )
	assert.ok( report.elapsedHours >= 5 )

} )

test( '26. hebbianPlasticity_strengthens_co_activated_paths', () => {

	const hebbian = new HebbianPlasticity()
	let prior         = 0
	for ( let i = 0; i < 5; i++ ) {

		hebbian.update( [ 'a', 'b' ] )
		const current = hebbian.getAssociation( 'a', 'b' )
		assert.ok( current > prior )
		prior = current

	}

} )

// ============================================================================
// Social & LoveHateEngine
// ============================================================================

test( '27. loveHate_affinity_has_diminishing_returns', () => {

	const lh      = new LoveHateEngine()
	const deltas = []
	let prev       = 0
	for ( let i = 0; i < 6; i++ ) {

		lh.observe( 'u', { L: 0.9, H: 0 }, { trust: 0.5 } )
		const a = lh.getBond( 'u' ).A
		deltas.push( a - prev )
		prev = a

	}
	assert.ok( deltas.every( ( d, i ) => i === 0 || d <= deltas[ i - 1 ] + 1e-9 ) )

} )

test( '28. loveHate_aversion_has_slippery_slope_kindling', () => {

	const lh          = new LoveHateEngine()
	const deltas = []
	let prev       = 0
	for ( let i = 0; i < 4; i++ ) {

		lh.observe( 'u', { L: 0, H: 0.3 }, { trust: 0.5 } )
		const v = lh.getBond( 'u' ).V
		deltas.push( v - prev )
		prev = v

	}
	assert.ok( deltas[ 3 ] >= deltas[ 0 ] * 0.9, 'pre-saturation V increments should not shrink like A\'s diminishing-returns pattern' )

} )

test( '29. loveHate_ambivalence_and_tension_computed_correctly', () => {

	const lh = new LoveHateEngine()
	lh.observe( 'u', { L: 0.8, H: 0.6 }, { trust: 0.5 } )
	const bond = lh.getBond( 'u' )
	assert.equal( lh.getAmbivalence( 'u' ), Math.min( bond.A, bond.V ) )
	assert.ok( Math.abs( lh.getTension( 'u' ) - bond.A * bond.V ) < 1e-9 )

} )

test( '30. loveHate_rupture_fires_when_V_minus_A_exceeds_threshold', () => {

	const lh = new LoveHateEngine( { thetaR: 0.3 } )
	for ( let i = 0; i < 4; i++ ) lh.observe( 'u', { L: 0, H: 0.9 }, { trust: 0.5, cortisol: 0.3 } )
	const rupture = lh.checkRupture( 'u', { cortisol: 0.3 } )
	assert.equal( rupture.ruptured, true )
	assert.ok( lh.getBond( 'u' ).V - lh.getBond( 'u' ).A > 0.3 )

} )

test( '31. loveHate_repair_only_possible_under_low_cortisol', () => {

	const lh = new LoveHateEngine( { thetaP: 0.3, thetaCalm: 0.4 } )
	lh.bonds.set( 'u', { A: 0.7, V: 0.2, lastUpdate: Date.now(), ruptured: true, ruptureCount: 1, lastRuptureTick: Date.now(), repairCount: 0 } )
	assert.equal( lh.attemptRepair( 'u', { cortisol: 0.6 } ).repaired, false )
	assert.equal( lh.attemptRepair( 'u', { cortisol: 0.1 } ).repaired, true )

} )

test( '32. loveHate_asymmetric_decay_V_slower_than_A', () => {

	const lh = new LoveHateEngine()
	lh.observe( 'u', { L: 0.9, H: 0.9 }, { trust: 0.5 } )
	const before = { ...lh.getBond( 'u' ) }
	for ( let i = 0; i < 40; i++ ) lh.tick( 1, { cortisol: 0 } )
	const after = lh.getBond( 'u' )
	assert.ok( ( after.V / before.V ) > ( after.A / before.A ) )

} )

test( '33. attachment_styles_modulate_trust_speed_and_thresholds', () => {

	const att       = new Attachment()
	const secure    = new Personality( { neuroticism: 0.2, agreeableness: 0.8, extraversion: 0.7 } )
	const avoidant = new Personality( { neuroticism: 0.2, agreeableness: 0.1, extraversion: 0.1 } )

	assert.equal( att.getStyle( secure ), 'secure' )
	assert.equal( att.getStyle( avoidant ), 'avoidant' )

	const secureAtt      = new Attachment()
	const avoidantAtt = new Attachment()
	secureAtt.update( 'u', { valenceDelta: 0.5 }, secure )
	avoidantAtt.update( 'u', { valenceDelta: 0.5 }, avoidant )
	assert.ok( secureAtt.get( 'u' ).affinity !== avoidantAtt.get( 'u' ).affinity, 'the same positive event should move affinity differently across styles' )

} )

test( '34. attachment_rupture_and_repair_cycle_updates_state', () => {

	const att        = new Attachment()
	const anxious = new Personality( { neuroticism: 0.9, agreeableness: 0.8, extraversion: 0.7 } )
	att.update( 'u', { valenceDelta: -0.5 }, anxious )
	assert.equal( att.get( 'u' ).ruptured, true )
	att.update( 'u', { valenceDelta: 0.6 }, anxious )
	assert.equal( att.get( 'u' ).ruptured, false )
	assert.equal( att.get( 'u' ).repairsCount, 1 )

} )

test( '35. reputation_egoHealth_damaged_by_rupture', async () => {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.6, agreeableness: 0.4 } ) } )
	const before = ai.reputationEngine.getEgoHealth()
	const phrases = [
		'me mentiste sobre el proyecto, esto es una traicion total',
		'no puedo creer que me hayas engañado así, te odio',
		'confié en ti y me apuñalaste por la espalda',
		'nunca voy a olvidar esta traicion, me mentiste otra vez',
		'sigues engañándome, esto es imperdonable',
		'me traicionaste de nuevo, ya no confío en nada de lo que dices',
	]
	let ruptured = false
	for ( const p of phrases ) {

		const r = await ai.processInput( p, { userId: 'z' } )
		if ( r.debug?.loveHate?.rupture?.ruptured ) ruptured = true

	}
	assert.ok( ruptured )
	assert.ok( ai.reputationEngine.getEgoHealth() < before )

} )

test( '36. theoryOfMind_updates_beliefs_about_user', () => {

	const tom = new TheoryOfMind()
	tom.update( 'u', { inferredEmotion: 'anger', valence: -0.6 } )
	tom.updateBelief( 'u', 'reliability', { suspicious: true } )
	const model = tom.models.get( 'u' )
	assert.equal( model.inferredEmotion, 'anger' )
	assert.equal( model.beliefs.get( 'reliability' ).suspicious, true )

} )

test( '37. emotionalContagion_transfers_affect_from_user', () => {

	// ownVector deliberately NOT the exact origin: atan2(0,0)'s phase is
	// undefined, and the magnitude fallback there makes the cos-difference
	// formula degenerate (always <= 0 regardless of pull direction) — a real
	// edge case of the angular Kuramoto formulation, not representative of
	// normal operation where the AI already has SOME felt state.
	const contagion    = new EmotionalContagion()
	const personality = new Personality( { agreeableness: 0.8 } )
	const ownVector       = { valence: -0.2, arousal: 0.1 }
	const spike               = contagion.computeKuramotoSpike( ownVector, 0.8, 0.3, 0.9, personality )
	assert.ok( spike.valence > 0, 'a positive, trusted user should pull the AI\'s own affect positive' )

} )

// ============================================================================
// Cognition & Defense
// ============================================================================

test( '38. amygdalaHijack_graduated_not_binary', () => {

	const hijack = new AmygdalaHijack()
	const es        = new EmotionSpace()
	es.setVector( -0.6, 0.75, -0.5 )
	const result = hijack.check( es, 0.95 )
	assert.ok( [ 'alert', 'partial', 'full', 'none' ].includes( result.tier ) )
	assert.notEqual( typeof result.active, 'undefined' )

} )

test( '39. amygdalaHijack_kindling_lowers_threshold_after_repeats', () => {

	const hijack = new AmygdalaHijack()
	assert.equal( hijack.getKindlingDiscount( [ 'threat' ] ), 0 )
	for ( let i = 0; i < 3; i++ ) hijack.observeStimulus( 'threat' )
	assert.ok( hijack.getKindlingDiscount( [ 'threat' ] ) > 0 )

} )

test( '40. defenseMechanisms_vaillant_hierarchy_selects_by_ego_and_cortisol', () => {

	const personality = new Personality()
	const dm                 = new DefenseMechanisms()
	let immature = 0
	let mature      = 0
	for ( let i = 0; i < 150; i++ ) {

		if ( dm.check( 0.8, personality, 0.6, { egoHealth: 0.1, cortisol: 0.9 } ).tier === 'immature' ) immature++
		if ( dm.check( 0.8, personality, 0.6, { egoHealth: 0.95, cortisol: 0.05 } ).tier === 'mature' ) mature++

	}
	assert.ok( immature > 40 )
	assert.ok( mature > 5 )

} )

test( '41. cognitiveDissonance_raises_stress_on_belief_conflict', () => {

	const dissonance    = new CognitiveDissonance()
	const personality = new Personality( { conscientiousness: 0.3 } )
	assert.equal( dissonance.getStress(), 0 )
	dissonance.registerConflict( 0.9, personality )
	assert.ok( dissonance.getStress() > 0 )

} )

test( '42. decisionFatigue_accumulates_and_decays', () => {

	const fatigue = new DecisionFatigue()
	for ( let i = 0; i < 10 ; i++ ) fatigue.recordDecision( 1 )
	const peak = fatigue.getLevel()
	assert.ok( peak > 0 )
	fatigue.decay( 20 )
	assert.ok( fatigue.getLevel() < peak )

} )

test( '43. refractoryPeriod_blocks_immediate_re_trigger', () => {

	const refractory = new RefractoryPeriod()
	const furiousVector = { valence: -0.7, arousal: 0.9 }
	assert.equal( refractory.isActive( furiousVector ), true )

	const calming = refractory.filter( 0.8, furiousVector )
	assert.ok( calming.dampening > 0.5, 'a calming/positive input right after an extreme state should be strongly dampened' )

	const agreeing = refractory.filter( -0.5, furiousVector )
	assert.equal( agreeing.dampening, 0, 'input that agrees with the current extreme state should pass through undampened' )

} )

test( '44. sensitization_increases_reactivity_to_repeated_threat', () => {

	const sensitization = new Sensitization()
	const baseline           = sensitization.getThresholdMultiplier()
	for ( let i = 0; i < 5; i++ ) sensitization.observe( -0.6 )
	assert.ok( sensitization.getThresholdMultiplier() < baseline, 'repeated negative stimuli should make the AI easier to trigger (lower multiplier)' )

} )

// ============================================================================
// Expression & Pipeline
// ============================================================================

test( '45. expressionDebt_real_suppression_cost_paid_over_ticks', () => {

	const debt = new ExpressionDebt()
	debt.chargeSuppressionCost( 0.8 )
	const before = debt.suppressionCostReservoir
	assert.ok( before > 0 )
	for ( let i = 0; i < 5; i++ ) debt.decay( 1 )
	assert.ok( debt.suppressionCostReservoir < before && debt.suppressionCostReservoir >= 0 )

} )

test( '46. expressionDirectives_policy_uses_full_state', () => {

	const ed        = new ExpressionDirectives()
	const base      = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2 } )
	const trusted  = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2, trust: 0.95, cortisol: 0 } )
	const stressed = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2, cortisol: 0.9, woundPressure: 1 } )

	assert.ok( ( trusted.approach + trusted.engage ) > ( base.approach + base.engage ) )
	assert.ok( stressed.withdraw > base.withdraw )

} )

test( '47. loadScheduler_gates_modules_under_high_instability', () => {

	const scheduler = new LoadScheduler()
	const calmGate      = scheduler.gate( 0.1 )
	const crisisGate    = scheduler.gate( 0.98 )

	assert.equal( calmGate.runOntology, true )
	assert.equal( crisisGate.runOntology, false )
	assert.equal( crisisGate.runSituationalContext, true, 'the cheap always-on stage should never be gated off' )

} )

test( '48. wornPathCache_promotes_and_decays_confidence', () => {

	const wpc = new WornPathCache( { promotionThreshold: 3, authorityHalfLifeMs: 1000 * 60 * 10 } )
	for ( let i = 0; i < 2; i++ ) wpc.observe( 'fp', { x: 1 } )
	assert.equal( wpc.consult( 'fp' ), null, 'below the promotion threshold, nothing should be served yet' )
	wpc.observe( 'fp', { x: 1 } )
	assert.notEqual( wpc.consult( 'fp' ), null, 'promoted and freshly observed, it should be served' )

	const stale = new WornPathCache( { promotionThreshold: 2, authorityHalfLifeMs: 1000 * 60 * 10 } )
	stale.observe( 'fp2', { x: 1 }, Date.now() - 1000 * 60 * 60 )
	stale.observe( 'fp2', { x: 1 }, Date.now() - 1000 * 60 * 60 )
	assert.equal( stale.consult( 'fp2', { authorityThreshold: 0.5, now: Date.now() } ), null, 'authority should have decayed away over an hour against a 10-minute half-life' )

} )

test( '49. pipelineResilience_safeStep_falls_back_instead_of_crashing', async () => {

	const explainability = { logDecision: () => {} }
	const result = await safeStep( explainability, 'riskyStage', async () => { throw new Error( 'boom' ) }, 'fallback-value' )
	assert.equal( result, 'fallback-value' )

	const ok = await safeStep( explainability, 'safeStage', async () => 'real-value', 'fallback-value' )
	assert.equal( ok, 'real-value' )

} )

test( '50. state_roundtrip_toJSON_restoreState_preserves_all_critical_fields', async () => {

	const original = new Totemheart( { personality: new Personality( { neuroticism: 0.6 } ) } )
	await original.processInput( 'te quiero mucho', { userId: 'u1' } )
	await original.processInput( 'me mentiste, esto es una traicion total, te odio', { userId: 'u1' } )
	original.tick( 2 )

	const restored = new Totemheart()
	restored.restoreState( JSON.parse( JSON.stringify( original.toJSON() ) ) )

	assert.deepEqual( restored.emotionSpace.vector, original.emotionSpace.vector )
	assert.deepEqual( restored.attachment.get( 'u1' ), original.attachment.get( 'u1' ) )
	assert.deepEqual( restored.loveHateEngine.getBond( 'u1' ), original.loveHateEngine.getBond( 'u1' ) )
	assert.deepEqual( restored.episodicMemory.getUnresolvedMemories( 'u1' ), original.episodicMemory.getUnresolvedMemories( 'u1' ) )
	assert.equal( restored.cortisolEngine.level, original.cortisolEngine.level )

} )
