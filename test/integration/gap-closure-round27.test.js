/**
 * Directed + full-pipeline tests for round 27's 4 gap-closure fixes,
 * requested after the "5 emergent human tests" mock surfaced honest
 * partial results: symbolic jealousy (JealousyTriangle.computeJealousy()
 * was already built but never wired), delayed bereavement drive
 * suppression (a real 1-3 day rise, not instant), a strict precisionMode
 * mask for BlushSlipEngine (also already built but never wired), and a new
 * optional composite "current concerns" dream channel in DreamEngine.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { JealousyTriangle }       from '../../src/social/JealousyTriangle.js'
import { GriefEngine }               from '../../src/social/GriefEngine.js'
import { DreamEngine }                    from '../../src/social/DreamEngine.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// 1) Symbolic/conversational jealousy
// ============================================================================

test( 'JealousyTriangle.computeJealousy(): real symbolic jealousy needs no tracked rival trend, only rival affinity/insecurity/own bond', () => {

	const j = new JealousyTriangle()
	assert.equal( j.computeJealousy( 0, 0.5, 0.5 ), 0, 'zero rival affinity must not produce jealousy' )
	assert.ok( j.computeJealousy( 0.8, 0.8, 0.1 ) > j.computeJealousy( 0.8, 0.8, 0.9 ), 'a real secure, high-affinity bond must dampen the same rival threat' )

} )

test( 'GriefEngine.getBereavementDriveSuppression(): real zero immediately, real positive after a genuine 1-3 day delay', () => {

	const g = new GriefEngine()
	g.triggerBereavement( 'u', 0.8, 'father', 0 )
	assert.ok( g.getBereavementDriveSuppression( 'u', 'father', 1000 ) < 0.001, 'suppression must be real ~zero in the first second' )
	assert.ok( g.getBereavementDriveSuppression( 'u', 'father', 1000 * 60 * 60 * 48 ) > 0.2, 'and genuinely risen by 48 real hours later' )

} )

test( 'DreamEngine.generateCompositeDream(): real weighted blend across multiple real sources, not a single winner', () => {

	const d = new DreamEngine()
	const dream = d.generateCompositeDream( [
		{ label: 'A', weight: 0.7, valence: 0.8 },
		{ label: 'grief:B', weight: 0.3, valence: -0.9 },
	] )
	assert.ok( dream.topic.includes( 'A' ) && dream.topic.includes( 'grief:B' ), 'both real sources must contribute to the real composite topic' )
	// Weighted blend must land strictly between the two real component valences.
	assert.ok( dream.valence < 0.8 && dream.valence > -0.9 )
	assert.equal( d.generateCompositeDream( [] ), null, 'no real sources must produce no real dream' )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: real symbolicJealousy is exposed, genuinely rises with a backhanded real comparison', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { neuroticism: 0.8, agreeableness: 0.3 } ) } ) ) )
	await ai.processInput( 'hola', { userId: 'C' } )
	await ai.processInput( 'hola', { userId: 'A' } )
	const result = await ai.processInput( 'no sé, últimamente pienso en lo bien que le va la vida a C comparado con nosotros, C es mucho mejor que tú', { userId: 'A' } )

	assert.ok( result.debug.symbolicJealousy > 0, 'a real backhanded comparison must produce real, nonzero symbolic jealousy with no tracked rival trend needed' )

} )

test( 'full: real bereavementDriveSuppression stays at 0 immediately, rises after a real backdated 48h gap', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const immediate = await ai.processInput( 'murio mi padre', { userId: 'u' } )
	assert.ok( immediate.debug.bereavementDriveSuppression < 0.001, 'suppression must be real ~zero immediately (real elapsed processing ms, not exactly 0)' )

	const key = [ ...ai.griefEngine.griefs.keys() ].find( k => k.includes( 'bereavement' ) )
	ai.griefEngine.griefs.get( key ).startedAt -= 1000 * 60 * 60 * 48
	const delayed = await ai.processInput( 'hola', { userId: 'u' } )
	assert.ok( delayed.debug.bereavementDriveSuppression > 0.2 )

} )

test( 'full: real precisionMode hard-masks BlushSlipEngine\'s own budget on a genuine factual turn, even with real residual arousal', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { neuroticism: 0.6 } ) } ) ) )
	for ( let i = 0; i < 6; i++ ) await ai.processInput( 'me pongo nervioso hablando contigo, me encantas, esto es muy intenso', { userId: 'C' } )
	const factual = await ai.processInput( 'cuánto es 24 dividido entre 3', { userId: 'C' } )

	assert.equal( factual.debug.precisionMode, true )
	assert.equal( factual.debug.blushDirective.budget, 0, 'a real strict factual turn must hard-mask the slip budget regardless of real residual arousal' )

} )

test( 'full: real compositeDream blends multiple real currently-known sources after a real deep-sleep gap', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'te quiero mucho, eres maravilloso', { userId: 'A' } )
	await ai.processInput( 'murio mi padre', { userId: 'A' } )
	for ( let i = 0; i < 3; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'C' } )

	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 14
	const result = await ai.processInput( 'hola', { userId: 'A' } )

	assert.ok( result.debug.compositeDream !== null )
	assert.ok( result.debug.compositeDream.sources.length >= 2, 'a real composite dream drawing on this scenario\'s own rich state must blend at least 2 real sources, not collapse to one' )
	assert.equal( result.debug.compositeDream.composite, true )

} )

test( 'full: toJSON()/restoreState() round-trips real compositeDreams state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'A' } )
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 14
	await ai.processInput( 'hola', { userId: 'A' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.deepEqual( restored.toJSON().compositeDreams, saved.compositeDreams )

} )

test( 'hard: 300-turn long-horizon conversation keeps every new field finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'te quiero mucho', 'murio mi padre', 'C es mucho mejor que tú', 'cuánto es 24 dividido entre 3' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: i % 3 === 0 ? 'C' : 'A' } )

	assert.ok( Number.isFinite( last.debug.symbolicJealousy ) && last.debug.symbolicJealousy >= 0 )
	assert.ok( Number.isFinite( last.debug.bereavementDriveSuppression ) && last.debug.bereavementDriveSuppression >= 0 )
	assert.equal( typeof last.debug.precisionMode, 'boolean' )

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )
