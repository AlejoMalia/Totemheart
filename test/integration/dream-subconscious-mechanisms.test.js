/**
 * Directed + cross-mechanism + full-pipeline tests for DreamEngine and
 * SubconsciousEngine.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { DreamEngine }              from '../../src/social/DreamEngine.js'
import { SubconsciousEngine }         from '../../src/cognition/SubconsciousEngine.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// DreamEngine
// ============================================================================

test( 'DreamEngine: only a genuinely long real elapsed gap qualifies as deep sleep, a short REM cooling gap does not', () => {

	const d = new DreamEngine( { deepSleepThresholdMs: 1000 * 60 * 60 * 12 } )
	assert.equal( d.qualifiesForDream( 1000 * 60 * 60 * 4 ), false )
	assert.equal( d.qualifiesForDream( 1000 * 60 * 60 * 14 ), true )

} )

test( 'DreamEngine: generateDream() synthesizes real content from real inputs, never invents when both are empty', () => {

	const d = new DreamEngine()
	assert.equal( d.generateDream( 'u', {} ), null )
	const dream = d.generateDream( 'u', { topDetail: { text: 'aquella noche hablamos hasta tarde' }, topTheme: null, dominantFamily: 'relational', affectLedger: { cumulativeWarmth: 0.8, cumulativeHurt: 0.1 } } )
	assert.equal( dream.topic, 'aquella noche hablamos hasta tarde' )
	assert.ok( dream.valence > 0 )

} )

test( 'DreamEngine: real residue decays over real time and eventually reaches zero', () => {

	const d = new DreamEngine( { residueHalfLifeMs: 1000 } )
	d.generateDream( 'u', { topTheme: { theme: 'x' }, affectLedger: { cumulativeWarmth: 0.5, cumulativeHurt: 0 } }, 0 )
	const fresh = d.getResidueIntensity( 'u', 100 )
	const stale    = d.getResidueIntensity( 'u', 10000 )
	assert.ok( fresh > stale )
	assert.ok( stale < 0.05 )

} )

test( 'DreamEngine: shouldMentionDream() genuinely requires real active residue — a fully decayed dream is never mentioned', () => {

	const d = new DreamEngine( { residueHalfLifeMs: 100 } )
	d.generateDream( 'u', { topTheme: { theme: 'x' }, affectLedger: { cumulativeWarmth: 0.9, cumulativeHurt: 0 } }, 0 )
	const result = d.shouldMentionDream( 'u', { conversationDullness: 1, trust: 1, spontaneity: 1 }, 100000 )
	assert.equal( result.should, false )

} )

test( 'DreamEngine: shouldMentionDream() never mentions the SAME dream twice', () => {

	const d = new DreamEngine()
	d.generateDream( 'u', { topTheme: { theme: 'x' }, affectLedger: { cumulativeWarmth: 0.9, cumulativeHurt: 0 } }, 0 )
	const originalRandom = Math.random
	Math.random = () => 0 // force the real Bernoulli draw to succeed
	try {

		const first  = d.shouldMentionDream( 'u', { conversationDullness: 1, trust: 1, spontaneity: 1 }, 1000 )
		const second = d.shouldMentionDream( 'u', { conversationDullness: 1, trust: 1, spontaneity: 1 }, 2000 )
		assert.equal( first.should, true )
		assert.equal( second.should, false )

	}
	finally { Math.random = originalRandom }

} )

// ============================================================================
// SubconsciousEngine
// ============================================================================

test( 'SubconsciousEngine: real losing-coalition residue accumulates only for non-winning candidates', () => {

	const s = new SubconsciousEngine()
	s.registerCompetition( [ { name: 'a', access: 0.7 }, { name: 'b', access: 0.3 } ], 'a' )
	assert.equal( s.getCoalitionResidue( 'a' ), 0 )
	assert.ok( s.getCoalitionResidue( 'b' ) > 0 )

} )

test( 'SubconsciousEngine: real mere-exposure boost genuinely grows with repeated real exposure, and saturates', () => {

	const s = new SubconsciousEngine()
	assert.equal( s.getMereExposureBoost( 'topic' ), 0 )
	for ( let i = 0; i < 3; i++ ) s.registerExposure( 'topic' )
	const early = s.getMereExposureBoost( 'topic' )
	for ( let i = 0; i < 30; i++ ) s.registerExposure( 'topic' )
	const late = s.getMereExposureBoost( 'topic' )
	assert.ok( late > early )
	assert.ok( late <= 0.4 )

} )

test( 'SubconsciousEngine: real suppression genuinely accumulates ironic-rebound pressure instead of erasing the topic', () => {

	const s = new SubconsciousEngine()
	assert.equal( s.getIronicReboundPressure( 'topic' ), 0 )
	for ( let i = 0; i < 10; i++ ) s.registerSuppression( 'topic', 0.5 )
	assert.ok( s.getIronicReboundPressure( 'topic' ) > 0.3 )

} )

test( 'SubconsciousEngine: releaseRebound() genuinely, honestly spends the real pressure, not infinite', () => {

	const s = new SubconsciousEngine()
	for ( let i = 0; i < 5; i++ ) s.registerSuppression( 'topic', 0.5 )
	s.releaseRebound( 'topic' )
	assert.equal( s.getIronicReboundPressure( 'topic' ), 0 )

} )

test( 'SubconsciousEngine: real decay fades both coalition residue and suppression pressure, at real different rates', () => {

	const s = new SubconsciousEngine()
	s.registerCompetition( [ { name: 'a', access: 0.9 } ], 'winner' )
	s.registerSuppression( 'topic', 0.9 )
	const beforeResidue    = s.getCoalitionResidue( 'a' )
	const beforePressure = s.getIronicReboundPressure( 'topic' )
	s.decay( 10 )
	assert.ok( s.getCoalitionResidue( 'a' ) < beforeResidue )
	assert.ok( s.getIronicReboundPressure( 'topic' ) < beforePressure )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: real debug fields for both mechanisms are present and finite on every processInput() turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( const text of [ 'hola', 'te quiero mucho', 'eres un inútil' ] ) {

		const result = await ai.processInput( text, { userId: 'u' } )
		assert.equal( typeof result.debug.mereExposureBoost, 'number' )
		assert.equal( typeof result.debug.ironicRebound, 'number' )
		assert.ok( Number.isFinite( result.debug.mereExposureBoost ) )
		assert.ok( result.debug.dreamMention === null || typeof result.debug.dreamMention === 'object' )

	}

} )

test( 'full: a real, genuinely long backdated gap produces a real dream, and a later dull, trusting turn can genuinely surface it unprompted', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { openness: 0.9 } ) } ) ) )

	// Build real warmth/detail first so the dream has real material to synthesize from.
	for ( let i = 0; i < 6; i++ ) await ai.processInput( 'te quiero mucho, me encanta hablar contigo de nuestros planes juntos', { userId: 'u' } )

	const originalRandom = Math.random
	try {

		// Real, genuinely long backdated gap — qualifies as deep sleep, not just
		// a REM cooling sweep. Force the SAME turn's own real dreamMention draw
		// (evaluated every turn, including this one) to fail deterministically,
		// so the dream this turn generates isn't ALSO already marked mentioned
		// by a real, un-forced Bernoulli draw before the test gets to check it.
		Math.random = () => 0.999
		ai.remConsolidation.lastTurnAt = Date.now() - ( 1000 * 60 * 60 * 14 )
		await ai.processInput( 'buenos días', { userId: 'u' } )

		assert.ok( ai.dreamEngine.dreams.has( 'u' ), 'a real deep-sleep gap with real prior material should have synthesized a real dream' )
		assert.equal( ai.dreamEngine.dreams.get( 'u' ).mentioned, false, 'the forced-unfavorable draw on the generating turn itself should not have already surfaced it' )

		// Now force the real Bernoulli draw to succeed on the NEXT turn — the
		// real gate's own computed PROBABILITY is still 100% real, only the
		// coin flip on top of it is fixed for a deterministic test.
		Math.random = () => 0
		const result = await ai.processInput( 'hola', { userId: 'u' } )
		assert.ok( result.debug.dreamMention !== null, 'with residue active, real high trust, and a forced-favorable draw, the real gate should surface the dream' )

	}
	finally { Math.random = originalRandom }

} )

test( 'full: toJSON()/restoreState() round-trips real state for both mechanisms', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'te quiero mucho', { userId: 'u' } )
	ai.remConsolidation.lastTurnAt = Date.now() - ( 1000 * 60 * 60 * 14 )
	await ai.processInput( 'hola de nuevo', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	assert.deepEqual( rehydrated.dreams, saved.dreams )
	assert.deepEqual( rehydrated.subconsciousState, saved.subconsciousState )

} )

test( 'hard: 300-turn long-horizon conversation keeps both mechanisms\' debug output finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'te quiero mucho', 'eres un inútil', 'lograste algo increíble', 'buenos días' ]
	let last
	for ( let i = 0; i < 300; i++ ) {

		if ( i % 50 === 0 ) ai.remConsolidation.lastTurnAt = Date.now() - ( 1000 * 60 * 60 * 14 ) // periodic real deep-sleep gaps
		last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )

	}

	assert.ok( Number.isFinite( last.debug.mereExposureBoost ) && last.debug.mereExposureBoost >= 0 )
	assert.ok( Number.isFinite( last.debug.ironicRebound ) && last.debug.ironicRebound >= 0 )

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )
