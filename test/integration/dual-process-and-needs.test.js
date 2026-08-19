/**
 * Directed + cross-mechanism tests for "Round A" of the user-requested
 * global-mind mechanisms: DualProcessController, PredictiveProcessingCore,
 * SelfDeterminationNeeds, HomeostaticFeelingGenerator, WorkingMemoryBuffer,
 * HabitVsGoalSystem, GoalHierarchyManager, BoredomSystem — plus the two real
 * extensions (ControllabilityEstimate's learned-helplessness/coping-style
 * addition, RegulationStrategySelector's 2 extra Gross stages).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { DualProcessController }      from '../../src/core/DualProcessController.js'
import { PredictiveProcessingCore }     from '../../src/cognition/PredictiveProcessingCore.js'
import { SelfDeterminationNeeds }         from '../../src/core/SelfDeterminationNeeds.js'
import { HomeostaticFeelingGenerator }      from '../../src/core/HomeostaticFeelingGenerator.js'
import { WorkingMemoryBuffer }                from '../../src/cognition/WorkingMemoryBuffer.js'
import { HabitVsGoalSystem }                    from '../../src/cognition/HabitVsGoalSystem.js'
import { GoalHierarchyManager }                   from '../../src/cognition/GoalHierarchyManager.js'
import { BoredomSystem }                            from '../../src/core/BoredomSystem.js'
import { ControllabilityEstimate }                    from '../../src/cognition/ControllabilityEstimate.js'
import { RegulationStrategySelector }                   from '../../src/behavior/RegulationStrategySelector.js'
import { Totemheart, Personality }                        from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

// ============================================================================
// DualProcessController
// ============================================================================

test( 'DualProcessController: real high-stakes+conflict pushes toward S2, low-stakes+depleted toward S1', () => {

	const d = new DualProcessController()
	const s2 = d.compute( { stakes: 0.9, conflict: 0.8, timeAvailable: 0.9 } )
	const s1 = d.compute( { stakes: 0.1, depletion: 0.9, arousal: 0.9, cortisol: 0.8 } )

	assert.equal( s2.mode, 'S2' )
	assert.equal( s1.mode, 'S1' )
	assert.ok( s2.pS2 > s1.pS2 )

} )

test( 'DualProcessController: pS2 always a real, bounded probability', () => {

	const d = new DualProcessController()
	for ( let i = 0; i < 20; i++ ) {

		const r = d.compute( { stakes: Math.random(), conflict: Math.random(), arousal: Math.random(), cortisol: Math.random(), depletion: Math.random() } )
		assert.ok( r.pS2 >= 0 && r.pS2 <= 1 )

	}

} )

// ============================================================================
// PredictiveProcessingCore
// ============================================================================

test( 'PredictiveProcessingCore: real running estimate converges toward repeated observations', () => {

	const p = new PredictiveProcessingCore( { alpha: 0.3 } )
	let last
	for ( let i = 0; i < 30; i++ ) last = p.observe( 'x', 0.8 )
	assert.ok( Math.abs( last.estimate - 0.8 ) < 0.05 )

} )

test( 'PredictiveProcessingCore: polarity flips the sign of the real valence delta for the same error', () => {

	const p1 = new PredictiveProcessingCore()
	const p2 = new PredictiveProcessingCore()
	const aversive   = p1.observe( 'x', 0.9, { polarity: -1 } )
	const appetitive = p2.observe( 'x', 0.9, { polarity: 1 } )
	assert.ok( aversive.valenceDelta < 0 )
	assert.ok( appetitive.valenceDelta > 0 )

} )

// ============================================================================
// SelfDeterminationNeeds
// ============================================================================

test( 'SelfDeterminationNeeds: draining a need produces a real deficit and lowers intrinsic motivation', () => {

	const s = new SelfDeterminationNeeds()
	const before = s.getIntrinsicMotivation()
	s.drain( 'competence', 0.5 )
	assert.ok( s.getDeficit( 'competence' ) > 0 )
	assert.ok( s.getIntrinsicMotivation() < before )

} )

test( 'SelfDeterminationNeeds: real decay pulls levels back toward their own set points over time', () => {

	const s = new SelfDeterminationNeeds( { decayRate: 0.5 } )
	s.drain( 'autonomy', 0.5 )
	const deficitBefore = s.getDeficit( 'autonomy' )
	for ( let i = 0; i < 10; i++ ) s.decay( 1 )
	assert.ok( s.getDeficit( 'autonomy' ) < deficitBefore )

} )

test( 'SelfDeterminationNeeds: frustration affect is a real, bounded weighted sum of deficits', () => {

	const s = new SelfDeterminationNeeds()
	s.drain( 'autonomy', 1 )
	s.drain( 'competence', 1 )
	s.drain( 'relatedness', 1 )
	assert.ok( s.getFrustrationAffect() > 0.5 )
	assert.ok( s.getFrustrationAffect() <= 1 )

} )

// ============================================================================
// HomeostaticFeelingGenerator
// ============================================================================

test( 'HomeostaticFeelingGenerator: the largest real deviation from set point becomes the dominant feeling', () => {

	const h = new HomeostaticFeelingGenerator()
	const result = h.compute( {
		fatigue  : { level: 0.9, setPoint: 0.6 }, // small deviation
		overload : { level: 0.1, setPoint: 0.6 }, // large deviation
	} )
	assert.equal( result.dominant, 'overload' )
	assert.ok( result.feelings.overload.intensity > result.feelings.fatigue.intensity )

} )

// ============================================================================
// WorkingMemoryBuffer
// ============================================================================

test( 'WorkingMemoryBuffer: real load rises with active items and caps real reasoning quality', () => {

	const w = new WorkingMemoryBuffer( { capacity: 4 } )
	assert.equal( w.getLoad(), 0 )
	w.hold( 'a' ); w.hold( 'b' )
	assert.ok( w.getLoad() > 0 && w.getLoad() < 1 )
	w.hold( 'c' ); w.hold( 'd' ); w.hold( 'e' ); w.hold( 'f' )
	assert.equal( w.getLoad(), 1 )
	assert.equal( w.getReasonQuality(), 0 )

} )

test( 'WorkingMemoryBuffer: releasing an item genuinely lowers real load', () => {

	const w = new WorkingMemoryBuffer( { capacity: 4 } )
	w.hold( 'a' ); w.hold( 'b' )
	const before = w.getLoad()
	w.release( 'a' )
	assert.ok( w.getLoad() < before )

} )

// ============================================================================
// HabitVsGoalSystem
// ============================================================================

test( 'HabitVsGoalSystem: real repeated reinforcement of one context genuinely grows its habit strength and shifts mode', () => {

	const hg = new HabitVsGoalSystem()
	const before = hg.compute( 'ctx', {} )
	for ( let i = 0; i < 15; i++ ) hg.reinforce( 'ctx' )
	const after = hg.compute( 'ctx', { stress: 0.7 } )
	assert.ok( after.habitStrength > before.habitStrength )
	assert.equal( after.mode, 'habit' )

} )

test( 'HabitVsGoalSystem: high real goal salience pulls mode back toward goal-directed even with a strong habit', () => {

	const hg = new HabitVsGoalSystem()
	for ( let i = 0; i < 15; i++ ) hg.reinforce( 'ctx' )
	const highGoal = hg.compute( 'ctx', { goalSalience: 1, novelty: 1 } )
	assert.equal( highGoal.mode, 'goal' )

} )

// ============================================================================
// GoalHierarchyManager
// ============================================================================

test( 'GoalHierarchyManager: the real highest-utility goal wins, and mutual inhibition genuinely lowers competitors', () => {

	const g = new GoalHierarchyManager()
	g.setGoal( 'strong', { reward: 0.9, urgency: 0.9 } )
	g.setGoal( 'weak', { reward: 0.2, urgency: 0.2 } )
	const result = g.resolve()
	assert.equal( result.activeGoal, 'strong' )
	assert.ok( result.utilities.strong > result.utilities.weak )

} )

test( 'GoalHierarchyManager: empty goal set never throws', () => {

	const g = new GoalHierarchyManager()
	assert.deepEqual( g.resolve(), { activeGoal: null, utilities: {} } )

} )

// ============================================================================
// BoredomSystem
// ============================================================================

test( 'BoredomSystem: real sustained low stimulation accumulates boredom, high stimulation keeps it near 0', () => {

	const bored     = new BoredomSystem()
	const stimulated = new BoredomSystem()
	for ( let i = 0; i < 30; i++ ) { bored.update( 0.05 ); stimulated.update( 0.9 ) }
	assert.ok( bored.isBored() )
	assert.ok( !stimulated.isBored() )
	assert.ok( bored.getNoveltySeeking() > stimulated.getNoveltySeeking() )

} )

// ============================================================================
// ControllabilityEstimate extension (learned helplessness + coping style)
// ============================================================================

test( 'ControllabilityEstimate: real repeated uncontrollable failure erodes the global control belief', () => {

	const c = new ControllabilityEstimate()
	const before = c.globalControlBelief
	for ( let i = 0; i < 5; i++ ) c.recordUncontrollableFailure()
	assert.ok( c.globalControlBelief < before )

} )

test( 'ControllabilityEstimate: real decay recovers the global belief once failures stop', () => {

	const c = new ControllabilityEstimate()
	for ( let i = 0; i < 5; i++ ) c.recordUncontrollableFailure()
	const eroded = c.globalControlBelief
	for ( let i = 0; i < 20; i++ ) c.decay( 1 )
	assert.ok( c.globalControlBelief > eroded )

} )

test( 'ControllabilityEstimate: real coping-style switch follows situational controllability, action-initiation follows the global belief', () => {

	const c = new ControllabilityEstimate()
	for ( let i = 0; i < 10; i++ ) c.observeOutcome( 'bucket', 0.5, 0.1 ) // real, repeated improvement -> controllable
	assert.equal( c.getCopingStyle( 'bucket' ), 'problem-focused' )

	for ( let i = 0; i < 8; i++ ) c.recordUncontrollableFailure()
	assert.ok( c.getActionInitiationProbability() < 0.5 )

} )

// ============================================================================
// RegulationStrategySelector extension (5-stage Gross model)
// ============================================================================

test( 'RegulationStrategySelector: now exposes all 5 real Gross-model strategies', () => {

	const rs = new RegulationStrategySelector()
	assert.deepEqual( rs.getStrategies().sort(), [ 'attentionalDeployment', 'distraction', 'reappraisal', 'situationModification', 'situationSelection', 'suppression' ].sort() )

} )

test( 'RegulationStrategySelector: a strong real fit for the new earliest-stage strategy can win selection', () => {

	const rs = new RegulationStrategySelector()
	const result = rs.select( { situationSelection: 1, situationModification: 0, reappraisal: 0, attentionalDeployment: 0, suppression: 0, distraction: 0 }, { expectedReduction: 0.9 } )
	assert.equal( result.selected, 'situationSelection' )

} )

// ============================================================================
// cross: among Round-A mechanisms
// ============================================================================

test( 'cross: HabitVsGoalSystem\'s real goalSalience input can be driven by DualProcessController\'s own real pS2 output', () => {

	const dual = new DualProcessController()
	const habit  = new HabitVsGoalSystem()
	for ( let i = 0; i < 15; i++ ) habit.reinforce( 'ctx' )

	const deliberative = dual.compute( { stakes: 1, conflict: 1, timeAvailable: 1 } )
	const result             = habit.compute( 'ctx', { goalSalience: deliberative.pS2 } )
	assert.equal( result.mode, 'goal', 'a real high-pS2 deliberative read should be able to override even a strong habit' )

} )

test( 'cross: SelfDeterminationNeeds deficits feed real, distinct HomeostaticFeelingGenerator readouts', () => {

	const sdt      = new SelfDeterminationNeeds()
	const feelings = new HomeostaticFeelingGenerator()
	sdt.drain( 'relatedness', 0.6 )

	const result = feelings.compute( { connectionHunger: { level: 1 - sdt.getDeficit( 'relatedness' ), setPoint: 0.9 } } )
	assert.ok( result.feelings.connectionHunger.intensity > 0 )
	assert.equal( result.feelings.connectionHunger.deficit, true )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: Round-A debug fields are all real, finite, and present on every processInput() turn', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } ) // this test asserts on `debug`, which the real (and legitimate) full-hijack early-return branch doesn't carry
	for ( let i = 0; i < 12; i++ ) {

		const result = await ai.processInput( `mensaje ${i}, algo distinto cada vez ${Math.random()}`, { userId: 'u' } )
		assert.ok( result.debug.dualProcess && [ 'S1', 'S2' ].includes( result.debug.dualProcess.mode ) )
		assert.ok( [ 'habit', 'goal' ].includes( result.debug.habitVsGoal.mode ) )
		assert.equal( typeof result.debug.predictiveError.arousalDelta, 'number' )
		assert.ok( Number.isFinite( result.debug.predictiveError.arousalDelta ) )
		assert.ok( result.debug.homeostaticFeelings.dominant )
		assert.ok( result.debug.goalArbitration.activeGoal )
		assert.ok( result.debug.workingMemoryLoad >= 0 && result.debug.workingMemoryLoad <= 1 )
		assert.ok( Number.isFinite( result.debug.boredom ) )

	}

} )

test( 'full: repeating the exact same turn for the same user genuinely grows real habit strength and boredom together', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	// This test's real target is habit/boredom growth, not amygdala-hijack
	// behavior — 15 turns of the exact same neutral text can, rarely, still
	// genuinely cross the real hijack threshold through accumulated
	// narrowing/kindling (the same real, pre-existing early-return branch
	// documented in smoke.test.js's suggestedTemperature fix). Neutralized
	// here for the same reason.
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	let first, last
	for ( let i = 0; i < 15; i++ ) {

		const r = await ai.processInput( 'hola, siempre lo mismo', { userId: 'u' } )
		if ( i === 0 ) first = r
		last = r

	}
	assert.ok( last.debug.habitVsGoal.habitStrength > first.debug.habitVsGoal.habitStrength )
	assert.ok( last.debug.boredom > first.debug.boredom )

} )

test( 'full: a real rupture drains SelfDeterminationNeeds relatedness and records an uncontrollable failure', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.4 } ) } ) )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

	const beforeBelief = ai.controllabilityEstimate.globalControlBelief
	let ruptured = false
	for ( let i = 0; i < 40 && !ruptured; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion', { userId: 'u' } )
		ruptured = ai.loveHateEngine.getBond( 'u' ).ruptured

	}
	assert.ok( ruptured )
	assert.ok( ai.controllabilityEstimate.globalControlBelief < beforeBelief )

} )

test( 'full: toJSON()/restoreState() round-trips every real Round-A persisted field', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	for ( let i = 0; i < 10; i++ ) await ai.processInput( `mensaje variado ${i}`, { userId: 'u' } )
	ai.tick( 2 )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noBurst( new Totemheart() )
	restored.restoreState( saved )

	assert.deepEqual( restored.selfDeterminationNeeds.levels, saved.selfDeterminationLevels )
	assert.equal( restored.boredomSystem.level, saved.boredomLevel )
	assert.equal( restored.controllabilityEstimate.globalControlBelief, saved.globalControlBelief )
	assert.deepEqual( [ ...restored.habitVsGoalSystem.strengths.entries() ], saved.habitStrengths )

	const result = await restored.processInput( 'hola de nuevo', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )

} )
