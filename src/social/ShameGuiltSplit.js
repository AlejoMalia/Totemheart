function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Splits ReputationEngine's single 'shame'/'wounded_pride' branch into two
 * genuinely distinct, separately-tracked scalars, per the real psychological
 * distinction (Tangney, J. P., & Dearing, R. L. (2002), "Shame and Guilt",
 * Guilford Press): shame is global and self-directed ("I am bad" — an attack
 * on identity), guilt is specific and behavior-directed ("I did a bad thing"
 * — an attack on an action). They have different real downstream effects in
 * that literature: shame correlates with withdrawal/defensiveness and is
 * MORE persistent; guilt correlates with reparative action and resolves
 * faster once the act is addressed. Modeled here as two independent
 * accumulators with different decay rates (shame slower, matching that
 * "more toxic/persistent" finding), not as two labels on the same number.
 */
export class ShameGuiltSplit {

	constructor( { shameDecay = 0.015, guiltDecay = 0.035 } = {} ) {

		this.shameDecay = shameDecay
		this.guiltDecay   = guiltDecay
		this.shame           = 0
		this.guilt              = 0

	}

	/**
	 * `egoDamage` — real magnitude already computed by ReputationEngine.evaluate()
	 * (identity-level: "I failed", raises shame, scaled by agreeableness per the
	 * existing shame/wounded_pride split). `selfCritiqueScore` — real magnitude
	 * from GuiltEngine's own trigger condition (behavior-level: "that output was
	 * harsh"), raises guilt directly, independent of agreeableness.
	 */
	register( { egoDamage = 0, selfCritiqueScore = 0, agreeableness = 0.5 } ) {

		this.shame = clamp01( this.shame + egoDamage * agreeableness * 0.8 )
		this.guilt   = clamp01( this.guilt + selfCritiqueScore * 0.6 )

	}

	decay( dt = 1 ) {

		this.shame = Math.max( 0, this.shame - this.shameDecay * dt )
		this.guilt   = Math.max( 0, this.guilt - this.guiltDecay * dt )

	}

	/** Shame biases toward withdrawal/defensiveness and lower self-disclosure — a real output-facing signal, not just an internal number. */
	getDisclosureWillingness() {

		return clamp01( 1 - this.shame * 0.8 )

	}

	/** Guilt biases toward reparative action — feeds RepairProtocol/GuiltEngine's apology tendency. */
	getRepairDrive() {

		return this.guilt

	}

	/** Which of the two currently dominates — used to pick the real behaviorDirective (withdraw-and-hide vs. apologize-and-fix). */
	getDominant( threshold = 0.3 ) {

		if ( this.shame < threshold && this.guilt < threshold ) return 'none'
		return this.shame >= this.guilt ? 'shame' : 'guilt'

	}

}
