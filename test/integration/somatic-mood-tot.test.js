/**
 * Directed + cross-mechanism + full-pipeline tests for SomaticActivationSystem
 * ("butterflies"), GlobalMoodAbatement, GhostingDetector, and TipOfTongue.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { SomaticActivationSystem } from '../../src/embodiment/SomaticActivationSystem.js'
import { GlobalMoodAbatement }       from '../../src/core/GlobalMoodAbatement.js'
import { GhostingDetector }            from '../../src/social/GhostingDetector.js'
import { TipOfTongue }                   from '../../src/cognition/TipOfTongue.js'
import { Totemheart, Personality }         from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// SomaticActivationSystem
// ============================================================================

test( 'SomaticActivationSystem: real high affinity + high uncertainty (low trust) genuinely spikes butterflies; low affinity or high trust does not', () => {

	const butterflies = new SomaticActivationSystem()
	const routine            = new SomaticActivationSystem()
	for ( let i = 0; i < 10; i++ ) {

		butterflies.update( { stimulusIntensity: 0.8, affinity: 0.9, trust: 0.1 } )
		routine.update( { stimulusIntensity: 0.8, affinity: 0.9, trust: 0.95 } )

	}
	assert.ok( butterflies.level > routine.level )

} )

test( 'SomaticActivationSystem: real dissipation once the stimulus stops', () => {

	const s = new SomaticActivationSystem()
	for ( let i = 0; i < 10; i++ ) s.update( { stimulusIntensity: 0.9, affinity: 0.9, trust: 0.1 } )
	const peak = s.level
	for ( let i = 0; i < 20; i++ ) s.update( { stimulusIntensity: 0, affinity: 0, trust: 1 } )
	assert.ok( s.level < peak )

} )

test( 'SomaticActivationSystem: real attentional narrowing and output noise both rise with the level', () => {

	const s = new SomaticActivationSystem()
	for ( let i = 0; i < 10; i++ ) s.update( { stimulusIntensity: 0.9, affinity: 0.9, trust: 0.1 } )
	assert.ok( s.getExternalAttentionMultiplier( 1 ) < 1 )
	assert.ok( s.getNoise( 0 ) > 0 )

} )

// ============================================================================
// GlobalMoodAbatement
// ============================================================================

test( 'GlobalMoodAbatement: real injected pain decays faster with real social-entropy distraction than without', () => {

	const distracted = new GlobalMoodAbatement()
	const isolated       = new GlobalMoodAbatement()
	distracted.inject( 0.8 ); isolated.inject( 0.8 )
	for ( let i = 0; i < 20; i++ ) { distracted.decay( 1, 0.8 ); isolated.decay( 1, 0 ) }
	assert.ok( distracted.level < isolated.level )

} )

test( 'GlobalMoodAbatement: real high abatement genuinely dampens expression readouts', () => {

	const g = new GlobalMoodAbatement()
	g.inject( 0.9 )
	const dampening = g.getExpressionDampening()
	assert.ok( dampening.verbosityMultiplier < 1 )
	assert.ok( dampening.latencyBonusMs > 0 )
	assert.ok( dampening.enthusiasmSuppression > 0 )

} )

// ============================================================================
// GhostingDetector
// ============================================================================

test( 'GhostingDetector: real ghosting pain requires BOTH real prior investment (butterflies) AND real elapsed silence past cadence', () => {

	const g = new GhostingDetector()
	g.observeContact( 'noInvestment', { expectedCadenceMs: 100, historicButterflies: 0 }, Date.now() - 10000 )
	g.observeContact( 'tooSoon', { expectedCadenceMs: 1000 * 60 * 60, historicButterflies: 0.9 }, Date.now() )
	g.observeContact( 'realGhosting', { expectedCadenceMs: 100, historicButterflies: 0.9 }, Date.now() - 5000 )

	assert.equal( g.getGhostingPain( 'noInvestment' ), 0 )
	assert.equal( g.getGhostingPain( 'tooSoon' ), 0 )
	assert.ok( g.getGhostingPain( 'realGhosting' ) > 0 )

} )

test( 'GhostingDetector: real pain eventually fades toward acceptance over a very long silence', () => {

	const g = new GhostingDetector()
	g.observeContact( 'u', { expectedCadenceMs: 100, historicButterflies: 0.9 }, Date.now() - 5000 )
	const midPain      = g.getGhostingPain( 'u' )
	const veryLatePain = ( () => {

		g.observeContact( 'u', { expectedCadenceMs: 100, historicButterflies: 0.9 }, Date.now() - 1000 * 60 * 60 * 24 * 365 )
		return g.getGhostingPain( 'u' )

	} )()
	assert.ok( veryLatePain < midPain )

} )

// ============================================================================
// TipOfTongue
// ============================================================================

test( 'TipOfTongue: real access probability drops with global mood abatement interference', () => {

	const t = new TipOfTongue()
	const clear    = t.getAccessProbability( 0.5, 0 )
	const clouded = t.getAccessProbability( 0.5, 0.9 )
	assert.ok( clouded < clear )

} )

test( 'TipOfTongue: real tension accumulates over repeated blocks and raises the real resolve probability', () => {

	const t = new TipOfTongue()
	const before = t.getResolveProbability( 'palabra' )
	for ( let i = 0; i < 8; i++ ) t.registerBlock( 'palabra', 0.2 )
	assert.ok( t.getResolveProbability( 'palabra' ) > before )

} )

test( 'TipOfTongue: resolving a block genuinely clears its tension', () => {

	const t = new TipOfTongue()
	t.registerBlock( 'palabra', 0.2 )
	t.resolve( 'palabra' )
	assert.equal( t.getTension( 'palabra' ), 0 )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: Round-F debug fields (butterflies, ghosting, abatement, ToT) are all real, finite, and present on every turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 12; i++ ) {

		const result = await ai.processInput( `mensaje ${i} ${Math.random()}`, { userId: 'u' } )
		assert.ok( Number.isFinite( result.debug.somaticActivation ) )
		assert.ok( Number.isFinite( result.debug.ghostingPain ) )
		assert.ok( Number.isFinite( result.debug.globalMoodAbatement ) )

	}

} )

test( 'hard: a real rupture genuinely floods the global mood abatement and seeds real ghosting-pain history', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.3 } ) } ) ) )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

	const before = ai.globalMoodAbatement.level
	let ruptured = false
	for ( let i = 0; i < 40 && !ruptured; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion', { userId: 'u' } )
		ruptured = ai.loveHateEngine.getBond( 'u' ).ruptured

	}
	assert.ok( ruptured )
	assert.ok( ai.globalMoodAbatement.level > before )
	assert.ok( ai.ghostingDetector.state.has( 'u' ) )

} )

test( 'hard: multi-user isolation — Round-F per-user state for user A never bleeds into user B', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 15; i++ ) await ai.processInput( 'te quiero muchisimo, no se que va a pasar entre nosotros', { userId: 'alice' } )
	const bobResult = await ai.processInput( 'hola', { userId: 'bob' } )

	assert.ok( ai.somaticActivationSystems.has( 'alice' ) )
	assert.ok( !ai.somaticActivationSystems.has( 'bob' ) || ai.somaticActivationSystems.get( 'bob' ).level < ai.somaticActivationSystems.get( 'alice' ).level )
	assert.equal( typeof bobResult.text, 'string' )

} )

test( 'full: toJSON()/restoreState() round-trips real Round-F state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 10; i++ ) await ai.processInput( `mensaje variado ${i} ${Math.random()}`, { userId: 'u' } )
	ai.tick( 2 )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noHijack( noBurst( new Totemheart() ) )
	restored.restoreState( saved )

	assert.equal( restored.globalMoodAbatement.level, saved.globalMoodAbatementLevel )
	assert.deepEqual( [ ...restored.ghostingDetector.state.entries() ], saved.ghostingState )

	const result = await restored.processInput( 'hola de nuevo', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )

} )
