/**
 * Prospect Theory (Kahneman & Tversky, 1979 — "Prospect Theory: An Analysis
 * of Decision under Risk", Econometrica). Their original estimate placed the
 * loss-aversion coefficient around 2.25; later replications put the range
 * roughly between 1.5 and 2.5 depending on domain. 2.25 is used here as the
 * commonly-cited point estimate, not a value re-derived from our own data.
 */
export class LossAversion {

	constructor( { coefficient = 2.25, curvature = 0.88 } = {} ) {

		this.coefficient = coefficient // λ
		this.curvature     = curvature   // ρ — Kahneman & Tversky (1979)'s own median-subject fit, same paper as λ=2.25

	}

	/** Kept as the simple, already-tested asymmetric multiplier used throughout the pipeline. */
	apply( delta ) {

		return delta < 0 ? delta * this.coefficient : delta

	}

	/**
	 * The full Prospect Theory value function: V(x) = x^ρ for gains,
	 * V(x) = -λ(-x)^ρ for losses. Diminishing sensitivity in BOTH directions
	 * (the curve flattens away from the reference point, not just scaled) —
	 * a strictly richer model than `apply()`'s flat multiplier. Operates on
	 * magnitudes in [0,1] (this library's scale), not the arbitrary monetary
	 * units of the original paper.
	 */
	valueFunction( x ) {

		return x >= 0
			? Math.pow( x, this.curvature )
			: -this.coefficient * Math.pow( -x, this.curvature )

	}

}
