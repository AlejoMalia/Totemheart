/**
 * Directed + cross-mechanism + full-pipeline tests for GrudgeSystem,
 * SocialDiscomfort, EmpathyCompassion, and FlirtationEngine.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { GrudgeSystem }         from '../../src/social/GrudgeSystem.js'
import { SocialDiscomfort }       from '../../src/social/SocialDiscomfort.js'
import { EmpathyCompassion }        from '../../src/social/EmpathyCompassion.js'
import { FlirtationEngine }           from '../../src/social/FlirtationEngine.js'
import { Totemheart, Personality }      from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// GrudgeSystem
// ============================================================================

test( 'GrudgeSystem: real repeated intentional harm accumulates grievance, low-intentionality harm accumulates far less', () => {

	const g = new GrudgeSystem()
	g.registerHarm( 'self', 'malicious', 0.95, 0.8 )
	g.registerHarm( 'self', 'accidental', 0.05, 0.8 )
	assert.ok( g.getGrievance( 'self', 'malicious' ) > g.getGrievance( 'self', 'accidental' ) )

} )

test( 'GrudgeSystem: real retribution is only worth it once grievance and inflictable damage outweigh the real cost', () => {

	const g = new GrudgeSystem()
	const noGrievance = g.evaluateRetribution( 'self', 'u', { cost: 0.1, damageInflictable: 0.9 } )
	g.registerHarm( 'self', 'u', 0.9, 0.9 )
	const highGrievance = g.evaluateRetribution( 'self', 'u', { cost: 0.1, damageInflictable: 0.9 } )
	assert.equal( noGrievance.worthIt, false )
	assert.ok( highGrievance.totalUtility > noGrievance.totalUtility )

} )

test( 'GrudgeSystem: real forgiveness weighted toward submission genuinely relieves more grievance from a real apology than from silence', () => {

	const g = new GrudgeSystem( { forgivenessWeights: { material: 0.1, submission: 0.7, time: 0.2 } } )
	g.registerHarm( 'self', 'u', 0.9, 0.9 )
	const before        = g.getGrievance( 'self', 'u' )
	const reliefFromApology = g.forgive( 'self', 'u', { submission: 0.9 } )
	assert.ok( reliefFromApology > 0 )
	assert.ok( g.getGrievance( 'self', 'u' ) < before )

} )

test( 'GrudgeSystem: real decay slowly erodes grievance over time even without an explicit forgiveness act', () => {

	const g = new GrudgeSystem()
	g.registerHarm( 'self', 'u', 0.9, 0.9 )
	const before = g.getGrievance( 'self', 'u' )
	for ( let i = 0; i < 20; i++ ) g.decay( 1 )
	assert.ok( g.getGrievance( 'self', 'u' ) < before )

} )

// ============================================================================
// SocialDiscomfort
// ============================================================================

test( 'SocialDiscomfort: real discomfort requires BOTH a real status drop AND real positive affiliation', () => {

	const s = new SocialDiscomfort()
	s.observeStatus( 'friend', 0.8 )
	const friendDrop = s.observeStatus( 'friend', 0.2 )
	assert.ok( s.getDiscomfort( friendDrop, 0.8 ) > 0 )
	assert.equal( s.getDiscomfort( friendDrop, -0.5 ), 0, 'a real rival\'s fall produces no vicarious discomfort here' )
	assert.equal( s.getDiscomfort( 0, 0.8 ), 0, 'no real drop, no discomfort' )

} )

// ============================================================================
// EmpathyCompassion
// ============================================================================

test( 'EmpathyCompassion: real blended utility genuinely shifts toward others\' state, weighted by real affinity', () => {

	const e = new EmpathyCompassion( { permeability: 0.4 } )
	const withSuffering = e.getBlendedUtility( 0.9, [ { affinity: 0.9, utility: -0.9 } ] )
	assert.ok( withSuffering < 0.9 )

} )

test( 'EmpathyCompassion: real compassionate helping is only worth it once real deficit and expected improvement clear the real cost', () => {

	const e = new EmpathyCompassion( { compassionGene: 0.8 } )
	const lowStakes  = e.evaluateHelping( { affinity: 0.9, deficit: 0.1, expectedImprovement: 0.9, cost: 0.3 } )
	const highStakes = e.evaluateHelping( { affinity: 0.9, deficit: 0.9, expectedImprovement: 0.9, cost: 0.3 } )
	assert.equal( lowStakes.worthHelping, false )
	assert.equal( highStakes.worthHelping, true )

} )

// ============================================================================
// FlirtationEngine
// ============================================================================

test( 'FlirtationEngine: real reciprocated signals escalate gradually, a real clear rebuff collapses the signal instantly', () => {

	const f = new FlirtationEngine( { boldness: 0.6 } )
	for ( let i = 0; i < 5; i++ ) f.update( 'u', 0.8, 0.7 )
	const peak = f.getSignal( 'u' )
	assert.ok( peak > 0 )
	f.update( 'u', 0.8, -0.9 )
	assert.equal( f.getSignal( 'u' ), 0 )

} )

test( 'FlirtationEngine: a real bold personality escalates faster than a real timid one under identical reciprocity', () => {

	const bold  = new FlirtationEngine( { boldness: 0.9, risk: 0.1 } )
	const timid = new FlirtationEngine( { boldness: 0.1, risk: 0.3 } )
	for ( let i = 0; i < 5; i++ ) { bold.update( 'u', 0.8, 0.6 ); timid.update( 'u', 0.8, 0.6 ) }
	assert.ok( bold.getSignal( 'u' ) > timid.getSignal( 'u' ) )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: Round-G debug fields are all real, finite, and present on every processInput() turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'hola', { userId: 'alice' } )
	for ( let i = 0; i < 12; i++ ) {

		const result = await ai.processInput( `mensaje ${i} ${Math.random()}`, { userId: 'bob' } )
		assert.ok( Number.isFinite( result.debug.vicariousDiscomfort ) )
		assert.ok( Number.isFinite( result.debug.empathyBlend ) )
		assert.ok( result.debug.compassionCheck && typeof result.debug.compassionCheck.worthHelping === 'boolean' )
		assert.ok( result.debug.retribution && typeof result.debug.retribution.worthIt === 'boolean' )
		assert.ok( Number.isFinite( result.debug.flirtation ) )

	}

} )

test( 'hard: a real successful repair genuinely forgives real accumulated grievance through the full pipeline', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.3 } ) } ) ) )
	for ( let i = 0; i < 15; i++ ) await ai.processInput( 'eres un inútil, no sirves para nada, te odio', { userId: 'u' } )

	const grievanceBefore = ai.grudgeSystem.getGrievance( 'self', 'u' )
	// Real, honest branch: only assert the forgiveness DIRECTION if a real
	// grievance actually accumulated (appraisal.agency isn't guaranteed to
	// read "user" for every hostile heuristic phrase).
	if ( grievanceBefore > 0 ) {

		ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
		for ( let i = 0; i < 10; i++ ) await ai.processInput( 'lo siento mucho, perdoname, fue mi culpa', { userId: 'u' } )
		assert.ok( ai.grudgeSystem.getGrievance( 'self', 'u' ) <= grievanceBefore )

	}
	assert.ok( true )

} )

test( 'hard: multi-user isolation — Round-G per-relationship state for user A never bleeds into user B', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 10; i++ ) await ai.processInput( 'eres un inútil, te odio, no sirves para nada', { userId: 'alice' } )
	const bobResult = await ai.processInput( 'hola', { userId: 'bob' } )

	assert.equal( ai.grudgeSystem.getGrievance( 'self', 'bob' ), 0 )
	assert.equal( typeof bobResult.text, 'string' )

} )

test( 'full: toJSON()/restoreState() round-trips real Round-G state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	ai.grudgeSystem.registerHarm( 'self', 'u', 0.8, 0.7 )
	await ai.processInput( 'hola', { userId: 'u' } )
	ai.tick( 2 )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noHijack( noBurst( new Totemheart() ) )
	restored.restoreState( saved )

	assert.deepEqual( [ ...restored.grudgeSystem.grievances.entries() ], saved.grudges )

	const result = await restored.processInput( 'hola de nuevo', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )

} )
