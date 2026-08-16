/**
 * Combined-extreme personality grids, exact WornPathCache eviction-order
 * boundaries, and long-horizon saturation limits — the three gaps flagged
 * after the first property grid: single-axis sweeps don't catch what
 * happens when EVERY trait is simultaneously at an extreme, a fixed-size
 * cache's eviction order was never checked past "does it stay bounded", and
 * "bounded in [0,1]" was only ever exercised at moderate repeat counts, not
 * hundreds/thousands.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { WornPathCache }           from '../../src/core/WornPathCache.js'
import { AmygdalaHijack }          from '../../src/cognition/AmygdalaHijack.js'
import { LoveHateEngine }          from '../../src/social/LoveHateEngine.js'
import { ExpressionDebt }          from '../../src/behavior/ExpressionDebt.js'
import { CortisolEngine }          from '../../src/neurochemistry/CortisolEngine.js'
import { Sensitization }           from '../../src/cognition/Sensitization.js'
import { HebbianPlasticity }       from '../../src/core/HebbianPlasticity.js'

function isFiniteDeep( value, path = '$', bad = [] ) {

	if ( typeof value === 'number' ) { if ( !Number.isFinite( value ) ) bad.push( path ); return bad }
	if ( Array.isArray( value ) ) { value.forEach( ( v, i ) => isFiniteDeep( v, `${path}[${i}]`, bad ) ); return bad }
	if ( value && typeof value === 'object' ) { for ( const [ k, v ] of Object.entries( value ) ) isFiniteDeep( v, `${path}.${k}`, bad ); return bad }
	return bad

}

// ============================================================================
// 1) Combined-extreme personalities — all 2^5=32 corners of the OCEAN unit
//    hypercube, not just one axis moved at a time.
// ============================================================================

const TRAITS = [ 'openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism' ]

function* corners() {

	for ( let mask = 0; mask < 32; mask++ ) {

		const traits = {}
		TRAITS.forEach( ( trait, i ) => { traits[ trait ] = ( mask >> i ) & 1 } )
		yield { mask, traits }

	}

}

for ( const { mask, traits } of corners() ) {

	const label = TRAITS.map( t => `${t[ 0 ]}${traits[ t ]}` ).join( '' )

	test( `Personality corner ${mask.toString( 2 ).padStart( 5, '0' )} (${label}) — real getters stay in valid ranges`, () => {

		const personality = new Personality( traits )

		const recoveryNeg = personality.getEmotionalRecoveryRate( -1 )
		const recoveryPos = personality.getEmotionalRecoveryRate( 1 )
		assert.ok( recoveryNeg > 0 && Number.isFinite( recoveryNeg ) )
		assert.ok( recoveryPos > 0 && Number.isFinite( recoveryPos ) )

		const socialDecay = personality.getSocialDecayRate()
		assert.ok( socialDecay > 0 && Number.isFinite( socialDecay ) )

		const hedonicRate = personality.getHedonicAdaptationRate()
		assert.ok( hedonicRate > 0 && hedonicRate <= 1 )

		const dissonanceThreshold = personality.getDissonanceThreshold()
		assert.ok( Number.isFinite( dissonanceThreshold ) )

		const weights = personality.getDefenseWeights()
		const sum         = Object.values( weights ).reduce( ( a, b ) => a + b, 0 )
		assert.ok( Math.abs( sum - 1 ) < 1e-9, `defense weights sum=${sum}` )
		assert.ok( Object.values( weights ).every( w => w >= 0 && w <= 1 ) )

	} )

}
// 32 cases

for ( const { mask, traits } of corners() ) {

	if ( mask % 4 !== 0 ) continue // full 3-turn pipeline per corner is real work — every 4th corner (8 total) keeps this a genuine but not excessive full-pipeline check

	const label = TRAITS.map( t => `${t[ 0 ]}${traits[ t ]}` ).join( '' )

	test( `Personality corner ${mask.toString( 2 ).padStart( 5, '0' )} (${label}) — real pipeline stays finite/bounded across a mixed conversation`, async () => {

		const ai      = new Totemheart( { personality: new Personality( traits ) } )
		const turns = [ 'te quiero mucho, eres genial', 'me mentiste, esto es una traicion total', 'eres un inútil, no sirves para nada' ]
		for ( const turn of turns ) {

			const result = await ai.processInput( turn, { userId: 'u' } )
			if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0 )

		}
		const { valence, arousal, dominance } = ai.emotionSpace.vector
		assert.ok( [ valence, arousal, dominance ].every( v => v >= -1 && v <= 1 ) )

	} )

}
// 8 cases

// ============================================================================
// 2) WornPathCache — exact eviction order at the maxEntries boundary.
// ============================================================================

test( 'WornPathCache evicts in strict insertion order once at maxEntries capacity', () => {

	const wpc = new WornPathCache( { promotionThreshold: 1, maxEntries: 5 } )
	for ( let i = 0; i < 5; i++ ) wpc.observe( `fp${i}`, { x: i } )
	assert.equal( wpc.entries.size, 5 )
	assert.deepEqual( [ ...wpc.entries.keys() ], [ 'fp0', 'fp1', 'fp2', 'fp3', 'fp4' ] )

	wpc.observe( 'fp5', { x: 5 } ) // over capacity by 1 -> fp0 (oldest) must go
	assert.equal( wpc.entries.size, 5 )
	assert.equal( wpc.entries.has( 'fp0' ), false )
	assert.equal( wpc.entries.has( 'fp5' ), true )
	assert.deepEqual( [ ...wpc.entries.keys() ], [ 'fp1', 'fp2', 'fp3', 'fp4', 'fp5' ] )

} )

for ( const maxEntries of [ 1, 2, 3, 5, 10, 20 ] ) {

	test( `WornPathCache never exceeds maxEntries=${maxEntries} across 10x that many observes`, () => {

		const wpc = new WornPathCache( { promotionThreshold: 1, maxEntries } )
		for ( let i = 0; i < maxEntries * 10; i++ ) wpc.observe( `fp${i}`, { x: i } )
		assert.equal( wpc.entries.size, maxEntries )
		// The survivors must be exactly the LAST `maxEntries` fingerprints observed.
		const expectedSurvivors = Array.from( { length: maxEntries }, ( _, i ) => `fp${maxEntries * 10 - maxEntries + i}` )
		assert.deepEqual( [ ...wpc.entries.keys() ], expectedSurvivors )

	} )

}
// 1+6 = 7 cases

// ============================================================================
// 3) Long-horizon saturation — hundreds/thousands of repeats, checking every
//    accumulator clamps correctly and never overflows past its real bound.
// ============================================================================

test( 'AmygdalaHijack kindling saturates at exactly the real ceiling after 1000 repeats of the same concept', () => {

	const hijack = new AmygdalaHijack()
	for ( let i = 0; i < 1000; i++ ) hijack.observeStimulus( 'threat' )
	const level      = hijack.kindling.get( 'threat' )
	const discount = hijack.getKindlingDiscount( [ 'threat' ] )

	assert.ok( level <= 1, `level=${level}` )
	assert.ok( Math.abs( level - 1 ) < 1e-9, `expected the real clamp01 ceiling, got level=${level}` )
	assert.ok( Math.abs( discount - 0.15 ) < 1e-9, `expected the real 0.15 discount ceiling (level*0.15 at level=1), got ${discount}` )

} )

test( 'ExpressionDebt suppressionCostReservoir never exceeds 1 after 1000 uncompensated charges', () => {

	const debt = new ExpressionDebt()
	for ( let i = 0; i < 1000; i++ ) debt.chargeSuppressionCost( 1 )
	assert.ok( debt.suppressionCostReservoir <= 1, `reservoir=${debt.suppressionCostReservoir}` )
	assert.ok( Number.isFinite( debt.suppressionCostReservoir ) )

} )

test( 'CortisolEngine level never exceeds 1 after 1000 maximal-negative registers', () => {

	const cortisol = new CortisolEngine()
	for ( let i = 0; i < 1000; i++ ) cortisol.register( -1, false )
	assert.ok( cortisol.getLevel() <= 1, `level=${cortisol.getLevel()}` )
	assert.ok( cortisol.getThresholdMultiplier() >= 0.6 - 1e-9 )

} )

test( 'Sensitization level never exceeds 1 after 1000 maximal-negative observations', () => {

	const sensitization = new Sensitization()
	for ( let i = 0; i < 1000; i++ ) sensitization.observe( -1 )
	assert.ok( sensitization.level <= 1, `level=${sensitization.level}` )
	assert.ok( sensitization.getThresholdMultiplier() >= 0.7 - 1e-9 )

} )

for ( const [ eta, gamma ] of [ [ 0.1, 0.02 ], [ 0.2, 0.05 ], [ 0.3, 0.1 ], [ 0.05, 0.01 ] ] ) {

	test( `HebbianPlasticity converges to its real analytical fixed point after 10000 co-activations: eta=${eta} gamma=${gamma}`, () => {

		// Per update(): decay ALL weights by gamma first, THEN add eta*(1-w) to
		// co-activated pairs. Solving w* = w*(1-gamma) + eta*(1-w*(1-gamma)) for
		// the fixed point gives w* = eta / (gamma + eta*(1-gamma)) — a real,
		// derivable ceiling STRICTLY below 1 by design (that's what γ is for:
		// the class's own docs promise it never gets "stuck" at 1).
		const hebbian    = new HebbianPlasticity( { eta, gamma } )
		const k                = 1 - gamma
		const fixedPoint = eta / ( gamma + eta * k )

		for ( let i = 0; i < 10000; i++ ) hebbian.update( [ 'a', 'b' ] )
		const weight = hebbian.getAssociation( 'a', 'b' )

		assert.ok( weight < 1, `expected strictly below 1 by design, got ${weight}` )
		assert.ok( Math.abs( weight - fixedPoint ) < 1e-6, `expected convergence to the real fixed point ${fixedPoint}, got ${weight}` )

	} )

}
// 4 cases

test( 'LoveHateEngine kindling and bond values stay bounded across 200 real rupture-repair cycles', () => {

	const lh = new LoveHateEngine( { thetaR: 0.3, thetaP: 0.3, thetaCalm: 0.4 } )
	for ( let cycle = 0; cycle < 200; cycle++ ) {

		for ( let i = 0; i < 3; i++ ) lh.observe( 'u', { L: 0, H: 0.9 }, { trust: 0.5 } )
		lh.checkRupture( 'u', { cortisol: 0 } )
		lh.attemptRepair( 'u', { cortisol: 0 } )

		const bond      = lh.getBond( 'u' )
		const kindling = lh.kindling.get( 'u' ) ?? 0
		assert.ok( bond.A >= 0 && bond.A <= 1, `cycle ${cycle}: A=${bond.A}` )
		assert.ok( bond.V >= 0 && bond.V <= 1, `cycle ${cycle}: V=${bond.V}` )
		assert.ok( kindling >= 0 && kindling <= 1, `cycle ${cycle}: kindling=${kindling}` )
		assert.ok( Number.isFinite( bond.ruptureCount ) && Number.isFinite( bond.repairCount ) )

	}
	const finalBond = lh.getBond( 'u' )
	assert.equal( finalBond.ruptureCount >= finalBond.repairCount, true, 'cannot have repaired more times than it ruptured' )

} )

test( 'A real Totemheart instance survives 500 turns of sustained hostility without any accumulator overflowing', async () => {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.8 } ) } )
	const hostileTurns = [
		'me mentiste sobre el proyecto, esto es una traicion total',
		'ERES HORRIBLE, TE ODIO, ESTO ES UNA TRAICION!!!',
		'eres un inútil, no sirves para nada',
	]
	for ( let i = 0; i < 500; i++ ) {

		const result = await ai.processInput( hostileTurns[ i % hostileTurns.length ], { userId: 'u' } )
		if ( i % 50 === 0 ) ai.tick( 5 )
		if ( result.emotionalState ) assert.equal( isFiniteDeep( result.emotionalState ).length, 0, `turn ${i}: non-finite state` )

	}

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => v >= -1 && v <= 1 ) )
	assert.ok( ai.cortisolEngine.getLevel() <= 1 )
	assert.ok( ai.expressionDebt.debt <= 1 && ai.expressionDebt.suppressionCostReservoir <= 1 )
	assert.ok( ai.sensitization.level <= 1 )
	const bond = ai.loveHateEngine.getBond( 'u' )
	assert.ok( bond.A >= 0 && bond.A <= 1 && bond.V >= 0 && bond.V <= 1 )
	const snapshot = ai.toJSON()
	assert.ok( JSON.stringify( snapshot ).length > 0 ) // must still be serializable after 500 turns of sustained stress

} )
