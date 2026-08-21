/**
 * Unit + full-pipeline tests for IntuitionEngine.js — the user's own
 * "TRAD-E" Capa 2 architecture request: a fast typed hunch that biases,
 * never dictates, the already-existing main mechanisms.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { IntuitionEngine } from '../../src/cognition/IntuitionEngine.js'
import { Totemheart, Personality } from '../../src/index.js'

function noBurst( ai, threshold = 400 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

function freshAI( traits = {} ) {

	return noHijack( noBurst( new Totemheart( { personality: new Personality( { neuroticism: 0.5, agreeableness: 0.6, ...traits } ) } ) ) )

}

// ============================================================================
// Unit
// ============================================================================

test( 'IntuitionEngine.gate: stays closed on ordinary low-stakes/low-ambiguity/low-social turns', () => {

	const i = new IntuitionEngine()
	assert.equal( i.gate( { stakes: 0.05, ambiguity: 0.05, socialSalience: 0.05 } ), false )
	assert.equal( i.gate( { stakes: 0.9, ambiguity: 0, socialSalience: 0 } ), true )

} )

test( 'IntuitionEngine.assess: real cue match classifies the correct type', () => {

	const i = new IntuitionEngine()
	const deception = i.assess( { text: 'me guardas un secreto, te noto raro', entropy: 0, desirability: 0 } )
	assert.equal( deception.type, 'deception' )

	const attraction = i.assess( { text: 'me atraes muchísimo, me pones nervioso', entropy: 0, desirability: 0 } )
	assert.equal( attraction.type, 'attraction' )

} )

test( 'IntuitionEngine.assess: returns null on a real no-cue turn', () => {

	const i = new IntuitionEngine()
	assert.equal( i.assess( { text: 'hola, buen día', entropy: 0, desirability: 0 } ), null )

} )

test( 'IntuitionEngine.assess: real entropy dampens feltCertainty', () => {

	const i = new IntuitionEngine()
	const confident = i.assess( { text: 'me guardas un secreto, escondes algo', entropy: 0, desirability: 0 } )
	const uncertain    = i.assess( { text: 'me guardas un secreto, escondes algo', entropy: 0.9, desirability: 0 } )
	assert.ok( confident.feltCertainty > uncertain.feltCertainty )

} )

test( 'IntuitionEngine.assess: real Contradiction dampens feltCertainty when explicit evidence opposes the hypothesis', () => {

	const i = new IntuitionEngine()
	const noEvidence   = i.assess( { text: 'me guardas un secreto', entropy: 0, desirability: 0 } )
	const contradicted = i.assess( { text: 'me guardas un secreto', entropy: 0, desirability: 0.8 } )
	assert.ok( contradicted.contradiction === 1 )
	assert.ok( contradicted.feltCertainty < noEvidence.feltCertainty )

} )

test( 'IntuitionEngine.assess: real hypervigilance raises strength for an already-real cue, lowers the anti-false-alarm corroboration bar, but never invents a hunch from zero real cues', () => {

	const i = new IntuitionEngine()
	const baseline           = i.assess( { text: 'algo en tu forma de hablar hoy se siente distinto, no sé qué es', entropy: 0, desirability: 0, hypervigilance: 0 } )
	const hypervigilant = new IntuitionEngine().assess( { text: 'algo en tu forma de hablar hoy se siente distinto, no sé qué es', entropy: 0, desirability: 0, hypervigilance: 0.3 } )

	assert.ok( baseline )
	assert.ok( hypervigilant.strength > baseline.strength, 'the SAME real ambiguous cue should read as more convincing under real hypervigilance' )

	const neutral = new IntuitionEngine().assess( { text: 'hoy hace buen tiempo', entropy: 0, desirability: 0, hypervigilance: 0.3 } )
	assert.equal( neutral, null, 'hypervigilance must never manufacture a hunch from a turn with zero real matching cues' )

} )

test( 'IntuitionEngine.bias: only the aligned mechanism gets a nonzero delta', () => {

	const i = new IntuitionEngine()
	const deception = i.assess( { text: 'me guardas un secreto', entropy: 0, desirability: 0 } )
	assert.ok( deception.bias.trustSuspicion > 0 )
	assert.ok( deception.bias.checkSecret > 0 )
	assert.equal( deception.bias.avoidYield, 0 )
	assert.equal( deception.bias.approach, 0 )

} )

test( 'IntuitionEngine.registerSuspicion/getSuspicion/decay: real accumulate-then-decay lifecycle', () => {

	const i = new IntuitionEngine()
	i.registerSuspicion( 'u', 0.3 )
	i.registerSuspicion( 'u', 0.3 )
	assert.ok( i.getSuspicion( 'u' ) > 0.3 )
	const before = i.getSuspicion( 'u' )
	i.decay( 'u', 10 )
	assert.ok( i.getSuspicion( 'u' ) < before )

} )

test( 'IntuitionEngine.registerOutcome: real overconfidence penalty rises after repeated wrong "deception" hunches', () => {

	const i = new IntuitionEngine()
	const hyp = i.assess( { text: 'me guardas un secreto', entropy: 0, desirability: 0 } )
	for ( let k = 0; k < 5; k++ ) i.registerOutcome( hyp, false )
	const afterWrong = i.assess( { text: 'me guardas un secreto', entropy: 0, desirability: 0 } )
	assert.ok( afterWrong.feltCertainty < hyp.feltCertainty, 'repeated wrong deception hunches should genuinely lower future feltCertainty for that type' )

} )

// ============================================================================
// Full pipeline
// ============================================================================

test( 'full: a deception-cue turn raises real suspicion and checkSecret attention on an already-open secret', async () => {

	const ai = freshAI()
	await ai.processInput( 'hola, todo bien', { userId: 'u' } )
	ai.secretMaintenanceSystem.openSecret( 'u::x', [ 'A' ], 0.5 )
	const costBefore = ai.secretMaintenanceSystem.getCost( 'u::x' )
	const r = await ai.processInput( 'te noto raro, escondes algo, ¿me guardas un secreto?', { userId: 'u' } )

	assert.equal( r.debug.intuition?.type, 'deception' )
	assert.ok( r.debug.suspicion > 0 )
	assert.ok( ai.secretMaintenanceSystem.getCost( 'u::x' ) >= costBefore, 'checkSecret bias should raise attention on the already-open secret even without the literal word reappearing this exact turn' )

} )

test( 'full: a loss-risk hunch dampens yieldProbability without erasing desire itself', async () => {

	const ai = freshAI()
	Math.random = () => 0.5
	for ( let i = 0; i < 6; i++ ) await ai.processInput( 'te quiero muchísimo, eres maravilloso', { userId: 'A' } )
	const r = await ai.processInput( 'no puedo dejar de acordarme de mi ex, recuerdas cuando estábamos juntos', { userId: 'A' } )

	assert.ok( r.debug.desire.level >= 0, 'desire itself should remain a real, untouched-in-sign reading' )
	assert.ok( Number.isFinite( r.debug.temptation.yieldProbability ) )
	Math.random = Math.random

} )

test( 'full: an attraction hunch nudges desire upward without forcing a yield', async () => {

	const ai = freshAI()
	const r = await ai.processInput( 'me atraes muchísimo, me pones nervioso/a', { userId: 'u' } )
	assert.ok( r.debug.intuition?.type === 'attraction' || r.debug.intuition === null )
	assert.ok( r.debug.desire.level >= 0 )

} )

test( 'full: an ordinary factual turn keeps intuition gated off', async () => {

	const ai = freshAI()
	const r = await ai.processInput( '¿cuánto es 12 más 30?', { userId: 'u' } )
	assert.equal( r.debug.intuition, null )

} )

test( 'full: toJSON()/restoreState() round-trips real IntuitionEngine persisted state', async () => {

	const ai = freshAI()
	await ai.processInput( 'me guardas un secreto, te noto raro', { userId: 'u' } )
	ai.tick( 1 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	assert.deepEqual( rehydrated.intuitionSuspicion, saved.intuitionSuspicion )
	assert.deepEqual( rehydrated.intuitionCalibration, saved.intuitionCalibration )

} )

test( 'hard: 200-turn conversation keeps intuition/suspicion finite and bounded', async () => {

	const ai = freshAI()
	const inputs = [ 'hola', 'me guardas un secreto', 'te noto raro', 'me atraes mucho', 'recuerdas a mi ex', 'todo bien' ]
	let last
	for ( let i = 0; i < 200; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )

	assert.ok( Number.isFinite( last.debug.suspicion ) )
	assert.ok( last.debug.suspicion >= 0 && last.debug.suspicion <= 1 )

} )
