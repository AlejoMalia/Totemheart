/**
 * Reusable cross-mechanism audit helpers, extracted directly from
 * test/integration/cross-mechanism-friction.test.js in the core package —
 * the same real assertions used to stress-test the 18 relational-friction
 * mechanisms this round, packaged so a fork or a downstream app built on
 * Totemheart can run the same real discipline against ITS OWN scenarios,
 * not just the ones already covered in core.
 */

/** Neutralizes SensoryOverload's real rate-based burst freeze for tight test loops — same pattern used throughout the core test suite. */
export function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

/** Neutralizes AmygdalaHijack's early-return so a test can reach mechanisms downstream of it (rupture, repair, grief...) — isolates the mechanism under test, doesn't claim hijack itself should behave differently. */
export function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

/**
 * Real, bounded-state invariant check — the same assertion battery
 * cross-mechanism-friction.test.js runs after every stacked scenario:
 * every real PAD/cortisol/dissonance/egoHealth/budget/sleep-pressure scalar
 * must be finite and within its own documented real bounds. Throws (via the
 * supplied `assert`-like function) on the first violation, same as a normal
 * test assertion — this is not a silent health check, a violation is a real
 * bug.
 */
export function assertFiniteState( ai, assertFn ) {

	const assert = assertFn ?? defaultAssert
	const v         = ai.emotionSpace.vector

	assert( Number.isFinite( v.valence ), 'valence must be finite' )
	assert( Number.isFinite( v.arousal ), 'arousal must be finite' )
	assert( Number.isFinite( v.dominance ), 'dominance must be finite' )
	assert( v.valence >= -1 && v.valence <= 1, `valence out of bounds: ${v.valence}` )
	assert( v.arousal >= 0 && v.arousal <= 1, `arousal out of bounds: ${v.arousal}` )
	assert( v.dominance >= -1 && v.dominance <= 1, `dominance out of bounds: ${v.dominance}` )

	const cortisol = ai.cortisolEngine.getLevel()
	assert( Number.isFinite( cortisol ) && cortisol >= 0 && cortisol <= 1, `cortisol out of bounds: ${cortisol}` )

	const stress = ai.cognitiveDissonance.getStress()
	assert( Number.isFinite( stress ) && stress >= 0 && stress <= 1, `cognitiveDissonance.stress out of bounds: ${stress}` )

	assert( Number.isFinite( ai.reputationEngine.egoHealth ) && ai.reputationEngine.egoHealth >= 0 && ai.reputationEngine.egoHealth <= 1, `egoHealth out of bounds: ${ai.reputationEngine.egoHealth}` )

	if ( ai.egoDepletionBudget ) assert( Number.isFinite( ai.egoDepletionBudget.budget ) && ai.egoDepletionBudget.budget >= 0, `egoDepletionBudget out of bounds: ${ai.egoDepletionBudget.budget}` )
	if ( ai.sleepPressure ) {

		const level = ai.sleepPressure.getLevel()
		assert( Number.isFinite( level ) && level >= 0 && level <= 1, `sleepPressure out of bounds: ${level}` )

	}

}

function defaultAssert( condition, message ) {

	if ( !condition ) throw new Error( message ?? 'assertFiniteState: invariant violated' )

}

/**
 * Drives a real, deterministic hostile-then-rupture scenario against a
 * `LoveHateEngine` bond and returns whether it actually ruptured within
 * `maxTurns` — the same real setup cross-mechanism-friction.test.js uses for
 * its grief/repair scenarios, generalized for reuse against any input text
 * and userId.
 */
export async function driveToRupture( ai, { userId = 'u', hostileText = 'me mentiste, esto es una traicion', maxTurns = 40 } = {} ) {

	let ruptured = false
	for ( let i = 0; i < maxTurns && !ruptured; i++ ) {

		await ai.processInput( hostileText, { userId } )
		ruptured = ai.loveHateEngine.getBond( userId ).ruptured

	}
	return ruptured

}
