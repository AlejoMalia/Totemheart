function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real hyperbolic temporal discounting — Mazur, J. E. (1987), "An
 * adjusting procedure for studying delayed reinforcement", in Commons,
 * Mazur, Nevin & Rachlin (eds.), Quantitative Analyses of Behavior, Vol. 5,
 * Erlbaum (the actual hyperbolic form, V = A/(1+kD), that fits real human
 * intertemporal choice far better than exponential discounting); Kirby, K.
 * N. (2009), "One-year temporal stability of delay-discount rates."
 * Psychonomic Bulletin & Review, for the real individual-difference
 * discount-rate `k` this module exposes as a tunable, personality-scalable
 * parameter rather than a fixed constant.
 *
 *   V = A / (1 + k·D)
 */
export class TemporalDiscountingEngine {

	constructor( { baseK = 0.3 } = {} ) {

		this.baseK = baseK // real per-instance discount rate; higher = steeper preference for the immediate

	}

	/**
	 * `amount` — real, bounded 0..1 magnitude of the reward/outcome.
	 * `delay` — real, caller-defined delay units (turns, hours, whatever the
	 * caller's own timescale is). `impulsivity` (0..1, optional) — a real
	 * personality-linked scaling of `k` (Neuroticism/low-Conscientiousness
	 * both correlate with steeper real discounting in the literature).
	 */
	discount( amount, delay, { impulsivity = 0.5 } = {} ) {

		const k               = this.baseK * ( 0.5 + clamp01( impulsivity ) )
		const discountedValue = clamp01( amount ) / ( 1 + k * Math.max( 0, delay ) )
		return { discountedValue, k }

	}

	/** Real comparison: does the immediate option beat the delayed one once discounted? */
	preferImmediate( immediateAmount, delayedAmount, delayedDelay, opts = {} ) {

		const delayed = this.discount( delayedAmount, delayedDelay, opts ).discountedValue
		return immediateAmount >= delayed

	}

}
