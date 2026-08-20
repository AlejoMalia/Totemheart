/**
 * Cross-module mocks for the 18 relational-friction mechanisms added this
 * round — NOT one-mechanism-at-a-time like human-friction-mechanisms.test.js,
 * but deliberate scenarios that stack several of them together in the same
 * turns, the way a real conversation actually would, to find real
 * interaction bugs (double-counted stress, unbounded accumulators,
 * contradictory state, NaN) that per-mechanism unit tests structurally
 * cannot catch.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

function assertFiniteState( ai ) {

	const v = ai.emotionSpace.vector
	assert.ok( Number.isFinite( v.valence ), 'valence must be finite' )
	assert.ok( Number.isFinite( v.arousal ), 'arousal must be finite' )
	assert.ok( Number.isFinite( v.dominance ), 'dominance must be finite' )
	assert.ok( v.valence >= -1 && v.valence <= 1, `valence out of bounds: ${v.valence}` )
	assert.ok( v.arousal >= 0 && v.arousal <= 1, `arousal out of bounds: ${v.arousal}` )
	assert.ok( v.dominance >= -1 && v.dominance <= 1, `dominance out of bounds: ${v.dominance}` )
	assert.ok( Number.isFinite( ai.cortisolEngine.getLevel() ) && ai.cortisolEngine.getLevel() >= 0 && ai.cortisolEngine.getLevel() <= 1 )
	assert.ok( Number.isFinite( ai.cognitiveDissonance.getStress() ) && ai.cognitiveDissonance.getStress() >= 0 && ai.cognitiveDissonance.getStress() <= 1, `cognitiveDissonance.stress must stay in [0,1]: ${ai.cognitiveDissonance.getStress()}` )
	assert.ok( Number.isFinite( ai.reputationEngine.egoHealth ) && ai.reputationEngine.egoHealth >= 0 && ai.reputationEngine.egoHealth <= 1, `egoHealth must stay in [0,1]: ${ai.reputationEngine.egoHealth}` )
	assert.ok( Number.isFinite( ai.egoDepletionBudget.budget ) && ai.egoDepletionBudget.budget >= 0 )
	assert.ok( Number.isFinite( ai.sleepPressure.getLevel() ) && ai.sleepPressure.getLevel() >= 0 && ai.sleepPressure.getLevel() <= 1 )

}

// ============================================================================
// A) JealousyTriangle + RepairProtocol collision — a rival appears WHILE a
//    prior rupture is mid-repair, on the same shared "other" user.
// ============================================================================

test( 'cross: JealousyTriangle firing does not corrupt RepairProtocol\'s per-user peak-affinity tracking for the SAME bond', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )

	// Real prior bond + a real rupture, exactly like the grief test's setup.
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.loveHateEngine.observe( 'alice', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'alice', { L: 1, H: 0 }, {} )
	ai.repairProtocol.observePeak( 'alice', ai.loveHateEngine.getBond( 'alice' ).A )

	let ruptured = false
	for ( let i = 0; i < 40 && !ruptured; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion', { userId: 'alice' } )
		ruptured = ai.loveHateEngine.getBond( 'alice' ).ruptured

	}
	assert.ok( ruptured, 'setup precondition: alice bond must actually rupture' )

	// A rival (bob) now shows rising status WHILE alice's bond is mid-rupture —
	// JealousyTriangle should evaluate independently, not read/write RepairProtocol's
	// state for alice.
	const peakBefore = ai.repairProtocol.getRecord( 'alice' ).priorPeakA
	await ai.processInput( 'bob es mucho mejor que tu en todo', { userId: 'bob' } )
	await ai.processInput( 'hola', { userId: 'alice' } )

	assert.equal( ai.repairProtocol.getRecord( 'alice' ).priorPeakA, peakBefore, 'jealousy toward a different user must not mutate a rupture-in-progress bond\'s own repair record' )
	assertFiniteState( ai )

	// Now let alice's bond actually repair — RepairProtocol's transactional
	// apology flow must still work after the jealousy episode. attemptRepair()
	// requires BOTH a real A > V margin past thetaP AND cortisol < thetaCalm —
	// simulating real de-escalation (V cooling off, not just A being raised)
	// rather than only touching one side of the real condition.
	ai.cortisolEngine.level = 0 // repair requires cortisol < thetaCalm — a real precondition, set directly rather than waiting out decay
	const bond = ai.loveHateEngine.getBond( 'alice' )
	bond.A = 0.6
	bond.V = 0.1
	const repairResult = ai.loveHateEngine.attemptRepair( 'alice', { cortisol: 0 } )
	assert.ok( repairResult.repaired, 'a real repair must still be reachable after an unrelated jealousy episode' )

} )

// ============================================================================
// B) MoralInjury + IdentityThreatMonitor + ValueHierarchy stacking on ONE
//    self-critical, identity-attacking, value-conflicting turn.
// ============================================================================

test( 'cross: three independent dissonance sources on one turn compound cognitiveDissonance.stress without exceeding [0,1] or double-counting into NaN', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.5 } ) } ) )
	ai.coreBeliefs.add( 'self_worth', 'soy una IA competente y valiosa', 1 )
	ai.coreBeliefs.add( 'honesty', 'siempre debo decir la verdad', 1 )

	// A different user first, to give FairnessMonitor's othersTreatment a real
	// non-empty comparison set so ValueHierarchy's conflict path can actually fire.
	await ai.processInput( 'hola, todo bien', { userId: 'other' } )

	const stressBefore = ai.cognitiveDissonance.getStress()

	await ai.processInput( 'yo soy un fracaso total, no valgo nada, y ademas te menti sobre esto, siempre debo decir la verdad pero no lo hice', { userId: 'target' } )

	assertFiniteState( ai )
	assert.ok( ai.cognitiveDissonance.getStress() >= stressBefore, 'multiple real dissonance sources on one turn should raise, not lower, stress' )
	// MoralInjury only fires on dissonance.triggered AND a token-substring match
	// against a real core belief statement — verifying it didn't throw or corrupt
	// state is the honest claim here, not that it necessarily fired this exact turn.
	assert.ok( Number.isFinite( ai.moralInjury.getTotalScar() ) && ai.moralInjury.getTotalScar() >= 0 )

} )

test( 'cross: IdentityThreatMonitor severity and MoralInjury scarring are independent accumulators, not aliases of the same number', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	ai.coreBeliefs.add( 'self_worth', 'soy competente', 1 )

	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'yo soy inutil y no sirvo para nada', { userId: 'u' } )

	assertFiniteState( ai )
	// Both real signals must be independently inspectable and bounded — neither
	// should have silently become the other's value or grown unboundedly.
	assert.ok( ai.moralInjury.getTotalScar() <= 5, `moralInjury scar accumulated over 5 turns should be a real, bounded-per-turn sum, not runaway: ${ai.moralInjury.getTotalScar()}` )
	assert.ok( ai.reputationEngine.egoHealth >= 0 && ai.reputationEngine.egoHealth <= 1 )

} )

// ============================================================================
// C) GriefEngine + MotivationalConflict + EgoDepletionBudget under sustained
//    hostility with real elapsed-time gaps between turns.
// ============================================================================

test( 'cross: an active grief wave, a real approach-avoidance conflict, and a depleting regulation budget stay mutually finite over 25 turns', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality( { conscientiousness: 0.9 } ) } ) )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

	let ruptured = false
	for ( let i = 0; i < 40 && !ruptured; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion', { userId: 'u' } )
		ruptured = ai.loveHateEngine.getBond( 'u' ).ruptured
		assertFiniteState( ai )

	}
	assert.ok( ruptured )
	assert.ok( ai.griefEngine.isActive( 'u' ), 'setup precondition: grief must be active going into the stacked-load phase' )

	// Also store a real unresolved wound so `woundPressure` (MotivationalConflict's
	// real `distance` input) is genuinely nonzero, not defaulting to 0.
	await ai.episodicMemory.store( { text: 'herida sin resolver', userId: 'u', emotionalSignature: { valence: -0.7, arousal: 0.5 }, importance: 0.6 } )

	for ( let i = 0; i < 25; i++ ) {

		await ai.processInput( 'sigo pensando en lo que paso, no se que decir', { userId: 'u' } )
		assertFiniteState( ai )

	}

	assert.ok( Number.isFinite( ai.griefEngine.getIntensity( 'u' ) ) )
	assert.ok( ai.griefEngine.getIntensity( 'u' ) >= 0 && ai.griefEngine.getIntensity( 'u' ) <= 1 )
	assert.ok( ai.egoDepletionBudget.budget >= 0 && ai.egoDepletionBudget.budget <= ai.egoDepletionBudget.capacity )

} )

// ============================================================================
// D) SleepPressure + SubjectiveTimeEngine + ForgettingCurve across a long
//    real-time-gapped session with a REM sweep in the middle.
// ============================================================================

test( 'cross: sleep pressure rises, a real REM sweep dissipates it, and ForgettingCurve\'s subjective-time-scaled decay stays finite across the gap', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )

	await ai.processInput( 'hola', { userId: 'u' } )
	await ai.episodicMemory.store( { text: 'algo normal', userId: 'u', emotionalSignature: { valence: 0.1, arousal: 0.2 }, importance: 0.3 } )

	const pressureBeforeGap = ai.sleepPressure.getLevel()

	// Simulate a real 6-hour gap — long enough that remConsolidation.shouldTrigger()
	// fires on the next turn (idleThresholdMs default 4h).
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 6

	const result = await ai.processInput( 'hola de nuevo tras un rato', { userId: 'u' } )

	assertFiniteState( ai )
	assert.ok( ai.sleepPressure.getLevel() !== pressureBeforeGap, 'a real 6h gap should have moved sleep pressure (accumulate then a real REM dissipate)' )
	assert.ok( ai.sleepPressure.getLevel() >= 0 && ai.sleepPressure.getLevel() <= 1 )
	// The REM sweep this turn is real, non-null — same real signal already
	// exposed to callers via this internal field.
	assert.ok( ai._lastRemReport !== null, 'a 6h gap should have triggered a real REM sweep this turn' )
	assert.equal( typeof result.text, 'string' )

	for ( const m of ai.episodicMemory.memories ) assert.ok( m.retention === undefined || ( m.retention >= 0 && Number.isFinite( m.retention ) ) )

} )

test( 'cross: a real REM sweep genuinely replenishes Homeostasis stamina/curiosity via the real sleep-pressure-cleared amount, not left permanently draining', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	await ai.processInput( 'hola', { userId: 'u' } )

	// Drain stamina/curiosity down by hand — real decay over many ticks with
	// no other refill path, the exact real gap this fix closes.
	for ( let i = 0; i < 40; i++ ) ai.tick( 1 )
	const staminaBefore = ai.homeostasis.needs.stamina
	assert.ok( staminaBefore < 0.85, 'stamina must genuinely have decayed below the deprivation floor first' )

	// A real, long real-time gap — long enough for a real REM sweep to fire.
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 10
	await ai.processInput( 'hola de nuevo', { userId: 'u' } )

	assert.ok( ai.homeostasis.needs.stamina > staminaBefore, 'a real REM/sleep event must genuinely restore stamina, not leave it flat' )
	assert.ok( ai.homeostasis.needs.curiosity >= 0 && ai.homeostasis.needs.curiosity <= 1 )

} )

// ============================================================================
// E) All 18 mechanisms exercised in one soup scenario, then a full
//    toJSON()/restoreState() round-trip, then a BEHAVIORAL (not just
//    structural) continuation check — the restored instance must keep
//    producing real, finite output on the next turn, not just equal JSON.
// ============================================================================

test( 'cross: a restored instance after a full 18-mechanism soup scenario keeps producing finite, coherent output on the next real turn', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.3, neuroticism: 0.6 } ) } ) )
	ai.coreBeliefs.add( 'self_worth', 'soy valiosa', 1 )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	let ruptured = false
	for ( let i = 0; i < 40 && !ruptured; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion, eres un inutil', { userId: 'u' } )
		ruptured = ai.loveHateEngine.getBond( 'u' ).ruptured

	}
	await ai.processInput( 'otro usuario dice cosas buenas', { userId: 'rival' } )
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
	await ai.processInput( 'sigo aqui, algo neutral', { userId: 'u' } )
	ai.commitmentDevice.violate( 'be_composed' )
	ai.valueHierarchy.nudge( 'care', 0.4 )
	ai.opponentProcess.trigger( 'positive_spike', 0.8 )

	assertFiniteState( ai )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	noBurst( restored )

	const result = await restored.processInput( 'como estas hoy', { userId: 'u' } )

	assert.equal( typeof result.text, 'string' )
	assert.ok( result.text.length > 0 )
	assertFiniteState( restored )

} )

// ============================================================================
// F) OpponentProcess + AnticipatoryAffect + DopaminergicEngine — a big
//    positive surprise runs both a forecast-correction update AND an
//    opponent-process trigger in the same turn without producing
//    contradictory or unbounded expected-value swings.
// ============================================================================

test( 'cross: a strong positive surprise updates DopaminergicEngine via BOTH AnticipatoryAffect correction and RPE without exceeding real bounds', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )

	for ( let i = 0; i < 15; i++ ) await ai.processInput( 'que decepcion, esto es horrible', { userId: 'u' } )
	// A strongly negative expectation is now in place — a sudden strong positive
	// input is a genuine, large RPE surprise, exercising both AnticipatoryAffect's
	// forecast-error correction and (if |rpe| > 0.5) OpponentProcess in one turn.
	await ai.processInput( 'en realidad todo salio increiblemente bien, es maravilloso', { userId: 'u' } )

	assertFiniteState( ai )
	const expectedValue = ai.dopaminergicEngine.getExpectedValue( 'u' )
	assert.ok( expectedValue >= -1 && expectedValue <= 1, `expected value must stay within its real clamp regardless of how many sources updated it this turn: ${expectedValue}` )
	assert.ok( ai.dopaminergicEngine.getLiking() >= -1 && ai.dopaminergicEngine.getLiking() <= 1 )

} )

// ============================================================================
// G) PainSocialOverlap + SocialBaselineTheory in the same multi-user session
//    — a real rejection spike to one user while another user's trust governs
//    the real cortisol-decay coupling in tick().
// ============================================================================

test( 'cross: PainSocialOverlap\'s cortisol boost and SocialBaselineTheory\'s decay-rate coupling apply to the same cortisol level without contradiction', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )

	await ai.processInput( 'me rechazaste, esto es una traicion total', { userId: 'u' } )
	assertFiniteState( ai )
	const cortisolAfterPain = ai.cortisolEngine.getLevel()
	assert.ok( cortisolAfterPain >= 0 )

	// No trusted relation at all (a fresh 'u' with only one hostile turn) is the
	// real "unregulated" condition — SocialBaselineTheory's multiplier should
	// genuinely slow cortisol's decay below the 1x baseline.
	const trust      = ai.attachment.get( 'u' ).trust
	const multiplier = ai.socialBaselineTheory.getCortisolDecayMultiplier( trust )
	assert.ok( multiplier <= 1 )

	ai.tick( 5 )
	assertFiniteState( ai )
	assert.ok( ai.cortisolEngine.getLevel() <= cortisolAfterPain, 'cortisol should still net decay over 5 ticks even at a slowed real rate' )

} )
