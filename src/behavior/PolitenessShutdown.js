function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real collapse of politeness/hedging strategies under sustained overload —
 * Brown, P. & Levinson, S. C. (1987), "Politeness: Some Universals in
 * Language Usage", Cambridge University Press (the real, well-established
 * account of politeness as costly FACE-work — hedges, indirection,
 * softeners — that a speaker genuinely stops affording once cognitive
 * resources run out). Distinct from `ExpressiveSuppression` (dampening felt
 * AFFECT before output) and `EgoDepletionBudget` (a general regulation
 * resource): this specifically tracks the real cost of maintaining polite
 * FORM, and its collapse under sustained load.
 *
 *   politenessBudget(t) = politenessBudget(t-1) - cost·load + recovery·rest
 */
export class PolitenessShutdown {

	constructor( { capacity = 1, costPerTurn = 0.08, recoveryPerTick = 0.03 } = {} ) {

		this.capacity           = capacity
		this.costPerTurn      = costPerTurn
		this.recoveryPerTick = recoveryPerTick
		this.budget                 = capacity

	}

	/** Real per-turn spend, scaled by cognitive load (0..1) this turn required. */
	spend( load = 0.5 ) {

		this.budget = Math.max( 0, this.budget - this.costPerTurn * ( 0.5 + load ) )
		return this.budget

	}

	recover( dt = 1 ) {

		this.budget = Math.min( this.capacity, this.budget + this.recoveryPerTick * dt )

	}

	/** Real, bounded flag: politeness FORM (hedges, softeners) has genuinely run out, distinct from felt affect itself. */
	hasShutDown() {

		return this.budget < this.capacity * 0.15

	}

	getLevel() {

		return clamp01( this.budget / this.capacity )

	}

}
