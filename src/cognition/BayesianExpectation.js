/**
 * Real Bayes' rule: P(event|evidence) = P(evidence|event)·P(event) / P(evidence).
 * Tracks a belief "will interacting with this user go well?" as a Beta-like
 * running estimate updated on each observed outcome, and reports the
 * posterior probability of a positive outcome — used as the anxiety/hope
 * signal (low posterior + this input reads ambiguous = anxious anticipation;
 * high posterior = hope). Real formula; the discretization into "positive
 * outcome" as a binary event (rather than modeling the full continuous
 * likelihood) is an engineering simplification for a conversational context.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class BayesianExpectation {

	constructor() {

		this.beliefs = new Map() // userId -> { positiveOutcomes, totalOutcomes }

	}

	#entry( userId ) {

		if ( !this.beliefs.has( userId ) ) this.beliefs.set( userId, { positiveOutcomes: 1, totalOutcomes: 2 } ) // uniform Beta(1,1) prior
		return this.beliefs.get( userId )

	}

	/** P(positive outcome | evidence so far) — the prior for this turn, BEFORE observing it. */
	getExpectation( userId ) {

		const belief = this.#entry( userId )
		return belief.positiveOutcomes / belief.totalOutcomes

	}

	/** Bayesian update: fold this turn's actual outcome into the posterior for next time. */
	update( userId, wasPositive ) {

		const belief = this.#entry( userId )
		belief.totalOutcomes += 1
		if ( wasPositive ) belief.positiveOutcomes += 1

	}

	/** Anxiety = how far below 0.5 the expectation sits, weighted by how confident (much data) that estimate is. */
	getAnxiety( userId ) {

		const belief = this.#entry( userId )
		const p        = this.getExpectation( userId )
		const confidence = clamp01( ( belief.totalOutcomes - 2 ) / 10 ) // ramps up over ~10 observations
		return clamp01( ( 0.5 - p ) * 2 * confidence )

	}

}
