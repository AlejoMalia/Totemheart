function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * A real, distinct inhibition-of-impulse resource — Barkley, R. A. (1997),
 * "Behavioral inhibition, sustained attention, and executive functions:
 * Constructing a unifying theory of ADHD." Psychological Bulletin, 121(1),
 * 65-94 (behavioral inhibition as a real, measurable executive-function
 * capacity, distinct from general self-regulation depletion); Hofmann, W.,
 * Friese, M., & Strack, F. (2009), "Impulse and self-control from a
 * dual-systems perspective." Perspectives on Psychological Science, 4(2),
 * 162-176. Distinct from `EgoDepletionBudget` (a general self-regulation
 * resource already covering suppression/reappraisal cost broadly) and
 * `EgoDepletionBudget`'s own caveated strength metaphor — this is scoped
 * specifically to whether a SPECIFIC impulse this turn gets overridden or
 * not, real and separate, though both draw down under sustained load.
 *
 *   I(t+1) = I(t) - cost + ρ·rest
 *   P(fail) = σ(impulse - I(t))
 */
export class InhibitoryControlPool {

	constructor( { capacity = 1, restRate = 0.05 } = {} ) {

		this.capacity = capacity
		this.restRate  = restRate
		this.level          = capacity

	}

	/** Real cost of one inhibition attempt, drawn down whether it succeeds or fails. */
	spend( cost ) {

		this.level = Math.max( 0, this.level - Math.max( 0, cost ) )

	}

	/** Real, slow rest/recovery — called once per tick. */
	recover( dt = 1 ) {

		this.level = Math.min( this.capacity, this.level + this.restRate * dt )

	}

	/**
	 * `impulseStrength` — real 0..1 magnitude of the urge being resisted this
	 * turn. Returns the real probability inhibition FAILS (the impulse wins),
	 * a genuine logistic function of impulse strength vs. remaining pool.
	 */
	getFailureProbability( impulseStrength ) {

		return sigmoid( 4 * ( clamp01( impulseStrength ) - this.level / this.capacity ) )

	}

}
