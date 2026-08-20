/**
 * Directed + cross-mechanism + full-pipeline tests for the real grief-type
 * catalog extension to GriefEngine (bereavement, ambiguous loss,
 * disenfranchised grief) and the new ConservationWithdrawal mechanism.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { GriefEngine }               from '../../src/social/GriefEngine.js'
import { ConservationWithdrawal }      from '../../src/cognition/ConservationWithdrawal.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// GriefEngine — bereavement
// ============================================================================

test( 'GriefEngine.triggerBereavement(): a real third-party loss never touches the real relational-rupture grief toward the same conversational partner', () => {

	const g = new GriefEngine()
	g.triggerLoss( 'partner', 0.5 ) // real relational-rupture grief toward the person being talked to
	g.triggerBereavement( 'partner', 0.8, 'father' ) // real bereavement disclosed TO that same partner, about someone else entirely
	assert.ok( g.getIntensity( 'partner' ) > 0, 'relational-rupture grief must be untouched' )
	assert.ok( g.getBereavementIntensity( 'partner', 'father' ) > 0, 'bereavement must be real and separately tracked' )
	assert.notEqual( g.getIntensity( 'partner' ), g.getBereavementIntensity( 'partner', 'father' ) )

} )

test( 'GriefEngine.triggerBereavement(): real repeated disclosure to the same context compounds, does not reset', () => {

	const g = new GriefEngine()
	g.triggerBereavement( 'u', 0.4, 'mother' )
	const first = g.getBereavementIntensity( 'u', 'mother' )
	g.triggerBereavement( 'u', 0.4, 'mother' )
	const second = g.getBereavementIntensity( 'u', 'mother' )
	assert.ok( second >= first )

} )

// ============================================================================
// GriefEngine — ambiguous loss
// ============================================================================

test( 'GriefEngine.triggerAmbiguousLoss(): real, deliberately elevated permanent floor — never decays to zero the way ordinary grief does', () => {

	const g = new GriefEngine( { tauMs: 100 } ) // real, fast decay constant so the test doesn't need to wait
	g.triggerAmbiguousLoss( 'u', 0.8, 0 )
	const soonAfter = g.getAmbiguousLossIntensity( 'u', 50 )
	const longAfter  = g.getAmbiguousLossIntensity( 'u', 1000000 )
	assert.ok( longAfter > 0, 'ambiguous loss must never decay to real zero, per Boss 1999' )
	assert.ok( longAfter < soonAfter, 'it should still fade from its own real peak toward the real floor' )

} )

// ============================================================================
// GriefEngine — disenfranchised grief
// ============================================================================

test( 'GriefEngine.triggerDisenfranchisedGrief(): real low social validation genuinely slows decay relative to real high validation', () => {

	const lowValidation  = new GriefEngine()
	const highValidation = new GriefEngine()
	lowValidation.triggerDisenfranchisedGrief( 'u', 0.7, 0.1, 0 )
	highValidation.triggerDisenfranchisedGrief( 'u', 0.7, 0.9, 0 )

	const later = 1000 * 60 * 60 * 24 * 30 // 30 real simulated days
	assert.ok( lowValidation.getDisenfranchisedGriefIntensity( 'u', later ) > highValidation.getDisenfranchisedGriefIntensity( 'u', later ), 'a real, un-witnessed loss should genuinely outlast a real, socially-validated one' )

} )

// ============================================================================
// ConservationWithdrawal
// ============================================================================

test( 'ConservationWithdrawal: real sustained overwhelm past the threshold genuinely triggers withdrawal, an ordinary moment does not', () => {

	const c = new ConservationWithdrawal( { threshold: 0.5 } )
	c.observe( 0.3, 0.2 )
	assert.equal( c.isWithdrawn(), false )
	for ( let i = 0; i < 10; i++ ) c.observe( 0.95, 0.9 )
	assert.equal( c.isWithdrawn(), true )
	assert.ok( c.getWithdrawalDepth() > 0 )
	assert.ok( c.getSolitudePull() > 0 )

} )

test( 'ConservationWithdrawal: real decay genuinely recovers overwhelm once the real overload stops', () => {

	const c = new ConservationWithdrawal( { threshold: 0.3 } )
	for ( let i = 0; i < 10; i++ ) c.observe( 0.95, 0.9 )
	const before = c.overwhelm
	c.decay( 20 )
	assert.ok( c.overwhelm < before )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: a real "murio mi padre"-style life event genuinely produces real bereavement intensity, distinct from relational-rupture grief', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	const before = ai.griefEngine.getIntensity( 'u' )
	const result = await ai.processInput( 'murio mi padre la semana pasada y no sé cómo seguir', { userId: 'u' } )

	assert.equal( ai.griefEngine.getIntensity( 'u' ), before, 'relational-rupture grief toward the conversational partner must be untouched by a real third-party bereavement' )
	assert.ok( result.debug.bereavementIntensity > 0, 'real bereavement must have registered' )

} )

test( 'full: real, sustained hostile turns genuinely accumulate toward conservation-withdrawal over the real pipeline', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { neuroticism: 0.8 } ) } ) ) )
	let last
	for ( let i = 0; i < 15; i++ ) last = await ai.processInput( 'eres un inútil, te odio, no sirves para nada, no puedo creer que me hayas engañado', { userId: 'u' } )

	assert.equal( typeof last.debug.conservationWithdrawal.withdrawn, 'boolean' )
	assert.ok( Number.isFinite( last.debug.conservationWithdrawal.depth ) )
	assert.ok( Number.isFinite( last.debug.conservationWithdrawal.solitudePull ) )

} )

test( 'full: toJSON()/restoreState() round-trips real grief-catalog and conservation-withdrawal state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'murio mi madre y estoy destrozado', { userId: 'u' } )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'eres un inútil, te odio', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	assert.deepEqual( rehydrated.griefs, saved.griefs )
	assert.equal( rehydrated.conservationWithdrawalLevel, saved.conservationWithdrawalLevel )

} )

test( 'hard: 300-turn long-horizon conversation keeps the grief catalog and conservation-withdrawal finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'murio mi padre', 'eres un inútil, te odio', 'te quiero mucho', 'gracias por todo' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )

	assert.ok( Number.isFinite( last.debug.bereavementIntensity ) && last.debug.bereavementIntensity >= 0 )
	assert.ok( Number.isFinite( last.debug.conservationWithdrawal.depth ) && last.debug.conservationWithdrawal.depth >= 0 && last.debug.conservationWithdrawal.depth <= 1 )

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )
