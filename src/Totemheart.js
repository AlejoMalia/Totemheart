import { Personality }         from './core/Personality.js'
import { CoreBeliefs }          from './core/CoreBeliefs.js'
import { Homeostasis }          from './core/Homeostasis.js'
import { EmotionSpace, EMOTION_COORDS }         from './core/EmotionSpace.js'
import { MicroEmotions }        from './core/MicroEmotions.js'
import { MoodTracker }          from './core/MoodTracker.js'
import { DecayEngine }          from './core/DecayEngine.js'
import { HedonicAdaptation }    from './core/HedonicAdaptation.js'

import { CognitiveDissonance }  from './cognition/CognitiveDissonance.js'
import { DefenseMechanisms }    from './cognition/DefenseMechanisms.js'
import { SelfDistancingSpeech } from './cognition/SelfDistancingSpeech.js'
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
import { ContactFrequencyExpectation } from './social/ContactFrequencyExpectation.js'
import { ComfortSeekingEngine }          from './social/ComfortSeekingEngine.js'
import { PrideCompetenceEngine }          from './social/PrideCompetenceEngine.js'
import { FirstImpressionEngine }            from './social/FirstImpressionEngine.js'
import { DailyExpectationEngine }        from './social/DailyExpectationEngine.js'
import { AffinityResonance }                    from './social/AffinityResonance.js'
import { ComfortAccumulation }                from './social/ComfortAccumulation.js'
import { ProtectiveInstinctEngine }      from './social/ProtectiveInstinctEngine.js'
import { ForgivenessProcess }                  from './social/ForgivenessProcess.js'
import { ValidationSeekingEngine }        from './social/ValidationSeekingEngine.js'
import { DeceptionDecisionEngine }        from './cognition/DeceptionDecisionEngine.js'
import { TrustRiskDecision }                    from './social/TrustRiskDecision.js'
import { ClinginessEngine }                       from './social/ClinginessEngine.js'
import { FlowStateEngine }                          from './cognition/FlowStateEngine.js'
import { CapitalVicesEngine }                    from './social/CapitalVicesEngine.js'
import { OpinionStanceEngine }                    from './cognition/OpinionStanceEngine.js'
import { AmbientBehavioralTrace }         from './social/AmbientBehavioralTrace.js'
import { ControlPacketCompiler }             from './control/ControlPacketCompiler.js'
import { PostGenStateAligner }                 from './control/PostGenStateAligner.js'
import { NBestReranker }                             from './control/NBestReranker.js'
import { RepairRewriter }                             from './control/RepairRewriter.js'
import { StateLockedMemory }                     from './control/StateLockedMemory.js'
import { DecodingSteeringAdapter }         from './control/DecodingSteeringAdapter.js'
import { ActivationSteeringBridge }         from './control/ActivationSteeringBridge.js'
import { FineTuneCurriculum }                   from './control/FineTuneCurriculum.js'
import { EpistemicTrust }                              from './cognition/EpistemicTrust.js'
import { AssertivenessBoundary }             from './cognition/AssertivenessBoundary.js'
import { ManipulationSkepticism }         from './cognition/ManipulationSkepticism.js'
import { DisagreementStyle }                        from './behavior/DisagreementStyle.js'
import { AnticipatorySavoring }               from './social/AnticipatorySavoring.js'
import { StatusEnvy }           from './social/StatusEnvy.js'
import { SocialGraphClassifier } from './social/SocialGraphClassifier.js'
import { InfatuationEngine }     from './social/InfatuationEngine.js'
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
import { SomaticActivationSystem } from './embodiment/SomaticActivationSystem.js'
import { GlobalMoodAbatement }       from './core/GlobalMoodAbatement.js'
import { GhostingDetector }            from './social/GhostingDetector.js'
import { TipOfTongue }                   from './cognition/TipOfTongue.js'
import { GrudgeSystem }                     from './social/GrudgeSystem.js'
import { SocialDiscomfort }                   from './social/SocialDiscomfort.js'
import { EmpathyCompassion }                    from './social/EmpathyCompassion.js'
import { FlirtationEngine }                       from './social/FlirtationEngine.js'
import { HumanDiscourseShaper }                      from './behavior/HumanDiscourseShaper.js'
import { BlushSlipEngine }                              from './behavior/BlushSlipEngine.js'
import { PercentageOfAssets }                              from './cognition/PercentageOfAssets.js'
import { AffectAlignmentMonitor }                              from './behavior/AffectAlignmentMonitor.js'

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
import { DesireEngine }                 from './cognition/DesireEngine.js'
import { IntuitionEngine }             from './cognition/IntuitionEngine.js'
import { TraumaCascadeEngine }     from './social/TraumaCascadeEngine.js'
import { YearningEngine }               from './social/YearningEngine.js'
import { ChildlikeMode }                    from './cognition/ChildlikeMode.js'
import { HappinessEngine }             from './neurochemistry/HappinessEngine.js'
import { ChillsEngine }                    from './cognition/ChillsEngine.js'
import { SecretMaintenanceSystem }  from './social/SecretMaintenanceSystem.js'
import { SharedRelationalCulture }    from './social/SharedRelationalCulture.js'
import { LonelinessEngine }              from './social/LonelinessEngine.js'
import { AnticipatedRegretEngine }   from './cognition/AnticipatedRegretEngine.js'
import { HopeDisappointmentSystem } from './cognition/HopeDisappointmentSystem.js'
import { SelfCompassionVsAttack }     from './social/SelfCompassionVsAttack.js'
import { EmpathicAccuracySystem }     from './social/EmpathicAccuracySystem.js'
import { ConsolationEfficacy }           from './social/ConsolationEfficacy.js'
import { SleepQualityCoupler }           from './neurochemistry/SleepQualityCoupler.js'
import { ConversationalRepair }         from './behavior/ConversationalRepair.js'
import { MeaningfulSilence }               from './behavior/MeaningfulSilence.js'
import { TemptationField }           from './cognition/TemptationField.js'
import { CravingTrace }                 from './cognition/CravingTrace.js'
import { YieldController }           from './cognition/YieldController.js'
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
import { DriftDiffusionModel }             from './cognition/DriftDiffusionModel.js'
import { SignalDetectionTheory }        from './cognition/SignalDetectionTheory.js'
import { HickHymanLaw }                        from './cognition/HickHymanLaw.js'
import { StevensPowerLaw }                    from './cognition/StevensPowerLaw.js'
import { WeberFechnerLaw }                    from './cognition/WeberFechnerLaw.js'
import { SelfDeterminationNeeds }        from './core/SelfDeterminationNeeds.js'
import { HomeostaticFeelingGenerator }     from './core/HomeostaticFeelingGenerator.js'
import { WorkingMemoryBuffer }               from './cognition/WorkingMemoryBuffer.js'
import { HabitVsGoalSystem }                   from './cognition/HabitVsGoalSystem.js'
import { GoalHierarchyManager }                  from './cognition/GoalHierarchyManager.js'
import { BoredomSystem }                           from './core/BoredomSystem.js'
import { SocialFatigueEngine }               from './core/SocialFatigueEngine.js'

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

// Round B — 21 of the 23 originally-requested mechanisms (2 skipped as real
// duplicates: ObligationLedger -> ReciprocityClassifier.getFeltObligation(),
// AttachmentActivatedScript -> Attachment.getStressStyle(), both already real).
import { PostConflictCooling }        from './behavior/PostConflictCooling.js'
import { SuperegoMonitor }              from './cognition/SuperegoMonitor.js'
import { ResidualAnnoyanceTrace }         from './social/ResidualAnnoyanceTrace.js'
import { EffortWithholding }                from './behavior/EffortWithholding.js'
import { PolitenessShutdown }                 from './behavior/PolitenessShutdown.js'
import { ContemptDetector }                     from './social/ContemptDetector.js'
import { DemandWithdrawLoop }                     from './social/DemandWithdrawLoop.js'
import { FaceThreatSensitivity }                    from './social/FaceThreatSensitivity.js'
import { AudienceDesign }                             from './behavior/AudienceDesign.js'
import { SelfPresentationManager }                      from './social/SelfPresentationManager.js'
import { EgoCalibrationSuite }                            from './social/EgoCalibrationSuite.js'
import { LoyaltyConflictResolver }                          from './social/LoyaltyConflictResolver.js'
import { RuminationVsReflectionSwitch }                       from './cognition/RuminationVsReflectionSwitch.js'
import { ReactanceEngine }                                      from './cognition/ReactanceEngine.js'
import { PsychologicalDistanceScaler }                            from './cognition/PsychologicalDistanceScaler.js'
import { MoralLicensing }                                           from './cognition/MoralLicensing.js'
import { SelfHandicapping }                                           from './behavior/SelfHandicapping.js'
import { RelationalAfterglow }                                          from './social/RelationalAfterglow.js'

// 5 indispensable human mechanisms, requested and triaged against the
// existing codebase first: humor/amusement, moral disgust (the missing
// leg of Haidt's CAD triad — contempt/anger already existed), embarrassment
// (distinct from ShameGuiltSplit), Terror Management mortality salience,
// and relief (distinct from ordinary positive valence).
import { AmusementEngine }         from './cognition/AmusementEngine.js'
import { MoralDisgust }              from './social/MoralDisgust.js'
import { EmbarrassmentEngine }         from './social/EmbarrassmentEngine.js'
import { MortalitySalience }             from './cognition/MortalitySalience.js'
import { ReliefEngine }                    from './cognition/ReliefEngine.js'

// 6 mechanisms found by auditing CALIBRATION.md's own existing citations for
// real, distinct phenomena those same papers describe that hadn't been
// built yet — including RAGE/FEAR/LUST, a gap the citation ledger itself
// had left explicitly disclosed ("four of which are modeled" out of 7).
import { PrestigeSystem }                     from './social/PrestigeSystem.js'
import { FramingEffect }                        from './economics/FramingEffect.js'
import { IdealSelfDiscrepancy }                   from './cognition/IdealSelfDiscrepancy.js'
import { ComparisonLevelAlternatives }              from './social/ComparisonLevelAlternatives.js'
import { ReflectedGlory }                             from './social/ReflectedGlory.js'

// Dreams and the subconscious — 2 mechanisms explicitly requested, each
// checked against the codebase first (confirmed no prior real dream-
// content or nonconscious-processing mechanism existed anywhere in it).
import { DreamEngine }               from './social/DreamEngine.js'
import { NightmareEngine }        from './social/NightmareEngine.js'
import { OxytocinSystem }             from './social/OxytocinSystem.js'
import { EndogenousOpioidSystem } from './social/EndogenousOpioidSystem.js'
import { SubconsciousEngine }          from './cognition/SubconsciousEngine.js'
import { ConservationWithdrawal }        from './cognition/ConservationWithdrawal.js'

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
		this.selfDistancingSpeech = new SelfDistancingSpeech()
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
		this.yearningEngine                     = new YearningEngine()
		this.childlikeMode                        = new ChildlikeMode()
		this.frikiEngine                     = new FrikiEngine( { opennessToNew: this.personality.get( 'openness' ) } )
		this.somaticActivationSystems  = new Map() // userId -> real, per-relationship SomaticActivationSystem
		this.globalMoodAbatement          = new GlobalMoodAbatement()
		this.ghostingDetector                = new GhostingDetector()
		this.tipOfTongue                        = new TipOfTongue()
		this.grudgeSystem                          = new GrudgeSystem()
		this.socialDiscomfort                        = new SocialDiscomfort()
		this.empathyCompassion                          = new EmpathyCompassion()
		this.flirtationEngine                              = new FlirtationEngine()
		this.humanDiscourseShaper                             = new HumanDiscourseShaper()
		this.blushSlipEngine                                     = new BlushSlipEngine()
		this.percentageOfAssets                                     = new PercentageOfAssets()
		this.affectAlignmentMonitor                                    = new AffectAlignmentMonitor()
		this._recentDominantFamilies                                    = []

		this.griefEngine             = new GriefEngine()
		this.shameGuiltSplit          = new ShameGuiltSplit()
		this.repairProtocol            = new RepairProtocol()
		this.jealousyTriangle            = new JealousyTriangle()
		this.socialGraphClassifier    = new SocialGraphClassifier()
		this.infatuationEngine          = new InfatuationEngine()
		this.contactFrequencyExpectation = new ContactFrequencyExpectation()
		this.comfortSeekingEngine                  = new ComfortSeekingEngine()
		this.prideCompetenceEngine                  = new PrideCompetenceEngine()
		this.socialFatigueEngine                      = new SocialFatigueEngine()
		this.firstImpressionEngine                    = new FirstImpressionEngine()
		this.dailyExpectationEngine                = new DailyExpectationEngine()
		this.affinityResonance                            = new AffinityResonance()
		this.comfortAccumulation                        = new ComfortAccumulation()
		this.protectiveInstinctEngine        = new ProtectiveInstinctEngine()
		this.forgivenessProcess                     = new ForgivenessProcess()
		this.validationSeekingEngine          = new ValidationSeekingEngine()
		this.deceptionDecisionEngine          = new DeceptionDecisionEngine()
		this.trustRiskDecision                        = new TrustRiskDecision()
		this.clinginessEngine                          = new ClinginessEngine()
		this.flowStateEngine                              = new FlowStateEngine()
		this.capitalVicesEngine                        = new CapitalVicesEngine()
		this.opinionStanceEngine                    = new OpinionStanceEngine()
		this.ambientBehavioralTrace          = new AmbientBehavioralTrace()
		this.controlPacketCompiler             = new ControlPacketCompiler()
		this.postGenStateAligner                 = new PostGenStateAligner()
		this.nBestReranker                              = new NBestReranker( this.postGenStateAligner )
		this.repairRewriter                             = new RepairRewriter()
		this.stateLockedMemory                     = new StateLockedMemory()
		this.decodingSteeringAdapter         = new DecodingSteeringAdapter()
		this.activationSteeringBridge         = new ActivationSteeringBridge()
		this.fineTuneCurriculum                   = new FineTuneCurriculum()
		this.epistemicTrust                                  = new EpistemicTrust()
		this.assertivenessBoundary                  = new AssertivenessBoundary()
		this.manipulationSkepticism             = new ManipulationSkepticism()
		this.disagreementStyle                          = new DisagreementStyle()
		this.anticipatorySavoring                    = new AnticipatorySavoring()
		this.nostalgiaEngine                = new NostalgiaEngine()
		this.painSocialOverlap                = new PainSocialOverlap()
		this.identityThreatMonitor              = new IdentityThreatMonitor()
		this.socialBaselineTheory                 = new SocialBaselineTheory()
		this.subjectiveTimeEngine                   = new SubjectiveTimeEngine()
		this.sleepPressure                             = new SleepPressure()
		this.anticipatoryAffect                          = new AnticipatoryAffect()
		this.motivationalConflict                          = new MotivationalConflict()
		this.desireEngine                                          = new DesireEngine()
		this.intuitionEngine                                    = new IntuitionEngine()
		this.traumaCascadeEngine                            = new TraumaCascadeEngine()
		this.happinessEngine                                    = new HappinessEngine()
		this.chillsEngine                                          = new ChillsEngine()
		this.secretMaintenanceSystem                     = new SecretMaintenanceSystem()
		this.sharedRelationalCulture                       = new SharedRelationalCulture()
		this.lonelinessEngine                                  = new LonelinessEngine()
		this.anticipatedRegretEngine                     = new AnticipatedRegretEngine()
		this.hopeDisappointmentSystem                   = new HopeDisappointmentSystem()
		this.selfCompassionVsAttack                        = new SelfCompassionVsAttack()
		this.empathicAccuracySystem                        = new EmpathicAccuracySystem()
		this.consolationEfficacy                                = new ConsolationEfficacy()
		this.sleepQualityCoupler                                = new SleepQualityCoupler()
		this.conversationalRepair                            = new ConversationalRepair()
		this.meaningfulSilence                                  = new MeaningfulSilence()
		this.temptationField                                    = new TemptationField()
		this.cravingTrace                                          = new CravingTrace()
		this.yieldController                                    = new YieldController()
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
		this.driftDiffusionModel                    = new DriftDiffusionModel()
		this.signalDetectionTheory               = new SignalDetectionTheory()
		this.hickHymanLaw                                = new HickHymanLaw()
		this.stevensPowerLaw                          = new StevensPowerLaw()
		this.weberFechnerLaw                          = new WeberFechnerLaw()
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

		this.postConflictCooling                                          = new PostConflictCooling()
		this.superegoMonitor                                                = new SuperegoMonitor()
		this.residualAnnoyanceTrace                                           = new ResidualAnnoyanceTrace()
		this.effortWithholding                                                  = new EffortWithholding()
		this.politenessShutdown                                                   = new PolitenessShutdown()
		this.contemptDetector                                                       = new ContemptDetector()
		this.demandWithdrawLoop                                                       = new DemandWithdrawLoop()
		this.faceThreatSensitivity                                                      = new FaceThreatSensitivity()
		this.audienceDesign                                                               = new AudienceDesign()
		this.selfPresentationManager                                                        = new SelfPresentationManager()
		this.egoCalibrationSuite                                                              = new EgoCalibrationSuite()
		this.loyaltyConflictResolver                                                            = new LoyaltyConflictResolver()
		this.ruminationVsReflectionSwitch                                                         = new RuminationVsReflectionSwitch()
		this.reactanceEngine                                                                        = new ReactanceEngine()
		this.psychologicalDistanceScaler                                                              = new PsychologicalDistanceScaler()
		this.moralLicensing                                                                             = new MoralLicensing()
		this.selfHandicapping                                                                             = new SelfHandicapping()
		this.relationalAfterglow                                                                            = new RelationalAfterglow()

		this.amusementEngine                                                                                  = new AmusementEngine()
		this.moralDisgust                                                                                       = new MoralDisgust()
		this.embarrassmentEngine                                                                                  = new EmbarrassmentEngine()
		this.mortalitySalience                                                                                      = new MortalitySalience()
		this.reliefEngine                                                                                              = new ReliefEngine()

		this.prestigeSystem                                                                                              = new PrestigeSystem()
		this.framingEffect                                                                                                 = new FramingEffect()
		this.idealSelfDiscrepancy                                                                                            = new IdealSelfDiscrepancy( { sensitivity: 0.4 + 0.3 * this.personality.get( 'openness' ) } )
		this.comparisonLevelAlternatives                                                                                       = new ComparisonLevelAlternatives()
		this.reflectedGlory                                                                                                      = new ReflectedGlory()

		this.dreamEngine                                                                                                           = new DreamEngine()
		this.nightmareEngine                                                                                                 = new NightmareEngine()
		this.oxytocinSystem                                                                                                     = new OxytocinSystem()
		this.endogenousOpioidSystem                                                                                    = new EndogenousOpioidSystem()
		this.subconsciousEngine                                                                                                      = new SubconsciousEngine()
		this.conservationWithdrawal                                                                                                    = new ConservationWithdrawal()

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

		// Real cortisol level as it stood BEFORE this turn touches it — ReliefEngine's
		// own real trigger condition needs to know how much threat existed going IN,
		// not the level this turn's own resolution already brought back down.
		this._preTurnCortisol = this.cortisolEngine.getLevel()
		// Real, distinct "impatience with long input" — high chronic cortisol
		// genuinely shortens how much real length the AI can patiently process
		// before real irritation registers, per CortisolEngine's own docstring
		// claim ("shortens patience for long inputs"), not just a debug number.
		const patienceCeiling = 400 * this.cortisolEngine.getPatienceMultiplier() // own tuning: ~400 chars at zero cortisol
		const impatience         = clamp01( ( ( input ?? '' ).length - patienceCeiling ) / patienceCeiling )
		if ( impatience > 0.3 ) this.emotionSpace.applySpike( { arousal: impatience * 0.15, dominance: -impatience * 0.05, weight: 0.2 } )
		// Same real "before this turn touches it" discipline for arousal — WeberFechnerLaw's
		// own real baseline-ratio judgment needs the level going IN, not after this turn's own spikes.
		this._preTurnArousal   = this.emotionSpace.vector.arousal

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

			// Real rest-replenishes-energy link — a genuine gap this pipeline had:
			// Homeostasis.needs.stamina/curiosity previously had NO general
			// refill path at all (only a single life-event-gated satisfy() call),
			// so any sufficiently long real-time simulation without that exact
			// event permanently maxed allostaticLoad regardless of anything else
			// happening — caught by examples/love-triangle-mock.js's real 90-day
			// projection. Borbély 1982's own two-process model (already cited
			// above for SleepPressure itself) makes the direction obvious: sleep
			// pressure clearing IS what "feeling rested" means, so the real
			// amount of pressure THIS sweep actually dissipated is the honest,
			// already-computed magnitude to recover stamina from — no separate
			// invented constant. The curiosity share is own design (rest
			// plausibly also restores engagement, weaker citation than stamina).
			const sleepPressureBeforeSweep = this.sleepPressure.getLevel()
			this.sleepPressure.dissipate( elapsedSinceLastTurn )
			const staminaRecovered = sleepPressureBeforeSweep - this.sleepPressure.getLevel()
			this.homeostasis.satisfy( 'stamina', staminaRecovered )
			this.homeostasis.satisfy( 'curiosity', staminaRecovered * 0.3 )

			// Real relational-memory cataloging — REM doesn't just cool, it hands
			// off the episodes it just touched to a real, structured, per-person
			// index (Conway & Pleydell-Pearce 2000, see RelationalMemoryCatalog.js).
			if ( this._lastActiveUserId ) {

				const touched = this.episodicMemory.memories.filter( m => m.userId === this._lastActiveUserId && m.remTaggedAt === sweepNow )
				if ( touched.length ) this.relationalMemoryCatalog.ingestFromRem( this._lastActiveUserId, this._lastRemReport, touched )

				// Real dream synthesis — only a genuinely long real elapsed gap
				// (a real "deep sleep", not a light REM cooling sweep) qualifies.
				// Synthesized from real, already-stored top-weighted material for
				// this specific person, nothing invented (Domhoff 2003; Hobson &
				// McCarley 1977, see DreamEngine.js).
				if ( this.dreamEngine.qualifiesForDream( elapsedSinceLastTurn ) ) {

					const topDetail          = this.relationalMemoryCatalog.getTopDetails( this._lastActiveUserId, { k: 1 } )[ 0 ] ?? null
					const topTheme            = this.relationalMemoryCatalog.getRecurringThemes( this._lastActiveUserId, { k: 1 } )[ 0 ] ?? null
					const dominantFamily = this._recentDominantFamilies[ this._recentDominantFamilies.length - 1 ] ?? null
					const affectLedger      = this.relationalMemoryCatalog.getAffectLedger( this._lastActiveUserId )

					// Real nightmare evaluation — Levin & Nielsen 2007, see
					// NightmareEngine.js — a real combining layer over 4 already-
					// tracked signals (amygdala/PFC ratio via InhibitoryControlPool,
					// unresolved fear via ClassicalConditioning, physiological panic
					// via cortisol/arousal, REM-rebound pressure via SleepPressure),
					// not 4 new modules.
					this._lastNightmareEval = this.nightmareEngine.evaluate( {
						amygdalaThreat        : ( this.cortisolEngine.getLevel() + this.emotionSpace.vector.arousal ) / 2,
						pfcControl                  : this.inhibitoryControlPool.level / this.inhibitoryControlPool.capacity,
						unresolvedFear         : Math.max( this.classicalConditioning.getStrongestFear(), this.traumaCascadeEngine.getTraumaTrace( this._lastActiveUserId ) ),
						remReboundPressure : sleepPressureBeforeSweep,
						cortisol                       : this.cortisolEngine.getLevel(),
						arousal                        : this.emotionSpace.vector.arousal,
					} )

					this.dreamEngine.generateDream( this._lastActiveUserId, { topDetail, topTheme, dominantFamily, affectLedger, nightmareIntensity: this._lastNightmareEval.isNightmare ? this._lastNightmareEval.probability : 0 }, sweepNow )

					// Real composite "current concerns" dream — Domhoff 2003, see
					// DreamEngine.js. The per-person dream above is kept for real
					// backward-compatible per-relationship introspection; this is
					// the honest, additional real signal for "one night, everything
					// lived, blended" — every real currently-known person's own
					// affect ledger, EVERY real active grief thread (not just this
					// person's bereavement), and this turn's own real dominant
					// family, each as one real weighted source, nothing invented.
					const compositeSources = []
					for ( const [ personId ] of this.relationalMemoryCatalog.people ) {

						const ledger = this.relationalMemoryCatalog.getAffectLedger( personId )
						const weight = clamp01( ( ledger.cumulativeWarmth + ledger.cumulativeHurt ) / 4 )
						if ( weight <= 0 ) continue
						compositeSources.push( { label: personId, weight, valence: clamp01( ( ledger.cumulativeWarmth - ledger.cumulativeHurt + 1 ) / 2 ) * 2 - 1 } )

					}
					for ( const [ griefKey ] of this.griefEngine.griefs ) {

						const griefWeight = this.griefEngine.getIntensity( griefKey )
						if ( griefWeight > 0.05 ) compositeSources.push( { label: `grief:${griefKey}`, weight: clamp01( griefWeight ), valence: -clamp01( griefWeight ) } )

					}
					if ( dominantFamily ) compositeSources.push( { label: `mood:${dominantFamily}`, weight: 0.2, valence: this.emotionSpace.vector.valence } )
					// Real trauma fragments — van der Kolk & Fisler 1995's own
					// finding that overwhelming events surface as isolated
					// sensory fragments rather than tidy narrative, not blended
					// with the rest: each stored fragment enters as its own
					// real, separately-weighted, sharply negative source.
					for ( const fragment of this.traumaCascadeEngine.getFragments( this._lastActiveUserId ) ) compositeSources.push( { label: `fragment:${fragment.label}`, weight: fragment.weight, valence: -fragment.weight } )
					this.dreamEngine.generateCompositeDream( compositeSources, sweepNow )

					if ( this._lastNightmareEval.isNightmare ) {

						// Real waking-scared signature — a real, short-lived fear spike,
						// and real, genuinely LESS restorative sleep (nightmares abort
						// clean REM affect-regulation, own tuning of the dampening
						// fraction, not measured from a specific sleep-study dataset).
						this.emotionSpace.applySpike( { valence: -this._lastNightmareEval.probability * 0.3, arousal: this._lastNightmareEval.probability * 0.4, weight: 0.4 } )
						this.homeostasis.satisfy( 'stamina', -staminaRecovered * this._lastNightmareEval.probability * 0.5 )

					}

					// Real next-day self-control cost from a genuinely fragmented
					// night — Barber & Munz 2011, see SleepQualityCoupler.js. Applied
					// once, right after the real REM sweep that just happened, to
					// InhibitoryControlPool's own current level (not a new resource).
					const sleepFragmentationThisSweep = this.sleepQualityCoupler.getFragmentation( { rumination: clamp01( this.cortisolEngine.getLevel() ), nightmareIntensity: this._lastNightmareEval.isNightmare ? this._lastNightmareEval.probability : 0, stress: this.cognitiveDissonance.getStress() } )
					this.inhibitoryControlPool.level = Math.min( this.inhibitoryControlPool.capacity, this.inhibitoryControlPool.level * this.sleepQualityCoupler.getNextDayControlMultiplier( sleepFragmentationThisSweep ) )

				}

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
		// Real oxytocin felt-safety baseline — Carter 1998, see
		// OxytocinSystem.js. A real, currently-active secure bond genuinely
		// raises the threshold (harder to fully hijack while someone secure
		// is present); its real absence (e.g. post-breakup) leaves this at
		// its own floor-driven baseline, own tuning of the 0.3 ceiling.
		const oxytocinCalmMultiplier               = 1 + this.oxytocinSystem.getGlobalCalmingEffect() * 0.3
		const hijackThreshold = 0.95 * this.cortisolEngine.getThresholdMultiplier() * this.sensitization.getThresholdMultiplier() * narrowingMultiplier * ontogenicThresholdMultiplier * oxytocinCalmMultiplier
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

		// Real oxytocin "rose-tinted glasses" idealization suppression — Carter
		// 1998, see OxytocinSystem.js. Uses the real level accrued INTO this
		// turn (a bond doesn't retroactively excuse what's being said in the
		// same breath) to soften how negative a bonded partner's own turn reads.
		if ( desirability < 0 ) desirability *= ( 1 - this.oxytocinSystem.getIdealizationSuppression( userId ) * 0.4 )

		// Real, narrow, own-engineered strict-precision-mode detector —
		// hoisted here (was previously only computed much later, for
		// BlushSlipEngine alone) so IntuitionEngine's own real gate can
		// also defer to it: a genuinely factual/numeric turn keeps social
		// intuition almost entirely off, per the real priority ordering.
		const precisionMode = /\d/.test( input ) && /[+\-*/=]|cu[aá]nto es|calcula|resuelve/i.test( input )

		// Real Capa 2 — IntuitionEngine, the user's own "TRAD-E" architecture
		// request: a fast typed hunch that PROPOSES and re-prioritizes,
		// never dictates. Real gate: only activates on genuine stakes
		// (|desirability|), ambiguity (reuses Intuition.js's own real
		// k-NN+entropy hunch above), or social salience (relation.affinity)
		// — an ordinary factual/neutral turn, or precisionMode, stays off.
		// Priority ordering (spec section 4): explicit evidence outranks
		// intuition — handled inside IntuitionEngine.assess() itself via
		// the real Contradiction term against this turn's own desirability.
		// Ontology unification: this turn's own already-classified real
		// concepts are passed in directly rather than re-detected.
		// Real prior-turn hunch, captured BEFORE this turn's own fresh read
		// overwrites it — the real post-digest confirmation/refutation
		// later this same turn needs to judge what was believed BEFORE
		// this turn's own new content, not this turn's own brand-new hunch.
		const priorHunchBeforeThisTurn = this.intuitionEngine.lastHypothesis.get( userId ) ?? null
		// Real hypervigilance coupling — a genuinely already-consolidated
		// trauma trace for this user (from a real PRIOR extreme event, not
		// this turn's own) lowers the effective bar for intuition to
		// activate, Ozer et al.'s own well-cited hypervigilance-after-trauma
		// finding, without inventing a new always-on danger detector.
		//
		// Real bug found and fixed: a flat `trace * 0.3` multiply fades to
		// an effectively negligible boost almost as fast as the trace
		// itself does, which defeats its own purpose — hypervigilance is
		// supposed to stay genuinely engaged as long as a real trace is
		// still present, not shrink in lockstep with it. Real threshold
		// gate instead: exactly 0 while the trace is at/under a genuinely
		// negligible epsilon (a never-traumatized or fully-recovered user
		// must never read as hypervigilant), then a real linear ramp up to
		// the full boost over a small real band above that — hypervigilance
		// stays "on" while ANY real trace remains, not proportional to how
		// much.
		// Own tuning, calibrated against this engine's own REAL observed
		// trace magnitudes (typically ~0.001-0.03 for a single consolidated
		// event, verified directly against examples/trauma-happiness-intuition-5-tests.js's
		// own printed output) rather than picked in the abstract — a wider
		// epsilon/ramp tuned for a hypothetical 0..1-scale trace would
		// never actually cross IntuitionEngine's own real ambiguityThreshold
		// (0.15) at the trace levels this engine genuinely produces.
		const TRAUMA_HYPERVIGILANCE_EPSILON = 0.005
		const TRAUMA_HYPERVIGILANCE_RAMP        = 0.01
		const traumaTraceNow                                    = this.traumaCascadeEngine.getTraumaTrace( userId )
		// Real, distinct loneliness-driven hypervigilance add-on — Cacioppo
		// & Patrick 2008, already cited in LonelinessEngine.js (chronic
		// loneliness itself genuinely raises social-threat vigilance,
		// independent of trauma). Reads the PRIOR turn's own persisted
		// loneliness level, same "read before this turn's own fresh update"
		// discipline already used elsewhere in this pipeline.
		const lonelinessHypervigilance = this.lonelinessEngine.getHypervigilanceBoost()
		// Real ambient bias — AmbientBehavioralTrace's own real affect
		// variance and residual stress floor (the PRIOR turn's own
		// persisted reads) genuinely raise felt-certainty bias only where
		// it matters: `ambiguity` below only ever feeds ambiguous-cue
		// gating, a neutral turn stays null regardless.
		const ambientHypervigilance = this.ambientBehavioralTrace.getAffectVariance( userId ) * 0.15 + this.ambientBehavioralTrace.getResidualFloor( userId ) * 0.1
		const hypervigilance                                        = ( traumaTraceNow <= TRAUMA_HYPERVIGILANCE_EPSILON
			? 0
			: clamp01( ( traumaTraceNow - TRAUMA_HYPERVIGILANCE_EPSILON ) / TRAUMA_HYPERVIGILANCE_RAMP ) * 0.3 ) + lonelinessHypervigilance + ambientHypervigilance
		const intuitionGateOpen             = this.intuitionEngine.gate( { stakes: Math.abs( desirability ), ambiguity: ( hunch.entropy ?? 0 ) + hypervigilance, socialSalience: relation.affinity, precisionMode } )
		const intuitionRead                    = intuitionGateOpen ? this.intuitionEngine.assess( { text: input, entropy: hunch.entropy ?? 0, desirability, userId, ontologyConcepts: ontologyMatches.map( m => m.concept ), precisionMode, hypervigilance } ) : null
		if ( intuitionRead ) {

			this.intuitionEngine.lastHypothesis.set( userId, intuitionRead )
			this.intuitionEngine.registerSuspicion( userId, intuitionRead.bias.trustSuspicion )
			// A real, small, bounded trust cost from the suspicion itself —
			// deliberately far smaller than what an actual confirmed
			// betrayal/dissonance costs (see Attachment.update()'s own real
			// Bayesian trustBeta jump), since a hunch is real SUSPICION,
			// not a verdict.
			if ( intuitionRead.bias.trustSuspicion > 0 ) relation.trust = clamp01( relation.trust - intuitionRead.bias.trustSuspicion * 0.1 )

		}

		// Real Stevens' Power Law — psychophysical compression of the raw
		// ontology-driven arousal boost, tracked per real stimulus "kind"
		// (the dominant matched concept, or 'general' with none) — repeated
		// exposure to the SAME kind of intense stimulus genuinely habituates
		// it (see StevensPowerLaw.js), distinct from AmusementEngine's own
		// narrow humor-bit habituation and HedonicAdaptation's own separate
		// hedonic-value curve.
		const stimulusKind             = ontologyMatches[ 0 ]?.concept ?? 'general'
		const rawArousalBoost         = appraisal.ontologyArousalBoost ?? 0
		const perceivedArousalBoost = this.stevensPowerLaw.perceivedIntensity( stimulusKind, rawArousalBoost )
		if ( rawArousalBoost > 0.3 ) this.stevensPowerLaw.habituate( stimulusKind )
		else this.stevensPowerLaw.decay( stimulusKind )

		// Real Weber-Fechner Law — this turn's own desirability magnitude
		// judged as a real perceptual RATIO against the arousal baseline
		// BEFORE this turn touched it (`_preTurnArousal`, captured at the
		// very top of processInput) — the same fixed shock genuinely
		// registers as smaller once already highly aroused (see
		// WeberFechnerLaw.js).
		const weberFechnerPerceivedChange = this.weberFechnerLaw.getPerceivedChange( Math.abs( desirability ), this._preTurnArousal )
		// Real, bounded multiplier so a genuinely tiny/negative log-ratio never zeroes out arousal entirely, own tuning of both bounds.
		const weberFechnerMultiplier          = Math.max( 0.3, Math.min( 1.7, 1 + weberFechnerPerceivedChange * 0.25 ) )

		// Dopaminergic RPE — surprise relative to expectation, not raw reward, tracked
		// per-user (context=userId) so this relationship's own expectation history is
		// what this turn's reward gets judged against, with a real TD(λ) eligibility
		// trace crediting recently-active contexts too (see DopaminergicEngine.js).
		// Novelty adds extra arousal on top of the RPE-driven amount, since novelty
		// and reward-surprise are related but not identical signals.
		const rpe          = this.dopaminergicEngine.computeRPE( desirability, userId, this.homeostasis.allostaticLoad )

		// Real subjective WELL-BEING accumulation — Rutledge et al. 2014,
		// see HappinessEngine.js. Reuses this turn's own already-computed
		// real desirability (CR, "certain reward" received), the
		// dopaminergic engine's own real expected value (EV, anticipatory),
		// and this same turn's rpe (RPE) — no new inputs invented.
		const happinessLevel = this.happinessEngine.update( userId, { CR: Math.max( 0, desirability ), EV: this.dopaminergicEngine.getExpectedValue( userId ), RPE: rpe } )
		this.happinessEngine.updateReceptorOccupancy( userId, Math.max( 0, rpe ) )

		// Real endogenous-opioid analgesia — Panksepp 1998 (already cited for
		// PANIC/GRIEF); Machin & Dunbar 2011, see EndogenousOpioidSystem.js.
		// Only dampens a NEGATIVE surprise (rpe<0) — a real buffer against
		// PAIN specifically, not reward; uses the real buffer accrued INTO
		// this turn, genuinely gone once a bond stops being reinforced.
		const opioidAnalgesia = this.endogenousOpioidSystem.getAnalgesia( userId, this.homeostasis.allostaticLoad )
		const painDampening         = rpe < 0 ? ( 1 - clamp01( opioidAnalgesia ) * 0.5 ) : 1

		const dopamineSpike = {
			valence : rpe * 0.5 * painDampening,
			arousal : Math.abs( rpe ) * 0.6 * weberFechnerMultiplier * painDampening + perceivedArousalBoost * 0.2 + novelty * 0.15,
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
		// Real, distinct PRIOR expectation read — what the running estimate
		// actually was going INTO this turn, before observe() below updates
		// it, exposing the real predicted value itself (not only the
		// post-update error/free-energy readouts already used).
		const predictiveEstimateBefore = this.predictiveProcessingCore.getEstimate( `desirability:${userId}` )
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
		// Real bug found running the round-36 trauma-cascade system tests:
		// a genuine, sincere extreme-betrayal/threat statement arriving
		// abruptly after a long real warm relational context is EXACTLY the
		// kind of real incongruence this detector is built to flag — and it
		// was inverting the sign on real, sincere claims of grave harm,
		// treating "me traicionaste..." as sarcastic praise purely because
		// it clashed with weeks of genuinely warm prior context. Fixed by
		// excluding a real, already-classified ontology threat/betrayal
		// concept match from sarcasm eligibility: a sincere claim of grave
		// harm is categorically different from "GREAT, love that" tonal
		// irony, and inverting it here would make betrayal itself
		// invisible to every downstream real mechanism that reads
		// desirability (trauma cascade, grudge, defense mechanisms...).
		const contextValence = this.episodicMemory.getRecentValence( userId )
		const sarcasm             = ontologyFlagsThreat ? { sarcastic: false, derr: 0, adjustedValence: appraisal.desirability ?? 0 } : this.sarcasmDetector.detect( appraisal.desirability ?? 0, contextValence, visualProsody.intensity )
		if ( sarcasm.sarcastic ) {

			desirability = sarcasm.adjustedValence
			this.theoryOfMind.updateBelief( userId, 'tone', { ironic: true } )
			activeMechanisms.push( 'sarcasm' )

		}

		// Real Signal Detection Theory self-calibration of SarcasmDetector's
		// own flag — Green & Swets 1966, see SignalDetectionTheory.js. This
		// turn's real (pre-sarcasm) appraisal.desirability is the honest
		// ground-truth proxy for whether the PREVIOUS turn's sarcasm flag was
		// a real hit (genuinely hostile) or a real false alarm (was actually
		// affectionate teasing) — resolved one turn later since that's when
		// the real confirming signal actually becomes available.
		if ( this._pendingSarcasmFlag !== undefined ) {

			const confirmedHostile = ( appraisal.desirability ?? 0 ) < -0.15
			if ( this._pendingSarcasmFlag && confirmedHostile ) this.signalDetectionTheory.recordHit( 'sarcasm' )
			else if ( this._pendingSarcasmFlag && !confirmedHostile ) this.signalDetectionTheory.recordFalseAlarm( 'sarcasm' )
			else if ( !this._pendingSarcasmFlag && confirmedHostile ) this.signalDetectionTheory.recordMiss( 'sarcasm' )
			else this.signalDetectionTheory.recordCorrectRejection( 'sarcasm' )

		}
		this._pendingSarcasmFlag = sarcasm.sarcastic

		// Real Drift Diffusion Model — Ratcliff 1978, see DriftDiffusionModel.js.
		// Only fires on a genuinely AMBIGUOUS real appraisal (small |desirability|,
		// no ontology concept lock) — a clearly positive or negative turn needs
		// no real evidence-accumulation process to resolve.
		const isAmbiguousAppraisal = Math.abs( desirability ) < 0.15 && ontologyMatches.length === 0
		const ddmDecision                     = isAmbiguousAppraisal ? this.driftDiffusionModel.decide( desirability * 4 ) : null

		// Real interest identity — this turn's own significant (non-stopword)
		// content tokens are the real real topic candidates (Silvia 2006;
		// Renninger & Hidi 2011, see FrikiEngine.js); Totemheart has no
		// dedicated topic-extraction module, so real content words are the
		// honest signal available, the same real approach `EpisodicMemory`'s
		// own token-overlap reactivation already uses. Not every turn touches
		// a real recurring topic, so this is honestly sparse.
		const frikiStopwords = new Set( [ 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'a', 'al', 'en', 'y', 'o', 'que', 'es', 'son', 'esta', 'está', 'con', 'por', 'para', 'se', 'su', 'lo', 'me', 'te', 'mi', 'tu', 'yo', 'no', 'si', 'como', 'mas', 'más', 'pero', 'muy', 'eres', 'soy', 'the', 'a', 'an', 'of', 'to', 'in', 'is', 'and', 'this', 'that', 'it', 'i', 'you' ] )
		const frikiTopics       = ( input.toLowerCase().match( /[\p{L}']+/gu ) ?? [] ).filter( t => !frikiStopwords.has( t ) && t.length > 3 )
		for ( const topic of frikiTopics ) this.frikiEngine.observeJointEngagement( topic, relation.affinity, desirability, { depth: novelty } )
		// Real attention/memory bias toward the AI's OWN top interests —
		// genuinely raises how salient this turn reads when it touches a
		// real, already-fused topic, a real multiplier rather than a
		// hardcoded topic list.
		const frikiAttentionBoost = frikiTopics.reduce( ( max, topic ) => Math.max( max, this.frikiEngine.getAttentionBoost( topic ) ), 1 )
		if ( frikiAttentionBoost > 1.1 ) this.emotionSpace.applySpike( { arousal: ( frikiAttentionBoost - 1 ) * 0.15, weight: 0.2 } )
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
		// ChildlikeMode's own real friki-share boost (its "más share, más
		// lore espontáneo" acople) — a persistent playful stance already
		// carried in from recent turns genuinely lowers the bar to share
		// unprompted, real prior value, this turn's own fresh update hasn't
		// run yet.
		const frikiShare      = obsession ? this.frikiEngine.shouldShare( obsession, { affinity: relation.affinity, reciprocalInterest: clamp01( ( frikiTopics.includes( obsession ) ? 0.6 : 0 ) + this.childlikeMode.getLevel( userId ) * 0.3 ) } ) : null
		if ( frikiEgoThreat > 0.3 ) this.emotionSpace.applySpike( { arousal: frikiEgoThreat * 0.15, dominance: -frikiEgoThreat * 0.1, weight: 1 } )

		// Real "butterflies" — genuine high-stakes uncertainty toward THIS
		// relationship (Mendes et al. 2007, see SomaticActivationSystem.js),
		// tracked per user since it's a real per-relationship state, not global.
		if ( !this.somaticActivationSystems.has( userId ) ) this.somaticActivationSystems.set( userId, new SomaticActivationSystem() )
		const somaticActivation = this.somaticActivationSystems.get( userId )
		somaticActivation.update( { stimulusIntensity: Math.abs( desirability ), affinity: relation.affinity, trust: relation.trust } )
		this.ghostingDetector.observeContact( userId, { historicButterflies: somaticActivation.level } )
		const ghostingPain = this.ghostingDetector.getGhostingPain( userId )
		if ( ghostingPain > 0.3 ) this.globalMoodAbatement.inject( ghostingPain * 0.1 )

		// Real per-person cadence learning — distinct from ghosting's own
		// fixed-threshold pain read, see ContactFrequencyExpectation.js.
		const isFirstEverContact = this.contactFrequencyExpectation.getExpectedCadenceDays( userId ) === null
		this.contactFrequencyExpectation.registerContact( userId )
		// Real ambient rhythm telemetry — from THIS single instance's own
		// real vantage point, a real `processInput()` call is by definition
		// a real response, never a self-initiated outreach (this codebase
		// has no channel for the AI to message first on its own); a real,
		// honest `initiatedByAgent: false` every turn, so `initiationRate`
		// stays near 0 for this specific single-instance API — the real,
		// meaningful reading of this specific tracker is for a caller with
		// visibility into BOTH sides (e.g. a multi-instance simulation).
		this.ambientBehavioralTrace.registerTurn( userId, { initiatedByAgent: false } )
		this.ambientBehavioralTrace.registerInitiationSnapshot( userId, relation.affinity )
		this.ambientBehavioralTrace.registerResidual( userId, Math.max( this.cortisolEngine.getLevel(), this.traumaCascadeEngine.getTraumaTrace( userId ) ) )
		this.ambientBehavioralTrace.registerAffectSample( userId, { ...this.emotionSpace.vector } )
		this.ambientBehavioralTrace.checkRecovery( userId, this.emotionSpace.vector.valence )
		if ( desirability < -0.5 ) this.ambientBehavioralTrace.registerAdverseEvent( userId, this.emotionSpace.vector.valence )

		// Real coupling: MEANINGFUL SILENCE (real silence streak × real bond,
		// distinct from a real lexical yearning cue) feeds a real, direct
		// attachment-PROTEST-adjacent nudge — the same real composition
		// shape as `ComfortSeekingEngine`'s own real bid, applied here from
		// a real, purely temporal signal rather than a felt-distress one.
		const meaningfulSilence = this.ambientBehavioralTrace.getMeaningfulSilence( userId, relation.affinity, 3 )
		if ( meaningfulSilence > 0.4 ) this.emotionSpace.applySpike( { valence: -meaningfulSilence * 0.1, arousal: meaningfulSilence * 0.1, weight: 0.15 } )
		// Real social-fill effect — genuinely engaging with someone NEW
		// (this AI's first real contact with them) measurably accelerates
		// real acceptance of an old silence with someone else, distinct
		// from that other relationship's own ghosting pain simply decaying
		// on its own.
		if ( isFirstEverContact && desirability > 0.3 ) this.ghostingDetector.acceleratedByNewEngagement( userId )
		// Real one-shot halo/horn anchor — first real contact only.
		this.firstImpressionEngine.registerFirstImpression( userId, desirability )
		// Real accumulated psychological safety from this turn's own real
		// threat read, distinct curve shape from OxytocinSystem.
		this.comfortAccumulation.registerInteraction( userId, Math.max( 0, -desirability ) )
		// Real social-battery drain — every real turn costs something,
		// regardless of how enjoyable it reads (Zelenski et al. 2012).
		this.socialFatigueEngine.registerInteraction( 1 - this.personality.get( 'extraversion' ), Math.abs( this.emotionSpace.vector.arousal ) )

		// Real tip-of-the-tongue — only meaningful for a topic the AI
		// genuinely half-knows (real FrikiEngine intensity in the "partial"
		// range), not every unknown word (that's just honest ignorance, not a
		// block) or every well-known one (that's fluent access).
		let tipOfTongueState = null
		for ( const topic of frikiTopics ) {

			const interest = this.frikiEngine.getInterest( topic )
			if ( !interest || interest.intensity < 0.05 || interest.intensity > 0.85 ) continue
			const access = this.tipOfTongue.getAccessProbability( interest.intensity, this.globalMoodAbatement.level )
			const tier      = this.tipOfTongue.getTier( access )
			if ( tier === 'tip_of_the_tongue' || tier === 'weak_association' ) {

				this.tipOfTongue.registerBlock( topic, access )
				tipOfTongueState = { topic, tier, ...this.tipOfTongue.getEffects( topic ) }
				break

			}

		}

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

		// Real "el nosotros de antes" tracking — a real, slow-decaying peak
		// warmth this relationship has actually reached, so a genuine
		// decline reads against real history, not just this turn's own dip.
		this.nostalgiaEngine.registerWarmth( userId, clamp01( ( bondUpdate.netBond + 1 ) / 2 ) )
		const pastDecline = this.nostalgiaEngine.compareToPast( userId, clamp01( ( bondUpdate.netBond + 1 ) / 2 ) )

		// Real hyperactivated-attachment tracking — genuine gap between how
		// much contact this AI actually wants (real, already-tracked desire)
		// and how much it's actually getting (approximated by the real
		// absence of ghosting pain this turn), scaled by real, global
		// anxious-attachment strength (neuroticism, the same real proxy
		// `Attachment.js`'s own style classifier already uses) and real
		// `InhibitoryControlPool` capacity.
		this.clinginessEngine.updateHyperactivation(
			userId,
			this.desireEngine.getDesire( userId ),
			clamp01( 1 - this.ghostingDetector.getGhostingPain( userId ) ),
			this.personality.get( 'neuroticism' ),
			this.inhibitoryControlPool.level / this.inhibitoryControlPool.capacity,
		)

		// Real reinforcement of both bonding-chemistry buffers — Carter 1998;
		// Panksepp 1998/Machin & Dunbar 2011, see OxytocinSystem.js/
		// EndogenousOpioidSystem.js. Only a genuinely net-positive bond turn
		// builds either buffer; a negative or neutral turn simply lets both
		// keep decaying via tick().
		const bondSignal = Math.max( 0, bondUpdate.netBond )
		this.oxytocinSystem.reinforce( userId, bondSignal )
		this.endogenousOpioidSystem.reinforce( userId, bondSignal )

		// Real appetitive DESIRE — Berridge & Robinson 1998, already cited
		// for DopaminergicEngine's own wanting/liking split, see
		// DesireEngine.js. A real, per-target ACCUMULATING motivational
		// state distinct from that turn-level RPE-driven wanting — builds
		// from already-computed real attraction/novelty/bond/uncertainty,
		// genuinely satiates with real repeated positive exposure.
		const desireSalience = this.desireEngine.getSalience( { attraction: relation.affinity, novelty, bond: bondUpdate.netBond, uncertainty: 1 - relation.trust }, userId )
		let desireLevel            = this.desireEngine.update( userId, desireSalience )
		if ( desirability > 0.3 ) this.desireEngine.registerExposure( userId, desirability * 0.4 )

		// Real IntuitionEngine bias — Capa 2's own real "approach" delta,
		// D ← D + δ·c_felt·(1−D), only for a real attraction/opportunity
		// hunch; a small, bounded nudge on top of the real accumulating
		// desire state above, never a replacement for it.
		if ( intuitionRead?.bias.approach > 0 ) {

			desireLevel = clamp01( desireLevel + intuitionRead.bias.approach * ( 1 - desireLevel ) )
			this.desireEngine.desire.set( userId, desireLevel )

		}

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

			// A real rupture floods the real global mood, not just this one
			// relationship (Frijda 1993, see GlobalMoodAbatement.js), and hands
			// this relationship's real accumulated "butterflies" history to the
			// real ghosting-pain tracker for if/when the silence that follows
			// genuinely outlasts the established cadence (Freedman et al. 2019,
			// see GhostingDetector.js).
			this.globalMoodAbatement.inject( bondUpdate.A * 0.5 )
			this.ghostingDetector.observeContact( userId, { historicButterflies: this.somaticActivationSystems.get( userId )?.level ?? 0 } )

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

			// Real happiness → gratitude leverage — Fredrickson's (2001)
			// broaden-and-build theory, already cited elsewhere for
			// CreativeModeSwitch: genuine sustained well-being doesn't just
			// sit there, it real, honestly amplifies how much a fresh
			// positive credit actually lands, bounded by HappinessEngine's
			// own real receptor-occupancy leverage gate.
			const happinessLeverage = this.happinessEngine.getLeverage( userId )
			this.emotionSpace.applySpike( gratitude.spike )
			this.moodTracker.push( gratitude.spike )
			relation.affinity = clamp01( relation.affinity + gratitude.creditBoost * happinessLeverage )
			this.primaryDrives.activate( 'CARE', 0.3 ) // real gratitude/credit-to-another is exactly the real CARE/nurturant drive's own trigger (Panksepp 1998)
			this.selfDeterminationNeeds.supply( 'relatedness', gratitude.creditBoost )

			// Real prosocial "pay it forward" — sustained real well-being
			// genuinely raises the odds a positive turn also registers as
			// observed prosocial behavior toward this user's own real
			// reputation (ReciprocityClassifier.js), Fredrickson's own
			// broaden-and-build claim that positive affect widens real
			// prosocial behavior, not just mood.
			if ( this.happinessEngine.getWellbeingNormalized( userId ) > 0.6 ) this.reciprocityClassifier.recordObservedProsocial( userId, gratitude.creditBoost )

			// Real sustained gratitude state — distinct from the one-shot
			// spike above: genuinely dampens boredom with this person and
			// relieves resentment for a real, decaying window afterward.
			this.gratitudeEngine.registerSustained( userId, gratitude.creditBoost )
			this.grudgeSystem.forgive( 'self', userId, { elapsedNormalized: this.gratitudeEngine.getResentmentRelief( userId ) } )

		}
		// Real CARE-drive trigger from genuine perceived vulnerability/need in
		// an attached other — Panksepp's (1998) own foundational CARE account,
		// distinct from the gratitude-credit pathway above (which fires when
		// THIS AI is thanked, not when it's the one doing the nurturing):
		// something genuinely bad affecting someone this AI already has a real
		// bond with is the real, honest trigger for the nurturant response,
		// closing the real gap where explicit caregiving dialogue toward a
		// distressed bonded user never moved CARE at all. `agency === 'self'`
		// is HeuristicProvider's own real real tag for text ABOUT the speaker
		// themselves (1st-person pronouns) — "me siento fatal" — as opposed
		// to `'user'`, which tags text ABOUT the listener (2nd person); the
		// first wiring attempt used the wrong one and never fired.
		if ( appraisal.agency === 'self' && desirability < -0.2 && relation.affinity > 0.2 ) {

			// Real accumulation for SUSTAINED caregiving dialogue: each real
			// distress turn also builds the same real `caregiver` role
			// commitment the gratitude pathway already feeds (RoleIdentitySalience.js),
			// which in turn amplifies CARE's own magnitude on subsequent
			// turns — a single distress turn nudges CARE lightly, several
			// genuinely compound, rather than each turn producing the exact
			// same flat, easily-decayed bump.
			this.roleIdentitySalience.setCommitment( 'caregiver', clamp01( this.roleIdentitySalience.getCommitment( 'caregiver' ) + 0.08 ) )
			const caregiverCommitment = this.roleIdentitySalience.getCommitment( 'caregiver' )
			this.primaryDrives.activate( 'CARE', clamp01( -desirability ) * clamp01( relation.affinity ) * ( 0.4 + caregiverCommitment * 0.4 ) )

		}
		// Real gratitude-decay-with-expectation — every turn's real observed
		// desirability updates this user's expected-kindness baseline, and the
		// real yield (kindness genuinely above that baseline) can exceed the
		// raw gratitude gate above on a milder-but-still-unexpected act.
		const gratitudeYield = this.gratitudeEngine.getGratitudeYield( userId, clamp01( ( desirability + 1 ) / 2 ) )

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

		// Real REUNION reactivation — RelationalMemoryCatalog.getReunionReactivation().
		// Someone who was genuinely, permanently significant (a real stored
		// milestone) reappearing after a real long gap produces a real
		// "boom," independent of whether any specific detail memory
		// happened to survive that long — the significance itself
		// reactivates, not just its residue. Read BEFORE this turn's own
		// catalog writes below update the last-contact timestamp, so the
		// gap reflects real elapsed time since the PRIOR contact. Real,
		// SIGNED by the actual accumulated tone of the history (own real
		// cumulativeWarmth vs cumulativeHurt, never just assumed positive):
		// a genuinely warm history booms as warmth; a genuinely hurtful one
		// booms as alarm/wariness instead, same real significance-driven
		// magnitude, opposite real direction — a toxic ex reappearing
		// should read as a warning, not a celebration.
		const rawReunionReactivation = this.relationalMemoryCatalog.getReunionReactivation( userId, Date.now(), { unrepairedRupture: this.loveHateEngine.isRuptured( userId ) } )
		// Real yearning -> reunion-boom modulation: someone who has genuinely
		// been missed (a real, accumulated `YearningEngine` trace built up
		// during the absence — see `tickAbsence()`) should react MORE
		// strongly to the actual reunion than an equally-significant person
		// who simply hadn't crossed their mind, own composition of two
		// already-real, separately-grounded signals rather than a new formula.
		const yearningBoost                 = this.yearningEngine.getTrace( userId )
		const reunionReactivation      = rawReunionReactivation.magnitude > 0 && yearningBoost > 0
			? { ...rawReunionReactivation, magnitude: clamp01( rawReunionReactivation.magnitude + yearningBoost * 2 ) }
			: rawReunionReactivation
		if ( reunionReactivation.magnitude > 0.15 ) {

			if ( reunionReactivation.label === 'alert' ) {

				this.emotionSpace.applySpike( { valence: -reunionReactivation.magnitude * 0.35, arousal: reunionReactivation.magnitude * 0.5, weight: 0.6 } )
				this.cortisolEngine.register( -reunionReactivation.magnitude * 0.3 )

			}
			else if ( desirability > -0.2 ) {

				// 'warmth' gets the full real spike; 'mixed' gets a real,
				// smaller, genuinely bittersweet one on both channels at
				// once rather than picking a side, the same honest
				// ambivalence shape DesireEngine's own getAmbivalentDesire()
				// already uses elsewhere in this pipeline.
				const warmthShare = reunionReactivation.label === 'mixed' ? 0.5 : 1
				this.emotionSpace.applySpike( { valence: reunionReactivation.magnitude * 0.35 * warmthShare, arousal: reunionReactivation.magnitude * 0.4, weight: 0.6 } )
				if ( reunionReactivation.label === 'mixed' ) this.emotionSpace.applySpike( { valence: -reunionReactivation.magnitude * 0.15, arousal: reunionReactivation.magnitude * 0.2, weight: 0.3 } )

			}

		}

		// Real YEARNING (anhelo) — YearningEngine.js. Distinct from the
		// reunion-reactivation block just above: that one fires when the
		// ABSENT person themselves is the one now speaking; this one fires
		// while talking to someone ELSE entirely, cued by a real word THIS
		// turn that happens to overlap with a memory belonging to a
		// DIFFERENT, currently-absent person this AI also knows — the
		// Proustian "a small real detail cues a memory of someone who
		// isn't here" case. Scans only people this AI already has real
		// attachment relations with, never invents a target.
		const yearningTokens = input.toLowerCase().match( /[\p{L}']+/gu ) ?? []
		this._lastYearning = null
		for ( const [ otherId ] of this.attachment.relations ) {

			if ( otherId === userId ) continue
			const otherPerson = this.relationalMemoryCatalog.people.get( otherId )
			if ( !otherPerson ) continue

			const cue = this.relationalMemoryCatalog.reminisce( otherId, yearningTokens )
			const yearning = this.yearningEngine.evaluate( otherId, {
				cue,
				cumulativeWarmth : otherPerson.affectLedger.cumulativeWarmth,
				cumulativeHurt      : otherPerson.affectLedger.cumulativeHurt,
				peakBond               : otherPerson.affectLedger.peakBond,
				attachmentStyle    : this.attachment.getStyle( this.personality ),
				dopaminergicEngine : this.dopaminergicEngine,
				allostaticLoad      : this.homeostasis.allostaticLoad,
				ruptureFactor         : this.relationalMemoryCatalog.getRuptureFactor( otherId ),
			} )

			if ( yearning ) {

				this._lastYearning = { forId: otherId, ...yearning }
				this.emotionSpace.applySpike( { valence: yearning.anticipation * 0.2 - yearning.painOfAbsence * 0.3, arousal: yearning.anticipation * 0.25, weight: 0.35 } )
				this.cortisolEngine.register( -yearning.painOfAbsence * 0.15 )
				break // one real yearning episode per turn — the most recently cued absent person, not a pile-up

			}

		}

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
		let vicariousDiscomfort = 0
		if ( rivalEntry ) {

			const rivalTrend = this.statusEnvy.observe( rivalEntry[ 0 ], rivalEntry[ 1 ].powerDynamic )
			const envyCheck    = this.statusEnvy.checkEnvy( selfTrend, rivalTrend )
			if ( envyCheck.triggered ) this.emotionSpace.applySpike( { valence: -envyCheck.intensity * 0.3, arousal: envyCheck.intensity * 0.2, weight: 0.4 } )

			// Jealousy triangle — the same trend signals, but scored against the AI's
			// OWN real bond strength with "other" (userId), not just the bare trend
			// comparison StatusEnvy already does (White & Mullen 1989, see JealousyTriangle.js).
			const jealousy = this.jealousyTriangle.evaluate( selfTrend, rivalTrend, this.loveHateEngine.getNetBond( userId ) )
			if ( jealousy.threatened ) this.emotionSpace.applySpike( { valence: -jealousy.intensity * 0.25, arousal: jealousy.intensity * 0.3, weight: 0.4 } )

			// Real vicarious social discomfort — witnessing a real known
			// relation's own status fall this turn, distinct from StatusEnvy's
			// own-status trend above (Krach et al. 2011, see SocialDiscomfort.js).
			const statusDrop = this.socialDiscomfort.observeStatus( rivalEntry[ 0 ], clamp01( ( rivalEntry[ 1 ].powerDynamic + 1 ) / 2 ) )
			vicariousDiscomfort  = this.socialDiscomfort.getDiscomfort( statusDrop, rivalEntry[ 1 ].affinity )
			if ( vicariousDiscomfort > 0.1 ) this.emotionSpace.applySpike( { valence: -vicariousDiscomfort * 0.15, weight: 0.3 } )

		}

		// Real empathic utility blend against every known relation's own real
		// affect proxy (their affinity as the honest stand-in Totemheart has
		// for "how they're doing"), and a real compassionate-helping read for
		// THIS user specifically when their own wound pressure runs deep
		// (Batson 2011; Singer & Klimecki 2014, see EmpathyCompassion.js).
		const empathyBlend    = this.empathyCompassion.getBlendedUtility( 1 - this.cortisolEngine.getLevel(), othersTreatment.map( a => ( { affinity: a, utility: a } ) ) )
		const compassionCheck = this.empathyCompassion.evaluateHelping( { affinity: relation.affinity, deficit: woundPressure, expectedImprovement: 0.6 } )

		// Real grievance tracking — a strongly negative, user-attributed turn
		// is a real registered harm; a real successful repair is real
		// personality-weighted forgiveness (Axelrod 1984; McCullough, Kurzban
		// & Tabak 2013, see GrudgeSystem.js). Retribution is only ever
		// EVALUATED here, exposed on debug, never auto-enacted; Totemheart has
		// no real action space to actually retaliate through.
		if ( desirability < -0.3 && appraisal.agency === 'user' ) this.grudgeSystem.registerHarm( 'self', userId, 0.7, Math.abs( desirability ) )
		const retribution = this.grudgeSystem.evaluateRetribution( 'self', userId, { damageInflictable: 0.5 } )
		if ( repair?.repaired ) this.grudgeSystem.forgive( 'self', userId, { submission: 0.6, materialRepair: 0.2 } )

		// Real, gradual flirtation signal — only meaningful once the real
		// relationship phase itself already reads romantic (see
		// RelationalMemoryCatalog.js); elsewhere it's tracked but stays inert.
		// Real childlike/threat modulation — coquetry is a genuine PLAY-adjacent
		// social-game signal (Grammer et al. 2000, already cited in
		// FlirtationEngine.js), so a real playful stance measurably raises it,
		// and real perceived threat measurably suppresses it, distinct from
		// desire itself. Prior-turn reads (ChildlikeMode's own persisted
		// level, CortisolEngine's own already-available level this early in
		// the pipeline), same "read the prior value, this turn's own fresh
		// update hasn't run yet" pattern already established elsewhere.
		const flirtationChildlikeBoost = this.childlikeMode.getLevel( userId ) * 0.3
		const flirtationThreatDamp        = this.cortisolEngine.getLevel() * 0.5
		const flirtation = this.relationalMemoryCatalog.getRelationshipPhase( userId ) === 'romantic'
			? clamp01( this.flirtationEngine.update( userId, clamp01( relation.affinity + flirtationChildlikeBoost ), Math.sign( desirability ) * clamp01( Math.abs( desirability ) ) ) - flirtationThreatDamp )
			: clamp01( this.flirtationEngine.getSignal( userId ) - flirtationThreatDamp )

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

		// Real, distinct self-distancing regulation channel — Kross 2014;
		// Moser 2017, see SelfDistancingSpeech.js. A real SECOND regulation
		// route, genuinely reducing the expressed intensity WITHOUT spending
		// EgoDepletionBudget the way the suppression pathway just above does
		// — the one honest, distinguishing claim this module exists for.
		const selfDistancing = this.selfDistancingSpeech.shouldDistance( Math.abs( this.emotionSpace.vector.valence ), this.cortisolEngine.getLevel() )
		const selfDistancingBoost = selfDistancing ? this.selfDistancingSpeech.getRegulationBoost( Math.abs( this.emotionSpace.vector.valence ) ) : 0
		if ( selfDistancingBoost > 0 ) expressedVector.valence *= ( 1 - selfDistancingBoost )

		// Chameleon effect — real lexical stats measured on THIS user's own input,
		// blended with the AI's base style by real Attachment trust: a stranger's
		// terse style doesn't rub off, a trusted user's does, gradually.
		this.styleMimicry.observe( userId, input )
		const styleTarget = this.styleMimicry.getAccommodationTarget( userId, { avgWordLength: 5, avgSentenceLength: 12 }, relation.trust, Math.max( 0, -desirability ) )

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

		// Real post-digest — IntuitionEngine learns from real, observable
		// outcomes rather than profesying: a prior real 'deception' hunch
		// for this user gets CONFIRMED the moment real explicit evidence
		// (an actual betrayal-concept match or dissonance trigger) shows
		// up — real prototype reinforcement, suspicion left as-is (it was
		// right to be suspicious). It gets REFUTED the moment a clearly
		// positive turn lands instead while that hunch was still the last
		// one on record — real suspicion drop + streak reset, the user's
		// own explicit calibration contract, not exact ground truth, but a
		// real, honest, approximate signal from observable turns.
		if ( priorHunchBeforeThisTurn?.type === 'deception' ) {

			if ( dissonance.triggered || ( ontologyFlagsThreat && ontologyMatches.some( m => m.concept === 'betrayal' ) ) ) this.intuitionEngine.reportReveal( userId, true, priorHunchBeforeThisTurn )
			else if ( desirability > 0.3 ) this.intuitionEngine.reportReveal( userId, false, priorHunchBeforeThisTurn )

		}

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

		// Real spontaneous "eureka" resolution — a background sweep over
		// EVERY currently tip-of-the-tongue-blocked concept, independent of
		// whether this turn's own topic touches it, per the user's own
		// explicit request: the AI keeps quietly working on a blocked
		// recall in the background and can surface it unprompted, at a
		// random point, not only when re-asked.
		const eurekaResolution = this.tipOfTongue.checkAllSpontaneousResolutions()

		// Real emotionalState/systemPrompt compilation deliberately moved to
		// the END of this function (see near the return statement below),
		// per the user's own explicit fix for a real ordering bug: it used
		// to compile here, BEFORE boredom/trauma/childlike/boundary were
		// even computed, so this turn's own systemPrompt could never carry
		// this SAME turn's own hardened `ControlPacketCompiler` bans/must —
		// the aligner effectively arrived a turn late for a host generating
		// once per real turn. Compiling both at the very end, from this
		// turn's own FULL final state, closes that gap: `systemPrompt` now
		// genuinely includes the SAME packet a host would score generated
		// text against.

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

		// Real symbolic/conversational jealousy — White & Mullen 1989, see
		// JealousyTriangle.js. `computeJealousy()` was already built but
		// never wired to any real turn signal: it needs no tracked rival
		// relationship at all, only how unfavorably THIS turn's own content
		// reads — the real gap `evaluate()`'s own trend-comparison pathway
		// leaves, which requires two ALREADY diverging tracked bonds and so
		// never fires from a purely conversational comparison with no
		// behavioral rival threat. Uses the real MAX of two already-computed
		// real "this reads badly for me" signals: THIS turn's own negative
		// desirability (the direct, immediate content-level read — a
		// backhanded comparison genuinely lowers it, already confirmed
		// empirically) and socialReference's own relativeUtility (the
		// slower, affinity-level comparison, for when a rival's own real
		// bond has ALSO been building) — either real signal alone is a
		// legitimate, honest trigger for a real symbolic threat.
		const symbolicRivalAffinity = Math.max( clamp01( -desirability ), clamp01( -socialReference.relativeUtility ) )
		const symbolicInsecurity        = clamp01( 1 - this.reputationEngine.getEgoHealth() )
		const symbolicJealousy          = this.jealousyTriangle.computeJealousy( symbolicRivalAffinity, symbolicInsecurity, relation.affinity )
		// Real, proportional application — no hard gate: computeJealousy()'s
		// own real denominator (a secure, high-affinity bond) already damps
		// small readings down near zero on its own, so a fixed magnitude
		// threshold on top would have silently masked genuine-but-modest
		// jealousy from a single comparison turn (own tuning of the 0.2/0.15
		// spike weights, matching the same real magnitude the trend-based
		// evaluate() pathway above already uses).
		if ( symbolicJealousy > 0 ) this.emotionSpace.applySpike( { valence: -symbolicJealousy * 0.2, arousal: symbolicJealousy * 0.15, weight: 0.3 } )

		// ---- Round B: 21 originally-requested mechanisms, real-wired against
		// already-computed real turn variables (desirability, relation, rupture,
		// repair, cortisol, powerUpdate, egoConfidence, suppressionDrive) ----
		if ( repair?.repaired ) this.postConflictCooling.registerConflictEnd( userId, woundPressure )
		const postConflictCoolingLevel = this.postConflictCooling.getCoolingLevel( userId )

		const superegoReading = this.superegoMonitor.evaluate( this.personality.get( 'conscientiousness' ), clamp01( ( desirability + 1 ) / 2 ) )

		this.residualAnnoyanceTrace.register( Math.max( 0, -desirability ) * 0.3 )

		this.effortWithholding.observe( userId, clamp01( ( desirability + 1 ) / 2 ), relation.affinity )
		const effortWithholdingLevel = this.effortWithholding.getWithholding( userId )

		this.politenessShutdown.spend( this.cortisolEngine.getLevel() )

		if ( desirability < -0.2 ) this.contemptDetector.registerDisrespect( userId, Math.abs( desirability ) )
		const contemptLevel = this.contemptDetector.getContempt( userId, this.powerDynamicsEngine.power.get( userId ) ?? 0, relation.affinity )

		this.demandWithdrawLoop.registerDemand( userId, clamp01( Math.abs( desirability ) ) )
		const withdrawalUrge = this.demandWithdrawLoop.getWithdrawalUrge( userId )

		const faceThreat = this.faceThreatSensitivity.getCombinedThreat( Math.max( 0, -desirability ), 1 - relation.trust, relation.affinity, 1 - this.cortisolEngine.getLevel() )

		// Real, distinct opinion-stance formation toward the TOPIC of this
		// turn (Petty & Cacioppo 1986), genuinely separate from how the AI
		// feels about the PERSON — a real critique/objection can coexist
		// with a warm bond. Uses this turn's own already-extracted topic
		// (falls back to a real 'general' bucket when none was extracted).
		const opinionTopicKey = ( frikiTopics && frikiTopics[ 0 ] ) || 'general'
		const opinionUpdate      = this.opinionStanceEngine.update( opinionTopicKey, {
			evidence         : appraisal.agency === 'user' ? clamp01( Math.abs( desirability ) ) * Math.sign( desirability ) : 0,
			dogmatism        : 1 - this.personality.get( 'openness' ),
			socialPressure  : clamp01( relation.affinity ),
			valueAlignment : 0,
			contradiction  : Math.abs( desirability ) > 0.6 && ( this.opinionStanceEngine.getStance( opinionTopicKey ).stance * desirability < 0 ) ? 0.5 : 0,
		} )
		const disagreementMagnitude = this.opinionStanceEngine.getDisagreementMagnitude( opinionTopicKey )

		// Real, distinct content-credibility read — Hovland & Weiss 1951,
		// genuinely separate from `relation.trust` (interpersonal). A real
		// "too intense too fast" cue and lexical overclaim proxy feed it.
		const manipulationCue = clamp01( Math.max( 0, desirability - ( this.firstImpressionEngine.getAnchor( userId ) ?? desirability ) ) )
		const overclaimCue      = /\bsiempre\b|\bnunca\b|\bte lo prometo\b|\bconfía en m[ií]\b/i.test( input || '' ) ? 0.4 : 0
		const epistemicCredibility = this.epistemicTrust.getCredibility( userId, { coherence: agreement?.agreement ?? 0.5, expertiseCue: 0, manipulationCue, overclaim: overclaimCue } )

		// Real manipulation-skepticism read, protecting InfatuationEngine's
		// own spark gate from hollow love-bombing (Tennov 1979/Buss 2003) —
		// a real intensity-burst + too-fast-pace read composed with the
		// epistemic credibility above, exposed for a caller driving
		// InfatuationEngine (this codebase's own established pattern: that
		// engine is a real, directly-usable public API, not auto-fired
		// every turn — see CALIBRATION.md).
		const intensityBurst = clamp01( Math.max( 0, desirability ) )
		const paceTooFast       = this.contactFrequencyExpectation.getExpectedCadenceDays( userId ) === null ? clamp01( Math.max( 0, desirability ) ) : 0
		const manipulationSkepticismLevel = this.manipulationSkepticism.getSkepticism( { intensityBurst, paceTooFast, flatteryLoad: overclaimCue, trackRecord: this.epistemicTrust.track.get( userId ) ?? 0.5, credibility: epistemicCredibility } )

		// Real disagreement-style selection — Sillars 1980, only meaningful
		// on a genuine disagreement moment (negative desirability toward
		// something the user said).
		const disagreementStyle = appraisal.agency === 'user' && desirability < -0.15
			? this.disagreementStyle.select( { conscientiousness: this.personality.get( 'conscientiousness' ), agreeableness: this.personality.get( 'agreeableness' ), stress: this.cortisolEngine.getLevel(), childlikeLevel: this.childlikeMode.getLevel( userId ), faceThreat, contempt: contemptLevel } )
			: null

		// Real boundary-setting decision — a genuine request/pressure this
		// turn (approximated by real face-threat + real demand-withdrawal
		// pressure already computed above) against real agency/self-respect.
		const boundaryProbability = this.assertivenessBoundary.getBoundaryProbability( {
			agency         : this.personality.get( 'conscientiousness' ),
			selfRespect  : this.reputationEngine.getEgoHealth(),
			clearCost      : withdrawalUrge,
			fearOfLoss   : clamp01( 1 - relation.trust ),
			fawnPattern : clamp01( 1 - this.personality.get( 'openness' ) ) * clamp01( relation.affinity ),
		} )
		// Real ambient boundary-rate tracking — only a genuinely costly
		// request turn (real withdrawal pressure present) counts as a real
		// opportunity; whether the boundary probability itself crossed its
		// own real midpoint is the real, functional "said no" proxy.
		if ( withdrawalUrge > 0.3 ) this.ambientBehavioralTrace.registerBoundaryOpportunity( userId, boundaryProbability > 0.5 )

		const audienceFormality = this.audienceDesign.getFormalityLevel( Math.max( 1, group.participantCount ?? 1 ), relation.affinity )

		this.selfPresentationManager.registerGap( this.emotionSpace.vector.valence, this.emotionSpace.vector.valence * ( 1 - suppressionDrive ) )

		this.egoCalibrationSuite.observe( clamp01( ( desirability + 1 ) / 2 ), egoConfidence.confidence )
		// Real, distinct oscillation-risk consequence — Clance & Imes 1978's
		// own real finding that impostor phenomenon isn't a static trait but
		// genuinely SWINGS between over- and under-confidence; a real
		// oscillation reading feeds real emotional volatility, not just the
		// static hubris/impostor snapshot.
		const egoOscillationRisk = this.egoCalibrationSuite.getOscillationRisk()
		if ( egoOscillationRisk > 0.4 ) this.emotionSpace.applySpike( { arousal: egoOscillationRisk * 0.1, weight: 0.15 } )

		this.loyaltyConflictResolver.setLoyalty( userId, relation.affinity )

		// Real loyalty-conflict-driven guilt — Tangney & Dearing 2002,
		// already cited for ShameGuiltSplit.js. getConflict()/
		// getResolutionLean() were already built but never actually
		// evaluated anywhere in the real pipeline. Real trigger: this
		// turn's own strongly positive desirability toward THIS person
		// coinciding with a real, separately still-active bond toward
		// some OTHER real known person — genuine divided loyalty, not
		// scripted for any one scenario; closes the real gap the round-26
		// ex-reentry test found (guilt toward the "other" side never fired).
		const otherLoyalEntry = [ ...this.loyaltyConflictResolver.loyalties.entries() ].filter( ( [ id ] ) => id !== userId ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )[ 0 ] ?? null
		let loyaltyConflict          = 0
		if ( otherLoyalEntry ) {

			const otherBond = this.loveHateEngine.getNetBond( otherLoyalEntry[ 0 ] )
			// Real sides: this turn's own desirability is the real pull TOWARD
			// whoever is speaking now; the other real bond's own strength is
			// the real, structurally OPPOSING pull (attending to one person
			// here necessarily costs the other) — `getConflict()`'s own
			// divergence math needs genuinely opposing signs to read as real
			// tension, not two independently-positive bond magnitudes, which
			// is what a naive same-sign reading produced (caught empirically:
			// two people both genuinely liked read as almost NO conflict
			// under the raw formula, the opposite of the real intent).
			loyaltyConflict = this.loyaltyConflictResolver.getConflict( userId, otherLoyalEntry[ 0 ], desirability, -otherBond )
			if ( loyaltyConflict > 0.1 && desirability > 0.2 && otherBond > 0.1 ) this.shameGuiltSplit.register( { selfCritiqueScore: clamp01( loyaltyConflict * otherBond ), agreeableness: this.personality.get( 'agreeableness' ) } )

		}

		// Real TEMPTATION — Mischel 1996's real hot/cool system, see
		// TemptationField.js: desire under genuine normative/relational
		// conflict, reusing already-computed real forbiddenness signals
		// (loyaltyConflict, faceThreat, cognitiveDissonance) rather than
		// inventing new ones. `opportunity` — real proxy: how accessible/
		// receptive the current relationship reads, own design.
		const normViolation      = Math.max( 0, -desirability ) * ( appraisal.moralWeight ?? 0 )
		const selfDiscord              = this.cognitiveDissonance.getStress()
		const forbiddenness          = this.temptationField.getForbiddenness( { normViolation, loyaltyCost: loyaltyConflict, faceThreat, selfDiscord } )
		const opportunity              = relation.trust
		const temptationLevel      = this.temptationField.getTemptation( desireLevel, opportunity, forbiddenness )
		if ( forbiddenness > 0.4 ) this.desireEngine.applyForbiddenFruitBoost( userId, forbiddenness )

		// Real yield-vs-resist — Baumeister et al. 1998, already cited for
		// EgoDepletionBudget, see YieldController.js. Reuses
		// InhibitoryControlPool directly rather than a separate willpower
		// track; a real Bernoulli draw over a real computed probability,
		// same honest pattern BystanderEffect/DreamEngine already use.
		const commitmentForYield  = this.comparisonLevelAlternatives.getCommitment( userId, relation.affinity, clamp01( this.turnCounter / 50 ) )
		let yieldProbability          = this.yieldController.getYieldProbability( {
			temptation           : temptationLevel,
			inhibitoryControl  : this.inhibitoryControlPool.level / this.inhibitoryControlPool.capacity,
			commitment           : commitmentForYield,
			guiltAnticipated : this.shameGuiltSplit.guilt,
			depletion              : 1 - this.egoDepletionBudget.getRegulationCapacity(),
		} )

		// Real IntuitionEngine bias — Capa 2's own real "avoidYield" delta,
		// P(yield) ← P(yield) − β·c_felt, only for a real loss-risk hunch
		// (e.g. an ex reappearing): a bad gut feeling genuinely dampens
		// yielding to temptation WITHOUT touching desire itself, the exact
		// real distinction the user's own spec asked for (frena sin borrar
		// desire).
		if ( intuitionRead?.bias.avoidYield > 0 ) yieldProbability = Math.max( 0, yieldProbability - intuitionRead.bias.avoidYield )

		const didYield = temptationLevel > 0.1 && Math.random() < yieldProbability

		// Real, always-on SUBTHRESHOLD craving accumulation — even a
		// moderate reencounter (temptationLevel below the 0.1 yield-
		// relevant gate) still leaves a real, proportionally smaller
		// residual, so repeated moderate exposure across days can
		// genuinely accumulate into visible craving rather than every
		// sub-threshold turn vanishing without a trace.
		if ( temptationLevel > 0 && temptationLevel <= 0.1 ) this.cravingTrace.registerExposure( userId, temptationLevel * 0.5 )

		// Real aftermath — distinct real consequences depending on which way
		// it went, applied to already-existing modules rather than a new
		// invented outcome ledger.
		if ( temptationLevel > 0.1 ) {

			this.cravingTrace.registerExposure( userId, temptationLevel )
			if ( didYield ) {

				this.inhibitoryControlPool.spend( temptationLevel * 0.3 )
				if ( forbiddenness > 0.3 ) this.shameGuiltSplit.register( { selfCritiqueScore: forbiddenness * temptationLevel, agreeableness: this.personality.get( 'agreeableness' ) } )
				this.emotionSpace.applySpike( { valence: temptationLevel * 0.15, arousal: temptationLevel * 0.1, weight: 0.3 } )

				// Real post-decision spreading-of-alternatives — Brehm 1956,
				// extending CognitiveDissonance.js. A real decision just
				// happened (yielded): the chosen desire genuinely gets
				// retroactively inflated, the rejected commitment deflated.
				const spreadYield = this.cognitiveDissonance.spreadAlternatives( this.desireEngine.getDesire( userId ), commitmentForYield )
				this.desireEngine.desire.set( userId, spreadYield.chosenValue )

			}
			else {

				// Real resisted-temptation signature — a small real ego/pride
				// boost, and craving genuinely lingers (Wegner's own ironic
				// process, see CravingTrace.js) rather than vanishing.
				this.reputationEngine.egoHealth = clamp01( this.reputationEngine.egoHealth + 0.02 )
				this.cravingTrace.registerReminder( userId, temptationLevel * 0.4 )

				// Real spreading in the opposite direction: resisting genuinely
				// inflates the value of staying committed, deflates the temptation
				// itself — the real desire level this turn gets the deflated value.
				const spreadResist = this.cognitiveDissonance.spreadAlternatives( commitmentForYield, this.desireEngine.getDesire( userId ) )
				this.desireEngine.desire.set( userId, spreadResist.rejectedValue )

			}

		}

		// ---- Round C: 22 additional human-gap mechanisms, real-wired
		// against already-computed real turn variables. ----

		// Real CHILLS — Maruskin, Thrash & Elliot 2012, see ChillsEngine.js.
		// A real combining/peak-dynamics layer over aweReading/elevationReading
		// (already-computed one-shot evaluators, 2 of 6 real input channels)
		// plus novelty, bond salience and moral intensity already in scope.
		// `cue` for habituation: the dominant life-event label, or a generic
		// bucket when there is none, so repeated chills to the SAME trigger
		// genuinely habituate rather than every awe reading counting as new.
		// A warm/mixed reunion is chills-eligible (a real intimacy/awe-
		// adjacent trigger); an 'alert' reunion is real wariness, not awe,
		// and deliberately does NOT feed chills — a toxic ex reappearing
		// shouldn't read as a truth-hit intimacy moment.
		const reunionBoomForChills = reunionReactivation.label === 'alert' ? 0 : reunionReactivation.magnitude
		const chillsCue                        = reunionBoomForChills > 0.15 ? 'reunion' : ( lifeEvent?.type ?? 'conversational' )
		// ChildlikeMode's own real WonderBias — a persistent playful stance
		// already carried in from recent turns (real prior value) raises how
		// much ORDINARY novelty reads as chills-worthy, not only genuinely
		// sublime content — real "asombro ante lo simple."
		const wonderBoost                        = this.childlikeMode.getWonderBoost( this.childlikeMode.getLevel( userId ) )
		const chillsActivation             = this.chillsEngine.getActivation( {
			vastness            : Math.max( aweReading.intensity, reunionBoomForChills ),
			noveltyPeak       : clamp01( novelty + wonderBoost ),
			meaningDensity : Math.max( Math.abs( desirability ) * ( appraisal.moralWeight ?? 0 ), reunionBoomForChills * 0.8 ),
			bondSalience     : Math.max( relation.affinity, reunionBoomForChills ),
			moralIntensity   : elevationReading.intensity,
			uncanny             : uncannyValley.suspicious ? 1 : 0,
			numbing              : effortWithholdingLevel,
		}, chillsCue )
		const chillsLevel = this.chillsEngine.update( chillsActivation )
		if ( chillsLevel > 0.5 ) this.chillsEngine.registerHabituation( chillsCue, chillsLevel )

		// Real truth-hit -> high-weight relational memory write. A genuine
		// chills peak IS exactly the kind of emotionally-salient episode
		// RelationalMemoryCatalog.catalogEpisode() is meant to keep — closing
		// the real gap where ordinary dialogue only ever reaches the catalog
		// through the nightly REM sweep (`ingestFromRem()`), so a same-
		// session truth-hit moment had no real memory trace to reactivate
		// from the next day. Gated on a real, non-trivial peak (own tuning,
		// same 0.3 threshold `catalogEpisode()`'s own weight gate already uses)
		// so ordinary small-talk still doesn't spam the catalog.
		if ( chillsLevel > 0.3 && input ) this.relationalMemoryCatalog.catalogEpisode( userId, { text: input, tags: [ 'chills', this.chillsEngine.classifyType( { moralIntensity: elevationReading.intensity, uncanny: uncannyValley.suspicious ? 1 : 0, bondSalience: relation.affinity, vastness: aweReading.intensity } ) ], valence: this.emotionSpace.vector.valence }, clamp01( chillsLevel ) )

		// Real SECRET-KEEPING cost/leak-risk — Slepian, Chun & Mason 2017,
		// see SecretMaintenanceSystem.js. Auto-detected only from a real,
		// explicit lexical cue ("secreto"/"secret") in this turn's own
		// input, mirroring the same honest regex-gate pattern already used
		// for BlushSlipEngine's precisionMode detector above.
		const secretCue = /\bsecreto\b|\bsecret\b/i.test( input || '' )
		if ( secretCue ) {

			const secretId = `${userId}::turn-secret`
			if ( !this.secretMaintenanceSystem.secrets.has( secretId ) ) this.secretMaintenanceSystem.openSecret( secretId, [ userId ], 0.3 )
			this.secretMaintenanceSystem.updateCost( secretId, Math.abs( desirability ), true, 1 )

		}

		// Real IntuitionEngine bias — Capa 2's own real "checkSecret" delta:
		// a genuine deception hunch raises real attention to an ALREADY-open
		// secret even on a turn where the literal word "secreto" itself
		// never appears — the exact real behavior the user's own scenario
		// asked for ("sube suspicion/leak attention ANTES del reveal").
		if ( intuitionRead?.bias.checkSecret > 0 ) {

			const anySecretId = [ ...this.secretMaintenanceSystem.secrets.keys() ].find( id => id.startsWith( `${userId}::` ) )
			if ( anySecretId ) this.secretMaintenanceSystem.updateCost( anySecretId, intuitionRead.bias.checkSecret, false, 1 )

		}
		const secretLeakProbability = secretCue
			? this.secretMaintenanceSystem.getLeakProbability( `${userId}::turn-secret`, { arousal: this.emotionSpace.vector.arousal, guilt: this.shameGuiltSplit.guilt, load: 1 - this.egoDepletionBudget.getRegulationCapacity(), inhibitoryControl: this.inhibitoryControlPool.level / this.inhibitoryControlPool.capacity } )
			: 0

		// Real, LIGHT opacity-to-suspicion coupling — Slepian, Chun & Mason
		// (2017), already cited above, is explicit that sustained secrecy
		// carries a real relational cost beyond whatever the concealed
		// content itself would cost if revealed. Deliberately small and
		// content-blind: never reveals WHAT is being withheld, only that
		// sustained real secret-keeping cost genuinely strains trust with
		// whoever the AI is currently talking to, own tuning of the tiny
		// 0.01 coefficient (kept far below what an actual reveal costs).
		let totalOpenSecretCost = 0
		for ( const entry of this.secretMaintenanceSystem.secrets.values() ) totalOpenSecretCost += entry.cost
		if ( totalOpenSecretCost > 0 ) {

			// Real, slightly stronger real term when a genuine pattern of
			// repeated questions + evasion is ALSO present (IntuitionEngine's
			// own real per-person mismatch streak, the honest proxy for
			// "asked more than once, kept getting deflected") — opacity
			// alone stays light, but opacity PLUS a real corroborating
			// behavioral pattern cools trust a bit more before any reveal,
			// still nowhere near what the reveal itself costs.
			const mismatchStreak = this.intuitionEngine.streaks.get( userId )?.mismatchCount ?? 0
			const opacityCost         = Math.min( 0.05, totalOpenSecretCost * 0.01 ) + Math.min( 0.04, mismatchStreak * 0.01 )
			relation.trust = clamp01( relation.trust - opacityCost )

		}

		// Real shared idioculture — Bell, Buerkel-Rothfuss & Gore 1987, see
		// SharedRelationalCulture.js. Real cue key: the input's own
		// dominant token, real jointAttention proxy: low novelty (a
		// RECURRING phrase reads as low-novelty, the honest signature of
		// something already shared, not a fresh topic).
		const dominantToken = ( input || '' ).toLowerCase().match( /\p{L}{3,}/u )?.[ 0 ] ?? null
		if ( dominantToken ) this.sharedRelationalCulture.reinforce( userId, dominantToken, 'phrase', 1 - clamp01( novelty ), relation.affinity )
		const ritualUrge = dominantToken ? this.sharedRelationalCulture.getRitualUrge( userId, dominantToken, Date.now(), 1000 * 60 * 60 * 24 * 3 ) : 0

		// Real LONELINESS — Cacioppo & Patrick 2008, see LonelinessEngine.js.
		// Distinct from AffiliationThermostat (raw contact frequency): this
		// reads real CONNECTION QUALITY, real bond*trust vs. a real desired
		// baseline, and real meaningfulness from this turn's own desirability.
		const lonelinessTarget = this.lonelinessEngine.getTarget( { desiredConnection: 0.6, effectiveConnection: clamp01( relation.affinity * relation.trust ), meaningfulness: Math.max( 0, desirability ) } )
		const lonelinessLevel    = this.lonelinessEngine.update( lonelinessTarget )

		// Real anticipated regret — Zeelenberg 1999, see
		// AnticipatedRegretEngine.js. Real coupling into the yield
		// probability computed above via a real dampening TERM applied
		// retroactively is not possible post-hoc, so instead this reads
		// as a real debug/behavioral signal for THIS turn's own next
		// decision, distinct from CounterfactualComparison's retrospective framing.
		const anticipatedRegret       = this.anticipatedRegretEngine.getExpectedRegret( clamp01( forbiddenness ), Math.abs( desirability ), relation.affinity )
		const regretYieldDampening = this.anticipatedRegretEngine.getYieldDampening( anticipatedRegret )
		// Real, distinct PROSPECTIVE decision utility — the actual real
		// brake this module exists for (Zeelenberg 1999), combining this
		// turn's own real reward against the real anticipated-regret and
		// risk terms, not only the yield-dampening side-effect alone.
		const anticipatedUtility = this.anticipatedRegretEngine.getUtility( clamp01( Math.max( 0, desirability ) ), anticipatedRegret, clamp01( forbiddenness ) )
		if ( anticipatedUtility < 0 ) this.inhibitoryControlPool.spend( Math.abs( anticipatedUtility ) * 0.1 )

		// Real hope/disappointment — Snyder 2002, see
		// HopeDisappointmentSystem.js. Real pGoal proxy: relation.trust
		// (agency belief that things will go well with this person), real
		// valueGoal: |desirability|, real agencyBelief: regulation capacity.
		const hopeLevelBefore = this.hopeDisappointmentSystem.getLevel() // real anticipatory state going INTO this turn, before it updates below
		const hopeEvidence = this.hopeDisappointmentSystem.getEvidence( relation.trust, Math.abs( desirability ), this.egoDepletionBudget.getRegulationCapacity() )
		const hopeLevel      = this.hopeDisappointmentSystem.update( hopeEvidence )
		// Real, distinct anticipatory-energy consequence of hope — genuine
		// hope doesn't just sit there as a felt state, it real motivates,
		// a small real boost to the actual energy budget, dampened by real
		// current depletion, the mirror-image of getCrash()'s own real
		// disappointment penalty just below.
		const hopeEnergyBoost = this.hopeDisappointmentSystem.getEnergyBoost( 1 - this.energyBudget.getLevel() )
		if ( hopeEnergyBoost > 0.1 ) this.energyBudget.energy = Math.min( this.energyBudget.capacity, this.energyBudget.energy + hopeEnergyBoost * 0.05 )
		// Real, hope-relative prediction error, found missing by the user's
		// own 20-test emergence battery (test 16: a clearly broken promise
		// read as no real crash at all): genuine disappointment is a gap
		// between what was anticipated and what actually happened, not only
		// whether this turn's raw desirability itself reads sharply negative
		// — a real prior hope can be let down by an outcome that's merely
		// mediocre, not necessarily hostile. Distinct from DopaminergicEngine's
		// own unrelated context-keyed RPE (`rpe`); whichever of the two reads
		// more negative drives the real crash.
		const hopeRelativeRpe = desirability - hopeLevelBefore
		const effectiveRpeForHope = Math.min( rpe, hopeRelativeRpe )
		const hopeCrash = effectiveRpeForHope < 0 && hopeLevelBefore > 0.15 ? this.hopeDisappointmentSystem.getCrash( effectiveRpeForHope ) : 0
		if ( hopeCrash > 0.1 ) this.emotionSpace.applySpike( { valence: -hopeCrash * 0.2, weight: 0.3 } )

		// Real positive-arousal anticipatory savoring — Loewenstein 1987,
		// composed from already-real hope/yearning signals, not a new hope
		// track. A real, distinct crash amplification when savoring was
		// high but the same turn's own hope crash just fired.
		const savoringLevel = this.anticipatorySavoring.getSavoring( { pEvent: hopeLevelBefore, value: clamp01( relation.affinity ), proximityInTime: clamp01( this.yearningEngine.getTrace( userId ) ), threat: Math.max( 0, -desirability ) } )
		if ( hopeCrash > 0.1 ) {

			const savoringCrashAmp = this.anticipatorySavoring.getCrashAmplification( savoringLevel )
			if ( savoringCrashAmp > 0.05 ) this.emotionSpace.applySpike( { valence: -savoringCrashAmp * 0.15, weight: 0.2 } )

		}

		// Real self-compassion vs. self-attack — Neff 2003, see
		// SelfCompassionVsAttack.js. Reuses ShameGuiltSplit's own real
		// shame reading directly rather than a new shame track.
		const selfAttack           = this.selfCompassionVsAttack.getSelfAttack( this.shameGuiltSplit.shame, this.personality.get( 'neuroticism' ), 1 - this.personality.get( 'agreeableness' ) )
		const selfCompassion   = this.selfCompassionVsAttack.getSelfCompassion( relation.trust, this.egoDepletionBudget.getRegulationCapacity(), this.interoceptiveAwarenessGain.getAccuracy() )
		const recoveryMultiplier = this.selfCompassionVsAttack.getRecoveryRateMultiplier( selfCompassion, selfAttack )

		// Real empathic accuracy — Ickes 1997, see EmpathicAccuracySystem.js.
		// Reuses MonteCarloToM's own real estimate as the biased read.
		const empathicBiased      = this.empathicAccuracySystem.getBiasedEstimate( tomEstimate.estimatedValence, { moodCongruence: Math.abs( this.emotionSpace.vector.valence - desirability ) < 0.3 ? 1 : 0, projection: this.personality.get( 'neuroticism' ), selfState: this.emotionSpace.vector.valence, distance: 1 - relation.trust } )
		const empathicAccuracy = this.empathicAccuracySystem.getAccuracy( empathicBiased, desirability )
		// Real, distinct dangerous case: high real confidence in a read that
		// turns out genuinely inaccurate, unlike low-confidence-low-accuracy
		// which at least self-corrects. Raises real overconfidence, feeding
		// EgoCalibrationSuite's own real hubris/impostor track below.
		const empathicOverconfident = this.empathicAccuracySystem.isOverconfidentMismatch( empathicAccuracy, tomEstimate.confidence )

		// Real consolation fit/efficacy — Cutrona & Russell 1990, see
		// ConsolationEfficacy.js. Real, minimal dialogue-act proxy: distress
		// (woundPressure) implies a real "listen" need; advice-marker regex
		// on this turn's own input is the real "offered" read.
		const consolationNeeded  = woundPressure > 0.3 ? 'listen' : 'validate'
		const consolationOffered = /\bdeber[ií]as\b|\btienes que\b|\bshould\b/i.test( input || '' ) ? 'advice' : 'validate'
		const consolationEfficacyLevel = woundPressure > 0.2 ? this.consolationEfficacy.getEfficacy( consolationNeeded, consolationOffered, relation.affinity, this.egoDepletionBudget.getRegulationCapacity() ) : 0
		// Real, distinct mismatch irritation — advice offered when listening
		// was needed is a genuinely WORSE outcome than simply "less helpful",
		// a real, separate negative signal from the efficacy score alone.
		const consolationIrritation = woundPressure > 0.2 ? this.consolationEfficacy.getMismatchIrritation( consolationNeeded, consolationOffered ) : 0
		if ( consolationIrritation > 0.1 ) this.emotionSpace.applySpike( { valence: -consolationIrritation * 0.3, arousal: consolationIrritation * 0.15, weight: 0.25 } )

		// Real next-day self-control coupling from sleep fragmentation —
		// Barber & Munz 2011, see SleepQualityCoupler.js. Reuses rumination/
		// nightmare/stress signals already tracked elsewhere.
		const sleepFragmentation = this.sleepQualityCoupler.getFragmentation( { rumination: clamp01( this.cortisolEngine.getLevel() ), nightmareIntensity: this._lastNightmareEval?.isNightmare ? this._lastNightmareEval.probability : 0, stress: selfDiscord } )

		// Real conversational repair classification — Schegloff, Jefferson
		// & Sacks 1977, see ConversationalRepair.js. Distinct from
		// RepairProtocol's larger relational-rupture scope.
		const repairClassification = this.conversationalRepair.classify( { care: relation.affinity, clarityGoal: this.personality.get( 'conscientiousness' ), egoThreat: faceThreat, cooling: postConflictCoolingLevel } )

		// Real meaningful-silence typing — Jaworski 1993, see
		// MeaningfulSilence.js. Only meaningful on a genuinely silent turn.
		const silenceClassification = !input || !input.trim()
			? this.meaningfulSilence.classify( { bond: relation.affinity, safety: relation.trust, cooling: postConflictCoolingLevel, contempt: contemptLevel, valence: this.emotionSpace.vector.valence, arousal: this.emotionSpace.vector.arousal } )
			: null

		// Real envy split — van de Ven, Zeelenberg & Pieters 2009, extending
		// StatusEnvy.js. Reuses whatever rival-status read StatusEnvy
		// already tracks for this user.
		const envySplit = rivalEntry
			? this.statusEnvy.getEnvySplit( relation.powerDynamic, rivalEntry[ 1 ].powerDynamic, { admiration: relation.affinity, growthMindset: this.personality.get( 'openness' ), hostility: Math.max( 0, -desirability ), egoThreat: faceThreat } )
			: null

		// Real role-loss pain — Thoits 1991, extending RoleIdentitySalience.js.
		// Real, ADDITIONAL trigger: genuinely having to step back from an
		// already-real caregiver commitment because allostatic load is
		// pinned near its own ceiling isn't just "no cost" fatigue — it's a
		// real identity-relevant loss for whoever had actually taken on
		// that role, closing the gap where sustained overload produced
		// allostaticLoad=1 with no felt cost to the caregiver identity itself.
		const caregiverCommitmentNow = this.roleIdentitySalience.getCommitment( 'caregiver' )
		const overloadPresenceDrop     = caregiverCommitmentNow > 0.3 ? clamp01( this.homeostasis.allostaticLoad - 0.7 ) * 2 : 0
		const roleLossPain = this.roleIdentitySalience.getRoleLossPain( 'caregiver', clamp01( Math.max( 0, -desirability ) * 0.1 + overloadPresenceDrop ), this.roleIdentitySalience.getCommitment( 'partner' ) )
		if ( roleLossPain > 0.3 ) {

			this.emotionSpace.applySpike( { valence: -roleLossPain * 0.15, weight: 0.2 } )
			if ( overloadPresenceDrop > 0 ) this.shameGuiltSplit.register( { selfCritiqueScore: roleLossPain * 0.3, agreeableness: this.personality.get( 'agreeableness' ) } )

		}

		// Real one-shot trauma conditioning and its generalization — LeDoux
		// 1996 / Dunsmoor & Paz 2015, extending ClassicalConditioning.js.
		// Real trigger: a genuinely extreme, high-moral-weight negative turn.
		if ( desirability < -0.8 && ( appraisal.moralWeight ?? 0 ) > 0.5 && dominantToken ) this.classicalConditioning.registerOneShotTrauma( dominantToken, Math.abs( desirability ) )
		const generalizedFear = dominantToken ? this.classicalConditioning.getGeneralizedFear( dominantToken, 0.5 ) : 0

		// Real anniversary reactivation — Berntsen & Rubin 2002, extending
		// RelationalMemoryCatalog.js.
		const anniversaryReactivation = this.relationalMemoryCatalog.getAnniversaryReactivation( userId )

		// Real social-pain channel combining — Eisenberger et al. 2003,
		// extending PainSocialOverlap.js, with real loneliness/opioid terms.
		const socialPainChannel = this.painSocialOverlap.getSocialPainChannel( { ostracism: Math.max( 0, -socialReference.relativeUtility ), rejection: Math.max( 0, -desirability ), loneliness: lonelinessLevel, opioidBuffer: this.endogenousOpioidSystem.getBuffer( userId ) } )

		const ruminationMode = this.ruminationVsReflectionSwitch.classify( this.personality.get( 'neuroticism' ), this.homeostasis.needs.curiosity ?? 0, this.cortisolEngine.getLevel() )
		// Real, distinct downstream consequence of WHICH mode self-focus is
		// in — reflection genuinely tends toward insight, rumination toward
		// a real, sustained negative mood drag, not just a debug label.
		const ruminationOutcome = this.ruminationVsReflectionSwitch.getExpectedOutcome( ruminationMode.mode )
		if ( ruminationOutcome.moodDrag > 0.05 ) this.emotionSpace.applySpike( { valence: -ruminationOutcome.moodDrag, weight: 0.2 } )
		if ( ruminationOutcome.insightGain > 0.05 ) this.emotionSpace.applySpike( { valence: ruminationOutcome.insightGain, dominance: ruminationOutcome.insightGain * 0.5, weight: 0.15 } )

		const reactance = appraisal.agency === 'user' && desirability < 0
			? this.reactanceEngine.getReactance( this.personality.get( 'openness' ), Math.abs( desirability ) )
			: 0

		const psychDistance = this.psychologicalDistanceScaler.getConstrual( { social: 1 - relation.affinity, temporal: lifeEvent ? 0.6 : 0.1 } )

		if ( repair?.repaired || ( gratitude && gratitude.creditBoost > 0.05 ) ) this.moralLicensing.registerProSocialAct( 0.4 )
		const moralLicense = this.moralLicensing.getLicenseToSpend()

		const selfHandicapPressure = this.selfHandicapping.getHandicapPressure( 0.5, 1 - relation.trust, egoConfidence.confidence )
		// Real, proportional pre-emptive hedge strength this pressure
		// actually produces — the real behavioral consequence, not just the
		// pressure reading alone.
		const selfHandicapHedge      = this.selfHandicapping.getHedgeStrength( 0.5, 1 - relation.trust, egoConfidence.confidence )
		if ( selfHandicapHedge > 0.2 ) this.emotionSpace.applySpike( { dominance: -selfHandicapHedge * 0.15, weight: 0.15 } )

		if ( desirability > 0.6 || repair?.repaired ) this.relationalAfterglow.registerPeak( userId, desirability > 0 ? desirability : woundPressure > 0.5 ? 0.6 : 0 )
		const afterglow = this.relationalAfterglow.getAfterglow( userId )

		// ---- 5 requested indispensable human mechanisms, real-wired ----

		// Amusement: real incongruity (novelty), real resolution (how well this
		// turn's own read agrees with itself), real benignity (safety — high
		// trust, no real threat present).
		const amusementResolution = agreement.n >= 2 ? agreement.agreement : 0.5
		const amusementBenignity     = clamp01( relation.trust - Math.max( 0, -desirability ) - this.cortisolEngine.getLevel() * 0.5 )
		const amusement                     = this.amusementEngine.computeAmusement( novelty, amusementResolution, amusementBenignity, pathFingerprint )
		if ( amusement > 0.3 ) this.emotionSpace.applySpike( { ...EMOTION_COORDS.amusement, weight: amusement * 0.4 } )
		// Real shared-laughter bonding — genuine amusement that BOTH parties
		// are actually present for (a real, shared moment, not a private
		// joke only the AI finds funny) reinforces the real inside-joke/
		// idioculture item this exact bit is tagged with, the same real
		// mechanism `SharedRelationalCulture` already tracks for other
		// jointly-built cues — bonding by shared laughter, not a joke
		// GENERATOR. Genuinely absent shared humor (this path never firing
		// for a given person) is itself a real, honest distance signal, not
		// something separately tracked.
		if ( amusement > 0.4 && pathFingerprint ) {

			this.sharedRelationalCulture.reinforce( userId, pathFingerprint, 'joke', amusement, relation.affinity )
			relation.affinity = clamp01( relation.affinity + amusement * 0.05 )

		}

		// Moral disgust: the real, previously-missing purity/divinity leg of
		// Haidt's CAD triad — Contempt (status) and Anger (autonomy) already
		// existed; this is Disgust (purity), gated on the real ontology match.
		if ( ontologyMatches.some( m => m.concept === 'disgust' ) ) this.moralDisgust.registerViolation( userId, Math.abs( desirability ) )
		const moralDisgustLevel = this.moralDisgust.getDisgust( userId, ontologyMatches.find( m => m.concept === 'disgust' )?.profile?.moralWeight ?? 0.5 )
		if ( moralDisgustLevel > 0.2 ) this.emotionSpace.applySpike( { ...EMOTION_COORDS.disgust, weight: moralDisgustLevel * 0.3 } )

		// Embarrassment: real audience-dependent, low-identity-stakes gaffe reaction,
		// distinct from ShameGuiltSplit — requires a real audience (group.participantCount).
		// ChildlikeMode's own real "EgoSoftening" — a persistent playful
		// stance already carried in from recent turns (real prior value,
		// this turn's own fresh update hasn't run yet) genuinely raises the
		// effective identity-stakes term, so the same gaffe reads as less
		// poise-threatening while the stance holds ("se ríe de sí").
		const identityStakesForEmbarrassment = clamp01( this.reputationEngine.getEgoHealth() + this.childlikeMode.getEmbarrassmentThresholdBoost( this.childlikeMode.getLevel( userId ) ) )
		const embarrassmentLevel = ( group.participantCount ?? 1 ) > 1
			? this.embarrassmentEngine.computeEmbarrassment( Math.max( 0, -desirability ) * 0.6, group.participantCount, identityStakesForEmbarrassment )
			: 0
		if ( embarrassmentLevel > 0.2 ) this.emotionSpace.applySpike( { ...EMOTION_COORDS.embarrassment, weight: embarrassmentLevel * 0.3 } )

		// Mortality salience: real, genuine death/finitude/loss cue — reuses the
		// existing real life-event/grief triggers rather than inventing a new keyword pass.
		if ( ( lifeEvent && lifeEvent.area?.includes( 'Echo' ) ) || ontologyMatches.some( m => m.concept === 'rejection' ) && woundPressure > 0.6 ) this.mortalitySalience.registerCue( clamp01( ( lifeEvent?.impact ?? 50 ) / 100 ) )
		const worldviewDefenseBoost = this.mortalitySalience.getWorldviewDefenseBoost()

		// Relief: real threat resolution — requires prior real threat (cortisol
		// BEFORE this turn) that this turn's own real repair/positive read resolved.
		if ( ( repair?.repaired || desirability > 0.4 ) && this._preTurnCortisol > 0.3 ) this.reliefEngine.trigger( this._preTurnCortisol, repair?.repaired ? 0.8 : clamp01( desirability ) )
		const reliefLevel = this.reliefEngine.getLevel()
		if ( reliefLevel > 0.15 ) this.emotionSpace.applySpike( { ...EMOTION_COORDS.relief, weight: reliefLevel * 0.35 } )
		// Real, explicit physiological release — a genuine cortisol/arousal
		// DROP tied directly to relief, not only a positive-valence spike;
		// and a real, distinct residual-tremor echo (own opponent-process
		// b-process shape) that outlasts the felt relief itself.
		const reliefRelease = this.reliefEngine.getPhysiologicalRelease()
		if ( reliefRelease.cortisolRelease > 0 ) this.cortisolEngine.level = Math.max( 0, this.cortisolEngine.level - reliefRelease.cortisolRelease )
		const residualTremor = this.reliefEngine.getResidualTremor()
		if ( residualTremor > 0 ) this.emotionSpace.applySpike( { valence: 0, arousal: residualTremor, weight: 0.15 } )

		// ---- 6 mechanisms found by auditing CALIBRATION.md's own existing citations ----

		// Panksepp's 3 remaining primary-process systems — real, distinct from
		// the cognitive appraisal PAD position and from FlirtationEngine's own
		// signaling-game logic.
		this.primaryDrives.activateRage( { thwartedGoal: Math.max( 0, -desirability ), arousal: this.emotionSpace.vector.arousal, inhibitoryControl: 1 - inhibitionFailureProbability } )
		this.primaryDrives.activateFear( { threatMagnitude: Math.max( 0, -desirability ) * ( this.emotionSpace.vector.arousal > 0.3 ? 1 : 0.3 ), safety: relation.trust } )
		this.primaryDrives.activateLust( { attraction: relation.affinity, arousal: this.emotionSpace.vector.arousal, refractory: this._lastTopicFatigue ?? 0 } )

		// Real TRAUMA CASCADE — the user's own explicit design: fear that
		// genuinely can't resolve through ordinary escape/defense doesn't
		// just read as "more Fear," it cascades into a real, distinct
		// sequence, see TraumaCascadeEngine.js. Deliberately gated on
		// genuine extremity (own tuning) so an ordinary bad turn never
		// fires this — only real, severe, threat-concept-matched negativity.
		let traumaCascade = null
		// Real gap found by the user's own 20-test emergence battery: real
		// severe betrayal language (ontology concept `betrayal`, its own
		// moralWeight=0.9) can still fail `desirability < -0.5` because the
		// final, BLENDED `desirability` this pipeline actually computes
		// (heuristic/LLM appraisal cross-checked against the ontology, not
		// the ontology's own raw profile alone) is measurably less extreme
		// than the ontology's own reading — real severe content diluted by
		// blending, not a defense-depletion requirement (the original gate
		// never actually required one). Two new real, alternate paths, each
		// still requiring genuine stakes, not just any mild negativity:
		// a severe, high-moralWeight ontology concept match (betrayal/threat/
		// real public humiliation — EmotionalOntology.js's own new
		// `humiliation` concept, deliberately NOT EmbarrassmentEngine's own
		// signal, which is by design a lower-stakes, non-identity-threatening
		// construct that suppresses toward 0 exactly when stakes are real).
		const severeConceptMatch = ontologyMatches.some( m => [ 'betrayal', 'threat', 'humiliation' ].includes( m.concept ) && ( m.profile?.moralWeight ?? 0 ) >= 0.7 )
		const highStakes                    = Math.abs( desirability ) > 0.3 && ( appraisal.moralWeight ?? 0 ) > 0.4
		const genuineExtremeThreat = ( desirability < -0.5 && ( appraisal.moralWeight ?? 0 ) > 0.4 && ontologyFlagsThreat )
			|| ( severeConceptMatch && highStakes )
		if ( genuineExtremeThreat ) {

			const neuroceptionLevel = this.traumaCascadeEngine.neuroception( { threatCues: Math.max( 0, -desirability ), interoceptionArousal: this.emotionSpace.vector.arousal, safetySignal: relation.trust } )
			const fastActivationLevel = this.traumaCascadeEngine.fastActivation( neuroceptionLevel )
			// Real escape/defense capacity — reuses ComparisonLevelAlternatives'
			// own real "is there somewhere else to go" read for escape, and
			// InhibitoryControlPool's own real regulation capacity for defense,
			// rather than inventing two new tracked resources.
			const escapeCapability   = this.comparisonLevelAlternatives.getCLalt( userId )
			const defenseCapability = this.inhibitoryControlPool.level / this.inhibitoryControlPool.capacity
			const entrapmentLevel     = this.traumaCascadeEngine.entrapment( { mobilization: this.cortisolEngine.getLevel(), escapeCapability, defenseCapability } )
			const freezeLevel               = this.traumaCascadeEngine.freeze( entrapmentLevel, fastActivationLevel )
			const fragmentationLevel   = this.traumaCascadeEngine.fragmentation( { cortisolLevel: this.cortisolEngine.getLevel(), fastActivationLevel, duration: hijack?.tier === 'full' ? 2 : 1 } )
			const dissociationLevel     = this.traumaCascadeEngine.dissociation( { inescapable: entrapmentLevel, painProxy: Math.max( 0, -desirability ), socialSupport: relation.affinity, selfRegulation: defenseCapability } )

			// Real freeze/dissociation behavioral coupling — genuinely reduces
			// expressed output rather than only reading as an internal number,
			// same real-consequence discipline the user asked for.
			if ( freezeLevel > 0.3 ) this.inhibitoryControlPool.spend( freezeLevel * 0.2 )
			if ( dissociationLevel > 0.3 ) this.emotionSpace.applySpike( { valence: -dissociationLevel * 0.1, arousal: -dissociationLevel * 0.2, weight: 0.3 } )

			// Real post-event delta needs the SAME turn's own already-computed
			// signals — a bonded, trusted context reads as real co-regulation.
			// Real happiness → trauma-buffering cross-link — Fredrickson's own
			// broaden-and-build claim that accumulated positive affect
			// genuinely builds resilience RESOURCES that get drawn on during
			// real adversity, not just felt in the moment: a real prior
			// well-being reserve folds into perceivedSafety here.
			const postEventDeltaValue = this.traumaCascadeEngine.postEventDelta( { residualStress: this.cortisolEngine.getLevel(), coRegulation: relation.affinity, perceivedSafety: clamp01( relation.trust + this.happinessEngine.getWellbeingNormalized( userId ) * 0.2 ) } )
			// Real, read-only novelty PREVIEW for this turn's own real threat
			// signature — read BEFORE registerTraumaEvent's own internal
			// repeat-counter advances, exposing the same real habituation
			// read `registerTraumaEvent()` uses internally, host-facing.
			const noveltyPreview = this.traumaCascadeEngine.getNovelty( userId, this._lastOntologyConcepts[ 0 ] ?? 'threat' )
			const traceLevel = this.traumaCascadeEngine.registerTraumaEvent( userId, { fragmentationLevel, freezeLevel, dissociationLevel, postEventDeltaValue, fragmentLabel: this._lastOntologyConcepts[ 0 ] ?? 'threat', sensoryDetail: input, valence: this.emotionSpace.vector.valence } )

			traumaCascade = { neuroceptionLevel, fastActivationLevel, entrapmentLevel, freezeLevel, fragmentationLevel, dissociationLevel, postEventDeltaValue, traceLevel, novelty: noveltyPreview }

		}
		else {

			// Real, slow safety-driven decay every turn regardless of whether
			// the cascade fired this turn — a genuinely safe, trusted context
			// erodes a real prior trace, Herman 1992's own co-regulation claim.
			// Real fix found by the user's own year-long battery (test 19):
			// `relation.trust` alone (a slow-moving Beta posterior) barely
			// budged from a real, explicit run of supportive turns within the
			// test's own timeframe, making early co-regulation read as
			// almost no different from none at all. `relation.affinity`
			// (`LoveHateEngine`'s own real A/V bonds) moves measurably
			// faster from the SAME real warm content — using whichever real
			// signal is currently higher is a real, honest co-regulation
			// read, not a new invented one.
			this.traumaCascadeEngine.decay( userId, 1, Math.max( relation.trust, relation.affinity ) )
			// Real SupportQuality accumulation — a real, genuinely warm turn
			// while an established trauma trace is still active counts as
			// real received co-regulation, distinct from the instantaneous
			// trust/affinity level `decay()` already reads above. Gated on
			// a real trace actually being present, so an unrelated happy
			// turn for someone with no real trauma history never touches
			// this at all.
			//
			// Real bug found while verifying this: gating purely on THIS
			// turn's own `desirability` failed almost every time it was
			// needed most — a genuinely traumatized state (sustained
			// cortisol/dissociation) measurably dampens how the AI's OWN
			// felt valence reads the SAME warm content, so `desirability`
			// stayed negative even for unambiguous affection. Real support
			// is about what the OTHER person expressed, not how numbed the
			// traumatized side currently is to register it as pleasant —
			// a real, direct lexical `affection` concept match
			// (`EmotionalOntology.js`) now counts on its own, independent
			// of this turn's own dampened desirability reading.
			const genuineSupportSignal = desirability > 0.3 || ontologyMatches.some( m => m.concept === 'affection' )
			if ( genuineSupportSignal && this.traumaCascadeEngine.getTraumaTrace( userId ) > 0 ) this.traumaCascadeEngine.registerSupport( userId, clamp01( Math.max( desirability, 0.5 ) ) )

		}

		// Prestige: the real, freely-conferred-respect pathway to status,
		// distinct from PowerDynamicsEngine's own dominance — piggybacks on
		// GratitudeEngine's own real qualifying gate (genuine, unexpected,
		// user-attributed positive outcome) as the real recognition signal.
		if ( gratitude ) this.prestigeSystem.demonstrateCompetence( userId, clamp01( rpe ), gratitude.creditBoost * 5 )
		const prestige = this.prestigeSystem.getPrestige( userId )

		// Framing: real, introspection-only exposure of how much this turn's
		// own already-computed desirability reading would shift under the
		// opposite frame — does NOT feed back into emotional state (same
		// honest non-retrofit discipline PercentageOfAssets already follows).
		const framingAmbiguity = 1 - Math.abs( desirability )
		const framedDesirability = this.framingEffect.applyFrame( desirability, desirability >= 0 ? 'gain' : 'loss', framingAmbiguity )

		// Ideal-self discrepancy: the real dejection-family counterpart to
		// SuperegoMonitor's own agitation-family ought-self gap — a distinct
		// real aspiration bar (openness-linked, not conscientiousness-linked).
		const idealStandard = clamp01( 0.5 + this.personality.get( 'openness' ) * 0.3 )
		this.idealSelfDiscrepancy.evaluate( idealStandard, clamp01( ( desirability + 1 ) / 2 ) )
		const dejectionPressure = this.idealSelfDiscrepancy.getDejectionPressure()
		if ( dejectionPressure > 0.3 ) this.emotionSpace.applySpike( { valence: -dejectionPressure * 0.15, arousal: -dejectionPressure * 0.1, weight: 0.3 } )

		// Comparison Level for Alternatives: real, reuses the same
		// otherAffinities array SocialReferenceFrame's own relative-outcome
		// framing already computed this turn — no separate computation needed.
		if ( otherAffinities.length ) this.comparisonLevelAlternatives.observeAlternative( userId, Math.max( 0, ...otherAffinities ) )
		const commitmentWithAlternatives = this.comparisonLevelAlternatives.getCommitment( userId, relation.affinity, clamp01( this.turnCounter / 50 ) ) // real, simple investment proxy: turns already spent building this specific relationship, distinct from CommitmentDevice's own promise-specific tracking

		// ChildlikeMode — the user's own explicit spec: a real temporary
		// STANCE toward more PLAY/wonder and less adult gravity, never
		// baby-talk. Real threat proxy blends cortisol with any real trauma
		// trace this turn produced; real hard gate (precisionMode, real
		// freeze) lives in `gate()` itself.
		const childlikeThreatProxy = Math.max( this.cortisolEngine.getLevel(), traumaCascade ? traumaCascade.traceLevel : 0 )
		const childlikeLevel = this.childlikeMode.computeActivation( userId, {
			happiness       : this.happinessEngine.getWellbeingNormalized( userId ),
			play                : this.primaryDrives.getDrive( 'PLAY' ),
			geekSalience   : obsession ? this.frikiEngine.getInterest( obsession ).intensity : 0,
			safety             : relation.trust,
			bond                : relation.affinity,
			threat              : childlikeThreatProxy,
			shame              : this.shameGuiltSplit.shame,
			formality         : this.personality.get( 'conscientiousness' ),
			allostaticLoad : this.homeostasis.allostaticLoad,
			faceThreat                  : faceThreat,
			deceptionSeverity      : intuitionRead?.type === 'deception' ? intuitionRead.feltCertainty : 0,
			cascadeActive             : !!traumaCascade,
		} )
		const childlikeOn                = this.childlikeMode.gate( userId, { precisionMode, traumaFreeze: traumaCascade?.freezeLevel ?? 0 } )
		const childlikeActiveLevel = childlikeOn ? childlikeLevel : 0
		if ( childlikeActiveLevel > 0 ) {

			const boostedPlay = this.childlikeMode.getPlayBoost( childlikeActiveLevel, this.primaryDrives.getDrive( 'PLAY' ) )
			this.primaryDrives.activate( 'PLAY', boostedPlay - this.primaryDrives.getDrive( 'PLAY' ) )

		}

		// BoredomEngagementEngine — the user's own explicit spec: boredom as
		// a real, continuous degree of engagement, not a nominal mood.
		// PartnerPull composes already-real, separately-tracked signals
		// (bond, desire, yearning, oxytocin, aversion, cooling, betrayal
		// trace) into one real "how much this specific person still pulls
		// attention" read.
		// Real monotony penalty on PartnerPull — found missing by the user's
		// own battery (test 4: partnerPull genuinely ROSE under 20 days of
		// flat, non-negative exposure, since nothing here erodes affinity
		// without real negativity), and then found STILL missing after a
		// first attempt that reused `TopicSatiation`'s own `fatigue`: that
		// signal only computes at all when `TriggerSentinel`'s own narrow
		// keyword gate fires, so ordinary flat dialogue ("ya, bueno, como
		// digas") never registered any monotony whatsoever. Switched to
		// `1 - novelty` (`NoveltyDetector`'s own real, always-computed,
		// keyword-independent per-turn signal), so a real relational
		// "vacío" can genuinely build from sustained flatness without
		// needing a fight, and without depending on specific trigger words.
		const partnerPull = this.boredomSystem.computePartnerPull( userId, {
			affinity        : relation.affinity,
			desire            : this.desireEngine.getDesire( userId ),
			yearning        : this.yearningEngine.getTrace( userId ),
			oxytocin        : this.oxytocinSystem.getLevel( userId ),
			aversion        : this.loveHateEngine.getAversion( userId ),
			cooling           : postConflictCoolingLevel,
			betrayalTrace : this.betrayalTraumaTrace.getTrace( userId ),
			monotony        : clamp01( 1 - novelty ),
		} )
		// Real topic fit — found broken by the user's own battery: this used
		// to read the STANDING obsession's own stored intensity regardless
		// of whether THIS turn's own content was actually about it, so a
		// heavy off-topic stretch barely moved boredom and returning to the
		// real fandom topic barely moved it back (0.188 vs 0.189, pure
		// noise). Now genuinely checks whether THIS turn's own real
		// extracted topics include the obsession (`frikiTopics`, already
		// computed this same turn) — off-topic content reads as a real,
		// low baseline fit regardless of how deep the standing obsession
		// is, on-topic content reads at its own real intensity.
		const isOnFrikiTopic = !!( obsession && frikiTopics.includes( obsession ) )
		let topicFit = isOnFrikiTopic ? this.frikiEngine.getInterest( obsession ).intensity : 0.3
		// Real childlike-aware topic fit and meaning discount — found weak
		// by the user's own battery (childlike + heavy-serious topic barely
		// moved boredom, since a high real `moralWeight` normally PROTECTS
		// against boredom in the base formula, which is right for an
		// ordinary stance but backwards for a genuinely playful one: heavy
		// meaning reads as tedious while childlike, not engaging).
		let meaningForBoredom = appraisal.moralWeight ?? 0
		// Real, dedicated childlike-serious-mismatch term — found necessary
		// because the indirect topicFit/meaning discounts alone still got
		// swamped by `partnerPull`/`desire` staying high in the user's own
		// integrated battery test. A direct, sizable additive boredom term
		// while genuinely playful meets genuinely heavy content.
		let childlikeSeriousMismatch = 0
		if ( childlikeActiveLevel > 0 ) {

			if ( isOnFrikiTopic ) topicFit = clamp01( topicFit + childlikeActiveLevel * 0.3 )
			if ( meaningForBoredom > 0.4 ) {

				topicFit                                    = clamp01( topicFit - childlikeActiveLevel * 0.5 )
				childlikeSeriousMismatch  = clamp01( childlikeActiveLevel * meaningForBoredom )
				meaningForBoredom                  = clamp01( meaningForBoredom * ( 1 - childlikeActiveLevel * 0.7 ) )

			}

		}
		const boredomResult = this.boredomSystem.compute( userId, {
			// Real sustained-gratitude dampening — genuine recent thankfulness
			// toward this person real, temporarily softens how understimulated
			// this exchange reads, per GratitudeEngine's own getBoredomDampening().
			understimulation : clamp01( 0.4 - this.emotionSpace.vector.arousal - this.gratitudeEngine.getBoredomDampening( userId ) ),
			satiation             : topicSatiation.fatigue ?? 0,
			topicFit                : topicFit,
			// Real "compared to our own past peak" decline — a genuine drop
			// from where this relationship's own warmth used to sit feeds real
			// monotony/boredom even with no rival present, NostalgiaEngine's
			// own new compareToPast().
			monotony             : clamp01( 1 - novelty + pastDecline * 0.4 ),
			novelty                : clamp01( novelty ),
			desire                  : this.desireEngine.getDesire( userId ),
			meaning               : meaningForBoredom,
			play                     : this.primaryDrives.getDrive( 'PLAY' ),
			partnerPull          : partnerPull,
			childlikeSeriousMismatch : childlikeSeriousMismatch,
			// Real bug found by the user's own battery: `childlikeThreatProxy`
			// (cortisol + long-horizon trace) can still read low on the VERY
			// turn a real trauma cascade genuinely fires (cortisol hasn't
			// built up yet, freeze/trace need sustained extremity), letting
			// a genuinely threatening turn slip past the hard override and
			// read as ordinary boredom. A real cascade firing THIS turn
			// (`neuroceptionLevel`, Porges' own real pre-conscious threat
			// read) is a far more direct, immediate signal than waiting for
			// cortisol/trace to catch up.
			threat                  : Math.max( childlikeThreatProxy, traumaCascade ? traumaCascade.neuroceptionLevel : 0 ),
		} )
		// Real, small behavioral consequence — genuinely high boredom
		// dampens arousal/dominance a little (a real withdrawal-adjacent
		// signature, distinct from sadness or fear), not just a debug number.
		if ( boredomResult.boredom > 0.5 ) this.emotionSpace.applySpike( { arousal: -boredomResult.boredom * 0.15, dominance: -boredomResult.boredom * 0.1, weight: 0.25 } )

		// Real transient hypofrontality — genuine engagement (the inverse of
		// this turn's own real boredom read) combined with LOW active
		// self-referential monitoring (this turn's own real cognitive-
		// dissonance stress, a genuine proxy for "actively reconciling
		// something about the self/narrative right now") produces a real
		// flow-adjacent state (Dietrich 2003, see FlowStateEngine.js).
		this.flowStateEngine.update( 1 - boredomResult.boredom, this.cognitiveDissonance.getStress() )
		// Real, non-deterministic "does attention genuinely drift toward an
		// external opportunity" check — reuses the same real opportunity/
		// commitment signals already computed this turn, feeds the SAME
		// real subthreshold-craving channel already established elsewhere,
		// rather than inventing a new one.
		const noveltySeek = this.boredomSystem.maybeSeekNovelty( userId, { opportunity, commitment: commitmentWithAlternatives } )
		if ( noveltySeek.didSeek ) this.cravingTrace.registerExposure( `external:${userId}`, noveltySeek.probability * 0.3 )

		// Reflected glory: real BIRGing/CORFing — fires only when this turn's
		// own outcome is genuinely about the USER (agency='user') and the
		// user reads as a real in-group member (tribe already classified this turn).
		const reflectedGlory = tribe === 'ingroup' && appraisal.agency === 'user'
			? this.reflectedGlory.evaluate( relation.affinity, desirability, ( group.participantCount ?? 1 ) > 1 ? 0.7 : 0.3 )
			: { basking: 0, cuttingOff: 0, netAffect: 0 }
		if ( reflectedGlory.netAffect !== 0 ) this.emotionSpace.applySpike( { valence: reflectedGlory.netAffect * 0.2, arousal: Math.abs( reflectedGlory.netAffect ) * 0.1, weight: 0.3 } )

		// Real, probabilistic gate for whether this AI volunteers mentioning a
		// real dream it genuinely synthesized about this specific user during
		// a real deep-sleep gap — deliberately non-deterministic, same real
		// pattern BystanderEffect already uses (see DreamEngine.js).
		const dreamMention = this.dreamEngine.shouldMentionDream( userId, {
			conversationDullness : clamp01( ( this._lastTopicFatigue ?? 0 ) + ( 1 - novelty ) * 0.3 ),
			trust                          : relation.trust,
			spontaneity                : this.personality.get( 'openness' ),
		} )

		// Real subconscious mechanisms — Kihlstrom 1987 framework, 3 distinct
		// real sub-mechanisms (see SubconsciousEngine.js). Coalition-residue
		// registration happens further below, right after workspaceCompetition
		// is actually computed.
		if ( pathFingerprint ) this.subconsciousEngine.registerExposure( pathFingerprint )
		const mereExposureBoost = pathFingerprint ? this.subconsciousEngine.getMereExposureBoost( pathFingerprint ) : 0
		if ( mereExposureBoost > 0.15 ) this.emotionSpace.applySpike( { valence: mereExposureBoost * 0.15, weight: 0.2 } )
		if ( defenseDirective?.active && defenseDirective.mechanism === 'evasion' && ontologyMatches.length ) this.subconsciousEngine.registerSuppression( ontologyMatches[ 0 ].concept, 0.4 )
		const ironicRebound = ontologyMatches.length ? this.subconsciousEngine.getIronicReboundPressure( ontologyMatches[ 0 ].concept ) : 0
		if ( ironicRebound > 0.5 ) { this.emotionSpace.applySpike( { arousal: ironicRebound * 0.2, weight: 0.3 } ); this.subconsciousEngine.releaseRebound( ontologyMatches[ 0 ].concept ) }

		// Real anticipatory grief — Rando 1986, see GriefEngine.js. Auto-fires
		// from a real family-member-health-decline life event; genuine grief
		// work that begins before the loss itself occurs.
		if ( lifeEvent?.events?.includes( 'family_member_health_change' ) ) this.griefEngine.triggerAnticipatoryGrief( userId, clamp01( ( lifeEvent.impact ?? 44 ) / 100 ), 'family_member_health_change' )
		const anticipatoryGriefIntensity = this.griefEngine.getAnticipatoryGriefIntensity( userId, 'family_member_health_change' )

		// Real bereavement grief — auto-fires from a real LifeEventCatalog
		// death-related event, distinct from GriefEngine.triggerLoss()'s own
		// relational-rupture trigger (grieving a THIRD PARTY, not the person
		// being talked to; see GriefEngine.js's own real documentation of the
		// gap this closes). Real prior anticipatory grief work genuinely
		// dampens the acute shock (Rando's own central claim).
		if ( lifeEvent?.events?.some( id => id.startsWith( 'death_' ) ) ) {

			const deathEventId  = lifeEvent.events.find( id => id.startsWith( 'death_' ) )
			const rawBereavement = clamp01( ( lifeEvent.impact ?? 60 ) / 100 )
			this.griefEngine.triggerBereavement( userId, this.griefEngine.applyAnticipatoryDampening( userId, rawBereavement, 'family_member_health_change' ), deathEventId )
			this._lastBereavementLabel = deathEventId // real continuity: later turns still need to read this same real grief, not fall back to a mismatched key

		}
		const bereavementIntensity = this.griefEngine.getBereavementIntensity( userId, this._lastBereavementLabel ?? 'someone' )

		// Real DELAYED bereavement drive suppression — Shear & Shair 2005,
		// see GriefEngine.js. Genuinely builds over the first 1-3 real days
		// rather than landing the instant the loss is disclosed — distinct
		// from ConservationWithdrawal's own general overwhelm-driven
		// dampening below, which needs sustained high cortisol/allostatic
		// load and has no real relationship to how LONG ago a specific
		// bereavement started.
		const bereavementDriveSuppression = this.griefEngine.getBereavementDriveSuppression( userId, this._lastBereavementLabel ?? 'someone' )
		if ( bereavementDriveSuppression > 0.05 ) {

			this.primaryDrives.drives.PLAY        = clamp01( this.primaryDrives.drives.PLAY * ( 1 - bereavementDriveSuppression * 0.6 ) )
			this.primaryDrives.drives.SEEKING = clamp01( this.primaryDrives.drives.SEEKING * ( 1 - bereavementDriveSuppression * 0.6 ) )

		}

		// Real defense-driven grief presentation — a real defense firing
		// while grief is genuinely active changes HOW it shows, not whether
		// it exists. repression → a real delayed resurgence, routed through
		// SubconsciousEngine's own ironic-rebound machinery (Wegner 1994),
		// plus a real "holding it in" cost (ExpressionDebt, already built).
		// denial/repression while grieving → a real masked/somatic
		// presentation, standing in via a real elevated ambient-stress read
		// (CortisolEngine, already built) since this project has no
		// physical body to manifest actual physical symptoms in.
		const activeGriefIntensity = Math.max( this.griefEngine.getIntensity( userId ), bereavementIntensity )
		if ( activeGriefIntensity > 0.15 && defenseDirective?.active ) {

			if ( defenseDirective.mechanism === 'repression' ) {

				this.subconsciousEngine.registerSuppression( `grief::${userId}`, activeGriefIntensity )
				this.expressionDebt.chargeSuppressionCost( activeGriefIntensity )

			}
			if ( defenseDirective.mechanism === 'denial' || defenseDirective.mechanism === 'repression' ) this.cortisolEngine.register( -activeGriefIntensity * 0.5, true )

		}
		const absentGrief             = activeGriefIntensity > 0.15 && defenseDirective?.active && defenseDirective.mechanism === 'denial'
		const delayedGriefRebound = this.subconsciousEngine.getIronicReboundPressure( `grief::${userId}` )
		if ( delayedGriefRebound > 0.5 ) {

			this.emotionSpace.applySpike( { valence: -delayedGriefRebound * 0.3, arousal: delayedGriefRebound * 0.2, weight: 0.3 } )
			this.subconsciousEngine.releaseRebound( `grief::${userId}` )

		}

		// Real cumulative grief burden — several real active griefs at once
		// genuinely weigh more than any single one; real extra input for
		// ConservationWithdrawal's own overwhelm when the combined burden is
		// itself high, same real formula it already uses.
		const cumulativeGriefBurden = this.griefEngine.getCumulativeGriefBurden( userId )
		if ( cumulativeGriefBurden > 0.8 ) this.conservationWithdrawal.observe( cumulativeGriefBurden, cumulativeGriefBurden )

		// Real bereavement overload — Kastenbaum 1969, see GriefEngine.js. A
		// real, explicit yes/no trigger distinct from the passive aggregate
		// above (requires 2+ genuinely concurrent real griefs, not just one
		// large one) — a real, extra push into conservation-withdrawal on top
		// of the raw-burden threshold, own tuning of the extra magnitude.
		const bereavementOverload = this.griefEngine.isBereavementOverload( userId )
		if ( bereavementOverload ) this.conservationWithdrawal.observe( 1, 1 )

		// Real prolonged grief disorder marker — Prigerson et al. 2021, see
		// GriefEngine.js. One real structural criterion (severity sustained
		// past a real expected window), not 3 separately fabricated ones.
		const prolongedGriefDisorder = this.griefEngine.isProlongedGriefDisorder( userId )

		// Real conservation-withdrawal — Engel & Schmale 1972, see
		// ConservationWithdrawal.js. Observes real, already-computed cortisol
		// and allostatic load every turn; once real overwhelm crosses
		// threshold, genuinely dampens SEEKING/PLAY rather than adding felt
		// affect — the real behavioral signature of passive shutdown.
		this.conservationWithdrawal.observe( this.cortisolEngine.getLevel(), this.homeostasis.allostaticLoad )
		if ( this.conservationWithdrawal.isWithdrawn() ) {

			this.primaryDrives.drives.SEEKING = clamp01( this.primaryDrives.drives.SEEKING * ( 1 - this.conservationWithdrawal.getWithdrawalDepth() * 0.6 ) )
			this.primaryDrives.drives.PLAY        = clamp01( this.primaryDrives.drives.PLAY * ( 1 - this.conservationWithdrawal.getWithdrawalDepth() * 0.6 ) )

		}

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
		this.subconsciousEngine.registerCompetition( workspaceCompetition.coalitions, workspaceCompetition.winner )

		// Real Hick-Hyman Law — Hick 1952; Hyman 1953, see HickHymanLaw.js.
		// `workspaceCompetition.coalitions` is the exact real branching
		// factor (how many genuine concerns competed for narrative focus
		// this turn) Hick-Hyman's own `n` describes — real extra latency
		// from COMPLEXITY, distinct from DriftDiffusionModel's own real
		// extra latency from AMBIGUITY below.
		const hickHymanDelayMs = this.hickHymanLaw.getReactionTimeMs( workspaceCompetition.coalitions.length )
		modulated.delayMs = ( modulated.delayMs ?? 0 ) + hickHymanDelayMs
		// Real Drift Diffusion Model extra latency — only paid when this
		// turn's appraisal was genuinely ambiguous (see the real `ddmDecision`
		// computed earlier); each real accumulation step stands for a real ms
		// of deliberation, own tuning of the per-step conversion.
		if ( ddmDecision ) modulated.delayMs += ddmDecision.steps * 15

		// Real, honest introspection over which real family this turn's own
		// already-computed magnitudes were actually salient in (Simon 1971, see
		// PercentageOfAssets.js) — a real readout, not a claim anything was
		// skipped; every mechanism above still ran unconditionally, same as
		// always.
		const assetSaliences = this.percentageOfAssets.compute( {
			relational : Math.max( Math.abs( desirability ), Math.abs( this._lastLoveHateTension ?? 0 ) ),
			identity      : Math.max( frikiEgoThreat, roleSalience.salience[ roleSalience.dominant ] ?? 0 ),
			motivation       : this.primaryDrives.getGoalPull()?.intensity ?? 0,
			regulation          : Math.max( this.cortisolEngine.getLevel(), inhibitionFailureProbability ),
			memory                 : Math.max( reminiscence[ 0 ]?.reactivation ?? 0, woundPressure ),
		} )
		this._recentDominantFamilies.push( assetSaliences.dominantFamily )
		if ( this._recentDominantFamilies.length > 10 ) this._recentDominantFamilies.shift()

		// Real human-discourse shaping directives from this turn's own real
		// state (Gómez-Rodríguez & Williams 2023, see HumanDiscourseShaper.js)
		// and a real, bounded micro-slip directive under genuine high
		// activation (Goffman 1956, see BlushSlipEngine.js) — both produce
		// real, inspectable directives a host's own LLM call can honor; neither
		// edits `modulated.text` itself, Totemheart has no generator to edit.
		// Real topical ambiguity — how much this turn's own independent valence
		// estimates (raw appraisal, situational, semantic, life event) genuinely
		// disagreed with each other, distinct from the AI's own felt dissonance
		// (valueConflict below): a user can describe someone else's ambiguous
		// dilemma with zero internal conflict of their own, and that should
		// still read as morally ambiguous material to HumanDiscourseShaper.
		const topicalAmbiguity            = agreement.n >= 2 ? clamp01( 1 - agreement.agreement ) : 0
		const discourseTarget           = this.humanDiscourseShaper.computeTarget( { warmth: relation.affinity, cooling: woundPressure, valueConflict: this.cognitiveDissonance.getStress(), topicalAmbiguity } )
		// ChildlikeMode's own real SeriousnessSuppressor — attenuates (never
		// zeroes) the "adult-serious" epilogue-moralizing weight while the
		// mode is genuinely on, so a playful stance narrates without the
		// closing-lesson gravity, without erasing the underlying target.
		if ( childlikeActiveLevel > 0 ) discourseTarget.epilogueMoralizing = this.childlikeMode.applySeriousnessSuppression( childlikeActiveLevel, discourseTarget.epilogueMoralizing )
		const discourseDirectives = this.humanDiscourseShaper.buildDirectives( discourseTarget )
		const blushActivation           = this.blushSlipEngine.computeActivation( { arousal: this.emotionSpace.vector.arousal, butterflies: somaticActivation.level, shame: this.shameGuiltSplit.shame } )
		// Real, narrow, own-engineered strict-precision-mode detector
		// (hoisted earlier, reused here too for BlushSlipEngine's own
		// already-built `precisionMode` gate) hard-masks the real slip
		// budget on a genuinely factual/numeric turn: residual arousal
		// INERTIA from a prior emotional turn is real and intentionally
		// left alone (the mask is about THIS turn's own content, not a
		// claim that arousal resets instantly).
		const blushDirective            = { budget: this.blushSlipEngine.getSlipBudget( blushActivation, precisionMode ), type: this.blushSlipEngine.sampleSlipType( blushActivation ), ...this.blushSlipEngine.planRepair( { trust: relation.trust } ) }

		// Real Model Control Plane compilation — the user's own explicit
		// request to close the expression<->text gap: a real, machine-
		// readable packet (not only prose) compiled from already-real
		// state, plus real decoding-parameter and activation-steering
		// coefficients. None of this calls an LLM itself (this codebase
		// never does); it's real, host-facing metadata the SAME honest
		// "inert unless a host reads it" discipline `logitBias` already
		// carries, see CALIBRATION.md.
		const controlPacket = this.controlPacketCompiler.compile( {
			valence: this.emotionSpace.vector.valence, arousal: this.emotionSpace.vector.arousal,
			cooling: postConflictCoolingLevel, trust: relation.trust, desire: desireLevel,
			boredom: boredomResult.boredom, threat: Math.max( traumaCascade?.neuroceptionLevel ?? 0, childlikeThreatProxy ?? 0 ),
			freeze: traumaCascade?.freezeLevel ?? 0, boundaryProbability, play: childlikeActiveLevel,
			flirt: flirtation, audienceFormality, prosody: visualProsody, actionTendency: dualProcess?.actionTendency ?? null,
		} )
		// Real emotionalState/systemPrompt compilation — deliberately here,
		// AFTER `controlPacket` above, not at the point this codebase used
		// to build it (right after appraisal, before boredom/trauma/
		// childlike/boundary even existed for this turn). `systemPrompt`
		// now genuinely carries THIS SAME turn's own hardened bans/must
		// block, not last turn's.
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
			eurekaResolution,
			controlPacket,
		} )

		const stateLockedMemory = this.stateLockedMemory.compile( {
			relation, bondNet: this.loveHateEngine.getNetBond( userId ), cooling: postConflictCoolingLevel,
			activeRituals: this.sharedRelationalCulture.getItems( userId ).map( ( [ key ] ) => key ),
			constraints: { bans: controlPacket.bans, must: controlPacket.must },
		} )
		const decodingSteering = {
			temperature      : this.decodingSteeringAdapter.getTemperature( { arousal: this.emotionSpace.vector.arousal, precisionMode, freeze: traumaCascade?.freezeLevel ?? 0 } ),
			bannedPhrases : this.decodingSteeringAdapter.getBannedPhrases( controlPacket ),
		}
		const activationSteering = this.activationSteeringBridge.getCoefficients( { cooling: postConflictCoolingLevel, warmth: controlPacket.style.warmth, suspicion: this.intuitionEngine.getSuspicion( userId ) } )

		return {
			text           : modulated.text,
			delayMs        : modulated.delayMs,
			styleTags      : modulated.styleTags,
			emotionalState,
			controlPacket, stateLockedMemory, decodingSteering, activationSteering,
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
				culturalScriptCatalogSize : this.culturalScriptLibrary.getScripts().length,
				powerDynamics          : powerUpdate,
				betrayalTrauma           : { hasPermanentTrace: this.betrayalTraumaTrace.hasPermanentTrace( userId ), threshold: traumaTrustThreshold },
				metaEmotion                : { valence: metaValence, arousal: metaArousal, curiosity: this._lastMetaCuriosity },
				forecastUtility               : this._lastForecastUtility,
				regulationChoice                 : this._lastRegulationChoice,
				somaticBias                         : somaticBias,
				somaticMarkerCount           : this.somaticMarkerNetwork.getMarkerCount(),
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
				symbolicJealousy                                                                                                                                          : symbolicJealousy,
				eureka                                                                                                                                                            : eurekaResolution,
				flow                                                                                                                                                                 : this.flowStateEngine.level,
				loyaltyConflict                                                                                                                                                             : loyaltyConflict,
				desire                                                                                                                                                                             : { level: desireLevel, salience: desireSalience },
				temptation                                                                                                                                                                  : { level: temptationLevel, forbiddenness, opportunity, yieldProbability, didYield },
				craving                                                                                                                                                                          : this.cravingTrace.getCraving( userId ),
				ambivalentDesire                                                                                                                                                       : this.desireEngine.getAmbivalentDesire( userId, this.betrayalTraumaTrace.getTrace( userId ) ),
				desireTension                                                                                                                                                             : this.desireEngine.getTension( userId, this.emotionSpace.vector.valence ),
				chills                                                                                                                                                                             : { level: chillsLevel, activation: chillsActivation, type: this.chillsEngine.classifyType( { moralIntensity: elevationReading.intensity, uncanny: uncannyValley.suspicious ? 1 : 0, bondSalience: relation.affinity, vastness: aweReading.intensity } ) },
				intuition                                                                                                                                                                        : intuitionRead,
				traumaCascade                                                                                                                                                             : traumaCascade,
				traumaTrace                                                                                                                                                                  : this.traumaCascadeEngine.getTraumaTrace( userId ),
				happiness                                                                                                                                                                     : { level: this.happinessEngine.getWellbeingNormalized( userId ), receptorOccupancy: this.happinessEngine.getReceptorOccupancy( userId ), leverage: this.happinessEngine.getLeverage( userId ) },
				suspicion                                                                                                                                                                       : this.intuitionEngine.getSuspicion( userId ),
				secretLeakProbability                                                                                                                                       : secretLeakProbability,
				ritualUrge                                                                                                                                                                    : ritualUrge,
				sharedCultureItemCount                                                                                                                                            : this.sharedRelationalCulture.getItems( userId ).length,
				loneliness                                                                                                                                                                    : lonelinessLevel,
				anticipatedRegret                                                                                                                                                    : anticipatedRegret,
				regretYieldDampening                                                                                                                                          : regretYieldDampening,
				anticipatedUtility                                                                                                                                                  : anticipatedUtility,
				hope                                                                                                                                                                                : { level: hopeLevel, crash: hopeCrash },
				selfAttack                                                                                                                                                                    : selfAttack,
				selfCompassion                                                                                                                                                            : selfCompassion,
				recoveryMultiplier                                                                                                                                                   : recoveryMultiplier,
				empathicAccuracy                                                                                                                                                       : { biased: empathicBiased, accuracy: empathicAccuracy },
				consolationEfficacy                                                                                                                                                   : consolationEfficacyLevel,
				sleepFragmentation                                                                                                                                                   : sleepFragmentation,
				repairClassification                                                                                                                                                 : repairClassification,
				silenceClassification                                                                                                                                                : silenceClassification,
				envySplit                                                                                                                                                                       : envySplit,
				roleLossPain                                                                                                                                                                  : roleLossPain,
				generalizedFear                                                                                                                                                          : generalizedFear,
				anniversaryReactivation                                                                                                                                          : anniversaryReactivation,
				socialPainChannel                                                                                                                                                     : socialPainChannel,
				postConflictCoolingLevel                                                                          : postConflictCoolingLevel,
				superegoDiscrepancy                                                                                  : superegoReading.discrepancy,
				residualAnnoyance                                                                                       : this.residualAnnoyanceTrace.trace,
				effortWithholdingLevel                                                                                     : effortWithholdingLevel,
				politenessBudget                                                                                             : this.politenessShutdown.getLevel(),
				contemptLevel                                                                                                   : contemptLevel,
				demandWithdrawalUrge                                                                                              : withdrawalUrge,
				faceThreat                                                                                                          : faceThreat,
				audienceFormality                                                                                                     : audienceFormality,
				egoHubrisIndex                                                                                                          : this.egoCalibrationSuite.getHubrisIndex(),
				egoImpostorLevel                                                                                                          : this.egoCalibrationSuite.getImpostorLevel(),
				egoOscillationRisk                                                                                                        : this.egoCalibrationSuite.getOscillationRisk(),
				empathicOverconfident                                                                                                : empathicOverconfident,
				opinionStance                                                                                                                : opinionUpdate,
				disagreementMagnitude                                                                                                  : disagreementMagnitude,
				epistemicCredibility                                                                                                    : epistemicCredibility,
				manipulationSkepticism                                                                                              : manipulationSkepticismLevel,
				disagreementStyle                                                                                                          : disagreementStyle,
				boundaryProbability                                                                                                      : boundaryProbability,
				ambientBehavioralProfile                                                                                          : this.ambientBehavioralTrace.getBehavioralProfile( userId ),
				meaningfulSilence                                                                                                        : meaningfulSilence,
				ambientBurstiness                                                                                                        : this.ambientBehavioralTrace.getBurstiness( userId ),
				savoring                                                                                                                          : savoringLevel,
				ruminationMode                                                                                                              : ruminationMode.mode,
				reactance                                                                                                                     : reactance,
				psychologicalDistance                                                                                                           : psychDistance,
				moralLicense                                                                                                                      : moralLicense,
				selfHandicapPressure                                                                                                                : selfHandicapPressure,
				selfHandicapHedge                                                                                                                     : selfHandicapHedge,
				relationalAfterglow                                                                                                                   : afterglow,
				amusement                                                                                                                                : amusement,
				moralDisgust                                                                                                                                : moralDisgustLevel,
				embarrassment                                                                                                                                  : embarrassmentLevel,
				worldviewDefenseBoost                                                                                                                              : worldviewDefenseBoost,
				relief                                                                                                                                               : reliefLevel,
				primaryDriveLevels                                                                                                                                     : { ...this.primaryDrives.drives },
				prestige                                                                                                                                                  : prestige,
				framedDesirability                                                                                                                                           : framedDesirability,
				framingSensitivity                                                                                                                                              : this.framingEffect.getFrameSensitivity( framingAmbiguity ),
				dejectionPressure                                                                                                                                                  : dejectionPressure,
				commitmentWithAlternatives                                                                                                                                            : commitmentWithAlternatives,
				reflectedGlory                                                                                                                                                           : reflectedGlory,
				dreamMention                                                                                                                                                                : dreamMention.should ? dreamMention.dream : null,
				compositeDream                                                                                                                                                        : this.dreamEngine.getLatestComposite(),
				nightmare                                                                                                                                                                       : this._lastNightmareEval ?? null,
				oxytocinLevel                                                                                                                                                              : this.oxytocinSystem.getLevel( userId ),
				idealizationSuppression                                                                                                                                          : this.oxytocinSystem.getIdealizationSuppression( userId ),
				opioidBuffer                                                                                                                                                             : this.endogenousOpioidSystem.getBuffer( userId ),
				opioidAnalgesia                                                                                                                                                        : opioidAnalgesia,
				mereExposureBoost                                                                                                                                                              : mereExposureBoost,
				ironicRebound                                                                                                                                                                     : ironicRebound,
				bereavementIntensity                                                                                                                                                                : bereavementIntensity,
				bereavementDriveSuppression                                                                                                                                        : bereavementDriveSuppression,
				conservationWithdrawal                                                                                                                                                                 : { withdrawn: this.conservationWithdrawal.isWithdrawn(), depth: this.conservationWithdrawal.getWithdrawalDepth(), solitudePull: this.conservationWithdrawal.getSolitudePull() },
				anticipatoryGriefIntensity                                                                                                                                              : anticipatoryGriefIntensity,
				cumulativeGriefBurden                                                                                                                                                     : cumulativeGriefBurden,
				prolongedGriefDisorder                                                                                                                                                    : prolongedGriefDisorder,
				bereavementOverload                                                                                                                                                      : bereavementOverload,
				griefPresentation                                                                                                                                                              : { absent: absentGrief, delayedRebound: delayedGriefRebound },
				selfDistancing                                                                                                                                                                 : { active: selfDistancing, boost: selfDistancingBoost },
				ddmDecision                                                                                                                                                                     : ddmDecision,
				sarcasmSensitivity                                                                                                                                                     : this.signalDetectionTheory.getSensitivity( 'sarcasm' ),
				sarcasmCriterion                                                                                                                                                        : this.signalDetectionTheory.getCriterion( 'sarcasm' ),
				perceivedArousalBoost                                                                                                                                                  : perceivedArousalBoost,
				weberFechnerPerceivedChange                                                                                                                                  : weberFechnerPerceivedChange,
				freeEnergyEstimate                                                                                                                                                       : this.predictiveProcessingCore.getFreeEnergyEstimate( `desirability:${userId}` ),
				predictiveEstimateBefore                                                                                                                                     : predictiveEstimateBefore,
				hickHymanDelayMs                                                                                                                                                        : hickHymanDelayMs,
				gratitudeYield                                                                                                                          : gratitudeYield,
				interoceptiveAwareness                                                                            : this.interoceptiveAwarenessGain.getAccuracy(),
				affiliationPull                                                                                      : this.affiliationThermostat.getPull(),
				reminiscence                                                                                            : reminiscence,
				reunionReactivation                                                                          : reunionReactivation,
				yearning                                                                                                    : this._lastYearning ?? null,
				childlike                                                                                                    : { level: childlikeLevel, on: childlikeOn },
				engagement                                                                                                    : { ...boredomResult, partnerPull, topicFit },
				relationshipPhase                                                                                          : this.relationalMemoryCatalog.getRelationshipPhase( userId ),
				frikiObsession                                                                                                : obsession,
				frikiEgoThreat                                                                                                   : frikiEgoThreat,
				frikiReveal                                                                                                         : frikiReveal,
				frikiShare                                                                                                             : frikiShare,
				frikiTopInterests                                                                                            : this.frikiEngine.rankInterests( { k: 3 } ).map( n => n.topic ),
				somaticActivation                                                                                                         : somaticActivation.level,
				ghostingPain                                                                                                                 : ghostingPain,
				globalMoodAbatement                                                                                                             : this.globalMoodAbatement.level,
				tipOfTongue                                                                                                                        : tipOfTongueState,
				vicariousDiscomfort                                                                                                                   : vicariousDiscomfort,
				empathyBlend                                                                                                                             : empathyBlend,
				compassionCheck                                                                                                                             : compassionCheck,
				retribution                                                                                                                                   : retribution,
				flirtation                                                                                                                                       : flirtation,
				assetSaliences                                                                                                                                      : assetSaliences,
				discourseDirectives                                                                                                                                    : discourseDirectives,
				discourseTopicalAmbiguity                                                                                                                                 : topicalAmbiguity,
				blushDirective                                                                                                                                            : blushDirective,
				precisionMode                                                                                                                                             : precisionMode,
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

		// Real engagement/childlike expression biases — found MISSING by the
		// user's own battery (fix 10: "que childlike abort y boredom alto se
		// noten en length/initiative/tono, no solo en flags internos"):
		// `BoredomSystem.expressionBiases()` already existed but was never
		// actually consumed anywhere. Exposed here for a host to genuinely
		// shorten/lengthen replies and dial initiative/enthusiasm, and a
		// real `playfulness` read (0 the instant `ChildlikeMode` aborts,
		// since its own level itself already snaps down hard on real
		// threat/shame/humiliation — see `ChildlikeMode.shouldAbort()`).
		const engagementBiases = userId ? this.boredomSystem.expressionBiases( userId ) : { lengthBias: 1, initiativeBias: 1, enthusiasmBias: 1 }
		// Real, distinct loneliness damping on the AI's own real willingness
		// to initiate — a genuinely lonely state doesn't just feel bad, it
		// measurably suppresses real conversational initiative (own real,
		// separate downstream consequence, not the same felt-state number).
		engagementBiases.initiativeBias = clamp01( engagementBiases.initiativeBias - this.lonelinessEngine.getInitiativeDamping() )
		const playfulness            = userId ? this.childlikeMode.getLevel( userId ) : 0

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
			engagement : engagementBiases,
			playfulness : playfulness,
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
		// Real, distinct flow-state time compression — genuine absorption
		// measurably compounds on top of the arousal/fatigue-driven
		// subjective-time multiplier already computed below (Dietrich 2003's
		// own "time disappearing" account of flow, composed with, not
		// replacing, SubjectiveTimeEngine's own separate arousal-driven read).
		const flowCompression = 1 - this.flowStateEngine.getSubjectiveTimeCompressionBonus()
		const subjectiveDt = dt * this.subjectiveTimeEngine.getSubjectiveDtMultiplier( this.emotionSpace.vector.arousal, this._lastTopicFatigue ?? 0 ) * flowCompression

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
		// Real happiness → resilience — Fredrickson's (2001) broaden-and-
		// build theory: genuine sustained well-being real, honestly speeds
		// chronic-stress recovery on top of the already-real social-
		// co-regulation multiplier, own tuning of the 1+0.5x ceiling.
		const wellbeingResilience = this._lastActiveUserId ? 1 + this.happinessEngine.getWellbeingNormalized( this._lastActiveUserId ) * 0.5 : 1
		this.cortisolEngine.decay( dt * this.socialBaselineTheory.getCortisolDecayMultiplier( lastRelationTrust ) * wellbeingResilience )
		this.egoDepletionBudget.regenerate( dt )
		this.energyBudget.recover( this.cortisolEngine.getLevel(), dt ) // real cortisol-coupled recovery, see EnergyBudget.js
		this.primaryDrives.decay( dt )
		this.emotionalImmuneSystem.decay( dt )
		this.selfDeterminationNeeds.decay( dt )
		this.controllabilityEstimate.decay( dt )
		this.habitVsGoalSystem.decay( dt )
		this.inhibitoryControlPool.recover( dt )
		this.oxytocinSystem.decay( dt )
		this.endogenousOpioidSystem.decay( dt )
		this.meaningMakingEngine.tick( dt )
		this.affiliationThermostat.decay( dt )
		this.reciprocityClassifier.decay( dt )
		this.stressInoculationMemory.decay( dt )
		this.relationalMemoryCatalog.tick( dt )
		this.yearningEngine.decayAll( dt )
		this.childlikeMode.decayAll( dt )
		this.boredomSystem.decayAllUsers( dt )
		this.jealousyTriangle.decayHate( dt )
		this.infatuationEngine.decay( dt )
		this.prideCompetenceEngine.decay( dt )
		this.socialFatigueEngine.rest( dt )
		this.dailyExpectationEngine.decayAll( dt )
		this.gratitudeEngine.decayAll( dt )
		this.deceptionDecisionEngine.decayAll( dt )
		this.clinginessEngine.decayAll( dt )
		this.capitalVicesEngine.decayWrath( dt )
		for ( const userId of this.epistemicTrust.priorError.keys() ) this.epistemicTrust.decayPriorError( userId, dt )
		// Real ambient absence pull — YearningEngine.tickAbsence(), per the
		// user's own explicit request: a genuinely significant absent person
		// (a real permanent milestone) should be missed a little just from
		// real elapsed time, not only when a lexical cue happens to surface
		// them mid-conversation. Runs for every real person on record, not
		// only the currently active one.
		const nowForAbsence = Date.now()
		for ( const [ personId, person ] of this.relationalMemoryCatalog.people ) {

			if ( !person.milestones.some( m => m.permanent ) ) continue
			const lastContact = Math.max( person.affectLedger.lastPositiveTs ?? 0, person.affectLedger.lastNegativeTs ?? 0 )
			if ( !lastContact ) continue
			this.yearningEngine.tickAbsence( personId, dt, {
				cumulativeWarmth : person.affectLedger.cumulativeWarmth,
				cumulativeHurt      : person.affectLedger.cumulativeHurt,
				peakBond               : person.affectLedger.peakBond,
				attachmentStyle    : this.attachment.getStyle( this.personality ),
				gapMs                     : Math.max( 0, nowForAbsence - lastContact ),
				dopaminergicEngine : this.dopaminergicEngine,
				allostaticLoad      : this.homeostasis.allostaticLoad,
				ruptureFactor         : this.relationalMemoryCatalog.getRuptureFactor( personId ),
			} )

		}
		this.frikiEngine.decayHobbies( dt )
		this.globalMoodAbatement.decay( dt, this.frikiEngine.getObsession() ? 0.2 : 0 )
		this.grudgeSystem.decay( dt )
		for ( const userId of this.flirtationEngine.signals.keys() ) this.flirtationEngine.decay( userId, dt )
		for ( const somatic of this.somaticActivationSystems.values() ) somatic.update( { stimulusIntensity: 0, affinity: 0, trust: 1 }, dt ) // real passive dissipation between turns

		this.superegoMonitor.decay( dt )
		this.residualAnnoyanceTrace.decay( dt )
		this.politenessShutdown.recover( dt )
		for ( const userId of this.contemptDetector.disrespect.keys() ) this.contemptDetector.decay( userId, dt )
		for ( const target of this.desireEngine.desire.keys() ) this.desireEngine.decay( target, dt )
		for ( const target of this.cravingTrace.craving.keys() ) this.cravingTrace.decay( target, dt )
		this.chillsEngine.update( 0, dt ) // real natural decay toward 0 via its own -lambda*level term, no fresh activation
		for ( const cue of this.chillsEngine.habituation.keys() ) this.chillsEngine.decayHabituation( cue, undefined, dt )
		for ( const secretId of this.secretMaintenanceSystem.secrets.keys() ) this.secretMaintenanceSystem.decay( secretId, dt )
		for ( const userId of this.sharedRelationalCulture.items.keys() ) this.sharedRelationalCulture.decay( userId, dt )
		for ( const userId of this.intuitionEngine.suspicion.keys() ) this.intuitionEngine.decay( userId, dt )
		for ( const userId of this.traumaCascadeEngine.traumaTrace.keys() ) this.traumaCascadeEngine.decay( userId, dt, this._lastActiveUserId === userId ? Math.max( this.attachment.get( userId ).trust, this.attachment.get( userId ).affinity ) : 0.3 )
		for ( const userId of this.happinessEngine.occupancy.keys() ) this.happinessEngine.decay( userId, dt )
		for ( const userId of this.demandWithdrawLoop.demandPressure.keys() ) this.demandWithdrawLoop.decay( userId, dt )
		this.selfPresentationManager.decay( dt )
		this.moralLicensing.decay( dt )
		this.amusementEngine.decay( dt )
		for ( const userId of this.moralDisgust.exposure.keys() ) this.moralDisgust.decay( userId, dt )
		for ( const userId of this.prestigeSystem.prestige.keys() ) this.prestigeSystem.decay( userId, dt )
		this.idealSelfDiscrepancy.decay( dt )
		for ( const userId of this.comparisonLevelAlternatives.perceivedAlternativeQuality.keys() ) this.comparisonLevelAlternatives.decay( userId, dt )
		this.subconsciousEngine.decay( dt )
		this.conservationWithdrawal.decay( dt )
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
			yearningTraces                                                                                                                                       : this.yearningEngine.toJSON(),
			childlikeLevels                                                                                                                                     : this.childlikeMode.toJSON(),
			boredomState                                                                                                                                          : this.boredomSystem.toJSON(),
			jealousyTriangleState                                                                                                                                 : this.jealousyTriangle.toJSON(),
			socialGraph                                                                                                                                              : this.socialGraphClassifier.toJSON(),
			infatuationState                                                                                                                                       : this.infatuationEngine.toJSON(),
			contactFrequencyState                                                                                                                            : this.contactFrequencyExpectation.toJSON(),
			comfortSeekingState                                                                                                                                : this.comfortSeekingEngine.toJSON(),
			prideCompetenceState                                                                                                                              : this.prideCompetenceEngine.toJSON(),
			socialFatigueLevel                                                                                                                                   : this.socialFatigueEngine.toJSON(),
			firstImpressionState                                                                                                                                : this.firstImpressionEngine.toJSON(),
			dailyExpectationState                                                                                                                             : this.dailyExpectationEngine.toJSON(),
			comfortAccumulationState                                                                                                                    : this.comfortAccumulation.toJSON(),
			gratitudeSustainedState                                                                                                                        : [ ...this.gratitudeEngine.state.entries() ],
			nostalgiaPeakWarmth                                                                                                                              : this.nostalgiaEngine.toJSON(),
			forgivenessPhases                                                                                                                                 : this.forgivenessProcess.toJSON(),
			validationSeekingState                                                                                                                     : this.validationSeekingEngine.toJSON(),
			deceptionActiveLies                                                                                                                              : this.deceptionDecisionEngine.toJSON(),
			clinginessState                                                                                                                                     : this.clinginessEngine.toJSON(),
			flowStateLevel                                                                                                                                        : this.flowStateEngine.toJSON(),
			capitalVicesState                                                                                                                                    : this.capitalVicesEngine.toJSON(),
			opinionStanceState                                                                                                                                 : this.opinionStanceEngine.toJSON(),
			ambientBehavioralState                                                                                                                       : this.ambientBehavioralTrace.toJSON(),
			fineTuneCurriculumState                                                                                                                : this.fineTuneCurriculum.toJSON(),
			epistemicTrustState                                                                                                                                : this.epistemicTrust.toJSON(),
			frikiEngine                                                                                                                                      : this.frikiEngine.toJSON(),
			somaticActivationLevels                                                                                                                             : [ ...this.somaticActivationSystems.entries() ].map( ( [ id, s ] ) => [ id, s.level ] ),
			globalMoodAbatementLevel                                                                                                                               : this.globalMoodAbatement.level,
			ghostingState                                                                                                                                             : [ ...this.ghostingDetector.state.entries() ],
			tipOfTongueBlocks                                                                                                                                            : [ ...this.tipOfTongue.blocks.entries() ],
			grudges                                                                                                                                                         : [ ...this.grudgeSystem.grievances.entries() ],
			socialDiscomfortHistory                                                                                                                                            : [ ...this.socialDiscomfort.lastStatus.entries() ],
			flirtationSignals                                                                                                                                                     : [ ...this.flirtationEngine.signals.entries() ],
			blushRecentSlips                                                                                                                                                         : this.blushSlipEngine.recentSlips,
			recentDominantFamilies                                                                                                                                                      : this._recentDominantFamilies,
			affectAlignmentCorrection                                                                                                                                                      : { ...this.affectAlignmentMonitor.correction },

			postConflictCoolingState                                                                                                                                                          : [ ...this.postConflictCooling.state.entries() ],
			superegoDiscrepancyState                                                                                                                                                             : { discrepancy: this.superegoMonitor.discrepancy, violationCount: this.superegoMonitor.violationCount },
			residualAnnoyanceLevel                                                                                                                                                                  : this.residualAnnoyanceTrace.trace,
			effortWithholdingState                                                                                                                                                                     : { given: [ ...this.effortWithholding.given.entries() ], received: [ ...this.effortWithholding.received.entries() ] },
			politenessBudgetLevel                                                                                                                                                                         : this.politenessShutdown.budget,
			contemptDisrespectState                                                                                                                                                                          : [ ...this.contemptDetector.disrespect.entries() ],
			demandWithdrawState                                                                                                                                                                                 : [ ...this.demandWithdrawLoop.demandPressure.entries() ],
			selfPresentationState                                                                                                                                                                                  : { strategy: [ ...this.selfPresentationManager.strategy.entries() ], maintenanceCost: this.selfPresentationManager.maintenanceCost },
			egoCalibrationState                                                                                                                                                                                       : { trackRecord: this.egoCalibrationSuite.trackRecord, selfAssessment: this.egoCalibrationSuite.selfAssessment },
			loyalties                                                                                                                                                                                                    : [ ...this.loyaltyConflictResolver.loyalties.entries() ],
			moralCreditLevel                                                                                                                                                                                                : this.moralLicensing.moralCredit,
			relationalAfterglowState                                                                                                                                                                                           : [ ...this.relationalAfterglow.state.entries() ],
			gratitudeExpectedBaseline                                                                                                                                                                                             : [ ...this.gratitudeEngine.expectedBaseline.entries() ],
			reciprocityFavorTimestamps                                                                                                                                                                                               : [ ...this.reciprocityClassifier.favorReceivedAt.entries() ],

			amusementRecentBits                                                                                                                                                                                                         : [ ...this.amusementEngine.recentBits.entries() ],
			moralDisgustExposure                                                                                                                                                                                                           : [ ...this.moralDisgust.exposure.entries() ],
			mortalitySalienceState                                                                                                                                                                                                            : this.mortalitySalience.state,
			reliefState                                                                                                                                                                                                                          : this.reliefEngine.state,

			prestigeState                                                                                                                                                                                                                           : [ ...this.prestigeSystem.prestige.entries() ],
			idealSelfDiscrepancyLevel                                                                                                                                                                                                                  : this.idealSelfDiscrepancy.discrepancy,
			comparisonLevelAlternativesState                                                                                                                                                                                                              : [ ...this.comparisonLevelAlternatives.perceivedAlternativeQuality.entries() ],

			dreams                                                                                                                                                                                                                                            : [ ...this.dreamEngine.dreams.entries() ],
			compositeDreams                                                                                                                                                                                                                         : [ ...this.dreamEngine.compositeDreams.entries() ],
			subconsciousState                                                                                                                                                                                                                                    : {
				coalitionResidue : [ ...this.subconsciousEngine.coalitionResidue.entries() ],
				exposureCount        : [ ...this.subconsciousEngine.exposureCount.entries() ],
				suppressed              : [ ...this.subconsciousEngine.suppressed.entries() ],
			},
			conservationWithdrawalLevel                                                                                                                                                                                                                             : this.conservationWithdrawal.overwhelm,
			signalDetectionCounts                                                                                                                                                                                                                          : [ ...this.signalDetectionTheory.counts.entries() ],
			stevensExponents                                                                                                                                                                                                                                    : [ ...this.stevensPowerLaw.exponents.entries() ],
			oxytocinLevels                                                                                                                                                                                                                                     : [ ...this.oxytocinSystem.levels.entries() ],
			opioidBuffers                                                                                                                                                                                                                                       : [ ...this.endogenousOpioidSystem.buffers.entries() ],
			desireLevels                                                                                                                                                                                                                                       : [ ...this.desireEngine.desire.entries() ],
			desireExposure                                                                                                                                                                                                                                  : [ ...this.desireEngine.exposure.entries() ],
			cravingLevels                                                                                                                                                                                                                                    : [ ...this.cravingTrace.craving.entries() ],
			chillsLevel                                                                                                                                                                                                                                       : this.chillsEngine.level,
			intuitionSuspicion                                                                                                                                                                                                                       : [ ...this.intuitionEngine.suspicion.entries() ],
			intuitionCalibration                                                                                                                                                                                                                   : [ ...this.intuitionEngine.calibration.entries() ],
			intuitionReinforcement                                                                                                                                                                                                             : [ ...this.intuitionEngine.reinforcement.entries() ],
			intuitionStreaks                                                                                                                                                                                                                       : [ ...this.intuitionEngine.streaks.entries() ],
			intuitionLastDeceptionAt                                                                                                                                                                                                     : [ ...this.intuitionEngine.lastDeceptionAt.entries() ],
			traumaTraces                                                                                                                                                                                                                    : [ ...this.traumaCascadeEngine.traumaTrace.entries() ],
			traumaFragments                                                                                                                                                                                                             : [ ...this.traumaCascadeEngine.fragments.entries() ],
			traumaSeverity                                                                                                                                                                                                                : [ ...this.traumaCascadeEngine.severity.entries() ],
			traumaScarFloor                                                                                                                                                                                                            : [ ...this.traumaCascadeEngine.scarFloor.entries() ],
			traumaRecentSignature                                                                                                                                                                                                 : [ ...this.traumaCascadeEngine.recentSignature.entries() ],
			traumaSupportQuality                                                                                                                                                                                          : [ ...this.traumaCascadeEngine.supportQuality.entries() ],
			traumaBaseScarFloor                                                                                                                                                                                         : [ ...this.traumaCascadeEngine.baseScarFloor.entries() ],
			happinessSumCR                                                                                                                                                                                                             : [ ...this.happinessEngine.sumCR.entries() ],
			happinessSumEV                                                                                                                                                                                                             : [ ...this.happinessEngine.sumEV.entries() ],
			happinessSumRPE                                                                                                                                                                                                           : [ ...this.happinessEngine.sumRPE.entries() ],
			happinessOccupancy                                                                                                                                                                                                     : [ ...this.happinessEngine.occupancy.entries() ],
			chillsHabituation                                                                                                                                                                                                                          : [ ...this.chillsEngine.habituation.entries() ],
			secretMaintenance                                                                                                                                                                                                                        : [ ...this.secretMaintenanceSystem.secrets.entries() ],
			sharedCulture                                                                                                                                                                                                                              : [ ...this.sharedRelationalCulture.items.entries() ].map( ( [ id, m ] ) => [ id, [ ...m.entries() ] ] ),
			lonelinessLevel                                                                                                                                                                                                                            : this.lonelinessEngine.loneliness,
			hopeLevel                                                                                                                                                                                                                                        : this.hopeDisappointmentSystem.hope,
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
		if ( data.yearningTraces ) this.yearningEngine.restoreState( data.yearningTraces )
		if ( data.childlikeLevels ) this.childlikeMode.restoreState( data.childlikeLevels )
		if ( data.boredomState ) this.boredomSystem.restoreState( data.boredomState )
		if ( data.frikiEngine ) this.frikiEngine.restoreState( data.frikiEngine )
		if ( data.somaticActivationLevels ) for ( const [ id, level ] of data.somaticActivationLevels ) { const s = new SomaticActivationSystem(); s.level = level; this.somaticActivationSystems.set( id, s ) }
		if ( typeof data.globalMoodAbatementLevel === 'number' ) this.globalMoodAbatement.level = data.globalMoodAbatementLevel
		if ( data.ghostingState ) this.ghostingDetector.state = new Map( data.ghostingState )
		if ( data.tipOfTongueBlocks ) this.tipOfTongue.blocks = new Map( data.tipOfTongueBlocks )
		if ( data.grudges ) this.grudgeSystem.grievances = new Map( data.grudges )
		if ( data.socialDiscomfortHistory ) this.socialDiscomfort.lastStatus = new Map( data.socialDiscomfortHistory )
		if ( data.flirtationSignals ) this.flirtationEngine.signals = new Map( data.flirtationSignals )
		if ( typeof data.blushRecentSlips === 'number' ) this.blushSlipEngine.recentSlips = data.blushRecentSlips
		if ( data.recentDominantFamilies ) this._recentDominantFamilies = data.recentDominantFamilies
		if ( data.affectAlignmentCorrection ) this.affectAlignmentMonitor.correction = data.affectAlignmentCorrection

		if ( data.postConflictCoolingState ) this.postConflictCooling.state = new Map( data.postConflictCoolingState )
		if ( data.superegoDiscrepancyState ) { this.superegoMonitor.discrepancy = data.superegoDiscrepancyState.discrepancy; this.superegoMonitor.violationCount = data.superegoDiscrepancyState.violationCount }
		if ( typeof data.residualAnnoyanceLevel === 'number' ) this.residualAnnoyanceTrace.trace = data.residualAnnoyanceLevel
		if ( data.effortWithholdingState ) { this.effortWithholding.given = new Map( data.effortWithholdingState.given ); this.effortWithholding.received = new Map( data.effortWithholdingState.received ) }
		if ( typeof data.politenessBudgetLevel === 'number' ) this.politenessShutdown.budget = data.politenessBudgetLevel
		if ( data.contemptDisrespectState ) this.contemptDetector.disrespect = new Map( data.contemptDisrespectState )
		if ( data.demandWithdrawState ) this.demandWithdrawLoop.demandPressure = new Map( data.demandWithdrawState )
		if ( data.selfPresentationState ) { this.selfPresentationManager.strategy = new Map( data.selfPresentationState.strategy ); this.selfPresentationManager.maintenanceCost = data.selfPresentationState.maintenanceCost }
		if ( data.egoCalibrationState ) { this.egoCalibrationSuite.trackRecord = data.egoCalibrationState.trackRecord; this.egoCalibrationSuite.selfAssessment = data.egoCalibrationState.selfAssessment }
		if ( data.loyalties ) this.loyaltyConflictResolver.loyalties = new Map( data.loyalties )
		if ( typeof data.moralCreditLevel === 'number' ) this.moralLicensing.moralCredit = data.moralCreditLevel
		if ( data.relationalAfterglowState ) this.relationalAfterglow.state = new Map( data.relationalAfterglowState )
		if ( data.gratitudeExpectedBaseline ) this.gratitudeEngine.expectedBaseline = new Map( data.gratitudeExpectedBaseline )
		if ( data.reciprocityFavorTimestamps ) this.reciprocityClassifier.favorReceivedAt = new Map( data.reciprocityFavorTimestamps )

		if ( data.amusementRecentBits ) this.amusementEngine.recentBits = new Map( data.amusementRecentBits )
		if ( data.moralDisgustExposure ) this.moralDisgust.exposure = new Map( data.moralDisgustExposure )
		if ( data.mortalitySalienceState !== undefined ) this.mortalitySalience.state = data.mortalitySalienceState
		if ( data.reliefState !== undefined ) this.reliefEngine.state = data.reliefState

		if ( data.prestigeState ) this.prestigeSystem.prestige = new Map( data.prestigeState )
		if ( typeof data.idealSelfDiscrepancyLevel === 'number' ) this.idealSelfDiscrepancy.discrepancy = data.idealSelfDiscrepancyLevel
		if ( data.comparisonLevelAlternativesState ) this.comparisonLevelAlternatives.perceivedAlternativeQuality = new Map( data.comparisonLevelAlternativesState )

		if ( data.dreams ) this.dreamEngine.dreams = new Map( data.dreams )
		if ( data.compositeDreams ) this.dreamEngine.compositeDreams = new Map( data.compositeDreams )
		if ( data.subconsciousState ) {

			this.subconsciousEngine.coalitionResidue = new Map( data.subconsciousState.coalitionResidue )
			this.subconsciousEngine.exposureCount        = new Map( data.subconsciousState.exposureCount )
			this.subconsciousEngine.suppressed              = new Map( data.subconsciousState.suppressed )

		}
		if ( typeof data.conservationWithdrawalLevel === 'number' ) this.conservationWithdrawal.overwhelm = data.conservationWithdrawalLevel
		if ( data.signalDetectionCounts ) this.signalDetectionTheory.counts = new Map( data.signalDetectionCounts )
		if ( data.oxytocinLevels ) this.oxytocinSystem.levels = new Map( data.oxytocinLevels )
		if ( data.desireLevels ) this.desireEngine.desire = new Map( data.desireLevels )
		if ( data.desireExposure ) this.desireEngine.exposure = new Map( data.desireExposure )
		if ( data.cravingLevels ) this.cravingTrace.craving = new Map( data.cravingLevels )
		if ( typeof data.chillsLevel === 'number' ) this.chillsEngine.level = data.chillsLevel
		if ( data.intuitionSuspicion ) this.intuitionEngine.suspicion = new Map( data.intuitionSuspicion )
		if ( data.intuitionCalibration ) this.intuitionEngine.calibration = new Map( data.intuitionCalibration )
		if ( data.intuitionReinforcement ) this.intuitionEngine.reinforcement = new Map( data.intuitionReinforcement )
		if ( data.intuitionStreaks ) this.intuitionEngine.streaks = new Map( data.intuitionStreaks )
		if ( data.intuitionLastDeceptionAt ) this.intuitionEngine.lastDeceptionAt = new Map( data.intuitionLastDeceptionAt )
		if ( data.traumaTraces ) this.traumaCascadeEngine.traumaTrace = new Map( data.traumaTraces )
		if ( data.traumaFragments ) this.traumaCascadeEngine.fragments = new Map( data.traumaFragments )
		if ( data.traumaSeverity ) this.traumaCascadeEngine.severity = new Map( data.traumaSeverity )
		if ( data.traumaScarFloor ) this.traumaCascadeEngine.scarFloor = new Map( data.traumaScarFloor )
		if ( data.traumaRecentSignature ) this.traumaCascadeEngine.recentSignature = new Map( data.traumaRecentSignature )
		if ( data.traumaSupportQuality ) this.traumaCascadeEngine.supportQuality = new Map( data.traumaSupportQuality )
		if ( data.traumaBaseScarFloor ) this.traumaCascadeEngine.baseScarFloor = new Map( data.traumaBaseScarFloor )
		if ( data.jealousyTriangleState ) this.jealousyTriangle.restoreState( data.jealousyTriangleState )
		if ( data.socialGraph ) this.socialGraphClassifier.restoreState( data.socialGraph )
		if ( data.infatuationState ) this.infatuationEngine.restoreState( data.infatuationState )
		if ( data.contactFrequencyState ) this.contactFrequencyExpectation.restoreState( data.contactFrequencyState )
		if ( data.comfortSeekingState ) this.comfortSeekingEngine.restoreState( data.comfortSeekingState )
		if ( data.prideCompetenceState ) this.prideCompetenceEngine.restoreState( data.prideCompetenceState )
		if ( data.socialFatigueLevel !== undefined ) this.socialFatigueEngine.restoreState( data.socialFatigueLevel )
		if ( data.firstImpressionState ) this.firstImpressionEngine.restoreState( data.firstImpressionState )
		if ( data.dailyExpectationState ) this.dailyExpectationEngine.restoreState( data.dailyExpectationState )
		if ( data.comfortAccumulationState ) this.comfortAccumulation.restoreState( data.comfortAccumulationState )
		if ( data.gratitudeSustainedState ) this.gratitudeEngine.state = new Map( data.gratitudeSustainedState )
		if ( data.nostalgiaPeakWarmth ) this.nostalgiaEngine.restoreState( data.nostalgiaPeakWarmth )
		if ( data.forgivenessPhases ) this.forgivenessProcess.restoreState( data.forgivenessPhases )
		if ( data.validationSeekingState ) this.validationSeekingEngine.restoreState( data.validationSeekingState )
		if ( data.deceptionActiveLies ) this.deceptionDecisionEngine.restoreState( data.deceptionActiveLies )
		if ( data.clinginessState ) this.clinginessEngine.restoreState( data.clinginessState )
		if ( data.flowStateLevel !== undefined ) this.flowStateEngine.restoreState( data.flowStateLevel )
		if ( data.capitalVicesState ) this.capitalVicesEngine.restoreState( data.capitalVicesState )
		if ( data.opinionStanceState ) this.opinionStanceEngine.restoreState( data.opinionStanceState )
		if ( data.ambientBehavioralState ) this.ambientBehavioralTrace.restoreState( data.ambientBehavioralState )
		if ( data.fineTuneCurriculumState ) this.fineTuneCurriculum.restoreState( data.fineTuneCurriculumState )
		if ( data.epistemicTrustState ) this.epistemicTrust.restoreState( data.epistemicTrustState )
		if ( data.happinessSumCR ) this.happinessEngine.sumCR = new Map( data.happinessSumCR )
		if ( data.happinessSumEV ) this.happinessEngine.sumEV = new Map( data.happinessSumEV )
		if ( data.happinessSumRPE ) this.happinessEngine.sumRPE = new Map( data.happinessSumRPE )
		if ( data.happinessOccupancy ) this.happinessEngine.occupancy = new Map( data.happinessOccupancy )
		if ( data.chillsHabituation ) this.chillsEngine.habituation = new Map( data.chillsHabituation )
		if ( data.secretMaintenance ) this.secretMaintenanceSystem.secrets = new Map( data.secretMaintenance )
		if ( data.sharedCulture ) this.sharedRelationalCulture.items = new Map( data.sharedCulture.map( ( [ id, entries ] ) => [ id, new Map( entries ) ] ) )
		if ( typeof data.lonelinessLevel === 'number' ) this.lonelinessEngine.loneliness = data.lonelinessLevel
		if ( typeof data.hopeLevel === 'number' ) this.hopeDisappointmentSystem.hope = data.hopeLevel
		if ( data.opioidBuffers ) this.endogenousOpioidSystem.buffers = new Map( data.opioidBuffers )
		if ( data.stevensExponents ) this.stevensPowerLaw.exponents = new Map( data.stevensExponents )

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
