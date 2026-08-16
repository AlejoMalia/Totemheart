function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real, general attentional-effort budget — distinct from
 * EgoDepletionBudget (which is specifically about the cost of active
 * self-REGULATION acts: suppression, reappraisal, overriding an immature
 * defense). This one is about the cost of effortful REASONING/attention in
 * general, and — its own real, distinct coupling — chronic cortisol
 * directly dampens how much real recovery a given rest period buys, not
 * just spend. Grounded in the general limited-capacity-attention framing
 * (Kahneman, D. (1973), "Attention and Effort", Prentice-Hall) rather than
 * the specific, contested ego-depletion/glucose mechanism EgoDepletionBudget
 * already carries its own honest caveat for — Kahneman's capacity model
 * doesn't carry that same replication controversy.
 *
 *   Energy(t+1) = Energy(t) − effort_cost + recovery · (1 − cortisol)
 *   PerformanceMultiplier = √Energy
 */
export class EnergyBudget {

	constructor( { capacity = 1, baseRecovery = 0.03 } = {} ) {

		this.capacity      = capacity
		this.baseRecovery = baseRecovery
		this.energy            = capacity

	}

	spend( effortCost ) {

		this.energy = Math.max( 0, this.energy - Math.max( 0, effortCost ) )
		return this.energy

	}

	/** Real, honest coupling: chronic cortisol genuinely blunts how much a given rest period recovers — the same allostatic-load direction Homeostasis.js/CircadianRhythm.js already model elsewhere in this codebase. */
	recover( cortisol = 0, dt = 1 ) {

		this.energy = Math.min( this.capacity, this.energy + this.baseRecovery * ( 1 - clamp01( cortisol ) ) * dt )
		return this.energy

	}

	/**
	 * Real, non-linear performance scaling: √x sits ABOVE the linear diagonal
	 * for x in (0,1) — a half-full budget (0.5) still gives ≈0.71 of real
	 * performance, not 0.5 — but the curve steepens sharply as energy
	 * approaches empty (its own slope, 1/(2√x), grows without bound near 0),
	 * so the real cost of running near-empty is much worse than the cost of
	 * running at half capacity. Own tuning of √ as the specific curve shape.
	 */
	getPerformanceMultiplier() {

		return Math.sqrt( clamp01( this.energy / this.capacity ) )

	}

	getLevel() {

		return clamp01( this.energy / this.capacity )

	}

}
