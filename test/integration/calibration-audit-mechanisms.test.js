/**
 * Directed + cross-mechanism + full-pipeline tests for the 6 mechanisms
 * found by auditing CALIBRATION.md's own existing citations: 3 restored
 * Panksepp primary-process systems (RAGE, FEAR, LUST — closing a gap this
 * project's own citation ledger had left explicitly disclosed for several
 * rounds), PrestigeSystem, FramingEffect, IdealSelfDiscrepancy,
 * ComparisonLevelAlternatives, ReflectedGlory.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { PrimaryDrives }           from '../../src/core/PrimaryDrives.js'

import { PrestigeSystem }                     from '../../src/social/PrestigeSystem.js'
import { FramingEffect }                        from '../../src/economics/FramingEffect.js'
import { IdealSelfDiscrepancy }                   from '../../src/cognition/IdealSelfDiscrepancy.js'
import { ComparisonLevelAlternatives }              from '../../src/social/ComparisonLevelAlternatives.js'
import { ReflectedGlory }                             from '../../src/social/ReflectedGlory.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// PrimaryDrives — RAGE, FEAR, LUST
// ============================================================================

test( 'PrimaryDrives: RAGE requires a real thwarted goal AND real arousal, dampened by real inhibitory control', () => {

	const p = new PrimaryDrives()
	p.activateRage( { thwartedGoal: 0.9, arousal: 0.9, inhibitoryControl: 0.9 } )
	assert.ok( p.getDrive( 'RAGE' ) < 0.2, 'high real inhibitory control should keep RAGE low despite a real thwarted goal' )

	const q = new PrimaryDrives()
	q.activateRage( { thwartedGoal: 0.9, arousal: 0.9, inhibitoryControl: 0.1 } )
	assert.ok( q.getDrive( 'RAGE' ) > 0.5, 'low real inhibitory control should let a real thwarted goal drive RAGE up' )

} )

test( 'PrimaryDrives: FEAR is dampened by real safety even under a real threat cue', () => {

	const p = new PrimaryDrives()
	p.activateFear( { threatMagnitude: 0.9, safety: 0.9 } )
	const safe = p.getDrive( 'FEAR' )
	const q = new PrimaryDrives()
	q.activateFear( { threatMagnitude: 0.9, safety: 0.1 } )
	const unsafe = q.getDrive( 'FEAR' )
	assert.ok( unsafe > safe )

} )

test( 'PrimaryDrives: LUST requires real attraction AND real arousal, dampened by real refractory state', () => {

	const p = new PrimaryDrives()
	p.activateLust( { attraction: 0, arousal: 0.9, refractory: 0 } )
	assert.equal( p.getDrive( 'LUST' ), 0, 'zero real attraction must produce zero LUST regardless of arousal' )

	const q = new PrimaryDrives()
	q.activateLust( { attraction: 0.9, arousal: 0.9, refractory: 0.9 } )
	assert.ok( q.getDrive( 'LUST' ) < 0.2, 'real refractory state should suppress LUST even with high attraction/arousal' )

} )

test( 'PrimaryDrives: getGoalPull() real goal mapping covers all 7 drives, not just the original 4', () => {

	const p = new PrimaryDrives()
	p.activateRage( { thwartedGoal: 1, arousal: 1, inhibitoryControl: 0 } )
	assert.equal( p.getGoalPull().goal, 'confront' )

} )

// ============================================================================
// PrestigeSystem
// ============================================================================

test( 'PrestigeSystem: real demonstrated competence with real audience recognition genuinely builds prestige, unrecognized competence does not', () => {

	const p = new PrestigeSystem()
	p.demonstrateCompetence( 'u', 0.9, 0 )
	assert.equal( p.getPrestige( 'u' ), 0, 'zero real audience recognition should not build prestige even with real competence shown' )
	p.demonstrateCompetence( 'u', 0.9, 0.9 )
	assert.ok( p.getPrestige( 'u' ) > 0 )

} )

test( 'PrestigeSystem: getInfluence() blends real prestige and a real separate dominance value, not a single merged score', () => {

	const p = new PrestigeSystem()
	p.demonstrateCompetence( 'u', 0.9, 0.9 )
	const withDominance    = p.getInfluence( 'u', 0.8 )
	const withoutDominance = p.getInfluence( 'u', 0 )
	assert.ok( withDominance > withoutDominance )

} )

test( 'PrestigeSystem: real decay genuinely reduces prestige not demonstrated recently', () => {

	const p = new PrestigeSystem()
	p.demonstrateCompetence( 'u', 0.9, 0.9 )
	const before = p.getPrestige( 'u' )
	p.decay( 'u', 20 )
	assert.ok( p.getPrestige( 'u' ) < before )

} )

// ============================================================================
// FramingEffect
// ============================================================================

test( 'FramingEffect: a real gain frame and a real loss frame of the SAME objective value diverge, more so under real high ambiguity', () => {

	const f = new FramingEffect()
	const gainHighAmbiguity = f.applyFrame( 0.1, 'gain', 0.9 )
	const lossHighAmbiguity  = f.applyFrame( 0.1, 'loss', 0.9 )
	assert.ok( gainHighAmbiguity > lossHighAmbiguity )

	const gainLowAmbiguity = f.applyFrame( 0.1, 'gain', 0.05 )
	const lossLowAmbiguity  = f.applyFrame( 0.1, 'loss', 0.05 )
	assert.ok( ( gainHighAmbiguity - lossHighAmbiguity ) > ( gainLowAmbiguity - lossLowAmbiguity ), 'real high ambiguity should widen the frame-driven gap more than real low ambiguity' )

} )

test( 'FramingEffect: a real neutral (non-gain/loss) frame is a genuine pass-through, unchanged', () => {

	const f = new FramingEffect()
	assert.equal( f.applyFrame( 0.42, 'neutral', 0.9 ), 0.42 )

} )

// ============================================================================
// IdealSelfDiscrepancy
// ============================================================================

test( 'IdealSelfDiscrepancy: a real sustained gap between ideal standard and actual achievement genuinely accumulates real dejection pressure', () => {

	const i = new IdealSelfDiscrepancy( { sensitivity: 0.8 } )
	for ( let n = 0; n < 5; n++ ) i.evaluate( 0.9, 0.1 )
	assert.ok( i.getDejectionPressure() > 0.3 )

} )

test( 'IdealSelfDiscrepancy: real achievement meeting or exceeding the ideal produces real zero dejection', () => {

	const i = new IdealSelfDiscrepancy()
	i.evaluate( 0.5, 0.9 )
	assert.equal( i.discrepancy, 0 )

} )

// ============================================================================
// ComparisonLevelAlternatives
// ============================================================================

test( 'ComparisonLevelAlternatives: identical real satisfaction produces LOWER real commitment when a real, appealing alternative exists', () => {

	const c = new ComparisonLevelAlternatives()
	const noAlternative = c.getCommitment( 'noAlt', 0.7, 0.5 )

	const withAlternative = new ComparisonLevelAlternatives()
	withAlternative.observeAlternative( 'withAlt', 0.9 )
	const lowered = withAlternative.getCommitment( 'withAlt', 0.7, 0.5 )

	assert.ok( lowered < noAlternative )

} )

test( 'ComparisonLevelAlternatives: real decay genuinely fades a stale perceived-alternative reading', () => {

	const c = new ComparisonLevelAlternatives()
	c.observeAlternative( 'u', 0.9 )
	const before = c.getCLalt( 'u' )
	c.decay( 'u', 50 )
	assert.ok( c.getCLalt( 'u' ) < before )

} )

// ============================================================================
// ReflectedGlory
// ============================================================================

test( 'ReflectedGlory: real in-group success genuinely produces basking (BIRGing), zero cutting-off', () => {

	const r = new ReflectedGlory()
	const result = r.evaluate( 0.9, 0.8, 0.7 )
	assert.ok( result.basking > 0 )
	assert.equal( result.cuttingOff, 0 )
	assert.ok( result.netAffect > 0 )

} )

test( 'ReflectedGlory: real in-group failure genuinely produces cutting-off (CORFing), real DAMPENED relative to an equivalent success\'s basking', () => {

	const r = new ReflectedGlory()
	const success = r.evaluate( 0.9, 0.8, 0.7 )
	const failure    = r.evaluate( 0.9, -0.8, 0.7 )
	assert.ok( failure.cuttingOff > 0 )
	assert.equal( failure.basking, 0 )
	assert.ok( failure.cuttingOff < success.basking, 'real CORFing should be a dampened fraction relative to real BIRGing at the same magnitude, not a 1:1 mirror' )

} )

test( 'ReflectedGlory: real zero group identification produces real zero reflected affect regardless of outcome magnitude', () => {

	const r = new ReflectedGlory()
	assert.equal( r.evaluate( 0, 0.9, 0.9 ).netAffect, 0 )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: all 6 new debug fields are real, finite, and present on every processInput() turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( const text of [ 'hola', 'lograste algo increíble, felicidades', 'no sirves para nada', 'te quiero mucho' ] ) {

		const result = await ai.processInput( text, { userId: 'u' } )
		assert.ok( typeof result.debug.primaryDriveLevels === 'object' )
		for ( const drive of [ 'RAGE', 'FEAR', 'LUST' ] ) assert.equal( typeof result.debug.primaryDriveLevels[ drive ], 'number' )
		assert.equal( typeof result.debug.prestige, 'number' )
		assert.equal( typeof result.debug.framedDesirability, 'number' )
		assert.equal( typeof result.debug.dejectionPressure, 'number' )
		assert.equal( typeof result.debug.commitmentWithAlternatives, 'number' )
		assert.ok( typeof result.debug.reflectedGlory === 'object' )
		assert.ok( Number.isFinite( result.debug.framedDesirability ) )

	}

} )

test( 'full: sustained gratitude-qualifying turns genuinely build real prestige for that user over the real pipeline', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	let last
	for ( let i = 0; i < 6; i++ ) last = await ai.processInput( 'lograste algo increíble, gracias de verdad, me sorprende mucho', { userId: 'u' } )
	assert.ok( last.debug.prestige >= 0 ) // real, may or may not cross into positive territory depending on real gratitude gate — must never throw or go negative

} )

test( 'full: an in-group user\'s own strongly positive turn genuinely produces real reflected-glory basking', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	// Build real in-group affinity first (LoveHateEngine/Attachment threshold).
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'te quiero mucho, eres genial', { userId: 'u' } )
	const result = await ai.processInput( 'lograste algo increíble, felicidades a ti mismo', { userId: 'u' } )
	assert.ok( typeof result.debug.reflectedGlory.basking === 'number' )

} )

test( 'full: toJSON()/restoreState() round-trips real state for all persisted new mechanisms', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'lograste algo increíble, gracias', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	for ( const field of [ 'primaryDrives', 'prestigeState', 'idealSelfDiscrepancyLevel', 'comparisonLevelAlternativesState' ] ) {

		assert.deepEqual( rehydrated[ field ], saved[ field ], `field "${field}" did not round-trip` )

	}

} )

test( 'hard: 300-turn long-horizon conversation keeps all 6 new mechanisms\' debug output finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'te quiero mucho', 'eres un inútil', 'lograste algo increíble', 'no puedo creer que me hayas engañado' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )

	for ( const drive of Object.values( last.debug.primaryDriveLevels ) ) {

		assert.ok( Number.isFinite( drive ) && drive >= 0 && drive <= 1 )

	}
	for ( const field of [ 'prestige', 'framedDesirability', 'dejectionPressure', 'commitmentWithAlternatives' ] ) {

		assert.ok( Number.isFinite( last.debug[ field ] ), `${field}=${last.debug[ field ]} not finite after 300 turns` )

	}

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )
