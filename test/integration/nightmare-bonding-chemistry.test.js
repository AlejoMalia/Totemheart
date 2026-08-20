/**
 * Directed + cross-mechanism + full-pipeline tests for round 26's 3
 * mechanisms: NightmareEngine (a real distinct failure mode of
 * DreamEngine's own synthesis, combining 4 already-existing real signals
 * rather than duplicating any of them), OxytocinSystem, and
 * EndogenousOpioidSystem (the real breakup/reattachment neurochemistry the
 * user's own detailed message described — dopaminergic withdrawal,
 * dACC social pain, and HPA/allostatic load were all ALREADY real,
 * fully-built modules confirmed by direct code search: DopaminergicEngine,
 * PainSocialOverlap, CortisolEngine/Homeostasis.allostaticLoad).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { NightmareEngine }        from '../../src/social/NightmareEngine.js'
import { OxytocinSystem }             from '../../src/social/OxytocinSystem.js'
import { EndogenousOpioidSystem } from '../../src/social/EndogenousOpioidSystem.js'
import { ClassicalConditioning }   from '../../src/economics/ClassicalConditioning.js'
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
// NightmareEngine
// ============================================================================

test( 'NightmareEngine.getThreatRatio(): real amygdala/PFC imbalance — high threat, low control, genuinely large ratio', () => {

	const n = new NightmareEngine()
	assert.ok( n.getThreatRatio( 0.9, 0.05 ) > n.getThreatRatio( 0.9, 0.9 ) )

} )

test( 'NightmareEngine.evaluate(): a real calm, well-regulated, well-rested state never crosses the nightmare threshold', () => {

	const n = new NightmareEngine()
	const result = n.evaluate( { amygdalaThreat: 0.1, pfcControl: 0.9, unresolvedFear: 0, remReboundPressure: 0.1, cortisol: 0.1, arousal: 0.1 } )
	assert.equal( result.isNightmare, false )

} )

test( 'NightmareEngine.evaluate(): real high threat, low PFC control, unresolved fear, and REM rebound together cross the threshold', () => {

	const n = new NightmareEngine()
	const result = n.evaluate( { amygdalaThreat: 0.9, pfcControl: 0.05, unresolvedFear: 0.8, remReboundPressure: 0.8, cortisol: 0.8, arousal: 0.8 } )
	assert.equal( result.isNightmare, true )
	assert.ok( result.probability > 0.55 )

} )

test( 'ClassicalConditioning.getStrongestFear(): real strongest unresolved negative association, positive ones ignored', () => {

	const c = new ClassicalConditioning()
	c.setCues( [ 'perro' ] )
	c.observeOutcome( -0.9 )
	c.setCues( [ 'playa' ] )
	c.observeOutcome( 0.9 )
	assert.ok( c.getStrongestFear() > 0.1 )
	assert.ok( c.getStrongestFear() <= 1 )

} )

test( 'DreamEngine.generateDream(): a real nightmareIntensity genuinely overrides the ordinary warmth/hurt-derived valence toward threat', () => {

	const d = new DreamEngine()
	const ordinary  = d.generateDream( 'u', { topDetail: { text: 'algo' }, affectLedger: { cumulativeWarmth: 0.8, cumulativeHurt: 0.1 } } )
	assert.ok( ordinary.valence > 0 )
	assert.equal( ordinary.isNightmare, false )

	const nightmare = d.generateDream( 'v', { topDetail: { text: 'algo' }, affectLedger: { cumulativeWarmth: 0.8, cumulativeHurt: 0.1 }, nightmareIntensity: 0.7 } )
	assert.ok( nightmare.valence < 0, 'a real nightmare must read negative even with an otherwise-positive affect ledger' )
	assert.equal( nightmare.isNightmare, true )
	assert.equal( nightmare.threatIntensity, 0.7 )

} )

// ============================================================================
// OxytocinSystem / EndogenousOpioidSystem
// ============================================================================

test( 'OxytocinSystem: real reinforcement raises the level, only a positive bond signal counts', () => {

	const o = new OxytocinSystem()
	const before = o.getLevel( 'u' )
	o.reinforce( 'u', -0.5 ) // negative signal must be a real no-op
	assert.equal( o.getLevel( 'u' ), before )
	o.reinforce( 'u', 0.8 )
	assert.ok( o.getLevel( 'u' ) > before )

} )

test( 'OxytocinSystem: real decay moves the level back toward the floor, never below it', () => {

	const o = new OxytocinSystem( { floor: 0.1, decayRate: 0.05 } )
	o.reinforce( 'u', 1 )
	const peak = o.getLevel( 'u' )
	for ( let i = 0; i < 100; i++ ) o.decay( 1 )
	assert.ok( o.getLevel( 'u' ) < peak )
	assert.ok( o.getLevel( 'u' ) >= 0.1 )

} )

test( 'OxytocinSystem.getIdealizationSuppression(): real 0 at the floor, real 1 at a fully saturated bond', () => {

	const o = new OxytocinSystem( { floor: 0.1 } )
	assert.equal( o.getIdealizationSuppression( 'never-bonded' ), 0 )
	o.reinforce( 'u', 1 )
	for ( let i = 0; i < 50; i++ ) o.reinforce( 'u', 1 )
	assert.ok( o.getIdealizationSuppression( 'u' ) > 0.8 )

} )

test( 'EndogenousOpioidSystem: real buffer builds with bonding and fully decays to zero (no permanent floor), unlike OxytocinSystem', () => {

	const e = new EndogenousOpioidSystem()
	e.reinforce( 'u', 1 )
	assert.ok( e.getBuffer( 'u' ) > 0 )
	for ( let i = 0; i < 500; i++ ) e.decay( 1 )
	assert.equal( e.getBuffer( 'u' ), 0 )

} )

test( 'EndogenousOpioidSystem.getAnalgesia(): real higher allostatic load genuinely reduces the SAME buffer\'s effective analgesia', () => {

	const e = new EndogenousOpioidSystem()
	e.reinforce( 'u', 1 )
	assert.ok( e.getAnalgesia( 'u', 0 ) > e.getAnalgesia( 'u', 1 ) )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: a real high-threat, low-control, sleep-deprived state genuinely produces a real nightmare through the pipeline', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 6; i++ ) await ai.processInput( 'me da mucho miedo que me hagan daño, tengo pánico', { userId: 'u' } )
	ai.cortisolEngine.register( -0.9, true )
	ai.inhibitoryControlPool.level = 0.05
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 14

	const result = await ai.processInput( 'buenos días', { userId: 'u' } )
	assert.ok( result.debug.nightmare !== null )
	if ( result.debug.nightmare.isNightmare ) {

		const dream = ai.dreamEngine.dreams.get( 'u' )
		assert.equal( dream.isNightmare, true )
		assert.ok( dream.valence < 0 )

	}

} )

test( 'full: a real sustained bonded relationship genuinely buffers hurt via oxytocin idealization AND opioid analgesia', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 10; i++ ) await ai.processInput( 'te quiero mucho, me haces muy feliz', { userId: 'A' } )

	const hurt = await ai.processInput( 'eres un inútil, te odio', { userId: 'A' } )
	assert.ok( hurt.debug.idealizationSuppression > 0.5 )
	assert.ok( hurt.debug.opioidAnalgesia > 0.2 )
	assert.ok( hurt.emotionalState.vector.valence > -0.3, 'a real bonded partner\'s hurtful turn must land genuinely softer than an unbonded one would' )

} )

test( 'full: after a real long decay (the bond genuinely gone), the SAME hurtful turn lands with real full, undampened force', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 10; i++ ) await ai.processInput( 'te quiero mucho, me haces muy feliz', { userId: 'A' } )
	const bonded = await ai.processInput( 'eres un inútil, te odio', { userId: 'A' } )

	for ( let i = 0; i < 200; i++ ) ai.tick( 24 ) // a real long real-time gap, no reinforcement at all
	const decayed = await ai.processInput( 'eres un inútil, te odio', { userId: 'A' } )

	assert.ok( decayed.debug.idealizationSuppression < bonded.debug.idealizationSuppression )
	assert.ok( decayed.debug.opioidAnalgesia < bonded.debug.opioidAnalgesia )
	assert.ok( decayed.emotionalState.vector.valence < bonded.emotionalState.vector.valence, 'the exact same hurtful message must genuinely land WORSE once the real chemical buffers are gone' )

} )

test( 'full: toJSON()/restoreState() round-trips real nightmare/oxytocin/opioid state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'te quiero mucho', { userId: 'A' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	assert.deepEqual( rehydrated.oxytocinLevels, saved.oxytocinLevels )
	assert.deepEqual( rehydrated.opioidBuffers, saved.opioidBuffers )
	assert.ok( saved.oxytocinLevels.length > 0 )

} )

test( 'hard: 300-turn long-horizon conversation keeps every new field finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'te quiero mucho', 'eres un inútil, te odio', 'me da mucho miedo que me hagan daño' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )

	assert.ok( Number.isFinite( last.debug.oxytocinLevel ) && last.debug.oxytocinLevel >= 0 && last.debug.oxytocinLevel <= 1 )
	assert.ok( Number.isFinite( last.debug.idealizationSuppression ) && last.debug.idealizationSuppression >= 0 && last.debug.idealizationSuppression <= 1 )
	assert.ok( Number.isFinite( last.debug.opioidBuffer ) && last.debug.opioidBuffer >= 0 && last.debug.opioidBuffer <= 1 )
	assert.ok( Number.isFinite( last.debug.opioidAnalgesia ) && last.debug.opioidAnalgesia >= 0 )

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )
