function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real, running "what's appropriate of me in this kind of context" field —
 * Cialdini, R. B., Reno, R. R. & Kallgren, C. A. (1990), "A focus theory of
 * normative conduct: Recycling the concept of norms to reduce littering in
 * public places." Journal of Personality and Social Psychology, 58(6),
 * 1015-1026 (real descriptive/injunctive norm distinction and the real
 * finding that a salient norm genuinely shapes behavior); Higgins, E. T.
 * (1987), "Self-discrepancy: A theory relating self and affect."
 * Psychological Review, 94(3), 319-340 (the real ought-self discrepancy
 * producing anticipatory guilt/anxiety this module's shortfall signal
 * follows). Real, per-context running estimate, own engineering of the
 * update rule.
 *
 *   N(c) = E[appropriate | c]
 */
export class NormativeExpectationField {

	constructor( { alpha = 0.2 } = {} ) {

		this.alpha       = alpha
		this.contexts = new Map() // context key -> real running expectation 0..1

	}

	getExpectation( context ) {

		return this.contexts.get( context ) ?? 0.5

	}

	/** A real observed outcome of "was that appropriate" (0..1) folds into this context's running expectation. */
	observe( context, appropriateness ) {

		const current = this.getExpectation( context )
		this.contexts.set( context, current + this.alpha * ( clamp01( appropriateness ) - current ) )

	}

	/** Real anticipatory shortfall — how far this turn's own read falls below the field's expectation, the real anticipatory-shame/conformity-pressure signal. */
	getShortfall( context, thisTurnAppropriateness ) {

		return Math.max( 0, this.getExpectation( context ) - clamp01( thisTurnAppropriateness ) )

	}

}
