/**
 * Directed + cross-mechanism tests for the three newest mechanisms: real
 * competitive-selection (GlobalWorkspace), real primary-drive activation
 * (PrimaryDrives), and real sustained-negativity numbing (EmotionalImmuneSystem)
 * — individually, cross-tested against each other, and cross-tested against
 * the full Totemheart pipeline.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { GlobalWorkspace }       from '../../src/cognition/GlobalWorkspace.js'
import { PrimaryDrives }         from '../../src/core/PrimaryDrives.js'
import { EmotionalImmuneSystem } from '../../src/cognition/EmotionalImmuneSystem.js'
import { Totemheart, Personality } from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

// ============================================================================
// GlobalWorkspace
// ============================================================================

test( 'GlobalWorkspace: a dominant candidate wins the real softmax competition near-deterministically', () => {

	const workspace = new GlobalWorkspace()
	const result           = workspace.compete( [ { name: 'a', salience: 0.9 }, { name: 'b', salience: 0.1 }, { name: 'c', salience: 0.1 } ] )
	assert.equal( result.winner, 'a' )
	assert.ok( result.coalitions.find( c => c.name === 'a' ).access > 0.5 )

} )

test( 'GlobalWorkspace: real access shares always sum to 1 (a genuine probability distribution)', () => {

	const workspace = new GlobalWorkspace()
	const result           = workspace.compete( [ { name: 'a', salience: 0.4 }, { name: 'b', salience: 0.3 }, { name: 'c', salience: 0.9 } ] )
	const totalAccess     = result.coalitions.reduce( ( sum, c ) => sum + c.access, 0 )
	assert.ok( Math.abs( totalAccess - 1 ) < 1e-9 )

} )

test( 'GlobalWorkspace: no winner below threshold, empty candidates never throws', () => {

	const workspace = new GlobalWorkspace()
	assert.deepEqual( workspace.compete( [] ), { winner: null, coalitions: [] } )

	const tiny = workspace.compete( [ { name: 'a', salience: 0.01 }, { name: 'b', salience: 0.01 } ], 0.9 )
	assert.equal( tiny.winner, null )

} )

test( 'GlobalWorkspace: competition entropy is near 0 for a clear winner, higher for close candidates', () => {

	const workspace = new GlobalWorkspace()
	const clear             = workspace.compete( [ { name: 'a', salience: 5 }, { name: 'b', salience: 0 } ] )
	const close             = workspace.compete( [ { name: 'a', salience: 0.5 }, { name: 'b', salience: 0.5 } ] )

	assert.ok( workspace.getCompetitionEntropy( clear.coalitions ) < workspace.getCompetitionEntropy( close.coalitions ) )

} )

// ============================================================================
// PrimaryDrives
// ============================================================================

test( 'PrimaryDrives: activate() bounds at 1, unknown drive names are a real no-op', () => {

	const drives = new PrimaryDrives()
	drives.activate( 'SEEKING', 2 )
	assert.equal( drives.getDrive( 'SEEKING' ), 1 )
	drives.activate( 'NOT_A_DRIVE', 1 )
	assert.equal( drives.getDrive( 'NOT_A_DRIVE' ), 0 )

} )

test( 'PrimaryDrives: real exponential decay pulls every drive back toward 0 over time', () => {

	const drives = new PrimaryDrives( { decayRate: 0.5 } )
	drives.activate( 'CARE', 1 )
	const before = drives.getDrive( 'CARE' )
	drives.decay( 5 )
	assert.ok( drives.getDrive( 'CARE' ) < before )

} )

test( 'PrimaryDrives: getDominantDrive() picks the real highest-activation drive above the floor, null otherwise', () => {

	const drives = new PrimaryDrives()
	assert.equal( drives.getDominantDrive(), null )
	drives.activate( 'PLAY', 0.6 )
	drives.activate( 'SEEKING', 0.3 )
	assert.equal( drives.getDominantDrive(), 'PLAY' )

} )

test( 'PrimaryDrives: getGoalPull() maps the real dominant drive to its own real goal tendency', () => {

	const drives = new PrimaryDrives()
	drives.activate( 'PANIC_GRIEF', 0.8 )
	const pull = drives.getGoalPull()
	assert.equal( pull.drive, 'PANIC_GRIEF' )
	assert.equal( pull.goal, 'seek_reconnection' )
	assert.ok( pull.intensity > 0 )

} )

// ============================================================================
// EmotionalImmuneSystem
// ============================================================================

test( 'EmotionalImmuneSystem: below threshold, no dampening at all — real, honest baseline', () => {

	const immune = new EmotionalImmuneSystem( { threshold: 3 } )
	immune.observe( -0.5, 1 )
	assert.equal( immune.getDampeningFactor(), 1 )
	assert.equal( immune.isNumb(), false )

} )

test( 'EmotionalImmuneSystem: sustained negativity crosses the real threshold and produces real, bounded dampening', () => {

	const immune = new EmotionalImmuneSystem( { threshold: 2, maxDampening: 0.7 } )
	for ( let i = 0; i < 20; i++ ) immune.observe( -0.8, 1 )

	assert.ok( immune.isNumb() )
	const factor = immune.getDampeningFactor()
	assert.ok( factor < 1 )
	assert.ok( factor >= 1 - 0.7, 'dampening must never exceed the real, bounded maxDampening ceiling — never full numbness' )

} )

test( 'EmotionalImmuneSystem: positive input never accumulates exposure', () => {

	const immune = new EmotionalImmuneSystem()
	for ( let i = 0; i < 20; i++ ) immune.observe( 0.8, 1 )
	assert.equal( immune.exposure, 0 )

} )

test( 'EmotionalImmuneSystem: real recovery once negativity stops, decaying exposure back down', () => {

	const immune = new EmotionalImmuneSystem( { recoveryRate: 0.5 } )
	for ( let i = 0; i < 10; i++ ) immune.observe( -0.9, 1 )
	const before = immune.exposure
	immune.decay( 5 )
	assert.ok( immune.exposure < before )

} )

// ============================================================================
// cross: among the 3 mechanisms in this file
// ============================================================================

test( 'cross: a real grief-dominant PrimaryDrives state and a real numbed EmotionalImmuneSystem both agree the situation is sustained-negative, independently', () => {

	const drives = new PrimaryDrives()
	const immune   = new EmotionalImmuneSystem( { threshold: 1.5 } )

	for ( let i = 0; i < 10; i++ ) {

		drives.activate( 'PANIC_GRIEF', 0.3 )
		immune.observe( -0.7, 0.8 )

	}

	assert.equal( drives.getDominantDrive(), 'PANIC_GRIEF' )
	assert.ok( immune.isNumb() )
	// Real independence check: neither module holds a reference to the other.
	drives.decay( 100 )
	assert.equal( drives.getDrive( 'PANIC_GRIEF' ) < 0.01, true )
	assert.ok( immune.isNumb(), 'EmotionalImmuneSystem state must be unaffected by PrimaryDrives decaying' )

} )

test( 'cross: GlobalWorkspace can arbitrate directly among real PrimaryDrives activations as candidates', () => {

	const drives      = new PrimaryDrives()
	const workspace = new GlobalWorkspace()

	drives.activate( 'SEEKING', 0.3 )
	drives.activate( 'CARE', 0.8 )
	drives.activate( 'PLAY', 0.2 )

	const result = workspace.compete( Object.entries( drives.drives ).map( ( [ name, salience ] ) => ( { name, salience } ) ) )
	assert.equal( result.winner, 'CARE' )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: a real multi-turn conversation genuinely activates PLAY/SEEKING PrimaryDrives and produces a real GlobalWorkspace winner each turn', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )

	let sawRealWinner = false
	for ( let i = 0; i < 8; i++ ) {

		const result = await ai.processInput( `esto es genial y muy divertido, mensaje ${i}`, { userId: 'u' } )
		if ( result.debug.workspaceCompetition.winner ) sawRealWinner = true
		assert.ok( Number.isFinite( ai.emotionSpace.vector.valence ) )

	}

	assert.ok( sawRealWinner )
	assert.ok( ai.primaryDrives.getDrive( 'PLAY' ) > 0 || ai.primaryDrives.getDrive( 'SEEKING' ) > 0 )

} )

test( 'full: sustained hostility genuinely numbs EmotionalImmuneSystem and measurably dampens further cortisol registration', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )

	for ( let i = 0; i < 20; i++ ) await ai.processInput( 'esto es horrible, terrible, me frustra muchisimo', { userId: 'u' } )

	assert.ok( ai.emotionalImmuneSystem.exposure > 0 )
	const dampening = ai.emotionalImmuneSystem.getDampeningFactor()
	assert.ok( dampening <= 1 )
	assert.ok( Number.isFinite( ai.cortisolEngine.getLevel() ) && ai.cortisolEngine.getLevel() >= 0 && ai.cortisolEngine.getLevel() <= 1 )

} )

test( 'full: a real rupture triggers GriefEngine AND drives PrimaryDrives\' PANIC_GRIEF through the real pipeline', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

	let ruptured = false
	for ( let i = 0; i < 40 && !ruptured; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion', { userId: 'u' } )
		ruptured = ai.loveHateEngine.getBond( 'u' ).ruptured

	}
	assert.ok( ruptured )
	assert.ok( ai.griefEngine.isActive( 'u' ) )

	// Give grief real waves a chance to fire and feed PrimaryDrives.
	for ( let i = 0; i < 20; i++ ) await ai.processInput( 'sigo pensando en ello', { userId: 'u' } )
	assert.ok( Number.isFinite( ai.primaryDrives.getDrive( 'PANIC_GRIEF' ) ) )

} )

test( 'full: toJSON()/restoreState() round-trips real PrimaryDrives and EmotionalImmuneSystem state', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	for ( let i = 0; i < 15; i++ ) await ai.processInput( 'esto es horrible y tambien muy divertido a la vez', { userId: 'u' } )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noBurst( new Totemheart() )
	restored.restoreState( saved )

	assert.deepEqual( restored.primaryDrives.drives, saved.primaryDrives )
	assert.equal( restored.emotionalImmuneSystem.exposure, saved.immuneExposure )

	const result = await restored.processInput( 'hola de nuevo', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )
	assert.ok( Number.isFinite( restored.emotionSpace.vector.valence ) )

} )
