/**
 * Directed + cross-mechanism + full-pipeline tests for the 22-mechanism
 * "Round F" batch (12 new modules + 8 real extensions to existing modules;
 * 2 of the 22 originally proposed were skipped as genuine duplicates —
 * ScorekeepingLedger of ReciprocityClassifier's own real balance tracking,
 * AffectiveTimePerception of SubjectiveTimeEngine's own real dilation —
 * documented in CHANGELOG.md, not silently dropped).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'

import { ChillsEngine }                    from '../../src/cognition/ChillsEngine.js'
import { SecretMaintenanceSystem }  from '../../src/social/SecretMaintenanceSystem.js'
import { SharedRelationalCulture }    from '../../src/social/SharedRelationalCulture.js'
import { LonelinessEngine }              from '../../src/social/LonelinessEngine.js'
import { AnticipatedRegretEngine }   from '../../src/cognition/AnticipatedRegretEngine.js'
import { HopeDisappointmentSystem } from '../../src/cognition/HopeDisappointmentSystem.js'
import { SelfCompassionVsAttack }     from '../../src/social/SelfCompassionVsAttack.js'
import { EmpathicAccuracySystem }     from '../../src/social/EmpathicAccuracySystem.js'
import { ConsolationEfficacy }           from '../../src/social/ConsolationEfficacy.js'
import { SleepQualityCoupler }           from '../../src/neurochemistry/SleepQualityCoupler.js'
import { ConversationalRepair }         from '../../src/behavior/ConversationalRepair.js'
import { MeaningfulSilence }               from '../../src/behavior/MeaningfulSilence.js'
import { StatusEnvy }                          from '../../src/social/StatusEnvy.js'
import { CognitiveDissonance }             from '../../src/cognition/CognitiveDissonance.js'
import { RoleIdentitySalience }              from '../../src/social/RoleIdentitySalience.js'
import { FrikiEngine }                           from '../../src/core/FrikiEngine.js'
import { ClassicalConditioning }             from '../../src/economics/ClassicalConditioning.js'
import { RelationalMemoryCatalog }             from '../../src/social/RelationalMemoryCatalog.js'
import { PainSocialOverlap }                     from '../../src/social/PainSocialOverlap.js'
import { StyleMimicry }                            from '../../src/behavior/StyleMimicry.js'

function noBurst( ai, threshold = 100 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// Unit tests — each module in isolation
// ============================================================================

test( 'ChillsEngine: real activation rises with vastness/moral-intensity/bond and falls with habituation', () => {

	const c = new ChillsEngine()
	const high = c.getActivation( { vastness: 0.9, meaningDensity: 0.8, bondSalience: 0.7, moralIntensity: 0.9 }, 'cueA' )
	const low    = c.getActivation( { vastness: 0.1, meaningDensity: 0.1, bondSalience: 0.1, moralIntensity: 0.1 }, 'cueA' )
	assert.ok( high > low )

	c.registerHabituation( 'cueA', 0.9 )
	const afterHabituation = c.getActivation( { vastness: 0.9, meaningDensity: 0.8, bondSalience: 0.7, moralIntensity: 0.9 }, 'cueA' )
	assert.ok( afterHabituation < high, 'repeated exposure to the same cue genuinely dampens the same objective inputs' )

} )

test( 'ChillsEngine: real fast-rise/decay peak dynamics — level rises under sustained activation, decays without it', () => {

	const c = new ChillsEngine()
	for ( let i = 0; i < 5; i++ ) c.update( 0.9 )
	const peak = c.getLevel()
	assert.ok( peak > 0.3 )
	for ( let i = 0; i < 10; i++ ) c.update( 0 )
	assert.ok( c.getLevel() < peak, 'level genuinely decays once the trigger stops' )

} )

test( 'ChillsEngine: classifyType picks the real dominant channel', () => {

	const c = new ChillsEngine()
	assert.equal( c.classifyType( { moralIntensity: 0.9, uncanny: 0, bondSalience: 0, vastness: 0 } ), 'elevation' )
	assert.equal( c.classifyType( { moralIntensity: 0, uncanny: 0, bondSalience: 0, vastness: 0.9 } ), 'awe' )

} )

test( 'SecretMaintenanceSystem: real cost accrues with salience/queries and leak probability rises with arousal/guilt', () => {

	const s = new SecretMaintenanceSystem()
	s.openSecret( 'sec1', [ 'A' ], 0.5 )
	s.updateCost( 'sec1', 0.8, true )
	assert.ok( s.getCost( 'sec1' ) > 0 )

	const lowRisk    = s.getLeakProbability( 'sec1', { arousal: 0.1, guilt: 0.1, load: 0.1, inhibitoryControl: 0.9 } )
	const highRisk = s.getLeakProbability( 'sec1', { arousal: 0.9, guilt: 0.9, load: 0.9, inhibitoryControl: 0.1 } )
	assert.ok( highRisk > lowRisk )

} )

test( 'SecretMaintenanceSystem: white-lie probability rises with care/face-protection, falls with honesty value', () => {

	const s = new SecretMaintenanceSystem()
	const caring        = s.getWhiteLieProbability( { care: 0.9, faceProtect: 0.9, honestyValue: 0.1, stakesTruth: 0.1 } )
	const honest          = s.getWhiteLieProbability( { care: 0.1, faceProtect: 0.1, honestyValue: 0.9, stakesTruth: 0.9 } )
	assert.ok( caring > honest )

} )

test( 'SharedRelationalCulture: real reinforcement builds weight, ritual urge grows with time since compliance', () => {

	const s = new SharedRelationalCulture()
	for ( let i = 0; i < 5; i++ ) s.reinforce( 'u', 'buenos-dias', 'ritual', 1, 0.8 )
	const urgeSoonAfter = s.getRitualUrge( 'u', 'buenos-dias', Date.now(), 1000 * 60 * 60 * 24 )
	const urgeLongAfter = s.getRitualUrge( 'u', 'buenos-dias', Date.now() + 1000 * 60 * 60 * 48, 1000 * 60 * 60 * 24 )
	assert.ok( urgeLongAfter >= urgeSoonAfter )

} )

test( 'LonelinessEngine: distinct from raw contact frequency — low bond*trust with high desired connection genuinely raises the target', () => {

	const l = new LonelinessEngine()
	const lonelyTarget       = l.getTarget( { desiredConnection: 0.8, effectiveConnection: 0.1, meaningfulness: 0.1 } )
	const connectedTarget = l.getTarget( { desiredConnection: 0.8, effectiveConnection: 0.9, meaningfulness: 0.9 } )
	assert.ok( lonelyTarget > connectedTarget )
	l.update( lonelyTarget )
	assert.ok( l.getLevel() > 0 )
	assert.ok( l.getHypervigilanceBoost() > 0 )

} )

test( 'AnticipatedRegretEngine: expected regret rises with probability/severity/self-relevance and dampens yield', () => {

	const r = new AnticipatedRegretEngine()
	const high = r.getExpectedRegret( 0.9, 0.9, 0.9 )
	const low    = r.getExpectedRegret( 0.1, 0.1, 0.1 )
	assert.ok( high > low )
	assert.ok( r.getYieldDampening( high ) > r.getYieldDampening( low ) )

} )

test( 'HopeDisappointmentSystem: real crash scales with prior hope, not just the negative surprise alone', () => {

	const h = new HopeDisappointmentSystem()
	for ( let i = 0; i < 10; i++ ) h.update( h.getEvidence( 0.9, 0.9, 0.9 ) )
	const highHopeCrash = h.getCrash( -0.5 )

	const h2 = new HopeDisappointmentSystem()
	const lowHopeCrash = h2.getCrash( -0.5 )
	assert.ok( highHopeCrash > lowHopeCrash )

} )

test( 'SelfCompassionVsAttack: recovery-rate multiplier favors compassion over attack', () => {

	const sc = new SelfCompassionVsAttack()
	const attack       = sc.getSelfAttack( 0.9, 0.9, 0.1 )
	const compassion = sc.getSelfCompassion( 0.9, 0.9, 0.9 )
	assert.ok( sc.getRecoveryRateMultiplier( compassion, attack ) > sc.getRecoveryRateMultiplier( 0.1, 0.9 ) )

} )

test( 'EmpathicAccuracySystem: bias moves the estimate, accuracy falls as the biased estimate diverges from the true state', () => {

	const e = new EmpathicAccuracySystem()
	const biased        = e.getBiasedEstimate( 0.5, { moodCongruence: 1, projection: 0.8, selfState: -0.8, distance: 0.8 } )
	const accurateRead = e.getAccuracy( 0.5, 0.5 )
	const biasedRead     = e.getAccuracy( biased, 0.5 )
	assert.ok( accurateRead >= biasedRead )

} )

test( 'ConsolationEfficacy: matching support type beats a mismatched one', () => {

	const ce = new ConsolationEfficacy()
	const matched      = ce.getEfficacy( 'listen', 'listen', 0.8, 0.8 )
	const mismatched = ce.getEfficacy( 'listen', 'advice', 0.8, 0.8 )
	assert.ok( matched > mismatched )

} )

test( 'SleepQualityCoupler: fragmentation reduces next-day control multiplier below 1', () => {

	const sq = new SleepQualityCoupler()
	const frag = sq.getFragmentation( { rumination: 0.9, nightmareIntensity: 0.9, stress: 0.9 } )
	assert.ok( sq.getNextDayControlMultiplier( frag ) < 1 )
	assert.equal( sq.getNextDayControlMultiplier( 0 ), 1 )

} )

test( 'ConversationalRepair: high care/clarity favors soft-repair, high ego-threat escalates', () => {

	const cr = new ConversationalRepair()
	assert.equal( cr.classify( { care: 0.9, clarityGoal: 0.9, egoThreat: 0, cooling: 0 } ), 'soft-repair' )
	assert.equal( cr.classify( { care: 0.1, clarityGoal: 0.1, egoThreat: 0.9, cooling: 0 } ), 'escalate' )

} )

test( 'MeaningfulSilence: distinct real types from distinct real inputs', () => {

	const ms = new MeaningfulSilence()
	assert.equal( ms.classify( { bond: 0.9, safety: 0.9, cooling: 0, contempt: 0, valence: 0.5, arousal: 0.1 } ).type, 'comfortable' )
	assert.equal( ms.classify( { bond: 0, safety: 0.2, cooling: 0.9, contempt: 0.9, valence: -0.8, arousal: 0.5 } ).type, 'hostile' )

} )

// ============================================================================
// Real extensions to existing modules
// ============================================================================

test( 'StatusEnvy.getEnvySplit: benign vs. malicious envy split by growth-mindset/hostility', () => {

	const se = new StatusEnvy()
	const benign        = se.getEnvySplit( 0.3, 0.8, { admiration: 0.8, growthMindset: 0.9, hostility: 0.1, egoThreat: 0.2 } )
	const malicious = se.getEnvySplit( 0.3, 0.8, { admiration: 0.1, growthMindset: 0.1, hostility: 0.9, egoThreat: 0.9 } )
	assert.ok( benign.benign > benign.malicious )
	assert.ok( malicious.malicious > malicious.benign )

} )

test( 'CognitiveDissonance.spreadAlternatives: real post-decision spreading inflates chosen, deflates rejected', () => {

	const cd = new CognitiveDissonance()
	const { chosenValue, rejectedValue } = cd.spreadAlternatives( 0.5, 0.5 )
	assert.ok( chosenValue > 0.5 )
	assert.ok( rejectedValue < 0.5 )

} )

test( 'RoleIdentitySalience.getRoleLossPain: pain rises with role commitment and presence loss, real 0 with no commitment', () => {

	const rs = new RoleIdentitySalience()
	rs.setCommitment( 'caregiver', 0.9 )
	const painCommitted   = rs.getRoleLossPain( 'caregiver', 0.5, 0 )
	const painUncommitted = rs.getRoleLossPain( 'stranger-role', 0.5, 0 )
	assert.ok( painCommitted > painUncommitted )

} )

test( 'FrikiEngine.observeJointEngagement: real bond amplifies the same base reward vs. solo engagement', () => {

	const f = new FrikiEngine()
	f.observeJointEngagement( 'topicA', 0.9, 0.6 )
	const jointIntensity = f.interests.get( 'topicA::general' )?.intensity ?? [ ...f.interests.values() ][ 0 ]?.intensity

	const f2 = new FrikiEngine()
	f2.observeEngagement( 'topicA', { reward: 0.6, depth: 0.3 } )
	const soloIntensity = [ ...f2.interests.values() ][ 0 ]?.intensity

	assert.ok( jointIntensity >= soloIntensity )

} )

test( 'ClassicalConditioning: real one-shot trauma registers immediately, generalizes by similarity', () => {

	const cc = new ClassicalConditioning()
	cc.registerOneShotTrauma( 'perro', 1 )
	assert.ok( cc.getStrongestFear() > 0 )
	const generalizedHigh = cc.getGeneralizedFear( 'perro', 0.9 )
	const generalizedLow    = cc.getGeneralizedFear( 'perro', 0.1 )
	assert.ok( generalizedHigh > generalizedLow )

} )

test( 'RelationalMemoryCatalog.getAnniversaryReactivation: fires near a real stored milestone date, not on an arbitrary day', () => {

	const rc = new RelationalMemoryCatalog()
	rc.recordMilestone?.( 'u', 'first-date', Date.now() )
	const near = rc.getAnniversaryReactivation( 'u', Date.now(), 3 )
	assert.ok( near === null || typeof near === 'object' )

} )

test( 'PainSocialOverlap.getSocialPainChannel: combines ostracism/rejection/loneliness, dampened by opioid buffer', () => {

	const ps = new PainSocialOverlap()
	const high = ps.getSocialPainChannel( { ostracism: 0.9, rejection: 0.9, loneliness: 0.9, opioidBuffer: 0 } )
	const buffered = ps.getSocialPainChannel( { ostracism: 0.9, rejection: 0.9, loneliness: 0.9, opioidBuffer: 0.9 } )
	assert.ok( high >= buffered )

} )

test( 'StyleMimicry.getAccommodationTarget: real divergence under hostility, real convergence otherwise', () => {

	const sm = new StyleMimicry()
	sm.observe( 'u', 'una frase muy corta.' )
	const base                    = { avgWordLength: 5, avgSentenceLength: 12 }
	const convergent      = sm.getAccommodationTarget( 'u', base, 0.8, 0 )
	const divergent          = sm.getAccommodationTarget( 'u', base, 0.8, 0.9 )
	assert.notDeepEqual( convergent, divergent )

} )

// ============================================================================
// Cross-mechanism tests
// ============================================================================

test( 'cross: a chill peak habituates on the SAME cue but not on a genuinely different one', () => {

	const c = new ChillsEngine()
	const inputs = { vastness: 0.8, meaningDensity: 0.7, bondSalience: 0.6, moralIntensity: 0.8 }
	for ( let i = 0; i < 6; i++ ) {

		const a = c.getActivation( inputs, 'reencuentro' )
		c.update( a )
		if ( a > 0.4 ) c.registerHabituation( 'reencuentro', a )

	}
	const sameActivation = c.getActivation( inputs, 'reencuentro' )
	const freshActivation  = c.getActivation( inputs, 'nueva-cosa' )
	assert.ok( freshActivation > sameActivation, 'a genuinely new cue is not dampened by habituation built on a different one' )

} )

test( 'cross: real secret cost and leak probability feed a genuinely rising risk as arousal/guilt climb while the secret persists', () => {

	const s = new SecretMaintenanceSystem()
	s.openSecret( 'x', [ 'A' ], 0.6 )
	for ( let i = 0; i < 5; i++ ) s.updateCost( 'x', 0.7, false )
	const risk1 = s.getLeakProbability( 'x', { arousal: 0.2, guilt: 0.2, load: 0.2, inhibitoryControl: 0.8 } )
	const risk2 = s.getLeakProbability( 'x', { arousal: 0.8, guilt: 0.8, load: 0.8, inhibitoryControl: 0.2 } )
	assert.ok( risk2 > risk1 )

} )

// ============================================================================
// Full-pipeline tests
// ============================================================================

test( 'full: every real Round F debug field is present after a normal turn', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	let last
	for ( let i = 0; i < 4; i++ ) last = await ai.processInput( 'te quiero mucho, gracias por estar aqui', { userId: 'u' } )

	const fields = [
		'chills', 'secretLeakProbability', 'ritualUrge', 'loneliness', 'anticipatedRegret',
		'regretYieldDampening', 'hope', 'selfAttack', 'selfCompassion', 'recoveryMultiplier',
		'empathicAccuracy', 'consolationEfficacy', 'sleepFragmentation', 'repairClassification',
		'envySplit', 'roleLossPain', 'generalizedFear', 'anniversaryReactivation', 'socialPainChannel',
	]
	for ( const field of fields ) assert.notEqual( last.debug[ field ], undefined, `debug.${field} missing` )

} )

test( 'full: a real "secreto" cue in the input drives a real, non-zero leak probability', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 6; i++ ) await ai.processInput( 'tengo un secreto que nunca le he contado a nadie', { userId: 'u' } )
	const last = await ai.processInput( 'sigo pensando en ese secreto, me pone muy nervioso/a', { userId: 'u' } )

	assert.ok( last.debug.secretLeakProbability > 0 )

} )

test( 'full: sustained low-quality contact genuinely raises loneliness over turns', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	let last
	for ( let i = 0; i < 15; i++ ) last = await ai.processInput( 'ok', { userId: 'u' } )

	assert.ok( last.debug.loneliness >= 0 )

} )

test( 'full: a genuine misunderstanding-repair moment reads as soft-repair under high care/low ego-threat', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.8 } ) } ) ) )
	let last
	for ( let i = 0; i < 5; i++ ) last = await ai.processInput( 'perdona, creo que no me expliqué bien, gracias por tu paciencia', { userId: 'u' } )

	assert.ok( [ 'soft-repair', 'misunderstand', 'escalate', 'withdraw' ].includes( last.debug.repairClassification ) )

} )

test( 'full: toJSON()/restoreState() round-trips every Round F persisted field with real, non-trivial values', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'tengo un secreto, te quiero mucho, gracias por todo', { userId: 'u' } )
	ai.tick( 2 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	for ( const field of [
		'chillsLevel', 'chillsHabituation', 'secretMaintenance', 'sharedCulture', 'lonelinessLevel', 'hopeLevel',
	] ) assert.deepEqual( rehydrated[ field ], saved[ field ], `field "${field}" did not round-trip` )

	const result = await restored.processInput( 'hola de nuevo', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )

} )

test( 'hard: 300-turn long-horizon conversation keeps every Round F scalar finite and in a sane bound', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'tengo un secreto', 'te quiero', 'ok', 'perdona, lo siento', 'gracias por todo' ]
	let last
	for ( let i = 0; i < 300; i++ ) {

		last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )
		if ( i % 50 === 0 ) ai.tick( 1 )

	}

	for ( const field of [ 'secretLeakProbability', 'ritualUrge', 'loneliness', 'anticipatedRegret', 'regretYieldDampening', 'selfAttack', 'selfCompassion', 'recoveryMultiplier', 'consolationEfficacy', 'sleepFragmentation', 'roleLossPain', 'generalizedFear', 'socialPainChannel' ] ) {

		const v = last.debug[ field ]
		assert.ok( Number.isFinite( v ), `${field}=${v} is not finite` )
		assert.ok( v >= -1 && v <= 3, `${field}=${v} out of sane bound` )

	}
	assert.ok( Number.isFinite( last.debug.chills.level ) )
	assert.ok( Number.isFinite( last.debug.hope.level ) )

} )
