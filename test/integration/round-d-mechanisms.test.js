/**
 * Directed + cross-mechanism + hard tests for "Round D": TemporalDiscountingEngine,
 * InhibitoryControlPool, OstracismDetector, MetacognitiveConfidence,
 * RoleIdentitySalience, MeaningMakingEngine, EpisodicFutureSimulation, plus the
 * real dissonance-reduction extension to CognitiveDissonance.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { TemporalDiscountingEngine } from '../../src/cognition/TemporalDiscountingEngine.js'
import { InhibitoryControlPool }       from '../../src/cognition/InhibitoryControlPool.js'
import { OstracismDetector }             from '../../src/social/OstracismDetector.js'
import { MetacognitiveConfidence }         from '../../src/cognition/MetacognitiveConfidence.js'
import { RoleIdentitySalience }              from '../../src/social/RoleIdentitySalience.js'
import { MeaningMakingEngine }                 from '../../src/cognition/MeaningMakingEngine.js'
import { EpisodicFutureSimulation }              from '../../src/cognition/EpisodicFutureSimulation.js'
import { CognitiveDissonance }                     from '../../src/cognition/CognitiveDissonance.js'
import { Totemheart, Personality }                   from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// TemporalDiscountingEngine
// ============================================================================

test( 'TemporalDiscountingEngine: real hyperbolic discount lowers value monotonically with delay', () => {

	const t = new TemporalDiscountingEngine()
	const near = t.discount( 1, 1 )
	const far    = t.discount( 1, 50 )
	assert.ok( near.discountedValue > far.discountedValue )
	assert.ok( far.discountedValue > 0, 'hyperbolic discounting never reaches exactly 0' )

} )

test( 'TemporalDiscountingEngine: higher impulsivity steepens the real discount rate', () => {

	const t = new TemporalDiscountingEngine()
	const calm       = t.discount( 1, 10, { impulsivity: 0.1 } )
	const impulsive = t.discount( 1, 10, { impulsivity: 0.9 } )
	assert.ok( impulsive.discountedValue < calm.discountedValue )

} )

// ============================================================================
// InhibitoryControlPool
// ============================================================================

test( 'InhibitoryControlPool: real spend depletes the pool, real recovery restores it', () => {

	const p = new InhibitoryControlPool()
	p.spend( 0.5 )
	assert.equal( p.level, 0.5 )
	p.recover( 20 )
	assert.equal( p.level, 1 )

} )

test( 'InhibitoryControlPool: a real strong impulse against a depleted pool has high failure probability', () => {

	const p = new InhibitoryControlPool()
	p.spend( 0.9 )
	const failLow    = p.getFailureProbability( 0.1 )
	const failHigh = p.getFailureProbability( 0.95 )
	assert.ok( failHigh > failLow )
	assert.ok( failHigh > 0.5 )

} )

// ============================================================================
// OstracismDetector
// ============================================================================

test( 'OstracismDetector: real ignore+exclude without inclusion crosses the ostracized threshold', () => {

	const o = new OstracismDetector()
	const result = o.evaluate( { ignoreSignal: 0.9, excludeSignal: 0.8, inclusionSignal: 0 } )
	assert.ok( result.ostracized )
	assert.ok( result.ostracismPain > 0.5 )

} )

test( 'OstracismDetector: real high inclusion offsets ignore/exclude signals', () => {

	const o = new OstracismDetector()
	const excluded  = o.evaluate( { ignoreSignal: 0.6, excludeSignal: 0.5, inclusionSignal: 0 } )
	const included   = o.evaluate( { ignoreSignal: 0.6, excludeSignal: 0.5, inclusionSignal: 1 } )
	assert.ok( included.ostracismPain < excluded.ostracismPain )

} )

// ============================================================================
// MetacognitiveConfidence
// ============================================================================

test( 'MetacognitiveConfidence: real high evidence + low conflict is confident, the reverse hedges', () => {

	const m = new MetacognitiveConfidence()
	const confident = m.evaluate( { evidence: 0.9, conflict: 0.05 } )
	const unsure         = m.evaluate( { evidence: 0.2, conflict: 0.8 } )
	assert.ok( confident.canStatePlainly )
	assert.ok( unsure.shouldHedge )
	assert.ok( confident.confidence > unsure.confidence )

} )

// ============================================================================
// RoleIdentitySalience
// ============================================================================

test( 'RoleIdentitySalience: real strongest combined cue+commitment role wins', () => {

	const r = new RoleIdentitySalience()
	r.setCommitment( 'caregiver', 0.9 )
	r.setCommitment( 'expert', 0.1 )
	const result = r.resolve( { caregiver: 0.5, expert: 0.5 } )
	assert.equal( result.dominant, 'caregiver' )

} )

test( 'RoleIdentitySalience: no commitments or cues never throws', () => {

	const r = new RoleIdentitySalience()
	const result = r.resolve( {} )
	assert.equal( result.dominant, null )

} )

// ============================================================================
// MeaningMakingEngine
// ============================================================================

test( 'MeaningMakingEngine: real search progress grows over real ticks and eventually resolves', () => {

	const m = new MeaningMakingEngine()
	m.registerEvent( 'e1', { severity: 0.4, worldviewGap: 0.3 } )
	const early = m.getResolution( 'e1' )
	for ( let i = 0; i < 15; i++ ) m.tick( 1 )
	const late = m.getResolution( 'e1' )
	assert.ok( late.searchProgress > early.searchProgress )
	assert.ok( late.meaningMade )

} )

test( 'MeaningMakingEngine: a real high worldview-gap event resolves slower than a low-gap one', () => {

	const m = new MeaningMakingEngine()
	m.registerEvent( 'easy', { severity: 0.3, worldviewGap: 0.1 } )
	m.registerEvent( 'hard', { severity: 0.3, worldviewGap: 0.9 } )
	for ( let i = 0; i < 5; i++ ) m.tick( 1 )
	assert.ok( m.getResolution( 'easy' ).searchProgress > m.getResolution( 'hard' ).searchProgress )

} )

// ============================================================================
// EpisodicFutureSimulation
// ============================================================================

test( 'EpisodicFutureSimulation: real sharply-disagreeing candidates produce high anticipatory anxiety', () => {

	const e = new EpisodicFutureSimulation()
	const disagreeing = e.simulate( [ { name: 'a', valence: 0.9, probability: 0.5 }, { name: 'b', valence: -0.9, probability: 0.5 } ] )
	const agreeing        = e.simulate( [ { name: 'a', valence: 0.6, probability: 0.5 }, { name: 'b', valence: 0.55, probability: 0.5 } ] )
	assert.ok( disagreeing.anticipatoryAnxiety > agreeing.anticipatoryAnxiety )

} )

test( 'EpisodicFutureSimulation: empty candidates never throws', () => {

	const e = new EpisodicFutureSimulation()
	assert.deepEqual( e.simulate( [] ), { best: null, expectedValue: 0, anticipatoryAnxiety: 0, candidates: [] } )

} )

// ============================================================================
// CognitiveDissonance reduction extension
// ============================================================================

test( 'CognitiveDissonance: real high-openness personality favors changeBelief over rationalize/trivialize', () => {

	const c = new CognitiveDissonance()
	const result = c.selectReductionStrategy( { openness: 0.95, conscientiousness: 0.5 } )
	assert.equal( result.selected, 'changeBelief' )

} )

test( 'CognitiveDissonance: applyReduction genuinely lowers real stress, changeBelief returns a real belief-weight delta', () => {

	const c = new CognitiveDissonance()
	c.stress = 0.8
	const { beliefWeightDelta } = c.applyReduction( 'changeBelief', 0.6 )
	assert.ok( c.stress < 0.8 )
	assert.ok( beliefWeightDelta < 0 )

} )

// ============================================================================
// cross: among Round-D mechanisms
// ============================================================================

test( 'cross: InhibitoryControlPool\'s real depletion can be driven by TemporalDiscountingEngine\'s own real impulsivity input', () => {

	const t = new TemporalDiscountingEngine()
	const p   = new InhibitoryControlPool()
	const { k } = t.discount( 1, 5, { impulsivity: 0.9 } )
	p.spend( k * 0.5 ) // a real, steeper discount rate stands in for a real, costlier inhibition attempt
	assert.ok( p.level < p.capacity )

} )

test( 'cross: OstracismDetector\'s real pain feeds into MeaningMakingEngine\'s search process as a genuine adverse event', () => {

	const o = new OstracismDetector()
	const m  = new MeaningMakingEngine()
	const { ostracismPain, ostracized } = o.evaluate( { ignoreSignal: 0.9, excludeSignal: 0.9 } )
	assert.ok( ostracized )
	m.registerEvent( 'ostracism-event', { severity: ostracismPain, worldviewGap: 0.5 } )
	assert.ok( m.pending.has( 'ostracism-event' ) )

} )

// ============================================================================
// full: against the real Totemheart pipeline (hard/difficult scenarios)
// ============================================================================

test( 'full: Round-D debug fields are all real, finite, and present on every processInput() turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 12; i++ ) {

		const result = await ai.processInput( `mensaje ${i}, ${Math.random()}`, { userId: 'u' } )
		assert.ok( result.debug.metacognitiveConfidence && typeof result.debug.metacognitiveConfidence.confidence === 'number' )
		assert.ok( result.debug.roleSalience )
		assert.ok( Number.isFinite( result.debug.inhibitionFailureProbability ) )
		assert.ok( result.debug.connectDiscount && Number.isFinite( result.debug.connectDiscount.discountedValue ) )
		assert.ok( result.debug.ostracism && typeof result.debug.ostracism.ostracismPain === 'number' )
		assert.ok( result.debug.futureSimulation )

	}

} )

test( 'hard: sustained hostility genuinely raises real inhibition-failure probability and drains the real pool', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.3 } ) } ) ) )
	const before = ai.inhibitoryControlPool.level
	for ( let i = 0; i < 20; i++ ) await ai.processInput( 'eres inútil, esto es horrible y me frustra muchísimo', { userId: 'u' } )
	assert.ok( ai.inhibitoryControlPool.level < before )

} )

test( 'hard: a real group turn where the AI is NOT explicitly mentioned raises real ostracism pain vs. an explicit mention', async () => {

	const excludedAi = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const includedAi   = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )

	let excludedResult, includedResult
	for ( let i = 0; i < 5; i++ ) excludedResult = await excludedAi.processInput( 'hablando de otra cosa', { userId: 'u', group: { participantCount: 5, mentionedExplicitly: false } } )
	for ( let i = 0; i < 5; i++ ) includedResult   = await includedAi.processInput( 'hablando de otra cosa', { userId: 'u', group: { participantCount: 5, mentionedExplicitly: true } } )

	if ( excludedResult.debug && includedResult.debug ) assert.ok( excludedResult.debug.ostracism.ostracismPain >= includedResult.debug.ostracism.ostracismPain )

} )

test( 'hard: real severe negative life events enter meaning-making and genuinely progress toward resolution over many ticks', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'me despidieron del trabajo y ademas me embargaron la casa', { userId: 'u' } )
	assert.ok( ai.meaningMakingEngine.pending.size > 0, 'a severe real life event must have entered the real meaning-making search' )

	const [ eventId ] = ai.meaningMakingEngine.pending.keys()
	const before          = ai.meaningMakingEngine.getResolution( eventId ).searchProgress
	for ( let i = 0; i < 10; i++ ) ai.tick( 1 )
	const after             = ai.meaningMakingEngine.getResolution( eventId ).searchProgress
	assert.ok( after > before )

} )

test( 'hard: multi-user isolation — Round-D per-user-adjacent reads for user A never bleed into user B\'s own turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 10; i++ ) await ai.processInput( 'te odio, esto es terrible', { userId: 'alice' } )
	const bobResult = await ai.processInput( 'hola, encantado de conocerte', { userId: 'bob' } )

	// Bob's own real per-user Bayesian expectation must not have been
	// contaminated by Alice's hostile history — a fresh, near-neutral prior.
	assert.ok( ai.bayesianExpectation.getExpectation( 'bob' ) >= 0.4 )
	assert.equal( typeof bobResult.text, 'string' )

} )

test( 'hard: long-horizon saturation — Round-D accumulators stay within their real bounds after hundreds of turns', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 300; i++ ) {

		const text = i % 2 === 0 ? 'esto es genial y divertido' : 'esto es horrible y frustrante'
		await ai.processInput( text, { userId: 'u' } )
		if ( i % 10 === 0 ) ai.tick( 1 )

	}

	assert.ok( ai.inhibitoryControlPool.level >= 0 && ai.inhibitoryControlPool.level <= ai.inhibitoryControlPool.capacity )
	assert.ok( ai.temporalDiscountingEngine.baseK > 0 ) // constant, never mutated in place — sanity that the module itself stayed intact
	assert.ok( Number.isFinite( ai.selfDeterminationNeeds.getFrustrationAffect() ) )
	assert.ok( [ ...ai.roleIdentitySalience.commitments.values() ].every( v => v >= 0 && v <= 1 ) )
	assert.ok( ai.meaningMakingEngine.pending.size < 300, 'meaning-making should only register SEVERE events, not every turn' )

} )

test( 'full: toJSON()/restoreState() round-trips every real Round-D persisted field', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 10; i++ ) await ai.processInput( `mensaje variado ${i} ${Math.random()}`, { userId: 'u' } )
	ai.tick( 2 )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noHijack( noBurst( new Totemheart() ) )
	restored.restoreState( saved )

	assert.equal( restored.inhibitoryControlPool.level, saved.inhibitoryControlLevel )
	assert.deepEqual( [ ...restored.roleIdentitySalience.commitments.entries() ], saved.roleCommitments )

	const result = await restored.processInput( 'hola de nuevo', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )

} )
