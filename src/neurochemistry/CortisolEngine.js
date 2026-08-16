function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Persistent stress accumulator, distinct from the per-turn CognitiveDissonance
 * stress. Negative or ambiguous inputs raise it; it decays slowly (chronic,
 * not acute). High cortisol lowers the threshold needed to trigger
 * anger/fear and shortens "patience" for long inputs.
 */
export class CortisolEngine {

	constructor() {

		this.level = 0

	}

	register( desirability, ambiguous = false ) {

		if ( desirability < -0.15 ) this.level = clamp01( this.level + Math.abs( desirability ) * 0.12 )
		else if ( ambiguous ) this.level = clamp01( this.level + 0.05 )

	}

	decay( dt, lambda = 0.03 ) {

		this.level = Math.max( 0, this.level - lambda * dt )

	}

	/** Multiplies into the amygdala-hijack / defense-mechanism thresholds — lower threshold = easier to trigger. */
	getThresholdMultiplier() {

		return 1 - 0.4 * this.level

	}

	/** Multiplies allowed input length before "impatience" kicks in. */
	getPatienceMultiplier() {

		return 1 - 0.5 * this.level

	}

	getLevel() {

		return this.level

	}

}
