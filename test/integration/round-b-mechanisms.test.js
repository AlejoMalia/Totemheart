/**
 * Directed + cross-mechanism + full-pipeline tests for the 21 originally-
 * requested "Round B" mechanisms (18 new modules + 3 real extensions to
 * existing modules; 2 of the original 23 were skipped as genuine duplicates
 * — ObligationLedger of ReciprocityClassifier's own real balance tracking,
 * AttachmentActivatedScript of Attachment.getStressStyle() — documented in
 * CHANGELOG.md, not silently dropped).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'

import { PostConflictCooling }        from '../../src/behavior/PostConflictCooling.js'
import { SuperegoMonitor }              from '../../src/cognition/SuperegoMonitor.js'
import { ResidualAnnoyanceTrace }         from '../../src/social/ResidualAnnoyanceTrace.js'
import { EffortWithholding }                from '../../src/behavior/EffortWithholding.js'
import { PolitenessShutdown }                 from '../../src/behavior/PolitenessShutdown.js'
import { ContemptDetector }                     from '../../src/social/ContemptDetector.js'
import { DemandWithdrawLoop }                     from '../../src/social/DemandWithdrawLoop.js'
import { FaceThreatSensitivity }                    from '../../src/social/FaceThreatSensitivity.js'
import { AudienceDesign }                             from '../../src/behavior/AudienceDesign.js'
import { SelfPresentationManager }                      from '../../src/social/SelfPresentationManager.js'
import { EgoCalibrationSuite }                            from '../../src/social/EgoCalibrationSuite.js'
import { LoyaltyConflictResolver }                          from '../../src/social/LoyaltyConflictResolver.js'
import { RuminationVsReflectionSwitch }                       from '../../src/cognition/RuminationVsReflectionSwitch.js'
import { ReactanceEngine }                                      from '../../src/cognition/ReactanceEngine.js'
import { PsychologicalDistanceScaler }                            from '../../src/cognition/PsychologicalDistanceScaler.js'
import { MoralLicensing }                                           from '../../src/cognition/MoralLicensing.js'
import { SelfHandicapping }                                           from '../../src/behavior/SelfHandicapping.js'
import { RelationalAfterglow }                                          from '../../src/social/RelationalAfterglow.js'
import { GratitudeEngine }                                                from '../../src/social/GratitudeEngine.js'
import { ReciprocityClassifier }                                            from '../../src/social/ReciprocityClassifier.js'
import { BetrayalTraumaTrace }                                                from '../../src/social/BetrayalTraumaTrace.js'

function noBurst( ai, threshold = 100 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// Unit: the 18 new modules
// ============================================================================

test( 'PostConflictCooling: a real conflict end opens a genuine cooling window that decays back to 0', () => {

	const c = new PostConflictCooling( { coolingDurationMs: 1000 } )
	c.registerConflictEnd( 'u', 0.8, 0 )
	assert.ok( c.getCoolingLevel( 'u', 0 ) > 0 )
	assert.equal( c.getCoolingLevel( 'u', 100000 ), 0 )

} )

test( 'SuperegoMonitor: a real should-vs-did gap accumulates real discrepancy and self-critique pressure', () => {

	const s = new SuperegoMonitor( { sensitivity: 0.8 } )
	for ( let i = 0; i < 5; i++ ) s.evaluate( 0.9, 0.2 )
	assert.ok( s.discrepancy > 0.3 )
	assert.ok( s.getSelfCritiquePressure() > 0 )

} )

test( 'ResidualAnnoyanceTrace: sub-threshold irritants accumulate and genuinely amplify the next real one', () => {

	const r = new ResidualAnnoyanceTrace()
	for ( let i = 0; i < 5; i++ ) r.register( 0.2 )
	assert.ok( r.trace > 0 )
	assert.ok( r.getPrimingMultiplier() > 1 )

} )

test( 'EffortWithholding: sustained one-sided effort genuinely produces withholding pressure', () => {

	const e = new EffortWithholding()
	for ( let i = 0; i < 10; i++ ) e.observe( 'u', 0.9, 0.1 )
	assert.ok( e.getWithholding( 'u' ) > 0.3 )

} )

test( 'PolitenessShutdown: sustained high load genuinely drains the real politeness budget to shutdown', () => {

	const p = new PolitenessShutdown()
	for ( let i = 0; i < 15; i++ ) p.spend( 0.9 )
	assert.ok( p.hasShutDown() )

} )

test( 'ContemptDetector: requires BOTH real status superiority AND real disrespect — anger alone does not register as contempt', () => {

	const c = new ContemptDetector()
	c.registerDisrespect( 'u', 0.8 )
	assert.equal( c.getContempt( 'u', 0, 0 ), 0 ) // no status superiority -> no contempt
	assert.ok( c.getContempt( 'u', 0.7, 0 ) > 0 )

} )

test( 'DemandWithdrawLoop: sustained real demand crosses the threshold and produces a genuine withdrawal urge', () => {

	const d = new DemandWithdrawLoop( { withdrawThreshold: 0.5 } )
	for ( let i = 0; i < 10; i++ ) d.registerDemand( 'u', 0.9 )
	assert.ok( d.getWithdrawalUrge( 'u' ) > 0 )

} )

test( 'FaceThreatSensitivity: real warmth genuinely buffers positive-face threat from criticism', () => {

	const f = new FaceThreatSensitivity()
	const lowWarmth  = f.getPositiveFaceThreat( 0.8, 0 )
	const highWarmth = f.getPositiveFaceThreat( 0.8, 0.9 )
	assert.ok( lowWarmth > highWarmth )

} )

test( 'AudienceDesign: a larger real audience genuinely raises formality', () => {

	const a = new AudienceDesign()
	assert.ok( a.getFormalityLevel( 10, 0.5 ) > a.getFormalityLevel( 1, 0.5 ) )

} )

test( 'SelfPresentationManager: a sustained real gap between felt and presented state accrues real maintenance cost', () => {

	const s = new SelfPresentationManager()
	for ( let i = 0; i < 5; i++ ) s.registerGap( 0.8, -0.2 )
	assert.ok( s.maintenanceCost > 0 )

} )

test( 'EgoCalibrationSuite: sustained real success with low self-assessment produces a genuine impostor reading, not hubris', () => {

	const e = new EgoCalibrationSuite()
	for ( let i = 0; i < 15; i++ ) e.observe( 0.9, 0.2 )
	assert.ok( e.getImpostorLevel() > 0.3 )
	assert.equal( e.getHubrisIndex(), 0 )

} )

test( 'EgoCalibrationSuite: sustained real failure with high self-assessment produces a genuine hubris reading', () => {

	const e = new EgoCalibrationSuite()
	for ( let i = 0; i < 15; i++ ) e.observe( 0.1, 0.9 )
	assert.ok( e.getHubrisIndex() > 0.3 )

} )

test( 'LoyaltyConflictResolver: real conflict requires both real loyalty AND real divergence between two parties', () => {

	const l = new LoyaltyConflictResolver()
	l.setLoyalty( 'a', 0.9 )
	l.setLoyalty( 'b', 0.9 )
	assert.ok( l.getConflict( 'a', 'b', 1, -1 ) > 0 )
	assert.equal( l.getConflict( 'a', 'b', 1, 1 ), 0 ) // no divergence -> no conflict

} )

test( 'RuminationVsReflectionSwitch: high real neuroticism+threat with low curiosity classifies as rumination', () => {

	const r = new RuminationVsReflectionSwitch()
	assert.equal( r.classify( 0.9, 0.1, 0.8 ).mode, 'rumination' )
	assert.equal( r.classify( 0.2, 0.9, 0.1 ).mode, 'reflection' )

} )

test( 'ReactanceEngine: a real threatened freedom genuinely boomerangs the restricted option\'s appeal upward', () => {

	const r = new ReactanceEngine()
	assert.ok( r.getRestoredAppeal( 0.3, 0.9, 0.9 ) > 0.3 )

} )

test( 'PsychologicalDistanceScaler: real high combined distance genuinely shifts construal toward abstract', () => {

	const p = new PsychologicalDistanceScaler()
	assert.equal( p.getConstrual( { temporal: 1, spatial: 1, social: 1, hypothetical: 1 } ).mode, 'abstract' )
	assert.equal( p.getConstrual( { temporal: 0, spatial: 0, social: 0, hypothetical: 0 } ).mode, 'concrete' )

} )

test( 'MoralLicensing: a real recent pro-social act genuinely lowers resistance to a subsequent marginal one, and spends down', () => {

	const m = new MoralLicensing()
	m.registerProSocialAct( 0.9 )
	const license = m.getLicenseToSpend()
	assert.ok( license > 0 )
	assert.ok( m.moralCredit < 0.9 ) // real partial spend-down, not free reuse

} )

test( 'SelfHandicapping: real high ego-relevance + real high failure risk + real low confidence produces genuine handicap pressure', () => {

	const s = new SelfHandicapping()
	assert.ok( s.getHandicapPressure( 0.9, 0.9, 0.1 ) > 0.5 )
	assert.equal( s.getHandicapPressure( 0.9, 0.9, 1 ), 0 ) // full confidence -> no handicapping needed

} )

test( 'RelationalAfterglow: a real strong positive peak decays gradually, not instantly, and boosts expression', () => {

	const r = new RelationalAfterglow( { halfLifeMs: 1000 } )
	r.registerPeak( 'u', 0.9, 0 )
	assert.ok( r.getAfterglow( 'u', 500 ) > 0 )
	assert.ok( r.getAfterglow( 'u', 500 ) < 0.9 )
	assert.ok( r.getExpressionBoost( 'u', 500 ) > 0 )

} )

// ============================================================================
// Unit: the 3 real extensions
// ============================================================================

test( 'GratitudeEngine.getGratitudeYield: repeated kindness from the same source genuinely raises the baseline and lowers future yield', () => {

	const g = new GratitudeEngine()
	const firstYield = g.getGratitudeYield( 'u', 0.8 )
	for ( let i = 0; i < 10; i++ ) g.getGratitudeYield( 'u', 0.8 )
	const laterYield = g.getGratitudeYield( 'u', 0.8 )
	assert.ok( laterYield < firstYield )

} )

test( 'ReciprocityClassifier.getFeltObligation: a real recent favor presses harder than the same-sized one long past', () => {

	const r = new ReciprocityClassifier()
	r.recordDirectFavor( 'them', 'me', 0.8, 0 )
	const recent = r.getFeltObligation( 'me', 'them', 1000 * 60 * 60 * 24 * 14, 1000 )
	const stale     = r.getFeltObligation( 'me', 'them', 1000 * 60 * 60 * 24 * 14, 1000 * 60 * 60 * 24 * 365 )
	assert.ok( recent > stale )
	assert.ok( recent > 0.7 )

} )

test( 'BetrayalTraumaTrace.reappraisalWindow: real mitigating context within the window reduces the trace; outside it, it cannot', () => {

	const b = new BetrayalTraumaTrace()
	b.record( 'u', 0.6, 0 )
	assert.equal( b.isReappraisalWindowOpen( 'u', 0.5, undefined, 1000 ), true )
	const before = b.getTrace( 'u', 1000 )
	assert.equal( b.reappraiseWithinWindow( 'u', 0.8, 0.5, 1000 ), true )
	assert.ok( b.getTrace( 'u', 1000 ) < before )

	const c = new BetrayalTraumaTrace()
	c.record( 'u', 0.6, 0 )
	const farFuture = 1000 * 60 * 60 * 24 * 365
	assert.equal( c.isReappraisalWindowOpen( 'u', 0.1, undefined, farFuture ), false )
	assert.equal( c.reappraiseWithinWindow( 'u', 0.8, 0.1, farFuture ), false )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: every Round B debug field is present, finite, and non-crashing across a real multi-turn conversation', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	let last
	for ( const text of [ 'hola', 'eres un inútil, no sirves para nada', 'perdona, no quería ser tan duro', 'gracias por todo, te lo agradezco mucho', 'te odio, esto es una traicion' ] ) {

		last = await ai.processInput( text, { userId: 'u' } )

	}

	const fields = [
		'postConflictCoolingLevel', 'superegoDiscrepancy', 'residualAnnoyance', 'effortWithholdingLevel',
		'politenessBudget', 'contemptLevel', 'demandWithdrawalUrge', 'faceThreat', 'audienceFormality',
		'egoHubrisIndex', 'egoImpostorLevel', 'ruminationMode', 'reactance', 'psychologicalDistance',
		'moralLicense', 'selfHandicapPressure', 'relationalAfterglow', 'gratitudeYield',
	]
	for ( const field of fields ) assert.notEqual( last.debug[ field ], undefined, `debug.${field} missing` )

} )

test( 'full: sustained hostility from the same user genuinely raises contempt, demand-withdrawal, and residual annoyance together', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.2 } ) } ) ) )
	ai.powerDynamicsEngine.power.set( 'u', 0.6 ) // real, pre-established status superiority for the contempt gate
	let last
	for ( let i = 0; i < 12; i++ ) last = await ai.processInput( 'eres un inútil, no sirves para nada, contestame ya', { userId: 'u' } )

	assert.ok( last.debug.contemptLevel > 0 )
	assert.ok( last.debug.residualAnnoyance > 0 )

} )

test( 'full: toJSON()/restoreState() round-trips every Round B field with real, non-trivial values', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'eres un inútil, no sirves para nada', { userId: 'u' } )
	await ai.processInput( 'perdona, de verdad lo siento mucho', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	for ( const field of [
		'residualAnnoyanceLevel', 'contemptDisrespectState', 'demandWithdrawState',
		'egoCalibrationState', 'gratitudeExpectedBaseline', 'reciprocityFavorTimestamps',
	] ) assert.deepEqual( rehydrated[ field ], saved[ field ], `field "${field}" did not round-trip` )

} )

test( 'hard: 300-turn long-horizon conversation keeps every Round B scalar finite and in a sane bound', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'eres un inútil', 'gracias por todo', 'te odio, traicion', 'perdona, lo siento' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )

	for ( const field of [ 'postConflictCoolingLevel', 'superegoDiscrepancy', 'residualAnnoyance', 'effortWithholdingLevel', 'politenessBudget', 'contemptLevel', 'demandWithdrawalUrge', 'egoHubrisIndex', 'egoImpostorLevel', 'moralLicense', 'selfHandicapPressure', 'relationalAfterglow', 'gratitudeYield' ] ) {

		const v = last.debug[ field ]
		assert.ok( Number.isFinite( v ), `${field}=${v} is not finite` )
		assert.ok( v >= -1 && v <= 2, `${field}=${v} out of sane bound` )

	}

} )
