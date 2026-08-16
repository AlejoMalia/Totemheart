function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A small, dynamic subset of Schwartz's real, cross-culturally validated
 * basic human values (Schwartz, S. H. (1992), "Universals in the content and
 * structure of values: theoretical advances and empirical tests in 20
 * countries", Advances in Experimental Social Psychology, 25, 1-65) —
 * benevolence (care), universalism (fairness), conformity (loyalty/tradition),
 * self-direction (autonomy), and security. Each holds a real weight in [0,1]
 * that experience nudges via a simple EMA (own engineering — Schwartz's work
 * establishes the value STRUCTURE, not a per-agent learning update rule).
 * When two active values genuinely conflict on the same appraisal (opposite
 * polarity read on the same event, e.g. an honesty/fairness pull toward
 * telling a hard truth vs. a care/loyalty pull toward protecting feelings),
 * this raises a real dissonance signal proportional to how strongly BOTH
 * values are held — a mild, weakly-held value clashing with a strong one
 * isn't much of a real conflict; two strongly-held values clashing is.
 */
const DEFAULT_VALUES = [ 'care', 'fairness', 'loyalty', 'autonomy', 'security' ]

export class ValueHierarchy {

	constructor( initialWeights = {} ) {

		this.weights = new Map( DEFAULT_VALUES.map( v => [ v, clamp01( initialWeights[ v ] ?? 0.5 ) ] ) )

	}

	getWeight( value ) {

		return this.weights.get( value ) ?? 0

	}

	/** Real EMA nudge — an experience that reinforced or violated a value shifts its weight, bounded in [0,1]. */
	nudge( value, delta, rate = 0.1 ) {

		if ( !this.weights.has( value ) ) return
		const current = this.weights.get( value )
		this.weights.set( value, clamp01( current + rate * delta ) )

	}

	/**
	 * `polarityA`/`polarityB` — signed direction (-1..1) each value pulls THIS
	 * appraisal toward. A real conflict requires opposite signs; the
	 * dissonance magnitude is the product of both weights (both must matter)
	 * scaled by how opposed the polarities are.
	 */
	evaluateConflict( valueA, polarityA, valueB, polarityB ) {

		if ( Math.sign( polarityA ) === Math.sign( polarityB ) || polarityA === 0 || polarityB === 0 ) {

			return { conflict: false, dissonance: 0 }

		}

		const wA          = this.getWeight( valueA )
		const wB          = this.getWeight( valueB )
		const opposition = Math.min( Math.abs( polarityA ), Math.abs( polarityB ) )
		const dissonance  = clamp01( wA * wB * opposition )

		return { conflict: dissonance > 0.05, dissonance, valueA, valueB }

	}

	getAll() {

		return [ ...this.weights.entries() ]

	}

}
