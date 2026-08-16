function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A stronger, explicitly-budgeted self-regulation resource, distinct from
 * DecisionFatigue's plain accumulate-and-decay load and from ExpressionDebt's
 * suppression-cost reservoir: this is a real daily-scale BUDGET that
 * regulation acts spend down, checked against a hard floor that changes
 * downstream behavior (raised hijack probability, style collapse) once
 * crossed — not just a smoothly degrading number.
 *
 * Modeled on the strength/resource metaphor of ego depletion (Baumeister,
 * R. F., Bratslavsky, E., Muraven, M., & Tice, D. M. (1998), "Ego depletion:
 * Is the active self a limited resource?", Journal of Personality and Social
 * Psychology, 74(5), 1252-1265) — with an explicit, honest caveat: that
 * theory's specific glucose/resource-depletion mechanism largely failed to
 * replicate in a large registered replication effort (Hagger, M. S., et al.
 * (2016), "A multilab preregistered replication of the ego-depletion
 * effect", Perspectives on Psychological Science, 11(4), 546-573). What's
 * kept here is the qualitatively useful ENGINEERING pattern (a bounded
 * resource that regulation spends and rest restores, with real downstream
 * consequences once low) — not a claim that this models a settled
 * neuroscientific mechanism. See CALIBRATION.md.
 */
export class EgoDepletionBudget {

	constructor( { capacity = 1, regenRate = 0.02, lowThreshold = 0.25 } = {} ) {

		this.capacity      = capacity
		this.regenRate     = regenRate
		this.lowThreshold = lowThreshold
		this.budget            = capacity

	}

	/** Any act of self-regulation (suppression, reappraisal, overriding an immature defense) spends real budget. */
	spend( amount ) {

		this.budget = Math.max( 0, this.budget - Math.max( 0, amount ) )
		return this.budget

	}

	/** Rest/idle time and REM sweeps regenerate the budget — real bounded recovery, never above capacity. */
	regenerate( dt = 1 ) {

		this.budget = Math.min( this.capacity, this.budget + this.regenRate * dt )
		return this.budget

	}

	isDepleted() {

		return this.budget <= this.lowThreshold

	}

	getLevel() {

		return clamp01( this.budget / this.capacity )

	}

	/** Multiplies AmygdalaHijack's effective threshold DOWN as budget runs low — depleted regulation capacity makes a hijack easier to trigger. */
	getHijackThresholdMultiplier() {

		return this.isDepleted() ? 1 - ( 1 - this.getLevel() ) * 0.4 : 1

	}

	/** Reappraisal/mature-defense capacity scales down with depletion — a real gate other modules can multiply their own capacity by. */
	getRegulationCapacity() {

		return this.getLevel()

	}

}
