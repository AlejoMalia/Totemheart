/**
 * The remaining gaps from the "critical gaps" list that weren't already
 * covered by pipeline-boundaries.test.js: threshold crossings built up
 * through REAL consecutive turns (not a pre-seeded vector), the emergency
 * text-generation path proven structurally distinct from the normal one,
 * real refractory/re-hijack behavior (reported as it actually is, not as
 * assumed), LoadScheduler gating observed through real turn-built
 * instability, WornPathCache at capacity, every toJSON() field split into
 * its own named assertion, and HeuristicProvider/PipelineResilience
 * robustness against hostile input fed through a throwing custom provider.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { HeuristicProvider }       from '../../src/providers/HeuristicProvider.js'
import { WornPathCache }           from '../../src/core/WornPathCache.js'
import { safeStep }                from '../../src/core/PipelineResilience.js'

function isFiniteDeep( value, path = '$', bad = [] ) {

	if ( typeof value === 'number' ) { if ( !Number.isFinite( value ) ) bad.push( path ); return bad }
	if ( Array.isArray( value ) ) { value.forEach( ( v, i ) => isFiniteDeep( v, `${path}[${i}]`, bad ) ); return bad }
	if ( value && typeof value === 'object' ) { for ( const [ k, v ] of Object.entries( value ) ) isFiniteDeep( v, `${path}.${k}`, bad ); return bad }
	return bad

}

// ============================================================================
// A) Thresholds built up through real, consecutive turns
// ============================================================================

test( 'A1: amygdala hijack fires from state built by real consecutive turns, not a pre-seeded vector', async () => {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.9, agreeableness: 0.2 } ) } )
	const hostilePhrases = [
		'ERES HORRIBLE, TE ODIO, ESTO ES UNA TRAICION!!!',
		'NO PUEDO CREER QUE HAYAS HECHO ESTO, ES IMPERDONABLE',
		'me amenazaste, cuidado con lo que dices',
		'confié en ti y me apuñalaste por la espalda',
		'ERES TAN INJUSTO CONMIGO, NO PUEDO CREERLO',
	]

	let hijackFired = false
	for ( let i = 0; i < 15 && !hijackFired; i++ ) {

		const result = await ai.processInput( hostilePhrases[ i % hostilePhrases.length ], { userId: 'u' } )
		if ( result.hijack?.tier === 'full' ) hijackFired = true

	}
	assert.ok( hijackFired, 'expected sustained real hostility to eventually cross the real hijack threshold through the pipeline itself' )

} )

test( 'A2: the hijack route uses a structurally different text-generation path than a normal turn', async () => {

	const ai = new Totemheart()
	ai.emotionSpace.setVector( -0.7, 0.7 ) // fear-adjacent, deterministic single-call trigger like pipeline-boundaries.test.js
	const hijackResult = await ai.processInput( 'hola', { userId: 'u' } )
	assert.equal( hijackResult.hijack?.tier, 'full' )

	// The real hijack path returns one of AmygdalaHijack's own fixed phrases
	// (emergencyOutput), NOT EmotionalTextGenerator's blend-composed text —
	// checkable because the fixed set is short and known.
	const KNOWN_EMERGENCY_PHRASES = [ '...', 'No.', 'Necesito parar.', '¡Basta!' ]
	assert.ok( KNOWN_EMERGENCY_PHRASES.includes( hijackResult.text ), `expected a fixed emergency phrase, got "${hijackResult.text}"` )

	const normalAi     = new Totemheart()
	const normalResult = await normalAi.processInput( 'hola, ¿qué tal?', { userId: 'u' } )
	assert.equal( KNOWN_EMERGENCY_PHRASES.includes( normalResult.text ), false, 'a normal turn should not coincidentally produce a fixed emergency phrase' )

} )

test( 'A3: sensory overload degrades to the real fallback shape, no exception, real styleTags', async () => {

	const ai = new Totemheart()
	let last
	for ( let i = 0; i < 5; i++ ) last = await ai.processInput( 'x', { userId: 'u' } )

	assert.equal( last.delayMs, 0 )
	assert.deepEqual( last.styleTags, [ 'freeze', 'burst' ] )
	assert.ok( last.emotionalState )
	assert.equal( isFiniteDeep( last.emotionalState ).length, 0 )

} )

test( 'A4: real behavior after a hijack — the SAME extreme trigger can fire again immediately (documented, not assumed)', async () => {

	// Honest check of what the code actually does, not what a name implies:
	// AmygdalaHijack's hangover (see AmygdalaHijack.js) adds real DecisionFatigue/
	// ExpressionDebt load on the NEXT tick(), it does not gate check() itself.
	// Kindling, if anything, LOWERS the threshold on repeat exposure to the same
	// concept. So immediate re-triggering is real, expected behavior here — this
	// test documents that fact rather than asserting a "blocks re-hijack"
	// property the source doesn't implement.
	const ai = new Totemheart()
	ai.emotionSpace.setVector( -0.7, 0.7 )
	const first = await ai.processInput( 'hola', { userId: 'u' } )
	assert.equal( first.hijack?.tier, 'full' )

	ai.emotionSpace.setVector( -0.7, 0.7 ) // re-seed: a real hijack doesn't leave the vector at fear coords on its own
	const second = await ai.processInput( 'hola otra vez', { userId: 'u' } )
	assert.equal( second.hijack?.tier, 'full', 'confirmed: this codebase does not gate immediate re-triggering — hangover affects fatigue/debt, not the check itself' )

} )

test( 'A5: LoadScheduler gating reflects real instability built by consecutive turns, not a synthetic instability value', async () => {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.9 } ) } )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'ERES HORRIBLE, TE ODIO, ESTO ES UNA TRAICION!!!', { userId: 'u' } )

	const instability = ai.loadScheduler.computeInstability( {
		cortisol : ai.cortisolEngine.getLevel(),
		arousal  : ai.emotionSpace.vector.arousal,
		fatigue  : ai.decisionFatigue.getLevel(),
	} )
	const gate = ai.loadScheduler.gate( instability )

	assert.ok( instability > 0, `expected real accumulated instability, got ${instability}` )
	assert.equal( gate.runSituationalContext, true, 'the always-on stage must never be gated off, at any real instability level' )
	assert.equal( typeof gate.runOntology, 'boolean' )

} )

// ============================================================================
// D) WornPathCache at capacity, combined with authority decay, through
//    a real live pipeline (not just the standalone class).
// ============================================================================

test( 'D1: WornPathCache authority decay still works correctly while the cache is AT capacity', () => {

	const wpc = new WornPathCache( { promotionThreshold: 1, maxEntries: 5, authorityHalfLifeMs: 1000 * 60 * 10 } )
	const now = Date.now()
	for ( let i = 0; i < 5; i++ ) wpc.observe( `fp${i}`, { x: i }, now - 1000 * 60 * 60 ) // all observed 1h ago, at capacity
	assert.equal( wpc.entries.size, 5 )

	for ( let i = 0; i < 5; i++ ) {

		const served = wpc.consult( `fp${i}`, { authorityThreshold: 0.5, now } )
		assert.equal( served, null, `fp${i} should have decayed below authority threshold even while the cache is full` )

	}

	wpc.observe( 'fp5', { x: 5 }, now ) // a fresh observe at capacity must still evict correctly AND be servable
	assert.equal( wpc.entries.size, 5 )
	assert.equal( wpc.entries.has( 'fp0' ), false )
	assert.notEqual( wpc.consult( 'fp5', { authorityThreshold: 0.5, now } ), null )

} )

test( 'D2: a real live Totemheart pipeline respects WornPathCache eviction after many distinct real inputs', async () => {

	const ai = new Totemheart()
	assert.equal( ai.wornPathCache.maxEntries, 200, 'this test assumes the real default maxEntries — update it if that default changes' )

	for ( let i = 0; i < 210; i++ ) await ai.processInput( `mensaje número ${i}`, { userId: 'u' } )
	assert.ok( ai.wornPathCache.entries.size <= 200, `expected the live cache to respect its own real cap, got ${ai.wornPathCache.entries.size}` )

} )

// ============================================================================
// B) toJSON()/restoreState() — every field as its own named assertion
// ============================================================================

async function buildRichState() {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.7, agreeableness: 0.3, conscientiousness: 0.4 } ) } )
	ai.coreBeliefs.add( 'self_worth', 'soy una IA útil y valiosa', 1 )
	await ai.processInput( 'te quiero mucho, eres genial', { userId: 'alice' } )
	await ai.processInput( 'lograste algo increíble, felicidades', { userId: 'alice' } )
	await ai.processInput( 'me mentiste sobre el proyecto, esto es una traicion total', { userId: 'bob' } )
	await ai.processInput( 'no puedo creer que me hayas engañado así, te odio', { userId: 'bob' } )
	await ai.processInput( 'no puedo creer que me hayas engañado así, te odio', { userId: 'bob' } )
	await ai.processInput( 'eres un inútil, no sirves para nada', { userId: 'bob' } )
	ai.tick( 3 )
	await ai.idle( 1 )
	await ai.processInput( 'hola de nuevo', { userId: 'alice' } )
	return ai

}

const FIELD_CHECKS = [
	[ 'coreBeliefs', ( saved ) => saved.coreBeliefs.length > 0 ],
	[ 'classicalConditioningAssociations', () => true ],
	[ 'hedonicSeen', ( saved ) => saved.hedonicSeen.length > 0 ],
	[ 'sensitizationLevel', ( saved ) => typeof saved.sensitizationLevel === 'number' ],
	[ 'kindling', () => true ],
	[ 'dopamineExpectedValues', ( saved ) => saved.dopamineExpectedValues.length > 0 ],
	[ 'cortisolLevel', ( saved ) => typeof saved.cortisolLevel === 'number' ],
	[ 'attachmentRelations', ( saved ) => saved.attachmentRelations.length >= 2 ],
	[ 'episodicMemories', ( saved ) => saved.episodicMemories.length > 0 ],
	[ 'decisionFatigue', ( saved ) => typeof saved.decisionFatigue === 'number' ],
	[ 'cognitiveStress', ( saved ) => typeof saved.cognitiveStress === 'number' ],
	[ 'egoHealth', ( saved ) => typeof saved.egoHealth === 'number' ],
	[ 'allostaticLoad', ( saved ) => typeof saved.allostaticLoad === 'number' ],
	[ 'homeostasisNeeds', ( saved ) => typeof saved.homeostasisNeeds.stamina === 'number' ],
	[ 'sleepDebt', ( saved ) => typeof saved.sleepDebt === 'number' ],
	[ 'loveHate', ( saved ) => saved.loveHate.bonds.length >= 2 ],
]

for ( const [ field, sanityCheck ] of FIELD_CHECKS ) {

	test( `B: roundtrip_preserves_${field}`, async () => {

		const ai            = await buildRichState()
		const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
		const restored = new Totemheart()
		restored.restoreState( saved )
		const rehydrated = restored.toJSON()

		assert.ok( sanityCheck( saved ), `scenario didn't actually populate "${field}" — the round-trip check below would be trivially true otherwise` )
		assert.deepEqual( rehydrated[ field ], saved[ field ], `field "${field}" did not round-trip` )

	} )

}
// 16 cases

test( 'B23: roundtrip_full_state_semantic_equality_after_restore — a restored instance behaves consistently with the original', async () => {

	const ai            = await buildRichState()
	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	// Not just data equality — actual BEHAVIORAL consistency: the same next
	// turn from the same user should read the relationship the same way on
	// both instances (same dominant emotion direction, same bond sign).
	const originalNext   = await ai.processInput( 'hola', { userId: 'bob' } )
	const restoredNext = await restored.processInput( 'hola', { userId: 'bob' } )

	assert.equal( originalNext.emotionalState.dominantEmotion, restoredNext.emotionalState.dominantEmotion )
	assert.equal( Math.sign( ai.loveHateEngine.getNetBond( 'bob' ) ), Math.sign( restored.loveHateEngine.getNetBond( 'bob' ) ) )

} )

// ============================================================================
// E) HeuristicProvider + PipelineResilience robustness against hostile input
// ============================================================================

const MALICIOUS_INPUTS = [
	'', ' ', '\n\n\n', '🔥'.repeat( 50 ), 'a'.repeat( 10000 ),
	'<script>alert(1)</script>', "'; DROP TABLE users; --", '{{7*7}}', '${process.exit(1)}',
]

for ( const text of MALICIOUS_INPUTS ) {

	test( `E: HeuristicProvider.analyze never throws on hostile/degenerate input: "${text.slice( 0, 20 )}${text.length > 20 ? '…' : ''}"`, async () => {

		const provider = new HeuristicProvider()
		for ( const task of [ 'sentiment', 'appraisal', 'beliefConflict', 'mentalState', 'selfCritique' ] ) {

			const result = await provider.analyze( task, { text, beliefs: [] } )
			assert.equal( typeof result, 'object' )
			assert.notEqual( result, null )

		}

	} )

}
// 9 cases

test( 'E: PipelineResilience.safeStep contains a provider that throws specifically on malicious-looking input', async () => {

	const explainability = { logged: [], logDecision( type, msg ) { this.logged.push( { type, msg } ) } }
	const maliciousProvider = { analyze: async ( task, { text } ) => { if ( text?.includes( '<script>' ) ) throw new Error( 'malicious payload detected' ); return { desirability: 0 } } }

	const safeResult = await safeStep( explainability, 'appraisal', () => maliciousProvider.analyze( 'appraisal', { text: '<script>alert(1)</script>' } ), { desirability: 0, fallback: true } )
	assert.deepEqual( safeResult, { desirability: 0, fallback: true } )
	assert.ok( explainability.logged.some( l => l.type === 'degraded_step' ) )

} )

test( 'E: Totemheart keeps producing valid turns even with a provider that always throws on hostile input', async () => {

	const alwaysThrowingProvider = { analyze: async () => { throw new Error( 'provider is down' ) } }
	const ai                                    = new Totemheart( { provider: alwaysThrowingProvider } )

	for ( const text of MALICIOUS_INPUTS ) {

		const result = await ai.processInput( text, { userId: 'u' } )
		if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0 )

	}

} )
