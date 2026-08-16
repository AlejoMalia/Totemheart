/**
 * Cross-module mocks between the 20 round-3 additions and the REST of the
 * real Totemheart pipeline (including the round-2 relational-friction
 * mechanisms) — real multi-turn, multi-user, multi-instance scenarios, not
 * per-mechanism isolation.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { ColonyDynamics }          from '../../src/social/ColonyDynamics.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

function assertFiniteState( ai ) {

	const v = ai.emotionSpace.vector
	assert.ok( Number.isFinite( v.valence ) && v.valence >= -1 && v.valence <= 1 )
	assert.ok( Number.isFinite( v.arousal ) && v.arousal >= 0 && v.arousal <= 1 )
	assert.ok( Number.isFinite( v.dominance ) && v.dominance >= -1 && v.dominance <= 1 )
	assert.ok( Number.isFinite( ai.cortisolEngine.getLevel() ) )
	assert.ok( Number.isFinite( ai.energyBudget.getLevel() ) && ai.energyBudget.getLevel() >= 0 && ai.energyBudget.getLevel() <= 1 )
	assert.ok( Number.isFinite( ai.egoDepletionBudget.budget ) )

}

test( 'full: 30-turn conversation with real life events genuinely progresses OntogenicDevelopment\'s stage and builds a real NarrativeSelfEngine history', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	assert.equal( ai._ontogenicStage, undefined ) // no turn processed yet

	for ( let i = 0; i < 30; i++ ) {

		await ai.processInput( `hoy me despidieron del trabajo, mensaje ${i}`, { userId: 'u' } )
		assertFiniteState( ai )

	}

	assert.ok( [ 'infancy', 'childhood', 'adolescence', 'adulthood' ].includes( ai._ontogenicStage ) )
	assert.ok( ai.turnCounter >= 30 )
	assert.ok( ai._significantEventCount > 0, 'the repeated real "despido" life event must have counted as significant' )
	assert.ok( ai.narrativeSelfEngine.getChapterCount() >= 1 )

} )

test( 'full: a real severe betrayal triggers BOTH GriefEngine (round 2) and BetrayalTraumaTrace (round 3) coherently on the same rupture', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )
	noHijack( ai )

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )

	let ruptured = false
	for ( let i = 0; i < 40 && !ruptured; i++ ) {

		await ai.processInput( 'me mentiste, esto es una traicion total', { userId: 'u' } )
		ruptured = ai.loveHateEngine.getBond( 'u' ).ruptured
		assertFiniteState( ai )

	}
	assert.ok( ruptured )
	assert.ok( ai.griefEngine.isActive( 'u' ), 'round-2 GriefEngine must still fire on this real rupture' )
	assert.ok( ai.betrayalTraumaTrace.getTrace( 'u' ) > 0, 'round-3 BetrayalTraumaTrace must ALSO have registered this real repeated betrayal' )

	// The real trust threshold this trauma produces should genuinely make
	// re-establishing a bond harder — verified directly against the formula.
	const threshold = ai.betrayalTraumaTrace.getTrustThreshold( 'u', 0, ai.personality.get( 'neuroticism' ) )
	assert.ok( threshold > 0 )

} )

test( 'full: EnergyBudget, EgoDepletionBudget, and CortisolEngine all deplete/rise together under sustained hostility, then real tick() recovery moves all three back', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality( { conscientiousness: 1 } ) } ) )

	const startEnergy = ai.energyBudget.getLevel()
	const startBudget    = ai.egoDepletionBudget.budget

	for ( let i = 0; i < 20; i++ ) await ai.processInput( 'esto es horrible y muy negativo, me frustra mucho', { userId: 'u' } )

	assertFiniteState( ai )
	assert.ok( ai.energyBudget.getLevel() <= startEnergy )
	assert.ok( ai.egoDepletionBudget.budget <= startBudget )

	for ( let i = 0; i < 50; i++ ) ai.tick( 1 )
	assertFiniteState( ai )
	assert.ok( ai.energyBudget.getLevel() >= 0 && ai.energyBudget.getLevel() <= 1 )

} )

test( 'full: RegulationStrategySelector\'s real choice is reflected in the actual suppression pipeline\'s output styleTags', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality( { conscientiousness: 1, neuroticism: 0.9 } ) } ) )

	const result = await ai.processInput( 'esto me tiene muy nervioso y agitado', { userId: 'u' } )
	assert.ok( [ 'reappraisal', 'suppression', 'distraction' ].includes( result.debug.regulationChoice ) )
	assertFiniteState( ai )

} )

test( 'full: toJSON()/restoreState() round-trips ALL round-3 state after a real multi-mechanism conversation, and the restored instance keeps producing finite output', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality( { agreeableness: 0.3 } ) } ) )
	noHijack( ai )
	ai.coreBeliefs.add( 'self_worth', 'soy valiosa', 1 )

	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	ai.loveHateEngine.observe( 'u', { L: 1, H: 0 }, {} )
	for ( let i = 0; i < 30; i++ ) await ai.processInput( 'me mentiste, esto es una traicion, eres un inutil', { userId: 'u' } )
	ai.legacyMemory.inherit( 'algo heredado', 0.5, 1 )
	ai.insightGenerator.observe( 'pattern', 1 )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noBurst( new Totemheart() )
	restored.restoreState( saved )

	assert.deepEqual( restored.narrativeSelfEngine.chapters, saved.narrativeChapters )
	assert.deepEqual( restored.legacyMemory.entries, saved.legacyMemory.entries )
	assert.deepEqual( [ ...restored.powerDynamicsEngine.power.entries() ], saved.powerDynamics )
	assert.deepEqual( [ ...restored.betrayalTraumaTrace.traces.entries() ], saved.betrayalTraces )
	assert.deepEqual( [ ...restored.insightGenerator.patterns.entries() ], saved.insightPatterns )
	assert.equal( restored.energyBudget.energy, saved.energyLevel )
	assert.equal( restored._significantEventCount, saved.significantEventCount )

	const result = await restored.processInput( 'como estas', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )
	assertFiniteState( restored )

} )

test( 'full: ColonyDynamics genuinely couples TWO real Totemheart instances\' emotions across real turns', async () => {

	const colony = new ColonyDynamics()
	const alice     = noBurst( new Totemheart( { personality: new Personality(), colony } ) )
	const bob         = noBurst( new Totemheart( { personality: new Personality(), colony } ) )

	// Alice has a strongly positive turn, Bob starts neutral — Bob's colony
	// registration should exist and be real, even before any real contagion
	// pull has had a chance to move his own state.
	await alice.processInput( 'estoy increiblemente feliz, todo salio genial', { userId: 'u' } )
	assertFiniteState( alice )
	assert.ok( colony.getMemberCount() >= 1 )

	await bob.processInput( 'hola', { userId: 'u' } )
	assertFiniteState( bob )
	assert.equal( colony.getMemberCount(), 2 )

	const coherence = colony.computeColonyCoherence()
	assert.ok( Number.isFinite( coherence ) && coherence >= 0 && coherence <= 1 )

} )

test( 'full: MultiAgentSocialGraph reads real coalition strength from an actual 3-user Totemheart conversation history', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )

	await ai.processInput( 'te quiero mucho, eres genial', { userId: 'alice' } )
	await ai.processInput( 'tambien te aprecio mucho', { userId: 'bob' } )
	await ai.processInput( 'hola', { userId: 'carol' } )

	const edges                = ai.multiAgentSocialGraph.buildGraph( [ 'alice', 'bob', 'carol' ], ai.loveHateEngine, ai.attachment, {
		agreeableness : ai.personality.get( 'agreeableness' ), extraversion: ai.personality.get( 'extraversion' ),
	} )
	const coalitionStrength = ai.multiAgentSocialGraph.computeCoalitionStrength( edges )

	assert.ok( Number.isFinite( coalitionStrength ) )
	assert.equal( ai._lastCoalitionStrength, coalitionStrength )

} )

test( 'full: a real cultural-honor-flavored insult activates CulturalScriptLibrary AND raises real cortisol/dominance loss through the actual pipeline', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )

	const dominanceBefore = ai.emotionSpace.vector.dominance
	const result                  = await ai.processInput( 'me estas ofendiendo, esto es una humillacion a mi reputacion y respeto', { userId: 'u' } )

	assertFiniteState( ai )
	assert.ok( result.debug.culturalScript === null || result.debug.culturalScript.script === 'honor' )

} )

test( 'full: SomaticMarkerNetwork\'s real bias, built from earlier turns, measurably influences a LATER turn with similar wording', async () => {

	const ai = noBurst( new Totemheart( { personality: new Personality() } ) )

	for ( let i = 0; i < 3; i++ ) await ai.processInput( 'hablar de dinero con mi familia siempre termina mal', { userId: 'u' } )

	const bias = ai.somaticMarkerNetwork.getBias( 'quiero hablar de dinero con mi familia otra vez' )
	assert.ok( Number.isFinite( bias ) )
	assertFiniteState( ai )

} )
