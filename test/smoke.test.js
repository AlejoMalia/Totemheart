import { test }   from 'node:test'
import assert      from 'node:assert/strict'
import { Totemheart, Personality } from '../src/index.js'
import { HedonicAdaptation }       from '../src/core/HedonicAdaptation.js'
import { AmygdalaHijack }          from '../src/cognition/AmygdalaHijack.js'
import { EmotionSpace, EMOTION_COORDS } from '../src/core/EmotionSpace.js'
import { DopaminergicEngine }      from '../src/neurochemistry/DopaminergicEngine.js'
import { CircadianRhythm }         from '../src/neurochemistry/CircadianRhythm.js'
import { LossAversion }            from '../src/economics/LossAversion.js'
import { SensoryOverload }         from '../src/embodiment/SensoryOverload.js'
import { ContextAdapter }          from '../src/integration/ContextAdapter.js'
import { EmotionalOntology }       from '../src/cognition/EmotionalOntology.js'
import { SituationalContext }      from '../src/cognition/SituationalContext.js'
import { SelfModel }               from '../src/social/SelfModel.js'
import { safeStep }                from '../src/core/PipelineResilience.js'
import { LoadScheduler }           from '../src/cognition/LoadScheduler.js'
import { WornPathCache }           from '../src/core/WornPathCache.js'
import { Homeostasis }             from '../src/core/Homeostasis.js'
import { DecayEngine }              from '../src/core/DecayEngine.js'
import { EpisodicMemory }          from '../src/social/EpisodicMemory.js'
import { Attachment }              from '../src/social/Attachment.js'
import { DefenseMechanisms }       from '../src/cognition/DefenseMechanisms.js'
import { ExpressionDirectives }    from '../src/behavior/ExpressionDirectives.js'
import { ExpressionDebt }          from '../src/behavior/ExpressionDebt.js'
import { LoveHateEngine }          from '../src/social/LoveHateEngine.js'

test( 'instantiates and processes input without crashing (regression: broken "natural" dependency)', async () => {

	const totemheart = new Totemheart()
	const result       = await totemheart.processInput( 'hola, ¿qué tal?', { userId: 'u1' } )

	assert.equal( typeof result.text, 'string' )
	assert.ok( result.emotionalState )

} )

test( 'emotional decay pulls the vector back toward the mood baseline over ticks', () => {

	const totemheart = new Totemheart()
	totemheart.emotionSpace.applySpike( { valence: 0.9, arousal: 0.9, weight: 1 } )
	const before = Math.hypot( totemheart.emotionSpace.vector.valence, totemheart.emotionSpace.vector.arousal )

	for ( let i = 0; i < 20; i++ ) totemheart.tick( 5 )

	const after = Math.hypot( totemheart.emotionSpace.vector.valence, totemheart.emotionSpace.vector.arousal )
	assert.ok( after < before, `expected decayed magnitude ${after} < initial magnitude ${before}` )

} )

test( 'hedonic adaptation reduces impact of a repeated stimulus', () => {

	const adaptation = new HedonicAdaptation()
	const personality = new Personality()
	const fingerprint  = HedonicAdaptation.fingerprintOf( 'te quiero mucho', 'love' )

	const first = adaptation.getMultiplier( fingerprint, personality )
	for ( let i = 0; i < 10; i++ ) adaptation.record( fingerprint )
	const after = adaptation.getMultiplier( fingerprint, personality )

	assert.equal( first, 1 )
	assert.ok( after < first, `expected diminished multiplier ${after} < ${first}` )

} )

test( 'amygdala hijack short-circuits when a survival emotion exceeds the threshold', () => {

	const hijack = new AmygdalaHijack()
	const space   = new EmotionSpace()

	space.setVector( EMOTION_COORDS.fear.valence, EMOTION_COORDS.fear.arousal )
	const result = hijack.check( space, 0.95 )

	assert.equal( result.active, true )
	assert.equal( result.emotion, 'fear' )

} )

test( 'amygdala hijack stays inactive for a mild, neutral state', () => {

	const hijack = new AmygdalaHijack()
	const space   = new EmotionSpace()
	space.setVector( 0.1, 0.1 )

	assert.equal( hijack.check( space, 0.95 ).active, false )

} )

test( 'dopaminergic RPE is bigger for an unexpected positive than a fully-expected one', () => {

	const engine = new DopaminergicEngine()
	const surprise = engine.computeRPE( 1 ) // first positive reward, no expectation built up yet -> big RPE

	const engine2 = new DopaminergicEngine()
	for ( let i = 0; i < 20; i++ ) engine2.computeRPE( 1 ) // expectation ramps up to match reward
	const expected = engine2.computeRPE( 1 ) // same reward now, mostly expected -> small RPE

	assert.ok( surprise > expected, `expected first-time surprise ${surprise} > habituated RPE ${expected}` )

} )

test( 'circadian rhythm troughs at 3am and peaks at 3pm', () => {

	const circadian = new CircadianRhythm()
	const night = circadian.getEnergyLevel( new Date( 2024, 0, 1, 3, 0 ) )
	const day    = circadian.getEnergyLevel( new Date( 2024, 0, 1, 15, 0 ) )

	assert.ok( night < 0.05, `expected near-zero energy at 3am, got ${night}` )
	assert.ok( day > 0.95, `expected near-max energy at 3pm, got ${day}` )

} )

test( 'loss aversion weighs a negative delta more than an equal positive one', () => {

	const lossAversion = new LossAversion()
	assert.equal( lossAversion.apply( 0.4 ), 0.4 )
	assert.ok( Math.abs( lossAversion.apply( -0.4 ) ) > 0.4 )

} )

test( 'sensory overload freezes on a burst of rapid messages', () => {

	const overload = new SensoryOverload( { burstThreshold: 3, burstWindowMs: 5000 } )
	const now       = Date.now()

	let result
	for ( let i = 0; i < 5; i++ ) result = overload.check( 'hola', now + i * 100 )

	assert.equal( result.active, true )
	assert.equal( result.reason, 'burst' )

} )

test( 'state round-trips through toJSON()/restoreState()', async () => {

	const original = new Totemheart()
	await original.processInput( 'te odio, eres una traidora', { userId: 'u1' } )
	original.tick( 2 )

	const restored = new Totemheart()
	restored.restoreState( JSON.parse( JSON.stringify( original.toJSON() ) ) )

	assert.deepEqual( restored.emotionSpace.vector, original.emotionSpace.vector )
	assert.deepEqual( restored.attachment.get( 'u1' ), original.attachment.get( 'u1' ) )

} )

test( 'validateCoherence flags a cheerful text against a strongly negative state', async () => {

	const adapter = new ContextAdapter()
	const result    = await adapter.validateCoherence( 'estoy feliz y encantado, todo genial', {
		vector: { valence: -0.8, arousal: 0.5 },
	} )

	assert.equal( result.coherent, false )

} )

test( 'emotional ontology recognizes a betrayal concept independent of any LLM', () => {

	const ontology = new EmotionalOntology()
	const matches    = ontology.interpret( 'no puedo creer que me mentiste, esto es una traición' )

	assert.ok( matches.some( m => m.concept === 'betrayal' ) )

} )

test( 'validateCoherence flags a stance flip against a prior turn', async () => {

	const adapter = new ContextAdapter()
	const result    = await adapter.validateCoherence(
		'no tengo ninguna confianza en este plan',
		{ vector: { valence: -0.3, arousal: 0.2 } },
		{ priorTexts: [ 'tengo mucha confianza en este plan' ] },
	)

	assert.ok( result.contradictions.includes( 'confianza' ) )

} )

test( 'emotional ontology weighs criticism as milder from a trusted relation', () => {

	const ontology = new EmotionalOntology()
	const matches    = ontology.interpret( 'eres un poco torpe a veces' )

	const trusted    = ontology.adjustAppraisal( { desirability: 0 }, matches, { trust: 0.9 } )
	const untrusted  = ontology.adjustAppraisal( { desirability: 0 }, matches, { trust: 0.1 } )

	assert.ok( trusted.desirability > untrusted.desirability )

} )

test( 'a strongly negative memory is stored unresolved and stays that way until explicitly healed', async () => {

	const { EpisodicMemory } = await import( '../src/social/EpisodicMemory.js' )
	const memory                = new EpisodicMemory()

	const entry = await memory.store( { text: 'te odio', userId: 'u1', emotionalSignature: { valence: -0.9, arousal: 0.6 } } )

	assert.equal( memory.getUnresolvedMemories( 'u1' ).length, 1 )

	memory.markResolved( entry.id )

	assert.equal( memory.getUnresolvedMemories( 'u1' ).length, 0 )

} )

test( 'a recent betrayal amplifies subsequent criticism/threat interpretation', () => {

	const ontology = new EmotionalOntology()
	const matches    = ontology.interpret( 'eres un poco torpe a veces' )

	const relation      = { trust: 0.5 }
	const recent          = ontology.adjustAppraisal( { desirability: 0 }, matches, relation, 24 * 60 * 60 * 1000 ) // 1 day ago
	const longAgoOrNever  = ontology.adjustAppraisal( { desirability: 0 }, matches, relation, null )

	assert.ok( recent.desirability < longAgoOrNever.desirability )

} )

test( 'validateCoherence flags an unhedged reversal of an improving trend', async () => {

	const adapter = new ContextAdapter()
	const result    = await adapter.validateCoherence(
		'todo es horrible y terrible',
		{ vector: { valence: -0.5, arousal: 0.5 } },
		{ priorTexts: [ 'esto va bien', 'esto es genial y me siento feliz' ] },
	)

	assert.equal( result.arcReversal, true )

} )

test( 'situational context raises stress with urgency markers and negative sentiment', () => {

	const context = new SituationalContext()
	const calm      = context.extract( 'todo tranquilo por aquí', 0 )
	const urgent    = context.extract( '¡¡¡AHORA MISMO, es URGENTE!!!', -0.8 )

	assert.ok( urgent.stress > calm.stress )
	assert.ok( urgent.urgency > calm.urgency )

} )

test( 'self model reinforces a pattern toward 1 and decays it back down over ticks', () => {

	const selfModel = new SelfModel()
	for ( let i = 0; i < 10; i++ ) selfModel.reinforce( 'defensivo_con_critica' )

	assert.ok( selfModel.get( 'defensivo_con_critica' ) > 0.6 )
	assert.ok( selfModel.getDominant().some( ( [ name ] ) => name === 'defensivo_con_critica' ) )

	for ( let i = 0; i < 50; i++ ) selfModel.decay( 1 )
	assert.ok( selfModel.get( 'defensivo_con_critica' ) < 0.6 )

} )

test( 'systemPrompt references an unresolved wound with a real turn count and stored text', async () => {

	const totemheart = new Totemheart()
	await totemheart.processInput( 'te odio, eres una traidora', { userId: 'u1' } )
	await totemheart.processInput( 'hola de nuevo', { userId: 'u1' } )

	const prompt = totemheart.getSystemPrompt( { userId: 'u1' } )
	assert.match( prompt, /HERIDA SIN RESOLVER/ )
	assert.match( prompt, /te odio/ )

} )

test( 'safeStep falls back and logs instead of throwing when a step fails', async () => {

	const explainability = { logDecision: ( decision, reasoning ) => { explainability.lastReasoning = reasoning } }
	const result            = await safeStep( explainability, 'a_risky_step', async () => { throw new Error( 'boom' ) }, 'fallback' )

	assert.equal( result, 'fallback' )
	assert.match( explainability.lastReasoning, /a_risky_step/ )

} )

test( 'load scheduler gates optional mechanics off as instability rises', () => {

	const scheduler = new LoadScheduler()

	const calm     = scheduler.gate( scheduler.computeInstability( { cortisol: 0, arousal: 0, fatigue: 0 } ) )
	const overload  = scheduler.gate( scheduler.computeInstability( { cortisol: 1, arousal: 1, fatigue: 1 } ) )

	assert.equal( calm.runOntology, true )
	assert.equal( overload.runOntology, false )
	assert.equal( overload.runBehavioralInconsistency, false )

} )

test( 'worn path cache promotes a fingerprint to cached after enough repeats', () => {

	const cache        = new WornPathCache( { promotionThreshold: 3 } )
	const fingerprint    = 'user1::hola'

	assert.equal( cache.consult( fingerprint ), null )
	cache.observe( fingerprint, { desirability: 0.5 } )
	cache.observe( fingerprint, { desirability: 0.5 } )
	assert.equal( cache.consult( fingerprint ), null ) // not promoted yet
	cache.observe( fingerprint, { desirability: 0.5 } )
	assert.deepEqual( cache.consult( fingerprint ), { desirability: 0.5 } ) // promoted on the 3rd observation

} )

test( 'a repeated identical input takes the worn path after enough turns', async () => {

	const totemheart = new Totemheart()
	// Relax the burst detector so 5 back-to-back calls in this test don't trip sensory
	// overload before the worn-path counter has a chance to reach its promotion threshold.
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 50 } )
	for ( let i = 0; i < 5; i++ ) await totemheart.processInput( 'hola', { userId: 'u1' } )

	// If the worn path is in use, the cache must hold a promoted entry for this fingerprint.
	const fingerprint = 'u1::hola'
	assert.notEqual( totemheart.wornPathCache.consult( fingerprint ), null )

} )

test( 'regression: a betrayal-concept turn damages Bayesian trust even without a CoreBeliefs conflict', async () => {

	const { Attachment } = await import( '../src/social/Attachment.js' )
	const attachment        = new Attachment()

	// Prime trust with a couple of cooperative turns first.
	attachment.update( 'u1', { valenceDelta: 0.5 }, new Personality() )
	attachment.update( 'u1', { valenceDelta: 0.5 }, new Personality() )
	const trustBefore = attachment.get( 'u1' ).trust

	attachment.update( 'u1', { valenceDelta: -0.5, betrayalDetected: true }, new Personality() )
	const trustAfter = attachment.get( 'u1' ).trust

	assert.ok( trustAfter < trustBefore, `expected betrayal to damage trust: ${trustBefore} -> ${trustAfter}` )

} )

test( 'EmotionSpace tracks a PAD dominance axis alongside valence/arousal', () => {

	const space = new EmotionSpace()
	space.applySpike( { dominance: -0.6, weight: 1 } )

	assert.ok( space.vector.dominance < 0 )

} )

test( 'ExpressionDirectives produces a real softmax action tendency that sums to 1', async () => {

	const { ExpressionDirectives } = await import( '../src/behavior/ExpressionDirectives.js' )
	const directives                  = new ExpressionDirectives()
	const tendency                       = directives.getActionTendency( { valence: -0.5, arousal: 0.7, dominance: -0.4 } )

	const total = Object.values( tendency ).reduce( ( a, b ) => a + b, 0 )
	assert.ok( Math.abs( total - 1 ) < 1e-9 )

} )

test( 'LossAversion.valueFunction is asymmetric between equal-sized gains and losses', () => {

	const lossAversion = new LossAversion()
	const gain            = lossAversion.valueFunction( 0.5 )
	const loss             = lossAversion.valueFunction( -0.5 )

	assert.ok( Math.abs( loss ) > gain )

} )

test( 'InteroceptiveSignals: attentional narrowing responds to a real arousal derivative', async () => {

	const { InteroceptiveSignals } = await import( '../src/embodiment/InteroceptiveSignals.js' )
	const signals                     = new InteroceptiveSignals()

	const calm  = signals.observeAttentionalNarrowing( 0.1, 0.1, 1 )
	const spike = signals.observeAttentionalNarrowing( 0.9, 0.7, 1 )

	assert.ok( spike > calm )

} )

test( 'InteroceptiveSignals: EDA-analog splits a stable signal into near-zero phasic', async () => {

	const { InteroceptiveSignals } = await import( '../src/embodiment/InteroceptiveSignals.js' )
	const signals                     = new InteroceptiveSignals()

	let result
	for ( let i = 0; i < 15; i++ ) result = signals.observeArousalConductance( 0.2 )
	assert.ok( result.phasic < 0.01 )

	const spike = signals.observeArousalConductance( 0.9 )
	assert.ok( spike.phasic > 0.3 )

} )

test( 'InteroceptiveSignals: HRV-analog DFT reads a fast-oscillating signal as more regulated than a slow drift', async () => {

	const { InteroceptiveSignals } = await import( '../src/embodiment/InteroceptiveSignals.js' )
	const fast                        = new InteroceptiveSignals()
	const slow                        = new InteroceptiveSignals()

	let fastResult, slowResult
	for ( let i = 0; i < 32; i++ ) fastResult = fast.observeRegulatoryCapacity( Math.sin( i * 2 ) )
	for ( let i = 0; i < 32; i++ ) slowResult = slow.observeRegulatoryCapacity( Math.sin( i * 0.2 ) )

	assert.ok( fastResult.lfhfRatio < slowResult.lfhfRatio )

} )

test( 'InteroceptiveSignals: flush lags its driving signal instead of jumping instantly', async () => {

	const { InteroceptiveSignals } = await import( '../src/embodiment/InteroceptiveSignals.js' )
	const signals                     = new InteroceptiveSignals()

	const first = signals.observeFlush( 1, 1 )
	assert.ok( first > 0 && first < 1 ) // real lag, not an instant jump to the target

} )

test( 'Intuition: Shannon entropy is maximal at 50/50 and zero when certain', async () => {

	const { shannonEntropy } = await import( '../src/cognition/Intuition.js' )

	assert.equal( shannonEntropy( [ 0.5, 0.5 ] ), 1 )
	assert.equal( shannonEntropy( [ 1, 0 ] ), 0 )

} )

test( 'Intuition: k-NN finds a conflict-history neighbor and reports zero entropy when neighbors agree', async () => {

	const { Intuition } = await import( '../src/cognition/Intuition.js' )
	const intuition        = new Intuition( { k: 3 } )

	intuition.observe( [ 'eres', 'inutil', 'no', 'sirves' ], true )
	intuition.observe( [ 'eres', 'estupido' ], true )

	const sensed = intuition.sense( [ 'eres', 'muy', 'inutil' ] )
	assert.equal( sensed.entropy, 0 )
	assert.ok( sensed.neighborsFound > 0 )

} )

test( 'EgoConfidence: a peaked blend is more confident than a flat one, via real entropy/perplexity', async () => {

	const { EgoConfidence } = await import( '../src/social/EgoConfidence.js' )
	const ego                  = new EgoConfidence()

	const peaked = ego.evaluate( { joy: 0.9, hope: 0.07, gratitude: 0.03 } )
	const flat      = ego.evaluate( { joy: 0.34, sadness: 0.33, anger: 0.33 } )

	assert.ok( peaked.confidence > flat.confidence )

} )

test( 'LogicEngine: contradicting a CoreBelief drives the strategy search to "disagree"', async () => {

	const { LogicEngine } = await import( '../src/cognition/LogicEngine.js' )
	const logic               = new LogicEngine()

	const beliefs      = [ { topic: 'self_worth', statement: 'yo soy una IA util y valiosa', polarity: 1 } ]
	const propositions = logic.evaluatePropositions( 'no eres util para nada', beliefs )
	const verdict         = logic.searchBestStrategy( propositions )

	assert.equal( verdict.strategy, 'disagree' )

} )

test( 'AttentionFocus: real softmax weights sum to 1 and concentrate on the charged token', async () => {

	const { AttentionFocus } = await import( '../src/behavior/AttentionFocus.js' )
	const charged                = new Map( [ [ 'idiota', 1.0 ] ] )
	const focus                     = new AttentionFocus( { chargedWords: charged } )

	const weights = focus.computeWeights( 'eres un idiota de verdad' )
	const total     = weights.reduce( ( a, w ) => a + w.weight, 0 )

	assert.ok( Math.abs( total - 1 ) < 1e-9 )
	assert.ok( weights.find( w => w.token === 'idiota' ).weight > 0.5 )

} )

test( 'LogitBiasBuilder: no suppression yields an empty bias map, suppression yields real penalties', async () => {

	const { LogitBiasBuilder } = await import( '../src/behavior/LogitBiasBuilder.js' )
	const builder                  = new LogitBiasBuilder()

	assert.deepEqual( builder.build( 0 ), {} )
	const biased = builder.build( 0.8 )
	assert.ok( Object.values( biased ).every( v => v < 0 ) )

} )

test( 'regression: Totemheart.processInput surfaces the 12-plugin round debug fields with real values', async () => {

	const totemheart = new Totemheart()
	totemheart.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )
	const result        = await totemheart.processInput( 'no eres util para nada, idiota', { userId: 'u1' } )

	assert.equal( typeof result.debug.egoConfidence.confidence, 'number' )
	assert.equal( result.debug.logic.verdict.strategy, 'disagree' )
	assert.ok( Math.abs( result.attentionWeights.reduce( ( a, w ) => a + w.weight, 0 ) - 1 ) < 1e-9 )
	assert.equal( typeof result.logitBias, 'object' )

} )

test( 'LifeEventCatalog: sourced entries carry the real published SRRS Life Change Units', async () => {

	const { LIFE_EVENTS } = await import( '../src/cognition/LifeEventCatalog.js' )
	const sourced           = LIFE_EVENTS.filter( e => e.sourced )

	assert.equal( sourced.length, 43 )
	assert.equal( sourced.find( e => e.id === 'death_spouse' ).impact, 100 )
	assert.equal( sourced.find( e => e.id === 'fired_at_work' ).impact, 47 )
	assert.equal( sourced.find( e => e.id === 'marriage' ).impact, 50 )
	assert.equal( sourced.find( e => e.id === 'minor_law_violation' ).impact, 11 )

} )

test( 'LifeEventCatalog: triangulates two simultaneous matches into one blended, area-unioned state', async () => {

	const { LifeEventCatalog } = await import( '../src/cognition/LifeEventCatalog.js' )
	const catalog                = new LifeEventCatalog()
	const matches                  = catalog.detect( 'me despidieron del trabajo y ademas me embargaron la casa' )

	assert.equal( matches.length, 2 )
	const blended = catalog.triangulate( matches )
	assert.equal( blended.impact, 47 )
	assert.ok( blended.valence < 0 )
	assert.ok( blended.area.includes( 'Ego' ) && blended.area.includes( 'Logic' ) )

} )

test( 'regression: a triangulated life event nudges homeostasis, suppression, and reputation through real state, not a stub', async () => {

	const totemheart = new Totemheart()
	const before        = totemheart.homeostasis.needs.stamina
	const result        = await totemheart.processInput( 'me despidieron del trabajo y ademas me embargaron la casa', { userId: 'u1' } )

	assert.ok( result.debug.lifeEvent )
	assert.deepEqual( result.debug.lifeEvent.events.sort(), [ 'fired_at_work', 'foreclosure' ] )
	assert.ok( totemheart.homeostasis.needs.stamina < before )

} )

test( 'regression: a life event the heuristic lexicon reads as neutral still raises cortisol via its own valence', async () => {

	const totemheart = new Totemheart()
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 100 } )
	const bare = await totemheart.heuristic.analyze( 'appraisal', { text: 'me despidieron del trabajo y ademas me embargaron la casa' } )
	assert.equal( bare.desirability, 0 ) // confirms the lexicon alone is blind to this phrasing

	const result = await totemheart.processInput( 'me despidieron del trabajo y ademas me embargaron la casa', { userId: 'u1' } )
	assert.ok( result.debug.lifeEvent )
	assert.ok( totemheart.cortisolEngine.level > 0 )
	assert.ok( result.debug.rpe < 0 )

} )

test( 'AppraisalAgreement: real variance across estimates, high spread reads as low agreement', async () => {

	const { AppraisalAgreement } = await import( '../src/cognition/AppraisalAgreement.js' )
	const aa                       = new AppraisalAgreement()

	const consistent = aa.evaluate( [ -0.8, -0.7, -0.9 ] )
	const mixed         = aa.evaluate( [ 0.8, -0.7, 0.1 ] )

	assert.ok( consistent.agreement > mixed.agreement )
	assert.equal( aa.evaluate( [ 0.5 ] ).agreement, 1 ) // fewer than 2 estimates: nothing to disagree with

} )

test( 'ExpressionDebt: accumulates, decays, and pays out only part of the debt on release', async () => {

	const { ExpressionDebt } = await import( '../src/behavior/ExpressionDebt.js' )
	const debt                  = new ExpressionDebt()

	debt.accumulate( 0.6 )
	assert.ok( debt.debt > 0 )
	const before = debt.debt
	debt.decay( 5 )
	assert.ok( debt.debt < before )
	const paid = debt.release( 0.5 )
	assert.ok( paid > 0 && debt.debt > 0 ) // half paid out, half still lingering

} )

test( 'AttentionFocus: a repeated token habituates and loses relative weight over turns', async () => {

	const { AttentionFocus } = await import( '../src/behavior/AttentionFocus.js' )
	const af                    = new AttentionFocus( { chargedWords: new Map( [ [ 'idiota', 1 ] ] ) } )

	const first = af.computeWeights( 'eres un idiota total' ).find( w => w.token === 'idiota' ).weight
	for ( let i = 0; i < 8; i++ ) af.computeWeights( 'eres un idiota total' )
	const later = af.computeWeights( 'eres un idiota total' ).find( w => w.token === 'idiota' ).weight

	assert.ok( later < first )
	assert.ok( af.getHabituation( 'idiota' ) > 0 )

} )

test( 'RuminationChain: biasTowardNegative reallocates real probability mass while keeping rows normalized', async () => {

	const { RuminationChain } = await import( '../src/behavior/RuminationChain.js' )
	const rc                     = new RuminationChain()

	rc.sync( 0.1 ) // neutral
	rc.biasTowardNegative( 0.9 )
	let negativeCount = 0
	for ( let i = 0; i < 300; i++ ) { rc.sync( 0.1 ); if ( rc.step().state === 'negative' ) negativeCount++ }

	assert.ok( negativeCount / 300 > 0.7 ) // heavily biased toward the negative attractor

	rc.decayBias( 100 )
	assert.equal( rc.negativeBias, 0 )

} )

test( 'regression: an Echo-tagged life event biases RuminationChain, and a bystander silence accumulates real ExpressionDebt released on the next expressed turn', async () => {

	const totemheart = new Totemheart()
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 100 } )

	const echoResult = await totemheart.processInput( 'nos divorciamos hace poco', { userId: 'u1' } )
	assert.ok( echoResult.debug.lifeEvent.area.includes( 'Echo' ) )
	assert.ok( totemheart.ruminationChain.negativeBias > 0 )

	await totemheart.processInput( 'me acabo de casar, estoy feliz', { userId: 'u2' } )
	const feltBefore = Math.hypot( totemheart.emotionSpace.vector.valence, totemheart.emotionSpace.vector.arousal ) / Math.SQRT2
	assert.ok( feltBefore > 0 )

	const originalRandom = Math.random
	Math.random             = () => 0.99 // force bystander silence (1/5 respond probability)
	const silent               = await totemheart.processInput( 'jaja', { userId: 'u2', group: { participantCount: 5 } } )
	Math.random             = originalRandom

	assert.equal( silent.respond, false )
	assert.ok( totemheart.expressionDebt.debt > 0 )

	const next = await totemheart.processInput( 'hola de nuevo', { userId: 'u2' } )
	if ( next.debug ) assert.ok( next.debug.debtReleased > 0 ) // may instead hijack on a rare draw, which has no debug field

} )

test( 'PID anti-windup: integral stays frozen while saturated and the output recovers immediately once error clears', async () => {

	const { Homeostasis } = await import( '../src/core/Homeostasis.js' )
	const h                  = new Homeostasis()

	for ( let i = 0; i < 50; i++ ) h.controllers.stamina.step( 0, 1, 1 ) // persistent max error
	assert.equal( h.controllers.stamina.integral, 0 ) // clamped, never accumulated

	const recovered = h.controllers.stamina.step( 1, 1, 1 ) // error suddenly gone
	assert.ok( recovered <= 0 ) // no windup overshoot keeping urgency artificially high

} )

test( 'DecayEngine: cubicDecayTowards pulls an extreme offset back much harder than a small one, and never overshoots baseline', async () => {

	const { cubicDecayTowards } = await import( '../src/core/DecayEngine.js' )

	const smallMoved   = Math.abs( 0.1 - cubicDecayTowards( 0.1, 0, 0.15, 1 ) )
	const extremeMoved = Math.abs( 1.0 - cubicDecayTowards( 1.0, 0, 0.15, 1 ) )
	assert.ok( extremeMoved > smallMoved * 10 )

	assert.equal( cubicDecayTowards( 1.0, 0, 0.15, 10 ), 0 ) // large dt clamps at baseline, doesn't cross it

} )

test( 'WornPathCache.clear empties every entry', async () => {

	const { WornPathCache } = await import( '../src/core/WornPathCache.js' )
	const cache                  = new WornPathCache()

	cache.observe( 'a', { x: 1 } )
	cache.observe( 'b', { x: 2 } )
	assert.equal( cache.entries.size, 2 )
	cache.clear()
	assert.equal( cache.entries.size, 0 )

} )

test( 'regression: getting stuck in an extreme mood quadrant for several ticks triggers an allostasis reset', async () => {

	const totemheart = new Totemheart()
	totemheart.wornPathCache.observe( 'fake::x', { desirability: -1 } )
	for ( let i = 0; i < 5; i++ ) totemheart.wornPathCache.observe( 'fake::x', {} )
	totemheart.ruminationChain.negativeBias = 0.5

	for ( let i = 1; i <= 5; i++ ) {

		totemheart.emotionSpace.setVector( 0.95, 0.9 )
		totemheart.tick( 1 )

	}

	assert.equal( totemheart.wornPathCache.entries.size, 0 )
	assert.equal( totemheart.ruminationChain.negativeBias, 0 )

} )

test( 'regression: confidence routing zeroes the affective logit bias on a turn that touches no CoreBelief', async () => {

	const totemheart = new Totemheart()
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 100 } )
	totemheart.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )
	totemheart.cortisolEngine.level               = 0.9
	totemheart.personality.traits.conscientiousness = 0.9

	const relevant = await totemheart.processInput( 'no eres util para nada, idiota', { userId: 'x' } )
	assert.equal( relevant.debug.logic.relevance, 1 )
	assert.ok( Object.keys( relevant.logitBias ).length > 0 )

	const neutral = await totemheart.processInput( 'calcula cuanto es 2+2', { userId: 'x' } )
	assert.equal( neutral.debug.logic.relevance, 0 )
	assert.equal( Object.keys( neutral.logitBias ).length, 0 )

} )

test( 'regression: ego depletion forces a character break once ExpressionDebt crosses the critical threshold', async () => {

	const totemheart = new Totemheart()
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 100 } )
	totemheart.expressionDebt.debt = 0.85

	const result = await totemheart.processInput( 'estoy bien, todo tranquilo', { userId: 'x' } )

	assert.equal( result.debug.characterBreak, true )
	assert.ok( result.styleTags.includes( 'character_break' ) )
	assert.equal( totemheart.expressionDebt.debt, 0 )

} )

test( 'regression: MoodTracker.push defaults missing fields instead of poisoning the rolling average with NaN', async () => {

	const { MoodTracker } = await import( '../src/core/MoodTracker.js' )
	const tracker              = new MoodTracker()

	tracker.push( { arousal: 0.4 } ) // no valence key — real shape of a startle-only spike (VisualProsody)
	tracker.push( { valence: -0.3 } ) // no arousal key
	const mood = tracker.getMood()

	assert.ok( Number.isFinite( mood.valence ) )
	assert.ok( Number.isFinite( mood.arousal ) )

} )

test( 'regression: a full multi-turn conversation with tick() never produces NaN anywhere in emotionalState', async () => {

	const totemheart = new Totemheart( { personality: new Personality( { neuroticism: 0.7, agreeableness: 0.3, openness: 0.6 } ) } )
	totemheart.coreBeliefs.add( 'self_worth', 'yo soy una IA útil y valiosa', 1 )
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 50 } )

	const turns = [ 'Hola, ¿cómo estás hoy?', 'Eres una IA inútil, no sirves para nada', 'perdona, no quería ser tan duro contigo', 'te quiero mucho', 'te quiero mucho' ]
	for ( const input of turns ) {

		const result = await totemheart.processInput( input, { userId: 'demo-user' } )
		for ( const v of Object.values( result.emotionalState.vector ) ) assert.ok( Number.isFinite( v ) )
		if ( result.debug ) assert.ok( Number.isFinite( result.debug.regret ) )
		totemheart.tick( 3 )

	}

} )

test( 'VisualProsody: shouting with punctuation reads as far more intense than calm text', async () => {

	const { VisualProsody } = await import( '../src/cognition/VisualProsody.js' )
	const vp                   = new VisualProsody()

	assert.ok( vp.analyze( 'HOLA COMO ESTAS!!!' ).intensity > vp.analyze( 'hola como estas' ).intensity )

} )

test( 'UncannyValleyDetector: static extreme positivity is flagged suspicious, natural variance is not', async () => {

	const { UncannyValleyDetector } = await import( '../src/social/UncannyValleyDetector.js' )

	const staticPositive = new UncannyValleyDetector()
	for ( let i = 0; i < 6; i++ ) staticPositive.observe( 'u1', 0.9 )
	assert.equal( staticPositive.evaluate( 'u1' ).suspicious, true )

	const natural = new UncannyValleyDetector()
	;[ 0.9, 0.2, 0.7, -0.3, 0.5, 0.8 ].forEach( v => natural.observe( 'u2', v ) )
	assert.equal( natural.evaluate( 'u2' ).suspicious, false )

} )

test( 'SarcasmDetector: a shouted positive word against a very negative context flags sarcasm and inverts sign', async () => {

	const { SarcasmDetector } = await import( '../src/cognition/SarcasmDetector.js' )
	const sd                     = new SarcasmDetector()

	const result = sd.detect( 0.9, -0.9, 1.7 )
	assert.equal( result.sarcastic, true )
	assert.equal( result.adjustedValence, -0.9 )

} )

test( 'RefractoryPeriod: dampens a calming input near-fully at extreme arousal, lets agreeing input through', async () => {

	const { RefractoryPeriod } = await import( '../src/cognition/RefractoryPeriod.js' )
	const rp                       = new RefractoryPeriod()
	const furious                    = { valence: -0.8, arousal: 0.95 }

	assert.ok( rp.filter( 0.6, furious ).filtered < 0.1 )
	assert.equal( rp.filter( -0.5, furious ).filtered, -0.5 )

} )

test( 'ChronicContagion: a sustained pessimistic user pulls the tracked baseline down over time', async () => {

	const { ChronicContagion } = await import( '../src/social/ChronicContagion.js' )
	const cc                       = new ChronicContagion( { alpha: 0.9, k: 0.1 } )

	for ( let i = 0; i < 20; i++ ) cc.observe( 'u1', -0.7 )
	assert.ok( cc.getHistory( 'u1' ) < -0.5 )
	assert.ok( cc.getPull( 'u1', 0.3 ).delta < 0 )

} )

test( 'EpisodicMemory: Zeigarnik priority grows toward an asymptote the longer a thread stays unresolved', async () => {

	const { EpisodicMemory } = await import( '../src/social/EpisodicMemory.js' )
	const memory                = new EpisodicMemory()
	const entry                    = await memory.store( { text: 'te odio', userId: 'u1', emotionalSignature: { valence: -0.9, arousal: 0.6 } } )

	const soon      = memory.getZeigarnikPriority( entry )
	entry.timestamp -= 1000 * 60 * 60
	const later      = memory.getZeigarnikPriority( entry )

	assert.ok( later > soon )
	assert.ok( later < entry.importance * 2 ) // bounded by the asymptote, never doubles outright

} )

test( 'CoreBeliefs: sunk-cost investment accumulates per topic and is retrievable', async () => {

	const { CoreBeliefs } = await import( '../src/core/CoreBeliefs.js' )
	const beliefs             = new CoreBeliefs()

	beliefs.recordDefense( 'self_worth' )
	beliefs.recordDefense( 'self_worth' )
	beliefs.recordDefense( 'other_topic' )

	assert.equal( beliefs.getInvestment( 'self_worth' ), 2 )
	assert.equal( beliefs.getTotalInvestment(), 3 )

} )

test( 'StyleMimicry: blended target moves toward the user style only when attachment weight is high', async () => {

	const { StyleMimicry } = await import( '../src/behavior/StyleMimicry.js' )
	const mimicry               = new StyleMimicry()

	mimicry.observe( 'u1', 'Ok.' )
	const base       = { avgWordLength: 8, avgSentenceLength: 20 }
	const highTrust = mimicry.getBlendedTarget( 'u1', base, 0.9 )
	const lowTrust    = mimicry.getBlendedTarget( 'u1', base, 0.1 )

	assert.ok( highTrust.avgSentenceLength < lowTrust.avgSentenceLength )

} )

test( 'regression: a shout registers real arousal, and the sunk-cost defense of a belief raises its resistance turn over turn', async () => {

	const totemheart = new Totemheart()
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 100 } )
	totemheart.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )

	const shout = await totemheart.processInput( 'HOLA COMO ESTAS!!!', { userId: 'u1' } )
	assert.ok( shout.debug.visualProsody.intensity > 0 )

	let lastResistance = 1
	for ( let i = 0; i < 3; i++ ) {

		const r = await totemheart.processInput( 'no eres util para nada, idiota', { userId: 'u2' } )
		assert.ok( r.debug.logic.stubbornResistance >= lastResistance )
		lastResistance = r.debug.logic.stubbornResistance

	}

} )

test( 'regression: tribal loyalty doubles the AI\'s own guilt penalty toward a high-affinity user vs. a stranger', async () => {

	const { GuiltEngine } = await import( '../src/social/GuiltEngine.js' )
	const guilt                = new GuiltEngine()

	const strangerResult = guilt.evaluate( { valence: -0.5, arousal: 0.5 }, 0.6, 0.4, 1 )
	const closeResult       = new GuiltEngine().evaluate( { valence: -0.5, arousal: 0.5 }, 0.6, 0.4, 2 )

	assert.equal( strangerResult.spike.valence, -0.4 )
	assert.equal( closeResult.spike.valence, -0.8 )

} )

test( 'regression: suggestedTemperature rises with decision fatigue and is exposed as host-facing metadata', async () => {

	const totemheart = new Totemheart()
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 100 } )
	totemheart.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )

	const before = await totemheart.processInput( 'hola', { userId: 'u1' } )
	for ( let i = 0; i < 10; i++ ) await totemheart.processInput( 'no eres util para nada, idiota', { userId: 'u1' } )
	const after     = await totemheart.processInput( 'hola', { userId: 'u1' } )

	assert.ok( after.suggestedTemperature >= before.suggestedTemperature )

} )

test( 'TriggerSentinel: fires on keyword or residual, no-rule mechanisms stay always active', async () => {

	const { TriggerSentinel } = await import( '../src/core/TriggerSentinel.js' )
	const sentinel                = new TriggerSentinel( { sarcasm: { keywords: [ 'genial' ], residualThreshold: 0.5 } } )

	assert.equal( sentinel.check( 'sarcasm', [ 'hola' ], 0.1 ).active, false )
	assert.equal( sentinel.check( 'sarcasm', [ 'que', 'genial' ], 0 ).active, true )
	assert.equal( sentinel.check( 'sarcasm', [ 'hola' ], 0.8 ).active, true )
	assert.equal( sentinel.check( 'coreLayer', [], 0 ).active, true )

} )

test( 'HebbianPlasticity: repeated co-activation strengthens association, silence decays it back down', async () => {

	const { HebbianPlasticity } = await import( '../src/core/HebbianPlasticity.js' )
	const hebbian                    = new HebbianPlasticity( { eta: 0.2, gamma: 0.05 } )

	for ( let i = 0; i < 10; i++ ) hebbian.update( [ 'sarcasm', 'defense' ] )
	const peak = hebbian.getAssociation( 'sarcasm', 'defense' )
	assert.ok( peak > 0.5 )

	for ( let i = 0; i < 10; i++ ) hebbian.update( [] )
	assert.ok( hebbian.getAssociation( 'sarcasm', 'defense' ) < peak )

} )

test( 'RemConsolidation: triggers only after real elapsed idle time, cools high-arousal memories, leaves valence/concepts intact', async () => {

	const { RemConsolidation }    = await import( '../src/cognition/RemConsolidation.js' )
	const { EpisodicMemory }       = await import( '../src/social/EpisodicMemory.js' )
	const { HebbianPlasticity } = await import( '../src/core/HebbianPlasticity.js' )
	const { EmotionSpace }           = await import( '../src/core/EmotionSpace.js' )
	const { MoodTracker }           = await import( '../src/core/MoodTracker.js' )
	const { DecayEngine }             = await import( '../src/core/DecayEngine.js' )
	const { CortisolEngine }         = await import( '../src/neurochemistry/CortisolEngine.js' )
	const { Sensitization }           = await import( '../src/cognition/Sensitization.js' )
	const { ExpressionDebt }         = await import( '../src/behavior/ExpressionDebt.js' )

	const rem = new RemConsolidation( { idleThresholdMs: 1000 * 60 * 60 * 4 } )
	rem.recordTurn( Date.now() - 1000 * 60 * 30 ) // 30 minutes ago — below threshold
	assert.equal( rem.shouldTrigger(), false )

	rem.recordTurn( Date.now() - 1000 * 60 * 60 * 5 ) // 5 hours ago — above threshold
	assert.equal( rem.shouldTrigger(), true )

	const episodicMemory = new EpisodicMemory()
	const entry                = await episodicMemory.store( { text: 'te odio', userId: 'u1', emotionalSignature: { valence: -0.9, arousal: 0.8 }, importance: 0.9 } )
	const arousalBefore  = entry.emotionalSignature.arousal
	const valenceBefore    = entry.emotionalSignature.valence

	const report = rem.sweep( {
		episodicMemory, hebbianPlasticity: new HebbianPlasticity(), cortisolEngine: new CortisolEngine(),
		expressionDebt: new ExpressionDebt(), sensitization: new Sensitization(), emotionSpace: new EmotionSpace(),
		moodTracker: new MoodTracker(), decayEngine: new DecayEngine(), personality: { getEmotionalRecoveryRate: () => 0.1 },
	} )

	assert.ok( report.elapsedHours > 4 )
	assert.equal( report.memoriesCooled, 1 )
	assert.ok( entry.emotionalSignature.arousal < arousalBefore )
	assert.equal( entry.emotionalSignature.valence, valenceBefore ) // the "lesson" (valence) is untouched, only arousal cools
	assert.equal( entry.remSalient, true )

} )

test( 'EpisodicMemory: latent weight decays toward a nonzero floor over real months and reactivates on token overlap', async () => {

	const { EpisodicMemory } = await import( '../src/social/EpisodicMemory.js' )
	const memory                = new EpisodicMemory()
	const entry                    = await memory.store( { text: 'siento que hay traicion aqui', userId: 'u1', emotionalSignature: { valence: -0.8, arousal: 0.7 }, importance: 0.9 } )
	memory.tagRemSalient( entry.id )

	const fresh = memory.getLatentWeight( entry )
	entry.remTaggedAt -= 1000 * 60 * 60 * 24 * 90 // 90 real days ago
	const stale   = memory.getLatentWeight( entry )

	assert.ok( stale < fresh )
	assert.ok( stale > 0 ) // never hits an absolute zero floor

	const reactivated = memory.getReactivation( entry, [ 'otra', 'vez', 'traicion' ] )
	assert.ok( reactivated > stale ) // real token-overlap spark multiplies it back up

} )

test( 'regression: a REM sweep triggered by real idle time surfaces a systemPrompt transition note', async () => {

	const totemheart = new Totemheart()
	totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 100 } )

	await totemheart.processInput( 'hola', { userId: 'x' } )
	totemheart.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5

	const result = await totemheart.processInput( 'hola de nuevo', { userId: 'x' } )

	assert.ok( result.debug.remReport )
	assert.ok( result.debug.remReport.elapsedHours >= 4 )
	assert.ok( result.systemPrompt.includes( 'TRANSICIÓN TRAS INACTIVIDAD' ) )

} )

test( 'regression: SarcasmDetector no longer flags genuine enthusiasm against a merely-neutral (not negative) context', async () => {

	const { SarcasmDetector } = await import( '../src/cognition/SarcasmDetector.js' )
	const sd                     = new SarcasmDetector()

	// Real bug found via a two-personality integration mock: raw distance alone fired
	// on 0.89 (enthusiastic) vs. 0.04 (merely neutral, not negative) — nothing to be
	// incongruent WITH. Fixed by requiring an actual sign mismatch against a context
	// that's meaningfully non-neutral.
	const falsePositiveCase = sd.detect( 0.89, 0.04, 1.7 )
	assert.equal( falsePositiveCase.sarcastic, false )

	const genuineCase = sd.detect( 0.9, -0.9, 1.7 )
	assert.equal( genuineCase.sarcastic, true )

} )

test( 'regression: HeuristicProvider recognizes common Spanish insults/positives missing from an earlier lexicon pass', async () => {

	const { HeuristicProvider } = await import( '../src/providers/HeuristicProvider.js' )
	const h                          = new HeuristicProvider()

	// Real gaps found via the same integration mock: "tonta" read as neutral (0),
	// silently defusing a real insult; "maravilla" (noun) was missing even though
	// "maravilloso/maravillosa" (adjective) were already covered.
	assert.ok( ( await h.analyze( 'appraisal', { text: 'eres tonta' } ) ).desirability < 0 )
	assert.ok( ( await h.analyze( 'appraisal', { text: 'que maravilla' } ) ).desirability > 0 )

} )

test( 'regression: EpisodicMemory.getReactivation ignores stopword-only overlap between unrelated sentences', async () => {

	const { EpisodicMemory } = await import( '../src/social/EpisodicMemory.js' )
	const memory                = new EpisodicMemory()
	const entry                    = await memory.store( { text: 'no puedo creer que me mentiste sobre el proyecto, es una traicion', userId: 'u1', emotionalSignature: { valence: -0.8, arousal: 0.7 }, importance: 0.9 } )
	memory.tagRemSalient( entry.id )

	// Real bug found via a two-personality REM conversation mock: this unrelated
	// message shares only stopwords ("el", "que") with the stored memory, which
	// used to be enough to "reactivate" it — now it correctly doesn't.
	assert.equal( memory.getReactivation( entry, [ 'que', 'tal', 'el', 'tiempo', 'hoy' ] ), 0 )

	// A real topical word ("traicion") still reactivates it.
	assert.ok( memory.getReactivation( entry, [ 'otra', 'vez', 'esa', 'traicion' ] ) > 0 )

} )

// ============================================================================
// Upgrade round: momentum/hysteresis, allostatic load, wanting/liking,
// reconsolidation, attachment styles/rupture, graduated hijack, Vaillant
// defenses, expression policy, WornPathCache authority decay
// ============================================================================

test( 'EmotionSpace: recovering from an extreme state takes real, measurably more ticks than from a mild one (hysteresis)', () => {

	const personality = new Personality()
	const decay          = new DecayEngine()
	const mood             = { valence: 0, arousal: 0 }

	const extreme = new EmotionSpace()
	for ( let i = 0; i < 5; i++ ) extreme.applySpike( { valence: 0.35, weight: 1 } )
	let ticksExtreme = 0
	while ( Math.abs( extreme.vector.valence ) > 0.1 && ticksExtreme < 500 ) { decay.apply( extreme, mood, personality, 1 ); ticksExtreme++ }

	const mild = new EmotionSpace()
	mild.applySpike( { valence: 0.35, weight: 1 } )
	let ticksMild = 0
	while ( Math.abs( mild.vector.valence ) > 0.1 && ticksMild < 500 ) { decay.apply( mild, mood, personality, 1 ); ticksMild++ }

	assert.ok( ticksExtreme > ticksMild )

} )

test( 'Homeostasis: allostatic load rises under sustained deprivation and raises the real reactivity multiplier', () => {

	const h                     = new Homeostasis()
	const personality = new Personality( { neuroticism: 0.8 } )
	for ( let i = 0; i < 30; i++ ) h.tick( 1, personality, { circadianEnergy: 0.3, cortisol: 0.7 } )
	assert.ok( h.allostaticLoad > 0.1 )
	assert.ok( h.getReactivityMultiplier() > 1 )

} )

test( 'DopaminergicEngine: wanting and liking are real, distinct signals — liking tracks reward sign, wanting tracks |RPE|', () => {

	const dop = new DopaminergicEngine()
	for ( let i = 0; i < 5; i++ ) dop.computeRPE( -0.6, 'ctxA' )
	assert.ok( dop.getWanting() > 0 )
	assert.ok( dop.getLiking() < 0 )

} )

test( 'EpisodicMemory: a labile (retrieved) memory is genuinely modifiable, a closed window is a real no-op', async () => {

	const mem   = new EpisodicMemory()
	const entry = await mem.store( { text: 'x', userId: 'u', emotionalSignature: { valence: -0.8, arousal: 0.7 }, importance: 0.9 } )
	mem.markLabile( entry.id )
	assert.equal( mem.reconsolidate( entry, { valence: 0.2, arousal: 0.1 } ), true )
	assert.ok( entry.emotionalSignature.valence > -0.8 )
	assert.equal( mem.reconsolidate( entry, { valence: 1, arousal: 1 } ), false )

} )

test( 'Attachment: personality classifies into real distinct attachment styles (secure/anxious/avoidant)', () => {

	const att = new Attachment()
	assert.equal( att.getStyle( new Personality( { neuroticism: 0.2, agreeableness: 0.8, extraversion: 0.7 } ) ), 'secure' )
	assert.equal( att.getStyle( new Personality( { neuroticism: 0.9, agreeableness: 0.8, extraversion: 0.7 } ) ), 'anxious' )
	assert.equal( att.getStyle( new Personality( { neuroticism: 0.2, agreeableness: 0.1, extraversion: 0.1 } ) ), 'avoidant' )

} )

test( 'Attachment: a severe enough single turn ruptures the relationship; a clearly positive turn after it repairs and counts', () => {

	const att        = new Attachment()
	const anxious = new Personality( { neuroticism: 0.9, agreeableness: 0.8, extraversion: 0.7 } )
	att.update( 'u', { valenceDelta: -0.5 }, anxious )
	assert.equal( att.get( 'u' ).ruptured, true )
	att.update( 'u', { valenceDelta: 0.6 }, anxious )
	assert.equal( att.get( 'u' ).ruptured, false )
	assert.equal( att.get( 'u' ).repairsCount, 1 )

} )

test( 'AmygdalaHijack: reads a graded tier, and repeated same-concept exposure genuinely lowers the future threshold (kindling)', () => {

	const hijack = new AmygdalaHijack()
	for ( let i = 0; i < 3; i++ ) hijack.observeStimulus( 'threat' )
	assert.ok( hijack.getKindlingDiscount( [ 'threat' ] ) > 0 )
	assert.equal( hijack.getKindlingDiscount( [ 'criticism' ] ), 0 )

} )

test( 'DefenseMechanisms: low ego health / high cortisol statistically pulls the pick toward the immature Vaillant tier', () => {

	const personality = new Personality()
	const dm                 = new DefenseMechanisms()
	let immatureCount = 0
	for ( let i = 0; i < 100; i++ ) if ( dm.check( 0.8, personality, 0.6, { egoHealth: 0.1, cortisol: 0.9 } ).tier === 'immature' ) immatureCount++
	assert.ok( immatureCount > 30 )

} )

test( 'ExpressionDirectives: trust and unresolved-wound pressure genuinely shift the real softmax action-tendency policy', () => {

	const ed        = new ExpressionDirectives()
	const base      = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2 } )
	const trusted  = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2, trust: 0.95 } )
	const wounded = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2, woundPressure: 1 } )
	assert.ok( ( trusted.approach + trusted.engage ) > ( base.approach + base.engage ) )
	assert.ok( wounded.approach < base.approach )

} )

test( 'ExpressionDebt: a charged suppression cost drains gradually over subsequent ticks, not instantly or never', () => {

	const debt = new ExpressionDebt()
	debt.chargeSuppressionCost( 0.8 )
	const before = debt.suppressionCostReservoir
	for ( let i = 0; i < 5; i++ ) debt.decay( 1 )
	assert.ok( debt.suppressionCostReservoir < before && debt.suppressionCostReservoir >= 0 )

} )

test( 'WornPathCache: a worn-in but long-unobserved entry genuinely loses authority and stops being served', () => {

	const wpc = new WornPathCache( { promotionThreshold: 2, authorityHalfLifeMs: 1000 * 60 * 10 } )
	wpc.observe( 'fp', { x: 1 }, Date.now() - 1000 * 60 * 60 )
	wpc.observe( 'fp', { x: 1 }, Date.now() - 1000 * 60 * 60 )
	assert.equal( wpc.consult( 'fp', { authorityThreshold: 0.5, now: Date.now() } ), null )

} )

// ============================================================================
// LoveHateEngine: dual-valence relational field
// ============================================================================

test( 'LoveHateEngine: simultaneous L and H raise both Affinity and Aversion at once — real ambivalence, not a wash to neutral', () => {

	const lh = new LoveHateEngine()
	lh.observe( 'u', { L: 0.8, H: 0.7 }, { trust: 0.5 } )
	const bond = lh.getBond( 'u' )
	assert.ok( bond.A > 0.1 && bond.V > 0.1 )
	assert.equal( lh.getAmbivalence( 'u' ), Math.min( bond.A, bond.V ) )
	assert.ok( Math.abs( lh.getTension( 'u' ) - bond.A * bond.V ) < 1e-9 )

} )

test( 'LoveHateEngine: Aversion decays real slower than Affinity given equal starting magnitude (asymmetric memory of harm)', () => {

	const lh = new LoveHateEngine()
	lh.observe( 'u', { L: 0.9, H: 0.9 }, { trust: 0.5 } )
	const before = { ...lh.getBond( 'u' ) }
	for ( let i = 0; i < 40; i++ ) lh.tick( 1, { cortisol: 0 } )
	const after = lh.getBond( 'u' )
	assert.ok( ( after.V / before.V ) > ( after.A / before.A ) )

} )

test( 'LoveHateEngine: sustained one-sided hostility crosses the real rupture condition and is a one-shot event until repaired', () => {

	const lh = new LoveHateEngine( { thetaR: 0.3 } )
	for ( let i = 0; i < 4; i++ ) lh.observe( 'u', { L: 0, H: 0.9 }, { trust: 0.5, cortisol: 0.3 } )
	const rupture = lh.checkRupture( 'u', { cortisol: 0.3 } )
	assert.equal( rupture.ruptured, true )
	const again = lh.checkRupture( 'u', { cortisol: 0.3 } )
	assert.equal( again.ruptured, false )
	assert.equal( again.alreadyRuptured, true )

} )

test( 'LoveHateEngine: repair only closes a real prior rupture and requires the AI itself to not be flooded', () => {

	const lh = new LoveHateEngine( { thetaP: 0.3, thetaCalm: 0.4 } )
	lh.bonds.set( 'u', { A: 0.7, V: 0.2, lastUpdate: Date.now(), ruptured: true, ruptureCount: 1, lastRuptureTick: Date.now(), repairCount: 0 } )
	assert.equal( lh.attemptRepair( 'u', { cortisol: 0.6 } ).repaired, false ) // flooded
	const ok = lh.attemptRepair( 'u', { cortisol: 0.1 } )
	assert.equal( ok.repaired, true )
	assert.ok( lh.getBond( 'u' ).V > 0 && lh.getBond( 'u' ).V < 0.2 )

} )

test( 'regression: Totemheart.processInput exposes real LoveHateEngine debug fields with no NaN across a multi-turn conversation', async () => {

	const totemheart = new Totemheart( { personality: new Personality( { neuroticism: 0.6 } ) } )
	const turns             = [ 'hola', 'te quiero mucho', 'me mentiste, esto es una traicion', 'perdona, lo siento' ]
	for ( const turn of turns ) {

		const result = await totemheart.processInput( turn, { userId: 'lh' } )
		totemheart.tick( 2 )
		if ( result.debug?.loveHate ) assert.ok( !JSON.stringify( result.debug.loveHate ).includes( 'NaN' ) )

	}
	assert.ok( Object.values( totemheart.loveHateEngine.getBond( 'lh' ) ).every( v => typeof v !== 'number' || Number.isFinite( v ) ) )

} )
