function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Bystander silence and sensory-overload freezes exit processInput() before
 * any text is generated, but the felt state at that moment doesn't stop
 * existing just because it wasn't expressed. Nothing tracked that gap before
 * this — the swallowed magnitude just vanished. This accumulates it as a
 * real scalar (own design, no citation: not a reproduction of any named
 * "affect suppression" model), decays slowly like CortisolEngine/Sensitization,
 * and pays a fraction of it back into the next turn that actually produces
 * output — a real "I've been holding this in" effect built from magnitudes
 * Totemheart already computed, not an invented one.
 */
export class ExpressionDebt {

	constructor() {

		this.debt = 0
		// Suppression cost reservoir: holding a felt state back (Expressive
		// Suppression's `suppressionDrive`) isn't free the instant it happens,
		// the cost is a real drag on later ticks — the everyday observation
		// that "keeping it together" now leaves you more tired for a while, not
		// an invented model. A separate accumulator from `debt` (which is about
		// the SWALLOWED FEELING resurfacing) — this one is about the WORK of
		// holding it back, decays independently.
		this.suppressionCostReservoir = 0

	}

	/** Called at an early-exit point (no text produced) with the swallowed felt magnitude. */
	accumulate( magnitude ) {

		this.debt = clamp01( this.debt + Math.max( 0, magnitude ) * 0.5 )

	}

	decay( dt, lambda = 0.02 ) {

		this.debt = Math.max( 0, this.debt - lambda * dt )
		this.suppressionCostReservoir = Math.max( 0, this.suppressionCostReservoir - lambda * 1.5 * dt )

	}

	/** Pays out `fraction` of the current debt and keeps the rest lingering (gradual catharsis, not a single dump). */
	release( fraction = 0.5 ) {

		const paid   = this.debt * fraction
		this.debt = this.debt - paid
		return paid

	}

	/** Charges the real cost of THIS turn's suppression into the reservoir, to be drained (not paid instantly) over subsequent ticks. */
	chargeSuppressionCost( suppressionDrive ) {

		this.suppressionCostReservoir = clamp01( this.suppressionCostReservoir + Math.max( 0, suppressionDrive ) * 0.3 )

	}

	/** Drains a slice of the outstanding suppression cost this tick — a real DecisionFatigue-facing fatigue amount, not the full reservoir at once. */
	drainSuppressionCost( dt = 1, rate = 0.1 ) {

		const drained = Math.min( this.suppressionCostReservoir, this.suppressionCostReservoir * rate * dt )
		this.suppressionCostReservoir -= drained
		return drained

	}

}
