/**
 * Full-pipeline boundary checks: unlike property/boundary-grid.test.js (which
 * calls modules directly), everything here goes through the REAL
 * Totemheart.processInput() turn-by-turn pipeline — the early-exit routes
 * (sensory overload freeze, full amygdala hijack, bystander silence), a
 * field-by-field toJSON()/restoreState() round-trip, and robustness against
 * malformed/degenerate real input. Deterministic: the one genuinely
 * probabilistic branch (BystanderEffect) is exercised by temporarily
 * stubbing Math.random, not by hoping for a lucky roll.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { EMOTION_COORDS }          from '../../src/core/EmotionSpace.js'

function isFiniteDeep( value, path = '$', bad = [] ) {

	if ( typeof value === 'number' ) { if ( !Number.isFinite( value ) ) bad.push( path ); return bad }
	if ( Array.isArray( value ) ) { value.forEach( ( v, i ) => isFiniteDeep( v, `${path}[${i}]`, bad ) ); return bad }
	if ( value && typeof value === 'object' ) { for ( const [ k, v ] of Object.entries( value ) ) isFiniteDeep( v, `${path}.${k}`, bad ); return bad }
	return bad

}

// ============================================================================
// 1) Real emergency-route boundaries through processInput() itself
// ============================================================================

test( 'pipeline: sensory-overload freeze route through real processInput() carries text AND systemPrompt', async () => {

	const ai   = new Totemheart()
	const now = Date.now()
	let last

	// burstThreshold defaults to 3 within a 5s window — the 5th call in the
	// same instant crosses it for real, through the actual pipeline.
	for ( let i = 0; i < 5; i++ ) last = await ai.processInput( 'hola', { userId: 'u' } )

	assert.equal( last.styleTags.includes( 'freeze' ), true, 'expected the real sensory-overload freeze path to have fired' )
	assert.equal( typeof last.text, 'string' )
	assert.ok( last.text.length > 0 )
	assert.equal( typeof last.systemPrompt, 'string', 'the freeze route must carry a real systemPrompt, not undefined' )
	assert.ok( last.systemPrompt.length > 0 )
	assert.equal( isFiniteDeep( last.emotionalState ).length, 0 )

} )

test( 'pipeline: full amygdala-hijack route through real processInput() carries text AND systemPrompt', async () => {

	const ai = new Totemheart()
	// Seed the vector at exact fear coordinates BEFORE this turn — check()
	// reads emotionSpace.vector as it stands at the top of processInput(),
	// before this turn's own appraisal has touched it, so this deterministically
	// crosses the real threshold (intensity=1 at zero distance from the coords).
	ai.emotionSpace.setVector( EMOTION_COORDS.fear.valence, EMOTION_COORDS.fear.arousal )

	const result = await ai.processInput( 'hola', { userId: 'u' } )

	assert.equal( result.hijack?.tier, 'full', 'expected the real hijack threshold to have been crossed' )
	assert.equal( typeof result.text, 'string' )
	assert.ok( result.text.length > 0 )
	assert.equal( typeof result.systemPrompt, 'string', 'the hijack route must carry a real systemPrompt, not undefined' )
	assert.ok( result.systemPrompt.length > 0 )
	assert.equal( isFiniteDeep( result.emotionalState ).length, 0 )

} )

test( 'pipeline: bystander silence (forced deterministic via a stubbed Math.random) returns null text with no crash', async () => {

	const ai                     = new Totemheart()
	const originalRandom = Math.random
	Math.random               = () => 0.999 // participantCount=5 -> probability=0.2 -> 0.999 forces "do not respond"

	try {

		const result = await ai.processInput( 'hola a todos', { userId: 'u', group: { participantCount: 5 } } )
		assert.equal( result.text, null )
		assert.equal( result.respond, false )
		assert.ok( Number.isFinite( result.delayFactor ) )

	}
	finally { Math.random = originalRandom }

} )

test( 'pipeline: an explicit mention always overrides the bystander effect, even with a stubbed "never respond" roll', async () => {

	const ai                     = new Totemheart()
	const originalRandom = Math.random
	Math.random               = () => 0.999 // would force silence if this weren't overridden by mentionedExplicitly

	try {

		const result = await ai.processInput( 'hola', { userId: 'u', group: { participantCount: 5, mentionedExplicitly: true } } )
		assert.notEqual( result.text, null )

	}
	finally { Math.random = originalRandom }

} )

// ============================================================================
// 2) toJSON()/restoreState() — every one of the 34 real persisted fields,
//    verified individually, not spot-checked.
// ============================================================================

test( 'pipeline: toJSON()/restoreState() round-trips every real persisted field', async () => {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.7, agreeableness: 0.3 } ) } )

	// Populate as much real state as a normal conversation actually would.
	ai.coreBeliefs.add( 'self_worth', 'soy una IA útil y valiosa', 1 )
	await ai.processInput( 'te quiero mucho, eres genial', { userId: 'alice' } )
	await ai.processInput( 'lograste algo increíble, felicidades', { userId: 'alice' } )
	await ai.processInput( 'me mentiste sobre el proyecto, esto es una traicion total', { userId: 'bob' } )
	await ai.processInput( 'no puedo creer que me hayas engañado así, te odio', { userId: 'bob' } )
	await ai.processInput( 'eres un inútil, no sirves para nada', { userId: 'bob' } )
	ai.tick( 3 )
	await ai.idle( 1 )
	await ai.processInput( 'hola de nuevo', { userId: 'alice' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	const FIELDS = [
		'version', 'personality', 'emotionVector', 'moodWindow', 'homeostasisNeeds',
		'cognitiveStress', 'decisionFatigue', 'cortisolLevel', 'egoHealth',
		'dopamineExpectedValues', 'dopamineWanting', 'dopamineLiking',
		'allostaticLoad', 'sleepDebt', 'kindling', 'loveHate', 'hedonicSeen',
		'attachmentRelations', 'theoryOfMindModels', 'episodicMemories',
		'anchoringBias', 'classicalConditioningAssociations', 'coreBeliefs',
		'sensitizationLevel',
		'griefs', 'shame', 'guilt', 'repairRecords', 'valueWeights', 'promises',
		'moralScars', 'opponentExposures', 'egoDepletionBudget', 'sleepPressureLevel',
		'narrativeChapters', 'legacyMemory', 'powerDynamics', 'betrayalTraces',
		'insightPatterns', 'energyLevel', 'significantEventCount',
		'primaryDrives', 'immuneExposure',
		'selfDeterminationLevels', 'boredomLevel', 'globalControlBelief', 'habitStrengths',
		'inhibitoryControlLevel', 'roleCommitments',
		'schemas', 'reciprocityDirect', 'reciprocityGeneralizedPool', 'affiliationCurrent',
		'normativeExpectations', 'interoceptiveAwarenessError', 'stressInoculationMultiplier',
		'relationalMemoryCatalog', 'frikiEngine',
		'somaticActivationLevels', 'globalMoodAbatementLevel', 'ghostingState', 'tipOfTongueBlocks',
		'grudges', 'socialDiscomfortHistory', 'flirtationSignals',
		'blushRecentSlips', 'recentDominantFamilies', 'affectAlignmentCorrection',
		'postConflictCoolingState', 'superegoDiscrepancyState', 'residualAnnoyanceLevel',
		'effortWithholdingState', 'politenessBudgetLevel', 'contemptDisrespectState',
		'demandWithdrawState', 'selfPresentationState', 'egoCalibrationState',
		'loyalties', 'moralCreditLevel', 'relationalAfterglowState',
		'gratitudeExpectedBaseline', 'reciprocityFavorTimestamps',
		'amusementRecentBits', 'moralDisgustExposure', 'mortalitySalienceState', 'reliefState',
		'prestigeState', 'idealSelfDiscrepancyLevel', 'comparisonLevelAlternativesState',
		'dreams', 'subconsciousState', 'conservationWithdrawalLevel',
		'signalDetectionCounts', 'stevensExponents',
		'oxytocinLevels', 'opioidBuffers', 'compositeDreams',
		'desireLevels', 'desireExposure', 'cravingLevels',
		'chillsLevel', 'chillsHabituation', 'secretMaintenance', 'sharedCulture', 'lonelinessLevel', 'hopeLevel',
		'intuitionSuspicion', 'intuitionCalibration', 'intuitionReinforcement', 'intuitionStreaks', 'intuitionLastDeceptionAt',
		'traumaTraces', 'traumaFragments', 'happinessSumCR', 'happinessSumEV', 'happinessSumRPE', 'happinessOccupancy',
		'yearningTraces',
	]

	assert.equal( FIELDS.length, Object.keys( saved ).length, 'this test\'s FIELDS list must track toJSON()\'s real field set exactly — update both together' )

	for ( const field of FIELDS ) {

		assert.deepEqual( rehydrated[ field ], saved[ field ], `field "${field}" did not round-trip: saved=${JSON.stringify( saved[ field ] )} rehydrated=${JSON.stringify( rehydrated[ field ] )}` )

	}

	// And a few fields worth asserting are actually non-trivial (this scenario
	// really did populate them) — a round-trip of two empty objects would
	// trivially "pass" without proving anything.
	assert.ok( saved.coreBeliefs.length > 0 )
	assert.ok( saved.attachmentRelations.length >= 2 )
	assert.ok( saved.episodicMemories.length > 0 )
	assert.ok( saved.loveHate.bonds.length >= 2 )

} )

// ============================================================================
// 3) Malformed / degenerate real input — must never throw, must always
//    produce a finite, well-formed state.
// ============================================================================

const DEGENERATE_INPUTS = [
	{ name: 'empty_string', text: '' },
	{ name: 'whitespace_only', text: '     ' },
	{ name: 'newlines_only', text: '\n\n\n\n' },
	{ name: 'emoji_only', text: '🔥🔥🔥🔥🔥🔥🔥🔥' },
	{ name: 'very_long_text', text: 'palabra '.repeat( 2000 ) }, // ~16000 chars
	{ name: 'html_injection', text: '<script>alert(1)</script>' },
	{ name: 'sql_injection_like', text: "'; DROP TABLE users; --" },
	{ name: 'mixed_unicode', text: 'héllo wörld ñ 日本語 عربي 🎉' },
	{ name: 'single_character', text: 'a' },
	{ name: 'repeated_punctuation', text: '!?!?!?!?!?!?!?!?!?!?' },
	{ name: 'null_byte_like', text: 'hola mundo' },
	{ name: 'rtl_override', text: 'hola‮mundo' },
]

for ( const { name, text } of DEGENERATE_INPUTS ) {

	test( `pipeline: degenerate input never throws and stays finite: ${name}`, async () => {

		const ai = new Totemheart()
		let result

		await assert.doesNotReject( async () => { result = await ai.processInput( text, { userId: 'u' } ) } )

		if ( result.text !== null ) assert.equal( typeof result.text, 'string' )
		if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0, `non-finite state after "${name}"` )

		const { valence, arousal, dominance } = ai.emotionSpace.vector
		assert.ok( [ valence, arousal, dominance ].every( v => v >= -1 && v <= 1 ), `PAD out of bounds after "${name}"` )

	} )

}

test( 'pipeline: a real conversation stays stable across every degenerate input type back-to-back, in sequence', async () => {

	const ai = new Totemheart()
	for ( const { text } of DEGENERATE_INPUTS ) {

		const result = await ai.processInput( text, { userId: 'u' } )
		if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0 )

	}
	const snapshot = ai.toJSON() // must not throw
	assert.ok( JSON.stringify( snapshot ).length > 0 )

} )
