/**
 * Directed tests for the round-3 mechanisms: 15 genuinely new classes plus
 * 5 real extensions to existing modules (IdentityThreatMonitor's repair
 * layer, JealousyTriangle's kindling, MoralInjury's redemption arc,
 * ValueHierarchy's drift, InteroceptivePredictionError's personality
 * scaling). Each tested directly against its own real formula.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { NarrativeSelfEngine }       from '../../src/social/NarrativeSelfEngine.js'
import { LegacyMemory }              from '../../src/social/LegacyMemory.js'
import { MultiAgentSocialGraph }     from '../../src/social/MultiAgentSocialGraph.js'
import { CulturalScriptLibrary }     from '../../src/social/CulturalScriptLibrary.js'
import { PowerDynamicsEngine }       from '../../src/social/PowerDynamicsEngine.js'
import { BetrayalTraumaTrace }       from '../../src/social/BetrayalTraumaTrace.js'
import { ColonyDynamics }            from '../../src/social/ColonyDynamics.js'
import { OntogenicDevelopment }      from '../../src/cognition/OntogenicDevelopment.js'
import { MetaEmotionLayer }          from '../../src/cognition/MetaEmotionLayer.js'
import { EmotionalForecasting }      from '../../src/cognition/EmotionalForecasting.js'
import { InsightGenerator }          from '../../src/cognition/InsightGenerator.js'
import { EnergyBudget }              from '../../src/cognition/EnergyBudget.js'
import { RegulationStrategySelector } from '../../src/behavior/RegulationStrategySelector.js'
import { CreativeModeSwitch }        from '../../src/behavior/CreativeModeSwitch.js'
import { SomaticMarkerNetwork }      from '../../src/embodiment/SomaticMarkerNetwork.js'

import { IdentityThreatMonitor }     from '../../src/social/IdentityThreatMonitor.js'
import { JealousyTriangle }          from '../../src/social/JealousyTriangle.js'
import { MoralInjury }               from '../../src/core/MoralInjury.js'
import { ValueHierarchy }            from '../../src/cognition/ValueHierarchy.js'
import { InteroceptivePredictionError } from '../../src/embodiment/InteroceptivePredictionError.js'

// ============================================================================
// NarrativeSelfEngine
// ============================================================================

test( 'NarrativeSelfEngine: a single event moves the chapter theme toward it via real EMA', () => {

	const engine = new NarrativeSelfEngine( { alpha: 0.5 } )
	const result   = engine.addEvent( 0.8, {} )
	assert.ok( result.theme > 0 && result.theme < 0.8 )

} )

test( 'NarrativeSelfEngine: consistent events raise real coherence, wildly opposite events lower it', () => {

	// Compares the MEAN of each call's own real reported coherence across the
	// run, not the final getCoherence() alone — a fresh chapter (started
	// exactly on the last event, a real and correct outcome of a genuine
	// crisis) legitimately reads as coherence=1 with zero events yet, which
	// would make a final-state-only comparison flaky depending on exactly
	// when the last reset landed, not on the real underlying pattern.
	const consistent               = new NarrativeSelfEngine( { alpha: 0.3 } )
	const consistentCoherences = []
	for ( let i = 0; i < 8; i++ ) consistentCoherences.push( consistent.addEvent( 0.7, {} ).coherence )

	const chaotic               = new NarrativeSelfEngine( { alpha: 0.3 } )
	const chaoticCoherences = []
	for ( let i = 0; i < 8; i++ ) chaoticCoherences.push( chaotic.addEvent( i % 2 === 0 ? 1 : -1, {} ).coherence )

	const mean = arr => arr.reduce( ( a, b ) => a + b, 0 ) / arr.length
	assert.ok( mean( chaoticCoherences ) < mean( consistentCoherences ) )

} )

test( 'NarrativeSelfEngine: a real narrative crisis on a wildly incoherent run can start a new chapter', () => {

	const engine = new NarrativeSelfEngine( { alpha: 0.5 } )
	let sawCrisis  = false
	for ( let i = 0; i < 12; i++ ) {

		const result = engine.addEvent( i % 2 === 0 ? 1 : -1, { openness: 1, neuroticism: 1 } )
		if ( result.crisis ) sawCrisis = true

	}
	assert.ok( sawCrisis )
	assert.ok( engine.getChapterCount() >= 1 )

} )

test( 'NarrativeSelfEngine: high Conscientiousness dampens how much a single event can pull the theme', () => {

	const disciplined = new NarrativeSelfEngine( { alpha: 0.5 } )
	const loose             = new NarrativeSelfEngine( { alpha: 0.5 } )

	const rDisciplined = disciplined.addEvent( 1, { conscientiousness: 1 } )
	const rLoose             = loose.addEvent( 1, { conscientiousness: 0 } )

	assert.ok( rDisciplined.theme < rLoose.theme )

} )

// ============================================================================
// LegacyMemory
// ============================================================================

test( 'LegacyMemory: an inherited entry decays with real generational distance', () => {

	const legacy = new LegacyMemory( { lambda: 0.5 } )
	legacy.inherit( 'una leccion importante', 1, 0 )
	legacy.inherit( 'una leccion importante', 1, 5 )

	const recent = legacy.entries[ 0 ]
	const distant   = legacy.entries[ 1 ]
	assert.ok( legacy.getStrength( recent ) > legacy.getStrength( distant ) )

} )

test( 'LegacyMemory: activation requires real token overlap with the current context', () => {

	const legacy = new LegacyMemory()
	legacy.inherit( 'confiar en la familia', 0.8, 1 )

	assert.equal( legacy.getBestActivation( 'algo completamente distinto sin relacion' ), null )
	const activation = legacy.getBestActivation( 'hoy pensaba en confiar en la familia otra vez' )
	assert.ok( activation && activation.activation > 0 )

} )

test( 'LegacyMemory: Conscientiousness slows real decay, preserving strength longer', () => {

	const legacy = new LegacyMemory( { lambda: 0.3 } )
	legacy.inherit( 'cue', 1, 3 )
	const entry = legacy.entries[ 0 ]

	assert.ok( legacy.getStrength( entry, 1 ) > legacy.getStrength( entry, 0 ) )

} )

test( 'LegacyMemory: toJSON()/restoreState() round-trips real inherited entries', () => {

	const legacy = new LegacyMemory( { lambda: 0.1 } )
	legacy.inherit( 'algo heredado', 0.6, 2 )

	const saved       = JSON.parse( JSON.stringify( legacy.toJSON() ) )
	const restored = new LegacyMemory()
	restored.restoreState( saved )

	assert.deepEqual( restored.entries, legacy.entries )
	assert.equal( restored.lambda, legacy.lambda )

} )

// ============================================================================
// MultiAgentSocialGraph
// ============================================================================

test( 'MultiAgentSocialGraph: edge weight is real Affinity minus Aversion plus status difference', () => {

	const graph = new MultiAgentSocialGraph()
	assert.ok( Math.abs( graph.computeEdgeWeight( 0.8, 0.2, 0, 0 ) - 0.6 ) < 1e-9 )
	assert.ok( graph.computeEdgeWeight( 0.2, 0.8, 0, 0 ) < 0 )

} )

test( 'MultiAgentSocialGraph: coalition strength is the real average edge weight, empty graph reads 0', () => {

	const graph = new MultiAgentSocialGraph()
	assert.equal( graph.computeCoalitionStrength( [] ), 0 )
	const edges = [ { weight: 0.4 }, { weight: 0.8 } ]
	assert.ok( Math.abs( graph.computeCoalitionStrength( edges ) - 0.6 ) < 1e-9 )

} )

test( 'MultiAgentSocialGraph: edge instability is a real, bounded volatility reading, near-zero for a stable history', () => {

	const graph = new MultiAgentSocialGraph()
	assert.equal( graph.computeEdgeInstability( [ 0.5 ], 0.5 ), 0 )
	assert.ok( graph.computeEdgeInstability( [ 0.5, 0.5, 0.5 ], 0.5 ) < 0.01 )
	assert.ok( graph.computeEdgeInstability( [ -0.8, 0.9, -0.7, 0.8 ], 0.9 ) > graph.computeEdgeInstability( [ -0.8, 0.9, -0.7, 0.8 ], 0.1 ) )

} )

// ============================================================================
// CulturalScriptLibrary
// ============================================================================

test( 'CulturalScriptLibrary: an honor-flavored insult activates the honor script over neutral text', () => {

	const library = new CulturalScriptLibrary()
	const honorActivation = library.getActivation( 'honor', 'esto es una ofensa a mi reputacion y respeto, me desafias' )
	const neutralActivation = library.getActivation( 'honor', 'el clima esta agradable hoy' )
	assert.ok( honorActivation > neutralActivation )

} )

test( 'CulturalScriptLibrary: getDominantScript() returns null below the real activation threshold', () => {

	const library = new CulturalScriptLibrary()
	assert.equal( library.getDominantScript( 'algo neutral sin ningun script cultural', 0.3 ), null )

} )

test( 'CulturalScriptLibrary: response bias scales with real Agreeableness and the script\'s own honor_factor', () => {

	const library = new CulturalScriptLibrary()
	const text = 'ofensa reputacion humillacion desafio'
	const highAgreeableness = library.getResponseBias( 'honor', text, 1 )
	const lowAgreeableness   = library.getResponseBias( 'honor', text, 0 )
	assert.ok( highAgreeableness > lowAgreeableness )

} )

// ============================================================================
// PowerDynamicsEngine
// ============================================================================

test( 'PowerDynamicsEngine: an assertive act against a non-dominant opponent raises real power', () => {

	const engine = new PowerDynamicsEngine()
	const result   = engine.update( 'u', { assertiveAct: 1, opponentDominance: 0 } )
	assert.ok( result.power > 0 )
	assert.ok( result.fatigueCost > 0 )

} )

test( 'PowerDynamicsEngine: a submissive act lowers real power, and asserting against a dominant opponent buys less ground', () => {

	const engine = new PowerDynamicsEngine()
	engine.update( 'u', { submissiveAct: 1 } )
	assert.ok( engine.getPower( 'u' ) < 0 )

	const vsWeak      = new PowerDynamicsEngine().update( 'v', { assertiveAct: 1, opponentDominance: 0 } )
	const vsDominant = new PowerDynamicsEngine().update( 'v', { assertiveAct: 1, opponentDominance: 1 } )
	assert.ok( vsWeak.power > vsDominant.power )

} )

test( 'PowerDynamicsEngine: power decays toward zero over real ticks with no new acts', () => {

	const engine = new PowerDynamicsEngine()
	engine.update( 'u', { assertiveAct: 1, opponentDominance: 0 } )
	const before = engine.getPower( 'u' )
	engine.decay( 'u', 50 )
	assert.ok( Math.abs( engine.getPower( 'u' ) ) < Math.abs( before ) )

} )

// ============================================================================
// BetrayalTraumaTrace
// ============================================================================

test( 'BetrayalTraumaTrace: a mild betrayal decays fully away with real time', () => {

	const trace = new BetrayalTraumaTrace( { lambda: 0.01 } )
	const now      = Date.now()
	trace.record( 'u', 0.3, now )
	assert.ok( trace.getTrace( 'u', now + 100000 ) < 0.05 )
	assert.equal( trace.hasPermanentTrace( 'u' ), false )

} )

test( 'BetrayalTraumaTrace: a severe betrayal (intensity > 0.7) leaves a real permanent floor', () => {

	const trace = new BetrayalTraumaTrace( { lambda: 0.01 } )
	const now      = Date.now()
	trace.record( 'u', 0.9, now )
	assert.ok( trace.hasPermanentTrace( 'u' ) )
	assert.ok( trace.getTrace( 'u', now + 1000 * 60 * 60 * 24 * 365 * 10 ) > 0, 'even after 10 real years, a severe trace never reaches zero' )

} )

test( 'BetrayalTraumaTrace: trust threshold rises with the real trace and with Neuroticism', () => {

	const trace = new BetrayalTraumaTrace()
	trace.record( 'u', 0.8 )
	const lowNeuroticism    = trace.getTrustThreshold( 'u', 0.5, 0 )
	const highNeuroticism   = trace.getTrustThreshold( 'u', 0.5, 1 )
	assert.ok( highNeuroticism > lowNeuroticism )
	assert.ok( lowNeuroticism > 0.5 )

} )

// ============================================================================
// ColonyDynamics
// ============================================================================

test( 'ColonyDynamics: contagion is a real weighted average of OTHER registered members, excluding self', () => {

	const colony = new ColonyDynamics()
	colony.register( 'a', { valence: 1, arousal: 0.5 } )
	colony.register( 'b', { valence: -1, arousal: 0.5 } )
	colony.register( 'c', { valence: 0, arousal: 0 } )

	const contagionOnA = colony.computeContagion( 'a', {}, { b: 1, c: 1 } )
	assert.ok( Math.abs( contagionOnA.valence - ( -0.5 ) ) < 1e-9 )

} )

test( 'ColonyDynamics: coherence is 1 minus real variance — identical members read fully coherent', () => {

	const colony = new ColonyDynamics()
	colony.register( 'a', { valence: 0.5, arousal: 0.5 } )
	colony.register( 'b', { valence: 0.5, arousal: 0.5 } )
	assert.equal( colony.computeColonyCoherence(), 1 )

	const scattered = new ColonyDynamics()
	scattered.register( 'a', { valence: 1, arousal: 0.5 } )
	scattered.register( 'b', { valence: -1, arousal: 0.5 } )
	assert.ok( scattered.computeColonyCoherence() < 1 )

} )

test( 'ColonyDynamics: unregister() removes a member from future contagion/coherence computations', () => {

	const colony = new ColonyDynamics()
	colony.register( 'a', { valence: 1, arousal: 0.5 } )
	colony.register( 'b', { valence: -1, arousal: 0.5 } )
	colony.unregister( 'b' )
	assert.equal( colony.getMemberCount(), 1 )
	assert.equal( colony.computeColonyCoherence(), 1 )

} )

// ============================================================================
// OntogenicDevelopment
// ============================================================================

test( 'OntogenicDevelopment: stage is a real, deterministic, monotonic function of turns and events', () => {

	const dev = new OntogenicDevelopment()
	assert.equal( dev.getStage( 0, 0 ), 'infancy' )
	assert.equal( dev.getStage( 25, 3 ), 'childhood' )
	assert.equal( dev.getStage( 100, 10 ), 'adolescence' )
	assert.equal( dev.getStage( 300, 20 ), 'adulthood' )

} )

test( 'OntogenicDevelopment: adolescence genuinely elevates the effective Neuroticism/Extraversion reading', () => {

	const dev             = new OntogenicDevelopment()
	const baseNeuroticism = 0.4
	assert.ok( dev.getEffectiveTrait( baseNeuroticism, 'neuroticism', 'adolescence' ) > baseNeuroticism )
	assert.ok( dev.getEffectiveTrait( baseNeuroticism, 'neuroticism', 'infancy' ) === baseNeuroticism )

} )

test( 'OntogenicDevelopment: effective trait reads always stay within [0,1] even at the extremes', () => {

	const dev = new OntogenicDevelopment()
	assert.ok( dev.getEffectiveTrait( 1, 'neuroticism', 'adolescence' ) <= 1 )
	assert.ok( dev.getEffectiveTrait( 0, 'neuroticism', 'adulthood' ) >= 0 )

} )

// ============================================================================
// MetaEmotionLayer
// ============================================================================

test( 'MetaEmotionLayer: alignment with one\'s own standard reads as positive meta-valence, deviation reads negative', () => {

	const layer = new MetaEmotionLayer()
	// sensitivity = 0.5 + conscientiousness*0.5, so perfect alignment (deviation=0)
	// reaches exactly 1 only at conscientiousness=1 — real formula, not 0.9 by default.
	assert.ok( Math.abs( layer.evaluateMetaValence( 0, 0, 1 ) - 1 ) < 1e-9 )
	assert.ok( layer.evaluateMetaValence( 0, 0, 0.5 ) > 0.7 )
	assert.ok( layer.evaluateMetaValence( 1, -1, 0.5 ) < 0 )

} )

test( 'MetaEmotionLayer: meta-arousal is the real absolute gap between felt and expected arousal', () => {

	const layer = new MetaEmotionLayer()
	assert.equal( layer.evaluateMetaArousal( 0.8, 0.3 ), 0.5 )
	assert.equal( layer.evaluateMetaArousal( 0.5, 0.5 ), 0 )

} )

test( 'MetaEmotionLayer: Neuroticism amplifies an already-negative meta-valence, leaves a positive one untouched', () => {

	const layer = new MetaEmotionLayer()
	assert.ok( layer.applyNeuroticismBias( -0.4, 1 ) < -0.4 )
	assert.equal( layer.applyNeuroticismBias( 0.4, 1 ), 0.4 )

} )

test( 'MetaEmotionLayer: Openness turns meta-arousal into a real, proportional curiosity signal', () => {

	const layer = new MetaEmotionLayer()
	assert.ok( layer.getMetaCuriosity( 0.8, 1 ) > layer.getMetaCuriosity( 0.8, 0.2 ) )

} )

// ============================================================================
// EmotionalForecasting
// ============================================================================

test( 'EmotionalForecasting: predicted user delta scales with real user-model confidence', () => {

	const forecasting = new EmotionalForecasting()
	assert.ok( forecasting.predictUserDelta( 0.8, 1 ) > forecasting.predictUserDelta( 0.8, 0.2 ) )

} )

test( 'EmotionalForecasting: utility trades off user vs. self delta by real Agreeableness/Neuroticism', () => {

	const forecasting = new EmotionalForecasting()
	const agreeable          = forecasting.computeUtility( 0.8, { userModelConfidence: 1, currentMoodValence: -0.8, agreeableness: 1, neuroticism: 0 } )
	const selfFocused         = forecasting.computeUtility( 0.8, { userModelConfidence: 1, currentMoodValence: 0.8, agreeableness: 0, neuroticism: 0 } )
	assert.ok( agreeable.predictedUserDelta > 0 )
	assert.ok( selfFocused.predictedSelfDelta > 0 )

} )

test( 'EmotionalForecasting: selectBest() picks the real highest-utility candidate, not the first one', () => {

	const forecasting = new EmotionalForecasting()
	const candidates       = [ { id: 'a', desirability: 0.2 }, { id: 'b', desirability: 0.9 }, { id: 'c', desirability: -0.5 } ]
	const best                 = forecasting.selectBest( candidates, { userModelConfidence: 1, agreeableness: 0.5, neuroticism: 0.5 } )
	assert.equal( best.candidate.id, 'b' )

} )

// ============================================================================
// InsightGenerator
// ============================================================================

test( 'InsightGenerator: frequency saturates toward 1 as observations accumulate, never exceeding it', () => {

	const generator = new InsightGenerator()
	for ( let i = 0; i < 100; i++ ) generator.observe( 'pattern', 1 )
	assert.ok( generator.getFrequency( 'pattern' ) < 1 )
	assert.ok( generator.getFrequency( 'pattern' ) > 0.9 )

} )

test( 'InsightGenerator: consistency is 1 for a uniformly-signed pattern, lower for a mixed one', () => {

	const generator = new InsightGenerator()
	for ( let i = 0; i < 10; i++ ) generator.observe( 'uniform', 1 )
	assert.equal( generator.getConsistency( 'uniform' ), 1 )

	const mixed = new InsightGenerator()
	for ( let i = 0; i < 10; i++ ) mixed.observe( 'mixed', i % 2 === 0 ? 1 : -1 )
	assert.ok( Math.abs( mixed.getConsistency( 'mixed' ) - 0.5 ) < 1e-9 )

} )

test( 'InsightGenerator: recency decays toward 0 as real time passes since the last observation', () => {

	const generator = new InsightGenerator( { recencyHalfLifeMs: 1000 } )
	const now             = Date.now()
	generator.observe( 'pattern', 1, now )
	assert.ok( generator.getRecency( 'pattern', now + 1000 ) < 0.6 )
	assert.ok( Math.abs( generator.getRecency( 'pattern', now ) - 1 ) < 1e-9 )

} )

test( 'InsightGenerator: insight probability requires real pattern strength AND Openness AND low dissonance together', () => {

	const generator = new InsightGenerator()
	for ( let i = 0; i < 20; i++ ) generator.observe( 'strong', 1 )

	const openLowDissonance = generator.getInsightProbability( 'strong', 1, 0 )
	const closedHighDissonance = generator.getInsightProbability( 'strong', 0, 1 )
	assert.ok( openLowDissonance > closedHighDissonance )
	assert.equal( closedHighDissonance, 0 )

} )

// ============================================================================
// EnergyBudget
// ============================================================================

test( 'EnergyBudget: spending drains real energy, never below zero', () => {

	const budget = new EnergyBudget( { capacity: 1 } )
	budget.spend( 1.5 )
	assert.equal( budget.energy, 0 )

} )

test( 'EnergyBudget: recovery is genuinely dampened by real cortisol', () => {

	const noCortisol   = new EnergyBudget( { capacity: 1, baseRecovery: 0.1 } )
	const highCortisol  = new EnergyBudget( { capacity: 1, baseRecovery: 0.1 } )
	noCortisol.spend( 0.5 )
	highCortisol.spend( 0.5 )
	noCortisol.recover( 0, 1 )
	highCortisol.recover( 1, 1 )
	assert.ok( noCortisol.energy > highCortisol.energy )

} )

test( 'EnergyBudget: performance multiplier is real √energy, degrading much faster near empty than near full', () => {

	const budget = new EnergyBudget( { capacity: 1 } )
	assert.equal( budget.getPerformanceMultiplier(), 1 )
	budget.spend( 0.5 )
	assert.ok( Math.abs( budget.getPerformanceMultiplier() - Math.sqrt( 0.5 ) ) < 1e-9 )

} )

// ============================================================================
// RegulationStrategySelector
// ============================================================================

test( 'RegulationStrategySelector: picks the real highest net-benefit strategy given real fits', () => {

	const selector = new RegulationStrategySelector()
	const result       = selector.select( { reappraisal: 0.9, suppression: 0.1, distraction: 0.1 }, { expectedReduction: 0.8, conscientiousness: 0.5 } )
	assert.equal( result.selected, 'reappraisal' )

} )

test( 'RegulationStrategySelector: real ego depletion raises every strategy\'s cost', () => {

	const selector = new RegulationStrategySelector()
	assert.ok( selector.computeCost( 'reappraisal', 1 ) > selector.computeCost( 'reappraisal', 0 ) )

} )

test( 'RegulationStrategySelector: high Neuroticism biases the pick toward suppression when fits are close', () => {

	const selector = new RegulationStrategySelector()
	const fits         = { reappraisal: 0.5, suppression: 0.5, distraction: 0.5 }
	const neurotic    = selector.select( fits, { expectedReduction: 0.5, neuroticism: 1, openness: 0, conscientiousness: 0.5 } )
	assert.equal( neurotic.selected, 'suppression' )

} )

// ============================================================================
// CreativeModeSwitch
// ============================================================================

test( 'CreativeModeSwitch: positive high arousal + novelty + Openness produces a real high divergent score', () => {

	const creativeSwitch = new CreativeModeSwitch()
	const result                = creativeSwitch.getTemperatureModifier( 0.8, 0.9, 0.9, 1 )
	assert.ok( result.divergentScore > 0.7 )
	assert.equal( result.mode, 'divergent' )

} )

test( 'CreativeModeSwitch: negative valence never counts as positive arousal, even at max arousal', () => {

	const creativeSwitch = new CreativeModeSwitch()
	const score                    = creativeSwitch.computeDivergentScore( -0.9, 1, 0, 1 )
	assert.equal( score, 0 )

} )

test( 'CreativeModeSwitch: temperature modifier stays within its real documented [0.3, 1.0] bounds', () => {

	const creativeSwitch = new CreativeModeSwitch()
	const min                     = creativeSwitch.getTemperatureModifier( -1, 1, 0, 0 )
	const max                     = creativeSwitch.getTemperatureModifier( 1, 1, 1, 1 )
	assert.ok( Math.abs( min.temperatureMod - 0.3 ) < 1e-9 )
	assert.ok( Math.abs( max.temperatureMod - 1.0 ) < 1e-9 )

} )

// ============================================================================
// SomaticMarkerNetwork
// ============================================================================

test( 'SomaticMarkerNetwork: a negative past outcome tagged to similar wording produces a real negative bias', () => {

	const network = new SomaticMarkerNetwork()
	network.recordOutcome( 'hablar de dinero con mi familia', -0.8 )
	assert.ok( network.getBias( 'quiero hablar de dinero otra vez' ) < 0 )

} )

test( 'SomaticMarkerNetwork: no token overlap produces exactly zero bias, not a fabricated reading', () => {

	const network = new SomaticMarkerNetwork()
	network.recordOutcome( 'algo sobre trabajo', -0.5 )
	assert.equal( network.getBias( 'una receta de cocina totalmente distinta' ), 0 )

} )

test( 'SomaticMarkerNetwork: markers decay with real elapsed time', () => {

	const network = new SomaticMarkerNetwork( { lambda: 0.001 } )
	const now         = Date.now()
	network.recordOutcome( 'situacion dificil', -0.9, 1, now )
	const freshBias  = network.getBias( 'situacion dificil', now )
	const staleBias   = network.getBias( 'situacion dificil', now + 1000 * 60 * 60 * 24 * 30 )
	assert.ok( Math.abs( staleBias ) < Math.abs( freshBias ) )

} )

// ============================================================================
// Extensions: IdentityThreatMonitor + Repair
// ============================================================================

test( 'IdentityThreatMonitor.computeThreat: real ego health dampens the effective threat', () => {

	const monitor = new IdentityThreatMonitor()
	assert.ok( monitor.computeThreat( 0.8, 1 ) < monitor.computeThreat( 0.8, 0 ) )
	assert.equal( monitor.computeThreat( 0.2, 1 ), 0 ) // fully buffered by a healthy ego

} )

test( 'IdentityThreatMonitor.computeRepairCost + applyRepair: Conscientiousness lowers real repair cost', () => {

	const monitor = new IdentityThreatMonitor()
	const threat     = 0.5
	assert.ok( monitor.computeRepairCost( threat, 1 ) < monitor.computeRepairCost( threat, 0 ) )

	const repaired = monitor.applyRepair( 0.5, monitor.computeRepairCost( threat, 1 ), 0.1 )
	assert.ok( repaired >= 0 && repaired <= 1 )

} )

// ============================================================================
// Extensions: JealousyTriangle + RivalryDynamics kindling
// ============================================================================

test( 'JealousyTriangle.computeJealousy: scales with rival affinity and self insecurity, dampened by own affinity', () => {

	const triangle = new JealousyTriangle()
	assert.ok( triangle.computeJealousy( 0.8, 0.8, 0 ) > triangle.computeJealousy( 0.8, 0.8, 0.9 ) )
	assert.equal( triangle.computeJealousy( 0, 0.8, 0 ), 0 )

} )

test( 'JealousyTriangle.computeKindling: repeated jealousy toward the SAME rival compounds via real kindling', () => {

	const triangle = new JealousyTriangle()
	const first        = triangle.computeKindling( 'rival', 0.5 )
	const second      = triangle.computeKindling( 'rival', 0.5 )
	assert.ok( second >= first )
	assert.equal( triangle.getKindling( 'rival' ), second )

} )

// ============================================================================
// Extensions: MoralInjury + RedemptionArc
// ============================================================================

test( 'MoralInjury.recordRepairAction + attemptRedemption: real repair credit accumulates and eventually reduces the scar', () => {

	const injury = new MoralInjury( { threshold: 0.5, redemptionThreshold: 1 } )
	injury.evaluate( 'topic', 0.9, 1 )
	const scarBefore = injury.getScar( 'topic' )

	// Not enough credit yet — no real redemption.
	injury.recordRepairAction( 'topic', 0.3, 1 )
	assert.equal( injury.attemptRedemption( 'topic' ).healed, false )

	// Enough real credit accumulated — a real, progressive (not full) reduction.
	injury.recordRepairAction( 'topic', 1, 5 )
	const result = injury.attemptRedemption( 'topic' )
	assert.ok( result.healed )
	assert.ok( result.scar < scarBefore )
	assert.ok( result.scar > 0, 'progressive decay, never full erasure' )

} )

test( 'MoralInjury.recordRepairAction: a no-op for a topic with no real scar', () => {

	const injury = new MoralInjury()
	assert.deepEqual( injury.recordRepairAction( 'never_injured', 1, 1 ), { progress: 0 } )

} )

// ============================================================================
// Extensions: ValueHierarchyDrift
// ============================================================================

test( 'ValueHierarchy.drift: Openness scales the real learning rate — a more open mind drifts faster', () => {

	const values = new ValueHierarchy( { care: 0.5 } )
	const openDrift    = values.drift( 'care', 1, 1, 1 )
	const values2         = new ValueHierarchy( { care: 0.5 } )
	const closedDrift  = values2.drift( 'care', 1, 1, 0 )
	assert.ok( openDrift > closedDrift )

} )

test( 'ValueHierarchy.drift: the real (1 - Value_i) bounding term self-limits drift near the ceiling', () => {

	const nearCeiling = new ValueHierarchy( { care: 0.98 } )
	const nearFloor       = new ValueHierarchy( { care: 0.1 } )
	const deltaAtCeiling = nearCeiling.drift( 'care', 1, 1, 1 ) - 0.98
	const deltaAtFloor       = nearFloor.drift( 'care', 1, 1, 1 ) - 0.1
	assert.ok( deltaAtCeiling < deltaAtFloor )

} )

test( 'ValueHierarchy.drift: alignmentSign\'s real sign determines the drift direction', () => {

	const positive = new ValueHierarchy( { care: 0.5 } )
	const negative = new ValueHierarchy( { care: 0.5 } )
	assert.ok( positive.drift( 'care', 1, 1, 0.5 ) > 0.5 )
	assert.ok( negative.drift( 'care', 1, -1, 0.5 ) < 0.5 )

} )

// ============================================================================
// Extensions: PredictiveInteroception (personality-scaled anxiety)
// ============================================================================

test( 'InteroceptivePredictionError.getAnxietyContribution: default call (no scale) keeps identical prior behavior', () => {

	const ipe = new InteroceptivePredictionError()
	for ( let i = 0; i < 10; i++ ) ipe.observe( 0.5 )
	const unscaled = ipe.getAnxietyContribution()
	const explicitNeutral = ipe.getAnxietyContribution( 1 )
	assert.equal( unscaled, explicitNeutral )

} )

test( 'InteroceptivePredictionError.getAnxietyContribution: Neuroticism scaling amplifies the same real mismatch', () => {

	const ipe = new InteroceptivePredictionError()
	for ( let i = 0; i < 10; i++ ) ipe.observe( 0.3 )
	assert.ok( ipe.getAnxietyContribution( 2 ) > ipe.getAnxietyContribution( 0.5 ) )

} )
