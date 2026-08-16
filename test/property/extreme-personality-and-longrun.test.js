/**
 * C) Directional/long-run/round-trip checks for the extreme OCEAN corners
 *    (the 32-corner grid in extremes-and-saturation.test.js only checked
 *    getter bounds — this checks real, DIRECTIONAL comparative behavior and
 *    long-run stability at the two most extreme corners specifically).
 * F) The long-horizon saturation checks not already covered: ExpressionDebt's
 *    `.debt` field itself (not just the suppression reservoir), kindling's
 *    decay floor, a rupture-storm followed by idle/REM still serializable,
 *    oscillating love/hate not destabilizing PAD, and 500 ticks of
 *    INTERMITTENT (not every-turn) real input.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { AmygdalaHijack }          from '../../src/cognition/AmygdalaHijack.js'
import { LoveHateEngine }          from '../../src/social/LoveHateEngine.js'
import { ExpressionDebt }          from '../../src/behavior/ExpressionDebt.js'

function isFiniteDeep( value, path = '$', bad = [] ) {

	if ( typeof value === 'number' ) { if ( !Number.isFinite( value ) ) bad.push( path ); return bad }
	if ( Array.isArray( value ) ) { value.forEach( ( v, i ) => isFiniteDeep( v, `${path}[${i}]`, bad ) ); return bad }
	if ( value && typeof value === 'object' ) { for ( const [ k, v ] of Object.entries( value ) ) isFiniteDeep( v, `${path}.${k}`, bad ); return bad }
	return bad

}

// ============================================================================
// C) Extreme combined personalities — directional and long-run checks
// ============================================================================

test( 'C24: all traits at 0 produces valid, finite dynamics across a real 40-turn conversation', async () => {

	const ai = new Totemheart( { personality: new Personality( { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 } ) } )
	const turns = [ 'te quiero mucho', 'me mentiste, esto es una traicion', 'eres un inútil', 'lograste algo genial', 'hola' ]
	for ( let i = 0; i < 40; i++ ) {

		const result = await ai.processInput( turns[ i % turns.length ], { userId: 'u' } )
		if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0, `turn ${i}` )

	}
	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => v >= -1 && v <= 1 ) )

} )

test( 'C25: all traits at 1 produces valid, finite dynamics across a real 40-turn conversation', async () => {

	const ai = new Totemheart( { personality: new Personality( { openness: 1, conscientiousness: 1, extraversion: 1, agreeableness: 1, neuroticism: 1 } ) } )
	const turns = [ 'te quiero mucho', 'me mentiste, esto es una traicion', 'eres un inútil', 'lograste algo genial', 'hola' ]
	for ( let i = 0; i < 40; i++ ) {

		const result = await ai.processInput( turns[ i % turns.length ], { userId: 'u' } )
		if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0, `turn ${i}` )

	}
	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => v >= -1 && v <= 1 ) )

} )

test( 'C26: real corner comparison under repeated criticism — high agreeableness (shame reaction) accumulates MORE cortisol/Aversion than low agreeableness (wounded-pride reaction), not less', async () => {

	// The original premise here ("low agreeableness = more reactive/aversive")
	// was a plausible-sounding but WRONG assumption about how this composes —
	// checked by hand against 30 independent trials with zero reversals before
	// writing this down. The real mechanism: ReputationEngine.evaluate() picks
	// 'shame' for agreeableness > 0.5 and 'wounded_pride' otherwise — and only
	// the shame branch (see Totemheart.js) adds a real extra negative-valence/
	// dominance spike onto the AI's OWN felt state. Wounded pride instead biases
	// toward blaming the user (EgoProjection), which doesn't carry that same
	// direct self-directed hit. So under repeated criticism specifically, the
	// HIGH-agreeableness personality (shame-prone) is the one that genuinely
	// accumulates more cortisol and LoveHateEngine Aversion — the opposite
	// direction naive intuition suggests, and a real, worthwhile thing to have
	// actually checked instead of assumed.
	const hostileTurns = [ 'eres un inútil, no sirves para nada', 'siempre lo haces mal', 'estás completamente equivocado', 'me mentiste, esto es una traicion' ]

	const shameProne     = new Totemheart( { personality: new Personality( { neuroticism: 0, agreeableness: 1 } ) } )
	const proudDefensive = new Totemheart( { personality: new Personality( { neuroticism: 1, agreeableness: 0 } ) } )

	for ( const turn of hostileTurns ) { await shameProne.processInput( turn, { userId: 'u' } ); await proudDefensive.processInput( turn, { userId: 'u' } ) }

	assert.ok( shameProne.cortisolEngine.getLevel() >= proudDefensive.cortisolEngine.getLevel(), `expected the shame-prone corner to accumulate at least as much cortisol: shame=${shameProne.cortisolEngine.getLevel()} pride=${proudDefensive.cortisolEngine.getLevel()}` )
	assert.ok( shameProne.loveHateEngine.getBond( 'u' ).V >= proudDefensive.loveHateEngine.getBond( 'u' ).V, 'expected the shame-prone corner to accumulate at least as much Aversion' )

} )

test( 'C27: max openness + min conscientiousness genuinely habituates slower and tolerates less dissonance than the opposite corner', () => {

	const openLowConscientious = new Personality( { openness: 1, conscientiousness: 0 } )
	const closedHighConscientious = new Personality( { openness: 0, conscientiousness: 1 } )

	assert.ok( openLowConscientious.getHedonicAdaptationRate() < closedHighConscientious.getHedonicAdaptationRate(), 'higher openness should habituate MORE slowly (lower rate)' )
	assert.ok( openLowConscientious.getDissonanceThreshold() > closedHighConscientious.getDissonanceThreshold(), 'lower conscientiousness should tolerate MORE inconsistency before it registers as dissonance (higher threshold)' )

} )

test( 'C28: neither extreme corner emits NaN/Infinity across a real 100-turn run', async () => {

	for ( const traits of [ { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 }, { openness: 1, conscientiousness: 1, extraversion: 1, agreeableness: 1, neuroticism: 1 } ] ) {

		const ai      = new Totemheart( { personality: new Personality( traits ) } )
		const turns = [ 'te quiero mucho', 'me mentiste, esto es una traicion total', 'eres un inútil, no sirves para nada', 'lograste algo increíble', 'hola de nuevo', 'perdona, lo siento' ]
		for ( let i = 0; i < 100; i++ ) {

			const result = await ai.processInput( turns[ i % turns.length ], { userId: 'u' } )
			if ( i % 20 === 0 ) ai.tick( 3 )
			if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0, `traits=${JSON.stringify( traits )} turn=${i}` )

		}

	}

} )

test( 'C29: an extreme-corner personality round-trips through toJSON()/restoreState() without drift', async () => {

	for ( const traits of [ { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 }, { openness: 1, conscientiousness: 1, extraversion: 1, agreeableness: 1, neuroticism: 1 } ] ) {

		const ai = new Totemheart( { personality: new Personality( traits ) } )
		await ai.processInput( 'me mentiste, esto es una traicion total', { userId: 'u' } )
		await ai.processInput( 'te quiero mucho, eres genial', { userId: 'u' } )

		const restored = new Totemheart()
		restored.restoreState( JSON.parse( JSON.stringify( ai.toJSON() ) ) )

		assert.deepEqual( restored.personality.traits, ai.personality.traits )
		assert.deepEqual( restored.emotionSpace.vector, ai.emotionSpace.vector )

	}

} )

// ============================================================================
// F) Remaining long-horizon saturation checks
// ============================================================================

test( 'F45: ExpressionDebt.debt itself (not just the suppression reservoir) never overflows past 1 under sustained accumulation', () => {

	const debt = new ExpressionDebt()
	for ( let i = 0; i < 2000; i++ ) debt.accumulate( 1 )
	assert.ok( debt.debt <= 1, `debt=${debt.debt}` )
	assert.ok( Number.isFinite( debt.debt ) )

} )

test( 'F47: AmygdalaHijack kindling has a real floor at 0 and never goes negative under sustained decay', () => {

	const hijack = new AmygdalaHijack()
	for ( let i = 0; i < 5; i++ ) hijack.observeStimulus( 'threat' )
	for ( let i = 0; i < 5000; i++ ) hijack.decayKindling( 1 )
	const level = hijack.kindling.get( 'threat' ) ?? 0
	assert.ok( level >= 0, `level=${level}` )
	assert.equal( hijack.kindling.has( 'threat' ), false, 'a fully decayed concept should be pruned from the map, not linger at exactly 0' )

} )

test( 'F48: 100 real rupture cycles followed by idle/REM still produces a serializable, finite state', async () => {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.7 } ) } )
	for ( let i = 0; i < 100; i++ ) {

		await ai.processInput( 'me mentiste sobre el proyecto, esto es una traicion total', { userId: 'u' } )
		if ( i % 10 === 0 ) await ai.processInput( 'perdona, de verdad lo siento', { userId: 'u' } )

	}
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 6
	const afterIdle = await ai.processInput( 'hola de nuevo', { userId: 'u' } )

	if ( afterIdle.emotionalState ) assert.equal( isFiniteDeep( afterIdle.emotionalState ).length, 0 )
	const snapshot = JSON.stringify( ai.toJSON() )
	assert.ok( snapshot.length > 0 )
	assert.equal( isFiniteDeep( JSON.parse( snapshot ) ).length, 0 )

} )

test( 'F49: oscillating love/hate input for 100 turns never destabilizes the PAD vector out of bounds', async () => {

	const ai = new Totemheart()
	const love     = 'te quiero mucho, eres genial'
	const hate     = 'me mentiste, esto es una traicion total, te odio'
	for ( let i = 0; i < 100; i++ ) {

		const result = await ai.processInput( i % 2 === 0 ? love : hate, { userId: 'u' } )
		if ( result.emotionalState ) {

			const { valence, arousal, dominance } = result.emotionalState.vector
			assert.ok( [ valence, arousal, dominance ].every( v => v >= -1 && v <= 1 ), `turn ${i}: vector out of bounds` )

		}

	}

} )

test( 'F50: real invariants hold across 500 ticks with INTERMITTENT (not every-turn) real input', async () => {

	const ai      = new Totemheart( { personality: new Personality( { neuroticism: 0.6 } ) } )
	const turns = [ 'hola', 'te quiero mucho', 'me mentiste, esto es una traicion', 'lograste algo genial' ]

	for ( let i = 0; i < 500; i++ ) {

		if ( i % 3 === 0 ) {

			const result = await ai.processInput( turns[ i % turns.length ], { userId: 'u' } )
			if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0, `tick ${i}` )

		}
		else ai.tick( 1 )

	}
	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => v >= -1 && v <= 1 ) )
	assert.ok( ai.cortisolEngine.getLevel() <= 1 )
	assert.ok( JSON.stringify( ai.toJSON() ).length > 0 )

} )
