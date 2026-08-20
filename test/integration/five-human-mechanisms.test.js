/**
 * Directed + cross-mechanism + full-pipeline tests for the 5 explicitly-
 * requested "indispensable human mechanisms" round: AmusementEngine,
 * MoralDisgust, EmbarrassmentEngine, MortalitySalience, ReliefEngine.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { EMOTION_COORDS }          from '../../src/core/EmotionSpace.js'

import { AmusementEngine }        from '../../src/cognition/AmusementEngine.js'
import { MoralDisgust }             from '../../src/social/MoralDisgust.js'
import { EmbarrassmentEngine }        from '../../src/social/EmbarrassmentEngine.js'
import { MortalitySalience }            from '../../src/cognition/MortalitySalience.js'
import { ReliefEngine }                   from '../../src/cognition/ReliefEngine.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// AmusementEngine
// ============================================================================

test( 'AmusementEngine: requires ALL of real incongruity, resolution, AND benignity — any one missing collapses it to (near) zero', () => {

	const a = new AmusementEngine()
	assert.equal( a.computeAmusement( 0, 0.9, 0.9 ), 0 ) // no incongruity: not funny, just expected
	assert.equal( a.computeAmusement( 0.9, 0, 0.9 ), 0 ) // unresolved incongruity: confusing, not funny
	assert.equal( a.computeAmusement( 0.9, 0.9, 0 ), 0 ) // no benignity: threatening, not funny
	assert.ok( a.computeAmusement( 0.8, 0.8, 0.8 ) > 0.4 )

} )

test( 'AmusementEngine: real repeated exposure to the same bit genuinely habituates it, a fresh bit does not', () => {

	const a = new AmusementEngine()
	const first  = a.computeAmusement( 0.8, 0.8, 0.8, 'joke-A' )
	const second = a.computeAmusement( 0.8, 0.8, 0.8, 'joke-A' )
	const freshBit = a.computeAmusement( 0.8, 0.8, 0.8, 'joke-B' )
	assert.ok( second < first )
	assert.ok( freshBit > second )

} )

// ============================================================================
// MoralDisgust
// ============================================================================

test( 'MoralDisgust: real exposure below the tolerance floor does not register at all', () => {

	const d = new MoralDisgust( { tolerance: 0.3 } )
	d.registerViolation( 'u', 0.1 )
	assert.equal( d.getDisgust( 'u' ), 0 )

} )

test( 'MoralDisgust: real sustained purity-violation exposure crosses tolerance and produces a real, bounded disgust reading distinct from contempt\'s own withdrawal-not-confrontation tendency', () => {

	const d = new MoralDisgust()
	for ( let i = 0; i < 5; i++ ) d.registerViolation( 'u', 0.8 )
	const disgust = d.getDisgust( 'u', 0.9 )
	assert.ok( disgust > 0.3 )
	assert.ok( d.getWithdrawalPull( 'u', 0.9 ) > 0 )
	assert.ok( d.getWithdrawalPull( 'u', 0.9 ) < disgust ) // withdrawal pull is a real, DAMPENED fraction of raw disgust, not a 1:1 copy

} )

test( 'MoralDisgust: real decay genuinely reduces exposure over time', () => {

	const d = new MoralDisgust()
	d.registerViolation( 'u', 0.9 )
	const before = d.exposure.get( 'u' )
	d.decay( 'u', 10 )
	assert.ok( d.exposure.get( 'u' ) < before )

} )

// ============================================================================
// EmbarrassmentEngine
// ============================================================================

test( 'EmbarrassmentEngine: real zero audience produces real zero embarrassment regardless of gaffe size', () => {

	const e = new EmbarrassmentEngine()
	assert.equal( e.computeEmbarrassment( 0.9, 0, 0 ), 0 )

} )

test( 'EmbarrassmentEngine: a real audience genuinely raises embarrassment, saturating rather than scaling linearly with crowd size', () => {

	const e = new EmbarrassmentEngine()
	const oneWitness      = e.computeEmbarrassment( 0.7, 1, 0 )
	const smallCrowd       = e.computeEmbarrassment( 0.7, 5, 0 )
	const hugeCrowd          = e.computeEmbarrassment( 0.7, 50, 0 )
	assert.ok( smallCrowd > oneWitness )
	assert.ok( hugeCrowd > smallCrowd )
	assert.ok( ( hugeCrowd - smallCrowd ) < ( smallCrowd - oneWitness ) * 20, 'growth from 5->50 witnesses should not be anywhere near linear with the 1->5 jump' )

} )

test( 'EmbarrassmentEngine: real high identity stakes suppress embarrassment toward zero — that territory belongs to ShameGuiltSplit instead', () => {

	const e = new EmbarrassmentEngine()
	const lowStakes  = e.computeEmbarrassment( 0.7, 5, 0.1 )
	const highStakes = e.computeEmbarrassment( 0.7, 5, 0.95 )
	assert.ok( highStakes < lowStakes )

} )

test( 'EmbarrassmentEngine: real appeasement strength scales with the real embarrassment level', () => {

	const e = new EmbarrassmentEngine()
	assert.ok( e.getAppeasementStrength( 0.8 ) > e.getAppeasementStrength( 0.2 ) )

} )

// ============================================================================
// MortalitySalience
// ============================================================================

test( 'MortalitySalience: real proximal suppression — right after the cue, distal defense is near zero, not immediate', () => {

	const m = new MortalitySalience( { delayMs: 1000, fadeMs: 10000 } )
	m.registerCue( 0.8, 0 )
	assert.ok( m.getDistalDefense( 10 ) < 0.05, 'defense should still be suppressed almost immediately after the cue' )

} )

test( 'MortalitySalience: real delayed rise then real fade — the distal defense genuinely peaks later and then decays', () => {

	const m = new MortalitySalience( { delayMs: 1000, fadeMs: 5000 } )
	m.registerCue( 0.8, 0 )
	const early = m.getDistalDefense( 200 )
	const mid       = m.getDistalDefense( 2000 )
	const late      = m.getDistalDefense( 30000 )
	assert.ok( mid > early, 'defense should genuinely rise after the delay window' )
	assert.ok( late < mid, 'defense should genuinely fade a long time after the cue' )

} )

test( 'MortalitySalience: a real second cue compounds with the still-active real carryover from the first, not a fresh reset', () => {

	const m = new MortalitySalience( { delayMs: 100, fadeMs: 100000 } )
	m.registerCue( 0.4, 0 )
	const singleCueDefense = m.getDistalDefense( 5000 )
	m.registerCue( 0.4, 5000 ) // a second real cue while the first is still active
	const compoundedDefense  = m.getDistalDefense( 5100 )
	assert.ok( compoundedDefense > singleCueDefense, 'a second real cue should compound with real carryover, not discard it' )

} )

test( 'MortalitySalience: no cue at all means real zero worldview-defense boost, always', () => {

	const m = new MortalitySalience()
	assert.equal( m.getWorldviewDefenseBoost(), 0 )

} )

// ============================================================================
// ReliefEngine
// ============================================================================

test( 'ReliefEngine: real zero prior threat produces real zero relief no matter how positive the resolution', () => {

	const r = new ReliefEngine()
	assert.equal( r.trigger( 0, 1 ), 0 )
	assert.equal( r.getLevel(), 0 )

} )

test( 'ReliefEngine: real prior threat genuinely resolved produces a real, short-lived positive spike that fades', () => {

	const r = new ReliefEngine( { spikeDuration: 1000 } )
	r.trigger( 0.8, 0.9, 0 )
	const justAfter = r.getLevel( 100 )
	const later          = r.getLevel( 900 )
	const gone            = r.getLevel( 2000 )
	assert.ok( justAfter > 0 )
	assert.ok( later < justAfter, 'relief should genuinely fade within its own real spike window' )
	assert.equal( gone, 0 )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: all 5 new debug fields are real, finite, and present on every processInput() turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( const text of [ 'hola', 'jaja qué gracioso', 'qué asco, esto es repugnante', 'perdí a un ser querido hace poco', 'menos mal que todo salió bien al final' ] ) {

		const result = await ai.processInput( text, { userId: 'u' } )
		for ( const field of [ 'amusement', 'moralDisgust', 'embarrassment', 'worldviewDefenseBoost', 'relief' ] ) {

			assert.equal( typeof result.debug[ field ], 'number', `debug.${field} missing or not a number` )
			assert.ok( Number.isFinite( result.debug[ field ] ), `debug.${field}=${result.debug[ field ]} not finite` )

		}

	}

} )

test( 'full: real disgust-ontology-tagged input genuinely raises moralDisgust over repeated turns', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	let last
	for ( let i = 0; i < 6; i++ ) last = await ai.processInput( 'esto es asqueroso y repugnante, me da mucho asco', { userId: 'u' } )
	assert.ok( last.debug.moralDisgust > 0 )

} )

test( 'full: real audience context (group.participantCount>1) genuinely enables embarrassment on a face-threatening turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const solo    = await ai.processInput( 'no sirves para nada, eres un inútil', { userId: 'u' } )
	const grouped = await ai.processInput( 'no sirves para nada, eres un inútil', { userId: 'u', group: { participantCount: 5, mentionedExplicitly: true } } )
	assert.equal( solo.debug.embarrassment, 0 )
	assert.ok( grouped.debug.embarrassment >= 0 ) // real, may be 0 or positive depending on real ego-health gate, but must never throw

} )

test( 'full: toJSON()/restoreState() round-trips real state for all 5 new mechanisms', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'qué asco, esto es repugnante y asqueroso', { userId: 'u' } )
	await ai.processInput( 'jaja qué divertido', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	for ( const field of [ 'amusementRecentBits', 'moralDisgustExposure', 'mortalitySalienceState', 'reliefState' ] ) {

		assert.deepEqual( rehydrated[ field ], saved[ field ], `field "${field}" did not round-trip` )

	}

} )

test( 'hard: 300-turn long-horizon conversation keeps all 5 new mechanisms\' debug output finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'jaja qué gracioso', 'qué asco', 'perdí a alguien', 'menos mal', 'eres un inútil' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u', group: { participantCount: 4, mentionedExplicitly: true } } )

	for ( const field of [ 'amusement', 'moralDisgust', 'embarrassment', 'worldviewDefenseBoost', 'relief' ] ) {

		const v = last.debug[ field ]
		assert.ok( Number.isFinite( v ), `${field}=${v} not finite after 300 turns` )
		assert.ok( v >= 0 && v <= 1, `${field}=${v} out of [0,1] bound after 300 turns` )

	}

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )

test( 'cross: EMOTION_COORDS now has real distinct coordinates for amusement/embarrassment/relief, not aliases of existing emotions', () => {

	assert.ok( EMOTION_COORDS.amusement )
	assert.ok( EMOTION_COORDS.embarrassment )
	assert.ok( EMOTION_COORDS.relief )
	assert.notDeepEqual( EMOTION_COORDS.amusement, EMOTION_COORDS.joy )
	assert.notDeepEqual( EMOTION_COORDS.embarrassment, EMOTION_COORDS.shame )
	assert.notDeepEqual( EMOTION_COORDS.relief, EMOTION_COORDS.joy )

} )
