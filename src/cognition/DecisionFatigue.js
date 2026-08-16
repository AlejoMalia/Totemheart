function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Counts processed decisions/tokens. Above the threshold the orchestrator
 * enters "shallowMode": deep provider calls (appraisal, ToM, dissonance)
 * are skipped in favor of cheap heuristics and generic responses.
 */
export class DecisionFatigue {

	constructor() {

		this.load = 0

	}

	recordDecision( complexity = 1 ) {

		this.load = clamp01( this.load + 0.05 * complexity )

	}

	decay( dt, lambda = 0.02 ) {

		this.load = Math.max( 0, this.load - lambda * dt )

	}

	getLevel() {

		return this.load

	}

	isShallow( threshold = 0.7 ) {

		return this.load > threshold

	}

}
