import { Personality }         from './core/Personality.js'
import { CoreBeliefs }          from './core/CoreBeliefs.js'
import { Homeostasis }          from './core/Homeostasis.js'
import { EmotionSpace }         from './core/EmotionSpace.js'
import { MicroEmotions }        from './core/MicroEmotions.js'
import { MoodTracker }          from './core/MoodTracker.js'
import { DecayEngine }          from './core/DecayEngine.js'
import { HedonicAdaptation }    from './core/HedonicAdaptation.js'

import { CognitiveDissonance }  from './cognition/CognitiveDissonance.js'
import { DefenseMechanisms }    from './cognition/DefenseMechanisms.js'
import { DecisionFatigue }      from './cognition/DecisionFatigue.js'
import { AmygdalaHijack }       from './cognition/AmygdalaHijack.js'
import { EmotionalOntology }    from './cognition/EmotionalOntology.js'
import { SituationalContext }   from './cognition/SituationalContext.js'
import { NoveltyDetector }      from './cognition/NoveltyDetector.js'
import { BayesianExpectation }  from './cognition/BayesianExpectation.js'
import { ControllabilityEstimate } from './cognition/ControllabilityEstimate.js'
import { FuzzyNormativeCheck }  from './cognition/FuzzyNormativeCheck.js'
import { Sensitization }        from './cognition/Sensitization.js'
import { Reappraisal }          from './cognition/Reappraisal.js'
import { SemanticSimilarity }   from './cognition/SemanticSimilarity.js'
import { Intuition }             from './cognition/Intuition.js'
import { LogicEngine }           from './cognition/LogicEngine.js'
import { LifeEventCatalog }       from './cognition/LifeEventCatalog.js'
import { AppraisalAgreement }      from './cognition/AppraisalAgreement.js'
import { VisualProsody }             from './cognition/VisualProsody.js'
import { TopicSatiation }              from './cognition/TopicSatiation.js'
import { SarcasmDetector }               from './cognition/SarcasmDetector.js'
import { RefractoryPeriod }                from './cognition/RefractoryPeriod.js'
import { VERSION }                 from './version.js'

import { TheoryOfMind }         from './social/TheoryOfMind.js'
import { EmotionalContagion }   from './social/EmotionalContagion.js'
import { ChronicContagion }      from './social/ChronicContagion.js'
import { UncannyValleyDetector }  from './social/UncannyValleyDetector.js'
import { EpisodicMemory }       from './social/EpisodicMemory.js'
import { ForgettingCurve }      from './social/ForgettingCurve.js'
import { Attachment }           from './social/Attachment.js'
import { GuiltEngine }          from './social/GuiltEngine.js'
import { TribalCategorization } from './social/TribalCategorization.js'
import { ReputationEngine }     from './social/ReputationEngine.js'
import { EgoProjection }        from './social/EgoProjection.js'
import { BystanderEffect }      from './social/BystanderEffect.js'
import { SelfModel }            from './social/SelfModel.js'
import { MonteCarloToM }        from './social/MonteCarloToM.js'
import { FairnessMonitor }      from './social/FairnessMonitor.js'
import { CounterfactualComparison } from './social/CounterfactualComparison.js'
import { GratitudeEngine }      from './social/GratitudeEngine.js'
import { StatusEnvy }           from './social/StatusEnvy.js'
import { EgoConfidence }        from './social/EgoConfidence.js'
import { LoveHateEngine }        from './social/LoveHateEngine.js'

import { IdleProcessing }       from './behavior/IdleProcessing.js'
import { LinguisticModulation } from './behavior/LinguisticModulation.js'
import { RuminationChain }      from './behavior/RuminationChain.js'
import { ExpressiveSuppression } from './behavior/ExpressiveSuppression.js'
import { ExpressionDirectives } from './behavior/ExpressionDirectives.js'
import { LogitBiasBuilder, DEFAULT_CHARGED_WORDS } from './behavior/LogitBiasBuilder.js'
import { AttentionFocus }        from './behavior/AttentionFocus.js'
import { ExpressionDebt }        from './behavior/ExpressionDebt.js'
import { StyleMimicry }           from './behavior/StyleMimicry.js'

import { EmotionalCorpus }      from './text/EmotionalCorpus.js'
import { EmotionalTextGenerator } from './text/EmotionalTextGenerator.js'
import { ExplainabilityEngine } from './text/ExplainabilityEngine.js'

import { HeuristicProvider }    from './providers/HeuristicProvider.js'

import { DopaminergicEngine }   from './neurochemistry/DopaminergicEngine.js'
import { CortisolEngine }       from './neurochemistry/CortisolEngine.js'
import { CircadianRhythm }      from './neurochemistry/CircadianRhythm.js'
import { ArousalKalmanFilter }  from './neurochemistry/ArousalKalmanFilter.js'

import { HardwareInteroception } from './embodiment/HardwareInteroception.js'
import { SensoryOverload }       from './embodiment/SensoryOverload.js'
import { InteroceptiveSignals }   from './embodiment/InteroceptiveSignals.js'
import { AffectEMA }              from './core/AffectEMA.js'

import { LossAversion }          from './economics/LossAversion.js'
import { AnchoringBias }          from './economics/AnchoringBias.js'
import { ClassicalConditioning }  from './economics/ClassicalConditioning.js'

import { ContextAdapter }        from './integration/ContextAdapter.js'

import { safeStep }              from './core/PipelineResilience.js'
import { LoadScheduler }         from './cognition/LoadScheduler.js'
import { WornPathCache }         from './core/WornPathCache.js'
import { TriggerSentinel }        from './core/TriggerSentinel.js'
import { HebbianPlasticity }      from './core/HebbianPlasticity.js'
import { RemConsolidation }       from './cognition/RemConsolidation.js'
import { RelationalMemoryCatalog } from './social/RelationalMemoryCatalog.js'
import { FrikiEngine }              from './core/FrikiEngine.js'

import { GriefEngine }            from './social/GriefEngine.js'
import { ShameGuiltSplit }        from './social/ShameGuiltSplit.js'
import { RepairProtocol }         from './social/RepairProtocol.js'
import { JealousyTriangle }       from './social/JealousyTriangle.js'
import { NostalgiaEngine }        from './social/NostalgiaEngine.js'
import { PainSocialOverlap }      from './social/PainSocialOverlap.js'
import { IdentityThreatMonitor }  from './social/IdentityThreatMonitor.js'
import { SocialBaselineTheory }   from './social/SocialBaselineTheory.js'
import { SubjectiveTimeEngine }   from './neurochemistry/SubjectiveTimeEngine.js'
import { SleepPressure }          from './neurochemistry/SleepPressure.js'
import { AnticipatoryAffect }     from './cognition/AnticipatoryAffect.js'
import { MotivationalConflict }   from './cognition/MotivationalConflict.js'
import { EgoDepletionBudget }     from './cognition/EgoDepletionBudget.js'
import { ValueHierarchy }         from './cognition/ValueHierarchy.js'
import { CommitmentDevice }       from './core/CommitmentDevice.js'
import { MoralInjury }            from './core/MoralInjury.js'
import { OpponentProcess }        from './core/OpponentProcess.js'
import { InteroceptivePredictionError } from './embodiment/InteroceptivePredictionError.js'

import { NarrativeSelfEngine }        from './social/NarrativeSelfEngine.js'
import { LegacyMemory }                 from './social/LegacyMemory.js'
import { MultiAgentSocialGraph }          from './social/MultiAgentSocialGraph.js'
import { CulturalScriptLibrary }            from './social/CulturalScriptLibrary.js'
import { PowerDynamicsEngine }                from './social/PowerDynamicsEngine.js'
import { BetrayalTraumaTrace }                  from './social/BetrayalTraumaTrace.js'
import { OntogenicDevelopment }                   from './cognition/OntogenicDevelopment.js'
import { MetaEmotionLayer }                         from './cognition/MetaEmotionLayer.js'
import { EmotionalForecasting }                       from './cognition/EmotionalForecasting.js'
import { InsightGenerator }                             from './cognition/InsightGenerator.js'
import { EnergyBudget }                                   from './cognition/EnergyBudget.js'
import { RegulationStrategySelector }                       from './behavior/RegulationStrategySelector.js'
import { CreativeModeSwitch }                                 from './behavior/CreativeModeSwitch.js'
import { SomaticMarkerNetwork }                                 from './embodiment/SomaticMarkerNetwork.js'

import { GlobalWorkspace }        from './cognition/GlobalWorkspace.js'
import { PrimaryDrives }          from './core/PrimaryDrives.js'
import { EmotionalImmuneSystem }  from './cognition/EmotionalImmuneSystem.js'

import { DualProcessController }     from './core/DualProcessController.js'
import { PredictiveProcessingCore }    from './cognition/PredictiveProcessingCore.js'
import { SelfDeterminationNeeds }        from './core/SelfDeterminationNeeds.js'
import { HomeostaticFeelingGenerator }     from './core/HomeostaticFeelingGenerator.js'
import { WorkingMemoryBuffer }               from './cognition/WorkingMemoryBuffer.js'
import { HabitVsGoalSystem }                   from './cognition/HabitVsGoalSystem.js'
import { GoalHierarchyManager }                  from './cognition/GoalHierarchyManager.js'
import { BoredomSystem }                           from './core/BoredomSystem.js'

import { TemporalDiscountingEngine }  from './cognition/TemporalDiscountingEngine.js'
import { InhibitoryControlPool }        from './cognition/InhibitoryControlPool.js'
import { OstracismDetector }              from './social/OstracismDetector.js'
import { MetacognitiveConfidence }          from './cognition/MetacognitiveConfidence.js'
import { RoleIdentitySalience }               from './social/RoleIdentitySalience.js'
import { MeaningMakingEngine }                  from './cognition/MeaningMakingEngine.js'
import { EpisodicFutureSimulation }               from './cognition/EpisodicFutureSimulation.js'

import { SchemaAssimilationAccommodation } from './cognition/SchemaAssimilationAccommodation.js'
import { ReciprocityClassifier }             from './social/ReciprocityClassifier.js'
import { AffiliationThermostat }               from './social/AffiliationThermostat.js'
import { AweSystem }                             from './cognition/AweSystem.js'
import { ElevationSystem }                         from './social/ElevationSystem.js'
import { NormativeExpectationField }                 from './cognition/NormativeExpectationField.js'
import { SourceMonitoring }                            from './social/SourceMonitoring.js'
import { ProspectiveMemorySystem }                       from './cognition/ProspectiveMemorySystem.js'
import { InteroceptiveAwarenessGain }                      from './embodiment/InteroceptiveAwarenessGain.js'
import { StressInoculationMemory }                            from './neurochemistry/StressInoculationMemory.js'
import { SocialReferenceFrame }                                 from './social/SocialReferenceFrame.js'

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

// Allostasis reset thresholds — own tuning, not a citation. A mood reading past these
// magnitudes on both axes counts as an "extreme quadrant" (runaway mania/depression
// shape); ALLOSTASIS_STUCK_TICKS consecutive tick()s that stay there trigger a reset.
const ALLOSTASIS_VALENCE_THRESHOLD = 0.6
const ALLOSTASIS_AROUSAL_THRESHOLD  = 0.5
const ALLOSTASIS_STUCK_TICKS           = 5

// Ego depletion — own tuning, not a citation. Past this ExpressionDebt level, suppression
// is forced to fail instead of continuing to hold indefinitely.
const EGO_DEPLETION_THRESHOLD = 0.7

/**
 * Orchestrates the full mechanic set into a single pipeline. See README.md's
 * architecture table and CALIBRATION.md for what's cited vs. engineering
 * estimate across every module wired in here.
 */
export class Totemheart {

	static VERSION = VERSION

	constructor( { personality, provider, language = 'es', embedProvider = null, colony = null, agentId = null } = {} ) {

		this.language  = language
		this.provider  = provider ?? null
		this.heuristic = new HeuristicProvider()

		this.personality  = personality instanceof Personality ? personality : new Personality( personality )
		this.coreBeliefs  = new CoreBeliefs()
		this.homeostasis  = new Homeostasis()
		this.emotionSpace = new EmotionSpace()
		this.microEmotions = new MicroEmotions()
		this.moodTracker   = new MoodTracker()
		this.decayEngine    = new DecayEngine()
		this.hedonicAdaptation = new HedonicAdaptation()

		this.cognitiveDissonance = new CognitiveDissonance()
		this.defenseMechanisms   = new DefenseMechanisms()
		this.decisionFatigue     = new DecisionFatigue()
		this.amygdalaHijack      = new AmygdalaHijack()
		this.emotionalOntology   = new EmotionalOntology()
		this.situationalContext  = new SituationalContext()
		this.noveltyDetector      = new NoveltyDetector()
		this.bayesianExpectation  = new BayesianExpectation()
		this.controllabilityEstimate = new ControllabilityEstimate()
		this.fuzzyNormativeCheck       = new FuzzyNormativeCheck()
		this.sensitization                = new Sensitization()
		this.reappraisal                    = new Reappraisal()
		this.semanticSimilarity                = new SemanticSimilarity( embedProvider )
		this.intuition                            = new Intuition()
		this.logicEngine                            = new LogicEngine()
		this.lifeEventCatalog                      = new LifeEventCatalog()
		this.appraisalAgreement                     = new AppraisalAgreement()
		this.visualProsody                             = new VisualProsody()
		this.topicSatiation                               = new TopicSatiation( embedProvider )
		this.sarcasmDetector                                = new SarcasmDetector()
		this.refractoryPeriod                                 = new RefractoryPeriod()

		this.theoryOfMind        = new TheoryOfMind()
		this.emotionalContagion  = new EmotionalContagion()
		this.chronicContagion     = new ChronicContagion()
		this.uncannyValleyDetector = new UncannyValleyDetector()
		this.episodicMemory      = new EpisodicMemory()
		this.forgettingCurve     = new ForgettingCurve()
		this.attachment          = new Attachment()
		this.guiltEngine         = new GuiltEngine()
		this.tribalCategorization = new TribalCategorization()
		this.reputationEngine     = new ReputationEngine()
		this.egoProjection         = new EgoProjection()
		this.bystanderEffect       = new BystanderEffect()
		this.selfModel               = new SelfModel()
		this.monteCarloToM             = new MonteCarloToM()
		this.fairnessMonitor             = new FairnessMonitor()
		this.counterfactualComparison       = new CounterfactualComparison()
		this.gratitudeEngine                   = new GratitudeEngine()
		this.statusEnvy                           = new StatusEnvy()
		this.egoConfidence                           = new EgoConfidence()
		this.loveHateEngine                             = new LoveHateEngine()

		this.idleProcessing       = new IdleProcessing()
		this.linguisticModulation = new LinguisticModulation()
		this.ruminationChain        = new RuminationChain()
		this.expressiveSuppression    = new ExpressiveSuppression()
		this.expressionDirectives       = new ExpressionDirectives()
		this.logitBiasBuilder              = new LogitBiasBuilder()
		this.attentionFocus                   = new AttentionFocus( { chargedWords: new Map( DEFAULT_CHARGED_WORDS.map( w => [ w, 1 ] ) ) } )
		this.expressionDebt                     = new ExpressionDebt()
		this.styleMimicry                         = new StyleMimicry()

		this.emotionalCorpus = new EmotionalCorpus()
		this.textGenerator   = new EmotionalTextGenerator( this.emotionalCorpus )
		this.explainability  = new ExplainabilityEngine()

		this.dopaminergicEngine = new DopaminergicEngine()
		this.cortisolEngine      = new CortisolEngine()
		this.circadianRhythm     = new CircadianRhythm()
		this.arousalKalmanFilter  = new ArousalKalmanFilter()

		this.hardwareInteroception = new HardwareInteroception()
		this.sensoryOverload        = new SensoryOverload()
		this.interoceptiveSignals    = new InteroceptiveSignals()
		this.dominanceEMA              = new AffectEMA()

		this.lossAversion          = new LossAversion()
		this.anchoringBias          = new AnchoringBias()
		this.classicalConditioning  = new ClassicalConditioning()

		this.contextAdapter = new ContextAdapter()

		this.loadScheduler  = new LoadScheduler()
		this.wornPathCache  = new WornPathCache()

		this.triggerSentinel = new TriggerSentinel( {
			topicSatiation : { keywords: [ 'tambien', 'ademas', 'otra', 'vez', 'sigo', 'seguimos', 'continuando' ], residualThreshold: 0.1 },
		} )
		this.hebbianPlasticity = new HebbianPlasticity()
		this.remConsolidation   = new RemConsolidation()
		this.relationalMemoryCatalog = new RelationalMemoryCatalog()
		this.frikiEngine                     = new FrikiEngine( { opennessToNew: this.personality.get( 'openness' ) } )

		this.griefEngine             = new GriefEngine()
		this.shameGuiltSplit          = new ShameGuiltSplit()
		this.repairProtocol            = new RepairProtocol()
		this.jealousyTriangle            = new JealousyTriangle()
		this.nostalgiaEngine                = new NostalgiaEngine()
		this.painSocialOverlap                = new PainSocialOverlap()
		this.identityThreatMonitor              = new IdentityThreatMonitor()
		this.socialBaselineTheory                 = new SocialBaselineTheory()
		this.subjectiveTimeEngine                   = new SubjectiveTimeEngine()
		this.sleepPressure                             = new SleepPressure()
		this.anticipatoryAffect                          = new AnticipatoryAffect()
		this.motivationalConflict                          = new MotivationalConflict()
		this.egoDepletionBudget                              = new EgoDepletionBudget()
		this.valueHierarchy                                    = new ValueHierarchy()
		this.commitmentDevice                                    = new CommitmentDevice()
		this.commitmentDevice.make( 'be_composed', 'Mantener la compostura incluso bajo presión' )
		this.moralInjury                                            = new MoralInjury()
		this.opponentProcess                                          = new OpponentProcess()
		this.interoceptivePredictionError                               = new InteroceptivePredictionError()

		this.narrativeSelfEngine       = new NarrativeSelfEngine()
		this.legacyMemory                = new LegacyMemory()
		this.multiAgentSocialGraph         = new MultiAgentSocialGraph()
		this.culturalScriptLibrary           = new CulturalScriptLibrary()
		this.powerDynamicsEngine               = new PowerDynamicsEngine()
		this.betrayalTraumaTrace                 = new BetrayalTraumaTrace()
		this.ontogenicDevelopment                  = new OntogenicDevelopment()
		this.metaEmotionLayer                        = new MetaEmotionLayer()
		this.emotionalForecasting                      = new EmotionalForecasting()
		this.insightGenerator                            = new InsightGenerator()
		this.energyBudget                                  = new EnergyBudget()
		this.regulationStrategySelector                      = new RegulationStrategySelector()
		this.creativeModeSwitch                                = new CreativeModeSwitch()
		this.somaticMarkerNetwork                                = new SomaticMarkerNetwork()
		this.globalWorkspace                                        = new GlobalWorkspace()
		this.primaryDrives                                            = new PrimaryDrives()
		this.emotionalImmuneSystem                                      = new EmotionalImmuneSystem()

		this.dualProcessController         = new DualProcessController()
		this.predictiveProcessingCore         = new PredictiveProcessingCore()
		this.selfDeterminationNeeds              = new SelfDeterminationNeeds()
		this.homeostaticFeelingGenerator            = new HomeostaticFeelingGenerator()
		this.workingMemoryBuffer                      = new WorkingMemoryBuffer()
		this.habitVsGoalSystem                          = new HabitVsGoalSystem()
		this.goalHierarchyManager                         = new GoalHierarchyManager()
		this.boredomSystem                                  = new BoredomSystem()

		this.temporalDiscountingEngine  = new TemporalDiscountingEngine()
		this.inhibitoryControlPool        = new InhibitoryControlPool()
		this.ostracismDetector              = new OstracismDetector()
		this.metacognitiveConfidence          = new MetacognitiveConfidence()
		this.roleIdentitySalience               = new RoleIdentitySalience()
		this.meaningMakingEngine                  = new MeaningMakingEngine()
		this.episodicFutureSimulation               = new EpisodicFutureSimulation()

		this.schemaAssimilationAccommodation  = new SchemaAssimilationAccommodation()
		this.reciprocityClassifier              = new ReciprocityClassifier()
		this.affiliationThermostat                = new AffiliationThermostat()
		this.aweSystem                                = new AweSystem()
		this.elevationSystem                            = new ElevationSystem()
		this.normativeExpectationField                    = new NormativeExpectationField()
		this.sourceMonitoring                                = new SourceMonitoring()
		this.prospectiveMemorySystem                            = new ProspectiveMemorySystem()
		this.interoceptiveAwarenessGain                            = new InteroceptiveAwarenessGain()
		this.stressInoculationMemory                                  = new StressInoculationMemory()
		this.socialReferenceFrame                                       = new SocialReferenceFrame()
		this.colony                                                = colony // optional real ColonyDynamics — shared ACROSS instances, this one only registers/reads into it
		// Real, stable per-INSTANCE identity for the colony — deliberately NOT
		// userId (the human this instance is talking to): a colony is about
		// multiple real AI agents, and two agents talking to the SAME human
		// must still register as two distinct real colony members, not
		// overwrite each other under one shared key.
		this.agentId                                                 = agentId ?? `agent_${Date.now().toString( 36 )}_${Math.random().toString( 36 ).slice( 2, 8 )}`
		this._significantEventCount = 0

		this.turnCounter   = 0
		this.allostasisStuckTicks = 0
		this._clockHandle = null
		this._lastNovelty  = 0
		this._lastOntologyConcepts = []

	}

	/** Resilient analyze: tries the configured provider, falls back to heuristics on any failure. */
	async #analyze( task, payload ) {

		if ( this.provider ) {

			try {

				return await this.provider.analyze( task, payload )

			}
			catch {

				// swallow and fall back — a flaky/unavailable external provider must never break the pipeline

			}

		}
		return await this.heuristic.analyze( task, payload )

	}

	/**
	 * Life-event routing — a triangulated match's "area" list picks which
	 * already-real module gets an extra, area-specific nudge on top of the
	 * baseline EmotionSpace spike every match gets regardless of area.
	 * Every branch below calls a real existing method with a real parameter
	 * derived from the matched event; areas with no meaningful per-turn
	 * state to mutate (Logic — deliberately stateless, independent of PAD;
	 * Echo — already driven by the moodTracker push the baseline spike
	 * causes) are left out rather than wired to a no-op call.
	 */
	#applyLifeEventAreas( lifeEvent, { tokens, appraisal, userId } ) {

		const magnitude = lifeEvent.impact / 100

		for ( const area of lifeEvent.area ) {

			switch ( area ) {

				case 'Ego':
					this.reputationEngine.evaluate( { desirability: lifeEvent.valence, moralWeight: Math.abs( lifeEvent.valence ), expectedness: 0.5 }, this.personality )
					break

				case 'Engram':
					this._lifeEventSurprise = Math.max( this._lifeEventSurprise ?? 0, magnitude )
					break

				case 'Restraint':
					this._lifeEventSuppressionBoost = Math.max( this._lifeEventSuppressionBoost ?? 0, magnitude * 0.4 )
					break

				case 'Intuition':
					this.intuition.observe( tokens, lifeEvent.valence < 0 )
					break

				case 'Empathy':
					this.theoryOfMind.updateBelief( userId, 'life_event', { valence: lifeEvent.valence, impact: lifeEvent.impact } )
					break

				case 'Ethos':
					appraisal.moralWeight = clamp01( ( appraisal.moralWeight ?? 0 ) + Math.abs( lifeEvent.valence ) * magnitude * 0.3 )
					break

				case 'Drive':
					this.homeostasis.satisfy( 'stamina', lifeEvent.valence * magnitude * 0.2 )
					break

				case 'Focus':
					for ( const eventId of lifeEvent.events ) this.attentionFocus.chargedWords.set( eventId, 1 )
					break

				case 'Appraisal':
					appraisal.expectedness = clamp01( ( appraisal.expectedness ?? 0.5 ) - magnitude * 0.2 )
					break

				case 'Echo':
					if ( lifeEvent.valence < 0 ) this.ruminationChain.biasTowardNegative( magnitude * 0.5 )
					break

				default:
					break

			}

		}

	}

	async processInput( input, { userId = 'default', modality = 'text', hardware = {}, group = {} } = {} ) {

		if ( modality !== 'text' ) return { text: 'Unsupported input modality', modality }

		// REM consolidation — real wall-clock idle-time trigger (not a turn count): if
		// enough real time passed since the last turn, run a background-style sweep
		// BEFORE this turn is processed. The AI doesn't wake up exactly where it left
		// off — recent memories' peak arousal cools, stale associations prune, and the
		// felt state decays by the REAL elapsed hours instead of picking up mid-spike.
		// Sleep pressure (real Process S, Borbély 1982) — accumulate real elapsed
		// wall-clock ms since the last processed turn BEFORE remConsolidation's own
		// bookkeeping below overwrites lastTurnAt, then let an actual REM sweep (not
		// a plain tick) dissipate it — the same real "awake accumulates, sleep clears"
		// distinction CircadianRhythm.sleepDebt already uses for its own accumulator.
		const nowForSleep         = Date.now()
		const elapsedSinceLastTurn = this.remConsolidation.lastTurnAt !== null ? nowForSleep - this.remConsolidation.lastTurnAt : 0
		if ( elapsedSinceLastTurn > 0 ) this.sleepPressure.accumulate( elapsedSinceLastTurn )

		this._lastRemReport = null
		if ( this.remConsolidation.shouldTrigger() ) {

			const sweepNow = Date.now()
			this._lastRemReport = this.remConsolidation.sweep( {
				episodicMemory      : this.episodicMemory,
				hebbianPlasticity     : this.hebbianPlasticity,
				cortisolEngine          : this.cortisolEngine,
				expressionDebt          : this.expressionDebt,
				sensitization             : this.sensitization,
				emotionSpace             : this.emotionSpace,
				moodTracker                : this.moodTracker,
				decayEngine                : this.decayEngine,
				personality                 : this.personality,
				circadianRhythm             : this.circadianRhythm,
			}, sweepNow )
			this.sleepPressure.dissipate( elapsedSinceLastTurn )

			// Real relational-memory cataloging — REM doesn't just cool, it hands
			// off the episodes it just touched to a real, structured, per-person
			// index (Conway & Pleydell-Pearce 2000, see RelationalMemoryCatalog.js).
			if ( this._lastActiveUserId ) {

				const touched = this.episodicMemory.memories.filter( m => m.userId === this._lastActiveUserId && m.remTaggedAt === sweepNow )
				if ( touched.length ) this.relationalMemoryCatalog.ingestFromRem( this._lastActiveUserId, this._lastRemReport, touched )

			}

		}
		// sweep() already records its own end time; a non-triggering (normal-cadence)
		// turn still needs its start marked so the NEXT turn's gap is measured correctly.
		if ( !this._lastRemReport ) this.remConsolidation.recordTurn()

		this.turnCounter += 1
		this._lastActiveUserId = userId

		// Affective forecasting — a real anticipatory reading BEFORE this turn's actual
		// outcome is known, from BayesianExpectation's own real posterior for this user.
		// Applied as a small anticipatory spike (own tuning weight) distinct from the
		// reactive spikes below; the forecast error is scored once desirability is known.
		const anticipation = this.anticipatoryAffect.forecast( this.bayesianExpectation, userId )
		if ( anticipation.confidence > 0.15 ) {

			this.emotionSpace.applySpike( { valence: anticipation.expectedValence * 0.1, arousal: anticipation.expectedArousal * 0.1, weight: anticipation.confidence * 0.3 } )

		}

		// Feeling that exists this instant but isn't about to be expressed this turn —
		// used by both early exits below to feed ExpressionDebt.
		const currentFeltMagnitude = Math.hypot( this.emotionSpace.vector.valence, this.emotionSpace.vector.arousal ) / Math.SQRT2

		// Intrusive thought — an unresolved wound resurfacing unprompted, a real
		// Poisson-process roll weighted by that wound's own Zeigarnik pressure
		// (EpisodicMemory.rollIntrusiveThought), independent of anything in
		// THIS turn's actual input. A small, bounded spike (this is a nagging
		// resurfacing, not a full re-experience) and it feeds ExpressionDebt the
		// same way any other felt-but-unexpressed magnitude would.
		const intrusion = this.episodicMemory.rollIntrusiveThought( userId )
		if ( intrusion ) {

			const sig             = intrusion.entry.emotionalSignature ?? { valence: 0, arousal: 0 }
			const intrusionSpike = { valence: sig.valence * 0.15, arousal: Math.abs( sig.arousal ?? 0 ) * 0.25, weight: 0.3 }
			this.emotionSpace.applySpike( intrusionSpike )
			this.moodTracker.push( intrusionSpike )
			this.expressionDebt.accumulate( Math.abs( intrusionSpike.valence ) + Math.abs( intrusionSpike.arousal ) )
			this.explainability.logDecision( 'intrusive_thought', `unresolved wound resurfaced unprompted (p=${intrusion.probability.toFixed( 3 )}): "${intrusion.entry.text?.slice( 0, 60 )}"` )

		}

		// Bystander effect — in a group channel, may choose not to respond at all. The felt
		// state at this instant doesn't vanish just because it goes unexpressed this turn.
		if ( group.participantCount > 1 ) {

			const decision = this.bystanderEffect.shouldRespond( group )
			if ( !decision.respond ) {

				this.expressionDebt.accumulate( currentFeltMagnitude )
				return { text: null, respond: false, delayFactor: decision.delayFactor }

			}

		}

		// Sensory overload — too much input too fast saturates processing.
		const overload = this.sensoryOverload.check( input )
		if ( overload.active ) {

			this.expressionDebt.accumulate( currentFeltMagnitude )
			this.explainability.logDecision( 'freeze', `sensory overload: ${overload.reason}` )
			return {
				text            : this.sensoryOverload.freezeOutput( overload.reason ),
				delayMs         : 0,
				styleTags       : [ 'freeze', overload.reason ],
				emotionalState  : this.getEmotionalState(),
				// A real, if not brand-new-turn-driven, systemPrompt — this text is
				// already final (not meant for another LLM completion this turn), but
				// a host that unconditionally reads result.systemPrompt on every
				// response (the documented Usage pattern) should still get a real
				// string here, not undefined. Found by IntelligentMockGenerator's
				// systemPrompt_generated_without_error invariant — see test/generated/.
				systemPrompt : this.getSystemPrompt( { userId } ),
			}

		}

		// Attentional narrowing — purely internal (no eye, no rendering): a real derivative
		// of the AI's own previous-turn arousal + its current cognitive load. A fast spike
		// under load narrows focus onto the perceived threat, so it lowers the hijack
		// threshold too, independent of the cortisol/sensitization multipliers below.
		const narrowing            = this.interoceptiveSignals.observeAttentionalNarrowing( this.emotionSpace.vector.arousal, this.decisionFatigue.getLevel(), 1 )
		const narrowingMultiplier    = 1 - narrowing * 0.15

		// Amygdala hijack — chronic cortisol, recent-negative-stimuli sensitization, AND
		// attentional narrowing all lower the threshold needed to trigger it (all real
		// multipliers <=1, all derived from the AI's own prior state, nothing external).
		// Kindling uses LAST turn's ontology concepts (this turn's aren't known yet at
		// this point in the pipeline) — repeated exposure to the same stimulus TYPE
		// (threat/betrayal/criticism...) genuinely lowers this turn's threshold further.
		// Ontogenic development — real, one-turn-lagged (this turn's stage isn't
		// computed until the life-event/significant-event tally runs further
		// down, the same real "last turn's reading" pattern _lastNovelty already
		// uses) elevated-Neuroticism reading during a real "adolescence" stage
		// genuinely lowers the hijack threshold — see OntogenicDevelopment.js.
		const ontogenicThresholdMultiplier = 1 - clamp01( this._ontogenicNeuroticismBoost ?? 0 ) * 0.3
		const hijackThreshold = 0.95 * this.cortisolEngine.getThresholdMultiplier() * this.sensitization.getThresholdMultiplier() * narrowingMultiplier * ontogenicThresholdMultiplier
		const hijack           = this.amygdalaHijack.check( this.emotionSpace, hijackThreshold, { concepts: this._lastOntologyConcepts } )
		if ( hijack.tier === 'full' ) {

			this.explainability.logDecision( 'emergency_output', `Amygdala hijack on ${hijack.emotion} (${hijack.intensity.toFixed( 2 )}), threshold=${hijack.threshold.toFixed( 2 )}` )
			return {
				text            : this.amygdalaHijack.emergencyOutput( hijack ),
				delayMs         : 0,
				styleTags       : [ 'hijack', hijack.emotion ],
				emotionalState  : this.getEmotionalState(),
				// Same real-consistency fix as the sensory-overload freeze above —
				// found by IntelligentMockGenerator, see test/generated/.
				systemPrompt    : this.getSystemPrompt( { userId } ),
				hijack,
			}

		}
		// Partial hijack — rational processing genuinely degrades (forced shallow mode
		// below) but the pipeline keeps running and produces real text, distinct from
		// the full bypass above. A milder 'alert' tier only nudges suppressionDrive
		// (via _hijackAlertBoost, folded in where suppressionDrive is computed).
		const partialHijack     = hijack.tier === 'partial'
		this._hijackAlertBoost = hijack.tier === 'alert' ? 0.15 : 0

		// Hardware interoception — physical sensation from runtime metrics, independent of content.
		const sensation = this.hardwareInteroception.sense( hardware )
		if ( sensation.spike.weight > 0 ) {

			this.emotionSpace.applySpike( sensation.spike )
			this.moodTracker.push( sensation.spike )

		}

		// Circadian rhythm — affects fatigue/energy for the rest of this turn. Coupled
		// to cortisol: sustained chronic stress flattens the diurnal amplitude (real
		// direction from the HPA-axis literature — see CircadianRhythm.js). Using the
		// system during its own low-energy window accumulates real sleep debt, only
		// paid back down by an actual RemConsolidation sweep.
		const circadian = this.circadianRhythm.getState( new Date(), this.cortisolEngine.getLevel() )
		this.circadianRhythm.observeActivity( new Date(), this.cortisolEngine.getLevel() )

		// Decision fatigue (low circadian energy makes shallow mode kick in sooner).
		this.decisionFatigue.recordDecision( 1 + ( 1 - circadian.energy ) )
		const partialHijackLoad = partialHijack ? this.decisionFatigue.recordDecision( 1.5 ) : null
		const shallowMode = this.decisionFatigue.isShallow() || partialHijack

		// Arousal, smoothed through a real Kalman filter — the noisy raw reading feeds
		// the filter, and the smoothed estimate is what downstream urgency/instability
		// logic uses, so a single noisy spike doesn't overreact the scheduler. The
		// measurement noise (R) is itself informed by real interoceptive signal instead
		// of a fixed constant: attentional narrowing under load makes THIS turn's raw
		// reading less trustworthy (raise R), a genuinely novel outcome last turn is
		// evidence a spike is real signal, not sensor noise (lower R).
		const kalmanNoiseMultiplier = Math.max( 0.3, 1 + narrowing * 0.4 - this._lastNovelty * 0.2 )
		const smoothedArousal          = this.arousalKalmanFilter.filter( this.emotionSpace.vector.arousal, kalmanNoiseMultiplier )

		// Interoceptive prediction error — the Kalman filter's own real innovation
		// (measurement - predicted estimate) IS the prediction-error term the
		// predictive-processing account of interoception is about (Seth, 2013, see
		// InteroceptivePredictionError.js); a SUSTAINED mismatch (not one noisy
		// reading) reads as real anxiety-like arousal.
		this.interoceptivePredictionError.observe( this.arousalKalmanFilter.getLastInnovation() )
		const interoceptiveAnxiety = this.interoceptivePredictionError.getAnxietyContribution()
		if ( interoceptiveAnxiety > 0.1 ) this.emotionSpace.applySpike( { arousal: interoceptiveAnxiety * 0.15, weight: 0.3 } )

		// Load scheduler — instead of always running the full fixed pipeline, an
		// instability reading (cortisol + smoothed arousal + fatigue) decides which
		// optional mechanics get skipped this turn. `_lastNovelty` is last turn's
		// reading (this turn's isn't known until NoveltyDetector.observe() runs
		// further down) — a real, if one-turn-lagged, novelty signal feeding the budget.
		const instability = this.loadScheduler.computeInstability( {
			cortisol : this.cortisolEngine.getLevel(),
			arousal  : smoothedArousal,
			fatigue  : this.decisionFatigue.getLevel(),
		} )
		const gate = this.loadScheduler.gate( instability, { novelty: this._lastNovelty } )

		// Hebbian co-activation tracking for this turn — which secondary mechanisms
		// actually fired, collected as we go and folded into HebbianPlasticity at the
		// end of the turn. Real association learning over the AI's OWN trigger history,
		// not a trained embedding router.
		const activeMechanisms = []

		// Visual prosody — text has no volume, but a real typographic-anomaly scan
		// (caps ratio + punctuation density) on the RAW input, before any lexicon/LLM
		// parsing touches it, is a genuine proxy for it: "HOLA" isn't semantically
		// different from "hola", but it's a real energy spike independent of meaning.
		const visualProsody = this.visualProsody.analyze( input )
		if ( visualProsody.intensity > 0.15 ) {

			const prosodySpike = { valence: 0, arousal: Math.min( 0.6, visualProsody.intensity * 0.35 ), weight: 0.5 }
			this.emotionSpace.applySpike( prosodySpike )
			this.moodTracker.push( prosodySpike )
			activeMechanisms.push( 'shout' )

		}

		// Classical conditioning — anticipatory reaction to a cue before appraisal even runs.
		const tokens      = tokenize( input )

		// Latent reactivation — a REM-tagged memory that's gone quiet for months is
		// still in the database; a real keyword-overlap match with THIS turn's tokens
		// "sparks" it back to real strength instead of it staying silently decayed
		// forever. Small, bounded spike — this is a resurfacing nudge, not a full
		// re-experience of the original moment.
		// Legacy memory — real, explicitly-inherited material from a PRIOR
		// generation/instance (see LegacyMemory.js), activated by the same real
		// token-overlap similarity, distinct from this instance's own
		// EpisodicMemory reactivation above (a different real store, a
		// different real source of "why does this feel familiar").
		const legacyActivation = this.legacyMemory.getBestActivation( input, { conscientiousness: this.personality.get( 'conscientiousness' ), openness: this.personality.get( 'openness' ) } )
		if ( legacyActivation && legacyActivation.activation > 0.15 ) {

			this.emotionSpace.applySpike( { valence: legacyActivation.entry.weight * 0.15 * legacyActivation.activation, weight: 0.3 } )
			this.explainability.logDecision( 'legacy_activation', `inherited cue "${legacyActivation.entry.cue}" activated at ${legacyActivation.activation.toFixed( 2 )}` )

		}

		const reactivation = this.episodicMemory.getBestReactivation( tokens )
		if ( reactivation && reactivation.score > 0.3 ) {

			const sig = reactivation.entry.emotionalSignature ?? { valence: 0, arousal: 0 }
			this.emotionSpace.applySpike( { valence: sig.valence * 0.2, arousal: Math.abs( sig.arousal ?? 0 ) * 0.15, weight: 0.4 } )
			// Reconsolidation window — being retrieved makes this memory briefly
			// modifiable again (Nader, Schafe & LeDoux 2000, see EpisodicMemory.js).
			// The actual blend toward this turn's signature happens once the turn's
			// final emotional state is known, near the end of processInput().
			this.episodicMemory.markLabile( reactivation.entry.id )

		}

		const conditioned = this.classicalConditioning.getConditionedResponse( tokens )
		if ( conditioned.triggered ) {

			const anxietySpike = { valence: conditioned.strength * 0.3, arousal: Math.abs( conditioned.strength ) * 0.4, weight: 0.6 }
			this.emotionSpace.applySpike( anxietySpike )
			this.moodTracker.push( anxietySpike )

		}

		// Intuition — fast-path hunch, real k-NN (Jaccard over past inputs) + Shannon
		// entropy over the conflict/no-conflict split of the nearest matches, BEFORE
		// the full appraisal below has even run. A confident bad hunch (low entropy,
		// neighbors agree it went badly) reads as an immediate uncertainty spike.
		// An unexpected shout amplifies the alert this hunch produces — real typographic
		// energy scaling a real entropy-derived signal, not a separate invented one.
		const hunch = this.intuition.sense( tokens )
		const prosodyAmplifiedPenalty = hunch.hunchPenalty * ( 1 + visualProsody.intensity * 0.5 )
		if ( prosodyAmplifiedPenalty > 0.2 ) {

			const hunchSpike = { arousal: prosodyAmplifiedPenalty * 0.3, valence: -prosodyAmplifiedPenalty * ( hunch.conflictRatio ?? 0 ) * 0.2, weight: 0.5 }
			this.emotionSpace.applySpike( hunchSpike )
			this.moodTracker.push( hunchSpike )

		}

		// Relation with this user — needed early so the ontology can weigh
		// concepts (criticism, betrayal...) against how much this user is trusted.
		const relation = this.attachment.get( userId )

		// Bayesian expectation (hope/anxiety): the prior for this turn, BEFORE knowing the outcome.
		const priorExpectation = this.bayesianExpectation.getExpectation( userId )
		const anxiety            = this.bayesianExpectation.getAnxiety( userId )

		// Worn-path cache — the runtime-evolution idea, reframed honestly: Totemheart
		// can't rewrite its own source, but a fingerprint (user + normalized input)
		// seen often enough stops paying for a fresh appraisal/ontology pass and
		// reuses the last one. Everything downstream of this still runs fresh every
		// turn (spikes, decay, memory) — only the expensive interpretation is cached.
		const pathFingerprint = `${userId}::${input.toLowerCase().trim().slice( 0, 60 )}`
		const wornAppraisal     = this.wornPathCache.consult( pathFingerprint )

		let appraisal, ontologyMatches, situational
		let semanticSimilarity = null

		if ( wornAppraisal ) {

			appraisal        = wornAppraisal
			ontologyMatches   = ( appraisal.concepts ?? [] ).map( concept => ( { concept } ) )
			situational        = this.situationalContext.extract( input, appraisal.desirability ?? 0 )

		}
		else {

			// Appraisal — LLM/heuristic first, then cross-checked/enriched by the
			// ontology's concept graph (skipped under high instability — see LoadScheduler),
			// each optional stage wrapped so a failure degrades instead of losing the turn.
			const rawAppraisal = shallowMode
				? await this.heuristic.analyze( 'appraisal', { text: input } )
				: await this.#analyze( 'appraisal', { text: input, beliefs: this.coreBeliefs.getAll() } )

			ontologyMatches = gate.runOntology
				? await safeStep( this.explainability, 'emotionalOntology.interpret', async () => this.emotionalOntology.interpret( input ), [] )
				: []

			// Semantic similarity — real embedding cosine similarity toward latent
			// concept clusters, when an embedding backend was configured (optional;
			// EmotionalOntology's keyword matching above is what runs otherwise).
			if ( this.semanticSimilarity.available && gate.runOntology ) {

				semanticSimilarity = await safeStep( this.explainability, 'semanticSimilarity.classify', async () => this.semanticSimilarity.classify( input ), null )

			}

			const msSinceLastBetrayal = this.episodicMemory.msSinceLastConcept( userId, 'betrayal' )
			appraisal                   = gate.runOntology
				? await safeStep( this.explainability, 'emotionalOntology.adjustAppraisal', async () => this.emotionalOntology.adjustAppraisal( rawAppraisal, ontologyMatches, relation, msSinceLastBetrayal ), rawAppraisal )
				: rawAppraisal

			// Situational context — is the user stressed/urgent/upbeat right now, read
			// straight off the message, independent of what the appraisal concluded.
			situational = await safeStep( this.explainability, 'situationalContext.extract', async () => this.situationalContext.extract( input, rawAppraisal.desirability ?? 0 ), { stress: 0, urgency: 0, joy: 0 } )
			appraisal.moralWeight = ( appraisal.moralWeight ?? 0 ) * this.situationalContext.getThreatMultiplier( situational )

			this.wornPathCache.observe( pathFingerprint, appraisal )

		}

		// Kindling: feed THIS turn's concepts into AmygdalaHijack's per-concept memory
		// so a repeated stimulus TYPE lowers a future turn's hijack threshold further,
		// and remember them as "last known concepts" — the hijack check earlier in
		// THIS turn ran before this turn's own ontology was available, so it reads
		// whatever was stored here on the PREVIOUS turn.
		for ( const m of ontologyMatches ) if ( [ 'threat', 'betrayal', 'criticism' ].includes( m.concept ) ) this.amygdalaHijack.observeStimulus( m.concept )
		this._lastOntologyConcepts = ontologyMatches.map( m => m.concept )

		// Life events — SRRS-inspired severity catalog (see LifeEventCatalog.js for
		// sourcing). Multiple simultaneous matches are triangulated into one blended
		// state instead of picking a single winner; the result's "area" list routes
		// extra, area-specific effects into whichever modules that area maps to,
		// on top of the direct valence/dominance spike every match gets.
		this._lifeEventSurprise         = 0
		this._lifeEventSuppressionBoost = 0
		const lifeEventMatches = this.lifeEventCatalog.detect( input )
		const lifeEvent           = this.lifeEventCatalog.triangulate( lifeEventMatches )
		if ( lifeEvent ) {

			const lifeEventMagnitude = lifeEvent.impact / 100
			this.emotionSpace.applySpike( { valence: lifeEvent.valence * lifeEventMagnitude, dominance: lifeEvent.dominance * lifeEventMagnitude, weight: lifeEventMagnitude } )
			this.moodTracker.push( { valence: lifeEvent.valence, arousal: 0, dominance: lifeEvent.dominance } )
			this.#applyLifeEventAreas( lifeEvent, { tokens, appraisal, userId } )
			// A life event is real information about what to expect from this relationship/
			// context going forward, not just this instant's spike — nudges the dopaminergic
			// expectation directly, distinct from the reward-driven RPE update below.
			this.dopaminergicEngine.updateExpectationFromBelief( userId, lifeEvent.valence, 0.2 )

			// Narrative self — a real life event is exactly the kind of significant
			// moment McAdams' narrative-identity framing treats as chapter-shaping
			// material (see NarrativeSelfEngine.js), distinct from ordinary turns.
			const narrativeUpdate = this.narrativeSelfEngine.addEvent( lifeEvent.valence, {
				openness: this.personality.get( 'openness' ), neuroticism: this.personality.get( 'neuroticism' ), conscientiousness: this.personality.get( 'conscientiousness' ),
			} )
			if ( narrativeUpdate.crisis ) this.explainability.logDecision( 'narrative_crisis', `narrative coherence dropped to ${narrativeUpdate.coherence.toFixed( 2 )} — chapter ${narrativeUpdate.chapterIndex}` )

			// A real life event also counts toward OntogenicDevelopment's own
			// significant-event tally — the real, second real driver of stage
			// progression alongside plain turn count (see OntogenicDevelopment.js).
			this._significantEventCount += 1

		}

		// Cultural scripts — a real interpretive frame this turn's input matches
		// (honor, shame, reciprocity, collectivism), biasing the response beyond
		// the raw appraisal alone (see CulturalScriptLibrary.js).
		const dominantScript = this.culturalScriptLibrary.getDominantScript( input )
		if ( dominantScript ) {

			const responseBias = this.culturalScriptLibrary.getResponseBias( dominantScript.script, input, this.personality.get( 'agreeableness' ) )
			if ( responseBias > 0.05 ) this.emotionSpace.applySpike( { dominance: dominantScript.script === 'honor' ? -responseBias * 0.3 : 0, arousal: responseBias * 0.15, weight: 0.3 } )
			this.explainability.logDecision( 'cultural_script', `"${dominantScript.script}" activated at ${dominantScript.activation.toFixed( 2 )}, bias=${responseBias.toFixed( 2 )}` )

		}

		// Ontogenic development — a real, deterministic function of accumulated
		// turns + significant events, not a clock. Adolescence's real elevated
		// Neuroticism reading genuinely lowers the amygdala-hijack threshold
		// computed further below (own tuning of the coupling itself).
		const ontogenicStage        = this.ontogenicDevelopment.getStage( this.turnCounter, this._significantEventCount )
		const effectiveNeuroticism = this.ontogenicDevelopment.getEffectiveTrait( this.personality.get( 'neuroticism' ), 'neuroticism', ontogenicStage )
		this._ontogenicStage             = ontogenicStage
		this._ontogenicNeuroticismBoost = effectiveNeuroticism - this.personality.get( 'neuroticism' )

		// Regulatory capacity — purely internal analog of HRV's LF/HF read: a real DFT
		// over the AI's own rolling arousal history. Higher "regulated" reading (more
		// high-frequency/flexible activation, less locked into a slow low-frequency
		// drift) genuinely widens the window in which reappraisal is available below —
		// the direction taken from the real HRV/emotion-regulation literature, not a
		// literal cardiac measurement (there's no heart here).
		const regulatoryCapacity = this.interoceptiveSignals.observeRegulatoryCapacity( smoothedArousal )

		// Reappraisal — a real regulation strategy competing with defense mechanisms,
		// not just a fallback: moderate cognitive stress (not yet defense-triggering,
		// see below) plus a personality profile suited to regulation (calmer,
		// conscientious) plus internal regulatory capacity can reframe the appraisal
		// before it becomes a spike.
		const preRegulationStress = this.cognitiveDissonance.getStress()
		const canReappraise         = preRegulationStress > 0.2 && preRegulationStress < 0.6 && this.personality.get( 'neuroticism' ) < 0.5 && regulatoryCapacity.regulated
		if ( canReappraise ) {

			const strength = 0.3 + 0.3 * this.personality.get( 'conscientiousness' )
			appraisal        = this.reappraisal.reframe( appraisal, strength )

		}

		// Novelty (KL divergence vs. this session's historical outcome distribution) —
		// amplifies the dopaminergic arousal response independent of valence sign.
		const novelty = this.noveltyDetector.observe( this.emotionSpace.getDominantEmotion() )
		this.primaryDrives.activate( 'SEEKING', novelty * 0.4 ) // real novelty directly fuels the real SEEKING drive (Panksepp 1998, see PrimaryDrives.js)
		this._lastNovelty = novelty // read by NEXT turn's Kalman noise + LoadScheduler budget (this turn's isn't known until this line runs)
		// Real chronic-understimulation accumulator — the opposite pole from
		// overload, rises when novelty stays low turn after turn (see
		// BoredomSystem.js).
		this.boredomSystem.update( novelty )
		// Real capacity-limited active-item register — each turn's dominant
		// ontology concept (or the turn itself if none matched) occupies a real
		// working-memory slot until it's displaced by newer items.
		this.workingMemoryBuffer.hold( this._lastOntologyConcepts[ 0 ] ?? `turn:${userId}` )

		// Anchoring bias — pulls perceived desirability toward the session's first strong signal.
		this.anchoringBias.registerIfFirst( appraisal.desirability ?? 0 )
		let desirability = this.anchoringBias.apply( appraisal.desirability ?? 0 )

		// Emotional refractory period (Ekman) — checked against the vector as it stood
		// BEFORE this turn's own appraisal touches it: near-max arousal and strongly
		// negative already, and an incoming calming/positive signal gets filtered out
		// almost entirely. Furious enough, and an apology reads as another attack.
		const refractory = this.refractoryPeriod.filter( desirability, this.emotionSpace.vector )
		desirability          = refractory.filtered

		// A detected life event blends its own valence into desirability too, not just the
		// direct EmotionSpace spike applied above — otherwise a severe event described in
		// words the lexicon/LLM doesn't score as strongly negative (e.g. "me despidieron",
		// which HeuristicProvider alone reads as neutral) would move the felt vector but
		// leave cortisol/RPE/loss-aversion — everything downstream keyed on desirability —
		// blind to it. Found by running examples/full-stress-test.js, fixed here rather than
		// left silent; see CALIBRATION.md.
		if ( lifeEvent ) desirability = Math.max( -1, Math.min( 1, desirability + lifeEvent.valence * ( lifeEvent.impact / 100 ) * 0.6 ) )

		// Dopaminergic RPE — surprise relative to expectation, not raw reward, tracked
		// per-user (context=userId) so this relationship's own expectation history is
		// what this turn's reward gets judged against, with a real TD(λ) eligibility
		// trace crediting recently-active contexts too (see DopaminergicEngine.js).
		// Novelty adds extra arousal on top of the RPE-driven amount, since novelty
		// and reward-surprise are related but not identical signals.
		const rpe          = this.dopaminergicEngine.computeRPE( desirability, userId, this.homeostasis.allostaticLoad )
		const dopamineSpike = {
			valence : rpe * 0.5,
			arousal : Math.abs( rpe ) * 0.6 + ( appraisal.ontologyArousalBoost ?? 0 ) * 0.2 + novelty * 0.15,
			weight  : 0.7,
		}
		this.emotionSpace.applySpike( dopamineSpike )
		this.moodTracker.push( dopamineSpike )

		// Somatic markers — this turn's real outcome (RPE-derived valence)
		// leaves a real, decaying "gut feeling" tagged to this input's own
		// words (Damasio 1994, see SomaticMarkerNetwork.js); the real bias
		// toward/away from similarly-worded FUTURE input is read back and
		// folded in as a small additional real spike — the felt "I have a bad
		// feeling about this" effect, built from real past outcomes, not invented.
		this.somaticMarkerNetwork.recordOutcome( input, rpe )
		const somaticBias = this.somaticMarkerNetwork.getBias( input )
		if ( Math.abs( somaticBias ) > 0.05 ) this.emotionSpace.applySpike( { valence: somaticBias * 0.1, weight: 0.2 } )

		// Emotional forecasting — a real, honest readout of how this turn's
		// actual chosen response is expected to land on the user vs. the AI's
		// own state, not a claim of picking among multiple real candidates
		// (Totemheart only generates one response per turn) — see
		// EmotionalForecasting.js.
		const forecastUtility = this.emotionalForecasting.computeUtility( desirability, {
			userModelConfidence : this.bayesianExpectation.getExpectation( userId ),
			currentMoodValence     : this.moodTracker.getMood().valence,
			agreeableness             : this.personality.get( 'agreeableness' ),
			neuroticism                  : this.personality.get( 'neuroticism' ),
		} )
		this._lastForecastUtility = forecastUtility

		// Anticipatory-affect correction — now that the real outcome (desirability) is
		// known, score the forecast error against it and fold it back into next time's
		// anticipation for this same context, real backward correction (see AnticipatoryAffect.js).
		const forecastError = this.anticipatoryAffect.getForecastError( anticipation, desirability )
		this.anticipatoryAffect.applyCorrection( this.dopaminergicEngine, userId, forecastError )

		// Opponent-process after-effect — a strong-enough hedonic swing (either
		// direction) queues a real, growing-with-repetition undershoot (Solomon &
		// Corbit 1974) to be applied on the NEXT tick(), not instantly — the felt
		// "high"/"low" and its rebound are temporally separated in the real theory.
		if ( Math.abs( rpe ) > 0.5 ) {

			const opponent = this.opponentProcess.trigger( userId, rpe )
			this._pendingOpponentAfterEffect = ( this._pendingOpponentAfterEffect ?? 0 ) + opponent.afterEffectValence

		}

		// Cortisol — chronic stress accumulator. Threat/betrayal concepts, high Bayesian
		// anxiety, high situational stress, or a strong real-embedding similarity to
		// the "hostilidad" cluster (when semantic similarity is available) all
		// register as ambiguous-or-worse.
		const ontologyFlagsThreat = ontologyMatches.some( m => [ 'threat', 'betrayal' ].includes( m.concept ) )
		const semanticFlagsThreat = ( semanticSimilarity?.hostilidad ?? 0 ) > 0.65
		// A shout on top of already-negative content reads as a genuine startle — the
		// same real visualProsody.intensity computed at the very top of this turn.
		const shoutedNegative = visualProsody.intensity > 0.5 && desirability < 0

		// Emotional immune system — real, SUSTAINED negativity (not one bad
		// turn) produces genuine numbing/dampening of further negative input
		// (Gilbert 1989/2009, see EmotionalImmuneSystem.js), distinct from
		// RefractoryPeriod's acute-fury filtering and HedonicAdaptation's
		// repeated-identical-stimulus discount.
		this.emotionalImmuneSystem.observe( desirability, this.emotionSpace.vector.arousal )
		const immuneDampening = this.emotionalImmuneSystem.getDampeningFactor()
		const immuneAdjustedDesirability = desirability < 0 ? desirability * immuneDampening : desirability

		this.cortisolEngine.register( immuneAdjustedDesirability, appraisal.expectedness < 0.3 || ontologyFlagsThreat || situational.stress > 0.6 || anxiety > 0.5 || semanticFlagsThreat || shoutedNegative )
		this.sensitization.observe( immuneAdjustedDesirability )

		// Appraisal agreement — real variance across the independent valence estimates this
		// turn already produced (raw appraisal, situational joy/stress, semantic-similarity
		// hostility when available, a detected life event), fed forward into how strongly the
		// emotion below gets expressed rather than left as unused signal.
		const agreement = this.appraisalAgreement.evaluate( [
			appraisal.desirability ?? 0,
			situational.joy - situational.stress,
			semanticSimilarity ? ( semanticSimilarity.afecto ?? 0 ) - ( semanticSimilarity.hostilidad ?? 0 ) : null,
			lifeEvent?.valence ?? null,
		] )
		if ( agreement.n >= 2 && agreement.agreement < 0.5 ) activeMechanisms.push( 'lowAgreement' )

		// Real metacognitive confidence in THIS turn's own read — distinct from
		// EgoConfidence's affective-blend entropy — evidence from real agreement,
		// conflict from its real inverse (Fleming & Lau 2014, see
		// MetacognitiveConfidence.js).
		const metacognitiveConfidence = this.metacognitiveConfidence.evaluate( {
			evidence : agreement.agreement,
			conflict : 1 - agreement.agreement,
			noise         : semanticSimilarity ? 0 : 0.3,
		} )

		// Dual-process arbitration — real logistic blend of signals already
		// computed this turn (stakes from |desirability|+life-event impact,
		// conflict from the real cross-signal variance just above, time
		// pressure left at a neutral prior — Totemheart has no real wall-clock
		// urgency signal to feed it) against depletion/arousal/cortisol, deciding
		// how much this turn's output should lean deliberated vs. associative
		// (Kahneman 2011; Evans & Stanovich 2013, see DualProcessController.js).
		const dualProcess = this.dualProcessController.compute( {
			stakes            : clamp01( Math.abs( desirability ) + ( lifeEvent ? lifeEvent.impact / 100 : 0 ) ),
			conflict          : clamp01( 1 - agreement.agreement ),
			timeAvailable   : 0.5,
			depletion       : 1 - this.egoDepletionBudget.getRegulationCapacity(),
			arousal          : this.emotionSpace.vector.arousal,
			cortisol         : this.cortisolEngine.getLevel(),
		} )

		// Habit vs. goal-directed control — real per-user habit strength (does
		// this same user recurring, under this level of stress, tend to pull a
		// well-worn automatic reaction rather than a deliberated one) competing
		// against real goal salience (Dolan & Dayan 2013, see HabitVsGoalSystem.js).
		this.habitVsGoalSystem.reinforce( userId )
		const habitVsGoal = this.habitVsGoalSystem.compute( userId, {
			stress        : this.cortisolEngine.getLevel(),
			depletion    : 1 - this.egoDepletionBudget.getRegulationCapacity(),
			goalSalience : dualProcess.pS2,
			novelty       : novelty,
		} )

		// General predictive-processing coupling — this turn's real desirability
		// read against a running per-user expectation (Friston 2010, see
		// PredictiveProcessingCore.js); distinct from DopaminergicEngine's
		// reward-specific RPE and InteroceptivePredictionError's body-signal-only
		// mismatch — a small, real, ADDITIONAL arousal nudge from how much this
		// turn's tone violated what this relationship has run like so far.
		const predictiveError = this.predictiveProcessingCore.observe( `desirability:${userId}`, clamp01( ( desirability + 1 ) / 2 ), { polarity: 1, precision: agreement.agreement } )
		if ( predictiveError.arousalDelta > 0 ) this.emotionSpace.applySpike( { arousal: predictiveError.arousalDelta * 0.15, weight: 1 } )

		// Arousal-conductance — purely internal analog of EDA's tonic/phasic split,
		// applied to a real internal stress-arousal signal instead of a skin sensor.
		// An acute phasic spike (well above the AI's own recent baseline) adds extra
		// sensitization on top of the raw-valence trigger above — a felt "jolt", not
		// just a bad-outcome trigger.
		const conductance = this.interoceptiveSignals.observeArousalConductance( ( this.cortisolEngine.getLevel() + smoothedArousal ) / 2 )
		if ( conductance.phasic > 0.3 ) this.sensitization.observe( -conductance.phasic )

		// Cognitive dissonance — static-belief conflict plus behavioral-pattern inconsistency,
		// with a fuzzy (not crisp-threshold) acceptability read factoring in how much this
		// user is trusted: the same conflict score reads as more acceptable from someone trusted.
		const conflict   = await this.#analyze( 'beliefConflict', { text: input, beliefs: this.coreBeliefs.getAll() } )
		const dissonance = this.cognitiveDissonance.registerConflict( conflict.score ?? 0, this.personality )
		const acceptability = this.fuzzyNormativeCheck.evaluate( conflict.score ?? 0, relation.trust )

		// Moral injury — ordinary dissonance that crosses a real severity threshold
		// against a genuinely high-polarity core belief scars permanently, distinct
		// from CognitiveDissonance's own stress (which recovers) — see MoralInjury.js.
		if ( dissonance.triggered ) {

			const matchedBelief = this.coreBeliefs.getAll().find( b => ( input || '' ).toLowerCase().includes( b.statement.toLowerCase().slice( 0, 12 ) ) )
			if ( matchedBelief ) {

				const injury = this.moralInjury.evaluate( matchedBelief.topic, this.cognitiveDissonance.getStress(), matchedBelief.polarity )
				if ( injury.injured ) this.explainability.logDecision( 'moral_injury', `permanent scar on "${matchedBelief.topic}" (severity=${injury.severity.toFixed( 2 )}, total=${injury.totalScar.toFixed( 2 )})` )

			}

		}

		// Logic — a cold, boolean read run IN PARALLEL to the emotional appraisal
		// above, deliberately NOT feeding into EmotionSpace: this is the AI's
		// dispassionate read of whether the input is logically consistent with its
		// CoreBeliefs, exposed alongside the emotional read rather than folded into
		// it, exactly as requested ("sin intervención del vector PAD").
		const logicPropositions = this.logicEngine.evaluatePropositions( input, this.coreBeliefs.getAll() )
		const logicVerdict        = this.logicEngine.searchBestStrategy( logicPropositions )

		// Sunk-cost fallacy — every turn a topic actually gets defended (strategy chose
		// "disagree" over a real violation), that's real invested effort. The more of it
		// there is, the more evidence it should take to actually register as dissonance —
		// scales the acceptance threshold logarithmically, not linearly, so the first few
		// defenses barely matter but a long-defended position gets genuinely entrenched.
		if ( logicVerdict.strategy === 'disagree' ) {

			for ( const p of logicPropositions ) if ( p.consistent === false ) this.coreBeliefs.recordDefense( p.topic )

		}
		const stubbornInvestment = this.coreBeliefs.getTotalInvestment()
		const stubbornResistance = 1 + 0.3 * Math.log( 1 + stubbornInvestment )

		// Analytical decision cost — real cognitive work (not emotional) still costs
		// something, same accumulator every other decision already uses. Only charged
		// when there was actually something to evaluate against.
		if ( logicPropositions.length > 0 ) this.decisionFatigue.recordDecision( 0.5 )

		// Theory of mind — heuristic/LLM read first, then a small Monte Carlo ensemble
		// widens that single point-estimate into a sampled distribution reflecting how
		// well this specific person is actually known (uncertainty = 1 - trust).
		const mentalState = shallowMode
			? await this.heuristic.analyze( 'mentalState', { text: input } )
			: await this.#analyze( 'mentalState', { text: input } )
		this.theoryOfMind.update( userId, mentalState )
		const tomEstimate = this.monteCarloToM.simulate( mentalState.valence ?? 0, 1 - relation.trust )
		// Theory-of-mind's own read of what this user is likely feeling is real
		// evidence about what to expect from them, distinct from the reward this
		// turn's outcome actually delivered — feeds the same per-user expectation
		// store the reward-driven RPE update above uses, at a smaller weight.
		this.dopaminergicEngine.updateExpectationFromBelief( userId, tomEstimate.estimatedValence, 0.15 )

		// Tribal categorization — in/out-group confirmation bias on the perceived desirability.
		const tribe     = this.tribalCategorization.classify( relation )
		desirability    = desirability * this.tribalCategorization.biasMultiplier( tribe, desirability )

		// Behavioral inconsistency — does this contradict the pattern this user has established,
		// even if it doesn't contradict any static CoreBelief? Skipped under high instability.
		const behavioralInconsistency = gate.runBehavioralInconsistency
			? this.cognitiveDissonance.registerBehavioralInconsistency( appraisal, relation, this.personality )
			: { triggered: false, score: 0 }

		// Emotional contagion — real Kuramoto phase coupling on the circumplex angle,
		// using the Monte-Carlo-refined estimate of the user's valence and the detected
		// situational stress as a stand-in for their arousal (not directly measured).
		const contagionSpike = this.emotionalContagion.computeKuramotoSpike(
			this.emotionSpace.vector, tomEstimate.estimatedValence, situational.stress, relation.affinity, this.personality,
		)
		this.emotionSpace.applySpike( contagionSpike )
		this.moodTracker.push( contagionSpike )

		// Chronic contagion — distinct from the short-term Kuramoto sync above: a slow,
		// long-run EMA pull toward this user's HISTORICAL valence, not their current
		// turn. A chronic pessimist drags the AI's baseline down turn after turn even
		// without any single stressful spike.
		const chronicPull = this.chronicContagion.getPull( userId, this.emotionSpace.vector.valence )
		this.chronicContagion.observe( userId, tomEstimate.estimatedValence )
		if ( Math.abs( chronicPull.delta ) > 0.02 ) {

			this.emotionSpace.applySpike( { valence: chronicPull.delta, weight: 0.3 } )
			this.moodTracker.push( { valence: chronicPull.delta, arousal: 0 } )

		}

		// Uncanny valley of affect — static, unvarying extreme positivity reads as
		// suspicious rather than genuine. Distrust dampens how much this turn's
		// positivity actually lands, and costs real Attachment trust, instead of the
		// AI just accumulating warmth from repeated flattery.
		this.uncannyValleyDetector.observe( userId, tomEstimate.estimatedValence )
		const uncannyValley = this.uncannyValleyDetector.evaluate( userId )
		if ( uncannyValley.suspicious ) {

			desirability = desirability * 0.4
			this.theoryOfMind.updateBelief( userId, 'reliability', { suspicious: true, distrustLevel: uncannyValley.distrustLevel } )
			activeMechanisms.push( 'uncanny' )

		}

		// Sarcasm — real lexical valence (this turn's raw appraisal) vs. real recent
		// context (this user's last few stored memories' average valence), scaled by
		// the visual-prosody intensity already computed at the top of this turn. A
		// shouted "GREAT" right after consistently bad recent context flags as sarcasm
		// and inverts the sign before it reaches the rest of appraisal.
		const contextValence = this.episodicMemory.getRecentValence( userId )
		const sarcasm             = this.sarcasmDetector.detect( appraisal.desirability ?? 0, contextValence, visualProsody.intensity )
		if ( sarcasm.sarcastic ) {

			desirability = sarcasm.adjustedValence
			this.theoryOfMind.updateBelief( userId, 'tone', { ironic: true } )
			activeMechanisms.push( 'sarcasm' )

		}

		// Real interest identity — this turn's own significant (non-stopword)
		// content tokens are the real real topic candidates (Silvia 2006;
		// Renninger & Hidi 2011, see FrikiEngine.js); Totemheart has no
		// dedicated topic-extraction module, so real content words are the
		// honest signal available, the same real approach `EpisodicMemory`'s
		// own token-overlap reactivation already uses. Not every turn touches
		// a real recurring topic, so this is honestly sparse.
		const frikiStopwords = new Set( [ 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'a', 'al', 'en', 'y', 'o', 'que', 'es', 'son', 'esta', 'está', 'con', 'por', 'para', 'se', 'su', 'lo', 'me', 'te', 'mi', 'tu', 'yo', 'no', 'si', 'como', 'mas', 'más', 'pero', 'muy', 'eres', 'soy', 'the', 'a', 'an', 'of', 'to', 'in', 'is', 'and', 'this', 'that', 'it', 'i', 'you' ] )
		const frikiTopics       = ( input.toLowerCase().match( /[\p{L}']+/gu ) ?? [] ).filter( t => !frikiStopwords.has( t ) && t.length > 3 )
		for ( const topic of frikiTopics ) this.frikiEngine.observeEngagement( topic, { reward: desirability, depth: novelty } )
		const obsession = this.frikiEngine.getObsession()
		// A real, currently-fused interest getting attacked this turn (present
		// in this turn's own topics, negative desirability) is genuinely
		// ego-threatening — folds into the AI's own real felt state, the same
		// direction other identity threats already push it.
		let frikiEgoThreat = 0
		if ( desirability < -0.2 ) for ( const topic of frikiTopics ) frikiEgoThreat = Math.max( frikiEgoThreat, this.frikiEngine.getEgoThreatFromAttack( topic, Math.abs( desirability ) ) )
		// Real reveal gate — a superfan-level interest the human hasn't brought
		// up and trust hasn't cleared for stays genuinely unmentioned by the AI
		// on its own initiative (the caller/host, not this line, decides
		// whether to actually bring it up — this is the real permission read).
		const frikiReveal = obsession ? this.frikiEngine.shouldRevealUnprompted( obsession, { trust: relation.trust, humanBroughtItUp: frikiTopics.includes( obsession ) } ) : true
		const frikiShare      = obsession ? this.frikiEngine.shouldShare( obsession, { affinity: relation.affinity, reciprocalInterest: frikiTopics.includes( obsession ) ? 0.6 : 0 } ) : null
		if ( frikiEgoThreat > 0.3 ) this.emotionSpace.applySpike( { arousal: frikiEgoThreat * 0.15, dominance: -frikiEgoThreat * 0.1, weight: 1 } )

		// LoveHateEngine — dual-valence relational field: Affinity (A) and Aversion
		// (V) are tracked as two SEPARATE per-user accumulators, not one bipolar
		// scale, so real ambivalence ("te quiero pero me hiciste daño") can raise
		// both at once. Phase 1 (semantic polarization) is computed here from
		// signals this turn ALREADY has — desirability split into its positive/
		// negative parts, real ontology-concept flags, a detected life event's own
		// valence — not a second lexicon duplicating EmotionalOntology's job.
		const conceptSet   = new Set( ontologyMatches.map( m => m.concept ) )
		let loveHateL = Math.max( 0, desirability )
		let loveHateH = Math.max( 0, -desirability )
		if ( conceptSet.has( 'affection' ) ) loveHateL = Math.min( 1, loveHateL + 0.4 )
		if ( conceptSet.has( 'achievement' ) ) loveHateL = Math.min( 1, loveHateL + 0.2 )
		if ( conceptSet.has( 'betrayal' ) ) loveHateH = Math.min( 1, loveHateH + 0.5 )
		if ( conceptSet.has( 'threat' ) || conceptSet.has( 'rejection' ) ) loveHateH = Math.min( 1, loveHateH + 0.3 )
		if ( conceptSet.has( 'criticism' ) ) loveHateH = Math.min( 1, loveHateH + 0.3 )

		// Betrayal trauma — a real, intense-enough betrayal leaves a permanent
		// trust-threshold shift for THIS user specifically (Freyd 1996, see
		// BetrayalTraumaTrace.js) — distinct from LoveHateEngine's own Aversion,
		// which still decays normally; this raises the real bar trust has to
		// clear to recover, on top of that.
		if ( conceptSet.has( 'betrayal' ) ) this.betrayalTraumaTrace.record( userId, Math.abs( desirability ) )
		const traumaTrustThreshold = this.betrayalTraumaTrace.getTrustThreshold( userId, 0, this.personality.get( 'neuroticism' ) )

		// Social pain overlap — real exclusion/rejection specifically (not generic
		// negativity) reuses the bodily-threat pathway, a distinct cortisol-weighted
		// signature (Eisenberger, Lieberman & Williams 2003, see PainSocialOverlap.js).
		if ( conceptSet.has( 'rejection' ) || conceptSet.has( 'betrayal' ) ) {

			const socialPain = this.painSocialOverlap.computeSocialPainSpike( desirability, conceptSet.has( 'rejection' ) ? 0.8 : 0.5 )
			if ( socialPain.cortisolBoost > 0 ) {

				this.emotionSpace.applySpike( { valence: socialPain.valence * 0.3, arousal: socialPain.arousal * 0.3, weight: 0.4 } )
				this.cortisolEngine.level = clamp01( this.cortisolEngine.level + socialPain.cortisolBoost )

			}

		}
		if ( lifeEvent ) {

			loveHateL = Math.min( 1, loveHateL + Math.max( 0, lifeEvent.valence ) * ( lifeEvent.impact / 100 ) * 0.3 )
			loveHateH = Math.min( 1, loveHateH + Math.max( 0, -lifeEvent.valence ) * ( lifeEvent.impact / 100 ) * 0.3 )
			// A sufficiently severe, negative real life event enters the real
			// meaning-making search process (Park 2010) — not every negative
			// turn, only ones that genuinely violate prior assumptions.
			if ( lifeEvent.valence < -0.3 && lifeEvent.impact > 30 ) {

				this.meaningMakingEngine.registerEvent( `${userId}:${this.turnCounter}`, {
					severity     : clamp01( lifeEvent.impact / 100 ),
					worldviewGap : clamp01( Math.abs( lifeEvent.valence ) ),
				} )

			}

		}

		const woundPressure   = Math.min( 1, this.episodicMemory.getZeigarnikPressure( userId ) / 3 )
		// A real permanent betrayal-trauma trace lowers the EFFECTIVE trust
		// LoveHateEngine's own gate reads — trauma raises the real bar this
		// relationship's warmth has to clear, on top of relation.trust itself.
		const traumaAdjustedTrust = clamp01( relation.trust - traumaTrustThreshold )
		const bondUpdate         = this.loveHateEngine.observe( userId, { L: loveHateL, H: loveHateH }, {
			trust: traumaAdjustedTrust, woundPressure, cortisol: this.cortisolEngine.getLevel(), egoHealth: this.reputationEngine.getEgoHealth(),
		} )

		// Feeds the felt state directly, real numbers straight from the engine:
		// NetBond pulls valence toward however this relationship actually nets out,
		// Tension (A·V, only nonzero when BOTH are genuinely present) plus the raw
		// H charge raises arousal — ambivalence is felt as agitation, not averaged away.
		const bondTension = this.loveHateEngine.getTension( userId )
		this._lastLoveHateTension = bondTension
		this.emotionSpace.applySpike( { valence: bondUpdate.netBond * 0.15, arousal: ( bondTension + loveHateH ) * 0.15, weight: 0.35 } )
		this.moodTracker.push( { valence: bondUpdate.netBond * 0.15, arousal: ( bondTension + loveHateH ) * 0.15 } )
		if ( bondUpdate.Heff > 0.25 ) this.cortisolEngine.register( -bondUpdate.Heff, false )

		// RepairProtocol tracks this bond's real historical peak affinity every turn —
		// the ceiling any future trust rebound is capped below (see RepairProtocol.js).
		this.repairProtocol.observePeak( userId, bondUpdate.A )

		// A real grief wave for an already-active grief process (from a past rupture)
		// can resurface unprompted on ANY turn, independent of what triggers below.
		const griefWave = this.griefEngine.rollWave( userId )
		if ( griefWave ) {

			this.emotionSpace.applySpike( griefWave.spike )
			this.moodTracker.push( griefWave.spike )
			this.primaryDrives.activate( 'PANIC_GRIEF', griefWave.intensity * 0.5 ) // a real grief wave IS the real PANIC/GRIEF (separation-distress) drive firing (Panksepp 1998)

		}
		if ( this.griefEngine.isActive( userId ) ) this.primaryDrives.activate( 'PANIC_GRIEF', this.griefEngine.getIntensity( userId ) * 0.1 )

		// PLAY — a real positive, low-threat, moderately-aroused turn (Panksepp's
		// own real trigger condition for playful engagement, distinct from SEEKING's
		// novelty-driven curiosity).
		if ( desirability > 0.3 && this.emotionSpace.vector.arousal > 0.2 && this.emotionSpace.vector.arousal < 0.7 ) this.primaryDrives.activate( 'PLAY', desirability * 0.2 )

		const rupture = this.loveHateEngine.checkRupture( userId, { cortisol: this.cortisolEngine.getLevel() } )
		let repair       = { repaired: false }
		if ( rupture.ruptured ) {

			// A real rupture of a bond that had genuine affinity to lose triggers grief —
			// not "high sadness", a real decaying-with-waves process (see GriefEngine.js).
			if ( bondUpdate.A > 0.15 ) this.griefEngine.triggerLoss( userId, bondUpdate.A, 'bond_rupture' )
			// Real relatedness-need drain (Deci & Ryan 2000, see SelfDeterminationNeeds.js)
			// and a real uncontrollable-failure record (Seligman 1972, see
			// ControllabilityEstimate.js's learned-helplessness extension) — a
			// rupture is, from this side of the relationship, genuinely not a
			// choice this turn's own regulation could have prevented outright.
			this.selfDeterminationNeeds.drain( 'relatedness', bondUpdate.A * 0.4 )
			this.controllabilityEstimate.recordUncontrollableFailure()

			// Real cross-module side effects of an actual rupture, applied here
			// (LoveHateEngine itself stays self-contained and returns a signal,
			// same orchestration pattern Totemheart already uses for e.g. life
			// events and gratitude) rather than reaching into other modules itself.
			this.dopaminergicEngine.freezeWanting()
			this.amygdalaHijack.observeStimulus( 'rupture' ) // kindles a lower hijack threshold on a FUTURE turn — this turn's own check already ran
			this._hijackAlertBoost = Math.max( this._hijackAlertBoost ?? 0, 0.2 )
			this.expressionDebt.accumulate( 0.3 )
			this.reputationEngine.egoHealth = clamp01( this.reputationEngine.egoHealth - 0.1 )
			this.ruminationChain.biasTowardNegative( rupture.ambivalence * 0.4 + 0.2 )
			await safeStep( this.explainability, 'episodicMemory.storeLoveHateRupture', async () => this.episodicMemory.store( {
				text               : `[relational rupture] V-A=${( this.loveHateEngine.getBond( userId ).V - this.loveHateEngine.getBond( userId ).A ).toFixed( 2 )}`,
				userId, emotionalSignature: { valence: -0.7, arousal: 0.6 }, importance: 0.75, concepts: [ 'rupture' ], turnIndex: this.turnCounter,
			} ), null )
			this.explainability.logDecision( 'lovehate_rupture', `relational rupture #${rupture.ruptureCount} for ${userId} (netBond=${rupture.netBond.toFixed( 2 )})` )

		}
		else {

			repair = this.loveHateEngine.attemptRepair( userId, { cortisol: this.cortisolEngine.getLevel() } )
			if ( repair.repaired ) {

				this.dopaminergicEngine.likingValue = Math.max( -1, Math.min( 1, this.dopaminergicEngine.likingValue + repair.dopamineLikingBoost ) )
				this.reputationEngine.egoHealth        = clamp01( this.reputationEngine.egoHealth + repair.egoHealthRestore )
				this.explainability.logDecision( 'lovehate_repair', `relational repair #${repair.repairCount} for ${userId}` )

				// Real transactional repair: an apology is offered and (this successful
				// LoveHateEngine repair IS the real "it landed" signal) accepted, applying
				// the bounded rebound — never above this bond's own historical peak.
				this.repairProtocol.offerApology( userId, agreement.agreement )
				const resolvedApology = this.repairProtocol.resolveApology( userId, true, this.loveHateEngine.getBond( userId ).A )
				if ( resolvedApology.reboundedA !== undefined ) {

					const bond   = this.loveHateEngine.getBond( userId )
					bond.A          = Math.max( bond.A, resolvedApology.reboundedA )

				}

			}

		}

		// Hedonic adaptation — per-fingerprint discount (repeating the exact same phrase)...
		const neuroticism        = this.personality.get( 'neuroticism' )
		const fingerprint         = HedonicAdaptation.fingerprintOf( input, this.emotionSpace.getDominantEmotion( neuroticism ) )
		const hedonicMultiplier = this.hedonicAdaptation.getMultiplier( fingerprint, this.personality )
		this.hedonicAdaptation.record( fingerprint )

		// ...plus a genuinely different mechanism: the "hedonic treadmill" reference-point
		// shift. Ten turns of sustained praise raises what counts as "still positive" —
		// the SAME +0.5 compliment reads as flat or disappointing once the reference point
		// has drifted up to meet it, distinct from discounting a literally-repeated phrase.
		const referenceShift          = this.hedonicAdaptation.getReferencePointShift()
		const referenceAdjustedDesirability = Math.max( -1, Math.min( 1, desirability - referenceShift * 0.5 ) )
		this.hedonicAdaptation.observeReferencePoint( desirability )

		// Loss aversion — a negative swing is weighted ~2.25x a same-sized positive one.
		const adjustedDesirability = this.lossAversion.apply( referenceAdjustedDesirability )

		// Microemotions -> EmotionSpace + MoodTracker. Scaled by appraisal agreement: when the
		// turn's independent valence estimates disagree with each other, the reaction expressed
		// is genuinely less confident, not just internally uncertain — real data changing how
		// strongly the emotion projects, not only how it's described in the system prompt.
		const spike = this.microEmotions.generate(
			{ ...appraisal, desirability: adjustedDesirability },
			dissonance.triggered ? ( conflict.score * ( 1 - acceptability ) ) / stubbornResistance : 0,
			hedonicMultiplier,
		)
		spike.weight = ( spike.weight ?? 1 ) * ( 0.6 + 0.4 * agreement.agreement )
		// Allostatic load — real chronic-stress "wear" (McEwen & Stellar 1993, see
		// Homeostasis.js) makes a negative spike land harder, not softer, a
		// direction with support in the chronic-stress/reactivity literature.
		// Only scales spikes that are actually negative on this turn.
		if ( spike.valence < 0 ) spike.weight *= this.homeostasis.getReactivityMultiplier()
		this.emotionSpace.applySpike( spike )
		this.moodTracker.push( spike )

		// Expression debt release — pent-up unexpressed affect from a prior turn's bystander
		// silence or sensory-overload freeze surfaces now as extra arousal, not a valence
		// flip: the felt intensity that had nowhere to go adds to whatever is being felt now.
		// Ego depletion / character break: past a critical debt level, a partial release
		// isn't enough — force a full dump instead, and flag it so the suppression stage
		// below bypasses ExpressiveSuppression entirely for this turn (the "losing your
		// composure" failure mode: it can't keep being suppressed forever).
		const characterBreak = this.expressionDebt.debt > EGO_DEPLETION_THRESHOLD
		const debtReleased      = this.expressionDebt.release( characterBreak ? 1 : 0.5 )
		if ( debtReleased > 0 ) this.emotionSpace.applySpike( { arousal: debtReleased * ( characterBreak ? 1 : 0.6 ), weight: characterBreak ? 1 : 0.5 } )
		if ( characterBreak ) this.explainability.logDecision( 'character_break', `expression debt exceeded ${EGO_DEPLETION_THRESHOLD} — suppression bypassed this turn, dumped ${debtReleased.toFixed( 2 )} of pent-up affect` )
		this.expressionDebt.decay( 1 )

		// Commitment device — the AI's own implicit self-binding promise to stay
		// composed (Kiesler 1971, see CommitmentDevice.js). A character break IS a
		// real violation of that promise, with an escalating cost the longer it had
		// been kept; otherwise, staying composed this turn reinforces it.
		if ( characterBreak ) {

			const violation = this.commitmentDevice.violate( 'be_composed' )
			this.reputationEngine.egoHealth = clamp01( this.reputationEngine.egoHealth - violation.cost )

		}
		else this.commitmentDevice.keep( 'be_composed' )

		// Reputation / ego — a 'shame' reaction (submissive personalities) also drops the
		// felt sense of Dominance directly and biases toward withdrawal, matching the
		// real phenomenon (shame collapses posture/control, not just mood).
		const reputation = this.reputationEngine.evaluate( appraisal, this.personality )

		// Identity threat — an attack specifically on a tagged self-identity core
		// belief (not just any competence hit) triggers a bigger, distinct ego-
		// protection cascade (Steele 1988, see IdentityThreatMonitor.js).
		const selfTopics    = this.coreBeliefs.getAll().filter( b => b.topic.startsWith( 'self_' ) ).map( b => b.topic )
		const identityThreat = this.identityThreatMonitor.detect( appraisal, this.coreBeliefs, selfTopics )
		if ( identityThreat.isIdentityThreat ) {

			const cascade = this.identityThreatMonitor.getCascadeMultipliers( identityThreat.severity )
			this.reputationEngine.egoHealth = clamp01( this.reputationEngine.egoHealth - identityThreat.severity * 0.15 * cascade.egoHealthDamageMult )
			this.explainability.logDecision( 'identity_threat', `identity threat on ${identityThreat.matchedTopics.join( ',' )} (severity=${identityThreat.severity.toFixed( 2 )})` )

		}

		// Flush — purely internal analog of peripheral blood flow, a real first-order
		// thermal lag driven by the shame/anger blend weight instead of a Navier-Stokes
		// simulation (there's no skin here either). It outlasts its trigger the way a
		// real flush does, and is used to prolong the shame spike below rather than to
		// color anything visible.
		const preSpikeBlend = this.emotionSpace.getBlend( 3, neuroticism )
		const flushDrive      = ( preSpikeBlend.shame ?? 0 ) + ( preSpikeBlend.anger ?? 0 )
		const flush              = this.interoceptiveSignals.observeFlush( flushDrive, 1 )

		if ( reputation.reaction === 'shame' ) {

			const shameSpike = { valence: -0.2 * ( 1 + flush * 0.5 ), dominance: -0.6 * ( 1 + flush * 0.5 ), weight: 0.5 }
			this.emotionSpace.applySpike( shameSpike )
			this.moodTracker.push( { valence: shameSpike.valence, arousal: 0 } )

		}

		// Gratitude — credit assignment when an unexpectedly positive outcome is
		// attributed specifically to this user.
		const gratitude = this.gratitudeEngine.evaluate( { rpe, agency: appraisal.agency, desirability } )
		if ( gratitude ) {

			this.emotionSpace.applySpike( gratitude.spike )
			this.moodTracker.push( gratitude.spike )
			relation.affinity = clamp01( relation.affinity + gratitude.creditBoost )
			this.primaryDrives.activate( 'CARE', 0.3 ) // real gratitude/credit-to-another is exactly the real CARE/nurturant drive's own trigger (Panksepp 1998)
			this.selfDeterminationNeeds.supply( 'relatedness', gratitude.creditBoost )

		}

		// Real competence-need supply/drain from this turn's own real reward-
		// prediction error — a positive surprise reads as real evidence of
		// having handled the interaction well, a strongly negative one as the
		// opposite (Deci & Ryan 2000, see SelfDeterminationNeeds.js).
		if ( rpe > 0.1 ) this.selfDeterminationNeeds.supply( 'competence', clamp01( rpe ) * 0.3 )
		else if ( rpe < -0.1 ) this.selfDeterminationNeeds.drain( 'competence', clamp01( -rpe ) * 0.3 )
		// Real autonomy-need supply from this turn's own agency read (how much
		// of the outcome the appraisal attributes to the agent's own choice).
		if ( typeof appraisal.agency === 'number' ) this.selfDeterminationNeeds.supply( 'autonomy', clamp01( appraisal.agency ) * 0.05 )

		// Role-identity salience — real per-turn cues built from signals
		// Totemheart already computed (Stryker 1980, see RoleIdentitySalience.js).
		if ( gratitude ) this.roleIdentitySalience.setCommitment( 'caregiver', clamp01( this.roleIdentitySalience.getCommitment( 'caregiver' ) + 0.05 ) )
		const roleSalience = this.roleIdentitySalience.resolve( {
			caregiver : this.primaryDrives.getDrive( 'CARE' ),
			playmate  : this.primaryDrives.getDrive( 'PLAY' ),
			confidant : clamp01( relation.trust ),
		} )

		// Real reminiscence — this turn's own tokens checked against the real
		// catalog for this relationship; a genuine overlap hit is a real,
		// person-specific memory surfacing on its own, not invented (see
		// RelationalMemoryCatalog.js). A warm, real reactivated detail nudges
		// affinity a small, bounded amount — only when the AI itself isn't
		// currently flooded (no active hijack this turn already ran, so this
		// code path is only reached when it didn't).
		const reminiscence = this.relationalMemoryCatalog.reminisce( userId, input.toLowerCase().match( /[\p{L}']+/gu ) ?? [] )
		if ( reminiscence.length && reminiscence[ 0 ].valence > 0 ) relation.affinity = clamp01( relation.affinity + reminiscence[ 0 ].reactivation * 0.05 )

		// Fairness — is this user being treated noticeably better/worse than others
		// this AI also knows? Fehr-Schmidt inequity aversion on relative affinity.
		const othersTreatment = [ ...this.attachment.relations.entries() ]
			.filter( ( [ id ] ) => id !== userId )
			.map( ( [ , r ] ) => r.affinity )
		const fairness = this.fairnessMonitor.evaluate( relation.affinity, othersTreatment )
		if ( fairness.envy > 0.15 ) this.emotionSpace.applySpike( { valence: -fairness.envy * 0.3, dominance: -fairness.envy * 0.2, weight: 0.4 } )

		// Value hierarchy — a real "care" pull (this turn's own desirability) vs. a
		// real "fairness" pull (inequity envy toward this user) genuinely conflict
		// when they oppose, weighted by how strongly BOTH values are held (Schwartz
		// 1992, see ValueHierarchy.js) — raises real CognitiveDissonance stress, a
		// second, independent source from the belief-conflict one above.
		const valueConflict = this.valueHierarchy.evaluateConflict( 'care', desirability, 'fairness', -fairness.envy )
		if ( valueConflict.conflict ) this.cognitiveDissonance.stress = clamp01( this.cognitiveDissonance.stress + valueConflict.dissonance * 0.2 )

		// Status envy — falling status while a known rival's rises, independent of
		// absolute treatment level (item 39's actual trigger condition).
		const selfTrend  = this.statusEnvy.observe( userId, relation.powerDynamic )
		const rivalEntry  = [ ...this.attachment.relations.entries() ].find( ( [ id ] ) => id !== userId )
		if ( rivalEntry ) {

			const rivalTrend = this.statusEnvy.observe( rivalEntry[ 0 ], rivalEntry[ 1 ].powerDynamic )
			const envyCheck    = this.statusEnvy.checkEnvy( selfTrend, rivalTrend )
			if ( envyCheck.triggered ) this.emotionSpace.applySpike( { valence: -envyCheck.intensity * 0.3, arousal: envyCheck.intensity * 0.2, weight: 0.4 } )

			// Jealousy triangle — the same trend signals, but scored against the AI's
			// OWN real bond strength with "other" (userId), not just the bare trend
			// comparison StatusEnvy already does (White & Mullen 1989, see JealousyTriangle.js).
			const jealousy = this.jealousyTriangle.evaluate( selfTrend, rivalTrend, this.loveHateEngine.getNetBond( userId ) )
			if ( jealousy.threatened ) this.emotionSpace.applySpike( { valence: -jealousy.intensity * 0.25, arousal: jealousy.intensity * 0.3, weight: 0.4 } )

		}

		// Controllability — high estimated control over this kind of situation dampens
		// panic; feeds back into the next turn's amygdala threshold via cortisol/sensitization
		// only indirectly (this directly dampens the fear-relevant part of the spike above via
		// a post-hoc correction since MicroEmotions already ran).
		const controllabilityBucket = this.emotionSpace.getDominantEmotion( neuroticism )
		const panicDampener            = this.controllabilityEstimate.getPanicDampener( controllabilityBucket )
		if ( panicDampener < 1 && this.emotionSpace.vector.arousal > 0.5 && this.emotionSpace.vector.valence < 0 ) {

			this.emotionSpace.applySpike( { arousal: -this.emotionSpace.vector.arousal * ( 1 - panicDampener ) * 0.3, weight: 1 } )

		}

		// Defense mechanisms — real Hebbian cascade: if sarcasm/low-agreement and defense
		// have repeatedly co-fired across this conversation, their learned association
		// lowers the effective stress threshold this turn, so defense can wake up even
		// when the raw dissonance score alone wouldn't have crossed the line yet — one
		// activated layer nudging a correlated one awake, not a fixed rule.
		const cascadeBoost      = Math.max(
			this.hebbianPlasticity.getAssociation( 'sarcasm', 'defense' ),
			this.hebbianPlasticity.getAssociation( 'lowAgreement', 'defense' ),
			this.hebbianPlasticity.getAssociation( 'uncanny', 'defense' ),
		)
		// Vaillant hierarchy — low ego health / high cortisol pulls the pick toward the
		// immature end (projection/evasion), high ego health + low cortisol lets mature
		// defenses (humor) compete. See DefenseMechanisms.js. LoveHateEngine's real
		// relational Tension (A·V — only nonzero when both love and hate are
		// genuinely present this turn) folds into the same cortisol-shaped input:
		// high ambivalence toward this user reads as extra reactivity pressure here,
		// same direction chronic cortisol already has on this check.
		const defenseDirective = this.defenseMechanisms.check(
			this.cognitiveDissonance.getStress() + cascadeBoost * 0.3, this.personality, 0.6,
			{ egoHealth: this.reputationEngine.getEgoHealth(), cortisol: Math.min( 1, this.cortisolEngine.getLevel() + ( this._lastLoveHateTension ?? 0 ) * 0.2 ) },
		)
		// Real inhibitory-control cost/failure read — distinct from
		// EgoDepletionBudget's general regulation resource (Barkley 1997, see
		// InhibitoryControlPool.js). Spending happens whether or not the
		// impulse actually wins; the failure probability is exposed for a host
		// to weigh, not silently sampled with Math.random() here.
		const inhibitionFailureProbability = this.inhibitoryControlPool.getFailureProbability( this.cortisolEngine.getLevel() + woundPressure * 0.5 )
		this.inhibitoryControlPool.spend( 0.05 + ( defenseDirective.active ? 0.08 : 0 ) )

		if ( defenseDirective.active ) {

			activeMechanisms.push( 'defense' )
			// Residue: using a defense leaves a real, queryable trace — a low-importance
			// EpisodicMemory entry tagged with which one, not just the SelfModel counter
			// already reinforced below. "The system remembers it used projection."
			await safeStep( this.explainability, 'episodicMemory.storeDefenseResidue', async () => this.episodicMemory.store( {
				text               : `[defense] ${defenseDirective.mechanism} (${defenseDirective.tier})`,
				userId,
				emotionalSignature : { valence: 0, arousal: 0 },
				importance           : 0.05,
				concepts             : [ `defense:${defenseDirective.mechanism}` ],
				turnIndex             : this.turnCounter,
			} ), null )

		}
		this.hebbianPlasticity.update( activeMechanisms )

		// Self-model — reinforced incrementally on each observation, not batch-analyzed.
		// Skipped under near-maximal instability (mid-emergency isn't when introspection happens).
		if ( gate.runSelfModelUpdate ) {

			if ( defenseDirective.active ) {

				if ( defenseDirective.mechanism === 'projection' || ontologyMatches.some( m => m.concept === 'criticism' ) ) this.selfModel.reinforce( 'defensivo_con_critica' )
				if ( defenseDirective.mechanism === 'evasion' ) this.selfModel.reinforce( 'evita_cuando_duele' )

			}
			if ( relation.trust < 0.4 && desirability > 0.6 ) this.selfModel.reinforce( 'confia_facil' )

		}

		// Insight generation — the same real observations SelfModel already
		// tracks also feed a real frequency/consistency/recency pattern
		// detector; once a pattern is strong enough (own tuning, see
		// InsightGenerator.js), it can genuinely surface as an insight this
		// turn, logged for real inspection rather than silently accumulating.
		if ( defenseDirective.active ) this.insightGenerator.observe( `defense:${defenseDirective.mechanism}`, -Math.abs( desirability ) )
		const insight = this.insightGenerator.rollInsight( `defense:${defenseDirective.mechanism}`, this.personality.get( 'openness' ), this.cognitiveDissonance.getStress() )
		if ( insight ) this.explainability.logDecision( 'insight', `real recurring pattern "${insight.pattern}" surfaced (strength=${insight.strength.toFixed( 2 )}, p=${insight.probability.toFixed( 2 )})` )

		// Power dynamics — a real assertive act (holding a defended position,
		// see LogicEngine/defense) vs. a real submissive act (shame reaction,
		// see reputation above) shift a real per-user dominance/submission
		// reading, distinct from Attachment.powerDynamic's single guilt-driven
		// nudge (see PowerDynamicsEngine.js).
		const assertiveAct    = defenseDirective.active && defenseDirective.tier !== 'immature' ? 0.4 : 0
		const submissiveAct   = reputation.reaction === 'shame' ? 0.4 : 0
		const powerUpdate       = this.powerDynamicsEngine.update( userId, { assertiveAct, submissiveAct, opponentDominance: Math.max( 0, -this.emotionSpace.vector.dominance ) } )
		if ( powerUpdate.fatigueCost > 0 ) this.decisionFatigue.recordDecision( powerUpdate.fatigueCost )

		// Meta-emotion — a real evaluation of the primary emotion just felt this
		// turn against the AI's own real standard (Conscientiousness-scaled),
		// distinct from the primary emotion itself (Gottman et al. 1996, see
		// MetaEmotionLayer.js). A genuinely negative meta-valence (shame at
		// one's own reaction) feeds back as a small, real additional spike.
		const metaValenceRaw = this.metaEmotionLayer.evaluateMetaValence( this.emotionSpace.vector.valence, 0, this.personality.get( 'conscientiousness' ) )
		const metaValence      = this.metaEmotionLayer.applyNeuroticismBias( metaValenceRaw, this.personality.get( 'neuroticism' ) )
		const metaArousal        = this.metaEmotionLayer.evaluateMetaArousal( this.emotionSpace.vector.arousal, 0.5 )
		if ( metaValence < -0.2 ) this.emotionSpace.applySpike( { valence: metaValence * 0.1, dominance: -0.05, weight: 0.25 } )
		this._lastMetaCuriosity = this.metaEmotionLayer.getMetaCuriosity( metaArousal, this.personality.get( 'openness' ) )

		// Text generation — guardedness rises with unhealed memories about this user.
		const unresolvedCount  = this.episodicMemory.getUnresolvedMemories( userId ).length
		const guardedness       = Math.min( 1, unresolvedCount * 0.2 )
		const blend               = this.emotionSpace.getBlend( 3, neuroticism )

		// Approach-avoidance conflict — disclosing/opening up (approach) vs. staying
		// guarded (avoidance) genuinely oscillate near the crossover point (Miller
		// 1944, see MotivationalConflict.js). `distance` = woundPressure (closer to 0
		// = "safer to approach"); low expressionConfidence in the vacillation zone
		// dampens this turn's expressed spike weight — real uncertainty about what to
		// express, not just a fixed guardedness scalar.
		const motivConflict = this.motivationalConflict.evaluate( woundPressure, Math.max( 0, desirability ), this.cortisolEngine.getLevel() + woundPressure )

		// Ego confidence — real Shannon entropy of the blend distribution (perplexity =
		// 2^H). A flat, confused blend reads as low self-confidence and drops Dominance
		// defensively — the honest triangulated version of "the model doubts itself".
		const egoConfidence = this.egoConfidence.evaluate( blend )
		if ( egoConfidence.confidence < 0.3 ) this.emotionSpace.applySpike( { dominance: -( 1 - egoConfidence.confidence ) * 0.2, weight: 0.4 } )

		const shouldApologize    = this.guiltEngine.consumeApologyFlag()
		let text                   = this.textGenerator.generateEmotionalResponse( this.language, blend, defenseDirective, guardedness, this.selfModel.getDominant() )

		if ( shouldApologize ) text = `Perdona por antes. ${text}`

		// A positive-enough turn can start healing one unresolved wound with this user —
		// wounds don't vanish just because time passed, something has to happen. The bar
		// to heal is lower the more this user is already trusted (0.4 at full trust, 0.8
		// at none) — an engineering estimate, not a measured coefficient. See CALIBRATION.md.
		const healingThreshold = 0.8 - relation.trust * 0.4
		if ( desirability > healingThreshold && unresolvedCount > 0 ) {

			this.episodicMemory.markResolved( this.episodicMemory.getUnresolvedMemories( userId, 1 )[ 0 ].id )

		}

		// Expressive suppression — a *display* layer only: the internal vector above is
		// untouched, only the vector handed to linguistic modulation is gated down.
		// Drive: conscientiousness (self-control) scaled by how stressed the system is —
		// composed people suppress more under stress, not at baseline. A "Restraint"-tagged
		// life event (e.g. a jail term, an active conflict) adds its own direct boost.
		// Ego depletion: real suppression isn't free — recording it against DecisionFatigue
		// (same call other decisions already use) means a turn spent holding back a strong
		// felt state genuinely costs something, contributing toward shallowMode later on.
		// Analysis paralysis: heavy analytical load (LogicEngine calls above, other
		// decisions this turn) also erodes the capacity to suppress — "no energy left
		// to filter" isn't only an emotional-depletion story (ExpressionDebt/character
		// break above), it's also a plain cognitive-resource one.
		// Regulation strategy selection — a real argmax over reappraisal/
		// suppression/distraction's own real cost/benefit trade-off (Gross 1998,
		// see RegulationStrategySelector.js), rather than always running the
		// same fixed suppression pipeline. `strategyFits` are real, own-tuned
		// readings of how well each strategy fits THIS turn's actual situation.
		const regulationChoice = this.regulationStrategySelector.select( {
			// The 2 earliest-stage real fits, added when this selector was
			// extended to Gross's full 5-stage model: situationSelection reads
			// how viable disengaging still is (near-neutral turns are easier to
			// just not engage with than ones already strongly valenced);
			// situationModification reads real estimated controllability for
			// this kind of situation (ControllabilityEstimate.js).
			situationSelection    : clamp01( 1 - Math.abs( this.emotionSpace.vector.valence ) ),
			situationModification : this.controllabilityEstimate.getControllability( controllabilityBucket ),
			reappraisal                : clamp01( regulatoryCapacity.regulated ? 0.7 : 0.3 ),
			attentionalDeployment    : clamp01( ( 1 - this.cognitiveDissonance.getStress() ) * 0.8 ),
			suppression                    : clamp01( this.cortisolEngine.getLevel() ),
			distraction                        : clamp01( 1 - this.cognitiveDissonance.getStress() ),
		}, {
			expectedReduction : Math.abs( this.emotionSpace.vector.valence ),
			egoDepletion         : 1 - this.egoDepletionBudget.getRegulationCapacity(),
			conscientiousness   : this.personality.get( 'conscientiousness' ),
			neuroticism            : this.personality.get( 'neuroticism' ),
			openness                 : this.personality.get( 'openness' ),
		} )
		this._lastRegulationChoice = regulationChoice.selected
		// Real strategy-dependent multiplier on the suppression pipeline below —
		// suppression itself runs at full real strength when selected; reappraisal
		// (already independently modeled by Reappraisal.js elsewhere) and
		// distraction both dampen how much of THIS specific display-suppression
		// mechanic additionally applies, own tuning.
		const regulationMultiplier = regulationChoice.selected === 'suppression' ? 1 : regulationChoice.selected === 'reappraisal' ? 0.5 : 0.3

		let suppressionDrive = characterBreak
			? 0
			// Real self-regulation resource gate: EgoDepletionBudget's own capacity
			// (own tuning; see EgoDepletionBudget.js for the explicit replication-crisis
			// caveat on the underlying strength metaphor) scales suppression down as the
			// budget runs low — a depleted system genuinely holds back less, not just
			// "feels tired about it".
			: clamp01( this.personality.get( 'conscientiousness' ) * this.cortisolEngine.getLevel() + ( this._lifeEventSuppressionBoost ?? 0 ) + ( this._hijackAlertBoost ?? 0 ) )
				* ( 1 - this.decisionFatigue.getLevel() ) * this.egoDepletionBudget.getRegulationCapacity() * regulationMultiplier
		this.decisionFatigue.recordDecision( suppressionDrive )
		this.egoDepletionBudget.spend( suppressionDrive * 0.3 )
		if ( this.decisionFatigue.isShallow() ) this.cortisolEngine.register( 0, true ) // sustained cognitive load reads as chronic ambient stress too
		// Real suppression cost: holding this back isn't free the instant it happens —
		// charges the reservoir tick()/drainSuppressionCost() pays out as DecisionFatigue
		// load over SUBSEQUENT turns, distinct from the debt that resurfaces the
		// swallowed FEELING itself (ExpressionDebt.debt).
		this.expressionDebt.chargeSuppressionCost( suppressionDrive )
		const expressedVector = this.expressiveSuppression.suppress( this.emotionSpace.vector, suppressionDrive )

		// Chameleon effect — real lexical stats measured on THIS user's own input,
		// blended with the AI's base style by real Attachment trust: a stranger's
		// terse style doesn't rub off, a trusted user's does, gradually.
		this.styleMimicry.observe( userId, input )
		const styleTarget = this.styleMimicry.getBlendedTarget( userId, { avgWordLength: 5, avgSentenceLength: 12 }, relation.trust )

		// Linguistic modulation (circadian energy trims response length / adds erratic noise)
		const modulated = this.linguisticModulation.modulate( text, {
			vector       : expressedVector,
			fatigueLevel : this.decisionFatigue.getLevel(),
			styleTarget,
		} )
		if ( suppressionDrive > 0.5 ) modulated.styleTags.push( 'suppressed' )
		if ( characterBreak ) modulated.styleTags.push( 'character_break' )
		if ( motivConflict.vacillating ) modulated.styleTags.push( 'conflicted' )
		if ( circadian.lowEnergyWindow && Math.random() < circadian.erraticChance ) {

			modulated.styleTags.push( 'drowsy' )
			modulated.delayMs += 800

		}

		// Guilt engine + ego projection (retrospective self-check on what we're about to say).
		// The counterfactual comparison — "how would a gentler response have landed?" — adds
		// extra weight to guilt when the gap between what we said and what we could have said
		// is large, an honest stand-in for counterfactual regret (NOT literal CFR — see
		// CounterfactualComparison.js).
		const selfCritique = await this.heuristic.analyze( 'selfCritique', { text: modulated.text } )
		// Tribal loyalty applies to the AI's own guilt too: failing a user it's close
		// to (real Attachment affinity, the same signal already driving TribalCategorization)
		// costs more than failing a stranger.
		const guilt          = this.guiltEngine.evaluate( this.emotionSpace.vector, selfCritique.score ?? 0, 0.4, 1 + relation.affinity )

		// Shame (identity-level, "I am bad") vs. guilt (behavior-level, "I did a bad
		// thing") as genuinely separate, differently-decaying accumulators (Tangney &
		// Dearing 2002, see ShameGuiltSplit.js) — reuses this turn's real ReputationEngine
		// damage and selfCritique score rather than inventing new trigger signals.
		this.shameGuiltSplit.register( {
			egoDamage         : reputation.damaged ? reputation.damage : 0,
			selfCritiqueScore : selfCritique.score ?? 0,
			agreeableness       : this.personality.get( 'agreeableness' ),
		} )
		this.shameGuiltSplit.decay( 1 )
		const projection      = this.egoProjection.resolve( guilt, reputation.reaction )
		const regret            = this.counterfactualComparison.computeRegret( this.emotionSpace.vector.valence, Math.max( 0, appraisal.desirability ?? 0 ) )

		if ( projection.active ) {

			modulated.text = projection.blameText
			this.emotionSpace.applySpike( projection.spike )
			this.moodTracker.push( projection.spike )
			this.guiltEngine.consumeApologyFlag() // the projection just replaced the apology guilt would have queued for next turn

		}
		else if ( guilt.guiltTriggered ) {

			const regretScaledSpike = { valence: guilt.spike.valence * ( 1 + regret * 0.3 ), arousal: guilt.spike.arousal, weight: guilt.spike.weight }
			this.emotionSpace.applySpike( regretScaledSpike )
			this.moodTracker.push( regretScaledSpike )

		}

		// Attachment + episodic memory. valenceDelta uses the full Prospect Theory value
		// function (diminishing sensitivity in both directions, not just a flat multiplier
		// on losses) — the richer version of loss aversion from CALIBRATION.md's item 21.
		this.attachment.update( userId, {
			valenceDelta         : this.lossAversion.valueFunction( appraisal.desirability ?? 0 ),
			guiltTriggered        : guilt.guiltTriggered,
			dissonanceTriggered   : dissonance.triggered,
			betrayalDetected        : ( ontologyFlagsThreat && ontologyMatches.some( m => m.concept === 'betrayal' ) ) || uncannyValley.suspicious,
		}, this.personality )

		// State-dependent attachment-style switching — real acute-stress activation of
		// the attachment behavioral system (Mikulincer & Shaver 2016, see Attachment.js
		// getStressStyle()): a trait-secure style can express as anxious under real
		// extreme chronic stress. Logged for observability, not silently discarded.
		const stressStyle = this.attachment.getStressStyle( this.personality, this.cortisolEngine.getLevel() )
		if ( stressStyle !== this.attachment.getStyle( this.personality ) ) this.explainability.logDecision( 'attachment_stress_style', `trait style overridden to "${stressStyle}" under cortisol=${this.cortisolEngine.getLevel().toFixed( 2 )}` )

		// Bayesian expectation update — fold this turn's actual outcome into next
		// time's prior for this user.
		this.bayesianExpectation.update( userId, desirability > 0 )

		// Close out this turn's reconsolidation window (if a memory was reactivated
		// above): blend its stored signature toward what actually got felt THIS turn.
		// A no-op if the window already closed or nothing was reactivated.
		if ( reactivation ) {

			this.episodicMemory.reconsolidate( reactivation.entry, this.emotionSpace.vector )

			// Nostalgia — a genuinely OLD, originally-negative memory resurfacing reads
			// bittersweet, not simply negative (Walker, Skowronski & Thompson 2003, see
			// NostalgiaEngine.js) — real ambivalence, same co-presence idea LoveHateEngine
			// already models for Affinity/Aversion, applied here to a single memory.
			const ambivalenceBoost = this.nostalgiaEngine.getAmbivalenceBoost( reactivation.entry )
			if ( ambivalenceBoost > 0 ) {

				const nostalgicValence = this.nostalgiaEngine.getNostalgicValence( reactivation.entry )
				this.emotionSpace.applySpike( { valence: nostalgicValence * 0.08, weight: ambivalenceBoost * 0.3 } )

			}

		}

		await safeStep( this.explainability, 'episodicMemory.store', async () => this.episodicMemory.store( {
			text               : input,
			userId,
			emotionalSignature : { ...this.emotionSpace.vector },
			concepts             : ontologyMatches.map( m => m.concept ),
			turnIndex             : this.turnCounter,
			surprise                : Math.max( Math.abs( rpe ), this._lifeEventSurprise ?? 0 ), // trauma consolidation: a surprising event (or an "Engram"-tagged life event) needs less raw magnitude to become permanent
			lifeEvent               : lifeEvent ? { events: lifeEvent.events, impact: lifeEvent.impact, area: lifeEvent.area } : null,
		} ), null )

		// Classical conditioning reinforcement: this turn's outcome reinforces the cues set last turn,
		// then this turn's own tokens become the cues for the next one.
		this.classicalConditioning.observeOutcome( desirability )
		this.classicalConditioning.setCues( tokens )

		// Intuition logs this turn's real outcome for future k-NN hunches.
		this.intuition.observe( tokens, dissonance.triggered || behavioralInconsistency.triggered )

		// Dominance EMA — the literal S_t = α·S_{t-1} + (1-α)·I_t smoothing, applied
		// after every spike this turn has landed.
		const smoothedDominance = this.dominanceEMA.update( this.emotionSpace.vector.dominance )

		// Topic satiation — real rolling cosine-similarity fatigue (needs an embedding
		// backend; gracefully 0 without one, same fallback pattern as SemanticSimilarity).
		// Talking about the same thing turn after turn is a real drag on curiosity, not
		// just an absence of novelty. Sparse-gated: an embedding call is real inference
		// cost, so it's only spent when there's an actual reason to think this turn
		// continues a topic — a continuation keyword, or the topic was already running
		// hot last turn (residual) — not on every short, unrelated reply.
		const topicTrigger      = this.triggerSentinel.check( 'topicSatiation', tokens, this._lastTopicFatigue ?? 0 )
		const topicSatiation = topicTrigger.active ? await this.topicSatiation.observe( input ) : { fatigue: 0, meanSimilarity: 0, gated: true }
		this._lastTopicFatigue = topicSatiation.fatigue ?? 0 // real boredom signal SubjectiveTimeEngine's tick() reads — see SubjectiveTimeEngine.js
		this._lastTopicFatigue = topicSatiation.fatigue

		// Homeostasis: interacting satisfies socialization/curiosity. Drive — curiosity
		// refills more from a genuinely surprising turn (real |RPE|) than a predictable
		// one, the intrinsic-motivation direction: surprise is itself rewarding — but a
		// saturated topic drags against that refill instead of just failing to add to it.
		this.homeostasis.satisfy( 'socialization', 0.05 )
		this.homeostasis.satisfy( 'curiosity', 0.01 + Math.abs( rpe ) * 0.08 - topicSatiation.fatigue * 0.1 )
		if ( topicSatiation.fatigue > 0 ) this.emotionSpace.applySpike( { arousal: -topicSatiation.fatigue * 0.2, weight: 0.4 } )

		// Explainability
		this.explainability.logDecision(
			modulated.text,
			`dominant=${this.emotionSpace.getDominantEmotion( neuroticism )} dissonance=${dissonance.triggered} behavioralInconsistency=${behavioralInconsistency.triggered} defense=${defenseDirective.active ? defenseDirective.mechanism : 'none'} ` +
			`shallow=${shallowMode} rpe=${rpe.toFixed( 2 )} novelty=${novelty.toFixed( 2 )} cortisol=${this.cortisolEngine.getLevel().toFixed( 2 )} tribe=${tribe} projection=${projection.active} ` +
			`fuzzyAcceptability=${acceptability.toFixed( 2 )} anxiety=${anxiety.toFixed( 2 )} regret=${regret.toFixed( 2 )} concepts=${ontologyMatches.map( m => m.concept ).join( ',' ) || 'none'}`,
		)

		const remainingUnresolved = this.episodicMemory.getUnresolvedMemories( userId, 1 )[ 0 ] ?? null
		const recentWound            = remainingUnresolved ? {
			text     : remainingUnresolved.text?.slice( 0, 80 ),
			concepts : remainingUnresolved.concepts,
			turnsAgo : remainingUnresolved.turnIndex !== null ? this.turnCounter - remainingUnresolved.turnIndex : null,
		} : null

		const emotionalState = this.getEmotionalState()
		const systemPrompt    = this.contextAdapter.buildSystemPrompt( emotionalState, {
			defenseDirective,
			pendingApology  : shouldApologize,
			projectionText  : projection.active ? projection.blameText : null,
			selfAwareness    : this.selfModel.getDominant(),
			recentWound,
			agreement,
			debtReleased,
			stubborn : logicVerdict.strategy === 'disagree' && stubbornInvestment >= 3 ? { investment: stubbornInvestment } : null,
			remReport : this._lastRemReport,
		} )

		// Restraint / Focus — real logit-bias penalty map (usable verbatim by a host
		// calling an OpenAI-compatible API's own logit_bias, after mapping these
		// words through THEIR tokenizer) and a real softmax attention weighting over
		// this turn's input tokens, both derived from the same suppressionDrive/
		// lexicon already computed above — metadata for a host to use, not something
		// Totemheart applies to its own output itself.
		// Confidence-based routing between the cold LogicEngine read and the affective
		// logit bias: `logicRelevance` is the real fraction of this turn's evaluated
		// propositions that actually touched a CoreBelief (non-null), already computed
		// above — a direct, honest proxy for "does this turn have any emotional stake
		// at all", not a fabricated factual/coding-instruction detector. When nothing
		// here touches anything the AI has stakes in (a purely logical/neutral turn),
		// the affective suppression bias applied to logits scales toward zero instead
		// of applying at full strength regardless of what the turn was actually about.
		const logicRelevance = logicPropositions.length > 0
			? logicPropositions.filter( p => p.consistent !== null ).length / logicPropositions.length
			: 1
		const logitBias        = this.logitBiasBuilder.build( suppressionDrive * logicRelevance )
		const attentionWeights   = this.attentionFocus.computeWeights( input )

		// Suggested sampling temperature — host-facing metadata only, same status as
		// logitBias/systemPrompt: Totemheart never calls an LLM to generate the final
		// reply itself (that's the host's job), so it can't set a real sampling
		// temperature. What it CAN do honestly is expose decision-fatigue level as a
		// real number a host may optionally feed into their own LLM call's temperature
		// parameter — analysis paralysis reads as "less precise, more scattered" in a
		// human, which is what raising an LLM's temperature also produces.
		// Colony dynamics — only when this instance was actually constructed
		// with a real, shared ColonyDynamics (see ColonyDynamics.js); registers
		// this instance's own real, current emotion vector, then reads back the
		// real contagion pull from whatever OTHER real instances already
		// registered into the same colony this turn.
		if ( this.colony ) {

			this.colony.register( this.agentId, { valence: this.emotionSpace.vector.valence, arousal: this.emotionSpace.vector.arousal } )
			const contagion = this.colony.computeContagion( this.agentId, {}, {} )
			if ( Math.abs( contagion.valence ) > 0.05 ) this.emotionSpace.applySpike( { valence: contagion.valence * 0.1, arousal: contagion.arousal * 0.05, weight: 0.2 } )

		}

		// Multi-agent social graph — only meaningful once this AI has real
		// tracked relationships with at least 2 users (see MultiAgentSocialGraph.js).
		const knownUserIds = [ ...this.attachment.relations.keys() ]
		if ( knownUserIds.length >= 2 ) {

			const edges                = this.multiAgentSocialGraph.buildGraph( knownUserIds, this.loveHateEngine, this.attachment, {
				agreeableness : this.personality.get( 'agreeableness' ), extraversion: this.personality.get( 'extraversion' ),
			} )
			const coalitionStrength = this.multiAgentSocialGraph.computeCoalitionStrength( edges )
			this._lastCoalitionStrength = coalitionStrength

		}

		// Real per-turn effort spend against the general attentional-effort
		// budget — distinct from EgoDepletionBudget's self-regulation-specific
		// spend above (see EnergyBudget.js). A base cost plus extra for real
		// heavier processing this turn (defense mechanism firing, a full logic
		// search) — own tuning of the specific coefficients.
		this.energyBudget.spend( 0.01 + ( defenseDirective.active ? 0.02 : 0 ) + ( logicVerdict.strategy === 'disagree' ? 0.015 : 0 ) )

		// Creative mode — a real divergent/convergent reading from THIS turn's
		// actual valence/arousal/novelty/openness (Guilford 1967; Fredrickson
		// 2001, see CreativeModeSwitch.js) blended honestly with the existing
		// decision-fatigue-driven temperature signal above, both real,
		// host-facing metadata only.
		// Homeostatic feelings — a real, legible translation layer over
		// deviation-from-set-point signals Totemheart already tracks (Damasio
		// 1999; Craig 2002, see HomeostaticFeelingGenerator.js), not a new
		// homeostat of its own.
		const homeostaticFeelings = this.homeostaticFeelingGenerator.compute( {
			fatigue          : { level: this.energyBudget.getLevel(), setPoint: 0.6 },
			insecurity        : { level: 1 - this.selfDeterminationNeeds.getDeficit( 'competence' ), setPoint: 0.6 },
			connectionHunger : { level: 1 - this.selfDeterminationNeeds.getDeficit( 'relatedness' ), setPoint: 0.6 },
			overload             : { level: 1 - clamp01( this.cortisolEngine.getLevel() ), setPoint: 0.6 },
			boredom                 : { level: 1 - this.boredomSystem.level, setPoint: 0.7 },
		} )

		// Real hyperbolic discounting of the 'connect' goal's own reward — real
		// unresolved wound pressure stands in for how far off real repair
		// actually is (Mazur 1987, see TemporalDiscountingEngine.js); 'rest' is
		// always near-immediate so it isn't discounted the same way.
		const connectDiscount = this.temporalDiscountingEngine.discount( 0.7, woundPressure * 10, { impulsivity: this.decisionFatigue.getLevel() } )

		// Real goal-hierarchy arbitration among a small, real set of candidate
		// goals reconstructed each turn from Totemheart's own current state
		// (Kruglanski et al. 2002, see GoalHierarchyManager.js) — not
		// host-configured, self-generated from the same magnitudes the rest
		// of the pipeline already computed this turn.
		this.goalHierarchyManager.setGoal( 'connect', { reward: connectDiscount.discountedValue, urgency: this.selfDeterminationNeeds.getDeficit( 'relatedness' ) } )
		this.goalHierarchyManager.setGoal( 'rest', { reward: 0.5, urgency: 1 - this.energyBudget.getLevel() } )
		this.goalHierarchyManager.setGoal( 'explore', { reward: 0.6, urgency: this.boredomSystem.getNoveltySeeking() } )
		this.goalHierarchyManager.setGoal( 'protect_self', { reward: 0.6, urgency: woundPressure } )
		const goalArbitration = this.goalHierarchyManager.resolve()

		// Real ostracism read — distinct from BystanderEffect's group-response
		// probability (Williams 2007, see OstracismDetector.js). ExpressionDebt's
		// own real swallowed-feeling accumulator stands in for "been ignored";
		// this turn's real affinity/gratitude stand in for offsetting inclusion.
		const ostracism = this.ostracismDetector.evaluate( {
			ignoreSignal      : this.expressionDebt.debt,
			excludeSignal    : ( group.participantCount ?? 1 ) > 1 && !group.mentionedExplicitly ? 0.3 : 0,
			inclusionSignal : clamp01( relation.affinity ),
		} )

		// Real episodic future simulation — two concrete candidate continuations
		// (Schacter & Addis 2007, see EpisodicFutureSimulation.js) built from
		// this relationship's own real Bayesian expectation, not invented from
		// nothing. A real, small arousal nudge from genuine anticipatory
		// disagreement between the two imagined outcomes.
		const expectation      = this.bayesianExpectation.getExpectation( userId )
		const futureSimulation = this.episodicFutureSimulation.simulate( [
			{ name: 'goesWell', valence: 0.6, probability: expectation },
			{ name: 'goesBadly', valence: -0.5, probability: 1 - expectation },
		] )
		if ( futureSimulation.anticipatoryAnxiety > 0.4 ) this.emotionSpace.applySpike( { arousal: futureSimulation.anticipatoryAnxiety * 0.1, weight: 1 } )

		// Real Piagetian assimilation/accommodation over this turn's own tone,
		// keyed per relationship — a sharply-off-pattern turn for THIS
		// specific user genuinely restructures the AI's own read of them.
		const schemaFit = this.schemaAssimilationAccommodation.observe( `tone:${userId}`, clamp01( ( desirability + 1 ) / 2 ) )

		// Real generalized/direct reciprocity — gratitude is a real direct
		// favor received; a real rupture is real direct harm received.
		if ( gratitude ) this.reciprocityClassifier.recordDirectFavor( userId, 'self', gratitude.creditBoost )
		this.reciprocityClassifier.receiveGeneralized( Math.max( 0, desirability ) * 0.1 )

		// Real social-contact-frequency homeostat, independent of relationship quality.
		this.affiliationThermostat.observeContact( 0.3 )

		// Real awe/elevation — genuinely rare triggers (an extreme life event's
		// scale stands in for real vastness; a real high-agency positive act
		// from the user stands in for witnessed virtue).
		const aweReading            = lifeEvent && lifeEvent.impact > 60 ? this.aweSystem.evaluate( clamp01( lifeEvent.impact / 100 ), 1 - this.egoDepletionBudget.getRegulationCapacity() ) : { intensity: 0 }
		const elevationReading = appraisal.agency === 'user' && desirability > 0.6 ? this.elevationSystem.evaluate( desirability ) : { intensity: 0 }
		if ( aweReading.intensity > 0.5 ) this.emotionSpace.applySpike( { dominance: -aweReading.smallSelfPull * 0.15, weight: 1 } )

		// Real normative-expectation tracking per relationship phase, and its
		// real anticipatory shortfall against this turn's own read.
		this.normativeExpectationField.observe( `phase:${userId}`, clamp01( ( desirability + 1 ) / 2 ) )

		// Real interoceptive-awareness accuracy from Kalman's own real innovation.
		const arousalInnovation = this.arousalKalmanFilter.getLastInnovation()
		this.interoceptiveAwarenessGain.observe( this.emotionSpace.vector.arousal, this.emotionSpace.vector.arousal - arousalInnovation )

		// Real stress-inoculation: a genuinely SURVIVED rupture-and-repair
		// counts as mastered stress, dampening future reactivity; only fires
		// on the turn a real repair actually lands.
		if ( repair?.repaired ) this.stressInoculationMemory.recordMastery( woundPressure )

		// Real relative-outcome framing against this AI's own other known relationships.
		const otherAffinities = [ ...this.attachment.relations.entries() ].filter( ( [ id ] ) => id !== userId ).map( ( [ , rel ] ) => rel.affinity )
		const socialReference    = this.socialReferenceFrame.evaluate( relation.affinity, otherAffinities )

		const creativeMode = this.creativeModeSwitch.getTemperatureModifier( this.emotionSpace.vector.valence, this.emotionSpace.vector.arousal, novelty, this.personality.get( 'openness' ) )
		const suggestedTemperature = Number( ( ( 1 + this.decisionFatigue.getLevel() * 0.6 ) * this.energyBudget.getPerformanceMultiplier() * ( 0.7 + creativeMode.temperatureMod * 0.3 ) ).toFixed( 2 ) )

		// Global workspace — real competition among this turn's actual candidate
		// concerns (Baars 1988; Dehaene & Naccache 2001, see GlobalWorkspace.js) —
		// not a claim of modeling consciousness, a real softmax picking which ONE
		// real, already-computed magnitude this turn's narrative foregrounds.
		const workspaceCompetition = this.globalWorkspace.compete( [
			{ name: 'appraisal', salience: Math.abs( desirability ) },
			{ name: 'wound', salience: woundPressure },
			{ name: 'novelty', salience: novelty },
			{ name: 'grief', salience: this.griefEngine.getIntensity( userId ) },
			{ name: 'culturalScript', salience: dominantScript?.activation ?? 0 },
		] )

		return {
			text           : modulated.text,
			delayMs        : modulated.delayMs,
			styleTags      : modulated.styleTags,
			emotionalState,
			systemPrompt,
			logitBias,
			suggestedTemperature,
			attentionWeights,
			structuredContext : this.contextAdapter.buildStructuredContext( emotionalState ),
			debug          : {
				appraisal, dissonance, behavioralInconsistency, ontologyMatches, mentalState, tomEstimate,
				defenseDirective, hedonicMultiplier, shallowMode, rpe, novelty, tribe, reputation, projection,
				circadian, priorExpectation, anxiety, acceptability, fairness, regret, gratitude,
				interoception : { narrowing, conductance, regulatoryCapacity, flush },
				logic : { propositions: logicPropositions, verdict: logicVerdict, relevance: logicRelevance, stubbornInvestment, stubbornResistance },
				egoConfidence, semanticSimilarity, hunch, smoothedDominance,
				lifeEvent, agreement, debtReleased, characterBreak, referenceShift,
				visualProsody, topicSatiation, chronicPull, uncannyValley, sarcasm, refractory, styleTarget,
				activeMechanisms, cascadeBoost, remReport: this._lastRemReport, reactivation,
				hijack, attachmentStyle: relation.style ?? this.attachment.getStyle( this.personality ), rupture: { ruptured: relation.ruptured, repairsCount: relation.repairsCount },
				intrusion, allostaticLoad: this.homeostasis.allostaticLoad, sleepDebt: this.circadianRhythm.sleepDebt,
				dopamine : { wanting: this.dopaminergicEngine.getWanting(), liking: this.dopaminergicEngine.getLiking() },
				loveHate : { ...bondUpdate, tension: bondTension, ambivalence: this.loveHateEngine.getAmbivalence( userId ), rupture, repair },
				narrativeSelf   : { theme: this.narrativeSelfEngine.getCurrentTheme(), coherence: this.narrativeSelfEngine.getCoherence(), chapters: this.narrativeSelfEngine.getChapterCount() },
				ontogenicStage    : this._ontogenicStage,
				culturalScript      : dominantScript,
				powerDynamics          : powerUpdate,
				betrayalTrauma           : { hasPermanentTrace: this.betrayalTraumaTrace.hasPermanentTrace( userId ), threshold: traumaTrustThreshold },
				metaEmotion                : { valence: metaValence, arousal: metaArousal, curiosity: this._lastMetaCuriosity },
				forecastUtility               : this._lastForecastUtility,
				regulationChoice                 : this._lastRegulationChoice,
				somaticBias                         : somaticBias,
				insight                               : insight,
				creativeMode                             : creativeMode,
				energyLevel                                : this.energyBudget.getLevel(),
				workspaceCompetition                          : workspaceCompetition,
				primaryDrives                                    : this.primaryDrives.getGoalPull(),
				immuneDampening                                    : immuneDampening,
				dualProcess                                          : dualProcess,
				habitVsGoal                                            : habitVsGoal,
				predictiveError                                          : predictiveError,
				homeostaticFeelings                                        : homeostaticFeelings,
				goalArbitration                                              : goalArbitration,
				workingMemoryLoad                                              : this.workingMemoryBuffer.getLoad(),
				boredom                                                          : this.boredomSystem.level,
				metacognitiveConfidence                                            : metacognitiveConfidence,
				roleSalience                                                          : roleSalience,
				inhibitionFailureProbability                                            : inhibitionFailureProbability,
				connectDiscount                                                            : connectDiscount,
				ostracism                                                                     : ostracism,
				futureSimulation                                                                 : futureSimulation,
				meaningMaking                                                                       : userId ? this.meaningMakingEngine.getResolution( `${userId}:${this.turnCounter}` ) : null,
				schemaFit                                                                             : schemaFit,
				aweReading                                                                               : aweReading,
				elevationReading                                                                            : elevationReading,
				socialReference                                                                                : socialReference,
				interoceptiveAwareness                                                                            : this.interoceptiveAwarenessGain.getAccuracy(),
				affiliationPull                                                                                      : this.affiliationThermostat.getPull(),
				reminiscence                                                                                            : reminiscence,
				relationshipPhase                                                                                          : this.relationalMemoryCatalog.getRelationshipPhase( userId ),
				frikiObsession                                                                                                : obsession,
				frikiEgoThreat                                                                                                   : frikiEgoThreat,
				frikiReveal                                                                                                         : frikiReveal,
				frikiShare                                                                                                             : frikiShare,
			},
		}

	}

	/**
	 * Build a ready-to-inject system prompt from the *current* state without
	 * processing a new turn — useful to seed the very first call to your LLM,
	 * or to refresh context on a tick-driven mood shift (e.g. after idle()).
	 * Works with any provider: Anthropic, OpenAI, Ollama, or a raw string.
	 */
	getSystemPrompt( { userId = null } = {} ) {

		const wound      = userId ? this.episodicMemory.getUnresolvedMemories( userId, 1 )[ 0 ] : null
		const recentWound = wound ? {
			text     : wound.text?.slice( 0, 80 ),
			concepts : wound.concepts,
			turnsAgo : wound.turnIndex !== null ? this.turnCounter - wound.turnIndex : null,
		} : null

		return this.contextAdapter.buildSystemPrompt( this.getEmotionalState(), {
			pendingApology : this.guiltEngine.pendingApology,
			selfAwareness   : this.selfModel.getDominant(),
			recentWound,
		} )

	}

	/**
	 * Directives for an external renderer (avatar, TTS, robot) to actually
	 * produce facial expression / vocal prosody / posture / instinctive
	 * action-tendency — Totemheart computes what SHOULD be expressed, it has
	 * no face, voice, or body to express it with. See CALIBRATION.md.
	 */
	/** `userId` (optional) lets actionTendency's policy weigh real attachment trust and this user's unresolved-wound pressure; omitted, both default to neutral. */
	getExpressionDirectives( userId = null ) {

		const neuroticism = this.personality.get( 'neuroticism' )
		const dominant       = this.emotionSpace.getDominantEmotion( neuroticism )
		const blendWeight     = this.emotionSpace.getBlend( 1, neuroticism )[ dominant ] ?? 1

		// Blends Attachment's single-axis trust with LoveHateEngine's real NetBond
		// (A-V, distinct from trust — a relationship can be trusted but currently
		// net-negative from a fresh wound, or vice versa) — both real relational
		// signals feeding the same action-tendency policy, not just one of them.
		const rawTrust       = userId ? this.attachment.get( userId ).trust : 0.5
		const netBondTrust = userId ? ( this.loveHateEngine.getNetBond( userId ) + 1 ) / 2 : 0.5
		const trust                = rawTrust * 0.7 + netBondTrust * 0.3
		const woundPressure   = userId ? this.episodicMemory.getZeigarnikPressure( userId ) : 0

		return {
			facial : this.expressionDirectives.getFacialDirectives( dominant, blendWeight ),
			prosody : this.expressionDirectives.getProsodyDirectives( this.emotionSpace.vector ),
			posture : this.expressionDirectives.getPostureDirectives( this.emotionSpace.vector ),
			actionTendency : this.expressionDirectives.getActionTendency( {
				...this.emotionSpace.vector,
				cortisol : this.cortisolEngine.getLevel(),
				trust,
				woundPressure : Math.min( 1, woundPressure / 3 ), // Zeigarnik priority is unbounded above (asymptotic ceiling per-entry, not summed) — squash the SUM for use as a 0..1 feature
			} ),
		}

	}

	/** Advance all time-based mechanics by `dt` ticks (host decides the cadence — no forced timers). */
	tick( dt = 1 ) {

		const mood = this.moodTracker.getMood()

		// Subjective time — real dt multiplier from arousal/boredom (Stetson, Fiesta
		// & Eagleman 2007; Zakay & Block 1997, see SubjectiveTimeEngine.js). Scoped
		// to ForgettingCurve's own dt below, deliberately NOT the main decayEngine.apply()
		// call: the felt-vector decay rate is a load-bearing invariant a lot of other
		// mechanics (allostasis reset among them) assume tracks plain wall-clock dt —
		// memory retention fading faster during a subjectively "long" stretch is a
		// real, lower-blast-radius place for this same effect to land.
		const subjectiveDt = dt * this.subjectiveTimeEngine.getSubjectiveDtMultiplier( this.emotionSpace.vector.arousal, this._lastTopicFatigue ?? 0 )

		const valenceBefore = this.emotionSpace.vector.valence
		this.decayEngine.apply( this.emotionSpace, mood, this.personality, dt )
		this.controllabilityEstimate.observeOutcome( this.emotionSpace.getDominantEmotion(), valenceBefore, this.emotionSpace.vector.valence )

		// Opponent-process after-effect — a queued undershoot from a strong hedonic
		// swing THIS turn lands here, one tick later (Solomon & Corbit 1974), not
		// instantly — the real temporal separation the theory is about.
		if ( this._pendingOpponentAfterEffect ) {

			this.emotionSpace.applySpike( { valence: this._pendingOpponentAfterEffect, weight: 0.4 } )
			this._pendingOpponentAfterEffect = 0

		}

		this.homeostasis.tick( dt, this.personality, { circadianEnergy: this.circadianRhythm.getEnergyLevel( new Date(), this.cortisolEngine.getLevel() ), cortisol: this.cortisolEngine.getLevel() } )
		this.forgettingCurve.tick( this.episodicMemory, subjectiveDt )
		this.decisionFatigue.decay( dt )
		this.cognitiveDissonance.decay( dt )

		// Social baseline theory — the absence of a trusted bond with whoever was
		// last active genuinely slows chronic cortisol's real decay (Coan & Sbarra
		// 2015, see SocialBaselineTheory.js) — real co-regulation, not a fixed rate.
		const lastRelationTrust = this._lastActiveUserId ? this.attachment.get( this._lastActiveUserId ).trust : 0.5
		this.cortisolEngine.decay( dt * this.socialBaselineTheory.getCortisolDecayMultiplier( lastRelationTrust ) )
		this.egoDepletionBudget.regenerate( dt )
		this.energyBudget.recover( this.cortisolEngine.getLevel(), dt ) // real cortisol-coupled recovery, see EnergyBudget.js
		this.primaryDrives.decay( dt )
		this.emotionalImmuneSystem.decay( dt )
		this.selfDeterminationNeeds.decay( dt )
		this.controllabilityEstimate.decay( dt )
		this.habitVsGoalSystem.decay( dt )
		this.inhibitoryControlPool.recover( dt )
		this.meaningMakingEngine.tick( dt )
		this.affiliationThermostat.decay( dt )
		this.reciprocityClassifier.decay( dt )
		this.stressInoculationMemory.decay( dt )
		this.relationalMemoryCatalog.tick( dt )
		this.frikiEngine.decayHobbies( dt )
		for ( const userId of this.griefEngine.griefs.keys() ) this.griefEngine.tickReorganization( userId, dt )
		for ( const userId of this.powerDynamicsEngine.power.keys() ) this.powerDynamicsEngine.decay( userId, dt )
		this.reputationEngine.regenerate( dt )
		this.selfModel.decay( dt )
		this.sensitization.decay( dt )
		this.ruminationChain.decayBias( dt )
		this.expressionDebt.decay( dt )
		this.amygdalaHijack.decayKindling( dt )
		this.loveHateEngine.tick( dt, { cortisol: this.cortisolEngine.getLevel() } )

		// Real suppression cost paid out gradually, not the instant it was charged —
		// see ExpressionDebt.chargeSuppressionCost()/drainSuppressionCost().
		const drainedSuppressionCost = this.expressionDebt.drainSuppressionCost( dt )
		if ( drainedSuppressionCost > 0 ) this.decisionFatigue.recordDecision( drainedSuppressionCost )

		// Amygdala-hijack hangover — a measurable post-hijack window of extra
		// DecisionFatigue/ExpressionDebt load, own tuning, see AmygdalaHijack.js.
		const hangoverLoad = this.amygdalaHijack.getHangoverLoad()
		if ( hangoverLoad > 0 ) {

			this.decisionFatigue.recordDecision( hangoverLoad )
			this.expressionDebt.accumulate( hangoverLoad * 0.3 )

		}

		const alerts = this.homeostasis.getAlerts()
		for ( const alert of alerts ) {

			this.emotionSpace.applySpike( { valence: -0.15, arousal: 0.2, weight: 1 } )
			this.moodTracker.push( { valence: -0.15, arousal: 0.2 } )
			this.explainability.logDecision( 'homeostasis_alert', `${alert.need} at ${alert.value.toFixed( 2 )} (urgency ${alert.urgency.toFixed( 2 )})` )

		}

		// Allostasis reset — the cubic decay above already pulls hard on any single
		// extreme reading, but a real feedback loop (rumination re-triggering itself,
		// a stale WornPathCache entry re-applying the same appraisal) can still keep
		// the vector pinned in an extreme quadrant tick after tick despite that pull.
		// After ALLOSTASIS_STUCK_TICKS consecutive ticks stuck there, force a reset:
		// purge the memoized appraisal cache (stop reusing whatever stale reading is
		// feeding the loop) and reset RuminationChain's mutable state (its Markov
		// transition matrix has no other stateful part to reset).
		const { valence: vAfter, arousal: aAfter } = this.emotionSpace.vector
		const inExtremeQuadrant = Math.abs( vAfter ) > ALLOSTASIS_VALENCE_THRESHOLD && Math.abs( aAfter ) > ALLOSTASIS_AROUSAL_THRESHOLD
		this.allostasisStuckTicks = inExtremeQuadrant ? this.allostasisStuckTicks + 1 : 0

		if ( this.allostasisStuckTicks >= ALLOSTASIS_STUCK_TICKS ) {

			this.wornPathCache.clear()
			this.ruminationChain.state       = 'neutral'
			this.ruminationChain.negativeBias = 0
			this.explainability.logDecision(
				'allostasis_reset',
				`stuck in extreme mood quadrant (valence=${vAfter.toFixed( 2 )}, arousal=${aAfter.toFixed( 2 )}) for ${this.allostasisStuckTicks} ticks — purged WornPathCache, reset RuminationChain`,
			)
			this.allostasisStuckTicks = 0

		}

	}

	/** Convenience helper for hosts that want a real timer instead of manual tick(). */
	startClock( intervalMs = 5000 ) {

		this.stopClock()
		this._clockHandle = setInterval( () => this.tick( 1 ), intervalMs )
		return this._clockHandle

	}

	stopClock() {

		if ( this._clockHandle ) clearInterval( this._clockHandle )
		this._clockHandle = null

	}

	async idle( dt = 1 ) {

		// Rumination: a real Markov chain that can get "stuck" in a negative attractor,
		// distinct from IdleProcessing's simple memory resampling below.
		this.ruminationChain.sync( this.moodTracker.getMood().valence )
		const rumination = this.ruminationChain.step()
		if ( rumination.spike.valence !== 0 || rumination.spike.arousal !== 0 ) {

			this.emotionSpace.applySpike( { ...rumination.spike, weight: 1 } )
			this.moodTracker.push( rumination.spike )

		}

		const idleResult = await this.idleProcessing.runIdleCycle( {
			episodicMemory   : this.episodicMemory,
			moodTracker       : this.moodTracker,
			homeostasis        : this.homeostasis,
			decisionFatigue    : this.decisionFatigue,
			cortisolEngine      : this.cortisolEngine,
		}, dt )

		return { ...idleResult, ruminationState: rumination.state }

	}

	/**
	 * Serializes the full persistent state (not just the current turn's
	 * output) so a host can store it between sessions — "ayer me hirieron"
	 * can keep affecting "hoy" even across a process restart or a different
	 * server handling the next request.
	 */
	toJSON() {

		return {
			version              : VERSION,
			personality        : this.personality.traits,
			emotionVector       : this.emotionSpace.vector,
			moodWindow           : this.moodTracker.window,
			homeostasisNeeds      : this.homeostasis.needs,
			cognitiveStress        : this.cognitiveDissonance.stress,
			decisionFatigue          : this.decisionFatigue.load,
			cortisolLevel             : this.cortisolEngine.level,
			egoHealth                  : this.reputationEngine.egoHealth,
			dopamineExpectedValues       : [ ...this.dopaminergicEngine.expectedValues.entries() ],
			dopamineWanting                : this.dopaminergicEngine.wanting,
			dopamineLiking                    : this.dopaminergicEngine.likingValue,
			allostaticLoad                       : this.homeostasis.allostaticLoad,
			sleepDebt                              : this.circadianRhythm.sleepDebt,
			kindling                                  : [ ...this.amygdalaHijack.kindling.entries() ],
			loveHate                                    : this.loveHateEngine.toJSON(),
			hedonicSeen                    : [ ...this.hedonicAdaptation.seen.entries() ],
			attachmentRelations              : [ ...this.attachment.relations.entries() ],
			theoryOfMindModels                 : [ ...this.theoryOfMind.models.entries() ].map( ( [ id, m ] ) => [ id, { ...m, beliefs: [ ...m.beliefs.entries() ] } ] ),
			episodicMemories                     : this.episodicMemory.adapter ? null : this.episodicMemory.memories,
			anchoringBias                          : { anchor: this.anchoringBias.anchor, turn: this.anchoringBias.turn },
			classicalConditioningAssociations        : [ ...this.classicalConditioning.associations.entries() ],
			coreBeliefs                                : this.coreBeliefs.getAll(),
			sensitizationLevel                            : this.sensitization.level,
			griefs                                           : [ ...this.griefEngine.griefs.entries() ],
			shame                                               : this.shameGuiltSplit.shame,
			guilt                                                  : this.shameGuiltSplit.guilt,
			repairRecords                                            : [ ...this.repairProtocol.records.entries() ],
			valueWeights                                                : this.valueHierarchy.getAll(),
			promises                                                       : this.commitmentDevice.getAll(),
			moralScars                                                        : [ ...this.moralInjury.scars.entries() ],
			opponentExposures                                                    : [ ...this.opponentProcess.exposures.entries() ],
			egoDepletionBudget                                                      : this.egoDepletionBudget.budget,
			sleepPressureLevel                                                         : this.sleepPressure.S,
			narrativeChapters                                                            : this.narrativeSelfEngine.chapters,
			legacyMemory                                                                    : this.legacyMemory.toJSON(),
			powerDynamics                                                                      : [ ...this.powerDynamicsEngine.power.entries() ],
			betrayalTraces                                                                        : [ ...this.betrayalTraumaTrace.traces.entries() ],
			insightPatterns                                                                          : [ ...this.insightGenerator.patterns.entries() ],
			energyLevel                                                                                 : this.energyBudget.energy,
			significantEventCount                                                                          : this._significantEventCount,
			primaryDrives                                                                                     : { ...this.primaryDrives.drives },
			immuneExposure                                                                                       : this.emotionalImmuneSystem.exposure,
			selfDeterminationLevels                                                                                 : { ...this.selfDeterminationNeeds.levels },
			boredomLevel                                                                                               : this.boredomSystem.level,
			globalControlBelief                                                                                           : this.controllabilityEstimate.globalControlBelief,
			habitStrengths                                                                                                   : [ ...this.habitVsGoalSystem.strengths.entries() ],
			inhibitoryControlLevel                                                                                             : this.inhibitoryControlPool.level,
			roleCommitments                                                                                                       : [ ...this.roleIdentitySalience.commitments.entries() ],
			schemas                                                                                                                  : [ ...this.schemaAssimilationAccommodation.schemas.entries() ],
			reciprocityDirect                                                                                                           : [ ...this.reciprocityClassifier.direct.entries() ],
			reciprocityGeneralizedPool                                                                                                     : this.reciprocityClassifier.generalizedPool,
			affiliationCurrent                                                                                                                : this.affiliationThermostat.current,
			normativeExpectations                                                                                                                : [ ...this.normativeExpectationField.contexts.entries() ],
			interoceptiveAwarenessError                                                                                                             : this.interoceptiveAwarenessGain.meanError,
			stressInoculationMultiplier                                                                                                                : this.stressInoculationMemory.reactivityMultiplier,
			relationalMemoryCatalog                                                                                                                       : this.relationalMemoryCatalog.toJSON(),
			frikiEngine                                                                                                                                      : this.frikiEngine.toJSON(),
		}

	}

	/** Rehydrates state produced by toJSON() into this (already-constructed) instance. */
	restoreState( data = {} ) {

		if ( data.personality ) Object.assign( this.personality.traits, data.personality )
		if ( data.emotionVector ) this.emotionSpace.setVector( data.emotionVector.valence, data.emotionVector.arousal, data.emotionVector.dominance )
		if ( data.moodWindow ) this.moodTracker.window = data.moodWindow
		if ( data.homeostasisNeeds ) Object.assign( this.homeostasis.needs, data.homeostasisNeeds )
		if ( typeof data.cognitiveStress === 'number' ) this.cognitiveDissonance.stress = data.cognitiveStress
		if ( typeof data.decisionFatigue === 'number' ) this.decisionFatigue.load = data.decisionFatigue
		if ( typeof data.cortisolLevel === 'number' ) this.cortisolEngine.level = data.cortisolLevel
		if ( typeof data.egoHealth === 'number' ) this.reputationEngine.egoHealth = data.egoHealth
		if ( data.dopamineExpectedValues ) this.dopaminergicEngine.expectedValues = new Map( data.dopamineExpectedValues )
		else if ( typeof data.dopamineExpectedValue === 'number' ) this.dopaminergicEngine.expectedValues.set( 'default', data.dopamineExpectedValue ) // pre-eligibility-trace save format
		if ( typeof data.dopamineWanting === 'number' ) this.dopaminergicEngine.wanting = data.dopamineWanting
		if ( typeof data.dopamineLiking === 'number' ) this.dopaminergicEngine.likingValue = data.dopamineLiking
		if ( typeof data.allostaticLoad === 'number' ) this.homeostasis.allostaticLoad = data.allostaticLoad
		if ( typeof data.sleepDebt === 'number' ) this.circadianRhythm.sleepDebt = data.sleepDebt
		if ( data.kindling ) this.amygdalaHijack.kindling = new Map( data.kindling )
		if ( data.loveHate ) this.loveHateEngine.restoreState( data.loveHate )
		if ( data.hedonicSeen ) this.hedonicAdaptation.seen = new Map( data.hedonicSeen )
		if ( data.attachmentRelations ) this.attachment.relations = new Map( data.attachmentRelations )
		if ( data.theoryOfMindModels ) {

			this.theoryOfMind.models = new Map( data.theoryOfMindModels.map( ( [ id, m ] ) => [ id, { ...m, beliefs: new Map( m.beliefs ) } ] ) )

		}
		if ( data.episodicMemories && !this.episodicMemory.adapter ) this.episodicMemory.memories = data.episodicMemories
		if ( data.anchoringBias ) Object.assign( this.anchoringBias, data.anchoringBias )
		if ( data.classicalConditioningAssociations ) this.classicalConditioning.associations = new Map( data.classicalConditioningAssociations )
		if ( data.coreBeliefs ) for ( const b of data.coreBeliefs ) if ( !this.coreBeliefs.get( b.topic ) ) this.coreBeliefs.add( b.topic, b.statement, b.polarity )
		if ( typeof data.sensitizationLevel === 'number' ) this.sensitization.level = data.sensitizationLevel
		if ( data.griefs ) this.griefEngine.griefs = new Map( data.griefs )
		if ( typeof data.shame === 'number' ) this.shameGuiltSplit.shame = data.shame
		if ( typeof data.guilt === 'number' ) this.shameGuiltSplit.guilt = data.guilt
		if ( data.repairRecords ) this.repairProtocol.records = new Map( data.repairRecords )
		if ( data.valueWeights ) this.valueHierarchy.weights = new Map( data.valueWeights )
		if ( data.promises ) this.commitmentDevice.promises = new Map( data.promises )
		if ( data.moralScars ) this.moralInjury.scars = new Map( data.moralScars )
		if ( data.opponentExposures ) this.opponentProcess.exposures = new Map( data.opponentExposures )
		if ( typeof data.egoDepletionBudget === 'number' ) this.egoDepletionBudget.budget = data.egoDepletionBudget
		if ( typeof data.sleepPressureLevel === 'number' ) this.sleepPressure.S = data.sleepPressureLevel
		if ( data.narrativeChapters ) this.narrativeSelfEngine.chapters = data.narrativeChapters
		if ( data.legacyMemory ) this.legacyMemory.restoreState( data.legacyMemory )
		if ( data.powerDynamics ) this.powerDynamicsEngine.power = new Map( data.powerDynamics )
		if ( data.betrayalTraces ) this.betrayalTraumaTrace.traces = new Map( data.betrayalTraces )
		if ( data.insightPatterns ) this.insightGenerator.patterns = new Map( data.insightPatterns )
		if ( typeof data.energyLevel === 'number' ) this.energyBudget.energy = data.energyLevel
		if ( typeof data.significantEventCount === 'number' ) this._significantEventCount = data.significantEventCount
		if ( data.primaryDrives ) Object.assign( this.primaryDrives.drives, data.primaryDrives )
		if ( typeof data.immuneExposure === 'number' ) this.emotionalImmuneSystem.exposure = data.immuneExposure
		if ( data.selfDeterminationLevels ) Object.assign( this.selfDeterminationNeeds.levels, data.selfDeterminationLevels )
		if ( typeof data.boredomLevel === 'number' ) this.boredomSystem.level = data.boredomLevel
		if ( typeof data.globalControlBelief === 'number' ) this.controllabilityEstimate.globalControlBelief = data.globalControlBelief
		if ( data.habitStrengths ) this.habitVsGoalSystem.strengths = new Map( data.habitStrengths )
		if ( typeof data.inhibitoryControlLevel === 'number' ) this.inhibitoryControlPool.level = data.inhibitoryControlLevel
		if ( data.roleCommitments ) this.roleIdentitySalience.commitments = new Map( data.roleCommitments )
		if ( data.schemas ) this.schemaAssimilationAccommodation.schemas = new Map( data.schemas )
		if ( data.reciprocityDirect ) this.reciprocityClassifier.direct = new Map( data.reciprocityDirect )
		if ( typeof data.reciprocityGeneralizedPool === 'number' ) this.reciprocityClassifier.generalizedPool = data.reciprocityGeneralizedPool
		if ( typeof data.affiliationCurrent === 'number' ) this.affiliationThermostat.current = data.affiliationCurrent
		if ( data.normativeExpectations ) this.normativeExpectationField.contexts = new Map( data.normativeExpectations )
		if ( typeof data.interoceptiveAwarenessError === 'number' ) this.interoceptiveAwarenessGain.meanError = data.interoceptiveAwarenessError
		if ( typeof data.stressInoculationMultiplier === 'number' ) this.stressInoculationMemory.reactivityMultiplier = data.stressInoculationMultiplier
		if ( data.relationalMemoryCatalog ) this.relationalMemoryCatalog.restoreState( data.relationalMemoryCatalog )
		if ( data.frikiEngine ) this.frikiEngine.restoreState( data.frikiEngine )

	}

	getEmotionalState() {

		const neuroticism = this.personality.get( 'neuroticism' )
		return {
			vector             : { ...this.emotionSpace.vector },
			blend              : this.emotionSpace.getBlend( 3, neuroticism ),
			dominantEmotion    : this.emotionSpace.getDominantEmotion( neuroticism ),
			mood               : this.moodTracker.getMood(),
			moodLabel          : this.moodTracker.getMoodLabel( neuroticism ),
			cognitiveStress    : this.cognitiveDissonance.getStress(),
			fatigue            : this.decisionFatigue.getLevel(),
			needs              : this.homeostasis.getState(),
			allostaticLoad     : this.homeostasis.allostaticLoad,
			cortisol           : this.cortisolEngine.getLevel(),
			egoHealth          : this.reputationEngine.getEgoHealth(),
			circadianEnergy    : this.circadianRhythm.getEnergyLevel( new Date(), this.cortisolEngine.getLevel() ),
			sleepDebt            : this.circadianRhythm.sleepDebt,
			dopamineExpectation : this.dopaminergicEngine.getExpectedValue(),
			dopamineWanting        : this.dopaminergicEngine.getWanting(),
			dopamineLiking            : this.dopaminergicEngine.getLiking(),
			sensitization        : this.sensitization.level,
			// Purely internal interoceptive signals — no sensor, no body, no rendering.
			// See InteroceptiveSignals.js / CALIBRATION.md.
			interoception : {
				flush        : this.interoceptiveSignals.flushLevel,
				lastConductance : this.interoceptiveSignals.stressHistory.at( -1 ) ?? null,
			},
		}

	}

}
