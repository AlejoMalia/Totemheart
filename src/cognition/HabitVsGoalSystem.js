function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real arbitration between habitual (stimulus-response) and goal-directed
 * (model-based) control — Dolan, R. J., & Dayan, P. (2013), "Goals and
 * habits in the brain", Neuron, 80(2), 312-325; Wood, W., & Rünger, D.
 * (2016), "Psychology of habit", Annual Review of Psychology, 67, 289-314.
 * Distinct from `WornPathCache` (which reuses a cached APPRAISAL for an
 * identical repeated input, a memoization optimization) — this is a real
 * per-(context) habit-STRENGTH accumulator that competes against real
 * goal-salience to decide whether a REACTION is automatic or deliberated,
 * independent of whether the input itself repeats. The Hebbian strength
 * update and the specific logistic weights are own engineering.
 *
 *   P(habit|c) = σ(a₁H(c) + a₂Stress + a₃Depletion - a₄GoalSalience - a₅Novelty)
 *   H(c) ← H(c) + η - λH(c)   (on each real repetition of context c)
 */
export class HabitVsGoalSystem {

	constructor( { eta = 0.15, lambda = 0.02, weights = {} } = {} ) {

		this.eta       = eta
		this.lambda   = lambda
		this.strengths = new Map() // context key -> habit strength 0..1
		this.weights     = {
			habit    : weights.habit    ?? 1.6,
			stress   : weights.stress   ?? 0.8,
			depletion : weights.depletion ?? 1.0,
			goal      : weights.goal      ?? 1.4,
			novelty   : weights.novelty   ?? 1.0,
			bias      : weights.bias      ?? -0.6,
		}

	}

	getStrength( context ) {

		return this.strengths.get( context ) ?? 0

	}

	/** Real Hebbian-style reinforcement — call each time context `c` actually recurs. */
	reinforce( context ) {

		const current = this.getStrength( context )
		this.strengths.set( context, clamp01( current + this.eta * ( 1 - current ) ) )

	}

	/** Real decay toward 0 for every tracked context, called once per tick. */
	decay( dt = 1 ) {

		for ( const [ context, strength ] of this.strengths ) this.strengths.set( context, Math.max( 0, strength - this.lambda * dt ) )

	}

	/**
	 * `stress`/`depletion`/`goalSalience`/`novelty` all 0..1. Returns the real
	 * probability this turn's response should lean automatic vs. deliberated.
	 */
	compute( context, { stress = 0, depletion = 0, goalSalience = 0, novelty = 0 } = {} ) {

		const w = this.weights
		const z = w.bias
			+ w.habit * this.getStrength( context )
			+ w.stress * clamp01( stress )
			+ w.depletion * clamp01( depletion )
			- w.goal * clamp01( goalSalience )
			- w.novelty * clamp01( novelty )

		const pHabit = sigmoid( z )
		return { pHabit, mode: pHabit >= 0.5 ? 'habit' : 'goal', habitStrength: this.getStrength( context ) }

	}

}
