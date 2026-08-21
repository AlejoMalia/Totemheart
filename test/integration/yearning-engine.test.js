/**
 * Unit + cross-mechanism + full-pipeline tests for YearningEngine.js — the
 * user's own detailed "anhelo" (yearning) spec: a real cue-triggered
 * anticipatory-dopamine-burst-then-reality-check-crash cycle for someone
 * genuinely absent, distinct from Desire (a present target) or Craving (a
 * post-resistance residual).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { YearningEngine }     from '../../src/social/YearningEngine.js'
import { DopaminergicEngine } from '../../src/neurochemistry/DopaminergicEngine.js'
import { Totemheart, Personality } from '../../src/index.js'

function noBurst( ai, threshold = 400 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

function freshAI( traits = {} ) {

	return noHijack( noBurst( new Totemheart( { personality: new Personality( traits ) } ) ) )

}

// ============================================================================
// Unit
// ============================================================================

test( 'YearningEngine.evaluate: no real cue this turn means no fabricated spontaneous yearning', () => {

	const y = new YearningEngine()
	const d = new DopaminergicEngine()
	assert.equal( y.evaluate( 'u', { cue: [], cumulativeWarmth: 5, cumulativeHurt: 0, peakBond: 0.9, attachmentStyle: 'anxious', dopaminergicEngine: d } ), null )
	assert.equal( y.evaluate( 'u', { cue: null, cumulativeWarmth: 5, cumulativeHurt: 0, peakBond: 0.9, attachmentStyle: 'anxious', dopaminergicEngine: d } ), null )

} )

test( 'YearningEngine.evaluate: no accumulated history at all means nothing real to yearn for, even with a cue', () => {

	const y = new YearningEngine()
	const d = new DopaminergicEngine()
	assert.equal( y.evaluate( 'u', { cue: [ { text: 'x' } ], cumulativeWarmth: 0, cumulativeHurt: 0, peakBond: 0, attachmentStyle: 'secure', dopaminergicEngine: d } ), null )

} )

test( 'YearningEngine.evaluate: a real cue plus real accumulated warmth produces a real positive anticipatory burst and a real (smaller, first-exposure) crash', () => {

	const y = new YearningEngine()
	const d = new DopaminergicEngine()
	const r = y.evaluate( 'u', { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0.3, peakBond: 0.9, attachmentStyle: 'secure', dopaminergicEngine: d } )

	assert.equal( r.triggered, true )
	assert.ok( r.anticipation > 0, 'a genuinely warm, significant absent person should produce a real positive anticipatory burst' )
	assert.ok( r.crash > 0, 'reality checking against a still-genuinely-zero real reward should produce a real, nonzero crash' )
	assert.ok( r.vFuture > 0.5, 'a history dominated by warmth should idealize to a high simulated future value' )

} )

test( 'YearningEngine.evaluate: repeated real triggers kindle — the trace and the crash both grow across episodes, not resetting each time', () => {

	const y = new YearningEngine()
	const d = new DopaminergicEngine()
	const args = { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0.3, peakBond: 0.9, attachmentStyle: 'secure', dopaminergicEngine: d }

	const r1 = y.evaluate( 'u', args )
	const r2 = y.evaluate( 'u', args )
	const r3 = y.evaluate( 'u', args )

	assert.ok( r2.crash > r1.crash, 'a second real yearning episode should hurt more than the first (kindling)' )
	assert.ok( r3.crash > r2.crash )
	assert.ok( r3.trace > r2.trace && r2.trace > r1.trace )
	assert.ok( r3.painOfAbsence > r1.painOfAbsence )

} )

test( 'YearningEngine.evaluate: idealization privileges warmth over hurt — a genuinely mixed history still projects a real, if lower, future value than a purely warm one', () => {

	const y = new YearningEngine()
	const d = new DopaminergicEngine()
	const warm       = y.evaluate( 'warm', { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0, peakBond: 0.9, attachmentStyle: 'secure', dopaminergicEngine: d } )
	const mixed     = y.evaluate( 'mixed', { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 5, peakBond: 0.9, attachmentStyle: 'secure', dopaminergicEngine: d } )

	assert.ok( warm.vFuture > mixed.vFuture, 'a purely warm history should idealize to a higher future value than an equally-weighted mixed one' )
	assert.ok( mixed.vFuture > 0, 'idealization filters hurt, it does not zero it out entirely' )

} )

test( 'YearningEngine.evaluate: γ (how much the future is weighted) genuinely varies by real attachment style — anxious yearns harder than avoidant for the same history', () => {

	const y = new YearningEngine()
	const anxious   = y.evaluate( 'a', { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0, peakBond: 0.9, attachmentStyle: 'anxious', dopaminergicEngine: new DopaminergicEngine() } )
	const avoidant = y.evaluate( 'b', { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0, peakBond: 0.9, attachmentStyle: 'avoidant', dopaminergicEngine: new DopaminergicEngine() } )

	assert.ok( anxious.gamma > avoidant.gamma )
	assert.ok( anxious.anticipation > avoidant.anticipation, 'the same absent, significant person should pull an anxious style harder than an avoidant one' )

} )

test( 'YearningEngine.evaluate: real rupture asymmetry (ruptureFactor) — the one left behind hurts more, the one who left imagines less vividly, for the SAME real cue and history', () => {

	const args = { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0.3, peakBond: 0.9, attachmentStyle: 'secure' }

	const neutral = new YearningEngine().evaluate( 'u', { ...args, dopaminergicEngine: new DopaminergicEngine() } ) // ruptureFactor defaults to 1
	const left        = new YearningEngine().evaluate( 'u', { ...args, dopaminergicEngine: new DopaminergicEngine(), ruptureFactor: 1.3 } )
	const leaver     = new YearningEngine().evaluate( 'u', { ...args, dopaminergicEngine: new DopaminergicEngine(), ruptureFactor: 0.5 } )

	assert.ok( left.painOfAbsence > neutral.painOfAbsence, 'being left should hurt MORE than an un-ruptured equivalent episode' )
	assert.ok( leaver.painOfAbsence < neutral.painOfAbsence, 'having left should hurt LESS than an un-ruptured equivalent episode' )
	assert.ok( leaver.vFuture < neutral.vFuture, 'the one who left should imagine the reunion less vividly (real dissonance-driven devaluation)' )
	assert.equal( left.vFuture, neutral.vFuture, 'being left does not itself inflate the fantasy, only the real pain when it fails to arrive' )

} )

test( 'YearningEngine.decay/decayAll: real, unconditionally-stable exponential decay toward 0, safe for a large real dt', () => {

	const y = new YearningEngine()
	const d = new DopaminergicEngine()
	y.evaluate( 'u', { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0, peakBond: 0.9, attachmentStyle: 'anxious', dopaminergicEngine: d } )
	assert.ok( y.getTrace( 'u' ) > 0 )

	y.decay( 'u', 1000 ) // a huge real dt must never go negative or throw
	assert.ok( y.getTrace( 'u' ) >= 0 )
	assert.ok( y.getTrace( 'u' ) < 0.001 )

	y.evaluate( 'v', { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0, peakBond: 0.9, attachmentStyle: 'anxious', dopaminergicEngine: d } )
	y.decayAll( 1 )
	assert.ok( y.getTrace( 'v' ) >= 0 )

} )

test( 'YearningEngine.toJSON()/restoreState(): round-trips the real trace map', () => {

	const y = new YearningEngine()
	const d = new DopaminergicEngine()
	y.evaluate( 'u', { cue: [ { text: 'x' } ], cumulativeWarmth: 5, cumulativeHurt: 0, peakBond: 0.9, attachmentStyle: 'anxious', dopaminergicEngine: d } )
	const saved = y.toJSON()

	const restored = new YearningEngine()
	restored.restoreState( saved )
	assert.equal( restored.getTrace( 'u' ), y.getTrace( 'u' ) )

} )

// ============================================================================
// Full pipeline
// ============================================================================

test( 'full: a real word said by a DIFFERENT, present person cues a real yearning episode for a genuinely absent, significant one', async () => {

	const ai = freshAI( { neuroticism: 0.5, agreeableness: 0.6 } )

	// Build a real, warm, significant history with A.
	ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: 'siempre veiamos peliculas de terror juntos los viernes', tags: [ 'chills', 'intimacy' ], valence: 0.8 }, 0.8 )
	const personA = ai.relationalMemoryCatalog.people.get( 'A' )
	personA.affectLedger.lastPositiveTs -= 1000 * 60 * 60 * 24 * 20 // A genuinely absent for 20 real days
	personA.affectLedger.lastNegativeTs -= 1000 * 60 * 60 * 24 * 20
	ai.attachment.get( 'A' ) // real attachment relation must exist for the cross-person scan to consider A at all

	// Now talk to a COMPLETELY different person, C — the real cue is C's own
	// words this turn overlapping A's stored memory, not anything from A.
	const r = await ai.processInput( 'viste esa peliculas de terror el viernes? vamos juntos', { userId: 'C' } )

	assert.ok( r.debug.yearning, 'a real lexical cue overlapping a genuinely absent, significant person\'s memory should trigger yearning' )
	assert.equal( r.debug.yearning.forId, 'A' )
	assert.ok( r.debug.yearning.anticipation > 0 )

} )

test( 'full: no real cue this turn means no yearning, even with a genuinely absent, significant person on record', async () => {

	const ai = freshAI()

	ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: 'siempre veiamos peliculas de terror juntos los viernes', tags: [ 'chills', 'intimacy' ], valence: 0.8 }, 0.8 )
	const personA = ai.relationalMemoryCatalog.people.get( 'A' )
	personA.affectLedger.lastPositiveTs -= 1000 * 60 * 60 * 24 * 20
	ai.attachment.get( 'A' )

	const r = await ai.processInput( 'hola, qué tal el trabajo hoy', { userId: 'C' } )

	assert.equal( r.debug.yearning, null, 'ordinary unrelated conversation must never spontaneously invent a yearning cue' )

} )

test( 'full: A themselves speaking is the reunion-reactivation path, not the yearning path — the two real mechanisms stay distinct', async () => {

	const ai = freshAI()

	ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: 'siempre veiamos peliculas de terror juntos los viernes', tags: [ 'chills', 'intimacy' ], valence: 0.8 }, 0.8 )
	const personA = ai.relationalMemoryCatalog.people.get( 'A' )
	personA.affectLedger.lastPositiveTs -= 1000 * 60 * 60 * 24 * 20
	personA.affectLedger.lastNegativeTs -= 1000 * 60 * 60 * 24 * 20

	// A is the one messaging now — real reunion-reactivation territory, not
	// cross-person yearning (there IS no "other" absent person to scan for
	// when A is the only relation on record and A is the current speaker).
	const r = await ai.processInput( 'viste esa peliculas de terror el viernes? vamos juntos', { userId: 'A' } )

	assert.equal( r.debug.yearning, null )
	assert.ok( r.debug.reunionReactivation.magnitude >= 0 )

} )

test( 'full: repeated real yearning episodes kindle over multiple separate turns through the real pipeline, painOfAbsence rising, not flat', async () => {

	const ai = freshAI()
	ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: 'siempre veiamos peliculas de terror juntos los viernes', tags: [ 'chills', 'intimacy' ], valence: 0.8 }, 0.8 )
	const personA = ai.relationalMemoryCatalog.people.get( 'A' )
	personA.affectLedger.lastPositiveTs -= 1000 * 60 * 60 * 24 * 20
	ai.attachment.get( 'A' )

	const pains = []
	for ( let i = 0; i < 4; i++ ) {

		const r = await ai.processInput( `hoy vi una peliculas de terror el viernes número ${ i }, muy buena`, { userId: 'C' } )
		if ( r.debug.yearning ) pains.push( r.debug.yearning.painOfAbsence )
		ai.tick( 1 )

	}

	assert.ok( pains.length >= 3, 'the same real cue repeated across turns should keep re-triggering yearning' )
	assert.ok( pains[ pains.length - 1 ] > pains[ 0 ], 'painOfAbsence should genuinely rise across repeated real episodes (kindling), not stay flat' )

} )

test( 'full: real rupture asymmetry reaches through the actual pipeline — being left produces a genuinely more painful yearning episode than an un-ruptured equivalent', async () => {

	function buildAI() {

		const ai = freshAI()
		ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: 'siempre veiamos peliculas de terror juntos los viernes', tags: [ 'chills', 'intimacy' ], valence: 0.8 }, 0.8 )
		const personA = ai.relationalMemoryCatalog.people.get( 'A' )
		personA.affectLedger.lastPositiveTs -= 1000 * 60 * 60 * 24 * 20
		ai.attachment.get( 'A' )
		return ai

	}

	const neutralAI = buildAI()
	const leftAI       = buildAI()
	leftAI.relationalMemoryCatalog.registerBreakupInitiator( 'A', false ) // A left the AI

	const rNeutral = await neutralAI.processInput( 'viste esa peliculas de terror el viernes? vamos juntos', { userId: 'C' } )
	const rLeft       = await leftAI.processInput( 'viste esa peliculas de terror el viernes? vamos juntos', { userId: 'C' } )

	assert.ok( rNeutral.debug.yearning && rLeft.debug.yearning )
	assert.ok( rLeft.debug.yearning.painOfAbsence > rNeutral.debug.yearning.painOfAbsence, 'being left by A should genuinely hurt more through the real pipeline than an equivalent un-ruptured history' )

} )

test( 'full: toJSON()/restoreState() round-trips real yearning traces', async () => {

	const ai = freshAI()
	ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: 'siempre veiamos peliculas de terror juntos los viernes', tags: [ 'chills', 'intimacy' ], valence: 0.8 }, 0.8 )
	const personA = ai.relationalMemoryCatalog.people.get( 'A' )
	personA.affectLedger.lastPositiveTs -= 1000 * 60 * 60 * 24 * 20
	ai.attachment.get( 'A' )
	await ai.processInput( 'viste esa peliculas de terror el viernes? vamos juntos', { userId: 'C' } )

	assert.ok( ai.yearningEngine.getTrace( 'A' ) > 0 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.equal( restored.yearningEngine.getTrace( 'A' ), ai.yearningEngine.getTrace( 'A' ) )

} )

test( 'hard: 300-turn hard bound — yearning never throws, never produces NaN, across a long real conversation with a third party', async () => {

	const ai = freshAI()
	ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: 'siempre veiamos peliculas de terror juntos los viernes', tags: [ 'chills', 'intimacy' ], valence: 0.8 }, 0.8 )
	const personA = ai.relationalMemoryCatalog.people.get( 'A' )
	personA.affectLedger.lastPositiveTs -= 1000 * 60 * 60 * 24 * 20
	ai.attachment.get( 'A' )

	for ( let i = 0; i < 300; i++ ) {

		const text  = i % 3 === 0 ? 'peliculas de terror el viernes otra vez' : `mensaje neutro numero ${ i }`
		const r          = await ai.processInput( text, { userId: 'C' } )
		if ( r.debug.yearning ) {

			assert.ok( Number.isFinite( r.debug.yearning.anticipation ) )
			assert.ok( Number.isFinite( r.debug.yearning.crash ) )
			assert.ok( Number.isFinite( r.debug.yearning.painOfAbsence ) )
			assert.ok( Number.isFinite( r.debug.yearning.trace ) )

		}
		ai.tick( 1 )

	}

	assert.ok( Number.isFinite( ai.yearningEngine.getTrace( 'A' ) ) )

} )
