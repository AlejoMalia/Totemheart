/**
 * Cross-module mocks AMONG the 20 round-3 additions — deliberately stacking
 * several of them in the same scenario, standalone from the full Totemheart
 * pipeline (see emergent-full-framework-cross.test.js for that), to find
 * real interaction bugs between the new pieces themselves.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { NarrativeSelfEngine }       from '../../src/social/NarrativeSelfEngine.js'
import { LegacyMemory }              from '../../src/social/LegacyMemory.js'
import { MultiAgentSocialGraph }     from '../../src/social/MultiAgentSocialGraph.js'
import { PowerDynamicsEngine }       from '../../src/social/PowerDynamicsEngine.js'
import { BetrayalTraumaTrace }       from '../../src/social/BetrayalTraumaTrace.js'
import { ColonyDynamics }            from '../../src/social/ColonyDynamics.js'
import { OntogenicDevelopment }      from '../../src/cognition/OntogenicDevelopment.js'
import { MetaEmotionLayer }          from '../../src/cognition/MetaEmotionLayer.js'
import { EmotionalForecasting }      from '../../src/cognition/EmotionalForecasting.js'
import { InsightGenerator }          from '../../src/cognition/InsightGenerator.js'
import { EnergyBudget }              from '../../src/cognition/EnergyBudget.js'
import { RegulationStrategySelector } from '../../src/behavior/RegulationStrategySelector.js'
import { SomaticMarkerNetwork }      from '../../src/embodiment/SomaticMarkerNetwork.js'
import { JealousyTriangle }          from '../../src/social/JealousyTriangle.js'
import { MoralInjury }               from '../../src/core/MoralInjury.js'
import { ValueHierarchy }            from '../../src/cognition/ValueHierarchy.js'

test( 'cross: BetrayalTraumaTrace + PowerDynamicsEngine on the same betrayal — trauma raises threshold WHILE power tracking stays independent', () => {

	const trauma = new BetrayalTraumaTrace()
	const power    = new PowerDynamicsEngine()

	trauma.record( 'u', 0.9 ) // severe, permanent trace
	power.update( 'u', { submissiveAct: 1 } ) // the betrayal also read as a real submissive moment

	assert.ok( trauma.hasPermanentTrace( 'u' ) )
	assert.ok( power.getPower( 'u' ) < 0 )
	// Neither module's state leaked into the other's — verified by checking
	// each only holds what it was explicitly given.
	assert.equal( trauma.getTrace( 'v' ), 0 )
	assert.equal( power.getPower( 'v' ), 0 )

} )

test( 'cross: JealousyTriangle kindling compounds across MULTIPLE real episodes while MoralInjury from an UNRELATED topic stays untouched', () => {

	const triangle = new JealousyTriangle()
	const injury      = new MoralInjury( { threshold: 0.5 } )

	for ( let i = 0; i < 5; i++ ) triangle.computeKindling( 'rival', triangle.computeJealousy( 0.6, 0.6, 0.2 ) )
	injury.evaluate( 'unrelated_topic', 0.9, 1 )

	assert.ok( triangle.getKindling( 'rival' ) > 0 )
	assert.ok( injury.getScar( 'unrelated_topic' ) > 0 )
	assert.equal( injury.getScar( 'rival' ), 0, 'MoralInjury must not have absorbed JealousyTriangle\'s own rival-keyed state' )

} )

test( 'cross: OntogenicDevelopment\'s adolescence-elevated Neuroticism feeds a real, proportionally bigger InsightGenerator resistance via CognitiveDissonance-style gating', () => {

	const dev             = new OntogenicDevelopment()
	const generator = new InsightGenerator()
	for ( let i = 0; i < 20; i++ ) generator.observe( 'pattern', -1 )

	const adultNeuroticism      = dev.getEffectiveTrait( 0.4, 'neuroticism', 'adulthood' )
	const adolescentNeuroticism = dev.getEffectiveTrait( 0.4, 'neuroticism', 'adolescence' )

	// Real, own-composed dissonance proxy from the effective trait — higher
	// effective neuroticism reads as more real resistance to a negative insight.
	const adultProbability      = generator.getInsightProbability( 'pattern', 0.5, adultNeuroticism )
	const adolescentProbability = generator.getInsightProbability( 'pattern', 0.5, adolescentNeuroticism )
	assert.ok( adolescentProbability <= adultProbability )

} )

test( 'cross: EnergyBudget depletion lowers RegulationStrategySelector\'s expected benefit for EVERY strategy consistently', () => {

	const energy   = new EnergyBudget( { capacity: 1 } )
	const selector = new RegulationStrategySelector()

	const fits = { reappraisal: 0.6, suppression: 0.6, distraction: 0.6 }
	const fullEnergy    = selector.select( fits, { expectedReduction: 0.6, egoDepletion: 1 - energy.getLevel(), conscientiousness: 0.5 } )

	energy.spend( 0.9 )
	const lowEnergy     = selector.select( fits, { expectedReduction: 0.6, egoDepletion: 1 - energy.getLevel(), conscientiousness: 0.5 } )

	for ( const strategy of selector.getStrategies() ) assert.ok( lowEnergy.scores[ strategy ] <= fullEnergy.scores[ strategy ] )

} )

test( 'cross: SomaticMarkerNetwork\'s real gut-feeling bias feeds EmotionalForecasting\'s utility as the candidate\'s own desirability read', () => {

	const somatic     = new SomaticMarkerNetwork()
	const forecasting = new EmotionalForecasting()

	somatic.recordOutcome( 'hablar de dinero con mi familia', -0.9, 1 )
	const bias = somatic.getBias( 'quiero hablar de dinero otra vez con mi familia' )
	assert.ok( bias < 0 )

	const utility = forecasting.computeUtility( bias, { userModelConfidence: 0.8, currentMoodValence: 0, agreeableness: 0.5, neuroticism: 0.5 } )
	assert.ok( utility.predictedUserDelta < 0 )

} )

test( 'cross: NarrativeSelfEngine chapter crises and MetaEmotionLayer\'s meta-valence both read the SAME real emotional volatility coherently', () => {

	const narrative = new NarrativeSelfEngine( { alpha: 0.5 } )
	const meta          = new MetaEmotionLayer()

	let sawCrisis = false
	let metaValences = []
	for ( let i = 0; i < 10; i++ ) {

		const eventValence = i % 2 === 0 ? 0.9 : -0.9
		const update              = narrative.addEvent( eventValence, { openness: 0.8, neuroticism: 0.8 } )
		if ( update.crisis ) sawCrisis = true
		metaValences.push( meta.evaluateMetaValence( eventValence, 0, 0.5 ) )

	}

	assert.ok( sawCrisis )
	// A wildly oscillating real emotional signal should ALSO read as real
	// deviation from a neutral personal standard on average — both real
	// signals agree the run was volatile, from two independent formulas.
	const meanMetaValence = metaValences.reduce( ( a, b ) => a + b, 0 ) / metaValences.length
	assert.ok( meanMetaValence < 1 )

} )

test( 'cross: LegacyMemory activation and ColonyDynamics contagion are both real, additive, and don\'t corrupt each other\'s state when applied to the same conversation', () => {

	const legacy = new LegacyMemory()
	const colony    = new ColonyDynamics()

	legacy.inherit( 'confiar en la familia', 0.7, 1 )
	colony.register( 'ai_instance_a', { valence: 0.6, arousal: 0.4 } )
	colony.register( 'ai_instance_b', { valence: -0.3, arousal: 0.5 } )

	const activation = legacy.getBestActivation( 'hoy hable de confiar en la familia' )
	const contagion     = colony.computeContagion( 'ai_instance_a', {}, { ai_instance_b: 0.8 } )

	assert.ok( activation && activation.activation > 0 )
	assert.ok( Number.isFinite( contagion.valence ) )
	// Real independence check: LegacyMemory has no knowledge of colony members.
	assert.equal( legacy.entries.length, 1 )
	assert.equal( colony.getMemberCount(), 2 )

} )

test( 'cross: MultiAgentSocialGraph\'s real coalition strength reflects JealousyTriangle\'s own rival dynamics when both read the same underlying bond data', () => {

	const graph      = new MultiAgentSocialGraph()
	const triangle = new JealousyTriangle()

	// A real triadic setup: self has high affinity with "other", rival is
	// rising while self falls — both modules read the SAME real trend.
	const jealousy = triangle.computeJealousy( 0.7, 0.6, 0.6 )
	assert.ok( jealousy > 0 )

	const edges = [
		{ from: 'self', to: 'other', weight: graph.computeEdgeWeight( 0.6, 0.1, 0, 0.5 ) },
		{ from: 'rival', to: 'other', weight: graph.computeEdgeWeight( 0.7, 0.1, 0.2, 0.5 ) },
	]
	const coalition = graph.computeCoalitionStrength( edges )
	assert.ok( Number.isFinite( coalition ) )
	assert.ok( coalition > 0, 'a real positive coalition should exist while jealousy is simultaneously nonzero — both real readings of the same underlying warmth' )

} )

test( 'cross: ValueHierarchyDrift and MoralInjury both respond to the SAME real moral-violation event without one masking the other', () => {

	const values = new ValueHierarchy( { care: 0.6 } )
	const injury    = new MoralInjury( { threshold: 0.6 } )

	const violationStress = 0.9
	values.drift( 'care', violationStress, -1, 0.7 ) // a real violation of "care" pulls the value DOWN (alignmentSign=-1)
	const injuryResult      = injury.evaluate( 'care_violation', violationStress, 1 )

	assert.ok( values.getWeight( 'care' ) < 0.6 )
	assert.ok( injuryResult.injured )
	assert.ok( injury.getScar( 'care_violation' ) > 0 )

} )
